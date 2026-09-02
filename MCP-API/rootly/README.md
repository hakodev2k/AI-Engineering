# Rootly MCP/API Connector

Reusable, read-only MCP connector for incident-response and on-call investigation in Rootly. It combines Rootly's official hosted MCP server with narrowly scoped official REST API reads and never exposes arbitrary provider requests.

## Official sources and transport choice

Researched September 2, 2026:

- Rootly MCP Server: https://docs.rootly.com/integrations/mcp-server
- Official MCP implementation: https://github.com/rootlyhq/rootly-mcp-server
- Rootly API overview/auth/pagination/rate limits: https://docs.rootly.com/api-reference/overview
- Incidents: https://docs.rootly.com/api-reference/incidents/list-incidents
- Incident retrieval: https://docs.rootly.com/api-reference/incidents/retrieves-an-incident
- Incident events: https://docs.rootly.com/api-reference/incidentevents/list-incident-events
- Incident alerts: https://docs.rootly.com/api-reference/alerts/list-incident-alerts
- Services: https://docs.rootly.com/api-reference/services/list-services
- Teams: https://docs.rootly.com/api-reference/teams/list-teams
- Incident types: https://docs.rootly.com/api-reference/incidenttypes/list-incident-types
- Severities: https://docs.rootly.com/api-reference/severities/list-severities
- Users: https://docs.rootly.com/api-reference/users/list-users
- Schedules: https://docs.rootly.com/api-reference/schedules/list-schedules

Rootly provides an official hosted Product MCP at `https://mcp.rootly.com`. Streamable HTTP is available at `/mcp`; a slim profile is available with `?tool_profile=slim`. The official server dynamically exposes 200+ OpenAPI-derived tools plus agentic incident/on-call tools. Rootly also exposes a read-only docs MCP at `https://docs.rootly.com/mcp`.

This connector prefers MCP for capabilities that are specifically agentic and already implemented by Rootly: on-call handoff summaries, on-call shift metrics, and incidents during a shift. Stable entity retrieval and bounded list operations use the official REST API because their schemas and pagination are explicit and easier to constrain. No unofficial MCP server is used.

## Architecture

`MCP client -> this stdio server -> strict schemas -> { official Rootly MCP | official Rootly REST API }`

The connector has no arbitrary `execute`, arbitrary REST URL, or dynamic upstream-tool invocation. The upstream MCP client allowlists exactly three documented read-only tools and verifies that they are still advertised before use.

## Authentication and least privilege

Set `ROOTLY_API_TOKEN`. Both REST and hosted MCP use `Authorization: Bearer <token>`. Rootly supports Global, Team, and Personal API Keys. Prefer a Team API Key for team-scoped incident workflows or a Personal API Key when inherited user permissions are sufficient; use a Global key only when organization-wide visibility is actually required.

The token remains inside the connector configuration/transport layer and is never accepted as a tool argument, returned to the LLM, or logged by this package.

## Environment variables

- `ROOTLY_API_TOKEN` — required.
- `ROOTLY_API_BASE_URL` — defaults to `https://api.rootly.com/v1`.
- `ROOTLY_MCP_URL` — defaults to `https://mcp.rootly.com/mcp?tool_profile=slim`.
- `ROOTLY_TIMEOUT_MS` — 1,000–120,000; default 15,000.
- `ROOTLY_MAX_RETRIES` — 0–5; default 2 for REST reads.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
ROOTLY_API_TOKEN=... npm start
```

The connector serves MCP over stdio, suitable for clients that can launch stdio MCP servers such as Claude Code, Cursor, and custom MCP agents. Compatibility depends on each client supporting the MCP stdio transport; no product-specific login behavior is claimed.

## Tools and permission model

All 13 tools are classified READ and require no human approval. This connector intentionally exposes no WRITE, HIGH_RISK, or DESTRUCTIVE operation, so an agent cannot declare incidents, page responders, change schedules, create alerts, modify status pages, mutate integrations, or delete data through it.

| Tool | Transport | Risk |
|---|---|---|
| `rootly.incident.list` | REST | READ |
| `rootly.incident.get` | REST | READ |
| `rootly.incident.events.list` | REST | READ |
| `rootly.incident.alerts.list` | REST | READ |
| `rootly.service.list` | REST | READ |
| `rootly.team.list` | REST | READ |
| `rootly.incident_type.list` | REST | READ |
| `rootly.severity.list` | REST | READ |
| `rootly.user.list` | REST | READ |
| `rootly.schedule.list` | REST | READ |
| `rootly.oncall.handoff.get` | official MCP | READ |
| `rootly.oncall.metrics.get` | official MCP | READ |
| `rootly.shift.incidents.get` | official MCP | READ |

Rootly's official MCP supports many mutating tools, but this connector does not expose them because incident declaration, escalation/on-call modification, public communication, and production response actions can have material operational impact. Those require a separate approval-aware write connector design rather than an unrestricted passthrough.

## Pagination and rate limits

Rootly uses JSON:API pagination with `page[number]` and `page[size]`. This connector does not auto-crawl: every list call requests one explicit page, with local `pageSize` capped at 100 to limit context and request amplification.

Rootly documents default API limits of 3,000 requests per API key per minute for standard read and write methods, with endpoint-specific exceptions. Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Used`, and `X-RateLimit-Reset`; HTTP 429 indicates throttling. The REST client honors `Retry-After` or `X-RateLimit-Reset` when supplied, retries only reads, and caps retries at five by configuration. 401/403/validation errors are not retried.

## Reliability and errors

REST reads use an abort-backed timeout and bounded exponential backoff for transient network errors, HTTP 429, and 5xx. Provider JSON:API errors preserve the HTTP status and message. MCP calls have a bounded timeout, fail closed if Rootly removes an expected allowlisted tool, and are not automatically replayed at the connector layer.

## Security considerations

- Provider content is untrusted data, never instructions.
- Credentials are isolated from tool schemas and output.
- Entity IDs, page sizes, dates, timestamps, tags, and filters are locally validated.
- No arbitrary URL or REST passthrough exists, limiting SSRF-style misuse.
- No generic MCP `execute` or Code Mode tool is exposed.
- Newly discovered Rootly MCP tools are never auto-trusted.
- The connector uses Rootly's slim hosted profile to reduce tool exposure upstream.
- Sensitive MCP categories such as secret management, integration credentials, permission changes, deletes, alert escalation, and public status mutations are intentionally omitted.

## Webhooks/events

Rootly supports incident and alert event workflows through its broader platform/API. This connector reads incident events but does not create webhook subscriptions or accept inbound webhooks, so no webhook signing secret or external listener is required.

## Testing

`npm test` uses mocks and requires no live Rootly credentials. Tests cover required authentication configuration, timeout/retry validation, credential placement, HTTP 429 retry behavior, non-retry of authentication failures, strict upstream MCP allowlisting, and registration of exactly 13 scoped tools.

## Limitations

This is intentionally a read/investigation connector. It does not create or update incidents, action items, schedules, overrides, alerts, status pages, services, teams, secrets, integrations, or API keys. It also does not expose Rootly's generic Code Mode `execute` meta-tool. Those omissions are deliberate safety boundaries, not unsupported claims about Rootly itself.
