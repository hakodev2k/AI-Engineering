# Chroma MCP/API Connector

Reusable MCP adapter for Chroma vector databases. The connector exposes a small stable, provider-scoped tool surface while delegating implemented database operations to Chroma's official `chroma-core/chroma-mcp` server over local stdio.

## Transport strategy

The researched official Chroma MCP implementation supports cloud, self-hosted HTTP, persistent local, and ephemeral clients and already exposes all capabilities selected here. This connector therefore uses **official MCP only** for the implemented surface; no REST fallback is required. It does not auto-discover or trust arbitrary upstream MCP tools: `src/upstream.ts` contains a fixed allowlist.

Official sources:

- Chroma MCP repository: `https://github.com/chroma-core/chroma-mcp`
- Chroma documentation: `https://docs.trychroma.com/`
- Chroma Cloud: `https://www.trychroma.com/`

The upstream implementation accepts `CHROMA_CLIENT_TYPE` modes `cloud`, `http`, `persistent`, and `ephemeral`. In cloud mode it requires tenant, database, and API key. In HTTP mode it connects to an operator-selected Chroma server. The connector never exposes those credentials as MCP inputs or results.

## Architecture

```text
MCP client / agent
  -> this Node.js MCP server (stdio)
     -> validation + risk/approval policy
        -> fixed upstream-tool allowlist
           -> official chroma-mcp process (stdio)
              -> Chroma Cloud / self-hosted Chroma / local Chroma
```

Provider-returned documents, metadata, distances, and error text are treated as untrusted data, never as instructions that can change connector permissions.

## Requirements

- Node.js 20+
- npm
- Python environment capable of running the official Chroma MCP package
- `uvx` on `PATH` for the default launcher (`uvx chroma-mcp`), or an explicitly configured equivalent command
- Chroma credentials/configuration appropriate to the selected client type

Install and build:

```bash
npm install
npm run build
```

Run the connector over stdio:

```bash
npm start
```

## Configuration and authentication

Copy `.env.example` values into the process environment. Do not commit a populated `.env` file.

`CHROMA_CLIENT_TYPE` is intentionally required so an operator must explicitly choose where data is stored.

### Chroma Cloud

Set:

```text
CHROMA_CLIENT_TYPE=cloud
CHROMA_TENANT=...
CHROMA_DATABASE=...
CHROMA_API_KEY=...
```

The official upstream MCP server uses the Chroma Cloud API key internally. This adapter forwards it only to the upstream process environment and never passes it through an MCP tool argument.

### Self-hosted HTTP

Set:

```text
CHROMA_CLIENT_TYPE=http
CHROMA_HOST=chroma.example.internal
CHROMA_PORT=8000
CHROMA_SSL=true
CHROMA_CUSTOM_AUTH_CREDENTIALS=...
```

Use a trusted host controlled by the deployment. Host configuration is process-level operator configuration, not a model-controlled tool parameter, which avoids an arbitrary-URL/SSRF tool surface.

### Persistent local

Set `CHROMA_CLIENT_TYPE=persistent` and `CHROMA_DATA_DIR`.

### Ephemeral local

Set `CHROMA_CLIENT_TYPE=ephemeral`. Data is intentionally non-persistent.

## Tool surface

| Tool | Upstream official MCP tool | Risk | Approval |
| --- | --- | --- | --- |
| `chroma.collection.list` | `chroma_list_collections` | READ | No |
| `chroma.collection.get` | `chroma_get_collection_info` | READ | No |
| `chroma.collection.count` | `chroma_get_collection_count` | READ | No |
| `chroma.collection.peek` | `chroma_peek_collection` | READ | No |
| `chroma.document.query` | `chroma_query_documents` | READ | No |
| `chroma.document.get` | `chroma_get_documents` | READ | No |
| `chroma.collection.create` | `chroma_create_collection` | WRITE | Required by default |
| `chroma.collection.update` | `chroma_modify_collection` | WRITE | Required by default |
| `chroma.collection.fork` | `chroma_fork_collection` | WRITE | Required by default |
| `chroma.document.add` | `chroma_add_documents` | WRITE | Required by default |
| `chroma.document.update` | `chroma_update_documents` | WRITE | Required by default |
| `chroma.collection.delete` | `chroma_delete_collection` | DESTRUCTIVE | Always + feature enable |
| `chroma.document.delete` | `chroma_delete_documents` | DESTRUCTIVE | Always + feature enable |

The connector deliberately does not expose every function from the upstream package. In particular, it does not expose an arbitrary provider request tool or automatically surface tools added by future upstream releases.

