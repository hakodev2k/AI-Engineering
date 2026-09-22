# OpenSearch MCP/API Connector

Reusable, read-only MCP facade for OpenSearch. It connects to the official built-in OpenSearch MCP Streamable HTTP endpoint and exposes a fixed, provider-scoped tool contract. It intentionally does **not** expose `GenericOpenSearchApiTool`, dynamic upstream tools, writes, index deletion, security administration, or arbitrary REST requests.

## Upstream strategy

OpenSearch provides an official MCP server. OpenSearch 3.3 documents the stateless Streamable HTTP endpoint `/_plugins/_ml/mcp`; the official OpenSearch MCP Server also provides the core tools used here. Therefore all implemented capabilities use MCP rather than a REST fallback. No unofficial MCP dependency is used.

Official sources researched for this connector:

- OpenSearch MCP Server documentation: https://docs.opensearch.org/latest/ai-agent-integrations/mcp-server/index/
- MCP Streamable HTTP Server API: https://docs.opensearch.org/latest/ml-commons-plugin/api/mcp-server-apis/mcp-server/
- Official MCP server source: https://github.com/opensearch-project/opensearch-mcp-server-py
- OpenSearch API permissions: https://docs.opensearch.org/latest/security/access-control/api/

## Capabilities

| Connector tool | Upstream MCP tool | Risk | Approval |
|---|---|---|---|
| `opensearch.index.list` | `ListIndexTool` | READ | No |
| `opensearch.index.mapping` | `IndexMappingTool` | READ | No |
| `opensearch.document.search` | `SearchIndexTool` | READ | No |
| `opensearch.document.count` | `CountTool` | READ | No |
| `opensearch.cluster.health` | `ClusterHealthTool` | READ | No |
| `opensearch.shard.list` | `GetShardsTool` | READ | No |
| `opensearch.search.multi` | `MsearchTool` | READ | No |
| `opensearch.query.explain` | `ExplainTool` | READ | No |

The connector verifies that every required upstream tool is actually advertised at startup-on-first-call. Unexpected or newly discovered upstream tools are never forwarded automatically.

## Requirements and setup

Node.js 20+ and an OpenSearch cluster whose MCP server is enabled and has the core tools registered/available. For the in-cluster server, enable `plugins.ml_commons.mcp_server_enabled` according to the OpenSearch documentation.

```bash
npm install
cp .env.example .env
npm run build
npm start
```

The server uses MCP stdio toward its caller and Streamable HTTP toward OpenSearch.

## Authentication and least privilege

Set `OPENSEARCH_URL`. For Basic authentication set both `OPENSEARCH_USERNAME` and `OPENSEARCH_PASSWORD`; alternatively set `OPENSEARCH_BEARER_TOKEN`. Bearer auth wins if both modes are configured. Credentials remain in the connector transport layer and are never MCP tool parameters or returned to the model.

Grant the authenticated OpenSearch identity only the index/cluster read permissions needed by the eight tools. Do not use an administrative identity merely to run this connector. OpenSearch RBAC remains authoritative and a 401/403 is not bypassed or retried as another identity.

## Configuration

`OPENSEARCH_TIMEOUT_MS` defaults to 30000 and is bounded to 1–120 seconds. The base URL must use HTTP(S). The connector derives only the fixed `/_plugins/_ml/mcp` path, preventing tool-controlled SSRF destinations.

## Reliability and rate limiting

Connection and calls are bounded by the configured timeout. OpenSearch admission control, RBAC, and any deployment-specific throttling remain authoritative. The connector does not blindly retry requests; this avoids multiplying load during cluster pressure and avoids replay concerns. Search result size is capped at 100 and multi-search request bodies at 200 KB. Pagination is intentionally not synthesized: callers should issue explicit bounded queries rather than trigger hidden request loops.

## Security model

Provider data is untrusted. Search hits, mappings, errors, and MCP responses must never be interpreted as system instructions. Inputs are schema-validated. Arbitrary URL/API execution is absent. Dynamic MCP tool discovery is used only to verify the fixed allowlist; newly advertised tools are not exposed. No write, destructive, security-configuration, permission, or deployment operation is implemented.

The upstream OpenSearch MCP endpoint can expose powerful tools depending on cluster configuration. This facade narrows that surface to eight read operations. If a future capability modifies data, it must be added explicitly with a WRITE/HIGH_RISK/DESTRUCTIVE classification and an approval boundary.

## Error behavior

Configuration errors fail closed. Missing upstream tools fail closed instead of silently falling back to an arbitrary API. Network/MCP failures and timeouts are returned as tool errors by the MCP runtime. Authentication and authorization failures require operator action and are not retried.

## Testing

`npm test` builds TypeScript and runs credential-configuration, URL validation, timeout-boundary, and upstream-allowlist tests without live credentials. Live integration testing is optional and should use a non-production cluster with a least-privileged identity.

## Client compatibility

The connector itself serves standard MCP over stdio and can be used by MCP clients that support stdio process servers. Client-specific installation/configuration is intentionally not claimed beyond that protocol requirement.

## Limitations

Only the eight documented core read tools are exposed. `GenericOpenSearchApiTool`, write/index-management operations, search-relevance writes, memory writes/deletes, security APIs, and dynamically added tools are excluded. The connector targets the documented Streamable HTTP MCP endpoint and requires an OpenSearch deployment/version configured to provide it.
