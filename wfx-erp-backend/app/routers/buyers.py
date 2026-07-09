from fastapi import APIRouter
from app.database import run_query

router = APIRouter(prefix="/api/buyers", tags=["buyers"])


@router.get("")
def list_buyers():
    query = "SELECT * FROM buyers ORDER BY buyer_id LIMIT 100;"
    return run_query(query)