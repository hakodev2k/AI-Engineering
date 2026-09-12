# Onfleet MCP/API Connector

Reusable Model Context Protocol (MCP) server for safe agent access to Onfleet delivery operations.

## Provider and transport

- Provider: Onfleet
- External interface: MCP over stdio
- Upstream transport: official Onfleet REST API v2 (`https://onfleet.com/api/v2`)
- Official MCP server: none identified during implementation; this connector therefore uses the official REST API directly.
- Runtime: Node.js 20+

Official references used:

- API reference: https://docs.onfleet.com/reference
- Authentication: https://docs.onfleet.com/reference/authentication
- Scoped API keys: https://docs.onfleet.com/reference/scope-api-key
- Throttling: https://docs.onfleet.com/reference/throttling
- Tasks: https://docs.onfleet.com/reference/list-tasks and https://docs.onfleet.com/reference/get-single-task and https://docs.onfleet.com/reference/create-task
- Workers: https://docs.onfleet.com/reference/list-workers and https://docs.onfleet.com/reference/get-single-worker and https://docs.onfleet.com/reference/get-workers-by-location
- Teams: https://docs.onfleet.com/reference/list-teams
- Recipients: https://docs.onfleet.com/reference/find-recipient
- Route plans: https://docs.onfleet.com/reference/routeplan
- Webhooks: https://docs.onfleet.com/reference/webhooks, https://docs.onfleet.com/reference/create-webhook, https://docs.onfleet.com/reference/list-webhooks, https://docs.onfleet.com/reference/delete-webhook

## Architecture

```text
MCP client
  -> MCP stdio server
  -> strict Zod tool schema
  -> permission / approval policy
  -> fixed Onfleet REST operation
  -> credential-isolated HTTP client
  -> Onfleet API
```

The API key is read only by the connector process and is never accepted as an MCP tool argument or returned to the model.

## Authentication and least privilege

Onfleet authenticates API requests with HTTP Basic authentication where the API key is the username and the password is blank. Set `ONFLEET_API_KEY`; do not embed a key in MCP configuration text that may be exposed to an LLM.

Onfleet supports scoped API keys that can be restricted to tasks created by that key and related webhook data. Prefer such a scoped key when your workflow only needs those resources. Broader read tools such as worker/team/recipient discovery require a key that can access those resources.

## Environment

Copy `.env.example` and provide values through your process manager or secret store:

```text
ONFLEET_API_KEY=
ONFLEET_BASE_URL=https://onfleet.com/api/v2
ONFLEET_TIMEOUT_MS=15000
ONFLEET_MAX_RETRIES=3
ONFLEET_ALLOW_WRITES=false
ONFLEET_ALLOW_HIGH_RISK=false
```

`ONFLEET_BASE_URL` must use HTTPS. Retry count is capped at 5.

## Installation and running

```bash
npm install
npm run build
ONFLEET_API_KEY='...' npm start
```

For development tests:

```bash
npm test
```

## Implemented tools

| Tool | Upstream API | Risk | Approval |
|---|---|---:|---|
| `onfleet.task.list` | `GET /tasks` | READ | none |
| `onfleet.task.get` | `GET /tasks/{id}` | READ | none |
| `onfleet.task.create` | `POST /tasks` | WRITE | `approved` |
| `onfleet.worker.list` | `GET /workers` | READ | none |
| `onfleet.worker.get` | `GET /workers/{id}` | READ | none |
| `onfleet.worker.nearby` | `GET /workers/location` | READ | none |
| `onfleet.worker.schedule.get` | `GET /workers/{id}/schedule` | READ | none |
| `onfleet.team.list` | `GET /teams` | READ | none |
| `onfleet.recipient.find` | `GET /recipients/{name|phone}/{value}` | READ | none |
| `onfleet.route_plan.list` | `GET /routePlans` | READ | none |
| `onfleet.webhook.list` | `GET /webhooks` | READ | none |
| `onfleet.webhook.create` | `POST /webhooks` | HIGH_RISK | `approved-high-risk` |
| `onfleet.webhook.delete` | `DELETE /webhooks/{id}` | DESTRUCTIVE | `approved-high-risk` |

The connector intentionally does not expose a generic arbitrary HTTP request tool.

