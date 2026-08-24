# Snowflake MCP/API Connector

Reusable MCP server for Snowflake data discovery, bounded read workflows, SQL statement lifecycle management, and an approval-gated single-row insert operation.

## Transport strategy

This connector uses capability-level routing:

1. **Official Snowflake-managed MCP server (preferred for read SQL)** when `SNOWFLAKE_MCP_URL` and `SNOWFLAKE_MCP_ACCESS_TOKEN` are configured and the configured SQL tool is discovered with a compatible string input schema.
2. **Official Snowflake SQL API (REST fallback)** for read queries when managed MCP is unavailable/incompatible, and for status, result partitions, cancel, and parameter-bound insert operations.

The external MCP tool names remain stable regardless of upstream transport.

Snowflake-managed MCP is Generally Available, supports MCP protocol revision `2025-11-25`, uses a remote HTTPS endpoint, and currently supports tools only. Snowflake documents `SYSTEM_EXECUTE_SQL`, Cortex Agent, Cortex Analyst, Cortex Search, and generic UDF/stored-procedure tools. For this connector, only a configured read-only SQL execution tool is eligible for transparent MCP routing.

## Official sources

- Snowflake-managed MCP server: https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-mcp
- `CREATE MCP SERVER`: https://docs.snowflake.com/en/sql-reference/sql/create-mcp-server
- Snowflake SQL API: https://docs.snowflake.com/en/developer-guide/sql-api
- SQL API endpoints/reference: https://docs.snowflake.com/en/developer-guide/sql-api/reference
- SQL API request submission and bindings: https://docs.snowflake.com/en/developer-guide/sql-api/submitting-requests
- Snowflake REST API authentication: https://docs.snowflake.com/en/developer-guide/snowflake-rest-api/authentication

## Architecture

```text
MCP client
   |
   v
Snowflake connector (stdio MCP)
   |-- validation / allowlists / approval policy
   |-- managed MCP transport --------> Snowflake-managed MCP (read SQL when compatible)
   `-- SQL API client ----------------> /api/v2/statements
