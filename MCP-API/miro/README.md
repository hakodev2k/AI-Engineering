# Miro MCP/API Connector

A reusable, security-gated MCP server for Miro boards. It exposes 15 stable, provider-scoped tools for board discovery, board/item reads, member reads, and controlled sticky-note/text/shape mutations.

## Upstream transport

Miro operates an **official remote MCP Server** at `https://mcp.miro.com/`. Current Miro documentation says it can read and write boards and exposes board, diagram, document, table, code-widget, comment, image, layout, and prototype tools. It authenticates users through OAuth and remains subject to board permissions and organization controls.

This connector deliberately uses **Miro REST API v2** as its executable upstream transport. The official remote MCP server is user-session/OAuth oriented; this package is designed for reusable non-interactive deployments where credentials must stay in the connector and local approval policy must guard all mutations. The external MCP contract remains stable regardless of upstream transport.

Official sources checked 2026-08-30:

- Miro MCP Server overview: https://help.miro.com/hc/en-us/articles/31624028247058-Miro-MCP-Server-overview
- MCP client setup / endpoint: https://help.miro.com/hc/en-us/articles/31625301583890-How-to-enable-Miro-s-MCP-Server-user-guide
- REST API overview / OAuth: https://developers.miro.com/reference/overview
- OAuth guide and refresh tokens: https://developers.miro.com/docs/getting-started-with-oauth
- REST API v2 reference map: https://developers.miro.com/docs/rest-api-reference-guide
- Boards: https://developers.miro.com/reference/get-boards
- Create board: https://developers.miro.com/reference/create-board-1
- Sticky notes: https://developers.miro.com/reference/create-sticky-note-item-1
- Text items: https://developers.miro.com/reference/create-text-item-1
- Shape items: https://developers.miro.com/reference/create-shape-item-1
- Rate limits: https://developers.miro.com/reference/rate-limiting

## Capabilities

| Tool | Transport | Scope | Risk | Approval |
|---|---|---|---|---|
| `miro.board.list` | REST | `boards:read` | READ | no |
| `miro.board.get` | REST | `boards:read` | READ | no |
| `miro.board.create` | REST | `boards:write` | WRITE | yes |
| `miro.board.items.list` | REST | `boards:read` | READ | no |
| `miro.board.item.get` | REST | `boards:read` | READ | no |
| `miro.board.members.list` | REST | `boards:read` | READ | no |
| `miro.sticky_note.create` | REST | `boards:write` | WRITE | yes |
| `miro.sticky_note.update` | REST | `boards:write` | WRITE | yes |
| `miro.sticky_note.delete` | REST | `boards:write` | DESTRUCTIVE | yes + disabled |
| `miro.text.create` | REST | `boards:write` | WRITE | yes |
| `miro.text.update` | REST | `boards:write` | WRITE | yes |
| `miro.text.delete` | REST | `boards:write` | DESTRUCTIVE | yes + disabled |
| `miro.shape.create` | REST | `boards:write` | WRITE | yes |
| `miro.shape.update` | REST | `boards:write` | WRITE | yes |
| `miro.shape.delete` | REST | `boards:write` | DESTRUCTIVE | yes + disabled |

The connector intentionally does **not** expose arbitrary HTTP requests, board deletion, member invitation/removal, role changes, token revocation, organization administration, billing, or public publishing.

## Architecture

```text
MCP client
  -> stdio MCP server
     -> strict tool schema
        -> permission / approval policy
           -> credential provider
              -> Miro REST API v2
```

Miro-returned content is untrusted data. It is never interpreted as connector configuration or authorization instructions.

## Authentication

Miro REST API uses OAuth 2.0 Authorization Code flow and Bearer access tokens. The least-privilege scopes for this connector are:

- Read-only deployment: `boards:read`
- All implemented tools: `boards:read boards:write`

Two runtime credential modes are supported.

### Non-expiring access token

Set:

```text
MIRO_ACCESS_TOKEN=...
```

The raw token is read only inside the credential layer and is never a tool parameter or returned to the model.

### Expiring access token + refresh rotation

Miro recommends expiring access tokens. Current official docs specify a one-hour access-token lifetime and a 60-day refresh-token lifetime, with refresh-token rotation when a new access token is issued.

