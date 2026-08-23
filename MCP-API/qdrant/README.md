# Qdrant MCP/API Connector

Reusable MCP server for Qdrant. It exposes stable, provider-scoped operations for collection inspection, vector querying, point management, scrolling, and semantic-memory workflows.

## Transport strategy

The connector prefers Qdrant's official `mcp-server-qdrant` for semantic-memory capabilities (`qdrant-store` and `qdrant-find`). Those operations are invoked through a local MCP stdio child started with `uvx`. Qdrant's official REST API is used for collection, point, query, and scroll operations that are not exposed by that upstream MCP server.

If the official MCP process is unavailable, `qdrant_memory_store` fails safely instead of generating embeddings with an untrusted implementation. `qdrant_memory_find` directs callers to `qdrant_query`, which is the explicit-vector REST fallback.

Official sources:

- Qdrant MCP server: `https://github.com/qdrant/mcp-server-qdrant`
- Qdrant API reference: `https://api.qdrant.tech/`
- Qdrant authentication: API key via the `api-key` HTTP header.

## Runtime

Python 3.11+ is required. `uvx` is required only when official-MCP semantic-memory tools are enabled.

```bash
cd MCP-API/qdrant
python -m venv .venv
. .venv/bin/activate
pip install -e '.[test]'
cp .env.example .env
```

Run the MCP server:

```bash
qdrant-connector
```

The external server uses MCP stdio and can be launched by ChatGPT-compatible MCP clients, Claude/Claude Code, Cursor, or another MCP client capable of starting a local command.

## Authentication and credential isolation

Set `QDRANT_API_KEY` for Qdrant Cloud or another API-key-protected Qdrant deployment. The key remains inside the connector and is sent only in the provider HTTP header or inherited by the official Qdrant MCP child process. Tool arguments never contain provider credentials.

`QDRANT_URL` must be an absolute HTTP(S) URL. This prevents arbitrary per-call URLs and avoids exposing a generic SSRF-capable request tool.

## Environment variables

- `QDRANT_URL`: Qdrant endpoint. Defaults to `http://localhost:6333`.
- `QDRANT_API_KEY`: optional Qdrant API key.
- `QDRANT_COLLECTION`: optional default collection for semantic-memory tools.
- `QDRANT_ALLOWED_COLLECTIONS`: optional comma-separated collection allowlist.
- `QDRANT_APPROVAL_SECRET`: secret used to validate approval HMACs for writes and destructive actions.
- `QDRANT_TIMEOUT_SECONDS`: HTTP timeout, 1-120 seconds; default 15.
- `QDRANT_MAX_RETRIES`: bounded retry count, 0-5; default 3.
- `QDRANT_PREFER_OFFICIAL_MCP`: default `true`.
- `QDRANT_UVX_COMMAND`: executable used to start the official MCP package; default `uvx`.

## Tools and risk model

| Tool | Transport | Risk | Approval |
| --- | --- | --- | --- |
| `qdrant_collection_list` | REST | READ | No |
| `qdrant_collection_get` | REST | READ | No |
| `qdrant_collection_create` | REST | WRITE | Yes |
| `qdrant_collection_delete` | REST | DESTRUCTIVE | Yes |
| `qdrant_point_get` | REST | READ | No |
| `qdrant_point_upsert` | REST | WRITE | Yes |
| `qdrant_point_delete` | REST | DESTRUCTIVE | Yes |
| `qdrant_query` | REST | READ | No |
| `qdrant_scroll` | REST | READ | No |
| `qdrant_memory_store` | Official MCP | WRITE | Yes |
| `qdrant_memory_find` | Official MCP | READ | No |

Approval IDs are HMAC-SHA256 digests of the exact internal tool name using `QDRANT_APPROVAL_SECRET`. This creates an explicit connector-side boundary; the agent cannot silently upgrade its own permissions by changing a tool parameter.

## Capability notes

`qdrant_query` uses Qdrant's Query Points API and accepts an explicit vector, limit, optional filter, and payload-return flag. `qdrant_scroll` supports bounded pagination with an optional offset and filter. Point retrieval/upsert/delete calls are capped at 100 point IDs/items per tool call to prevent accidentally unbounded mutations.

The memory tools intentionally rely on Qdrant's official MCP implementation because it owns the embedding model and collection-memory semantics. The connector does not invent an incompatible REST embedding format.

## Reliability and rate limiting

REST calls have timeout handling and bounded exponential backoff. HTTP 429 and 5xx responses may be retried up to `QDRANT_MAX_RETRIES`; `Retry-After` is honored when numeric. Permission/validation failures are not retried. Destructive DELETE calls are never retried blindly.

Qdrant deployments can have different infrastructure-level quotas, so this connector does not invent a universal request-per-minute limit. Provider throttling is surfaced through HTTP status and retry metadata.

## Security

- Credentials are loaded from environment/configuration only.
- Collection allowlists constrain data access when configured.
- No arbitrary URL/request tool is exposed.
- Write and destructive operations require explicit approval.
- Delete calls are not retried automatically.
- Point batches and query result sizes are bounded.
- Retrieved payloads are treated as untrusted data; they do not modify connector configuration, permissions, or tool registration.
- The upstream MCP process is pinned by package name and only known tools (`qdrant-store`, `qdrant-find`) are invoked after tool discovery.

For production, pin the `mcp-server-qdrant` package version through your `uv`/environment policy and run the connector with a least-privilege Qdrant API key restricted to the required deployment.

## Testing

Normal unit tests require no live credentials:

```bash
pytest
```

Tests cover configuration validation, collection allowlisting, approval enforcement, API-key forwarding, provider error mapping, and the rule that destructive deletes are not retried.

## Examples

See `examples/workflows.json` for read/query and semantic-memory flows, including permission and approval annotations.

## Limitations

The connector does not expose every Qdrant endpoint. Snapshot, cluster administration, aliases, shard-transfer operations, and unrestricted raw requests are deliberately omitted. It also does not generate embeddings itself for the semantic-memory fallback; if official MCP memory storage is unavailable, the caller must either restore that trusted upstream or use explicit vectors with point/query tools.
