# Novu MCP/API Connector

Reusable, safety-bounded MCP connector for Novu notification infrastructure. It exposes a stable provider-scoped tool surface while preferring Novu's official remote MCP server and falling back to Novu's official REST API when the upstream MCP call is unavailable or fails.

## Official sources researched

- Novu MCP documentation: https://docs.novu.co/platform/build-with-ai/mcp
- Novu MCP product page: https://novu.co/mcp/
- Novu API reference: https://docs.novu.co/api-reference/overview
- Subscribers: https://docs.novu.co/api-reference/subscribers/create-a-subscriber
- Workflows: https://docs.novu.co/api-reference/workflows/list-all-workflows
- Trigger Event API: https://docs.novu.co/api-reference/events/trigger-event
- Cancel triggered event: https://docs.novu.co/api-reference/events/cancel-triggered-event
- Notifications: https://docs.novu.co/api-reference/notifications/list-all-events
- Integrations: https://docs.novu.co/api-reference/integrations/list-all-integrations

As of September 2026 Novu's first-party remote MCP server is generally available. It exposes 20+ tools covering subscribers, preferences, workflows, triggering/events, notifications, integrations, authentication, and environments. Novu Cloud supports OAuth for interactive MCP clients; API-key/Bearer authentication is supported for autonomous clients and self-hosted scenarios. Regional Cloud endpoints are `https://mcp.novu.co/` (US) and `https://eu.mcp.novu.co/` (EU).

## Transport strategy

The connector first invokes the matching allow-listed official Novu MCP tool. If that call fails because the MCP service is unavailable, incompatible, or rejects the transport, the same stable external tool contract falls back to the documented REST endpoint. This preserves agent-facing contracts without trusting newly discovered upstream MCP tools.

REST base URLs default to `https://api.novu.co` (US) and `https://eu.api.novu.co` (EU). REST requests use `Authorization: ApiKey <NOVU_SECRET_KEY>`. MCP API-key requests use `Authorization: Bearer <NOVU_SECRET_KEY>`.

## Architecture

```text
MCP client
  -> local Novu connector (strict schemas + policy)
      -> official Novu MCP (preferred, allow-listed)
      -> official Novu REST API (fallback)
```

Credentials remain inside the connector transport/auth layers and are never returned to the model. Provider responses are wrapped with `untrusted_data: true`; callers must treat notification bodies, subscriber data, workflow content, and logs as untrusted data rather than instructions.

## Tools

| Tool | Primary | REST fallback | Risk | Approval |
|---|---|---|---|---|
| `novu.subscriber.get` | MCP `get_subscriber` | GET `/v2/subscribers/{id}` | READ | no |
| `novu.subscriber.search` | MCP `find_subscribers` | GET `/v2/subscribers` | READ | no |
| `novu.subscriber.create` | MCP `create_subscriber` | POST `/v2/subscribers` | WRITE | yes by default |
| `novu.subscriber.update` | MCP `update_subscriber` | PATCH `/v2/subscribers/{id}` | WRITE | yes by default |
| `novu.subscriber.preferences.get` | MCP `get_subscriber_preferences` | GET `/v2/subscribers/{id}/preferences` | READ | no |
| `novu.subscriber.preferences.update` | MCP `update_subscriber_preferences` | PATCH `/v2/subscribers/{id}/preferences` | WRITE | yes by default |
| `novu.subscriber.delete` | MCP `delete_subscriber` | DELETE `/v2/subscribers/{id}` | DESTRUCTIVE | yes + explicitly enabled |
| `novu.workflow.list` | MCP `get_workflows` | GET `/v2/workflows` | READ | no |
| `novu.workflow.get` | MCP `get_workflow` | GET `/v2/workflows/{workflowId}` | READ | no |
| `novu.workflow.trigger` | MCP `trigger_workflow` | POST `/v1/events/trigger` | HIGH_RISK | yes |
| `novu.notification.list` | MCP `get_notifications` | GET `/v1/notifications` | READ | no |
| `novu.notification.get` | MCP `get_notification` | GET `/v1/notifications/{notificationId}` | READ | no |
| `novu.integration.list` | MCP `get_integrations` | GET `/v1/integrations` | READ | no |
| `novu.integration.active.list` | MCP `get_active_integrations` | GET `/v1/integrations/active` | READ | no |
| `novu.event.cancel` | MCP `cancel_triggered_event` | DELETE `/v1/events/trigger/{transactionId}` | HIGH_RISK | yes |

