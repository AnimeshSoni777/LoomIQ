from fastapi import APIRouter
from app.database import run_query

router = APIRouter(prefix="/api/suppliers", tags=["suppliers"])


@router.get("")
def list_suppliers():
    query = "SELECT * FROM suppliers ORDER BY supplier_id LIMIT 100;"
    return run_query(query)