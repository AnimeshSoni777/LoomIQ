import os
import io
import requests
import typesense
from PIL import Image
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from app.database import run_query

load_dotenv()

# 1. Connect to your Typesense Cloud Cluster
print("Connecting to Typesense Cloud...")
ts_client = typesense.Client({
    'nodes': [{
        'host': os.getenv("TYPESENSE_HOST"),
        'port': os.getenv("TYPESENSE_PORT"),
        'protocol': os.getenv("TYPESENSE_PROTOCOL")
    }],
    'api_key': os.getenv("TYPESENSE_API_KEY"),
    'connection_timeout_seconds': 10
})

# 2. Define the Vector Schema
schema_layout = {
    'name': 'finished_goods',
    'fields': [
        {'name': 'style_number', 'type': 'string'},
        {'name': 'style_name', 'type': 'string'},
        {'name': 'category', 'type': 'string', 'facet': True},
        {'name': 'fabric', 'type': 'string', 'facet': True},
        {'name': 'season', 'type': 'string', 'facet': True},
        {'name': 'supplier', 'type': 'string', 'facet': True},
        {'name': 'cost', 'type': 'float'},
        {'name': 'selling_price', 'type': 'float'},
        {'name': 'image_url', 'type': 'string'},
        {
            'name': 'vec_embedding',
            'type': 'float[]',
            'num_dim': 512, # CLIP model output size
            'model_config': {'vector_index_type': 'hnsw'}
        }
    ]
}

# Clear the old collection if it exists, then create the new one
try:
    ts_client.collections['finished_goods'].delete()
except:
    pass

ts_client.collections.create(schema_layout)
print("Collection schema created successfully in Typesense!")

# 3. Load the AI Model
print("Loading CLIP Model (this takes a moment)...")
encoder = SentenceTransformer('clip-ViT-B-32')

# 4. Fetch your database records
print("Fetching inventory from PostgreSQL...")
garment_rows = run_query("SELECT style_number, style_name, category, fabric, season, supplier, cost, selling_price, image_url FROM finished_goods")

print(f"Beginning upload of {len(garment_rows)} items...")
for idx, row in enumerate(garment_rows):
    try:
        url_link = row.get("image_url")
        
        # If there's an image, vectorize the image. Otherwise, vectorize the text.
        if url_link and (url_link.startswith("http://") or url_link.startswith("https://")):
            img_res = requests.get(url_link, timeout=5)
            pil_img = Image.open(io.BytesIO(img_res.content))
            feature_vector = encoder.encode(pil_img).tolist()
        else:
            synthetic_prompt = f"Garment item: {row['style_name']} {row['category']} matching fabric {row['fabric']}"
            feature_vector = encoder.encode(synthetic_prompt).tolist()

        document_payload = {
            "style_number": str(row["style_number"]),
            "style_name": str(row["style_name"] or "Unnamed Style"),
            "category": str(row["category"] or "Catalog Asset"),
            "fabric": str(row["fabric"] or "Standard Blend"),
            "season": str(row["season"] or "Continuous"),
            "supplier": str(row["supplier"] or "Sourcing Plant Unassigned"),
            "cost": float(row["cost"] or 0.0),
            "selling_price": float(row["selling_price"] or 0.0),
            "image_url": str(url_link or ""),
            "vec_embedding": feature_vector
        }
        
        ts_client.collections['finished_goods'].documents.create(document_payload)
        print(f"[{idx+1}/{len(garment_rows)}] Indexed: {row['style_number']}")
        
    except Exception as error:
        print(f"Skipped {row.get('style_number')} due to error: {str(error)}")

print("🎉 Complete! All vectors are now live in Typesense Cloud.")