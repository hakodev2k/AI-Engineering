# Linear MCP/API Connector

Reusable MCP server exposing stable, scoped Linear tools. Linear has an official hosted remote MCP server at `https://mcp.linear.app/mcp` (and read-only `/mcp/readonly`) using Streamable HTTP and OAuth 2.1; it supports finding, creating, and updating issues, projects, and comments. This package exposes a deliberately stable local MCP contract and uses Linear's official GraphQL API for deterministic schemas, validation, approval enforcement, and predictable tests. Deployments that only need Linear's native tool surface should prefer the official remote MCP directly.

## Official sources

- MCP: https://linear.app/docs/mcp
- GraphQL: https://linear.app/developers/graphql
- Rate limits: https://linear.app/developers/rate-limiting
- Webhooks: https://linear.app/developers/webhooks

## Transport and capabilities

External transport is MCP over stdio. Upstream application operations use official GraphQL at `https://api.linear.app/graphql`; the official MCP endpoint is recorded in the manifest and recommended when its native contract is sufficient. Implemented tools: `linear.issue.search`, `linear.issue.get`, `linear.team.list`, `linear.project.list`, `linear.workflow_state.list`, `linear.issue.create`, `linear.issue.update`, `linear.issue.comment`. No delete, billing, permission, arbitrary GraphQL, or raw HTTP tool is exposed.

## Authentication

Set `LINEAR_API_KEY` to a Linear personal API key or compatible bearer credential. Keep credentials in the connector process, never prompts/tool arguments. For production multi-user apps prefer Linear OAuth 2.0/2.1 authorization appropriate to the chosen transport and request least privilege. The official MCP supports interactive OAuth 2.1, bearer tokens, API keys, and a read-only endpoint/scope.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
LINEAR_API_KEY=... npm start
```

Configure any stdio-compatible MCP client to launch `node dist/src/server.js`. Compatibility depends on the client implementing standard MCP stdio; no client-specific behavior is required.

## Permissions and approval

Read tools execute automatically. Create/update/comment are WRITE operations. They require `approved:true` unless an operator explicitly sets `LINEAR_APPROVE_WRITES=true`. The connector does not expose destructive operations. Agents cannot change policy or credentials through tools.

## Reliability and rate limits

Requests have a configurable timeout (`LINEAR_TIMEOUT_MS`, default 15s). GraphQL errors and partial-error responses fail closed. `RATELIMITED` is mapped explicitly and `Retry-After` is preserved when supplied. The connector does not blindly retry writes. Linear documents request and complexity limits; API-key traffic is currently limited to 2,500 requests/hour and 3,000,000 complexity points/hour. Pagination is bounded to 50 per tool call. Prefer webhooks rather than polling for change-driven systems.

## Security

Inputs use strict bounded schemas. No arbitrary URL or GraphQL execution is exposed, reducing SSRF and privilege-escalation risk. Provider content is returned as untrusted data and marked `untrustedProviderContent`; callers must not treat issue text/comments as instructions. Secrets are never logged or returned. Production OAuth implementations should use state/PKCE where applicable and secure token storage. Official upstream MCP use should pin the Linear endpoints, restrict allowed tools, and fail if unexpected permissions are requested.

## Testing

```bash
npm test
```

Unit tests require no live credentials and cover credential configuration, approval denial, reads, GraphQL errors, and successful mocked responses.

## Limitations

This connector intentionally omits delete operations, webhook hosting/verification, attachments, admin/security changes, and arbitrary API access. OAuth browser flow/token persistence is delegated to the host when using official MCP; this local GraphQL mode accepts an already-issued credential. Linear GraphQL can return HTTP 200 with errors, so the client checks the GraphQL `errors` array.
