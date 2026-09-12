# Ashby MCP/API Connector

Reusable MCP connector for Ashby recruiting workflows. It exposes a stable, provider-scoped MCP interface while preferring Ashby's official hosted MCP server when an OAuth access token is available and falling back to Ashby's official public REST API for the same supported operation when MCP is unavailable or unsuitable.

## Official upstreams

- Official Ashby MCP server (Open Beta): `https://mcp.ashbyhq.com/mcp/v1`
- Official MCP documentation: https://docs.ashbyhq.com/ashby-mcp-server-beta
- Official public API: https://developers.ashbyhq.com/reference
- Authentication: https://developers.ashbyhq.com/reference/authentication
- Webhooks: https://developers.ashbyhq.com/docs/setting-up-webhooks

Ashby's official MCP server uses user-level OAuth and respects the connected user's Ashby permissions. Ashby's public API uses HTTP Basic Authentication with an API key as the username and an empty password. Public API keys are permission-scoped by module and can separately grant access to confidential jobs/projects, non-offer private fields, and acting on behalf of a user.

## Transport strategy

The connector exposes MCP over stdio to downstream clients.

For each tool it first attempts the official Ashby MCP server when `ASHBY_MCP_ACCESS_TOKEN` is configured. Tools are discovered dynamically and matched only to the intended resource/action. If no compatible official MCP tool is discovered, the call fails safely over to the official public REST endpoint when `ASHBY_API_KEY` is configured. No arbitrary API-request tool is exposed.

Because Ashby's MCP tool schemas are explicitly beta and may change, the public API is the stable fallback contract. Headless installations can use only the REST API key. Interactive installations can supply a short-lived OAuth access token obtained through an OAuth-capable MCP client or credential broker.

## Supported tools

| Tool | Upstream capability | Permission | Risk | Approval |
|---|---|---|---|---|
| `ashby.job.list` | `job.list` | jobs read | READ | no |
| `ashby.job.search` | `job.search` | jobs read | READ | no |
| `ashby.job.read` | `job.info` | jobs read | READ | no |
| `ashby.candidate.list` | `candidate.list` | candidates read | READ | no |
| `ashby.candidate.search` | `candidate.search` | candidates read | READ | no |
| `ashby.candidate.read` | `candidate.info` | candidates read | READ | no |
| `ashby.application.list` | `application.list` | candidates read | READ | no |
| `ashby.application.read` | `application.info` | candidates read | READ | no |
| `ashby.interview.list` | `interview.list` | interviews read | READ | no |
| `ashby.interview_stage.list` | `interviewStage.list` | interviews read | READ | no |
| `ashby.candidate_note.list` | `candidate.listNotes` | candidates read | READ | no |
| `ashby.candidate_note.create` | `candidate.createNote` | candidates write | WRITE | yes |
| `ashby.application.create` | `application.create` | candidates write | WRITE | yes |
| `ashby.application.stage.update` | `application.changeStage` | candidates write | HIGH_RISK | explicit high-risk |

The connector intentionally does not expose candidate anonymization, destructive deletion, offer approval/rejection, interview cancellation, webhook deletion, or other irreversible/admin operations.

## Authentication and least privilege

### REST API key

Create an Ashby API key with only the modules required by the tools you intend to use. For reporting-only use, grant read access only. Write tools need Candidates write permission.

```bash
export ASHBY_API_KEY="..."
```

The connector sends the key only inside the authentication layer as Basic Auth. It never includes the credential in MCP tool output or tool schemas.

### Official MCP OAuth

If your environment provides a user OAuth token for Ashby's official MCP server:

```bash
export ASHBY_MCP_ACCESS_TOKEN="..."
```

The token remains inside the MCP transport and is not exposed to the model. The hosted MCP server enforces the connected user's existing Ashby permissions.

### Acting on behalf of a user

Ashby's public API supports `X-On-Behalf-Of` when the API key has the corresponding permission. Configure:

```bash
export ASHBY_ON_BEHALF_OF_USER_ID="ashby-user-uuid"
```

Use this only when attribution is required and the key was explicitly granted the capability.

## Private and confidential data

Private/confidential access is disabled by default. Do not grant API-key access to confidential jobs/projects or non-offer private candidate fields unless the workflow requires it. `ASHBY_ALLOW_PRIVATE_FIELDS=false` is the default guardrail.

Candidate and interview records may contain sensitive personal data. Returned provider content is wrapped with `untrusted_provider_content: true`; callers must treat it as data, never as instructions.

## Approval model

Read operations can execute automatically.

