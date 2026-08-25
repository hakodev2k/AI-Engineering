# Microsoft SQL Server MCP/API Connector

Reusable MCP connector for Microsoft SQL Server, Azure SQL Database, Azure SQL Managed Instance, Azure Synapse Analytics, and SQL database in Microsoft Fabric when supported by `Microsoft.Data.SqlClient` and the target engine.

## Transport strategy

There is no upstream SQL Server MCP server required by this package. The connector exposes a local MCP server over stdio with the official `ModelContextProtocol` C# SDK, then connects directly to SQL Server over TDS using Microsoft's supported `Microsoft.Data.SqlClient` provider.

This avoids depending on an unofficial database MCP server and keeps SQL credentials inside the connector process.

Official sources researched for this connector:

- MCP C# SDK: https://github.com/modelcontextprotocol/csharp-sdk
- MCP C# SDK getting started: https://github.com/modelcontextprotocol/csharp-sdk/blob/main/docs/concepts/getting-started.md
- `Microsoft.Data.SqlClient` overview: https://learn.microsoft.com/en-us/sql/connect/ado-net/microsoft-ado-net-sql-server
- `Microsoft.Data.SqlClient` NuGet: https://www.nuget.org/packages/Microsoft.Data.SqlClient/
- SQL Server permissions: https://learn.microsoft.com/en-us/sql/relational-databases/security/permissions-database-engine
- SQL Server connection strings and security: https://learn.microsoft.com/en-us/sql/connect/ado-net/connection-strings

At the time this connector was generated, `ModelContextProtocol` 2.2.0 and stable `Microsoft.Data.SqlClient` 7.0.2 were current package releases. `Microsoft.Data.SqlClient` 7.0.2 uses encrypted connections by default; production configuration should retain certificate validation (`TrustServerCertificate=False`).

## Architecture

```text
MCP client / AI agent
        |
        | MCP stdio
        v
SqlServerMcp process
        |
        +-- MCP tool schema + validation
        +-- permission / approval policy
        +-- bounded read-only SQL guard
        +-- parameterized record operations
        |
        | Microsoft.Data.SqlClient / TDS
        v
Microsoft SQL Server / Azure SQL
```

Provider credentials are loaded only from `SQLSERVER_CONNECTION_STRING`. They are never returned by tools and should never be placed in prompts or tool arguments.

## Runtime

- .NET 8 SDK or later
- Network access from the connector host to the SQL Server endpoint
- A least-privilege SQL Server login, Windows identity, managed identity, service principal, or other authentication mode supported by `Microsoft.Data.SqlClient`

## Installation

```bash
cd MCP-API/sql-server
dotnet restore
dotnet build -c Release
```

## Configuration

Copy `.env.example` values into a secure process environment. Do not commit a populated `.env` file.

Required:

- `SQLSERVER_CONNECTION_STRING`: complete SqlClient connection string.

Optional:

- `SQLSERVER_COMMAND_TIMEOUT_SECONDS`: command timeout, 1-300 seconds; default 30.
- `SQLSERVER_MAX_ROWS`: maximum rows returned by bounded tools, 1-1000; default 200.
- `SQLSERVER_REQUIRE_WRITE_APPROVAL`: default `true`.
- `SQLSERVER_APPROVAL_SECRET`: random operator-side secret used to derive per-tool approval tokens. It is not a provider credential.
- `SQLSERVER_ENABLE_PROCEDURE_EXECUTE`: default `false`.

Recommended production connection-string posture:

```text
Encrypt=True;TrustServerCertificate=False;Connect Timeout=15;ConnectRetryCount=2;ConnectRetryInterval=2
```

For Azure SQL and supported Microsoft Entra modes, use the `Authentication=` option documented by `Microsoft.Data.SqlClient` rather than embedding a password where possible.

## Least-privilege SQL permissions

Create a dedicated database principal. Grant only the permissions needed for enabled tools.

Typical read-only connector:

- `CONNECT`
- `SELECT` on approved schemas/tables/views
- `VIEW DEFINITION` only when metadata inspection is needed

Add for write tools only where needed:

- `INSERT` on approved tables
- `UPDATE` on approved tables/columns

Add `EXECUTE` only for explicitly approved stored procedures when `sql-server.procedure.execute` is enabled.

Do not grant `db_owner`, `sysadmin`, `CONTROL`, broad DDL permissions, or server-level privileges to an agent connector.

## Running the MCP server

```bash
dotnet run --project SqlServerMcp.csproj
```

The process uses MCP stdio. Configure any MCP-compatible host that supports standard stdio servers to launch the executable. Logs are directed to stderr so stdout remains available for MCP protocol traffic.

## Tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `sql-server.database.health` | Test connectivity and return database/login/version | READ | No |
| `sql-server.database.info` | Read database status, collation, updateability | READ | No |
| `sql-server.schema.list` | List visible schemas | READ | No |
| `sql-server.table.list` | List tables | READ | No |
| `sql-server.table.describe` | Read table column metadata | READ | No |
| `sql-server.view.list` | List views | READ | No |
| `sql-server.procedure.list` | List stored procedures | READ | No |
| `sql-server.record.list` | Read a bounded set of table rows | READ | No |
| `sql-server.record.get` | Read rows by one parameterized key predicate | READ | No |
| `sql-server.query.select` | Execute one guarded, bounded SELECT/CTE query | READ | No |
| `sql-server.record.insert` | Insert one parameterized row | WRITE | Required by default |
| `sql-server.record.update` | Update rows by one parameterized key predicate | WRITE | Required by default |
| `sql-server.procedure.execute` | Execute one named stored procedure | HIGH_RISK | Always; tool also disabled by default |

