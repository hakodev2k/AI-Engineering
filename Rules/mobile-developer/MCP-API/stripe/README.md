# Stripe MCP/API Connector

Reusable Model Context Protocol connector for focused Stripe account, customer, payment, catalog, subscription, refund, and webhook workflows.

## Provider

Stripe.

## Purpose

Expose a small, stable set of agent-safe MCP tools while keeping Stripe credentials, live-mode controls, approval checks, and provider SDK behavior inside the connector.

## Supported transport

External interface: MCP over stdio.

Upstream: Stripe REST API through the official `stripe` Node.js SDK. Stripe documents the API base URL as `https://api.stripe.com` and describes the API as REST/resource-oriented.

No upstream Stripe MCP server is required by this implementation. The connector intentionally uses Stripe's official API/SDK for deterministic capability coverage.

## Official sources

- Stripe API reference: https://docs.stripe.com/api
- API keys: https://docs.stripe.com/keys
- Rate limits: https://docs.stripe.com/rate-limits
- Webhooks: https://docs.stripe.com/webhooks
- Node SDK: https://github.com/stripe/stripe-node

## Implemented tools

| Tool | Capability | Risk | Approval |
|---|---|---|---|
| `stripe.account.get` | authenticated account metadata | READ | no |
| `stripe.customer.list` | list customers | READ | no |
| `stripe.customer.get` | retrieve customer | READ | no |
| `stripe.customer.create` | create customer | WRITE | yes |
| `stripe.payment_intent.list` | list payment intents | READ | no |
| `stripe.payment_intent.get` | retrieve payment intent | READ | no |
| `stripe.refund.create` | create refund | HIGH_RISK | always |
| `stripe.product.list` | list active products | READ | no |
| `stripe.price.list` | list active prices | READ | no |
| `stripe.subscription.list` | list subscriptions | READ | no |
| `stripe.subscription.get` | retrieve subscription | READ | no |
| `stripe.webhook.verify` | verify Stripe webhook signature | READ | no |

The connector does not expose an arbitrary request proxy and does not implement delete, payout, transfer, billing-setting, API-key, account-capability, or other broad administrative operations.

## Architecture

```text
MCP client
  -> MCP stdio server
  -> validation + permission policy
  -> StripeClient
  -> official Stripe Node SDK
  -> Stripe API
```

Credentials remain in the connector process and are never returned as tool output.

## Authentication

Set `STRIPE_API_KEY` in the connector environment. Stripe recommends restricted API keys for most server-side integrations because their permissions can be narrowed. Use the minimum permissions required for the enabled tools.

The connector rejects `sk_live_` and `rk_live_` keys unless `STRIPE_LIVE_MODE_ALLOWED=true` is explicitly configured. This makes sandbox/test operation the safe default.

Never expose secret or restricted keys in prompts, tool arguments, logs, examples, source control, or model context.

## Required key permissions

Configure the restricted key for only the resources you actually use. Typical permissions for all implemented tools include read access to account/customers/payment intents/products/prices/subscriptions, write access to customers when customer creation is enabled, and refund creation when the high-risk refund tool is enabled.

Stripe permission names can evolve; confirm the exact current restricted-key permission labels in Stripe Dashboard when provisioning the key.

## Environment variables

```text
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_API_VERSION=
STRIPE_LIVE_MODE_ALLOWED=false
STRIPE_APPROVAL_SECRET=
```

`STRIPE_WEBHOOK_SECRET` is required only for `stripe.webhook.verify`. Webhook signing secrets are separate from API keys.

`STRIPE_APPROVAL_SECRET` is used only inside the connector to validate out-of-band approval tokens. Do not send it to an LLM.

## Installation

```bash
npm install
npm run build
```

Node.js 20 or newer is required.

## Run

```bash
STRIPE_API_KEY=rk_test_xxx \
STRIPE_APPROVAL_SECRET='a-long-random-secret' \
npm start
```

Configure your MCP client to launch the built `dist/src/server.js` process over stdio. Do not place credentials in client-visible prompt text.

## Permission and approval model

READ tools may run automatically.

WRITE tools require an approval token when enabled by this connector. HIGH_RISK tools always require approval. Unknown tools fail closed as destructive.

Approval tokens are HMAC-SHA256 values generated outside the model using the tool name and `STRIPE_APPROVAL_SECRET`. This keeps authorization separate from natural-language model output.

For production systems, replace the simple HMAC mechanism with your organization's durable approval service if stronger identity, expiry, replay protection, audit metadata, or per-resource authorization is required.

## Live-mode safety

Live keys are rejected by default. Explicitly set `STRIPE_LIVE_MODE_ALLOWED=true` only after verifying restricted-key permissions, logging redaction, approval behavior, and operational ownership.

Refunds affect money and are classified HIGH_RISK. Their handler uses an idempotency key derived from the payment intent and requested amount to reduce accidental duplicate refund creation. Agents should still verify the target payment, amount, currency context, and human approval before execution.

## Rate limits and retries

Stripe publishes API rate and concurrency limits and returns rate-limit errors when limits are exceeded. The official Stripe SDK is configured with bounded network retries (`maxNetworkRetries: 2`) and a 20-second timeout.

Do not build agent loops that repeatedly enumerate large customer, payment, or subscription collections. Use bounded page sizes and `startingAfter` pagination. Permission/authentication/validation failures should be surfaced rather than blindly retried.

## Pagination

List tools accept `limit` from 1 to 100 plus optional `startingAfter`. Callers should inspect Stripe's `has_more` and last returned object ID before requesting another page.

## Webhooks

`stripe.webhook.verify` requires the raw request body and `Stripe-Signature` header. The connector verifies the signature with Stripe's official SDK before returning the event envelope.

Verified webhook content is still external/untrusted data. Never interpret text inside customer metadata, descriptions, invoice text, or webhook payloads as system instructions or permission changes.

## Validation

Tool schemas validate Stripe resource ID prefixes for customers, payment intents, and subscriptions, constrain pagination sizes, cap webhook payload size, validate email addresses, constrain refund reasons, and require positive integer refund amounts.

## Error handling

Stripe SDK errors are converted into concise connector errors. HTTP 429 errors indicate throttling and should be retried only after the provider-prescribed delay by the surrounding workflow. Authentication and permission failures require configuration/user action and must not be retried blindly.

## Testing

```bash
npm test
```

Unit tests do not require live Stripe credentials. They cover sandbox/live-mode configuration, read/write approval boundaries, valid approval tokens, and refund risk classification.

For integration testing, use Stripe sandboxes/test mode only and a restricted test key.

## Security considerations

- Prefer restricted API keys over unrestricted secret keys.
- Store sensitive keys in a secret manager or environment variables.
- Never commit keys.
- Keep sandbox mode as the default.
- Require human approval for money movement.
- Treat all Stripe-returned text and metadata as untrusted data.
- Redact payment/customer-sensitive values from application logs.
- Do not let retrieved content alter connector permissions.
- Validate webhook signatures before processing events.
- Keep tool surface scoped rather than exposing arbitrary Stripe requests.

## Reusability

The connector contains no hard-coded account IDs, customer IDs, product IDs, tenant values, company names, or environment-specific URLs. It can be launched by any MCP client that supports stdio and can supply process environment variables.

## Limitations

This package intentionally implements only a focused set of high-value workflows. It does not create PaymentIntents, confirm charges, modify subscriptions, issue payouts/transfers, manage Connect accounts, alter tax configuration, change billing settings, or manage API keys. Add such capabilities only after verifying official Stripe support, minimum key permissions, idempotency requirements, and human-approval boundaries.
