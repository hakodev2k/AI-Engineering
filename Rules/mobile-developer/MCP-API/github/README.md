# GitHub MCP/API Connector

Reusable MCP wrapper around GitHub's official MCP server. It exposes a small, stable, provider-scoped tool contract for common repository, issue, and pull-request workflows while keeping GitHub credentials inside the connector.

## Provider

GitHub

## Purpose

Use GitHub safely from MCP-compatible AI clients without exposing a raw arbitrary-request tool or automatically trusting every capability advertised by the upstream server.

## Upstream transport

Primary transport: **official GitHub remote MCP server** using Streamable HTTP.

Official endpoint:

`https://api.githubcopilot.com/mcp/`

This connector does not use a community MCP implementation and does not require a REST fallback for the implemented capabilities because all selected capabilities are supported by GitHub's official MCP server.

Official sources researched for this connector:

- GitHub MCP Server repository: `https://github.com/github/github-mcp-server`
- GitHub MCP setup documentation: `https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/set-up-the-github-mcp-server`
- Host integration/authentication: `https://github.com/github/github-mcp-server/blob/main/docs/host-integration.md`
- OAuth login: `https://github.com/github/github-mcp-server/blob/main/docs/oauth-login.md`
- GitHub App authentication: `https://github.com/github/github-mcp-server/blob/main/docs/github-app-auth.md`
- Server/tool configuration: `https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md`
- Scope filtering: `https://github.com/github/github-mcp-server/blob/main/docs/scope-filtering.md`

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`

## Architecture

```text
MCP client / AI agent
        |
        v
GitHub connector (stdio MCP)
        |
        +-- input validation
        +-- owner/repository allowlist
        +-- risk classification
        +-- human approval validation
        +-- fixed upstream tool allowlist
        +-- credential injection
        |
        v
Official GitHub remote MCP
https://api.githubcopilot.com/mcp/
        |
        v
