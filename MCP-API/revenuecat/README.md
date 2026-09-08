# RevenueCat MCP/API Connector

Reusable MCP server for RevenueCat subscription infrastructure. It exposes a stable, provider-scoped tool surface while routing each operation to the safest official upstream transport available.

## Transport strategy

RevenueCat provides an official cloud-hosted MCP server at `https://mcp.revenuecat.ai/mcp`. This connector uses that official MCP server for supported project/catalog/customer/analytics read operations and promotional entitlement grants. RevenueCat REST API v2 is used only where the required capability is not part of the general MCP tool set implemented here, specifically customer search plus subscription cancellation/refund operations.

Official sources used for this implementation:

- RevenueCat MCP overview: https://www.revenuecat.com/docs/tools/mcp
- RevenueCat MCP setup/authentication: https://www.revenuecat.com/docs/tools/mcp/setup
- RevenueCat MCP tools reference: https://www.revenuecat.com/docs/tools/mcp/tools-reference
- RevenueCat REST API v2: https://www.revenuecat.com/docs/api-v2
- Customer API: https://www.revenuecat.com/docs/api-v2/customer
- Customer resources API: https://www.revenuecat.com/docs/api-v2/customer/resources
- Subscription API: https://www.revenuecat.com/docs/api-v2/subscription

RevenueCat documents the hosted MCP server as supporting OAuth for compatible interactive clients and Bearer authentication using an API v2 secret key. This reusable connector uses a dedicated API v2 secret key so credentials remain inside the connector process.

## Implemented tools

| Tool | Upstream | Risk | Approval | Purpose |
|---|---|---|---|---|
| `revenuecat.project.list` | Official MCP | READ | No | List accessible projects |
| `revenuecat.app.list` | Official MCP | READ | No | List apps in a project |
| `revenuecat.product.list` | Official MCP | READ | No | List catalog products |
| `revenuecat.product.get` | Official MCP | READ | No | Get one catalog product |
| `revenuecat.entitlement.list` | Official MCP | READ | No | List entitlements |
| `revenuecat.offering.list` | Official MCP | READ | No | List offerings |
| `revenuecat.customer.search` | REST v2 | READ | No | Search/list customers |
| `revenuecat.customer.get` | Official MCP | READ | No | Get customer details |
| `revenuecat.customer.subscription.list` | Official MCP | READ | No | List customer subscriptions |
| `revenuecat.customer.entitlement.grant` | Official MCP | WRITE | Yes | Grant promotional entitlement access |
| `revenuecat.subscription.get` | Official MCP | READ | No | Get a subscription |
| `revenuecat.subscription.cancel` | REST v2 | HIGH_RISK | Yes | Cancel active Web Billing renewal |
| `revenuecat.subscription.transaction.refund` | REST v2 | DESTRUCTIVE | Yes | Refund/cancel Play Store or Galaxy transaction |
| `revenuecat.analytics.overview` | Official MCP | READ | No | Get project overview metrics |
| `revenuecat.webhook.list` | Official MCP | READ | No | List webhook integrations |

No arbitrary HTTP request tool is exposed.

## Architecture

```text
MCP client / AI agent
        |
        v
RevenueCat connector MCP server (stdio)
        |
        +--> approval + validation layer
        |
        +--> official RevenueCat MCP (allow-listed tool names)
        |
        +--> RevenueCat REST API v2 fallback
        |
        v
RevenueCat
```

Provider API credentials never appear in MCP tool schemas or tool results. RevenueCat content is treated as untrusted data and is returned as data, not interpreted as instructions.

## Authentication and least privilege

Create a dedicated RevenueCat API v2 secret key in the RevenueCat dashboard. RevenueCat API v2 keys are permissioned; grant only the resource permissions needed for the tools you enable.

Known exact permissions for the sensitive REST paths used here:

- Customer search: `customer_information:customers:read`
- Subscription cancellation: `customer_information:subscriptions:read_write`
- Transaction refund: `customer_information:subscriptions:read_write`

RevenueCat documents customer/subscription read endpoints under the corresponding `customer_information:*:read` permissions. For MCP-routed project/catalog/analytics operations, configure the API v2 key with the matching read permission(s) shown in RevenueCat's API key permission UI and endpoint documentation. A write-enabled permission is required for `grant-customer-entitlement`.

The official hosted MCP also supports OAuth for supported clients. OAuth is intentionally not reimplemented inside this server-to-server connector because the connector must keep upstream credentials isolated from the model. Interactive MCP clients can connect directly to RevenueCat's hosted MCP when OAuth is preferred.

## Environment variables

Copy `.env.example` into your secret-management workflow; do not commit real values.

