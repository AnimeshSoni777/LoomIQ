from typing import Optional, List, Dict, Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from vanna.core.user.request_context import RequestContext

from app.nl2sql.agent_factory import build_agent

router = APIRouter(prefix="/api/nl-query", tags=["nl_query"])

_agent = build_agent()


class NLQueryRequest(BaseModel):
    question: str


class NLQueryResponse(BaseModel):
    question: str
    sql: Optional[str] = None
    columns: Optional[List[str]] = None
    result: Optional[List[Dict[str, Any]]] = None
    answer: Optional[str] = None


@router.post("", response_model=NLQueryResponse)
async def nl_query(payload: NLQueryRequest):
    sql: Optional[str] = None
    result_rows: Optional[List[Dict[str, Any]]] = None
    result_columns: Optional[List[str]] = None
    answer: Optional[str] = None

    request_context = RequestContext()

    try:
        async for component in _agent.send_message(
            request_context=request_context,
            message=payload.question,
        ):
            rc = component.rich_component
            if rc is None:
                continue

            component_name = rc.__class__.__name__

            if component_name == "StatusCardComponent" and "sql" in rc.metadata:
                sql = rc.metadata["sql"]

            elif component_name == "DataFrameComponent":
                result_rows = rc.rows
                result_columns = rc.columns

            elif component_name == "RichTextComponent":
                answer = rc.content

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"NL2SQL agent failed: {exc}",
        )

    return NLQueryResponse(
        question=payload.question,
        sql=sql,
        columns=result_columns,
        result=result_rows,
        answer=answer,
    )