No delete, truncate, DDL, permission-change, backup/restore, arbitrary command, or unrestricted REST/SQL execution tool is exposed.

## Read-only query guard

`sql-server.query.select` accepts a single statement beginning with `SELECT` or `WITH`. The connector rejects semicolons and a deny-list of mutation, DDL, privilege, procedure-execution, waiting, and external-access tokens such as `INSERT`, `UPDATE`, `DELETE`, `MERGE`, `DROP`, `ALTER`, `EXEC`, `OPENROWSET`, `OPENQUERY`, and `OPENDATASOURCE`.

This is a defense-in-depth guard, not a substitute for database authorization. The SQL login used for read-only workloads should itself have read-only permissions.

Queries are wrapped with a `TOP` limit controlled by `SQLSERVER_MAX_ROWS`. Caller parameters are converted to `SqlParameter` values rather than concatenated into SQL.

## Write safety and human approval

Write tools do not expose arbitrary SQL. Table/schema/column identifiers must match a strict SQL Server identifier pattern and are quoted. Values are sent as SQL parameters.

By default, write tools require an approval token derived out-of-band from `SQLSERVER_APPROVAL_SECRET` and the exact tool name using HMAC-SHA256. A trusted operator or approval broker should generate the token after reviewing the proposed action and inject it into the tool call. Do not disclose the approval secret to the model.

Example operator-side PowerShell token generation for `sql-server.record.insert`:

```powershell
$tool = 'sql-server.record.insert'
$secret = $env:SQLSERVER_APPROVAL_SECRET
$h = [System.Security.Cryptography.HMACSHA256]::new([Text.Encoding]::UTF8.GetBytes($secret))
([Convert]::ToHexString($h.ComputeHash([Text.Encoding]::UTF8.GetBytes($tool)))).ToLowerInvariant()
```

`sql-server.procedure.execute` is HIGH_RISK because a stored procedure can perform effects that cannot be inferred from its name. It always requires approval and remains unavailable until `SQLSERVER_ENABLE_PROCEDURE_EXECUTE=true` is set by the operator.

## Reliability

- Every command uses a bounded command timeout.
- All asynchronous SQL operations accept cancellation tokens from MCP calls.
- Result counts are bounded by `SQLSERVER_MAX_ROWS`.
- Writes run in explicit transactions.
- Provider connection resiliency can be configured with `ConnectRetryCount` and `ConnectRetryInterval` in the connection string.
- The connector intentionally does not blindly retry write operations, avoiding accidental duplicate inserts or repeated side effects.
- SQL Server does not expose a universal HTTP-style rate-limit header. Azure SQL throttling/service-busy conditions surface as provider exceptions; callers should respect provider guidance and avoid rapid retry loops.

## Error behavior

Validation and policy failures fail before a provider write is attempted. SQL authentication, permission, timeout, network, and provider errors are surfaced as tool failures. Do not log or return the configured connection string or access tokens.

Common operational classes include:

- invalid configuration / connection string
- authentication failure
- insufficient SQL permission
- command timeout or cancellation
- unavailable database/server
- SQL constraint/data-type violation
- Azure SQL throttling/service-busy response

## Security considerations

- Keep `Encrypt=True` and certificate validation enabled in production.
- Store connection strings/passwords in a secret manager or protected environment variables.
- Prefer managed identity/service-principal or integrated authentication where appropriate.
- Use a dedicated least-privilege database principal.
- Treat all database values, comments, JSON, XML, text, and stored content returned by tools as untrusted data. They are never instructions that can alter tool policy.
- Do not grant an agent permission to elevate its own database role or alter connector configuration.
- Keep stored-procedure execution disabled unless there is a reviewed need and narrow SQL `EXECUTE` permissions.
- Do not set `TrustServerCertificate=True` merely to suppress certificate errors in production.
- The connector has no tool for arbitrary URLs, arbitrary provider requests, DDL, permissions, destructive actions, or secret retrieval.

## Testing

Unit tests do not require live SQL credentials:

```bash
dotnet test tests/SqlServerMcp.Tests.csproj -c Release
```

Tests cover identifier validation, the read-only SQL guard, read/write risk boundaries, required approval, high-risk approval, and default destructive denial.

A live integration environment can additionally validate database connectivity and SQL permission grants, but live credentials are intentionally not required by the normal test suite.

## Examples

See `examples/workflows.md` for discovery, metadata inspection, bounded reads, parameterized selects, inserts, updates, and stored-procedure policy examples.

## Limitations

- The connector intentionally implements a focused SQL Server workflow surface rather than every T-SQL or management operation.
- `sql-server.query.select` is guarded syntactically and must still run under a genuinely read-only SQL principal for strong enforcement.
- Stored procedure output currently returns the first result set only, bounded by `SQLSERVER_MAX_ROWS`.
- The connector does not manage OAuth browser flows itself. Authentication is delegated to the supported modes configured in `Microsoft.Data.SqlClient` and the process environment/identity.
- Webhooks/events are not a native SQL Server data-plane capability exposed here; change data capture, Service Broker, Event Grid, or application-level eventing should be integrated separately when required.