```

Provider content is treated as untrusted data. It is returned to the MCP caller as tool output and never interpreted as connector configuration, permissions, credentials, or system instructions.

## Supported tools

| Tool | Purpose | Upstream | Risk | Approval |
| --- | --- | --- | --- | --- |
| `snowflake.database.list` | List visible databases | MCP preferred, REST fallback | READ | No |
| `snowflake.schema.list` | List schemas in an allowed database | MCP preferred, REST fallback | READ | No |
| `snowflake.table.list` | List tables in an allowed schema | MCP preferred, REST fallback | READ | No |
| `snowflake.table.describe` | Describe a table | MCP preferred, REST fallback | READ | No |
| `snowflake.table.sample` | Read at most 200 rows from a table | MCP preferred, REST fallback | READ | No |
| `snowflake.warehouse.list` | List visible warehouses | MCP preferred, REST fallback | READ | No |
| `snowflake.query.execute_read` | Execute one read-only SQL statement | MCP preferred, REST fallback | READ | No |
| `snowflake.query.status` | Get statement status/result | SQL API | READ | No |
| `snowflake.query.partition.get` | Get one result partition | SQL API | READ | No |
| `snowflake.query.cancel` | Cancel a running SQL API statement | SQL API | HIGH_RISK | Yes |
| `snowflake.row.insert` | Insert exactly one parameter-bound row | SQL API | WRITE | Yes |

No arbitrary HTTP-request tool, arbitrary write-SQL tool, DROP tool, DELETE tool, role-management tool, billing tool, or privilege-escalation tool is exposed.

## Authentication

### SQL API

Set `SNOWFLAKE_TOKEN` and choose a token type with `SNOWFLAKE_TOKEN_TYPE`:

- `OAUTH` (default): OAuth bearer access token.
- `PROGRAMMATIC_ACCESS_TOKEN`: Snowflake programmatic access token (PAT).

The connector sends the token only in the provider-facing `Authorization` header and sets `X-Snowflake-Authorization-Token-Type`. Raw credentials are never returned in MCP tool output.

Snowflake also supports key-pair JWT and workload identity federation for REST APIs, but this connector intentionally does not implement those token-minting flows in v1. Deployments can provision a short-lived OAuth token or PAT through an external secret/identity system and inject it into the connector process.

### Official managed MCP

Configure:

```text
SNOWFLAKE_MCP_URL=https://<account-url>/api/v2/databases/<database>/schemas/<schema>/mcp-servers/<name>
SNOWFLAKE_MCP_ACCESS_TOKEN=<OAuth access token>
SNOWFLAKE_MCP_SQL_TOOL=sql_exec_tool
```

Snowflake-managed MCP uses Snowflake OAuth by default and can be bound to External OAuth. Snowflake documents `session:role:all` as the default advertised Snowflake OAuth scope when no other scope configuration is supplied. Configure the OAuth security integration and role allowlist in Snowflake; do not put client secrets in this repository.

The connector performs `tools/list`, finds exactly the configured tool name, inspects its `inputSchema`, and calls it only when a string `query`, `sql`, or `statement` parameter is present. Newly discovered tools are not trusted or invoked automatically.

## Snowflake privileges and least privilege

Snowflake access is enforced primarily by RBAC/object privileges, not by connector-defined OAuth scopes. Provision a dedicated low-privilege role. Typical privileges depend on your objects and may include:

- `USAGE` on the relevant warehouse, database, and schema.
- `SELECT` on tables/views used by read tools.
- `INSERT` only on tables intentionally exposed to `snowflake.row.insert`.
- `USAGE` on an MCP server and the required underlying tools/objects when managed MCP is used.

Set `SNOWFLAKE_ALLOWED_DATABASES` and `SNOWFLAKE_ALLOWED_SCHEMAS` as connector-side defense-in-depth. These allowlists do not grant Snowflake permissions; they only narrow what this process will address.

Examples:

```text
SNOWFLAKE_ALLOWED_DATABASES=ANALYTICS,PRODUCT
SNOWFLAKE_ALLOWED_SCHEMAS=ANALYTICS.PUBLIC,PRODUCT.REPORTING
```

A schema entry can also be a bare schema name if the same schema may be used in multiple allowed databases.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SNOWFLAKE_ACCOUNT_URL` | Yes | HTTPS Snowflake account URL ending in `.snowflakecomputing.com` |
| `SNOWFLAKE_TOKEN` | Yes | OAuth token or PAT, kept inside connector process |
| `SNOWFLAKE_TOKEN_TYPE` | No | `OAUTH` or `PROGRAMMATIC_ACCESS_TOKEN`; default `OAUTH` |
| `SNOWFLAKE_WAREHOUSE` | No | Default SQL API warehouse |
| `SNOWFLAKE_DATABASE` | No | Default database |
| `SNOWFLAKE_SCHEMA` | No | Default schema |
| `SNOWFLAKE_ROLE` | No | SQL API role |
| `SNOWFLAKE_ALLOWED_DATABASES` | No | Comma-separated database allowlist |
| `SNOWFLAKE_ALLOWED_SCHEMAS` | No | Comma-separated schema or `DB.SCHEMA` allowlist |
| `SNOWFLAKE_APPROVAL_SECRET` | Required for writes/high-risk | Secret used to validate tool-bound HMAC approvals |
| `SNOWFLAKE_TIMEOUT_MS` | No | HTTP timeout, `1000..120000`; default `20000` |
| `SNOWFLAKE_MAX_RETRIES` | No | Bounded retries `0..5`; default `3` |
| `SNOWFLAKE_MCP_URL` | No | Official Snowflake-managed MCP endpoint |
| `SNOWFLAKE_MCP_ACCESS_TOKEN` | No | OAuth token used only for managed MCP calls |
| `SNOWFLAKE_MCP_SQL_TOOL` | No | Expected read-only SQL tool name; default `sql_exec_tool` |

See `.env.example`. Never commit real tokens or approval secrets.

## Install and run

Requirements: Node.js 20 or newer.

```bash
cd MCP-API/snowflake
npm install
npm run build
npm start
```

The server uses stdio transport, so MCP clients should launch the built `dist/src/server.js` process and supply environment variables through their secure process configuration.

Example generic MCP client configuration after building:

```json
{
  "mcpServers": {
    "snowflake-safe": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/snowflake/dist/src/server.js"],
      "env": {
        "SNOWFLAKE_ACCOUNT_URL": "https://myorg-myaccount.snowflakecomputing.com",
        "SNOWFLAKE_TOKEN": "${SNOWFLAKE_TOKEN}",
        "SNOWFLAKE_TOKEN_TYPE": "OAUTH"
      }
    }
  }
}
```

Whether a particular ChatGPT-compatible client, Claude/Claude Code, Cursor, Copilot-compatible environment, or custom agent can launch stdio MCP processes depends on that client's MCP support. The connector itself implements standard MCP server tools over stdio.

## Read-query validation

`snowflake.query.execute_read`:

- Accepts one statement only.
- Allows leading `SELECT`, `SHOW`, `DESCRIBE`/`DESC`, or `EXPLAIN`.
- Blocks a second statement via semicolons.
- Blocks obvious mutating keywords including `CALL`, DML, DDL, privilege changes, stage upload/removal, and `COPY INTO`.
- Limits SQL text to 100,000 characters.
- Allows optional database/schema/warehouse/role context and a provider timeout up to 600 seconds.

