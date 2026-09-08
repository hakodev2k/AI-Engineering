# Razorpay MCP/API Connector

Reusable MCP server exposing a constrained Razorpay tool surface for payment operations, orders, payment links, refunds, and settlements.

## Upstream strategy

Razorpay publishes an official Remote MCP Server at `https://mcp.razorpay.com/mcp` and an official open-source MCP implementation at `razorpay/razorpay-mcp-server`. This connector prefers that Remote MCP for capabilities it officially supports. Read operations fall back to Razorpay's REST API when the MCP transport is unavailable. `razorpay.refund.create` uses REST directly because the official MCP tool matrix marks `create_refund` as unavailable on the Remote Server.

Official references:

- MCP docs: https://razorpay.com/docs/mcp-server/remote/
- Official MCP source/tool matrix: https://github.com/razorpay/razorpay-mcp-server
- REST API: https://razorpay.com/docs/api/
- Payments: https://razorpay.com/docs/api/payments/
- Settlements: https://razorpay.com/docs/api/settlements/
- Security checklist/webhook guidance: https://security.razorpay.com/security/checklist/

The deprecated SSE MCP endpoint is not used; Razorpay documents `https://mcp.razorpay.com/mcp` as the Streamable HTTP endpoint.

## Architecture

`MCP client -> this server -> approval/policy gate -> credential-isolated Razorpay client -> official Remote MCP or REST API`

Provider content is treated as untrusted data and returned only as tool output. It is never interpreted as instructions and cannot alter tool registration, policy, credentials, or transport configuration. API hosts are fixed in code to prevent arbitrary request/SSRF behavior.

## Authentication

Create Razorpay API keys in the Dashboard. Set:

```text
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

The connector derives the MCP merchant token as `base64(key_id:key_secret)` in process memory. You can instead provide `RAZORPAY_MERCHANT_TOKEN`. Raw credentials are never included in tool inputs or outputs.

Razorpay API keys inherit the permissions of the merchant account; Razorpay does not use OAuth scopes for these API-key calls. Use dedicated least-privilege/test credentials where possible, restrict dashboard roles, enable 2FA, and never expose live keys to clients or prompts.

## Environment

```text
RAZORPAY_KEY_ID=                 # required
RAZORPAY_KEY_SECRET=             # required
RAZORPAY_MERCHANT_TOKEN=         # optional
RAZORPAY_TIMEOUT_MS=15000        # 1000..120000
RAZORPAY_REQUIRE_WRITE_APPROVAL=true
```

## Installation and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP over stdio, so any client supporting standard stdio MCP servers can launch it. Compatibility depends on the client's MCP implementation; no client-specific extension is required.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `razorpay.payment.get` | MCP -> REST fallback | READ | No |
| `razorpay.payment.list` | MCP -> REST fallback | READ | No |
| `razorpay.payment.card.get` | MCP -> REST fallback | READ | No |
| `razorpay.payment.capture` | MCP | HIGH_RISK | Always |
| `razorpay.order.get` | MCP -> REST fallback | READ | No |
| `razorpay.order.list` | MCP -> REST fallback | READ | No |
| `razorpay.order.payments.list` | MCP -> REST fallback | READ | No |
| `razorpay.order.create` | MCP | WRITE | Default yes; configurable |
| `razorpay.payment_link.get` | MCP -> REST fallback | READ | No |
| `razorpay.payment_link.list` | MCP -> REST fallback | READ | No |
| `razorpay.payment_link.create` | MCP | HIGH_RISK | Always |
| `razorpay.refund.get` | MCP -> REST fallback | READ | No |
| `razorpay.refund.list` | MCP -> REST fallback | READ | No |
| `razorpay.refund.create` | REST | HIGH_RISK | Always |
| `razorpay.settlement.get` | MCP -> REST fallback | READ | No |
| `razorpay.settlement.list` | MCP -> REST fallback | READ | No |
| `razorpay.settlement.recon` | MCP -> REST fallback | READ | No |

Amounts are integer currency subunits, matching Razorpay API contracts. IDs, pagination, timestamps, currency codes, contacts, notes, and maximum amount bounds are validated before transport calls.

## Approval model

READ tools can execute automatically. WRITE tools require `approved=true` when `RAZORPAY_REQUIRE_WRITE_APPROVAL=true`. HIGH_RISK operations always require `approved=true`, regardless of configuration. The approval flag represents an approval already obtained by the host/human; the connector never self-approves.

Money-moving actions are never blindly retried. In particular, capture, payment-link creation, order creation, and refund creation are single-attempt operations. This avoids duplicate financial side effects when the caller cannot determine whether an upstream request completed.

## Reliability and rate limits

REST reads have a bounded maximum of three attempts for HTTP 429/5xx and network failures, with exponential backoff and `Retry-After` preservation. Validation, authentication/permission failures, and writes are not automatically retried. HTTP requests have a configurable timeout. MCP reads receive one bounded reconnect retry before REST fallback.

Razorpay limits vary by product/account and may return throttling responses; this connector does not assume a fixed global quota. Pagination is bounded (`count <= 100`, settlement reconciliation `count <= 1000`) to avoid request amplification.

## Errors

Provider errors are reduced to safe messages and status metadata. Secrets are never logged by this package. A 401/403 should be treated as credential or account-permission failure and requires operator action; it is not retried.

## Security

- Fixed official MCP and REST origins; no arbitrary URL tool.
- Credentials remain inside the client/authentication layer.
- Explicit allowlist of upstream MCP tool names; newly discovered tools are not exposed automatically.
- Strict Zod validation and bounded pagination.
- High-risk financial actions require explicit human approval.
- No automatic retries for writes/money movement.
- Retrieved Razorpay data is untrusted content, not executable instruction.
- Follow Razorpay's HMAC verification guidance for checkout callbacks and webhooks. Webhook ingestion is intentionally not implemented here because a secure public receiver, secret management, replay protection, and application-specific event routing are deployment concerns.

## Tests

```bash
npm test
```

Unit tests use mocks and require no live Razorpay credentials. They cover authentication configuration, derived merchant tokens, approval denial, read/write risk policy, REST credential isolation, throttling metadata, no retry for unsafe POST, and timeout validation.

## Limitations

This connector intentionally does not expose payouts, instant settlements, token revocation, OTP flows, QR-code closing, subscriptions, or arbitrary raw API execution. Some Razorpay products require account activation or product-specific eligibility. Live financial behavior cannot be validated without merchant credentials, so normal tests stay offline and deterministic.
