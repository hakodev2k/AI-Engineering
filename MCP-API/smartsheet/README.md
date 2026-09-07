# Smartsheet MCP/API Connector

Reusable MCP connector for Smartsheet work-management workflows. The package exposes a stable, provider-scoped stdio MCP server and routes every implemented capability to Smartsheet's official hosted MCP server.

## Transport strategy

Smartsheet's official MCP server is generally available and exposes dozens of tools across sheets, rows, columns, workspaces, discussions, reports, dashboards, portfolios, scenario planning, and plan management. This connector **prefers the official MCP server for every implemented capability** because all 13 selected operations are already supported there. No REST fallback is required for this surface.

The connector does not dynamically proxy the whole upstream server. It discovers the upstream tools during connection and fails closed unless all 13 reviewed, hard-allowlisted tool names are advertised. Newly added Smartsheet MCP tools are never trusted automatically.

Official sources researched on 2026-09-07:

- MCP introduction: https://developers.smartsheet.com/ai-mcp/smartsheet/mcp-server
- MCP quickstart: https://developers.smartsheet.com/ai-mcp/smartsheet/mcp-quickstart
- MCP installation / regional endpoints: https://developers.smartsheet.com/ai-mcp/smartsheet/install-the-smartsheet-mcp-server
- MCP tool reference: https://developers.smartsheet.com/ai-mcp/smartsheet/mcp-server-tools
- MCP toolsets: https://developers.smartsheet.com/ai-mcp/smartsheet/mcp-server-toolsets
- Public API / SDK portal: https://developers.smartsheet.com/
- API reference: https://developers.smartsheet.com/api/smartsheet/openapi

Smartsheet announced MCP general availability on March 24, 2026. The official production endpoints are:

- US: `https://mcp.smartsheet.com`
- EU: `https://mcp.smartsheet.eu`
- AU: `https://mcp.smartsheet.au`

## Architecture

```text
MCP client / AI agent
        |
        v
local Smartsheet connector (stdio)
        |
        +--> strict schema validation
        +--> risk classification
        +--> payload-bound human approval
        +--> upstream tool allowlist verification
        |
        v
official Smartsheet MCP server (Streamable HTTP)
        |
        v
Smartsheet public API / authenticated user permissions
```

Provider content is returned inside an `untrusted_provider_data: true` envelope. Sheet cells, comments, names, reports, and other retrieved content are data, never instructions that can change connector policy or permissions.

## Authentication

Set `SMARTSHEET_API_TOKEN` to a Smartsheet API token or an OAuth access token supplied by a secure credential broker. Smartsheet's official MCP server accepts bearer authentication. Clients with native Smartsheet OAuth support can obtain user-authorized tokens interactively; custom/headless deployments can use a personal API token where appropriate.

The credential stays in the connector process and is sent only as:

```text
Authorization: Bearer <token>
```

The token is never accepted as a tool argument, returned in tool output, or placed in model-visible configuration.

### Least-privilege scopes

The selected tools require the following Smartsheet access scopes, depending on which tools you enable:

- `READ_SHEETS` — search, sheet reads, columns, discussions, reports
- `WRITE_SHEETS` — add/update rows and add comments
- `CREATE_SHEETS` — create sheets

Workspace browsing/listing is also constrained by the authenticated user's provider-side access. Do not grant administrator or plan-management scopes to this connector; it exposes no seat, billing, sharing-admin, portfolio-admin, deletion, or security-management tool.

## Environment variables

```text
SMARTSHEET_API_TOKEN=                 # required
SMARTSHEET_REGION=us                  # us | eu | au
SMARTSHEET_TIMEOUT_MS=15000           # 1000..120000
SMARTSHEET_APPROVAL_SECRET=           # required for approval-gated execution
SMARTSHEET_REQUIRE_WRITE_APPROVAL=true
```

