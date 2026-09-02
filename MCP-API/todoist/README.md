# Todoist MCP/API Connector

A reusable stdio MCP server that exposes scoped Todoist task-management tools while isolating credentials, validating inputs, and placing human approval in front of mutations. This project is an independent integration and is not created by, affiliated with, or supported by Todoist.

## Upstream strategy

Todoist now provides an official hosted MCP server at `https://ai.todoist.net/mcp` using Streamable HTTP and OAuth. The official server can read, create, and update tasks and projects. Todoist also provides a unified API v1 at `https://api.todoist.com/api/v1`, official TypeScript/Python SDKs, webhooks, and the Sync endpoint.

This connector uses a capability-specific hybrid strategy:

- `todoist.task.search` -> official MCP `find-tasks` when `TODOIST_MCP_ACCESS_TOKEN` is configured and a search/filter is supplied; otherwise official API v1.
- `todoist.task.create` -> official MCP `add-tasks` when `TODOIST_MCP_ACCESS_TOKEN` is configured; otherwise official API v1.
- Stable atomic reads/writes for task detail/update/complete, projects, sections, comments, activity, and user info -> official API v1.

The connector never invokes newly discovered MCP tools automatically. On MCP connection it verifies that its two allowlisted upstream tools are actually advertised. An MCP failure is not silently converted into a write fallback, avoiding duplicate mutations.

## Official sources researched

- Todoist developer platform: https://developer.todoist.com/
- Todoist unified API v1: https://developer.todoist.com/api/v1/
- Official Todoist MCP source: https://github.com/Doist/todoist-mcp
- Official MCP tool-name registry: https://github.com/Doist/todoist-mcp/blob/main/src/utils/tool-names.ts
- Todoist AI/MCP help: https://www.todoist.com/help/todoist/todoist-and-ai/connect-todoist-to-an-ai-assistant-xMSzFfHng

As of 2026-09-02, Todoist documents the hosted MCP endpoint as `https://ai.todoist.net/mcp`, using OAuth and `data:read_write` for read/write assistant access.

## Runtime

Node.js 20+.

```bash
npm install
npm run build
npm test
TODOIST_API_TOKEN=... npm start
```

The exposed connector server uses MCP over stdio, so it can be launched by MCP clients capable of starting a local stdio process. The optional upstream Todoist MCP connection uses Streamable HTTP.

## Authentication and scopes

`TODOIST_API_TOKEN` is required and stays inside the connector transport. For a single-user setup, use the personal API token from Todoist Settings -> Integrations -> Developer. Multi-user applications should obtain Todoist OAuth tokens instead of sharing a personal token.

Todoist OAuth scopes relevant to this implementation are:

- `data:read`: read-only access to tasks, projects, labels, filters and application data.
- `data:read_write`: read/write access and includes `task:add` and `data:read`.
- `data:delete` and `project:delete`: deliberately not requested by this connector because no destructive tools are exposed.

The official Todoist MCP connection uses OAuth. If a host has obtained a suitable MCP OAuth bearer token, place it in `TODOIST_MCP_ACCESS_TOKEN`; otherwise the connector stays on official API v1 for the supported fallback operations. Raw credentials are never accepted as MCP tool arguments or returned to the model.

Todoist's newer OAuth applications can issue one-hour access tokens with rotating refresh tokens. Refresh-token persistence/rotation belongs in the host credential provider; this connector intentionally accepts an already-issued access token rather than exposing refresh tokens to an agent.

## Environment variables

- `TODOIST_API_TOKEN` — required API bearer token.
- `TODOIST_API_BASE_URL` — default `https://api.todoist.com/api/v1`.
- `TODOIST_MCP_URL` — default `https://ai.todoist.net/mcp`.
- `TODOIST_MCP_ACCESS_TOKEN` — optional OAuth token for official upstream MCP.
- `TODOIST_TIMEOUT_MS` — 1000..120000, default 15000.
- `TODOIST_MAX_RETRIES` — 0..5, default 2.
- `TODOIST_REQUIRE_WRITE_APPROVAL` — default true.
- `TODOIST_APPROVED_ACTIONS` — comma-separated exact action fingerprints supplied outside the LLM prompt.

