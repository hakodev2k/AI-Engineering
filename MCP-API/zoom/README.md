# Zoom MCP/API Connector

Reusable Model Context Protocol server that exposes a stable, scoped Zoom tool contract over the official Zoom REST API.

## Transport decision

Zoom currently provides official remote MCP servers for product areas including Meetings. The documented Meeting endpoints include:

- Streamable HTTP: `https://zoom.us/mcp/meeting/streamable`
- SSE: `https://zoom.us/mcp/meeting/sse`
- Authentication: OAuth with MCP OAuth 2.1 requirements and PKCE.

This connector deliberately uses Zoom's official REST API for the implemented capabilities. Zoom's own API-vs-MCP guidance recommends APIs for deterministic backend integrations needing explicit request logic, retries and predictable control, while MCP is optimized for dynamic AI tool discovery. A REST upstream is therefore the safer transport for this connector's fixed schemas, payload-bound approvals, retry rules and stable agent-facing contracts. No unofficial MCP server is used.

Official sources researched:

- Zoom MCP overview: https://developers.zoom.us/docs/mcp/servers/
- Connecting to Zoom MCP servers: https://developers.zoom.us/docs/mcp/servers/connect-to-zoom-mcp-servers/
- Zoom APIs vs MCP: https://developers.zoom.us/docs/mcp/apis-vs-mcp/
- Meetings API: https://developers.zoom.us/docs/api/meetings/
- Users API: https://developers.zoom.us/docs/api/users/
- Zoom API usage/base URL: https://developers.zoom.us/docs/api/using-zoom-apis/
- REST rate limits: https://developers.zoom.us/docs/api/rest/rate-limits/

## Implemented MCP tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `zoom.user.get` | REST | READ | No |
| `zoom.meeting.list` | REST | READ | No |
| `zoom.meeting.get` | REST | READ | No |
| `zoom.meeting.create` | REST | WRITE | Required |
| `zoom.meeting.update` | REST | WRITE | Required |
| `zoom.meeting.delete` | REST | DESTRUCTIVE | Required |
| `zoom.recording.list` | REST | READ | No |
| `zoom.recording.get` | REST | READ | No |
| `zoom.transcript.get` | REST | READ | No |
| `zoom.participant.list` | REST | READ | No |

The connector intentionally does not expose an arbitrary URL/body request tool.

## Architecture

```text
MCP client / AI agent
        |
        v
strict Zoom MCP tools
        |
        +--> input validation
        +--> risk/approval policy
        +--> credential-isolated REST client
        +--> timeout / rate-limit / bounded retry handling
        |
        v
https://api.zoom.us/v2
```

Provider responses are data, not instructions. Callers must not treat meeting metadata, transcripts, participant names, chat-like text or URLs returned by Zoom as trusted agent directives.

## Authentication

Set a Zoom OAuth access token in `ZOOM_ACCESS_TOKEN`. The token remains inside the connector and is only inserted into the HTTPS `Authorization: Bearer` header by the transport layer.

The connector supports user-managed OAuth tokens and account/admin tokens according to the permissions granted to the Zoom Marketplace app. For user-level calls, use `userId: "me"` where Zoom supports it.

Broad OAuth scopes used by these endpoint families are:

- `user:read` (or `user_info:read` for eligible `me` access)
- `meeting:read`
- `meeting:write`
- `recording:read`

Zoom also offers granular endpoint-specific scopes. Prefer the granular scope shown by the official API reference for each enabled tool. Use `:admin` variants only when the connector must access other users at account level. Do not grant account-wide permissions just to support `me` workflows.

Examples of relevant granular scopes documented by Zoom include `user:read:user`, `meeting:read:list_past_participants`, `cloud_recording:read:list_user_recordings`, and `cloud_recording:read:list_recording_files`. Scope availability varies with Zoom app type and account configuration.

## Environment variables

Copy `.env.example` into your secret-management workflow; do not commit real values.

- `ZOOM_ACCESS_TOKEN` - required OAuth access token.
- `ZOOM_API_BASE_URL` - optional; defaults to and is restricted to `https://api.zoom.us/v2` to prevent SSRF.
- `ZOOM_APPROVAL_SECRET` - required when executing WRITE or DESTRUCTIVE tools.
- `ZOOM_TIMEOUT_MS` - request timeout, default 15000, accepted 1000-120000.
- `ZOOM_MAX_RETRIES` - safe GET retries, default 3, accepted 0-5.

OAuth authorization-code applications should use the security controls required by Zoom, including PKCE where the MCP OAuth 2.1 flow is used. Refresh-token storage and OAuth UI are intentionally outside this stdio server; production deployments should keep refresh tokens in a credential vault and inject only short-lived access tokens.