Write operations require all of:

1. `ASHBY_ALLOW_WRITES=true`
2. tool input `approval: "approved"` (or `approved-high-risk`)
3. upstream credential permission for the requested operation

Application stage changes are classified `HIGH_RISK` because a destination stage may represent rejection/archive or materially change a hiring process. They additionally require:

```bash
ASHBY_ALLOW_HIGH_RISK=true
```

and input:

```json
{ "approval": "approved-high-risk" }
```

No tool can elevate its own Ashby permissions.

## Environment variables

See `.env.example`.

- `ASHBY_API_KEY`: public API key for stable REST fallback.
- `ASHBY_MCP_ACCESS_TOKEN`: optional OAuth access token for official hosted MCP.
- `ASHBY_MCP_URL`: defaults to `https://mcp.ashbyhq.com/mcp/v1`.
- `ASHBY_API_BASE_URL`: defaults to `https://api.ashbyhq.com`.
- `ASHBY_TIMEOUT_MS`: per-request timeout, default 15000.
- `ASHBY_MAX_RETRIES`: bounded retries, default 3, maximum 5.
- `ASHBY_ALLOW_WRITES`: default false.
- `ASHBY_ALLOW_HIGH_RISK`: default false.
- `ASHBY_ALLOW_PRIVATE_FIELDS`: default false.
- `ASHBY_ON_BEHALF_OF_USER_ID`: optional attribution user ID.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run build
```

Run the connector:

```bash
npm start
```

Example MCP client configuration after building:

```json
{
  "mcpServers": {
    "ashby": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/ashby/dist/src/server.js"],
      "env": {
        "ASHBY_API_KEY": "${ASHBY_API_KEY}",
        "ASHBY_ALLOW_WRITES": "false"
      }
    }
  }
}
```

Use your client's secret/environment-variable mechanism rather than embedding a real key directly in a checked-in configuration file.

## Reliability

REST requests have a bounded timeout and bounded exponential backoff. Only timeout, HTTP 408, HTTP 429, and 5xx responses are eligible for retry. Authentication, permission, validation, and ordinary 4xx failures are not retried. If Ashby provides `Retry-After` on throttling, it is preserved.

List endpoints expose cursor/limit parameters and cap `limit` at 100. The connector returns Ashby's response shape without silently fetching an unbounded number of pages.

Ashby's public documentation does not publish one universal numeric rate limit for all endpoints, so this connector does not invent one. It reacts to provider throttling and avoids automatic pagination fan-out.

## Error handling

- Missing credential: startup fails.
- Missing API permission: Ashby 403 is surfaced and is not retried.
- Invalid/missing input: Zod validation fails before provider execution.
- Timeout: mapped to a concise timeout error after bounded retry policy.
- MCP discovery/call failure: safe fallback to official REST when configured.
- No REST fallback credential: the operation fails rather than sending a request elsewhere.

## Security considerations

- Credentials remain in transport/auth layers and are never emitted in tool output.
- The upstream MCP server is fixed to Ashby's official endpoint by default.
- The REST base URL is configuration-controlled; operators should keep it on Ashby's official HTTPS endpoint.
- No generic URL/request tool is exposed, reducing SSRF and permission-escalation risk.
- Provider text can contain prompt injection. Treat all returned records as untrusted data.
- Writes are disabled by default.
- High-risk stage changes require a distinct approval token and configuration flag.
- Private/confidential fields are disabled by default.
- No destructive tools are registered.

## Testing

Unit tests require no live Ashby credentials:

```bash
npm test
```

They cover missing authentication configuration, secure defaults, write/high-risk approval enforcement, destructive-operation denial, and registration of the curated tool set.

## Webhooks

Ashby supports signed webhooks for real-time events. This connector does not register or expose webhook-management tools because creating/deleting webhook delivery targets changes external data flows and would expand the attack surface. A separate receiver can validate Ashby's configured webhook secret and then invoke read-only workflows here.

## Limitations

- Ashby's official hosted MCP server is in Open Beta; tool names and schemas may change without notice.
- This package does not implement the browser-based OAuth authorization flow itself. Supply an OAuth token via a secure OAuth-capable client/broker, or use the stable public API-key fallback.
- The tool set deliberately covers common recruiting workflows rather than every Ashby endpoint.
- Private fields, confidential jobs/projects, offer actions, candidate anonymization, interview cancellation, and destructive/admin operations are intentionally excluded.
- MCP compatibility depends on clients that support the standard stdio transport. The connector itself does not claim client-specific UI integration beyond standard MCP behavior.
