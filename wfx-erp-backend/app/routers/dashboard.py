from fastapi import APIRouter
from app.database import get_connection
import psycopg2.extras

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def dashboard_stats():
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # 1. Base Core Counts
            cur.execute("SELECT COUNT(*) AS count FROM finished_goods;")
            total_finished_goods = cur.fetchone()["count"]

            cur.execute("SELECT COUNT(*) AS count FROM suppliers;")
            total_suppliers = cur.fetchone()["count"]

            cur.execute("SELECT COUNT(*) AS count FROM buyers;")
            total_buyers = cur.fetchone()["count"]

            cur.execute("SELECT COUNT(*) AS count FROM sales_orders;")
            total_orders = cur.fetchone()["count"]

            # 2. Revenue Breakdown by Currency
            cur.execute(
                "SELECT currency, SUM(amount) AS total "
                "FROM sales_invoices GROUP BY currency ORDER BY currency;"
            )
            revenue_by_currency = {
                row["currency"]: float(row["total"]) for row in cur.fetchall()
            }

            # 3. Finished Goods Distributed by Category (Differentiating Factor)
            cur.execute(
                "SELECT category, COUNT(*) AS volume FROM finished_goods "
                "GROUP BY category ORDER BY volume DESC;"
            )
            goods_by_category = [
                {"name": row["category"] if row["category"] else "Unknown", "value": int(row["volume"])}
                for row in cur.fetchall()
            ]

            # 4. Suppliers Distributed by Style Contribution Volume
            cur.execute(
                "SELECT supplier, COUNT(*) AS volume FROM finished_goods "
                "WHERE supplier IS NOT NULL AND supplier != '' "
                "GROUP BY supplier ORDER BY volume DESC LIMIT 8;"
            )
            suppliers_distribution = [
                {"name": row["supplier"], "value": int(row["volume"])}
                for row in cur.fetchall()
            ]

            # 5. Buyers Distributed by Cumulative Purchased Quantity
            cur.execute(
                "SELECT buyer, SUM(quantity) AS total_qty FROM sales_orders "
                "WHERE buyer IS NOT NULL AND buyer != '' "
                "GROUP BY buyer ORDER BY total_qty DESC LIMIT 8;"
            )
            buyers_distribution = [
                {"name": row["buyer"], "value": int(row["total_qty"])}
                for row in cur.fetchall()
            ]

            # 6. Orders Distributed by Operational Pipeline Status
            cur.execute(
                "SELECT status, COUNT(*) AS volume FROM sales_orders "
                "GROUP BY status ORDER BY volume DESC;"
            )
            orders_distribution = [
                {"name": row["status"] if row["status"] else "Unassigned", "value": int(row["volume"])}
                for row in cur.fetchall()
            ]

    finally:
        conn.close()

    return {
        "total_finished_goods": total_finished_goods,
        "total_suppliers": total_suppliers,
        "total_buyers": total_buyers,
        "total_orders": total_orders,
        "total_revenue_by_currency": revenue_by_currency,
        "distribution_goods_category": goods_by_category,
        "distribution_suppliers": suppliers_distribution,
        "distribution_buyers": buyers_distribution,
        "distribution_orders": orders_distribution,
    }
