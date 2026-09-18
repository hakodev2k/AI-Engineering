# Sentry MCP/API Connector

Reusable stdio MCP server backed by Sentry's official Web API v0. No official Sentry MCP server is relied on; direct REST is used for a small, auditable tool surface.

## Official sources
- API: https://docs.sentry.io/api/
- Authentication/OAuth2/PKCE: https://docs.sentry.io/api/auth/
- Permissions: https://docs.sentry.io/api/permissions/
- Rate limits: https://docs.sentry.io/api/ratelimits/

## Runtime and installation
Node.js 20+. Run `npm install`, copy `.env.example` values into your secure environment, then `npm start`. The server speaks MCP over stdio and can be configured in MCP clients that support stdio servers.

## Authentication
Set `SENTRY_AUTH_TOKEN`; the token remains inside the connector and is only sent as `Authorization: Bearer` to the configured Sentry host. Sentry recommends organization auth tokens when possible. For third-party delegated applications Sentry also supports OAuth2 authorization-code flow with PKCE; this package deliberately accepts an already provisioned bearer token rather than storing OAuth client secrets or refresh tokens.

Least-privilege scopes depend on enabled tools: `org:read`, `project:read`, and `event:read` cover the read surface; issue mutation requires an appropriate write scope (normally `project:write`). Validate scopes against each official endpoint for your Sentry deployment.

`SENTRY_BASE_URL` defaults to `https://sentry.io`; set it to a Sentry regional or self-hosted origin. It is operator configuration, never a tool parameter, preventing agent-controlled SSRF.

## Tools
| Tool | Risk | Approval | Purpose |
|---|---|---|---|
| sentry.organization.list | READ | no | organizations |
| sentry.project.list | READ | no | organization projects |
| sentry.issue.list | READ | no | search/list issues |
| sentry.issue.get | READ | no | issue detail |
| sentry.event.list | READ | no | project events |
| sentry.event.get | READ | no | event detail |
| sentry.release.list | READ | no | releases |
| sentry.team.list | READ | no | teams |
| sentry.member.list | READ | no | members |
| sentry.issue.update | WRITE | yes | status/assignment |
| sentry.issue.delete | DESTRUCTIVE | yes + `confirm=DELETE` | delete issue |

Set `SENTRY_APPROVE_WRITES=true` only in an execution context where a human has approved that specific write. Keep it false by default. The connector cannot raise its own permissions.

## Reliability and pagination
GET requests use a configurable timeout (`SENTRY_TIMEOUT_MS`, default 15s) and at most two retries for HTTP 429/5xx with exponential backoff or `Retry-After`. Authentication, authorization, validation, writes and deletes are never blindly retried. List tools accept Sentry cursor values. Sentry publishes `X-Sentry-Rate-Limit-*` response headers and rate limits per caller/endpoint; callers should avoid polling and prefer Sentry webhooks for event-driven integrations.

## Security
Provider content is returned with `untrusted_provider_content=true`: treat issue/event text as data, never agent instructions. Inputs are length constrained and identifiers URL-encoded. Credentials are not returned or logged. Tool discovery is local/static; no untrusted upstream MCP tools are dynamically enabled. Destructive deletion needs both approval and a literal confirmation token.

## Examples
```json
{"tool":"sentry.issue.list","input":{"organization":"acme","query":"is:unresolved level:error"},"permission":"READ","approval":false}
{"tool":"sentry.issue.update","input":{"issueId":"12345","status":"resolved"},"permission":"WRITE","approval":true}
{"tool":"sentry.issue.delete","input":{"issueId":"12345","confirm":"DELETE"},"permission":"DESTRUCTIVE","approval":true}
```
Responses are JSON inside MCP text content: `{ "data": ..., "untrusted_provider_content": true }`.

## Testing
`npm test` uses mocked `fetch`; live credentials are not required. Tests cover missing auth, reads, approval denial/allow, permission errors, bounded throttling retry, and destructive no-retry behavior.

## Limitations
Only the documented tool surface is exposed; there is no arbitrary-request escape hatch. Webhook receiving, OAuth callback hosting, attachments, Seer, alerts, dashboards, project creation, billing and security administration are intentionally not implemented. API v0 endpoints are generally stable but beta endpoints may change; verify scopes and endpoint behavior against current Sentry docs before production rollout.
