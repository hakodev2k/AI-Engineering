# Axiom MCP/API Connector

Reusable MCP connector for Axiom observability data and monitor operations. It exposes a stable provider-scoped tool surface for incident investigation and alert lifecycle management while keeping credentials inside the connector.

## Official transport research

Axiom provides an official hosted MCP server at `https://mcp.axiom.co/mcp` (and an SSE endpoint at `/sse`). As of September 2, 2026, Axiom documents MCP tools including dataset discovery/schema, APL queries, monitor inspection and monitor lifecycle operations, along with broader dashboard, notifier, and metrics functionality. The hosted server normally supports browser OAuth; Axiom also documents header authentication using a personal access token together with `x-axiom-org-id`. Axiom notes that hosted MCP query results route through US infrastructure.

This package prefers the official MCP server for the capabilities it exposes when `AXIOM_MCP_PAT` and `AXIOM_ORG_ID` are configured. It discovers the upstream tool list/schema before invocation and never automatically exposes newly advertised upstream tools. Stable REST fallbacks use Axiom's official API for datasets, APL queries, and monitor operations.

Official sources researched:
- https://axiom.co/docs/console/intelligence/mcp-server
- https://axiom.co/docs/reference/tokens
- https://axiom.co/docs/restapi/introduction
- https://axiom.co/docs/restapi/query
- https://axiom.co/docs/restapi/endpoints/getDatasets
- https://axiom.co/docs/restapi/endpoints/getDataset
- https://axiom.co/docs/restapi/endpoints/getFieldsForDataset
- https://axiom.co/docs/restapi/endpoints/getMonitors
- https://axiom.co/docs/restapi/endpoints/getMonitor
- https://axiom.co/docs/restapi/endpoints/getMonitorHistory
- https://axiom.co/docs/restapi/endpoints/createMonitor
- https://axiom.co/docs/restapi/endpoints/updateMonitor

## Architecture

```text
MCP client / AI agent
        |
        v
Axiom connector (stdio MCP)
  | validation + permission policy
  | credential isolation
  +--> official Axiom remote MCP (preferred when header auth configured)
  +--> official Axiom REST API (stable fallback)
```

No arbitrary HTTP passthrough or unrestricted upstream MCP invocation is exposed.

## Authentication and least privilege

Set `AXIOM_TOKEN` to a least-privilege Axiom API token. Axiom recommends API tokens over personal access tokens because advanced API tokens can be restricted to selected datasets/actions. Query-cost limits can also be applied and are particularly useful for AI-agent workloads. PATs have broad account access and should be avoided for REST when an advanced API token is sufficient.

For official hosted MCP header authentication, set both `AXIOM_MCP_PAT` and `AXIOM_ORG_ID`. Credentials are never accepted as MCP tool parameters and never returned in tool output. In clients that can perform browser OAuth directly, connecting directly to Axiom's hosted MCP endpoint can be preferable.

Grant only the permissions required by enabled workflows: dataset query access for dataset/query tools, monitor read access for monitor inspection, and monitor create/update permissions only when those write tools are needed. The connector cannot elevate provider permissions.

## Environment variables

