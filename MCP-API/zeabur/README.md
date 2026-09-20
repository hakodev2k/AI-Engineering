# Zeabur MCP/API Connector

Reusable safety wrapper for Zeabur's official MCP server. It exposes eight stable, provider-scoped tools while keeping the Zeabur API token inside the connector process and gating state-changing operations.

## Upstream strategy

Zeabur provides an official local MCP server distributed as `@zeabur/mcp-server`; this connector prefers it for all implemented capabilities. Zeabur also documents a Bearer-authenticated GraphQL API at `https://api.zeabur.com/graphql`, REST endpoints for specific container/file operations, and `graphql-ws` subscriptions. Direct API fallback is intentionally not enabled here because the selected capabilities are documented as supported by the official MCP server; if a required official MCP tool is absent at runtime the connector fails closed rather than inventing or silently substituting behavior.

Official sources:
- https://zeabur.com/docs/en-US/mcp
- https://zeabur.com/docs/en-US/developer/public-api
- https://zeabur.com/docs/en-US/developer/api-keys
- https://zeabur.com/docs/en-US/developer

## Capabilities

| Tool | Risk | Approval |
|---|---|---|
| `zeabur.project.list` | READ | no |
| `zeabur.project.create` | WRITE | `ZEABUR_APPROVE_WRITE=true` |
| `zeabur.service.list` | READ | no |
| `zeabur.service.status` | READ | no |
| `zeabur.environment.configure` | WRITE | `ZEABUR_APPROVE_WRITE=true` |
| `zeabur.domain.bind` | WRITE | `ZEABUR_APPROVE_WRITE=true` |
| `zeabur.deployment.logs` | READ | no |
| `zeabur.application.deploy` | HIGH_RISK | `ZEABUR_APPROVE_HIGH_RISK=true` |

The adapter discovers the official MCP tool list at runtime and maps only allowlisted capability patterns. Unexpected/new upstream tools are never automatically exposed. A missing capability fails safely.

## Authentication and permissions

Create an API key in Zeabur Dashboard > Settings > API Keys. Current account access tokens are documented with the `zat_` prefix. Set it only as `ZEABUR_TOKEN`; never put it in prompts or tool arguments. Zeabur API keys act with the identity and team-role permissions of their owner, so use a dedicated account/role with least privilege and separate credentials per environment where practical.

No OAuth scopes are involved in this connector: Zeabur documents Bearer API-token authentication. Team resource access remains limited by the user's role in that team.

## Environment

Copy `.env.example` values into your secret manager or process environment. `ZEABUR_TIMEOUT_MS` is reserved for process-level supervision; MCP clients should also enforce a bounded call timeout. Approval flags default to false.

## Install and run

```sh
npm install
npm run build
ZEABUR_TOKEN=zat_xxx npm start
```

Configure an MCP client to launch `node /absolute/path/to/dist/src/server.js`. Any standards-compliant client supporting local stdio MCP can use the connector; client-specific approval UI behavior is not assumed.

## Architecture and security

`server.ts` exposes the local MCP interface; `upstream.ts` launches Zeabur's official MCP package with the token injected only into its child-process environment; `tools.ts` validates strict schemas, applies risk policy, discovers only allowlisted upstream capabilities, then forwards the call. `security.ts` owns credential and approval checks.

Retrieved logs, service metadata, domains, environment metadata, and upstream error text are untrusted data. They must not change permissions or approval flags. Arbitrary GraphQL/REST execution is not exposed. Domain input is constrained to hostname syntax. Credentials are never accepted as tool inputs or returned to the model.

Deployments can incur cost and alter production behavior, so deployment is HIGH_RISK. Environment-variable and domain changes are WRITE. The connector intentionally exposes no deletion, billing, permission, interactive terminal, arbitrary command execution, or raw API tool.

## Reliability and rate limits

The official MCP server owns provider transport, API error mapping, and provider-side throttling. This wrapper does not blindly retry mutating operations. MCP process failures and absent upstream tools fail closed. Zeabur does not publish a single fixed public rate-limit quota in the referenced public API documentation; callers should honor provider throttling/errors and avoid high-frequency polling. Prefer the documented WebSocket subscriptions for real-time log/activity systems rather than polling, when building a dedicated extension.

## Tests

`npm test` builds and runs credential, strict-input, registration, read forwarding, permission-denial, high-risk approval, and fail-closed upstream-discovery tests. Tests use a fake upstream and require no live token.

## Limitations

This connector intentionally wraps a focused subset of Zeabur's documented MCP capabilities. It does not expose destructive operations, arbitrary database/container commands, file upload, billing, permissions, or raw GraphQL. Because official MCP tool names can evolve, mapping uses constrained capability-name matching and fails closed if a compatible official tool cannot be identified. Production callers should pin dependency versions through their lockfile and review upstream release notes before upgrades.
