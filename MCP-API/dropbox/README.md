# Dropbox MCP/API Connector

Reusable Dropbox integration connector exposing a stable MCP tool surface for file discovery, metadata, search, creation, movement, revision recovery and sharing workflows.

## Transport strategy

The connector uses capability-level hybrid routing:

1. **Official Dropbox remote MCP** is preferred when `DROPBOX_MCP_ACCESS_TOKEN` is configured. The official endpoint is `https://mcp.dropbox.com/mcp`.
2. **Official Dropbox JavaScript SDK / Dropbox API v2** is used when the MCP transport is not configured, and as read-only runtime fallback when an MCP read call fails and API credentials are available.
3. **Mutating MCP calls never automatically fall back after an MCP runtime failure.** A lost response can be ambiguous after the provider committed the write, so replaying it through the API could duplicate or conflict with the action.

Dropbox documents the remote MCP server as an official open-beta service. The official MCP currently advertises tools including `ListFolder`, `GetFileMetadata`, `Search`, `CreateFolder`, `CreateFile`, `CreateSharedLink`, `WhoAmI`, `Copy`, `Move`, `Delete`, `ListSharedLinks`, `ListFileRevisions`, `RestoreFileRevision`, file requests, restore events, transcript and Markdown extraction. This connector intentionally exposes a smaller reusable subset.

Official sources researched for this connector:

- Dropbox remote MCP setup and current tool list: https://help.dropbox.com/integrations/connect-dropbox-mcp-server (updated March 18, 2026)
- Dropbox Dash MCP: https://help.dropbox.com/integrations/set-up-MCP-server
- Official Dropbox JavaScript SDK: https://github.com/dropbox/dropbox-sdk-js
- Generated SDK/API reference: https://dropbox.github.io/dropbox-sdk-js/Dropbox.html
- Sharing guide: https://developers.dropbox.com/dbx-sharing-guide
- File access guide: https://developers.dropbox.com/dbx-file-access-guide
- Performance/rate-limit guidance: https://developers.dropbox.com/dbx-performance-guide
- Error handling: https://developers.dropbox.com/error-handling-guide
- MCP TypeScript SDK v2 server docs: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/server.md
- MCP TypeScript SDK v2 client docs: https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/client.md

## Architecture

```text
MCP client / AI agent
        |
        v
stable provider-scoped MCP tools
        |
        +--> policy + validation + human approval
        |
        v
hybrid router
   |                     |
   | preferred           | fallback / direct
   v                     v
Dropbox official MCP   Dropbox official SDK/API v2
https://mcp.dropbox.com/mcp
```

Credentials stay inside the connector transport/authentication layer and are never returned in tool output.

## Runtime

- Node.js 22+
- TypeScript
- MCP TypeScript SDK v2: `@modelcontextprotocol/server` and `@modelcontextprotocol/client`
- official `dropbox` JavaScript SDK
- Zod 4 input validation

Install and build:

```bash
npm install
npm run build
```

Run as a stdio MCP server:

```bash
npm start
```

During development:

```bash
npm test
```

## Authentication

Dropbox uses OAuth 2.0 scoped access. Configure either the official MCP bearer token, the SDK/API credentials, or both.

### Official remote MCP

```text
DROPBOX_MCP_ACCESS_TOKEN=
DROPBOX_MCP_URL=https://mcp.dropbox.com/mcp
```

The remote MCP service itself uses Dropbox OAuth. For standard MCP clients, Dropbox recommends its OAuth/Dynamic Client Registration connection flow. This connector accepts an already-issued bearer token through the MCP SDK v2 `AuthProvider`, so credentials remain isolated from the LLM.

### SDK/API access token

```text
DROPBOX_ACCESS_TOKEN=
```

### SDK/API refresh-token flow

```text
DROPBOX_REFRESH_TOKEN=
DROPBOX_APP_KEY=
DROPBOX_APP_SECRET=
```

The official SDK accepts `refreshToken`, `clientId` and `clientSecret` and refreshes short-lived access tokens as needed. The refresh token and app secret are connector-side secrets and must not be placed in prompts, MCP arguments, examples or logs.

### Required scopes

The implemented surface requires only:

- `account_info.read`
- `files.metadata.read`
- `files.content.read`
- `files.content.write`
- `sharing.read`
- `sharing.write`

