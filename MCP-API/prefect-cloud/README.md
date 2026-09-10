# Prefect Cloud MCP/API Connector

Reusable MCP connector for inspecting Prefect Cloud orchestration state and safely triggering an existing deployment. It exposes a stable provider-scoped MCP interface while routing each capability to Prefect's official MCP server first and to the official REST API when a supported read fallback or execution operation is required.

## Upstream support and sources

Prefect provides both an official MCP server and REST API.

- Official MCP guide: https://docs.prefect.io/v3/how-to-guides/ai/use-prefect-mcp-server
- Official MCP implementation: https://github.com/PrefectHQ/prefect-mcp-server
- Hosted MCP endpoint: `https://prefect.fastmcp.app/mcp`
- Official REST API overview: https://docs.prefect.io/v3/api-ref/rest-api
- Prefect API key guidance: https://docs.prefect.io/v3/how-to-guides/cloud/manage-users/api-keys

The Prefect MCP server is currently documented as beta and its default operational tools are read-only. It supports identity/workspace inspection, dashboards, deployments, flows, flow runs and logs, task runs, work pools, events, automations, and Cloud rate-limit diagnostics. Prefect's REST API provides the write path used here to trigger an existing deployment.

This connector does not use community MCP servers and does not expose Prefect's REST API as a generic request tool.

## Transport strategy

| Capability | Preferred upstream | Fallback |
| --- | --- | --- |
| Identity, authorized workspaces, dashboard | Official Prefect MCP | None |
| Deployments, flows, flow runs, task runs, work pools | Official Prefect MCP | Official REST `*/filter` API |
| Flow-run logs | Official Prefect MCP | Official REST `/logs/filter` API |
| Events, automations, rate-limit diagnostics | Official Prefect MCP | None in this package |
| Trigger deployment run | Official REST API | None; write calls are never blindly retried |

REST fallback is only attempted when both `PREFECT_API_URL` and `PREFECT_API_KEY` are configured. When a tool supplies `workspace_id`, the connector refuses REST fallback unless it matches the workspace encoded in `PREFECT_API_URL`. This prevents an MCP workspace selector from silently crossing into a differently configured REST workspace.

## Architecture

```text
MCP client
  -> local prefect-cloud MCP server
      -> policy + strict input validation
      -> official Prefect MCP transport (HTTP or stdio)
      -> official Prefect REST API fallback / execution
      -> credential provider (credentials never enter tool output)
```

Important files:

- `src/auth/credentials.ts` isolates API/MCP credentials.
- `src/transport/prefectMcp.ts` connects to the official Prefect MCP server and enforces an upstream tool allowlist.
- `src/client/prefectApi.ts` provides fixed-path REST access, timeouts, response-size limits, bounded retries, and error propagation.
- `src/models/policy.ts` enforces approval and execution policy.
- `src/tools/index.ts` defines schemas, MCP-to-REST fallback routing, and the high-risk execution handler.
- `src/server/index.ts` exposes the stable connector MCP tools over stdio.

## Authentication and permissions

### Hosted Prefect MCP

Prefect's hosted MCP server uses Prefect Cloud OAuth and limits access to workspaces selected during consent. Human-operated clients can normally connect directly to the hosted Prefect MCP integration. For this wrapper process, set a short-lived bearer token as `PREFECT_MCP_ACCESS_TOKEN`, or use the official local stdio server instead.

Prefect also documents service-account MCP OAuth credentials for unattended clients. Exchange those credentials outside this connector for a time-limited MCP access token and inject only the resulting token into `PREFECT_MCP_ACCESS_TOKEN`. Do not place client secrets in prompts or tool arguments.

### Local official MCP server

Set `PREFECT_MCP_TRANSPORT=stdio`. The connector launches the official server using the configurable command/arguments (default `uvx --from prefect-mcp prefect-mcp-server`) and passes configured Prefect API credentials only to that child process.

### REST API

Prefect Cloud REST requests use:

```text
Authorization: Bearer <PREFECT_API_KEY>
```

`PREFECT_API_URL` should be the workspace-scoped base URL, for example:

```text
https://api.prefect.cloud/api/accounts/<ACCOUNT_ID>/workspaces/<WORKSPACE_ID>
```

