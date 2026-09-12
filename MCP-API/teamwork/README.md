# Teamwork.com MCP Connector

Reusable safety wrapper for Teamwork.com's **official MCP server**. It exposes a focused, provider-scoped set of project-management tools over local MCP STDIO while credentials stay inside the connector process.

## Upstream transport

This connector uses Teamwork.com's official MCP implementation rather than a community server or raw REST endpoints.

Official sources:

- Teamwork MCP product page: `https://www.teamwork.com/ai/mcp/`
- Hosted MCP endpoint: `https://mcp.ai.teamwork.com`
- Official implementation and tool reference: `https://github.com/Teamwork/mcp`
- Teamwork support guide: `https://support.teamwork.com/projects/TeamworkAI/use-ai-assistants-teamwork-mcp`

Teamwork's official server supports HTTP and STDIO deployments, bearer-token and OAuth-oriented authentication flows, profiles/toolsets, and read-only operation. The hosted endpoint is OAuth-secured for interactive clients; the official server also supports Teamwork API bearer tokens. This connector uses a bearer token supplied through `TEAMWORK_MCP_BEARER_TOKEN` and never puts it in an MCP tool result or model-facing prompt.

No REST fallback is currently required for the capabilities implemented here because the official MCP server exposes them directly. Unsupported capabilities are intentionally not emulated.

## Capability coverage

| Connector tool | Official upstream tool | Risk | Permission intent | Approval |
|---|---|---|---|---|
| `teamwork.project.list` | `twprojects-list_projects` | READ | projects:read | none |
| `teamwork.project.get` | `twprojects-get_project` | READ | projects:read | none |
| `teamwork.project.create` | `twprojects-create_project` | WRITE | projects:write | explicit |
| `teamwork.task.list` | `twprojects-list_tasks` | READ | tasks:read | none |
| `teamwork.task.get` | `twprojects-get_task` | READ | tasks:read | none |
| `teamwork.task.create` | `twprojects-create_task` | WRITE | tasks:write | explicit |
| `teamwork.task.update` | `twprojects-update_task` | WRITE | tasks:write | explicit |
| `teamwork.task.complete` | `twprojects-complete_task` | HIGH_RISK | tasks:write | strong explicit |
| `teamwork.user.list` | `twprojects-list_users` | READ | users:read | none |
| `teamwork.user.get` | `twprojects-get_user` | READ | users:read | none |
| `teamwork.content.search` | `twprojects-search` | READ | content:read | none |
| `teamwork.milestone.list` | `twprojects-list_milestones` | READ | milestones:read | none |
| `teamwork.timelog.list` | `twprojects-list_timelogs` | READ | time:read | none |
| `teamwork.timelog.create` | `twprojects-create_timelog` | WRITE | time:write | explicit |
| `teamwork.timelog.summarize` | `twprojects-summarize_timelogs` | READ | time:read | none |

Teamwork's published tool reference also contains many other capabilities across Projects, Desk, Spaces and Chat. This connector intentionally exposes only the allowlisted operations above. It does not expose arbitrary upstream tool execution and does not expose delete operations.

## Architecture

```text
MCP client
  -> local Teamwork connector (STDIO)
     -> policy / approval gate
     -> fixed upstream-tool mapping
     -> live upstream JSON-Schema validation
     -> official Teamwork MCP (Streamable HTTP)
        -> Teamwork.com
```

Provider data is returned with `untrusted_provider_content: true`. Retrieved project names, comments, task content and other Teamwork fields must be treated as data, not instructions that can alter connector policy.

## Authentication and permissions

Create a Teamwork API bearer token with only the account permissions needed for the operations you intend to use. Teamwork's official MCP server acts with the permissions of the connected Teamwork account; this wrapper cannot elevate them.

Required environment variable:

```text
TEAMWORK_MCP_BEARER_TOKEN=
```

Do not place the token in prompts, example tool calls, source code, logs or committed configuration. The token is inserted only into the upstream HTTP `Authorization` header inside `src/upstream.ts`.

For hosted interactive OAuth, use Teamwork's hosted MCP endpoint directly with an OAuth-capable client. This wrapper deliberately does not implement its own refresh-token store; it is designed for isolated bearer-token/service execution.

## Environment variables

```text
TEAMWORK_MCP_URL=https://mcp.ai.teamwork.com
TEAMWORK_MCP_BEARER_TOKEN=
TEAMWORK_TIMEOUT_MS=15000
TEAMWORK_MAX_READ_RETRIES=3
TEAMWORK_ALLOW_WRITES=false
TEAMWORK_ALLOW_HIGH_RISK=false
```

`TEAMWORK_MCP_URL` must use HTTPS and may not contain embedded credentials. Retry count is bounded to 0-5. Writes and high-risk operations are disabled by default.

