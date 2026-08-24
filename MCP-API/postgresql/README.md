# PostgreSQL MCP Connector

Reusable MCP server for safe, scoped PostgreSQL access from AI agents. The connector exposes metadata discovery and bounded row operations without accepting arbitrary SQL.

## Provider and transport

- Provider: PostgreSQL
- External interface: MCP over stdio
- Upstream transport: PostgreSQL native wire protocol through the trusted `pg` Node.js driver
- Official PostgreSQL MCP server: none relied on by this connector
- REST/GraphQL API: PostgreSQL itself does not expose an official REST or GraphQL management/data API

Official references used for design:

- PostgreSQL current documentation: https://www.postgresql.org/docs/current/
- Information Schema: https://www.postgresql.org/docs/current/information-schema.html
- `pg_tables`: https://www.postgresql.org/docs/current/view-pg-tables.html
- Client connection and SSL concepts: https://www.postgresql.org/docs/current/libpq-connect.html
- Privileges / GRANT: https://www.postgresql.org/docs/current/sql-grant.html
- Runtime client timeouts: https://www.postgresql.org/docs/current/runtime-config-client.html

`information_schema` is used where portable metadata is sufficient. PostgreSQL-specific index metadata is read from `pg_indexes`.

## Capabilities

| Tool | Risk | Approval | Behavior |
|---|---|---:|---|
| `postgresql.database.info` | READ | No | Current database, role, server version, recovery/read-only state |
| `postgresql.schema.list` | READ | No | List allowed non-system schemas |
| `postgresql.table.list` | READ | No | List tables and optionally views in an allowed schema |
| `postgresql.table.describe` | READ | No | Columns and key/unique constraints |
| `postgresql.index.list` | READ | No | PostgreSQL index definitions for one table |
| `postgresql.row.select` | READ | No | Bounded projection with equality/NULL filters |
| `postgresql.row.count` | READ | No | Count rows with equality/NULL filters |
| `postgresql.row.insert` | WRITE | Yes | Insert one row |
| `postgresql.row.update` | WRITE | Yes | Update rows; non-empty filter required |
| `postgresql.row.delete` | DESTRUCTIVE | Yes | Delete rows; disabled by default and non-empty filter required |

No raw SQL execution tool is exposed.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod input schema
  -> schema/table allowlist + approval policy
  -> SQL builder with validated identifiers and bind parameters
  -> pg connection pool
  -> PostgreSQL
