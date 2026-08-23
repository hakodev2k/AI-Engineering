from __future__ import annotations

import asyncio
from typing import Any
import httpx
from .config import Config


class QdrantRestError(RuntimeError):
    def __init__(self, status: int, message: str, retry_after: float | None = None):
        super().__init__(message)
        self.status = status
        self.retry_after = retry_after


class QdrantRestClient:
    def __init__(self, config: Config, transport: httpx.AsyncBaseTransport | None = None):
        headers = {"Accept": "application/json"}
        if config.api_key:
            headers["api-key"] = config.api_key
        self.config = config
        self.client = httpx.AsyncClient(base_url=config.qdrant_url, headers=headers, timeout=config.timeout_seconds, transport=transport)

    async def close(self) -> None:
        await self.client.aclose()

    async def request(self, method: str, path: str, *, json: Any = None, params: dict[str, Any] | None = None, retryable: bool = True) -> Any:
        for attempt in range(self.config.max_retries + 1):
            try:
                response = await self.client.request(method, path, json=json, params=params)
            except (httpx.TimeoutException, httpx.NetworkError):
                if not retryable or attempt >= self.config.max_retries:
                    raise
                await asyncio.sleep(min(8, 0.25 * (2 ** attempt)))
                continue
            if response.is_success:
                return None if response.status_code == 204 else response.json()
            retry_after = response.headers.get("retry-after")
            delay = float(retry_after) if retry_after and retry_after.replace('.', '', 1).isdigit() else min(8, 0.25 * (2 ** attempt))
            if retryable and (response.status_code == 429 or response.status_code >= 500) and attempt < self.config.max_retries:
                await asyncio.sleep(delay)
                continue
            raise QdrantRestError(response.status_code, response.text[:2000], delay if response.status_code == 429 else None)
        raise RuntimeError("unreachable")

    async def get(self, path: str, **kwargs: Any) -> Any:
        return await self.request("GET", path, **kwargs)

    async def post(self, path: str, **kwargs: Any) -> Any:
        return await self.request("POST", path, **kwargs)

    async def put(self, path: str, **kwargs: Any) -> Any:
        return await self.request("PUT", path, **kwargs)

    async def delete(self, path: str, **kwargs: Any) -> Any:
        return await self.request("DELETE", path, retryable=False, **kwargs)