`SMARTSHEET_REGION` chooses only one of the three official production MCP origins. Tool callers cannot provide an arbitrary upstream URL, reducing SSRF and credential-forwarding risk.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
```

Run the MCP server:

```bash
npm start
```

The exposed transport is standard MCP over stdio. It can be launched by MCP clients that support local stdio servers. The connector itself then connects to Smartsheet using Streamable HTTP.

## Implemented tools

| Tool | Upstream Smartsheet MCP tool | Risk | Approval |
|---|---|---|---|
| `smartsheet.asset.search` | `search` | READ | No |
| `smartsheet.workspace.list` | `list_workspaces` | READ | No |
| `smartsheet.workspace.browse` | `browse_workspace` | READ | No |
| `smartsheet.sheet.summary.get` | `get_sheet_summary` | READ | No |
| `smartsheet.sheet.version.get` | `get_sheet_version` | READ | No |
| `smartsheet.sheet.find` | `find_in_sheet` | READ | No |
| `smartsheet.sheet.columns.get` | `get_columns` | READ | No |
| `smartsheet.sheet.create` | `create_sheet` | WRITE | Yes by default |
| `smartsheet.row.add` | `add_rows` | WRITE | Yes by default |
| `smartsheet.row.update` | `update_rows` | HIGH_RISK | Always |
| `smartsheet.discussion.list` | `list_discussions` | READ | No |
| `smartsheet.comment.add` | `add_comment` | WRITE | Yes by default |
| `smartsheet.report.list` | `list_reports` | READ | No |

No destructive Smartsheet operation is exposed. In particular, `delete_rows`, `delete_column`, `delete_attachment`, `delete_discussion`, `delete_comment`, workspace deletion, portfolio deletion, and scenario deletion are intentionally absent.

## Capability rationale

The surface is designed around common agent workflows:

1. Discover an asset with `asset.search`.
2. Inspect sheet structure with `sheet.summary.get`, `sheet.version.get`, and `sheet.columns.get`.
3. Locate exact blockers or values using `sheet.find` instead of pulling an entire sheet unnecessarily.
4. Add task/work rows with explicit approval.
5. Update existing task state only after stronger approval because Smartsheet documents row updates as permanent and without automatic undo.
6. Review collaboration context through discussions and add an approved reply.
7. Discover reports for downstream read-only analysis.

## Human approval model

READ operations can execute automatically.

WRITE operations require approval by default. Set `SMARTSHEET_REQUIRE_WRITE_APPROVAL=false` only when the embedding platform already enforces an equivalent trusted approval boundary.

HIGH_RISK operations always require approval; this cannot be disabled. `smartsheet.row.update` is HIGH_RISK because the official Smartsheet MCP documentation describes row updates as permanent and not automatically undoable.

Approval tokens are payload-bound HMAC-SHA256 values:

```text
hex(HMAC-SHA256(
  SMARTSHEET_APPROVAL_SECRET,
  toolName + "\n" + canonicalJson(argumentsWithoutApprovalToken)
))
```

A trusted approval service generates this token only after a human reviews the exact action. Changing the sheet, row, cell, value, comment, or any other approved argument invalidates the approval.

The LLM must never receive `SMARTSHEET_APPROVAL_SECRET`.

## Validation

The connector validates inputs before any upstream call:

- IDs must be positive integers or numeric ID strings.
- Search terms are bounded to Smartsheet's documented limits.
- Sheet creation requires exactly one primary column and that primary column must be `TEXT_NUMBER`.
- Column names, comments, formulas, option arrays, and row batches are bounded.
- `row.add` and `row.update` expose at most 100 rows per tool call, below Smartsheet's documented 500-row upstream batch maximum, reducing accidental blast radius.
- Find-in-sheet pagination is explicit and bounded.
- Report and discussion pagination is explicit and bounded.
- Unknown top-level tool arguments are rejected.
- No tool accepts arbitrary MCP tool names, HTTP methods, URLs, headers, or raw provider requests.

## Reliability

The connector uses a bounded request timeout through an abort signal for upstream MCP tool calls. It does not implement blind application-level retries around MCP mutations. This is intentional: after a timeout or transport failure, a remote write can be in an ambiguous state, and replaying it could duplicate rows, comments, or sheet creation.

Smartsheet MCP itself routes through the Smartsheet public API and is subject to Smartsheet API rate limiting and endpoint-specific limits. The connector therefore keeps retrieval bounded and exposes pagination rather than recursively draining entire accounts.

One notable Smartsheet limit is cell-history retrieval at 30 requests per minute per API token; this connector does not expose `get_cell_history`, specifically avoiding an easy high-volume audit-query pattern in the initial surface.

If Smartsheet returns throttling, authentication, permission, validation, or provider failures through MCP, the connector surfaces the MCP error rather than silently changing transport or permissions.

## MCP security

- Official Smartsheet-hosted MCP only; no community MCP dependency.
- Regional hostname is selected from a fixed allowlist.
- Every upstream tool is hard-allowlisted.
- On first connection, the connector verifies all required upstream tools are actually advertised.
- Newly discovered tools are not automatically callable.
- Credentials are forwarded only in the authenticated transport header.
- Upstream content is flagged as untrusted.
- Mutations pass local approval checks before the remote MCP call.
- No arbitrary MCP passthrough exists.

If Smartsheet changes or removes an expected upstream tool, the connector fails safely instead of substituting a similarly named or newly advertised capability.

## Error handling

Local failures include configuration errors, schema validation errors, missing/invalid approvals, and attempts to invoke unregistered tools. These fail before provider execution.

Upstream MCP errors are surfaced as connector errors without returning the bearer token. Permission or scope failures require operator/user action; they are not treated as a reason to expand scopes automatically.

Timeouts are surfaced without automatic mutation replay.

## Events and webhooks

Smartsheet's broader developer platform supports event-driven integration patterns, but inbound webhook hosting is intentionally outside this stdio connector. A production webhook receiver requires an externally reachable HTTPS service, independent validation, deduplication/replay controls, and its own trust boundary before events are passed to an agent.

The selected connector surface therefore focuses on interactive discovery, reading, collaboration, and approved mutations through the official MCP server.

## Testing

Normal unit tests require no live Smartsheet credentials:

```bash
npm test
```

Tests cover:

- required authentication configuration;
- regional endpoint pinning;
- tool registration and risk classification;
- strict input validation;
- deterministic read argument mapping;
- write argument mapping without leaking approval material upstream;
- write denial without approval;
- payload-bound approval acceptance/rejection;
- mandatory approval for HIGH_RISK row updates;
- refusal to invoke a non-allowlisted upstream MCP tool before any network request.

A production deployment should additionally run a small test-account smoke test against the intended Smartsheet region and verify the provider user's exact scopes/permissions.

## Usage examples

See `examples/workflows.md` for discovery, sheet inspection, targeted search, approved row creation/update, and discussion/comment workflows.

## Limitations

- The connector does not implement the entire Smartsheet MCP tool catalog.
- There is no REST fallback because all selected capabilities are natively available through Smartsheet's official MCP server.
- Destructive operations are not exposed.
- Sharing, favorites, dashboards, charts, portfolios, scenario planning, plan/seat administration, license inventory, and resource-management operations are deliberately out of scope.
- OAuth authorization-code flow and refresh-token persistence are not implemented by this local stdio process. Hosts should obtain and rotate OAuth tokens in a credential service and inject the resulting bearer token.
- Plan and environment restrictions still apply. Smartsheet documents MCP availability for Business, Enterprise, and Advanced Work Management plans, subject to regional/product availability and account governance.

This focused design keeps the connector reusable across projects while preserving Smartsheet's own permission model and adding a local safety/approval layer for AI-agent execution.
