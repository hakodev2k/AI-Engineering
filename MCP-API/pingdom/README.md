# Pingdom MCP/API Connector

Reusable MCP server for SolarWinds Pingdom. It exposes stable, provider-scoped tools while keeping the Pingdom API token inside the connector process.

## Upstream strategy

The connector uses the official **Pingdom Public API 3.1** over HTTPS. No official Pingdom MCP server was identified in Pingdom's official API documentation during implementation, so the connector does not depend on an unofficial upstream MCP server. It presents its own MCP stdio interface and routes supported capabilities to the official REST API.

Official sources:
- Pingdom Public API 3.1: https://docs.pingdom.com/api/
- API base: `https://api.pingdom.com/api/3.1`

Pingdom documents Bearer-token authentication, HTTPS, JSON request bodies for POST/PUT/DELETE, Read versus Read/Write token access levels, and recommends caching/avoiding excessive polling. Provider responses are treated as untrusted data.

## Runtime and architecture

Requires Node.js 20+. The flow is:

`MCP client -> strict tool schema -> permission/approval policy -> Pingdom client -> official REST API`

Credentials are loaded from environment variables by the connector and are never tool parameters or returned to the caller. The API host is pinned to `api.pingdom.com` to avoid SSRF through base-URL configuration.

## Authentication and least privilege

Create an API token in Pingdom and set `PINGDOM_API_TOKEN`. Use a token with **Read access** when deploying only read tools. A **Read/Write** token is required for operations that create, modify, or delete provider resources.

Set `PINGDOM_APPROVAL_SECRET` to a random secret of at least 32 characters. Write and destructive tools require a 64-character HMAC-SHA256 approval value bound to the exact tool name and exact arguments. Generate this approval in a trusted host/human-approval layer; never expose the approval secret to the LLM.

Destructive tools additionally require `PINGDOM_ENABLE_DESTRUCTIVE=true`, which is false by default.

## Environment

Copy `.env.example` into the secret-management mechanism used by the host process. Do not commit real values.

- `PINGDOM_API_TOKEN` — required Pingdom API token.
- `PINGDOM_APPROVAL_SECRET` — required host-side approval-signing secret, minimum 32 characters.
- `PINGDOM_API_BASE_URL` — optional; defaults to the official API 3.1 URL and must remain on `api.pingdom.com`.
- `PINGDOM_TIMEOUT_MS` — per-request timeout, default 10000.
- `PINGDOM_MAX_READ_RETRIES` — bounded retries for transient read failures, default 2, maximum 5.
- `PINGDOM_ENABLE_DESTRUCTIVE` — enables destructive tools when `true`; default false.

## Installation and execution

```bash
npm install
npm run build
npm test
npm start
```

`npm start` runs an MCP server over stdio. Any MCP client capable of launching a stdio server can integrate it by executing the built `dist/src/server.js` process with the required environment variables. Compatibility depends on the client's support for standard MCP stdio transport; no provider-specific client integration is required.

## Implemented tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `pingdom.check.list` | REST GET `/checks` | READ | No | List uptime checks with pagination/tag filters. |
| `pingdom.check.get` | REST GET `/checks/{checkid}` | READ | No | Read one check and optionally include team connections. |
| `pingdom.check.summary` | REST GET `/summary.average/{checkid}` | READ | No | Get average response/uptime summary data. |
| `pingdom.probe.list` | REST GET `/probes` | READ | No | List Pingdom probes. |
| `pingdom.alert.list` | REST GET `/actions` | READ | No | List alert actions/events with filters. |
| `pingdom.maintenance.list` | REST GET `/maintenance` | READ | No | List maintenance windows. |
| `pingdom.maintenance.get` | REST GET `/maintenance/{id}` | READ | No | Read one maintenance window. |
| `pingdom.maintenance.occurrence.list` | REST GET `/maintenance.occurrences` | READ | No | List maintenance occurrences. |
| `pingdom.account.credits.get` | REST GET `/credits` | READ | No | Read account/check/SMS credit information. |
| `pingdom.check.create` | REST POST `/checks` | WRITE | Yes | Create an uptime check. |
| `pingdom.check.update` | REST PUT `/checks/{checkid}` | WRITE | Yes | Modify an uptime check. |
| `pingdom.maintenance.create` | REST POST `/maintenance` | WRITE | Yes | Create a maintenance window. |
| `pingdom.maintenance.update` | REST PUT `/maintenance/{id}` | WRITE | Yes | Modify a maintenance window. |
| `pingdom.check.delete` | REST DELETE `/checks` | DESTRUCTIVE | Yes + opt-in | Delete one selected check using Pingdom's documented bulk-delete operation. |
| `pingdom.maintenance.delete` | REST DELETE `/maintenance/{id}` | DESTRUCTIVE | Yes + opt-in | Delete a future maintenance window. |

