# Pirsch Analytics MCP Connector

Reusable MCP server for privacy-friendly Pirsch Analytics workflows. It exposes scoped tools rather than arbitrary HTTP requests.

## Upstream strategy

Pirsch documents a community-maintained MCP server (`@charpeni/pirsch-mcp`) that is explicitly unofficial and read-only. This connector therefore does **not** trust it as an upstream dependency. It uses Pirsch's official REST API v1 directly, preserving one stable MCP interface for callers. Pirsch states API v1 remains available while API v2 is being introduced.

Official references: `https://docs.pirsch.io/integrations/mcp`, `https://docs.pirsch.io/api-sdks/api-guide-v1`, `https://docs.pirsch.io/api-sdks/sdks`, and `https://docs.pirsch.io/get-started/backend-integration`.

## Capabilities

READ: `pirsch.domain.list`, `pirsch.statistics.visitors`, `pirsch.statistics.pages`, `pirsch.statistics.referrers`, `pirsch.statistics.events`, `pirsch.statistics.countries`, `pirsch.statistics.devices`.

WRITE: `pirsch.traffic.page_view.track`, `pirsch.traffic.event.track`. Writes require `approved:true` unless `PIRSCH_REQUIRE_WRITE_APPROVAL=false` is deliberately configured. No destructive or administrative tools are exposed.

## Authentication and least privilege

Statistics require a Pirsch OAuth client ID/secret. The connector exchanges these inside the auth/client layer for a bearer token and never returns credentials to MCP callers. Create a read-capable client with only the permissions needed. Tracking may use `PIRSCH_ACCESS_KEY` (write-only `pa_...`) or the OAuth client. Secrets belong in environment/secret storage, never prompts or source control.

## Rate limits and reliability

Pirsch documents 10 requests/minute for security endpoints, 60/minute for non-security configuration endpoints, and currently no limit for statistics/data collection endpoints. Responses may include `X-RateLimit-*` and `Retry-After`. The client preserves `Retry-After` on errors and uses bounded retries only for 429/5xx responses. Authentication, validation, and permission errors are not blindly retried. Requests use a configurable timeout and AbortSignal.

## Install and run

Requires Node.js 20+.

```sh
npm install
npm run build
npm start
```

The server uses MCP stdio and is usable by MCP clients that support launching local stdio servers. Configure the client to run `node /absolute/path/to/MCP-API/pirsch/dist/src/server.js` with the required environment variables.

## Environment

See `.env.example`. `PIRSCH_API_BASE_URL` defaults to the official HTTPS API and should not be changed to an untrusted host. `PIRSCH_TIMEOUT_MS` defaults to 15000. Keep write approval enabled for agent-facing deployments.

## Security

Credentials are isolated from model inputs/outputs. Schemas reject unknown or malformed fields at the handler boundary. There is no arbitrary URL/request tool. Retrieved analytics and provider errors are untrusted content, not executable instructions. Write tools are approval-gated. The connector exposes no deletion, billing, permission, dashboard-configuration, or security-management operations. Logs should never include authorization headers or secrets.

Tracking inputs can contain personal/network data such as IP addresses and user agents; callers remain responsible for applicable privacy requirements. The connector forwards only fields explicitly provided to the scoped tracking tool.

## Error handling

Provider non-success responses become `PirschError` with status and optional retry-after metadata. 401 requires correcting/refreshing credentials; 403 requires correcting permissions; validation failures are rejected before network calls. 429 and transient 5xx failures receive bounded exponential backoff.

## Testing

```sh
npm test
```

Tests use mocked fetch and require no live credentials. They cover registration, validation, approval denial, auth/read behavior, invalid credentials, and bounded throttling retry.

## Limitations

The connector intentionally omits account administration, dashboard mutation, permission changes, deletion, email reports, funnels/configuration mutation, and arbitrary provider requests. The community MCP integration is documented for comparison but is not executed. API v2 is not used until its required capability coverage is equivalent and stable for this connector.
