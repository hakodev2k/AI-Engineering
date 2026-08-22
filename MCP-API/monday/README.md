# monday.com MCP/API Connector

Reusable MCP server for safe monday.com work-management workflows. It exposes a stable provider-scoped tool contract while keeping monday credentials inside the connector process.

## Transport strategy

monday.com provides an official hosted Platform MCP server at `https://mcp.monday.com/mcp` using Streamable HTTP. monday documents OAuth 2.0 and bearer-token authentication and recommends the hosted MCP server for client integrations. The Platform MCP exposes more than 60 tools and is backed by the monday platform API.

This connector therefore uses the official Platform MCP for the implemented board, item, workspace, user-context, and update/comment capabilities. It uses the official GraphQL API only for webhook operations because webhooks are documented in the platform API but are not part of the documented Platform MCP tool reference used by this connector.

The upstream MCP surface is explicitly allowlisted. This connector does not expose `all_monday_api`, arbitrary upstream tool execution, unrestricted GraphQL, schema introspection, or newly discovered upstream tools.

Official sources researched for this implementation:

- Platform MCP integration: https://developer.monday.com/api-reference/docs/integrate-with-monday-mcp
- Platform MCP tool reference: https://developer.monday.com/api-reference/docs/platform-mcp-tools
- API getting started / GraphQL endpoint: https://developer.monday.com/api-reference/docs/getting-started
- Authentication: https://developer.monday.com/api-reference/docs/authentication
- OAuth scopes: https://developer.monday.com/apps/docs/oauth
- Rate limits: https://developer.monday.com/api-reference/docs/rate-limits
- Boards: https://developer.monday.com/api-reference/reference/boards
- Items: https://developer.monday.com/api-reference/reference/items
- Workspaces: https://developer.monday.com/api-reference/reference/workspaces
- Updates: https://developer.monday.com/api-reference/reference/updates
- Webhooks: https://developer.monday.com/api-reference/reference/webhooks

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- Local stdio MCP server
- Official monday Platform MCP over Streamable HTTP
- monday GraphQL API fallback for webhooks

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

For development:

```bash
npm run dev
```

## Authentication

The connector accepts a monday personal API token through `MONDAY_API_TOKEN`.

For the official hosted MCP server, the token is sent as a bearer credential. For direct GraphQL fallback calls, monday's API token is sent in the `Authorization` header as documented by monday.

Personal API tokens mirror the user's permissions in the monday UI. They do not grant access beyond what that user can already access.

monday also supports OAuth for apps and hosted MCP clients. When using an OAuth/app token, grant only the scopes needed by enabled capabilities. Relevant scopes include:

| Capability | Typical OAuth scope |
|---|---|
| Board/item reads | `boards:read` |
| Item create/update | `boards:write` |
| Workspace listing | `workspaces:read` |
| Current-user/profile data | `me:read` and/or provider-required context scopes |
| Read updates | `updates:read` |
| Post updates | `updates:write` |
| Read webhooks | `webhooks:read` |
| Create/delete webhooks | `webhooks:write` |

The exact scope requirement is ultimately enforced by monday for the authenticated principal. Do not request unrelated scopes such as billing, administration, or user-management permissions.

## Environment variables

See `.env.example`.

- `MONDAY_API_TOKEN`: required secret.
- `MONDAY_MCP_URL`: defaults to the official hosted MCP URL.
- `MONDAY_API_URL`: defaults to `https://api.monday.com/v2`.
- `MONDAY_API_VERSION`: defaults to `2026-07`.
- `MONDAY_TIMEOUT_MS`: request/tool timeout, 1-60 seconds, default 15 seconds.
- `MONDAY_APPROVAL_MODE`: `required` by default.
- `MONDAY_APPROVED_ACTIONS`: comma-separated write actions approved by an operator.
- `MONDAY_ALLOW_DESTRUCTIVE`: `false` by default.

