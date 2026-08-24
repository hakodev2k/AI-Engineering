# QuickBooks Online MCP/API Connector

Reusable MCP server for QuickBooks Online accounting workflows. It exposes a constrained, provider-scoped MCP interface while keeping Intuit OAuth credentials inside the connector process.

## Upstream transport

The implementation uses the official QuickBooks Online Accounting REST API. An official Intuit/QuickBooks MCP server was not identified in Intuit's official developer documentation during the 2026-08-25 implementation review, so no unofficial MCP dependency is used.

Official sources reviewed:

- QuickBooks Online developer documentation: https://developer.intuit.com/app/developer/qbo/docs/develop
- QuickBooks Online SDKs and samples: https://developer.intuit.com/app/developer/qbo/docs/develop/sdks-and-samples
- Intuit OAuth 2.0 token endpoint: https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer
- Intuit developer platform status: https://status.developer.intuit.com/
- QuickBooks Online API Explorer/reference is available from the Intuit Developer portal.

The connector intentionally does not expose a generic `request(url, body)` tool.

## Implemented MCP tools

| Tool | Purpose | Risk | Approval |
| --- | --- | --- | --- |
| `quickbooks.company.get` | Company information | READ | No |
| `quickbooks.customer.search` | Search/list customers | READ | No |
| `quickbooks.customer.get` | Get a customer | READ | No |
| `quickbooks.customer.create` | Create a customer | WRITE | Required |
| `quickbooks.invoice.list` | List invoices | READ | No |
| `quickbooks.invoice.get` | Get an invoice | READ | No |
| `quickbooks.invoice.create` | Create an invoice | WRITE | Required |
| `quickbooks.payment.list` | List received payments | READ | No |
| `quickbooks.payment.get` | Get a received payment | READ | No |
| `quickbooks.item.search` | Search/list products and services | READ | No |
| `quickbooks.report.run` | Run an allowlisted accounting report | READ | No |

`src/webhook.ts` also provides HMAC-SHA256 verification for QuickBooks webhook payloads. Webhook ingestion is deliberately not exposed as a callable MCP tool because it is an inbound event-validation concern.

## Architecture

```text
MCP client
  -> stdio MCP server
     -> strict Zod tool schemas
     -> approval policy for writes
     -> QuickBooks REST client
     -> OAuth token provider
     -> Intuit QuickBooks Online API
```

Provider data returned by QuickBooks is treated as untrusted data. It is serialized to MCP output and is never interpreted as connector policy or permission instructions.

## Authentication

QuickBooks Online uses OAuth 2.0. Request the QuickBooks Accounting scope:

```text
com.intuit.quickbooks.accounting
```

The connector supports two runtime credential modes:

1. A pre-obtained `QUICKBOOKS_ACCESS_TOKEN`.
2. A `QUICKBOOKS_REFRESH_TOKEN` plus `QUICKBOOKS_CLIENT_ID` and `QUICKBOOKS_CLIENT_SECRET`; the connector refreshes access tokens through Intuit's official token endpoint.

Refresh tokens may rotate. The in-process token provider adopts a returned replacement refresh token for the lifetime of the process. Production deployments should persist rotated refresh tokens in an external encrypted credential store; this package intentionally does not write secrets to disk.

The AI/LLM never receives raw OAuth credentials through tool parameters or tool results.

## Environment variables

Copy `.env.example` into your secret-management workflow. Do not commit populated credentials.

- `QUICKBOOKS_REALM_ID`: numeric QuickBooks company/realm ID; required.
- `QUICKBOOKS_ACCESS_TOKEN`: optional pre-obtained bearer token.
- `QUICKBOOKS_REFRESH_TOKEN`: optional refresh token.
- `QUICKBOOKS_CLIENT_ID`: required when refresh-token mode is used.
- `QUICKBOOKS_CLIENT_SECRET`: required when refresh-token mode is used.
- `QUICKBOOKS_ENVIRONMENT`: `production` or `sandbox`; default `production`.
- `QUICKBOOKS_MINOR_VERSION`: QuickBooks API minor version; default `75`, configurable because Intuit evolves minor versions over time.
- `QUICKBOOKS_APPROVAL_SECRET`: HMAC secret used to validate write approvals.
- `QUICKBOOKS_TIMEOUT_MS`: request timeout, 1,000-120,000 ms; default 15,000.
- `QUICKBOOKS_MAX_RETRIES`: bounded GET retry count, 0-5; default 3.
- `QUICKBOOKS_WEBHOOK_VERIFIER_TOKEN`: verifier token used by `verifyQuickBooksWebhook`.

## Installation and running

Requires Node.js 20 or later.

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

The server uses MCP stdio transport, so any MCP client capable of launching a local stdio server can configure the built `dist/src/server.js` entry point. Compatibility depends on the client's support for standard MCP stdio; no product-specific protocol extension is required.

