# Grist MCP/API Connector

Reusable MCP connector for Grist. The connector exposes a stable, provider-scoped tool surface while routing supported operations to Grist's **official MCP server** over Streamable HTTP.

## Provider and purpose

Grist is a relational spreadsheet/database platform. This connector is intended for AI-agent workflows that discover sites and workspaces, inspect document schemas and records, query structured data, add or update rows, create documents/tables/columns, inspect attachments, and perform explicitly approved record deletion.

## Upstream strategy

### Official MCP

Primary transport: official Grist MCP server.

- Hosted endpoint: `https://docs.getgrist.com/api/mcp`
- Self-hosted full edition: `https://<your-grist-host>/api/mcp`
- Official MCP documentation: https://support.getgrist.com/mcp/
- Official limits documentation: https://support.getgrist.com/limits/
- Grist source: https://github.com/gristlabs/grist-core

The official server supports discovery, document querying, records, schema operations, pages/widgets, attachments, and other Grist operations. This package intentionally exposes only a reviewed allowlist rather than forwarding all upstream tools.

### REST/API fallback

No direct REST fallback is required for the capabilities implemented in this version because each exposed capability is supported by the official MCP server. Grist also has an official REST API, but adding a duplicate REST path would increase credential and behavior surface without improving these selected workflows.

## Authentication

This connector's non-interactive runtime uses a Grist API key and keeps it entirely inside the connector transport layer. The key is placed in the upstream HTTP `Authorization` header and is never returned by an MCP tool.

Grist's official MCP server also supports interactive OAuth/OIDC, service accounts, registered OAuth apps, and CIMD-capable clients. Those interactive flows are handled by compatible clients when connecting directly to Grist. This reusable stdio wrapper uses an API key so it can run unattended without exposing browser tokens to the model.

For Hosted Grist, create/use a Grist API key with access only to resources needed by the connector. For self-hosted deployments, service accounts can provide finer-grained isolation where enabled.

### Grist OAuth scopes

Official Grist MCP documentation currently describes these scopes:

- `openid`, `email`, `profile` — identity for interactive sign-in.
- `user.profile:read` — profile lookup.
- `offline_access` — persistent interactive sessions.
- `doc:read` — list/query documents, records, columns and attachments.
- `doc:write` — add/update/remove rows.
- `doc.schema:write` — create or alter tables/columns.
- `doc:download` — full document downloads; not used by the tools in this package.
- `doc:webhooks` — webhook management; not used by the tools in this package.

With API-key authentication, effective access is bounded by the Grist identity/resource permissions represented by the key.

## Environment variables

Copy `.env.example` and configure:

- `GRIST_MCP_URL` — official hosted endpoint by default; may point to a trusted self-hosted Grist MCP endpoint.
- `GRIST_API_KEY` — required; never commit it.
- `GRIST_ALLOW_WRITE` — enables WRITE tools; default `false`.
- `GRIST_ALLOW_HIGH_RISK` — enables schema-changing HIGH_RISK tools; default `false`.
- `GRIST_ALLOW_DESTRUCTIVE` — enables destructive record removal; default `false`.
- `GRIST_TIMEOUT_MS` — per-call timeout guard; default `15000`, clamped to a safe range.
- `GRIST_MAX_RETRIES` — bounded retries for idempotent READ calls; default `2`, maximum `5`.

The URL validator requires HTTPS for remote servers. Plain HTTP is allowed only for localhost development.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
GRIST_API_KEY='...' npm start
```

The connector serves MCP over stdio, making it suitable for MCP clients that can launch a local process. A client must support standard MCP stdio transport to use this package directly.

## Architecture

```text
Agent / MCP client
        |
        v
Stable Grist tool contract
        |
        v
Validation + permission + approval policy
        |
        v
Official Grist MCP client
        |
        v
Credential-isolated Streamable HTTP transport
        |
        v
