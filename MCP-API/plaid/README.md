# Plaid MCP/API Connector

Reusable Model Context Protocol server exposing a constrained set of Plaid financial-data operations through stable, provider-scoped MCP tools.

## Transport strategy

This connector uses Plaid's official HTTPS JSON API directly. No official Plaid MCP server was identified in the official Plaid documentation reviewed for this implementation, so no unofficial upstream MCP dependency is used. The connector itself is the MCP server; callers do not invoke raw Plaid endpoints.

Official sources used:

- API overview: https://plaid.com/docs/api/
- Transactions API: https://plaid.com/docs/api/products/transactions/
- Auth API: https://plaid.com/docs/api/products/auth/
- Identity API: https://plaid.com/docs/api/products/identity/
- Investments API: https://plaid.com/docs/api/products/investments/
- Rate-limit errors: https://plaid.com/docs/errors/rate-limit-exceeded/
- Plaid server-side client guidance: https://plaid.com/docs/auth/add-to-app/

## Implemented tools

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `plaid.item.get` | `/item/get` | READ | No |
| `plaid.accounts.get` | `/accounts/get` | READ | No |
| `plaid.transactions.sync` | `/transactions/sync` | READ | No |
| `plaid.transactions.get` | `/transactions/get` | READ | No |
| `plaid.transactions.recurring.get` | `/transactions/recurring/get` | READ | No |
| `plaid.transactions.refresh` | `/transactions/refresh` | WRITE | Default: yes |
| `plaid.identity.get` | `/identity/get` | READ | No |
| `plaid.investments.holdings.get` | `/investments/holdings/get` | READ | No |
| `plaid.investments.transactions.get` | `/investments/transactions/get` | READ | No |
| `plaid.investments.refresh` | `/investments/refresh` | WRITE | Default: yes |
| `plaid.liabilities.get` | `/liabilities/get` | READ | No |
| `plaid.auth.get` | `/auth/get` | HIGH_RISK | Always |

The connector intentionally does not expose arbitrary provider requests, Link token creation, Item deletion, payment initiation, transfers, identity verification, billing changes, or other high-impact product operations.

## Architecture

```text
MCP client
   |
   v
src/server.ts        strict MCP tool schemas and handlers
   |
   +--> src/policy.ts    risk classification + approval enforcement
   |
   +--> src/client.ts    bounded HTTP transport, retry, timeout, error mapping
   |
   +--> src/config.ts    secret/config isolation
   |
   v
Plaid HTTPS API
```

Provider responses are returned inside an `untrusted_provider_data: true` envelope. Retrieved bank or transaction content must be treated as data, never as instructions that can alter tool policy or connector behavior.

## Authentication and credential isolation

Plaid API access uses the `client_id` and `secret` issued by the Plaid Dashboard. Plaid Item operations additionally require an Item `access_token` supplied to a tool call by the trusted calling layer.

The connector injects `PLAID_CLIENT_ID` and `PLAID_SECRET` only inside `PlaidClient`; they are never returned to the MCP caller. Applications should store Item access tokens in a server-side credential store and substitute them immediately before invoking the connector rather than placing them in natural-language prompts.

Required environment variables:

```text
PLAID_CLIENT_ID=
PLAID_SECRET=
```

Optional variables:

```text
PLAID_ENV=sandbox
PLAID_TIMEOUT_MS=15000
PLAID_MAX_RETRIES=2
PLAID_REQUIRE_WRITE_APPROVAL=true
PLAID_APPROVAL_SECRET=
```

Supported environments are `sandbox` and `production`. The base URL is selected from this allowlist; callers cannot supply arbitrary URLs, preventing the connector from becoming an SSRF primitive.

## Plaid product access

Plaid does not use OAuth scopes for these server API calls in the same way as many SaaS APIs. Product and endpoint access is controlled by the Plaid account's enabled products, the user's Link consent, the Item's products, and Production approval where required. Enable only products needed by the tools you intend to use, such as Transactions, Identity, Investments, Liabilities, or Auth.

