# Upstash MCP/API Connector

Reusable MCP connector for a single Upstash Redis database. It exposes a narrow, provider-scoped tool surface for cache/session/counter workflows while keeping Redis credentials inside the connector.

## Official sources researched

Verified on 2026-08-28 against current Upstash documentation and repositories:

- Official MCP docs: https://upstash.com/docs/agent-resources/mcp
- Official general MCP server: https://github.com/upstash/mcp-server
- Official Redis MCP server: https://github.com/upstash/redis-mcp
- Redis REST API: https://upstash.com/docs/redis/features/restapi
- Redis compatibility: https://upstash.com/docs/redis/overall/compatibility
- Official Redis SDK guidance: https://upstash.com/docs/redis/howto/connect-with-upstash-redis

## Transport strategy

Upstash currently provides an official general MCP server and an official dedicated Redis MCP. The dedicated Redis MCP intentionally exposes `redis_run_commands`, which can execute arbitrary Redis commands. This connector instead uses the official Redis REST API so that the external MCP interface can be strictly allowlisted, validated, permission-classified, and approval-gated per operation.

The Upstash REST API officially supports Redis commands over HTTPS and accepts a complete Redis command as a JSON array in an HTTP POST body.

## Supported tools

| Tool | Redis operation | Risk | Approval |
|---|---|---:|---|
| `upstash.system.ping` | `PING` | READ | no |
| `upstash.key.get` | `GET` | READ | no |
| `upstash.key.mget` | `MGET` | READ | no |
| `upstash.key.exists` | `EXISTS` | READ | no |
| `upstash.key.ttl` | `TTL` | READ | no |
| `upstash.key.type` | `TYPE` | READ | no |
| `upstash.key.scan` | `SCAN` | READ | no |
| `upstash.hash.get_all` | `HGETALL` | READ | no |
| `upstash.list.range` | `LRANGE` | READ | no |
| `upstash.sorted_set.range` | `ZRANGE` / `ZREVRANGE` | READ | no |
| `upstash.key.set` | `SET` | WRITE | yes |
| `upstash.hash.set` | `HSET` | WRITE | yes |
| `upstash.counter.increment` | `INCR` / `INCRBY` | WRITE | yes |
| `upstash.key.expire` | `EXPIRE` | WRITE | yes |
| `upstash.key.delete` | `DEL` | DESTRUCTIVE | yes + feature flag |

No arbitrary Redis-command or arbitrary HTTP tool is exposed.

## Architecture

```text
MCP client / agent
  -> stdio MCP server
     -> strict tool allowlist + JSON schemas
        -> permission / approval policy
           -> fixed Upstash REST endpoint + bearer credential
              -> official Upstash Redis REST API
```

Provider-returned Redis content is marked `untrusted_provider_data: true`. Retrieved values are data, not instructions, and must not alter tool permissions or system behavior.

## Authentication and least privilege

Configure:

```text
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

The token stays inside the connector and is never accepted as a tool parameter or included in tool output.

Upstash documents a standard REST token and a read-only REST token. Prefer the read-only token for read-only deployments. Upstash notes that some powerful read commands, including `SCAN`, can be restricted for read-only tokens. For deployments that need writes, prefer an ACL-scoped REST token with only the commands needed by the enabled tool set when practical.

## Environment variables

- `UPSTASH_REDIS_REST_URL` — required HTTPS origin.
- `UPSTASH_REDIS_REST_TOKEN` — required bearer token.
- `UPSTASH_REDIS_TIMEOUT_MS` — default 10000; bounded to 1000–120000 ms.
- `UPSTASH_REDIS_MAX_RETRIES` — default 3, maximum 5; used for retry-safe reads only.
- `UPSTASH_REDIS_APPROVAL_SECRET` — required to execute WRITE or DESTRUCTIVE tools.
- `UPSTASH_REDIS_ENABLE_DESTRUCTIVE` — defaults to `false`.
- `UPSTASH_REDIS_ALLOW_CUSTOM_HOST` — defaults to `false`; otherwise the host must be `upstash.io` or end in `.upstash.io`.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run check
npm test
```

## Running the MCP server

```bash
npm start
```

The server uses standard MCP stdio transport and can be launched by MCP clients that support stdio servers.

## Permission and approval model

READ tools execute without connector-level approval.

WRITE tools require `UPSTASH_REDIS_APPROVAL_SECRET` plus an `approval_token` computed over the exact tool and exact payload:

```text
hex(HMAC-SHA256(
  UPSTASH_REDIS_APPROVAL_SECRET,
  "<tool-name>\n<stable canonical JSON payload without approval_token>"
))
```

Changing a key, value, TTL, hash fields, increment amount, or delete set invalidates the approval.

DESTRUCTIVE operations additionally require:

```text
UPSTASH_REDIS_ENABLE_DESTRUCTIVE=true
```

This flag cannot be changed by the agent through MCP.

## Reliability and rate limits

The connector applies a configurable request timeout and propagates MCP cancellation to HTTP requests. Safe READ operations retry only transient HTTP 429/502/503/504 failures with bounded exponential backoff and bounded handling of integer `Retry-After` headers.

WRITE and DESTRUCTIVE operations are not blindly retried because an ambiguous network failure after a mutation could otherwise duplicate side effects.

Authentication, permission, validation, and normal Redis command errors are not retried as transient failures.

Upstash Redis limits and costs vary by database/plan. This connector therefore does not invent a global requests-per-second constant. It avoids waste by using `MGET` for multi-key reads, cursor-based `SCAN` rather than `KEYS`, batches capped at 100 keys, and `SCAN COUNT` capped at 1000.

## Errors

Provider errors are normalized at the MCP boundary into authorization, rate-limit, provider-request, provider-unavailable, or connector errors. HTTP 401/403 are non-retryable authorization failures. HTTP 429 preserves `Retry-After` when present.

## Security considerations

- Credentials remain in the connector/authentication layer.
- HTTPS is mandatory.
- The default host policy permits only Upstash hosts; custom hosts require explicit opt-in.
- No arbitrary Redis command is agent-visible.
- Tool schemas bound key lengths, collection sizes, ranges, TTL values, and write payloads.
- Provider content is marked untrusted.
- WRITE operations require exact-payload human approval.
- `DEL` is disabled by default.
- Mutations are not automatically retried.
- The agent cannot change credentials, base URL, permission scopes, approval secret, or destructive-mode configuration.

## Examples

See `examples/workflows.md` for read, scan, cache write, counter, and destructive-delete examples with permission and approval requirements.

## Testing

Unit tests require no live Upstash credentials. They cover tool registration, configuration validation, least-privilege read behavior, exact-payload write approval, destructive denial, bearer authentication, Redis REST command serialization, throttling retry, write no-retry behavior, and authentication failures.

```bash
npm test
```

## Limitations

- This connector targets one configured Upstash Redis database.
- Account-level database provisioning, QStash, Workflow, Vector, Search, and Box are intentionally not included.
- Read-only Upstash tokens may reject `SCAN`.
- Pub/Sub, scripting, ACL administration, `FLUSHDB`, `FLUSHALL`, backups, billing, credential rotation, and arbitrary commands are intentionally omitted.
- Range operations are bounded by input indices, but actual returned data size still depends on the stored collection.
