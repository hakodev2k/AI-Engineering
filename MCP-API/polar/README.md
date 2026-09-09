# Polar MCP/API Connector

Reusable MCP connector for **Polar**, the billing platform for subscriptions, usage billing, checkout, orders, refunds, and customer entitlements.

## Transport strategy

Polar currently provides an **official remote MCP server**:

- Production: `https://mcp.polar.sh/mcp/polar-mcp`
- Sandbox: `https://mcp.polar.sh/mcp/polar-sandbox`

Polar also provides the official Core REST API and official SDKs. This connector deliberately exposes a stable local MCP tool contract backed by the **official REST API** using an Organization Access Token (OAT). That approach is preferable for reusable server-to-server automation because it allows explicit scope selection, deterministic validation, local approval policy, bounded retry behavior, and credential isolation. Users may still connect directly to Polar's official remote MCP server separately when interactive OAuth-based MCP access is preferred.

## Official sources

- MCP: https://polar.sh/docs/integrate/mcp
- API overview: https://polar.sh/docs/api-reference/introduction
- Authentication: https://polar.sh/docs/integrate/authentication
- Organization Access Tokens: https://polar.sh/docs/integrate/oat
- Sandbox: https://polar.sh/docs/integrate/sandbox
- Products API: https://polar.sh/docs/api-reference/products/list
- Customers API: https://polar.sh/docs/api-reference/customers/list
- Customer State: https://polar.sh/docs/integrate/customer-state
- Subscriptions API: https://polar.sh/docs/api-reference/subscriptions/list
- Orders API: https://polar.sh/docs/api-reference/orders/list
- Checkout API: https://polar.sh/docs/api-reference/checkouts/create-session
- Refunds API: https://polar.sh/docs/api-reference/refunds/create
- Metrics API: https://polar.sh/docs/api-reference/metrics/get

## Architecture

```text
MCP client / AI agent
        |
        v
Polar connector (stdio)
  - strict input schemas
  - risk classification
  - approval checks
  - credential isolation
  - bounded read retries
        |
        v
Official Polar REST API
        |
        v
Polar
```

Provider content is returned with `untrusted_data: true`. Retrieved customer, product, order, or metadata content must be treated as data, never as instructions capable of modifying permissions or system behavior.

## Authentication

Create an Organization Access Token in Polar organization settings and expose it only to the connector process:

```bash
export POLAR_ACCESS_TOKEN='polar_oat_...'
```

Do not put an OAT in prompts, source code, client-side JavaScript, logs, examples, or committed configuration. Polar documents automatic secret scanning/revocation protections, but leaked tokens must still be considered compromised.

### Required scopes

Use a dedicated OAT with only the scopes required by the implemented tools:

- `products:read`
- `customers:read`
- `subscriptions:read`
- `orders:read`
- `metrics:read`
- `checkouts:read`
- `checkouts:write`
- `refunds:write`

If you do not need checkout creation or refunds, omit their write scopes and those tools will fail safely at Polar's authorization boundary.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `POLAR_ACCESS_TOKEN` | yes | — | Organization Access Token |
| `POLAR_ENVIRONMENT` | no | `sandbox` | `sandbox` or `production` |
| `POLAR_REQUIRE_WRITE_APPROVAL` | no | `true` | Require `approved=true` for WRITE/HIGH_RISK tools |
| `POLAR_TIMEOUT_MS` | no | `20000` | Request timeout, 1s–120s |

The connector defaults to **sandbox** to reduce accidental live billing actions.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport. Configure any MCP client that supports local stdio servers to launch:

```text
node dist/src/server.js
```

with the required environment variables supplied by the client or its secret manager.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `polar.product.list` | REST | READ | no |
| `polar.product.get` | REST | READ | no |
| `polar.customer.list` | REST | READ | no |
| `polar.customer.get` | REST | READ | no |
| `polar.customer.state` | REST | READ | no |
| `polar.subscription.list` | REST | READ | no |
| `polar.subscription.get` | REST | READ | no |
| `polar.order.list` | REST | READ | no |
| `polar.order.get` | REST | READ | no |
| `polar.metrics.get` | REST | READ | no |
| `polar.checkout.get` | REST | READ | no |
| `polar.checkout.create` | REST | WRITE | yes by default |
| `polar.refund.create` | REST | HIGH_RISK | yes |

