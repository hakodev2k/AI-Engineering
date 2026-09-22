# Atlassian Statuspage MCP Connector

Reusable MCP server for the Atlassian Statuspage Manage REST API. It exposes ten scoped tools for reading page/components/incidents and, with explicit policy plus human approval, updating components and publishing/updating/resolving incidents or scheduled maintenance.

## Upstream and official sources

Transport is direct HTTPS REST to `https://api.statuspage.io/v1`; no official Statuspage MCP server was identified during implementation, so this connector does not depend on community MCP servers. Official references: Statuspage API (`https://developer.statuspage.io/`), Atlassian Support API overview (`https://support.atlassian.com/statuspage/docs/what-are-the-different-apis-under-statuspage/`), and API-key guidance (`https://support.atlassian.com/statuspage/docs/create-and-manage-api-keys/`).

Statuspage documents an authenticated Manage API and page-level Status API. This package uses only the Manage API. As of September 2026, Atlassian requires API keys in the Authorization header; query-parameter keys are discontinued. Manage API keys are powerful and Statuspage does not provide read-only API keys, so credential isolation and local permission gating are important.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `statuspage.page.get` | READ | no |
| `statuspage.component.list` | READ | no |
| `statuspage.component.get` | READ | no |
| `statuspage.component.update` | WRITE | yes |
| `statuspage.incident.list` | READ | no |
| `statuspage.incident.get` | READ | no |
| `statuspage.incident.create` | HIGH_RISK | explicit |
| `statuspage.incident.update` | HIGH_RISK | explicit |
| `statuspage.incident.resolve` | HIGH_RISK | explicit |
| `statuspage.maintenance.create` | HIGH_RISK | explicit |

Publishing incident/maintenance content is externally visible and therefore HIGH_RISK. No delete operation is exposed.

## Authentication and configuration

Create an organization API key in Statuspage API info and copy it at creation time. The connector sends it only as `Authorization: OAuth <key>` from its credential layer; the token is never accepted as a tool argument or returned to the model.

Environment variables: `STATUSPAGE_API_KEY` and `STATUSPAGE_PAGE_ID` are required. `STATUSPAGE_ALLOW_WRITES=true` enables the write policy; write/high-risk calls must additionally pass `approved:true`. `STATUSPAGE_TIMEOUT_MS` defaults to 10000.

Statuspage API keys are not scope-granular/read-only. Use a dedicated, expiring key, restrict process/environment access, rotate it, and leave writes disabled unless needed.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
STATUSPAGE_API_KEY=... STATUSPAGE_PAGE_ID=... npm start
```

The server uses MCP stdio and can be launched by MCP clients that support stdio servers. Configure the command/environment in the client; compatibility depends on that client's stdio MCP support.

## Architecture and safety

`auth.ts` loads credentials/configuration; `client.ts` owns HTTPS, timeout, error mapping and bounded retry; `security.ts` enforces risk policy; `tools.ts` validates scoped operations; `server.ts` exposes MCP tools. Provider text is returned with `untrustedProviderContent:true` and must never be interpreted as instructions or permission changes. There is no arbitrary URL/request tool, which avoids an SSRF escape hatch. Identifiers are validated and the API base is fixed.

## Rate limits and reliability

Official API documentation states one request/second measured over a 60-second rolling window and documents HTTP 420/429 for throttling; Atlassian's support overview describes the Manage API as 60 requests/minute. The client honors `Retry-After` when present and retries GET requests only, at most twice, with exponential backoff. It also retries transient 5xx GET failures. Mutations are never blindly retried. Requests have an AbortController timeout. List incidents supports bounded pagination (`perPage` 1–100).

401/403 errors are surfaced without retry so operators can correct credentials/permissions. Validation and approval failures occur before network access.

## Testing

`npm test` uses Vitest and mocked `fetch`; no live credentials are needed. Tests cover missing authentication, tool registration, permission denial, explicit approval, successful reads, rate-limit retry, and maintenance validation.

## Limitations

This connector intentionally omits destructive deletion, subscribers/team-member management, metrics, and generic endpoint execution. It does not implement OAuth because Statuspage's Manage API authentication documented for this integration is API-key based. It does not expose the separate page-level Status API. API-key privileges are controlled by Statuspage account/organization roles rather than fine-grained API scopes.
