<p align="left">
  <img
    src="https://github.com/user-attachments/assets/3f15abeb-b25a-40e9-838d-8730bb03baeb"
    alt="LoomIQ Logo"
    width="90"
    align="left"
  />

  <h1>LoomIQ</h1>

  <p>
    AI-powered ERP exploration platform for the apparel sourcing industry.
  </p>
</p>

<br clear="left"/>
  <p>
    An AI-powered ERP exploration platform for the apparel sourcing industry that enables
    intelligent business data discovery through Natural Language to SQL, semantic product
    search, visual similarity search, and interactive analytics. Built with FastAPI, React,
    Supabase PostgreSQL, Typesense, and modern AI technologies.
  </p>
</p>

<br clear="left"/>

<p align="center">

<img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white"/>

<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>

<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>

<img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>

<img src="https://img.shields.io/badge/Vanna-AI%20Agent-6E56CF?style=for-the-badge"/>

<img src="https://img.shields.io/badge/OpenRouter-Gemini%202.5%20Flash-8A2BE2?style=for-the-badge"/>

<img src="https://img.shields.io/badge/Typesense-Vector%20Search-F97316?style=for-the-badge"/>

<img src="https://img.shields.io/badge/Railway-Backend-0B0D0E?style=for-the-badge&logo=railway&logoColor=white"/>

<img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel"/>

</p>

---

# Overview

LoomIQ is an AI-native ERP exploration system for the apparel sourcing and merchandising industry. It combines structured ERP data with LLMs and semantic search so business users can explore data conversationally instead of writing SQL or manually browsing thousands of records.

The backend exposes REST APIs via FastAPI; the frontend is a React dashboard for analytics, catalog exploration, NL querying, and product discovery. Supabase PostgreSQL is the primary datastore, Typesense powers vector search, and a Vanna AI agent orchestrates Natural Language → SQL using Gemini 2.5 Flash through OpenRouter.

Every major capability — analytics, search, AI query generation, catalog browsing, image search — is built as an independent service, keeping the app modular and easy to extend.

---

# Key Features

- **AI-Powered Natural Language Query** — ask business questions in plain English ("Show all suppliers from India", "List pending sales orders") and get structured ERP results, no SQL required.
- **Intelligent SQL Generation** — a Vanna AI agent configured with the full ERP schema translates questions into optimized, read-only PostgreSQL queries.
- **Advanced Product Search** — filter Finished Goods by category, fabric, color, print, season, supplier, buyer, GSM range, with sorting and pagination.
- **Semantic Product Discovery** — queries are embedded via CLIP and matched through Typesense vector search for meaning-based (not just keyword) retrieval.
- **Image Similarity Search** — upload a garment image or description to find visually similar catalog products via CLIP embeddings.
- **Interactive Analytics Dashboard** — real-time metrics: Finished Goods, Suppliers, Buyers, Sales Orders, Revenue Distribution, Category/Supplier/Buyer distribution, Order Status.
- **Finished Goods Explorer** — full catalog browsing with Style Number, Name, Brand, Category, Fabric, GSM, Color, Print, Supplier, Cost, Price, Image.
- **RESTful Backend APIs** for Dashboard, Buyers, Suppliers, Finished Goods, Tech Packs, Sales Orders, Sales Invoices, Image Search, and NL Query.
- **Modern Frontend** — Dashboard, NL Query Workspace, Product Search, Image Search, and Finished Goods Explorer as modular React views.

---

# System Architecture

<p align="center">

<img width="1536" height="1024" alt="ChatGPT Image Jul 14, 2026, 11_10_46 PM" src="https://github.com/user-attachments/assets/67a8c683-15a0-4fd6-b0db-ab73aa1c0a01" />

</p>

The React frontend talks to FastAPI over REST. Business data lives in Supabase PostgreSQL; Typesense indexes vector embeddings for semantic retrieval. Natural language requests go through the Vanna AI agent, which uses Gemini 2.5 Flash (via OpenRouter) to generate optimized PostgreSQL queries that are then securely executed against the database.

---

# How It Works

## 1. Dashboard Analytics
Aggregates operational data across entities — Finished Goods, Suppliers, Buyers, Sales Orders, Revenue by currency, category/supplier/buyer distribution, and order status — into metrics ready for charts, without exposing raw records.

<p align="center"><img width="1918" height="1078" alt="Screenshot 2026-07-14 233821" src="https://github.com/user-attachments/assets/6994c03d-3501-4b69-bb27-15cc19b57d30" />
</p>

## 2. Natural Language Query
Users ask business questions ("Show all suppliers located in India", "Which supplier has the highest rating?") in plain English. Every request is interpreted dynamically against the live schema and business context rather than matched to fixed templates.

