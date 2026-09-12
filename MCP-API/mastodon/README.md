# Mastodon MCP/API Connector

Reusable MCP server that exposes a focused set of Mastodon operations through the official Mastodon REST API while keeping credentials inside the connector boundary.

## Provider and transport

Provider: Mastodon. External transport: MCP over stdio. Upstream transport: official REST API for the configured Mastodon instance. No official Mastodon MCP server is documented in the official Mastodon developer documentation, so this connector uses the official HTTP API directly rather than depending on an unofficial MCP implementation.

Official references used for this implementation:

- API overview and authentication: https://docs.joinmastodon.org/api/
- OAuth tokens: https://docs.joinmastodon.org/api/oauth-tokens/
- OAuth scopes: https://docs.joinmastodon.org/api/oauth-scopes/
- Status methods: https://docs.joinmastodon.org/methods/statuses/
- Timeline methods: https://docs.joinmastodon.org/methods/timelines/
- Search: https://docs.joinmastodon.org/methods/search/
- Notifications: https://docs.joinmastodon.org/methods/notifications/
- Favourites: https://docs.joinmastodon.org/methods/favourites/
- Bookmarks: https://docs.joinmastodon.org/methods/bookmarks/
- Rate limits: https://docs.joinmastodon.org/api/rate-limits/

## Architecture

```text
MCP client
  -> MCP stdio server
  -> strict Zod tool schema
  -> risk/approval policy
  -> MastodonClient
  -> credential header injection
  -> configured Mastodon HTTPS origin
```

Provider content is returned with `untrusted_provider_content: true`. Retrieved status text, profile HTML, links, and other remote data must be treated as data rather than trusted instructions.

## Authentication

Create a Mastodon OAuth application on the target instance, complete the authorization-code flow outside this connector, and supply the resulting user access token through `MASTODON_ACCESS_TOKEN`. Mastodon user tokens do not normally expire automatically, but they can be revoked. The connector never emits or forwards the token to the MCP client.

Use the least-privilege scopes needed by the enabled tools. Recommended scopes for all implemented capabilities are:

```text
profile
read:statuses
read:search
read:notifications
read:favourites
read:bookmarks
write:statuses
write:favourites
write:bookmarks
```

If only read tools are needed, do not grant write scopes. Scope availability can vary by Mastodon version; consult the target instance and official scope-discovery guidance.

## Environment variables

Copy `.env.example` values into your secret manager or process environment. Do not commit real credentials.

- `MASTODON_BASE_URL` — HTTPS origin of the target instance, e.g. `https://mastodon.social`. Paths, embedded credentials, query strings, and fragments are rejected.
- `MASTODON_ACCESS_TOKEN` — OAuth user access token.
- `MASTODON_TIMEOUT_MS` — request timeout, default 15000, range 1000–120000.
- `MASTODON_MAX_RETRIES` — bounded retry count, default 3, maximum 5.
- `MASTODON_ALLOW_WRITES` — enables WRITE tools when set to `true`.
- `MASTODON_ALLOW_HIGH_RISK` — enables public/external publishing actions when set to `true`.
- `MASTODON_ALLOW_DESTRUCTIVE` — enables destructive status deletion when set to `true`.

