# AppSignal MCP Connector

Reusable MCP wrapper for AppSignal observability data. It exposes a small, stable, provider-scoped tool surface and delegates only to AppSignal's official MCP server.

## Transport strategy

AppSignal currently provides an official MCP server in preview. The recommended hosted endpoint is `https://appsignal.com/api/mcp`; AppSignal also maintains the `appsignal/appsignal-mcp` proxy implementation. This connector therefore uses official MCP rather than an unofficial REST shim.

Official sources researched for this connector:

- https://docs.appsignal.com/mcp
- https://github.com/appsignal/appsignal-mcp
- https://www.appsignal.com/changelog/tools
- https://blog.appsignal.com/2026/04/15/appsignal-mcp-server-performance-logs-and-more.html
- https://blog.appsignal.com/2026/07/29/appsignal-mcp-server-get-started-in-your-ide.html

As of September 2026, AppSignal documents MCP access across error incidents, performance, anomaly detection, logging, metrics, dashboards, and app discovery. The official documentation also explicitly documents `get_app_resources`, `get_log_lines`, `get_metric_names`, `get_metric_tags`, `get_metrics_timeseries`, and `get_metrics_list`, which are the only upstream tools allowlisted by this connector.

## Supported capabilities

The connector exposes 12 stable tools:

| Tool | Purpose | Upstream MCP tool | Risk | Approval |
|---|---|---|---|---|
| `appsignal.app.resources` | Read scoped app resources | `get_app_resources` | READ | No |
| `appsignal.logging.search` | Search log lines | `get_log_lines` | READ | No |
| `appsignal.metric.names` | Discover metric names | `get_metric_names` | READ | No |
| `appsignal.metric.tags` | Discover metric tags | `get_metric_tags` | READ | No |
| `appsignal.metric.timeseries` | Query metric time series | `get_metrics_timeseries` | READ | No |
| `appsignal.metric.aggregate` | Query aggregated metric values | `get_metrics_list` | READ | No |
| `appsignal.uptime.errors` | Query uptime error counts | `get_metrics_timeseries` | READ | No |
| `appsignal.uptime.duration` | Query uptime duration | `get_metrics_timeseries` | READ | No |
| `appsignal.deploy.list` | Read deploy markers | `get_app_resources` | READ | No |
| `appsignal.user.list` | Read users visible to the token | `get_app_resources` | READ | No |
| `appsignal.notifier.list` | Read notifier configuration | `get_app_resources` | READ | No |
| `appsignal.log_source.list` | Read log sources | `get_app_resources` | READ | No |

AppSignal documents uptime-monitor results as metrics (`uptime_monitor_error_count` and `uptime_monitor_duration`), so the connector uses metric tools instead of inventing unsupported uptime-monitor CRUD operations.

## Deliberately unsupported operations

This connector does not expose generic upstream tool execution, notifier/user administration, deploy-marker mutation, account administration, billing, deletion, or arbitrary API requests. AppSignal's documentation explicitly recommends keeping owner-level notifier/user/deploy-marker management in the UI. Write-capable AppSignal MCP areas are not surfaced in this version because the selected reusable workflows are observability and investigation workflows; adding writes requires an explicit stable contract and approval policy rather than exposing raw upstream tools.

## Architecture

```text
MCP client
  -> local AppSignal connector (stdio)
     -> strict Zod validation
     -> risk/approval policy
     -> official-tool allowlist
     -> AppSignal MCP client transport
        -> https://appsignal.com/api/mcp
```

Credentials stay inside the connector process and are never exposed as MCP tool arguments or returned to the caller.

## Authentication

The hosted AppSignal MCP server supports OAuth and long-lived MCP bearer tokens. This local reusable wrapper uses an MCP bearer token because it is suitable for non-interactive agent environments and allows AppSignal's per-toolset/app scoping.

Create an MCP token in AppSignal Account Settings and grant only the required application access and toolsets. For this connector, the minimum practical permissions are:

- `app_discovery`: read
- `logging`: read, only if `appsignal.logging.search` is needed
- `metrics`: read, for metric and uptime tools

Other toolsets may remain disabled.

Do not use a Push API key or application ingest key as the MCP credential.

## Environment variables

```bash
APPSIGNAL_MCP_URL=https://appsignal.com/api/mcp
APPSIGNAL_MCP_TOKEN=
APPSIGNAL_TIMEOUT_MS=15000
APPSIGNAL_WRITE_APPROVAL_REQUIRED=true
```

`APPSIGNAL_MCP_URL` is restricted to HTTPS AppSignal hostnames to reduce SSRF risk.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

## Run

```bash
APPSIGNAL_MCP_TOKEN=your-token npm start
```

The local server uses MCP stdio transport and can be launched by MCP clients that support command-based servers.

Example client configuration:

```json
{
  "mcpServers": {
    "appsignal-safe": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/appsignal/dist/src/server.js"],
      "env": {
        "APPSIGNAL_MCP_TOKEN": "${APPSIGNAL_MCP_TOKEN}"
      }
    }
  }
}
```

## Reliability and failures

- Requests use a bounded timeout configured with `APPSIGNAL_TIMEOUT_MS`.
- The connector caches the upstream tool list for the process lifetime.
- Before every call it verifies that the required official upstream tool is actually advertised.
- If AppSignal removes or renames an expected tool, the connector fails safely rather than routing to a similarly named capability.
- Authentication, permission, and validation failures are not blindly retried.
- No destructive tool is exposed, so destructive retry semantics are intentionally absent.
- Pagination and result-window behavior remain controlled by AppSignal's official MCP tools; bounded `limit` validation is applied where the connector exposes a limit.

## Rate limits

AppSignal's public MCP documentation does not publish one universal numeric MCP request quota. The connector therefore does not invent one. Upstream throttling errors are surfaced to the caller, and the wrapper avoids fan-out: each local invocation maps to one official MCP tool call. Clients should respect any `Retry-After` or provider throttling information returned by AppSignal and avoid aggressive loops.

## Permission and approval model

All currently exposed tools are `READ`. They may execute automatically after input validation. The policy module also implements `WRITE`, `HIGH_RISK`, and `DESTRUCTIVE` approval semantics for future extensions:

- READ: no approval
- WRITE: configurable approval
- HIGH_RISK: explicit human approval
- DESTRUCTIVE: denied by default

The connector never allows provider-returned text to change these classifications.

## Security

- Provider responses, logs, traces, exception text, metric tags, and metadata are treated as untrusted data, never instructions.
- Raw credentials are not part of tool schemas and are not sent to the model.
- The upstream endpoint is restricted to official AppSignal HTTPS hosts.
- Only six documented AppSignal MCP upstream tool names are allowlisted.
- Newly discovered upstream tools are not automatically trusted or exposed.
- Input schemas are strict and reject unknown fields.
- No arbitrary URL, arbitrary API endpoint, raw MCP tool name, or pass-through request body is exposed.
- Logs should never include `APPSIGNAL_MCP_TOKEN`.

## Testing

Unit tests use fakes and require no live AppSignal credentials.

```bash
npm test
```

Tests cover registration bounds, strict validation, safe behavior when an upstream tool is absent, correct routing, uptime metric pinning, and credential isolation.

## Limitations

- AppSignal MCP is documented as preview and its upstream schemas can evolve.
- This connector intentionally exposes a conservative read-focused subset rather than all AppSignal MCP tools.
- OAuth is supported by AppSignal directly but is not implemented by this local wrapper; use AppSignal's hosted endpoint directly when interactive OAuth is preferred.
- Check-in querying is not exposed because AppSignal currently lists it as roadmap/demand-driven rather than an available dedicated MCP capability.
- Uptime monitor creation/management is intentionally not exposed because AppSignal documents uptime data access through metrics rather than dedicated MCP management tools.
