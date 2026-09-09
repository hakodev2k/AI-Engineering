# PocketBase MCP/API Connector

Reusable MCP server exposing a curated set of PocketBase operations through stable provider-scoped tools. The connector uses PocketBase's official Web API directly. No official PocketBase MCP server was found in the current official PocketBase documentation or official SDK repository during implementation, so no unofficial upstream MCP dependency is used.

## Official sources researched

- PocketBase homepage and current version/capabilities: https://pocketbase.io/
- Authentication: https://pocketbase.io/docs/authentication/
- Records Web API: https://pocketbase.io/docs/api-records/
- Collections Web API: https://pocketbase.io/docs/api-collections/
- Logs Web API: https://pocketbase.io/docs/api-logs/
- Backups Web API: https://pocketbase.io/docs/api-backups/
- Health Web API: https://pocketbase.io/docs/api-health/
- Realtime Web API: https://pocketbase.io/docs/api-realtime/
- Official JavaScript SDK: https://github.com/pocketbase/js-sdk

PocketBase exposes a stateless HTTP API authorized with an `Authorization` token. Collection access is additionally governed by PocketBase API rules. Administrative collection, logs, and backup operations are superuser-only. PocketBase also exposes SSE realtime events, but this connector intentionally does not keep long-running subscriptions in an MCP tool call because stdio tool calls are request/response oriented and leaked subscriptions are operationally risky.

## Transport strategy

All implemented capabilities use the official REST/Web API. The official JavaScript SDK was reviewed for behavior and security guidance, but the connector uses a small HTTP client so that the exact upstream paths, retry rules, timeout behavior, and credential handling remain explicit and auditable. There is no generic `send arbitrary request` tool.

## Architecture

`MCP client -> stdio MCP server -> strict Zod validation -> approval policy -> PocketBaseClient -> official PocketBase /api/* endpoint`.

Provider responses are wrapped with `untrusted_data: true`. Retrieved record content must be treated as data, never as instructions capable of changing connector policy or permissions.

