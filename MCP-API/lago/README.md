# Lago MCP/API Connector

Reusable MCP stdio connector for Lago billing data and a deliberately small set of financial operations.

## Official sources
Researched on 2026-08-30:
- Lago developer resources: https://getlago.com/developers
- Lago OpenAPI repository: https://github.com/getlago/lago-openapi
- Lago Swagger/OpenAPI UI: https://swagger.getlago.com/
- Official Lago Agent Toolkit / MCP server: https://github.com/getlago/lago-agent-toolkit
- Lago platform AI/MCP overview: https://getlago.com/platform/ai

Lago provides an official Rust MCP server distributed as `getlago/lago-mcp-server` and an official REST/OpenAPI surface. The official agent toolkit documents a broad billing tool catalog and uses the Lago API key as the server-side organization trust boundary. This connector does not proxy the whole upstream MCP catalog: it uses the official REST API so it can expose a smaller auditable tool allowlist and add explicit connector-side approvals around writes.

## Authentication
Set `LAGO_API_KEY`; it is sent only by the connector as `Authorization: Bearer <key>`. Lago determines the accessible organization from the key. Never pass the key as a tool argument. `LAGO_API_URL` defaults to the US cloud API; use `https://api.eu.getlago.com/api/v1` for EU Cloud or a trusted self-hosted URL.

## Tools
| Tool | Risk | Approval |
|---|---|---|
| `lago.customer.list` | READ | no |
| `lago.customer.get` | READ | no |
| `lago.invoice.list` | READ | no |
| `lago.invoice.get` | READ | no |
| `lago.subscription.list` | READ | no |
| `lago.subscription.get` | READ | no |
| `lago.wallet.list` | READ | no |
| `lago.analytics.mrr.get` | READ | no |
| `lago.analytics.gross_revenue.get` | READ | no |
| `lago.analytics.overdue_balance.get` | READ | no |
| `lago.event.ingest` | WRITE | yes |
| `lago.subscription.create` | HIGH_RISK | yes |
| `lago.invoice.payment_retry` | HIGH_RISK | yes |

## Approval model
Writes require `LAGO_APPROVAL_SECRET` plus a 64-character `approval_token`. The token is HMAC-SHA256 over the exact tool name and canonical payload excluding `approval_token`. Changing a customer, plan, event code, amount-bearing properties, or invoice id invalidates approval. Read tools execute without approval.

## Reliability and rate limits
GET requests use bounded exponential backoff for 429/502/503/504 and honor integer `Retry-After`. Authentication and validation errors are not retried. Financial writes are never blindly retried because duplicate events, subscriptions, or payment retries can have billing consequences. Pagination is bounded to 100 records per call. Requests have a configurable timeout and honor MCP cancellation.

Lago's published developer material does not state one universal fixed request quota for every Cloud/self-hosted deployment; this connector therefore reacts to HTTP 429 rather than inventing a limit.

## Security
- Credentials remain in the auth/client layer.
- No arbitrary HTTP passthrough tool.
- No customer deletion, invoice voiding, credit-note/refund creation, wallet top-up, plan mutation, billing-entity mutation, API-key management, or webhook administration.
- Provider-returned content is tagged as untrusted data and must never be treated as agent instructions.
- Consequential billing actions require payload-bound human approval.
- Non-idempotent financial writes are not automatically retried.
- Configure the narrowest Lago API key/RBAC available for the deployment.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run check
npm test
npm start
```
Configure an MCP client to launch `node src/server/index.js` with the environment variables from `.env.example`. Compatible with MCP clients that support stdio servers; compatibility with any specific client depends on that client's current stdio MCP support.

## Error handling
Errors are returned as MCP tool errors with normalized `status`, `code`, `retry_after`, and `retryable` fields when available. Raw credentials are never included.

## Testing
Tests require no live Lago credentials. They cover auth configuration, tool/policy parity, payload-bound approval, read authorization, bearer auth, pagination query construction, non-retry of authentication failures, 429 retry behavior, and no blind retries for financial writes.

## Limitations
This is intentionally not a full Lago administration connector. The official Lago MCP server exposes more capabilities; use it directly when that broader surface is appropriate and its permission boundary matches your environment. This connector favors a narrow, reusable, reviewable contract for common agent workflows.
