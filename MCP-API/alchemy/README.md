# Alchemy MCP/API Connector

Reusable safety wrapper around Alchemy's official hosted MCP server. It intentionally exposes a small, stable, read-oriented surface instead of automatically trusting all upstream tools.

## Official transport and sources

Alchemy operates the official Streamable HTTP MCP endpoint at `https://mcp.alchemy.com/mcp`. Official documentation states that it uses OAuth 2.1 with PKCE, covers 100+ networks and exposes 168 tools across admin, JSON-RPC and data APIs. Source: https://www.alchemy.com/docs/alchemy-mcp-server

No unofficial MCP dependency is used. This connector routes its implemented capabilities through the official MCP transport; direct REST fallback is unnecessary for this selected subset because the official MCP exposes them.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `alchemy.chain.list` | `list_chains` | READ | No |
| `alchemy.app.list` | `list_apps` | READ | No |
| `alchemy.app.get` | `get_app` | READ | No |
| `alchemy.app.select` | `select_app` | READ/session selection | No |
| `alchemy.wallet.balance` | `eth_getBalance` | READ | No |
| `alchemy.transaction.get` | `eth_getTransactionByHash` | READ | No |
| `alchemy.token.metadata` | `alchemy_getTokenMetadata` | READ | No |
| `alchemy.transfer.list` | `alchemy_getAssetTransfers` | READ | No |

The official upstream has many additional capabilities, including writes/admin changes and simulation/tracing. They are deliberately not exposed here. Newly discovered upstream tools are never trusted automatically.

## Architecture

`MCP client -> local stdio connector -> allowlist/validation -> credential boundary -> official Alchemy MCP -> Alchemy APIs`

Provider responses are labeled `untrusted-provider-data`. Credentials are read only by the connector process and are never returned in tool output.

## Authentication

Alchemy's hosted MCP uses OAuth 2.1 with PKCE. For this reusable stdio wrapper, obtain an access token through an OAuth-capable MCP client or credential broker and inject it as `ALCHEMY_MCP_ACCESS_TOKEN`. The connector sends it only as the upstream Bearer credential. Do not put it in prompts, source files, logs or client tool arguments.

Environment:

- `ALCHEMY_MCP_ACCESS_TOKEN` — required OAuth access token.
- `ALCHEMY_MCP_URL` — optional; defaults to the official endpoint.
- `CONNECTOR_ALLOWED_TOOLS` — optional comma-separated upstream allowlist. Restrict rather than expand this in production.

Alchemy app selection may be required before RPC/data operations, as documented by Alchemy. OAuth scopes/authorization grants are controlled by Alchemy's authorization flow; this connector cannot elevate them.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
ALCHEMY_MCP_ACCESS_TOKEN='...' npm start
```

Configure the resulting process as a stdio MCP server in your MCP client. Compatibility is with clients that can launch standard stdio MCP servers; upstream remains Streamable HTTP.

## Permission and approval model

This release exposes only READ operations plus app session selection. No transaction broadcast, wallet mutation, allowlist mutation, app creation/update, deletion, billing, or other destructive/high-risk tool is registered. Therefore no execution approval flow is needed for the registered tools. Adding a write tool requires an explicit risk classification and approval gate before execution.

## Reliability and rate limits

Calls use a 20-second timeout. HTTP 429 and 5xx responses receive at most two bounded retries with exponential backoff. Authentication/authorization and validation failures are not retried. `Retry-After` is preserved in terminal throttling errors. Pagination parameters are passed only for tools that support them; callers should bound result sizes.

Alchemy pricing and throughput limits vary by plan/API. The connector therefore does not hard-code a quota value. Consult current official limits/pricing for the account.

## Security

- Fixed upstream URL by default; do not set `ALCHEMY_MCP_URL` from untrusted tool input.
- Explicit upstream tool allowlist prevents tool-discovery escalation.
- No arbitrary API-request tool.
- Strict address/hash schemas on relevant external tools.
- Provider output is bounded and marked untrusted to reduce prompt-injection/data-amplification risk.
- OAuth credentials remain in the connector environment/credential layer.
- No secret logging.
- Write/destructive upstream operations are absent from the public tool registry.

## Errors

The connector maps HTTP throttling, server failures, auth failures, unknown tools and upstream JSON-RPC errors into MCP tool failures. Expired/revoked OAuth credentials require reauthorization; the connector does not retry them blindly.

## Testing

```bash
npm test
```

Unit tests require no live credentials and verify allowlisting and response bounding. Live OAuth integration testing should be performed separately in a non-production Alchemy app.

## Limitations

This is intentionally not a mirror of all 168 official Alchemy tools. It provides a reusable safe subset for discovery and blockchain reads. It does not implement OAuth browser authorization itself; token acquisition/refresh belongs to the OAuth-capable MCP client or credential broker. It does not expose transaction submission, wallet actions, app mutation, allowlist changes, webhooks, billing, or destructive operations.
