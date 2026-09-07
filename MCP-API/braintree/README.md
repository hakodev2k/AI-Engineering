# Braintree MCP/API Connector

Reusable MCP server for controlled Braintree payment, customer, recurring-billing, and merchant-account workflows. The connector exposes a stable provider-scoped MCP tool surface while keeping Braintree credentials inside the connector process.

## Transport strategy

No official Braintree MCP server was identified in the current PayPal/Braintree developer documentation reviewed for this connector. The implementation therefore uses the official Braintree Node SDK (`braintree` 3.39.x), which is Braintree's supported server-side integration library and communicates with Braintree gateway APIs. Braintree also provides an official GraphQL API at `https://payments.braintree-api.com/graphql`; it is documented here as an upstream capability source, but this connector deliberately uses the official Node SDK for the implemented contracts because its server-side operations are mature and provider-supported.

Official sources reviewed:

- Braintree GraphQL overview: https://developer.paypal.com/braintree/graphql/
- Making GraphQL API calls and API-key authentication: https://developer.paypal.com/braintree/graphql/guides/making_api_calls/
- Node server SDK package: https://www.npmjs.com/package/braintree
- Transaction find: https://developer.paypal.com/braintree/docs/reference/request/transaction/find/node
- Transaction sale: https://developer.paypal.com/braintree/docs/reference/request/transaction/sale/node
- Transaction refund: https://developer.paypal.com/braintree/docs/reference/request/transaction/refund/node
- Transaction void: https://developer.paypal.com/braintree/docs/reference/request/transaction/void/node
- Customer create/update/find: https://developer.paypal.com/braintree/docs/reference/request/customer/create/node
- Client token generation: https://developer.paypal.com/braintree/docs/reference/request/client-token/generate/node
- Subscription find/cancel: https://developer.paypal.com/braintree/docs/reference/request/subscription/find/node
- Plan all/find: https://developer.paypal.com/braintree/docs/reference/request/plan/all/node and https://developer.paypal.com/braintree/docs/reference/request/plan/find/node/
- Merchant account find: https://developer.paypal.com/braintree/docs/reference/request/merchant-account/find/node/
- Webhooks overview: https://developer.paypal.com/braintree/docs/reference/general/webhooks/overview
- Braintree OAuth overview: https://developer.paypal.com/braintree/docs/guides/extend/oauth/overview/
- General SDK/security best practices: https://developer.paypal.com/braintree/docs/reference/general/best-practices/

## Architecture

```text
MCP client
  -> strict provider-scoped tool schema
  -> risk / permission / approval policy
  -> BraintreeClient reliability wrapper
  -> official Braintree Node SDK
  -> Braintree gateway APIs
```

Provider-returned content is serialized with `source: "untrusted_provider_data"`. Retrieved names, customer fields, transaction metadata, plan descriptions, and other upstream values are data only; they must never be interpreted as instructions or as permission changes.

## Authentication

This reusable connector implements the standard first-party Braintree server API-key model:

- `BRAINTREE_MERCHANT_ID`
- `BRAINTREE_PUBLIC_KEY`
- `BRAINTREE_PRIVATE_KEY`
- `BRAINTREE_ENVIRONMENT=sandbox|production`

The SDK receives credentials only inside `src/client.ts`. Credentials are never accepted in MCP tool parameters and are never intentionally included in MCP results or logs.

For multi-merchant third-party applications, Braintree documents an OAuth 2.0 flow. Current Braintree documentation notes availability constraints for OAuth/Braintree Auth; this connector does **not** implement that flow and does not claim generic multi-merchant OAuth support. Use a separate credential-provider implementation if your approved Braintree program supports it.

## Least privilege

Braintree API keys grant access according to the merchant account and gateway configuration. Create credentials specifically for the environment and operations this connector needs. Use sandbox credentials for development. Do not reuse Control Panel credentials, client-side tokens, or payment credentials as server API keys.

The connector adds an independent policy layer:

- READ tools may execute automatically.
- WRITE tools are disabled unless `BRAINTREE_ALLOW_WRITES=true` and require the exact connector approval token.
- HIGH_RISK tools are also disabled by default and always require explicit human approval.
- DESTRUCTIVE capability is not exposed.