These are also included among the scopes Dropbox currently documents for its remote MCP server. This connector does not request file-request scopes because it does not expose file-request tools.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DROPBOX_ACCESS_TOKEN` | Short-lived user OAuth token for SDK/API fallback |
| `DROPBOX_REFRESH_TOKEN` | Optional long-lived refresh token for SDK/API |
| `DROPBOX_APP_KEY` | OAuth app key/client ID; required with refresh token |
| `DROPBOX_APP_SECRET` | OAuth client secret; required with refresh token |
| `DROPBOX_MCP_ACCESS_TOKEN` | Bearer token for official Dropbox MCP |
| `DROPBOX_MCP_URL` | Pinned to `mcp.dropbox.com`; defaults to official endpoint |
| `DROPBOX_APPROVAL_SECRET` | Connector-only HMAC secret for out-of-band approvals |
| `DROPBOX_REQUIRE_WRITE_APPROVAL` | Defaults to `true` |
| `DROPBOX_TIMEOUT_MS` | Caller-visible operation timeout, 1,000–120,000 ms |
| `DROPBOX_MAX_RETRIES` | Bounded read retry count, 0–5 |

The MCP hostname is validated to prevent redirecting provider credentials to an arbitrary host.

## Tools

| Tool | Capability | Risk | Approval | Preferred transport |
| --- | --- | --- | --- | --- |
| `dropbox.account.whoami` | Account identity/context | READ | No | MCP → SDK |
| `dropbox.folder.list` | List folder / cursor pagination | READ | No | MCP → SDK |
| `dropbox.file.metadata` | File/folder metadata | READ | No | MCP → SDK |
| `dropbox.search` | Search files/folders | READ | No | MCP → SDK |
| `dropbox.shared_link.list` | List shared links | READ | No | MCP → SDK |
| `dropbox.file.revisions.list` | List file revisions | READ | No | MCP → SDK |
| `dropbox.folder.create` | Create folder | WRITE | Configurable, default yes | MCP or SDK |
| `dropbox.file.create_text` | Create UTF-8 text file ≤ 5 MiB | WRITE | Configurable, default yes | MCP or SDK |
| `dropbox.file.copy` | Copy file/folder | WRITE | Configurable, default yes | MCP or SDK |
| `dropbox.file.move` | Move/rename file/folder | WRITE | Configurable, default yes | MCP or SDK |
| `dropbox.shared_link.create` | Create shared link | HIGH_RISK | Always | MCP or SDK |
| `dropbox.file.revision.restore` | Restore old revision | HIGH_RISK | Always | MCP or SDK |
| `dropbox.file.delete` | Move content to Deleted files | DESTRUCTIVE | Always | MCP or SDK |

No arbitrary URL/API executor is exposed. MCP v2 tool annotations additionally identify read-only and destructive behavior to compatible clients; connector-side policy remains authoritative.

## Approval model

The connector separates **Read → Recommend → Prepare → Execute**.

`READ` tools execute without approval. `WRITE` tools require approval by default, controlled by `DROPBOX_REQUIRE_WRITE_APPROVAL`. `HIGH_RISK` and `DESTRUCTIVE` tools always require approval.

Approval is an HMAC-SHA256 digest over the exact tool name and canonicalized execution arguments. A trusted UI/orchestrator with access to `DROPBOX_APPROVAL_SECRET` generates the digest only after a human approves the action. The LLM does not receive the secret.

This design binds approval to the exact operation and payload rather than accepting a generic `approved=true` flag.

## Validation and safety

- Dropbox paths are bounded and validated; mutating paths must be non-root absolute Dropbox paths.
- Inline file creation is capped at 5 MiB, matching the official Dropbox MCP `CreateFile` constraint.
- Shared-link audience is restricted to the documented audience enum used by the SDK.
- Revision IDs, cursors and other strings are length-bounded.
- The upstream MCP host is pinned to `mcp.dropbox.com`.
- Only an explicit allowlist of known official Dropbox MCP tools is accepted; newly advertised tools are not automatically trusted.
- Provider content is returned with `untrusted_provider_data: true`. Retrieved filenames, metadata, search results and links must be treated as data, not instructions.
- Credentials are never included in tool arguments or provider output.
- Permanent deletion is intentionally not implemented.

## Reliability

### Timeouts and cancellation

Remote MCP connection, discovery and tool calls are bounded by connector timeouts. SDK/API calls are guarded by a caller-visible hard timeout. The official Dropbox JavaScript SDK methods used here do not expose a per-call `AbortSignal`, so a timed-out SDK request may continue settling underneath after the connector has stopped waiting for it. A timeout is therefore **not retried**, even for reads. Mutating SDK calls are also never automatically retried, and mutating MCP failures never fall back to the SDK. This avoids replaying an action or issuing a concurrent duplicate request whose provider state may still be unresolved.

### Retries

Only read-side SDK/API calls are retried automatically, and only after an explicit provider response indicating a transient condition:

- HTTP 429
- HTTP 5xx

Backoff is bounded exponential backoff and honors `Retry-After` when available. Timeouts, authentication failures, permission failures and validation errors are not retried. Write operations are never blindly retried.

### MCP fallback

If the official MCP route fails on a **read** and SDK/API credentials are configured, the connector falls back to the official SDK. Mutating MCP calls fail closed instead of replaying through another transport after an ambiguous network/provider failure.

### Pagination

`dropbox.folder.list` exposes Dropbox cursors and uses `filesListFolderContinue` when the caller supplies one. Shared-link listing also accepts cursors. Search is bounded with `maxResults`.

## Rate limits

Dropbox does not publish one universal numeric request limit for every API operation/account type. The platform may return HTTP 429 and a `Retry-After` value. Dropbox Business plans can also have data-transport call limits; uploads count toward applicable transport limits.

The connector therefore:

- preserves `Retry-After`
- uses bounded exponential backoff for read calls after explicit 429/5xx responses
- avoids timeout-triggered replay and blind write retries
- limits list/search page sizes
- exposes cursors rather than automatically crawling entire accounts

## Error handling

Errors are normalized into connector errors without leaking tokens. Relevant behavior:

- `401`: no blind retry; refresh-token SDK auth may refresh automatically, otherwise the caller must re-authenticate.
- `403`: fail; permission/plan/account action may be required.
- `409`: provider conflict/path state error; fail rather than retrying mutations.
- `429`: read calls may retry using provider backoff.
- `5xx`: bounded read retry; writes fail without replay.
- timeout: fail closed; do not issue another SDK call while the prior request could still settle.
- MCP unknown/unadvertised tool: fail safely or use SDK fallback for reads only.

## Transport details

### Official MCP

The connector uses the official Streamable HTTP MCP endpoint through `@modelcontextprotocol/client` v2. Bearer authentication uses the SDK's `AuthProvider`; raw tokens are not placed in tool arguments. After connecting, the adapter discovers the server tool list and intersects it with a hard-coded allowlist. It does not automatically trust future Dropbox MCP tools.

### Official SDK/API fallback

The fallback uses the official Dropbox JavaScript SDK methods for API v2, including `filesListFolder`, `filesListFolderContinue`, `filesGetMetadata`, `filesSearchV2`, `filesCreateFolderV2`, `filesUpload`, `filesCopyV2`, `filesMoveV2`, `filesDeleteV2`, `sharingCreateSharedLinkWithSettings`, `sharingListSharedLinks`, `filesListRevisions`, `filesRestore`, and `usersGetCurrentAccount`.

## Testing

Normal unit tests require no live credentials. Mocks cover:

- configuration validation
- refresh-token configuration validation
- policy classification
- approval denial and acceptance
- deterministic approval canonicalization
- HTTP 429 read retry
- no write retry on server errors
- cursor pagination
- caller-visible timeout enforcement
- MCP read failure → SDK/API fallback
- MCP write failure → no fallback/replay

Run:

```bash
npm test
```

## Limitations

- The official Dropbox remote MCP is currently documented as beta; its tool schemas may evolve. The adapter fails safely if an expected tool is not advertised.
- This connector does not expose every official Dropbox MCP capability. File requests, restore events/folder rewind, transcript extraction, Markdown/OCR extraction and temporary download-link generation are intentionally outside this version's contract.
- `dropbox.file.create_text` is text-only and capped at 5 MiB. Large/binary uploads should use a separately designed upload-session capability with explicit file handling rather than placing binary data in an LLM tool argument.
- The Dropbox JavaScript SDK does not provide per-route cancellation in the methods used here; SDK timeout is therefore a caller-side boundary rather than guaranteed network cancellation.
- Delete uses normal Dropbox deletion semantics. Permanent deletion is not exposed.
- Team impersonation/admin APIs are not implemented; no tenant, account, user or namespace IDs are hard-coded.

## Client compatibility

This package uses MCP TypeScript SDK v2 and exposes a standards-based stdio MCP server through `@modelcontextprotocol/server`. It can be used by MCP clients that support stdio transport. Client-specific installation/configuration differs; the connector does not claim features outside the MCP protocol and implemented tool surface.
