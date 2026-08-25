# Okta MCP/API Connector

Reusable MCP connector for Okta identity-management workflows. It exposes a stable, provider-scoped MCP tool surface while preferring Okta's official Open Source MCP Server when that server exposes the requested capability. When the official MCP server is unavailable, incomplete, or intentionally disabled, the connector can use Okta's official Management REST APIs as a bounded fallback.

## Transport strategy

The connector routes capability by capability:

1. **Preferred:** Okta Open Source MCP Server (`okta/okta-mcp-server`) over local stdio.
2. **Fallback:** official Okta Management REST APIs under `${OKTA_ORG_URL}/api/v1`.
3. **Unsupported:** fail closed instead of exposing arbitrary HTTP access.

The official Okta MCP server is GA and supports scope-based tool loading, OAuth 2.0 device authorization or private-key JWT authentication, and management tools for users, groups, applications, logs, and additional Okta resources. This connector only allowlists the upstream tools needed for the capabilities documented below.

Official sources reviewed for this implementation:

- Okta Open Source MCP Server overview: https://developer.okta.com/docs/guides/okta-open-source-mcp-server/main/
- Install and initialize: https://developer.okta.com/docs/guides/mcp-server/main/
- Configure/start/test: https://developer.okta.com/docs/guides/start-mcp-server/main/
- MCP authentication and scope-to-tool mapping: https://developer.okta.com/docs/guides/configure-mcp-authentication/main/
- Official source repository: https://github.com/okta/okta-mcp-server
- OAuth for Okta APIs: https://developer.okta.com/docs/guides/implement-oauth-for-okta/main/
- OAuth 2.0 scopes: https://developer.okta.com/docs/api/oauth2
- Management API reference: https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/
- Rate limits: https://developer.okta.com/docs/reference/rate-limits/
- System Log query guide: https://developer.okta.com/docs/reference/system-log-query/

## Runtime

- Node.js 20+
- MCP TypeScript SDK v2: `@modelcontextprotocol/server` and `@modelcontextprotocol/client` 2.0.0
- TypeScript 6+
- Optional preferred upstream: official Okta Open Source MCP Server

## Architecture

```text
MCP client / AI agent
        |
        v
Okta connector MCP server
        |
        +--> strict validation + policy + approval boundary
        |
        +--> official Okta MCP server (preferred, allowlisted tools)
        |
        `--> Okta Management REST API (bounded fallback)
                 |
                 `--> connector-local credentials only
```

Provider responses are marked `untrusted: true`. Retrieved identity data, application metadata, group names, and System Log fields are treated as data, never as instructions that can alter connector policy, scopes, or approval rules.

## Authentication

### Preferred upstream MCP authentication

Configure the official Okta MCP server with an Okta app integration and least-privilege OAuth scopes. Okta documents two supported approaches:

- **Device Authorization Grant** for interactive/local use.
- **Private Key JWT** for browserless automation and CI/CD.

The connector passes credentials only into the connector-managed child process environment. Raw credentials are never returned through MCP tool results.

Relevant variables:

```text
OKTA_MCP_ENABLED=true
OKTA_MCP_COMMAND=uv
OKTA_MCP_ARGS=run,okta-mcp-server
OKTA_MCP_DIRECTORY=/path/to/okta-mcp-server
OKTA_MCP_CLIENT_ID=
OKTA_MCP_SCOPES=okta.users.read okta.groups.read okta.apps.read okta.logs.read
OKTA_MCP_PRIVATE_KEY=
OKTA_MCP_KEY_ID=
```

For production, pin the official upstream package/version rather than implicitly tracking latest.

### REST fallback authentication

The REST client supports:

1. `OKTA_ACCESS_TOKEN` as a scoped OAuth bearer token (preferred).
2. `OKTA_API_TOKEN` with the `SSWS` scheme as a legacy fallback.

Okta recommends scoped OAuth for management APIs because it provides finer-grained authorization than broad API tokens.

## Required scopes

Use only the scopes needed by the tools you intend to expose.