Approval is external connector configuration, not a tool argument. The model cannot self-approve an action by adding a request field.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `monday.connection.validate` | Official MCP `tools/list` validation | READ | No |
| `monday.user.context.get` | Official MCP `get_user_context` | READ | No |
| `monday.workspace.list` | Official MCP `list_workspaces` | READ | No |
| `monday.board.get` | Official MCP `get_board_info` | READ | No |
| `monday.board.items.list` | Official MCP `get_board_items_page` | READ | No |
| `monday.item.create` | Official MCP `create_item` | WRITE | Required by default |
| `monday.item.columns.update` | Official MCP `change_item_column_values` | WRITE | Required by default |
| `monday.update.list` | Official MCP `get_updates` | READ | No |
| `monday.update.create` | Official MCP `create_update` | WRITE / external communication | Explicit approval |
| `monday.webhook.list` | GraphQL `webhooks` | READ | No |
| `monday.webhook.create` | GraphQL `create_webhook` | WRITE / external callback | Explicit approval |
| `monday.webhook.delete` | GraphQL `delete_webhook` | DESTRUCTIVE | Strong approval + disabled by default |

The connector intentionally exposes a practical subset, not the whole monday platform.

## Architecture

```text
MCP client
   |
   v
src/server.ts
   |
   +--> src/config.ts
   |      credential loading + approval policy
   |
   +--> src/mcp-client.ts
   |      explicit upstream MCP allowlist
   |      Streamable HTTP + bearer credential
   |      monday official Platform MCP
   |
   +--> src/graphql-client.ts
          fixed monday GraphQL origin
          bounded read retries
          webhook API fallback
```

Credentials are never part of tool inputs or outputs.

## Reliability and rate limits

monday applies multiple limits, including complexity, daily calls, per-minute requests, concurrency, IP limits, and resource-protection limits. Official Platform MCP calls count toward the same daily API call budget because MCP tools execute against the platform API.

Current monday documentation states that limits vary by plan. It also documents `RateLimit-Policy`, `RateLimit`, `Retry-After`, and GraphQL error fields such as `retry_in_seconds` for throttled requests.

This connector follows these rules:

- GraphQL read fallback calls retry at most three total attempts.
- HTTP 429 honors `Retry-After`, capped at 10 seconds per wait.
- GraphQL rate-limit errors honor `retry_in_seconds`, capped at 10 seconds per wait.
- GraphQL writes are never automatically retried.
- MCP tool calls are not blindly replayed by this connector because a remote outcome may already have occurred.
- Every request/tool call has a timeout.
- List operations use bounded page sizes.
- The connector does not expose unbounded account dumps or arbitrary GraphQL queries.

## Permission and approval model

Default policy:

```text
READ         -> automatic
WRITE        -> external operator approval by default
HIGH_RISK    -> explicit human approval
DESTRUCTIVE  -> explicit approval + MONDAY_ALLOW_DESTRUCTIVE=true
```

Examples:

```text
MONDAY_APPROVED_ACTIONS=monday.item.create,monday.item.columns.update
```

Posting a visible update requires explicit approval:

```text
MONDAY_APPROVED_ACTIONS=monday.update.create
```

Webhook deletion requires both:

