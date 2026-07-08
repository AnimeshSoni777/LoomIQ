from fastapi import APIRouter
from app.database import get_connection
import psycopg2.extras

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def dashboard_stats():
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT COUNT(*) AS count FROM finished_goods;")
            total_finished_goods = cur.fetchone()["count"]

            cur.execute("SELECT COUNT(*) AS count FROM suppliers;")
            total_suppliers = cur.fetchone()["count"]

            cur.execute("SELECT COUNT(*) AS count FROM buyers;")
            total_buyers = cur.fetchone()["count"]

            cur.execute("SELECT COUNT(*) AS count FROM sales_orders;")
            total_orders = cur.fetchone()["count"]

            # Revenue is broken down by currency rather than summed into one
            # number — sales_invoices.currency has multiple distinct values
            # (USD, EUR, GBP, INR); a blended SUM(amount) would silently mix
            # currencies into a meaningless total.
            cur.execute(
                "SELECT currency, SUM(amount) AS total "
                "FROM sales_invoices GROUP BY currency ORDER BY currency;"
            )
            revenue_by_currency = {
                row["currency"]: float(row["total"]) for row in cur.fetchall()
            }
    finally:
        conn.close()

    return {
        "total_finished_goods": total_finished_goods,
        "total_suppliers": total_suppliers,
        "total_buyers": total_buyers,
        "total_orders": total_orders,
        "total_revenue_by_currency": revenue_by_currency,
    }