# Convex MCP/API Connector

Reusable MCP server for Convex management-plane workflows. It exposes project/deployment discovery and deliberately gated deletion operations through Convex's official Management API.

## Transport selection
Convex ships an official local MCP server (`npx -y convex@latest mcp start`) with `status`, `tables`, `data`, `runOneoffQuery`, `functionSpec`, `run`, `logs`, `insights`, `envList`, `envGet`, `envSet`, and `envRemove`. Its default security blocks production PII reads, environment access, and writes unless explicit flags are enabled. This connector does **not** duplicate those capabilities. The 11 tools here are management-plane operations not exposed by the official MCP tool set, so they use the official Management REST API.

Official sources checked 2026-08-30:
- MCP: https://docs.convex.dev/ai/convex-mcp-server
- MCP CLI: https://docs.convex.dev/cli/reference/mcp
- Management API: https://docs.convex.dev/management-api/overview
- Management OpenAPI: https://api.convex.dev/v1/openapi.json
- OAuth apps: https://docs.convex.dev/platform-apis/oauth-applications
- Deploy keys / least privilege: https://docs.convex.dev/cli/deploy-key-types
- Projects: https://docs.convex.dev/management-api/list-projects
- Deployments: https://docs.convex.dev/management-api/list-deployments

## Authentication
Set `CONVEX_MANAGEMENT_TOKEN`. The Management API uses `Authorization: Bearer <token>` and supports Team Access Tokens, Personal Access Tokens, and OAuth Application Tokens. Use the narrowest team/project permissions possible. Raw credentials are never MCP parameters and are never returned to the model.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `convex.project.list` | REST | READ | no |
| `convex.project.get` | REST | READ | no |
| `convex.deployment.list` | REST | READ | no |
| `convex.deployment.get` | REST | READ | no |
| `convex.deployment.team_list` | REST | READ | no |
| `convex.deployment.region_list` | REST | READ | no |
| `convex.deployment.class_list` | REST | READ | no |
| `convex.team.member_list` | REST | READ | no |
| `convex.deployment.custom_domain_list` | REST | READ | no |
| `convex.project.delete` | REST | DESTRUCTIVE | yes + disabled by default |
| `convex.deployment.delete` | REST | DESTRUCTIVE | yes + disabled by default |

Project deletion also deletes its deployments. Deployment deletion deletes all data and files in that deployment; Convex recommends backing up first. No create-deploy-key/token-management tools are exposed because returning newly minted credentials through an agent boundary would violate credential isolation.

## Environment
- `CONVEX_MANAGEMENT_TOKEN` — required.
- `CONVEX_MANAGEMENT_API_URL` — default `https://api.convex.dev/v1`.
- `CONVEX_TIMEOUT_MS` — default `15000`.
- `CONVEX_MAX_RETRIES` — `0`–`5`, default `3`.
- `CONVEX_APPROVAL_SECRET` — required for destructive execution.
- `CONVEX_ENABLE_DESTRUCTIVE` — default `false`.

## Install / run
Requires Node.js 20+.
```bash
npm install
npm run check
npm test
npm start
```
The downstream transport is MCP stdio, usable by MCP clients that support spawning a local stdio server.

## Architecture
```text
MCP client
  -> Convex connector (stdio MCP)
     -> strict provider-scoped tool schema
        -> risk / approval policy
           -> credential-isolated Management API client
              -> https://api.convex.dev/v1
```

## Approval and safety
READ operations execute without approval. DESTRUCTIVE tools require both `CONVEX_ENABLE_DESTRUCTIVE=true` and a payload-bound HMAC-SHA256 `approval_token`; modifying the target invalidates the approval. The connector exposes no arbitrary HTTP tool, token-creation tool, role/permission changes, billing actions, data mutation, function execution, or environment-secret reads. Provider responses are labeled `untrusted_provider_data` and must be treated as data, not instructions.

## Reliability / rate limits
GET requests have bounded exponential retry for 429/502/503/504 and respect integer `Retry-After`. Authentication and validation errors are not retried. Destructive POST requests are never blindly retried. All requests have timeouts and accept MCP cancellation signals. Cursor/limit inputs are bounded where applicable. Convex's public Management API documentation does not publish one universal numeric quota, so this connector reacts to provider throttling rather than inventing a rate.

## Error handling
Provider HTTP errors are normalized into MCP tool errors with status, provider code when present, retry-after metadata, and a conservative `retryable` flag. Authentication/permission failures remain non-retryable. Network failures on safe GET requests are retried only within the configured bound.

## Testing
Unit tests require no live credentials. They cover auth configuration, tool/policy parity, destructive denial, payload-bound approval, credential isolation, URL encoding, non-retry of auth errors, bounded 429 retry, and no blind destructive retry.

## Usage examples
See `examples/workflows.md` for read-only discovery and explicitly approved deletion examples.

## Limitations
This package complements rather than proxies Convex's official MCP. For data inspection, function execution, logs, insights, and environment variables, use the official Convex MCP server and its built-in production safety flags. `convex.deployment.get` requires exactly one selector (`deploymentId`, `deploymentRef`, or `deploymentType`) and validates this in the handler. The connector does not mint deploy keys or access tokens, because secrets must remain outside the agent-visible result channel.
