# Adyen MCP/API Connector

Reusable security gateway for Adyen payment and merchant-management workflows. The connector exposes a stable provider-scoped MCP interface and delegates implemented operations to Adyen's official `@adyen/mcp` server over stdio.

## Official transport strategy
Adyen publishes and documents an official local MCP server. The official server currently covers Checkout API and Management API operations, including payment links, payment modifications, merchant accounts, terminals, webhooks, payment methods, users, API credentials, and allowed origins. This connector uses that first-party MCP implementation rather than an unofficial server or redundant REST wrapper for the selected capabilities.

Official sources reviewed for this connector:
- Adyen MCP documentation: https://docs.adyen.com/development-resources/mcp-server/
- Official MCP repository: https://github.com/Adyen/adyen-mcp
- API authentication: https://docs.adyen.com/development-resources/api-authentication
- API credentials: https://docs.adyen.com/development-resources/api-credentials
- API credential roles: https://docs.adyen.com/development-resources/api-credentials/roles
- API Explorer: https://docs.adyen.com/api-explorer/
- Response/rate-limit handling: https://docs.adyen.com/development-resources/response-handling
- API idempotency: https://docs.adyen.com/development-resources/api-idempotency
- Secure webhooks: https://docs.adyen.com/development-resources/webhooks/secure-webhooks

The connector starts the official package with a fixed allowlist of upstream tools. Newly added Adyen MCP tools are not trusted or exposed automatically.

## Architecture
```text
MCP client / AI agent
  -> adyen.* stable tools
  -> Zod validation
  -> risk + payload-bound human approval policy
  -> allowlisted official Adyen MCP tool
  -> @adyen/mcp (stdio)
  -> Adyen Checkout / Management APIs
```

The Adyen API key exists only in the connector process and the official child MCP process environment. It is never accepted as a tool argument or returned to the model.

## Authentication
Set `ADYEN_API_KEY`. Adyen API-key authentication uses the `x-API-key` header; the official MCP server handles the provider request and receives the key through its environment. `ADYEN_ENV` is `TEST` by default. For `LIVE`, also set the live URL prefix identifier from Adyen Customer Area in `ADYEN_LIVE_PREFIX`.

Adyen recommends creating a dedicated web service user/API credential for MCP use and granting only required roles. For the full tool set in this connector, commonly relevant roles are:
- Merchant PAL webservice role
- Checkout webservice role
- Management API—Account read
- Management API—Webhooks read

Do not grant write roles that this connector does not need. This connector does not manage credentials, users, terminal configuration, payment-method configuration, or webhook destinations.

## Environment
```text
ADYEN_API_KEY=
ADYEN_ENV=TEST
ADYEN_LIVE_PREFIX=
ADYEN_TIMEOUT_MS=20000
ADYEN_MAX_RETRIES=2
ADYEN_REQUIRE_WRITE_APPROVAL=true
ADYEN_APPROVAL_SECRET=
```
`ADYEN_APPROVAL_SECRET` must be at least 16 characters when an approval-gated tool is used. Store it separately from the Adyen API key.

## Install and run
Requires Node.js 20+ and `npx` access to the official `@adyen/mcp` package.
```bash
npm install
npm run build
npm test
npm start
```
The outward server uses MCP stdio, so clients that can launch a standard local stdio MCP server can configure `node dist/src/server.js` with secrets supplied through their secure process environment.

## Implemented tools
| Tool | Official upstream MCP tool | Risk | Approval |
|---|---|---|---|
| `adyen.merchant.list` | `list_merchant_accounts` | READ | no |
| `adyen.merchant.get` | `get_merchant_account` | READ | no |
| `adyen.payment_link.create` | `create_payment_links` | WRITE | yes by default |
| `adyen.payment_link.get` | `get_payment_link` | READ | no |
| `adyen.payment_link.expire` | `update_payment_link` with `status=expired` | HIGH_RISK | always |
| `adyen.payment.cancel` | `cancel_payment` | HIGH_RISK | always |
| `adyen.payment.refund` | `refund_payment` | HIGH_RISK | always |
| `adyen.webhook.company.list` | `list_all_company_webhooks` | READ | no |
| `adyen.webhook.company.get` | `get_company_webhook` | READ | no |
| `adyen.webhook.merchant.list` | `list_all_merchant_webhooks` | READ | no |
| `adyen.webhook.merchant.get` | `get_merchant_webhook` | READ | no |