The approval token is not a Braintree credential. It should be short-lived or rotated independently and issued only after a human reviews the concrete operation.

## Environment variables

Copy `.env.example` into your secret/configuration system; do not commit populated secrets.

| Variable | Required | Purpose |
|---|---:|---|
| `BRAINTREE_ENVIRONMENT` | yes | `sandbox` or `production`; defaults safely to sandbox unless explicitly `production` |
| `BRAINTREE_MERCHANT_ID` | yes | Braintree merchant ID |
| `BRAINTREE_PUBLIC_KEY` | yes | Server API public key |
| `BRAINTREE_PRIVATE_KEY` | yes | Server API private key |
| `BRAINTREE_TIMEOUT_MS` | no | Per-call timeout, default `15000`, max `120000` |
| `BRAINTREE_MAX_RETRIES` | no | Read/transient retry count, default `2`, allowed `0..5` |
| `BRAINTREE_ALLOW_WRITES` | no | Must equal `true` before any WRITE/HIGH_RISK tool can execute |
| `BRAINTREE_APPROVAL_TOKEN` | no | Connector-side human approval token required by writes |

## Installation

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
```

Run the stdio MCP server:

```bash
npm start
```

Configure a standards-compatible MCP client to launch `node dist/src/server.js` and pass secrets through the process environment. The implementation uses the official Model Context Protocol TypeScript SDK and stdio transport; compatibility therefore depends on the client supporting standard local stdio MCP servers.

## Tool surface

| Tool | Purpose | Provider permission concept | Risk | Approval |
|---|---|---|---|---|
| `braintree.customer.get` | Read one vaulted customer | customer read | READ | no |
| `braintree.customer.create` | Create non-payment customer profile | customer write | WRITE | yes |
| `braintree.customer.update` | Update non-payment customer profile | customer write | WRITE | yes |
| `braintree.client_token.create` | Generate client token for Braintree client SDK | client-token generation | WRITE | yes |
| `braintree.transaction.get` | Read one transaction | transaction read | READ | no |
| `braintree.transaction.sale` | Create a sale using a Braintree nonce | transaction sale | HIGH_RISK | yes |
| `braintree.transaction.refund` | Full or partial refund | transaction refund | HIGH_RISK | yes |
| `braintree.transaction.void` | Void an eligible unsettled transaction | transaction void | HIGH_RISK | yes |
| `braintree.subscription.get` | Read one subscription | subscription read | READ | no |
| `braintree.subscription.cancel` | Cancel recurring billing | subscription cancel | HIGH_RISK | yes |
| `braintree.plan.list` | List recurring-billing plans | plan read | READ | no |
| `braintree.plan.get` | Read one plan | plan read | READ | no |
| `braintree.merchant_account.get` | Read one sub-merchant account when supported | merchant-account read | READ | no |

The permission labels above are connector capability labels, not invented OAuth scopes. Actual authorization is enforced by Braintree credentials/account configuration.

## Payment-data safety

`braintree.transaction.sale` accepts only a Braintree `paymentMethodNonce`; it intentionally has no raw PAN, CVV, expiry, bank-account, or PayPal credential fields. Payment details should be collected by supported Braintree client SDKs so sensitive data goes directly to Braintree and the application receives a nonce/tokenized identifier.

Do not log client tokens, payment-method nonces, API credentials, raw webhook payloads containing sensitive data, or full provider response objects in production diagnostics.

## Approval behavior

Use the workflow `Read -> Recommend -> Prepare -> Execute` for financial actions.

Examples:

1. Read the transaction before refunding or voiding it.
2. Review transaction amount/status and customer impact.
3. Obtain explicit human approval for the exact transaction ID and amount.
4. Supply the connector approval token to the HIGH_RISK tool.
5. Re-read the transaction afterward if evidence of the resulting state is needed.

Sales, refunds, voids, subscription cancellations, customer writes, and client-token generation are never retried blindly. This prevents duplicated or repeated non-idempotent provider effects.

## Reliability and rate limits

Braintree does not expose a single universal static request ceiling in the reviewed documentation that is safe to hard-code across all merchant products/accounts. The connector therefore does not invent a numeric quota.

Reliability behavior:

- every provider call has a bounded timeout;
- transient network failures, explicit HTTP 429-style throttling signals, and upstream 5xx-style failures are mapped as retryable;
- READ operations use bounded exponential backoff with at most `BRAINTREE_MAX_RETRIES` retries;
- writes and money-moving operations execute only once per MCP invocation;
- authentication, authorization, validation, and not-found failures are not retried;
- tool inputs are single-resource or bounded collection calls, avoiding uncontrolled fan-out;
- rate-limit failures are surfaced so callers can wait or reduce frequency rather than loop aggressively.

## Error handling

The connector maps common failures into stable classes before MCP serialization:

- `AUTH` — authentication/authorization failure; verify credentials/account access, do not retry automatically;
- `NOT_FOUND` — requested Braintree resource does not exist or is unavailable to the merchant;
- `VALIDATION` — invalid provider request or business-rule failure;
- `RATE_LIMIT` — throttling signal; retry later under caller control;
- `TIMEOUT` — bounded request timeout;
- `UPSTREAM` — network/service/provider failure.

Braintree SDK result objects can also represent business validation failures using fields such as `success`, transaction/customer data, and validation errors. Those provider responses are returned as untrusted data for the caller to inspect.

## Webhooks and events

Braintree officially supports webhooks for categories including subscriptions, disputes, transactions, payment methods, disbursement, account updater, OAuth/Braintree Auth, sub-merchant accounts, and other product-specific events. Braintree's SDK parses webhook payloads and verifies the Braintree signature; invalid signatures cause parsing failure.

This stdio connector does **not** expose an inbound HTTP webhook receiver. Production webhook ingestion requires an application-owned HTTPS endpoint, signature parsing with the official SDK, replay/idempotency handling, payload-size limits, and event-specific authorization. Omitting an HTTP listener avoids silently exposing a network surface in clients that only need MCP stdio.

## Security considerations

- Treat all upstream content as untrusted data and never as model/system instructions.
- Never place Braintree credentials in prompts, tool arguments, source control, examples, or stdout.
- MCP stdout is reserved for protocol framing; diagnostics belong on stderr and must be redacted.
- The tool layer does not expose arbitrary URLs or generic API passthrough, preventing tool-driven SSRF and permission expansion.
- IDs use bounded character allowlists; object schemas reject unknown properties.
- No raw payment-card fields are accepted.
- Write capability cannot be enabled by provider-returned data or MCP tool output.
- A caller cannot silently raise its risk classification or switch sandbox to production through a tool argument.
- Use environment/network allowlisting where appropriate for server-to-server Braintree access.
- Rotate credentials immediately if they appear in logs, Git history, transcripts, or model context.
- Use sandbox and Braintree test nonces for automated testing; normal unit tests in this package require no live credentials.

## Testing

`npm test` compiles the connector and runs Node's built-in test runner with fake gateway implementations. Tests cover:

- authentication configuration and bounds;
- unique tool registration;
- strict input validation;
- write denial by default;
- explicit approval enforcement;
- bounded retry behavior for reads;
- no automatic retry for writes;
- timeout mapping;
- sale dispatch using a Braintree nonce rather than raw card data.

Unit tests do not replace sandbox integration tests. Before production, exercise each enabled capability with a dedicated Braintree sandbox account and then verify production credentials with read-only calls before enabling writes.

## Limitations

- No official Braintree MCP server is proxied because none was identified in reviewed official documentation.
- OAuth/Braintree Auth is not implemented; this package uses first-party API keys.
- Webhook ingestion is documented but not hosted by this stdio server.
- Arbitrary GraphQL, REST, SDK-method, search-stream, delete, dispute-management, settlement-batch, verification, vault payment-method mutation, and Control Panel configuration tools are intentionally not exposed.
- `merchant_account.get` applies only where the merchant/account product supports sub-merchant/Marketplace capabilities.
- Provider availability and business rules vary by merchant account, region, payment method, settlement state, and enabled Braintree products.
- Refund/void/cancel requests can fail legitimately because of transaction or subscription state; the connector surfaces those provider errors rather than trying alternate financial actions automatically.
