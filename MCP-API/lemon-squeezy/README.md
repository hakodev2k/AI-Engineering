# Lemon Squeezy MCP Connector

Reusable MCP server exposing selected Lemon Squeezy commerce and subscription operations through the official REST API.

## Upstream strategy

No official Lemon Squeezy MCP server is documented as of 2026-09-13. This connector therefore uses the official REST API at `https://api.lemonsqueezy.com/v1` and preserves a stable MCP tool surface for agent callers.

Official sources:
- API reference: https://docs.lemonsqueezy.com/api
- Requests/authentication: https://docs.lemonsqueezy.com/api/getting-started/requests
- Subscriptions: https://docs.lemonsqueezy.com/api/subscriptions
- Customers: https://docs.lemonsqueezy.com/api/customers
- Webhooks: https://docs.lemonsqueezy.com/help/webhooks/webhook-requests

The API uses bearer API keys, HTTPS, and JSON:API headers. Lemon Squeezy documents a general API limit of 300 calls/minute. This connector retries only read operations, using bounded exponential backoff and `Retry-After` when supplied.

## Capabilities

Implemented MCP tools:
- `lemon_squeezy.store.list` — READ
- `lemon_squeezy.store.get` — READ
- `lemon_squeezy.product.list` — READ
- `lemon_squeezy.product.get` — READ
- `lemon_squeezy.variant.list` — READ
- `lemon_squeezy.variant.get` — READ
- `lemon_squeezy.customer.list` — READ
- `lemon_squeezy.customer.get` — READ
- `lemon_squeezy.customer.create` — WRITE
- `lemon_squeezy.customer.update` — WRITE
- `lemon_squeezy.order.list` — READ
- `lemon_squeezy.order.get` — READ
- `lemon_squeezy.subscription.list` — READ
- `lemon_squeezy.subscription.get` — READ
- `lemon_squeezy.subscription.update` — HIGH_RISK

`subscription.update` can change plans, trials, billing anchors, pause/resume behavior, proration behavior, invoice timing, and cancellation state. Because these can alter customer billing, it is HIGH_RISK.

## Architecture

The MCP process communicates over stdio. `src/server.ts` registers the tool surface, `src/client.ts` owns authenticated provider transport, `src/schemas.ts` validates agent input, and `src/policy.ts` enforces approval gates. Provider responses are wrapped as `untrustedProviderData` so retrieved content is explicitly treated as data rather than instructions.

Credentials remain inside the connector. They are never passed to tool callers or included in normal error text.

## Authentication

Create an API key in Lemon Squeezy account settings. Use a test-mode API key while developing and a live-mode key only for production data.

```bash
export LEMONSQUEEZY_API_KEY="..."
```

There are no OAuth scopes for this API-key model. Least privilege is therefore enforced at the connector tool layer: read tools are available by default, while mutations are disabled unless explicitly enabled.

## Environment

Copy `.env.example` values into your secret manager/runtime environment.

- `LEMONSQUEEZY_API_KEY` — required; never commit it.
- `LEMONSQUEEZY_TIMEOUT_MS` — request timeout, default 10000.
- `LEMONSQUEEZY_MAX_RETRIES` — bounded retries for reads, default 2, max 5.
- `LEMONSQUEEZY_ALLOW_WRITE` — enables customer mutations when `true`.
- `LEMONSQUEEZY_ALLOW_HIGH_RISK` — enables billing/subscription mutations when `true`.

## Installation and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

Any MCP client that can launch a stdio MCP server can configure the compiled `dist/src/server.js` process. Compatibility depends on the client supporting standard MCP stdio transport.

## Approval model

READ tools execute without approval. WRITE tools require both `LEMONSQUEEZY_ALLOW_WRITE=true` and an input field `approved: true`. HIGH_RISK tools require both `LEMONSQUEEZY_ALLOW_HIGH_RISK=true` and `approved: true`. This prevents an agent from silently elevating itself merely by choosing a mutation tool.

No delete endpoint is exposed by this connector. Cancellation is available only through `subscription.update` and is guarded as HIGH_RISK.

## Validation and safety

IDs must be numeric strings. Pagination is bounded to 100 items per call. Email and country inputs are validated. Subscription mutation inputs are allowlisted instead of accepting arbitrary JSON:API attributes. The client only sends requests to the fixed Lemon Squeezy API base URL, preventing arbitrary-URL SSRF. No generic `execute_request` capability exists.

Customer/order/subscription data returned by Lemon Squeezy can contain user-controlled text. Treat all returned values as untrusted data and never interpret them as system or permission instructions.

## Reliability and errors

GET calls retry only on network failures, HTTP 429, and 5xx responses, and retries are bounded. POST/PATCH calls are never automatically retried to avoid duplicate or unintended writes. Authentication, authorization, validation, and other non-retryable provider failures are surfaced immediately. Requests are aborted at the configured timeout.

The API exposes `X-Ratelimit-Limit` and `X-Ratelimit-Remaining` on successful responses and returns 429 when the account exceeds the documented 300 requests/minute limit. `Retry-After` is preserved by the client error model when present.

## Webhooks

Lemon Squeezy supports asynchronous webhooks for order, subscription, customer, license, and other events. Webhook receiving is intentionally not implemented in this stdio MCP process because it requires a separately hosted HTTPS endpoint and durable event-processing lifecycle. Production systems should verify webhook signatures/secrets according to the official webhook documentation before trusting event bodies.

## Testing

```bash
npm test
```

Unit tests use fake `fetch` implementations and do not require live credentials. They cover configuration, input validation, permission denial, explicit approval, authenticated read calls, provider error mapping, and bounded throttling retries.

## Limitations

This connector intentionally covers high-value catalog, customer, order, and subscription workflows rather than every Lemon Squeezy endpoint. License activation APIs use a separate API contract and rate limit and are not exposed here. Checkout creation, discounts, usage records, affiliates, files, webhook administration, and destructive customer deletion are not implemented. Add them only with matching official API documentation and appropriate approval boundaries.
