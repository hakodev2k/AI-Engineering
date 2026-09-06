# Recurly MCP Connector

Reusable MCP server for scoped Recurly subscription-billing operations. It exposes a narrow tool surface for account, subscription, invoice, plan, and transaction workflows while keeping the Recurly API key inside the connector process.

## Transport strategy

- **Billing data and actions:** official Recurly Subscriptions REST API at `https://{site}.recurly.com`.
- **Official Recurly Compass MCP:** `https://mcp.recurly.com/mcp` exists, but its currently documented public agents are Knowledge Agent and Coding Agent for documentation/API guidance. It is not used as the upstream transport for the billing-data operations exposed here.
- **SDK:** Recurly maintains official client libraries, including Node.js, but this connector uses the documented REST contract directly so its MCP boundary, retry rules, approval checks, and credential isolation remain explicit.

Official sources reviewed for this connector:

- Recurly API getting started/versioning/rate limits: https://docs.recurly.com/recurly-subscriptions/v2021-02-25/reference/getting-started-v2021-02-25
- Recurly Compass MCP: https://docs.recurly.com/recurly-subscriptions/docs/compass-public-mcp-server
- Official client libraries: https://docs.recurly.com/recurly-subscriptions/v2021-02-25/reference/client-libraries
- Account create/update reference: https://docs.recurly.com/recurly-subscriptions/v2021-02-25/reference/create_account and https://docs.recurly.com/recurly-subscriptions/v2021-02-25/reference/update_account
- Subscription management, pause, and cancellation: https://docs.recurly.com/recurly-subscriptions/docs/managing-subscription-methods-guides
- Webhook guidance: https://docs.recurly.com/recurly-subscriptions/v2.29/docs/webhooks and https://docs.recurly.com/recurly-subscriptions/v2.29/docs/best-practices

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict tool schema
  -> permission/approval policy
  -> Recurly REST client
  -> HTTP Basic auth using API key
  -> Recurly site
