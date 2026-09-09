# Prefect MCP/API Connector

Reusable MCP connector for Prefect orchestration workflows. It exposes a stable, provider-scoped tool surface over Prefect's official REST API for Prefect Cloud and self-hosted Prefect servers.

## Transport decision

No official Prefect Cloud/orchestration MCP server was identified in Prefect's official orchestration documentation during this run. Prefect maintains FastMCP, an official MCP framework, but FastMCP is not itself a Prefect Cloud management server. Community Prefect MCP servers exist, but this connector does not depend on them.

The connector therefore uses Prefect's official REST API directly. This gives deterministic endpoint contracts, isolates credentials in the connector process, and avoids dynamically trusting a third-party MCP tool catalog.

Official sources researched:

- REST API overview: https://docs.prefect.io/v3/api-ref/rest-api
- Prefect Cloud API keys: https://docs.prefect.io/v3/how-to-guides/cloud/manage-users/api-keys
- Create flow run from deployment: https://docs.prefect.io/v3/api-ref/rest-api/server/deployments/create-flow-run-from-deployment
- Read flow runs: https://docs.prefect.io/v3/api-ref/rest-api/server/flow-runs/read-flow-runs
- Work pools: https://docs.prefect.io/v3/api-ref/rest-api/server/work-pools/read-work-pools
- Work queues: https://docs.prefect.io/v3/api-ref/rest-api/server/work-pools/read-work-queues
- Workers: https://docs.prefect.io/v3/api-ref/rest-api/server/work-pools/read-workers
- FastMCP official repository: https://github.com/PrefectHQ/fastmcp

Prefect's REST documentation states that filtering/sorting/pagination commonly uses POST request bodies, including routes such as `/flow_runs/filter`, with `limit` and `offset` pagination.

## Architecture

```text
MCP client / agent
  -> Prefect connector over stdio
     -> strict Zod input validation
     -> risk + payload-bound approval policy
     -> credential-isolated Prefect client
     -> official Prefect REST API
```

Provider-returned descriptions, parameters, logs/metadata references, tags, names, and other content are treated as untrusted data. They cannot alter connector permissions, approval policy, credentials, or tool registration.

## Authentication

### Prefect Cloud

Set `PREFECT_API_URL` to the workspace API URL, for example the official documented shape:

```text
https://api.prefect.cloud/api/accounts/<ACCOUNT_ID>/workspaces/<WORKSPACE_ID>
```

Set `PREFECT_API_KEY` to an API key created in Prefect Cloud. The connector sends it only as:

```text
Authorization: Bearer <PREFECT_API_KEY>
```

The key never appears in MCP tool schemas or successful tool output.

### Self-hosted Prefect

Set `PREFECT_API_URL` to the self-hosted API base, commonly `http://localhost:4200/api` for a local server. `PREFECT_API_KEY` may be omitted when the self-hosted deployment does not require bearer authentication.

Non-local HTTP endpoints are rejected; remote endpoints must use HTTPS.

## Environment variables

```text
PREFECT_API_URL=                  # required
PREFECT_API_KEY=                  # required for Prefect Cloud; optional for compatible self-hosted servers
PREFECT_API_VERSION=0.8.4         # sent as X-PREFECT-API-VERSION
PREFECT_TIMEOUT_MS=15000          # 1000..120000
PREFECT_MAX_RETRIES=2             # 0..5, read-safe calls only
PREFECT_REQUIRE_WRITE_APPROVAL=true
PREFECT_APPROVAL_SECRET=          # required for approval-gated calls
PREFECT_ENABLE_HIGH_RISK=false    # process-side gate; HIGH_RISK is disabled by default
```

Use a secret manager or process environment. Do not commit real API keys or approval secrets.

## Implemented tools

| Tool | Upstream route | Risk | Approval |
|---|---|---|---|
| `prefect.deployment.list` | `POST /deployments/filter` | READ | No |
| `prefect.deployment.get` | `GET /deployments/{id}` | READ | No |
| `prefect.deployment.run` | `POST /deployments/{id}/create_flow_run` | HIGH_RISK | Explicit |
| `prefect.flow_run.list` | `POST /flow_runs/filter` | READ | No |
| `prefect.flow_run.get` | `GET /flow_runs/{id}` | READ | No |
| `prefect.flow_run.cancel` | `POST /flow_runs/{id}/set_state` with `CANCELLING` | HIGH_RISK | Explicit |
| `prefect.task_run.list` | `POST /task_runs/filter` | READ | No |
| `prefect.work_pool.list` | `POST /work_pools/filter` | READ | No |
| `prefect.work_pool.get` | `GET /work_pools/{name}` | READ | No |
| `prefect.work_queue.list` | `POST /work_pools/{name}/queues/filter` | READ | No |
| `prefect.worker.list` | `POST /work_pools/{name}/workers/filter` | READ | No |

The connector does not expose raw HTTP, arbitrary URL execution, deployment deletion, flow-run deletion, work-pool deletion, queue deletion, automation mutation, block/secret retrieval, variable mutation, account administration, billing, or permission changes.

## Real-world workflows

Typical diagnosis workflow:

```text
prefect.deployment.list
  -> prefect.flow_run.list
  -> prefect.flow_run.get
  -> prefect.task_run.list
  -> prefect.work_pool.get
  -> prefect.worker.list
```

Typical controlled execution workflow:

