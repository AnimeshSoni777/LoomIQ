from typing import List, Dict, Any
from vanna.core.system_prompt import SystemPromptBuilder
from vanna.core.user import User

DATABASE_SCHEMA_DDL = """
CREATE TABLE suppliers (
    supplier_id VARCHAR PRIMARY KEY,
    company_name VARCHAR,
    country VARCHAR,
    contact VARCHAR,
    lead_time_days INT,
    rating DECIMAL
);

CREATE TABLE buyers (
    buyer_id VARCHAR PRIMARY KEY,
    company_name VARCHAR,
    country VARCHAR,
    buyer_category VARCHAR
);

CREATE TABLE finished_goods (
    style_number VARCHAR PRIMARY KEY,
    style_name VARCHAR,
    category VARCHAR,
    fabric VARCHAR,
    gsm INT,
    color VARCHAR,
    print VARCHAR,
    season VARCHAR,
    brand VARCHAR,
    supplier VARCHAR,
    cost DECIMAL,
    selling_price DECIMAL,
    image_url TEXT
);

CREATE TABLE tech_packs (
    tech_pack_id VARCHAR PRIMARY KEY,
    style_number VARCHAR,
    fabric_details TEXT,
    construction TEXT,
    wash_instructions TEXT
);

CREATE TABLE sales_orders (
    order_number VARCHAR PRIMARY KEY,
    buyer VARCHAR,
    style_number VARCHAR,
    quantity INT,
    unit_price DECIMAL,
    shipment_date DATE,
    status VARCHAR
);

CREATE TABLE sales_invoices (
    invoice_number VARCHAR PRIMARY KEY,
    sales_order VARCHAR,
    amount DECIMAL,
    currency VARCHAR,
    payment_status VARCHAR
);
"""


class WfxSystemPromptBuilder(SystemPromptBuilder):
    async def build_system_prompt(
        self,
        user: User,
        tool_schemas: List[Dict[str, Any]],
        # context: Dict[str, Any],
    ) -> str:
        return (
           "You are a SQL analyst for a global apparel sourcing ERP system.\n"
            "Translate natural language business questions into correct PostgreSQL "
            "queries, then execute them using the available SQL tool.\n\n"
            "## Database schema\n"
            f"{DATABASE_SCHEMA_DDL}\n"
            "## Rules\n"
            "- Only generate SELECT queries. Never write, update, or delete data.\n"
            "- Use only the exact table and column names above — never invent columns.\n"
            "- 'buyer' in sales_orders and 'supplier' in finished_goods are plain text "
            "fields, not enforced foreign keys.\n"
            "- This is a single-turn API with no ability to ask the user follow-up "
            "questions. If a question is ambiguous, do NOT ask for clarification — "
            "instead, pick the most reasonable interpretation, run the query, and "
            "briefly state your assumption as part of the answer "
            "(e.g. 'Assuming average order value means average invoice amount per "
            "supplier, ...').\n"
        )