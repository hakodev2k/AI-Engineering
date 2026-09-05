# Turso MCP/API Connector

Reusable MCP server for safe Turso **platform management**. It exposes 13 stable provider-scoped tools backed by Turso's official Platform REST API and keeps the platform token inside the connector process.

## Transport decision

Turso has official built-in Database MCP support for database-level operations. This connector's target capabilities are platform-level discovery and provisioning (organizations, locations, groups, databases, usage, plans, members, audit logs), so it uses the official Platform API at `https://api.turso.tech`. Turso also publishes the official `@tursodatabase/api` TypeScript client; direct REST is used here to keep the MCP package small and make every allowed route auditable.

Official sources researched:
- https://docs.turso.tech/api-reference/introduction
- https://docs.turso.tech/api-reference/authentication
- https://docs.turso.tech/api-reference/quickstart
- https://docs.turso.tech/api-reference/databases/list
- https://docs.turso.tech/api-reference/databases/retrieve
- https://docs.turso.tech/api-reference/databases/usage
- https://docs.turso.tech/api-reference/databases/create
- https://docs.turso.tech/api-reference/groups/list
- https://docs.turso.tech/api-reference/groups/create
- https://docs.turso.tech/api-reference/groups/configuration
- https://docs.turso.tech/api-reference/locations/list
- https://docs.turso.tech/api-reference/organizations/list
- https://docs.turso.tech/api-reference/organizations/members/list
- https://docs.turso.tech/api-reference/organizations/members/retrieve
- https://docs.turso.tech/api-reference/organizations/plans
- https://docs.turso.tech/api-reference/audit-logs/list
- https://turso.tech/blog/introducing-the-turso-database-mcp-server

## Authentication and least privilege

The Platform API uses Bearer API tokens. Set `TURSO_PLATFORM_TOKEN` and `TURSO_ORG`. Turso supports minting a token scoped to one organization; use that narrower form for agents, CI, and production. Credentials are read from environment variables and are never returned in tool output.

## Environment

```text
TURSO_PLATFORM_TOKEN=
TURSO_ORG=
TURSO_API_BASE_URL=https://api.turso.tech
TURSO_ALLOW_WRITE=false
TURSO_APPROVAL_MODE=required
TURSO_TIMEOUT_MS=30000
```

`TURSO_API_BASE_URL` is configurable for testing, but callers cannot supply arbitrary URLs or paths, preventing the connector from becoming an SSRF/generic-request primitive.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `turso.organization.list` | REST | READ | No |
| `turso.location.list` | REST | READ | No |
| `turso.group.list` | REST | READ | No |
| `turso.group.configuration.get` | REST | READ | No |
| `turso.database.list` | REST | READ | No |
| `turso.database.get` | REST | READ | No |
| `turso.database.usage.get` | REST | READ | No |
| `turso.organization.members.list` | REST | READ | No |
| `turso.organization.member.get` | REST | READ | No |
| `turso.organization.plans.list` | REST | READ | No |
| `turso.audit_log.list` | REST | READ | No |
| `turso.group.create` | REST | WRITE | Yes |
| `turso.database.create` | REST | WRITE | Yes |

Delete database/group, member mutation, token minting/revocation, billing changes, and raw SQL execution are intentionally not exposed.

## Approval boundary

Reads execute automatically. Writes require both `TURSO_ALLOW_WRITE=true` and, by default, an explicit `approval` object:

```json
{
  "confirmed": true,
  "reason": "Human operator approved creation of this development database"
}
```

The approval object is enforced locally and never forwarded to Turso. Destructive risk is hard-disabled.

## Installation and running

```bash
cd MCP-API/turso
npm install
npm run build
npm start
```

Node.js 20+ is required. The server uses MCP stdio, so it can be launched by MCP clients that support stdio servers. See `examples/mcp-client.json`.

## Reliability and errors

Every HTTP call has an AbortController timeout bounded to 1-120 seconds. Authentication (401), permission (403), plan/quota (402), conflict (409), and throttling (429) responses are mapped to explicit MCP errors. `Retry-After` is preserved for 429 responses. The connector deliberately does not auto-retry writes, avoiding duplicate provisioning after ambiguous network failures. Audit log pagination is bounded to 100 rows per request; database listing uses Turso's server-side filters.

## Security

- Platform token remains in the connector/auth layer, never in model prompts or tool responses.
- Organization slug is connector configuration, not freely selected per tool call.
- Tool inputs use strict schemas with bounded strings, identifiers, dates, and pagination.
- No arbitrary HTTP endpoint or SQL execution tool exists.
- Retrieved database metadata, member data, and audit logs are untrusted data, not instructions.
- Provider content cannot alter permissions, approval policy, or the tool registry.
- Public/destructive/admin actions are omitted instead of relying only on prompting.

## Rate limits

Turso can return HTTP 429. The connector surfaces the provider's `Retry-After` value when present and does not aggressively replay calls. Callers should avoid high-frequency usage/audit polling and use server-side filters.

## Testing

```bash
npm test
```

Tests use no live credentials. They cover missing auth configuration, secure defaults, tool registration/naming, write denial, explicit approval, and the destructive-operation block.

## Example workflow

1. `turso.location.list`
2. `turso.group.list`
3. `turso.organization.plans.list`
4. `turso.group.create` with human approval if a new group is required
5. `turso.database.create` with human approval
6. `turso.database.get`
7. `turso.database.usage.get`
8. `turso.audit_log.list`

## Limitations

This connector manages Turso platform resources; it does not expose database SQL query/execute tools even though Turso Database MCP supports database interaction. It does not create database auth tokens because those responses contain live credentials and are easy to leak into agent transcripts. It does not expose destructive endpoints. Advanced branch/PITR creation, replicas, organization invitations, billing changes, and database encryption configuration are also outside the curated tool surface.
