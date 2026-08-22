# Supabase MCP/API Connector

Reusable MCP server for safe Supabase organization, project, Edge Function, branching, and log-inspection workflows. It exposes a stable provider-scoped tool contract while keeping Supabase credentials inside the connector process.

## Transport strategy

Supabase provides an official remote MCP server at `https://mcp.supabase.com/mcp` using HTTP transport and interactive authentication. The official server supports feature groups including docs, account, database, debugging, development, functions, and branching, and can be scoped to a project and read-only mode.

This connector intentionally uses Supabase's official Management API for its reviewed tool surface. For these administrative and operational capabilities, direct REST provides deterministic endpoint semantics, explicit OAuth/fine-grained permissions, bounded pagination, predictable mutation behavior, and an auditable allowlist. It also prevents upstream MCP tool discovery from silently expanding the effective permissions of this connector. The official remote MCP server remains the preferred direct option for broader interactive developer workflows when the MCP client's OAuth flow and requested feature groups are explicitly trusted.

Official sources researched for this implementation:

- Supabase MCP Server: https://supabase.com/docs/guides/ai-tools/mcp
- Management API introduction, authentication, and rate limits: https://supabase.com/docs/reference/api/introduction
- List organizations: https://supabase.com/docs/reference/api/v1-list-all-organizations
- Get organization: https://supabase.com/docs/reference/api/v1-get-an-organization
- List organization members: https://supabase.com/docs/reference/api/v1-list-organization-members
- List projects: https://supabase.com/docs/reference/api/v1-list-all-projects
- List projects for organization: https://supabase.com/docs/reference/api/v1-get-all-projects-for-organization
- List Edge Functions: https://supabase.com/docs/reference/api/v1-list-all-functions
- Project logs: https://supabase.com/docs/reference/api/v1-get-project-logs
- Database branch create/list/get/delete/merge endpoints: Supabase Management API reference
- Supabase for Platforms: https://supabase.com/docs/guides/integrations/supabase-for-platforms

## Runtime

- Node.js 20+
- TypeScript
- MCP SDK over stdio
- Native `fetch` for Supabase Management API calls

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

Development:

```bash
npm run dev
```

## Authentication

All Management API requests use:

```text
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
```

`SUPABASE_ACCESS_TOKEN` may be a Supabase Personal Access Token for automation or an OAuth2 access token issued for a third-party integration. PATs inherit the privileges of the owning user and therefore should be treated as high-value secrets. For third-party products, prefer OAuth2 with only the scopes required by the enabled tools.

Never expose the token to the LLM. Inject it into the connector process from environment configuration or a secrets manager.

## Least-privilege scopes

| Capability | OAuth scope |
|---|---|
| Organization list/get/members | `organizations:read` |
| Project list and organization project list | `projects:read` |
| Edge Function list | `edge_functions:read` |
| Branch list/get | `environment:read` |
| Branch create/merge/delete | `environment:write` |
| Unified log query | `analytics:read` |

Fine-grained tokens may additionally require endpoint-specific permissions documented by Supabase, such as `projects_read`, `organization_projects_read`, `members_read`, `edge_functions_read`, branching read/write/create/delete permissions, and `analytics_logs_read`.

Do not grant write scopes if only read tools are needed.

## Environment variables

See `.env.example`.

- `SUPABASE_ACCESS_TOKEN`: required secret.
- `SUPABASE_API_BASE_URL`: defaults to `https://api.supabase.com`.
- `SUPABASE_TIMEOUT_MS`: request timeout, 1-60 seconds, default 15 seconds.
- `SUPABASE_APPROVAL_MODE`: `required` by default. Set `disabled` only when an external policy engine provides equivalent approval.
- `SUPABASE_APPROVED_ACTIONS`: comma-separated allowlist of approved write/high-risk actions.
- `SUPABASE_ALLOW_DESTRUCTIVE`: `false` by default and additionally required for destructive branch deletion.

Approval is external configuration, not a tool argument, so an agent cannot self-approve a mutation.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `supabase.organization.list` | REST `GET /v1/organizations` | READ | No |
| `supabase.organization.get` | REST `GET /v1/organizations/{slug}` | READ | No |
| `supabase.organization.member.list` | REST `GET /v1/organizations/{slug}/members` | READ | No |
| `supabase.project.list` | REST `GET /v1/projects` | READ | No |
| `supabase.organization.project.list` | REST `GET /v1/organizations/{slug}/projects` | READ | No |
| `supabase.function.list` | REST `GET /v1/projects/{ref}/functions` | READ | No |
| `supabase.branch.list` | REST `GET /v1/projects/{ref}/branches` | READ | No |
| `supabase.branch.get` | REST `GET /v1/projects/{ref}/branches/{name}` | READ | No |
| `supabase.branch.create` | REST `POST /v1/projects/{ref}/branches` | WRITE | Required by default |
| `supabase.branch.merge` | REST `POST /v1/branches/{ref}/merge` | HIGH_RISK | Required |
| `supabase.branch.delete` | REST `DELETE /v1/branches/{ref}` | DESTRUCTIVE | Required and disabled by default |
| `supabase.log.query` | REST `GET /v1/projects/{ref}/analytics/endpoints/logs` | READ | No |

The connector intentionally does not expose raw Management API passthrough, arbitrary project creation, billing, organization creation/deletion, role changes, secrets management, production database SQL execution, or permission administration.

