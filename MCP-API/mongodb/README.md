# MongoDB MCP Connector

Reusable, safety-oriented MCP connector for MongoDB deployments. It exposes a curated provider-scoped interface while delegating database operations to MongoDB's official MCP Server.

## Provider and transport

- Provider: MongoDB
- External transport: MCP over stdio
- Upstream: official `mongodb-mcp-server` 2.0.0
- Runtime: Node.js 22.12.0 or later
- REST fallback: not required for the implemented database capabilities because the official MongoDB MCP Server supports all selected operations directly

Official sources researched for this implementation:

- MongoDB MCP Server: https://www.mongodb.com/docs/mcp-server/
- Supported MCP tools: https://www.mongodb.com/docs/mcp-server/tools/
- MCP security guidance: https://www.mongodb.com/docs/mcp-server/security-best-practices/
- MCP release notes: https://www.mongodb.com/docs/mcp-server/local-mcp/release-notes/
- Atlas Administration API: https://www.mongodb.com/docs/atlas/api/atlas-admin-api-ref/
- Atlas API rate limits: https://www.mongodb.com/docs/atlas/api/api-rate-limit/

MongoDB MCP Server 2.0.0 was released on August 4, 2026 and requires an explicit connection ID for database operations. This wrapper uses `preconfigured` by default for the connection supplied through `MDB_MCP_CONNECTION_STRING`.

## Supported capabilities

| Tool | Upstream MCP tool | Risk | Approval |
| --- | --- | --- | --- |
| `mongodb.database.list` | `list-databases` | READ | No |
| `mongodb.collection.list` | `list-collections` | READ | No |
| `mongodb.collection.schema` | `collection-schema` | READ | No |
| `mongodb.index.list` | `collection-indexes` | READ | No |
| `mongodb.collection.storage_size` | `collection-storage-size` | READ | No |
| `mongodb.database.stats` | `db-stats` | READ | No |
| `mongodb.document.find` | `find` | READ | No |
| `mongodb.document.count` | `count` | READ | No |
| `mongodb.aggregate.run` | `aggregate` | READ | No |
| `mongodb.query.explain` | `explain` | READ | No |
| `mongodb.document.insert_many` | `insert-many` | WRITE | Yes |
| `mongodb.document.update_one` | `update-one` | WRITE | Yes |

Destructive tools such as delete-many, drop collection, drop database, drop index, and destructive Atlas operations are intentionally not exposed.

## Architecture

```text
AI/MCP client
  -> mongodb.* stable tools
  -> validation + namespace allowlists + approval policy
  -> local MCP client transport
  -> official mongodb-mcp-server 2.0.0
  -> MongoDB deployment
```

Credentials remain in environment variables consumed by the connector/upstream process. They are never included in MCP tool arguments or returned to the model.

## Authentication

For database tools, configure a MongoDB connection string:

```bash
export MDB_MCP_CONNECTION_STRING='mongodb+srv://...'
```

Use a database user with only the roles required by the selected tools. Read-only roles are recommended unless write tools are explicitly needed.

The official MongoDB MCP Server can also use Atlas service-account credentials for Atlas administration. Atlas service accounts use OAuth 2.0 client credentials and are preferred by MongoDB over legacy Atlas API keys. This connector does not expose Atlas administration tools in this version.

## Environment variables

Copy `.env.example` and configure only the settings you need.

- `MDB_MCP_CONNECTION_STRING`: preconfigured MongoDB connection used by the official MCP Server.
- `MONGODB_CONNECTOR_ALLOW_WRITES`: defaults to `false`.
- `MONGODB_CONNECTOR_APPROVAL_SECRET`: required when writes are enabled.
- `MONGODB_CONNECTOR_ALLOWED_DATABASES`: optional comma-separated database allowlist.
- `MONGODB_CONNECTOR_ALLOWED_COLLECTIONS`: optional comma-separated collection or `database.collection` allowlist.
- `MONGODB_CONNECTOR_MAX_DOCUMENTS`: result cap, default 50, maximum 100.
- `MONGODB_CONNECTOR_MAX_BYTES`: query response cap, default 1 MiB, maximum 16 MiB.
- `MONGODB_CONNECTOR_MAX_TIME_MS`: upstream query time limit, default 10 seconds.
- `MONGODB_CONNECTOR_INDEX_CHECK`: defaults to `true` so the upstream server rejects collection scans where supported.

