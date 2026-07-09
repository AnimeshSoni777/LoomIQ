import os
import io
import requests
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from typing import Optional
from PIL import Image
import typesense

router = APIRouter(prefix="/api/image-search", tags=["image_search"])

RUN_MODE = os.getenv("RUN_MODE", "local").lower()
HF_TOKEN = os.getenv("HF_TOKEN", "")

if RUN_MODE == "local":
    print("LOG: Local Development Mode. Loading OpenCLIP model into memory...")
    from sentence_transformers import SentenceTransformer
    clip_model = SentenceTransformer('clip-ViT-B-32')
else:
    print("LOG: Cloud Deployment Mode. Memory-heavy libraries bypassed.")
    clip_model = None

ts_client = typesense.Client({
    'nodes': [{
        'host': os.getenv("TYPESENSE_HOST"),
        'port': os.getenv("TYPESENSE_PORT"),
        'protocol': os.getenv("TYPESENSE_PROTOCOL")
    }],
    'api_key': os.getenv("TYPESENSE_API_KEY"),
    'connection_timeout_seconds': 5
})

def get_vector_via_api(content_bytes: bytes, is_image: bool = True, text_prompt: str = None) -> list:
    """Lightweight cloud fallback: Vectorizes input without using local server RAM."""
    model_id = "sentence-transformers/clip-ViT-B-32"
    api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}
    
    if is_image:
        response = requests.post(api_url, headers=headers, data=content_bytes, timeout=10)
    else:
        response = requests.post(api_url, headers=headers, json={"inputs": text_prompt}, timeout=10)
        
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Vectorizer API was sleeping or rate-limited. Please retry in a moment.")
        
    res = response.json()
    if isinstance(res, list) and len(res) > 0 and isinstance(res[0], list):
        return res[0]
    return res

@router.post("")
async def search_visual_assets(
    query_text: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None)
):
    if not query_text and not image_file:
        raise HTTPException(status_code=400, detail="Please provide either a search phrase or an image file.")

    search_vector = []

    try:
        if image_file:
            img_bytes = await image_file.read()
            if RUN_MODE == "local" and clip_model:
                img = Image.open(io.BytesIO(img_bytes))
                search_vector = clip_model.encode(img).tolist()
            else:
                search_vector = get_vector_via_api(img_bytes, is_image=True)
                
        elif query_text:
            if RUN_MODE == "local" and clip_model:
                search_vector = clip_model.encode(query_text).tolist()
            else:
                search_vector = get_vector_via_api(b"", is_image=False, text_prompt=query_text)

        search_payload = {
            'searches': [
                {
                    'collection': 'finished_goods',
                    'q': '*',
                    'vector_query': f'vec_embedding:({search_vector}, k:8)'
                }
            ]
        }
        
        raw_results = ts_client.multi_search.perform(search_payload, {})
        hits = raw_results['results'][0].get('hits', [])
        
        formatted_items = []
        for hit in hits:
            doc = hit['document']
            dist = hit['vector_distance']
            # Calculate a user-friendly match score percentage
            doc['match_score'] = round((1 - dist) * 100, 1) if dist < 1 else 0.0
            formatted_items.append(doc)

        return {"items": formatted_items}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search execution anomaly: {str(e)}")