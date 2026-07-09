import os
from typing import Optional
from fastapi import APIRouter, Query
from app.database import get_connection
import psycopg2.extras
import typesense
import requests

router = APIRouter(prefix="/api/finished-goods", tags=["finished_goods"])

# Connect to Typesense Cloud Cluster
ts_client = typesense.Client({
    'nodes': [{
        'host': os.getenv("TYPESENSE_HOST"),
        'port': os.getenv("TYPESENSE_PORT"),
        'protocol': os.getenv("TYPESENSE_PROTOCOL")
    }],
    'api_key': os.getenv("TYPESENSE_API_KEY"),
    'connection_timeout_seconds': 5
})

HF_TOKEN = os.getenv("HF_TOKEN", "")

def get_vector_via_api(text_prompt: str) -> list:
    model_id = "sentence-transformers/clip-ViT-B-32"
    api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_id}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}
    response = requests.post(api_url, headers=headers, json={"inputs": text_prompt}, timeout=10)
    if response.status_code != 200:
        return []
    res = response.json()
    return res[0] if isinstance(res, list) and isinstance(res[0], list) else res

@router.get("/search")
def search_finished_goods(
    q: Optional[str] = Query(None),
    category: Optional[str] = None,
    fabric: Optional[str] = None,
    color: Optional[str] = None,
    print_: Optional[str] = Query(None, alias="print"),
    season: Optional[str] = None,
    supplier: Optional[str] = None,
    buyer: Optional[str] = Query(None),
    gsm_min: Optional[int] = None,
    gsm_max: Optional[int] = None,
    sort_by: str = Query("selling_price"), # Default sort
    sort_dir: str = Query("asc"),          # Default direction
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
):
    style_numbers_from_vector = []
    
    # 1. VECTOR SEARCH FOR NATURAL LANGUAGE QUERIES
    if q:
        try:
            from app.routers.image_search import get_clip_model
            active_model = get_clip_model()
            
            if active_model:
                search_vector = active_model.encode(q).tolist()
            else:
                search_vector = get_vector_via_api(q)
        except Exception as e:
            print(f"Fallback to API due to error: {e}")
            search_vector = get_vector_via_api(q)

        if search_vector:
            search_payload = {
                'searches': [{
                    'collection': 'finished_goods',
                    'q': '*',
                    'vector_query': f'vec_embedding:({search_vector}, k:100)'
                }]
            }
            res = ts_client.multi_search.perform(search_payload, {})
            hits = res['results'][0].get('hits', [])
            style_numbers_from_vector = [hit['document']['style_number'] for hit in hits]

    # 2. SQL QUERY BUILDER (Now with all filters & sorting active!)
    conditions = []
    params = []

    if q and style_numbers_from_vector:
        conditions.append("fg.style_number IN %s")
        params.append(tuple(style_numbers_from_vector))
    elif q:
        conditions.append("(fg.style_name ILIKE %s OR fg.category ILIKE %s)")
        like_word = f"%{q}%"
        params.extend([like_word, like_word])

    if category:
        conditions.append("fg.category ILIKE %s")
        params.append(f"%{category}%")
    if fabric:
        conditions.append("fg.fabric ILIKE %s")
        params.append(f"%{fabric}%")
    if color:
        conditions.append("fg.color ILIKE %s")
        params.append(f"%{color}%")
    if print_:
        conditions.append("fg.print ILIKE %s")
        params.append(f"%{print_}%")
    if season:
        conditions.append("fg.season ILIKE %s")
        params.append(f"%{season}%")
    if supplier:
        conditions.append("fg.supplier ILIKE %s")
        params.append(f"%{supplier}%")
    if gsm_min is not None:
        conditions.append("fg.gsm >= %s")
        params.append(gsm_min)
    if gsm_max is not None:
        conditions.append("fg.gsm <= %s")
        params.append(gsm_max)
    if buyer:
        conditions.append(
            "EXISTS (SELECT 1 FROM sales_orders so "
            "WHERE so.style_number = fg.style_number AND so.buyer ILIKE %s)"
        )
        params.append(f"%{buyer}%")

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    
    # 3. SECURE SORTING LOGIC
    allowed_sort_columns = {"style_number", "selling_price", "gsm", "cost"}
    safe_sort_by = sort_by if sort_by in allowed_sort_columns else "selling_price"
    safe_sort_dir = "DESC" if sort_dir.lower() == "desc" else "ASC"
    order_clause = f"ORDER BY fg.{safe_sort_by} {safe_sort_dir}"

    offset = (page - 1) * page_size

    count_query = f"SELECT COUNT(*) AS total FROM finished_goods fg {where_clause};"
    data_query = f"SELECT fg.* FROM finished_goods fg {where_clause} {order_clause} LIMIT %s OFFSET %s;"

    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(count_query, params)
            total_count = cur.fetchone()["total"]

            cur.execute(data_query, params + [page_size, offset])
            rows = [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()

    return {
        "items": rows,
        "page": page,
        "page_size": page_size,
        "total_count": total_count,
        "total_pages": (total_count + page_size - 1) // page_size if total_count > 0 else 1,
    }