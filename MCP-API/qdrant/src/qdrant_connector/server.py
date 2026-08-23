from __future__ import annotations

from typing import Any
from fastmcp import FastMCP
from pydantic import BaseModel, Field
from .config import assert_collection_allowed, load_config
from .policy import require_approval
from .rest import QdrantRestClient
from .upstream_mcp import OfficialQdrantMcp

config = load_config()
rest = QdrantRestClient(config)
official = OfficialQdrantMcp(config)
mcp = FastMCP("qdrant-connector")


def collection_name(value: str | None) -> str:
    name = value or config.default_collection
    if not name:
        raise ValueError("collection is required when QDRANT_COLLECTION is not configured")
    assert_collection_allowed(config, name)
    return name


@mcp.tool()
async def qdrant_collection_list() -> Any:
    """READ: list collections visible to the configured Qdrant identity."""
    return await rest.get("/collections")


@mcp.tool()
async def qdrant_collection_get(collection: str) -> Any:
    """READ: get collection metadata and status."""
    name = collection_name(collection)
    return await rest.get(f"/collections/{name}")


@mcp.tool()
async def qdrant_collection_create(collection: str, vector_size: int = Field(ge=1, le=65536), distance: str = "Cosine", approval_id: str | None = None) -> Any:
    """WRITE: create a collection. Requires explicit approval."""
    name = collection_name(collection)
    require_approval("qdrant.collection.create", approval_id, config.approval_secret)
    if distance not in {"Cosine", "Dot", "Euclid", "Manhattan"}:
        raise ValueError("unsupported distance")
    return await rest.put(f"/collections/{name}", json={"vectors": {"size": vector_size, "distance": distance}})


@mcp.tool()
async def qdrant_collection_delete(collection: str, approval_id: str | None = None) -> Any:
    """DESTRUCTIVE: delete a collection. Requires explicit approval and is never retried."""
    name = collection_name(collection)
    require_approval("qdrant.collection.delete", approval_id, config.approval_secret)
    return await rest.delete(f"/collections/{name}")


@mcp.tool()
async def qdrant_point_get(collection: str, point_ids: list[str | int], with_payload: bool = True, with_vector: bool = False) -> Any:
    """READ: retrieve points by ID."""
    name = collection_name(collection)
    if not 1 <= len(point_ids) <= 100:
        raise ValueError("point_ids must contain 1..100 items")
    return await rest.post(f"/collections/{name}/points", json={"ids": point_ids, "with_payload": with_payload, "with_vector": with_vector})


@mcp.tool()
async def qdrant_point_upsert(collection: str, points: list[dict[str, Any]], wait: bool = True, approval_id: str | None = None) -> Any:
    """WRITE: upsert explicit vectors/payloads. Requires explicit approval."""
    name = collection_name(collection)
    require_approval("qdrant.point.upsert", approval_id, config.approval_secret)
    if not 1 <= len(points) <= 100:
        raise ValueError("points must contain 1..100 items")
    return await rest.put(f"/collections/{name}/points", params={"wait": str(wait).lower()}, json={"points": points})


@mcp.tool()
async def qdrant_point_delete(collection: str, point_ids: list[str | int], wait: bool = True, approval_id: str | None = None) -> Any:
    """DESTRUCTIVE: delete points by ID. Requires explicit approval."""
    name = collection_name(collection)
    require_approval("qdrant.point.delete", approval_id, config.approval_secret)
    if not 1 <= len(point_ids) <= 100:
        raise ValueError("point_ids must contain 1..100 items")
    return await rest.post(f"/collections/{name}/points/delete", params={"wait": str(wait).lower()}, json={"points": point_ids}, retryable=False)


@mcp.tool()
async def qdrant_query(collection: str, query: list[float], limit: int = 10, filter: dict[str, Any] | None = None, with_payload: bool = True) -> Any:
    """READ: vector query using the official Qdrant Query API."""
    name = collection_name(collection)
    if not 1 <= limit <= 100:
        raise ValueError("limit must be 1..100")
    if not 1 <= len(query) <= 65536:
        raise ValueError("query vector is empty or too large")
    body: dict[str, Any] = {"query": query, "limit": limit, "with_payload": with_payload}
    if filter is not None:
        body["filter"] = filter
    return await rest.post(f"/collections/{name}/points/query", json=body)


@mcp.tool()
async def qdrant_scroll(collection: str, limit: int = 20, offset: str | int | None = None, filter: dict[str, Any] | None = None) -> Any:
    """READ: page through points with optional filtering."""
    name = collection_name(collection)
    if not 1 <= limit <= 100:
        raise ValueError("limit must be 1..100")
    body: dict[str, Any] = {"limit": limit, "with_payload": True, "with_vector": False}
    if offset is not None:
        body["offset"] = offset
    if filter is not None:
        body["filter"] = filter
    return await rest.post(f"/collections/{name}/points/scroll", json=body)


@mcp.tool()
async def qdrant_memory_store(information: str, metadata: dict[str, Any] | None = None, collection: str | None = None, approval_id: str | None = None) -> Any:
    """WRITE: semantic memory store; prefers Qdrant's official MCP server. Requires approval."""
    name = collection_name(collection)
    require_approval("qdrant.memory.store", approval_id, config.approval_secret)
    args = {"information": information, "metadata": metadata or {}}
    if not config.default_collection:
        args["collection_name"] = name
    if config.prefer_official_mcp:
        try:
            return {"transport": "official-mcp", "result": await official.call("qdrant-store", args)}
        except (OSError, RuntimeError, LookupError):
            pass
    raise RuntimeError("Official Qdrant MCP is unavailable; memory.store has no safe REST fallback because embedding generation belongs to the official MCP layer")


@mcp.tool()
async def qdrant_memory_find(query: str, collection: str | None = None) -> Any:
    """READ: semantic memory lookup; prefers Qdrant's official MCP server."""
    name = collection_name(collection)
    args: dict[str, Any] = {"query": query}
    if not config.default_collection:
        args["collection_name"] = name
    if config.prefer_official_mcp:
        try:
            return {"transport": "official-mcp", "result": await official.call("qdrant-find", args)}
        except (OSError, RuntimeError, LookupError):
            pass
    raise RuntimeError("Official Qdrant MCP is unavailable; use qdrant_query with an explicit vector as the REST fallback")


def main() -> None:
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