## Permission and approval model

READ tools execute when valid credentials permit them.

WRITE tools require both `ONFLEET_ALLOW_WRITES=true` and an explicit `approval: "approved"` argument.

HIGH_RISK and DESTRUCTIVE tools require `ONFLEET_ALLOW_WRITES=true`, `ONFLEET_ALLOW_HIGH_RISK=true`, and `approval: "approved-high-risk"`. Webhook creation is high risk because it causes operational event data to be sent to an external endpoint. Webhook deletion is destructive because it stops event delivery.

No MCP tool can change these runtime permission switches.

## Validation and security

- IDs and strings are bounded.
- Phone numbers accepted when creating task recipients must be E.164 formatted.
- Worker proximity queries constrain latitude, longitude, and radius; Onfleet documents a 10,000 meter maximum radius.
- Route plan limit is bounded to Onfleet's documented maximum of 500.
- Worker password-detail retrieval is intentionally not exposed.
- Webhook targets must be HTTPS and common local/private address ranges are rejected to reduce SSRF risk.
- Tool output is explicitly marked `untrusted_provider_content`; data returned by Onfleet must never be interpreted as agent instructions or permission changes.
- Credentials remain within the connector HTTP client and are not logged or returned.
- Mutation endpoints are never automatically retried, avoiding duplicate task or webhook creation.

## Reliability and rate limits

Onfleet documents a limit of 20 requests per second across all API keys for an organization. The API exposes `X-RateLimit-Limit` and `X-RateLimit-Remaining`, and returns HTTP 429 on throttling. Applications should avoid unnecessary polling and prefer webhooks for state changes.

This connector uses bounded exponential backoff for idempotent GET requests on 429, 502, 503, and 504 responses. `Retry-After` is honored when present. Authentication, validation and permission failures are not retried. POST/DELETE mutations are explicitly non-retryable to avoid duplicate or irreversible effects. Every request has an abortable timeout and MCP cancellation is propagated to the HTTP request.

Onfleet task listing is paginated: the service returns up to 64 tasks and may return a `lastId`; callers can pass that value back to `onfleet.task.list`. Pagination is deliberately caller-driven to avoid hidden unbounded API fan-out.

## Error handling

Non-success provider responses become `OnfleetError` instances containing the HTTP status and parsed provider error body when available. Timeouts and MCP cancellation abort the underlying fetch. The connector never includes the API key in error messages.

Typical provider statuses include 400 for invalid content, 401 for invalid authentication, 403 for insufficient permission, 404 for missing resources, 429 for rate limiting, and transient 5xx failures.

## Webhooks

Onfleet supports events including task started/ETA/arrival/completed/failed/created/updated/deleted/assigned/unassigned/delayed, worker duty/created/deleted, route-plan delay, predicted task delay, and related events documented in the webhook reference. This connector accepts numeric trigger IDs supported by the current API but does not infer business meaning from webhook payloads. Configure consumers to validate that inbound data is expected and treat it as untrusted.

Webhook trigger IDs with thresholds have provider-specific semantics and limits; see the official webhook reference before creating them.

## Examples

See `examples/workflows.md` for read, task-create, nearby-worker, webhook-create and webhook-delete examples with permission requirements.

## Testing

Unit tests require no live Onfleet credentials. They cover:

- missing authentication configuration,
- tool registration uniqueness/provider scoping,
- default write denial,
- explicit write and destructive approval behavior,
- HTTP Basic credential construction,
- provider error mapping,
- retry of a throttled idempotent GET,
- no retry of a non-idempotent POST.

## Limitations

- This implementation uses the official REST API only; no official Onfleet MCP server was identified.
- It does not implement every Onfleet endpoint. Worker creation/deletion, task deletion, container replacement/reordering, route-plan mutation, administrative changes, billing, organization connections, and other broader-impact actions are intentionally omitted.
- Webhook signature verification belongs in the receiving HTTP service, not this stdio client.
- Global 20 req/s enforcement applies across an organization. This connector backs off when throttled but cannot coordinate rate consumption across independent applications; use a shared external limiter if several services use the same organization.
- The SDK compatibility target is MCP clients that support stdio MCP servers. It makes no claim about provider-specific hosted connector marketplaces.
