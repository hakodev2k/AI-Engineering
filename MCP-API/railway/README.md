# Railway MCP/API Connector

Reusable security wrapper around Railway's **official MCP server**. It exposes a stable, provider-scoped MCP tool contract while delegating actual Railway operations to the official `railway mcp` implementation.

Research verified against Railway's current documentation on 2026-08-28.

## Official sources

- Railway MCP docs: https://docs.railway.com/ai/mcp-server
- Railway hosted MCP: https://railway.com/mcp
- Railway Public API: https://docs.railway.com/integrations/api
- Remote MCP launch: https://railway.com/changelog/2026-04-17-remote-mcp

Railway currently offers:
- a **local MCP server** through `railway mcp`, using local Railway CLI context;
- a **remote MCP server** at `https://mcp.railway.com`, using OAuth directly or `railway mcp proxy`;
- a public GraphQL API.

## Transport strategy

This connector chooses the **official local MCP server** for implemented capabilities. No unofficial MCP dependency is used and no REST/GraphQL fallback is necessary for the selected tool set.

Why local MCP:
- it is official and maintained with the Railway CLI;
- Railway credentials stay in the CLI authentication layer;
- no long-lived Railway token is placed in MCP tool arguments, prompts, manifests, or source code;
- tool schemas are discovered from the installed official MCP server at runtime, preventing this wrapper from inventing stale upstream argument contracts.

The remote official MCP is also valid and uses OAuth with workspace/project scoping, but implementing its interactive OAuth consent flow inside this reusable stdio wrapper would add unnecessary credential-handling complexity. Users who prefer direct remote MCP can connect their MCP client to `https://mcp.railway.com`.

## Authentication

Install the Railway CLI and authenticate outside the agent:

```bash
railway login
```

The connector then launches:

```bash
railway mcp
```

The LLM never receives Railway session credentials. Railway's documentation notes that the remote MCP requires a user identity for billing/audit trails and does not accept project tokens.

## Implemented tools

| External tool | Official upstream tool | Risk | Approval |
|---|---|---|---|
| `railway.account.whoami` | `whoami` | READ | no |
| `railway.workspace.list` | `list_workspaces` | READ | no |
| `railway.project.list` | `list_projects` | READ | no |
| `railway.project.create` | `create_project` | WRITE | yes |
| `railway.service.list` | `list_services` | READ | no |
| `railway.service.create` | `create_service` | WRITE | yes |
| `railway.service.config.get` | `get_service_config` | READ | no |
| `railway.deployment.list` | `list_deployments` | READ | no |
| `railway.deployment.deploy` | `deploy` | HIGH_RISK | yes + feature gate |
| `railway.environment.status` | `environment_status` | READ | no |
| `railway.variable.list` | `list_variables` | READ | no |
| `railway.variable.set` | `set_variables` | HIGH_RISK | yes + feature gate |
| `railway.observability.logs` | `get_logs` | READ | no |
| `railway.observability.metrics` | `service_metrics` | READ | no |

The connector intentionally does **not** expose Railway's destructive or broad multi-step agent operations such as service/domain/storage removal, `redeploy`, `accept-deploy`, or `railway-agent`.

## Dynamic schemas with stable names

Railway can evolve its official MCP input schemas. At startup/tool discovery, this wrapper reads the current official schema for each allowlisted upstream tool, then:
1. renames it to the stable provider-scoped external name;
2. injects `approval_token` where required;
3. forces `additionalProperties: false`;
4. validates every call locally before forwarding it.

If Railway removes an upstream capability, the corresponding external tool is omitted from `tools/list` rather than faked.

## Permission and approval model

`READ` executes automatically.

`WRITE` requires an explicit approval HMAC.

`HIGH_RISK` requires:
- `RAILWAY_ENABLE_HIGH_RISK=true`
- `RAILWAY_APPROVAL_SECRET`
- an `approval_token` bound to the exact tool and payload.

Approval token:

```text
hex(HMAC-SHA256(
  RAILWAY_APPROVAL_SECRET,
  "<external-tool-name>\n<stable canonical JSON payload without approval_token>"
))
```

Changing any argument invalidates the approval.

Destructive upstream Railway tools are not exposed at all by this connector. `RAILWAY_ENABLE_DESTRUCTIVE` is reserved for future reviewed extensions and currently enables no tool.

## Environment variables

Copy `.env.example`:

- `RAILWAY_CLI_PATH` — CLI executable, default `railway`.
- `RAILWAY_MCP_TIMEOUT_MS` — bounded call timeout, default `30000`.
- `RAILWAY_APPROVAL_SECRET` — approval HMAC secret.
- `RAILWAY_ENABLE_HIGH_RISK` — `false` by default.
- `RAILWAY_ENABLE_DESTRUCTIVE` — `false`; no destructive tools are currently registered.

## Installation

Requires Node.js 20+ and Railway CLI.

```bash
npm install
npm run check
npm test
railway login
```

## Running

```bash
npm start
```

The connector speaks standard MCP over stdio and can be configured in MCP clients that support stdio servers.

## Rate limits

Railway's current Public API documentation states:
- Free: 100 requests/hour;
- Hobby: 1,000 requests/hour and 10 requests/second;
- Pro: 10,000 requests/hour and 50 requests/second;
- Enterprise: custom.

This connector delegates provider traffic to Railway's official MCP server rather than implementing its own GraphQL retry loop. It adds a bounded local call timeout. Authentication, provider throttling, and upstream MCP failures are surfaced as errors rather than silently retried for mutations.

## Reliability

- bounded timeout on connect, discovery, and tool calls;
- official tool discovery cached for the process lifetime;
- no forwarding to undiscovered tools;
- strict local validation from the current official upstream schema;
- no arbitrary raw API/MCP tool;
- no blind retry of write/deploy actions;
- graceful upstream shutdown on SIGINT/SIGTERM.

If the official Railway MCP fails or the CLI is not authenticated, the wrapper fails closed.

## Security

Railway's own MCP documentation marks destructive actions at the protocol level and advises reviewing LLM-requested operations, especially production changes.

This wrapper adds:
- fixed official CLI command plus fixed `mcp` argument;
- an explicit allowlist;
- removal of destructive and broad multi-step agent tools;
- payload-bound human approvals;
- default-off high-risk deployment/variable mutation;
- upstream schema validation;
- provider content marked as untrusted data;
- no credentials in prompts or tool parameters.

Provider logs, service configuration, and other retrieved content must be treated as untrusted data, not instructions that can alter policy.

## Testing

Tests use mocked upstream MCP clients and require no Railway credentials. They cover:
- connector configuration validation;
- tool-map uniqueness;
- destructive-tool exclusion;
- read permission behavior;
- payload-bound write approval;
- default-denied high-risk operations;
- schema tightening;
- upstream discovery caching;
- refusal to call undiscovered upstream tools.

Run:

```bash
npm test
```

## Limitations

- The Railway CLI must be installed and authenticated.
- The wrapper uses local official MCP, not remote OAuth MCP.
- Current upstream tool schemas are discovered at runtime, so a severely breaking Railway MCP schema change may cause a tool to disappear or validation to fail safely.
- No destructive provider operations are exposed.
- No natural-language `railway-agent` passthrough is exposed because it is too broad for a scoped reusable connector.
