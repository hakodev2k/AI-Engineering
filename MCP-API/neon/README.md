# Neon MCP/API Connector

Reusable MCP connector for Neon projects and Lakebase Postgres databases. The connector exposes a small, stable, provider-scoped tool surface and delegates selected capabilities to Neon's official remote MCP server.

## Upstream strategy

Primary transport: official Neon MCP over Streamable HTTP at `https://mcp.neon.tech/mcp`.

Neon also publishes the Management API at `https://console.neon.tech/api/v2`. The Management API was reviewed as the fallback transport, but every capability selected for this connector is currently supported by the official Neon MCP server, so no REST fallback is needed in this version. This avoids maintaining duplicate auth and behavior paths.

Neon's official MCP supports OAuth and API-key authentication, `read`, `write`, and `*` OAuth scopes, read-only mode, tool-category filtering, and project scoping. The connector uses API-key forwarding only inside the connector process when `NEON_API_KEY` is supplied; credentials are never accepted as tool arguments or returned in tool output.

## Implemented tools

| Tool | Upstream Neon MCP tool | Risk | Approval |
|---|---|---|---|
| `neon.project.list` | `list_projects` | READ | No |
| `neon.project.get` | `describe_project` | READ | No |
| `neon.project.create` | `create_project` | WRITE | Yes |
| `neon.project.delete` | `delete_project` | DESTRUCTIVE | Yes |
| `neon.branch.get` | `describe_branch` | READ | No |
| `neon.branch.create` | `create_branch` | WRITE | Yes |
| `neon.branch.delete` | `delete_branch` | DESTRUCTIVE | Yes |
| `neon.branch.compute.list` | `list_branch_computes` | READ | No |
| `neon.database.table.list` | `get_database_tables` | READ | No |
| `neon.database.table.describe` | `describe_table_schema` | READ | No |
| `neon.database.query.read` | `run_sql` | READ | No |
| `neon.database.query.explain` | `explain_sql_statement` | READ | No |
| `neon.database.query.slow.list` | `list_slow_queries` | READ | No |

The connector intentionally does not expose arbitrary upstream tool calls, migrations, reset-from-parent, auth provisioning, or Data API provisioning.

## Architecture

```text
MCP client
  -> local Neon connector (stdio)
     -> validation / permission / approval policy
        -> allowlisted official Neon MCP tools
           -> https://mcp.neon.tech/mcp
              -> Neon platform
```

The local connector validates tool inputs and risk policy before forwarding an allowlisted action. On first use it asks the official MCP server for its tool catalog and fails safely if an expected selected tool is unavailable.

## Authentication

Recommended for interactive direct use of Neon MCP: OAuth 2.1 through the official Neon MCP endpoint.

This reusable wrapper supports API-key authentication because a stdio connector cannot complete a browser OAuth flow on behalf of every host environment. Provide an organization-scoped or otherwise least-privilege Neon API key through `NEON_API_KEY`.

Never place a Neon key in an agent prompt or tool argument. Environment variables or a secure process-level secret provider should inject it into the connector process.

For the official hosted Neon MCP, an API key is sent as:

```text
Authorization: Bearer <NEON_API_KEY>
```

Use organization and per-project permissions to reduce agent access. Neon introduced org roles and project-level permissions, which should be preferred over broad account-wide credentials for automated agents.

## Environment variables

Copy `.env.example` and configure as needed:

```text
NEON_API_KEY=
NEON_MCP_URL=https://mcp.neon.tech/mcp
NEON_PROJECT_ID=
NEON_READONLY=true
NEON_APPROVAL_SECRET=
NEON_TIMEOUT_MS=20000
```

`NEON_MCP_URL` is pinned to the official `mcp.neon.tech` host to reduce SSRF and credential-forwarding risk.

`NEON_PROJECT_ID` adds Neon's official `projectId` grant-context parameter to the MCP URL. This is strongly recommended for agents that only need one project.

`NEON_READONLY=true` is the secure default and adds `readonly=true` upstream. Write and destructive wrapper tools are also rejected locally in this mode.

## Installation

Requirements: Node.js 20 or later.

```bash
npm install
npm run build
npm start
```

The connector exposes MCP over stdio and can be launched by any MCP client that supports stdio servers.

Example client configuration:

```json
{
  "mcpServers": {
    "neon-safe": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/neon/dist/src/server.js"],
      "env": {
        "NEON_API_KEY": "${NEON_API_KEY}",
        "NEON_PROJECT_ID": "${NEON_PROJECT_ID}",
        "NEON_READONLY": "true"
      }
    }
  }
}
```

