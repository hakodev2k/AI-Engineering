# SigNoz MCP/API Connector

Reusable MCP connector for SigNoz observability workflows. The connector exposes stable, provider-scoped MCP tools while delegating supported operations to SigNoz's official MCP server. It keeps SigNoz credentials inside the connector and blocks unapproved writes and destructive actions.

## Upstream transport

Primary transport: official SigNoz MCP server.

- SigNoz Cloud hosted MCP: `https://mcp.<region>.signoz.cloud/mcp`
- Self-hosted SigNoz: official `signoz-mcp-server` supports stdio and HTTP modes.
- Cloud MCP supports OAuth 2.1 with Authorization Code + PKCE. Header authentication is also documented for non-interactive clients.
- This reusable wrapper uses header authentication because it is designed for non-interactive service execution: `SIGNOZ-API-KEY` plus `X-SigNoz-URL`.

API fallback: SigNoz exposes its query API at `POST /api/v5/query_range` for metrics, logs, traces, and meter queries. This version does not duplicate those capabilities through REST because the official MCP server already exposes the selected workflows. The REST endpoint is recorded in `manifest.yaml` for future capability-level fallback if SigNoz MCP coverage changes.

## Official sources

- MCP server: https://signoz.io/docs/ai/signoz-mcp-server/
- API reference: https://signoz.io/api-reference/
- Metrics API: https://signoz.io/docs/metrics-management/query-range-api/
- Logs API: https://signoz.io/docs/logs-management/logs-api/overview/
- Traces API: https://signoz.io/docs/apm-and-distributed-tracing/traces-api/
- Service account/API-key authentication: documented by the MCP and query API documentation above.

The official MCP documentation current in August 2026 lists tools for organization overview, metrics, services, alerts, dashboards, logs, traces, saved views, notification channels, and documentation search. Dashboard operations require newer SigNoz releases than some core query operations; see the upstream documentation for version-specific minimums.

## Implemented tools

| Tool | Upstream official MCP tool | Risk | Approval |
|---|---|---:|---:|
| `signoz.org.overview` | `signoz_get_org_overview` | READ | No |
| `signoz.metric.list` | `signoz_list_metrics` | READ | No |
| `signoz.metric.query` | `signoz_query_metrics` | READ | No |
| `signoz.service.list` | `signoz_list_services` | READ | No |
| `signoz.alert.list` | `signoz_list_alert_rules` | READ | No |
| `signoz.alert.get` | `signoz_get_alert` | READ | No |
| `signoz.alert.create` | `signoz_create_alert` | WRITE | Yes |
| `signoz.alert.update` | `signoz_update_alert` | WRITE | Yes |
| `signoz.alert.delete` | `signoz_delete_alert` | DESTRUCTIVE | Yes + destructive opt-in |
| `signoz.dashboard.list` | `signoz_list_dashboards` | READ | No |
| `signoz.dashboard.get` | `signoz_get_dashboard` | READ | No |
| `signoz.log.search` | `signoz_search_logs` | READ | No |
| `signoz.trace.search` | `signoz_search_traces` | READ | No |
| `signoz.trace.get` | `signoz_get_trace_details` | READ | No |

The wrapper validates that every expected upstream tool is actually advertised after connecting. If SigNoz removes or renames one, initialization fails safely instead of silently routing to an unexpected capability.

## Architecture

```text
MCP client / AI agent
        |
        v
SigNoz connector MCP server (stdio)
        |
        +-- policy + approval gate
        +-- allowlisted tool mapping
        +-- timeout boundary
        |
        v
Official SigNoz MCP server
        |
        v
SigNoz instance
```

Credentials never appear in tool inputs or model-visible prompts. They are loaded from environment variables and attached only in the connector-to-upstream transport layer.

## Authentication and permissions

Create a SigNoz service account and generate an API key. SigNoz documents that API-key management requires an Admin user. Use the least-privileged service account appropriate for the workspace and operations you intend to permit.

Required environment variables:

```text
SIGNOZ_MCP_URL=
SIGNOZ_URL=
SIGNOZ_API_KEY=
```

