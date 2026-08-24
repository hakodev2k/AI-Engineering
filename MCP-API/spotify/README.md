# Spotify MCP/API Connector

Reusable Model Context Protocol (MCP) server for Spotify. It exposes a small, stable agent-facing tool contract over the official Spotify Web API while keeping OAuth credentials inside the connector process.

## Transport strategy

No official Spotify MCP server was identified in Spotify's official developer documentation during implementation. The connector therefore uses Spotify's official REST Web API directly and exposes those capabilities as local MCP tools over stdio.

Official sources:

- Web API: https://developer.spotify.com/documentation/web-api
- API calls/base URL: https://developer.spotify.com/documentation/web-api/concepts/api-calls
- OAuth 2.0 authorization: https://developer.spotify.com/documentation/web-api/concepts/authorization
- Scopes: https://developer.spotify.com/documentation/web-api/concepts/scopes
- Refreshing tokens: https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens
- Rate limits: https://developer.spotify.com/documentation/web-api/concepts/rate-limits
- Search: https://developer.spotify.com/documentation/web-api/reference/search
- Playlists: https://developer.spotify.com/documentation/web-api/concepts/playlists
- Create playlist: https://developer.spotify.com/documentation/web-api/reference/create-playlist
- Add playlist items: https://developer.spotify.com/documentation/web-api/reference/add-items-to-playlist
- Playlist items: https://developer.spotify.com/documentation/web-api/reference/get-playlists-items
- July 23, 2026 Development Mode quota update: https://developer.spotify.com/blog/2026-07-23-web-api-quota-updates
- June 18, 2026 refresh-token expiration announcement: https://developer.spotify.com/blog/2026-06-18-refresh-token-expiration

## Implemented capabilities

All upstream operations use the official Spotify Web API.

| MCP tool | Upstream operation | Risk | Approval |
|---|---|---|---|
| `spotify.catalog.search` | `GET /search` | READ | No |
| `spotify.track.get` | `GET /tracks/{id}` | READ | No |
| `spotify.artist.get` | `GET /artists/{id}` | READ | No |
| `spotify.album.get` | `GET /albums/{id}` | READ | No |
| `spotify.user.me` | `GET /me` | READ | No |
| `spotify.user.top` | `GET /me/top/{type}` | READ | No |
| `spotify.playlist.list_mine` | `GET /me/playlists` | READ | No |
| `spotify.playlist.get` | `GET /playlists/{id}` | READ | No |
| `spotify.playlist.items` | `GET /playlists/{id}/items` | READ | No |
| `spotify.playlist.create` | `POST /me/playlists` | WRITE | Yes |
| `spotify.playlist.add_items` | `POST /playlists/{id}/items` | WRITE | Yes |
| `spotify.playlist.remove_items` | `DELETE /playlists/{id}/items` | DESTRUCTIVE | Yes + opt-in |

The connector intentionally does not expose arbitrary HTTP requests, playback control, account changes, billing, downloads, or raw credential operations.

## Architecture

```text
Agent / MCP client
        |
        v
src/server.ts        strict MCP schemas + tool risk boundaries
        |
        +--> src/policy.ts   HMAC approval + destructive opt-in
        |
        v
src/client.ts        timeout, error mapping, safe read retries, rate-limit handling
        |
        v
src/auth.ts          access-token cache / OAuth refresh
        |
        v
Spotify Web API
```

Provider responses are treated as untrusted data. Retrieved titles, descriptions, artist metadata, playlist metadata, and other Spotify content never alter connector permissions or approval policy.

## Runtime

- Node.js 20 or later
- npm
- A Spotify Developer application and an OAuth user grant for user-specific endpoints

Install and build:

```bash
cd MCP-API/spotify
npm install
npm run build
```

Run the stdio MCP server:

```bash
npm start
```

Any MCP client that can launch a local stdio server can invoke this connector. Clients that only accept remote HTTP MCP endpoints require an external trusted stdio-to-remote bridge; this package does not claim native remote-MCP hosting.

