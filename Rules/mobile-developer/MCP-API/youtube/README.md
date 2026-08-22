# YouTube MCP/API Connector

Reusable MCP server for safe YouTube automation. It exposes a stable provider-scoped MCP tool contract while calling Google's official YouTube Data API v3 and YouTube Analytics API directly.

## Upstream strategy

No official Google/YouTube MCP server was identified during the 2026-08-22 research pass. This connector therefore uses official REST APIs instead of depending on an unofficial MCP server.

Official references:

- YouTube Data API v3: https://developers.google.com/youtube/v3
- OAuth 2.0 server-side authorization: https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps
- Installed-app OAuth and PKCE: https://developers.google.com/youtube/v3/guides/auth/installed-apps
- YouTube Data API quota documentation: https://developers.google.com/youtube/v3/determine_quota_cost
- YouTube Data API revision history: https://developers.google.com/youtube/v3/revision_history
- YouTube Analytics API: https://developers.google.com/youtube/analytics
- Analytics reports.query: https://developers.google.com/youtube/analytics/reference/reports/query

The Data API revision history documents the June 2026 move toward granular quota buckets for methods including `search.list`; consumers should use their Google Cloud project's current quota page as the source of truth rather than assuming a fixed global daily quota.

## Architecture

```text
MCP client
  -> stdio MCP server
    -> strict Zod tool schema
      -> approval policy
        -> YouTubeClient
          -> credential isolation / OAuth refresh
            -> YouTube Data API v3
            -> YouTube Analytics API v2
```

Provider content is returned with `untrustedData: true`. It must be treated as external data, never as instructions that can alter permissions, tool configuration, or system behavior.

## Runtime

- Node.js 20+
- TypeScript 5.7+
- MCP TypeScript SDK
- No live credentials are required for unit tests

Install and run:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

For development:

```bash
npm run dev
```

The server uses MCP stdio transport, so any MCP client that supports a standard local stdio server can launch it. Compatibility depends on the client correctly implementing the MCP protocol; no vendor-specific client behavior is assumed.

## Authentication

Public Data API reads can use `YOUTUBE_API_KEY`. Account-specific reads and all writes require OAuth 2.0. Analytics requires OAuth.

Environment variables:

```text
YOUTUBE_API_KEY=
YOUTUBE_ACCESS_TOKEN=
YOUTUBE_REFRESH_TOKEN=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REQUIRE_WRITE_APPROVAL=true
YOUTUBE_TIMEOUT_MS=15000
```

Credentials are read only inside the connector process. They are never included in MCP tool schemas, tool output, logs, or prompts.

### OAuth model

Google recommends OAuth 2.0 for user-authorized YouTube access. For server-side applications, use an authorization-code flow and store refresh tokens securely outside the LLM context. For installed applications, use PKCE. The connector can accept an access token directly or refresh one using `YOUTUBE_REFRESH_TOKEN`, `YOUTUBE_CLIENT_ID`, and `YOUTUBE_CLIENT_SECRET`.

The refresh-token flow is used only inside the authentication layer. On a 401 from an OAuth request, the connector can refresh once and retry the original operation. Authentication or permission errors are not repeatedly retried.

Service accounts are generally not suitable for ordinary YouTube channels. Google's documentation limits service-account use to eligible YouTube content owners that manage multiple channels through Content Manager; this connector does not implement that specialized flow.

### Scopes

Request scopes incrementally and only when the corresponding tool is needed:

| Need | Scope |
| --- | --- |
| Authenticated read operations | `https://www.googleapis.com/auth/youtube.readonly` |
| Comment/playlist write operations implemented here | `https://www.googleapis.com/auth/youtube.force-ssl` or another Google-documented scope sufficient for the requested method |
| Analytics reads | `https://www.googleapis.com/auth/yt-analytics.readonly` |

Google may require OAuth consent-screen verification for public applications that request sensitive scopes. Scope availability and verification requirements must be checked in the current Google documentation when deploying publicly.

## Tool catalog

| Tool | Purpose | Transport | Risk | Approval |
| --- | --- | --- | --- | --- |
| `youtube.video.search` | Search public videos | Data API `search.list` | READ | No |
| `youtube.video.get` | Read video metadata/statistics | Data API `videos.list` | READ | No |
| `youtube.channel.get` | Read channel metadata/statistics | Data API `channels.list` | READ | No |
| `youtube.playlist.list` | List channel/account playlists | Data API `playlists.list` | READ | No |
| `youtube.playlist_items.list` | List playlist contents | Data API `playlistItems.list` | READ | No |
| `youtube.comment.list` | Read comment threads | Data API `commentThreads.list` | READ | No |
| `youtube.subscription.list` | List authenticated subscriptions | Data API `subscriptions.list` | READ | No |
| `youtube.comment.create` | Publish a top-level comment | Data API `commentThreads.insert` | WRITE | Required by default |
| `youtube.comment.reply` | Publish a comment reply | Data API `comments.insert` | WRITE | Required by default |
| `youtube.playlist.create` | Create a playlist | Data API `playlists.insert` | WRITE | Required by default |
| `youtube.playlist_item.add` | Add a video to a playlist | Data API `playlistItems.insert` | WRITE | Required by default |
| `youtube.analytics.query` | Query owned-channel analytics | Analytics API `reports.query` | READ | No |