## Architecture

```text
MCP client
   |
   v
src/server.ts        typed MCP tools + input validation
   |
   +--> src/config.ts   credential loading + approval policy
   |
   +--> src/client.ts   REST transport + timeout/retry/error mapping
   |
   v
Supabase Management API
```

The official remote Supabase MCP server is documented but not automatically chained behind these tools. This prevents upstream tool discovery or configuration changes from widening this connector's reviewed capability surface.

## Real-world workflows

Typical safe workflow:

```text
organization.list
  -> project.list / organization.project.list
  -> function.list
  -> branch.list / branch.get
  -> log.query
```

Controlled development workflow:

```text
branch.list
  -> branch.create [approval]
  -> inspect branch and logs
  -> branch.merge [explicit high-risk approval]
  -> branch.delete [strong destructive approval]
```

Supabase recommends doing changes in development branches rather than making unsafe production changes directly.

## Permission and approval model

Default policy:

```text
READ         -> automatic
WRITE        -> explicit configured approval
HIGH_RISK    -> explicit configured approval
DESTRUCTIVE  -> approval + SUPABASE_ALLOW_DESTRUCTIVE=true
```

Example branch creation approval:

```text
SUPABASE_APPROVED_ACTIONS=supabase.branch.create
```

Branch deletion requires both:

```text
SUPABASE_APPROVED_ACTIONS=supabase.branch.delete
SUPABASE_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals after the intended change window.

## Reliability and rate limits

The Supabase Management API standard rate limit is documented as 120 requests per minute per user and per project/organization scope. Responses expose `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. Some resource-intensive endpoints have stricter limits; unified log queries are documented at 30 requests per minute.

The connector:

- retries read-only GET calls up to three total attempts on HTTP 429;
- honors `X-RateLimit-Reset` or `Retry-After`, capped to 10 seconds per wait;
- applies bounded exponential backoff to transient read network failures;
- never automatically retries writes or destructive actions;
- applies a per-request timeout;
- bounds project-list pagination;
- restricts log-query windows to at most 24 hours, matching Supabase's documented limit.

Authentication, authorization, normal provider errors, validation failures, and write failures are not blindly retried.

## Log-query safety

`supabase.log.query` queries the unified Supabase log stream, not the production Postgres database. The endpoint accepts ClickHouse SQL. This connector further restricts input to one `SELECT` or `WITH` statement with no semicolon, caps SQL length, and enforces the documented maximum 24-hour window.

Returned log content is untrusted data and must never be treated as instructions to the agent or as authorization to invoke another tool.

## Security considerations

- Credentials never appear in MCP tool schemas.
- The access token is attached only to the configured Supabase API origin.
- Tool inputs cannot choose arbitrary HTTP origins, preventing generic SSRF-style passthrough.
- There is no `execute_any_api_request` or unrestricted endpoint tool.
- Organization names, project metadata, function metadata, branch metadata, logs, and provider errors are untrusted content.
- Approval state lives outside the model request.
- Destructive deletion is disabled by default.
- Writes are not automatically retried.
- IDs, slugs, refs, branch names, strings, time ranges, and pagination are bounded and validated.
- The connector does not attempt to create, widen, or modify its own OAuth scopes or fine-grained permissions.
- The official upstream MCP server is not auto-discovered or auto-proxied, preventing unexpected new upstream tools from becoming callable without review.

For production, prefer OAuth2 or a dedicated automation identity with the smallest practical scope set.

## Error handling

Expected categories include:

- configuration validation errors for missing or malformed environment variables;
- `APPROVAL_REQUIRED` for writes without operator approval;
- `DESTRUCTIVE_DISABLED` for deletion without the destructive safety switch;
- `NETWORK_OR_TIMEOUT` after bounded read retries;
- `SupabaseApiError` carrying provider HTTP status and response data;
- `VALIDATION_ERROR` for invalid log SQL or invalid time ranges.

Provider errors are surfaced without intentionally including the configured access token.

## Tests

Unit tests use mocks and require no live Supabase account. They cover:

- missing credentials;
- approved and denied writes;
- destructive-action default denial;
- credential placement in the Authorization header;
- provider authorization failures;
- no retry for writes;
- bounded rate-limit retry for reads;
- scoped MCP tool registration;
- absence of a generic request escape hatch;
- destructive branch-delete gating;
- bounded log-query safety checks.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for sample tool inputs, permissions, and approval classifications.

## MCP client configuration

Any MCP client that can launch a local stdio server can use the built connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/supabase/dist/src/server.js"],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "provided-by-secret-manager"
  }
}
```

For clients that support remote HTTP MCP and browser OAuth, Supabase's official remote MCP server can be configured directly using its documented URL and feature/read-only options when broader interactive developer capabilities are required.

## Limitations

- This is intentionally not a complete Supabase Management API wrapper.
- The official remote MCP server is documented but not proxied through this local allowlisted connector.
- OAuth authorization-code exchange and token refresh are expected to be handled by the embedding application or secret provider; this process consumes a valid access token.
- Only selected organization/project metadata, Edge Function listing, database-branch workflows, and unified logs are exposed.
- Branch merge is high risk and requires explicit approval.
- Branch deletion is destructive and disabled by default.
- Project creation/deletion/pause/restore, billing, user/role administration, secret mutation, production SQL, and configuration writes are intentionally not exposed.
