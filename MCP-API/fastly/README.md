# Fastly MCP/API Connector

Reusable MCP server that exposes a focused subset of Fastly operations for inspection, validation, deployment preparation, analytics, and cache incident response.

## Upstream transport

This connector uses the official Fastly REST API at `https://api.fastly.com`. No official Fastly MCP server was found in Fastly's official documentation during implementation, so all implemented capabilities use the official API directly while preserving MCP tool contracts for callers.

Official references:

- API overview: https://www.fastly.com/documentation/reference/api/
- Authentication tokens: https://www.fastly.com/documentation/reference/api/auth-tokens/
- User token scopes: https://www.fastly.com/documentation/reference/api/auth-tokens/user/
- Services: https://www.fastly.com/documentation/reference/api/services/service/
- Versions: https://www.fastly.com/documentation/reference/api/services/version/
- Service domains: https://www.fastly.com/documentation/reference/api/services/domain/
- Stats: https://www.fastly.com/documentation/reference/api/metrics-stats/stats/
- Purging: https://www.fastly.com/documentation/reference/api/purging/

## Capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `fastly.service.list` | REST | READ | no |
| `fastly.service.get` | REST | READ | no |
| `fastly.version.list` | REST | READ | no |
| `fastly.version.get` | REST | READ | no |
| `fastly.version.validate` | REST | READ | no |
| `fastly.version.clone` | REST | WRITE | configurable |
| `fastly.version.activate` | REST | HIGH_RISK | required |
| `fastly.domain.list` | REST | READ | no |
| `fastly.domain.check` | REST | READ | no |
| `fastly.stats.summary` | REST | READ | no |
| `fastly.cache.purge_url` | REST | HIGH_RISK | required |
| `fastly.cache.purge_key` | REST | HIGH_RISK | required |
| `fastly.cache.purge_all` | REST | DESTRUCTIVE | required |

The connector intentionally does not expose a generic arbitrary-request tool.

## Architecture

`server.ts` exposes MCP over stdio. `tools.ts` defines provider-scoped operations and strict Zod input validation. `client.ts` owns Fastly HTTP transport, token isolation, timeout handling, provider errors, throttling, and bounded read retries. `policy.ts` enforces risk and approval boundaries. `config.ts` validates environment configuration and restricts the upstream host to Fastly's official API.

Provider responses are returned with `untrusted: true`; retrieved provider content must be treated as data rather than instructions.

## Authentication and least privilege

Set `FASTLY_API_TOKEN`. The token remains in the connector process and is injected only as the `Fastly-Key` HTTP header; it is never returned to MCP callers.

Fastly API tokens can be scoped. For read-only inspection, prefer `global:read`. For selective purge automation, prefer a token constrained to `purge_select` and, where possible, restricted to specific services. `purge_all` is only needed for the purge-all tool. Activating or cloning service versions requires permissions that permit those service configuration operations; use the narrowest account/service authorization supported for the automation identity. Avoid the broad `global` scope unless required by your deployment workflow.

Fastly recommends automation tokens for automated systems. Rotate and expire tokens according to your organization's policy.

## Environment

Copy `.env.example` values into your secret manager or process environment.

- `FASTLY_API_TOKEN`: required credential.
- `FASTLY_API_BASE_URL`: fixed to `https://api.fastly.com`; alternate hosts are rejected to reduce SSRF risk.
- `FASTLY_TIMEOUT_MS`: per-request timeout, default 15000.
- `FASTLY_MAX_RETRIES`: bounded retries for idempotent GET operations only, default 3, max 5.
- `FASTLY_APPROVAL_SECRET`: secret used to verify explicit approval digests.
- `FASTLY_REQUIRE_WRITE_APPROVAL`: defaults to true for configurable WRITE tools.

## Installation and running

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
FASTLY_API_TOKEN=... npm start
```

The process communicates using MCP stdio and can be configured in clients that support stdio MCP servers. Client-specific configuration syntax varies; point the client at `node` with `dist/server.js` as the argument and supply credentials through its secure environment/secret mechanism.

## Approval model

READ operations execute without approval. WRITE operations may require approval according to `FASTLY_REQUIRE_WRITE_APPROVAL`. HIGH_RISK and DESTRUCTIVE operations always require explicit approval.

Approval is payload-bound. The connector verifies a 64-character HMAC-SHA256 digest computed from the tool name and exact approved payload using `FASTLY_APPROVAL_SECRET`. This prevents one approval token from being silently reused for a different service, version, purge key, or URL.

The intended workflow is Read -> Recommend -> Prepare -> Human approve -> Execute.

`fastly.version.activate` deploys a configuration version and therefore always requires approval. Cache purges also require approval because they can create origin load and materially affect production traffic. `fastly.cache.purge_all` is destructive from the cache perspective and cannot be soft-purged.

## Rate limits and reliability

Fastly documents default API limits of 1,000 write requests per hour, 6,000 read requests per minute, and much higher dedicated purge limits. A `429 Too Many Requests` response can include rate-limit/reset information. This connector preserves provider error status and `Retry-After` when present.

Only GET requests are retried automatically, with bounded exponential backoff. Writes, activations, and purge operations are not retried blindly, avoiding accidental duplicate or repeated state changes. Network failures, permission errors, validation failures, and authentication failures on write operations are surfaced directly.

Fastly also warns that overlapping configuration writes can lose updates. Keep service-version mutations serialized in callers.

## Validation and security

- API base host is pinned to `api.fastly.com`.
- IDs, versions, domain names, URLs, purge keys, and approval identifiers are validated before transport.
- Credentials stay in the connector layer.
- No arbitrary URL/endpoint execution capability is exposed.
- MCP tool discovery is static; newly appearing upstream capabilities are never auto-trusted.
- Provider content is marked untrusted.
- High-impact operations require payload-bound human approval.
- Destructive operations are never automatically retried.
- Logs should not include environment variables or request headers containing `Fastly-Key`.

## Tests

```bash
npm test
```

Unit tests use mocked HTTP transport and require no live Fastly credentials. Coverage includes configuration validation, tool registration, provider permission errors, throttling retry behavior, approval enforcement, and input validation.

## Limitations

This is a deliberately scoped operational connector rather than a wrapper for every Fastly endpoint. It does not manage users, billing, API tokens, ACLs, dictionaries, TLS assets, WAF configuration, logging endpoints, or account permissions. It does not implement webhook ingestion because the selected workflows do not require it. Stats coverage is limited to Fastly's service summary endpoint. Pagination is not added to tools whose selected Fastly endpoints return complete collections rather than connector-controlled cursor pagination.

Soft purges are supported for URL and surrogate-key tools. Purge-all is always hard because Fastly's purge-all endpoint does not support soft mode.
