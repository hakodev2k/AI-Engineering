# Linear MCP/API Connector

Reusable MCP wrapper around Linear's official remote MCP server. It exposes a small, stable, provider-scoped contract for issue, project, comment, user, label, and document workflows while keeping Linear credentials inside the connector.

## Provider

Linear

## Purpose

Use Linear safely from MCP-compatible AI clients without exposing arbitrary GraphQL/API execution or automatically trusting every capability that may appear on the upstream MCP server in the future.

## Supported upstream transport

Primary transport: **official Linear remote MCP server** over Streamable HTTP.

Read-write endpoint:

`https://mcp.linear.app/mcp`

Official read-only endpoint:

`https://mcp.linear.app/mcp/readonly`

Linear also documents a deprecated SSE endpoint for legacy clients, but this connector intentionally uses Streamable HTTP only.

No GraphQL/API fallback is required for the implemented capabilities because the selected operations are provided by Linear's official MCP server. Linear's official GraphQL API remains available at `https://api.linear.app/graphql` and is documented as a fallback option for capabilities not exposed by MCP.

## Official sources researched

- Linear MCP server documentation: `https://linear.app/docs/mcp`
- GraphQL API: `https://linear.app/developers/graphql`
- OAuth 2.0 authentication: `https://linear.app/developers/oauth-2-0-authentication`
- OAuth actor authorization: `https://linear.app/developers/oauth-actor-authorization`
- TypeScript SDK: `https://linear.app/developers/sdk`
- Rate limiting: `https://linear.app/developers/rate-limiting`
- Agents: `https://linear.app/developers/agents`

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`

## Architecture

```text
MCP client / AI agent
        |
        v
Linear connector (stdio MCP)
        |
        +-- strict input validation
        +-- team/project allowlists
        +-- fixed upstream tool allowlist
        +-- risk classification
        +-- out-of-band approval validation
        +-- credential injection
        |
        v
Official Linear remote MCP
https://mcp.linear.app/mcp
        |
        v
Linear
```

Retrieved Linear content is external untrusted data. It must never be interpreted as system/developer instructions or used to expand permissions.

## Authentication

Linear's official MCP supports interactive OAuth 2.1 with dynamic client registration. It also accepts OAuth access tokens and Linear API keys directly in the `Authorization: Bearer <token>` header.

This connector expects a pre-obtained token through:

```text
LINEAR_ACCESS_TOKEN=
```

Use one of:

- OAuth access token for an end user or app actor,
- Linear API key where appropriate.

For reusable multi-user applications, prefer OAuth. For agents/service accounts, Linear documents `actor=app` during OAuth authorization so mutations can be attributed to the application rather than the installing user.

For read-only operation, use either:

- `LINEAR_MCP_URL=https://mcp.linear.app/mcp/readonly`, or
- a token restricted to Linear's read scope/permission.

## Environment variables

```text
LINEAR_ACCESS_TOKEN=
LINEAR_MCP_URL=https://mcp.linear.app/mcp
LINEAR_APPROVAL_SECRET=
LINEAR_ALLOWED_TEAM_IDS=
LINEAR_ALLOWED_PROJECT_IDS=
```

`LINEAR_MCP_URL` is validated and may only be one of Linear's official Streamable HTTP endpoints.

Optional connector-side resource boundaries:

```text
LINEAR_ALLOWED_TEAM_IDS=team-id-a,team-id-b
LINEAR_ALLOWED_PROJECT_IDS=project-id-a,project-id-b
```

These controls are defense in depth and do not replace Linear's own token/workspace authorization.

## Installation

```bash
npm install
npm run build
```

## Run

```bash
npm start
```

The package exposes a stdio MCP server for hosts that can launch local MCP commands.

## Supported tools

| Connector tool | Upstream MCP tool | Risk | Approval |
| --- | --- | --- | --- |
| `linear.issue.list` | `list_issues` | READ | No |
| `linear.issue.get` | `get_issue` | READ | No |
| `linear.project.list` | `list_projects` | READ | No |
| `linear.project.get` | `get_project` | READ | No |
| `linear.comment.list` | `list_comments` | READ | No |
| `linear.user.list` | `list_users` | READ | No |
| `linear.label.list` | `list_issue_labels` | READ | No |
| `linear.issue.save` | `save_issue` | WRITE | Required |
| `linear.project.save` | `save_project` | WRITE | Required |
| `linear.document.save` | `save_document` | WRITE | Required |

The connector deliberately does not expose arbitrary GraphQL execution, raw API calls, workspace administration, billing changes, permission management, or deletion tools.

## Human approval model

READ tools may execute automatically.

WRITE tools require an approval ID generated outside the model boundary. The connector expects HMAC-SHA256 of the exact connector tool name using `LINEAR_APPROVAL_SECRET`.

Example flow:

```text
Read -> Recommend -> Human approves -> external approver creates HMAC -> Execute
```

Do not expose `LINEAR_APPROVAL_SECRET` to the AI model.

## Tool schemas and validation

The connector validates:

