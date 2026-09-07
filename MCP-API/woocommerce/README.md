# WooCommerce MCP/API Connector

Reusable MCP server for WooCommerce store workflows with strict provider-scoped tools, credential isolation, bounded retries, approval gates, and deterministic REST-backed execution.

## Provider and purpose

WooCommerce exposes products, orders, customers, coupons, webhooks, and other store resources through its REST API. WooCommerce also now includes native Model Context Protocol support, but the official MCP integration is currently documented as a **Developer Preview**. This connector therefore exposes a stable external MCP interface while using WooCommerce REST API v3 for the implemented tool contracts. The official MCP endpoint is documented for deployments that want to evaluate the upstream implementation separately, but this package does not dynamically trust or proxy arbitrary upstream MCP tools.

## Official sources researched

- WooCommerce MCP integration: https://developer.woocommerce.com/docs/features/mcp/
- WooCommerce REST API: https://developer.woocommerce.com/docs/apis/rest-api/
- REST authentication: https://developer.woocommerce.com/docs/apis/rest-api/authentication
- Webhooks: https://developer.woocommerce.com/docs/apis/rest-api/v3/webhooks/
- Store API rate limiting background: https://developer.woocommerce.com/docs/apis/store-api/rate-limiting

WooCommerce MCP abilities are surfaced through the WordPress MCP Adapter. The current preferred remote endpoint is:

```text
https://yourstore.example/wp-json/mcp/mcp-adapter-default-server
```

The WooCommerce-specific `/wp-json/woocommerce/mcp` endpoint is deprecated for new integrations according to current developer documentation.

## Transport strategy

| Capability | Transport | Rationale |
|---|---|---|
| Product read/create/update | REST API v3 | Stable, documented, deterministic contract; native MCP is still developer preview |
| Order read/status/note | REST API v3 | Stable API and explicit permission boundary for billing/fulfillment-impacting writes |
| Customer read | REST API v3 | Stable API; PII is treated as untrusted sensitive provider data |
| Coupon read | REST API v3 | Stable API and useful commerce context |
| Webhook read | REST API v3 | Stable API; connector intentionally does not create/delete webhooks |
| Native WooCommerce MCP | Official upstream, optional evaluation only | Not dynamically proxied because developer-preview tool surfaces may change |

The external caller always uses the same provider-scoped MCP tool names and does not need to know the upstream transport.

## Architecture

```text
MCP client
  -> strict Zod schema
  -> risk / approval policy
  -> WooCommerce client
  -> HTTPS Basic Auth with REST API key
  -> /wp-json/wc/v3
```

Raw credentials remain inside the connector process. They are never tool arguments and are never returned to the model.

## Authentication

WooCommerce REST API keys are generated under **WooCommerce > Settings > Advanced > REST API**. Each key is attached to a WordPress user and receives one of these access levels:

- Read
- Write
- Read/Write

Use a dedicated least-privilege WordPress user and the narrowest API-key access level that supports the enabled tools. Read-only deployments should use a Read key. Write tools require a Read/Write key plus connector-side approval.

Over HTTPS, the connector authenticates using HTTP Basic Auth:

```text
username = consumer key
password = consumer secret
```

The connector rejects non-HTTPS store URLs to avoid sending credentials over cleartext transport.

## Required environment variables

```text
WOOCOMMERCE_BASE_URL=
WOOCOMMERCE_CONSUMER_KEY=
WOOCOMMERCE_CONSUMER_SECRET=
```

Optional:

```text
WOOCOMMERCE_TIMEOUT_MS=15000
WOOCOMMERCE_MAX_RETRIES=3
WOOCOMMERCE_ALLOW_WRITES=false
WOOCOMMERCE_APPROVAL_TOKEN=
WOOCOMMERCE_MCP_URL=
```

`WOOCOMMERCE_APPROVAL_TOKEN` is a connector-local approval secret and must be stored separately from the WooCommerce REST API credentials.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport. MCP clients that can launch a local process can invoke:

```text
node dist/src/server.js
```

with the environment variables supplied by the process environment or a secret manager.

## Tool list

| Tool | Purpose | Risk | Provider permission | Approval |
|---|---|---:|---|---|
| `woocommerce.product.list` | List products with bounded pagination and filters | READ | Read | No |
| `woocommerce.product.get` | Retrieve one product | READ | Read | No |
| `woocommerce.product.create` | Create a product | WRITE | Read/Write | Yes |
| `woocommerce.product.update` | Update selected product fields | WRITE | Read/Write | Yes |
| `woocommerce.order.list` | List orders | READ | Read | No |
| `woocommerce.order.get` | Retrieve one order | READ | Read | No |
| `woocommerce.order.status.update` | Change order status | HIGH_RISK | Read/Write | Explicit human approval |
| `woocommerce.order.note.add` | Add an order note | WRITE | Read/Write | Yes |
| `woocommerce.customer.list` | List customers | READ | Read | No |
| `woocommerce.customer.get` | Retrieve one customer | READ | Read | No |
| `woocommerce.coupon.list` | List coupons | READ | Read | No |
| `woocommerce.webhook.list` | List configured webhooks | READ | Read | No |

No generic arbitrary-request tool exists. Product deletion, order deletion, webhook creation/deletion, refunds, payment operations, permission changes, and store configuration changes are not exposed.

## Tool contracts

Every tool has:

- a stable provider-scoped name;
- a strict Zod input schema;
- `additionalProperties: false` in the MCP schema;
- a risk classification;
- provider permission requirements documented above;
- connector-side validation before any request;
- mapped provider/network errors;
- explicit approval enforcement for writes and high-risk actions.

Numeric resource IDs must be positive integers. Pagination is bounded to a maximum page size of 100. Search strings and free-text fields have maximum lengths. Tool callers cannot supply arbitrary URLs or REST paths.

## Permission and approval model

The connector distinguishes:

```text
Read -> Recommend -> Prepare -> Execute
```

READ calls can execute automatically.

WRITE and HIGH_RISK tools require both:

1. `WOOCOMMERCE_ALLOW_WRITES=true`
2. an exact `approvalToken` matching `WOOCOMMERCE_APPROVAL_TOKEN`

This prevents an agent from silently escalating itself from read access to execution privileges.

`woocommerce.order.status.update` is HIGH_RISK because order-state changes may trigger fulfillment, inventory, customer communications, accounting integrations, or other downstream automation. A human should review the specific order and intended transition before issuing the approval token.

Destructive operations are intentionally absent rather than merely hidden behind a weak flag.

## Reliability

The REST client implements:

- request timeouts with `AbortController`;
- bounded retry count, capped at 5;
- exponential backoff;
- `Retry-After` handling for 429 responses;
- retries for GET requests only when throttled or when the provider returns 5xx/network failures;
- no blind retry of POST/PUT writes;
- pagination parameters passed directly to WooCommerce;
- provider error mapping without credential leakage.

Authentication, permission, validation, and ordinary 4xx failures are never retried automatically.

## Rate limits

WooCommerce does not impose one universal REST API v3 limit across all installations; limits can depend on hosting, reverse proxies, WordPress plugins, infrastructure, or store-specific controls. WooCommerce separately documents configurable Store API rate limiting. This connector therefore treats HTTP 429 as authoritative, preserves `Retry-After`, uses bounded pagination, and avoids fan-out request patterns.

Operators should also configure infrastructure-level rate limits appropriate to their store and hosting environment.

## Error handling

- `401`: invalid or missing WooCommerce REST credentials
- `403`: API key access level or WordPress user capability denied the action
- `404`: resource or route not found
- `429`: throttled; retry metadata is preserved when present
- other `4xx`: surfaced as provider validation/request failures
- `5xx`: GET requests may retry with bounded backoff
- timeout/network failures: surfaced without secrets

## Webhooks and events

WooCommerce webhooks support resource/event topics and HMAC-SHA256 request signatures through the `X-WC-Webhook-Signature` header. This connector only exposes webhook discovery through `woocommerce.webhook.list`; it does not create, update, delete, or receive webhooks.

A production webhook receiver should:

- require HTTPS;
- verify the HMAC signature using the configured webhook secret;
- protect against replay and duplicate delivery;
- implement idempotent event processing;
- restrict payload logging because events can contain customer PII;
- treat webhook content as untrusted external data.

## Security considerations

### Credential isolation

The consumer key and secret are read only by `src/config.ts` and used only by `src/client.ts`. They never appear in prompts, tool schemas, output payloads, examples, or logs.

### SSRF controls

The store base URL comes only from startup configuration. Tool callers cannot override hostnames, protocols, ports, paths, or arbitrary request URLs. HTTPS is mandatory.

### Prompt injection and untrusted content

Products, orders, customer records, notes, metadata, coupon text, and webhook metadata are external untrusted data. The client adds:

```json
{ "source": "untrusted_provider_data" }
```

to successful results so downstream agents can preserve the trust boundary. Retrieved text must never modify connector permissions, approval policy, system instructions, or enabled tools.

### PII

Order and customer responses may contain names, emails, billing/shipping addresses, phone numbers, IP-related metadata, and other personal information. Apply data-minimization, retention, and access-control policies outside the connector as required by your environment.

### Upstream MCP security

WooCommerce's native MCP integration is official but still developer preview. This connector does not dynamically discover or auto-trust newly added upstream tools. `WOOCOMMERCE_MCP_URL` is metadata/configuration only in this implementation. If a deployment later enables direct upstream MCP routing, it should pin an allow-list of upstream tool names and independently validate authentication, permissions, schemas, and responses.

## Testing

Run:

```bash
npm test
```

The test suite uses fake `fetch` implementations and does not require live WooCommerce credentials. Coverage includes:

- configuration validation;
- HTTPS enforcement;
- tool registration;
- strict input validation;
- read pagination;
- Basic Auth header generation;
- default write denial;
- explicit approval requirements;
- provider permission errors;
- non-retry behavior for writes;
- 429 retry behavior for GET requests.

## Examples

See `examples/workflows.md` for read, write, and high-risk workflows with input, output shape, required permission, and approval behavior.

## Limitations

- Native WooCommerce MCP is documented but not directly proxied because it is currently developer preview.
- Hosted HTTP/SSE MCP transport is not provided by this package; this connector itself exposes stdio MCP.
- No delete operations are exposed.
- No refunds, payment-method changes, checkout placement, inventory batch mutation, store settings, user/role changes, or external customer messaging tools are exposed.
- Order status values can be extended by WooCommerce plugins; this connector validates length but intentionally does not hard-code only core statuses.
- The connector assumes WooCommerce REST API v3 is available and WordPress permalinks are configured correctly.
