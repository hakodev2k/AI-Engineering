# Asana MCP/API Connector

Reusable local MCP server for Asana work-management workflows. It exposes a stable provider-scoped tool contract for users, workspaces, projects, tasks, and comments while keeping Asana credentials inside the connector process.

## Transport strategy

Asana provides an official generally available MCP V2 server at `https://mcp.asana.com/v2/mcp` using Streamable HTTP and OAuth. Its current tool set includes search/read operations plus task/project/comment writes. Asana explicitly documents that MCP app tokens are workspace-scoped, valid only for the MCP server, and automatically receive access to the available MCP tools rather than granular REST scopes.

For direct MCP clients that can perform Asana's OAuth flow, the official server is the preferred integration. This connector intentionally uses Asana's official REST API for its implemented tool surface because REST OAuth scopes allow a reusable agent runtime to enforce least privilege, stable schemas, independent approval gates, bounded retries, and a reviewed allowlist. It does not proxy newly discovered upstream MCP tools automatically.

Official sources researched:

- MCP overview: https://developers.asana.com/docs/mcp-server
- MCP V2 integration: https://developers.asana.com/docs/integrating-with-asanas-mcp-server
- MCP tools reference: https://developers.asana.com/docs/mcp-tools-reference
- REST API reference: https://developers.asana.com/reference/rest-api-reference
- Authentication: https://developers.asana.com/docs/authentication
- OAuth: https://developers.asana.com/docs/oauth
- Personal access tokens: https://developers.asana.com/docs/personal-access-token
- Rate limits: https://developers.asana.com/docs/rate-limits
- Tasks: https://developers.asana.com/reference/tasks
- Projects: https://developers.asana.com/reference/projects
- Stories/comments: https://developers.asana.com/reference/stories
- Workspaces: https://developers.asana.com/reference/workspaces

## Runtime

- Node.js 20+
- TypeScript
- Model Context Protocol SDK over stdio
- Native `fetch` for Asana REST calls

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

Set `ASANA_ACCESS_TOKEN` to either an OAuth access token or a Personal Access Token. OAuth is preferred for multi-user production applications; PAT is appropriate for single-user scripts and controlled service-style integrations. The connector sends the token only as the outbound `Authorization: Bearer ...` header.

Asana OAuth uses the authorization-code flow and supports PKCE. OAuth access tokens typically expire after one hour and can be refreshed by a secure server using the OAuth refresh token. Refresh-token handling is intentionally outside this stateless connector process so a deployment can use its existing secure credential provider.

Never pass access tokens, refresh tokens, client secrets, or PATs through MCP tool arguments or model prompts. Inject them through the process environment or a secret manager.

## Least-privilege scopes

For the complete tool set, register only the scopes required by the tools you actually enable:

| Capability | Scope |
|---|---|
| Current user | `users:read` |
| Workspace listing | `workspaces:read` |
| Project reads | `projects:read` |
| Task reads/search | `tasks:read` |
| Task create/update/project membership | `tasks:write` |
| Comment reads | `stories:read` |
| Comment create | `stories:write` |

If a deployment only needs reads, omit all write scopes. The connector never attempts to widen scopes or alter authorization.

## Environment variables

See `.env.example`.

- `ASANA_ACCESS_TOKEN`: required bearer token.
- `ASANA_API_BASE_URL`: defaults to `https://app.asana.com/api/1.0`.
- `ASANA_TIMEOUT_MS`: request timeout from 1 to 60 seconds; default 15 seconds.
- `ASANA_APPROVAL_MODE`: `required` by default.
- `ASANA_APPROVED_ACTIONS`: comma-separated write actions approved by an operator.
- `ASANA_ALLOW_DESTRUCTIVE`: reserved safety switch; destructive tools are not exposed by this connector.

Approval is controlled outside the model request. An agent cannot self-approve by adding a tool parameter.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `asana.user.me` | REST `GET /users/me` | READ | No |
| `asana.workspace.list` | REST `GET /workspaces` | READ | No |
| `asana.project.list` | REST `GET /projects` | READ | No |
| `asana.project.get` | REST `GET /projects/{gid}` | READ | No |
| `asana.task.list` | REST `GET /tasks` | READ | No |
| `asana.task.search` | REST `GET /workspaces/{gid}/tasks/search` | READ | No |
| `asana.task.get` | REST `GET /tasks/{gid}` | READ | No |
| `asana.task.create` | REST `POST /tasks` | WRITE | Required by default |
| `asana.task.update` | REST `PUT /tasks/{gid}` | WRITE | Required by default |
| `asana.task.complete` | REST `PUT /tasks/{gid}` | WRITE | Required by default |
| `asana.task.add_project` | REST `POST /tasks/{gid}/addProject` | WRITE | Required by default |
| `asana.comment.list` | REST `GET /tasks/{gid}/stories` | READ | No |
| `asana.comment.create` | REST `POST /tasks/{gid}/stories` | WRITE | Required by default |

