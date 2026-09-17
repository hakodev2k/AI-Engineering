# Slack MCP/API Connector

Reusable MCP server for Slack collaboration workflows. It exposes stable provider-scoped tools while keeping Slack credentials inside the connector.

## Upstream strategy

Slack's official MCP server is generally available and supports search, reading/sending messages, files, canvases/lists and member information. Where a compatible client and workspace can use that official server, it is preferred. This repository connector provides a portable deterministic fallback through Slack's official Web API; callers keep the same conceptual tool surface and never receive tokens.

Official sources researched for this connector: Slack's MCP guide and February 17, 2026 GA announcement (`slack.com/help/articles/48855576908307`, `slack.com/blog/news/mcp-real-time-search-api-now-available`), Web API method documentation under `api.slack.com/methods`, OAuth documentation under `api.slack.com/authentication/oauth-v2`, and Slack rate-limit documentation/changelog. Slack changed `conversations.history` and `conversations.replies` limits for certain commercially distributed non-Marketplace apps; therefore this connector preserves pagination and `Retry-After` rather than assuming a fixed quota.

## Capabilities

Implemented Web API fallback tools: `slack.conversation.list`, `slack.conversation.history`, `slack.thread.read`, `slack.message.send`, `slack.message.update`, `slack.message.delete`, `slack.user.get`, `slack.user.list`, `slack.reaction.get`, and `slack.reaction.add`. No arbitrary endpoint proxy is exposed. Search, files, canvases and lists are not claimed by this fallback implementation even though Slack's official MCP can support them.

## Architecture and security

MCP client -> stdio MCP server -> strict Zod validation -> permission/approval gate -> `SlackClient` -> Slack Web API. Retrieved Slack content is untrusted data and is never interpreted as permission or configuration. Tokens are loaded only from process environment. The server does not print credentials. Fixed `https://slack.com/api/` routing prevents caller-controlled SSRF destinations. Writes require a runtime approval value; deletion is DESTRUCTIVE and cannot execute without explicit approval. The connector cannot expand OAuth scopes.

## Authentication and scopes

Use an OAuth-issued bot token where possible; a user token may be supplied when the workflow legitimately requires user-context access. Set `SLACK_BOT_TOKEN` or `SLACK_USER_TOKEN`. Grant only scopes needed by enabled tools. Read tools can require `channels:read`, `groups:read`, `im:read`, `mpim:read`, corresponding `*:history`, `users:read`, and `reactions:read`; message writes require `chat:write`; reaction writes require `reactions:write`. Exact availability also depends on conversation membership, token type and workspace policy. Never put tokens into prompts.

## Install and run

Requires Node.js 20+. From this directory run `npm install`, `npm run build`, then `npm start`. Configure the MCP client to launch `node <absolute-path>/dist/server.js` over stdio. Copy `.env.example` values into your secret manager/runtime environment; the application does not parse `.env` files itself.

## Permission model

READ tools execute without connector approval. WRITE tools (`message.send`, `message.update`, `reaction.add`) require `SLACK_APPROVAL_SECRET` plus the matching per-call `approval`. `message.delete` is DESTRUCTIVE and uses the same explicit gate. Deployments should inject approval only after a human or trusted policy layer authorizes the exact operation. Do not expose the approval secret to the LLM.

## Reliability, errors and rate limits

Requests have a configurable timeout (`SLACK_TIMEOUT_MS`, default 15s) and bounded retry count (`SLACK_MAX_RETRIES`, default 2). HTTP 429 honors `Retry-After`; network failures use bounded exponential backoff. Slack API `ok:false` responses are mapped to typed connector errors. Authentication and missing-scope errors are never retried. Pagination cursors are accepted and returned unchanged. Destructive calls are not blindly retried after a provider response.

## Testing

Run `npm test`. Tests use mocked fetch and require no live Slack credentials. Coverage includes validation, read pagination, approved/denied writes, authentication failure, missing credentials, and rate-limit mapping.

## Limitations

This package intentionally does not implement OAuth browser redirects/token persistence, webhook ingestion, admin APIs, public-content publishing beyond normal Slack messages, or raw API passthrough. OAuth installation is expected to happen in the hosting application's credential layer. Official Slack MCP availability and administrative controls depend on Slack plan/workspace policy and client integration. The fallback only accesses resources visible to the configured Slack identity.
