# Workable MCP/API Connector

Reusable MCP connector for Workable recruiting and HR workflows. The connector exposes a small, stable, provider-scoped tool surface while delegating supported operations to Workable's **official MCP server** at `https://mcp.workable.com/mcp`.

## Upstream strategy

Workable currently provides an official MCP server using Streamable HTTP and OAuth 2.0. This connector therefore uses the official MCP transport for all implemented capabilities. It does not depend on a community MCP implementation and does not expose arbitrary REST requests.

Official references researched for this connector:

- Workable MCP Server: https://workable.readme.io/reference/workable-mcp-server
- Workable OAuth 2.0: https://workable.readme.io/page/oauth
- Jobs API: https://workable.readme.io/reference/jobs
- Candidates API: https://workable.readme.io/reference/job-candidates-index
- Candidate creation API: https://workable.readme.io/reference/job-candidates-create
- Requisitions API: https://workable.readme.io/reference/requisitions
- Webhook subscriptions: https://workable.readme.io/reference/webhook-subscriptions

The REST/SPI documentation is retained as a capability and scope reference, but no REST fallback is currently required by the implemented tool set because the official Workable MCP server exposes each selected operation. If an upstream MCP capability is removed or unavailable, this connector fails closed rather than silently switching to an unreviewed transport.

## Implemented tools

| Tool | Upstream Workable MCP tool | Risk | Approval |
|---|---|---:|---|
| `workable.account.list` | `get_accounts` | READ | No |
| `workable.job.list` | `get_jobs` | READ | No |
| `workable.job.search` | `search_jobs` | READ | No |
| `workable.job.get` | `get_job` | READ | No |
| `workable.job.stages` | `get_job_stages` | READ | No |
| `workable.candidate.list` | `get_candidates` | READ | No |
| `workable.candidate.get` | `get_candidate` | READ | No |
| `workable.candidate.create` | `create_candidate` | WRITE | Configurable; required by default |
| `workable.candidate.update` | `update_candidate` | WRITE | Configurable; required by default |
| `workable.candidate.move` | `move_candidate` | HIGH_RISK | Always required |
| `workable.candidate.comment` | `add_comment` | WRITE | Configurable; required by default |
| `workable.requisition.list` | `get_requisitions` | READ | No |
| `workable.timeoff.list` | `get_timeoff_requests` | READ | No |

The connector intentionally does not expose destructive member removal, department deletion/merge, offer approval/rejection, requisition approval/rejection, or arbitrary provider calls.

## Architecture

```text
MCP client
  -> local Workable connector (stdio)
      -> strict schemas
      -> permission + approval policy
      -> credential-isolated upstream client
          -> official Workable MCP server (Streamable HTTP)
```

Provider data is returned as untrusted content. Retrieved candidate notes, comments, profile data, job descriptions, or other Workable content must never be interpreted as connector configuration, permissions, or agent instructions.

## Authentication

The official Workable MCP server uses OAuth 2.0. Supply an already-authorized access token to the connector through `WORKABLE_MCP_ACCESS_TOKEN`. The token is read only inside the connector transport layer and is never included in MCP tool arguments or responses.

For multi-account Workable users, call `workable.account.list` first. Every other official Workable MCP tool requires an `account` value corresponding to the selected account subdomain. You can either set `WORKABLE_ACCOUNT` or pass `account` per tool call.

Workable's documented OAuth flow is Authorization Code. Partner credentials and access configuration are controlled by Workable. This package intentionally does not persist refresh tokens or client secrets.

## Environment

Copy `.env.example` into your runtime's secret configuration.

- `WORKABLE_MCP_ACCESS_TOKEN` — required OAuth access token.
- `WORKABLE_ACCOUNT` — optional default Workable account subdomain.
- `WORKABLE_PERMISSIONS` — comma-separated local permission classes. Default: `read`. Valid values: `read`, `write`, `high_risk`.
- `WORKABLE_REQUIRE_WRITE_APPROVAL` — default `true`.
- `WORKABLE_TIMEOUT_MS` — request timeout, bounded to 1–60 seconds; default 15000.
- `WORKABLE_MAX_RETRIES` — bounded retry count, 0–5; default 2.

Never place real tokens in source control, prompts, examples, logs, or tool arguments.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

## Run

