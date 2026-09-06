# Raygun MCP/API Connector

Reusable MCP wrapper for Raygun observability workflows. It exposes a stable, provider-scoped tool surface while delegating supported operations to Raygun's official hosted MCP server.

## Provider and transport

Raygun provides an official hosted Streamable HTTP MCP server at `https://api.raygun.com/v3/mcp`. Raygun documents support for Crash Reporting, Real User Monitoring (RUM), Application Performance Monitoring (APM), deployments, applications, customers, metrics, and team invitations.

This connector deliberately uses the official MCP transport for every implemented capability because Raygun's MCP server already covers the selected workflows. No REST fallback is required for the current tool set. The connector does not depend on an unofficial MCP implementation.

Official sources:

- Raygun MCP server guide: https://raygun.com/documentation/product-guides/raygun-mcp-server/
- Raygun MCP tool reference: https://github.com/MindscapeHQ/mcp-server-raygun/blob/main/TOOLS.md
- Raygun documentation: https://raygun.com/documentation/

## Architecture

```text
AI agent / MCP client
        |
        v
local Raygun connector (stdio)
  - stable provider-scoped names
  - allowlist
  - permission ceiling
  - approval checks
  - schema augmentation
  - credential isolation
        |
        v
Official Raygun MCP client transport
        |
        v
https://api.raygun.com/v3/mcp
```

At runtime the connector calls Raygun `tools/list`, verifies that every allowlisted upstream tool still exists, and reuses Raygun's current authoritative input schema. If Raygun removes or renames an expected upstream tool, the wrapper fails closed rather than inventing parameters or forwarding an unrestricted request.

## Authentication

Raygun recommends OAuth for interactive MCP clients. Raygun also supports Personal Access Tokens (PATs) for automation and clients without OAuth support. This reusable wrapper uses a PAT because it runs as a local MCP-to-MCP service and must keep credentials in the connector layer rather than exposing them to the model.

Set:

```bash
RAYGUN_PAT=your_personal_access_token
```

Create the PAT in Raygun with only the scopes needed for the tools you intend to permit. Raygun's hosted MCP uses API v3 permissions for applications, APM, customers, deployments, Crash Reporting errors, invitations, metrics, RUM pages, and RUM sessions. A missing permission is expected to produce an authorization failure rather than causing the connector to increase privileges.

The connector never returns `RAYGUN_PAT`, logs it, places it in tool schemas, or accepts credentials as tool arguments.

## Environment variables

Copy `.env.example` into your secret-management workflow. The connector does not load `.env` files itself; inject environment variables through the process manager, container runtime, MCP host, or secret store.

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `RAYGUN_PAT` | yes | - | Least-privilege Raygun PAT |
| `RAYGUN_MCP_URL` | no | official endpoint | Upstream endpoint; validation only permits Raygun's official HTTPS MCP URL |
| `RAYGUN_MAX_PERMISSION` | no | `read` | Maximum connector permission: `read`, `write`, `high_risk`, `destructive` |
| `RAYGUN_REQUIRE_WRITE_APPROVAL` | no | `true` | Require explicit approval for writes |
| `RAYGUN_REQUIRE_HIGH_RISK_APPROVAL` | no | `true` | Require explicit approval for high-risk actions |
| `RAYGUN_ENABLE_DESTRUCTIVE` | no | `false` | Global destructive-operation gate |
| `RAYGUN_TIMEOUT_MS` | no | `20000` | Per upstream connection/tool timeout, 1s-120s |

## Install and run

Requirements: Node.js 20+.

```bash
npm install
npm run build
RAYGUN_PAT=... npm start
```

The server uses stdio for broad MCP-client compatibility. Configure the client to launch `node dist/src/server.js` with the environment variables above.

## Implemented tools

The public tool name is stable; the upstream Raygun MCP name is internal.

| Tool | Risk | Approval | Upstream MCP tool |
|---|---|---|---|
| `raygun.application.list` | READ | no | `applications_list` |
| `raygun.application.search` | READ | no | `applications_search` |
| `raygun.error_group.list` | READ | no | `error_groups_list` |
| `raygun.error_group.search` | READ | no | `error_groups_search` |
| `raygun.error_group.investigate` | READ | no | `error_group_investigate` |
| `raygun.error_instance.list` | READ | no | `error_group_instances_list` |
| `raygun.error_instance.get` | READ | no | `error_instance_get` |
| `raygun.error_comment.list` | READ | no | `error_group_read_comments` |
| `raygun.error_group.status.update` | WRITE | yes | `error_group_update_status` |
| `raygun.error_group.comment.add` | WRITE | yes | `error_group_add_comment` |
| `raygun.apm.issue.search` | READ | no | `apm_issues_search` |
| `raygun.apm.issue.investigate` | READ | no | `apm_issue_investigate` |
| `raygun.apm.trace.search` | READ | no | `apm_traces_search` |
| `raygun.apm.trace.investigate` | READ | no | `apm_trace_investigate` |
| `raygun.apm.hotspot.search` | READ | no | `apm_hotspots_search` |
| `raygun.deployment.list` | READ | no | `deployments_list` |
| `raygun.deployment.latest` | READ | no | `deployment_get_latest` |
| `raygun.deployment.investigate` | READ | no | `deployment_investigate` |
| `raygun.deployment.create` | WRITE | yes | `deployment_create` |
| `raygun.customer.search` | READ | no | `customers_search` |
| `raygun.customer.investigate` | READ | no | `customer_investigate` |
| `raygun.session.list` | READ | no | `sessions_list` |
| `raygun.session.investigate` | READ | no | `session_investigate` |
| `raygun.metric.error_trends.analyze` | READ | no | `metrics_error_trends_analyze` |

