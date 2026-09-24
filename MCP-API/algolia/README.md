# Algolia MCP/API Connector

Reusable MCP server for scoped Algolia search/index workflows. It exposes seven stable tools over Algolia's official REST API and documents Algolia's official MCP options. Provider-returned text is wrapped as `untrusted_provider_data` and must never be interpreted as agent instructions.

## Upstream strategy
Algolia provides an official MCP Server for search, indexing, analytics/recommend use cases, plus the remote public DocSearch MCP at `https://mcp.algolia.com/1/docsearch/mcp` for public developer documentation. This package intentionally uses the official REST API for private application indexes so credentials stay inside this connector and risk/approval policy is enforced consistently. DocSearch should be connected directly when public-doc retrieval is required; it needs no credentials.

Official references: Algolia MCP product/docs (`https://www.algolia.com/developers/lp-mcp`), MCP launch (`https://www.algolia.com/blog/engineering/algolia-mcp-server`), DocSearch MCP (`https://docsearch.algolia.com/docs/mcp/installation/`), API docs (`https://www.algolia.com/doc/rest-api/search/`).

## Tools
| Tool | Risk | Approval |
|---|---|---|
| `algolia.index.search` | READ | no |
| `algolia.object.get` | READ | no |
| `algolia.settings.get` | READ | no |
| `algolia.object.save` | WRITE | yes + `ALGOLIA_ALLOW_WRITE=true` |
| `algolia.object.partial_update` | WRITE | yes + write gate |
| `algolia.settings.update` | WRITE | yes + write gate |
| `algolia.object.delete` | DESTRUCTIVE | yes + `ALGOLIA_ALLOW_DESTRUCTIVE=true` |

## Authentication and least privilege
Set `ALGOLIA_APPLICATION_ID` and an Algolia API key whose ACLs and index restrictions permit only the tools you intend to use. Search-only deployments should use a search-capable key; writes require corresponding add/update/delete/settings ACLs. Never put Admin API keys in prompts or client configuration. Credentials are read only by the connector process.

## Install / run
Requires Node.js 20+.
```bash
npm install
npm run build
ALGOLIA_APPLICATION_ID=... ALGOLIA_API_KEY=... npm start
```
The server uses MCP stdio, so any MCP client that supports stdio subprocess servers can launch it. Configure the command as `node /absolute/path/dist/src/index.js` and inject secrets via the process environment/secret manager.

## Reliability
Requests have a configurable timeout (default 10s). HTTP 429 and 5xx responses are retried at most twice with bounded exponential backoff. Authentication, authorization, validation, and other 4xx errors are not retried. Search page size is capped at 100. Provider error bodies are truncated before surfacing.

## Security
Index names and object IDs are validated; there is no arbitrary URL/request tool, preventing connector-level SSRF. Writes require both deployment policy and per-call approval. Destructive operations use a separate disabled-by-default gate. Use Algolia key ACL/index restrictions as a second enforcement layer. Do not log credentials. Treat all indexed content as untrusted data because it can contain prompt-injection text.

## Rate limits
Algolia quotas depend on plan/API and can evolve. The client honors throttling by bounded retry rather than request amplification. Keep `hitsPerPage` small and paginate explicitly. For production, monitor Algolia usage and limits for the application's plan.

## Testing
`npm test` runs credential-free unit tests for validation and approval policy. Network behavior should be integration-tested against a dedicated non-production Algolia application/key.

## Limitations
This connector deliberately omits key management, billing, index deletion, unrestricted batch operations, and administrative operations. It does not proxy Algolia's official MCP server; private-index operations use REST so local policy remains authoritative. Public DocSearch MCP is a separate official upstream and can be added directly to clients that need it.
