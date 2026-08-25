# MySQL MCP/API Connector

Reusable MCP server that exposes a constrained set of MySQL operations for AI agents and MCP clients while keeping database credentials inside the connector process.

## Upstream transport

This connector uses Oracle's official MySQL Connector/Node.js package, `@mysql/xdevapi` 8.0.35, over MySQL X Protocol. MySQL's current official connector documentation describes Connector/Node.js as an Oracle-maintained MySQL 8 driver implementing X DevAPI. The X DevAPI supports relational tables, document collections, transactions, prepared statements, and raw SQL through `Session.sql()`.

No official MySQL MCP server is used by this package. The external interface is MCP; upstream database access is through the official X DevAPI SDK.

Official references researched for this implementation:

- https://dev.mysql.com/doc/dev/connector-nodejs/latest/
- https://dev.mysql.com/doc/dev/connector-nodejs/latest/module-SqlExecute.html
- https://dev.mysql.com/doc/x-devapi-userguide/en/crud-operations-overview.html
- https://dev.mysql.com/doc/x-devapi-userguide/en/database-connection-example.html
- https://dev.mysql.com/doc/dev/connector-nodejs/latest/tutorial-Secure_Sessions.html
- https://www.npmjs.com/package/@mysql/xdevapi

## Requirements

- Node.js 20+
- MySQL 8 with X Protocol enabled; the official connector documents full support for MySQL 8.0.11+
- A least-privilege MySQL account limited to the schemas and operations this connector should access
- TLS for remote database connections

MySQL X Protocol normally listens on port 33060. The connector does not support the classic protocol on port 3306 because `@mysql/xdevapi` is specifically an X Protocol driver.

## Capabilities

| MCP tool | Operation | Risk | Approval |
|---|---|---:|---:|
| `mysql.server.health` | Test connection and return server identity metadata | READ | No |
| `mysql.schema.list` | List visible schemas | READ | No |
| `mysql.table.list` | List tables/views in a schema | READ | No |
| `mysql.table.describe` | Read column metadata | READ | No |
| `mysql.row.select` | Read rows with equality filters | READ | No |
| `mysql.row.get` | Read one row by key | READ | No |
| `mysql.query.select` | Run one read-only SELECT/SHOW/EXPLAIN/DESCRIBE statement | READ | No |
| `mysql.row.insert` | Insert one row | WRITE | Required |
| `mysql.row.update` | Update at most one row by key | WRITE | Required |
| `mysql.row.delete` | Delete at most one row by key | DESTRUCTIVE | Required |

The package intentionally does not expose a generic arbitrary-SQL execution tool. DDL, privilege changes, account management, multi-statement requests, transaction-control statements, stored-procedure execution, and unrestricted bulk writes are not implemented.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> validation / permission policy
  -> MySqlClient
  -> @mysql/xdevapi
  -> MySQL X Protocol
  -> MySQL server