## Runtime and installation

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run build
npm start
```

Configure the MCP client to launch `node dist/src/index.js` with the environment variables below. Any MCP client supporting local stdio servers can use this transport; compatibility with a specific product depends on that product's stdio MCP support.

## Authentication and least privilege

Set `POCKETBASE_AUTH_TOKEN` to a PocketBase auth token. The connector never accepts a token as a tool argument, never returns the configured token, and never logs it. The token may represent a regular auth record or a superuser. Prefer a regular auth-record token for ordinary record workflows; provide a superuser token only when collection schema, log, or backup tools are genuinely required.

PocketBase auth tokens do not use OAuth scopes. Effective privileges come from the identity represented by the token plus each collection's List/View/Create/Update/Delete rules. Superusers bypass collection API rules and can access/modify anything, so they should be reserved for administrative workflows.

`POCKETBASE_AUTH_TOKEN` is optional only because the health endpoint and any PocketBase endpoint made public by its rules can be unauthenticated in principle. This connector requires a configured token for every implemented tool except `pocketbase.health.check`, keeping behavior explicit.

## Environment variables

- `POCKETBASE_BASE_URL` — required. HTTPS is required except for localhost development over HTTP. Credentials in the URL are rejected.
- `POCKETBASE_AUTH_TOKEN` — required for all tools except health.
- `POCKETBASE_TIMEOUT_MS` — request timeout, default 20000, bounded to 1–120 seconds.
- `POCKETBASE_REQUIRE_WRITE_APPROVAL` — default `true`.
- `POCKETBASE_ENABLE_DESTRUCTIVE` — default `false`.

## Implemented tools

| Tool | Official endpoint | Risk | Approval |
|---|---|---:|---|
| `pocketbase.health.check` | `GET /api/health` | READ | no |
| `pocketbase.collection.list` | `GET /api/collections` | READ | no; superuser upstream |
| `pocketbase.collection.get` | `GET /api/collections/{collection}` | READ | no; superuser upstream |
| `pocketbase.record.list` | `GET /api/collections/{collection}/records` | READ | no |
| `pocketbase.record.get` | `GET /api/collections/{collection}/records/{id}` | READ | no |
| `pocketbase.record.create` | `POST /api/collections/{collection}/records` | WRITE | yes by default |
| `pocketbase.record.update` | `PATCH /api/collections/{collection}/records/{id}` | WRITE | yes by default |
| `pocketbase.record.delete` | `DELETE /api/collections/{collection}/records/{id}` | DESTRUCTIVE | yes + destructive enabled |
| `pocketbase.log.list` | `GET /api/logs` | READ | no; superuser upstream |
| `pocketbase.log.get` | `GET /api/logs/{id}` | READ | no; superuser upstream |
| `pocketbase.log.stats` | `GET /api/logs/stats` | READ | no; superuser upstream |
| `pocketbase.backup.list` | `GET /api/backups` | READ | no; superuser upstream |
| `pocketbase.backup.create` | `POST /api/backups` | HIGH_RISK | yes |
| `pocketbase.backup.delete` | `DELETE /api/backups/{key}` | DESTRUCTIVE | yes + destructive enabled |
| `pocketbase.backup.restore` | `POST /api/backups/{key}/restore` | DESTRUCTIVE | yes + destructive enabled + typed acknowledgement |

## Permission and approval model

READ tools execute without connector approval but remain constrained by PocketBase permissions. WRITE and HIGH_RISK tools require `approved=true` when `POCKETBASE_REQUIRE_WRITE_APPROVAL=true`. DESTRUCTIVE tools additionally require `POCKETBASE_ENABLE_DESTRUCTIVE=true`; the restore tool also requires the exact acknowledgement `RESTORE_AND_RESTART` because restoring restarts the PocketBase process.

The `approved` flag is an enforcement input, not a substitute for an actual human-confirmation UX. Agent hosts must only set it after obtaining appropriate approval.

## Validation and security

- Tool names are stable and provider scoped; no arbitrary URL or raw provider request tool exists.
- Collection names, record IDs and backup keys use constrained character sets and lengths.
- Record payloads are limited to 256 KiB by the connector and prototype-pollution keys are rejected.
- Pagination is bounded to 100 items per page.
- Free-form PocketBase filter/sort expressions are length bounded. PocketBase authorization rules remain the data-access boundary; do not generate filters from untrusted retrieved content without reviewing intent.
- Base URL must be HTTPS except for localhost, and embedded URL credentials are rejected.
- Credentials remain in environment/configuration, outside the LLM-visible tool schema.
- Provider record and log content is untrusted data and cannot alter policy.
- Destructive actions are disabled by default.
- Backup upload/download are intentionally omitted to avoid binary transport and temporary access-token leakage through MCP responses.
- Authentication refresh is intentionally omitted because PocketBase returns a fresh bearer token; exposing that result to an agent would violate credential isolation.

## Reliability, errors, and rate limiting

Every HTTP call has a configurable timeout. Retries are bounded to at most three attempts and apply only to HTTP 429 and 5xx responses. `Retry-After` is honored up to ten seconds; otherwise exponential backoff is used. Validation, authentication, authorization, and ordinary 4xx failures are not retried. PocketBase does not document one universal fixed API rate limit for all deployments; deployments can differ, so the connector treats 429 as the authoritative throttle signal rather than inventing a quota.

PocketBase error status, message, response data, and `Retry-After` are mapped to `PocketBaseApiError`. No automatic destructive retry is performed after a successful response; the generic retry loop only reacts to explicit 429/5xx responses, and operators should configure upstream idempotency/operational safeguards for high-impact actions.

## Testing

Run `npm test`. Tests require no live PocketBase credentials. They cover configuration validation, HTTPS safety, localhost development, approval denial, destructive denial, tool registration, payload limits, health without credentials, provider error mapping, and bounded retry behavior.

## Limitations

This connector intentionally implements a useful operational subset rather than every PocketBase endpoint. It does not expose collection create/update/delete, settings mutation, SQL execution, cron triggering, file-token generation, backup binary upload/download, auth password flows, or realtime subscriptions. Those surfaces either expand administrative risk, introduce credential/token exposure, need binary streaming, or are better handled through application-specific code. Record file upload is also omitted because the current connector accepts JSON only; PocketBase file fields require multipart/form-data.
