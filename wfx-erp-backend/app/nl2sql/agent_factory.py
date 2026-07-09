import os
from dotenv import load_dotenv

load_dotenv()

from vanna import Agent, AgentConfig
from vanna.core.registry import ToolRegistry
from vanna.core.user import User
from vanna.core.user.resolver import UserResolver
from vanna.core.user.request_context import RequestContext
from vanna.integrations.openai import OpenAILlmService
from vanna.integrations.postgres import PostgresRunner
from vanna.integrations.local.agent_memory import DemoAgentMemory
from vanna.tools import RunSqlTool

from app.nl2sql.schema_prompt import WfxSystemPromptBuilder

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")


class SingleUserResolver(UserResolver):
    async def resolve_user(self, request_context: RequestContext) -> User:
        return User(
            id="demo-user",
            email="demo@wfx.local",
            group_memberships=["user", "admin"], 
        )



def build_agent() -> Agent:
    llm = OpenAILlmService(
        api_key=OPENROUTER_API_KEY,
        model="google/gemini-2.5-flash",
        base_url="https://openrouter.ai/api/v1",
    )

    sql_runner = PostgresRunner(connection_string=DATABASE_URL)

    tools = ToolRegistry()
    tools.register_local_tool(
        RunSqlTool(sql_runner=sql_runner),
        access_groups=["user"],
    )

    return Agent(
        llm_service=llm,
        tool_registry=tools,
        user_resolver=SingleUserResolver(),
        agent_memory=DemoAgentMemory(max_items=1000),
        config=AgentConfig(max_tool_iterations=5),
        system_prompt_builder=WfxSystemPromptBuilder(),
    )