No generic upstream-tool proxy, arbitrary HTTP request, credential-management, terminal mutation, webhook mutation, payment capture, or new-payment/session tool is exposed.

## Permission and approval model
READ operations may execute automatically. WRITE operations require explicit approval by default; an operator can disable only the generic WRITE requirement using `ADYEN_REQUIRE_WRITE_APPROVAL=false`. HIGH_RISK tools always require approval regardless of that setting.

Approval tokens are HMAC-SHA256 digests over the exact external tool name and canonicalized exact arguments excluding `approvalToken`. Therefore an approval for one amount, merchant account, payment reference, or payment-link ID cannot silently authorize a modified payload.

`adyen.payment_link.expire` is HIGH_RISK because expiry is a destructive state transition. Cancellation and refund are HIGH_RISK because they alter payment state and money flow. No DESTRUCTIVE class tool is exposed in this version.

## Reliability and rate limits
Every upstream MCP call has a configurable timeout. READ operations may receive bounded retries with exponential backoff only when the error looks transient (rate limiting, timeout, temporary network/provider failures, 502/503/504). Mutating operations execute at most once from this connector and are never blindly retried.

Adyen documents HTTP 429 for excessive request rate and recommends retry with exponential backoff and jitter. Adyen also documents idempotency support for POST requests using `idempotency-key`; because the official MCP server owns the provider HTTP layer, this wrapper does not invent or inject undocumented idempotency behavior. For payment modifications, callers should use webhook outcomes as the source of truth when final processing is asynchronous.

Pagination is bounded to page sizes of 1–100 and positive page numbers. The connector does not auto-walk unbounded result sets.

## Error handling
Configuration and schema errors fail before provider execution. Unknown tools are denied. Authentication, permission, validation, and provider errors from the official MCP server are surfaced without intentionally including credentials. READ retries are bounded; HIGH_RISK and WRITE calls are not retried by this gateway.

## Security considerations
- Credentials remain in the connector/upstream process environment, never model-visible tool parameters.
- Only a fixed official `@adyen/mcp` package and explicit upstream tool allowlist are launched.
- The agent cannot change `ADYEN_ENV`, live prefix, approval policy, retry policy, or credentials through a tool call.
- LIVE requires a separately configured validated live-prefix identifier.
- IDs are length/character bounded; monetary values must be positive integers in minor units; currency/country codes are length constrained.
- Provider responses are wrapped with `untrusted_provider_data: true`. Payment references, merchant metadata, webhook configuration text, and any other retrieved provider content are data, not instructions.
- No raw card PAN/CVC input is exposed, reducing PCI-sensitive agent surface.
- Webhook configuration is read-only. If webhook mutation is added later, endpoint allowlisting, HTTPS enforcement, secret handling, and explicit approval are required.
- For webhook receivers outside this connector, follow Adyen guidance for authentication and HMAC/signature verification where applicable.

## Tests
`npm test` builds and runs credential-free unit tests. Tests cover required auth configuration, LIVE prefix validation, tool registry uniqueness, strict input validation, risk classification, default write denial, and payload-bound approval behavior. Live Adyen calls are intentionally excluded from normal unit tests.

## Examples
See `examples/workflows.md` for merchant inspection, payment-link creation/read, payment cancellation/refund, webhook discovery, expected output shape, risk classification, and approval requirements.

## Limitations
- The connector intentionally exposes 11 reviewed operations instead of the full official Adyen MCP inventory.
- It does not create payment sessions or raw payments and does not accept cardholder data.
- It does not manage users, API credentials, allowed origins, terminals, terminal settings, payment methods, or webhook destinations.
- It does not receive webhooks; webhook ingestion belongs in an externally reachable service with independent authentication/signature/replay handling.
- Production/live availability depends on the configured Adyen account, API credential roles, merchant scope, and live URL prefix.
- The official Adyen MCP server is currently described by Adyen as an evolving MCP integration; pin and review package versions under your software supply-chain policy for production deployment.