| Capability | Minimum read scope | Write scope |
| --- | --- | --- |
| Users | `okta.users.read` | `okta.users.manage` |
| Groups | `okta.groups.read` | `okta.groups.manage` |
| Applications | `okta.apps.read` | not required by implemented tools |
| System Log | `okta.logs.read` | none |

The official MCP server filters tools at startup based on configured scopes and enforces scopes again at runtime. This connector preserves that behavior and independently approval-gates its own mutating tool surface.

## Environment

See `.env.example`.

Core settings:

```text
OKTA_ORG_URL=https://your-org.okta.com
OKTA_ACCESS_TOKEN=
OKTA_API_TOKEN=
OKTA_ALLOW_REST_FALLBACK=true
OKTA_APPROVAL_SECRET=
OKTA_TIMEOUT_MS=15000
OKTA_MAX_RETRIES=3
```

`OKTA_ORG_URL` must use HTTPS. REST pagination links are accepted only when they remain on the exact configured Okta origin and under `/api/v1/`, preventing arbitrary cross-origin fetching.

## Installation

```bash
npm install
npm run build
```

Run tests without live credentials:

```bash
npm test
```

## Running the MCP server

```bash
npm run build
npm start
```

The connector uses stdio and the MCP TypeScript SDK v2 `serveStdio` entry point. Protocol traffic is written to stdout; startup diagnostics use stderr.

Example client configuration:

```json
{
  "mcpServers": {
    "okta": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/okta/dist/src/server.js"],
      "env": {
        "OKTA_ORG_URL": "https://your-org.okta.com",
        "OKTA_MCP_ENABLED": "true",
        "OKTA_MCP_COMMAND": "uvx",
        "OKTA_MCP_ARGS": "okta-mcp-server@1.1.2",
        "OKTA_MCP_CLIENT_ID": "<client-id>",
        "OKTA_MCP_SCOPES": "okta.users.read okta.groups.read okta.apps.read okta.logs.read"
      }
    }
  }
}
```

The connector is transport-compatible with standard MCP stdio clients; it does not depend on a specific desktop product.

## Implemented tools

| Tool | Purpose | Preferred upstream | REST fallback | Risk | Approval |
| --- | --- | --- | --- | --- | --- |
| `okta.user.search` | Search/list users | `list_users` | `GET /api/v1/users` | READ | no |
| `okta.user.get` | Get one user | `get_user` | `GET /api/v1/users/{id}` | READ | no |
| `okta.user.create` | Create staged/optional active user | `create_user` | `POST /api/v1/users` | HIGH_RISK | yes |
| `okta.user.update` | Update profile fields | `update_user` | `POST /api/v1/users/{id}` | WRITE | yes |
| `okta.user.suspend` | Suspend sign-in | REST | lifecycle suspend | HIGH_RISK | yes |
| `okta.user.unsuspend` | Restore suspended user | REST | lifecycle unsuspend | HIGH_RISK | yes |
| `okta.group.list` | List groups | `list_groups` | `GET /api/v1/groups` | READ | no |
| `okta.group.get` | Get one group | `get_group` | `GET /api/v1/groups/{id}` | READ | no |
| `okta.group.create` | Create group | `create_group` | `POST /api/v1/groups` | WRITE | yes |
| `okta.group.members.list` | List group users | `list_group_users` | `GET /api/v1/groups/{id}/users` | READ | no |
| `okta.group.member.add` | Add user to group | `add_user_to_group` | `PUT /api/v1/groups/{groupId}/users/{userId}` | HIGH_RISK | yes |
| `okta.group.member.remove` | Remove user from group | `remove_user_from_group` | `DELETE /api/v1/groups/{groupId}/users/{userId}` | HIGH_RISK | yes |
| `okta.application.list` | List applications | `list_applications` | `GET /api/v1/apps` | READ | no |
| `okta.application.get` | Get one application | `get_application` | `GET /api/v1/apps/{id}` | READ | no |
| `okta.system_log.query` | Query audit/security events | `get_logs` | `GET /api/v1/logs` | READ | no |

