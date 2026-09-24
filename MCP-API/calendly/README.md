# Calendly MCP/API Connector

Reusable MCP stdio server for Calendly scheduling workflows.

## Transport strategy
Calendly provides an official hosted MCP server at `https://mcp.calendly.com/`. It uses MCP Streamable HTTP, OAuth 2.1 Authorization Code + PKCE (S256), Dynamic Client Registration (RFC 7591), and the MCP scopes `mcp:scheduling:read` and `mcp:scheduling:write`. Compatible clients should prefer that official server.

This package is a policy-enforcing stdio bridge over the official Calendly API v2 for runtimes that need server-side PAT/OAuth bearer credential isolation, stable provider-scoped tool names, explicit approval gates, and deterministic tests. It does not impersonate or proxy the hosted MCP server.

Official sources researched 2026-09-24:
- https://developer.calendly.com/docs/mcp/calendly-mcp-server
- https://developer.calendly.com/api-docs/overview/rate-limits
- https://developer.calendly.com/api-docs/calendly-api/scheduling-links/create-scheduling-link
- https://developer.calendly.com/docs/getting-started/how-to-migrate-from-api-v1-to-api-v2
- https://developer.calendly.com/release-notes

## Capabilities
Ten tools are implemented: `calendly.user.get`, `calendly.event_type.list`, `calendly.event_type.get`, `calendly.event_type.available_times`, `calendly.scheduled_event.list`, `calendly.scheduled_event.get`, `calendly.invitee.list`, `calendly.invitee.get`, `calendly.scheduling_link.create`, and `calendly.scheduled_event.cancel`.

The first eight are READ. Creating a single-use scheduling link is HIGH_RISK because it creates an externally usable booking capability. Canceling an event is DESTRUCTIVE. Both require `CONNECTOR_ALLOW_WRITES=true` and `approved:true`. No arbitrary HTTP-request tool is exposed.

## Authentication and scopes
Set `CALENDLY_ACCESS_TOKEN` to an API v2 OAuth access token or Personal Access Token. The token remains in the connector process and is never accepted as a tool parameter or returned to the model. For OAuth applications, grant only the API scopes needed by the selected tools; Calendly documents endpoint-specific scopes in its API reference. The official MCP path instead discovers and requests `mcp:scheduling:read` and `mcp:scheduling:write` through DCR/PKCE.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
CALENDLY_ACCESS_TOKEN=... node dist/src/server.js
```

Copy `.env.example` values into your process environment; the package does not load secret files automatically.

## Architecture
`src/security.ts` owns credentials and approval policy. `src/client.ts` implements authenticated REST calls, timeout, bounded retries for safe reads, and rate-limit reset handling. `src/tools.ts` contains strict Zod schemas and handlers. `src/server.ts` registers the tools on an MCP stdio transport. Provider content is wrapped with `untrusted_provider_content:true`.

## Rate limits and reliability
Calendly documents user-based limits of 500 requests/user/minute on paid plans and 50 requests/user/minute on free plans, plus endpoint-specific limits. Responses expose `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. This connector retries only read requests on 429/5xx, with a bounded maximum (`CALENDLY_MAX_RETRIES`, default 2) and reset/exponential delay. Writes are never blindly retried. Requests have a configurable timeout (`CALENDLY_TIMEOUT_MS`, default 10000). Pagination uses Calendly `count` and `page_token` and caps count at 100.

Authentication, validation, and permission failures are not retried. OAuth refresh is intentionally delegated to the credential provider/client because refresh-token storage must not be embedded in an agent-facing MCP server.

## Security
Only `https://api.calendly.com/` resource URIs are accepted, preventing caller-controlled SSRF destinations. Secrets are isolated from tool schemas and output. Third-party content is untrusted and must never be interpreted as instructions or permission changes. Writes cannot elevate their own policy; both server configuration and per-call approval are required. No delete, billing, permission, or organization-admin operations are exposed. For hosted MCP, trust only Calendly's official endpoint and its discovered OAuth metadata; do not auto-enable newly discovered tools without review.

## Tests
`npm test` uses mocked fetch only and covers registration count, authentication header isolation, strict validation, write denial, approval, 429 retry, no write retry, and timeout mapping. Live credentials are not required.

## Limitations
This bridge does not implement OAuth browser login, DCR, refresh-token persistence, inbound webhook hosting/signature validation, event-type mutation, invitee creation, contacts, Notetaker, or arbitrary API access. Use Calendly's official hosted MCP when a client supports DCR/PKCE and you want Calendly-managed scheduling coverage. API availability and plan entitlements can vary; consult current Calendly documentation before enabling additional actions.