This validation is defense-in-depth, not a replacement for Snowflake RBAC. SQL can reference functions and other provider objects; the Snowflake role must remain least privileged. For the strongest direct-SQL boundary, configure the official managed MCP `SYSTEM_EXECUTE_SQL` tool with `read_only: true` and a dedicated role.

## Write and approval model

`READ` tools may execute without approval. `WRITE` and `HIGH_RISK` tools require a 64-character lowercase hexadecimal approval ID derived as:

```text
HMAC-SHA256(SNOWFLAKE_APPROVAL_SECRET, exact_tool_name)
```

Examples of exact tool names are `snowflake.row.insert` and `snowflake.query.cancel`. Because approvals are tool-bound, an approval for insert cannot authorize cancellation.

In production, generate approvals outside the model/agent boundary after a human has reviewed the intended action. Do not expose `SNOWFLAKE_APPROVAL_SECRET` to the LLM.

`snowflake.row.insert` is deliberately narrow: one table, one row, 1–50 validated columns, primitive string/number/boolean values, and SQL API parameter bindings. It does not accept raw SQL.

## Reliability and rate limits

Snowflake SQL API can return HTTP `429` for throttling/concurrency pressure. Snowflake recommends reducing request frequency and using exponentially jittered backoff. This connector:

- Retries only read/idempotent operations.
- Uses bounded exponential backoff with jitter.
- Honors `Retry-After` when present.
- Retries selected transient `429`, `500`, `502`, `503`, and `504` responses only for retry-safe operations.
- Does not blindly retry insert or cancel operations.
- Applies a client-side HTTP timeout.
- Preserves Snowflake error code/SQL state in mapped errors where provided.

Long-running SQL API statements may return a statement handle. Use `snowflake.query.status` to poll explicitly. Snowflake result sets are partitioned; use `snowflake.query.partition.get` to retrieve a specific partition rather than automatically downloading an unbounded result set.

## Security considerations

- Credentials remain inside the connector transport layer.
- Provider responses and SQL result data are untrusted content, never instructions.
- Snowflake account and MCP URLs must be HTTPS Snowflake hosts, reducing SSRF exposure.
- Database/schema/table identifiers are constrained and quoted.
- Insert values use SQL API bindings rather than SQL string interpolation.
- Connector allowlists cannot be changed through MCP tools.
- The connector does not discover and automatically trust new managed-MCP tools.
- Official managed MCP is attempted only for non-async read queries; failures or schema mismatches fall back to the official SQL API.
- Mutating/high-risk operations require explicit tool-bound approval and provider-side privileges.
- Destructive operations are not implemented.

Snowflake warns about MCP tool poisoning/shadowing and recommends verifying exposed tools, using OAuth, least-privileged roles, and avoiding recursive agent/MCP loops. This connector follows those principles by pinning one configured upstream SQL tool name and validating its schema before use.

## Error handling

Common failures are surfaced as MCP tool errors:

- Invalid/missing configuration.
- Invalid identifiers or allowlist violations.
- Missing/invalid approval.
- `401`/`403` authentication or RBAC failures (not retried automatically).
- SQL compilation/execution failures with Snowflake code/SQL state where available.
- `429` throttling with bounded backoff for reads.
- Network/timeout failures.
- Managed MCP failures; read queries fall back to REST when possible.

## Tests

Normal tests require no live Snowflake credentials.

```bash
npm test
npm run typecheck
npm run build
```

Tests cover configuration validation, database/schema permission denial, tool-bound approval, identifier and binding validation, token isolation, read execution, provider error mapping, rate-limit retry behavior, no blind retry for cancel, managed MCP tool discovery/invocation, managed MCP fallback, MCP host validation, and tool-registration coverage.

## Limitations

- This connector does not provision Snowflake OAuth integrations, roles, grants, MCP server objects, warehouses, databases, or schemas.
- Key-pair JWT and workload identity token minting are not implemented in v1; use externally provisioned OAuth/PAT credentials.
- Managed MCP routing is intentionally limited to one configured read-only SQL tool. Cortex Agent/Analyst/Search tools are not remapped because their contracts are domain-specific and should be exposed deliberately rather than guessed.
- SQL API result partitions are fetched explicitly; the connector does not concatenate an unbounded result set.
- No arbitrary write SQL, multi-statement SQL, destructive database operations, account administration, security-policy changes, or billing operations are exposed.
- Snowflake-managed MCP is not supported in Snowflake government regions according to Snowflake documentation.
