from fastapi import APIRouter
from app.database import run_query

router = APIRouter(prefix="/api/tech-packs", tags=["tech_packs"])


@router.get("")
def list_tech_packs():
    query = "SELECT * FROM tech_packs ORDER BY tech_pack_id LIMIT 100;"
    return run_query(query)