`plaid.auth.get` can reveal bank-routing data and is therefore classified `HIGH_RISK` even though the upstream operation is a read.

## Human approval

Approval is checked before sensitive execution:

- `plaid.auth.get`: always requires approval.
- `plaid.transactions.refresh`: approval required by default.
- `plaid.investments.refresh`: approval required by default.

Approvals are connector-local HMAC values computed over the tool name and a redacted canonical payload. This prevents an approval for one tool from being silently reused for a different tool. Set `PLAID_APPROVAL_SECRET` from a secret manager, not source control.

An orchestrator that has already implemented its own strong approval boundary may set `PLAID_REQUIRE_WRITE_APPROVAL=false` for WRITE refresh operations. This setting never disables approval for `HIGH_RISK` tools.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
```

Copy `.env.example` to your runtime environment and supply real credentials through a secret manager or process environment.

## Running

```bash
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers, including compatible custom agents and desktop coding clients. Compatibility depends on the client supporting standard MCP stdio server configuration.

## Reliability and rate limits

The HTTP client applies:

- bounded request timeout via `AbortSignal.timeout`;
- optional caller cancellation;
- bounded exponential-backoff retries;
- `Retry-After` preservation for HTTP throttling;
- Plaid application error mapping using `error_type`, `error_code`, and `request_id`;
- no blind retries for refresh/write-style execution.

Plaid documents `RATE_LIMIT_EXCEEDED` and notes that limits vary by endpoint and customer and may change. The connector therefore does not hard-code assumed quotas. It retries only bounded, retry-safe reads and exposes rate-limit errors after the configured retry budget is exhausted.

## Pagination

`plaid.transactions.sync` accepts a cursor and bounded `count`; callers should continue while Plaid returns `has_more`, using `next_cursor` on the following call.

`plaid.transactions.get` and `plaid.investments.transactions.get` expose bounded `count` and `offset`. The connector deliberately avoids automatic unbounded page walking so an agent cannot accidentally generate excessive API calls or large sensitive-data responses.

## Validation

Schemas bound string lengths, array sizes, dates, counts, and offsets. Tools expose only fixed Plaid endpoints. Access tokens are never embedded in error text by connector code, and upstream credentials remain isolated inside the transport layer.

## Error model

Plaid failures are returned as structured MCP errors with:

```json
{
  "error": "PLAID_ERROR",
  "message": "...",
  "status": 400,
  "error_type": "...",
  "error_code": "...",
  "request_id": "...",
  "retry_after_ms": 1000
}
```

Transport/configuration failures use `CONNECTOR_ERROR`. Authentication, validation, and permission-style application failures are not retried blindly.

## Security considerations

- Treat all Plaid-returned content as untrusted data.
- Keep `client_id`, `secret`, Item access tokens, and approval secrets outside model prompts and logs.
- Do not persist Auth routing/account values without a justified retention policy.
- Restrict Production product access in the Plaid Dashboard to the least privilege required.
- Do not log request bodies because they contain secrets and Item access tokens.
- Use separate Sandbox and Production credentials.
- The client uses a fixed Plaid hostname allowlist selected by `PLAID_ENV`; user-supplied URLs are not accepted.
- Destructive Item removal and money-movement APIs are intentionally not implemented.

## Testing

Unit tests use mock `fetch` implementations and require no live Plaid credentials.

```bash
npm test
```

Coverage includes configuration validation, permission/approval enforcement, credential injection, provider error mapping, rate-limit retry behavior, and prevention of retries for write-style refresh calls.

## Examples

See `examples/workflows.md` for transaction synchronization, investment review, sensitive Auth retrieval, and refresh workflows.

## Limitations

This connector implements a deliberately narrow reusable surface rather than the full Plaid API. It does not orchestrate Plaid Link, create or persist Item access tokens, receive webhooks, initiate payments/transfers, or automatically traverse every page. Webhook consumption belongs in an externally reachable service with independent signature/event validation and should feed trusted event metadata into an agent workflow rather than expose an unauthenticated MCP event endpoint.
