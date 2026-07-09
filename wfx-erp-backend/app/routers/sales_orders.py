from fastapi import APIRouter
from app.database import run_query

router = APIRouter(prefix="/api/sales-orders", tags=["sales_orders"])


@router.get("")
def list_sales_orders():
    query = "SELECT * FROM sales_orders ORDER BY order_number LIMIT 100;"
    return run_query(query)