import os
import io
import requests
from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from typing import Optional
from PIL import Image
import typesense
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

router = APIRouter(prefix="/api/image-search", tags=["image_search"])

RUN_MODE = os.getenv("RUN_MODE", "local").lower()
HF_TOKEN = os.getenv("HF_TOKEN", "")

# --- LAZY LOADING LOGIC START ---
_clip_model_cache = None

def get_clip_model():
    """Lazy loader: Returns the local model if in local mode, otherwise returns None for cloud mode."""
    global _clip_model_cache
    
    if RUN_MODE == "local":
        if _clip_model_cache is None:
            print("⚡ First time calling AI: Loading OpenCLIP weights into memory...")
            from sentence_transformers import SentenceTransformer
            _clip_model_cache = SentenceTransformer('clip-ViT-B-32')
        return _clip_model_cache
    
    # Explicitly handle cloud mode
    if RUN_MODE == "cloud":
        print("☁️ Running in Cloud Mode: Skipping local model load.")
        return None
        
    return None
# --- LAZY LOADING LOGIC END ---

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
    model_id = "sentence-transformers/clip-ViT-B-32"
    api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}
    
    # ⚡ Added Retry Logic to handle temporary DNS failures
    session = requests.Session()
    retry = Retry(connect=3, backoff_factor=1.0)
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    
    try:
        if is_image:
            response = session.post(api_url, headers=headers, data=content_bytes, timeout=15)
        else:
            response = session.post(api_url, headers=headers, json={"inputs": text_prompt}, timeout=15)
        
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail=f"HuggingFace error: {response.text}")
            
        res = response.json()
        return res[0] if isinstance(res, list) else res
        
    except requests.exceptions.ConnectionError:
        # Final fallback if DNS still fails
        raise HTTPException(status_code=503, detail="Cloud Vectorizer unreachable. DNS resolution failed. Please try again.")

@router.post("")
async def search_visual_assets(
    query_text: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None)
):
    if not query_text and not image_file:
        raise HTTPException(status_code=400, detail="Please provide either a search phrase or an image file.")

    search_vector = []
    
    # ⚡ Get the model ONLY when the route is actually called
    active_model = get_clip_model()

    try:
        # 1. Convert user's uploaded image file into a vector
        if image_file:
            img_bytes = await image_file.read()
            if RUN_MODE == "local" and active_model:
                img = Image.open(io.BytesIO(img_bytes))
                search_vector = active_model.encode(img).tolist()
            else:
                search_vector = get_vector_via_api(img_bytes, is_image=True)
                
        # 2. Convert user's plain text query into a vector
        elif query_text:
            if RUN_MODE == "local" and active_model:
                search_vector = active_model.encode(query_text).tolist()
            else:
                search_vector = get_vector_via_api(b"", is_image=False, text_prompt=query_text)

        # 3. Query Typesense Cloud using Vector Search
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
            doc['match_score'] = round((1 - dist) * 100, 1) if dist < 1 else 0.0
            formatted_items.append(doc)

        return {"items": formatted_items}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search execution anomaly: {str(e)}")