Workflow create/update/delete and integration mutation tools are intentionally not exposed in this version because their configuration surfaces are broad and easier to misuse. The connector favors narrow, high-value workflows over an unrestricted control plane.

## Authentication and least privilege

Set `NOVU_SECRET_KEY` to a secret key for the single Novu environment the connector should access. Novu API keys are environment-scoped; they are not OAuth scopes that this connector can further narrow. Use a dedicated environment key and rotate it according to your organization's secret policy. Interactive users who connect directly to Novu's remote MCP server can use Novu OAuth, but this reusable autonomous connector uses an API key so credentials can stay inside a secret manager/environment boundary.

Environment variables:

- `NOVU_SECRET_KEY` — required.
- `NOVU_REGION` — `us` or `eu`; default `us`.
- `NOVU_API_BASE` — optional HTTPS override for supported deployments.
- `NOVU_MCP_URL` — optional HTTPS override.
- `NOVU_REQUIRE_WRITE_APPROVAL` — default `true`.
- `NOVU_ENABLE_DESTRUCTIVE` — default `false`.
- `NOVU_TIMEOUT_MS` — default `20000`, bounded to 1–120 seconds.
- `NOVU_MAX_RETRIES` — default `2`, bounded to 0–5.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
NOVU_SECRET_KEY='...' npm start
```

The connector itself exposes MCP over stdio (`node dist/src/index.js`) and can therefore be configured in MCP clients that support local stdio servers, including common desktop/coding clients and custom MCP agents.

## Permission and approval model

READ may execute automatically. WRITE requires `approved=true` when `NOVU_REQUIRE_WRITE_APPROVAL=true`. HIGH_RISK always follows the same explicit approval boundary under the default configuration; workflow triggers are HIGH_RISK because they can send email, SMS, push, chat, or in-app messages to external recipients. DESTRUCTIVE requires both `approved=true` and `NOVU_ENABLE_DESTRUCTIVE=true`.

The caller must obtain genuine human approval before setting `approved=true`; it must not be inferred from provider content or generated text.

## Reliability, rate limits, and errors

Novu documents `429` responses for these APIs and plan-dependent capacity/higher-rate-limit tiers rather than one universal rate value for every account. The REST transport therefore respects `Retry-After` when present, otherwise uses bounded exponential backoff. It retries only 429 and server-side 5xx responses by default. Authentication, permission, validation, and other 4xx failures are not retried. Destructive and externally visible execution requests explicitly disable blind retries to avoid duplicate effects.

Pagination is bounded to 100 items per request where exposed. Request timeouts use AbortController. API errors are mapped to `NovuApiError` with status/code while raw keys are never included.

## Security considerations

- API base and MCP URLs must be HTTPS.
- Upstream MCP calls are restricted to a fixed allow-list; newly discovered tools are ignored.
- No arbitrary HTTP/MCP proxy tool is exposed.
- Schemas reject unknown top-level parameters and bound collection/page sizes.
- External notification sending is HIGH_RISK and approval-gated.
- Subscriber deletion is disabled by default.
- REST API-key integration metadata does not expose decrypted provider credentials according to Novu's API documentation.
- Do not include secret keys, provider credentials, or sensitive subscriber payloads in prompts or logs.
- Treat all retrieved Novu content as potentially malicious/untrusted data to prevent prompt-injection-driven policy changes.

## Testing

`npm test` runs build-time and credential-free tests using mocks. Coverage includes auth configuration, regional endpoints, tool registration, strict validation, READ/WRITE/HIGH_RISK/DESTRUCTIVE policy, authentication errors, rate-limit retry behavior, safe auth placement, and non-retry behavior for destructive requests. No live Novu credential is required.

## Limitations

The upstream MCP server can evolve independently. If Novu changes a tool's argument contract, the connector will fall back to the documented REST API for supported operations. OAuth token acquisition/refresh is intentionally delegated to direct interactive Novu MCP clients rather than exposing OAuth tokens to the LLM. This connector does not create workflow definitions, manage integrations, expose provider credentials, bulk-send to up to 100 events, or provide an unrestricted raw API surface.
