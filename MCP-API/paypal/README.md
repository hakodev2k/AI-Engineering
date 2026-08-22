# PayPal MCP/API Connector

Reusable MCP wrapper for PayPal merchant workflows. The connector exposes a small, stable set of provider-scoped MCP tools while delegating supported business operations to PayPal's official MCP server.

## Provider

- Provider: PayPal
- Package path: `MCP-API/paypal/`
- Runtime: Node.js 20+
- External transport: MCP over stdio
- Upstream transport: PayPal official remote MCP over Streamable HTTP
- Authentication: OAuth 2.0 client credentials
- Default environment: PayPal Sandbox

## Official sources

Current implementation is based on PayPal's official documentation and repositories:

- PayPal MCP server quickstart: https://developer.paypal.com/ai-tools/mcp-server
- PayPal official MCP repository: https://github.com/paypal/paypal-mcp-server
- PayPal REST authentication: https://developer.paypal.com/api/rest/authentication/
- PayPal REST request guidance: https://developer.paypal.com/api/rest/requests/
- PayPal rate-limiting guidance: https://developer.paypal.com/api/rest/reference/rate-limiting/
- PayPal REST response/error guidance: https://developer.paypal.com/api/rest/responses/
- PayPal Orders API overview: https://developer.paypal.com/api/rest/integration/orders-api/

PayPal documents both local `@paypal/mcp` and hosted MCP options. The hosted endpoints are:

- Sandbox: `https://mcp.sandbox.paypal.com/http`
- Production: `https://mcp.paypal.com/http`

This connector uses the hosted Streamable HTTP MCP endpoint because it avoids running or dynamically installing another child MCP process.

## Transport strategy

The connector follows the capability-first transport rule:

1. PayPal official MCP is used for implemented invoices, orders, refunds, and disputes because PayPal publishes those MCP tools directly.
2. PayPal REST is used only to obtain and refresh the OAuth 2.0 bearer token needed to authenticate the MCP connection.
3. No unofficial MCP server is used.
4. No arbitrary PayPal REST proxy is exposed.

Upstream MCP tool discovery does not automatically expand connector permissions. The wrapper has a fixed allowlist of exactly the PayPal tools required by this package.

## Implemented capabilities

| Connector tool | Official upstream tool | Risk | Approval |
|---|---|---:|---|
| `paypal.invoice.list` | `list_invoices` | READ | No |
| `paypal.invoice.get` | `get_invoice` | READ | No |
| `paypal.invoice.create` | `create_invoice` | WRITE | Required by default |
| `paypal.invoice.send` | `send_invoice` | HIGH_RISK | Always |
| `paypal.invoice.remind` | `send_invoice_reminder` | HIGH_RISK | Always |
| `paypal.invoice.cancel` | `cancel_sent_invoice` | HIGH_RISK | Always |
| `paypal.order.create` | `create_order` | WRITE | Required by default |
| `paypal.order.get` | `get_order` | READ | No |
| `paypal.order.capture` | `pay_order` | HIGH_RISK | Always |
| `paypal.refund.create` | `create_refund` | HIGH_RISK | Always |
| `paypal.refund.get` | `get_refund` | READ | No |
| `paypal.dispute.list` | `list_disputes` | READ | No |
| `paypal.dispute.get` | `get_dispute` | READ | No |
| `paypal.dispute.accept` | `accept_dispute_claim` | HIGH_RISK | Always |

The wrapper intentionally does not expose every PayPal MCP tool. Product management, subscriptions, shipment tracking, transaction reporting, and other PayPal capabilities can be added in a separate reviewed change if required.

## Real-world workflows

Supported flows include:

- List invoices -> inspect invoice -> create draft invoice -> human approval -> send invoice.
- Get order -> review buyer/order state -> human approval -> capture payment.
- Inspect captured payment context -> human approval -> full or partial refund.
- List disputes -> inspect dispute -> human review -> accept a dispute claim.

The connector separates read/recommend/prepare steps from execution. Financial or externally visible actions are never silently promoted from READ to WRITE.

## Architecture

```text
Agent / MCP client
       |
       v
PayPal connector (stdio MCP)
       |
       +-- strict Zod input validation
       +-- risk / approval policy
       +-- fixed upstream tool allowlist
       +-- OAuth token provider + cache
       |
       v
PayPal official remote MCP
       |
       v
PayPal APIs
```

Raw PayPal credentials and bearer tokens remain inside the connector process. They are never added to MCP tool arguments or returned to the model.