## Install and run

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
npm test
npm start
```

Configure an MCP client to launch `node dist/src/server.js` with the required environment variables. The server uses stdio and does not open a network listener.

## Implemented tools

| Tool | Upstream API | Risk | Approval |
|---|---|---:|---|
| `mastodon.profile.me` | `GET /api/v1/accounts/verify_credentials` | READ | no |
| `mastodon.timeline.public` | `GET /api/v1/timelines/public` | READ | no |
| `mastodon.timeline.home` | `GET /api/v1/timelines/home` | READ | no |
| `mastodon.search` | `GET /api/v2/search` | READ | no |
| `mastodon.notifications.list` | `GET /api/v1/notifications` | READ | no |
| `mastodon.favourites.list` | `GET /api/v1/favourites` | READ | no |
| `mastodon.bookmarks.list` | `GET /api/v1/bookmarks` | READ | no |
| `mastodon.status.get` | `GET /api/v1/statuses/:id` | READ | no |
| `mastodon.status.create` | `POST /api/v1/statuses` | HIGH_RISK | `approved-high-risk` |
| `mastodon.status.delete` | `DELETE /api/v1/statuses/:id` | DESTRUCTIVE | `approved-destructive` |
| `mastodon.status.favourite` | `POST /api/v1/statuses/:id/favourite` | WRITE | `approved` |
| `mastodon.status.unfavourite` | `POST /api/v1/statuses/:id/unfavourite` | WRITE | `approved` |
| `mastodon.status.reblog` | `POST /api/v1/statuses/:id/reblog` | HIGH_RISK | `approved-high-risk` |
| `mastodon.status.unreblog` | `POST /api/v1/statuses/:id/unreblog` | WRITE | `approved` |
| `mastodon.status.bookmark` | `POST /api/v1/statuses/:id/bookmark` | WRITE | `approved` |
| `mastodon.status.unbookmark` | `POST /api/v1/statuses/:id/unbookmark` | WRITE | `approved` |

Publishing a status and boosting content are classified HIGH_RISK because they create externally visible social activity. Deletion is DESTRUCTIVE and disabled by default.

## Validation and safety

Status IDs are restricted to numeric local IDs. Search text and status content have explicit length bounds. Visibility is enumerated. Language tags are format-constrained. The connector does not expose a raw arbitrary-request tool.

The configured Mastodon origin must be HTTPS and cannot include a path, URL credentials, query string, or fragment. This prevents tool callers from injecting an alternate host or arbitrary URL per invocation. Administrators remain responsible for choosing a trusted Mastodon instance when configuring the process.

Credentials are injected only in the HTTP `Authorization` header inside `MastodonClient`; tool output never contains the configured token. Provider responses are explicitly marked untrusted.

## Reliability and rate limits

Mastodon documents default limits of 300 API calls per five minutes per account and per IP, with tighter limits for some operations such as media uploads and deleting statuses. Servers may customize behavior.

The client handles `429` and 5xx responses with bounded exponential backoff. It honors numeric `Retry-After` values when available and preserves rate-limit reset information in `MastodonError.retryAfter`. Authentication, permission, validation, and ordinary 4xx errors are not retried. Generic network failures are retried only for GET requests, so write and destructive operations are never blindly replayed. Status creation uses an `Idempotency-Key` to reduce duplicate publication risk.

Mastodon pagination commonly uses `max_id`, `min_id`, `since_id`, and HTTP `Link` headers. The exposed list tools accept bounded cursor parameters directly and intentionally avoid automatic multi-page crawling, preventing unexpectedly large request fan-out.

## Error handling

Non-success Mastodon responses are mapped to `MastodonError` with HTTP status and provider error text when present. OAuth revocation and missing scopes surface as provider 401/403 responses and require operator action; the connector does not attempt to escalate scopes or refresh permissions silently. Timeouts use `AbortController`.

## Examples

See `examples/workflows.md` for read, search, publish, bookmark, and destructive-delete examples with permission and approval requirements.

## Testing

`npm test` uses Node's built-in test runner with mocked `fetch`; no live Mastodon credentials are required. Tests cover configuration validation, tool registration/risk classification, permission denial, authentication error mapping, and retry behavior for throttled reads.

## Limitations

- OAuth application registration and browser authorization are intentionally outside the MCP process. Supply the resulting user token securely.
- Media upload, polls, scheduled statuses, account follow/unfollow, moderation, reports, and administration APIs are not exposed in this connector.
- Public timeline availability and full-text status search depend on instance configuration.
- Mastodon server versions differ; scope and endpoint support should be checked against the target server.
- This package exposes MCP over stdio. Compatibility requires an MCP client capable of launching stdio servers; no claim is made for environments that require only remote HTTP MCP servers.
