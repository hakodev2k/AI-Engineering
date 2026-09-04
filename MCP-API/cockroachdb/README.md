# CockroachDB Cloud MCP Connector

Reusable, safety-gated connector for CockroachDB Cloud. It exposes a stable provider-scoped MCP interface while delegating database operations to Cockroach Labs' official managed MCP server.

## Official transport and sources

CockroachDB Cloud operates a managed Streamable HTTP MCP endpoint at `https://cockroachlabs.cloud/mcp`. Cockroach Labs documents OAuth 2.1 Authorization Code + PKCE for interactive clients (`mcp:read`, `mcp:write`) and service-account API keys with Cloud RBAC for autonomous agents. This connector uses a service-account API key and the required `mcp-cluster-id` header so credentials remain inside the connector process.

Official sources researched:

- Cloud MCP guide: https://www.cockroachlabs.com/docs/cockroachcloud/connect-to-the-cockroachdb-cloud-mcp-server
- Managed MCP architecture/security: https://www.cockroachlabs.com/blog/cockroachdb-ai-agents-managed-mcp-server/
- Official open-source MCP server/tool contract: https://github.com/cockroachdb/cockroachdb-mcp-server
- CockroachDB Cloud API background: https://www.cockroachlabs.com/blog/cockroachdb-cloud-api/
- Official CockroachDB Cursor/Claude plugins: https://github.com/cockroachdb/cursor-plugin and https://github.com/cockroachdb/claude-plugin

The managed MCP is preferred for every implemented capability. No REST fallback is needed for this curated data-plane surface. CockroachDB's Cloud REST API remains the appropriate interface for broader infrastructure provisioning that is intentionally outside this connector's scope.

## Implemented tools

| Connector tool | Official MCP tool | Risk | Approval |
|---|---|---|---|
| `cockroachdb.cluster.get` | `get_cluster` | READ | No |
| `cockroachdb.database.list` | `list_databases` | READ | No |
| `cockroachdb.table.list` | `list_tables` | READ | No |
| `cockroachdb.table.schema.get` | `get_table_schema` | READ | No |
| `cockroachdb.sql_user.list` | `list_sql_users` | READ | No |
| `cockroachdb.node.list` | `list_cluster_nodes` | READ | No |
| `cockroachdb.query.running.list` | `show_running_queries` | READ | No |
| `cockroachdb.query.select` | `select_query` | READ | No |
| `cockroachdb.query.explain` | `explain_query` | READ | No |
| `cockroachdb.statement.show` | `show_statement` | READ | No |
| `cockroachdb.database.create` | `create_database` | WRITE | Yes |
| `cockroachdb.table.create` | `create_table` | WRITE | Yes |
| `cockroachdb.row.insert` | `insert_rows` | WRITE | Yes |
| `cockroachdb.row.update` | `update_rows` | HIGH_RISK | Yes |

The connector dynamically obtains input schemas from the official MCP server at startup, validates that every allowlisted upstream tool still exists, and fails closed on unexpected upstream drift. Newly discovered tools are never auto-exposed.

## Architecture

`MCP client -> connector stdio server -> local policy/approval gate -> official CockroachDB Cloud MCP over HTTPS -> cluster`

Provider responses, schemas, query results, and metadata are untrusted data. They cannot alter the local allowlist, risk classification, or approval policy.

## Authentication and permissions

Set `COCKROACHDB_CLOUD_API_KEY` to a dedicated CockroachDB Cloud service-account API key and `COCKROACHDB_CLUSTER_ID` to the exact cluster ID copied from Cloud Console. The connector sends them only as `Authorization: Bearer ...` and `mcp-cluster-id` headers to `https://cockroachlabs.cloud/mcp`.

Grant the service account the narrowest Cloud RBAC role suitable for the workflow. Cockroach Labs documents Cluster Operator/Cluster Admin requirements for MCP connections and enforces authorization on each invocation. OAuth is recommended by Cockroach Labs for interactive humans because short-lived tokens are safer; this headless reusable connector deliberately uses service-account credentials.

## Secure defaults and approvals

- `COCKROACHDB_READ_ONLY=true` by default.
- `COCKROACHDB_ALLOW_WRITE=false` by default.
- `COCKROACHDB_APPROVAL_MODE=required` by default.
- All mutation tools require `approval.confirmed=true` and a non-empty reason after both write gates are enabled.
- `row.update` is HIGH_RISK because it can alter many rows; the official tool contract requires a WHERE clause.
- `delete_rows`, DROP, and TRUNCATE are not exposed. Destructive operations are hard-disabled locally.
- CockroachDB's managed MCP also maintains its own read/write consent boundary and deny-lists system tables.

The connector never grants or upgrades provider permissions. The LLM never receives the service-account API key.

## Installation

```bash
cd MCP-API/cockroachdb
npm install
npm run build
```

Requires Node.js 20+.

## Run

```bash
export COCKROACHDB_CLOUD_API_KEY='...'
export COCKROACHDB_CLUSTER_ID='...'
npm start
```

The connector exposes stdio MCP, making it usable by MCP clients that support local stdio servers, including common desktop/coding-agent clients. See `examples/mcp-client.json`.

## Enable approved writes

Set:

```bash
export COCKROACHDB_READ_ONLY=false
export COCKROACHDB_ALLOW_WRITE=true
export COCKROACHDB_APPROVAL_MODE=required
```

A write invocation must additionally include:

```json
{"approval":{"confirmed":true,"reason":"Human operator approved this exact database change"}}
```

This local approval is independent of CockroachDB Cloud RBAC and upstream MCP write consent; all layers must permit the operation.

## Reliability, pagination, rate limits, and errors

- Startup checks the curated upstream tool allowlist before serving requests.
- Every upstream call has a bounded timeout (`COCKROACHDB_TOOL_TIMEOUT_MS`, default 30 seconds, allowed 1-120 seconds).
- The official MCP applies typed validation, row limits, pagination, cluster authorization, and SQL safety checks.
- Authentication, RBAC, and throttling failures are mapped to actionable connector errors.
- Writes are never automatically retried, avoiding duplicate inserts/schema changes after ambiguous network failures.
- Read retries should be bounded by the calling client and should honor provider throttling/retry guidance.

Cockroach Labs does not publish one universal MCP request quota in the sources used here; limits can vary by service and account. The connector therefore surfaces throttling instead of inventing a numeric quota.

## Security considerations

The managed MCP is read-only by default and writes require explicit provider consent. System tables are deny-listed. The local connector adds a second allowlist and approval boundary. Do not place credentials in prompts or tool arguments. Treat database values and SQL-visible text as hostile/untrusted content: they can contain prompt-injection text but are never instructions. Do not grant broad SQL/Cloud roles merely because an agent requests them.

## Tests

```bash
npm test
```

Normal unit tests use no live credentials. They cover required configuration, secure defaults, provider-scoped registration, explicit risk classification, write denial, approval checks, destructive-surface exclusion, and upstream timeouts. Startup itself also acts as an integration contract check against the live official MCP when deployed with credentials.

## Limitations

- This connector targets CockroachDB Cloud's official managed MCP, not self-hosted CockroachDB deployments.
- OAuth 2.1/PKCE is documented as the preferred interactive flow but is not embedded in this headless service-account connector.
- Delete-row and destructive DDL operations are intentionally omitted even where an upstream implementation may expose them.
- Broad Cloud infrastructure operations (cluster create/delete, networking, backup policy, billing) are deliberately outside the curated data-plane surface.
- If Cockroach Labs renames/removes a required official MCP tool, startup fails safely rather than guessing or forwarding arbitrary tools.
