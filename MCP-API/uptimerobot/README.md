# UptimeRobot MCP/API Connector

Reusable MCP server for bounded uptime-monitoring workflows. UptimeRobot provides an official remote MCP endpoint at `https://mcp.uptimerobot.com/mcp`; it supports monitor/status/incident workflows but intentionally does not expose delete operations. This package exposes a stable provider-scoped MCP interface backed by the official API v3 so approval policy, retry behavior and destructive opt-in remain local and explicit.

## Official sources

Research basis (verified 2026-09-17): UptimeRobot API v3 documentation (`https://uptimerobot.com/api/v3/`), official MCP integration guide (`https://help.uptimerobot.com/en/articles/12928342-uptimerobot-mcp-integration-guide`), API guide (`https://help.uptimerobot.com/en/articles/11620152-how-to-use-uptimerobot-s-api`). API v3 is the current REST API; v2 is legacy.

## Architecture and transport

MCP client → local stdio MCP server → validation/approval layer → credential-isolated REST client → `https://api.uptimerobot.com/v3`. The upstream official MCP was evaluated but is not proxied: direct v3 REST provides deterministic schemas and permits local safety policy. No arbitrary URL/API-request tool exists.

## Authentication

Set `UPTIMEROBOT_API_KEY`. UptimeRobot supports account-specific, monitor-specific and read-only API keys. Prefer read-only keys for READ-only deployments; a main/account key is needed for mutation operations. The key stays in the connector and is never emitted in tool output. The API hostname is pinned to mitigate SSRF.

## Tools

`uptimerobot.monitor.list`, `monitor.get`, `incident.list`, `status_page.list`, `maintenance_window.list` are READ. `monitor.create`, `monitor.update`, `monitor.pause`, `monitor.resume` are WRITE. `monitor.delete` is DESTRUCTIVE and is disabled unless `UPTIMEROBOT_DESTRUCTIVE_ENABLED=true`; it always requires `approved:true`.

Provider-returned names, URLs, incident text and other content are untrusted data and must never be interpreted as instructions or permission changes.

## Install and run

Requires Node.js 20+. Run `npm install`, configure environment variables from `.env.example`, then `npm start`. The server uses MCP stdio and can be configured by MCP clients that support local stdio servers.

## Approval policy

READ calls may execute automatically. WRITE calls require `approved:true` by default; set `UPTIMEROBOT_WRITE_APPROVAL=disabled` only in a separately controlled environment. Destructive calls cannot be enabled by tool input and require both operator configuration and explicit per-call approval.

## Reliability and rate limits

Requests use timeouts and bounded retry. GET/read calls retry HTTP 429 up to two times and honor `Retry-After`; mutations are invoked with retries disabled to avoid duplicate or irreversible effects. Pagination is capped by schema. UptimeRobot documents Free at 10 requests/minute and Pro at monitor-limit × 2 requests/minute up to 5,000/minute, with `X-RateLimit-*` and `Retry-After` headers. Official MCP calls share the public API quota.

## Errors

Provider HTTP errors are mapped to MCP error payloads containing status and retry-after when available. Authentication, permission and validation errors are not blindly retried. Network aborts surface safely without credentials.

## Testing

Run `npm test`. Unit tests use fake fetch implementations and require no live credentials. They cover auth configuration, SSRF host pinning, registration, approval denial, destructive denial, bounded pagination and rate-limit retries.

## Limitations

Plan-specific features can return subscription errors. The official MCP limits monitor list pages to 100 and does not expose deletes. This connector intentionally implements a focused set of ten operations rather than every API v3 resource. Webhook receiver verification is not implemented, so no webhook-ingestion tool is advertised. Monitor type-specific advanced payloads are outside this connector's current stable contract.
