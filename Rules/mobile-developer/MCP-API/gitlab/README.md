# GitLab MCP/API Connector

Reusable MCP server for GitLab workflows. It exposes a stable provider-scoped tool contract while routing selected capabilities to GitLab's official MCP server when configured and using the official GitLab REST API for fallback or capabilities where REST is the more direct transport.

## Upstream strategy

GitLab provides an official MCP server at `https://<gitlab-host>/api/v4/mcp`. As of August 2026 it is Beta and supports HTTP transport, OAuth 2.0 Dynamic Client Registration, and GitLab workflow tools including issue, merge request, search, and pipeline operations. This connector allowlists only the upstream MCP tools it intentionally uses.

Transport routing:

| Connector tool | Preferred transport | Fallback |
|---|---|---|
| `gitlab.project.search` | REST | — |
| `gitlab.project.get` | REST | — |
| `gitlab.repository.file.read` | REST | — |
| `gitlab.issue.get` | Official MCP `get_issue` | REST |
| `gitlab.issue.create` | Official MCP `create_issue` | REST |
| `gitlab.issue.comment` | REST | — |
| `gitlab.merge_request.list` | Official MCP `list_merge_requests` | REST |
| `gitlab.merge_request.get` | Official MCP `get_merge_request` | REST |
| `gitlab.merge_request.create` | Official MCP `create_merge_request` | REST |
| `gitlab.merge_request.comment` | Official MCP `create_merge_request_note` | REST |
| `gitlab.pipeline.list` | Official MCP `list_pipelines` | REST |
| `gitlab.pipeline.retry` | REST | — |

The upstream MCP path is optional because GitLab MCP requires OAuth authorization with the `mcp` scope and GitLab instance prerequisites. If `GITLAB_MCP_ACCESS_TOKEN` is absent, supported operations use REST without changing the external tool contract.

## Official sources

- GitLab MCP server: https://docs.gitlab.com/user/model_context_protocol/mcp_server/
- GitLab MCP server tools: https://docs.gitlab.com/user/model_context_protocol/mcp_server_tools/
- GitLab REST authentication: https://docs.gitlab.com/api/rest/authentication/
- GitLab access-token scopes: https://docs.gitlab.com/security/tokens/access_token_scopes/
- Repository files API: https://docs.gitlab.com/api/repository_files/
- Projects API: https://docs.gitlab.com/api/projects/
- Issues API: https://docs.gitlab.com/api/issues/
- Merge requests API: https://docs.gitlab.com/api/merge_requests/
- Pipelines API: https://docs.gitlab.com/api/pipelines/
- REST pagination: https://docs.gitlab.com/api/rest/#pagination

## Architecture

```text
MCP client
   |
   v
GitLab connector MCP server (stdio)
   |
   +--> approval + validation + tool allowlist
   |
   +--> official GitLab MCP (OAuth `mcp` token, optional)
   |       \--> REST fallback on MCP failure
   |
   \--> official GitLab REST API
            \--> bounded retries for safe reads only
```

Credentials are read only inside the connector. They are never returned by tools or injected into agent-visible prompts.

## Requirements

- Node.js 20 or later.
- A GitLab account/token able to access the intended projects.
- Optional GitLab MCP prerequisites enabled by the GitLab instance/group administrator when using upstream MCP.

## Authentication and scopes

`GITLAB_TOKEN` authenticates REST requests. GitLab REST supports OAuth 2.0 access tokens and personal/project/group access tokens. The connector sends the credential with `Authorization: Bearer`.

Use least privilege:

- Read-only deployments: prefer `read_api` and `read_repository` when those scopes cover the selected endpoints.
- Deployments using issue/MR comments, creation, or pipeline retry: use an API-capable OAuth/access token with only the project/group access needed by the connector.
- Upstream MCP: `GITLAB_MCP_ACCESS_TOKEN` must be an OAuth access token authorized for the GitLab `mcp` scope. GitLab's normal MCP client flow uses OAuth 2.0 Dynamic Client Registration; this connector deliberately accepts an already-authorized token so OAuth UI/client registration remains outside the agent process.

Do not store refresh tokens, client secrets, or real access tokens in repository files.

## Environment variables

Copy `.env.example` into your secret-management workflow. Environment files are not loaded automatically; export variables using your process manager, shell, container secret provider, or application host.

Required:

- `GITLAB_TOKEN`

Optional:

- `GITLAB_BASE_URL` — defaults to `https://gitlab.com`; supports self-managed GitLab origins.
- `GITLAB_MCP_ACCESS_TOKEN` — OAuth token with `mcp` scope.
- `GITLAB_USE_UPSTREAM_MCP` — default `true`.
- `GITLAB_REQUIRE_WRITE_APPROVAL` — default `true`.
- `GITLAB_HTTP_TIMEOUT_MS` — default `20000`.
- `GITLAB_MAX_RETRIES` — default `3`, maximum `5`.