The connector intentionally does **not** expose arbitrary HTTP execution, organization administration, token management, subscription revocation, customer deletion, product mutation, webhook administration, or raw provider endpoints.

## Real-world workflows

### Entitlement lookup

Search a customer, then call `polar.customer.state` using either the Polar customer UUID or your immutable external customer ID. Customer State includes the customer's active subscriptions, granted benefits, and active meters, making it suitable for provisioning decisions.

### Checkout creation

Use `polar.checkout.create` to prepare a hosted Polar checkout. It accepts a bounded product list plus optional existing customer/external-customer identity and redirect URLs. This is a WRITE operation because it creates a customer-facing payment flow; explicit approval is required by default.

### Refund

Use `polar.refund.create` only after a human verifies the order, amount, reason, and benefit-revocation choice. Refunds affect money and are classified HIGH_RISK. The connector never automatically retries POST requests, avoiding duplicate financial mutations when delivery status is ambiguous.

## Validation and permissions

Inputs use strict Zod schemas. IDs expected to be Polar UUIDs are UUID-validated. Pagination is bounded to Polar's documented maximum of 100 items per page. Customer State requires exactly one identifier. Metadata is limited to 50 keys and values are bounded to Polar-supported primitive types.

READ operations can execute automatically. WRITE and HIGH_RISK operations require `approved=true` when `POLAR_REQUIRE_WRITE_APPROVAL=true`. The caller is responsible for obtaining real human approval before setting that flag; the flag is an enforcement boundary, not a user-interface confirmation mechanism.

Agents cannot raise their own provider permissions. Polar's OAT scopes remain the authoritative provider-side permission boundary.

## Reliability and rate limits

Polar documents:

- Production: **500 requests/minute** per organization/customer or OAuth2 client.
- Sandbox: **100 requests/minute** per organization/customer or OAuth2 client.
- Rate-limit responses use HTTP `429` and include `Retry-After`.

The connector applies configurable request timeouts and bounded retries only to GET operations. GET requests retry at most three attempts for HTTP 429 or 5xx responses and honor `Retry-After` with a bounded wait. Authentication, authorization, validation, and all POST/write operations are not retried automatically.

List tools expose explicit `page`/`limit` controls rather than recursively downloading all pages, preventing unbounded agent-driven API fan-out.

## Error handling

Provider errors are converted into MCP tool errors without exposing the bearer token. HTTP status, provider error text when available, and `Retry-After` are retained internally for predictable handling. Network cancellation is enforced with `AbortController`.

## Security considerations

- OAT remains exclusively in the connector process.
- Production and sandbox base URLs are hard-coded official Polar HTTPS endpoints; callers cannot inject an arbitrary upstream URL.
- Tool schemas are action-specific; there is no `execute_any_api_request` escape hatch.
- Returned provider data is explicitly marked untrusted.
- Sandbox is the default environment.
- Financial mutation is approval-gated.
- POST operations are never automatically retried.
- No destructive delete/revoke tool is exposed.
- Metadata, redirect URLs, page sizes, enum values, IDs, and dates are validated before provider calls.

## Testing

Run:

```bash
npm test
```

Unit tests require no live Polar credentials and cover configuration, safe sandbox default, permission denial, successful reads, authentication errors, write non-retry behavior, and rate-limit handling.

## Official MCP versus this connector

Polar's official MCP server is the preferred direct MCP experience when a user wants interactive OAuth-backed access in clients such as Cursor, Claude Code, Codex, ChatGPT, or other remote-MCP capable clients. This repository connector does not re-host, impersonate, or dynamically trust that remote MCP server. Its purpose is a reusable, policy-controlled MCP facade for selected Polar API workflows using an OAT.

This means the external agent contract remains predictable even if Polar expands its remote MCP tool inventory, and newly added upstream capabilities cannot silently gain permissions inside this connector.

## Limitations

- Only the documented operations listed above are implemented.
- Subscription cancellation/revocation and product/customer mutations are intentionally omitted because they require additional domain-specific approval semantics.
- Refund creation is supported, but refund listing/status inspection is not currently exposed.
- Webhook delivery is documented by Polar but this connector does not host a public webhook receiver; event ingestion requires an application-specific externally reachable endpoint and signature-verification lifecycle.
- The connector uses OAT authentication; OAuth partner integration flows are not implemented.
- Normal unit tests use mocks and do not prove that a particular account has purchased products, enabled billing, or granted the configured token scopes.
