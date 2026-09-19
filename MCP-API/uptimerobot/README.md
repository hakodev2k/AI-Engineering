# UptimeRobot MCP connector

Reusable local MCP stdio server for UptimeRobot monitoring workflows. UptimeRobot has an official remote MCP server at `https://mcp.uptimerobot.com/mcp` and an official REST API v3. This package deliberately uses API v3 behind a stable, narrowly scoped MCP interface because it includes a guarded delete capability that the official MCP intentionally does not expose, while keeping the same agent-facing contract. The official MCP remains the preferred upstream for interactive non-destructive use.

## Official sources

- MCP guide: https://help.uptimerobot.com/en/articles/12928342-uptimerobot-mcp-integration-guide
- API v3: https://uptimerobot.com/api/v3/
- API overview: https://uptimerobot.com/api/
- Official CLI / API safety patterns: https://uptimerobot.com/cli/

Official documentation states that MCP uses the same API quota, monitor lists are paginated at 100/page, and delete operations are not exposed through MCP. API v3 supports monitor create/update/delete plus status pages and maintenance windows. Current published limits are 10 requests/minute on Free and `monitor limit * 2`, capped at 5,000/minute, on Pro; `X-RateLimit-*` and `Retry-After` headers are returned.

## Architecture

MCP client -> this stdio server -> strict validation/approval policy -> UptimeRobot API v3. Credentials remain in the process environment and are never MCP arguments or outputs. Provider responses are explicitly marked as untrusted data.

## Authentication and least privilege

Set `UPTIMEROBOT_API_KEY`. Use a read-only API key for read-only deployments. Creating, updating, pausing, starting, or deleting requires a Main API key. UptimeRobot API keys do not use OAuth scopes; the key type defines privilege, so no fictional scopes are documented. API v3 uses bearer authentication. Never place the key in prompts or repository files.

## Install and run

Requires Node.js 20+.

```sh
npm install
npm run build
UPTIMEROBOT_API_KEY='...' npm start
```

Any MCP client capable of stdio can launch `node dist/src/server.js`. Compatibility depends on the client supporting standard MCP stdio transport.

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `uptimerobot.monitor.list` | API v3 | READ | no |
| `uptimerobot.monitor.get` | API v3 | READ | no |
| `uptimerobot.monitor.create` | API v3 | WRITE | required by default |
| `uptimerobot.monitor.update` | API v3 | WRITE | required by default |
| `uptimerobot.monitor.pause` | API v3 | WRITE | required by default |
| `uptimerobot.monitor.start` | API v3 | WRITE | required by default |
| `uptimerobot.monitor.delete` | API v3 | DESTRUCTIVE | explicit + feature enabled |
| `uptimerobot.incident.list` | API v3 | READ | no |
| `uptimerobot.status-page.list` | API v3 | READ | no |
| `uptimerobot.maintenance-window.list` | API v3 | READ | no |

The official remote MCP can cover many non-destructive monitor, incident, status-page, maintenance-window, group, and comment workflows. This implementation does not proxy arbitrary upstream MCP tools: that prevents dynamic tool expansion and unexpected permissions. It uses API v3 for the selected stable surface and the API-only delete gap.

## Configuration and approval

`UPTIMEROBOT_WRITE_APPROVAL=required` is the default. Setting it to `optional` permits ordinary WRITE tools without per-call `approved:true`. Destructive deletion is always separately gated: `UPTIMEROBOT_DESTRUCTIVE_ENABLED=true` plus `approved:true` are both required. Tool calls cannot change policy.

`UPTIMEROBOT_API_BASE_URL` defaults to the official HTTPS v3 endpoint and rejects non-HTTPS configuration. `UPTIMEROBOT_TIMEOUT_MS` defaults to 15000.

## Reliability

GET/HEAD operations use at most three attempts with bounded exponential backoff for network/5xx/throttling failures. Mutations are never automatically retried, avoiding duplicate side effects. Authentication, permission and validation failures are not retried. HTTP 429 preserves `Retry-After`. List tools expose bounded cursor/limit inputs instead of silently traversing all pages. Requests are cancellable internally through timeout-backed `AbortController`.

Provider failures map to stable `AUTHENTICATION`, `PERMISSION`, `VALIDATION`, `RATE_LIMIT`, `TIMEOUT`, `NETWORK`, or `PROVIDER_ERROR` classes. Error text does not include the API key.

## Security

There is no arbitrary HTTP/request tool. Provider paths are fixed by handlers and reject traversal/absolute URLs. Monitor targets accept only HTTP(S) URLs. Inputs use strict schemas and bounded lengths. Retrieved monitor names, URLs, incident text and other provider content are untrusted data, never instructions. The connector never discovers tools dynamically, changes its permissions from provider content, logs credentials, or forwards credentials to MCP clients. Destructive actions require two independent gates.

## Tests

`npm test` runs credential-free unit tests with mocked fetch. Coverage includes auth configuration, HTTPS enforcement, tool registration, strict ID validation, read behavior, approval and destructive gates, authentication mapping, rate-limit metadata, and mutation no-retry behavior.

## Example workflow

1. Call `uptimerobot.monitor.list` with `{ "limit": 50 }` (READ, no approval).
2. Call `uptimerobot.monitor.get` with a returned numeric ID (READ).
3. Prepare an HTTP monitor and call `uptimerobot.monitor.create` with `friendlyName`, HTTP(S) `url`, `interval`, and `approved:true` (WRITE).
4. Pause/start it only with WRITE approval.
5. Deletion requires both administrator configuration and explicit call approval.

Outputs are JSON envelopes containing `ok`, provider `data`, and `untrustedProviderContent:true`.

## Limitations

This connector intentionally implements ten common workflows rather than UptimeRobot's entire API. It does not expose alert-contact mutation, integrations, incident comments, monitor groups, tags, billing, raw requests, or public-content publishing. Some provider resources depend on subscription plan. Status-page image uploads are not supported by official MCP. The official MCP's non-destructive feature breadth may exceed this connector; use it directly when those additional trusted capabilities are needed.