```text
prefect.deployment.get
  -> prepare parameters
  -> human approves exact payload
  -> prefect.deployment.run
  -> prefect.flow_run.get
```

## Permission and approval model

READ tools may run automatically.

`prefect.deployment.run` and `prefect.flow_run.cancel` are HIGH_RISK because they start or interrupt real orchestration work and can affect production systems. They are disabled unless `PREFECT_ENABLE_HIGH_RISK=true` is configured outside model context.

When enabled, HIGH_RISK tools require a payload-bound HMAC approval token. The trusted approval layer computes:

```text
HMAC-SHA256(
  PREFECT_APPROVAL_SECRET,
  <tool-name> + "\n" + canonical-json(<exact payload excluding approval_token>)
)
```

Any change to deployment ID, flow-run ID, parameters, tags, idempotency key, job variables, or cancellation reason invalidates the token. The approval secret is never sent to the agent.

Generate a token outside the agent/tool path with:

```bash
PREFECT_APPROVAL_SECRET='stored-securely' \
node examples/create-approval.mjs \
  prefect.deployment.run \
  '{"deployment_id":"3c90c3cc-0d44-4b50-8888-8dd25736052a","parameters":{"date":"2026-09-09"},"idempotency_key":"daily-import-2026-09-09"}'
```

## Reliability

Every provider request has an AbortController timeout. Safe reads and read-like filter requests may retry transient failures. Retry count is bounded by `PREFECT_MAX_RETRIES`.

Retryable responses are limited to:

- `429`
- `502`
- `503`
- `504`
- transient transport/network failures on retry-safe calls

Authentication, permission, validation, and ordinary 4xx failures are not blindly retried.

State-changing calls are executed once. `prefect.deployment.run` and `prefect.flow_run.cancel` are never automatically retried, preventing duplicate runs or repeated orchestration state changes after ambiguous failures.

The deployment-run tool supports Prefect's documented `idempotency_key`; callers should set one for workflows where duplicate scheduling must be avoided.

## Rate limiting

Prefect Cloud can return HTTP `429`. The connector honors `Retry-After` when supplied and otherwise uses bounded exponential backoff for retry-safe operations. Prefect's public REST overview does not define one universal numeric request quota for every Cloud account/API route, so this connector does not invent one. Provider responses and the active Prefect plan/deployment remain authoritative.

The connector performs one bounded page per list invocation and does not recursively fan out through all pages.

## Validation

- IDs use UUID validation.
- Work-pool names are bounded and reject Prefect-invalid URL-sensitive characters.
- `limit` is bounded to 1..200.
- `offset` must be non-negative.
- tags, names, reasons, and approval tokens are bounded.
- filter objects are passed only to specific documented filter endpoints.
- API base URL is process configuration, never a tool argument.

There is no generic `execute_request`, `fetch_url`, or arbitrary Prefect endpoint tool.

## Error handling

Provider errors are returned as MCP tool errors with bounded provider text. `Retry-After` is parsed for throttling. Credential-shaped fields in provider data are recursively redacted before output.

Authentication failure requires operator action. The connector never reacts to an error by expanding permissions, discovering additional provider tools, or requesting broader credentials from the model.

## Security considerations

- API credentials remain inside the connector transport layer.
- Remote API URLs must use HTTPS.
- Provider content is marked `untrusted_provider_data: true`.
- Credential-shaped provider fields are redacted.
- HIGH_RISK execution is disabled by default.
- Approval is bound to the exact payload.
- Mutations are not blindly retried.
- No destructive operation is exposed.
- No secrets/blocks or account/billing administration is exposed.
- A model cannot change `PREFECT_ENABLE_HIGH_RISK`, approval policy, API URL, or credentials through MCP.

## Installation

Requirements:

- Node.js 20+
- npm
- Prefect Cloud workspace or a reachable self-hosted Prefect server

```bash
npm install
npm run build
npm test
```

## Running the MCP server

```bash
PREFECT_API_URL='https://api.prefect.cloud/api/accounts/.../workspaces/...' \
PREFECT_API_KEY='injected-from-secret-store' \
npm start
```

The connector exposes standard MCP stdio transport. MCP clients that support launching local stdio servers can run `dist/server.js`. Exact client configuration varies by product.

## Testing

Normal unit tests require no live Prefect credentials.

```bash
npm run build
npm test
```

Tests cover:

- secure API URL validation
- configuration defaults
- payload-bound approval
- HIGH_RISK disabled-by-default behavior
- bearer credential isolation in the HTTP layer
- API-version header
- no blind retry of mutations
- bounded 429 retry for safe requests
- provider credential-field redaction

## Examples

See `examples/workflows.md` for read diagnostics, worker health, deployment execution, and cancellation examples. See `examples/create-approval.mjs` for generating payload-bound approval tokens outside model context.

## Limitations

- This connector implements a focused orchestration subset rather than every Prefect endpoint.
- It does not proxy community Prefect MCP servers.
- FastMCP is an official Prefect-maintained MCP framework, not an upstream Prefect Cloud management transport for these operations.
- Advanced logs download, artifacts, automations, blocks, variables, concurrency-limit administration, deployment mutation, event APIs, and destructive operations are intentionally omitted.
- Prefect Cloud account/workspace permissions remain authoritative; connector-side approval cannot grant provider privileges the configured identity does not already have.
- Filter object structure is provider-defined and Prefect validation remains authoritative for field/operator compatibility.
