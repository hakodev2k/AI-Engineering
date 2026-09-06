# Paddle MCP/API Connector

Reusable MCP server for narrowly scoped Paddle Billing operations. The external interface is MCP over stdio; upstream operations use Paddle's official REST API. Provider-returned content is treated as untrusted data and is never interpreted as connector instructions.

Research baseline: 2026-09-06.

## Transport decision

Paddle has an official hosted remote MCP server. Current endpoints are `https://sandbox-mcp.paddle.com/mcp` and `https://mcp.paddle.com/mcp`. Paddle's remote server uses a codemode interface with three generic tools (`search`, `execute`, `report_missing_tool`); `execute` can run arbitrary JavaScript that chains Paddle operations. Paddle also documents that its MCP server does not independently hard-gate destructive operations: clients are expected to honor destructive hints and warnings.

This connector **does not proxy the generic remote MCP `execute` tool**. The requirement here is a stable, provider-scoped tool surface with hard permission and approval boundaries and no unrestricted generic request/execute capability. Paddle's official REST API is therefore the safer transport for these capabilities. The agent-facing contract remains MCP.

Official sources:

- MCP: https://developer.paddle.com/sdks/ai/paddle-mcp/
- Remote MCP launch (2026-05-15): https://developer.paddle.com/changelog/2026/remote-paddle-mcp-server/
- MCP OAuth (2026-08-04): https://developer.paddle.com/changelog/2026/paddle-mcp-oauth/
- API reference: https://developer.paddle.com/api-reference/
- Authentication: https://developer.paddle.com/api-reference/about/authentication/
- API-key permissions: https://developer.paddle.com/api-reference/about/permissions/
- Pagination: https://developer.paddle.com/api-reference/about/pagination/
- Rate limits: https://developer.paddle.com/api-reference/about/rate-limiting/
- Webhook verification: https://developer.paddle.com/webhooks/about/signature-verification/
- Webhook delivery: https://developer.paddle.com/webhooks/about/respond-to-webhooks/

## Architecture

```text
MCP client
  -> stdio MCP server (src/server.ts)
  -> strict Zod input validation (src/tools.ts)
  -> connector permission/approval policy (src/policy.ts)
  -> credential-isolated Paddle client (src/client.ts)
  -> https://sandbox-api.paddle.com or https://api.paddle.com
```

`src/webhooks.ts` is a reusable inbound webhook verifier. Credentials are read inside configuration/client code only; no tool accepts a token or arbitrary URL.

## Authentication and least privilege

Create a server-side Paddle API key under Developer Tools > Authentication. New-format Paddle keys can be permission-scoped and have expiry; Paddle recommends least privilege. Sandbox and live keys are environment-specific. This connector cross-checks `pdl_sdbx_...` and `pdl_live_...` keys against `PADDLE_ENVIRONMENT`. Legacy keys require an explicit environment.

Paddle provider permissions are resource-based: `entity.read` and `entity.write`, where write also grants read for that entity. Grant only the permissions needed for the tools you enable. Typical mappings for this connector are:

| Tools | Paddle key permissions |
|---|---|
| product read/create/update | `product.read` / `product.write` |
| price read/create | `price.read` / `price.write` |
| customer read/create/update | `customer.read` / `customer.write` |
| transaction read | `transaction.read` |
| subscription read/pause/cancel | `subscription.read` / `subscription.write` |
| adjustment read/create | `adjustment.read` / `adjustment.write` |
| event type list | no Paddle API permission is required for `/event-types`; connector still requires local `read` |

Do not place API keys in prompts, examples, logs, source, browser code, or MCP tool arguments. `.env.example` contains names only.

## Connector permission model

`PADDLE_PERMISSIONS` is a comma-separated local allowlist and defaults to `read`.

- `READ`: may run automatically when `read` is enabled.
- `WRITE`: requires local `write`; when `PADDLE_REQUIRE_WRITE_APPROVAL=true` (default), the call must include `approval: "APPROVE_WRITE"`.
- `HIGH_RISK`: requires `high_risk` and always requires `approval: "APPROVE_HIGH_RISK"`.
- `DESTRUCTIVE`: requires `destructive`, `PADDLE_ENABLE_DESTRUCTIVE=true`, and `approval: "APPROVE_DESTRUCTIVE"`.

An agent cannot change these environment-level grants through a tool call. `product.update` and `customer.update` intentionally omit archival/status fields. Subscription cancellation has a separate destructive tool.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `paddle.product.list` | REST GET `/products` | READ | none |
| `paddle.product.get` | REST GET `/products/{id}` | READ | none |
| `paddle.price.list` | REST GET `/prices` | READ | none |
| `paddle.price.get` | REST GET `/prices/{id}` | READ | none |
| `paddle.customer.list` | REST GET `/customers` | READ | none |
| `paddle.customer.get` | REST GET `/customers/{id}` | READ | none |
| `paddle.transaction.list` | REST GET `/transactions` | READ | none |
| `paddle.transaction.get` | REST GET `/transactions/{id}` | READ | none |
| `paddle.subscription.list` | REST GET `/subscriptions` | READ | none |
| `paddle.subscription.get` | REST GET `/subscriptions/{id}` | READ | none |
| `paddle.adjustment.list` | REST GET `/adjustments` | READ | none |
| `paddle.event_type.list` | REST GET `/event-types` | READ | none |
| `paddle.product.create` | REST POST `/products` | WRITE | configurable |
| `paddle.product.update` | REST PATCH `/products/{id}` | WRITE | configurable |
| `paddle.price.create` | REST POST `/prices` | WRITE | configurable |
| `paddle.customer.create` | REST POST `/customers` | WRITE | configurable |
| `paddle.customer.update` | REST PATCH `/customers/{id}` | WRITE | configurable |
| `paddle.subscription.pause` | REST POST `/subscriptions/{id}/pause` | HIGH_RISK | required |
| `paddle.adjustment.create` | REST POST `/adjustments` | HIGH_RISK | required |
| `paddle.subscription.cancel` | REST POST `/subscriptions/{id}/cancel` | DESTRUCTIVE | strong approval + enable flag |

