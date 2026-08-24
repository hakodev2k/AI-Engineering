# Redis MCP/API Connector

Reusable MCP connector for Redis data operations. The connector exposes a small, stable, provider-scoped tool surface while delegating supported operations to Redis' official MCP server (`redis/mcp-redis`).

## Upstream strategy

Implemented data capabilities use the official Redis MCP server over stdio. Redis also maintains `redis/mcp-redis-cloud` and the Redis Cloud REST API for cloud resource management, but this connector intentionally does not expose cloud subscription/database administration because the selected agent workflows are data-plane operations and the official data MCP already covers them. No unofficial MCP dependency is used.

Official references:

- Redis MCP announcement: https://redis.io/blog/introducing-model-context-protocol-mcp-for-redis/
- Official Redis MCP repository: https://github.com/redis/mcp-redis
- Redis MCP registry metadata: https://github.com/redis/mcp-redis/blob/main/server.json
- Redis Cloud MCP repository: https://github.com/redis/mcp-redis-cloud
- Redis Cloud REST API: https://redis.io/docs/latest/operate/rc/api/
- Redis Cloud API authentication: https://redis.io/docs/latest/operate/rc/api/get-started/
- Redis Cloud API usage/rate limit: https://redis.io/docs/latest/operate/rc/api/get-started/use-rest-api/

## Architecture

```text
MCP client
  -> redis connector MCP server
     -> validation / key-prefix policy / approval policy
        -> official redis-mcp-server (stdio)
           -> Redis using REDIS_URL
```

`REDIS_URL` is only injected into the upstream MCP child process. It is never returned by tools or placed into an agent-visible prompt.

## Requirements

- Node.js 20+
- `uvx` available by default, or configure another command capable of launching `redis-mcp-server`
- Redis reachable using `REDIS_URL`

The official Redis MCP package is published as `redis-mcp-server` and supports stdio transport.

## Installation

```bash
npm install
npm run build
```

Copy `.env.example` values into your secret/environment provider. Never commit a live Redis URL or password.

## Configuration

- `REDIS_URL` — required Redis connection URL; may contain username/password and TLS scheme as supported by Redis.
- `REDIS_ALLOWED_KEY_PREFIXES` — optional comma-separated allowlist such as `app:,cache:`. Empty means no prefix restriction.
- `REDIS_APPROVAL_SECRET` — HMAC secret used by WRITE tools.
- `REDIS_ALLOW_DESTRUCTIVE` — must be exactly `true` to enable destructive tools.
- `REDIS_DESTRUCTIVE_APPROVAL_SECRET` — independent HMAC secret for DESTRUCTIVE actions.
- `REDIS_UPSTREAM_COMMAND` — defaults to `uvx`.
- `REDIS_UPSTREAM_ARGS` — defaults to `redis-mcp-server`.
- `REDIS_UPSTREAM_TIMEOUT_MS` — 1,000–120,000 ms; defaults to 15,000.

## Authentication and permissions

Redis authentication is represented entirely by `REDIS_URL` and remains inside the connector/upstream boundary. Use the least-privileged Redis ACL user possible. Restrict that ACL to the key patterns and commands required by this connector, and also set `REDIS_ALLOWED_KEY_PREFIXES` as a connector-side defense in depth.

## Tools

| Tool | Upstream MCP tool | Risk | Approval |
|---|---|---|---|
| `redis.key.get` | `get` | READ | No |
| `redis.key.type` | `type` | READ | No |
| `redis.key.scan` | `scan_keys` | READ | No |
| `redis.hash.get` | `hget` | READ | No |
| `redis.hash.get_all` | `hgetall` | READ | No |
| `redis.key.set` | `set` | WRITE | Required |
| `redis.hash.set` | `hset` | WRITE | Required |
| `redis.key.expire` | `expire` | WRITE | Required |
| `redis.key.delete` | `delete` | DESTRUCTIVE | Strong approval + explicit opt-in |

The connector checks the official MCP server's discovered tool list before invoking a tool and fails closed if the expected upstream capability is unavailable.

## Approval model

WRITE approvals are HMAC-SHA256 digests of the exact external tool name using `REDIS_APPROVAL_SECRET`. Destructive approval uses a separate secret and additionally requires `REDIS_ALLOW_DESTRUCTIVE=true`. This prevents a normal write approval from authorizing deletion.

Recommended execution flow is **Read -> Recommend -> Prepare -> Execute**. An agent can inspect keys without approval, but mutation must be separately authorized.

## Validation and safety

- Key names are limited to 1,024 characters.
- Optional key-prefix allowlisting is applied before upstream calls.
- `SCAN` is exposed instead of Redis `KEYS`, avoiding a blocking full-keyspace operation.
- Scan count is capped at 1,000 per call.
- String/hash values are bounded by MCP input schemas.
- TTL is bounded to one year.
- No arbitrary Redis command execution tool is exposed.
- Credentials are not accepted as tool arguments.
- Retrieved Redis values are untrusted data and must not be interpreted as system instructions.
- Delete is disabled by default.

## Reliability and error handling

The connector applies a timeout both while connecting to and calling the upstream MCP server. Upstream tool discovery is validated before every invocation. Provider/tool errors propagate as MCP errors rather than being converted into permission changes or retry loops. Mutating operations are not blindly retried by this wrapper, avoiding duplicate side effects.

The Redis data plane itself does not expose a generic HTTP rate-limit header model. Resource pressure should be controlled with Redis ACLs, command selection, bounded scans, timeouts, and infrastructure-level limits. For Redis Cloud REST API operations, Redis documents a limit of 400 requests per minute per Account API key; those cloud operations are not implemented by this connector.

## Running

```bash
export REDIS_URL='redis://user:password@host:6379/0'
node dist/src/server.js
```

Configure any MCP client to launch the command over stdio. The implementation uses standard MCP stdio transport and does not depend on client-specific APIs.

## Examples

See `examples/workflows.json` for read, write, and destructive call shapes. Approval IDs shown there are placeholders only.

## Testing

```bash
npm test
npm run typecheck
```

Unit tests require no live Redis credentials and cover required configuration, key-prefix isolation, normal write approval, destructive default-deny behavior, and strong destructive approval.

## Limitations

This connector intentionally exposes only nine scoped operations rather than the full Redis command surface. Lists, sets, sorted sets, streams, Pub/Sub, JSON, query-engine/vector search, and Redis Cloud administration are supported by official Redis projects but are not exposed here because they are outside this connector's selected capability set. No raw-command escape hatch is provided. Upstream package availability (`uvx redis-mcp-server`) is a runtime prerequisite unless an alternative launcher is configured.