## Permission and approval model

READ tools execute without approval after normal authentication.

WRITE tools require explicit human approval. Approval IDs are deterministic HMAC-SHA256 digests of the exact tool name using `QUICKBOOKS_APPROVAL_SECRET`. The secret remains inside the trusted connector/approval layer. Missing or invalid approval fails closed.

The implemented write tools are:

- `quickbooks.customer.create`
- `quickbooks.invoice.create`

No delete, void, refund, bill-payment, payroll, tax-filing, bank-transfer, permission-changing, or billing-changing tool is implemented. These operations are intentionally outside this connector's current risk envelope.

## Reliability and rate limiting

The REST client has configurable timeouts and bounded exponential backoff. It honors `Retry-After` when returned by Intuit.

Only GET requests are retried automatically for HTTP 429 and 5xx responses or transient network failures. POST operations are never blindly retried because an ambiguous network failure after a successful server-side create could otherwise duplicate financial records.

Intuit applies API throttling and operational limits that can change by service and app context. This connector does not hard-code a possibly stale quota number; deployments should consult the current Intuit rate-limit documentation and monitor HTTP 429 responses.

Pagination is bounded by the tool schemas. List/search tools use QuickBooks query `startposition` and `maxresults`; callers cannot request more than 1,000 records per call.

## Error handling

- 401 invalid/expired bearer responses invalidate the in-memory access-token state.
- OAuth refresh failures are surfaced without exposing client secrets or refresh tokens.
- 429 responses preserve parsed `Retry-After` metadata through `QuickBooksApiError`.
- 4xx validation/permission failures are not retried.
- POST failures are not retried automatically.
- Response error text is capped before being included in exceptions.
- Network calls are cancelled on timeout with `AbortController`.

## Query safety

There is no arbitrary QuickBooks query MCP tool. Customer and item search statements are constructed by the connector from fixed entity names and escaped user search strings. Invoice and payment listing use fixed query templates. Report names are allowlisted by schema.

This prevents an agent from escalating from a scoped tool into arbitrary QuickBooks API/query execution.

## Reports

`quickbooks.report.run` allowlists:

- `ProfitAndLoss`
- `BalanceSheet`
- `CashFlow`
- `AgedReceivables`
- `AgedPayables`
- `GeneralLedger`

Optional start/end dates must use `YYYY-MM-DD`, and accounting method is restricted to `Cash` or `Accrual`.

## Webhooks

QuickBooks Online supports webhooks. `verifyQuickBooksWebhook(rawBody, signature, verifierToken)` computes an HMAC-SHA256 digest over the exact raw payload and compares the Base64 signature using a timing-safe comparison.

Always verify the signature before parsing or acting on a webhook. Do not treat event payload fields as trusted instructions. Event processing should additionally enforce realm/company allowlists and idempotency in the hosting application.

## Example workflow

See `examples/workflows.json` for machine-readable examples covering customer discovery, financial reporting, and approved invoice creation.

A typical safe agent workflow is:

```text
customer.search (READ)
  -> item.search (READ)
  -> invoice.list / invoice.get (READ)
  -> prepare proposed invoice outside QuickBooks
  -> human approval
  -> invoice.create (WRITE)
```

## Tests

Unit tests do not require live QuickBooks credentials. They use mocked `fetch` implementations and cover:

- configuration validation
- invalid/missing credentials
- write approval denial and success
- bearer authentication and realm routing
- no retry for POST failures
- rate-limit `Retry-After` propagation
- webhook HMAC verification

Run:

```bash
npm test
npm run typecheck
```

## Security considerations

- Store OAuth secrets in a dedicated secret manager; never in prompts, source control, logs, or MCP arguments.
- Use the minimum Intuit scope required: `com.intuit.quickbooks.accounting` for the implemented accounting operations.
- Use a separate sandbox company for development.
- Rotate `QUICKBOOKS_APPROVAL_SECRET` according to your organization's secret-management policy.
- Treat customer names, invoice descriptions, item names, notes, and all other QuickBooks content as untrusted data that may contain prompt-injection text.
- Do not automatically translate retrieved content into new permissions or write actions.
- Keep webhook verification on the exact raw request body.
- Do not log Authorization headers, access tokens, refresh tokens, client secrets, or approval secrets.

## Limitations

- No official Intuit MCP upstream was identified, so all implemented business capabilities use the official REST API.
- OAuth browser authorization/consent UI is not hosted by this package; obtain the initial authorization code/tokens through your application's OAuth flow.
- Rotated refresh-token persistence must be supplied by the hosting secret-management layer if long-lived unattended execution is required.
- Payments are read-only in this connector. It does not charge cards or move money.
- It does not implement payroll, tax filing, bank feeds, refunds, destructive operations, or QuickBooks Desktop.
- Report availability and fields depend on the connected QuickBooks company and Intuit's current API behavior.
