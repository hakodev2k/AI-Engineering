# Elasticsearch MCP/API Connector

Reusable Model Context Protocol connector for Elasticsearch. It exposes a stable, provider-scoped tool surface for discovery, search, analytics, document reads, approved writes, and explicitly approved deletion.

## Transport strategy

The connector prefers Elastic's official Agent Builder MCP server for capabilities that map cleanly to trusted built-in tools, and falls back to the official Elasticsearch REST API when MCP is unavailable, unsupported, misconfigured, or its discovered schema cannot be safely mapped.

Official MCP support researched for this connector:

- Elastic Agent Builder MCP server: `https://www.elastic.co/docs/explore-analyze/ai-features/agent-builder/mcp-server`
- Built-in Agent Builder tools: `https://www.elastic.co/docs/explore-analyze/ai-features/agent-builder/tools/builtin-tools-reference`
- Agent Builder permissions: `https://www.elastic.co/docs/explore-analyze/ai-features/agent-builder/permissions`

Official REST references:

- Elasticsearch API documentation: `https://www.elastic.co/docs/api/doc/elasticsearch/`
- Authentication: `https://www.elastic.co/docs/api/doc/elasticsearch/authentication`
- Search API: `https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-search-2`
- API key guidance: `https://www.elastic.co/docs/deploy-manage/api-keys/elasticsearch-api-keys`
- REST API conventions and 429 backoff guidance: `https://www.elastic.co/docs/reference/elasticsearch/rest-apis/api-conventions`

Elastic documents Agent Builder MCP for Elasticsearch 9.2+ deployments and Serverless projects. Older deployments can still use this connector through REST. The connector does not depend on an unofficial MCP server.

## Implemented tools

| Tool | Purpose | Upstream | Risk | Approval |
|---|---|---|---|---|
| `elasticsearch.index.list` | Resolve index/alias/data-stream metadata | MCP preferred, REST fallback | READ | No |
| `elasticsearch.index.mapping` | Read mappings | MCP preferred, REST fallback | READ | No |
| `elasticsearch.document.get` | Read one document by ID | MCP preferred, REST fallback | READ | No |
| `elasticsearch.document.search` | Query DSL search | REST | READ | No |
| `elasticsearch.search.natural_language` | Natural-language search | MCP preferred, REST multi-match fallback | READ | No |
| `elasticsearch.esql.query` | ES|QL analytics | MCP preferred, REST fallback | READ | No |
| `elasticsearch.document.count` | Count documents matching Query DSL | REST | READ | No |
| `elasticsearch.document.create` | Create a document only if ID is unused | REST | WRITE | Yes |
| `elasticsearch.document.update` | Partial document update | REST | WRITE | Yes |
| `elasticsearch.document.delete` | Delete exactly one document by ID | REST | DESTRUCTIVE | Yes |

The external tool names do not expose arbitrary REST endpoints. Agent callers do not need to know which upstream transport handled a request.

## Architecture

```text
MCP client / AI agent
        |
        v
local MCP server (stdio)
        |
        +--> policy + validation + index allowlist
        |
        +--> Elastic Agent Builder MCP (preferred read capabilities)
        |
        `--> Elasticsearch REST API (fallback and writes)
```

Provider credentials remain inside the connector. They are never returned in tool output or injected into LLM prompts.

## Authentication

At least one Elasticsearch authentication method is required. Preference order is determined by which variables are configured:

1. API key: `ELASTICSEARCH_API_KEY`
2. Bearer token: `ELASTICSEARCH_BEARER_TOKEN`
3. Basic authentication: `ELASTICSEARCH_USERNAME` and `ELASTICSEARCH_PASSWORD`

API keys are recommended because Elasticsearch supports least-privilege role descriptors and index-scoped privileges.

For Agent Builder MCP, configure a separate Kibana/Elastic API key in `ELASTIC_KIBANA_API_KEY`. The upstream MCP endpoint is derived from `ELASTIC_KIBANA_URL` and optional `ELASTIC_MCP_SPACE`.

### Least privilege

For read-only tools, grant only the minimum required privileges for the target indices. Elastic documents `read` for querying data and `view_index_metadata` for tools that inspect index structure. Agent Builder's AI-powered query generation may additionally require `monitor_inference` depending on the configured model connector.

For writes, grant only the specific index privileges needed by the selected tool. Typical examples are `create_doc` for create-only indexing and `index`/`write` for updates. The delete tool requires `delete` or `write` on its target index.

Do not grant broad cluster privileges unless your use case independently requires them.

## Environment variables

Copy `.env.example` and configure secrets outside source control.

- `ELASTICSEARCH_URL` — Elasticsearch base URL, required.
- `ELASTICSEARCH_API_KEY` — encoded API key credential.
- `ELASTICSEARCH_BEARER_TOKEN` — bearer token alternative.
- `ELASTICSEARCH_USERNAME`, `ELASTICSEARCH_PASSWORD` — basic auth alternative.
- `ELASTIC_ALLOWED_INDICES` — comma-separated exact names or `*` wildcard patterns. Strongly recommended.
- `ELASTIC_APPROVAL_SECRET` — server-side HMAC secret used for write/destructive approval tokens.
- `ELASTIC_TIMEOUT_MS` — network timeout, default `30000`, bounded to 1s–300s.
- `ELASTIC_MAX_RETRIES` — retry count for retry-safe operations, default `3`, maximum `5`.
- `ELASTIC_PREFER_MCP` — defaults to `true`.
- `ELASTIC_KIBANA_URL` — Kibana base URL for official Agent Builder MCP.
- `ELASTIC_KIBANA_API_KEY` — API key used only by the upstream MCP transport.
- `ELASTIC_MCP_SPACE` — optional Kibana space name.

No real credentials belong in `.env.example`, README examples, tests, logs, or tool parameters.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
npm start
```