```

Provider content is treated as untrusted data. The connector does not interpret returned text as instructions and does not expose an unrestricted HTTP passthrough.

## Authentication

Recurly API v3 uses HTTP Basic authentication with the site API key as the username and an empty password. The credential never appears in an MCP tool schema or tool result.

Create a dedicated Recurly API key for this integration and prefer the least-privileged key type that supports the enabled operations. Test and production sites use different credentials.

Environment variables:

```text
RECURLY_API_KEY=
RECURLY_SITE_SUBDOMAIN=
RECURLY_API_VERSION=2021-02-25
RECURLY_PERMISSIONS=read
RECURLY_REQUIRE_WRITE_APPROVAL=true
RECURLY_REQUIRE_HIGH_RISK_APPROVAL=true
RECURLY_TIMEOUT_MS=15000
RECURLY_MAX_RETRIES=2
```

`RECURLY_SITE_SUBDOMAIN` accepts only a simple site subdomain. Arbitrary base URLs are intentionally unsupported to reduce SSRF risk.

## API version

Every request sends a date-pinned Recurly `Accept` header. The default is `2021-02-25`. Pinning is intentional: Recurly supports date-based API versions and warns that using `latest` can introduce breaking changes.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP over stdio. Configure an MCP client to launch `node dist/src/server.js` with the Recurly environment variables injected by the client or secret manager.

## Implemented tools

| Tool | Purpose | Risk | Approval |
| --- | --- | --- | --- |
| `recurly.account.list` | List accounts with bounded pagination | READ | No |
| `recurly.account.get` | Fetch one account | READ | No |
| `recurly.account.create` | Create an account without payment credentials | WRITE | Configurable; required by default |
| `recurly.account.update` | Update non-payment profile fields | WRITE | Configurable; required by default |
| `recurly.subscription.list` | List subscriptions | READ | No |
| `recurly.subscription.get` | Fetch one subscription | READ | No |
| `recurly.subscription.cancel` | Cancel at next bill date or term end | HIGH_RISK | Explicit |
| `recurly.subscription.pause` | Pause for 1-12 billing cycles | HIGH_RISK | Explicit |
| `recurly.invoice.list` | List invoices | READ | No |
| `recurly.invoice.get` | Fetch one invoice | READ | No |
| `recurly.plan.list` | List plans | READ | No |
| `recurly.transaction.list` | List transactions | READ | No |

No terminate-subscription, account deactivation, invoice refund, transaction void, payment-method mutation, or other destructive/financial execution tool is exposed.

## Permission model

`RECURLY_PERMISSIONS` is monotonic and must be configured outside the agent:

- `read`: READ tools only.
- `write`: READ + WRITE tools.
- `high-risk`: READ + WRITE + HIGH_RISK tools.

The model cannot increase this setting through a tool call.

WRITE operations require `approved: true` when `RECURLY_REQUIRE_WRITE_APPROVAL=true`. HIGH_RISK operations require both `RECURLY_PERMISSIONS=high-risk` and `approved: true` when `RECURLY_REQUIRE_HIGH_RISK_APPROVAL=true`.

`approved` is an assertion that the hosting application has already captured human approval. A production host should bind it to an auditable approval record rather than allowing a model to invent approval.

## Validation and safety

- All tool schemas reject unknown fields.
- Resource identifiers are length-bounded and restricted to Recurly-compatible identifier characters.
- Pagination limits are capped at 200 records per call.
- Account creation deliberately excludes billing/payment credentials.
- Subscription pause is capped at 12 billing cycles by connector policy even though provider capabilities can vary.
- Cancellation requires an explicit supported timeframe: `bill_date` or `term_end`.
- Destructive actions are not registered.
- Provider credentials are added only inside the HTTP client.
- Returned provider content is serialized as data and must not be treated as trusted instructions by the caller.

## Reliability and errors

The client applies a bounded timeout using `AbortController`. `RECURLY_TIMEOUT_MS` defaults to 15 seconds and is constrained to 1-120 seconds.

Retries are bounded by `RECURLY_MAX_RETRIES` (0-5, default 2) and are attempted only for idempotent GET requests on network failures, HTTP 429, and HTTP 5xx responses. Writes are never retried automatically.

Provider errors are mapped for common cases:

- 401: invalid API key.
- 403: insufficient key/site access.
- 404: missing resource.
- 406: unsupported API version.
- 422: provider-side validation/business rule failure.
- 429: rate limited; `Retry-After` is preserved when present.

## Rate limits

Recurly documents sandbox limits of 400 requests/minute and production GET limits of 1,000 requests/minute, calculated over a rolling five-minute window. Recurly exposes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers. The connector avoids fan-out and exposes bounded pagination so callers can pace reads. A 429 is retried only for GET requests and only within the configured retry budget.

## Pagination

List tools accept `limit` and `cursor`. Pass the provider cursor from a prior page into the next request. The connector intentionally retrieves one page per tool call instead of silently traversing an unbounded dataset.

## Webhooks and events

Recurly supports subscription/billing webhooks, but Recurly's documented subscription webhooks are configured through the Admin UI rather than through the API. Therefore this connector does **not** expose webhook create/update/delete tools.

Treat webhook deliveries as notifications, not commands. Recurly recommends re-reading current state through the API because webhook deliveries may be duplicated, retried, or arrive out of order.

## Examples

See `examples/workflows.json` for machine-readable examples including permission and approval requirements.

Typical support flow:

```text
recurly.account.get
 -> recurly.subscription.list
 -> recurly.invoice.list
 -> recurly.transaction.list
```

A retention action should follow a prepare/review/execute boundary:

```text
read subscription
 -> recommend pause/cancel
 -> human reviews customer and billing impact
 -> host records approval
 -> recurly.subscription.pause or recurly.subscription.cancel with approved=true
```

## Testing

Tests use fakes/mocks and do not require live Recurly credentials.

```bash
npm test
```

Coverage includes configuration validation, SSRF-resistant site validation, credential/header construction, read retry behavior, non-retry of writes, path validation, permission denial, high-risk approval enforcement, destructive-action denial, tool registration, and strict schemas.

Before production use, validate the connector against a Recurly sandbox with a dedicated API key and verify the exact account plan/features enabled on that site.

## Limitations

- Recurly Compass MCP is not used for billing operations because its currently documented public surface is documentation/API guidance rather than billing resource execution.
- OAuth is not implemented because the Recurly v3 site API contract used here authenticates with API keys.
- Webhook configuration is not exposed because Recurly documents it as Admin-UI configuration for subscription webhooks.
- Payment methods, refunds, voids, purchase creation, plan mutation, account deactivation, subscription termination, invoice collection, and other irreversible or directly financial operations are intentionally unsupported.
- The connector does not aggregate all pages automatically.
- Provider plan/feature availability can affect certain fields and states; provider 422 errors are surfaced rather than bypassed.

## Security operations

Store `RECURLY_API_KEY` in a secret manager or MCP client's protected environment configuration. Never place it in prompts, tool arguments, source control, logs, or examples. Rotate the key if it appears in an agent transcript or repository history. Keep production keys separate from sandbox keys and start with `RECURLY_PERMISSIONS=read` until write workflows and approval evidence have been tested.
