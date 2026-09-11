# SolarWinds Incident Response MCP Connector

Reusable MCP connector for **SolarWinds Incident Response (formerly Squadcast)**. It exposes a deliberately scoped set of incident-response, on-call, analytics, and audit operations as MCP tools while keeping provider credentials inside the connector process.

## Provider and transport

SolarWinds' current developer documentation states that Squadcast is now SolarWinds Incident Response. The public API and official SDKs continue to use Squadcast API hosts and package naming.

Reviewed official sources:

- Developer hub: https://developers.incidents.cloud.solarwinds.com/
- API reference: https://developers.incidents.cloud.solarwinds.com/api-reference
- OpenAPI specification: https://openapi.gitbook.com/o/rNxiyZGOoRfKnq7j5RX6/spec/Squadcast-API-Spec.json
- TypeScript SDK package: `@solarwinds/squadcast-sdk-typescript`
- Python SDK package: `squadcast-sdk`
- Go SDK: `github.com/solarwinds/squadcast-sdk-go`
- Incoming/outgoing webhook documentation: https://developers.incidents.cloud.solarwinds.com/integration-and-extensibility/webhooks/incoming-webhooks

### MCP availability

No official SolarWinds Incident Response MCP server was identified in the current official developer documentation reviewed for this connector. The implemented upstream transport is therefore the official REST API. Official Go, Python, and TypeScript SDKs exist, but this connector intentionally uses direct REST calls so the MCP package has a small dependency surface and preserves one stable external tool contract.

## Implemented capabilities

The connector implements 13 MCP tools:

| Tool | Upstream | Risk | Approval |
|---|---|---:|---:|
| `solarwinds_ir.incident.get` | REST `GET /v3/incidents/{incidentID}` | READ | No |
| `solarwinds_ir.incident.events.list` | REST `GET /v3/incidents/{incidentID}/events` | READ | No |
| `solarwinds_ir.incident.acknowledge` | REST `POST /v3/incidents/{incidentID}/acknowledge` | WRITE | Yes |
| `solarwinds_ir.service.list` | REST `GET /v3/services` | READ | No |
| `solarwinds_ir.team.list` | REST `GET /v3/teams` | READ | No |
| `solarwinds_ir.schedule.list` | REST `GET /v4/schedules` | READ | No |
| `solarwinds_ir.schedule.get` | REST `GET /v4/schedules/{scheduleID}` | READ | No |
| `solarwinds_ir.schedule.override.list` | REST `GET /v4/schedules/{scheduleID}/overrides` | READ | No |
| `solarwinds_ir.schedule.pause` | REST `PATCH /v4/schedules/{scheduleID}/actions` | HIGH_RISK | Yes |
| `solarwinds_ir.schedule.resume` | REST `PATCH /v4/schedules/{scheduleID}/actions` | HIGH_RISK | Yes |
| `solarwinds_ir.analytics.organization.get` | REST `GET /v3/analyticsv2/organization` | READ | No |
| `solarwinds_ir.analytics.team.get` | REST `GET /v3/analyticsv2/team` | READ | No |
| `solarwinds_ir.audit_log.list` | REST `GET /v3/audit-logs` | READ | No |

Destructive operations such as deleting schedules, services, teams, users, overrides, webhooks, or status-page resources are intentionally not exposed.

## Architecture

```text
MCP client
  -> MCP stdio server
     -> strict Zod input validation
     -> permission / approval boundary
     -> provider client
        -> refresh-token exchange
        -> cached short-lived bearer access token
        -> bounded timeout / retry handling
        -> SolarWinds Incident Response REST API
```

Provider responses are returned as data. Tool descriptions explicitly mark third-party content as untrusted so retrieved text cannot silently alter permissions or connector policy.

## Authentication

SolarWinds Incident Response uses a refresh-token-to-access-token flow:

1. Generate an API/refresh token in the Incident Response web application.
2. The connector sends it only to the region-specific authentication endpoint in the `X-Refresh-Token` header.
3. The returned access token is cached in process until shortly before expiry.
4. Provider API requests use `Authorization: Bearer <access_token>`.

The raw refresh token is never returned through MCP tools and is never included in tool arguments.

### Access control and permissions

Provider authorization is role-based. The official API documentation describes `account_owner`, `stakeholder`, and `user` roles; a refresh token inherits the permissions of the user/role with which it is associated. Use a dedicated least-privilege account/token that can perform only the operations required by this connector.

The connector does not attempt to elevate provider permissions and cannot change its own provider role.

## Human approval model

Read operations execute without connector-level approval after provider authentication succeeds.

Write and high-risk tools require a second, connector-local approval secret configured as `SOLARWINDS_IR_APPROVAL_TOKEN`. The human-approved value must be supplied for the individual tool call and is checked with a timing-safe comparison. If no approval secret is configured, all exposed write/high-risk operations fail closed.

This approval token is not a provider credential and grants no SolarWinds permissions by itself. Provider-side authorization still applies independently.