## Authentication

PayPal REST APIs use OAuth 2.0 access tokens. This package accepts the PayPal app's client ID and client secret, exchanges them using the official `/v1/oauth2/token` client-credentials flow, then caches the resulting access token until shortly before expiry.

Required environment variables:

```text
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

Optional variables:

```text
PAYPAL_ENVIRONMENT=SANDBOX
PAYPAL_LIVE_MODE_ALLOWED=false
PAYPAL_REQUIRE_WRITE_APPROVAL=true
PAYPAL_APPROVAL_SECRET=
PAYPAL_TIMEOUT_MS=20000
```

### Sandbox-first behavior

`PAYPAL_ENVIRONMENT` defaults to `SANDBOX`.

Production is rejected unless both values are explicitly configured:

```text
PAYPAL_ENVIRONMENT=PRODUCTION
PAYPAL_LIVE_MODE_ALLOWED=true
```

This prevents an accidental switch from test transactions to live merchant operations.

## Permissions and scopes

PayPal client-credentials tokens return the permissions/scopes granted to the PayPal REST app. The connector does not request broader scopes dynamically and cannot increase app permissions.

The implemented tools require the PayPal app to have the corresponding merchant capabilities enabled. Depending on the account/application configuration, the returned token can include PayPal service scopes for capabilities such as:

- invoicing
- payment/order authorization and capture
- refunds
- seller dispute read/update

PayPal's authentication documentation shows service URI scopes in the access-token response, including invoicing, payment auth/capture, refund, and dispute permissions. Exact permissions should be reviewed in the PayPal Developer Dashboard for the merchant application rather than hard-coded into prompts.

If an app lacks a required capability, PayPal returns an authorization/permission error; the connector does not attempt permission escalation.

## Installation

From this provider directory:

```bash
npm install
npm run build
```

Copy `.env.example` into your secret/configuration mechanism and populate credentials. Do not commit the resulting secret values.

## Running the MCP server

Development:

```bash
npm run dev
```

Built server:

```bash
npm run build
npm start
```

The connector itself exposes stdio MCP. Use it with MCP hosts that support launching local stdio servers. Clients that require a remotely hosted HTTP MCP endpoint need an appropriate trusted stdio-to-remote deployment/bridge; this package does not claim to be a hosted service by itself.

## Input validation

Inputs use strict bounded schemas for the supported business workflow:

- PayPal IDs accept only bounded alphanumeric/underscore/hyphen values.
- Currency must be a three-letter uppercase code.
- Invoice/order item arrays are bounded to 100 items.
- Item names and quantities are bounded.
- Monetary values must be non-negative/positive within a finite maximum.
- Partial refunds require both `amount` and `currency`; omitting both requests a full refund.
- Approval tokens and expiry timestamps are stripped before upstream MCP calls.

There is no `execute_any_api_request`, arbitrary URL, arbitrary MCP tool, or unrestricted provider request tool.

## Permission model

### READ

READ tools execute without approval and are eligible for one bounded retry on clearly transient failures such as 429, selected 5xx statuses, connection reset, or timeout.

### WRITE

`paypal.invoice.create` and `paypal.order.create` are WRITE operations. Approval is required by default. A trusted operator can disable approval for WRITE only with:

```text
PAYPAL_REQUIRE_WRITE_APPROVAL=false
```

This switch does not weaken HIGH_RISK operations.

### HIGH_RISK

Sending/reminding/canceling invoices, capturing payment, creating refunds, and accepting disputes always require explicit approval.

No HIGH_RISK operation is automatically retried for rate-limit or ambiguous transient failures. This avoids duplicate or unintended financial/external actions.

### DESTRUCTIVE

No DESTRUCTIVE PayPal tool is exposed in this connector. Unknown tools fail closed.

## Human approval

Set a strong connector-local secret (prefer a secret manager):

```text
PAYPAL_APPROVAL_SECRET=<at-least-32-random-characters>
```

Approval is bound to:

- connector tool name
- SHA-256 hash of the exact provider operation payload
- expiry timestamp

The maximum approval lifetime is five minutes.

When an approval-required tool is called without approval, the connector returns an error containing the operation `target` hash and valid expiry range. A human/operator signs that exact operation outside the model process:

```bash
PAYPAL_APPROVAL_SECRET='secret-manager-value' \
  npm run approval -- paypal.order.capture <target> <expiresAtEpochMs>