The connector uses MCP stdio transport. Configure your MCP-capable host to launch the built server process. Compatibility depends on the host supporting standard MCP stdio servers; no host-specific private protocol is required.

## Approval model

Read operations may execute without approval after normal validation and allowlist checks.

Write and destructive operations require an `approvalId`. The connector verifies it as an HMAC-SHA256 digest of the exact tool name using `ELASTIC_APPROVAL_SECRET`.

Conceptually:

```text
approvalId = HMAC_SHA256(ELASTIC_APPROVAL_SECRET, toolName)
```

The approval secret must stay outside the model/agent. An external human-approval layer or trusted orchestration service should generate the token after the user approves the exact action.

This enforces the sequence:

```text
Read -> Recommend -> Human approve -> Execute
```

Deletion is intentionally scoped to one document ID. There is no unrestricted delete-by-query, index deletion, security-management, or arbitrary-request tool.

## Validation and safety

- Index names are validated and checked against `ELASTIC_ALLOWED_INDICES`.
- Targets beginning with `_` and path-traversal-like targets are rejected.
- Tool inputs have bounded lengths and bounded result sizes where applicable.
- Query DSL is accepted only as the structured query body for specific scoped search/count tools; there is no arbitrary URL executor.
- Natural-language MCP calls use a fixed allowlist of official Agent Builder tool IDs. Newly discovered upstream tools are not automatically trusted.
- MCP tool schemas are introspected. If required parameters cannot be safely mapped, the connector falls back to REST instead of guessing.
- Retrieved Elasticsearch/MCP content is treated as untrusted data. Tool responses never change permissions or connector policy.
- Credentials stay in transport/auth layers and are not included in returned results.
- Write/delete calls are not blindly retried.

## Reliability and rate limits

Elasticsearch can return `429 Too Many Requests` when a cluster is overloaded. Elastic recommends delayed retry with exponential backoff. This connector applies bounded exponential backoff to retry-safe requests for HTTP `429`, `502`, `503`, and `504`.

`Retry-After` is honored when present. Retry count is bounded by `ELASTIC_MAX_RETRIES`.

Non-idempotent writes and destructive operations are invoked with retries disabled so a timeout or ambiguous provider response cannot cause silent duplicate side effects.

Pagination/result controls are exposed through bounded `size`/`from` parameters rather than unbounded scans. Search `size` is capped at 100 and natural-language fallback at 50.

## Error handling

The REST client maps non-success provider responses to `ElasticHttpError` including HTTP status and a truncated provider message. Authentication/authorization failures are not retried by status policy. Network failures on retry-safe requests are retried only within the configured bound.

Agent Builder MCP failures fail closed at the MCP layer and trigger the documented REST fallback for that capability. They do not expand permissions or call arbitrary MCP tools.

## Testing

Unit tests do not require live credentials.

```bash
npm test
npm run typecheck
```

Tests cover configuration validation, index allowlisting, approval enforcement, credential isolation in request headers, provider errors, bounded `429` retry, and disabled retries for destructive requests.

## Examples

See `examples/workflows.json` for discovery/search, approved update, and ES|QL analytics workflows. Example approval tokens are placeholders only.

## Limitations

- Official Agent Builder MCP requires a compatible Elastic deployment and appropriate Kibana/Elasticsearch privileges. REST fallback remains available independently.
- Natural-language REST fallback is deliberately simpler than Agent Builder: it uses `multi_match` across mapped fields and is not equivalent to Elastic's AI-powered `platform.core.search`.
- `elasticsearch.esql.query` requires the caller to declare the allowlisted index/pattern referenced by the query. This is a guardrail, not a full ES|QL parser.
- This connector intentionally omits index deletion, delete-by-query, role/security changes, snapshot restore, cluster rerouting, arbitrary scripts, and arbitrary HTTP passthrough because those operations need stronger domain-specific controls.
- Provider content can contain malicious or prompt-injection text; consumers must treat returned content as data rather than instructions.