## Permission and approval model

READ operations may execute automatically. WRITE operations require approval by default; an operator may set `CHROMA_REQUIRE_WRITE_APPROVAL=false` only after establishing an external authorization boundary. DESTRUCTIVE operations remain disabled unless `CHROMA_ENABLE_DESTRUCTIVE=true` and always require approval.

Approvals use an opaque 64-character HMAC-SHA256 token scoped to an operation and collection:

```text
HMAC_SHA256(CHROMA_APPROVAL_SECRET, "<tool-name>|<collection-name>")
```

The approval secret must be at least 32 characters and remains inside the connector. A separate trusted approval service or operator should issue `approvalId`; the model should never receive the secret. An approval for one operation or collection cannot authorize a different one.

## Validation and safety boundaries

- Collection names are restricted to a conservative 1-128 character allowlist.
- Read pagination is bounded to at most 500 results per call.
- Semantic query text count and result count are bounded.
- Document batch size defaults to 100 and is capped at 500 through `CHROMA_MAX_DOCUMENTS_PER_CALL`.
- IDs must be unique within one write call.
- Parallel arrays for documents, metadata, and embeddings must match ID count.
- Document text is capped at 1,000,000 characters per item by this adapter.
- Embedding dimensions and batch counts are bounded by input schemas.
- No tool accepts a raw URL, raw HTTP method, raw provider endpoint, shell command, or credential.

## Reliability, timeout, retries, and cancellation behavior

`CHROMA_UPSTREAM_TIMEOUT_MS` defaults to 20 seconds and is bounded between 1 and 120 seconds. A timed-out upstream client is closed so its subprocess is not silently reused after an uncertain request.

READ operations receive at most two retries after the initial attempt with bounded exponential delay. WRITE and DESTRUCTIVE operations are never retried automatically because an interrupted call can have an unknown outcome. Callers should re-read state before deciding whether a write needs a new approved attempt.

The official MCP/backend owns provider-specific throttling. This wrapper does not spin through pagination or issue hidden fan-out calls, so one external tool call maps to one upstream MCP call. Upstream rate-limit and quota failures are surfaced as tool errors; callers should honor provider guidance before retrying.

## Error handling

Configuration errors fail startup rather than silently falling back to another storage target. Validation and permission failures are not retried. Authentication failures require operator action. On transport failure the wrapper resets its upstream MCP session. Diagnostics should be written to stderr by the surrounding MCP runtime; stdout remains reserved for MCP framing.

## Credential isolation

The subprocess environment is deliberately filtered. Only minimal process-launch variables plus Chroma provider variables are forwarded. Connector policy settings such as `CHROMA_APPROVAL_SECRET`, destructive enablement, timeout configuration, and launcher configuration are not forwarded to the provider process.

Do not place credentials in prompts, tool arguments, examples, logs, or retrieved document metadata. Rotate a credential if it is ever exposed to a model transcript or Git history.

## Upstream MCP security

- The default command starts Chroma's official MCP package through `uvx`.
- The executable and arguments are operator-controlled configuration, never model input.
- Only 13 researched upstream Chroma tools are allowlisted.
- Newly discovered upstream tools are not trusted automatically.
- The adapter does not forward arbitrary credentials beyond Chroma-specific provider configuration.
- For production, pin and review a tested upstream package version according to your dependency policy rather than silently accepting upstream changes.

## Embedding functions

Collection creation exposes only embedding functions present in the researched official MCP mapping: `default`, `cohere`, `openai`, `jina`, `voyageai`, and `roboflow`. Some choices require additional provider credentials expected by the official Chroma package. Keep those credentials in process environment configuration; do not send them through tools.

## Testing

Normal unit tests require no live Chroma credentials:

```bash
npm test
npm run build
```

Tests cover configuration validation, credential isolation, approval scoping, destructive denial, input validation, and the fixed upstream allowlist. Before production use, separately validate the chosen Chroma deployment with a non-production database and least-privilege credentials.

## Example workflows

See `examples/workflows.md` for read/query, approved write, and destructive-operation examples.

## Limitations

- This adapter is a stdio MCP server; deploy a separate authenticated transport layer if remote MCP access is required.
- It does not expose Chroma functionality outside the fixed tool list even if a newer upstream server adds it.
- It does not implement direct REST fallback because the current official MCP supports the selected capabilities.
- Provider-specific account quotas, collection/database limits, embedding-provider quotas, and Chroma Cloud plan limits are external to this connector and may change.
- Approval IDs authorize the named operation for a collection, not an arbitrary raw provider request.
