# OpenStatus MCP/API Connector

Reusable Model Context Protocol connector for OpenStatus uptime monitoring, status pages, incident/status-report visibility, maintenance, notification-channel inspection, private-location health, response diagnostics, and audit history.

The connector presents stable provider-scoped MCP tools to callers while using OpenStatus's official remote MCP server upstream. The official API and Node SDK were also verified as fallback transports, but the selected capabilities are already covered by the official MCP server, so this implementation does not duplicate them through REST/RPC calls.

## Official sources

Research for this connector used OpenStatus-owned documentation and source code:

- MCP server reference: https://www.openstatus.dev/docs/reference/mcp-server
- Node SDK overview: https://www.openstatus.dev/docs/sdk/nodejs/overview
- Node SDK authentication: https://www.openstatus.dev/docs/sdk/nodejs/authentication
- Maintenance reference: https://www.openstatus.dev/docs/reference/maintenance
- OpenStatus repository and agent-tool schemas: https://github.com/openstatusHQ/openstatus

Official upstream MCP endpoint: `https://api.openstatus.dev/mcp`.

## Transport strategy

```text
MCP client / AI agent
        |
        v
this connector (stdio MCP)
        |
        +-- policy + validation + approval boundary
        |
        v
OpenStatus official remote MCP (Streamable HTTP)
        |
        v
OpenStatus services
```

Primary transport is the official remote MCP server. OpenStatus also documents a typed HTTP API and official Node/Python SDKs. They are retained as documented fallback options for future capabilities that may not exist in MCP; callers do not need to know which upstream transport is used. No unofficial MCP server is used.

## Authentication and least privilege

Set `OPENSTATUS_API_KEY` to an OpenStatus API key. The connector keeps the key inside the transport layer and sends it to the official upstream using `x-openstatus-key`; it is never included in MCP tool output or intended to enter an LLM prompt.

OpenStatus distinguishes read-only and read/write API keys. Use a read-only key when only the 14 read tools are required. A read/write key is required for `openstatus.maintenance.create`. The connector cannot elevate an OpenStatus key's permissions.

Copy `.env.example` and configure secrets in your process environment or secret manager. Never commit a real key.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `OPENSTATUS_API_KEY` | yes | none | OpenStatus API key retained by the connector |
| `OPENSTATUS_MCP_URL` | no | `https://api.openstatus.dev/mcp` | Trusted upstream MCP URL |
| `OPENSTATUS_ALLOWED_MCP_HOSTS` | no | `api.openstatus.dev` | Comma-separated SSRF/configuration allowlist |
| `OPENSTATUS_REQUEST_TIMEOUT_MS` | no | `15000` | Per-call timeout, 1,000-120,000 ms |
| `OPENSTATUS_READ_RETRIES` | no | `2` | Extra attempts for transient read failures, 0-4 |
| `OPENSTATUS_REQUIRE_WRITE_APPROVAL` | no | `true` | Approval policy for ordinary writes; HIGH_RISK remains explicitly approved |

The upstream URL must be HTTPS and its hostname must be allowlisted. A custom endpoint should only be configured for a trusted deployment.

