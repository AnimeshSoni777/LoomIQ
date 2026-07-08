import os
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Check your .env file.")


def get_connection():
    """Opens a new psycopg2 connection. Caller is responsible for closing it."""
    return psycopg2.connect(DATABASE_URL)


def run_query(query: str, params: tuple | None = None):
    """
    Executes a read query and returns rows as a list of dicts.
    This is deliberately generic — Milestone 4's NL2SQL endpoint will
    reuse this exact function to run LLM-generated SQL.
    """
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(query, params)
            rows = cur.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()