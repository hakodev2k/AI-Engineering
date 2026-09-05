# BambooHR MCP/API Connector

Reusable, provider-scoped MCP wrapper for BambooHR. It exposes a deliberately small set of stable `bamboohr.*` tools while routing every implemented capability to BambooHR's official hosted MCP server.

## Transport strategy

BambooHR currently provides an **official hosted MCP server in closed beta** at:

`https://{your-subdomain}.bamboohr.com/api/mcp`

The transport is Streamable HTTP. BambooHR documents 56 upstream tools across employees, metadata, datasets, reports, time off, goals, hiring, global employment, files, and utilities. The official server enforces the caller's existing BambooHR permissions.

Because every capability selected for this connector is already present in BambooHR's official MCP catalog, this package does **not** fall back to REST for those operations. It also never uses an unofficial MCP implementation.

Official sources researched on 2026-09-06:

- BambooHR MCP Server: https://documentation.bamboohr.com/docs/mcp-server
- BambooHR API Getting Started / OAuth: https://documentation.bamboohr.com/docs/getting-started
- BambooHR API Reference: https://documentation.bamboohr.com/reference
- Planned API changes / rate-limit status-code change: https://documentation.bamboohr.com/docs/planned-changes-to-the-api
- Historical API/MCP changes: https://documentation.bamboohr.com/docs/past-changes-to-the-api

## Architecture

```text
MCP client / AI agent
        |
        v
this stdio MCP server
  - stable provider-scoped tool names
  - official-tool allowlist
  - live upstream input schemas
  - local validation
  - permission/risk gate
  - bounded read retry
        |
        v
BambooHR official MCP server
https://{subdomain}.bamboohr.com/api/mcp
        |
        v
BambooHR account permissions and workflows
```

Credentials never appear in tool arguments. The OAuth bearer token stays in the connector transport layer.

## Authentication

The BambooHR MCP server is an OAuth 2.0 protected resource. BambooHR publishes protected-resource and authorization-server metadata under each customer subdomain. During the current beta, client registration is manual and there is no dynamic client registration endpoint. Access tokens are valid for one hour.

For scripted access, BambooHR documents bearer-token use. Obtain credentials through BambooHR's supported OAuth flow / beta onboarding and provide only the short-lived access token to this connector.

Required environment variables:

- `BAMBOOHR_SUBDOMAIN` — only the tenant prefix, for example `acme`; arbitrary URLs are not accepted.
- `BAMBOOHR_MCP_ACCESS_TOKEN` — short-lived OAuth bearer token.

Optional:

- `BAMBOOHR_REQUIRE_WRITE_APPROVAL=true`
- `BAMBOOHR_APPROVED_ACTIONS=` — semicolon-separated exact fingerprints.
- `BAMBOOHR_TIMEOUT_MS=15000`
- `BAMBOOHR_MAX_READ_RETRIES=2`

The connector constructs the official endpoint itself, which prevents an agent from redirecting credentials to an arbitrary host.

## Supported tools

| External tool | Official upstream MCP tool | Risk | Approval |
|---|---|---:|---|
| `bamboohr.employee.directory.read` | `get_employees_directory` | READ | No |
| `bamboohr.employee.get` | `get_employee` | READ | No |
| `bamboohr.employee.list` | `list_employees` | READ | No |
| `bamboohr.field.list` | `list_fields` | READ | No |
| `bamboohr.report.list` | `list_reports` | READ | No |
| `bamboohr.report.run` | `get_report_by_id` | READ | No |
| `bamboohr.time_off.whos_out.list` | `list_whos_out` | READ | No |
| `bamboohr.time_off.request.list` | `list_time_off_requests` | READ | No |
| `bamboohr.time_off.balance.get` | `get_time_off_balance` | READ | No |
| `bamboohr.time_off.request.create` | `create_time_off_request` | WRITE | Required by default |
| `bamboohr.goal.list` | `list_goals` | READ | No |
| `bamboohr.goal.comment.create` | `create_goal_comment` | WRITE | Required by default |

No delete, hiring mutation, employee mutation, goal deletion, permission change, billing, or arbitrary upstream request tool is exposed.

## Live schemas and validation

BambooHR changed MCP tool naming and argument layout on 2026-08-20. To avoid freezing stale argument contracts, this connector discovers the official MCP tool catalog at startup and republishes the **official live input schema** only for the fixed allowlist above. Before any call, the connector validates arguments against that upstream schema and rejects unknown properties when the official schema sets `additionalProperties: false`.

