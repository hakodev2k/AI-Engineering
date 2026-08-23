# Pinecone MCP Connector

Reusable MCP server for Pinecone vector indexes using Pinecone's official TypeScript SDK.

## Transport

This connector uses the official `@pinecone-database/pinecone` SDK. No official Pinecone MCP server was identified during implementation, so SDK transport is used directly rather than depending on an unofficial MCP implementation.

Official references:
- Pinecone TypeScript SDK: https://sdk.pinecone.io/typescript/
- Pinecone API/SDK docs: https://docs.pinecone.io/

## Capabilities

Implemented tools:
- `pinecone.index.list` — READ
- `pinecone.index.get` — READ
- `pinecone.index.stats` — READ
- `pinecone.namespace.list` — READ
- `pinecone.record.fetch` — READ
- `pinecone.record.search` — READ
- `pinecone.record.list` — READ
- `pinecone.record.upsert` — WRITE, approval required
- `pinecone.record.update` — WRITE, approval required
- `pinecone.record.delete` — DESTRUCTIVE, approval required

The connector intentionally does not expose unrestricted arbitrary API requests, index deletion, namespace-wide deletion, billing operations, or project/API-key administration.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> validation / allowlists / approval policy
  -> official Pinecone TypeScript SDK
  -> Pinecone control and data planes
```

Provider data is treated as untrusted content. Credentials never enter tool arguments or MCP output.

## Authentication

Set `PINECONE_API_KEY` to a Pinecone API key with only the access required by the target indexes. The key remains inside the connector process.

Environment variables:

```text
PINECONE_API_KEY=
PINECONE_ALLOWED_INDEXES=
PINECONE_ALLOWED_NAMESPACES=
PINECONE_APPROVAL_SECRET=
PINECONE_TIMEOUT_MS=15000
```

`PINECONE_ALLOWED_INDEXES` and `PINECONE_ALLOWED_NAMESPACES` are comma-separated allowlists. Empty allowlists mean the API key's accessible resources are not further restricted by the connector, so production deployments should set them explicitly.

## Permissions and approval

READ tools can run without approval after allowlist checks.

WRITE and DESTRUCTIVE tools require `approvalId`. The expected value is an HMAC-SHA256 hex digest of the exact tool name using `PINECONE_APPROVAL_SECRET`.

Example generation outside the LLM boundary:

```js
crypto.createHmac('sha256', process.env.PINECONE_APPROVAL_SECRET)
  .update('pinecone.record.upsert')
  .digest('hex')
```

Do not place the approval secret or Pinecone API key into prompts.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
```

## Running

```bash
export PINECONE_API_KEY='...'
export PINECONE_ALLOWED_INDEXES='docs-index'
export PINECONE_ALLOWED_NAMESPACES='prod,staging'
export PINECONE_APPROVAL_SECRET='...'
npm start
```

Configure the resulting process as a standard stdio MCP server in a compatible client.

## Tool behavior

### Search

`pinecone.record.search` performs vector similarity query with bounded `topK` (1-100). Vector dimensions must match the target index. Optional metadata filters are forwarded to Pinecone.

### Pagination

`pinecone.record.list` accepts `paginationToken` and returns the SDK response, allowing callers to continue pagination without the connector automatically walking unbounded result sets.

### Upsert/update

Writes are bounded to at most 100 records per MCP call. Upsert replaces values for an existing ID according to Pinecone semantics. Update requires at least vector values or metadata.

### Delete

`pinecone.record.delete` only deletes explicitly supplied IDs and is limited to 100 IDs per call. Namespace-wide and index-wide destructive operations are deliberately not exposed.

## Reliability

Each SDK call is wrapped in a connector-side timeout. Pinecone SDK/provider errors are returned as MCP tool failures. The connector does not blindly retry writes or destructive calls, avoiding duplicate or unintended mutations. Provider-side throttling and rate-limit behavior remain authoritative.

For high-volume ingestion, prefer Pinecone's documented bulk/import facilities rather than repeatedly invoking the MCP upsert tool.

## Rate limits

Pinecone limits depend on operation and service configuration. This connector bounds result sizes and write batches to reduce accidental high request volume. Consult current Pinecone limits documentation for the deployed project and index type.

## Security considerations

- API keys are read only from process environment.
- Index and namespace allowlists provide defense in depth.
- All writes require explicit HMAC approval.
- Deletion is classified DESTRUCTIVE and only supports explicit IDs.
- Inputs are schema validated and vector sizes are bounded.
- No arbitrary URL/request tool exists, reducing SSRF risk.
- Retrieved metadata/content is data, never connector instructions.
- The server does not log credentials.

## Testing

```bash
npm test
npm run typecheck
```

Unit tests use synthetic credentials and do not require a live Pinecone account. They cover authentication configuration, allowlist denial, write approval, and connector timeout behavior.

## Examples

See `examples/workflows.json` for read/search and approved maintenance workflows with expected permission classifications.

## Limitations

- Vector search requires callers to provide a vector with the correct index dimension.
- Integrated-embedding text search/upsert is not exposed in this initial connector because vector operations provide a stable provider-agnostic contract.
- Index creation/deletion, backups, imports, inference administration, API-key administration, and project/billing controls are intentionally excluded.
- Normal unit tests do not verify live provider credentials or live service limits.