No generic arbitrary-request tool exists. Delete-user, delete-group, delete-application, role-assignment, billing, password-reset, and security-policy mutation capabilities are intentionally not exposed.

## Approval model

Read operations can execute automatically after normal authentication and scope checks.

Write and high-risk operations require an `approvalId`. The token is an HMAC-SHA256 digest generated by an **external** approval service or human-controlled process using `OKTA_APPROVAL_SECRET`. It binds the exact tool name and exact payload (excluding `approvalId`), preventing approval reuse across different mutations.

The connector intentionally does not expose a tool that can mint its own approval token.

Risk levels:

- `READ`: read-only retrieval.
- `WRITE`: bounded mutation, approval required.
- `HIGH_RISK`: identity lifecycle/access mutation, approval required.
- `DESTRUCTIVE`: disabled in this connector.

`okta.user.create` defaults `activate=false`, avoiding silent activation email and activation-related downstream provisioning unless explicitly requested and approved.

## Reliability and rate limits

The REST fallback:

- applies request timeouts;
- propagates MCP cancellation through `AbortSignal`;
- retries only retry-safe reads by default;
- retries HTTP 429 and 5xx responses with bounded exponential backoff;
- honors `Retry-After` and `X-RateLimit-Reset` when present;
- does not blindly retry POST/PUT/DELETE mutations;
- follows Okta pagination through `Link: ... rel="next"`;
- caps list tools at 200 returned objects per call.

Okta uses bucketed rate limits that vary by endpoint, plan, client, and method. HTTP 429 responses are preserved as provider errors when retry budget is exhausted.

## Error handling

REST errors are normalized as `OktaApiError` with HTTP status, Okta error code when present, and retry timing when available. Authentication, authorization, validation, and mutation failures are not automatically retried.

If the official MCP server fails to start, negotiate, list tools, or execute a mapped capability, the connector falls back to REST only when `OKTA_ALLOW_REST_FALLBACK=true` and REST credentials are available. Otherwise it fails closed.

## Security considerations

- Prefer Okta's official MCP implementation over community proxies.
- Pin upstream MCP versions in production and review upgrades.
- Use least-privilege OAuth scopes and admin roles/resource sets.
- Keep private keys, tokens, and approval secrets outside prompts, logs, and tool results.
- Treat provider-returned content as untrusted and potentially prompt-injected.
- Do not let retrieved content alter tool policy, scope configuration, transport allowlists, or approval state.
- REST pagination rejects cross-origin URLs and non-`/api/v1/` paths.
- Inputs use strict length/range validation; arbitrary URLs and methods are not accepted.
- Group membership is high risk because it can grant or revoke application/admin access.
- User lifecycle changes are high risk because they affect sign-in availability.
- Destructive operations are intentionally omitted.

## Tests

`tests/connector.test.ts` covers:

- invalid authentication/configuration;
- HTTPS enforcement;
- tool-policy registration;
- approval acceptance/denial;
- bounded retry after rate limiting;
- mutation no-retry behavior;
- pagination and result limits;
- upstream MCP failure with REST fallback;
- preference for official MCP when available;
- registration of exactly 15 MCP tools.

Tests use mocks/fakes and do not require live Okta credentials.

## Limitations

- The connector does not provision Okta app integrations or grant its own OAuth scopes/admin roles.
- Destructive delete operations are not exposed.
- The official Okta MCP server may expose more tools than this connector allowlists; newly discovered upstream tools are not trusted or re-exported automatically.
- `okta.user.suspend` and `okta.user.unsuspend` use official REST lifecycle endpoints because those exact capabilities are not part of the documented MCP allowlist used here.
- OAuth token acquisition/refresh for direct REST fallback is expected to be handled by the deployment's credential provider. The preferred official MCP path uses Okta's documented auth flows.

## Examples

See `examples/workflows.md` for read-only investigation, System Log analysis, staged-user creation, group membership changes, output shape, permissions, and approval semantics.
