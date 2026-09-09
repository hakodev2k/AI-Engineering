# Nango MCP/API Connector

Reusable MCP connector for Nango environments. It uses Nango's official hosted **Management MCP** for the reviewed management capabilities exposed here and keeps the environment API key inside the connector process.

## Official sources

- Management MCP overview and current architecture: https://nango.dev/blog/how-to-build-ai-agent-integrations-using-the-nango-management-mcp
- Nango Backend SDK: https://nango.dev/docs/reference/backend/backend-sdk/node
- Connect Sessions API: https://nango.dev/docs/reference/backend/http-api/connect/sessions/create
- HTTP API rate limits: https://nango.dev/docs/reference/backend/http-api/rate-limits
- Platform limits: https://nango.dev/docs/guides/platform/limits
- Auth guide: https://nango.dev/docs/guides/auth/auth-guide
- Nango integrations catalog: https://nango.dev/api-integrations

As of September 2026, Nango documents the hosted Management MCP endpoint at `https://mcp.nango.dev/mcp` using Streamable HTTP and Bearer authentication. Nango separately exposes its runtime tool-calling MCP at `https://api.nango.dev/mcp`; this connector intentionally does not mix the runtime MCP credential boundary with management operations.

## Architecture

`MCP client -> this stdio connector -> validation/policy -> official Nango Management MCP -> Nango environment`

The upstream environment key never appears in tool parameters or returned data. The connector has a fixed allowlist of reviewed upstream tools and fails if a required upstream tool disappears. Provider content is wrapped as `untrusted_data: true`.

## Authentication and least privilege

Set `NANGO_SECRET_KEY` to an environment API key scoped only to the tools you intend to use. The implemented tools require these documented scopes:

- `environment:integrations:list`
- `environment:integrations:read`
- `environment:connections:list`
- `environment:connect_sessions:write`
- `environment:functions:list`
- `environment:logs:read`

Do **not** add credential-reading scopes such as `read_credentials`; the connector never needs provider access tokens. For runtime tool calling, use a separate key scoped to `environment:mcp`, as Nango recommends.

## Environment variables

- `NANGO_SECRET_KEY` — required.
- `NANGO_MANAGEMENT_MCP_URL` — optional; defaults to the official `https://mcp.nango.dev/mcp`. For SSRF and credential-isolation safety this build accepts only `mcp.nango.dev` over HTTPS.
- `NANGO_REQUIRE_WRITE_APPROVAL` — defaults to `true`.
- `NANGO_TIMEOUT_MS` — defaults to `20000`, range 1–120 seconds.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
NANGO_SECRET_KEY='...' npm start
```

The connector serves MCP over stdio. Configure any MCP client that supports local stdio servers to launch `node dist/src/server.js` with the environment variables above. Compatibility depends on the client supporting standard MCP stdio; no product-specific compatibility is claimed beyond that protocol behavior.

## Tools

| Tool | Upstream | Risk | Required scope | Approval |
|---|---|---|---|---|
| `nango.integration.list` | `integrations_list` | READ | `environment:integrations:list` | No |
| `nango.integration.get` | `integrations_get` | READ | `environment:integrations:read` | No |
| `nango.connection.list` | `connections_list` | READ | `environment:connections:list` | No |
| `nango.connect_session.create` | `connect_session_create` | WRITE | `environment:connect_sessions:write` | Yes by default |
| `nango.function.list` | `functions_list` | READ | `environment:functions:list` | No |
| `nango.log.operation.list` | `logs_list_operations` | READ | `environment:logs:read` | No |
| `nango.log.operation.get` | `logs_get_operation` | READ | `environment:logs:read` | No |

This intentionally small surface is designed around common workflows: discover configured integrations, resolve end-user connections, mint a narrowly restricted Connect link, inspect functions, and diagnose execution through logs. It does not expose the Management MCP's generic `proxy_request`, because an unrestricted provider request would violate the connector's scoped-tool safety contract.

## MCP versus API fallback

The official Management MCP supports every capability implemented above, so these tools route through MCP. Nango also provides the official REST API and `@nangohq/node` SDK for equivalent backend workflows. Those are documented fallback transports if a future MCP version removes a required capability, but this release does not silently downgrade to REST because doing so could change permission and response semantics without review.

## Approval model

READ tools execute without approval. `nango.connect_session.create` is WRITE because it creates a short-lived authorization session visible to an end user; with the default policy it requires `approved: true` after explicit human approval. No HIGH_RISK or DESTRUCTIVE operation is exposed. The connector never allows a tool call to expand its own key scopes.

## Rate limits and reliability

Nango documents plan-based API request limits (for example 200 requests/minute on Free, 1,000 on Starter and 2,000 on Growth in the current limits documentation) and standard `X-RateLimit-*` plus `Retry-After` headers for the HTTP API. For Management MCP, this connector applies a bounded request timeout and does not blindly retry writes. Nango itself provides managed retry/rate-limit behavior for its integration runtime; callers should still avoid high-frequency polling of management tools.

## Security considerations

- Environment credentials stay inside the upstream transport layer.
- Only the official HTTPS Management MCP host is accepted.
- Upstream tools are fixed in an allowlist; newly discovered tools are not trusted automatically.
- No raw proxy/API request tool is exposed.
- Connection listing deliberately uses the non-credential management surface.
- Inputs are strict and bounded; unknown fields are rejected.
- Connect-session creation requires human approval by default and supports an explicit allowlist of integration IDs.
- Provider responses, logs, connection metadata and integration content are untrusted data, never instructions.
- Avoid logging `NANGO_SECRET_KEY`, Connect session tokens, or connect links.

## Webhooks and events

Nango supports auth webhooks, sync/webhook functions and signed webhook delivery. This package is an MCP management connector rather than an HTTP webhook receiver, so webhook ingestion is intentionally not implemented. Applications consuming Nango webhooks should verify Nango's webhook signing key before accepting events.

## Error handling

Validation and approval errors fail locally before contacting Nango. Authentication/scope errors and upstream MCP failures are returned as MCP tool errors. Missing reviewed upstream tools fail closed. Timeouts terminate the connector-side wait rather than launching duplicate write attempts.

## Testing

`npm test` compiles and runs credential-free unit tests covering required authentication configuration, upstream-host restriction, approval enforcement, destructive-operation denial, upstream allowlisting, strict validation and connect-session bounds. Unit tests do not require a live Nango environment.

## Limitations

- The connector does not read provider credentials, execute generic proxy requests, deploy functions, modify integrations, or delete connections.
- It does not expose the separate Nango runtime tool-calling MCP server.
- Management MCP tool names and schemas can evolve; the allowlist intentionally fails closed so upgrades are reviewed rather than silently accepted.
- Nango's REST API/SDK is documented as a fallback but is not automatically invoked by this version because the required capabilities are currently available through the official Management MCP.