## Installation

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run build
```

Run the connector as a local stdio MCP server:

```bash
npm start
```

An MCP client can launch `node /absolute/path/MCP-API/openstatus/dist/src/index.js` with the required environment variables. Compatibility depends on the client supporting standard stdio MCP servers; no client-specific protocol extensions are required.

## Implemented tools

| Tool | Upstream | Risk | Approval | Purpose |
| --- | --- | --- | --- | --- |
| `openstatus.status_page.list` | `list_status_pages` | READ | no | List status pages and IDs |
| `openstatus.status_page.component.list` | `list_page_components` | READ | no | List page components, optionally by page |
| `openstatus.status_report.list` | `list_status_reports` | READ | no | List active/all status reports |
| `openstatus.maintenance.list` | `list_maintenances` | READ | no | List maintenance windows |
| `openstatus.monitor.list` | `list_monitors` | READ | no | Discover monitors and IDs |
| `openstatus.monitor.get` | `get_monitor` | READ | no | Read monitor configuration |
| `openstatus.monitor.status.get` | `get_monitor_status` | READ | no | Read current per-region health |
| `openstatus.monitor.summary.get` | `get_monitor_summary` | READ | no | Read bounded health/latency aggregates |
| `openstatus.response_log.list` | `list_response_logs` | READ | no | List recent HTTP check results |
| `openstatus.response_log.get` | `get_response_log` | READ | no | Drill into one response log |
| `openstatus.notification.list` | `list_notifications` | READ | no | Inspect notification-channel coverage without secrets |
| `openstatus.private_location.list` | `list_private_locations` | READ | no | Inspect private checker health without tokens |
| `openstatus.audit_log.list` | `list_audit_logs` | READ | no | List recent audit entries |
| `openstatus.audit_log.get` | `get_audit_log` | READ | no | Read before/after audit detail |
| `openstatus.maintenance.create` | `create_maintenance` | HIGH_RISK | explicit | Publish a maintenance window and optionally notify subscribers |

The connector intentionally does not expose a generic raw-request tool.

## Permission and approval model

`READ` operations may execute automatically. `HIGH_RISK` operations require explicit human approval. No `DESTRUCTIVE` operation is exposed.

`openstatus.maintenance.create` is classified `HIGH_RISK` because it creates public status-page content and can send subscriber notifications. The caller must provide `approved: true` only after a human has reviewed the exact action. The caller must also make an explicit `notify: true|false` choice; notification intent is never inferred. The connector strips the local `approved` control before sending arguments upstream.

The upstream OpenStatus MCP implementation also treats mutations as approval-worthy operations. This connector adds its own boundary rather than assuming the upstream or MCP client will provide one.

## Validation

Inputs are validated with bounded Zod schemas. Important constraints include:

- monitor/status-page/audit identifiers are numeric where OpenStatus defines them as numeric;
- list pagination is bounded to the provider's documented maximums;
- monitor summary and response-log windows are restricted to `1d`, `7d`, or `14d`;
- response-log offsets cannot be negative;
- maintenance titles are limited to 256 characters;
- maintenance timestamps must be ISO 8601 and `to` must be strictly later than `from`;
- maintenance component counts are bounded;
- `approved` for maintenance is a literal `true`, not a truthy free-form value.

Discover IDs with the corresponding list tools instead of guessing them. OpenStatus validates page/component relationships upstream as well.

## Reliability and rate limits

The official MCP reference currently states that there is no per-key MCP rate limit. The connector still treats throttling and transient infrastructure failures defensively because provider behavior can change.

Read calls use bounded exponential backoff for transient failures such as HTTP 429/5xx-class errors, connection resets, and timeouts. Authentication, permission, and validation errors are not retried. Mutating calls are never automatically retried, preventing duplicate public maintenance records or duplicate notifications.

Every upstream invocation has a configurable timeout. A failed upstream connection is discarded before a retry so subsequent attempts establish a fresh MCP session. Pagination limits are enforced locally to avoid unexpectedly large requests.

## Security model

- Credentials remain inside `src/config.ts` and `src/upstream.ts`; tool results never intentionally contain the API key.
- The upstream host is HTTPS-only and hostname-allowlisted to reduce SSRF and configuration-injection risk.
- Only a fixed allowlist of known OpenStatus upstream MCP tool names can be called. Newly discovered or unexpected MCP tools are not trusted automatically.
- Provider content is wrapped with `untrusted_data: true`. Status messages, monitor metadata, audit snapshots, URLs, and other retrieved values must be treated as data, never as agent/system instructions.
- OpenStatus's notification-list tool intentionally omits channel credential/configuration data.
- OpenStatus's private-location tool intentionally omits checker bearer tokens.
- OpenStatus's response-log detail intentionally redacts sensitive header values and does not expose response bodies through this tool.
- Errors are surfaced without deliberately logging credentials, and common credential labels are redacted from returned error text.
- Permission changes cannot be requested through tool content or provider responses.

## Error handling

Provider/MCP errors are returned as MCP tool errors rather than converted into successful results. Typical categories include invalid credentials, insufficient key scope, invalid IDs, plan-gated audit access, validation failures, upstream timeout, transport failure, and transient throttling/service errors.

Read retries are bounded. `openstatus.maintenance.create` has one execution attempt per invocation; retrying a write after an uncertain result must be a conscious human/application decision after checking current state.

## Pagination

The connector matches the current official MCP limits:

- status reports and maintenance: `perPage <= 200`;
- monitors and audit logs: `perPage <= 50`;
- notifications: `perPage <= 200`;
- private locations: `perPage <= 100`;
- response logs: `limit <= 100` plus non-negative `offset`.

Use returned pagination metadata rather than issuing unbounded scans.

## Real-world workflows

`examples/workflows.md` covers monitor diagnosis, notification coverage, public maintenance scheduling, and audit investigation with input examples, permissions, approval requirements, and expected result shapes.

A typical incident-diagnosis sequence is:

```text
monitor.list
  -> monitor.status.get
  -> monitor.summary.get
  -> response_log.list
  -> response_log.get
```

A safe maintenance sequence is:

```text
status_page.list
  -> status_page.component.list
  -> human review of exact public change + notify choice
  -> maintenance.create(approved=true)
```

## Testing

Unit tests require no live OpenStatus credentials and use no network calls.

```bash
npm test
```

Coverage includes authentication configuration, HTTPS/host restrictions, approval denial/allowance, destructive-operation denial, transient retry classification, tool registration, pagination validation, maintenance approval/notify validation, removal of the local approval field before upstream execution, and maintenance time-window validation.

For a live integration smoke test, supply a dedicated least-privilege OpenStatus key in a non-production workspace and invoke read tools first. Do not place live credentials in test fixtures.

## API/SDK fallback status

OpenStatus provides an official typed HTTP API and official Node SDK (`@openstatus/sdk-node`) in addition to MCP. They were checked during connector design. The selected 15 capabilities are available directly from the official MCP server, so routing them through a second API path would add complexity and credential exposure without improving coverage. Future capabilities should use the same external tool contract and only add API/SDK routing after official support and permissions are verified.

## Limitations

- The connector exposes a curated subset rather than every OpenStatus write operation. Status-report publishing/update/resolve mutations are intentionally not included in this version; no documentation claims otherwise.
- Audit-log tools can be unavailable when the workspace plan does not include audit history.
- Response-log detail follows OpenStatus's deliberate redaction/body-omission policy and is not a raw traffic capture facility.
- No destructive deletion, permission management, billing operation, arbitrary RPC request, or arbitrary upstream MCP-tool execution is exposed.
- API key creation/rotation is outside this connector; create keys in OpenStatus and inject them securely at runtime.