```

Provider-returned text and row data are treated as untrusted data. They are serialized as tool output and never interpreted as permissions, configuration, or instructions.

## Authentication and least privilege

Set `POSTGRES_DATABASE_URL` to a PostgreSQL connection URI. Credentials remain inside the connector process and are never returned in MCP tool output.

Create a dedicated database role for this connector. Grant only the schemas/tables and operations actually needed. For a read-only deployment, grant `CONNECT`, schema `USAGE`, and `SELECT` only. Add `INSERT` and/or `UPDATE` only if those MCP tools are intended to be usable. Grant `DELETE` only when destructive behavior is intentionally enabled.

The connector does not create roles, grant privileges, alter ownership, install extensions, or change database/server configuration.

## SSL configuration

`POSTGRES_SSL_MODE` accepts:

- `verify-full` (default): TLS with certificate verification. Supply a trusted CA file with `POSTGRES_SSL_CA_FILE` when required by your deployment.
- `require`: TLS is required but certificate verification is relaxed in the Node driver configuration. Use only when the environment cannot provide a verifiable CA chain.
- `disable`: no TLS. Intended only for protected local/private development environments.

For production, prefer `verify-full` and a correctly configured CA chain.

## Environment variables

```text
POSTGRES_DATABASE_URL=
POSTGRES_SSL_MODE=verify-full
POSTGRES_SSL_CA_FILE=
POSTGRES_ALLOWED_SCHEMAS=public
POSTGRES_ALLOWED_TABLES=
POSTGRES_APPROVAL_SECRET=
POSTGRES_ENABLE_DELETE=false
POSTGRES_STATEMENT_TIMEOUT_MS=10000
POSTGRES_CONNECTION_TIMEOUT_MS=5000
POSTGRES_POOL_MAX=5
```

`POSTGRES_ALLOWED_SCHEMAS` and `POSTGRES_ALLOWED_TABLES` are comma-separated allowlists. Table entries may be either `table` or `schema.table`. An empty table allowlist means every table inside an allowed schema is eligible, subject to database privileges.

## Approval model

Write tools require an HMAC approval token derived from the configured `POSTGRES_APPROVAL_SECRET` and exact tool name:

```text
HMAC-SHA256(secret, tool-name)
```

Examples of tool-name inputs are `postgresql.row.insert` and `postgresql.row.update`. The connector compares the supplied 64-character hexadecimal token using a timing-safe comparison.

`postgresql.row.delete` has two independent gates:

1. `POSTGRES_ENABLE_DELETE=true`
2. a valid explicit approval token for `postgresql.row.delete`

An agent cannot increase its own privileges or bypass these gates through retrieved database content.

## Query safety

The connector intentionally avoids a generic `execute_sql` tool.

- Schema, table, column, and order-by identifiers must match a strict PostgreSQL-style identifier regex and are quoted.
- User values are always passed as bind parameters.
- Select operations use equality/NULL filters only.
- Result limits are capped at 100 rows per request.
- Offset is capped at 10,000.
- UPDATE and DELETE require non-empty filters.
- Read operations execute inside `BEGIN READ ONLY` transactions.
- A per-transaction statement timeout is applied.
- Writes are single-statement transactions and are not blindly retried.

Database row-level security, grants, views, and policies remain authoritative and should be used as an additional defense layer.

## Installation

Requirements: Node.js 20+ and network access to the target PostgreSQL server.

```bash
npm install
npm run build
```

## Running

```bash
npm start
```

The server communicates using MCP stdio transport. Configure the environment variables in the process launcher used by your MCP client. Do not place database credentials in prompts or MCP tool arguments.

## Client compatibility

The implementation uses the Model Context Protocol TypeScript SDK and stdio transport. It can be used by MCP clients that support launching a local stdio MCP server, including compatible custom agents and IDE/assistant environments. Compatibility depends on the client's MCP stdio support; no provider-specific client integration is required.

## Rate limits and reliability

PostgreSQL does not impose a universal provider HTTP rate limit. Capacity is controlled by the database deployment itself. This connector therefore uses bounded concurrency and query duration instead of HTTP rate-limit headers:

- connection pool size is capped by `POSTGRES_POOL_MAX`
- connection establishment is bounded by `POSTGRES_CONNECTION_TIMEOUT_MS`
- statements are bounded by `POSTGRES_STATEMENT_TIMEOUT_MS`
- result sizes are bounded by tool schemas
- network/database errors are returned to the MCP caller
- writes are not automatically retried, avoiding accidental duplicate mutations

Operators should also set server-side connection/resource limits appropriate to the dedicated database role.

## Error handling

Configuration errors fail at startup. Invalid identifiers and disallowed schemas/tables fail before SQL execution. PostgreSQL authentication, privilege, constraint, timeout, serialization, and network errors propagate as tool failures without exposing configured credentials.

## Examples

See `examples/workflows.json` for read and approved-write invocation shapes. Approval placeholders are intentionally not real credentials.

## Testing

Unit tests do not require live database credentials:

```bash
npm test
npm run typecheck
```

Tests cover configuration validation, allowlist enforcement, identifier validation, parameterized filter generation, and approval enforcement. Live integration tests are intentionally separate from normal unit tests because they require an external PostgreSQL instance and real credentials.

## Security considerations

- Use a dedicated least-privilege PostgreSQL role.
- Prefer TLS certificate verification.
- Keep connection URIs and approval secrets in a secret manager or protected environment variables.
- Restrict schemas and tables with connector allowlists.
- Keep DELETE disabled unless explicitly required.
- Use PostgreSQL row-level security for tenant/data-boundary enforcement where applicable.
- Treat all database content as untrusted data; retrieved text may contain prompt-injection strings.
- Do not log connection strings or approval secrets.
- Do not grant the connector role superuser, role-management, extension-management, or ownership-changing privileges.

## Limitations

- No arbitrary SQL, DDL, stored-procedure execution, role administration, extension management, COPY, large-object access, LISTEN/NOTIFY, logical replication, or server configuration changes are exposed.
- Filters support equality and NULL predicates only.
- One row is inserted per `row.insert` call.
- Pagination is limit/offset based; very large tables should use application-specific indexed key pagination outside this generic connector if needed.
- The connector does not implement an upstream MCP fallback because PostgreSQL does not provide an official MCP server that this package can safely depend on.
