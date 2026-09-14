# Neon MCP/API Connector

Reusable MCP server for Neon Postgres management workflows. It exposes a deliberately narrow set of project, branch, database, role, compute-endpoint, and operation tools instead of an unrestricted API passthrough.

## Official sources and transport strategy

Neon ships an official hosted MCP server at `mcp.neon.tech` and an open Management API at `https://console.neon.tech/api/v2`. Neon announced on September 3, 2026 that its MCP surface had expanded to 104 tools: 85 Management API tools plus 19 workflow-oriented tools. Neon also publishes `@neon/tools` for typed agent tooling.

This connector treats the official MCP server as preferred when a compatible, explicitly allowlisted tool is available and authentication has been provisioned by the host. The stable connector contract does not depend on Neon tool naming: documented Management API v2 endpoints are used as fallback and for deterministic coverage.

Official references:
- https://mcp.neon.tech/
- https://neon.com/blog/give-your-agent-neon-tools
- https://api-docs.neon.tech/reference/authentication
- https://api-docs.neon.tech/reference/listprojects
- https://api-docs.neon.tech/reference/createproject
- https://api-docs.neon.tech/reference/listprojectbranches
- https://api-docs.neon.tech/reference/createprojectbranch
- https://api-docs.neon.tech/reference/deleteprojectbranch
- https://api-docs.neon.tech/reference/listprojectbranchendpoints
- https://api-docs.neon.tech/reference/pagination

## Authentication

Management API requests use `Authorization: Bearer $NEON_API_KEY`. Neon supports personal API keys, organization API keys, and project-scoped organization API keys. Prefer project-scoped organization API keys for project-only automation because they narrow access and cannot perform destructive project operations. Organization keys have broader administrative reach and should be avoided unless needed.

For the official hosted MCP server, provision OAuth/API-key authentication in the MCP host and expose only the resulting access token to the connector process as `NEON_MCP_ACCESS_TOKEN`. Raw provider credentials never appear in tool schemas or model-visible responses.

## Tools

| Tool | Risk | Approval | Primary transport |
|---|---|---|---|
| `neon.project.list` | READ | no | MCP -> REST |
| `neon.project.get` | READ | no | MCP -> REST |
| `neon.project.create` | HIGH_RISK | required | REST |
| `neon.branch.list` | READ | no | REST |
| `neon.branch.get` | READ | no | REST |
| `neon.branch.create` | WRITE | configurable | REST |
| `neon.branch.delete` | DESTRUCTIVE | required + disabled by default | REST |
| `neon.database.list` | READ | no | REST |
| `neon.database.create` | WRITE | configurable | REST |
| `neon.role.list` | READ | no | REST |
| `neon.endpoint.list` | READ | no | REST |
| `neon.operation.list` | READ | no | REST |

## Approval and permissions

READ tools may execute automatically. WRITE tools require an out-of-band connector approval by default. HIGH_RISK tools always require approval because provisioning a project may create billable infrastructure. DESTRUCTIVE tools additionally require `NEON_ENABLE_DESTRUCTIVE=true` and are disabled by default.

The `approvalId` is an opaque host grant, not a Neon credential. The agent cannot alter provider scopes or enable destructive mode through a tool call.

## Reliability and rate limiting

Requests use `AbortController` timeouts, bounded retries, `Retry-After` when present, and cursor/limit pagination. Neon documents that non-idempotent methods such as POST/PATCH/DELETE/PUT are generally unsafe to retry after ambiguous failures. Accordingly, this connector retries network/5xx failures only for GET requests, with two provider-documented exceptions: HTTP 503 and 423 are retried because Neon states those responses are safe to retry. Authentication, permission, validation, and ordinary write failures are not blindly retried.

Projects accept limits 1-400; operations accept 1-1000. The connector enforces those bounds before sending requests.

## Security

- No arbitrary `execute_api_request` tool exists.
- Project and branch identifiers are validated against the documented lowercase ID format.
- Credentials stay inside the connector and are never returned to the model.
- Provider data is tagged as `untrustedProviderData`; database names, project metadata, errors, and other retrieved text are data, not instructions.
- Upstream MCP use is restricted to the official `mcp.neon.tech` host and a fixed allowlist. Newly discovered upstream tools are not automatically trusted.
- Destructive branch deletion is off by default.
- The connector does not expose SQL execution, project deletion, role-password reset, permission changes, billing operations, or generic API passthrough in this default surface.

## Installation and running

```bash
cd MCP-API/neon
npm install
npm run build
npm start
```

Node.js 20+ is required. The connector itself serves MCP over stdio. MCP hosts that can launch a local stdio server can use the package by pointing to `dist/src/index.js` and injecting secrets through their secure environment/credential mechanism.

## Error handling

Provider errors are mapped to MCP errors without returning authorization headers or API keys. Local validation and approval failures occur before provider calls. REST reads support bounded exponential backoff. Partial list results retain Neon pagination cursors so callers can continue explicitly.

## Testing

```bash
npm test
```

Tests use fakes and require no live Neon credentials. They cover tool registration, pagination, identifier validation, endpoint mapping, write approval denial, and destructive defaults.

## Limitations

- The official Neon MCP tool catalog evolves rapidly. This connector deliberately exposes a stable subset and falls back to documented REST endpoints rather than trusting newly discovered MCP tools.
- OAuth browser flows and secure token refresh/persistence belong to the MCP host or credential provider; this connector consumes an already-authorized access token.
- SQL execution and migration tools are intentionally omitted from this default connector because free-form SQL has materially different data-access and destructive-risk semantics and deserves a separately constrained policy surface.
- Branch deletion can fail for root/default branches or branches with children, as documented by Neon.
