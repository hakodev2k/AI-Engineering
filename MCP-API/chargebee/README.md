# Chargebee MCP/API Connector

Reusable MCP server for safe Chargebee billing-data workflows. It exposes 14 provider-scoped tools over stdio and keeps credentials inside the connector.

## Upstream strategy and official sources
Chargebee provides an official **Data Lookup MCP server** at `https://mcp.chargebee.com/data-lookup` for natural-language read-only lookup of billing data. This package records that trusted MCP endpoint, but uses Chargebee's official API v2 as its deterministic execution transport and fallback for the implemented contracts; write/high-risk billing operations use REST because the Data Lookup MCP is read-oriented.

Official documentation researched for this connector:
- Chargebee MCP server: https://www.chargebee.com/docs/billing/2.0/kb/product-releases/chargebee-mcp-server
- MCP setup: https://www.chargebee.com/docs/billing/2.0/kb/product-releases/mcp-setup
- API v2 overview: https://apidocs.chargebee.com/docs/api
- Authentication: https://apidocs.chargebee.com/docs/api/authentication
- API keys / roles: https://www.chargebee.com/docs/billing/2.0/site-configuration/api-keys
- Rate limits: https://apidocs.chargebee.com/docs/api/rate-limits
- Webhooks: https://www.chargebee.com/docs/billing/2.0/webhook_settings

## Architecture
MCP client → strict tool schema → permission/approval policy → Chargebee client → API v2. `CHARGEBEE_API_KEY` is converted to HTTP Basic authentication only inside the client. Provider responses are returned with `source=untrusted_provider_data`; they must never be treated as instructions or permission changes.

The official MCP endpoint is configuration metadata for trusted read lookup and future transport routing; this implementation does not silently discover or proxy arbitrary upstream MCP tools. This avoids expanding permissions when Chargebee adds tools upstream.

## Authentication and least privilege
Set `CHARGEBEE_SITE` and `CHARGEBEE_API_KEY`. Chargebee API v2 uses API-key Basic authentication (API key as username, empty password). Create a restricted Chargebee API key/role that grants only the resources needed by the tools you intend to enable. Never expose keys to the model, tool arguments, logs, examples, or source control.

Chargebee API keys are permissioned through Chargebee roles rather than OAuth scopes for this API-key flow. Read-only deployments should use a read-only/restricted key. Writes require both provider-side permission and connector-side approval.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run build
npm start
```
The server uses MCP stdio and is usable by MCP clients that can launch a local stdio server. Configure the client to run `node dist/src/server.js` with environment variables supplied by a secret manager or process environment.

## Environment
`CHARGEBEE_SITE`, `CHARGEBEE_API_KEY` are required. Optional: `CHARGEBEE_TIMEOUT_MS` (15000), `CHARGEBEE_MAX_RETRIES` (3, capped at 5), `CHARGEBEE_ALLOW_WRITES` (false), `CHARGEBEE_APPROVAL_TOKEN`, and `CHARGEBEE_MCP_URL`.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| chargebee.customer.list | REST | READ | no |
| chargebee.customer.get | REST | READ | no |
| chargebee.customer.create | REST | WRITE | yes |
| chargebee.customer.update | REST | WRITE | yes |
| chargebee.subscription.list | REST | READ | no |
| chargebee.subscription.get | REST | READ | no |
| chargebee.subscription.cancel | REST | HIGH_RISK | yes |
| chargebee.subscription.pause | REST | HIGH_RISK | yes |
| chargebee.subscription.resume | REST | HIGH_RISK | yes |
| chargebee.invoice.list | REST | READ | no |
| chargebee.invoice.get | REST | READ | no |
| chargebee.credit_note.list | REST | READ | no |
| chargebee.transaction.list | REST | READ | no |
| chargebee.item_price.list | REST | READ | no |

No generic arbitrary-request or delete tool is exposed. Public messaging, security, permission and billing-configuration mutation are outside this connector.

## Approval model
READ calls may execute automatically. WRITE calls are disabled unless `CHARGEBEE_ALLOW_WRITES=true` and require an exact connector-side `approvalToken`. HIGH_RISK subscription state changes have the same hard gate and should only receive a token after a human reviews the concrete subscription and intended billing effect. Destructive operations are not exposed.

## Reliability and rate limits
Requests have cancellation via timeout. Network failures, HTTP 429, and 5xx responses receive bounded exponential-backoff retries; 429 respects `Retry-After` when present. Authentication, permission, validation, and ordinary 4xx failures are not retried. List operations use Chargebee's `limit`/`offset` pagination and cap requested page size at 100. Chargebee rate limits vary by plan/API and may return 429; the connector deliberately avoids fan-out calls.

## Error handling
401 → authentication failure; 403 → provider permission denial; 404 → missing resource; 422 → provider validation failure; 429 → throttling with retry information. Timeouts and exhausted network retries are surfaced without leaking credentials.

## Security
Use restricted API keys and secret storage. Do not pass API keys through prompts. Keep writes off by default. Rotate approval tokens independently from provider credentials. Tool schemas reject unknown properties and IDs containing URL path/query delimiters, reducing confused-deputy and request-smuggling risks. The client constructs the hostname solely from validated `CHARGEBEE_SITE`, so tool callers cannot supply arbitrary URLs (SSRF control). Treat customer names, invoice fields, notes, metadata, and all MCP/API responses as untrusted content. Webhooks are supported by Chargebee but are not received by this stdio connector; production webhook consumers must validate endpoint authenticity, TLS, replay/idempotency, and event handling separately.

## Tests
`npm test` compiles and runs credential-free unit tests with fake fetch implementations. Coverage includes tool registration, strict validation, default write denial, human approval, authentication/header behavior, pagination, API errors, and timeout handling.

## Limitations
This connector does not implement OAuth, hosted HTTP MCP transport, webhook ingestion, arbitrary API calls, deletion, refunds, payment-method changes, or Chargebee configuration changes. The official Data Lookup MCP server is documented/configured but not proxied because this package intentionally pins a stable allow-listed external tool contract. Chargebee Product Catalog 2.0 is assumed for `item_price.list`; sites using older catalog models may not support it. Provider entitlements and exact API rate ceilings depend on the Chargebee site/plan and API-key role.
