# Shortcut MCP/API Connector

Reusable MCP server for Shortcut project-management workflows. It exposes a stable, provider-scoped MCP tool surface backed by Shortcut's official REST API v3 and documents the official hosted Shortcut MCP server for direct OAuth-capable clients.

## Upstream transports

Shortcut provides an official hosted MCP server at `https://mcp.shortcut.com/mcp`. It uses OAuth and supports retrieving, creating, and updating Stories, Epics, Iterations, and Docs, with read-only access to Objectives, Teams, Members, and Workflows. Shortcut documents OAuth scopes including `read`, `write`, `story-write`, `comment-write`, and `admin`.

This connector uses Shortcut REST API v3 for its implemented stable contracts. The REST transport is appropriate for reusable server-side deployments because Shortcut API tokens can be isolated in the connector process and the API has deterministic endpoint contracts. Direct MCP clients that can complete interactive OAuth should prefer Shortcut's official hosted MCP server when its built-in entity support is sufficient.

Official sources:

- Shortcut MCP Server: https://www.shortcut.com/help/integrations/mcp-server/
- Shortcut REST API v3: https://developer.shortcut.com/api/rest/v3
- Shortcut REST API v4: https://developer.shortcut.com/api/rest/v4

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `shortcut.story.search` | REST v3 | READ | No |
| `shortcut.story.get` | REST v3 | READ | No |
| `shortcut.story.create` | REST v3 | WRITE | Configurable, required by default |
| `shortcut.story.update` | REST v3 | WRITE | Configurable, required by default |
| `shortcut.story.comment.create` | REST v3 | WRITE | Configurable, required by default |
| `shortcut.epic.list` | REST v3 | READ | No |
| `shortcut.epic.get` | REST v3 | READ | No |
| `shortcut.epic.create` | REST v3 | WRITE | Configurable, required by default |
| `shortcut.iteration.list` | REST v3 | READ | No |
| `shortcut.objective.list` | REST v3 | READ | No |
| `shortcut.team.list` | REST v3 (`groups`) | READ | No |
| `shortcut.workflow.list` | REST v3 | READ | No |

No delete, archive, admin, billing, permission-management, or other destructive operation is exposed.

## Architecture

```text
MCP client
   -> local Shortcut connector (stdio MCP)
      -> schema validation
      -> permission / approval policy
      -> credential-isolated Shortcut client
      -> HTTPS Shortcut REST API v3
```

Provider content is returned as untrusted data. It is never interpreted as connector configuration or as permission instructions.

## Authentication

Create a Shortcut API token from your Shortcut account API-token settings and expose it only to the connector process as `SHORTCUT_API_TOKEN`.

The connector sends it in the `Shortcut-Token` request header. The deprecated query-string token mechanism is not used.

Shortcut API tokens provide broad account access, so protect them as secrets. They are never accepted as MCP tool parameters and therefore are not passed through the LLM/tool-call payload.

## Environment variables

Copy `.env.example` and configure:

```text
SHORTCUT_API_TOKEN=
SHORTCUT_API_BASE_URL=https://api.app.shortcut.com/api/v3
SHORTCUT_PERMISSIONS=read
SHORTCUT_REQUIRE_WRITE_APPROVAL=true
SHORTCUT_TIMEOUT_MS=15000
SHORTCUT_MAX_RETRIES=2
```

`SHORTCUT_API_BASE_URL` is restricted to HTTPS on `api.app.shortcut.com` to reduce SSRF risk. `SHORTCUT_MAX_RETRIES` is bounded to 0-5.

## Permission model

`SHORTCUT_PERMISSIONS=read` is the default. Use `read,write` or `write` to enable mutation tools. Enabling WRITE does not bypass approval. With `SHORTCUT_REQUIRE_WRITE_APPROVAL=true`, each write call must include `approved: true`, representing approval obtained by the calling application or human-in-the-loop layer.

The connector does not expose a tool that can alter connector permissions.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
```

Run with:

```bash
SHORTCUT_API_TOKEN=... npm start
```

The server communicates over stdio using the Model Context Protocol SDK.

## Reliability and rate limits

Shortcut documents a REST API limit of 200 requests per minute. The client recognizes HTTP 429, preserves `Retry-After`, and performs bounded retries with exponential backoff. Transient 5xx/network failures are also retried up to `SHORTCUT_MAX_RETRIES`.

Authentication, authorization, validation, and ordinary 4xx failures are not blindly retried. Each request has an AbortController-based timeout.

Search uses Shortcut's server-side pagination parameters and permits page sizes from 1 to 250. The connector performs a single page per MCP invocation to avoid uncontrolled fan-out; callers may continue using the returned pagination token.

## Error handling

- 401: invalid/expired token
- 403: workspace/member permission denied
- 404: resource not found
- 400/422: validation failure
- 429: rate limit, including retry hint when supplied
- timeout/network/5xx: bounded retry, then failure

## Security considerations

Credentials remain inside the connector process. Tool schemas are strict and reject unknown fields. The API origin is pinned to Shortcut to reduce SSRF exposure. No arbitrary HTTP/request passthrough tool exists. Read-only is the default permission set. Write actions require explicit approval by default. No destructive/admin tools are exposed. Retrieved Shortcut descriptions/comments are treated as untrusted third-party content and cannot change tool policy. Secrets are not logged.

## Testing

Tests do not require live credentials. They use fake fetch implementations and cover configuration validation, SSRF protection, tool registration, strict input validation, permission denial, approval enforcement, auth failure behavior, authentication-header injection, query handling, and bounded 429 retry behavior.

```bash
npm test
```

## Limitations

This package does not implement an OAuth broker for Shortcut's hosted MCP server. It therefore does not proxy the hosted MCP server's interactive OAuth session. For direct use of Shortcut's official MCP, configure the remote endpoint in an OAuth-capable MCP client.

The connector intentionally implements a focused subset of REST v3 rather than every Shortcut endpoint. Docs, Members, admin operations, deletes, archived-resource management, and webhook management are not exposed. API tokens are broad credentials rather than least-scope OAuth grants; deployments needing per-user least privilege should prefer the official Shortcut MCP OAuth flow.