Advanced task search is an Asana Premium feature and can return HTTP 402 for non-Premium users. Use `asana.task.list` when advanced search is unavailable.

## Architecture

```text
MCP client
   |
   v
src/server.ts        strict schemas + scoped MCP tools
   |
   +--> src/config.ts   bearer-token loading + approval policy
   |
   +--> src/client.ts   REST transport + timeout/retry/error mapping
   |
   v
Asana REST API
```

The official Asana MCP V2 server is not chained automatically. This avoids silently expanding the connector's effective permissions when Asana adds new MCP tools.

## Permission and approval model

Default policy:

```text
READ         -> automatic
WRITE        -> external operator approval by default
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> not exposed by this connector
```

Examples:

```text
ASANA_APPROVED_ACTIONS=asana.task.create
```

or for a controlled batch of allowed write actions:

```text
ASANA_APPROVED_ACTIONS=asana.task.update,asana.task.complete,asana.comment.create
```

Remove temporary approvals after the intended operation window.

## Reliability and rate limits

Asana applies rate limits per authorization token. Its documented standard minute quotas are 150 requests/minute for free domains and 1,500 requests/minute for paid domains, with additional limiters possible. HTTP 429 responses include `Retry-After`.

The connector retries read-only GET requests at most three total attempts. It honors `Retry-After`, capped at 10 seconds per wait, and uses bounded exponential backoff for transient network failures. Mutation requests are never automatically retried because an uncertain remote outcome could duplicate a task, comment, or workflow change.

Every request has an abort timeout. Authentication, authorization, validation, provider errors, and write failures are returned immediately. Pagination is bounded to a maximum page size of 100.

## Validation and safety

- GIDs must be decimal strings with bounded length.
- Task creation requires a workspace, project, or parent context.
- Task listing requires either a project or a workspace+assignee pair.
- Update tools expose only reviewed fields; no arbitrary JSON request tool exists.
- Project positioning rejects simultaneous `insert_before` and `insert_after` anchors.
- Tool strings, pagination sizes, dates, and arrays are bounded.
- Asana-returned task descriptions, project text, comments, names, attachments, and errors are untrusted data, not agent instructions.
- Credentials never appear in tool schemas or normal tool output.
- The connector does not expose task deletion, project deletion, membership/permission administration, billing, app administration, or arbitrary provider requests.

## Error handling

Expected categories include:

- configuration validation failure for missing credentials;
- `APPROVAL_REQUIRED` for writes without operator authorization;
- `VALIDATION_ERROR` for unsafe or ambiguous inputs;
- `NETWORK_OR_TIMEOUT` after bounded transient read retries;
- `AsanaApiError` carrying provider HTTP status and response details;
- HTTP 401 for invalid/expired tokens;
- HTTP 403 for insufficient user access or OAuth scopes;
- HTTP 402 for Premium-only advanced search;
- HTTP 429 for throttling.

Provider errors are surfaced without intentionally including the configured token.

## Testing

Unit tests use mocks and require no live Asana credentials. They cover:

- missing credential configuration;
- approved and denied writes;
- credential placement in the provider HTTP layer;
- authorization errors without retry;
- no mutation retries;
- bounded read throttling retries;
- expected MCP tool registration;
- absence of a generic request escape hatch.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for inputs, required scopes, and approval classifications.

## MCP client configuration

Any client that supports launching a local stdio MCP server can run the built connector:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/asana/dist/src/server.js"],
  "env": {
    "ASANA_ACCESS_TOKEN": "provided-by-secret-manager"
  }
}
```

For clients that support Streamable HTTP plus Asana's interactive OAuth flow, the official Asana MCP V2 endpoint may instead be configured directly at `https://mcp.asana.com/v2/mcp` when the broader official MCP tool surface is desired.

## Limitations

- This is a deliberately scoped connector, not a complete Asana API wrapper.
- The official Asana MCP server is documented and preferred for direct MCP clients, but is not proxied through this local server.
- MCP tokens cannot be reused with the REST API; REST and MCP authentication are intentionally separate.
- OAuth refresh-token storage/rotation belongs in the deployment credential provider, not in MCP tool arguments.
- Advanced task search may require a Premium workspace/user.
- Project creation/update, task deletion, webhook management, attachments, portfolios, goals, custom fields, and administrative operations are intentionally not exposed.
- Comment creation supports plain text only in this connector.
