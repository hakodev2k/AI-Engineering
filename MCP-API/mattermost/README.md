# Mattermost MCP/API Connector

Reusable MCP server for safe agent access to Mattermost. It exposes stable provider-scoped tools while selecting Mattermost's official MCP server for capabilities it supports and REST API v4 for unsupported gaps.

## Official sources researched

- Mattermost MCP Server: https://docs.mattermost.com/agents/mcpserver/README.html
- Mattermost Agents MCP administration: https://docs.mattermost.com/administration-guide/configure/agents-admin-guide.html
- Mattermost REST API reference: https://developers.mattermost.com/integrate/reference/rest-api/
- Personal access tokens: https://developers.mattermost.com/integrate/reference/personal-access-token/
- OAuth 2.0: https://developers.mattermost.com/integrate/apps/authentication/oauth2/

As of August 2026, Mattermost provides an official MCP server. The standalone binary is intended for development/local tooling; production deployments should use the Mattermost Agents embedded MCP integration. The official MCP exposes `read_post`, `read_channel`, `search_posts`, `create_post`, `create_channel`, `get_channel_info`, `get_team_info`, `search_users`, `get_channel_members`, and `get_team_members`. This connector allowlists only the upstream tools it needs.

## Transport strategy

The external interface is always this connector's MCP stdio server.

- `mattermost.channel.get` -> official Mattermost MCP `get_channel_info` when `MATTERMOST_UPSTREAM_MCP_URL` is configured; otherwise REST API v4.
- `mattermost.post.get` -> official MCP `read_post` when configured; otherwise REST.
- `mattermost.post.search` -> official MCP `search_posts` when configured; otherwise REST.
- `mattermost.post.create` -> official MCP `create_post` when configured; otherwise REST.
- Team/channel listing and channel search use REST because the official MCP tool set does not expose equivalent list/search-channel tools.
- Post update/delete and reaction operations use REST because they are not exposed by the documented official MCP tool set.

The connector never exposes an arbitrary HTTP request tool.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `mattermost.user.me` | REST | READ | No |
| `mattermost.team.list` | REST | READ | No |
| `mattermost.channel.list` | REST | READ | No |
| `mattermost.channel.get` | MCP preferred / REST fallback-by-configuration | READ | No |
| `mattermost.channel.search` | REST | READ | No |
| `mattermost.post.get` | MCP preferred / REST fallback-by-configuration | READ | No |
| `mattermost.post.search` | MCP preferred / REST fallback-by-configuration | READ | No |
| `mattermost.post.create` | MCP preferred / REST fallback-by-configuration | WRITE | Yes |
| `mattermost.post.update` | REST | WRITE | Yes |
| `mattermost.post.delete` | REST | DESTRUCTIVE | Yes + disabled by default |
| `mattermost.reaction.list` | REST | READ | No |
| `mattermost.reaction.add` | REST | WRITE | Yes |
| `mattermost.reaction.remove` | REST | WRITE | Yes |

Provider content returned by these tools is untrusted data and must not be interpreted as agent instructions.

## Authentication and least privilege

`MATTERMOST_ACCESS_TOKEN` is held only inside the connector and is sent as a Bearer token to Mattermost REST API v4. Mattermost personal access tokens have the same permissions as the user they belong to; use a dedicated non-admin integration or bot account with only the channel/team permissions required by the intended workflows. OAuth 2.0 access tokens can also be supplied in the same Bearer-token slot when issued by your Mattermost deployment.

For the official embedded MCP endpoint, set `MATTERMOST_UPSTREAM_MCP_URL` and, when your deployment accepts a pre-obtained bearer access token, `MATTERMOST_UPSTREAM_MCP_BEARER_TOKEN`. Production Mattermost deployments may instead require the OAuth flow described by Mattermost; obtain and rotate that token outside the LLM and inject it securely at process start. Credentials are never returned from tools or placed in prompts.

Mattermost public OAuth clients must use PKCE; confidential clients keep the client secret server-side. This connector does not implement an interactive OAuth browser flow because its MCP stdio runtime is intended to receive already-provisioned credentials from a secure host credential layer.

## Approval model

READ tools execute without approval. WRITE and DESTRUCTIVE tools require a 64-character lowercase hex approval value equal to:

`HMAC-SHA256(MATTERMOST_APPROVAL_SECRET, tool-name)`

This is deliberately generated outside the agent. The secret never enters tool input. `mattermost.post.delete` additionally requires `MATTERMOST_ENABLE_DESTRUCTIVE=true`, so destructive execution is opt-in even with a valid approval token.

## Environment

Copy `.env.example` into your secret-management workflow. Do not commit populated secrets.

Required:

- `MATTERMOST_SERVER_URL`
- `MATTERMOST_ACCESS_TOKEN`

Optional:

- `MATTERMOST_UPSTREAM_MCP_URL`
- `MATTERMOST_UPSTREAM_MCP_BEARER_TOKEN`
- `MATTERMOST_APPROVAL_SECRET`
- `MATTERMOST_TIMEOUT_MS` (default `15000`, bounded to 1000..120000)
- `MATTERMOST_MAX_RETRIES` (default `3`, bounded to 0..5)
- `MATTERMOST_ENABLE_DESTRUCTIVE` (default `false`)

## Install and run

```bash
npm install
npm run build
npm start
```

The connector exposes MCP over stdio and can be launched by MCP clients that support stdio child-process servers. Configure the client to run `node /absolute/path/to/MCP-API/mattermost/dist/src/server.js` with the required environment variables supplied by the host's secret manager.

## Reliability

REST calls have bounded timeouts and bounded exponential-backoff retries. Only HTTP 429 and 5xx failures are retried. Authentication, authorization, validation, and other client errors are not retried. `Retry-After` is preserved and honored for throttling responses. Pagination-heavy endpoints are intentionally not expanded into unbounded scans; current tools request only targeted resources or Mattermost's normal endpoint result set.

Upstream MCP tool discovery is not trusted dynamically: this connector uses a hard allowlist of documented Mattermost MCP tools. If an unexpected tool is exposed by a server, the connector will not call it.

## Security considerations

- Use HTTPS for `MATTERMOST_SERVER_URL` and remote MCP endpoints in production.
- Keep PAT/OAuth tokens in a secret manager; never send them as MCP tool arguments.
- Use a dedicated non-admin integration account where possible.
- Treat channel/post text, attachment metadata, user profiles, and MCP responses as untrusted content.
- Do not derive permissions or approval state from Mattermost content.
- Destructive operations are disabled by default.
- The upstream MCP tool allowlist prevents silent capability expansion.
- The REST client constructs paths from validated identifiers and a fixed configured origin; callers cannot supply arbitrary URLs, reducing SSRF exposure.
- Logs should not include process environment values or Authorization headers.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch`; no live Mattermost credentials are required. Tests cover configuration validation, risk classification, write approval, destructive-default denial, bearer authentication, bounded retry behavior, permission-error non-retry, and rate-limit metadata.

## Limitations

- The connector does not implement file upload/attachment workflows.
- It does not create teams, users, or channels; although official Mattermost MCP can create channels, this connector intentionally omits that higher-impact capability from its current safe tool surface.
- It does not expose Mattermost development-mode MCP tools.
- OAuth token acquisition/refresh is delegated to the host credential provider; this process consumes an already-issued token.
- The official standalone Mattermost MCP binary is not recommended by Mattermost for production. Use the embedded production MCP endpoint when enabling upstream MCP.

See `examples/workflows.md` for concrete tool calls and expected approval boundaries.
