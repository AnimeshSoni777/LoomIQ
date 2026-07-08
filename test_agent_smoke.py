import asyncio
from app.nl2sql.agent_factory import build_agent
from vanna.core.user.request_context import RequestContext


async def main():
    agent = build_agent()
    request_context = RequestContext()

    async for component in agent.send_message(
        request_context=request_context,
        message="How many suppliers are in the database?",
    ):
        print(component)


if __name__ == "__main__":
    asyncio.run(main())