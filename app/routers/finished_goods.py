from fastapi import APIRouter
from app.database import run_query

router = APIRouter(prefix="/api/finished-goods", tags=["finished_goods"])


@router.get("")
def list_finished_goods():
    query = "SELECT * FROM finished_goods ORDER BY style_number LIMIT 100;"
    return run_query(query)