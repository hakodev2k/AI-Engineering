from __future__ import annotations

import os
from typing import Any
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from .config import Config


class OfficialQdrantMcp:
    def __init__(self, config: Config):
        self.config = config

    def _params(self) -> StdioServerParameters:
        env = dict(os.environ)
        env["QDRANT_URL"] = self.config.qdrant_url
        if self.config.api_key:
            env["QDRANT_API_KEY"] = self.config.api_key
        if self.config.default_collection:
            env["COLLECTION_NAME"] = self.config.default_collection
        return StdioServerParameters(command=self.config.uvx_command, args=["mcp-server-qdrant"], env=env)

    async def call(self, tool: str, arguments: dict[str, Any]) -> Any:
        async with stdio_client(self._params()) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                tools = {t.name for t in (await session.list_tools()).tools}
                if tool not in tools:
                    raise LookupError(f"Official Qdrant MCP tool not available: {tool}")
                result = await session.call_tool(tool, arguments)
                if result.isError:
                    raise RuntimeError(f"Official Qdrant MCP error: {result.content}")
                return [getattr(item, "text", str(item)) for item in result.content]
