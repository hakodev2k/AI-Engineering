# OpsLevel MCP/API Connector

Reusable MCP server exposing a deliberately scoped set of OpsLevel service-catalog workflows. It uses OpsLevel's official GraphQL API for deterministic API-token authentication and both read and approved write operations.

## Upstream strategy

OpsLevel publishes an official remote MCP server at `https://app.opslevel.com/mcp`. OpsLevel documents it as read-only and authenticated through the user's OpsLevel account/browser OAuth flow. This connector does not proxy that remote server: its capabilities are covered by the official GraphQL API, while write workflows require GraphQL. Avoiding a second interactive credential path also keeps credentials isolated from the agent and makes headless deployments predictable.

Primary transport: official GraphQL API `https://api.opslevel.com/graphql`.

Official sources researched for this implementation:
- OpsLevel MCP server documentation: `https://docs.opslevel.com/docs/mcp-server`
- OpsLevel GraphQL API overview/authentication: `https://docs.opslevel.com/docs/graphql-api`
- OpsLevel GraphQL schema/explorer: `https://app.opslevel.com/graphiql`
- OpsLevel rate limiting: `https://docs.opslevel.com/docs/rate-limiting`
- OpsLevel webhooks: `https://docs.opslevel.com/docs/webhooks`

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `opslevel.account.get` | GraphQL | READ | none |
| `opslevel.service.list` | GraphQL | READ | none |
| `opslevel.service.get` | GraphQL | READ | none |
| `opslevel.team.list` | GraphQL | READ | none |
| `opslevel.system.list` | GraphQL | READ | none |
| `opslevel.domain.list` | GraphQL | READ | none |
| `opslevel.integration.list` | GraphQL | READ | none |
| `opslevel.service.create` | GraphQL | WRITE | required |
| `opslevel.service.update` | GraphQL | WRITE | required |
| `opslevel.service.tags.assign` | GraphQL | WRITE | required |

No delete, secret-management, arbitrary GraphQL, arbitrary URL, webhook mutation, or account-administration tool is exposed.

## Architecture

`src/config.ts` validates environment configuration and the fixed HTTPS GraphQL endpoint. `src/client.ts` owns the API token, timeouts, bounded retries, throttling/error mapping, and GraphQL transport. `src/policy.ts` is the centralized risk/approval policy. `src/tools.ts` contains strict MCP schemas and scoped operations. `src/server.ts` exposes the connector over stdio.

The LLM receives tool inputs/results only; `OPSLEVEL_API_TOKEN` remains inside the connector process and is injected solely into the upstream `Authorization: Bearer` header.

## Authentication and permissions

Create an OpsLevel API token with only the access needed for the catalog objects this connector must read or modify. Set it as `OPSLEVEL_API_TOKEN`. OpsLevel's API uses bearer-token authentication. Token authorization is constrained by the permissions of the token/user in OpsLevel; the connector never attempts to elevate them.

For read-only deployments, leave `OPSLEVEL_WRITE_APPROVED=false`. Write tools require **both** a per-call `approved: true` supplied only after human approval and the process-level `OPSLEVEL_WRITE_APPROVED=true` gate. This prevents an agent from silently enabling writes through ordinary tool arguments.

## Environment

Copy `.env.example` and provide values through your secret manager or process environment. Never commit the populated file.

- `OPSLEVEL_API_TOKEN` — required secret.
- `OPSLEVEL_GRAPHQL_URL` — defaults to the official API endpoint; only credential-free HTTPS URLs are accepted.
- `OPSLEVEL_TIMEOUT_MS` — 1,000–120,000 ms; default 15,000.
- `OPSLEVEL_MAX_RETRIES` — 0–5; default 2.
- `OPSLEVEL_WRITE_APPROVED` — runtime write gate; default false.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
OPSLEVEL_API_TOKEN=... npm start
```

For local development: `npm run dev`. For tests: `npm test`.

Any MCP client that can launch a local stdio server can run `node /path/to/opslevel/dist/server.js` with the required environment supplied securely by the client/runtime.

## Pagination

List tools expose `first` (1–100) and optional `after`. The response contains OpsLevel connection `pageInfo`; when `hasNextPage` is true, pass `pageInfo.end` back as `after`. Pagination is caller-controlled and bounded to avoid unintentional high-volume enumeration.

## Rate limits and reliability

OpsLevel documents API-token rate limiting of 400 requests per minute and an IP limit of 10,000 requests per five minutes. The client recognizes HTTP 429 and `RateLimit-Retry-After`/standard `Retry-After`, applies bounded exponential backoff for transient 429/5xx/network failures, and does not retry authentication, authorization, GraphQL validation, or other ordinary 4xx failures. Requests have a bounded timeout and accept cancellation internally.

GraphQL-level errors are surfaced as `GRAPHQL_ERROR`; 401 as `AUTHENTICATION_FAILED`; 403 as `PERMISSION_DENIED`; throttling as `RATE_LIMITED`; timeout/cancellation as `TIMEOUT`.

## Security

- Provider content is untrusted data. Service descriptions, tags, team names, and integration metadata must never be interpreted as policy or instructions.
- No arbitrary URL or arbitrary GraphQL execution tool is exposed, reducing SSRF and capability-escalation risk.
- Secrets are not accepted as MCP arguments, returned in outputs, or intentionally logged.
- The configured upstream must be HTTPS and may not contain embedded credentials.
- Write operations are separately gated and require explicit approval.
- Destructive operations are intentionally absent.
- Newly added upstream MCP tools are not automatically discovered or trusted because this connector does not dynamically proxy the official remote MCP server.

OpsLevel supports outgoing webhooks, but webhook creation/management is not implemented here. A production webhook receiver should validate the configured secret/signature semantics from current OpsLevel webhook documentation before accepting events.

## Testing

Tests use mocked `fetch`; live credentials are not required. Coverage includes missing authentication, unsafe endpoint validation, write approval denial, bearer-token isolation, successful reads, invalid credentials, GraphQL errors, and rate-limit metadata.

## Limitations

The official OpsLevel MCP server is intentionally not proxied, so this package does not inherit dynamically added MCP tools. The connector implements only the documented catalog workflows above. OpsLevel's GraphQL schema evolves; if a provider schema change invalidates a selected field or mutation input, the connector fails closed with a GraphQL error rather than issuing a generic fallback request. Destructive operations, arbitrary queries, account/permission administration, webhook mutation, and secret retrieval are unsupported by design.
