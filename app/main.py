from fastapi import FastAPI
from app.routers import (
    suppliers,
    buyers,
    finished_goods,
    tech_packs,
    sales_orders,
    sales_invoices,
)

app = FastAPI(
    title="WFX ERP Backend",
    docs_url="/api/docs",  
    redoc_url="/api/redoc"
)

app.include_router(suppliers.router)
app.include_router(buyers.router)
app.include_router(finished_goods.router)
app.include_router(tech_packs.router)
app.include_router(sales_orders.router)
app.include_router(sales_invoices.router)


@app.get("/")
def read_root():
    return {"message": "ERP Backend Live"}