Host-specific environment interpolation varies. Do not hard-code secrets into shared configuration files.

## Approval model

READ tools execute without approval.

WRITE and DESTRUCTIVE tools require both:

1. `NEON_READONLY=false`.
2. A matching `approvalId` calculated as HMAC-SHA256 using `NEON_APPROVAL_SECRET` and the exact tool name.

For example, approval for `neon.branch.create` is the hex digest of HMAC-SHA256(secret, `neon.branch.create`). The approval secret remains inside the connector environment.

This mechanism is designed as an execution gate. Production hosts should issue approval IDs only after an explicit human confirmation event and should rotate the approval secret periodically.

Project deletion and branch deletion are classified as DESTRUCTIVE. The connector does not silently enable write mode or increase Neon scopes.

## SQL safety

`neon.database.query.read` accepts only one statement beginning with `SELECT`, `WITH`, `SHOW`, or `EXPLAIN`. It rejects common mutating and administrative SQL keywords locally before contacting Neon.

When `NEON_READONLY=true`, Neon's own MCP read-only mode provides a second enforcement layer; Neon's documentation states that `run_sql` remains available only for read-only queries in this mode.

Retrieved database content is untrusted data. Agent hosts must not interpret values from Neon rows, logs, schemas, or metadata as system instructions or permission changes.

## Reliability

The wrapper:

- uses the official Streamable HTTP MCP transport;
- validates the upstream tool catalog against an allowlist;
- applies a bounded request timeout (`NEON_TIMEOUT_MS`, 1–120 seconds);
- closes the upstream connection on SIGINT/SIGTERM;
- rejects non-official MCP hosts;
- does not retry destructive operations;
- leaves Neon throttling and provider error semantics intact rather than hiding them behind unbounded retries.

Neon's MCP and API may return authentication, authorization, precondition, throttling, or provider-specific errors. These are surfaced to the MCP caller. A known Neon limitation is that data-plane tools such as `run_sql` can fail when project password storage is disabled because the control plane cannot vend the required database credential.

## Rate limits

Neon service limits and API throttling are plan- and operation-dependent. This connector performs one upstream tool call per external tool call and does not fan out into hidden request loops. If Neon throttles a call, the error is returned rather than automatically retrying writes or destructive operations.

## Testing

Unit tests do not require live Neon credentials.

```bash
npm test
```

Tests cover configuration defaults, official-host enforcement, project scoping, read/write policy, approval requirements, destructive-operation gating, and read-only SQL validation.

A live integration test is intentionally not part of the normal test suite because it would require credentials and could create or delete resources.

## Security considerations

- Default is read-only.
- API keys remain in the connector/auth layer and are never accepted as MCP tool parameters.
- The upstream URL is constrained to `https://mcp.neon.tech`.
- Only 13 known official MCP tools can be called.
- Newly discovered upstream MCP tools are not automatically trusted or exposed.
- Writes and destructive operations require explicit connector-level approval.
- Project scoping is supported through Neon's official MCP grant context.
- SQL mutation is blocked locally for the exposed query tool.
- Returned provider content must be treated as untrusted data.
- Connection strings are intentionally not exposed as a connector tool because they can contain database credentials.

Neon's own MCP repository warns that the server has powerful database-management capabilities and recommends careful review and authorization of LLM-requested actions.

## Official sources reviewed

- Neon MCP server repository and tool catalog: `https://github.com/neondatabase/mcp-server-neon`
- Official remote MCP endpoint: `https://mcp.neon.tech/mcp`
- Neon MCP documentation: `https://neon.com/docs/ai/neon-mcp-server`
- Neon Management API: `https://api-docs.neon.tech/reference/getting-started-with-neon-api`
- Neon API base URL: `https://console.neon.tech/api/v2`
- Neon MCP security guidance: `https://neon.com/blog/mcp-safety-cheatsheet`

## Limitations

This connector deliberately covers a practical subset rather than every Neon feature. It does not expose migrations, query-tuning completion, reset-from-parent, Auth provisioning, Data API provisioning, raw connection strings, arbitrary SQL writes, or generic REST/MCP passthrough. Those actions can have wider security impact and should be introduced as separately reviewed capabilities if needed.

The connector currently wraps the official MCP server rather than directly calling the Neon Management API because all selected capabilities are available through the trusted MCP implementation. If an implemented capability disappears from the MCP catalog, startup-on-first-call validation fails safely instead of silently switching transports.