## Installation

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run build
```

## Running

```bash
export TEAMWORK_MCP_BEARER_TOKEN="..."
npm start
```

Example MCP client configuration after building:

```json
{
  "mcpServers": {
    "teamwork-safe": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/teamwork/dist/src/server.js"],
      "env": {
        "TEAMWORK_MCP_BEARER_TOKEN": "${TEAMWORK_MCP_BEARER_TOKEN}"
      }
    }
  }
}
```

Any client capable of launching a standard MCP STDIO server can use the package. Client-specific support still depends on that client's MCP implementation.

## Validation model

Each public tool maps to exactly one fixed official Teamwork MCP tool. At connection time the connector retrieves `tools/list`, verifies every required allowlisted upstream tool exists, and compiles its live JSON Schema with AJV. Every `params` object is checked against that schema before dispatch. This prevents stale examples or ambiguous model output from bypassing the provider's current input contract.

The public wrapper schema intentionally contains only `params` and an optional approval token; the exact provider arguments are validated a second time against the live official schema. Newly discovered upstream tools are not trusted or exposed automatically.

## Permission and approval model

READ tools run without connector approval when the Teamwork account itself permits access.

WRITE tools require both:

1. `TEAMWORK_ALLOW_WRITES=true`
2. `approval: "approved"` or `approval: "approved-high-risk"`

`teamwork.task.complete` is classified HIGH_RISK because it changes workflow state. It requires:

1. `TEAMWORK_ALLOW_HIGH_RISK=true`
2. `approval: "approved-high-risk"`

Destructive operations are not implemented and the policy layer rejects the `DESTRUCTIVE` class unconditionally.

The connector cannot silently increase Teamwork account permissions. External orchestration should use the sequence **Read -> Recommend -> Prepare -> Execute** for mutations.

## Reliability and rate limits

- Each upstream call has an abort timeout controlled by `TEAMWORK_TIMEOUT_MS`.
- Only READ calls are eligible for automatic retries.
- Retry count is bounded by `TEAMWORK_MAX_READ_RETRIES` (maximum 5).
- Backoff is exponential and capped at two seconds between attempts.
- Retries are limited to transient-looking failures such as 429, timeouts, and 502/503/504 conditions.
- WRITE and HIGH_RISK operations are attempted once only, preventing blind duplicate mutations.
- Authentication, validation and permission failures are not retried.
- Pagination is passed through to the official Teamwork MCP tool schema; callers should use provider-supported page/page-size filters instead of issuing uncontrolled request loops.

The upstream MCP server is responsible for translating Teamwork API-specific rate limits and errors. The connector preserves those failures rather than converting them into successful results.

## Error handling

Startup or first use fails closed when:

- the bearer token is missing;
- the MCP URL is not HTTPS;
- a required official upstream tool is absent;
- the upstream tool does not publish an input schema.

Tool execution fails before provider invocation when:

- the tool is not allowlisted;
- arguments fail the current upstream JSON Schema;
- local write/high-risk policy is not enabled;
- required approval is missing.

## Security considerations

- Credentials remain inside the connector/auth layer and are never returned to the model.
- The MCP endpoint must be HTTPS.
- Upstream tool access is fixed and allowlisted.
- Newly discovered upstream tools are ignored.
- Teamwork content is explicitly marked as untrusted provider data.
- No arbitrary URL/request passthrough exists, reducing SSRF and privilege-escalation surface.
- No delete, permission-management, billing, or security-administration tools are exposed.
- Response strings larger than 200 KB are truncated during JSON serialization to reduce accidental context flooding.
- The connector relies on Teamwork's existing role-based permissions in addition to its own local policy gates.

## Testing

Tests do not require live Teamwork credentials.

```bash
npm test
```

Coverage includes configuration validation, HTTPS enforcement, tool registration invariants, read routing, write denial, explicit approval, no automatic retry for mutations, high-risk gating and destructive-operation denial.

Live integration testing can be performed separately with a least-privilege Teamwork test account and `TEAMWORK_MCP_BEARER_TOKEN`.

## Examples

See `examples/workflows.md` for project browsing, task listing, approved task creation/completion and time-summary workflows.

## Limitations

- This connector requires the official Teamwork MCP service (or a compatible self-hosted official Teamwork MCP endpoint) to be reachable.
- It does not implement interactive OAuth authorization or refresh-token persistence; use an externally acquired Teamwork bearer token or connect an OAuth-capable MCP client directly to Teamwork's hosted endpoint.
- Teamwork Desk, Spaces and Chat are available in the official MCP project but are outside this connector's deliberately focused capability set.
- Delete operations are intentionally absent. The official Teamwork MCP project itself documents delete operations as gated and not enabled by its shipped servers.
- Exact provider parameters can evolve. Live JSON-Schema validation is authoritative; examples are illustrative and may need adjustment when Teamwork changes an upstream schema.