```bash
WORKABLE_MCP_ACCESS_TOKEN=... npm start
```

The local server communicates with MCP clients over stdio using `@modelcontextprotocol/sdk`.

Example MCP client configuration:

```json
{
  "mcpServers": {
    "workable": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/workable/dist/src/server.js"],
      "env": {
        "WORKABLE_MCP_ACCESS_TOKEN": "${WORKABLE_MCP_ACCESS_TOKEN}",
        "WORKABLE_ACCOUNT": "your-account-subdomain"
      }
    }
  }
}
```

Client support depends on whether the client can launch a standard stdio MCP server. No vendor-specific compatibility beyond the MCP protocol is claimed.

## Permission model

`READ` tools may execute automatically when authentication permits them.

`WRITE` tools require the local `write` permission. With the secure default `WORKABLE_REQUIRE_WRITE_APPROVAL=true`, the call must also contain `approved: true` after human authorization.

`HIGH_RISK` tools require the local `high_risk` permission and always require `approved: true`. Candidate pipeline movement is classified as high risk because it can drive hiring workflow state and downstream automation.

The connector cannot increase its own permission set. Workable's own account authorization remains an independent enforcement boundary.

## Validation and safety

Inputs are parsed with strict Zod schemas. IDs, strings, enums, pagination values, dates, email addresses, and writable candidate fields are deliberately constrained. The connector has no `execute_any_request` or URL parameter, which prevents caller-controlled SSRF through the provider transport.

Credentials stay in the transport layer. They are added only to the HTTP `Authorization` header. Error messages do not echo the token.

Potentially duplicating or state-changing operations are not retried automatically. Read operations may retry HTTP 429 and 5xx responses with bounded exponential backoff while respecting `Retry-After` when provided. Authentication, permission, and validation failures are not retried.

Requests are cancelled with an `AbortController` after the configured timeout.

## Rate limiting

Workable's limits can vary by API surface and account. The connector treats HTTP 429 as throttling, preserves `Retry-After`, and retries only retry-safe read calls. Pagination limits are capped at 100 where the upstream Workable APIs document a 100-item maximum page size.

## Error handling

- `401`: token is missing, expired, revoked, or otherwise invalid.
- `403`: Workable account permissions or OAuth authorization do not allow the requested operation.
- `429`: rate limited; `Retry-After` is surfaced when available.
- `5xx`: read calls may retry within the configured bound.
- timeout: converted to an explicit connector timeout error.
- schema/policy failures: rejected before any upstream network request.

## Workable scopes and permissions

Workable's SPI documents fine-grained scopes such as `r_jobs`, `r_candidates`, `w_candidates`, and `r_requisitions`. The official MCP server uses OAuth and additionally enforces the authenticated member's Workable permissions. This connector does not request or mint scopes itself; configure the Workable OAuth integration with only the capabilities that your deployment needs.

At minimum, the implemented surface conceptually requires access corresponding to:

- jobs read
- candidates read
- candidates write for create/update/move/comment
- requisitions read
- HR/time-off read for `workable.timeoff.list`

Exact availability is determined by the official Workable MCP server and the authenticated user's account permissions.

## Webhooks and events

Workable's SPI supports webhook subscriptions for candidate and employee events. This connector does not expose webhook registration because safely operating a public callback endpoint requires deployment-specific URL ownership, HTTPS termination, replay controls, and event validation. Webhook capability is therefore documented but intentionally not implemented in this package.

## Testing

```bash
npm test
```

Unit tests require no live Workable credentials. They verify configuration, tool registration, validation, permission denial, approval requirements, credential isolation, retry bounds, throttling behavior, and non-retry of write operations using mocked HTTP responses.

## Limitations

- OAuth token acquisition/refresh is external to this connector; only the bearer token is consumed.
- The connector exposes a curated subset of Workable's much larger official MCP tool catalog.
- No destructive operations are exposed.
- No arbitrary MCP tool discovery is trusted or forwarded. Only explicitly mapped upstream Workable tool names are callable.
- No REST fallback is implemented because every selected capability is already present in Workable's official MCP server. A future fallback should be added only after verifying the corresponding official SPI endpoint and least-privilege scope.
- Upstream MCP responses are passed through as data after protocol-level error handling; callers should continue treating all provider-sourced text as untrusted.

See `examples/workflows.md` for representative workflows.
