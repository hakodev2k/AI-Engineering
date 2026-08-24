# Weaviate MCP/API Connector

Reusable MCP connector for Weaviate with a transport strategy that prefers Weaviate's official built-in MCP server and falls back to official REST/GraphQL APIs where needed.

## Provider

Weaviate vector database / AI database.

## Supported transport

- **MCP (preferred):** official built-in Weaviate MCP server, preview from Weaviate `1.37.1+`, exposed at `/v1/mcp` when `MCP_SERVER_ENABLED=true`.
- **REST:** official `/v1` API for schema, tenants, objects, readiness, and object mutation fallback.
- **GraphQL:** official `/v1/graphql` fallback for hybrid search.

The deprecated standalone `weaviate/mcp-server-weaviate` repository is not used as a runtime dependency. The connector targets the MCP server built into the main Weaviate binary.

## Official sources

- Weaviate built-in MCP server documentation: `https://docs.weaviate.io/weaviate/configuration/mcp-server`
- Official MCP repository notice: `https://github.com/weaviate/mcp-server-weaviate`
- Weaviate API references: `https://docs.weaviate.io/weaviate/api`
- Official TypeScript client repository: `https://github.com/weaviate/typescript-client`

## Capabilities

| MCP tool | Capability | Upstream | Risk | Approval |
|---|---|---|---|---|
| `weaviate.collection.list` | List collection schemas | REST | READ | No |
| `weaviate.collection.get` | Read collection config | MCP -> REST | READ | No |
| `weaviate.tenant.list` | List tenants | MCP -> REST | READ | No |
| `weaviate.object.get` | Get one object | REST | READ | No |
| `weaviate.object.list` | List objects with cursor | REST | READ | No |
| `weaviate.search.hybrid` | Hybrid semantic/keyword search | MCP -> GraphQL | READ | No |
| `weaviate.object.upsert` | Create/replace object | MCP -> REST | WRITE | Yes |
| `weaviate.object.delete` | Delete object | REST | DESTRUCTIVE | Yes |
| `weaviate.health.ready` | Readiness check | REST | READ | No |

The official built-in MCP tools currently targeted by this connector are `weaviate-collections-get-config`, `weaviate-tenants-list`, `weaviate-query-hybrid`, and `weaviate-objects-upsert`. Tool discovery is performed dynamically; unknown or absent tools are never trusted or invoked.

## Architecture

```text
MCP client
  -> connector MCP server (stdio)
      -> collection allowlist
      -> approval policy
      -> official Weaviate built-in MCP (/v1/mcp)
      -> REST/GraphQL fallback
      -> Weaviate
```

Third-party content returned from Weaviate is treated as untrusted data. It is serialized as tool output and never interpreted as connector configuration or permission instructions.

## Authentication

The connector forwards a Weaviate API key as `Authorization: Bearer <token>` when `WEAVIATE_API_KEY` is configured. The API key remains inside the connector process and is never returned in tool output.

For self-managed deployments, configure Weaviate authentication/RBAC according to the server documentation. The built-in MCP endpoint uses existing Weaviate authentication and RBAC.

## Least privilege

Grant only permissions required by enabled tools. For MCP-enabled deployments, Weaviate documents a distinct MCP permission in addition to object/schema permissions. Read-only installations should omit object mutation permissions and leave `WEAVIATE_APPROVAL_SECRET` unset.

## Environment variables

```text
WEAVIATE_URL=https://your-cluster.weaviate.cloud
WEAVIATE_API_KEY=
WEAVIATE_MCP_ENABLED=true
WEAVIATE_ALLOWED_COLLECTIONS=CollectionA,CollectionB
WEAVIATE_APPROVAL_SECRET=
WEAVIATE_TIMEOUT_MS=15000
WEAVIATE_MAX_RETRIES=3
```

`WEAVIATE_ALLOWED_COLLECTIONS` is optional. When set, every collection-scoped tool rejects access outside the allowlist.

## Installation

```bash
npm install
npm run build
```

Runtime: Node.js 20+.

## Running

```bash
npm start
```

The connector itself exposes MCP over stdio, so it can be registered with MCP-compatible clients that support stdio servers.

## Approval model

READ tools may execute automatically subject to the collection allowlist.

WRITE and DESTRUCTIVE tools require a 64-character HMAC-SHA256 approval token. The expected token is generated as:

```text
HMAC_SHA256(WEAVIATE_APPROVAL_SECRET, tool_name)
```

This keeps the approval boundary outside model-generated arguments. `weaviate.object.delete` is classified as DESTRUCTIVE and is never retried blindly.

## Reliability

REST requests use bounded retries for `429` and `5xx` responses, exponential backoff, `Retry-After` support, and request timeouts. Authentication/authorization/validation `4xx` responses are not retried. MCP requests have timeouts and safely fall back only to known official API implementations.

Object listing uses Weaviate's `after` UUID cursor and caps each request at 100 objects. Hybrid search caps results at 50. Vector arrays are capped at 65,536 numeric elements.

## Security

- No raw arbitrary-request tool is exposed.
- Collection and property names are syntactically validated.
- GraphQL fallback escapes user query text and validates selected property identifiers.
- Collection allowlists can constrain data access.
- Credentials are read only from environment variables.
- MCP tool names are explicitly allowlisted by connector code; newly discovered tools are not automatically exposed.
- Write and destructive actions require human approval.
- Provider content is untrusted data and cannot modify connector permissions.
- No secrets are logged or included in examples.

## Testing

```bash
npm test
npm run typecheck
```

Tests use mocked HTTP responses and require no live credentials. Coverage includes configuration, collection authorization, approval checks, rate-limit retry behavior, non-retryable 4xx behavior, and MCP JSON-RPC tool discovery.

## Limitations

- Built-in MCP is a preview feature and requires a compatible Weaviate version and server-side enablement.
- The connector intentionally implements a focused subset of high-value operations rather than the entire Weaviate API.
- Collection creation/deletion, RBAC administration, backups, tenant mutation, and unrestricted GraphQL are intentionally not exposed.
- `weaviate.object.upsert` uses REST fallback when the official MCP upsert tool is unavailable; server-side schema/vectorizer constraints still apply.
- Hybrid GraphQL fallback requires the requested properties to exist in the collection schema.