- `REVENUECAT_API_V2_KEY` — required; RevenueCat API v2 secret key.
- `REVENUECAT_MCP_URL` — optional; defaults to the official hosted MCP endpoint.
- `REVENUECAT_API_BASE_URL` — optional; defaults to the official REST API v2 endpoint.
- `REVENUECAT_APPROVAL_TOKEN` — required to execute WRITE/HIGH_RISK/DESTRUCTIVE tools.
- `REVENUECAT_TIMEOUT_MS` — REST timeout, default `15000`.
- `REVENUECAT_MAX_RETRIES` — bounded REST retry count, default `2`.

Endpoint overrides must use HTTPS.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
REVENUECAT_API_V2_KEY='...' npm start
```

The process exposes an MCP stdio server. Configure an MCP client to launch this command in the connector directory. Any client supporting standard MCP stdio servers can use it; client-specific authentication/configuration remains the responsibility of that client/runtime.

## Permission and approval model

`READ` tools execute automatically after input validation. `WRITE`, `HIGH_RISK`, and `DESTRUCTIVE` tools require `REVENUECAT_APPROVAL_TOKEN` to be configured by the operator and require the caller to provide the matching token in `approval_token` for that individual call. This prevents an agent from silently upgrading its own connector permissions solely through tool parameters.

The approval token is connector authorization state, not a RevenueCat credential. It should still be supplied out-of-band by the human/operator and handled as sensitive runtime data.

Risk choices:

- Promotional entitlement grant is `WRITE` because it changes customer access.
- Web Billing cancellation is `HIGH_RISK` because it changes future billing/renewal state.
- Store transaction refund is `DESTRUCTIVE` because it refunds/cancels and revokes subscription access.

No customer deletion, project deletion, product archival, paywall publication, experiment start/stop, or webhook mutation tool is exposed by this connector.

## Validation

Inputs use strict Zod schemas. Unknown keys are rejected. IDs are length bounded, pagination is capped at 100, search is bounded to the provider's documented 255-character limit, timestamps must be positive integers, and URL path segments are encoded before REST use.

The connector never accepts a caller-supplied arbitrary provider URL, preventing generic SSRF-style forwarding through the tool surface.

## Reliability and rate limits

RevenueCat API v2 documents domain-based rate limiting. Customer Information endpoints used here have a documented default limit of 480 requests/minute; the subscription transaction refund domain is also documented at 480 requests/minute.

REST behavior:

- request timeout via `AbortController`;
- bounded retries only for `429` and `5xx` responses or transient network failures;
- exponential backoff capped at two seconds between local retry attempts;
- honors `Retry-After` when RevenueCat supplies it;
- does not retry `400`, `401`, `403`, `404`, `409`, `422`, or other validation/auth/permission failures;
- pagination is caller-controlled with `limit` and `starting_after`, avoiding unbounded fan-out.

The connector does not independently retry an MCP mutation after an upstream MCP failure, avoiding duplicate side effects.

## Errors

REST failures are surfaced as `RevenueCatError` with HTTP status, parsed provider body, and `retryAfterMs` when available. MCP `isError` responses are converted to connector errors without trusting provider-returned text as instructions.

Authentication or permission failures require operator action and are not automatically retried.

## Security considerations

- Use a dedicated least-privilege API v2 key.
- Keep `REVENUECAT_API_V2_KEY` and approval state in a secret manager or process environment.
- Never place provider secrets in prompts, tool arguments, examples, logs, or source control.
- Restrict the official MCP transport to the configured RevenueCat HTTPS endpoint.
- This connector invokes a fixed allow-list of official MCP tool names; newly added upstream tools are not automatically trusted or exposed.
- Third-party customer attributes, webhook URLs, product metadata, and analytics labels may contain hostile or misleading text; treat them only as untrusted data.
- Rotate/revoke the RevenueCat key if exposure is suspected.

## Testing

Unit tests use mocks and do not require live RevenueCat credentials.

```bash
npm test
```

Coverage includes authentication configuration, HTTPS enforcement, approval denial/success, tool registration, credential isolation in HTTP headers, JSON response handling, 429 retry behavior, and non-retry of permission errors.

## Examples

See `examples/workflows.md` for customer access inspection, promotional access, cancellation, and refund examples with risk/approval classification.

## Limitations

- The connector intentionally exposes a curated subset rather than every RevenueCat API/MCP capability.
- RevenueCat's official MCP tool set evolves; this connector only calls the fixed upstream tool names documented when this version was generated.
- `revenuecat.subscription.cancel` only applies to active RevenueCat Web Billing subscriptions.
- `revenuecat.subscription.transaction.refund` only represents RevenueCat's documented Play Store/Galaxy transaction refund endpoint; it must not be assumed to refund arbitrary stores.
- Store-console publication, billing changes, project deletion, customer deletion, and other broad administrative actions are intentionally unsupported.
