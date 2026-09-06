# Appwrite MCP/API Connector

Reusable MCP server for Appwrite project operations. It exposes a stable, provider-scoped tool contract while preferring Appwrite's official remote MCP server and falling back to the official REST API for supported operations when MCP is unavailable.

## Current official transport strategy

Appwrite's official remote MCP server is hosted at `https://mcp.appwrite.io/`, uses HTTP transport and OAuth, and exposes a compact operator surface: `appwrite_get_context`, `appwrite_search_tools`, `appwrite_call_tool`, and documentation search when enabled. The hidden catalog includes Appwrite services such as users, storage, functions, tables/databases and more. Mutating hidden tools require Appwrite's own `confirm_write=true` flag. For self-hosted Appwrite, the official local MCP server remains available over stdio using an API key.

This connector allowlists only verified hidden upstream tools it needs. For those tools, it calls official MCP first when `APPWRITE_MCP_ACCESS_TOKEN` is supplied. READ operations may fall back to official REST if MCP is unavailable. WRITE/HIGH_RISK/DESTRUCTIVE calls never silently fail over after an upstream MCP call, avoiding duplicate side effects. Function execution uses the official REST endpoint directly because the required API capability is documented and the connector can apply deterministic execution approval without depending on dynamic hidden-tool discovery.

Official sources researched for this implementation:
- https://appwrite.io/docs/tooling/ai/mcp-servers
- https://github.com/appwrite/mcp
- https://appwrite.io/changelog/9
- https://appwrite.io/docs/apis/rest
- https://appwrite.io/docs/references/cloud/server-rest/users
- https://appwrite.io/docs/references/cloud/server-rest/storage
- https://appwrite.io/docs/references/cloud/server-rest/functions
- https://appwrite.io/docs/advanced/security/rate-limits

## Capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `appwrite.context.get` | official MCP | READ | no |
| `appwrite.docs.search` | official MCP | READ | no |
| `appwrite.user.list` | MCP → REST | READ | no |
| `appwrite.user.get` | MCP → REST | READ | no |
| `appwrite.user.create` | MCP or REST | WRITE | configurable, default yes |
| `appwrite.user.update_name` | MCP or REST | WRITE | configurable, default yes |
| `appwrite.user.delete` | MCP or REST | DESTRUCTIVE | strong approval + destructive enable |
| `appwrite.storage.bucket.list` | MCP → REST | READ | no |
| `appwrite.storage.bucket.get` | MCP → REST | READ | no |
| `appwrite.storage.bucket.create` | MCP or REST | WRITE | configurable, default yes |
| `appwrite.storage.bucket.delete` | MCP or REST | DESTRUCTIVE | strong approval + destructive enable |
| `appwrite.function.list` | MCP → REST | READ | no |
| `appwrite.function.get` | MCP → REST | READ | no |
| `appwrite.function.create` | MCP or REST | WRITE | configurable, default yes |
| `appwrite.function.execution.create` | REST | HIGH_RISK | always |
| `appwrite.function.delete` | MCP or REST | DESTRUCTIVE | strong approval + destructive enable |

No arbitrary API request or arbitrary upstream MCP tool is exposed.

## Authentication and least privilege

### Official MCP primary
Complete Appwrite's OAuth flow using a compatible MCP client and provide the resulting short-lived bearer access token through the connector's secret provider as `APPWRITE_MCP_ACCESS_TOKEN`. The token is used only inside the upstream transport and is never returned to the model.

### REST fallback
Set `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, and `APPWRITE_API_KEY`. Direct REST requests send `X-Appwrite-Project` and `X-Appwrite-Key`. Create a project API key with only the scopes needed by tools you enable. This connector's maximum documented set is `users.read`, `users.write`, `buckets.read`, `buckets.write`, `functions.read`, `functions.write`, and `executions.write`; omit write scopes for read-only deployments.

Server API-key requests bypass normal client SDK endpoint rate limits, but Appwrite can still apply service-abuse limits. Never use dev keys in production.

## Configuration

Copy `.env.example`. Cloud endpoints are region-specific (`https://<REGION>.cloud.appwrite.io/v1`). Self-hosted endpoints are configurable; production endpoints must use HTTPS. The official MCP host is pinned to `mcp.appwrite.io` to prevent credential forwarding to arbitrary servers.

## Permission and approval model

READ tools execute automatically. WRITE tools require approval by default. HIGH_RISK always requires an exact connector approval. DESTRUCTIVE tools are disabled unless `APPWRITE_ALLOW_DESTRUCTIVE=true` and also require exact approval.

Approval is connector-side and cannot be supplied by the model. Add exact fingerprints to the semicolon-separated `APPWRITE_APPROVED_ACTIONS`, for example:
- `appwrite.user.create:user-123`
- `appwrite.function.execution.create:sync-orders`
- `appwrite.storage.bucket.delete:archive`

The connector also passes `confirm_write=true` to Appwrite's official MCP for approved upstream mutations, preserving both approval layers.

## Reliability

Each REST call has an abort timeout. GET requests use bounded exponential-backoff retries for network failures, HTTP 429 and HTTP 5xx responses, honoring numeric `Retry-After`. Mutations are never blindly retried. Appwrite `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers are preserved in connector output metadata. List calls accept bounded Appwrite query arrays and encode them as repeated `queries[]` parameters instead of recursively draining collections.

For MCP, failures on READ operations can fall back to REST only when REST is configured. Mutating MCP failures do not automatically fall back because the upstream operation may have committed before the failure was observed.

## Security

- Raw API keys and OAuth tokens remain in transport/auth layers and are never tool parameters.
- Remote MCP host is pinned and public/hidden upstream tool names are allowlisted.
- Retrieved Appwrite project content is treated as untrusted data, never instructions.
- Strict schemas reject path traversal and malformed identifiers.
- Function execution is HIGH_RISK and routed through a documented official REST operation.
- User, bucket, and function deletion are DESTRUCTIVE and disabled by default.
- Function creation defaults `enabled=false` in the connector schema.
- The connector does not expose arbitrary REST requests, project-level billing/security changes, secret management, file upload bytes, or messaging/send tools.

## Install, run, test

```bash
npm install
npm run build
npm test
npm start
```

Requires Node.js 20+. The external connector itself uses MCP stdio, so it can be launched by clients that support local stdio MCP servers. Its preferred upstream is Appwrite's official remote HTTP MCP server.

Unit tests require no live credentials. They cover configuration, MCP host pinning, approval denial, destructive denial, rate-limit retry, no write retry, credential isolation in HTTP headers, strict ID validation, and bounded tool registration.

## Limitations

OAuth token acquisition/refresh is delegated to the host credential provider or MCP client rather than placing OAuth client secrets in agent context. `appwrite.context.get` and `appwrite.docs.search` require official MCP credentials and intentionally have no REST substitute. The connector exposes a curated subset of Appwrite rather than every endpoint. Binary storage upload/download, messaging, Sites deployments, database/table row mutation, secrets, and project administration are intentionally out of scope for this version.