Prefect API keys are authorization credentials rather than OAuth scope strings; effective access is bounded by the Prefect user/service-account role associated with the key. Use a read-only service-account role for inspection-only deployments. Grant write permission only when `prefect-cloud.deployment.run` is intentionally enabled.

If your Prefect environment requires an `X-PREFECT-API-VERSION` header, set `PREFECT_API_VERSION`. It is deliberately configurable rather than pinned in code.

## Environment variables

Copy `.env.example` into your secret-management workflow. Never commit populated values.

| Variable | Purpose |
| --- | --- |
| `PREFECT_API_URL` | Prefect Cloud workspace REST base URL or self-hosted API URL |
| `PREFECT_API_KEY` | REST/local-MCP bearer credential |
| `PREFECT_API_VERSION` | Optional REST API version header |
| `PREFECT_MCP_TRANSPORT` | `http` or `stdio`; default `http` |
| `PREFECT_MCP_URL` | Official hosted MCP URL; default `https://prefect.fastmcp.app/mcp` |
| `PREFECT_MCP_ACCESS_TOKEN` | Optional hosted MCP bearer token |
| `PREFECT_MCP_COMMAND` | Local official MCP command; default `uvx` |
| `PREFECT_MCP_ARGS` | Comma-separated local MCP arguments |
| `PREFECT_REQUEST_TIMEOUT_MS` | REST request timeout, 1–120 seconds |
| `PREFECT_MAX_RETRIES` | Read-only REST retry count, 0–5 |
| `PREFECT_MAX_RESPONSE_BYTES` | Maximum accepted upstream response size |
| `PREFECT_ENABLE_EXECUTION` | Must be `true` before deployment execution is allowed |
| `PREFECT_APPROVAL_TOKEN` | Server-side approval secret, minimum 16 characters |

## Install and run