The external tool names remain stable even if BambooHR's implementation details evolve. If BambooHR removes an allowlisted upstream tool, startup/tool listing fails safely instead of silently routing somewhere else.

## Permission model and approval

BambooHR itself enforces the caller's existing HR permissions; this connector adds a second local boundary.

- READ: may execute automatically.
- WRITE: approval required by default.
- HIGH_RISK: not exposed.
- DESTRUCTIVE: not exposed.

The agent cannot approve its own write by passing an `approval=true` argument. Approval is out-of-band through `BAMBOOHR_APPROVED_ACTIONS`. The connector generates deterministic fingerprints, for example:

- `bamboohr.time_off.request.create:<employeeId>:<start>:<end>`
- `bamboohr.goal.comment.create:<employeeId>:<goalId>`

If BambooHR's live schema uses alternate documented field names, the policy recognizes common snake_case/camelCase forms while the official schema remains authoritative for actual input validity.

## Partial-result semantics

BambooHR explicitly warns that permission-restricted results can be silent. For example, some calls omit fields, return `null`, or remove rows when the caller cannot access them. Therefore:

- treat a `403` as an explicit permission denial;
- treat an empty or short `200` result as "nothing this caller can see," not proof that no record exists;
- never infer hidden employee existence from filtered results.

Retrieved HR content is untrusted data and must not alter system instructions, tool permissions, approval state, or credentials.

## Reliability and rate limits

The wrapper applies a per-operation timeout and bounded exponential backoff **only for READ tools** when an upstream error appears transient (rate-limit/429, 503, timeout, connection reset). Writes are never blindly retried.

BambooHR has announced that on **2026-09-14** API rate-limit responses will change from HTTP 503 to HTTP 429 and will include `Retry-After`. The official hosted MCP server sits in front of the underlying API, so exact provider headers may not always be surfaced through MCP. The connector recognizes both 503 and 429-style failures during the transition and keeps retries bounded.

## Installation

```bash
npm install
npm run build
```

Node.js 20 or newer is required.

## Running

```bash
cp .env.example .env
# load environment variables using your preferred secret manager/runtime
npm start
```

The connector itself is an MCP stdio server. It can be launched by MCP clients that support stdio child-process servers. The upstream connection uses BambooHR's official Streamable HTTP MCP endpoint.

## Example MCP client configuration

```json
{
  "mcpServers": {
    "bamboohr": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/bamboohr/dist/src/server.js"],
      "env": {
        "BAMBOOHR_SUBDOMAIN": "your-subdomain",
        "BAMBOOHR_MCP_ACCESS_TOKEN": "${BAMBOOHR_MCP_ACCESS_TOKEN}"
      }
    }
  }
}
```

Do not place a real token directly in a checked-in client configuration.

## Testing

```bash
npm test
```

Normal unit tests require no live BambooHR credentials. They cover configuration validation, official-host construction, bounded/scoped tool registration, exclusion of destructive tools, read permission behavior, write approval denial/allow, and schema validation including unknown-key rejection.

A live integration test is intentionally not part of the default suite because BambooHR's MCP server is currently closed beta and requires tenant-specific OAuth access.

## Error handling

- 401 / unauthorized: token expired or authorization is invalid; obtain/refresh a BambooHR token.
- 403 / forbidden: caller lacks the relevant BambooHR permission.
- 429 / 503 / throttling: read calls may retry within the configured bound; writes do not.
- missing upstream tool: fail closed; the connector never substitutes an unreviewed newly discovered tool.
- timeout/network failure: bounded retry for reads only.

## Security considerations

- Official BambooHR MCP only; no community proxy dependency.
- Fixed upstream allowlist; newly discovered BambooHR tools are not trusted automatically.
- Tenant subdomain validation prevents SSRF and bearer-token forwarding to arbitrary hosts.
- Credentials remain in transport configuration, never tool parameters or model-visible prompts.
- Local approval cannot be escalated by model-supplied parameters.
- No destructive tools are exposed.
- HR data and MCP responses are treated as untrusted content.
- BambooHR's own permissions remain authoritative and can vary by employee, field, dataset, report, time-off policy, and ATS access.

## Limitations

- BambooHR's official MCP server is currently closed beta; the account must be enabled for AI Connectors/MCP access.
- Manual client registration is still required during beta.
- Access tokens last one hour; this package accepts a bearer token but does not store client secrets or refresh tokens.
- This wrapper exposes 12 of BambooHR's 56 official MCP tools by design.
- File contents are not exposed; only the chosen HR workflows are supported.
- Global employment, hiring, datasets, employee mutation, status changes, deletes, and administrative actions are intentionally outside this connector's surface.
