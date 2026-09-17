# Mercury MCP/API Connector

Reusable MCP server for Mercury financial operations. It exposes eight narrow tools backed by Mercury's official REST API. Mercury also operates an official hosted MCP server at `https://mcp.mercury.com/mcp`; that service is OAuth-protected and intentionally read-only. For clients that only need native Mercury read access, prefer the official hosted MCP. This package is useful when a project needs a stable local MCP contract, sandbox switching, explicit approval controls, or the REST-only guarded invoice write.

## Official sources
- Mercury API: https://mercury.com/api
- API docs: https://docs.mercury.com/docs/welcome
- Authentication/tokens: https://docs.mercury.com/docs/getting-started
- Sandbox: https://docs.mercury.com/docs/using-mercury-sandbox
- Mercury MCP: https://docs.mercury.com/docs/what-is-mercury-mcp
- MCP security: https://docs.mercury.com/docs/security-best-practices
- Invoicing: https://docs.mercury.com/docs/invoicing

## Transport strategy
Mercury's hosted MCP is the preferred upstream for direct, read-only AI access. It provides OAuth-secured access to financial context and cannot move money. This connector uses Mercury REST for its external MCP tools so tool contracts remain deterministic and so a tightly guarded invoice-create operation can be supported. It does not proxy arbitrary REST calls.

Production REST base URL is `https://api.mercury.com/api/v1`; sandbox is `https://api-sandbox.mercury.com/api/v1`. Sandbox tokens are separate from production tokens.

## Authentication
REST calls use a Mercury API token as a Bearer token. Mercury also supports Basic auth with the token as username, but this connector intentionally uses Bearer auth. Create the least-privileged token possible. Read-only tokens are sufficient for all read tools. A create-invoice operation requires appropriate write capability; Mercury documents IP allow-list requirements for read-write tokens. Never commit tokens or pass them through LLM prompts.

Mercury's official MCP uses OAuth 2.0. Its access is read-only. Mercury OAuth access tokens are time-limited; integrations requiring unattended renewal should follow Mercury's documented `offline_access`/refresh-token flow.

## Environment
Copy `.env.example` and set `MERCURY_API_TOKEN`. Set `MERCURY_BASE_URL` to sandbox while testing. `MERCURY_ALLOW_WRITE` defaults to false. `MERCURY_APPROVAL_TOKEN` is an out-of-band human approval secret consumed only inside the connector.

## Tools and risk
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| mercury.account.list | REST | READ | no |
| mercury.transaction.list | REST | READ | no |
| mercury.transaction.get | REST | READ | no |
| mercury.customer.list | REST AR API | READ | no |
| mercury.customer.get | REST AR API | READ | no |
| mercury.invoice.list | REST AR API | READ | no |
| mercury.invoice.get | REST AR API | READ | no |
| mercury.invoice.create | REST AR API | HIGH_RISK WRITE | explicit |

`invoice.create` is high risk because creating an invoice can create an external financial request and, depending on `sendEmailOption`, communicate with a customer. It is disabled unless `MERCURY_ALLOW_WRITE=true` and requires an approval token matching `MERCURY_APPROVAL_TOKEN`. The approval token is stripped before the provider request. This connector deliberately does not implement ACH transfers, recipient mutation, invoice cancellation, customer deletion, or arbitrary API execution.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
npm test
MERCURY_API_TOKEN=... npm start
```

The server uses MCP stdio transport and therefore works with MCP clients that can launch local stdio servers. Configure the client to execute `node /absolute/path/dist/server.js`. Do not claim remote HTTP compatibility for this package; Mercury's own hosted MCP is the appropriate remote option.

## Reliability
Requests have a configurable timeout. HTTP 401 and 403 are surfaced without retries. GET requests receiving HTTP 429 honor `Retry-After` with one bounded retry capped at five seconds. Writes are never automatically retried, preventing duplicate financial actions. Pagination inputs are bounded to 100 records per call. Provider errors are mapped to explicit connector errors.

Mercury rate limits vary by API/product and should be treated as provider-controlled. The connector avoids fan-out and bulk invoice creation. For batch invoicing, Mercury recommends sequential requests and unique `invoiceNumber` values to make retries duplicate-safe.

## Security
Credentials stay in environment configuration and the connector layer. Base URLs must use HTTPS and all API paths are fixed/relative, reducing SSRF exposure. Tool schemas reject empty identifiers and bound pagination. Returned Mercury data is explicitly wrapped with `untrusted_provider_data: true`; callers must treat transaction memos, invoice text, customer names, and other retrieved content as data rather than instructions.

The official Mercury MCP exposes sensitive read data including balances, transactions, recipients, statements, and card information. Only authorize trusted MCP clients. Verify the official endpoint is exactly `https://mcp.mercury.com/mcp`. Revoke compromised tokens immediately.

## Accounts Receivable limitations
Mercury's AR API supports creating, updating and cancelling invoices, but cancellation is irreversible and is intentionally omitted here. Invoice attachment upload is not available through the AR API. Recurring invoice series are not an API feature; scheduling is client-side. Invoice updates overwrite the full invoice object rather than patching fields, so they are intentionally omitted from this first connector to avoid accidental field loss. ACH debit is USD-only when enabled. Card payment requires the account's supported Mercury/Stripe setup.

## Testing
`npm test` runs credential validation, HTTPS enforcement, bearer-auth behavior, authentication error mapping, and write-throttle no-retry tests using mocked fetch; no live Mercury credentials are required. Use Mercury sandbox for integration tests before enabling any production write capability.

## Architecture
`src/client.ts` owns credentials, HTTPS requests, timeout, rate-limit handling and error mapping. `src/server.ts` owns MCP schemas, scoped tools, risk boundaries and human approval. The LLM never receives `MERCURY_API_TOKEN`; only the connector's HTTP client reads it.
