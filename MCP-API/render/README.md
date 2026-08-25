# Render MCP/API Connector

Reusable MCP connector for Render infrastructure. It exposes a stable provider-scoped tool surface while preferring Render's official hosted MCP server for capabilities that it supports and using the official REST API where MCP is unavailable, incomplete, or as a configured fallback.

## Official upstreams researched

- Render MCP docs: https://render.com/docs/mcp-server
- Official MCP source: https://github.com/render-oss/render-mcp-server
- Render API docs: https://render.com/docs/api
- API reference: https://api-docs.render.com/reference/introduction
- Authentication: https://api-docs.render.com/reference/authentication
- Rate limits: https://api-docs.render.com/reference/rate-limiting
- Pagination: https://api-docs.render.com/reference/pagination

The official hosted MCP endpoint is `https://mcp.render.com/mcp` and uses streamable HTTP. Render supports OAuth for compatible interactive MCP clients and API-key bearer authentication for non-interactive setups. This connector intentionally uses an API key from its credential layer so credentials never need to be placed in an agent prompt.

## Transport strategy

| Connector tool | Preferred upstream | Fallback | Risk |
|---|---|---|---|
| `render.workspace.list` | MCP `list_workspaces` | REST `GET /owners` | READ |
| `render.service.list` | MCP `list_services` | REST `GET /services` | READ |
| `render.service.get` | MCP `get_service` | REST `GET /services/{id}` | READ |
| `render.deploy.list` | MCP `list_deploys` | REST `GET /services/{id}/deploys` | READ |
| `render.deploy.get` | MCP `get_deploy` | REST `GET /services/{id}/deploys/{deployId}` | READ |
| `render.logs.list` | MCP `list_logs` | none | READ |
| `render.metrics.get` | MCP `get_metrics` | none | READ |
| `render.project.list` | REST | n/a | READ |
| `render.deploy.trigger` | MCP `trigger_deploy` | REST `POST /services/{id}/deploys` | HIGH_RISK |
| `render.service.restart` | REST | n/a | HIGH_RISK |
| `render.service.suspend` | REST | n/a | HIGH_RISK |
| `render.service.resume` | REST | n/a | HIGH_RISK |
| `render.connector.policy` | local | n/a | READ |

The REST path is used directly for service operational controls because it is explicit, documented, and allows the connector to enforce approval before any external call. A deploy targeting a specific `commitId` also uses REST because the official MCP `trigger_deploy` contract does not expose that option.

## Architecture

```text
MCP client
  -> stdio MCP server (this package)
     -> validation + permission/approval policy
        -> credential-isolated Render client
           -> official Render MCP (preferred)
           -> official Render REST API (fallback / MCP gap)
```

Provider responses are marked `untrustedProviderContent: true`. Retrieved logs, service metadata, and other provider content must be treated as data rather than instructions.

## Authentication

Create a Render API key in Render Account Settings and set:

```bash
export RENDER_API_KEY='...'
```

Do not commit the key or pass it through model context. Render API keys can access the workspaces available to the account, so account-side access control remains important.

This connector does not implement a browser OAuth callback or token store. Interactive clients that want Render OAuth can connect directly to Render's hosted MCP server instead.

## Environment variables

- `RENDER_API_KEY` — required bearer credential.
- `RENDER_API_BASE_URL` — default `https://api.render.com/v1`.
- `RENDER_MCP_URL` — default `https://mcp.render.com/mcp`.
- `RENDER_REQUEST_TIMEOUT_MS` — default `20000`.
- `RENDER_MAX_RETRIES` — default `3`, capped at `5`.
- `RENDER_ENABLE_API_FALLBACK` — default `true`.
- `RENDER_REQUIRE_WRITE_APPROVAL` — default `true`.
- `RENDER_APPROVAL_SECRET` — required when approval-gated tools are enabled.

Only HTTPS upstream URLs are accepted.

## Install and run

```bash
npm install
npm run build
npm start
```

The server uses MCP over stdio, so it can be launched by MCP hosts that support stdio child-process servers. Configure the environment at the host/process boundary rather than embedding secrets in MCP tool arguments.

Example client configuration shape:

