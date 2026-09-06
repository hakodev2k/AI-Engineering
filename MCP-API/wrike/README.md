# Wrike MCP Connector

Reusable MCP adapter for Wrike that exposes a stable, provider-scoped tool surface while delegating operations to Wrike's official MCP v2 server.

## Provider

Wrike — enterprise work management and project collaboration.

## Transport strategy

This connector uses Wrike's official remote MCP v2 endpoint over Streamable HTTP:

- `https://mcp.wrike.com/v2`
- Official MCP documentation: https://developers.wrike.com/docs/wrike-mcp-server-overview
- Official MCP tool catalog: https://developers.wrike.com/docs/available-tools-on-wrike-mcp
- Generic MCP client setup: https://developers.wrike.com/docs/setup-other-mcp-clients-with-wrike-mcp
- Wrike developer platform: https://developers.wrike.com/docs/introduction

Wrike MCP v2 currently provides all capabilities implemented by this connector, so no REST fallback is required for this package. Wrike's REST API v4 remains available for capabilities outside this connector's selected surface, including webhooks and other administrative features.

## Why the connector discovers schemas at runtime

Wrike publishes a fixed MCP tool set, but MCP input schemas may evolve. This connector keeps a hard-coded allowlist of exactly 17 approved Wrike MCP v2 tools, discovers those tools from the official server at runtime, and reuses Wrike's current official `inputSchema` for downstream MCP clients. Unknown or newly added upstream tools are not automatically exposed.

This prevents stale hand-written schemas and avoids silently granting new capabilities after an upstream change.

## Supported capabilities

| Connector tool | Upstream Wrike MCP tool | Risk | Approval |
|---|---|---|---|
| `wrike.space.search` | `search_spaces` | READ | No |
| `wrike.item.children.read` | `get_items_children` | READ | No |
| `wrike.inbox.read` | `get_my_inbox` | READ | No |
| `wrike.item.search` | `search_items` | READ | No |
| `wrike.user.search` | `search_users` | READ | No |
| `wrike.user.get` | `get_users` | READ | No |
| `wrike.item.read` | `get_item_details` | READ | No |
| `wrike.item.comments.read` | `get_item_comments` | READ | No |
| `wrike.task.create` | `create_task_item` | WRITE | Yes |
| `wrike.project_folder.create` | `create_project_folder_item` | WRITE | Yes |
| `wrike.item.update` | `update_items` | WRITE | Yes |
| `wrike.item.comment.create` | `create_item_comment` | WRITE | Yes |
| `wrike.workflow.search` | `search_workflows` | READ | No |
| `wrike.custom_item_type.search` | `search_customitemtypes` | READ | No |
| `wrike.custom_field.search` | `search_item_customfields` | READ | No |
| `wrike.approval.read` | `get_approvals` | READ | No |
| `wrike.approval.search` | `search_approvals` | READ | No |

Wrike's official catalog classifies 13 of these tools as read operations and four as write operations.

## Architecture

```text
AI / MCP client
    |
    v
Wrike connector (stdio MCP server)
    |-- fixed tool allowlist
    |-- runtime Wrike schema discovery
    |-- READ/WRITE permission gate
    |-- human-approval gate for writes
    |-- input-size validation
    |-- credential isolation
    v
Official Wrike MCP v2 (Streamable HTTP)
    |
    v
Wrike workspace
```

Provider credentials stay inside the connector process and are only attached to requests sent to `mcp.wrike.com`.

## Authentication

Wrike recommends OAuth 2.0 for team or multi-user integrations. Wrike also supports Permanent Access Tokens for individual use and testing.

This adapter accepts an already-issued Wrike bearer credential through `WRIKE_ACCESS_TOKEN` and sends it only in the HTTP `Authorization: Bearer ...` header to the official Wrike MCP host.

For production OAuth deployments, a surrounding credential broker or secret manager should obtain and rotate the user-scoped OAuth access token and inject it into the connector process. Do not put access tokens, refresh tokens, client secrets, or permanent tokens into model prompts.

Wrike's PAT guidance: https://developers.wrike.com/docs/mcp-legacy-authentication-pat

## Required permissions and scopes

The effective permission boundary is the authenticated Wrike user's own workspace permissions. The Wrike MCP server applies those permissions to reads and writes.

The connector adds a second local boundary:

- Default: `READ` only.
- `WRITE`: must be explicitly enabled with `WRIKE_ALLOWED_RISKS=READ,WRITE`.
- Every write also requires a host-injected `approvalToken` matching `WRIKE_APPROVAL_TOKEN`.
- No destructive Wrike delete tool is exposed.

Do not configure a broader Wrike identity than the workflow requires.

## Environment variables

Copy `.env.example` and configure the process environment.

