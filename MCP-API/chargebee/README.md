# Chargebee MCP/API Connector

Reusable MCP server for safe Chargebee billing-data workflows. It exposes 14 provider-scoped tools over stdio and keeps credentials inside the connector.

## Upstream strategy and official sources
Chargebee provides an official **Data Lookup MCP server** for customer, subscription, invoice, quote, payment, export, MRR, exchange-rate and hosted-page lookup. Its URL is site- and data-center-specific: US `https://{subdomain}.mcp.chargebee.com/data_lookup_agent`, EU `https://{subdomain}.mcp.eu.chargebee.com/data_lookup_agent`, or AU `https://{subdomain}.mcp.au.chargebee.com/data_lookup_agent`. This package validates an optional site-specific MCP URL but deliberately executes its stable allow-listed contracts through Chargebee API v2; this prevents automatic trust of newly discovered upstream tools and provides the required write operations.

Official documentation researched:
- Data Lookup MCP: https://www.chargebee.com/docs/billing/2.0/ai-in-chargebee/data-lookup-agent
- MCP overview: https://www.chargebee.com/docs/billing/2.0/ai-in-chargebee/chargebee-mcp
- API v2: https://apidocs.chargebee.com/docs/api
- Authentication: https://apidocs.chargebee.com/docs/api/authentication
- API keys: https://www.chargebee.com/docs/billing/2.0/site-configuration/api-keys
- Subscription pause/resume: https://apidocs.chargebee.com/docs/api/subscriptions/pause-a-subscription and https://apidocs.chargebee.com/docs/api/subscriptions/resume-a-subscription
- Rate-limit behavior: https://apidocs.chargebee.com/docs/api
- Webhooks: https://www.chargebee.com/docs/billing/2.0/webhook_settings

## Architecture
MCP client → strict tool schema → permission/approval policy → Chargebee client → API v2. `CHARGEBEE_API_KEY` becomes HTTP Basic authentication only inside the client. Provider responses are marked `source=untrusted_provider_data` and cannot change permissions or system behavior.

## Authentication and least privilege
Set `CHARGEBEE_SITE` and `CHARGEBEE_API_KEY`. API v2 uses the API key as the Basic-auth username with an empty password. Use a restricted Chargebee API key/role granting only resources needed by enabled tools. Chargebee API-key authorization is role/permission based rather than OAuth scopes in this flow. Never expose credentials to the model, tool arguments, logs, examples, or source control.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run build
npm start
```
The connector serves MCP over stdio. Configure an MCP client to launch `node dist/src/server.js` with secrets supplied by its process environment or secret manager.

## Environment
Required: `CHARGEBEE_SITE`, `CHARGEBEE_API_KEY`. Optional: `CHARGEBEE_TIMEOUT_MS` (15000), `CHARGEBEE_MAX_RETRIES` (3; capped at 5), `CHARGEBEE_ALLOW_WRITES` (false), `CHARGEBEE_APPROVAL_TOKEN`, `CHARGEBEE_MCP_URL`. Copy the latter from Chargebee's Agentic AI > MCP Servers UI; the connector accepts only official Chargebee Data Lookup MCP host/path patterns.

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

No unrestricted request, deletion, refund, payment-method, security, permission, or billing-configuration tool is exposed.

## Approval model
READ may execute automatically. WRITE is disabled unless `CHARGEBEE_ALLOW_WRITES=true` and requires the exact connector-side `approvalToken`. HIGH_RISK subscription state changes have the same hard gate and require a human to review the concrete subscription and billing effect before issuing approval. Destructive operations are not exposed. Cancel defaults to end-of-term. Pause supports `immediately` or `end_of_term`; resume is intentionally restricted to immediate resumption, avoiding ambiguous scheduled dates.

## Reliability, pagination, and rate limits
Every request has a timeout. Network failures, HTTP 429, and 5xx responses receive bounded exponential-backoff retries; 429 honors `Retry-After` when present. Authentication, permission, validation, and ordinary 4xx failures are not retried. List tools expose Chargebee `limit`/`offset`; `limit` is 1–100 and callers should pass the returned `next_offset` to continue. The connector avoids fan-out calls. Provider plan/site limits remain authoritative.

## Errors
401 authentication failure; 403 permission denial; 404 missing resource; 422 provider validation failure; 429 throttling. Timeouts and exhausted retries are surfaced without credential leakage.

## Security and events
Use restricted keys and secret storage; keep writes off by default and rotate approval tokens independently. Strict schemas reject unknown properties. IDs reject URL path/query delimiters. The API hostname is derived only from validated `CHARGEBEE_SITE`, preventing caller-controlled SSRF destinations. Treat all Chargebee content and MCP responses as untrusted data. Chargebee supports webhooks, but this stdio connector does not ingest them; a production webhook receiver should separately enforce HTTPS, authenticity controls, replay/idempotency handling, bounded processing, and untrusted-payload treatment.

For upstream MCP, enable only required Chargebee servers/toolsets and trusted authentication. This connector does not proxy tool discovery, so newly added upstream tools never become implicitly callable.

## Tests
`npm test` compiles and runs credential-free Node tests with fake fetch implementations. Tests cover registration, strict validation, default write denial, approval, Basic auth, pagination, API errors, and timeout behavior.

## Examples
See `examples/workflows.md` for read and approved-write workflows, expected output shape, permission level, and approval requirements.

## Limitations
No OAuth flow, hosted MCP transport, webhook receiver, arbitrary API request, deletion, refund, payment-method mutation, or Chargebee configuration mutation is implemented. The official Data Lookup MCP is researched and validated as an optional trusted upstream, but is not proxied; API v2 is the implemented transport for all listed tools. `item_price.list` assumes Product Catalog 2.0. Pause requires Chargebee's Pause Subscription feature and provider-side state constraints. Provider entitlements and limits depend on site configuration, plan, catalog version, and API-key role.
