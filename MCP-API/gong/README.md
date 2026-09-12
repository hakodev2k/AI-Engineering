# Gong MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of Gong's official Public API for AI-agent workflows. It provides raw call/user/transcript/access resources; it does not turn Gong response text into instructions.

## Transport strategy

Gong has an official remote MCP server at `https://mcp.gong.io/mcp`. Gong documents three read-only MCP tools: `ask_account`, `ask_deal`, and `generate_brief`. Those tools return synthesized AI insights and explicitly do not return raw transcripts, message bodies, or activity lists. This connector therefore uses Gong's official REST API for the raw resources implemented here. It does not proxy or imitate the official insight tools, and callers that need those insights should attach Gong's official MCP server directly with Gong-managed OAuth credentials.

REST base URL defaults to `https://api.gong.io`. No arbitrary URL/request tool is exposed.

## Implemented tools

| Tool | Transport | Gong scope | Risk | Approval |
|---|---|---|---|---|
| `gong.user.list` | REST GET `/v2/users` | `api:users:read` | READ | none |
| `gong.call.list` | REST GET `/v2/calls` | Gong call-read authorization | READ | none |
| `gong.call.extensive.list` | REST POST `/v2/calls/extensive` | `api:calls:read:extensive` | READ | none |
| `gong.call.transcript.list` | REST POST `/v2/calls/transcript` | `api:calls:read:transcript` | READ | none |
| `gong.call.access.list` | REST POST `/v2/calls/users-access` | `api:call-user-access:read` | READ | none |
| `gong.permission_profile.list` | REST GET `/v2/all-permission-profiles` | permission API access | READ | none |
| `gong.permission_profile.users.list` | REST GET `/v2/permission-profile/users` | `api:users:read` | READ | none |
| `gong.call.access.grant` | REST PUT `/v2/calls/users-access` | `api:call-user-access:write` | HIGH_RISK | explicit |

The destructive DELETE call-access endpoint is intentionally not exposed.

## Authentication

The Public API supports either an API access key/secret through HTTP Basic authentication or an OAuth access token through Bearer authentication. Configure one mode with `GONG_ACCESS_KEY` and `GONG_ACCESS_KEY_SECRET`, or `GONG_OAUTH_ACCESS_TOKEN`. Credentials stay inside the connector. MCP clients never pass provider credentials as tool arguments and responses never include them. Use the narrowest Gong integration scopes matching the tools you enable.

## Environment variables

Copy `.env.example` into your secret-management workflow. `GONG_API_BASE_URL` defaults to `https://api.gong.io` and is validated to an HTTPS `gong.io` hostname to prevent SSRF. `GONG_TIMEOUT_MS` defaults to 15000 and `GONG_MAX_RETRIES` to 2. `GONG_HIGH_RISK_APPROVED` defaults to false.

## Installation and running

Requires Node.js 20 or later.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport, so any MCP client capable of launching a local stdio server can configure the built `dist/src/server.js` command.

## Pagination and validation

Gong cursor pagination is exposed one page at a time. Cursors are opaque and bounded; the connector never auto-drains an unbounded result set. Numeric Gong IDs are validated as 1-20 digit strings. Date-time inputs require ISO-8601 timestamps with `Z` or an explicit offset. Arrays are bounded to 100 identifiers/items.

`gong.call.extensive.list` supports the documented filter fields `fromDateTime`, `toDateTime`, `workspaceId`, `callIds`, and `primaryUserIds`. It intentionally does not request media URLs, avoiding the extra `api:calls:read:media-url` permission.

## Permission and approval model

READ tools may run without approval. `gong.call.access.grant` changes access permissions and is therefore HIGH_RISK. It fails unless a human-controlled execution environment sets `GONG_HIGH_RISK_APPROVED=true`. Agents cannot modify that gate through any MCP tool. Permission-removal operations are not registered.

## Reliability and rate limits

Gong documents default Public API limits of 3 calls per second and 10,000 calls per day. The client handles HTTP 429 and preserves `Retry-After`, uses bounded backoff for 429/502/503/504 and transient transport failures, and applies request timeouts. It does not retry validation, authentication, permission, or other ordinary 4xx errors. Permission-changing PUT requests are never automatically retried.

## Error handling and security

Provider HTTP failures are mapped without logging Authorization. Provider transcripts and other returned fields are untrusted data and may contain prompt-injection text. No raw HTTP tool exists. Configurable API hosts are restricted to HTTPS under `gong.io`. High-risk grants require an out-of-band approval gate. Destructive access revocation is disabled by omission.

## Official sources

Research checked against current Gong documentation for Public API authentication/rate limits, `/v2/users`, `/v2/calls`, `/v2/calls/extensive`, `/v2/calls/transcript`, call-access read/write endpoints, permission APIs, and Gong's official MCP server. Gong's MCP documentation states that the server is read-only, exposes `ask_account`, `ask_deal`, and `generate_brief`, and excludes raw transcript/activity retrieval.

## Testing

```bash
npm test
```

Unit tests need no live Gong credentials. They cover credential configuration, host validation, OAuth and Basic header construction, approval denial, rate-limit error mapping, secret redaction, and the no-retry rule for permission-changing PUT operations.

## Limitations

This connector does not implement Gong's full API, upload calls/CRM data, remove user access, request media URLs, or proxy Gong's synthesized MCP insight tools. Gong tenant permissions and integration scopes still determine what data an authenticated caller can retrieve. Individual-access lookup only reports access granted through Gong's public call-access API and is not a complete entitlement audit.