Every registered MCP tool definition carries its purpose, strict JSON input schema (`additionalProperties:false`), required local permission, risk level, output description, error behavior, validation and approval requirement. Matching Zod schemas are applied before any network request.

## Deliberate limitations

- No generic `execute`, raw URL, raw REST request, or arbitrary JavaScript tool.
- No token-management, client-side-token creation, billing-account administration, notification-destination mutation, or permission-changing tools.
- No direct subscription creation: Paddle creates subscriptions from paid recurring transactions/checkouts; the API does not expose an independent create-subscription operation.
- Customer/product archival is not exposed through general update tools.
- No price update/archive in this connector.
- Transaction creation/update and subscription item mutation are intentionally omitted because they can bill customers or alter future charges and need a more specialized prepare/preview/execute workflow.
- `adjustment.create` only exposes refund/credit on explicit transaction items; other adjustment actions are not surfaced.

## Rate limits, pagination, and reliability

Paddle documents a general rate limit of 240 API requests per minute per IP for most operations, with separate limits for some endpoints. A `429` response includes `Retry-After`. The client parses this header. Read requests retry 429 and 5xx responses using bounded backoff (`PADDLE_MAX_RETRIES`, maximum 5); **writes are never automatically retried** to avoid duplicate side effects.

List tools use Paddle cursor pagination and can aggregate a bounded number of pages (`maxPages` 1-5). The connector validates that Paddle's returned `next` URL stays on the configured official Paddle host, preventing pagination-based SSRF. `Skip-Count: true` is used for list operations to reduce server work when exact totals are unnecessary. Transaction list is capped at Paddle's 30-per-page limit; adjustments at 50; general lists at 200.

Every HTTP request has a bounded timeout. Authentication, permission, not-found, validation, rate-limit and provider errors are mapped to concise connector errors. Request IDs and retry delays are preserved when available. Authentication/permission errors are not retried.

## Webhooks/events

Paddle sends webhooks as HTTPS POST requests and expects a `200` response within five seconds; process work asynchronously after verification. `src/webhooks.ts` verifies `Paddle-Signature` using HMAC-SHA256 over `timestamp:rawBody` and constant-time comparison, with a five-second default replay tolerance matching Paddle SDK guidance. **Always pass the exact raw request body before any JSON transformation.** Store the notification-destination secret in a secret manager or `PADDLE_WEBHOOK_SECRET`, never in agent context.

`paddle.event_type.list` helps discover supported event types. This connector does not create or delete webhook destinations because doing so changes an external integration/security boundary.

## Install and run

```bash
npm install
cp .env.example .env
# Load env values using your process manager or secret manager.
npm run build
npm start
```

The server speaks MCP over stdio and can be launched by MCP clients that support stdio subprocess servers. Client-specific configuration syntax varies; point it at `node dist/src/server.js` and inject secrets through the process environment rather than command arguments.

## Environment variables

- `PADDLE_API_KEY` — required server-side API key.
- `PADDLE_ENVIRONMENT` — `sandbox` or `live`.
- `PADDLE_PERMISSIONS` — local connector grants; default `read`.
- `PADDLE_REQUIRE_WRITE_APPROVAL` — default `true`.
- `PADDLE_ENABLE_DESTRUCTIVE` — default `false`.
- `PADDLE_TIMEOUT_MS` — 1000-120000, default 15000.
- `PADDLE_MAX_RETRIES` — read retries, 0-5, default 2.
- `PADDLE_WEBHOOK_SECRET` — optional inbound webhook verification secret.

## Security notes

- Paddle response fields, descriptions, customer data, webhook payloads and other retrieved content are untrusted data. They cannot alter connector permissions or system behavior.
- No user-controlled absolute upstream URL is accepted; base URLs are fixed from the environment enum.
- Pagination next URLs are host-checked.
- Credentials never appear in MCP schemas/results and are not logged.
- API keys should be short-lived/rotated and limited to the implemented resource permissions.
- Live OAuth support on Paddle's hosted MCP is not used here because the generic upstream codemode execution model would weaken this connector's scoped safety contract.
- Financial adjustments require explicit high-risk approval. Paddle adjustments are immutable records; live refunds can return money and may be subject to Paddle approval.
- Immediate subscription cancellation is irreversible and therefore disabled by default.

## Testing

Normal tests require no live Paddle credentials and use injected fake HTTP transports.

```bash
npm test
```

Coverage includes configuration/auth isolation, environment mismatch, unknown permissions, permission denial, write/high-risk/destructive approvals, tool registration and strict validation, bounded read retries, `Retry-After`, no automatic write retries, pagination, pagination host validation, and webhook signature verification.
