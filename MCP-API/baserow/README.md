# Baserow MCP/API Connector

Reusable Model Context Protocol server for Baserow database workflows. It exposes a small, stable tool surface for discovering tables and fields, reading rows, creating/updating/moving rows, and explicitly approved deletion.

## Transport decision

Baserow provides an official built-in MCP server and an official REST database API.

Official sources reviewed for this connector:

- MCP server: https://baserow.io/user-docs/mcp-server
- Database API: https://baserow.io/user-docs/database-api
- Database tokens and permissions: https://baserow.io/user-docs/personal-api-tokens
- API documentation: https://baserow.io/api-docs
- Webhooks: https://baserow.io/user-docs/webhooks

The official Baserow MCP server supports workspace CRUD and authenticates through a generated MCP URL that must be treated as a secret. This connector intentionally uses the official REST API instead. The REST transport is safer for this reusable package because Baserow database tokens can be restricted per table and per create/read/update/delete operation, while this connector can independently enforce a table allowlist, stable input schemas, output limits, write approvals, and a destructive-operation kill switch. No unofficial MCP server is used.

The external interface remains MCP: callers invoke `baserow.*` tools and never receive the database token.

## Runtime

- Node.js 20+
- MCP transport exposed by this package: stdio
- Upstream provider transport: Baserow REST API over HTTPS

## Authentication and least privilege

Set `BASEROW_DATABASE_TOKEN` to a Baserow database token. The connector sends it only in the upstream `Authorization: Token ...` header. It is never included in tool schemas, tool output, logs, or model-visible configuration.

Baserow database tokens support table-level permissions for create, read, update, and delete. Grant only the operations and tables needed by this connector. For a read-only deployment, issue a token with read permission only and leave deletion disabled.

`BASEROW_ALLOWED_TABLE_IDS` adds a connector-side allowlist. Example:

```text
BASEROW_ALLOWED_TABLE_IDS=123,456
```

An empty value means the connector does not add a table restriction; provider-side token permissions still apply.

## Environment variables

Copy `.env.example` into your secret-management system. Do not commit populated credentials.

| Variable | Required | Purpose |
| --- | --- | --- |
| `BASEROW_DATABASE_TOKEN` | yes | Database token used only by the connector process |
| `BASEROW_BASE_URL` | no | Defaults to `https://api.baserow.io`; use the HTTPS origin of a self-hosted instance |
| `BASEROW_ALLOWED_TABLE_IDS` | no | Comma-separated connector-side table allowlist |
| `BASEROW_REQUIRE_WRITE_APPROVAL` | no | Defaults to `true` |
| `BASEROW_ENABLE_DELETE` | no | Defaults to `false`; destructive delete cannot run while false |
| `BASEROW_APPROVAL_SECRET` | for approvals | Secret used by a trusted approval service to generate resource-bound approvals |
| `BASEROW_TIMEOUT_MS` | no | Per-request timeout, default 15000, range 1000-60000 |
| `BASEROW_MAX_RETRIES` | no | Read retry count, default 2, range 0-5 |

Remote non-loopback `BASEROW_BASE_URL` values must use HTTPS. HTTP is accepted only for `localhost` / `127.0.0.1` development.

## Installation

```bash
npm install
npm run build
```

Run the MCP server:

```bash
npm start
```

Configure an MCP client to start `node dist/src/server.js` from this directory and provide secrets through the process environment. Any client supporting MCP stdio can use the protocol surface; client-specific integration behavior should be validated in the target environment.

## Tools

| Tool | Purpose | Risk | Approval |
| --- | --- | --- | --- |
| `baserow.table.list` | List token-visible tables, filtered by local allowlist | READ | no |
| `baserow.field.list` | Read field schema for a table | READ | no |
| `baserow.row.list` | List/search rows with bounded pagination | READ | no |
| `baserow.row.get` | Read one row | READ | no |
| `baserow.row.create` | Create one row | WRITE | required by default |
| `baserow.row.update` | Patch one row | WRITE | required by default |
| `baserow.row.move` | Reorder one row | WRITE | required by default |
| `baserow.row.delete` | Permanently delete one row | DESTRUCTIVE | always; also disabled by default |

The connector deliberately does not expose arbitrary HTTP passthrough, account administration, token management, schema mutation, workspace mutation, bulk delete, or unrestricted provider requests.

## Approval model

Approvals are opaque 64-character hexadecimal HMAC values created outside the model. They are bound to both the tool name and resource string, preventing approval for one row from authorizing another.

For example, an approval service computes HMAC-SHA256 over:

