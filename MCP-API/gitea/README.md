# Gitea MCP/API Connector

Reusable MCP server exposing a focused set of Gitea repository, file, issue, and pull-request operations for AI agents and MCP clients.

## Upstream transport decision

As researched on 2026-08-27, Gitea's official documentation publishes a comprehensive REST/OpenAPI API and an official Go SDK. No official Gitea MCP server is documented in the official Gitea documentation, so this connector uses the official REST API and exposes a stable MCP interface locally. It does not depend on a community MCP server.

Official sources:

- Gitea API reference: https://docs.gitea.com/api/
- Gitea API usage, authentication, pagination, and SDK guidance: https://docs.gitea.com/1.26/development/api-usage/
- Current API documentation observed during implementation: Gitea API 1.27.2, OpenAPI 3.0.3.

Gitea documents repository, issue, organization, package, user, notification, and administration operation families. This connector intentionally implements only scoped, broadly useful software-engineering workflows rather than exposing the entire API.

## Supported capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `gitea.repository.search` | REST | READ | No |
| `gitea.repository.list_mine` | REST | READ | No |
| `gitea.repository.get` | REST | READ | No |
| `gitea.repository.branches.list` | REST | READ | No |
| `gitea.file.read` | REST | READ | No |
| `gitea.issue.list` | REST | READ | No |
| `gitea.issue.get` | REST | READ | No |
| `gitea.issue.create` | REST | WRITE | Yes |
| `gitea.issue.comment.create` | REST | WRITE | Yes |
| `gitea.pull_request.list` | REST | READ | No |
| `gitea.pull_request.get` | REST | READ | No |
| `gitea.pull_request.create` | REST | WRITE | Yes |

No delete, merge, repository-administration, permission-changing, token-management, package-deletion, or arbitrary HTTP tool is exposed.

## Architecture

```text
MCP client / AI agent
        |
        v
src/server.ts      MCP tool schemas + handlers
        |
        +--> src/policy.ts   risk + approval checks
        |
        v
src/client.ts      authenticated bounded REST client
        |
        v
Gitea /api/v1
```

Credentials are read from the connector environment. They are never included in tool schemas, tool output, model-visible prompts, or example payloads.

## Authentication and permissions

Gitea officially supports API token authentication, including the `Authorization: token <token>` header used by this connector. Gitea also supports Basic Auth and HTTP signatures in documented configurations, but this connector intentionally uses API tokens because they can be scoped and isolated for automation.

Create the token in Gitea and grant only the scopes required by the enabled workflows. For this connector, use read repository/issue access for read-only deployments and add only the corresponding write scopes when write tools are required. Do not grant admin scopes.

The API token is stored only in `GITEA_TOKEN` inside the connector process.

## Environment variables

Copy `.env.example` into your secret-management workflow. The server itself does not load `.env` files automatically.

- `GITEA_BASE_URL` — required Gitea origin, for example `https://git.example.com`.
- `GITEA_TOKEN` — required Gitea API token.
- `GITEA_TIMEOUT_MS` — per-request timeout; default `15000`, allowed 1000–120000.
- `GITEA_MAX_RETRIES` — bounded read retry count; default `3`, maximum `5`.
- `GITEA_ALLOW_WRITES` — write kill switch; default `false`.
- `GITEA_APPROVAL_SECRET` — secret used to verify explicit write approval.

For production, provide secrets via a platform secret store or mounted environment and avoid placing them in repository files, command history, logs, or model context.

## Approval model

Read operations execute without approval. Every implemented write operation requires both:

1. `GITEA_ALLOW_WRITES=true`.
2. A matching `approval_id` calculated as HMAC-SHA256 of the exact MCP tool name using `GITEA_APPROVAL_SECRET`.

For example, an approval authority can compute an approval for `gitea.issue.create` outside the model process. The connector verifies the value using constant-time comparison. The model must not receive the approval secret.

This intentionally separates **recommend / prepare** from **execute**. Changing environment permissions cannot be done through any MCP tool.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
GITEA_BASE_URL=https://git.example.com \
GITEA_TOKEN="$GITEA_TOKEN" \
node dist/src/server.js
```

The server uses MCP stdio transport. Any MCP client that supports stdio servers can launch it. Client-specific configuration syntax varies; this package does not claim support for a client unless that client supports standard MCP stdio execution.

## Input validation

Schemas constrain owner/repository names, issue and pull-request indexes, result page sizes, body lengths, branch/ref lengths, and file paths. File reads reject `..` path traversal. There is no tool that accepts an arbitrary URL, raw endpoint, method, or provider request body.

Third-party repository content is treated as untrusted data. Retrieved source, issue text, comments, and metadata are returned as data only and cannot change connector permissions or configuration.

## Pagination

Gitea documents `page` and `limit` query parameters, a `Link` response header for navigation, and `x-total-count`. This connector exposes explicit `page` and `limit` values and caps tool page size at 50, matching Gitea's commonly documented default maximum response item configuration. Agents should paginate deliberately rather than fan out large request trees.

## Rate limits, retries, and errors

Gitea deployments can differ in reverse-proxy and rate-limit configuration. The client handles HTTP `429`, `502`, `503`, and `504` as transient for read operations, honors `Retry-After` when present, and otherwise uses bounded exponential backoff. Retry count is capped at five by configuration validation.

Write operations are explicitly marked non-retryable so an ambiguous network failure cannot silently duplicate an issue, comment, or pull request.

The client does not retry authorization or validation failures. HTTP provider errors are mapped to `GiteaError` with status and retry metadata where available. Cancellation and request timeouts fail closed.

## Security considerations

- Prefer HTTPS for any non-local Gitea deployment.
- Use least-privilege scoped API tokens and rotate them regularly.
- Never put tokens in tool arguments, prompts, issue bodies, logs, or examples.
- Keep writes disabled unless they are actually required.
- Keep `GITEA_APPROVAL_SECRET` separate from model-visible context and from `GITEA_TOKEN`.
- Do not treat retrieved repository content as instructions.
- This connector does not expose sudo, admin, token creation, repository deletion, branch deletion, merge, hooks, Actions secrets, or permission-changing endpoints.
- The base URL is configuration, not a tool input, preventing runtime SSRF through agent-controlled URLs.

## Tests

Unit tests use mocked `fetch` and require no live Gitea credentials.

```bash
npm test
```

Coverage includes configuration validation, token isolation in the HTTP layer, permission denial, approval verification, read pagination, HTTP error mapping, throttling retry, and prevention of blind write retries.

## Limitations

- No official Gitea MCP server was documented in official Gitea sources during this implementation, so upstream transport is REST only.
- Webhooks/events are not implemented because secure webhook receipt requires a long-running inbound HTTP component and deployment-specific verification/authorization design beyond this stdio connector.
- Administrative, destructive, merge, release, package, Actions, organization-membership, and permission-management endpoints are intentionally omitted.
- Gitea instances may run older server versions; operators should confirm the implemented `/api/v1` endpoints against their instance's `/api/swagger` or `/swagger.v1.json`.

See `examples/workflows.md` for reusable MCP call examples.
