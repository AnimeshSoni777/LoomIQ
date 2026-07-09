from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    suppliers, buyers, finished_goods, tech_packs,
    sales_orders, sales_invoices, nl_query, dashboard, image_search,
)

app = FastAPI(
    title="WFX ERP Backend",
    docs_url="/api/docs",  
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(suppliers.router)
app.include_router(buyers.router)
app.include_router(finished_goods.router)
app.include_router(tech_packs.router)
app.include_router(sales_orders.router)
app.include_router(sales_invoices.router)
app.include_router(nl_query.router)
app.include_router(dashboard.router)
app.include_router(image_search.router)


@app.get("/")
def read_root():
    return {"message": "ERP Backend Live"}