# Tailscale MCP/API Connector

Reusable MCP server for safe Tailscale tailnet administration through the official Tailscale REST API.

## Transport strategy

Tailscale documents MCP server proxying and connector aggregation through Aperture, but it does not expose the tailnet administration operations implemented here as a first-party Tailscale-management MCP tool surface. This connector therefore uses the official Tailscale API v2 for the required capabilities and exposes a stable local MCP interface over stdio.

Official sources reviewed:

- Tailscale API: https://tailscale.com/docs/reference/tailscale-api
- OAuth clients: https://tailscale.com/docs/features/oauth-clients
- Trust credential scopes: https://tailscale.com/docs/reference/trust-credentials
- Device approval: https://tailscale.com/docs/features/access-control/device-management/device-approval
- Device removal: https://tailscale.com/kb/1260/device-remove
- Aperture MCP proxying: https://tailscale.com/docs/aperture/mcp-server
- Aperture connector model: https://tailscale.com/docs/aperture/connectors/reference

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `tailscale.device.list` | REST | READ | No |
| `tailscale.device.get` | REST | READ | No |
| `tailscale.device.authorize` | REST | HIGH_RISK | Yes |
| `tailscale.device.remove` | REST | DESTRUCTIVE | Yes |
| `tailscale.routes.get` | REST | READ | No |
| `tailscale.routes.update` | REST | HIGH_RISK | Yes |
| `tailscale.dns.nameservers.get` | REST | READ | No |
| `tailscale.dns.preferences.get` | REST | READ | No |
| `tailscale.dns.searchpaths.get` | REST | READ | No |
| `tailscale.logs.configuration.list` | REST | READ | No |

The connector intentionally does not expose an arbitrary HTTP request tool.

## Authentication

Preferred authentication is OAuth 2.0 client credentials. Tailscale OAuth access tokens expire after roughly one hour; the connector caches a token and renews it before expiry. A short-lived API access token is also supported using HTTP Basic authentication, matching Tailscale API examples.

Configure one credential mode:

```text
TAILSCALE_TAILNET=example.com
TAILSCALE_OAUTH_CLIENT_ID=...
TAILSCALE_OAUTH_CLIENT_SECRET=...
```

or:

```text
TAILSCALE_TAILNET=example.com
TAILSCALE_API_KEY=tskey-api-...
```

Raw credentials stay inside the connector and are never returned in MCP output.

### Least-privilege OAuth scopes

For read-only inventory, request only the read scopes you need, such as `devices:core:read`, `devices:routes:read`, `dns:read`, and `logs:configuration:read`.

Write operations require the corresponding write scopes, notably `devices:core` for device lifecycle/authorization and `devices:routes` for route changes. Do not grant write scopes unless those tools are actually enabled for the deployment.

Scope names and endpoint access should be revalidated against Tailscale's current Trust credentials documentation when deploying because Tailscale has migrated older legacy scope names to finer-grained names.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod input validation
  -> permission / approval gate
  -> credential-isolated Tailscale client
  -> HTTPS api.tailscale.com/api/v2
```

Provider responses are returned with `untrustedProviderContent: true`; callers must treat device names, tags, log fields, and other provider content as data rather than instructions.

## Human approval

READ tools execute without approval. HIGH_RISK and DESTRUCTIVE tools require `TAILSCALE_APPROVAL_SECRET` and an input-bound `approvalId`.

The approval token is an HMAC-SHA256 digest of:

```text
<tool-name>\n<canonical-json-input-without-approvalId>
```

This binds approval to both the exact action and parameters. The approval secret belongs in a trusted approval service or operator environment, not in an LLM prompt. Changing a device ID, authorization boolean, or route list invalidates the approval token.

`tailscale.device.remove` is never retried automatically.

## Reliability

- Per-request timeout via `TAILSCALE_TIMEOUT_MS` (default 15 seconds).
- OAuth token refresh before expiry.
- Provider HTTP errors mapped to bounded connector errors.
- HTTP 429 honors `Retry-After` for idempotent GET/HEAD only, with one bounded retry and a maximum 10-second delay.
- Authentication, validation, permission failures, write operations, and destructive operations are not blindly retried.
- Device listing supports Tailscale's optional `fields` projection to avoid unnecessarily large responses.

Tailscale does not document a single universal fixed request quota for all API operations in the reviewed public docs. The connector therefore treats HTTP 429 and `Retry-After` as authoritative throttling signals.

## Security

- HTTPS API base URL is enforced.
- No arbitrary upstream URL/tool is exposed, reducing SSRF surface.
- Device IDs use a restricted character set.
- Route arrays are bounded.
- OAuth/API secrets are read from environment variables only.
- Dangerous operations require human approval.
- Provider text is explicitly marked untrusted.
- The connector does not allow retrieved provider content to alter permissions or tool registration.
- Use narrowly scoped OAuth clients and remove unused OAuth/API credentials regularly.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

Copy `.env.example` into your preferred secret/configuration mechanism and set the required values.

## Run

```bash
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers, including agent hosts that implement the Model Context Protocol. Compatibility depends on the host's MCP stdio support; no host-specific authentication behavior is assumed.

Example client configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/tailscale/dist/src/server.js"],
  "env": {
    "TAILSCALE_TAILNET": "example.com",
    "TAILSCALE_OAUTH_CLIENT_ID": "from-secret-store",
    "TAILSCALE_OAUTH_CLIENT_SECRET": "from-secret-store"
  }
}
```

## Testing

Normal tests require no live Tailscale credentials. HTTP calls are mocked.

```bash
npm test
```

Tests cover configuration validation, safe defaults, risk classification, approval denial/acceptance, API-token authentication behavior, provider error mapping, and the no-retry rule for destructive operations.

## Limitations

- No upstream Tailscale-management MCP server is assumed; management capabilities use REST.
- This connector deliberately omits policy-file writes, auth-key creation, billing, user-role changes, and API-only tailnet lifecycle because they expand privilege or destructive scope beyond the selected workflows.
- DNS mutation is not implemented; the current DNS tools are read-only.
- Configuration audit log filtering parameters are passed through only for the documented `start` and `end` timestamp shape used by this connector; deployments should verify account/plan availability.
- Tailscale Aperture connectors are a separate gateway feature and are not required to run this package.