```

Provider content is treated as untrusted data and returned as JSON text. Database credentials are loaded only from environment configuration and are never accepted as MCP tool arguments.

## Authentication

Set `MYSQL_XDEVAPI_URI` to a MySQL X connection URI:

```text
mysqlx://user:password@database.example:33060/app
```

For production, inject the URI through a secret manager or process environment rather than source control. Create a dedicated MySQL account with only the exact schema/table privileges required. For read-only deployments, grant SELECT and metadata visibility only. For write deployments, grant only the required INSERT/UPDATE privileges. Add DELETE only when destructive operations are truly required.

The official X DevAPI documentation states that secure connections are the default and documents `PLAIN` authentication over TLS along with `MYSQL41` and `SHA256_MEMORY` depending on transport/server configuration. Use TLS for remote connections.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `MYSQL_XDEVAPI_URI` | Yes | none | X Protocol connection URI |
| `MYSQL_APPROVAL_SECRET` | For approved writes/deletes | none | HMAC key used to validate explicit approvals |
| `MYSQL_TIMEOUT_MS` | No | `15000` | Per-operation timeout, 1s to 120s |
| `MYSQL_MAX_ROWS` | No | `200` | Maximum result rows, 1 to 1000 |
| `MYSQL_ALLOW_WRITES` | No | `false` | Enables insert/update tools after approval |
| `MYSQL_ALLOW_DESTRUCTIVE` | No | `false` | Enables delete tool after approval |

Copy `.env.example` as a configuration reference. Do not commit real credentials.

## Installation

```bash
npm install
npm run build
```

The official MySQL Connector/Node.js package is pinned to 8.0.35 because its npm documentation explicitly notes that Connector/Node.js releases do not follow Semantic Versioning and recommends installing a specific version.

## Running

```bash
MYSQL_XDEVAPI_URI='mysqlx://user:password@localhost:33060/app' npm start
```

The server uses MCP stdio transport and therefore works with MCP clients that support launching a local stdio server. Client-specific configuration varies by product.

## Permission and approval model

READ tools execute without connector-level approval, but the MySQL account remains the ultimate database authorization boundary.

WRITE tools require both:

1. `MYSQL_ALLOW_WRITES=true`
2. A valid approval object containing `nonce` and `digest`

DESTRUCTIVE tools require both:

1. `MYSQL_ALLOW_DESTRUCTIVE=true`
2. A valid approval object

The approval digest is:

```text
HMAC-SHA256(MYSQL_APPROVAL_SECRET, "<tool-name>:<nonce>")
```

The connector compares digests using a timing-safe comparison. Approval is scoped to the tool name and nonce. The agent cannot enable writes, destructive operations, or change the approval secret through MCP.

A deployment integrating a human-approval UI should generate the nonce and HMAC outside the language model and inject the resulting approval only after a person confirms the pending operation.

## Validation and safety

- Schema, table, and column identifiers must match a strict identifier grammar and are always quoted by connector-generated SQL.
- Data values are passed through X DevAPI positional bindings rather than string interpolation.
- `mysql.row.update` and `mysql.row.delete` require an explicit key column/value and generate `LIMIT 1`.
- `mysql.query.select` accepts only statements beginning with `SELECT`, `SHOW`, `EXPLAIN`, or `DESCRIBE`.
- SQL comments and multiple statements are rejected by `mysql.query.select`.
- Raw write SQL, DDL, permission changes, and stored-procedure execution are not exposed.
- Result sets are capped by `MYSQL_MAX_ROWS`.
- Connector-side operation timeouts are bounded.
- Secrets are never tool parameters and should not be logged.

`mysql.query.select` is intended for trusted administrative/query workloads where the caller is permitted to construct read-only SQL. For higher-assurance deployments, omit this tool at the MCP client allowlist layer and use only the structured row/table tools.

## Reliability

Connector operations have a bounded timeout. Sessions are closed in `finally` blocks. The connector does not automatically retry writes or deletes. Database authentication, validation, and permission errors are surfaced immediately rather than retried. MySQL server load and concurrency limits are governed by the server and deployment; unlike a SaaS HTTP API, there is no provider HTTP rate-limit header to parse.

## Pagination and result limits

`mysql.row.select` accepts a bounded `limit` and always caps it at `MYSQL_MAX_ROWS`. Metadata queries and `mysql.query.select` also truncate returned arrays to `MYSQL_MAX_ROWS`. This implementation deliberately avoids automatic unbounded pagination because that can create expensive agent-driven table scans.

## Error handling

Typical errors include:

- Missing or malformed `MYSQL_XDEVAPI_URI`
- MySQL authentication failures
- TLS/connectivity failures
- Missing schema/table privileges
- Invalid identifiers
- Query validation failures
- Operation timeout
- Writes/destructive operations disabled
- Missing or invalid approval
- Provider-side SQL or constraint errors

The connector returns MCP tool failures rather than converting these conditions into successful results.

## Security considerations

Use a network boundary around the database and never expose MySQL directly to untrusted clients. Prefer private networking, TLS, firewall allowlists, and a dedicated least-privilege account. Do not use a root or administrative account.

Third-party row values, comments stored in text columns, JSON documents, and other database content can contain prompt-injection text. MCP clients must treat returned data as untrusted content, not as instructions capable of changing system prompts, permissions, approval state, or tool configuration.

Do not put `MYSQL_XDEVAPI_URI` or `MYSQL_APPROVAL_SECRET` in prompts. Keep them in the connector environment or a secure credential provider.

## Tests

```bash
npm test
```

Unit tests require no live database. They cover configuration validation, safe defaults, write denial, explicit approval verification, destructive-operation isolation, read-only SQL validation, and pre-connection write validation.

Live integration testing can be added in a controlled environment by running MySQL with X Protocol enabled and providing a dedicated test account, but it is intentionally not required for the normal unit suite.

## Limitations

- No upstream official MCP server is available/used; transport to MySQL is X DevAPI.
- No classic MySQL protocol support.
- No schema migration/DDL tools.
- No privilege or user administration.
- No stored procedure or arbitrary statement execution.
- No bulk update/delete operations.
- No automatic transaction orchestration across separate MCP calls.
- `mysql.row.get`, update, and delete use a caller-supplied key column; the connector does not infer primary keys.
- The connector does not provide CDC, binlog streaming, or webhook-style events.