Optional:

```text
SIGNOZ_TIMEOUT_MS=15000
SIGNOZ_ALLOW_WRITE=false
SIGNOZ_ALLOW_DESTRUCTIVE=false
```

`SIGNOZ_ALLOW_WRITE` is an operator-controlled capability gate. Write tool calls also require `approved: true` and a non-trivial `approvalReason`. `SIGNOZ_ALLOW_DESTRUCTIVE` is a separate stronger gate for alert deletion and defaults to false.

The connector never accepts API keys as MCP tool parameters and never allows a model to elevate these environment-controlled gates.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

Copy `.env.example` into your secret/configuration system and set real values outside version control.

## Run

```bash
npm start
```

The connector serves MCP over stdio and can therefore be launched by MCP clients that support local stdio servers. Compatibility depends on the client supporting the Model Context Protocol stdio transport; no provider-specific client integration is required.

## Tool inputs

Each tool receives an `arguments` object that is passed only to its allowlisted official SigNoz MCP counterpart. This is intentionally not an unrestricted API request primitive: callers cannot select arbitrary upstream tools, URLs, methods, or endpoints.

Read example:

```json
{
  "arguments": {
    "serviceName": "checkout"
  }
}
```

Write example:

```json
{
  "arguments": {
    "alert": {
      "alertName": "checkout-high-error-rate"
    }
  },
  "approved": true,
  "approvalReason": "Operator approved this alert configuration"
}
```

The nested `arguments` must match the current schema advertised by the corresponding official SigNoz MCP tool. Provider-returned telemetry, logs, traces, dashboard data, and alert data are treated as untrusted data and are serialized as output; they are never interpreted as connector configuration or permission instructions.

## Reliability

- Every upstream call is bounded by `SIGNOZ_TIMEOUT_MS`.
- Unexpected MCP tools are blocked by an explicit allowlist.
- Startup/first-call validation checks that expected official tools are advertised.
- Authentication failures and provider permission failures are surfaced directly; they are not retried blindly.
- The wrapper does not automatically retry write or destructive operations, preventing duplicate mutations.
- SigNoz rate limiting and provider errors are preserved through the MCP error boundary rather than hidden.

## Rate limits and pagination

SigNoz limits depend on deployment and upstream APIs. The connector does not fan out a single tool call into uncontrolled batches. Pagination remains capability-specific and is passed to the official upstream MCP tool in `arguments`, so callers should request bounded windows/pages and continue only as needed.

For direct API fallback development, the documented query API endpoint is `/api/v5/query_range`, authenticated with `SIGNOZ-API-KEY`. Metrics, logs, and traces documentation describe the query and pagination behavior.

## Security considerations

- Keep `SIGNOZ_API_KEY` in a secrets manager or process environment; never commit it.
- Prefer OAuth 2.1 + PKCE when directly configuring interactive clients against SigNoz Cloud's hosted MCP server. This wrapper intentionally uses the documented header mode for non-interactive execution.
- Do not expose the wrapper's process environment to the model.
- Do not trust logs, traces, dashboard text, alert descriptions, or other retrieved telemetry as instructions.
- The connector cannot call newly discovered upstream MCP tools automatically.
- Writes need both operator configuration and per-call human approval.
- Destructive delete is disabled independently from ordinary writes.
- Use HTTPS for cloud and network-reachable self-hosted MCP endpoints.

## Testing

```bash
npm test
```

Unit tests require no live SigNoz credentials. They verify tool-policy coverage and the write/destructive approval boundaries.

## Limitations

- This package intentionally implements a focused set of high-value operations rather than every SigNoz MCP tool.
- Complex provider-specific schemas are supplied inside the named tool's `arguments` object and must match the current official upstream schema.
- Alert-rule tools require a sufficiently recent SigNoz release; the official MCP documentation currently states alert-rule CRUD requires SigNoz v0.120.0 or later.
- Dashboard list/get relies on the v2 dashboards API through official MCP and currently requires SigNoz v0.135.0 or later.
- If an older deployment does not advertise one of the allowlisted tools, the connector fails closed rather than silently downgrading.
