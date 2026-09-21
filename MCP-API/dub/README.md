# Dub MCP/API Connector

Reusable MCP server for scoped Dub link-management and analytics workflows.

## Transport strategy
Dub has an official hosted MCP server (announced May 21, 2026) with agent tools for the Dub platform, including partner-management workflows. This package intentionally uses Dub's official REST API for a small, auditable link-management contract: deterministic schemas, local approval gates, and restricted workspace API keys. It does not proxy or auto-discover upstream MCP tools.

Official sources researched: https://dub.co/blog/dub-mcp-server, https://dub.co/docs/api-reference/introduction, https://dub.co/docs/api-reference/links/create, https://dub.co/docs/api-reference/analytics/retrieve, https://dub.co/blog/announcing-dub-api, https://dub.co/blog/introducing-webhooks, https://dub.co/pricing/links.

## Capabilities
`dub.link.list`, `dub.link.get`, `dub.analytics.retrieve`, `dub.domain.list`, and `dub.tag.list` are READ. `dub.link.create` and `dub.link.update` are WRITE. `dub.link.delete` is DESTRUCTIVE. The connector deliberately omits arbitrary HTTP passthrough, billing, workspace permissions, payouts, partner approval, and other unrelated/high-impact operations.

## Authentication and least privilege
Set `DUB_API_KEY` to a Dub workspace API key. Dub supports workspace API keys, restricted scopes, and machine users. Create a key limited to the resources/actions this connector needs. Credentials are read only inside the connector and are never returned by tools or placed in model-visible arguments. `DUB_API_BASE_URL` is pinned to `https://api.dub.co`; alternate hosts are rejected to prevent token exfiltration.

## Environment
Copy `.env.example` values into your secret manager/runtime environment. `DUB_ALLOW_WRITES=false` and `DUB_ALLOW_DESTRUCTIVE=false` are safe defaults. A write requires both `approved:true` and the write feature flag. Delete additionally requires `DUB_ALLOW_DESTRUCTIVE=true`.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
npm test
DUB_API_KEY=... npm start
```

The server uses MCP stdio transport and therefore works with MCP clients capable of launching a local stdio server. Client-specific configuration is intentionally not claimed beyond standard MCP stdio support.

## Tool contract
All tools use strict Zod validation and provider-scoped action names. Read results are wrapped under `untrustedProviderData` to make the trust boundary explicit. Retrieved URLs, titles, tags, analytics labels, and other provider-controlled strings must never be interpreted as agent instructions.

`dub.link.list`: page 1..1000 and pageSize 1..100. `dub.link.get`: link id. `dub.link.create`: destination URL plus optional domain/key/externalId. `dub.link.update`: link id plus supported URL/key/archive fields. `dub.link.delete`: link id. `dub.analytics.retrieve`: optional link id, bounded interval, and allow-listed grouping. `dub.domain.list`: workspace domains. `dub.tag.list`: workspace tags.

## Approval model
READ executes automatically. WRITE requires explicit human approval in the tool call and an operator-enabled environment flag. DESTRUCTIVE requires explicit human approval and its own disabled-by-default flag. Retrieved Dub content cannot change these flags or elevate permissions.

## Reliability and rate limits
GET requests retry only on HTTP 429 and 5xx, with bounded exponential backoff and `Retry-After` support. Writes and deletes are never blindly retried. Every request has an AbortController timeout. Provider errors preserve HTTP status through `DubError`. Dub plan limits vary; current public pricing documents API limits such as 600/min on Pro, 1,200/min on Business, 3,000/min on Advanced, and custom Enterprise limits. The connector does not assume a specific plan.

## Webhooks/events
Dub supports real-time webhook events including link created/updated/deleted/clicked and conversion events. This connector does not host a webhook receiver because secure public ingress, signature/secret lifecycle, replay protection, and deployment topology belong to the consuming application. No polling-based fake webhook capability is exposed.

## Security
Secrets are isolated from model inputs/outputs. API host pinning mitigates SSRF/token forwarding. Inputs are length/type constrained. Provider content is explicitly marked untrusted. Tool discovery is static; no newly discovered upstream MCP tools are trusted automatically. Destructive behavior is disabled by default. Logs should never include `DUB_API_KEY`.

## Tests
`npm test` runs credential/configuration, host-pinning, bearer-auth, response parsing, provider-error, throttling retry, permission-denial, approval, and destructive-default tests with mocked HTTP; live credentials are not required.

## Limitations
The package implements eight focused capabilities, not the full Dub API. It uses workspace API-key authentication; interactive OAuth for third-party SaaS distribution is outside this package. Official Dub MCP exists but is not proxied because the implemented link workflows are narrower and benefit from local policy enforcement. API availability and plan-specific features remain subject to Dub's current product documentation.