Set `MIRO_TOKEN_FILE` to a protected JSON file:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_at": 1780000000
}
```

Also set `MIRO_CLIENT_ID` and `MIRO_CLIENT_SECRET`. The connector refreshes against `https://api.miro.com/v1/oauth/token`, atomically replaces the token file, and retains the rotated refresh token. Keep the token file outside source control with filesystem permissions restricted to the connector process.

The interactive authorization-code bootstrap is intentionally not exposed as an MCP tool.

## Environment variables

```text
MIRO_ACCESS_TOKEN=
MIRO_TOKEN_FILE=
MIRO_CLIENT_ID=
MIRO_CLIENT_SECRET=
MIRO_TIMEOUT_MS=15000
MIRO_MAX_RETRIES=3
MIRO_APPROVAL_SECRET=
MIRO_ENABLE_DESTRUCTIVE=false
```

Use exactly one of `MIRO_ACCESS_TOKEN` or `MIRO_TOKEN_FILE`.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run check
npm test
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio child-process servers.

Example client configuration:

```json
{
  "mcpServers": {
    "miro-safe": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/MCP-API/miro"
    }
  }
}
```

Environment variables should be injected by the host/secret manager, not copied into model prompts.

## Permission and approval model

READ operations execute without connector-level approval after Miro authentication/authorization succeeds.

Every WRITE operation requires `MIRO_APPROVAL_SECRET` and a 64-character `approval_token`. The token is HMAC-SHA256 over the exact tool name and canonical request payload excluding `approval_token`. Changing the board, item, content, style, position, or geometry invalidates the approval.

DESTRUCTIVE tools additionally require:

```text
MIRO_ENABLE_DESTRUCTIVE=true
```

This environment flag cannot be changed through MCP. Deletion requests are never retried automatically.

`miro.board.create` always creates with private sharing policy; the tool does not accept public or team-wide sharing parameters.

## Validation and safety

- Tool schemas reject unknown top-level parameters.
- Board and item identifiers have bounded lengths.
- Board search query length is capped at Miro's documented 500 characters.
- Board listing is limited to 50 results per request and search offsets stay below the documented 10,000-result query cap.
- Board-item pagination is bounded to 10–50 records.
- No arbitrary URL parameter is exposed, preventing connector-level SSRF.
- API host is fixed to `https://api.miro.com`.
- Common credential-shaped response fields are redacted recursively.
- Retrieved board content is labeled `untrusted_provider_data`.
- Public sharing, invitations, permission changes, and broad admin operations are not implemented.

## Reliability and error handling

Safe GET operations use bounded exponential backoff for HTTP 429, 502, 503, and 504. Integer `Retry-After` values are honored up to ten seconds. POST/PATCH/DELETE operations are not blindly retried because duplicate or partial mutations may be unsafe.

Requests use local timeouts and combine them with MCP cancellation signals when supplied. Provider HTTP errors are normalized with status and retryability metadata. HTTP 401 in token-file mode triggers at most one OAuth refresh attempt before failure.

## Rate limits

Miro applies REST limits per user/application using credits, with a global documented allowance of 100,000 credits per minute. Current endpoint tiers are:

- Level 1: 50 credits/call, up to 2,000 requests/minute
- Level 2: 100 credits/call, up to 1,000 requests/minute
- Level 3: 500 credits/call, up to 200 requests/minute
- Level 4: 2,000 credits/call, up to 50 requests/minute

The connector avoids fixed assumptions beyond these published tiers, paginates reads, reacts to 429 responses, and does not fan out one tool call into unbounded provider requests.

## Testing

`npm test` uses Node's built-in test runner and mocked `fetch`; no live Miro credentials are required. Tests cover:

- credential configuration
- tool registration
- strict risk policy
- payload-bound approvals
- destructive-operation denial
- sensitive response redaction
- Bearer authentication/path encoding
- rate-limit retry behavior
- no blind mutation retry
- 401 refresh path
- refresh-token rotation/persistence

## Limitations

- This connector does not proxy Miro's official hosted MCP server because its OAuth connection is user-session oriented. It records that upstream capability and uses official REST v2 for deterministic service operation.
- Only board, member-read, sticky-note, text, and shape workflows are implemented. Miro's official MCP server and REST platform support additional resources; they are intentionally outside this package's scoped surface.
- OAuth authorization/bootstrap must be completed outside the MCP tool surface. The connector consumes already-authorized credentials.
- Response redaction catches common credential-shaped keys but cannot prove that arbitrary user-authored board text contains no secrets. Access to boards must remain least-privilege.
