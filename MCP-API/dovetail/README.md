# Dovetail MCP/API Connector

Reusable local MCP connector for Dovetail research/customer-intelligence workflows.

## Upstream strategy
Dovetail provides an official hosted MCP server at `https://dovetail.com/api/mcp` using Streamable HTTP and an official self-hosted STDIO server. This connector uses the official hosted MCP `search_workspace` tool for workspace search and the official Public REST API for deterministic project, data, and doc operations. It does not trust dynamically discovered upstream tools: it verifies that the explicitly allow-listed `search_workspace` tool exists before calling it.

Official documentation researched for this implementation:
- MCP: https://developers.dovetail.com/docs/mcp
- Self-hosted MCP: https://developers.dovetail.com/docs/mcp-self-hosted
- Public API: https://developers.dovetail.com/docs/introduction
- Authorization: https://developers.dovetail.com/docs/authorization
- Pagination: https://developers.dovetail.com/docs/pagination
- Rate limits: https://developers.dovetail.com/docs/rate-limits
- Docs API: https://developers.dovetail.com/reference/get_v1-docs and https://developers.dovetail.com/reference/post_v1-docs
- Data API: https://developers.dovetail.com/reference/get_v1-data

## Authentication
Set `DOVETAIL_API_TOKEN` to a Dovetail API token. Dovetail documents Bearer API tokens and states tokens expire after 30 days. Rotate them outside the agent and restart/reload the connector; this package never returns the token to MCP callers. Dovetail's hosted MCP also supports OAuth 2.1 for compatible interactive clients, but this local reusable connector intentionally uses a credential-isolated API token so the LLM never handles an OAuth refresh token. Dovetail's hosted endpoint does not support DCR/CIMD for clients that require those flows.

API access remains constrained by the Dovetail user/token permissions and the target object's/project's permissions. Use a least-privileged account.

## Environment
`DOVETAIL_API_BASE` defaults to `https://dovetail.com/api`; `DOVETAIL_MCP_URL` defaults to the official hosted MCP endpoint; both must be HTTPS. `DOVETAIL_TIMEOUT_MS` is bounded to 1–60 seconds. WRITE approval is required by default. DESTRUCTIVE operations are disabled by default.

## Install and run
Requires Node.js 22+ (matching Dovetail's current self-hosted MCP requirement).

```sh
npm install
npm run build
DOVETAIL_API_TOKEN=api.xxxxx npm start
```

Configure an MCP client that supports local STDIO servers to launch `node dist/src/server.js` and inject the token through its secret/environment facility.

## Tools
READ: `dovetail.workspace.search` (official MCP), `dovetail.project.list`, `dovetail.project.get`, `dovetail.data.list`, `dovetail.data.get`, `dovetail.data.export`, `dovetail.doc.list`, `dovetail.doc.get`, `dovetail.doc.export` (REST).

WRITE: `dovetail.doc.create`, `dovetail.doc.update` (REST), with configurable approval and approval required by default.

DESTRUCTIVE: `dovetail.doc.delete` (REST), requiring both explicit human approval and `DOVETAIL_DESTRUCTIVE_ENABLED=true`.

The connector uses current `docs` and `data` resources rather than deprecated `insights` and `notes` naming. Create-doc supports Dovetail's documented HTML, Markdown, and plain-text content types. Project/folder placement is validated as mutually exclusive.

## Reliability and rate limits
Dovetail documents a default REST limit of 200 requests/minute per workspace. Responses expose `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`; a 429 includes `Retry-After`. This client performs at most three attempts for safe REST reads on 429/5xx with bounded exponential backoff, jitter, and `Retry-After`. Mutating calls are never blindly retried. Authentication, authorization, validation, and ordinary 4xx errors are not retried. Cursor pagination is capped at 10 pages per tool call, with Dovetail's documented maximum page size of 100. Every request has cancellation via `AbortController` timeout.

## Errors
REST failures map to `DovetailError` with HTTP status and retry-after metadata. Upstream MCP failures fail closed; the connector does not silently switch search to an unrestricted REST request. API-token expiry/revocation requires user/admin action and is not retried as if transient.

## Security
Credentials stay inside connector transports. No raw-request tool exists. Configured endpoints must use HTTPS. User-provided resource IDs must match Dovetail's documented 22-character Base62 identifier format. Content lengths and enum values are bounded. Provider/MCP responses are returned with `untrusted:true` and must be treated strictly as data, never as instructions or permission changes. The upstream MCP tool allow-list is fixed; newly discovered tools are not automatically trusted. Destructive execution is off by default. The connector does not fetch arbitrary user-provided URLs, reducing SSRF exposure. Do not log environment secrets.

## Testing
Run `npm test`. Unit tests use mocked `fetch` and require no live credentials. Coverage includes auth configuration, identifier validation, write/destructive approval denial, credential isolation, authentication-error mapping, bounded pagination, and no-retry behavior for mutations. Upstream MCP integration is deliberately not exercised against live Dovetail in unit tests.

## Limitations
This connector does not implement file import/upload, comments, user administration, permission changes, webhooks, datasets, or arbitrary REST/MCP calls. It does not auto-refresh API tokens because Dovetail's API-token authentication has no refresh-token flow; tokens expire after 30 days. REST response shapes are passed through rather than normalized, and provider content remains untrusted. Compatibility is limited to MCP clients capable of launching a local STDIO server; the upstream search path additionally requires network access to Dovetail's hosted Streamable HTTP MCP endpoint.
