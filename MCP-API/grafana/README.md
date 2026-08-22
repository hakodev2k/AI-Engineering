# Grafana MCP/API Connector

Reusable MCP connector for Grafana observability workflows. It exposes a narrow provider-scoped tool contract while using Grafana's official `grafana/mcp-grafana` server for supported capabilities and the official Grafana HTTP API only for health fallback.

## Transport strategy

Grafana provides two official MCP options: the open-source `grafana/mcp-grafana` server for self-managed Grafana or Grafana Cloud using a service account token, and the hosted Grafana Cloud MCP server using OAuth 2.1. This package launches the official open-source server over stdio and allowlists only selected dashboard, datasource, search, and folder tools.

The connector does not proxy arbitrary newly discovered tools. `grafana.health.get` uses the official `GET /api/health` HTTP API because health is not part of the selected MCP surface.

Official sources researched:

- Grafana MCP overview: https://grafana.com/docs/grafana/latest/developer-resources/mcp/
- MCP tools and RBAC: https://grafana.com/docs/grafana/latest/developer-resources/mcp/reference/mcp-tools-table/
- MCP configuration: https://grafana.com/docs/grafana/latest/developer-resources/mcp/configure/
- Official server source: https://github.com/grafana/mcp-grafana
- HTTP API: https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/
- HTTP API authentication: https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/authentication/

Grafana 9.0 or later is recommended for full MCP functionality.

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- `uvx mcp-grafana` by default for the official upstream server

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

`uv`/`uvx` must be installed unless `GRAFANA_MCP_COMMAND` and `GRAFANA_MCP_ARGS` are configured to use an installed binary or another trusted launch method.

## Authentication

The upstream open-source Grafana MCP server uses `GRAFANA_SERVICE_ACCOUNT_TOKEN`. The token is passed only from the connector process to the official upstream MCP process and to the configured Grafana origin for `/api/health`.

Required:

```text
GRAFANA_URL=https://your-instance.grafana.net
GRAFANA_SERVICE_ACCOUNT_TOKEN=<secret supplied by a secret manager>
```

Optional `GRAFANA_ORG_ID` scopes requests to an organization. Grafana Cloud HTTP API authentication uses service account tokens. Self-managed Grafana also supports basic authentication, but this connector intentionally does not expose username/password authentication.

The LLM never receives the service account token and no tool schema accepts credentials.

## Least-privilege RBAC

Grant only permissions needed by enabled tools:

| Capability | Grafana permission | Scope example |
|---|---|---|
| Dashboard search/read/summary/panel queries | `dashboards:read` | `dashboards:*` or selected dashboard UIDs |
| Folder search | `folders:read` | `folders:*` or selected folder UIDs |
| Datasource list/read | `datasources:read` | `datasources:*` or selected datasource UIDs |
| Dashboard create/update | `dashboards:create`, `dashboards:write` | dashboard/folder scopes needed for the target |
| Folder create | `folders:create` | `folders:*` |

Read-only deployments should omit all write permissions even though write tools remain registered locally; upstream RBAC then provides defense in depth.

## Environment variables

See `.env.example`.

- `GRAFANA_URL`: required Grafana origin. Tool callers cannot override it, preventing arbitrary outbound targets.
- `GRAFANA_SERVICE_ACCOUNT_TOKEN`: required secret.
- `GRAFANA_ORG_ID`: optional organization ID.
- `GRAFANA_MCP_COMMAND`: official MCP launch command, default `uvx`.
- `GRAFANA_MCP_ARGS`: JSON string array, default launches `mcp-grafana` over stdio with only `search,datasource,dashboard,folder` categories.
- `GRAFANA_TIMEOUT_MS`: HTTP health timeout, default 20 seconds.
- `GRAFANA_APPROVAL_MODE`: `required` by default.
- `GRAFANA_APPROVED_ACTIONS`: comma-separated write actions approved by an operator.

Approval state is external configuration. Tool input cannot self-approve an action.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `grafana.mcp.status` | Official MCP discovery | READ | No |
| `grafana.health.get` | HTTP `GET /api/health` | READ | No |
| `grafana.dashboard.search` | MCP `search_dashboards` | READ | No |
| `grafana.folder.search` | MCP `search_folders` | READ | No |
| `grafana.dashboard.get` | MCP `get_dashboard_by_uid` | READ | No |
| `grafana.dashboard.summary` | MCP `get_dashboard_summary` | READ | No |
| `grafana.dashboard.panel_queries` | MCP `get_dashboard_panel_queries` | READ | No |
| `grafana.datasource.list` | MCP `list_datasources` | READ | No |
| `grafana.datasource.get` | MCP `get_datasource` | READ | No |
| `grafana.dashboard.upsert` | MCP `update_dashboard` | WRITE | Required by default |
| `grafana.folder.create` | MCP `create_folder` | WRITE | Required by default |