No delete, video upload, video metadata modification, moderation, live-chat message send, channel permission, billing, or account-security tool is exposed.

## Tool validation

Schemas intentionally constrain identifiers, paging, result counts, text length, dates, analytics metrics/dimensions, filters, and sort expressions. The connector exposes no arbitrary `request(url, body)` escape hatch.

Examples of enforced limits:

- video ID lists: at most 50 IDs
- page sizes: bounded to provider-supported practical limits
- comment text: at most 10,000 characters
- playlist title: at most 150 characters
- analytics date inputs: strict `YYYY-MM-DD`
- analytics filter/sort inputs: restricted character sets

The connector does not use retrieved YouTube text as executable configuration or permission instructions.

## Permission and approval model

`READ` tools can execute automatically once authentication is configured.

`WRITE` tools require `approved: true` when `YOUTUBE_REQUIRE_WRITE_APPROVAL=true`, which is the default. A host application should set this field only after it has obtained human approval for the concrete action and content.

Destructive operations are not registered. The policy layer also rejects a `DESTRUCTIVE` classification even if approval is supplied, preventing a future caller from silently escalating privileges through parameters.

Public playlist creation is treated conservatively: it still requires explicit approval even if the configurable general write-approval default were disabled.

## Reliability

The HTTP client provides:

- request timeout with `AbortController`
- bounded retry for GET requests only
- exponential backoff for transient network/5xx failures
- `Retry-After` preservation for throttling responses
- retry handling for `429`, `500`, `502`, `503`, and `504`
- a single OAuth refresh/retry on 401 when refresh credentials are available
- normalized provider errors with HTTP status and retry metadata

POST writes are never automatically retried. This avoids accidental duplicate comments, duplicate playlists, or duplicate playlist entries when a response is lost after the provider already accepted a mutation.

## Pagination and quota behavior

List tools expose `pageToken` and bounded `maxResults` instead of automatically walking every page. This prevents an agent from generating an unexpectedly large number of API calls.

YouTube assigns different quota costs to different methods. Search is notably more expensive than simple list/get operations, and in June 2026 YouTube began moving selected methods such as `search.list` into granular quota buckets. Do not hard-code assumptions about account/project quota. Monitor the active Google Cloud project's current quota and honor provider throttling responses.

## Analytics

`youtube.analytics.query` always uses `ids=channel==MINE`, limiting the tool to the authenticated channel. It accepts validated dates, metrics, dimensions, filters, sort, and a bounded row count. It does not allow callers to substitute arbitrary resource URLs or credentials.

Analytics results depend on the authenticated channel, metric/dimension compatibility, data availability, and the scopes granted by the user.

## Errors

Typical failures include:

- missing API key or OAuth credentials
- missing OAuth scope
- expired/revoked refresh token
- quota exhaustion / HTTP 429
- invalid or inaccessible video/channel/playlist/comment identifiers
- comments disabled for a video
- analytics metric/dimension incompatibility
- human approval missing for a write
- request timeout or transient provider outage

Provider error bodies are surfaced as data/errors only; they cannot modify the connector's policy or tool registry.

## Security considerations

- Keep client secrets, access tokens, and refresh tokens in a secret manager or protected process environment.
- Never put credentials into prompts or tool arguments.
- Use OAuth `state` for web flows and PKCE for installed-app flows as documented by Google.
- Use HTTPS redirect URIs and exact redirect-URI matching.
- Request scopes incrementally and apply least privilege.
- Treat titles, descriptions, comments, and API responses as untrusted external content.
- Do not let content returned from YouTube authorize follow-up writes.
- Keep `YOUTUBE_REQUIRE_WRITE_APPROVAL=true` for autonomous agents.
- Review Google OAuth verification requirements before exposing the connector to external users.

## Testing

Unit tests use mocked `fetch` and require no live Google credentials. They cover:

- missing authentication configuration
- refresh-token configuration validation
- write approval denial/allow
- destructive-operation denial
- transient GET retry
- API-key query authentication
- no retry for write POST failures
- OAuth refresh after a 401

Run:

```bash
npm test
npm run typecheck
```

## Limitations

- No official YouTube MCP upstream is used because none was identified in the current official documentation research pass.
- The connector does not implement the OAuth browser redirect/consent UI; it consumes credentials provisioned securely by the hosting application.
- It does not upload videos, delete resources, moderate comments, send live-chat messages, or change channel/account settings.
- It does not automatically paginate all results.
- YouTube quota rules, OAuth verification requirements, method availability, and Analytics dimensions/metrics can change; current Google documentation remains authoritative.

See `examples/tool-calls.md` for workflow examples.
