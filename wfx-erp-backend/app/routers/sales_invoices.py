from fastapi import APIRouter
from app.database import run_query

router = APIRouter(prefix="/api/sales-invoices", tags=["sales_invoices"])


@router.get("")
def list_sales_invoices():
    query = "SELECT * FROM sales_invoices ORDER BY invoice_number LIMIT 100;"
    return run_query(query)