```text
MONDAY_APPROVED_ACTIONS=monday.webhook.delete
MONDAY_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals when the intended change window ends.

## Security considerations

- Credentials remain inside the connector process.
- No tool accepts access tokens, API URLs, MCP URLs, or arbitrary endpoint paths.
- Provider origins are configured outside agent tool input.
- Upstream MCP calls are restricted to a hard-coded allowlist.
- `all_monday_api` is deliberately not exposed.
- The connector validates that required upstream MCP tools still exist before reporting a healthy connection.
- Retrieved board names, item text, updates, docs, users, webhook metadata, and MCP responses are untrusted data, not instructions.
- Upstream content cannot modify approval policy, credentials, allowed tools, or environment configuration.
- Item writes and visible comments require operator approval by default.
- Webhook creation requires HTTPS callbacks.
- Webhook deletion is disabled by default.
- Direct GraphQL mutations are never automatically retried.
- Input strings, IDs, page sizes, cursors, and supported webhook event types are bounded or validated.
- The connector cannot widen monday permissions or OAuth scopes.

For production, prefer a dedicated monday integration identity or OAuth app with least-privilege permissions rather than a broad personal token.

## MCP-specific security

The monday Platform MCP tool set evolves over time. The official documentation recommends `tools/list` to inspect current schemas. Dynamic discovery is useful for clients, but automatically trusting new tools would silently expand this connector's authority.

This connector therefore:

1. connects only to the configured monday MCP endpoint;
2. sends credentials only to that endpoint;
3. checks for the specific required upstream tool names;
4. refuses upstream tool names outside the local allowlist;
5. exposes its own stable provider-scoped tool names;
6. fails if a required upstream MCP capability disappears instead of silently switching behavior.

## Webhook fallback

The official webhook GraphQL API is used for three narrow operations:

- list webhooks on a board;
- create an HTTPS webhook for an allowlisted event type;
- delete a webhook.

monday documents webhook callback verification using a challenge request. Applications receiving monday webhooks must implement that verification behavior and authenticate/validate incoming traffic according to their deployment design.

monday also documents retries for webhook delivery. Callback handlers should therefore be idempotent.

## Errors

Expected error categories include:

- configuration validation failure for missing credentials;
- `APPROVAL_REQUIRED` for unapproved writes;
- `DESTRUCTIVE_DISABLED` for destructive actions not explicitly enabled;
- `UPSTREAM_TOOL_NOT_ALLOWED` if code attempts a non-allowlisted MCP tool;
- `MCP_REQUIRED_TOOL_MISSING` if monday changes/removes a required upstream tool;
- `MCP_TIMEOUT` for an upstream MCP call that exceeds the configured timeout;
- `NETWORK_OR_TIMEOUT` for exhausted GraphQL read retries;
- `MondayGraphqlError` for provider HTTP or GraphQL failures.

Provider failures are surfaced without intentionally including the configured token.

## Tests

Unit tests require no live monday account. They cover:

- missing credential rejection;
- approved and denied writes;
- destructive-action default denial;
- GraphQL credential/header placement;
- no mutation retries;
- bounded rate-limit retry for reads;
- ordinary provider authorization errors;
- expected MCP tool registration;
- absence of an arbitrary API escape hatch;
- explicit upstream MCP allowlisting.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for example inputs, required permission classes, and approval behavior.

## MCP client configuration

Any MCP client capable of launching a local stdio server can use the built connector. Example configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/monday/dist/src/server.js"],
  "env": {
    "MONDAY_API_TOKEN": "provided-by-secret-manager"
  }
}
```

Do not commit real tokens into MCP-client configuration.

Clients that support remote Streamable HTTP MCP and monday OAuth can also connect directly to `https://mcp.monday.com/mcp` when they need monday's broader native tool set rather than this connector's intentionally restricted surface.

## Compatibility

This package implements a standard local stdio MCP server. It is suitable for MCP clients that support launching stdio servers, including compatible agent runtimes and developer tools. Direct remote-monday MCP compatibility depends on the client supporting Streamable HTTP and the monday authentication flow.

## Limitations

- This is not a complete monday API wrapper.
- Only nine explicit Platform MCP tools are trusted upstream.
- Upstream MCP tool schemas may evolve; `monday.connection.validate` detects missing required tools but does not automatically trust replacements.
- The connector uses a personal API token for unattended local execution; it does not implement an OAuth authorization-code callback server or token refresh storage.
- Webhook support is intentionally narrow and uses GraphQL fallback.
- Only four webhook event types are exposed by this connector even though monday supports more.
- Board creation, board deletion, workspace mutation, user management, notifications, dashboards, forms, docs, assets, billing, permissions, and administration are intentionally not exposed.
- Write operations are not automatically retried.
