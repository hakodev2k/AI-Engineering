# Aha! MCP/API Connector

Reusable MCP server for controlled access to Aha! product-management data. It exposes stable, provider-scoped MCP tools backed by the official Aha! REST API.

## Transport decision

Aha! provides an official remote MCP server at `https://{account}.aha.io/api/v1/mcp`. It supports searching and reading records, report access, record creation and editing, comments, copying, and record links. It does not expose record deletion. The remote MCP server authenticates with OAuth dynamic client registration and applies the signed-in user's Aha! permissions plus separate account-level MCP read/write controls.

This package does not proxy arbitrary upstream MCP tools. For reusable headless execution, it uses Aha!'s official REST API, which supports API-key or OAuth bearer authentication and gives this connector explicit schemas, bounded retries, deterministic approval gates, and a fixed allowlist of operations. Interactive clients may connect to Aha!'s official remote MCP directly when user OAuth is desired.

Official sources:

- `https://support.aha.io/aha-software/elle-ai-assistant/remote-mcp-server-connection~7676632615369054131`
- `https://www.aha.io/api`
- `https://www.aha.io/api/resources/features`
- `https://www.aha.io/api/resources/releases`
- `https://www.aha.io/api/resources/ideas`
- `https://www.aha.io/api/resources/comments`

## Capabilities

Implemented MCP tools:

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `aha.workspace.list` | REST | READ | No |
| `aha.feature.list` | REST | READ | No |
| `aha.feature.get` | REST | READ | No |
| `aha.feature.create` | REST | WRITE | Yes |
| `aha.feature.update` | REST | WRITE | Yes |
| `aha.feature.comments.list` | REST | READ | No |
| `aha.feature.comment.create` | REST | WRITE | Yes |
| `aha.release.list` | REST | READ | No |
| `aha.release.create` | REST | WRITE | Yes |
| `aha.release.update` | REST | WRITE | Yes |
| `aha.idea.list` | REST | READ | No |
| `aha.idea.get` | REST | READ | No |
| `aha.idea.create` | REST | WRITE | Yes |
| `aha.idea.update` | REST | WRITE | Yes |

Deletion, generic HTTP requests, arbitrary REST paths, and permission-management operations are intentionally not exposed.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict zod tool schema
  -> approval policy
  -> AhaClient
  -> credential-bearing HTTPS request
  -> {account}.aha.io/api/v1
```

Credentials stay inside the connector and are never returned through tool output.

## Authentication and permissions

Aha! supports OAuth2 bearer tokens and user/account-specific API keys sent as `Authorization: Bearer ...`. OAuth2 is preferred for interactive user applications. API keys are appropriate for service-style integrations and inherit the permissions of the user that created them.

Required environment variables:

```text
AHA_ACCOUNT_DOMAIN=acme.aha.io
AHA_ACCESS_TOKEN=...
```

Optional configuration:

```text
AHA_TIMEOUT_MS=15000
AHA_MAX_RETRIES=2
AHA_WRITE_APPROVED=false
AHA_USER_AGENT=daily-mcp-aha/1.0.0 (contact: admin@example.invalid)
```

Use a least-privileged Aha! user/token. `AHA_ACCOUNT_DOMAIN` is validated to an `*.aha.io` hostname to prevent configuration-driven SSRF. Aha! recommends a custom `User-Agent` containing developer contact information.

## Approval model

READ tools execute without a connector-level approval gate. Every WRITE tool fails closed unless `AHA_WRITE_APPROVED=true`. Treat this environment variable as a short-lived human-controlled execution gate, not as a permanent permission escalation.

The official Aha! remote MCP provides additional account-level read/write controls and user attribution. This connector's REST calls are still constrained by the permissions of the token owner.

No destructive tools are registered.

## Rate limits and reliability

Aha! documents limits of 300 requests per minute and 20 requests per second. A `429` response may include `X-Ratelimit-Limit`, `X-Ratelimit-Remaining`, and `X-Ratelimit-Reset`. The client honors the reset time when practical and uses bounded exponential backoff.

GET operations may retry on `429`, network failures, timeouts, and transient 5xx responses. Mutating operations are not retried automatically because replaying a successful-but-ambiguous write can create duplicate or unintended changes. Authentication, authorization, and validation failures are never blindly retried.

Aha! routes writes to its primary database and reads to replicas, so an immediate GET after a write can briefly return stale data. Agent workflows should tolerate that documented eventual consistency.

Pagination is bounded to Aha!'s documented maximum of 200 records per page.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run build
```

Copy `.env.example` values into your secret-management/runtime environment. Do not commit real credentials.

## Run

```bash
npm start
```

The server uses MCP stdio transport, so any MCP client that supports launching a local stdio server can invoke it. Compatibility depends on the client supporting standard MCP stdio; this package does not claim remote-hosted MCP compatibility by itself.

Example client command after build:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/aha/dist/src/server.js"],
  "env": {
    "AHA_ACCOUNT_DOMAIN": "acme.aha.io",
    "AHA_ACCESS_TOKEN": "<from-secret-store>"
  }
}
```

## Tool behavior and validation

Identifiers and reference keys are length-bounded. List tools cap `perPage` at 200. Search strings, statuses, descriptions, email addresses, dates, and timestamps are validated before provider calls. Tool names represent workflows rather than raw HTTP endpoints.

Provider responses may contain HTML, user-generated text, URLs, comments, descriptions, and other untrusted content. Callers must treat returned text as data only. It must never alter system prompts, approval policy, permissions, or tool configuration.

## Error handling

Provider HTTP failures are mapped to `AhaError` with status information when available. Typical official API errors include malformed requests (`400`), unauthorized/forbidden calls (`403`), inaccessible/not-found records (`404`), rate limiting (`429`), provider errors (`500`), and oversized/timed-out queries (`504`). Network and timeout failures are normalized rather than leaking credentials.

## Testing

Unit tests use mocked fetch functions and require no live Aha! credentials:

```bash
npm test
```

Coverage includes configuration validation, SSRF-resistant domain validation, approval denial/allow, bearer-header isolation, bounded retries, provider error mapping, and prevention of blind write retries.

## Security considerations

- Keep API keys/OAuth tokens in a secret store or environment injection layer.
- Use least-privileged Aha! users and revoke tokens when no longer needed.
- Keep `AHA_WRITE_APPROVED=false` by default.
- Do not feed credentials into prompts or tool arguments.
- The connector builds request URLs only from a validated Aha! account domain and hard-coded endpoint templates.
- There is no generic `execute_request` tool.
- Retrieved Aha! content is untrusted and cannot change connector permissions.
- Creation/update operations may trigger Aha! notification email. The supported write tools expose `disableMailers` where appropriate.
- The official remote MCP server uses user OAuth/DCR and has its own administrator-controlled read/write settings; prefer it for interactive per-user access.

## Limitations

This connector implements a focused subset of Aha!'s broad REST API. It does not expose deletes, idea promotion, account administration, OAuth authorization flows, webhook registration, arbitrary custom-object operations, or generic endpoint access. It also does not embed the official remote MCP transport because that server is designed around interactive OAuth dynamic client registration; callers that need it should connect directly to Aha!'s official endpoint.