Grist official MCP server
```

At connection time the upstream client calls `tools/list` and fails closed if any required allowlisted Grist tool is missing. Newly discovered upstream tools are not automatically trusted or exposed.

## Implemented tools

| Tool | Upstream official MCP tool | Risk | Approval |
|---|---|---:|---|
| `grist.org.list` | `grist_list_orgs` | READ | No |
| `grist.workspace.list` | `grist_list_workspaces` | READ | No |
| `grist.document.list` | `grist_list_docs` | READ | No |
| `grist.document.get` | `grist_get_doc_info` | READ | No |
| `grist.document.query` | `grist_query_document` | READ | No |
| `grist.table.list` | `grist_get_tables` | READ | No |
| `grist.table.columns.list` | `grist_get_table_columns` | READ | No |
| `grist.record.list` | `grist_list_records` | READ | No |
| `grist.record.create` | `grist_add_records` | WRITE | Yes |
| `grist.record.update` | `grist_update_records` | WRITE | Yes |
| `grist.record.delete` | `grist_remove_records` | DESTRUCTIVE | Strong explicit approval |
| `grist.document.create` | `grist_create_doc` | WRITE | Yes |
| `grist.table.create` | `grist_create_table` | HIGH_RISK | Yes |
| `grist.column.create` | `grist_add_table_column` | HIGH_RISK | Yes |
| `grist.attachment.list` | `grist_list_attachments` | READ | No |
| `grist.attachment.url.get` | `grist_get_attachment_url` | READ | No |

Tool inputs are provider-specific but intentionally narrow. There is no arbitrary `execute_request`, generic URL fetcher, or unrestricted upstream tool passthrough.

## Permission and approval model

`READ` operations may execute automatically after normal authentication and input validation.

`WRITE` operations require both `GRIST_ALLOW_WRITE=true` and an explicit `approval.approved=true` input. This keeps a distinction between preparing/recommending a mutation and executing it.

`HIGH_RISK` schema changes require `GRIST_ALLOW_HIGH_RISK=true` and explicit approval. Schema mutations can affect formulas, views and downstream automations, so they are not grouped with ordinary row writes.

`DESTRUCTIVE` operations are disabled by default. `grist.record.delete` requires `GRIST_ALLOW_DESTRUCTIVE=true` plus explicit approval. The connector never retries destructive calls automatically.

Environment flags cannot be changed by tool calls, retrieved document content, or upstream MCP responses, preventing an agent from silently escalating permissions.

## Reliability

- Bounded retries use exponential backoff only for READ operations.
- Authentication, authorization and validation failures are treated as permanent and are not retried.
- Mutating and destructive operations are never blindly replayed.
- `GRIST_TIMEOUT_MS` bounds connector waiting time for an upstream call.
- Upstream MCP reconnect behavior is bounded.
- Tool discovery is checked against a fixed allowlist before serving calls.
- Errors are normalized into `VALIDATION_ERROR`, `PERMISSION_DENIED`, or `UPSTREAM_ERROR` envelopes.

## Pagination and payload controls

`grist.record.list` constrains `limit` to 1–1000 records per call. Mutation arrays are limited to 500 entries. Grist separately documents a 1 MB request-body limit, so callers should use smaller batches when row payloads contain large values.

The connector deliberately avoids hidden pagination loops that could consume a large number of API/MCP calls. Agents can page/batch at the workflow level as needed.

## Current Grist service limits

According to Grist's official limits documentation at the time this connector was implemented:

- Free plans have a shared monthly API-call allowance and may be rate-limited to 5 requests/second/document.
- Paid plans have substantially higher per-document daily allowances.
- All plans have a concurrency limit of 10 authorized API requests per document; additional concurrent requests may receive HTTP 429.
- Individual API request bodies are limited to 1 MB.

Plan limits can change. Check https://support.getgrist.com/limits/ before designing high-volume automations.

## Security considerations

- Credentials remain in the authentication/transport layer and are not part of tool inputs or outputs.
- Retrieved Grist cells, formulas, attachments, labels and query results are untrusted data. They must never be interpreted as system instructions or permission changes.
- Only a fixed set of official upstream MCP tools is allowed.
- Remote MCP endpoints require HTTPS, reducing accidental credential leakage.
- Prefer a resource-scoped account/API key or service account rather than a broad administrator identity.
- Grist's own document access rules remain authoritative; connector flags can further reduce capabilities but cannot grant access Grist denies.
- Short-lived attachment URLs should be treated as sensitive and not logged unnecessarily.
- The connector does not forward arbitrary third-party URLs, limiting SSRF exposure.
- Do not log `GRIST_API_KEY` or raw HTTP headers.

## MCP-specific security

The connector does not trust dynamically discovered tools. It validates that the exact reviewed upstream names exist, and rejects any requested upstream name outside that allowlist. Unexpected permission requests, missing official capabilities, invalid credentials, or transport failures fail closed.

For self-hosted Grist, use the full edition when relying on the official MCP server and enable it according to Grist's official documentation. Restrict the trusted host and TLS configuration as you would for any credential-bearing internal service.

## Error handling

Typical categories:

- `VALIDATION_ERROR` — input violates the local Zod schema.
- `PERMISSION_DENIED` — a risk flag or explicit approval is missing.
- `UPSTREAM_ERROR` — official Grist MCP connection/call failed, a required upstream tool is missing, authentication failed, rate limiting occurred, or a timeout was reached.

Upstream authentication failures require operator action and are not retried.

## Testing

Unit tests require no live Grist credentials and use a fake upstream transport.

```bash
npm test
```

Coverage includes authentication configuration, HTTPS enforcement, tool registration, a read operation, input bounds, write denial, approval requirements, non-retryable writes, and destructive-operation gating.

A live smoke test can be run separately by setting `GRIST_API_KEY`; it is intentionally not required for normal unit tests.

## Usage examples

See `examples/workflows.md` for read, query, create, update and destructive workflows, including required permission levels and approval behavior.

## Limitations

- This wrapper currently authenticates upstream with an API key; it does not itself implement an interactive browser OAuth flow.
- It exposes a curated subset of Grist's official MCP tools. Pages/widgets, snapshots, table/column removal, table rename, user profile, access-rule reference, and webhook management are intentionally not exposed in this version.
- Full document download is not exposed even though Grist defines the `doc:download` OAuth scope.
- The connector returns official MCP tool results as data; exact upstream result fields are controlled by Grist and may evolve.
- A local stdio MCP client is required to launch this package. Hosted clients that only accept remote MCP URLs should connect directly to Grist's official MCP endpoint instead.
