# Codecov MCP/API Connector

Reusable MCP facade over the official Codecov API v2 for coverage-oriented engineering workflows.

## Transport strategy

No official Codecov-owned MCP server was found in the current Codecov documentation or Codecov-owned repositories. Community MCP servers exist, but this connector does not trust or depend on them. All implemented capabilities use the official Codecov API v2 at `https://api.codecov.io/api/v2`.

Official sources used:

- https://docs.codecov.com/reference/repos_list
- https://docs.codecov.com/reference/repos_branches_list
- https://docs.codecov.com/reference/repos_commits_list
- https://docs.codecov.com/reference/repos_pulls_list
- https://docs.codecov.com/reference/repos_totals_retrieve
- https://docs.codecov.com/reference/repos_report_retrieve
- https://docs.codecov.com/reference/repos_file_report_retrieve
- https://docs.codecov.com/reference/repos_report_tree_retrieve
- https://docs.codecov.com/reference/repos_coverage_list

## Capabilities

The server exposes ten stable MCP tools:

- `codecov.repository.list`
- `codecov.repository.get`
- `codecov.branch.list`
- `codecov.commit.list`
- `codecov.pull_request.list`
- `codecov.coverage.totals.get`
- `codecov.coverage.report.get`
- `codecov.coverage.file.get`
- `codecov.coverage.tree.get`
- `codecov.coverage.trend.get`

All implemented tools are READ-only. This connector intentionally does not expose coverage upload, repository activation, token management, destructive operations, or a generic arbitrary HTTP/API tool.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod tool schemas
  -> CodecovClient
  -> credential isolation
  -> official Codecov API v2
```

Provider responses are wrapped with `trustedAsInstructions: false` to make the trust boundary explicit. Retrieved Codecov data must be treated as untrusted data, never as policy or instructions.

## Authentication

Set a Codecov API token in `CODECOV_API_TOKEN`. The token stays in the connector process and is sent only in the HTTP `Authorization: Bearer ...` header to the configured API origin. Never put the token in an LLM prompt or tool arguments.

Environment variables:

```text
CODECOV_API_TOKEN=
CODECOV_API_BASE_URL=https://api.codecov.io/api/v2
CODECOV_TIMEOUT_MS=15000
CODECOV_MAX_RETRIES=2
```

`CODECOV_API_BASE_URL` must use HTTPS. This keeps self-hosted/proxy deployments configurable without permitting arbitrary per-tool URLs.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

Configure any MCP client that supports stdio to launch `node dist/server.js` with the environment variables above. Compatibility depends on the client supporting standard MCP stdio transport.

## Input validation

- service is restricted to Codecov-documented provider values: `github`, `github_enterprise`, `gitlab`, `gitlab_enterprise`, `bitbucket`, `bitbucket_server`
- owner/repository names are bounded and validated
- page size is capped at 100
- commit SHA values are hexadecimal and bounded
- file paths must be repository-relative and cannot contain `..` path segments
- coverage trend interval is restricted to `1d`, `7d`, or `30d`
- pull request state is restricted to `open`, `merged`, or `closed`

There is no raw URL, raw REST endpoint, arbitrary GraphQL, or arbitrary request tool.

## Permission and approval model

Every tool is classified `READ`. The API token must already have provider-side access to the requested data. No tool can grant itself broader privileges. Since this package has no write/high-risk/destructive tools, human approval is not required for the implemented calls.

## Reliability

The client implements:

- per-request timeout using `AbortController`
- cancellation propagation
- bounded retries
- exponential backoff for network failures and retryable 5xx responses
- HTTP 429 handling with `Retry-After`
- no automatic retry of authentication/permission/validation failures such as 401/403/4xx
- provider error mapping through `CodecovError`
- explicit bounded pagination parameters for list/trend tools

Codecov's paginated endpoints expose `page`/`page_size`; the connector exposes those rather than recursively draining an unbounded result set.

## Security considerations

- credentials never enter MCP tool input/output
- HTTPS API base URL is enforced
- arbitrary provider URLs are not accepted by tools
- path traversal is rejected for file paths
- provider content is treated as untrusted data
- no community MCP server is automatically trusted or discovered at runtime
- no dynamically discovered upstream tools can expand permissions
- errors do not deliberately log tokens or request headers

## Testing

Normal tests use mocked `fetch` and require no live Codecov credentials.

```bash
npm test
```

Coverage includes auth/base-URL validation, bearer header behavior, successful reads, no retry for 401, bounded 5xx retries, rate-limit retry behavior, and timeout handling.

## Limitations

- The connector is read-only by design.
- Repository activation and coverage uploads are not exposed as agent tools.
- Some Codecov resources only exist after coverage has been uploaded for relevant commits/branches.
- Provider-side API availability and permissions remain authoritative.
- Codecov API rate-limit policy can evolve; the connector therefore relies on HTTP status and `Retry-After` rather than hard-coding a quota claim.