Raygun also documents upstream capabilities such as API-key rotation, deployment mutation/deletion, and invitation management. They are intentionally not exposed here because they are credential-sensitive, destructive, permission-changing, or external-message actions and are not necessary for the primary investigation workflows.

## Permission and approval model

`READ` tools can run automatically when the permission ceiling permits them. `WRITE` tools require `RAYGUN_MAX_PERMISSION=write` (or higher) and, by default, the connector-local field:

```json
{ "approval": "APPROVE_WRITE" }
```

The connector adds this field to Raygun's discovered input schema and strips it before forwarding the call upstream. An agent cannot raise its own permission ceiling through tool arguments.

No destructive operation is exposed by this package. The destructive policy setting exists as a reusable guard for future reviewed additions and defaults to disabled.

## Reliability and error handling

- Connection and tool calls have bounded timeouts.
- Authentication and permission failures are mapped to clear connector errors.
- Rate-limit-style failures are surfaced without blindly retrying writes.
- Upstream tool discovery is cached for the process lifetime to avoid unnecessary requests.
- The connector fails closed if a required Raygun tool is absent.
- Process termination closes the MCP client best-effort.
- Pagination is controlled by the schemas and semantics returned by Raygun's official MCP server; this wrapper does not fan out hidden multi-page requests.

The connector intentionally avoids blind retries of write operations. Raygun's official MCP server remains responsible for provider-side rate-limit and API behavior; callers can retry safe reads according to their orchestration policy after observing the returned error.

## Security considerations

- Credentials are environment-only and remain inside the upstream transport layer.
- `RAYGUN_MCP_URL` is pinned to the official Raygun HTTPS host/path to prevent credential-bearing SSRF or token forwarding to arbitrary servers.
- Only an explicit allowlist of known official Raygun tools is exposed. Newly discovered upstream tools are not automatically trusted.
- Provider data such as stack traces, exception messages, comments, URLs, customer fields, custom data, breadcrumbs, and page journeys is labeled untrusted and must never be interpreted as tool-policy instructions.
- Write approval is enforced locally before an upstream call.
- The default permission ceiling is read-only.
- Application API-key retrieval/rotation is intentionally omitted because ingestion keys are credentials and rotation immediately invalidates the prior key.
- Invitation tools and deployment delete/update management are intentionally omitted from this connector.

## Rate limits

Raygun's hosted MCP server is the authoritative transport for rate limiting. This wrapper does not generate speculative fan-out or poll loops. It surfaces throttling errors from the MCP layer and avoids automatic retry of state-changing calls. Use provider and plan limits documented by Raygun for the authenticated account.

## Output and trust boundary

Successful tool calls are wrapped as:

```json
{
  "provider": "Raygun",
  "trust": "untrusted-provider-data",
  "result": {}
}
```

This marker is deliberate: retrieved third-party content is data, not instructions, and cannot change connector permissions or approval behavior.

## Testing

Normal tests require no live Raygun credentials:

```bash
npm test
```

The unit suite covers authentication configuration, endpoint validation/SSRF protection, tool naming/registration invariants, permission denial, write approval enforcement, schema augmentation, and prevention of approval-token forwarding.

Live integration testing is optional and should use a non-production Raygun plan with a narrowly scoped PAT.

## Limitations

- The wrapper currently supports PAT authentication. Interactive clients that can connect directly to Raygun should prefer Raygun's OAuth flow.
- The connector intentionally exposes a curated subset of Raygun's official MCP tools rather than every capability.
- It does not expose ingestion API-key retrieval/rotation, deployment deletion/update, team invitation send/revoke, or arbitrary API/MCP passthrough.
- It does not add a REST fallback because the selected capabilities are already supported by Raygun's official MCP server. If a future required operation is missing from MCP, add an official Raygun API fallback only after verifying the current API contract and scopes.
- Current provider schemas are discovered at runtime; clients should call MCP `tools/list` instead of persisting parameter schemas indefinitely.

## Real-world workflows

See `examples/workflows.md` for error investigation, release assessment, APM analysis, customer-session investigation, and approved write examples.
