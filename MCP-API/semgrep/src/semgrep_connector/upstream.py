from __future__ import annotations

import asyncio
import os
from contextlib import AsyncExitStack
from typing import Any

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from .config import Config
from .policy import ALLOWED_UPSTREAM_TOOLS, validate_upstream_tool


class UpstreamError(RuntimeError):
    pass


class OfficialSemgrepMcp:
    def __init__(self, config: Config):
        self.config = config
        self._stack: AsyncExitStack | None = None
        self._session: ClientSession | None = None
        self._lock = asyncio.Lock()

    async def _connect(self) -> None:
        if self._session is not None:
            return
        async with self._lock:
            if self._session is not None:
                return
            env = dict(os.environ)
            if self.config.app_token:
                env["SEMGREP_APP_TOKEN"] = self.config.app_token
            params = StdioServerParameters(command=self.config.binary, args=["mcp", "-t", "stdio"], env=env)
            stack = AsyncExitStack()
            try:
                read, write = await stack.enter_async_context(stdio_client(params))
                session = await stack.enter_async_context(ClientSession(read, write))
                await asyncio.wait_for(session.initialize(), timeout=self.config.timeout_seconds)
                listing = await asyncio.wait_for(session.list_tools(), timeout=self.config.timeout_seconds)
                names = {tool.name for tool in listing.tools}
                if not {"semgrep_rule_schema", "get_supported_languages", "semgrep_scan"}.issubset(names):
                    raise UpstreamError("Official Semgrep MCP server is missing required baseline tools")
                self._stack = stack
                self._session = session
            except Exception:
                await stack.aclose()
                raise

    async def close(self) -> None:
        if self._stack:
            await self._stack.aclose()
        self._stack = None
        self._session = None

    async def call(self, tool: str, arguments: dict[str, Any]) -> Any:
        validate_upstream_tool(tool)
        await self._connect()
        assert self._session is not None
        try:
            result = await asyncio.wait_for(
                self._session.call_tool(tool, arguments=arguments),
                timeout=self.config.timeout_seconds,
            )
        except (asyncio.TimeoutError, BrokenPipeError, EOFError, ConnectionError) as exc:
            await self.close()
            raise UpstreamError(f"Semgrep MCP transport failure: {type(exc).__name__}") from exc
        if getattr(result, "isError", False):
            raise UpstreamError("Semgrep MCP tool returned an error")
        return result

    @staticmethod
    def exposed_allowlist() -> frozenset[str]:
        return ALLOWED_UPSTREAM_TOOLS