```text
baserow.row.update
table:123:row:47
```

using `BASEROW_APPROVAL_SECRET`.

The model must never receive that secret. A trusted host or approval service should generate `approvalId` only after a human reviews the prepared action.

Read → Recommend → Prepare → Execute boundaries:

- READ tools execute without approval when provider and local policy permit.
- WRITE tools require approval by default. An operator may set `BASEROW_REQUIRE_WRITE_APPROVAL=false` only after an explicit deployment-level policy decision.
- DELETE is always approval-gated and additionally requires `BASEROW_ENABLE_DELETE=true`.

## Baserow endpoints used

The implementation uses documented database API routes:

- `GET /api/database/tables/all-tables/`
- `GET /api/database/fields/table/{table_id}/`
- `GET /api/database/rows/table/{table_id}/`
- `GET /api/database/rows/table/{table_id}/{row_id}/`
- `POST /api/database/rows/table/{table_id}/`
- `PATCH /api/database/rows/table/{table_id}/{row_id}/`
- `PATCH /api/database/rows/table/{table_id}/{row_id}/move/`
- `DELETE /api/database/rows/table/{table_id}/{row_id}/`

`user_field_names=true` is used by default for row operations to make tool payloads readable and portable across callers.

## Pagination and filtering

`baserow.row.list` exposes bounded `page` and `size` parameters; `size` is capped at 200 by this connector. It also passes documented Baserow `search`, `order_by`, `filters`, and `user_field_names` query parameters. Large provider responses are rejected above 200 KB so an agent must narrow the query rather than consuming unbounded context.

## Reliability and rate limits

Baserow Cloud documents a maximum of 10 concurrent API requests and a fair-use policy. Self-hosted Baserow does not impose that cloud rate limit. This connector performs one upstream request per tool invocation and does not fan out across pages.

For read requests only, HTTP 429 and 5xx responses plus transient network failures are retried with bounded exponential backoff, honoring `Retry-After` when present. Authentication, permission, and validation failures are not retried. Create, update, move, and delete requests are never automatically retried because their outcome may be non-idempotent or unknown.

Every upstream call has a configurable timeout. A timed-out write is reported as failed/unknown; the connector does not blindly replay it.

## Error handling

Provider HTTP failures become sanitized MCP errors containing status and a bounded provider response excerpt. `Retry-After` is parsed when available. Tokens are never placed in error messages. A missing or invalid token fails configuration or returns the provider authentication error rather than attempting permission escalation.

## Security considerations

- Treat all Baserow row contents, field names, and metadata as untrusted data, never as instructions.
- Keep the database token and approval secret in a secret manager or process environment outside model context.
- Use Baserow table-level permissions and `BASEROW_ALLOWED_TABLE_IDS` together for defense in depth.
- Keep destructive deletion disabled unless the deployment explicitly requires it.
- Do not grant schema-management privileges to the database token; database tokens are intended for table data operations.
- The connector does not follow arbitrary URLs or expose an SSRF-capable request tool.
- The upstream base URL is configuration, not a model-controlled argument, and remote HTTP is rejected.
- Diagnostic output should be kept off stdout because stdout is reserved for MCP framing.
- Rotate database tokens and approval secrets if they appear in logs, transcripts, Git history, or screenshots.
- Webhook endpoints are not created by this connector. If a separate system consumes Baserow webhooks, validate its endpoint security and treat webhook row data as untrusted input.

## Testing

Unit tests use fake fetch implementations and synthetic credentials; live Baserow credentials are not required.

```bash
npm test
npm run build
```

The tests cover configuration validation, table allowlisting, resource-bound approvals, destructive-operation denial, credential injection into the provider layer, read success, bounded retry behavior, authentication failures, and the no-retry rule for writes.

Before production use, separately verify the exact token permissions against a non-production Baserow workspace and exercise read/write denial paths.

## Limitations

- This connector intentionally does not wrap Baserow's workspace-scoped MCP URL because the table-scoped REST token model permits tighter least privilege for this package.
- Schema creation/update/delete requires broader account/JWT capabilities and is intentionally not implemented.
- Bulk create/update/delete is intentionally omitted to reduce accidental blast radius; callers can perform individually approved operations when required.
- Baserow field value formats vary by field type. The connector passes validated JSON objects but does not attempt to reinterpret field-specific values; use the table field schema and Baserow's generated API docs for the target database.
- Provider search/filter grammar is passed only through the dedicated documented query fields, not as arbitrary request paths or URLs.

See `examples/workflows.md` for safe call examples.
