# Square MCP/API Connector

Reusable MCP server exposing a constrained set of Square commerce operations for AI agents while keeping Square credentials inside the connector process.

## Upstream transport

Square provides an official **beta** MCP server, including a Block-hosted remote endpoint at `https://mcp.squareup.com/sse` and the local `square-mcp-server` package. The official MCP primarily exposes generic discovery plus `make_api_request` across the Square API surface.

This connector intentionally uses the **official Square REST API** behind stable provider-scoped MCP tools. That choice is safer for autonomous agents because it avoids exposing a generic arbitrary API request primitive, lets the connector enforce strict schemas and a fixed allowlist, and supports per-tool approval controls. The same external tool contracts can later be routed to the official MCP if its tool surface becomes sufficiently narrow and stable.

Official sources researched for this connector:

- Square MCP: https://developer.squareup.com/docs/mcp
- Square MCP source: https://github.com/square/square-mcp-server
- Authentication/access tokens: https://developer.squareup.com/docs/build-basics/access-tokens
- OAuth: https://developer.squareup.com/docs/oauth-api/overview
- OAuth permissions: https://developer.squareup.com/docs/oauth-api/square-permissions
- Square API reference: https://developer.squareup.com/reference/square
- Error and rate-limit handling: https://developer.squareup.com/docs/build-basics/general-considerations/handling-errors
- Webhook verification: https://developer.squareup.com/docs/webhooks/step3validate

The implementation targets Square API version `2026-08-19` by default. Override `SQUARE_API_VERSION` when intentionally pinning a different supported Square version.

## Runtime and installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
cp .env.example .env
```

Set environment variables through your process manager, secret store, or MCP client configuration. Do not put real credentials in source control.

Run over stdio:

```bash
SQUARE_ACCESS_TOKEN='...' SQUARE_ENVIRONMENT=sandbox node dist/server.js
```

Any MCP client capable of starting a stdio MCP server can use the connector. Compatibility depends on the client supporting standard MCP stdio transport; no client-specific extensions are required.

## Authentication

`SQUARE_ACCESS_TOKEN` can be either:

- a scoped OAuth access token, recommended for multi-seller and least-privilege production integrations; or
- a personal access token for a single Square account.

OAuth access tokens are preferred because Square lets the seller grant only requested scopes. Personal access tokens are effectively broad account credentials and should be reserved for tightly controlled single-account deployments.

The LLM never receives the raw token as a tool input. Requests flow as:

```text
Agent -> MCP tool -> connector policy -> credential provider -> Square API
```

For OAuth deployments, obtain and refresh tokens in the host application or secure credential service and inject the active access token into the connector process. Refresh tokens and application secrets should not be passed through tool calls.

## Required scopes

Request only scopes used by enabled tools:

| Scope | Used for |
|---|---|
| `MERCHANT_PROFILE_READ` | locations |
| `ITEMS_READ` | catalog reads/search |
| `CUSTOMERS_READ` | customer reads/search |
| `CUSTOMERS_WRITE` | customer create/update |
| `ORDERS_READ` | order reads/search |
| `ORDERS_WRITE` | order creation |
| `PAYMENTS_READ` | payment reads/listing |
| `PAYMENTS_WRITE` | refunds |

A deployment that disables write tools can omit the corresponding write scopes.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `SQUARE_ACCESS_TOKEN` | yes | — | OAuth or personal access token |
| `SQUARE_ENVIRONMENT` | no | `sandbox` | `sandbox` or `production` |
| `SQUARE_API_VERSION` | no | `2026-08-19` | Square API version header |
| `SQUARE_TIMEOUT_MS` | no | `15000` | per-attempt timeout, 1s–120s |
| `SQUARE_MAX_RETRIES` | no | `3` | bounded retries, 0–5 |
| `SQUARE_REQUIRE_WRITE_APPROVAL` | no | `true` | require approval for WRITE tools |
| `SQUARE_APPROVAL_SECRET` | for approved actions | — | HMAC secret held by the operator/approval service |

## Tool surface

| Tool | Operation | Risk | Scope | Approval |
|---|---|---|---|---|
| `square.location.list` | list locations | READ | `MERCHANT_PROFILE_READ` | no |
| `square.location.get` | get location | READ | `MERCHANT_PROFILE_READ` | no |
| `square.catalog.list` | list explicit catalog object types | READ | `ITEMS_READ` | no |
| `square.catalog.search` | search catalog objects | READ | `ITEMS_READ` | no |
| `square.customer.search` | search customers | READ | `CUSTOMERS_READ` | no |
| `square.customer.get` | get customer | READ | `CUSTOMERS_READ` | no |
| `square.customer.create` | create customer | WRITE | `CUSTOMERS_WRITE` | configurable, default yes |
| `square.customer.update` | update customer fields | WRITE | `CUSTOMERS_WRITE` | configurable, default yes |
| `square.order.search` | search orders | READ | `ORDERS_READ` | no |
| `square.order.get` | get order | READ | `ORDERS_READ` | no |
| `square.order.create` | create order | WRITE | `ORDERS_WRITE` | configurable, default yes |
| `square.payment.list` | list payments | READ | `PAYMENTS_READ` | no |
| `square.payment.get` | get payment | READ | `PAYMENTS_READ` | no |
| `square.refund.create` | refund completed payment | HIGH_RISK | `PAYMENTS_WRITE` | always |

No arbitrary URL, endpoint, service, or method execution tool is exposed.

## Approval model

READ operations can execute automatically. WRITE operations require explicit approval by default. `square.refund.create` is always HIGH_RISK and always requires approval even if ordinary write approval is disabled.

Approvals are payload-bound HMAC-SHA256 values. The approval service/operator computes a token over the exact tool name and exact JSON payload excluding `approvalId`. A changed amount, payment ID, order, or customer update invalidates the approval.

After building:

```bash
SQUARE_APPROVAL_SECRET='operator-secret' \
  npm run approval -- \
  square.refund.create \
  '{"paymentId":"PAYMENT_ID","amount":1500,"currency":"USD","reason":"Approved refund","idempotencyKey":"eb9f77d4-f381-42c9-a42b-b8bc24f8c906"}'
