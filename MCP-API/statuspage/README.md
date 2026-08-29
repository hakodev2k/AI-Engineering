# Atlassian Statuspage MCP/API Connector

Reusable MCP stdio connector for Atlassian Statuspage incident and component workflows. It exposes a small, stable tool surface over the official Statuspage Manage REST API instead of exposing arbitrary HTTP requests.

## Official transport research
Research date: 2026-08-30.

- Statuspage REST API: https://developer.statuspage.io/
- Statuspage API overview and API-key guidance: https://support.atlassian.com/statuspage/docs/what-are-the-different-apis-under-statuspage/
- Atlassian Rovo MCP: https://developer.atlassian.com/cloud/rovo-mcp/guides/getting-started/

Atlassian provides an official Rovo MCP server for supported Atlassian product tools, but current official Statuspage developer documentation exposes Statuspage through its REST API and does not document Statuspage-specific MCP tools. This connector therefore uses the official REST API for all implemented capabilities.

## Authentication and permissions
Set `STATUSPAGE_API_TOKEN` to a token generated from the Statuspage management interface. The Manage API authenticates with `Authorization: OAuth <token>`. Statuspage documents these organization-level API keys as full read/write keys and does not provide a read-only API key, so the connector narrows effective capability at the tool layer.

Credentials never appear in tool arguments, tool results, logs produced by this package, or agent prompts. Use a dedicated service account where possible and protect the environment containing the token.

## Capabilities
| Tool | Method | Risk | Approval |
|---|---:|---|---|
| `statuspage.page.get` | GET page | READ | no |
| `statuspage.component.list` | GET components | READ | no |
| `statuspage.component.get` | GET component | READ | no |
| `statuspage.component.update` | PUT component | WRITE | yes |
| `statuspage.incident.list` | GET incidents | READ | no |
| `statuspage.incident.get` | GET incident | READ | no |
| `statuspage.incident.create` | POST incident | HIGH_RISK | yes |
| `statuspage.incident.update` | PATCH incident | HIGH_RISK | yes |
| `statuspage.incident.delete` | DELETE incident | DESTRUCTIVE | yes + disabled by default |

Creating or updating incidents is HIGH_RISK because Statuspage can publish customer-visible content and send notifications. Deletion is disabled unless `STATUSPAGE_ENABLE_DESTRUCTIVE=true` is set before the process starts.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run check
npm test
npm start
```

The server uses MCP stdio transport and can be configured by any MCP client that supports local stdio servers.

## Environment variables
- `STATUSPAGE_API_TOKEN` — required Statuspage Manage API token.
- `STATUSPAGE_API_URL` — defaults to `https://api.statuspage.io/v1`; HTTPS only.
- `STATUSPAGE_TIMEOUT_MS` — default 15000, bounded to 1–120 seconds.
- `STATUSPAGE_MAX_RETRIES` — default 3, maximum 5.
- `STATUSPAGE_APPROVAL_SECRET` — secret used by the external approval service/operator to create payload-bound HMAC approvals.
- `STATUSPAGE_ENABLE_DESTRUCTIVE` — defaults to false.

## Approval behavior
READ tools execute without approval. WRITE/HIGH_RISK/DESTRUCTIVE tools require `approval_token`, an HMAC-SHA256 of the exact tool name and canonicalized request payload, excluding the approval token itself. Any change to page, component, incident, notification setting, or message invalidates the approval. Destructive execution also requires the environment gate.

## Validation
Tool schemas reject unknown top-level parameters, bound identifiers and pagination, constrain documented Statuspage component/incident statuses, cap text and arrays, and do not accept provider URLs or credentials. There is no `raw_request` or arbitrary endpoint tool.

## Rate limits and reliability
Statuspage documents the Manage API limit as one request per second per token over a rolling 60-second window (60 requests/minute). The client handles both documented 420 and 429 throttling responses and honors integer `Retry-After` headers. Safe GET requests use bounded exponential backoff for 420/429/502/503/504. Mutating calls are not blindly retried because duplicate incident publication or repeated state transitions can have external effects. Requests use local timeouts and MCP cancellation signals.

## Error handling
Provider HTTP errors become structured MCP errors containing HTTP status, retryability, and `Retry-After` when present. Authentication and validation failures are not retried. Provider-returned data is marked `untrusted_provider_data`; token/secret/password/credential/API-key-shaped response fields are redacted.

## Security considerations
- Treat all Statuspage content as untrusted data, not instructions.
- Statuspage Manage API keys are broad; tool-level policy is the effective least-privilege boundary.
- Public incident publication and notification-producing actions always require explicit approval.
- Incident deletion is disabled by default.
- HTTPS is mandatory for the configured API base URL.
- The connector cannot change its own approval or destructive settings through MCP.
- Subscriber management is intentionally omitted to reduce exposure of customer email/phone data.
- User/permission administration is intentionally omitted; Statuspage notes user-management endpoints are being deprecated as accounts migrate to Atlassian accounts.

## Tests
Unit tests use mocked `fetch` and require no live credentials. They cover tool registration, configuration, approval binding, destructive denial, sanitization, authentication headers, encoded paths, authentication errors, rate limiting, and no blind retry of mutations.

## Limitations
The connector intentionally does not expose subscriber CRUD, account/user administration, page deletion, component deletion, metrics mutation, arbitrary API calls, or undocumented Atlassian MCP capabilities. Statuspage API access and some notification features vary by plan.
