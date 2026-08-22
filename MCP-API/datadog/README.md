# Datadog MCP/API Connector

Reusable MCP server for Datadog observability workflows. It exposes a stable provider-scoped MCP tool contract for monitors, dashboards, incidents, metrics, and events while keeping Datadog credentials inside the connector process.

## Transport strategy

Datadog provides an official managed MCP Server for AI clients. Current Datadog documentation describes remote HTTP transport, OAuth authentication, product toolsets, `omit_tools`, and the `mcp_read` / `mcp_write` permissions in addition to the underlying product permissions. Site-specific endpoints are documented by Datadog; US1 examples use `https://mcp.datadoghq.com/v1/mcp`.

This connector intentionally uses Datadog's official REST API for its implemented operations rather than dynamically proxying the managed MCP Server. The selected REST endpoints have explicit typed contracts, predictable mutation behavior, and straightforward permission mapping. This prevents newly introduced upstream MCP tools from silently expanding the connector's effective capability surface.

Official sources researched:

- Datadog MCP Server: https://docs.datadoghq.com/mcp_server/
- MCP setup and permissions: https://docs.datadoghq.com/mcp_server/setup/
- MCP tools: https://docs.datadoghq.com/mcp_server/tools/
- API authentication: https://docs.datadoghq.com/api/latest/authentication/
- API/application keys: https://docs.datadoghq.com/account_management/api-app-keys/
- API scopes: https://docs.datadoghq.com/api/latest/scopes/
- API rate limits: https://docs.datadoghq.com/api/latest/rate-limits/
- Monitors API: https://docs.datadoghq.com/api/latest/monitors/
- Dashboards API: https://docs.datadoghq.com/api/latest/dashboards/
- Incidents API: https://docs.datadoghq.com/api/latest/incidents/
- Metrics API: https://docs.datadoghq.com/api/latest/metrics/
- Events API: https://docs.datadoghq.com/api/latest/events/

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- MCP stdio transport
- Native `fetch` for Datadog REST calls

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

Development mode:

```bash
npm run dev
```

## Authentication

The REST client requires:

```text
DATADOG_API_KEY=
DATADOG_APPLICATION_KEY=
```

The connector sends them only as Datadog provider headers:

```text
DD-API-KEY
DD-APPLICATION-KEY
```

The model never receives raw credentials through tool schemas or results. Use a dedicated service account/application key where possible and scope it to the minimum required permissions. Datadog supports multiple regional sites; override the API origin with `DATADOG_API_BASE_URL`, for example `https://api.datadoghq.eu`.

Datadog's official MCP Server normally uses OAuth. For direct use of that server, users also need `mcp_read` or `mcp_write` plus the relevant underlying resource permissions. This connector does not implement that OAuth flow because its selected capabilities use the REST API.

## Least-privilege permissions

| Capability | Datadog permission/scope |
|---|---|
| Monitor reads | `monitors_read` |
| Monitor create/update/delete | `monitors_write` |
| Dashboard reads | `dashboards_read` |
| Incident reads | `incident_read` |
| Timeseries queries | `timeseries_query` |
| Event reads | Event Management read access for the application-key principal |

Do not grant write scopes if only read tools are required.

## Environment variables

See `.env.example`.

- `DATADOG_API_KEY`: required secret.
- `DATADOG_APPLICATION_KEY`: required secret.
- `DATADOG_API_BASE_URL`: defaults to `https://api.datadoghq.com`.
- `DATADOG_TIMEOUT_MS`: request timeout, default 15000 ms, constrained to 1-60 seconds.
- `DATADOG_APPROVAL_MODE`: `required` by default; `disabled` is intended only when an external policy layer provides equivalent approval.
- `DATADOG_APPROVED_ACTIONS`: comma-separated operator-approved mutation names.
- `DATADOG_ALLOW_DESTRUCTIVE`: `false` by default; must be explicitly enabled in addition to action approval for destructive operations.

Approval is external configuration, not a tool-call parameter, so an agent cannot self-approve.

## Implemented MCP tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `datadog.auth.validate` | REST `GET /api/v1/validate` | READ | No |
| `datadog.monitor.list` | REST `GET /api/v1/monitor` | READ | No |
| `datadog.monitor.get` | REST `GET /api/v1/monitor/{id}` | READ | No |
| `datadog.monitor.create` | REST `POST /api/v1/monitor` | WRITE | Required by default |
| `datadog.monitor.update` | REST `PUT /api/v1/monitor/{id}` | WRITE | Required by default |
| `datadog.monitor.delete` | REST `DELETE /api/v1/monitor/{id}` | DESTRUCTIVE | Required and disabled by default |
| `datadog.dashboard.list` | REST `GET /api/v1/dashboard` | READ | No |
| `datadog.dashboard.get` | REST `GET /api/v1/dashboard/{id}` | READ | No |
| `datadog.incident.list` | REST `GET /api/v2/incidents` | READ | No |
| `datadog.incident.get` | REST `GET /api/v2/incidents/{id}` | READ | No |
| `datadog.metric.query` | REST `GET /api/v1/query` | READ | No |
| `datadog.event.list` | REST `GET /api/v2/events` | READ | No |

