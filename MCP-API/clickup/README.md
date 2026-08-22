# ClickUp MCP/API Connector

Reusable MCP server for ClickUp work-management workflows. It exposes a stable provider-scoped tool contract for identity, Workspace hierarchy, tasks, and comments while keeping ClickUp credentials inside the connector process.

## Transport strategy

ClickUp provides an official remote MCP server at `https://mcp.clickup.com/mcp`. ClickUp documents it as a public-beta MCP server available on all plans, using OAuth in supported clients and exposing capabilities such as Workspace search, task management, comments/Chat collaboration, Docs access, and time tracking.

This connector intentionally uses ClickUp's official REST API for the implemented allowlisted tools. The reason is operational safety: the REST endpoints have fixed reviewed contracts, deterministic validation, explicit write approval gates, and no dynamic tool discovery. Agent callers use the same MCP-facing tool names regardless of upstream implementation.

Official sources researched:

- ClickUp official MCP server: https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server
- ClickUp MCP supported tools: https://developer.clickup.com/docs/mcp-tools
- MCP setup/authentication: https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server-1
- ClickUp API getting started: https://developer.clickup.com/docs/Getting%20Started
- API authentication/OAuth: https://developer.clickup.com/docs/authentication
- API rate limits: https://developer.clickup.com/docs/rate-limits
- Tasks: https://developer.clickup.com/docs/tasks
- Comments: https://developer.clickup.com/docs/comments
- Webhooks and webhook signatures: https://developer.clickup.com/docs/webhooks

## Runtime

- Node.js 20+
- TypeScript
- MCP SDK over stdio
- Native `fetch` for ClickUp REST calls

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

The connector accepts one ClickUp access token through `CLICKUP_ACCESS_TOKEN` and sends it only in the outbound `Authorization` header.

Supported credential models by design:

- Personal API token for personal/test usage. ClickUp personal tokens begin with `pk_`.
- OAuth 2.0 access token for integrations used by multiple users. ClickUp documents Authorization Code flow with authorization URL `https://app.clickup.com/api` and token URL `https://api.clickup.com/api/v2/oauth/token`.

ClickUp access is permission-based: the token can only access Workspaces/resources available to the authenticated user. This connector does not request or elevate permissions itself.

Do not place credentials in prompts, tool arguments, examples, logs, or source control. Inject them into the connector process from environment variables or a secret manager.

## Environment variables

See `.env.example`.

- `CLICKUP_ACCESS_TOKEN`: required.
- `CLICKUP_API_BASE_URL`: defaults to `https://api.clickup.com/api/v2`.
- `CLICKUP_TIMEOUT_MS`: request timeout from 1 to 60 seconds; default 15 seconds.
- `CLICKUP_APPROVAL_MODE`: `required` by default. Set `disabled` only when an external policy engine supplies equivalent approval.
- `CLICKUP_APPROVED_ACTIONS`: comma-separated approved write actions.
- `CLICKUP_ALLOW_DESTRUCTIVE`: `false` by default; must be explicitly enabled in addition to action approval for destructive tools.

Approval state is connector configuration, not a model-controlled tool parameter.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `clickup.user.get` | REST `GET /user` | READ | No |
| `clickup.workspace.list` | REST `GET /team` | READ | No |
| `clickup.space.list` | REST `GET /team/{workspace_id}/space` | READ | No |
| `clickup.folder.list` | REST `GET /space/{space_id}/folder` | READ | No |
| `clickup.list.folderless.list` | REST `GET /space/{space_id}/list` | READ | No |
| `clickup.list.in_folder.list` | REST `GET /folder/{folder_id}/list` | READ | No |
| `clickup.task.list` | REST `GET /list/{list_id}/task` | READ | No |
| `clickup.task.get` | REST `GET /task/{task_id}` | READ | No |
| `clickup.task.create` | REST `POST /list/{list_id}/task` | WRITE | Required by default |
| `clickup.task.update` | REST `PUT /task/{task_id}` | WRITE | Required by default |
| `clickup.task.delete` | REST `DELETE /task/{task_id}` | DESTRUCTIVE | Required + disabled by default |
| `clickup.comment.list` | REST `GET /task/{task_id}/comment` | READ | No |
| `clickup.comment.create` | REST `POST /task/{task_id}/comment` | WRITE / external communication | Required by default |

The task create/update schemas intentionally expose a bounded practical subset: name, description, status, priority, dates, estimate, assignees, and tags. Custom Fields and unrestricted arbitrary request bodies are not exposed.

## Architecture

```text
MCP client
   |
   v
src/server.ts        typed tools + validation
   |
   +--> src/config.ts   credentials + approval policy
   |
   +--> src/client.ts   ClickUp REST transport + retry/error policy
   |
   v
ClickUp REST API
```