```json
{
  "mcpServers": {
    "render-safe": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/render/dist/src/server.js"],
      "env": {
        "RENDER_API_KEY": "${RENDER_API_KEY}",
        "RENDER_APPROVAL_SECRET": "${RENDER_APPROVAL_SECRET}"
      }
    }
  }
}
```

Actual environment-variable interpolation is host-specific.

## Tool behavior and validation

Identifiers are restricted to conservative alphanumeric, underscore, and hyphen forms. Pagination limits are bounded. Datetimes must be ISO-8601. Commit IDs must be hexadecimal Git-style SHAs. The connector does not expose a generic arbitrary HTTP-request tool.

`render.logs.list` limits resource/filter array sizes and result limits to reduce accidental high-volume queries. `render.metrics.get` bounds the number of metric types requested in one call.

## Permission and approval model

READ tools can execute automatically.

Deploy, restart, suspend, and resume are classified HIGH_RISK because they can change production runtime state. By default they require an explicit approval token. The token is generated outside model context as:

```text
HMAC-SHA256(RENDER_APPROVAL_SECRET, "<tool-name>:<service-id>")
```

The resulting hex digest is provided as `approvalId`. Because the secret remains in the connector environment, an agent cannot mint its own approvals.

Setting `RENDER_REQUIRE_WRITE_APPROVAL=false` disables this connector-side gate and should only be done when an equivalent trusted approval layer exists outside this package.

No delete operations, billing changes, permission changes, secret reads, environment-variable reads, or arbitrary API execution are exposed.

## Reliability

REST requests have a bounded timeout. Safe GET requests retry only on `429` and `5xx` responses, with bounded retries and backoff/jitter. Authentication, permission, validation, and other non-retryable failures fail immediately. POST operational actions are never blindly retried, preventing duplicate deploy/restart/suspend/resume effects.

When Render returns rate-limit metadata, the connector preserves `retry-after` on `RenderError` and honors `Retry-After`/`Ratelimit-Reset` for safe read retries where available.

Render currently documents rate limits including 400/minute for most GETs, 30/minute for most POST/PATCH/DELETE calls, 30/minute for log APIs, and stricter limits for deploy/service lifecycle operations. Render can change or reduce limits, so callers must also handle throttling.

List endpoints use Render cursor pagination. This connector exposes bounded `limit` and optional `cursor` on REST-backed list paths. Some MCP tools abstract pagination upstream; the connector preserves the official MCP behavior in that path.

## Errors

The connector maps REST failures into `RenderError` with HTTP status and retry-after metadata where available. Timeouts are surfaced explicitly. MCP failures are allowed to fall back only on tools with a documented REST equivalent and only when `RENDER_ENABLE_API_FALLBACK=true`.

If MCP-only logs or metrics calls fail, the error is returned rather than silently inventing an unsupported result.

## Security considerations

- Credentials remain in the connector process and are never exposed as tool inputs or outputs.
- Upstream URLs are fixed/configured and HTTPS-only, reducing SSRF exposure.
- No arbitrary URL or raw provider-request tool exists.
- Retrieved provider content is untrusted and is marked accordingly.
- High-risk operational actions require external approval by default.
- Writes are not automatically retried.
- The connector does not read or echo service environment variables, connection strings, or other secret-oriented endpoints.
- Render's hosted MCP server can expose powerful account capabilities; this connector allowlists only the specific upstream MCP tools used by its handlers and never auto-registers newly discovered tools.

## Testing

```bash
npm test
```

Unit tests use mocks and do not require live Render credentials. They cover configuration validation, HTTPS enforcement, retry bounds, credential placement, approval denial/acceptance, non-retry of writes, safe-read retry, and authentication-error handling.

## Limitations

- No browser OAuth flow is implemented in this wrapper; API-key bearer authentication is required.
- Logs and metrics currently depend on the official Render MCP server and have no REST fallback in this package.
- The connector intentionally omits resource creation, deletion, environment-variable mutation/readback, billing, and access-control operations.
- Hosted MCP tool contracts can evolve. The stable external connector tool names remain provider-scoped, but upstream argument compatibility should be revalidated when upgrading the Render MCP server behavior.
- A successful call only indicates the upstream accepted/completed the immediate request; deploys and lifecycle actions can continue asynchronously on Render, so callers should inspect deploy/service state afterward using READ tools.
