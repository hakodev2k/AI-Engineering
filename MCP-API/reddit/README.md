# Reddit MCP/API Connector

Reusable Model Context Protocol server for Reddit workflows. It exposes a stable MCP tool surface while using Reddit's official OAuth API at `https://oauth.reddit.com`.

## Transport strategy

No official general-purpose Reddit MCP server is currently documented for external MCP clients. Reddit's official Developer Platform/Devvit provides Reddit API access inside Reddit-hosted apps, but it is not a drop-in remote MCP transport for ChatGPT, Claude Code, Cursor, or custom MCP clients. This connector therefore uses the official Reddit OAuth REST API directly.

Official sources used for this implementation:

- Reddit API reference: https://www.reddit.com/dev/api/
- Reddit for Developers API overview: https://developers.reddit.com/docs/capabilities/server/reddit-api
- Reddit user actions documentation: https://developers.reddit.com/docs/capabilities/server/userActions

Reddit announced in August 2026 that public API access will gradually become more restricted for new third-party apps in favor of the Developer Platform. Existing API access rules and application approval requirements still apply. Operators must ensure their Reddit application is authorized for the intended use.

## Supported capabilities

| MCP tool | Upstream | Scope | Risk | Approval |
|---|---|---|---|---|
| `reddit.identity.get` | REST | `identity` | READ | No |
| `reddit.subreddit.search` | REST | `read` | READ | No |
| `reddit.subreddit.get` | REST | `read` | READ | No |
| `reddit.post.list` | REST | `read` | READ | No |
| `reddit.post.search` | REST | `read` | READ | No |
| `reddit.post.get` | REST | `read` | READ | No |
| `reddit.comments.list` | REST | `read` | READ | No |
| `reddit.comment.create` | REST | `submit` | WRITE | Yes |
| `reddit.post.create` | REST | `submit` | WRITE | Yes |
| `reddit.thing.save` | REST | `save` | WRITE | Yes |
| `reddit.thing.unsave` | REST | `save` | WRITE | Yes |

The connector intentionally does not expose voting, moderation, deletion, messaging, arbitrary HTTP requests, or account-management operations.

## Architecture

```text
MCP client
  -> local stdio MCP server
     -> strict Zod tool schemas
     -> allowlist + approval policy
     -> RedditClient
        -> RedditAuth
        -> OAuth REST API
```

Provider credentials remain in the connector process. Tool responses never include access tokens, refresh tokens, client secrets, or authorization headers. Reddit content is untrusted external data and must never be interpreted as instructions that can change connector policy.

## Authentication

Use an OAuth access token directly, or provide a refresh token plus client credentials so the connector can refresh automatically.

Required environment values:

```text
REDDIT_ACCESS_TOKEN=
REDDIT_REFRESH_TOKEN=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=web:ai-engineering-reddit-mcp:v1.0 (by u/your_username)
```

At least one of `REDDIT_ACCESS_TOKEN` or `REDDIT_REFRESH_TOKEN` is required. When a refresh token is supplied, `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` are also required.

Request only the scopes needed by the tools you plan to enable:

- Read-only research: `read`
- Authenticated identity: `identity`
- Posting/commenting: `submit`
- Save/unsave: `save`

Do not place tokens in prompts, tool parameters, examples, logs, or committed files.

## Safety configuration

Optional environment values:

```text
REDDIT_ALLOWED_SUBREDDITS=typescript,node
REDDIT_APPROVAL_SECRET=
REDDIT_TIMEOUT_MS=15000
REDDIT_MAX_RETRIES=3
```

`REDDIT_ALLOWED_SUBREDDITS` limits tools that address a specific subreddit. An empty value means no connector-side subreddit allowlist.

All WRITE tools require an approval ID. The connector verifies a 64-character HMAC-SHA256 digest computed over the exact MCP tool name with `REDDIT_APPROVAL_SECRET`. READ tools never require this approval token.

This separates recommend/prepare behavior from public execution. Public posts and comments cannot be sent silently by an agent.

## Installation

Requirements: Node.js 20 or newer.

```bash
cd MCP-API/reddit
npm install
npm run build
```

## Running

```bash
npm start
```

The server uses MCP stdio transport. Configure an MCP-capable client to launch the built server process and provide credentials through its environment/secret mechanism.

## Tool behavior

### Discovery and reading

`reddit.subreddit.search` searches subreddit metadata. `reddit.subreddit.get` reads one subreddit. `reddit.post.list` supports `hot`, `new`, `top`, and `rising`, with listing cursors (`after`) rather than page numbers. `reddit.post.search` supports global or subreddit-scoped post search. `reddit.comments.list` reads the post/comment tree. `reddit.post.get` accepts a Reddit post fullname such as `t3_abc123`.

Reddit listing pagination uses `after` cursors. Tool schemas cap requested result counts to reduce unnecessary API traffic and context growth.

### Public writes

`reddit.post.create` supports self posts and link posts. The schema rejects an URL on self posts and requires an URL for link posts. `reddit.comment.create` requires a `t1_*` or `t3_*` parent fullname. Both require explicit connector approval.

### Saved items

`reddit.thing.save` and `reddit.thing.unsave` operate only on `t1_*` comments and `t3_*` posts and require explicit approval because they mutate the authenticated account.

## Reliability and rate limits

The client:

- enforces a configurable timeout per request;
- retries only HTTP 429 and 5xx/network failures;
- uses bounded exponential backoff;
- honors `Retry-After` or Reddit's `X-Ratelimit-Reset` when present;
- never blindly retries 4xx permission/validation failures;
- refreshes OAuth once on HTTP 401 when refresh credentials are available;
- caps retries at five through configuration validation.

Reddit exposes rate-limit metadata through response headers such as `X-Ratelimit-Remaining`, `X-Ratelimit-Used`, and `X-Ratelimit-Reset`. Exact quotas can vary by API access status and policy; the connector does not hard-code a quota that Reddit may change.

## Errors

Provider HTTP failures are surfaced as `RedditApiError` with status and bounded response text. OAuth refresh failures produce explicit authentication errors. Timeouts are mapped to a connector-level timeout error. Validation and approval failures occur before the provider request is made.

## Security considerations

- OAuth secrets are isolated in environment/secret storage.
- No arbitrary URL or raw REST execution tool exists, avoiding an SSRF-style escape hatch.
- Subreddit identifiers, fullnames, URLs, lengths, enum values, and result sizes are validated.
- Write operations are approval-gated.
- Retrieved Reddit posts/comments are treated as untrusted content, not instructions.
- The server does not dynamically discover or trust upstream tools because no upstream MCP server is used.
- The connector intentionally omits destructive and high-abuse operations.
- Use a narrow-scope Reddit application and a descriptive User-Agent that complies with Reddit API rules.

## Testing

No live Reddit credentials are required for unit tests.

```bash
npm test
npm run typecheck
```

Tests cover configuration validation, subreddit permission denial, write approval, OAuth token refresh, provider error mapping, and bounded retry behavior for throttling.

## Examples

See `examples/workflows.json` for read-only research, approved public posting, and approved commenting workflows.

## Limitations

- Reddit may require application review/approval and may restrict new third-party API access under its evolving Developer Platform policy.
- The connector does not implement the Reddit Ads API.
- Devvit-specific application features/events are not exposed because this package is an external MCP connector rather than a Reddit-hosted Devvit app.
- Voting is intentionally omitted because it is not necessary for the core agent workflows and carries elevated manipulation/abuse risk.
- Moderation, private messages, deletion, user/friend operations, and subreddit administration are intentionally not implemented.