The connector deliberately does not expose an unrestricted HTTP/request passthrough. It also does not expose every Pingdom API endpoint; the selected surface targets common monitoring, incident-analysis, and maintenance workflows.

## Input validation

MCP schemas are strict. IDs must be positive integers, Unix timestamps must be non-negative integers, ports are limited to 1–65535, list sizes are bounded, enumerations are constrained to documented values used by the connector, and unknown fields are rejected. Maintenance creation requires `to > from`; an update that supplies both bounds enforces the same relationship.

Check creation requires `name` and `hostname`. Optional fields implemented are check `type`, `resolution`, `paused`, and `port`. Maintenance creation/update supports description, start/end, effective end, recurrence type/repeat interval, uptime-check IDs, and transaction-check IDs.

## Permission and approval model

`READ` tools may execute automatically with an appropriately scoped Pingdom token. `WRITE` tools require explicit human approval. `DESTRUCTIVE` tools require argument-bound approval and are disabled at the connector level unless the operator opts in.

Approval tokens are HMAC-SHA256 digests. This prevents an agent from taking an approval for one call and silently applying it to different arguments. The signing secret remains outside the tool interface.

## Reliability and rate limits

The client uses per-request cancellation/timeouts. GET requests can retry only bounded transient failures: HTTP 429, 502, 503, 504, and transient network failures. Backoff is exponential and honors numeric `Retry-After` where supplied. POST, PUT, and DELETE are never blindly retried, preventing duplicate or destructive side effects.

Pingdom advises clients to cache suitable data and not poll more frequently than useful. The connector exposes bounded pagination rather than automatically walking arbitrary result sets. It does not assume a fixed undocumented numeric account-wide request quota; provider throttling is surfaced through the API error and `Retry-After` is preserved internally for retry decisions.

## Error handling

Non-success provider responses become `PingdomError` values carrying HTTP status, optional retry-after information, and parsed response details. Authentication/permission/validation failures are not retried. Timeout and caller cancellation abort the request. Provider content is returned in an envelope shaped like:

```json
{"source":"pingdom","untrusted":true,"status":200,"data":{}}
```

The `untrusted` marker is intentional: check names, hostnames, maintenance descriptions, and other remote content are data and must never be interpreted as tool instructions, permission changes, or system policy.

## Security considerations

- Bearer credentials stay in the authentication/client layer and are never returned in tool output.
- HTTPS and the official `api.pingdom.com` hostname are enforced for upstream API configuration.
- Tool inputs cannot select arbitrary URLs or arbitrary REST endpoints.
- Retrieved provider content is explicitly marked untrusted.
- Write approvals are cryptographically bound to exact calls.
- Deletion is disabled by default.
- Logs in this implementation do not emit request authorization headers or credential values.
- Use process-level secret storage, isolated service accounts/tokens, and the minimum Pingdom token access level required by enabled tools.

## Testing

`npm test` uses mocks and does not require live Pingdom credentials. Tests cover bearer authentication, untrusted response wrapping, bounded read retries, non-retry of writes, input validation, query-name mapping, human approval enforcement, destructive-operation denial, documented check deletion routing, and maintenance interval validation.

Run TypeScript validation/build with:

```bash
npm run build
```

## Examples

See `examples/workflows.md` for a read-only diagnostic flow, approved maintenance creation, and destructive deletion behavior.

## Limitations

- No official Pingdom MCP transport is used; REST API 3.1 is the upstream transport.
- The connector intentionally implements a focused subset of API 3.1, not raw endpoint access.
- OAuth is not used by this connector; Pingdom's Public API documentation specifies API-token Bearer authentication.
- Webhook/integration management is not exposed because it was not needed for the selected core workflows and this connector does not invent undocumented tool contracts.
- Normal tests are mocked; validating an account's exact enabled Pingdom product features requires a real token in a separate integration-test environment.