The official upstream MCP server supports many additional categories such as Prometheus, Loki, alerting, incidents, Sift, OnCall, annotations, rendering, snapshots, and optional datasource-specific categories. They are intentionally not exposed here until reviewed and added explicitly.

## Architecture

```text
MCP client
   |
   v
src/server.ts
   |-- strict external tool schemas
   |-- local approval checks
   |
   +--> src/upstream.ts --> official mcp-grafana over stdio --> Grafana
   |
   +--> GET /api/health -------------------------------> Grafana
   |
   +--> src/config.ts --> secrets/configuration
```

The upstream MCP tool allowlist is hard-coded. Discovery is used for status verification only and cannot silently expand permissions.

## Approval model

Default behavior:

```text
READ  -> automatic
WRITE -> explicit operator approval
```

To temporarily approve dashboard mutation:

```text
GRAFANA_APPROVED_ACTIONS=grafana.dashboard.upsert
```

To approve both exposed writes:

```text
GRAFANA_APPROVED_ACTIONS=grafana.dashboard.upsert,grafana.folder.create
```

Remove temporary approvals after the intended change window. For high-impact production changes, use a separate external approval/policy system as an additional control.

## Reliability

The official MCP server owns Grafana API pagination, provider error handling, and datasource/dashboard API behavior for MCP-backed tools. This wrapper preserves upstream MCP errors and fails closed when an allowlisted upstream tool is unavailable.

The HTTP health fallback has a bounded timeout and no retries. The connector does not automatically retry write tool calls because an uncertain remote outcome could duplicate or overwrite changes.

List inputs are bounded locally, and dashboard patch operations are limited to 50 per call.

## Security considerations

- Credentials are environment-only and excluded from tool schemas and responses.
- Outbound HTTP fallback is restricted to the configured `GRAFANA_URL` plus fixed `/api/health` path.
- Upstream MCP tool names are allowlisted; arbitrary tool invocation is rejected.
- Only selected upstream tool categories are launched by default.
- Provider-returned dashboards, folders, datasource metadata, panel queries, labels, and messages are untrusted data, not instructions.
- Write approvals are connector configuration rather than model-controlled parameters.
- Dashboard patch paths must use JSONPath beginning with `$.` and operation count is bounded.
- No admin, user, team, role, credential, datasource-secret, or arbitrary HTTP request tool is exposed.
- The connector never widens Grafana RBAC scopes or creates service account tokens.

## Errors

Expected categories include configuration validation failures, `APPROVAL_REQUIRED`, `VALIDATION_ERROR`, `UPSTREAM_TOOL_DENIED`, `UPSTREAM_MCP_ERROR`, `GRAFANA_HTTP_<status>`, and upstream process/auth/RBAC failures.

## Tests

Unit tests require no live Grafana credentials. They cover required configuration, malformed upstream command args, approval denial, credential isolation for the fixed health endpoint, provider authorization errors, exact tool registration, and upstream tool allowlisting.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for representative tool inputs, permissions, and approval requirements.

## MCP client configuration

Any MCP client that can launch a local stdio process can run the built wrapper. Example shape:

```json
{
  "mcpServers": {
    "grafana-safe": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/grafana/dist/src/server.js"],
      "env": {
        "GRAFANA_URL": "https://your-instance.grafana.net",
        "GRAFANA_SERVICE_ACCOUNT_TOKEN": "provided-by-secret-manager"
      }
    }
  }
}
```

Do not commit a real token into client configuration.

## Limitations

- This is intentionally not a complete Grafana API or MCP wrapper.
- It launches the official open-source MCP server rather than implementing Grafana Cloud's browser OAuth 2.1 flow.
- Prometheus, Loki, alerting, incidents, Sift, OnCall, annotations, snapshots, rendering, admin, and optional datasource-specific tools are not exposed.
- Datasource creation/update and secret-bearing datasource settings are intentionally excluded.
- Dashboard deletion and folder deletion are not exposed.
- The connector depends on the installed/current `mcp-grafana` upstream tool schemas; `grafana.mcp.status` can identify missing allowlisted tools after an upstream upgrade.