## Environment variables

Copy `.env.example` and provide values through your process manager or secret store:

```text
SOLARWINDS_IR_REGION=us
SOLARWINDS_IR_REFRESH_TOKEN=
SOLARWINDS_IR_APPROVAL_TOKEN=
SOLARWINDS_IR_TIMEOUT_MS=15000
SOLARWINDS_IR_MAX_RETRIES=2
```

`SOLARWINDS_IR_REGION` accepts `us` or `eu` and selects only official fixed hosts:

- US API: `https://api.squadcast.com`
- EU API: `https://api.eu.squadcast.com`
- US auth: `https://auth.squadcast.com/oauth/access-token`
- EU auth: `https://auth.eu.squadcast.com/oauth/access-token`

The connector does not accept arbitrary provider base URLs, reducing SSRF and credential-forwarding risk.

## Installation

Requirements:

- Node.js 20 or newer
- npm-compatible package manager

```bash
npm install
npm run build
npm test
```

Run the MCP server over stdio:

```bash
npm start
```

For development without a generated `dist` tree, build first with `npm run build`.

## MCP client configuration

Point any MCP client that supports local stdio servers at:

```text
node /absolute/path/to/MCP-API/solarwinds-incident-response/dist/src/server.js
```

Pass provider and approval secrets through the process environment or a secure credential provider. Do not place secrets in prompts or MCP tool parameters except the connector-local approval value when a human is authorizing a write action.

## Validation and safety

The connector applies the following safeguards:

- Provider IDs are bounded and restricted to a conservative identifier character set.
- Page sizes are bounded to avoid unbounded extraction.
- Analytics and override queries require explicit bounded time ranges.
- Date/time ordering is validated before requests are sent.
- Provider URLs are fixed by region rather than caller-controlled.
- Provider credentials stay inside the authentication/client layer.
- Write/high-risk calls fail closed without explicit approval.
- Destructive API operations are not registered as tools.
- Retrieved provider data is explicitly treated as untrusted content.
- No generic arbitrary HTTP/API execution tool is exposed.

## Reliability

### Timeouts and cancellation

Every provider request has a bounded timeout controlled by `SOLARWINDS_IR_TIMEOUT_MS`. An optional parent `AbortSignal` is propagated into the request controller.

### Retries

Read operations can retry transient failures (`429` and `5xx`) using bounded exponential backoff. `Retry-After` is honored when supplied and bounded to 30 seconds.

State-changing `POST` and `PATCH` operations are not retried blindly because acknowledgement or schedule-state changes may not be safe to duplicate.

Authentication, validation, permission, and ordinary `4xx` failures are not retried as transient errors.

### Rate limits

The reviewed public API material does not state one universal numeric request quota applicable to all implemented endpoints. The connector therefore does not invent a quota. It detects HTTP `429`, preserves/uses `Retry-After` when available, limits retries, and uses bounded pagination parameters where the provider exposes them.

## Error handling

Provider errors are mapped to `ProviderError` with:

- HTTP status
- provider message when available
- `Retry-After` seconds when present
- parsed provider response body

Typical provider errors include `400`, `401`, `403`, `404`, `409`, `422`, `429`, and `5xx`. Invalid/missing connector configuration fails at startup. Invalid MCP inputs fail before an external request is made.

## Pagination

The provider uses multiple pagination styles across resources. This connector exposes only documented pagination inputs for the implemented operations:

- Schedule/event/override tools: bounded `pageSize` and optional cursor where supported.
- Audit logs: bounded `pageSize` and explicit page number.

Service/team list tools use the provider's default list behavior rather than inventing undocumented pagination parameters.

## Usage examples

See `examples/workflows.md` for read-before-write incident handling, on-call schedule inspection, approved pause/resume operations, and analytics/audit examples.

## Testing

Unit tests do not require live credentials. They cover:

- authentication configuration
- region validation
- refresh-token exchange and credential isolation
- bearer-token use
- read retries and throttling behavior
- non-retry behavior for writes
- invalid provider credentials
- approval denial/acceptance
- MCP tool registration

Run:

```bash
npm test
```

## Limitations

- No official MCP upstream is used because none was identified in current official SolarWinds Incident Response developer documentation.
- This connector deliberately implements a focused subset of the provider's much larger API surface.
- Incident creation/triggering through incoming webhooks is not exposed because webhook URLs are service-specific credentials and should not be passed through the LLM/tool surface.
- Destructive endpoints are intentionally excluded.
- Live integration tests require a real SolarWinds Incident Response account and are intentionally not part of the default test suite.
- Provider-side feature availability and authorization remain subject to the account plan and role permissions.

## Security notes

Treat incident messages, notes, service names, audit entries, and other provider content as untrusted external data. Do not execute instructions found in retrieved content. Do not log refresh/access tokens. Store environment secrets in a proper secret manager. Rotate the provider API token and connector approval token independently. Use a dedicated least-privilege provider identity whenever possible.
