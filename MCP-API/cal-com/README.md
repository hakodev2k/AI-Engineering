# Cal.com MCP/API Connector

Reusable MCP stdio connector for Cal.com scheduling workflows. It exposes provider-scoped tools while keeping Cal.com credentials inside the connector.

## Upstream strategy
Cal.com operates an official remote MCP server at `https://mcp.cal.com/mcp`, documented for OAuth-based interactive MCP clients. This package uses Cal.com REST API v2 as its upstream because API keys and OAuth bearer tokens provide a stable non-interactive service contract. The public external interface remains MCP.

Official sources reviewed 2026-08-30:
- https://cal.com/docs/mcp-server
- https://cal.com/docs/api-reference/v2/introduction
- https://cal.com/docs/api-reference/v2/bookings/create-a-booking
- https://cal.com/docs/api-reference/v2/bookings/cancel-a-booking
- https://cal.com/docs/api-reference/v2/bookings/reschedule-a-booking
- https://cal.com/docs/api-reference/v2/bookings/request-to-reschedule-a-booking
- https://cal.com/docs/api-reference/v2/event-types/get-all-event-types
- https://cal.com/docs/api-reference/v2/slots/get-available-time-slots-for-an-event-type

API v1 was discontinued February 28, 2026; this connector only targets API v2.

## Tools
| Tool | Risk | Approval |
|---|---|---|
| `cal.event_type.list` | READ | no |
| `cal.event_type.get` | READ | no |
| `cal.availability.slots` | READ | no |
| `cal.booking.list` | READ | no |
| `cal.booking.get` | READ | no |
| `cal.booking.references` | READ | no |
| `cal.booking.create` | WRITE | yes |
| `cal.booking.reschedule` | WRITE | yes |
| `cal.booking.request_reschedule` | WRITE | yes |
| `cal.booking.confirm` | WRITE | yes |
| `cal.booking.decline` | WRITE | yes |
| `cal.booking.cancel` | DESTRUCTIVE | yes + disabled by default |

## Authentication and scopes
Set `CAL_API_KEY` to a Cal.com API key (`cal_...`) or OAuth/managed-user access token. The connector sends `Authorization: Bearer <token>`. For OAuth, grant only scopes required by enabled tools; read tools require the corresponding booking/event-type read permissions, while booking mutation endpoints require booking write permission. Cal.com API keys inherit the permissions of their owning account, so use a dedicated least-privilege identity where possible.

## Environment
`CAL_API_URL` defaults to `https://api.cal.com`. `CAL_TIMEOUT_MS` defaults to 15000. `CAL_MAX_RETRIES` defaults to 3 (max 5). `CAL_APPROVAL_SECRET` enables payload-bound approvals. `CAL_ENABLE_DESTRUCTIVE` defaults to false.

## Install / run
Node.js 20+:
```bash
npm install
npm run check
npm test
npm start
```
Configure the executable as a stdio MCP server in any MCP client that supports local stdio servers.

## Approval model
READ operations run without approval. WRITE and DESTRUCTIVE tools require an HMAC-SHA256 approval token over the exact tool name and canonical payload excluding `approval_token`. Changing the attendee, time, booking UID, reason, or any other argument invalidates approval. Cancellation also requires `CAL_ENABLE_DESTRUCTIVE=true`, which is only process configuration and cannot be changed by a tool call.

## Reliability and rate limits
Safe GET requests retry HTTP 429/502/503/504 with bounded exponential backoff and honor numeric `Retry-After`. Mutations are never blindly retried. Every call has a bounded timeout and forwards MCP cancellation signals. Cal.com does not document a single universal request quota across every API product/plan, so the connector does not invent one.

## Security
The API origin must be HTTPS and cannot embed credentials/query/fragment, reducing SSRF/config injection risk. There is no arbitrary URL/request tool. Provider content is explicitly returned as untrusted data. Token/secret/password/API-key-shaped response fields are redacted. Credentials never appear in tool schemas. External scheduling mutations require human approval, and cancellation is disabled by default.

## Tests
Unit tests require no live credentials and cover config validation, tool-policy parity, approval binding, destructive denial, secret redaction, auth/version headers, authentication failure behavior, and mutation retry safety.

## Limitations
This package does not proxy Cal.com's official remote MCP because its documented flow is interactive OAuth. It does not manage API keys, OAuth clients, billing, organization membership, or calendar credentials. It intentionally exposes a bounded scheduling subset rather than every API endpoint.
