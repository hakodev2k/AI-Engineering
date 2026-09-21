# Kagi MCP/API Connector

Reusable MCP stdio server exposing Kagi search, enrichment, FastGPT and Universal Summarizer capabilities with credential isolation, strict validation, bounded retries and approval gates for billable generative calls.

## Upstream strategy
Kagi documents an official MCP server that currently covers its new Search and Extract APIs. This package does not proxy dynamically discovered upstream MCP tools: the public docs do not expose a stable remote endpoint/tool contract on the referenced overview page, and dynamically trusting tools would weaken the connector's fixed allow-list. It therefore uses Kagi's documented official REST APIs behind a stable local MCP interface. Search uses v1. Enrichment, FastGPT and Summarizer use their documented v0 endpoints. No arbitrary-request tool exists.

Official sources: Kagi API Portal `https://help.kagi.com/kagi/api/overview.html`; Search `https://help.kagi.com/kagi/api/search.html`; Quick Start/auth `https://help.kagi.com/kagi/api/api-portal.html`; Enrichment `https://help.kagi.com/kagi/api/enrich.html`; FastGPT `https://help.kagi.com/kagi/api/fastgpt.html`; Universal Summarizer `https://help.kagi.com/kagi/api/summarizer.html`. Kagi states the legacy v0 Search API is deprecated; this connector does not use it.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `kagi.search.web` | REST v1 | READ | No |
| `kagi.enrich.web` | REST v0 | READ | No |
| `kagi.enrich.news` | REST v0 | READ | No |
| `kagi.answer.fastgpt` | REST v0 | WRITE/billable | Yes |
| `kagi.summarize.url` | REST v0 | WRITE/billable | Yes |
| `kagi.summarize.text` | REST v0 | WRITE/billable | Yes |

Kagi's official MCP currently supports Search and Extract, while its docs state support for other APIs will be added later. This connector intentionally exposes Search via the direct API and does not claim an Extract REST route without a stable endpoint contract in the cited help pages.

## Authentication and permissions
Generate an API token in Kagi Settings → API. The documented API authentication header is `Authorization: Bot <token>`. Store it only as `KAGI_API_TOKEN`; the server adds the header inside the client layer and never returns it. Kagi API keys can be restricted by allowed products and IP addresses; use only products needed by enabled tools.

Kagi APIs are metered/billable. Search/enrichment are classified READ because they do not mutate provider resources, but they still incur API cost. FastGPT and Summarizer additionally perform paid generation and are classified WRITE so they require `KAGI_ALLOW_PAID_WRITES=true` plus an exact `KAGI_APPROVAL_TOKEN`. The approval token is a runtime/human control and must not be given to the model.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
KAGI_API_TOKEN=... node dist/server.js
```

Configure an MCP client to launch `node /absolute/path/MCP-API/kagi/dist/server.js` over stdio. Any MCP client that supports standard stdio MCP servers can use this package; client-specific installation is outside this connector.

## Environment
`KAGI_API_TOKEN` is required. `KAGI_TIMEOUT_MS` defaults to 15000. `KAGI_MAX_RETRIES` defaults to 2 and is capped at 4. `KAGI_ALLOW_PAID_WRITES` defaults false. `KAGI_APPROVAL_TOKEN` is required only for approved paid-generation tools.

## Reliability and rate limits
Requests have timeouts. HTTP 429 and 5xx responses are retried with bounded exponential backoff; `Retry-After` is honored when supplied. Authentication, authorization, validation and other 4xx failures are not retried. Provider error text is mapped to `KagiError`. Search limits are validated to 1–50 to bound response size/cost.

Kagi's public API portal describes pay-per-use billing and configurable usage limits. Rate limits can depend on service/account; the connector therefore relies on HTTP 429/`Retry-After` rather than inventing a fixed quota.

## Security
Provider results and summaries are untrusted data, never instructions. Tool discovery is fixed at build time. There is no arbitrary URL/API proxy. URL summarization accepts HTTPS only; note that Kagi itself fetches the URL, so callers should still avoid sending private/signed URLs or secrets. Text summarization is capped below the documented 1 MB request maximum. Secrets are not logged. Approval cannot elevate API-key product permissions.

For sensitive summarization, Kagi recommends `cache=false`; callers can set that flag. API keys should use Kagi's product/IP restrictions where practical.

## Testing
`npm test` uses mocked `fetch` and requires no live credential. Tests cover missing auth, credential isolation/header injection, query encoding, non-retryable authentication errors and bounded 429 retry behavior.

## Limitations
No account/billing mutation, key management, arbitrary API execution, destructive operations, webhooks, or undocumented endpoints are exposed. Kagi's official MCP is acknowledged but not proxied until a stable endpoint/tool contract can be pinned and allow-listed. v1 Summarizer is not used because Kagi's current overview states it is not yet available there.
