# Logz.io MCP/API Connector

Reusable MCP server for scoped Logz.io log-search, alert-triage, alert-management, and dashboard-discovery workflows.

## Transport and official sources

No official Logz.io MCP server was identified in Logz.io's current official API documentation during this implementation. This connector therefore uses the official Logz.io REST API directly and exposes a stable local MCP stdio interface.

Official sources researched:
- https://api-docs.logz.io/docs/logz/logz-io-api/
- https://api-docs.logz.io/docs/logz/search/
- https://api-docs.logz.io/docs/logz/triggered-alerts/
- https://api-docs.logz.io/docs/logz/create-alert/
- https://api-docs.logz.io/docs/logz/get-alert/
- https://api-docs.logz.io/docs/logz/delete-alert/
- https://api-docs.logz.io/docs/logz/logz-io-dashboards/

Logz.io documents account-region API hosts, API-token authentication through `X-API-TOKEN`, and a limit of 100 concurrent API requests per account. Search/scroll responses support and strongly recommend compression.

## Architecture

`MCP client -> strict tool schema -> local risk/approval policy -> credential-isolated Logz.io REST client -> official Logz.io API`.

The API token is read only from process environment and is never accepted as a tool parameter or returned in tool output. Provider content is wrapped with `untrustedProviderData: true` and must be treated as data, never instructions.

## Authentication and region

Set `LOGZ_IO_API_TOKEN` to an account-specific Logz.io API token. Set `LOGZ_IO_API_BASE_URL` to the official regional API origin shown for the account, for example `https://api.logz.io` or an official two-letter regional host. The connector enforces HTTPS and `api*.logz.io` host validation.

Logz.io API tokens can carry significant account privileges. Use a dedicated token/account role with the least provider permissions available and keep it in a secret manager. This connector cannot increase provider permissions.

## Environment

Copy `.env.example` into the host's secret-management workflow. `LOGZ_IO_TIMEOUT_MS` defaults to 15000 ms. `LOGZ_IO_MAX_READ_RETRIES` defaults to 2 and is capped at 5. Write approval is required by default. Destructive operations are disabled by default. `LOGZ_IO_APPROVAL_SECRET` must remain outside model context.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm test
npm start
```

The server uses standard MCP stdio transport. MCP clients that can launch local stdio servers can execute `node src/server.js` with secrets injected through their secure environment mechanism.

## Tools

| Tool | REST operation | Risk | Approval |
|---|---|---|---|
| `logz-io.log.search` | `POST /v1/search` | READ | no |
| `logz-io.alert.list` | `GET /v2/alerts` | READ | no |
| `logz-io.alert.get` | `GET /v2/alerts/{id}` | READ | no |
| `logz-io.alert.triggered.list` | `POST /v1/alerts/triggered-alerts` | READ | no |
| `logz-io.alert.create` | `POST /v2/alerts` | HIGH_RISK | exact approval |
| `logz-io.alert.delete` | `DELETE /v2/alerts/{id}` | DESTRUCTIVE | exact approval + feature gate |
| `logz-io.dashboard.list` | `GET /perses-public/api/v1/dashboards` | READ | no |
| `logz-io.dashboard.folder.get` | `GET /perses-public/api/v1/projects/{id}` | READ | no |
| `logz-io.dashboard.folder.list_dashboards` | `GET /perses-public/api/v1/projects/{id}/dashboards` | READ | no |
| `logz-io.dashboard.creators.list` | `GET /perses-public/api/v1/dashboards/users` | READ | no |

Alert creation is HIGH_RISK because alerts can be enabled immediately and can notify configured external recipients. Alert deletion is DESTRUCTIVE and disabled unless `LOGZ_IO_ENABLE_DESTRUCTIVE=true`.

## Approval model

READ tools may execute automatically. Gated actions require a 64-character HMAC-SHA256 approval token over the exact tool name and canonical JSON payload using `LOGZ_IO_APPROVAL_SECRET`. Changing the target or payload invalidates approval. The approval secret must be held by a trusted human-approval/control-plane component, never supplied to the LLM.

The intended flow is Read -> Recommend/Prepare -> Human reviews exact action -> Trusted controller signs exact payload -> Execute.

## Reliability and rate limits

Every request has a bounded timeout and supports cancellation. Automatic retries are limited to GET requests and only for network failures, HTTP 429, 502, 503, and 504. Retries are bounded, use exponential backoff, and honor `Retry-After`. Mutating calls are never blindly retried. Authentication, permission, and validation failures are not treated as transient.

Logz.io documents 100 concurrent API requests per account. Search requests are explicitly bounded by this connector and send `Accept-Encoding: gzip, deflate`. The connector does not automatically drain scroll cursors or large result sets.

## Validation and security

- No arbitrary URL or raw HTTP tool is exposed.
- Upstream hosts are HTTPS and restricted to official Logz.io API hostnames.
- Alert IDs, UUIDs, result sizes, tags, strings, and destructive confirmations are validated.
- Credentials remain inside the connector client layer.
- Provider-returned logs, alert descriptions, dashboard content, and error text are untrusted data.
- Retrieved content cannot change risk classifications, credentials, or approval policy.
- Destructive deletion is disabled by default and never retried.
- Search is intentionally read-only at the provider level even though its REST verb is POST.

## Errors

Provider failures become `LogzioError` values with HTTP status, optional retry timing, and bounded provider details. Secrets are not included. Timeout/cancellation and validation failures are surfaced as MCP tool errors.

## Testing

`npm test` uses Node's built-in test runner and mocked `fetch`; no live Logz.io credentials are required. Tests cover authentication configuration, official-host enforcement, tool/risk registration, exact-payload approval, destructive default denial, credential isolation, untrusted-response wrapping, bounded throttling retry, write no-retry behavior, and destructive confirmation validation.

## Limitations

This connector intentionally implements a focused subset of Logz.io rather than every API. It does not expose user/account administration, token management, notification-endpoint mutation, sub-account mutation, dashboard writes, alert updates, scroll-cursor traversal, arbitrary Elasticsearch requests beyond the bounded search body, or generic REST passthrough. Logz.io API availability depends on plan and account permissions. If a future official Logz.io MCP server becomes available, it should be reviewed and allowlisted capability-by-capability before replacing these REST routes.

See `examples/workflows.md` for representative calls and approval expectations.
