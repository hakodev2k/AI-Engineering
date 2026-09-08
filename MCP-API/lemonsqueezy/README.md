# Lemon Squeezy MCP/API Connector

Reusable MCP server exposing a curated Lemon Squeezy commerce/billing surface through the official REST API. Research performed against official Lemon Squeezy API/help documentation on 2026-09-09. No official Lemon Squeezy MCP server was found; third-party MCP implementations exist, so this connector deliberately uses the official API directly instead of trusting an unofficial upstream MCP.

## Official sources
- API reference: https://docs.lemonsqueezy.com/api
- Requests/authentication: https://docs.lemonsqueezy.com/api/getting-started/requests
- Subscriptions: https://docs.lemonsqueezy.com/api/subscriptions/list-all-subscriptions
- Update subscription: https://docs.lemonsqueezy.com/api/subscriptions/update-subscription
- Customers: https://docs.lemonsqueezy.com/api/customers/create-customer
- Checkouts: https://docs.lemonsqueezy.com/api/checkouts/create-checkout
- Discounts: https://docs.lemonsqueezy.com/api/discounts/create-discount
- License keys: https://docs.lemonsqueezy.com/api/license-keys/list-all-license-keys
- Webhooks: https://docs.lemonsqueezy.com/help/webhooks

## Transport and architecture
`MCP client -> stdio MCP server -> strict validation -> approval policy -> Lemon Squeezy REST v1`.

The API base URL is `https://api.lemonsqueezy.com`. Requests use JSON:API headers and `Authorization: Bearer <API_KEY>`. Credentials never enter tool output or prompt text. Provider payloads are returned with `untrusted_data: true`.

## Runtime
Node.js 20+.

```bash
npm install
export LEMONSQUEEZY_API_KEY='...'
npm run build
npm start
```

Use `node dist/src/server.js` as a local stdio MCP command in clients that support stdio MCP servers.

## Tools
The connector implements exactly 20 provider-scoped tools: store list/get; product list/get; variant list/get; customer list/get/create; order list/get; subscription list/get/update/cancel; discount list/create/delete; license-key list; checkout create.

READ tools may execute automatically. `customer.create` and `checkout.create` are WRITE and require human approval by default. `subscription.update`, `subscription.cancel`, and `discount.create` are HIGH_RISK because they change billing/subscription/commercial state and require explicit human approval. `discount.delete` is DESTRUCTIVE and additionally remains disabled unless `LEMONSQUEEZY_ENABLE_DESTRUCTIVE=true`.

No unrestricted raw-request tool is exposed. Refunds are intentionally omitted because they directly move money. License activation/deactivation uses Lemon Squeezy's separate License API and is intentionally not mixed into this connector's authenticated management surface.

## Authentication and least privilege
Lemon Squeezy uses account API keys rather than OAuth scopes for this API. Create a dedicated Test-mode API key while integrating, then a separate live key for production. Store it only in `LEMONSQUEEZY_API_KEY` or your process secret manager. The connector cannot reduce provider-side privileges beyond the capabilities of the issued API key, so tool allowlisting and approval enforcement are the local least-privilege boundary.

## Environment
- `LEMONSQUEEZY_API_KEY` required.
- `LEMONSQUEEZY_API_BASE` defaults to the official HTTPS endpoint.
- `LEMONSQUEEZY_REQUIRE_WRITE_APPROVAL` defaults `true`.
- `LEMONSQUEEZY_ENABLE_DESTRUCTIVE` defaults `false`.
- `LEMONSQUEEZY_TIMEOUT_MS` defaults `20000`.

## Pagination, rate limits, retries and errors
Official API limit: 300 calls/minute. Successful responses expose `X-Ratelimit-Limit` and `X-Ratelimit-Remaining`; exceeding the limit returns HTTP 429. This client bounds list page sizes to 100, avoids automatic page crawling, retries only 429 and 5xx responses, honors `Retry-After` when present, and caps attempts at three. Authentication, permission and validation failures are not retried. Every HTTP request has an abort timeout.

## Webhooks
Lemon Squeezy supports signed webhooks for asynchronous order, subscription, customer and license-key events. This package documents them but does not expose an inbound HTTP listener because it is a local stdio MCP server. Production webhook handlers should validate the Lemon Squeezy signing secret before trusting payloads; webhook payload data must still be treated as untrusted application data.

## Security
- API keys stay inside the connector process.
- Only HTTPS API bases are accepted.
- Strict schemas reject extra or malformed tool parameters.
- No arbitrary URL/API proxy exists, reducing SSRF and permission-escalation risk.
- Commercial/billing mutations require approval; destructive operations are disabled by default.
- Retrieved names, emails, descriptions, URLs and custom fields are untrusted data, never instructions.
- Avoid logging request headers or raw credentials.
- Use Test mode for integration tests and staged workflows.

## Testing
`npm test` performs credential-free unit tests for configuration, tool registration, approval enforcement, destructive denial, authentication-error behavior and bounded rate-limit retries using mocked `fetch` responses. Normal tests never call Lemon Squeezy.

## Limitations
The connector intentionally omits refunds, webhook creation, license activation/deactivation, usage-record writes and broad subscription-item mutations. Those operations either move money, use a separate API/auth flow, or need more domain-specific guardrails. Lemon Squeezy may add backward-compatible fields/endpoints; review the official API changelog before dependency or tool-surface upgrades.