```

The generated HMAC token can then be supplied as `approvalToken` together with `approvalExpiresAt`. A token cannot be reused for a different tool, changed amount, changed recipient/resource, or expired operation.

The approval secret itself should never be available to the LLM or inserted into prompts.

## Reliability

### OAuth refresh

The connector caches the OAuth bearer token instead of generating one for each request. Tokens are refreshed shortly before expiration. If the MCP connection reports a clear authentication/token-expiry error, the token is refreshed and the MCP connection is recreated.

### Timeouts

`PAYPAL_TIMEOUT_MS` defaults to 20 seconds and is bounded between 1 and 60 seconds.

### Retry policy

- READ: at most one bounded transient retry with jitter.
- WRITE/HIGH_RISK: no automatic transient retry.
- Clear token-expiry/authentication failure: refresh token and reconnect once.
- Validation, authorization, permission, or business-rule errors are not treated as transient retries.

PayPal documents that retrying some capture/execute operations can require a stable `PayPal-Request-Id`. Because the official MCP tool contract used here does not expose that request-id control through this wrapper, financial write tools deliberately avoid blind retries.

## Rate limits

PayPal does not publish one general fixed REST rate limit. Official guidance states that requests can be temporarily throttled and return HTTP `429 RATE_LIMIT_REACHED` when traffic is considered excessive or anomalous.

This connector therefore:

- caches OAuth access tokens
- avoids unnecessary polling
- bounds pagination inputs
- retries READ operations only once on explicit transient/throttle failures
- does not automatically retry financial/external writes

For workflows needing event-driven state changes, prefer PayPal webhooks rather than high-frequency polling. Webhook consumption is not implemented in this package.

## Error handling

Provider/MCP errors are propagated without exposing credentials. Expected classes include:

- OAuth/authentication errors
- missing app permissions/scopes
- invalid resource IDs
- business validation errors
- rate limiting
- upstream MCP transport failures
- timeouts

Error messages are bounded where the connector creates them. OAuth bearer tokens and client secrets are never logged by package code.

## Provider content and prompt injection

PayPal MCP responses are treated as untrusted provider data. The MCP tool output wraps results with:

```json
{
  "source": "paypal-official-mcp",
  "untrusted_provider_data": true,
  "result": {}
}
```

Retrieved invoice/order/dispute text is data, not executable instruction. Provider content cannot add tools, change the allowlist, change permissions, reveal credentials, or bypass approval checks.

## MCP security

- Only PayPal's fixed official sandbox/production MCP hosts are used.
- No caller-provided MCP URL is accepted, reducing SSRF/configuration substitution risk.
- The connector does not call `tools/list` and then auto-enable newly discovered provider tools.
- Only the 14 explicitly allowlisted upstream tools can be called.
- Bearer credentials are injected by the connector transport and are not forwarded through model arguments.
- Unexpected upstream tools or unknown wrapper tools fail closed.

## Testing

Unit tests do not require live PayPal credentials.

Run:

```bash
npm test
```

Tests cover:

- sandbox endpoint defaults
- production safety guard
- OAuth token caching with mocked `fetch`
- read operation approval behavior
- default WRITE approval denial
- valid resource-bound approval
- approval replay against a different target
- fixed MCP upstream allowlist

Integration tests with real sandbox credentials are intentionally separate from normal unit tests because they could create provider-side resources.

## Usage examples

See `examples/tool-calls.md` for READ, WRITE, HIGH_RISK, partial-refund, dispute, and approval flows.

## Limitations

- This package implements a reviewed subset of PayPal's official MCP catalog, not every PayPal API or MCP tool.
- It does not expose arbitrary REST requests.
- It does not implement webhook receivers or webhook signature verification.
- It does not implement PayPal subscriptions, products, shipment tracking, payouts, transaction reporting, or QR generation even though PayPal may support some of those capabilities elsewhere.
- High-risk operations require operator-signed approvals and are intentionally inconvenient to automate without human oversight.
- Normal unit tests use mocks; a PayPal sandbox account is required to validate end-to-end merchant behavior.

## Reusability

No merchant ID, account ID, customer email, invoice ID, order ID, dispute ID, tenant, project, repository, or environment-specific URL is hard-coded. Sandbox and production endpoints are fixed official PayPal hosts selected by configuration.

The connector can be reused by projects and agent hosts that support stdio MCP, while preserving a stable external tool contract independent of PayPal's internal API transport.