```text
WRIKE_MCP_URL=https://mcp.wrike.com/v2
WRIKE_ACCESS_TOKEN=
WRIKE_ALLOWED_RISKS=READ
WRIKE_APPROVAL_TOKEN=
WRIKE_TIMEOUT_MS=20000
WRIKE_MAX_INPUT_BYTES=131072
```

`WRIKE_MCP_URL` is restricted in code to HTTPS on `mcp.wrike.com` to reduce SSRF and accidental credential forwarding risk.

## Installation

Requirements:

- Node.js 20 or newer
- npm
- Network access to `https://mcp.wrike.com/v2`
- A valid Wrike OAuth access token or Permanent Access Token

```bash
npm install
npm run build
```

## Running

```bash
npm start
```

The connector exposes an MCP server over stdio and can therefore be launched by MCP clients that support local stdio servers.

Example client configuration:

```json
{
  "mcpServers": {
    "wrike-safe-adapter": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/wrike/dist/src/server.js"],
      "env": {
        "WRIKE_ACCESS_TOKEN": "${WRIKE_ACCESS_TOKEN}",
        "WRIKE_ALLOWED_RISKS": "READ"
      }
    }
  }
}
```

The actual secret should come from the client's secure environment or secret provider, not a checked-in configuration file.

## Approval behavior

Writes can create work, change project/task data, or send comments to other users. They therefore require explicit human approval.

Recommended host flow:

```text
Read / analyze
    -> prepare proposed write
    -> show user the exact intended change/message
    -> user approves
    -> host injects approvalToken outside model context
    -> connector verifies token
    -> connector strips token
    -> Wrike MCP write executes
```

The approval token is connector-local and is never sent to Wrike.

## Reliability and errors

The adapter:

- Applies a bounded request timeout.
- Surfaces authentication and permission failures without retrying them.
- Normalizes rate-limit/throttling failures into a stable error.
- Leaves retry scheduling to the caller so retries can remain bounded and context-aware.
- Does not blindly retry write operations.
- Rejects oversized input before sending it upstream.

Wrike's REST API documentation reports an approximate API limit of 400 requests per minute and recommends exponential backoff on HTTP 429 responses. Wrike does not document that REST figure as a guaranteed MCP v2 quota, so this connector does not claim a fixed MCP rate limit.

## Security considerations

- Upstream host is pinned to `mcp.wrike.com` over HTTPS.
- The model never receives provider credentials from the connector.
- Upstream MCP tool discovery is filtered through a fixed allowlist.
- Newly discovered Wrike tools are denied until the connector is deliberately updated.
- Wrike content is treated as untrusted data, not instructions.
- Write tools require both local WRITE permission and explicit approval.
- Destructive delete operations are not exposed.
- Input payload size is capped.
- The approval token must be injected by the host after human confirmation and must not be included in prompt context.

Wrike documents that its MCP server honors the authenticated user's existing permissions and does not cache workspace data in the MCP server.

## Webhooks and events

Wrike supports secure webhooks through REST API v4, including HMAC-SHA256 payload signing. They are intentionally not implemented in this connector because the selected tool surface is fully covered by the official MCP server and this package does not run an inbound HTTP webhook receiver.

Official webhook documentation: https://developers.wrike.com/docs/webhooks

## Testing

Unit tests do not require live credentials.

```bash
npm test
```

The test suite verifies:

- Exactly 17 approved upstream tools are allowlisted.
- Stable external tool names map to the intended Wrike MCP tools.
- Read operations do not require approval.
- Write operations are denied by default.
- Write operations require the correct human approval token.
- Approval tokens are stripped before upstream execution.
- Oversized inputs are rejected.

Live integration testing should be performed separately in a non-production Wrike workspace using a least-privilege identity.

## Limitations

- This package relies on Wrike MCP v2 availability and its advertised tool schemas.
- It does not implement an interactive OAuth browser flow; provide an already-issued bearer credential through a secure host credential broker.
- It does not expose delete operations, billing operations, permission administration, or arbitrary Wrike REST requests.
- It does not expose REST webhooks because an inbound webhook service is outside this stdio MCP connector's runtime model.
- If Wrike renames or removes an allowlisted MCP tool, that tool disappears from downstream discovery until this connector is deliberately reviewed and updated.

## Official sources researched

- Wrike MCP Server Overview: https://developers.wrike.com/docs/wrike-mcp-server-overview
- Available tools on Wrike MCP: https://developers.wrike.com/docs/available-tools-on-wrike-mcp
- Setup other MCP clients: https://developers.wrike.com/docs/setup-other-mcp-clients-with-wrike-mcp
- Wrike developer platform: https://developers.wrike.com/docs/introduction
- Wrike MCP PAT authentication: https://developers.wrike.com/docs/mcp-legacy-authentication-pat
- Wrike webhooks: https://developers.wrike.com/docs/webhooks
- Wrike API FAQ / rate limits: https://developers.wrike.com/docs/faq