The connector exposes a deliberately typed subset of monitor creation/update options. It does not provide a generic endpoint executor or unrestricted JSON/URL escape hatch.

## Architecture

```text
MCP client
  -> src/server.ts        typed tools + Zod validation
     -> src/config.ts     credentials + approval policy
     -> src/client.ts     HTTP, timeout, retry, error mapping
        -> Datadog REST API
```

Provider-returned data is treated as untrusted content and cannot alter tool permissions, credentials, or approval state.

## Permission and approval model

Default behavior:

```text
READ        -> automatic
WRITE       -> external operator approval by default
HIGH_RISK   -> explicit operator approval
DESTRUCTIVE -> explicit approval + DATADOG_ALLOW_DESTRUCTIVE=true
```

Example monitor creation approval:

```text
DATADOG_APPROVED_ACTIONS=datadog.monitor.create
```

Monitor deletion additionally requires:

```text
DATADOG_APPROVED_ACTIONS=datadog.monitor.delete
DATADOG_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals after the intended maintenance window.

## Reliability and rate limits

Datadog applies endpoint-specific API rate limits. Rate-limited responses use HTTP 429 and may include `X-RateLimit-Limit`, `X-RateLimit-Period`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `X-RateLimit-Name`.

The connector:

- applies a bounded timeout to every request;
- retries read-only GET requests at most three total attempts;
- uses bounded exponential backoff for transient read network failures;
- honors `X-RateLimit-Reset` or `Retry-After` for read throttling, capped to 10 seconds per wait;
- never blindly retries POST, PUT, PATCH, or DELETE operations;
- exposes bounded pagination parameters;
- limits each metric query to a maximum 31-day window.

Authentication, permission, validation, and ordinary provider errors are not retried.

## Error handling

Expected categories include:

- configuration validation failures for missing credentials;
- `APPROVAL_REQUIRED` for writes without external approval;
- `DESTRUCTIVE_DISABLED` for deletion when destructive actions remain disabled;
- `VALIDATION_ERROR` for invalid bounded query inputs;
- `NETWORK_OR_TIMEOUT` after exhausted transient read attempts;
- `DatadogApiError` for provider HTTP/API failures.

Credentials are not intentionally included in errors or logs.

## Security considerations

- No arbitrary request/URL execution tool.
- Fixed provider origin comes from connector configuration, never tool input.
- API and application keys remain inside the connector process.
- Strict input validation and bounded strings, arrays, pagination, IDs, and time windows.
- Write approval cannot be supplied by the model as a tool argument.
- Destructive monitor deletion is disabled by default.
- Mutations are not automatically retried.
- Datadog monitor messages, event content, dashboard text, incident text, tags, and API errors are treated as untrusted data.
- The connector never creates or widens Datadog roles, application-key scopes, permissions, billing access, or security settings.
- Upstream MCP tool discovery is not automatically trusted or forwarded.

## Tests

Unit tests require no live Datadog credentials and cover:

- authentication configuration;
- approved/denied writes;
- destructive-operation default denial;
- correct credential headers;
- provider authorization errors;
- no mutation retries;
- bounded HTTP 429 retry for reads;
- intended MCP tool registration;
- absence of generic unrestricted API execution.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for example inputs, permissions, and approval requirements.

A built stdio MCP server can be configured in clients that support launching local MCP processes:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/datadog/dist/src/server.js"],
  "env": {
    "DATADOG_API_KEY": "provided-by-secret-manager",
    "DATADOG_APPLICATION_KEY": "provided-by-secret-manager"
  }
}
```

Do not check real credentials into client configuration.

## Limitations

- This is not a complete Datadog API wrapper.
- The official managed Datadog MCP Server is researched and documented but is not proxied by this package.
- Interactive Datadog MCP OAuth is not implemented in this REST-backed connector.
- Dashboard mutations are intentionally omitted.
- Incident mutations are intentionally omitted.
- User/role administration, key management, integrations, billing, security settings, and other high-risk administrative operations are intentionally omitted.
- Events are read-only.
- Specialized monitor types/options beyond the typed schema require an explicit future tool/schema extension rather than raw provider requests.
