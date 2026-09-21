# Stripe MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of Stripe operations for agent workflows. The upstream transport is Stripe's official HTTPS REST API. No official Stripe MCP server was identified in Stripe's official documentation during implementation, so this connector does not depend on an unofficial MCP service.

## Official sources
- API reference: https://docs.stripe.com/api
- Authentication: https://docs.stripe.com/api#authentication
- Idempotent requests: https://docs.stripe.com/api/idempotent_requests
- Error handling: https://docs.stripe.com/error-handling
- Invoices API: https://docs.stripe.com/api/invoices

Stripe documents `https://api.stripe.com` as the API base, API-key authentication (including restricted keys), HTTPS-only requests, pagination, errors, request IDs, and idempotency for POST operations. Use a restricted key whenever its permissions cover the enabled tools.

## Transport and architecture
`MCP client -> stdio MCP server -> policy/validation -> StripeClient -> https://api.stripe.com/v1`. Credentials are read only inside configuration/client code and are never returned in tool results. Provider responses are marked `untrusted_provider_content` so callers do not treat remote text as instructions.

## Tools
| Tool | Risk | Approval | Upstream |
|---|---|---|---|
| stripe.customer.list | READ | No | REST |
| stripe.customer.get | READ | No | REST |
| stripe.customer.search | READ | No | REST |
| stripe.customer.create | WRITE | Configurable | REST |
| stripe.customer.update | WRITE | Configurable | REST |
| stripe.product.list | READ | No | REST |
| stripe.price.list | READ | No | REST |
| stripe.payment_intent.list | READ | No | REST |
| stripe.payment_intent.get | READ | No | REST |
| stripe.invoice.list | READ | No | REST |
| stripe.invoice.get | READ | No | REST |
| stripe.payment_link.create | HIGH_RISK | Always | REST |
| stripe.refund.create | HIGH_RISK | Always | REST |
| stripe.event.list | READ | No | REST |

No delete, payout, dispute mutation, subscription cancellation, account/permission, or arbitrary-request tool is exposed.

## Authentication and permissions
Set `STRIPE_SECRET_KEY` to a secret or restricted API key. Exact restricted-key permissions are configured in Stripe and must include only resources used by the tools you enable: Customers, Products, Prices, PaymentIntents, Invoices, Payment Links, Refunds, and Events as applicable. Stripe's restricted-key permission matrix can evolve, so configure least privilege in the Dashboard rather than embedding broad credentials in this package. Never expose the key to prompts or client tool arguments.

Optional `STRIPE_API_VERSION` pins requests to a Stripe API version. If omitted, Stripe uses the account/key default behavior. The connector never logs credentials.

## Approval model
READ executes automatically. WRITE requires an approved action by default; set `STRIPE_REQUIRE_WRITE_APPROVAL=false` only in a trusted environment. HIGH_RISK always requires approval. An operator places non-secret workflow IDs in `STRIPE_APPROVED_ACTION_IDS`; the agent supplies one matching `action_id`. This prevents a model from self-asserting approval without an out-of-band operator configuration change. DESTRUCTIVE operations are not implemented.

## Installation and run
Requires Node.js 20+.
```bash
npm install
npm run build
STRIPE_SECRET_KEY=sk_test_... npm start
```
The server uses MCP stdio and can be launched by MCP clients that support stdio child-process servers. Configure the command as `node /absolute/path/to/dist/index.js` and inject environment variables through the client's secure environment configuration. Compatibility depends on the client's standards-compliant stdio MCP support; no vendor-specific integration is claimed.

## Environment
Copy `.env.example` into your secret-management workflow; the server does not load dotenv automatically. `STRIPE_TIMEOUT_MS` defaults to 15000 (range 1000–60000). `STRIPE_MAX_RETRIES` defaults to 2 (range 0–5). `STRIPE_APPROVED_ACTION_IDS` is a comma-separated set of non-secret approval references.

## Reliability and rate limits
The client supports pagination parameters on list tools, request timeout/cancellation via `AbortController`, bounded exponential backoff, Stripe `Retry-After`, and provider error mapping. Retries are limited to HTTP 409, 429, 5xx, or transport failures. 4xx authentication, permission, and validation failures are not retried. POST tools require caller-supplied idempotency keys, preventing accidental duplicate side effects during retries. Retry delay is capped at five seconds per attempt.

Stripe can apply different rate/concurrency limits by endpoint and account. This connector therefore reacts to HTTP 429 and `Retry-After` instead of hard-coding a single global quota.

## Validation and security
Inputs are allow-listed and bounded with Zod. IDs reject path separators, preventing path injection. There is no arbitrary URL or arbitrary API request tool, which prevents SSRF through this connector. Public publishing/payment and refund operations are HIGH_RISK. Remote Stripe fields are untrusted data. Do not let customer metadata, descriptions, invoices, or event payloads alter system instructions, permissions, or approval state.

Webhook receipt is intentionally not implemented: this package is a stdio MCP server, and safely accepting webhooks requires a separately deployed HTTPS endpoint plus Stripe signature verification. Event inspection is available through `stripe.event.list`.

## Error handling
Stripe HTTP errors become `StripeError` with status, provider code/type, request ID, and `retryAfter` where present. Authentication/permission errors surface without retry. Timeout/network failures use the bounded retry policy and ultimately fail the tool call.

## Tests
```bash
npm test
```
Unit tests require no live Stripe credentials. They cover configuration, credential isolation, approval denial/allowance, error mapping, idempotency headers, pagination encoding, and rate-limit metadata. The implementation is structured so fetch can be mocked for additional transport tests.

## Limitations
This connector intentionally implements 14 high-value capabilities rather than Stripe's full API. OAuth/Stripe Connect installation flows are not implemented; this connector targets server-side use with an account-scoped secret/restricted key. It does not collect card data, confirm PaymentIntents, create payouts, modify disputes, change account permissions, or process webhooks. Refund and Payment Link creation require explicit out-of-band approval.