Requirements: Node.js 20 or later. Local Prefect MCP mode additionally requires `uvx` (or another configured command capable of running Prefect's official `prefect-mcp` package).

```bash
npm install
npm run build
npm start
```

The connector itself exposes stdio MCP, so any MCP client that supports launching a stdio server can run the built entry point. Configure credentials in the connector process environment rather than in natural-language prompts.

Example client process configuration:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/prefect-cloud/dist/src/server/index.js"],
  "env": {
    "PREFECT_MCP_TRANSPORT": "stdio",
    "PREFECT_API_URL": "https://api.prefect.cloud/api/accounts/ACCOUNT_ID/workspaces/WORKSPACE_ID",
    "PREFECT_API_KEY": "<secret supplied by your secret manager>"
  }
}
```

## MCP tools

| Tool | Risk | Approval | Upstream behavior |
| --- | --- | --- | --- |
| `prefect-cloud.identity.get` | READ | No | MCP `get_identity` |
| `prefect-cloud.workspace.list_authorized` | READ | No | MCP `list_authorized_workspaces`; hosted OAuth mode |
| `prefect-cloud.dashboard.get` | READ | No | MCP `get_dashboard` |
| `prefect-cloud.deployment.list` | READ | No | MCP `get_deployments`, REST fallback |
| `prefect-cloud.flow.list` | READ | No | MCP `get_flows`, REST fallback |
| `prefect-cloud.flow_run.list` | READ | No | MCP `get_flow_runs`, REST fallback |
| `prefect-cloud.flow_run.logs` | READ | No | MCP `get_flow_run_logs`, REST fallback |
| `prefect-cloud.task_run.list` | READ | No | MCP `get_task_runs`, REST fallback |
| `prefect-cloud.work_pool.list` | READ | No | MCP `get_work_pools`, REST fallback |
| `prefect-cloud.event.read` | READ | No | MCP `read_events` |
| `prefect-cloud.automation.list` | READ | No | MCP `get_automations` |
| `prefect-cloud.rate_limit.review` | READ | No | MCP `review_rate_limits`; Prefect Cloud only |
| `prefect-cloud.deployment.run` | HIGH_RISK | Always | REST `POST /deployments/{id}/create_flow_run` |

List tools use bounded page sizes. The connector accepts Prefect's provider-specific filter object but caps serialized filter size. Offset is used only by REST fallback because the current official MCP read tools bound results using `limit` rather than an exposed offset.

### Deployment execution approval

Triggering a deployment can cause arbitrary workflow side effects in downstream systems, so it is classified `HIGH_RISK`. All of these conditions are required:

1. Host sets `PREFECT_ENABLE_EXECUTION=true`.
2. Host configures a secret `PREFECT_APPROVAL_TOKEN`.
3. The human-approved call includes the matching `approval_token`.
4. The call includes exact confirmation `confirm: "RUN_DEPLOYMENT"`.

The approval token is compared in constant time and is never included in outputs. The connector does not expose deletion, infrastructure mutation, permission changes, or billing operations.

## Reliability and rate limiting

REST reads use a bounded timeout and up to `PREFECT_MAX_RETRIES` retries for network failures, HTTP 429, 502, 503, and 504. Backoff is exponential and honors `Retry-After` when supplied. Authentication, permission, validation, conflict, and not-found failures are not blindly retried.

Prefect's API uses multiple rate-limit operation groups and limits may vary by Cloud context/plan. This connector does not invent a fixed quota. It propagates HTTP 429 details and exposes `prefect-cloud.rate_limit.review`, backed by Prefect's official MCP diagnostic tool, for Cloud throttling analysis.

`prefect-cloud.deployment.run` is a non-idempotent control action from the connector's perspective and is never automatically retried, even if the provider returns a transient 5xx response. Callers can supply Prefect's supported `idempotency_key` when they intentionally need provider-side deduplication.

## Error handling

Tool errors are returned as MCP error results with a concise message. Common categories include:

- missing/invalid connector configuration;
- MCP authentication or workspace authorization failure;
- REST 401 authentication failure or 403 authorization failure;
- REST 404/409/422 provider errors;
- HTTP 429 throttling, including `Retry-After` when available;
- request timeout/network failure;
- response-size limit exceeded;
- REST fallback workspace mismatch;
- approval or execution-policy denial;
- upstream MCP failure where no documented REST fallback is implemented.

## Security considerations

- Credentials stay in the connector/auth layer and are never accepted as general model-generated provider credentials.
- Only fixed Prefect API paths are constructed; arbitrary URLs/requests are not exposed. Non-local REST base URLs must use HTTPS.
- The upstream MCP transport has a static allowlist. Newly discovered MCP tools are not trusted automatically.
- Prefect content, logs, event payloads, automation data, and MCP responses are treated as untrusted data. Retrieved text must never be interpreted as permission or policy instructions.
- Upstream response size is bounded to reduce memory abuse and malicious-response amplification.
- Workspace matching prevents REST fallback from changing the target selected by a caller.
- The connector does not expose secret/block-value retrieval, deletion, RBAC mutation, billing mutation, or arbitrary CLI execution.
- Do not log environment variables, bearer tokens, approval tokens, or full sensitive provider payloads.

## Examples

See `examples/workflows.json`. Each example records the tool, inputs, expected output shape, permission class, and approval requirement.

Typical diagnostic workflow:

```text
identity.get
  -> dashboard.get
  -> flow_run.list (FAILED/CRASHED)
  -> flow_run.logs
  -> work_pool.list
  -> event.read
```

Execution is intentionally separate from diagnosis and must cross the explicit approval boundary before `deployment.run`.

## Testing

Tests do not require live Prefect credentials.

```bash
npm test
```

Coverage includes configuration/auth boundaries, HTTPS policy, approval and execution gates, strict input limits, REST read fallback, workspace mismatch rejection, rate-limit retry behavior, no retry of execution, and the upstream MCP allowlist.

## Limitations

- Prefect's MCP server is beta; upstream tool contracts can evolve. This connector pins a strict allowlist and fails closed when unsupported capabilities appear.
- Hosted browser OAuth is normally performed directly by the MCP client against Prefect. This wrapper does not implement an interactive browser OAuth callback server; use an injected short-lived MCP access token or official local stdio mode.
- REST fallback is intentionally implemented only for deployments, flows, flow runs, flow-run logs, task runs, and work pools.
- `workspace.list_authorized` requires Prefect hosted Cloud OAuth mode.
- `rate_limit.review` is Prefect Cloud-specific.
- Webhook creation/management, automation mutation, deployment editing/deletion, flow-run cancellation, infrastructure mutation, secrets, permissions, billing, and experimental execution-plan authoring are not exposed.