The wrapper also forwards `MDB_MCP_API_CLIENT_ID` and `MDB_MCP_API_CLIENT_SECRET` if they are present, but no Atlas administration tool is exposed by this package.

## Installation

```bash
cd MCP-API/mongodb
npm install
npm run build
```

## Running

```bash
export MDB_MCP_CONNECTION_STRING='mongodb://127.0.0.1:27017/app'
npm start
```

The connector communicates with clients over stdio. It starts the official MongoDB MCP Server as a child MCP process and discovers its available tools before registering calls.

## Permission model

READ tools can execute automatically subject to namespace allowlists and query limits.

WRITE tools require both:

1. `MONGODB_CONNECTOR_ALLOW_WRITES=true`
2. A valid approval token in `approvalId`

The approval token is HMAC-SHA256 of the exact stable tool name using `MONGODB_CONNECTOR_APPROVAL_SECRET`.

Example generation outside the model/agent process:

```js
import crypto from 'node:crypto';
const token = crypto.createHmac('sha256', process.env.MONGODB_CONNECTOR_APPROVAL_SECRET)
  .update('mongodb.document.insert_many')
  .digest('hex');
```

The secret must remain outside prompts and tool arguments.

## Security controls

The connector applies defense in depth:

- Read-only mode is enabled by default.
- Destructive upstream operation categories/tools are disabled.
- MongoDB server-side JavaScript operators `$where`, `$function`, and `$accumulator` are blocked.
- Aggregation stages `$out` and `$merge` are blocked so read tools cannot become writes.
- Database and collection allowlists can constrain reachable namespaces.
- Query results are bounded by document and byte limits.
- Query execution has a configurable `maxTimeMS` limit.
- Index checking is enabled by default.
- Retrieved database content is treated as untrusted data and never changes connector policy.
- Credentials are injected through environment variables, not model-visible parameters.
- The wrapper verifies that every required upstream tool was actually advertised by the official MCP server before calling it.

MongoDB's own security guidance recommends read-only mode unless write operations are necessary and recommends environment variables rather than command-line arguments for secrets.

## Reliability and limits

The official MCP layer owns database connection handling, MongoDB error mapping, and query execution. This wrapper adds deterministic result limits and rejects unsafe operations before upstream execution.

For Atlas Administration API operations, MongoDB uses endpoint-specific token-bucket rate limits and may return `429` with `Retry-After`. Those API endpoints are not called by the current connector; this was checked as the official fallback path and is documented here so future Atlas capabilities do not assume a single global rate limit.

## Usage examples

See `examples/workflows.json` for reusable examples. Typical flows are:

```text
mongodb.database.list
  -> mongodb.collection.list
  -> mongodb.collection.schema
  -> mongodb.index.list
  -> mongodb.document.find
  -> mongodb.aggregate.run
```

For a write flow:

```text
inspect schema
  -> prepare documents/update
  -> obtain human approval token outside the model
  -> mongodb.document.insert_many or mongodb.document.update_one
```

## Testing

Unit tests require no live MongoDB credentials:

```bash
npm test
npm run typecheck
```

Tests cover safe defaults, write configuration, namespace allowlists, approval enforcement, and dangerous MongoDB operator rejection. Live integration testing is intentionally separate because normal tests must not require production credentials.

## Compatibility

The package exposes a standard stdio MCP server and is suitable for MCP clients that can launch a local command, including common IDE/agent clients. Client-specific configuration syntax varies; no compatibility is claimed for clients that cannot use stdio MCP servers.

## Limitations

- A preconfigured `MDB_MCP_CONNECTION_STRING` is required; the wrapper intentionally does not expose the upstream `connect` tool because passing arbitrary connection strings through an agent tool can leak credentials or expand access.
- Atlas cluster-management tools are not exposed in this version even though the official MongoDB MCP Server supports them.
- Destructive operations are intentionally omitted rather than merely hidden behind approval.
- `mongodb.aggregate.run` is read-only by policy and rejects `$out` and `$merge`.
- The wrapper pins MongoDB MCP Server 2.0.0 so upstream tool contracts do not silently change between installs; upgrades should be reviewed against MongoDB release notes first.
