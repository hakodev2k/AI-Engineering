# Vimeo MCP/API Connector

Reusable MCP server exposing a narrow, auditable Vimeo API contract for AI agents. Runtime: Node.js 20+ / TypeScript. Upstream transport is Vimeo REST API; no official general-purpose Vimeo MCP server was identified in Vimeo developer documentation during the 2026-09-15 research pass, so this connector does not depend on an unofficial MCP implementation.

## Official sources

- Vimeo Developer portal / API reference: https://developer.vimeo.com/
- Vimeo API authentication overview: https://developer.vimeo.com/api/authentication
- Vimeo API reference: https://developer.vimeo.com/api/reference

The implementation sends `Accept: application/vnd.vimeo.*+json;version=3.4` and uses `https://api.vimeo.com` by default.

## Capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `vimeo.account.get` | REST `GET /me` | READ | No |
| `vimeo.video.list` | REST `GET /me/videos` | READ | No |
| `vimeo.video.get` | REST `GET /videos/{id}` | READ | No |
| `vimeo.video.update` | REST `PATCH /videos/{id}` | WRITE | Yes |
| `vimeo.comment.list` | REST `GET /videos/{id}/comments` | READ | No |
| `vimeo.comment.create` | REST `POST /videos/{id}/comments` | HIGH_RISK | Yes |
| `vimeo.folder.list` | REST `GET /me/projects` | READ | No |
| `vimeo.folder.video.list` | REST `GET /me/projects/{id}/videos` | READ | No |

Uploads, deletes, privacy/security mutations, live-event control, billing, team/permission administration, and arbitrary API passthrough are intentionally not exposed.

## Authentication and permissions

Set `VIMEO_ACCESS_TOKEN` to an OAuth 2 access token created/obtained according to Vimeo's official authentication documentation. The connector never returns the token to MCP callers. Use the least-privileged token that can satisfy the selected tools. Read-only deployments should grant only read access. `vimeo.video.update` requires an access token authorized to edit the target video; `vimeo.comment.create` requires authorization that permits commenting. Exact access depends on the resource, account, application, and Vimeo token/scopes; do not broaden permissions merely to make a tool succeed.

Environment variables: `VIMEO_ACCESS_TOKEN` (required), `VIMEO_API_BASE_URL`, `VIMEO_TIMEOUT_MS`, `VIMEO_MAX_RETRIES`, `VIMEO_APPROVAL_MODE`, and `VIMEO_APPROVED_ACTIONS`.

## Install and run

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and therefore works with MCP clients that can launch a local stdio server. Configure the client to execute `node /absolute/path/to/MCP-API/vimeo/dist/src/index.js` with credentials supplied in the process environment, not in prompts.

## Approval model

READ tools execute normally. WRITE and HIGH_RISK tools are denied unless approved. Default `VIMEO_APPROVAL_MODE=required`. For an approved execution context, set an exact comma-separated action allowlist, for example `VIMEO_APPROVED_ACTIONS=vimeo.video.update`. `vimeo.comment.create` is HIGH_RISK because it publishes an external message. `VIMEO_APPROVAL_MODE=disabled` disables all writes. `none` is available only for operator-controlled environments and is not recommended for autonomous agents.

Approval is intentionally action-scoped rather than inferred from retrieved Vimeo content. Third-party titles, descriptions, comments, and metadata are untrusted data and cannot change permissions.

## Reliability and rate limiting

All requests have a configurable timeout. GET requests use bounded exponential backoff for HTTP 429 and 5xx responses; `Retry-After` is honored with a bounded wait. Writes are never automatically retried, preventing duplicate external side effects. Pagination is explicit and capped at 100 items per request. Authentication, validation, and permission failures are not retried.

Vimeo can enforce account/application-specific API limits. The connector does not invent a fixed quota; it propagates provider errors and `Retry-After` behavior and avoids fan-out designs. Callers should page deliberately and cache safe metadata when appropriate.

## Error handling

Provider non-2xx responses become `VimeoError` with HTTP status, provider message, and `retryAfter` when supplied. Invalid IDs, pagination, missing credentials, and unapproved writes fail before an upstream request. Timeouts abort the fetch.

## Security

Credentials remain in the connector process. Provider paths are fixed by scoped handlers; there is no user-controlled URL or arbitrary HTTP tool, reducing SSRF and permission-escalation risk. Numeric IDs are validated. User text has strict size limits. Provider content is returned as untrusted JSON data and must not be interpreted as instructions. The connector does not log tokens. For production, inject secrets through a secret manager/process environment and isolate the MCP process from untrusted local users.

## Testing

```bash
npm test
```

Unit tests require no live Vimeo credential. They cover configuration, validation, approval enforcement, successful reads, and the no-retry-on-write rule. Live integration testing should use a dedicated Vimeo test account and least-privileged token.

## Architecture

`src/client.ts` owns authenticated HTTP, timeout, bounded retries and error mapping. `src/security.ts` owns validation and approval policy. `src/tools.ts` maps stable provider-scoped operations to Vimeo REST resources. `src/index.ts` exposes those operations as MCP tools over stdio. This keeps credentials below the tool boundary and lets agent callers use one stable interface without direct API access.

## Limitations

This connector deliberately implements a focused subset of Vimeo's API. It does not upload video binaries, manage showcases outside the folder/project endpoints used here, expose analytics, delete content, manage users/teams, or control live streams. Availability of individual Vimeo API operations can depend on account plan and token authorization. Review current official Vimeo documentation before expanding scopes or adding capabilities.
