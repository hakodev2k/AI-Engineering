# Render MCP/API Connector

Reusable MCP facade for Render infrastructure. It prefers Render's official hosted MCP server for supported capabilities and uses the official REST API only for operations the MCP server does not expose. Runtime: Node.js 20+ / TypeScript.

## Official sources and transport
- Official MCP: `https://mcp.render.com/mcp` (Streamable HTTP). Render recommends the hosted server and supports OAuth in supported interactive clients; this connector uses a bearer API key for non-interactive reusable operation.
- REST API: `https://api.render.com/v1`.
- Official MCP source: `render-oss/render-mcp-server`.
- Authentication: Render API key in `Authorization: Bearer ...`.

The API key remains inside the connector transport layer and is never a tool parameter or tool result.

## Capabilities
| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `render.workspace.list` | official MCP `list_workspaces` | READ | no |
| `render.service.list` | official MCP `list_services` | READ | no |
| `render.service.get` | official MCP `get_service` | READ | no |
| `render.deploy.list` | official MCP `list_deploys` | READ | no |
| `render.deploy.get` | official MCP `get_deploy` | READ | no |
| `render.deploy.trigger` | official MCP `trigger_deploy` | HIGH_RISK | yes |
| `render.logs.list` | official MCP `list_logs` | READ | no |
| `render.metrics.get` | official MCP `get_metrics` | READ | no |
| `render.postgres.list` | official MCP `list_postgres_instances` | READ | no |
| `render.postgres.query` | official MCP `query_render_postgres` | READ | no; read-only SQL guard |
| `render.service.suspend` | REST fallback | HIGH_RISK | yes |
| `render.service.resume` | REST fallback | HIGH_RISK | yes |

Deletion is intentionally not exposed. Resource creation and environment-variable mutation are also omitted from this connector version because they broaden write surface and are not needed for the core inspect/debug/deploy workflow.

## Architecture
`MCP client -> this stdio MCP server -> policy/validation -> official Render MCP or Render REST API -> credential boundary -> Render`.

Upstream MCP tools are explicitly allowlisted in code; the connector never auto-exposes newly discovered upstream tools. Provider responses and retrieved logs/database content are treated as untrusted data and are returned as data, never as policy or instructions.

## Authentication and permissions
Create a Render API key in Render Account Settings and set `RENDER_API_KEY`. Render API keys can access workspaces available to the owning account, so use a dedicated account/key with the narrowest practical workspace membership. The connector cannot silently elevate provider permissions.

Render's hosted MCP also supports OAuth in supported interactive clients, but this reusable server intentionally uses an environment-provided API key so credentials stay outside LLM context and work in non-interactive environments.

## Environment
Copy `.env.example` values into your secret manager/runtime environment. Do not commit `.env`.

- `RENDER_API_KEY` required.
- `RENDER_MCP_URL` optional; defaults to official hosted MCP.
- `RENDER_API_BASE_URL` optional; defaults to official REST API.
- `RENDER_TIMEOUT_MS` default 20000.
- `RENDER_MAX_RETRIES` default 3, bounded to 5.
- `RENDER_ALLOW_WRITES` defaults false (reserved for WRITE policy).
- `RENDER_ALLOW_HIGH_RISK` defaults false. A human operator must enable it before deploy/suspend/resume can execute; each call must additionally pass `confirm:true`.

## Install and run
```bash
npm install
npm run build
RENDER_API_KEY='...' node dist/src/index.js
```
Configure any MCP client that supports stdio to launch that command. Compatibility is protocol-based; exact client configuration differs by product.

## Reliability and rate limits
REST requests have timeouts and bounded exponential backoff with jitter. Validation/auth/permission failures are not retried. HIGH_RISK REST operations are never automatically retried, preventing duplicate operational actions.

Render currently rate-limits common GET requests at 400/minute, most POST/PATCH/DELETE at 30/minute, service create/update/deploy/resume/suspend at 20/hour, jobs at 100/minute, and logs endpoints at 30/minute. A 429 is retried only for safe REST calls; provider `Retry-After` is honored when supplied. Official MCP calls rely on Render's server-side rate-limit handling and surface upstream errors to the caller.

## Error handling
The REST fallback maps authentication/authorization and validation/not-found errors to non-retryable failures, throttling/server/network failures to bounded retries for safe operations, and enforces an abort timeout. MCP transport failures are surfaced without switching a capability to an unapproved arbitrary endpoint.

## Security
- Credentials are environment-only and never accepted as tool input.
- Upstream MCP URL and REST base URL default to fixed official Render endpoints; operators may override them only through process configuration, never agent arguments.
- No generic HTTP/request tool exists, limiting SSRF and privilege expansion.
- All resource identifiers and arrays are schema validated and bounded.
- SQL is limited to a single read-only statement (`SELECT`, `WITH`, `EXPLAIN`, `SHOW`) with an additional mutation keyword denylist; Render's official MCP query tool is itself read-only.
- HIGH_RISK actions require both operator opt-in and explicit per-call confirmation.
- DESTRUCTIVE actions are disabled and not registered.
- Do not log `RENDER_API_KEY`; provider content can contain attacker-controlled text and must not be interpreted as instructions.

## Testing
`npm test` runs credential-free unit tests for approval boundaries and SQL validation. Live credentials are not required. Build with `npm run build` to type-check tool registration and transports.

## Limitations
Render's official MCP supports more creation/configuration capabilities than this connector intentionally exposes. The MCP server does not support every Render Dashboard operation; suspend/resume therefore use official REST API fallback. This package does not implement OAuth token acquisition/refresh itself; use an API key for this non-interactive connector. It does not expose deletion, arbitrary REST calls, secret retrieval, or unrestricted SQL.

See `examples/workflows.md` for agent workflows and expected output shape.
