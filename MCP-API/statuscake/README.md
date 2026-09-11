# StatusCake MCP/API Connector

Reusable MCP connector for StatusCake monitoring workflows. It exposes StatusCake's official REST API v1 through stable provider-scoped MCP tools with bounded retries, rate-limit handling, strict validation, credential isolation, and approval controls.

## Transport strategy

No official StatusCake MCP server was identified in StatusCake's official developer documentation as of 2026-09-11. This connector therefore uses the official REST API at `https://api.statuscake.com/v1` and exposes it through a local stdio MCP server.

Official sources:

- Developer portal: https://developers.statuscake.com/
- API reference: https://developers.statuscake.com/api/
- Authentication: https://developers.statuscake.com/guides/api/authentication/
- Rate limits: https://developers.statuscake.com/guides/api/ratelimiting/
- SDK configuration/retries: https://developers.statuscake.com/guides/sdks/configuration/

StatusCake also publishes official Go, JavaScript, Python, and Ruby SDK guidance. This connector intentionally uses direct REST calls so its external contract remains small, auditable, and independent of provider SDK code generation.

## Supported capabilities

Implemented tools:

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `statuscake.uptime.list` | REST | READ | none |
| `statuscake.uptime.get` | REST | READ | none |
| `statuscake.uptime.history` | REST | READ | none |
| `statuscake.uptime.alerts` | REST | READ | none |
| `statuscake.uptime.create` | REST | WRITE | configurable; required by default |
| `statuscake.uptime.update` | REST | WRITE | configurable; required by default |
| `statuscake.uptime.delete` | REST | DESTRUCTIVE | explicit + destructive feature enabled |
| `statuscake.heartbeat.list` | REST | READ | none |
| `statuscake.heartbeat.get` | REST | READ | none |
| `statuscake.ssl.list` | REST | READ | none |
| `statuscake.ssl.get` | REST | READ | none |
| `statuscake.pagespeed.list` | REST | READ | none |
| `statuscake.pagespeed.get` | REST | READ | none |
| `statuscake.maintenance_window.list` | REST | READ | none |
| `statuscake.maintenance_window.create` | REST | HIGH_RISK | explicit human approval |
| `statuscake.maintenance_window.delete` | REST | DESTRUCTIVE | explicit + destructive feature enabled |
| `statuscake.contact_group.list` | REST | READ | none |
| `statuscake.contact_group.get` | REST | READ | none |
| `statuscake.location.list` | REST | READ | none |

The capability set focuses on common agent workflows: discover failing checks, inspect run/alert history, review SSL and page-speed state, create/update an uptime monitor, inspect notification groups, enumerate monitoring locations, and manage maintenance windows safely.

## Architecture

```text
MCP client
  -> local stdio MCP server
  -> tool validation + approval policy
  -> StatusCake REST client
  -> HTTPS Bearer authentication
  -> StatusCake API v1
```

Credentials are read only inside the connector configuration/client layer and are never included in tool outputs or prompts.

## Authentication

StatusCake API v1 uses Bearer-token authentication:

```http
Authorization: Bearer <token>
```

Create/manage tokens in the StatusCake account panel. Keep tokens private and rotate exposed tokens.

Required environment variable:

```text
STATUSCAKE_API_TOKEN=
```

Optional configuration:

```text
STATUSCAKE_API_BASE_URL=https://api.statuscake.com/v1
STATUSCAKE_TIMEOUT_MS=15000
STATUSCAKE_MAX_RETRIES=3
STATUSCAKE_REQUIRE_WRITE_APPROVAL=true
STATUSCAKE_ENABLE_DESTRUCTIVE=false
```

The base URL must use HTTPS. The token has the permissions of the associated StatusCake account/token; StatusCake's API does not expose OAuth scopes in the documented bearer-token model. Use a dedicated token/account role with the least privileges available in your StatusCake configuration.

## Install and run

Requires Node.js 20 or newer.

```bash
npm install
npm run build
STATUSCAKE_API_TOKEN=... npm start
```

Configure an MCP client to launch `node dist/src/server.js` with the token supplied through the process environment. The server uses stdio and is compatible with MCP clients that support launching local stdio servers.

## Permission model

`READ` tools execute without approval. `WRITE` tools require `approved: true` by default; administrators can disable that requirement by setting `STATUSCAKE_REQUIRE_WRITE_APPROVAL=false`. `HIGH_RISK` operations always require explicit human approval. `DESTRUCTIVE` tools require both `approved: true` and `STATUSCAKE_ENABLE_DESTRUCTIVE=true`.

Maintenance-window creation is `HIGH_RISK` because it can suppress alerts and affect incident detection. Deleting uptime checks or maintenance windows is `DESTRUCTIVE` and disabled by default.

## Validation and security

Tool inputs use bounded Zod schemas. IDs are constrained to a conservative identifier pattern, list sizes are bounded, check-rate enums match documented StatusCake values, and maintenance windows must contain at least one check ID or tag and have `end_at` later than `start_at`.

The connector does not expose a generic arbitrary-request tool. It does not accept caller-provided API URLs, preventing the tool surface from becoming an SSRF primitive. The configured API base must use HTTPS.

Provider-returned content is treated as untrusted data. Retrieved names, URLs, tags, alert text, or other provider fields must never be interpreted as instructions to change permissions or tool policy.

Approval-only fields are removed before forming provider requests, so StatusCake never receives internal policy metadata such as `approved`.

## Reliability and rate limits

The client applies a request timeout and bounded retries. Automatic retries are limited to idempotent `GET` requests. It retries transient network failures, HTTP `429`, and HTTP `5xx` responses with bounded exponential delay. Write and destructive operations are not automatically retried, avoiding accidental duplicate or irreversible actions.

StatusCake's official documentation states that free/unsubscribed accounts are limited to 60 requests per minute and all accounts have a 5 requests/second burst limit. The API returns `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset`. On `429`, this connector uses `x-ratelimit-reset` when available before retrying a safe read request.

Pagination is exposed with provider-supported `page`/`limit` inputs and limits are capped at 100 to avoid accidental high-volume retrieval.

## Error handling

API failures are mapped to `StatusCakeError` with HTTP status, rate-limit reset information when available, and parsed provider error details. Authentication/authorization/validation failures are not blindly retried. Timeouts are reported distinctly from HTTP failures.

## Tests

Run:

```bash
npm test
```

Unit tests use mocked `fetch` and require no live token. Coverage includes Bearer authentication, JSON parsing, `429` retry behavior, no write retries, authentication failures, and permission/approval enforcement.

## Examples

See `examples/workflows.md` for outage investigation, monitor creation, maintenance scheduling, and destructive-operation examples.

## Limitations

- This connector does not claim an upstream official MCP transport; it wraps the documented REST API.
- It intentionally omits many provider endpoints to keep the tool surface focused and safe.
- It does not create/update contact groups because those actions can alter external notification routing and require broader messaging-policy decisions; read access is provided for inspection.
- It exposes SSL and PageSpeed as read-only tools in this release.
- StatusCake API behavior, plans, limits, and endpoint schemas may change; validate against the official API reference when upgrading the connector.