## Tool list

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `todoist.task.search` | MCP preferred / REST fallback | READ | none |
| `todoist.task.get` | REST | READ | none |
| `todoist.task.create` | MCP preferred / REST fallback | WRITE | required by default |
| `todoist.task.update` | REST | WRITE | required by default |
| `todoist.task.complete` | REST | WRITE | required by default |
| `todoist.project.list` | REST | READ | none |
| `todoist.project.get` | REST | READ | none |
| `todoist.project.create` | REST | WRITE | required by default |
| `todoist.section.list` | REST | READ | none |
| `todoist.comment.list` | REST | READ | none |
| `todoist.comment.add` | REST | WRITE | required by default |
| `todoist.activity.list` | REST | READ | none |
| `todoist.user.get` | REST | READ | none |

No delete, project-delete, permission-changing, billing, invitation, or arbitrary REST/MCP passthrough tool is exposed.

## Approval model

READ operations may execute automatically. WRITE operations require approval by default. Approval is connector configuration, not an `approved=true` parameter an agent can forge.

Examples:

```text
TODOIST_APPROVED_ACTIONS=todoist.task.create:PROJECT_ID,todoist.task.complete:TASK_ID
```

Set `TODOIST_REQUIRE_WRITE_APPROVAL=false` only when the embedding system supplies equivalent human approval. The connector never allows destructive operations through its policy layer.

## Pagination and rate limiting

Todoist API v1 uses opaque cursor-based pagination on many collection endpoints, with endpoint limits up to 200 items. Inputs enforce a maximum of 200. The reusable REST client also offers capped multi-page pagination for callers/tests that need it.

Todoist documents request limits including a 1 MiB POST body limit, a 15-second standard processing timeout, and Sync-specific rate limits of 1000 partial syncs or 100 full syncs per user per 15 minutes; up to 100 Sync commands can be batched per request. This connector does not use Sync for its exposed tools.

Safe GET requests retry only on network failures, HTTP 429, and 5xx responses, using bounded exponential backoff and `Retry-After` when present. Mutations are never blindly retried. Authentication, permission, validation, and ordinary 4xx failures are not retried.

## Validation and security

- Rejects `tmp-` optimistic client IDs before sending them to REST.
- Applies strict string lengths, priority ranges, date shape, collection sizes, and pagination limits.
- Requires exactly one task/project target for comment operations.
- Uses fixed provider base URLs from configuration; tools cannot supply arbitrary URLs, preventing an agent-controlled SSRF primitive.
- Treats all task/comment/project content as untrusted data rather than instructions.
- Keeps API/MCP tokens entirely inside config/transport classes.
- Allow-lists only `find-tasks` and `add-tasks` on the upstream MCP server and verifies those names at connect time.
- Does not auto-trust tools newly advertised by the upstream MCP server.
- Does not silently fall back after an MCP write failure, preventing accidental duplicate creation.

## Error handling

Provider HTTP status and response bodies are preserved in `TodoistApiError`. 401/403 indicate credentials/scopes/permissions and require user or administrator action. Validation errors fail before external calls when possible. Network timeouts produce a distinct timeout error.

## Examples

See `examples/workflows.md`.

## Tests

```bash
npm test
```

Unit tests require no live credentials. They cover authentication configuration, credential isolation, write approval/denial, destructive denial, rate-limit retry, mutation non-retry, and cursor pagination.

## Limitations

The official MCP server exposes a broader tool set than this connector. This package intentionally uses only two allowlisted upstream MCP capabilities whose current official contracts are verified, while using API v1 for other stable operations. It does not run the interactive OAuth authorization-code flow itself or persist refresh tokens; production multi-user deployments should provide those through a secure host credential service. Todoist plan restrictions still apply to features exposed by the authenticated account.