<p align="center"><img width="1918" height="1078" alt="Screenshot 2026-07-14 234156" src="https://github.com/user-attachments/assets/ce62afb2-319a-4a00-90c2-a70b71da9eee" />
</p>

## 3. AI SQL Generation
A Vanna AI agent is given the full PostgreSQL schema, business rules, table relationships, and the user's request, then generates an optimized `SELECT` query via Gemini 2.5 Flash. System instructions enforce read-only access — no INSERT/UPDATE/DELETE/schema changes, and only existing tables/columns may be referenced. Results are returned with a concise AI-generated summary instead of raw SQL output.

## 4. Product Search
Structured filtering (category, fabric, color, print, season, supplier, buyer, GSM range) combinable with semantic search, sortable by price, cost, GSM, or style number, with DB-level pagination for large datasets.

<p align="center"><img width="1918" height="1077" alt="Screenshot 2026-07-14 234012" src="https://github.com/user-attachments/assets/89ef9ec1-c254-4886-9121-dd5dd1b3e857" />
</p>

## 5. Semantic Search
Descriptive phrases ("blue floral summer dress") are converted into CLIP embeddings and matched against vectors stored in Typesense, retrieving products by meaning even when exact keywords differ. Matched IDs are then resolved against PostgreSQL for full records.

## 6. Image Search
Users upload a garment image or enter a description. Embeddings are generated via CLIP — either locally (SentenceTransformers) or through the Hugging Face Inference API — and Typesense's approximate nearest-neighbor search returns visually similar products.

<p align="center"><img width="1918" height="1078" alt="Screenshot 2026-07-14 234054" src="https://github.com/user-attachments/assets/3da467bd-6ccd-479c-8009-3bc26f714a52" />
</p>

## 7. Finished Goods Explorer
Full catalog browsing with detailed product cards (Style Number, Name, Category, Brand, Fabric, GSM, Color, Print, Supplier, Cost, Price, Image), separate from filtered search — focused on comprehensive inspection with paginated navigation.

<p align="center"><img width="1918" height="1078" alt="Screenshot 2026-07-14 234211" src="https://github.com/user-attachments/assets/1d7942f6-3f8f-421c-91ba-832a7c14827e" />
</p>

## 8. Backend Services

| Module | Responsibility |
|----------|----------------|
| Dashboard | Business analytics and aggregated metrics |
| Natural Language Query | AI-powered SQL generation |
| Finished Goods | Catalog exploration and search |
| Image Search | CLIP-based visual retrieval |
| Buyers | Buyer information |
| Suppliers | Supplier information |
| Sales Orders | Order records |
| Sales Invoices | Invoice records |
| Tech Packs | Technical garment specifications |

---

# Technology Stack

| Category | Technology |
|------------|------------|
| Programming Language | Python, JavaScript |
| Backend Framework | FastAPI |
| Frontend Framework | React + Vite |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |
| ORM / Database Driver | Psycopg2 |
| AI SQL Agent | Vanna AI |
| Large Language Model | Gemini 2.5 Flash (OpenRouter) |
| Semantic Search | Typesense |
| Image Embedding Model | CLIP (SentenceTransformers) |
| Cloud Vectorization | Hugging Face Inference API |
| Image Processing | Pillow |
| API Documentation | Swagger UI & ReDoc |
| Backend Deployment | Railway |
| Frontend Deployment | Vercel |

---

# Project Structure

```text
loomiq-erp-ai-platform
│
├── backend
│   ├── app
│   │   ├── nl2sql
│   │   │   ├── agent_factory.py
│   │   │   └── schema_prompt.py
│   │   │
│   │   ├── routers
│   │   │   ├── dashboard.py
│   │   │   ├── buyers.py
│   │   │   ├── suppliers.py
│   │   │   ├── finished_goods.py
│   │   │   ├── sales_orders.py
│   │   │   ├── sales_invoices.py
│   │   │   ├── tech_packs.py
│   │   │   ├── image_search.py
│   │   │   └── nl_query.py
│   │   │
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── indexer.py
│   ├── requirements.txt
│   └── .env
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── devtools
│   │   ├── pages
│   │   └── lib
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── main.jsx
│   ├──index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md
```

---

# Database Overview

## Buyers

| Column | Description |
|----------|-------------|
| buyer_id | Unique buyer identifier |
| company_name | Buyer organization |
| country | Buyer location |
| buyer_category | Business classification |

## Suppliers