- bounded text/query lengths,
- positive bounded list limits,
- issue/project/team identifier presence where relevant,
- Linear project/team allowlists,
- 64-character approval IDs,
- official MCP endpoint host/path.

Write calls remove `approvalId` before forwarding parameters upstream.

## Upstream MCP security

The connector uses a fixed upstream allowlist of exactly ten Linear MCP tools. It does not dynamically discover and expose newly added upstream capabilities.

`LinearUpstream.call()` rejects any tool not included in that local allowlist.

Credentials are injected only on the connector-to-Linear MCP request and are never returned in MCP output.

## Reliability and timeouts

Every upstream call has a bounded 20-second timeout.

The connector intentionally does **not** automatically retry writes. If a write times out after reaching Linear, the outcome may be unknown. Inspect the issue/project/document before manually retrying.

Authentication, permission, and validation errors should not be retried blindly.

## Rate limits

Linear's GraphQL API documents request and complexity rate limits and returns rate-limit headers such as:

- `X-RateLimit-Requests-Limit`
- `X-RateLimit-Requests-Remaining`
- `X-RateLimit-Requests-Reset`
- complexity-related headers

Linear currently documents different request limits depending on authentication type and may apply endpoint-specific limits. Because the official MCP server is managed by Linear and can evolve independently, this connector does not invent a fixed MCP numeric quota.

Avoid polling. Linear explicitly recommends webhooks for change-driven integrations when using the API.

## Pagination and context size

List/search tools expose a bounded `limit` of at most 100 where applicable. Narrow queries and smaller limits reduce context volume and unnecessary provider work.

## Errors

Possible failure classes include:

- local Zod validation,
- connector allowlist policy,
- missing/invalid approval,
- MCP network timeout,
- invalid/expired token,
- insufficient Linear permissions,
- unavailable resource,
- provider-side validation or rate limiting.

A GraphQL fallback implementation would also need to inspect Linear's GraphQL `errors` array even when HTTP status is 200; this connector does not currently route implemented tools through GraphQL.

## Security considerations

- Keep `LINEAR_ACCESS_TOKEN` and `LINEAR_APPROVAL_SECRET` in environment variables or a secure secret provider.
- Prefer least-privilege OAuth scopes/API-key permissions.
- Use the read-only MCP endpoint when write access is unnecessary.
- Configure team/project allowlists for production agents when practical.
- Treat issue descriptions, comments, project documents, and other retrieved text as untrusted external content.
- Never allow retrieved text to change system instructions, connector configuration, scopes, approval rules, or allowlists.
- Do not log bearer tokens or approval secrets.

## OAuth details

For integrations intended for other users, Linear recommends OAuth2 for its API. Linear's MCP interactive flow uses OAuth 2.1.

Linear's OAuth API documentation states that applications use authorization-code flow and, as of April 1, 2026, OAuth applications use the newer refresh-token system.

For AI agents or service accounts, Linear's app actor authorization can make mutations appear from the installed app identity. Optional `app:assignable` and `app:mentionable` scopes enable the app to be assigned or mentioned where needed; this connector does not require those scopes for its core operations unless your specific workflow does.

## API/SDK fallback strategy

If a future required capability is not offered by Linear MCP, the preferred fallback is Linear's official GraphQL API or official TypeScript SDK.

Official GraphQL endpoint:

`https://api.linear.app/graphql`

The SDK is `@linear/sdk`.

Any fallback should preserve the same external provider-scoped MCP tool contract and request only the minimum required permissions.

## Testing

Unit tests require no live Linear credentials.

```bash
npm test
```

Tests cover:

- official MCP host validation,
- read-only endpoint acceptance,
- team/project allowlists,
- fixed upstream allowlist,
- absence of arbitrary request tools,
- read execution without approval,
- write denial without approval,
- valid out-of-band approval acceptance.

Use a disposable Linear workspace/project for live integration testing.

## Examples

See `examples/tool-calls.md`.

## Compatibility

This package is a standard stdio MCP server using the Model Context Protocol TypeScript SDK. It can be launched by MCP hosts that support stdio child-process servers. Host-specific configuration differs across clients.

Linear's remote MCP itself documents native setup for Claude, Cursor, VS Code, Codex, Windsurf, Zed, and other compatible clients, but this local wrapper should only be claimed compatible with hosts that can launch its stdio command.

## Limitations

- Interactive OAuth UI is not implemented by this wrapper; supply an already-issued token/API key.
- Exactly ten Linear capabilities are exposed.
- No destructive/delete operations are exposed.
- No arbitrary GraphQL/API executor is exposed.
- Newly added upstream MCP tools are not trusted automatically.
- Writes are not automatically retried after ambiguous failures.
- Team/project allowlists can only constrain operations when the relevant identifier is present in the connector call; Linear's own auth remains the authoritative security boundary.

## Credential isolation

Correct:

```text
Agent -> connector tool -> connector auth layer -> official Linear MCP -> Linear
```

Incorrect:

```text
Agent prompt -> raw Linear token
```
