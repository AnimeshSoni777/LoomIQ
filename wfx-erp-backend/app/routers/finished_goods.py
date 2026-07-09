from typing import Optional
from fastapi import APIRouter, Query
from app.database import get_connection
import psycopg2.extras

router = APIRouter(prefix="/api/finished-goods", tags=["finished_goods"])

SORTABLE_COLUMNS = {
    "style_number", "style_name", "category", "fabric",
    "gsm", "color", "season", "brand", "supplier", "cost", "selling_price",
}


@router.get("")
def list_finished_goods():
    from app.database import run_query
    return run_query("SELECT * FROM finished_goods ORDER BY style_number LIMIT 100;")


@router.get("/search")
def search_finished_goods(
    q: Optional[str] = Query(None, description="Free-text search across name/category/fabric/color/print/brand"),
    category: Optional[str] = None,
    fabric: Optional[str] = None,
    color: Optional[str] = None,
    print_: Optional[str] = Query(None, alias="print"),
    season: Optional[str] = None,
    supplier: Optional[str] = None,
    buyer: Optional[str] = Query(None, description="Filters to goods that appear in an order for this buyer"),
    gsm_min: Optional[int] = None,
    gsm_max: Optional[int] = None,
    sort_by: str = "style_number",
    sort_dir: str = "asc",
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
):
    if sort_by not in SORTABLE_COLUMNS:
        sort_by = "style_number"
    sort_dir = "DESC" if sort_dir.lower() == "desc" else "ASC"

    conditions = []
    params = []

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

    # Lightweight free-text search: every word in q must appear somewhere
    # across the searchable columns. This is our Postgres-based stand-in
    # for the doc's mandatory "text search" (e.g. "blue floral dress"),
    # avoiding a separate Typesense server.
    if q:
        for word in q.split():
            conditions.append(
                "(fg.style_name ILIKE %s OR fg.category ILIKE %s OR fg.fabric ILIKE %s "
                "OR fg.color ILIKE %s OR fg.print ILIKE %s OR fg.brand ILIKE %s)"
            )
            like_word = f"%{word}%"
            params.extend([like_word] * 6)

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    offset = (page - 1) * page_size

    count_query = f"SELECT COUNT(*) AS total FROM finished_goods fg {where_clause};"
    data_query = f"""
        SELECT fg.* FROM finished_goods fg
        {where_clause}
        ORDER BY fg.{sort_by} {sort_dir}
        LIMIT %s OFFSET %s;
    """

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
        "total_pages": (total_count + page_size - 1) // page_size,
    }