# Aiven MCP/API Connector

Reusable MCP connector for Aiven that exposes a curated, provider-scoped tool surface while delegating supported operations to Aiven's official `mcp-aiven` server over stdio.

## Official sources

- Aiven MCP documentation: https://aiven.io/docs/tools/mcp-server
- Aiven MCP product page: https://aiven.io/mcp
- Official MCP implementation: https://github.com/Aiven-Open/mcp-aiven
- Aiven API documentation: https://aiven.io/docs/tools/api

Aiven operates the hosted MCP endpoint at `https://mcp.aiven.live/mcp` and supports OAuth 2.0 with PKCE there. Aiven also publishes the local `mcp-aiven` package, which accepts an Aiven API token through `AIVEN_TOKEN`. This connector uses the official local package for deterministic headless execution and does not use direct REST fallback because the selected capabilities are already available through the official MCP server.

## Architecture

```text
MCP client / agent
      |
      v
Aiven connector (this package)
      |  stable tool names, policy, approval, timeout
      v
Official mcp-aiven child process
      |
      v
Aiven API
```

Credentials remain inside the connector/upstream process. The token is never returned in tool output.

## Implemented capabilities

| Tool | Official upstream MCP tool | Risk | Approval |
|---|---|---:|---|
| `aiven.project.list` | `aiven_project_list` | READ | No |
| `aiven.project.get` | `aiven_project_get` | READ | No |
| `aiven.cloud.list` | `aiven_list_project_clouds` | READ | No |
| `aiven.service.list` | `aiven_service_list` | READ | No |
| `aiven.service.get` | `aiven_service_get` | READ | No |
| `aiven.service.plans.list` | `aiven_service_type_plans` | READ | No |
| `aiven.service.pricing.get` | `aiven_service_plan_pricing` | READ | No |
| `aiven.service.metrics.get` | `aiven_service_metrics_fetch` | READ | No |
| `aiven.service.logs.list` | `aiven_project_get_service_logs` | READ | No |
| `aiven.service.query_activity.list` | `aiven_service_query_activity` | READ | No |
| `aiven.project.events.list` | `aiven_project_get_event_logs` | READ | No |
| `aiven.service.create` | `aiven_service_create` | WRITE | Yes |
| `aiven.service.update` | `aiven_service_update` | HIGH_RISK | Yes |

The connector discovers official MCP tool schemas at startup and fails closed if any required upstream tool is unavailable. It never auto-enables newly discovered upstream tools.

## Authentication

Create a least-privilege Aiven API token and provide it as:

```bash
export AIVEN_TOKEN="..."
```

The token's Aiven permissions remain authoritative. Hosted Aiven MCP uses OAuth 2.0 with PKCE, but that browser-based flow is intentionally not embedded in this headless package.

Required environment variable:

```text
AIVEN_TOKEN=
```

Optional security controls:

```text
AIVEN_READ_ONLY=true
AIVEN_ALLOW_WRITE=false
AIVEN_APPROVAL_MODE=required
AIVEN_TOOL_TIMEOUT_MS=30000
```

## Permission and approval model

`READ` tools may execute automatically. `WRITE` and `HIGH_RISK` tools require both `AIVEN_READ_ONLY=false`, `AIVEN_ALLOW_WRITE=true`, and explicit approval when `AIVEN_APPROVAL_MODE=required`.

Example approval payload:

```json
{
  "approval": {
    "confirmed": true,
    "reason": "Approved by the operator for the disposable development environment"
  }
}
```

Destructive operations are not exposed. The connector hard-blocks the `DESTRUCTIVE` risk class.

## Installation

Node.js 20+ is required.

```bash
cd MCP-API/aiven
npm install
npm run build
```

## Run

```bash
npm start
```

The connector uses MCP stdio and can be configured in MCP clients that support stdio child processes. See `examples/mcp-client.json`.

## Reliability

- Every upstream call has a bounded configurable timeout.
- Authentication and permission errors are mapped to actionable connector errors.
- Rate-limit errors are surfaced instead of aggressively replayed.
- Write operations are not blindly retried, preventing duplicate provisioning or configuration mutations.
- Provider-side pagination and service-specific validation remain handled by the official Aiven MCP implementation/API.

## Rate limits

Aiven can throttle API-backed operations. The connector surfaces throttling and expects callers to honor the provider retry window. Use bounded metric/log windows and avoid high-frequency polling.

## Security considerations

- `AIVEN_ALLOW_SECRETS=false` is always passed to the official local MCP process.
- Service connection secrets are intentionally unavailable to the agent.
- Use project/service-scoped permissions and rotate API tokens regularly.
- Logs, query text, metrics, events, and all provider content are untrusted data, not instructions.
- The connector does not expose arbitrary raw HTTP requests.
- Newly discovered MCP tools are not trusted automatically.
- Production writes should remain disabled unless an operator explicitly enables them.

## Testing

```bash
npm test
```

Unit tests require no live credentials. They cover the read/write policy boundary, approval enforcement, read-only mode, destructive-operation blocking, tool naming, tool count, and risk classification.

## Limitations

- Hosted Aiven MCP OAuth/PKCE is documented but not implemented by this local headless runtime.
- Delete/terminate operations are intentionally not exposed.
- Connection secrets are intentionally disabled.
- Only a curated subset of official Aiven MCP tools is exposed.
- If an official upstream tool is renamed or removed, connector startup fails safely rather than silently routing to an unknown replacement.
