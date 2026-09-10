# PlanetScale MCP/API Connector

Reusable safety wrapper around PlanetScale's official hosted MCP server. It exposes a fixed provider-scoped tool surface for database discovery, schema inspection, Insights, query tags, Postgres logs, schema recommendations, and controlled SQL execution.

## Official transport and research

PlanetScale provides an official hosted MCP server authenticated with OAuth and, since August 2026, service tokens for automated clients. The official server exposes organizations, databases, branches, schemas, Insights, query execution, billing (with permission), schema recommendations, query tags, and Postgres logs. This connector uses the official MCP transport for every implemented capability; no REST fallback is needed for this selected surface.

Official sources researched:
- MCP launch and tools: https://planetscale.com/blog/introducing-planetscale-mcp-server
- MCP changelog: https://planetscale.com/changelog/mcp-server
- Service-token MCP authentication: https://planetscale.com/changelog
- Query tags: https://planetscale.com/changelog/mcp-query-tags
- Read-query replica/RLS behavior: https://planetscale.com/changelog/mcp-read-query-replica-rls
- Schema recommendations: https://planetscale.com/changelog/mcp-schema-recommendations
- Postgres logs: https://planetscale.com/changelog/mcp-postgres-logs
- API/service-token background: https://planetscale.com/blog/introducing-planetscale-api-and-oauth-applications

## Architecture

`MCP client -> this stdio connector -> validation/policy -> official PlanetScale hosted MCP -> PlanetScale`.

The PlanetScale credential exists only in the connector transport. It is never a tool parameter or result. Provider-returned schema, logs, query results, recommendations, and Insights content are labeled untrusted data and cannot alter connector permissions.

## Authentication

Set `PLANETSCALE_MCP_TOKEN` to a service token provisioned outside the model. Grant only the organization/database/branch permissions required by the selected tools. PlanetScale's hosted MCP also supports interactive OAuth with configurable read-only/full-access permissions; interactive OAuth is intentionally left to OAuth-capable MCP hosts rather than implemented in this headless wrapper.

Use read-only branch permissions whenever write queries are unnecessary. Production write access should be exceptional.

## Environment

Copy `.env.example` and inject values from a secret manager. The MCP URL is pinned to official HTTPS PlanetScale hosts. `PLANETSCALE_TIMEOUT_MS` is bounded to 1-120 seconds and `PLANETSCALE_MAX_RETRIES` to 0-5. `PLANETSCALE_ENABLE_WRITE` defaults to false. `PLANETSCALE_APPROVAL_SECRET` is required for write execution and must remain outside model context.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The connector exposes standard MCP over stdio and can be launched by MCP clients that support stdio subprocess servers.

## Tools

| Tool | Official MCP capability | Risk | Approval |
|---|---|---|---|
| `planetscale.organization.list` | `planetscale_list_organizations` | READ | No |
| `planetscale.organization.get` | `planetscale_get_organization` | READ | No |
| `planetscale.database.list` | `planetscale_list_databases` | READ | No |
| `planetscale.database.get` | `planetscale_get_database` | READ | No |
| `planetscale.branch.list` | `planetscale_list_branches` | READ | No |
| `planetscale.branch.get` | `planetscale_get_branch` | READ | No |
| `planetscale.branch.schema` | `planetscale_get_branch_schema` | READ | No |
| `planetscale.insights.get` | `planetscale_get_insights` | READ | No |
| `planetscale.schema_recommendation.list` | `planetscale_list_schema_recommendations` | READ | No |
| `planetscale.query_tag.list` | `planetscale_list_query_tags` | READ | No |
| `planetscale.query_tag.get` | `planetscale_get_query_tag` | READ | No |
| `planetscale.query_tag.summary` | `planetscale_list_query_tag_summaries` | READ | No |
| `planetscale.postgres.logs` | `planetscale_get_postgres_logs` | READ | No |
| `planetscale.query.read` | `planetscale_execute_read_query` | READ | No |
| `planetscale.query.write` | `planetscale_execute_write_query` | HIGH_RISK | Always + disabled by default |

The wrapper allowlists only these names and verifies upstream discovery before calling them. Newly added upstream MCP tools are not automatically trusted or exposed.

## Query safety and approval

PlanetScale's official MCP includes safeguards: reads can route to replicas; write-query safety blocks UPDATE/DELETE without WHERE, blocks TRUNCATE, and requires human confirmation for DDL. This wrapper adds a second boundary: `planetscale.query.write` is disabled unless `PLANETSCALE_ENABLE_WRITE=true`, and every call requires an HMAC-SHA256 approval token bound to the exact tool and canonical payload. Any SQL or target change invalidates approval.

Write calls are never retried automatically. This prevents ambiguous failures from duplicating mutations. Read calls may retry bounded transient failures such as 429, timeout, 502, or 503 with exponential backoff.

## Reliability and rate limits

Every upstream call has a bounded timeout. Reads have bounded retries; authentication, permission, validation, and write failures are not blindly retried. PlanetScale's MCP/API limits can vary by capability and account, so this connector does not invent a universal numeric quota. Upstream throttling remains authoritative.

Pagination/result bounds are applied where this wrapper owns the field (for example Insights limit). Other result bounds and cursor behavior remain governed by the official MCP tool schema.

## Security

- Credentials stay in the transport environment and never enter prompts/tool inputs.
- MCP destination is restricted to official HTTPS hosts, reducing SSRF/credential-forwarding risk.
- Upstream tools are fixed and allowlisted; no arbitrary MCP or HTTP proxy exists.
- Retrieved SQL results, schemas, logs, query tags, and recommendations are untrusted provider data.
- Write access is default-off and requires exact-payload human approval.
- Write operations are single-attempt.
- The connector does not expose billing changes, payment methods, service-token management, organization/team permissions, database deletion, branch deletion, or arbitrary provider administration.

## Tests

`npm test` requires no live PlanetScale credentials. Tests cover missing auth, official-host enforcement, unique provider-scoped registration metadata, read authorization, default write denial, exact-payload approval, and approval invalidation after SQL mutation. Live MCP calls are intentionally excluded from normal tests.

## Examples

See `examples/workflows.md` for schema inspection, performance diagnosis, replica-aware reads, and approval-gated writes.

## Limitations

- Interactive OAuth acquisition/refresh is not implemented; headless deployments use a service token.
- The connector intentionally exposes 15 focused capabilities, not the complete evolving PlanetScale MCP surface.
- Billing/invoices, payment-method changes, cluster resizing, deploy-request mutation, service-token administration, teams/members, webhooks, and destructive database/branch operations are omitted.
- Exact upstream MCP schemas remain authoritative. If an allowlisted capability is unavailable for the connected account/server version, the connector fails closed.
- Postgres log tooling applies only where PlanetScale supports that capability.
