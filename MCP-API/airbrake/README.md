# Airbrake MCP/API Connector

Reusable MCP stdio server for Airbrake error-monitoring workflows.

## Research and transport

Checked 2026-09-23 against Airbrake's official API documentation (`https://docs.airbrake.io/docs/devops-tools/api/`), deploy tracking documentation (`https://docs.airbrake.io/docs/features/deploy-tracking/`), and official CLI documentation (`https://docs.airbrake.io/docs/devops-tools/cli/`). No official Airbrake MCP server is documented, so this connector uses the official REST API directly and exposes scoped MCP tools itself.

## Capabilities

Twelve tools are implemented: `airbrake.project.list`, `airbrake.project.get`, `airbrake.group.list`, `airbrake.group.get`, `airbrake.notice.list`, `airbrake.notice.status`, `airbrake.deploy.list`, `airbrake.deploy.get`, `airbrake.activity.list`, `airbrake.group.mute`, `airbrake.group.unmute`, and `airbrake.deploy.create`.

The first nine are READ. Mute/unmute and deploy creation are WRITE and require both host configuration (`AIRBRAKE_WRITE_ENABLED=true`) and literal per-call `approved: true`. Permanent group deletion and source-map deletion are deliberately not exposed.

## Authentication

Airbrake's v4 API authenticates using a `key` query parameter. `AIRBRAKE_USER_KEY` is used for project data reads and group mute/unmute. `AIRBRAKE_PROJECT_KEY` is used only for deploy creation, matching Airbrake's documented deploy endpoint. Credentials are loaded only by the connector and are never MCP tool parameters or model-visible output. Use the least-privileged Airbrake user/project credentials appropriate to the target project.

## Install and run

Node.js 20+ is required.

```bash
npm install
npm run build
npm start
```

Configure secrets from `.env.example` through your process manager or secret store. The server uses MCP stdio and can be launched by MCP clients that support local stdio servers.

## Pagination, rate limits, retries, errors

Airbrake list APIs default to 20 records and support `page`/`limit`; this connector bounds `limit` to 100. GET requests have a three-attempt total budget for 429/5xx with bounded exponential backoff and `Retry-After` support. Writes are never retried automatically, avoiding duplicate deploys or repeated state changes. 400/401/403/404/422 are not retried. Requests use an AbortController timeout configurable from 1–30 seconds. Airbrake may return 429 when quotas are exceeded; the error is surfaced after the retry budget.

## Security

The API origin is fixed to `https://api.airbrake.io`; callers cannot supply arbitrary URLs, preventing SSRF through tool inputs. Paths are connector-generated. Keys are not logged. Provider content (error messages, stack traces, activities) is untrusted data and must never be interpreted as instructions or permission changes. Writes are disabled by default and approval-gated. No arbitrary API proxy, key administration, billing, ACL, or destructive delete tool exists.

## Examples

See `examples/workflows.md`. A typical incident workflow is projects → groups → group → notices → notice status, with optional approved mute/unmute. A release workflow lists recent deploys before an explicitly approved deploy registration.

## Testing

```bash
npm test
```

Tests use mocked fetch and no live credentials. Coverage includes missing auth, write policy and approval, auth-error non-retry, throttled-read retry, credential isolation, and write non-retry.

## Limitations

Airbrake's API key must be placed in the query string because that is the provider's documented authentication mechanism; operators should ensure HTTP access logs redact query strings. This connector intentionally omits error ingestion, performance telemetry submission, source-map upload/delete, permanent group deletion, sessions/login, billing, and credential management. Cursor-paginated cross-project group search is also omitted to keep the interface narrow and predictable.