- `AXIOM_TOKEN` — required REST API credential.
- `AXIOM_API_URL` — defaults to `https://api.axiom.co`.
- `AXIOM_ORG_ID` — organization ID; required with `AXIOM_MCP_PAT`.
- `AXIOM_MCP_URL` — defaults to `https://mcp.axiom.co/mcp`.
- `AXIOM_MCP_PAT` — optional credential for documented remote-MCP header authentication.
- `AXIOM_TIMEOUT_MS` — default 15000; accepted range 1000–120000.
- `AXIOM_MAX_RETRIES` — default 2; accepted range 0–5.
- `AXIOM_REQUIRE_WRITE_APPROVAL` — defaults to true.
- `AXIOM_APPROVED_ACTIONS` — comma-separated exact approval fingerprints configured outside the agent prompt.
- `AXIOM_ENABLE_DESTRUCTIVE` — retained as a fail-closed policy setting; this connector exposes no destructive MCP tool.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
AXIOM_TOKEN=... npm start
```

The connector is a stdio MCP server and can be launched by MCP clients that support stdio child-process servers. Product-specific marketplace compatibility is not implied.

## Implemented tools

| Tool | Preferred transport | Fallback | Risk | Approval |
|---|---|---|---|---|
| `axiom.dataset.list` | official MCP `listDatasets` | REST | READ | none |
| `axiom.dataset.get` | REST | — | READ | none |
| `axiom.dataset.schema` | official MCP `getDatasetSchema` when a dataset name is supplied | REST fields API | READ | none |
| `axiom.query.apl` | official MCP `queryApl` | REST query API | READ | none |
| `axiom.monitor.list` | official MCP `checkMonitors` | REST | READ | none |
| `axiom.monitor.get` | REST | — | READ | none |
| `axiom.monitor.history` | REST | — | READ | none |
| `axiom.monitor.create` | official MCP `createMonitor` | REST | WRITE | configurable; required by default |
| `axiom.monitor.update` | official MCP `updateMonitor` | REST PUT | WRITE | configurable; required by default |

For safe read calls, an MCP transport failure can fall back to REST. For mutating calls, once a supported upstream MCP tool is selected, an execution error is surfaced rather than retried through REST; this avoids uncertain double execution.

## Permission and approval model

READ tools can execute automatically. WRITE tools require external approval by default. Approval is connector-side configuration, not an agent-provided boolean. Example:

```text
AXIOM_APPROVED_ACTIONS=axiom.monitor.update:mon_123
```

Setting `AXIOM_REQUIRE_WRITE_APPROVAL=false` permits ordinary writes without the connector approval allowlist, but provider-side permissions still apply. No destructive operation is registered as an MCP tool in this package.

## Reliability, rate limits, and errors

REST reads use cancellation-backed timeouts and bounded exponential backoff for network failures, HTTP 429, and server errors. `Retry-After` is honored when present. Mutating API calls are not blindly retried. APL query POSTs are treated as read-only and may retry within the configured bound. Pagination/request amplification is avoided by exposing only focused provider operations.

Axiom API failures preserve HTTP status and retry timing through `AxiomApiError`. Validation and permission failures are not retried. Authentication failures require operator action. Timeouts produce an explicit timeout error.

Axiom's own role/token restrictions and query-cost limits should be used in addition to connector validation. Do not grant wider dataset or monitor privileges merely to make an agent workflow convenient.

## Security considerations

- Credentials stay in configuration and transport layers; the LLM never receives raw tokens.
- Retrieved logs, traces, metrics, monitor text, and MCP responses are untrusted data, not instructions.
- No arbitrary URL fetcher, raw REST request tool, or unrestricted MCP proxy is exposed.
- Remote MCP tool names are explicitly allowlisted by implementation and advertised schemas are inspected before argument mapping.
- Dataset/monitor identifiers and time windows are validated.
- Monitor create/update input requires exactly one of APL or MPL query text.
- Write operations are externally approval-gated by default.
- The connector does not expose deletion, token management, RBAC changes, notifier mutation, billing, or other destructive/admin operations.
- Use Axiom advanced API-token restrictions and query-cost limits for agent deployments.
- Hosted MCP may route query results through US infrastructure; use the local/REST option when that routing is unsuitable.

## Usage examples

See `examples/workflows.md` for incident investigation, monitor review, and approved monitor lifecycle workflows.

## Testing

`npm test` runs unit tests with mocked HTTP and requires no live Axiom credentials. Tests cover authentication configuration, credential placement in transport headers, write approval denial/allowance, HTTP 429 retry behavior, non-retry of monitor creation, and the monitor update method.

## Limitations

This connector intentionally omits monitor deletion, notifier mutation, dashboard mutation, user/RBAC management, token management, dataset deletion, ingestion, and arbitrary MCP passthrough. Axiom supports more official MCP tools than this connector exposes. Browser OAuth is not implemented inside the stdio wrapper; browser-capable MCP clients can connect directly to Axiom's official hosted MCP service. MCP argument adaptation depends on the upstream server-advertised JSON schema and fails safely when an expected upstream tool is unavailable.