## Authentication

Spotify uses OAuth 2.0. The connector supports two runtime credential modes.

### Existing access token

```text
SPOTIFY_ACCESS_TOKEN=<current-user-access-token>
```

This is convenient for short sessions. Spotify access tokens are short-lived, so long-running deployments should use refresh credentials.

### Server-side refresh credentials

```text
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

The client ID, client secret, and refresh token remain in the connector process. The LLM sees none of them. `src/auth.ts` exchanges the refresh token at Spotify's token endpoint and caches the resulting access token.

Spotify's 2026 refresh-token policy gives Developer Dashboard refresh tokens a six-month lifetime. Expired or revoked refresh credentials require the user to complete authorization again; authentication failures are not blindly retried.

For public-only catalog applications, Spotify also supports Client Credentials, but this connector does not implement that flow because its main workflows include user profile/top-items and playlist management.

## Required OAuth scopes

Request only scopes needed by the tools you enable.

Recommended read set:

```text
user-read-private
user-top-read
playlist-read-private
playlist-read-collaborative
```

Write scopes when playlist writes are required:

```text
playlist-modify-private
playlist-modify-public
```

`user-read-email` is not required by this connector because it does not need the user's email address.

Notes:

- `user-top-read` is required by `spotify.user.top`.
- `playlist-read-private` is required to include private playlists and is required by playlist item access where applicable.
- `playlist-read-collaborative` includes collaborative playlists in current-user playlist listings.
- `playlist-modify-private` manages private playlists.
- `playlist-modify-public` manages public playlists.
- Creating a collaborative playlist requires `public=false`; Spotify documentation states collaborative playlists require the relevant playlist modification permissions.

## Environment variables

Copy `.env.example` into your own secret-management mechanism. Do not commit real credentials.

| Variable | Purpose |
|---|---|
| `SPOTIFY_ACCESS_TOKEN` | Existing OAuth bearer token |
| `SPOTIFY_CLIENT_ID` | OAuth client ID for refresh mode |
| `SPOTIFY_CLIENT_SECRET` | OAuth client secret for refresh mode |
| `SPOTIFY_REFRESH_TOKEN` | User refresh token for refresh mode |
| `SPOTIFY_APPROVAL_SECRET` | Local secret used to verify write approval IDs |
| `SPOTIFY_ENABLE_DESTRUCTIVE` | Must be `true` to permit item removal |
| `SPOTIFY_TIMEOUT_MS` | Per-request timeout, default 15000 |
| `SPOTIFY_MAX_RETRIES` | Bounded retries for GET only, default 3, max 5 |

## Permission and approval model

READ tools execute without approval after OAuth authorization.

WRITE tools require a 64-character HMAC-SHA256 approval ID derived from the exact tool name and `SPOTIFY_APPROVAL_SECRET`. This deliberately binds an approval to one tool instead of creating a reusable global elevation token.

Example local approval generation:

```bash
node -e "const c=require('node:crypto'); console.log(c.createHmac('sha256', process.env.SPOTIFY_APPROVAL_SECRET).update('spotify.playlist.create').digest('hex'))"
```

`spotify.playlist.remove_items` is classified DESTRUCTIVE and is additionally disabled unless:

```text
SPOTIFY_ENABLE_DESTRUCTIVE=true
```

An agent cannot enable this flag or change the approval secret through any MCP tool.

## Safety behavior

- Playlist creation defaults to `public=false` in this connector even though Spotify's API may otherwise default new playlists to public. Publishing therefore requires an explicit `public=true` input plus write approval.
- Collaborative playlist creation rejects `public=true`.
- Playlist add/remove calls accept at most 100 Spotify track/episode URIs, matching Spotify's documented per-request add-item maximum and bounding tool payloads.
- Item removal can include `snapshotId` to take advantage of Spotify playlist snapshot/version semantics.
- No tool downloads audio or facilitates stream ripping.
- Spotify metadata/content must not be used to train an ML/AI model. This restriction is explicitly carried in the manifest and search-tool description.
- Spotify visual content must retain required attribution and must not be modified contrary to Spotify's platform rules; this connector only returns metadata/URLs and performs no image transformation.

## Reliability and rate limits

Spotify rate limits are evaluated over a rolling 30-second window. The exact allowance depends on application mode. A `429` may include `Retry-After`.

As of July 23, 2026, Development Mode quota is counted per developer account across its Development Mode Client IDs, and quota exhaustion can return `429` with `reason: "QUOTA_EXCEEDED"`.

The connector:

- preserves `Retry-After` on surfaced `SpotifyApiError` instances;
- applies bounded exponential backoff to GET requests for `429`, `5xx`, and transient network failures;
- never automatically retries POST/PUT/DELETE writes, preventing duplicate playlist mutations;
- refreshes once on `401` when refresh credentials are available;
- enforces a configurable request timeout;
- exposes explicit `limit`/`offset` pagination instead of recursively fetching unbounded result sets.

Authentication, authorization, and validation errors are not treated as generic retryable failures.

## Tool input notes

### `spotify.catalog.search`

- `query`: 1..500 characters
- `types`: one or more supported Spotify search types
- `market`: optional uppercase ISO 3166-1 alpha-2 code
- `limit`: 1..10
- `offset`: 0..1000

### Entity get tools

Spotify IDs are restricted to alphanumeric identifiers before being interpolated into API paths. Path values are URL-encoded.

### `spotify.playlist.create`

- `name`: required, maximum 100 characters
- `public`: defaults to `false`
- `collaborative`: defaults to `false`
- `description`: maximum 300 characters
- `approvalId`: required by policy

### Playlist item writes

URIs must match:

```text
spotify:track:<id>
spotify:episode:<id>
```

Arbitrary URLs and arbitrary API paths are rejected by schema design.

## Error handling

Provider errors are surfaced with HTTP status and a capped response body. Secrets are not inserted into error messages. Common operational cases include:

- `401`: expired/invalid token; refresh attempted once when configured
- `403`: missing scope, ownership/collaboration restrictions, or application access limitation
- `404`: invalid/unavailable Spotify resource
- `429`: rate limit or Development Mode quota; `Retry-After` is preserved when supplied
- `5xx`: retried only for GET requests within the configured bound
- timeout: surfaced as a connector timeout error

## Testing

Unit tests use mocks and require no live Spotify credentials.

```bash
npm test
npm run typecheck
```

Tests cover:

- authentication configuration;
- OAuth refresh-token exchange;
- bearer credential isolation in the HTTP layer;
- approval binding and denial;
- destructive-operation default denial;
- provider error mapping;
- `Retry-After` preservation;
- no automatic retry for writes;
- registration of the 12-tool external contract.

## Example workflows

See `examples/workflows.json` for machine-readable examples showing tool input, expected output shape, required permission, and approval status.

Typical read-to-write workflow:

```text
spotify.catalog.search
  -> spotify.track.get
  -> spotify.playlist.list_mine
  -> human approves mutation
  -> spotify.playlist.add_items
```

Typical destructive workflow:

```text
spotify.playlist.items
  -> recommend removals
  -> human reviews
  -> operator enables destructive mode
  -> tool-specific approval
  -> spotify.playlist.remove_items
```

## Limitations

- No official Spotify MCP transport is used because no official Spotify MCP server was identified.
- The package exposes stdio MCP only; it does not host a remote HTTP MCP endpoint.
- Interactive OAuth authorization/PKCE UI is intentionally outside the MCP server. Obtain the initial user grant through your application's normal OAuth flow, then provide an access token or refresh credentials through a secret store/environment.
- Refresh tokens can expire after six months under Spotify's current 2026 policy and then require reauthorization.
- This connector does not control playback, modify saved libraries, follow/unfollow entities, upload images, download media, or expose every Spotify endpoint.
- API availability can differ by market, user account, application mode, scopes, ownership/collaboration state, and Spotify policy changes.