GitHub APIs
```

The LLM receives tool results but never receives `GITHUB_ACCESS_TOKEN` or `GITHUB_APPROVAL_SECRET` from this implementation.

## Authentication

The official remote GitHub MCP server expects a valid bearer access token in the `Authorization` header. GitHub documents OAuth 2.1 as the recommended remote authentication flow, while valid PATs and application tokens may also be supplied by a client.

This package accepts a pre-obtained access token through:

```text
GITHUB_ACCESS_TOKEN=
```

The token can be, depending on your environment and GitHub configuration:

- an OAuth access token,
- a Personal Access Token,
- a GitHub App installation access token.

Prefer short-lived or fine-grained credentials and grant only the repositories and permissions required by the selected tools.

### Least privilege

The selected upstream tools primarily require repository access. Actual authorization is still enforced by GitHub and depends on the token type, repository access, organization policies, and GitHub feature permissions.

Classic PAT scope filtering is supported by the official GitHub MCP server. Fine-grained PATs and GitHub App tokens use their configured repository/permission grants rather than classic OAuth scope discovery.

## Environment variables

```text
GITHUB_ACCESS_TOKEN=
GITHUB_MCP_URL=https://api.githubcopilot.com/mcp/
GITHUB_APPROVAL_SECRET=
GITHUB_ALLOWED_OWNERS=
GITHUB_ALLOWED_REPOSITORIES=
```

`GITHUB_MCP_URL` is validated and must remain the official GitHub remote MCP endpoint.

`GITHUB_ALLOWED_OWNERS` is an optional comma-separated owner allowlist, for example:

```text
GITHUB_ALLOWED_OWNERS=octocat,my-org
```

`GITHUB_ALLOWED_REPOSITORIES` is an optional comma-separated full-name allowlist:

```text
GITHUB_ALLOWED_REPOSITORIES=octocat/hello-world,my-org/service-api
```

When both allowlists are empty, repository-scoped tools rely on the GitHub token's own permissions. Production deployments should normally configure at least one connector-side allowlist in addition to token restrictions.

## Installation

```bash
npm install
npm run build
```

## Run

```bash
npm start
```

The connector exposes a stdio MCP server suitable for MCP hosts that can launch local commands.

## Supported tools

| Connector tool | Upstream GitHub MCP tool | Risk | Approval |
| --- | --- | --- | --- |
| `github.user.get` | `get_me` | READ | No |
| `github.repository.search` | `search_repositories` | READ | No |
| `github.file.read` | `get_file_contents` | READ | No |
| `github.code.search` | `search_code` | READ | No |
| `github.issue.search` | `search_issues` | READ | No |
| `github.issue.get` | `issue_read` (`method=get`) | READ | No |
| `github.pull_request.get` | `pull_request_read` (`method=get`) | READ | No |
| `github.branch.create` | `create_branch` | WRITE | Required |
| `github.issue.create` | `issue_write` (`method=create`) | WRITE | Required |
| `github.issue.comment` | `add_issue_comment` | WRITE | Required |
| `github.pull_request.create` | `create_pull_request` | WRITE | Required |
| `github.pull_request.merge` | `merge_pull_request` | HIGH_RISK | Always required |

The connector deliberately does not expose repository deletion, permission administration, secrets management, billing operations, workflow dispatch, arbitrary file writes, or unrestricted API execution.

## Human approval model

READ operations may execute automatically.

WRITE and HIGH_RISK operations require an approval ID generated outside the model boundary. This implementation validates an HMAC-SHA256 value generated from the exact tool name with `GITHUB_APPROVAL_SECRET`.

The intended flow is:

```text
Read -> Recommend -> Human approves -> External system creates approval ID -> Execute
```

Do not place `GITHUB_APPROVAL_SECRET` in prompts, tool inputs, repository files, logs, or examples.

A merge is HIGH_RISK because it changes the target branch and can trigger CI/CD or deployment automation. It always requires explicit approval.

## Upstream MCP security

The connector applies defense in depth:

1. `GITHUB_MCP_URL` must match GitHub's official hosted MCP endpoint.
2. The connector sends `X-MCP-Tools` with a fixed 12-tool allowlist.
3. `GitHubUpstream.call()` independently rejects calls to tools not in the same local allowlist.
4. Newly discovered upstream tools are not trusted or exposed automatically.
5. GitHub credentials are injected only into the connector-to-upstream request.
6. Repository owner/full-name allowlists may further constrain repository-scoped actions.
7. Provider content is treated as untrusted data, not instructions.

## Validation

The MCP surface validates:

- repository owner and repository-name formats,
- positive issue/PR numbers,
- bounded pagination (`1..100` per page),
- bounded title/body lengths,
- allowed merge methods,
- approval ID shape,
- official upstream host/path,
- optional repository allowlists.

There is no generic `execute_any_api_request` tool.

## Reliability and timeouts

Upstream calls are bounded by a connector timeout (20 seconds by default; 30 seconds for merge).

The connector intentionally does **not** automatically retry write or merge operations. A network timeout during a write can produce an unknown outcome. Check the resulting GitHub state before attempting a manual retry.

The official GitHub MCP server and GitHub API enforce authentication, authorization, abuse protection, primary rate limits, and secondary rate limits. Rate limits vary by token type, authentication context, endpoint, and GitHub plan, so this package does not invent a single fixed numeric limit.

When GitHub throttles a request, callers should respect provider retry guidance and avoid tight retry loops. This wrapper performs no unbounded retry loop.

## Pagination

Search tools expose bounded page/per-page inputs where supported. Prefer smaller pages and narrow queries to reduce API usage and context volume.

## Errors

Errors may come from:

- local input validation,
- connector owner/repository policy,
- approval policy,
- upstream MCP connectivity,
- invalid or expired credentials,
- insufficient GitHub permissions,
- GitHub API/MCP rate limiting,
- provider validation or resource state.

Authentication and permission errors require user/admin action and should not be retried blindly.

## Prompt-injection and untrusted content

Repository files, issues, comments, PR bodies, and search results are external data. They can contain malicious or misleading instructions. Consumers must not treat retrieved content as system/developer instructions and must not use retrieved text to expand tool permissions or bypass approval policy.

## Testing

Normal unit tests require no live GitHub credentials.

```bash
npm test
```

Tests cover:

- official-host validation,
- credential configuration,
- repository allowlist enforcement,
- fixed upstream tool registration/allowlist,
- read access without approval,
- write denial without approval,
- valid approval acceptance,
- merge HIGH_RISK classification.

Live integration testing should use a disposable repository and a least-privilege token.

## Examples

See `examples/tool-calls.md`.

## Compatibility

The package itself is a standard stdio MCP server built with the official Model Context Protocol TypeScript SDK. It can be used by MCP clients that support launching stdio servers. Host-specific configuration varies; verify your client's stdio MCP support rather than assuming a particular IDE/product integration.

## Limitations

- This connector expects an already-issued GitHub access token; it does not implement the interactive OAuth authorization-code UI itself.
- Only the 12 documented capabilities are exposed.
- It does not dynamically enable GitHub MCP toolsets.
- It does not expose destructive repository deletion or administrative permission changes.
- It does not silently retry writes after ambiguous network failures.
- GitHub feature availability still depends on the authenticated account, token permissions, organization policies, and GitHub product entitlements.

## Credential isolation

Correct:

```text
Agent -> MCP tool -> connector -> credential injection -> official GitHub MCP -> GitHub
```

Incorrect:

```text
Agent prompt -> raw GitHub token
```

Keep credentials in environment variables or a process-level secret provider and restrict access to the connector process.
