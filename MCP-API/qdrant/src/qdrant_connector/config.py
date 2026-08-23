from __future__ import annotations

from dataclasses import dataclass
import os
from urllib.parse import urlparse


@dataclass(frozen=True)
class Config:
    qdrant_url: str
    api_key: str | None
    default_collection: str | None
    allowed_collections: frozenset[str]
    approval_secret: str | None
    timeout_seconds: float
    max_retries: int
    prefer_official_mcp: bool
    uvx_command: str


def _csv(value: str | None) -> frozenset[str]:
    return frozenset(x.strip() for x in (value or "").split(",") if x.strip())


def load_config(env: dict[str, str] | None = None) -> Config:
    e = os.environ if env is None else env
    url = e.get("QDRANT_URL", "http://localhost:6333").rstrip("/")
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise ValueError("QDRANT_URL must be an absolute http(s) URL")
    timeout = float(e.get("QDRANT_TIMEOUT_SECONDS", "15"))
    retries = int(e.get("QDRANT_MAX_RETRIES", "3"))
    if not 1 <= timeout <= 120:
        raise ValueError("QDRANT_TIMEOUT_SECONDS must be between 1 and 120")
    if not 0 <= retries <= 5:
        raise ValueError("QDRANT_MAX_RETRIES must be between 0 and 5")
    return Config(
        qdrant_url=url,
        api_key=e.get("QDRANT_API_KEY") or None,
        default_collection=e.get("QDRANT_COLLECTION") or None,
        allowed_collections=_csv(e.get("QDRANT_ALLOWED_COLLECTIONS")),
        approval_secret=e.get("QDRANT_APPROVAL_SECRET") or None,
        timeout_seconds=timeout,
        max_retries=retries,
        prefer_official_mcp=e.get("QDRANT_PREFER_OFFICIAL_MCP", "true").lower() in {"1", "true", "yes"},
        uvx_command=e.get("QDRANT_UVX_COMMAND", "uvx"),
    )


def assert_collection_allowed(config: Config, collection: str) -> None:
    if config.allowed_collections and collection not in config.allowed_collections:
        raise PermissionError(f"Collection is not allowed: {collection}")
