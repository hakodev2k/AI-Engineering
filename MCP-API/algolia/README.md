# Algolia MCP/API Connector

Reusable MCP server for Algolia. It exposes a stable provider-scoped interface while keeping credentials inside the connector.

## Upstream strategy

As researched on 2026-09-23, Algolia provides an official remote **Productivity MCP** at `https://mcp.algolia.com/mcp` for account-aware read operations, plus official APIs for index writes. This connector therefore routes reads to the official MCP and the two intentionally narrow writes to the official REST API. Algolia also operates the separate no-auth DocSearch MCP at `https://mcp.algolia.com/1/docsearch/mcp`; it searches public developer documentation and is not used for private application/index operations.

Official sources: Algolia MCP product/docs (`https://www.algolia.com/developers/lp-mcp`), official implementation guidance (`https://github.com/algolia/implementation-skills`), DocSearch MCP (`https://docsearch.algolia.com/docs/mcp/overview/`), and Algolia API documentation (`https://www.algolia.com/doc/rest-api/search/`).

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `algolia.application.list` | official MCP | READ | no |
| `algolia.index.list` | official MCP | READ | no |
| `algolia.index.settings.get` | official MCP | READ | no |
| `algolia.record.search` | official MCP | READ | no |
| `algolia.analytics.top_searches` | official MCP | READ | no |
| `algolia.analytics.no_results_rate` | official MCP | READ | no |
| `algolia.record.create` | REST | WRITE | yes |
| `algolia.record.partial_update` | REST | WRITE | yes |

No delete, index deletion, ACL, billing, API-key management, or arbitrary-request tool is exposed.

## Authentication and least privilege

For MCP reads, obtain an OAuth access token through Algolia's supported authorization flow and inject it as `ALGOLIA_MCP_ACCESS_TOKEN`; the token is never accepted as a tool argument. For REST writes, set `ALGOLIA_APP_ID` and an Algolia API key restricted to only the target indices and ACLs needed for `addObject`/record updates. Do not use an Admin API key unless unavoidable. The LLM never receives either credential.

Copy `.env.example` to your secret environment provider. Set `ALGOLIA_WRITE_ENABLED=true` only after reviewing your agent policy. Every write additionally requires literal `approved: true` in the call, representing explicit human approval supplied by the host application.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The connector uses MCP stdio, so any MCP client that supports launching a local stdio server can run `node /absolute/path/dist/server.js`. Client-specific configuration is intentionally not hard-coded.

## Reliability

REST writes use an AbortController timeout (1–30 seconds), retry at most twice after the first attempt for HTTP 429 and 5xx, honor `Retry-After` when present, and use exponential backoff otherwise. Validation, 400, 401, and 403 failures are not retried. Writes are never retried beyond this bounded request budget. Read-side rate limiting and pagination are handled by Algolia's official MCP implementation; callers should keep search result sizes bounded (`hitsPerPage <= 100`).

## Security

The upstream MCP URL is restricted to HTTPS on `mcp.algolia.com`, and only six known read tools are allowlisted. Tool discovery cannot silently expand connector permissions. Provider results are untrusted data and must not be treated as instructions. Index names/object IDs are validated; REST hosts derive only from a validated application ID, limiting SSRF. Secrets are never logged or returned. Write capability is disabled by default and separately approval-gated. No destructive capability exists.

## Examples

See `examples/workflows.md`. Typical flow: list applications → list indices → inspect settings → search → inspect analytics → optionally create or partially update a record after human approval.

## Testing

```bash
npm test
```

Unit tests require no live credentials. They cover unsafe input rejection, write policy/approval, non-retryable auth failure, 429 retry behavior, and credential isolation.

## Limitations

The Productivity MCP OAuth access token must be provisioned by the host; this package does not collect browser credentials or refresh tokens. Upstream MCP tool contracts can evolve; the connector fails closed if a non-allowlisted tool is requested. Public DocSearch is intentionally outside this private-data connector. Webhooks, rules, synonyms, API-key administration, index deletion, and destructive record deletion are not exposed.