| Column | Description |
|----------|-------------|
| supplier_id | Unique supplier identifier |
| company_name | Supplier name |
| country | Supplier location |
| contact | Contact details |
| lead_time_days | Estimated lead time |
| rating | Supplier rating |

## Finished Goods

| Column | Description |
|----------|-------------|
| style_number | Primary identifier |
| style_name | Product name |
| category | Apparel category |
| fabric | Fabric composition |
| gsm | Fabric weight |
| color | Product color |
| print | Print pattern |
| season | Season |
| brand | Brand |
| supplier | Supplier |
| cost | Manufacturing cost |
| selling_price | Selling price |
| image_url | Product image |

## Sales Orders

| Column | Description |
|----------|-------------|
| order_number | Order ID |
| buyer | Buyer |
| style_number | Product |
| quantity | Ordered quantity |
| unit_price | Unit cost |
| shipment_date | Planned shipment |
| status | Current order status |

## Sales Invoices

| Column | Description |
|----------|-------------|
| invoice_number | Invoice ID |
| sales_order | Associated order |
| amount | Invoice amount |
| currency | Billing currency |
| payment_status | Payment status |

## Tech Packs

| Column | Description |
|----------|-------------|
| tech_pack_id | Technical document |
| style_number | Associated style |
| fabric_details | Fabric specification |
| construction | Construction details |
| wash_instructions | Care instructions |

---

# REST API

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Dashboard | GET | `/api/dashboard/stats` | Business analytics |
| Buyers | GET | `/api/buyers` | Buyer records |
| Suppliers | GET | `/api/suppliers` | Supplier records |
| Finished Goods | GET | `/api/finished-goods/search` | Catalog search |
| Sales Orders | GET | `/api/sales-orders` | Order records |
| Sales Invoices | GET | `/api/sales-invoices` | Invoice records |
| Tech Packs | GET | `/api/tech-packs` | Tech pack records |
| Image Search | POST | `/api/image-search` | Visual similarity search |
| NL Query | POST | `/api/nl-query` | AI-powered SQL generation |

Interactive docs are auto-generated by FastAPI:

| Documentation | URL |
|---------------|-----|
| Swagger UI | `/api/docs` |
| ReDoc | `/api/redoc` |

---

# Installation

## Prerequisites

| Software | Version |
|------------|----------|
| Python | 3.11 or later |
| Node.js | 18 or later |
| npm | Latest |
| Git | Latest |
| Supabase Project | Required |
| Railway Account | Backend Deployment |
| Vercel Account | Frontend Deployment |

## Clone

```bash
git clone https://github.com/<your-username>/loomiq-erp-ai-platform.git
cd loomiq-erp-ai-platform
```

## Backend Setup

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=

OPENROUTER_API_KEY=

TYPESENSE_API_KEY=
TYPESENSE_HOST=
TYPESENSE_PORT=
TYPESENSE_PROTOCOL=

HF_TOKEN=

RUN_MODE=local
```

Run:

```bash
uvicorn app.main:app --reload
```

Backend: `http://localhost:8000` · Docs: `http://localhost:8000/api/docs`

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

App: `http://localhost:5173`

---

# Deployment

## Backend (Railway)

Set the same environment variables as above with `RUN_MODE=cloud`, then:

1. Push the backend code to GitHub.
2. Create a new Railway project and connect the repo.
3. Configure environment variables.
4. Railway installs dependencies and deploys automatically.
5. Verify at `https://your-backend.up.railway.app/api/docs`.

## Frontend (Vercel)

1. Import the frontend repo into Vercel.
2. Set `VITE_API_BASE_URL=https://your-backend.up.railway.app`.
3. Build with `npm run build` and deploy.

---

# Security

- Database credentials loaded from environment variables; API keys never hardcoded.
- Frontend never talks to the database directly — all access goes through backend APIs.
- NL-to-SQL requests are restricted to read-only (`SELECT`) operations, constrained by a predefined schema prompt.
- Sensitive infrastructure configuration stays outside version control.

---

# Performance Considerations

- Server-side pagination and SQL filtering reduce database load and data transfer.
- Typesense enables high-speed semantic retrieval.
- CLIP model initialization is lazy-loaded; Hugging Face Inference API offers a lightweight alternative to local embeddings.
- Modular FastAPI routers keep the codebase easy to maintain and scale.

---

# Future Improvements

- Authentication and Role-Based Access Control
- Conversational multi-turn AI assistant
- Advanced dashboard customization
- CSV and Excel export
- Inventory forecasting
- Supplier recommendation engine
- Order anomaly detection
- Product recommendation system
- Real-time notifications
- ERP workflow automation

---

# Author

<p align="center">

## **Animesh Soni**

</p>

---

<p align="center">
</p>