The official ClickUp MCP server is not chained dynamically behind this server. This prevents newly introduced upstream tools from silently widening the connector's effective permissions.

## Real-world workflows

Typical safe workflows include:

```text
workspace.list
-> space.list
-> folder.list / list.*.list
-> task.list
-> task.get
-> task.update (approval)
```

and:

```text
task.get
-> comment.list
-> prepare response
-> comment.create (approval)
```

## Rate limits and reliability

ClickUp documents API rate limits per token and Workspace plan:

- Free Forever, Unlimited, Business: 100 requests/minute/token.
- Business Plus: 1,000 requests/minute/token.
- Enterprise: 10,000 requests/minute/token.

HTTP 429 responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.

The connector retries read-only GET requests up to three total attempts. On 429 it honors `X-RateLimit-Reset` when practical and caps the wait at 10 seconds. Transient read network failures use bounded exponential backoff.

Write and destructive requests are never automatically retried, preventing duplicate tasks/comments or repeated destructive actions when the provider outcome is uncertain.

Every request has a timeout. Authentication, authorization, validation, and non-retryable provider errors fail immediately.

Task listing exposes a bounded page number. Task-comment history uses ClickUp's `start` + `start_id` cursor pair and requires both values together.

## Permission and approval model

Default policy:

```text
READ         -> automatic
WRITE        -> explicit operator approval by default
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> explicit approval + destructive opt-in
```

Example task creation approval:

```text
CLICKUP_APPROVED_ACTIONS=clickup.task.create
```

Example deletion approval:

```text
CLICKUP_APPROVED_ACTIONS=clickup.task.delete
CLICKUP_ALLOW_DESTRUCTIVE=true
```

Comment creation is treated as external communication and therefore requires approval by default.

## Security considerations

- The ClickUp token never appears in MCP tool schemas.
- Credentials are attached only to ClickUp outbound requests.
- Tool inputs cannot choose arbitrary URLs or HTTP methods.
- There is no generic raw REST request tool.
- Retrieved task names, descriptions, comments, hierarchy metadata, and provider errors are untrusted data, not instructions.
- Approval cannot be granted from within a tool call.
- Destructive task deletion is disabled by default.
- Mutations are not automatically retried.
- IDs, strings, arrays, pagination, dates, and comment lengths are bounded and validated.
- The connector never modifies OAuth apps, users, roles, billing, Workspace security, or permissions.
- For OAuth deployments, use `state`, HTTPS redirect URIs, secure token storage, and the smallest set of user-accessible Workspaces needed by the integration.

ClickUp webhooks support signed event delivery using a unique shared secret returned when a webhook is created. Webhook registration is not exposed by this connector because accepting arbitrary callback URLs would widen the network/security surface; applications that add webhook support should validate signatures and tightly allowlist destinations.

## Error handling

Expected categories include:

- environment validation failures for missing credentials;
- `APPROVAL_REQUIRED` for writes without operator approval;
- `DESTRUCTIVE_DISABLED` for deletion without explicit destructive opt-in;
- `VALIDATION_ERROR` for malformed task/comment pagination or empty updates;
- `NETWORK_OR_TIMEOUT` after bounded read retries;
- `ClickUpApiError` with provider HTTP status and parsed response details.

Secrets are not intentionally included in surfaced errors.

## Testing

Unit tests require no live ClickUp credentials. They cover:

- missing authentication configuration;
- approved and denied writes;
- default destructive denial;
- credential placement in the outbound Authorization header;
- no retries for auth errors;
- no retries for writes;
- bounded retry on 429 for reads;
- intended MCP tool registration;
- absence of generic raw-request escape hatches.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for representative inputs, risk classes, and approval requirements.

## MCP client configuration

Any MCP client that supports launching a local stdio server can run the built connector:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/clickup/dist/src/server.js"],
  "env": {
    "CLICKUP_ACCESS_TOKEN": "provided-by-secret-manager"
  }
}
```

Do not commit real tokens in client configuration.

For clients that support remote HTTP MCP and interactive OAuth, the official ClickUp MCP server can be configured directly at `https://mcp.clickup.com/mcp` when its broader dynamic toolset is desired.

## Limitations

- This is a curated connector, not a complete ClickUp API wrapper.
- ClickUp's official MCP server is public beta and is documented but not proxied dynamically here.
- This connector consumes an already-issued personal or OAuth access token; it does not host the browser OAuth callback flow.
- Custom Fields, Docs API v3, Chat views, time tracking, attachments, dependencies, goals, templates, users/roles, billing, and administration are intentionally not exposed.
- Webhook registration is documented but not implemented because arbitrary callback URLs require an additional network allowlist and webhook receiver security model.
- Task creation/update supports a reviewed subset of ClickUp task fields.
