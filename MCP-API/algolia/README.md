# Algolia MCP/API Connector

Reusable MCP server for Algolia search, analytics, selected index administration, and tightly controlled writes. It exposes stable provider-scoped tools while keeping Algolia credentials inside the connector.

## Transport strategy

Algolia provides official managed MCP offerings. As of August 2026, Algolia documents Public MCP for application-scoped search/recommend and Productivity MCP at `https://mcp.algolia.com/mcp` for OAuth-authenticated, user-scoped, read-only search and analytics. Public MCP endpoints are created in the Algolia dashboard and use `https://{APP_ID}.algolia.net/mcp/1/{UNIQ_ID}/mcp`.

This connector uses an explicitly configured official MCP URL for `algolia.record.search` when a compatible Algolia search tool is exposed. Otherwise it falls back to the official Search API. CRUD/settings and deterministic analytics use official APIs because Productivity MCP is read-only and Public MCP is scoped to search/recommend.

Official documentation:
- https://www.algolia.com/doc/guides/model-context-protocol
- https://www.algolia.com/doc/guides/model-context-protocol/public-mcp
- https://www.algolia.com/doc/guides/model-context-protocol/productivity-mcp
- https://www.algolia.com/doc/rest-api
- https://www.algolia.com/developers/search-api-javascript

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `algolia.index.list` | REST | READ | No |
| `algolia.record.search` | official MCP first, REST fallback | READ | No |
| `algolia.record.get` | REST | READ | No |
| `algolia.facet.search` | REST | READ | No |
| `algolia.settings.get` | REST | READ | No |
| `algolia.analytics.top_searches` | Analytics REST | READ | No |
| `algolia.analytics.no_results` | Analytics REST | READ | No |
| `algolia.record.save` | REST | WRITE | Yes |
| `algolia.settings.set` | REST | HIGH_RISK | Yes |
| `algolia.record.delete` | REST | DESTRUCTIVE | Yes |

## Authentication and scopes

Set `ALGOLIA_APPLICATION_ID`. Configure `ALGOLIA_SEARCH_API_KEY` for read operations using only required ACLs such as `search`, `browse`, and `analytics` where applicable. Configure `ALGOLIA_ADMIN_API_KEY` only for enabled write/settings tools, preferably as a restricted key with only `addObject`, `deleteObject`, and/or `settings` ACLs required by the deployment.

`ALGOLIA_MCP_URL` is optional and must point to an Algolia-managed MCP endpoint. Productivity MCP uses OAuth in the MCP client; Public MCP URLs are dashboard-generated capability URLs and should be protected even when configured as no-auth.

Credentials are injected only into outbound provider requests and are never returned in MCP responses.

## Approval boundaries

All mutations require a payload-bound approval token. Store `ALGOLIA_APPROVAL_SECRET` outside the LLM trust boundary. A trusted approval component derives HMAC-SHA256 over the tool name and canonical payload. Any payload change invalidates approval. `algolia.record.delete` is destructive and its provider request is never automatically retried.

## Reliability and rate limits

Requests use bounded timeouts and `ALGOLIA_MAX_RETRIES` (0-4). Safe operations retry 429 and transient 5xx responses with bounded exponential backoff and honor `Retry-After` when present. Validation, authentication, and permission failures are not retried. Pagination is explicit to prevent unbounded retrieval. Official MCP calls count toward Algolia usage; quotas depend on the Algolia account and plan.

## Security

The connector exposes no arbitrary URL or raw-request tool. Index names, IDs, page sizes, dates, filters, and facets are validated. Provider data is treated as untrusted content, never instructions. Upstream MCP tool discovery is restricted to expected Algolia search tool names. Retrieved content cannot elevate permissions. High-risk and destructive actions require explicit approval.

## Install and run

```bash
npm install
cp .env.example .env
npm run build
node dist/src/server.js
```

For stdio MCP clients, configure the command to run `node dist/src/server.js` and inject environment variables using the client or secret manager.

## Testing

```bash
npm test
```

Tests use mocked HTTP and require no live credentials. They cover required configuration, permission classification, payload-bound approval, read-key isolation, throttling retry, and destructive-operation retry suppression.

## Error handling

Provider errors are mapped to normal MCP tool failures. HTTP status and Algolia message are preserved by the client error type. Timeouts abort requests. OAuth/login interaction for Productivity MCP remains owned by the upstream MCP client; this wrapper never captures OAuth secrets.

## Limitations

This connector intentionally omits index deletion, API-key administration, billing, crawler administration, and unrestricted raw REST access. Recommend is left to the official Algolia MCP because recommendation models and strategy-specific inputs vary. The analytics implementation uses the documented US analytics host; deployments requiring another region should parameterize the analytics hostname before production use.