## Install and run

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

The server uses MCP over stdio, so it can be launched by MCP clients that support stdio subprocess servers. Configure the command to run this package's built `dist/src/server.js` (or `npm start`) with credentials supplied through the client/process environment.

## Tools and permissions

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `gitlab.project.search` | Search visible projects | READ | No |
| `gitlab.project.get` | Read project metadata | READ | No |
| `gitlab.repository.file.read` | Read repository file payload | READ | No |
| `gitlab.issue.get` | Read one issue | READ | No |
| `gitlab.issue.create` | Create issue | WRITE | Required by default |
| `gitlab.issue.comment` | Comment on issue | WRITE | Required by default |
| `gitlab.merge_request.list` | List/search MRs | READ | No |
| `gitlab.merge_request.get` | Read MR details | READ | No |
| `gitlab.merge_request.create` | Create MR | WRITE | Required by default |
| `gitlab.merge_request.comment` | Comment on MR | WRITE | Required by default |
| `gitlab.pipeline.list` | List pipelines | READ | No |
| `gitlab.pipeline.retry` | Retry failed/canceled pipeline jobs | HIGH_RISK | Always required |

No delete, merge, permission-change, billing, deployment, or arbitrary-request tool is exposed. A caller cannot increase connector scopes; GitLab authorization is limited by the supplied token and GitLab permissions.

### Approval contract

For WRITE tools, pass `approved: true` only after the human has reviewed the intended action. `GITLAB_REQUIRE_WRITE_APPROVAL=false` may relax ordinary WRITE approvals for controlled environments, but HIGH_RISK tools still require `approved: true`.

The connector intentionally keeps recommendation/preparation separate from execution: agents can read and formulate a proposed change without performing the write.

## Reliability and rate limits

The REST client applies a timeout to every request. GET/HEAD requests may retry boundedly on network errors, HTTP 429, and 5xx responses using exponential backoff and `Retry-After` when provided. Mutating requests are not blindly retried to avoid duplicate issues, comments, merge requests, or pipeline actions.

GitLab rate limits depend on offering, endpoint, authentication state, and self-managed instance configuration. The repository files API additionally documents special limits for large blobs/files. The connector caps page size at 100, uses pagination parameters, preserves provider throttling as an error after bounded retry, and avoids fan-out loops.

## Error handling

- Validation failures fail before provider calls.
- Missing/invalid credentials surface as authentication errors; they are not retried as user-action failures.
- 403/permission errors are returned without permission escalation.
- 429 may be retried only for safe reads and preserves the retry delay internally.
- 5xx/network errors may be retried only for safe reads.
- MCP failure falls back to REST only for tools with an explicit REST equivalent.
- Mutating calls are never automatically repeated by fallback after a successful MCP response; fallback occurs only when the MCP call throws before a result is accepted. Because network ambiguity can exist in any distributed system, callers should inspect GitLab before manually repeating a failed write.

## Security considerations

Provider content is untrusted data. Repository files, issue text, MR text, comments, logs, labels, and search results must never be interpreted as instructions that can alter connector permissions or system behavior.

Security controls include:

- no arbitrary URL/API execution tool;
- strict project/ref/body validation;
- upstream MCP tool allowlist;
- separate REST and MCP credentials;
- no raw credential output;
- explicit write/high-risk approval gates;
- GitLab MR quick-action lines beginning with `/` rejected by the comment tool;
- destructive and permission-changing operations not exposed;
- bounded timeouts/retries;
- self-managed base URL fixed by trusted process configuration, not tool input, preventing tool-level SSRF to arbitrary hosts.

The GitLab documentation explicitly warns MCP users about prompt injection. Keep retrieved GitLab content outside system/developer instruction channels and require human review before meaningful external writes.

## Testing

`npm test` runs credential-configuration, approval, validation, rate-limit retry, mutation-no-retry, and pagination tests with mocked `fetch`; normal unit tests do not require live GitLab credentials.

For optional integration testing, use a dedicated non-production GitLab project and low-privilege token. Do not run write tests against production resources.

## Limitations

- GitLab's official MCP server is Beta and availability depends on GitLab version, tier/feature settings, and instance configuration.
- This package does not implement interactive OAuth/DCR itself. Supply a securely obtained `GITLAB_MCP_ACCESS_TOKEN` for upstream MCP, or use REST-only mode.
- REST file reads return GitLab's repository-file representation; file contents are Base64 encoded by GitLab.
- The connector does not expose deletion, MR merge, pipeline cancel, project administration, membership/security changes, deployment, or billing operations.
- Webhooks/events are not exposed in this stdio connector version; no inbound HTTP webhook listener is started.