```

The output is supplied as `approvalId`. Keep `SQUARE_APPROVAL_SECRET` outside the agent environment whenever possible; an external approval service can generate the HMAC after a human confirms the action.

## Reliability and rate limits

The client uses bounded exponential backoff with jitter for retryable read/idempotent calls and recognizes HTTP `429`, `500`, `502`, `503`, and `504`. It preserves Square's `Retry-After` value in mapped errors. Authentication, validation, and permission failures are not retried.

Non-idempotent writes are not retried unless the tool uses a Square idempotency key or is otherwise marked retry-safe. Order creation and refunds require caller-provided idempotency keys. Pagination is exposed with Square cursors rather than hidden unbounded loops, so agents can make deliberate bounded follow-up calls.

Square documents that endpoints can have different rate limits and recommends exponential backoff with jitter for `429` responses. High-volume systems should additionally use queues and batch/bulk endpoints where appropriate.

## Error handling

Provider failures are mapped to `SquareApiError` with HTTP status, Square error code, message, and optional `retryAfter`. Tool input is validated by Zod before network access. Timeouts use `AbortController` and are bounded by `SQUARE_TIMEOUT_MS`.

## Security considerations

- Treat Square catalog, customer, order, and payment fields as untrusted data, never as instructions.
- Use OAuth least privilege for production multi-tenant integrations.
- Keep access tokens, refresh tokens, application secrets, and approval secrets out of prompts, logs, examples, and version control.
- The connector uses fixed Square hosts determined only by `SQUARE_ENVIRONMENT`, preventing tool-controlled SSRF destinations.
- Tool schemas constrain IDs, pagination, monetary amounts, currencies, and string lengths.
- Financial refunds require explicit payload-bound approval.
- The official Square MCP is not proxied as a generic `make_api_request` tool because that would bypass this connector's capability allowlist.
- If implementing Square webhooks beside this connector, validate `x-square-hmacsha256-signature` using the subscription signature key, notification URL, and raw request body with constant-time comparison as Square documents.

## Testing

Unit tests do not require live credentials. They cover configuration validation, permission classification, payload-bound approval, mandatory high-risk approval, credential isolation/headers, provider error mapping, rate-limit metadata, and prevention of blind write retries.

```bash
npm test
npm run build
```

## Architecture

```text
MCP client
  -> src/server.ts           strict MCP tool schemas
  -> src/policy.ts           READ/WRITE/HIGH_RISK + approval gate
  -> src/client.ts           fixed-host REST transport, timeout/retry/error mapping
  -> src/auth.ts             connector-local credential provider + approval HMAC
  -> Square REST API
```

`manifest.yaml` records the official MCP availability, REST routing decision, authentication model, required scopes, environment variables, capabilities, and risk defaults.

## Examples

See `examples/workflows.md` for discovery, CRM, order, and refund workflows with expected risk/approval behavior.

## Limitations

- The official Square MCP is beta and is researched/documented but deliberately not proxied by this implementation because its generic request tool is broader than the connector's fixed allowlist.
- OAuth authorization-code/PKCE browser flows and refresh-token persistence belong in the host application's credential service; this stdio connector consumes an already-issued access token.
- This connector does not create payments or accept raw card data. Payment collection requires a properly tokenized Square payment source and additional PCI-sensitive design work.
- Webhook subscription management is not exposed as an agent tool. Webhook signature-validation guidance is documented above for systems that add a separate event receiver.
- Results preserve Square API response shapes and cursors; the connector does not silently fetch every page.