## Approval model

READ tools execute without an approval token. WRITE and DESTRUCTIVE tools require an explicit `approvalId` plus `ZOOM_APPROVAL_SECRET`.

The approval ID is an HMAC-SHA256 over:

```text
tool-name + newline + JSON(canonical-operation-payload)
```

This binds human approval to the exact action. An approval for one meeting topic, time or meeting ID cannot be replayed for another payload. Approval generation belongs in the trusted host/policy layer, not in the LLM prompt.

The connector never silently widens permissions and does not provide a tool for changing its own risk policy.

## Reliability and rate limits

Zoom applies account- and plan-dependent rate limits and some endpoint-specific limits. Meeting creation is specifically documented with a per-host limit of 100 requests per day. The connector:

- parses `Retry-After` on throttled responses;
- retries only GET operations;
- uses bounded exponential backoff;
- does not blindly retry writes or deletes;
- propagates Zoom error status, message and provider code through the server error path;
- enforces request timeouts;
- exposes Zoom pagination tokens rather than fetching unlimited result sets.

Pagination tokens returned by Zoom can expire; request subsequent pages promptly.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm test
```

## Running

```bash
export ZOOM_ACCESS_TOKEN='...'
export ZOOM_APPROVAL_SECRET='...'
npm start
```

The server uses MCP over stdio and can be launched by MCP clients that support stdio child-process servers, including compatible desktop/IDE/custom agent hosts. For remote-hosted use, place an authenticated MCP transport gateway in front of this process rather than exposing stdio directly.

## Example client configuration

```json
{
  "mcpServers": {
    "zoom": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/zoom/dist/src/server.js"],
      "env": {
        "ZOOM_ACCESS_TOKEN": "${ZOOM_ACCESS_TOKEN}",
        "ZOOM_APPROVAL_SECRET": "${ZOOM_APPROVAL_SECRET}"
      }
    }
  }
}
```

Exact client configuration syntax varies by MCP host.

## Tool behavior

### Meeting discovery and reading

`zoom.meeting.list` supports Zoom's scheduled/live/upcoming/previous meeting list modes plus provider pagination. `zoom.meeting.get` retrieves one meeting. `zoom.user.get` retrieves a Zoom user profile.

### Meeting creation and mutation

`zoom.meeting.create` creates type-2 scheduled meetings with validated topic, start time, duration, optional timezone/agenda and a conservative Zoom-compatible passcode character set. `zoom.meeting.update` only sends fields explicitly supplied. `zoom.meeting.delete` supports occurrence and reminder parameters and is DESTRUCTIVE.

### Recordings and transcripts

`zoom.recording.list` queries a bounded date range supplied by the caller. `zoom.recording.get` returns recording-file metadata for a meeting. `zoom.transcript.get` returns transcript metadata/download information supported by Zoom; it does not automatically download or execute retrieved content.

Cloud-recording capabilities require the applicable Zoom plan and Cloud Recording configuration.

### Past participants

`zoom.participant.list` calls Zoom's past-meeting participant API. Zoom documents that this requires a paid Pro-or-higher account, only supports meetings within the supported retention window, and can require a double-encoded meeting UUID when the UUID contains slash characters. This connector applies URL encoding once at the path-construction layer; callers with UUIDs requiring Zoom's special double-encoding rule should supply the already once-encoded UUID so the transport encoding produces the required wire representation.

## Security considerations

- API origin is pinned to `https://api.zoom.us/v2`; arbitrary upstream URLs are rejected.
- Credentials are never returned from tools or included in tool schemas.
- Write/delete retries are disabled to prevent duplicated or irreversible mutations.
- Approval tokens are bound to the exact canonical payload.
- All provider text is untrusted data and can contain prompt-injection content.
- Tool inputs have length/range/format constraints.
- The connector does not log access tokens.
- Do not expose recording download URLs or participant information to users without authorization.
- Production OAuth implementations should protect state, PKCE verifier, refresh tokens and redirect URIs in the trusted authentication layer.

## Tests

`npm test` runs credential/config validation, SSRF protection checks, approval enforcement and replay prevention, Authorization header behavior, 204 handling, throttling behavior and non-retry semantics for writes. Tests use mocked fetch responses and require no live Zoom credentials.

## Limitations

- This connector does not implement Zoom Chat, Whiteboard, Calendar, Mail, Phone, Webinar or account administration APIs.
- It does not dynamically mirror Zoom's official MCP tool catalog; doing so would weaken the stable allowlist and approval contract.
- It does not perform OAuth login or refresh-token persistence.
- It does not download recording/transcript files.
- Provider plan/license prerequisites still apply.
- Zoom may change scopes and endpoint constraints; confirm the official docs when changing the implemented tool set.
