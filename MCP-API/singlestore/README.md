# SingleStore MCP/API Connector

Reusable MCP server for safe SingleStore Helios control-plane workflows. It exposes narrowly scoped tools instead of arbitrary HTTP access.

## Official transports and sources

SingleStore has an official open-source MCP server (`singlestore-mcp-server`) documented at https://docs.singlestore.com/cloud/ai/singlestore-mcp-server/. It runs locally over stdio, supports browser OAuth for normal local setup, and API-key authentication for Docker. Its documented tools cover workspace/workspace-group discovery, organization and region metadata, SQL execution, starter workspaces, notebooks/files, and scheduled jobs. SingleStore also provides the official HTTPS Management API at https://api.singlestore.com, documented at https://docs.singlestore.com/cloud/reference/management-api/.

This connector intentionally uses the official Management REST API for deterministic workspace lifecycle/status operations. These control-plane operations are supported by the Management API, while the documented MCP tool catalog is primarily discovery, SQL, notebooks/files, and jobs. It does not proxy arbitrary upstream MCP tools and therefore cannot gain newly added permissions silently.

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `singlestore.region.list` | REST | READ | no |
| `singlestore.workspace_group.list` | REST | READ | no |
| `singlestore.workspace_group.get` | REST | READ | no |
| `singlestore.workspace.list` | REST | READ | no |
| `singlestore.workspace.get` | REST | READ | no |
| `singlestore.workspace.outbound_allowlist.get` | REST | READ | no |
| `singlestore.workspace.resume` | REST | WRITE | configurable |
| `singlestore.workspace.suspend` | REST | HIGH_RISK | explicit |
| `singlestore.workspace.delete` | REST | DESTRUCTIVE | explicit + disabled by default |

SingleStore's current docs also use the newer terms cluster group/cluster in some surfaces. The Management API documentation retains workspace group/workspace endpoints and operations; this connector keeps the stable external names above.

## Architecture

MCP client -> local stdio server -> strict Zod validation -> permission/approval policy -> credential-isolated REST client -> SingleStore Management API. Provider responses are returned with `untrusted_provider_content: true`; retrieved text/data is never interpreted as connector configuration or authorization.

## Authentication and least privilege

Create an organization API key in the SingleStore Cloud Portal and provide it only through `SINGLESTORE_API_KEY`. Management API keys use `Authorization: Bearer ...` over HTTPS. SingleStore documents that the API key's user permissions determine allowed operations and recommends IP allowlisting. Use a dedicated identity/key with only the permissions required by the enabled tools and an expiration appropriate to your environment.

The key never appears in tool schemas, tool results, or errors. The LLM must not receive it.

## Environment

Copy `.env.example` into your secret/configuration system. `SINGLESTORE_API_BASE_URL` defaults to `https://api.singlestore.com` and non-HTTPS values are rejected. `SINGLESTORE_APPROVE_WRITES`, `SINGLESTORE_APPROVE_HIGH_RISK`, and `SINGLESTORE_ALLOW_DESTRUCTIVE` are deny-by-default policy gates.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
SINGLESTORE_API_KEY=... npm start
```

The server uses MCP stdio and can be configured in clients that support local stdio MCP servers by pointing them to `node` with `dist/server.js`. Compatibility depends on the client's MCP stdio support; no client-specific protocol extensions are used.

## Permission and approval model

READ tools execute without approval. WRITE can require approval through policy. HIGH_RISK always requires both the corresponding policy gate and `approved: true`. DESTRUCTIVE operations are disabled unless `SINGLESTORE_ALLOW_DESTRUCTIVE=true` and still require `approved: true`. Retrieved provider content cannot alter these gates.

Suspend is HIGH_RISK because it affects service availability. Delete is DESTRUCTIVE and is never retried automatically. Resume is WRITE. The connector does not expose create/update operations that would require broad configuration schemas without an explicit use case.

## Reliability

GET/HEAD requests use at most three attempts with bounded exponential backoff for transient network failures, HTTP 429, and 5xx responses. `Retry-After` is preserved when present. Authentication, permission, validation, write, high-risk, and destructive calls are not blindly retried. Requests have a configurable timeout. Provider errors are normalized without credentials. List response pagination metadata is preserved so callers can continue according to the provider response without the connector generating unbounded calls.

SingleStore does not publish one universal Management API request quota in the overview documentation; limits can vary by endpoint/service. The client therefore reacts to HTTP 429 and `Retry-After` rather than inventing a numeric quota.

## Security

- HTTPS-only API base URL.
- No arbitrary URL or raw-request tool, reducing SSRF and permission-bypass risk.
- UUID validation and strict object schemas reject unknown fields.
- Credentials stay in the transport layer and are never returned.
- Provider content is explicitly marked untrusted and cannot change policy.
- No automatic discovery/enablement of upstream MCP tools.
- Destructive calls are disabled by default and never automatically retried.
- Keep API keys out of logs and prompts; use a secret manager in production.
- Prefer SingleStore IP allowlisting for Management API keys where practical.

## Official MCP notes

The official SingleStore MCP server can be installed with `uvx singlestore-mcp-server start`. Current SingleStore documentation lists Claude Desktop/Code, Cursor, VS Code, Windsurf, Gemini CLI, LM Studio, Goose and Qodo Gen among supported clients. Browser-based OAuth is available for local setup; Docker uses `MCP_API_KEY`. This connector does not reimplement that OAuth flow because its selected control-plane capability set is handled directly by the official REST API with a least-privilege API key.

## Testing

```bash
npm test
npm run build
```

Tests use mocked `fetch`; no live credentials are required. Coverage includes auth configuration, HTTPS enforcement, registration, validation, read routing, approval denial, destructive denial, provider error mapping, rate-limit retry, and pagination metadata.

## Limitations

This connector does not expose SQL execution, secret values, notebooks, files, billing, invitations, users/roles, or arbitrary Management API calls. It does not create/delete workspace groups. SingleStore states that cluster APIs may require support access in some account configurations; provider 403/404 responses are surfaced rather than bypassed. OAuth refresh is not applicable to the API-key transport used here. Webhooks are not implemented because the selected lifecycle capability set does not require an inbound event receiver.
