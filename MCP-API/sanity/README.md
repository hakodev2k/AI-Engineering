# Sanity MCP/API Connector

Reusable MCP connector for Sanity Content Lake. It exposes a stable provider-scoped interface, prefers Sanity's official hosted MCP server, and uses the official `@sanity/client` only as a constrained read fallback.

## Official sources researched

- Sanity MCP server: https://www.sanity.io/docs/ai/mcp-server
- HTTP API reference: https://www.sanity.io/docs/http-reference
- Authentication and tokens: https://www.sanity.io/docs/content-lake/http-auth
- Mutation API: https://www.sanity.io/docs/http-reference/mutation
- JavaScript client: https://www.sanity.io/docs/apis-and-sdks/js-client-getting-started
- API CDN and throttling: https://www.sanity.io/docs/content-lake/api-cdn
- API versioning: https://www.sanity.io/docs/content-lake/api-versioning

Research date: 2026-08-28.

Sanity's official remote MCP endpoint is `https://mcp.sanity.io`. It supports OAuth by default and bearer-token authentication. Its documented tools include `query_documents`, `get_document`, `get_schema`, `list_workspace_schemas`, `create_documents`, `patch_documents`, `publish_documents`, `unpublish_documents`, `discard_drafts`, and `list_releases`.

## Transport strategy

Primary transport: official Sanity MCP. At runtime the connector discovers upstream tools and refuses calls unless the requested upstream name is both advertised and present in a hard-coded allowlist.

Read-only `sanity.content.query` and `sanity.document.get` fall back to the official `@sanity/client` when MCP is unavailable. Writes never silently fall back, so authoring semantics cannot change underneath the agent.

## Supported tools

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `sanity.content.query` | MCP, SDK fallback | READ | no |
| `sanity.document.get` | MCP, SDK fallback | READ | no |
| `sanity.schema.get` | MCP | READ | no |
| `sanity.schema.list` | MCP | READ | no |
| `sanity.release.list` | MCP | READ | no |
| `sanity.document.create_draft` | MCP | WRITE | yes |
| `sanity.document.patch` | MCP | WRITE | yes |
| `sanity.document.publish` | MCP | HIGH_RISK | yes |
| `sanity.document.unpublish` | MCP | HIGH_RISK | yes |
| `sanity.document.discard_draft` | MCP | DESTRUCTIVE | yes + disabled by default |

Not exposed: raw HTTP requests, arbitrary MCP tools, token administration, CORS administration, project/dataset creation, CLI execution, schema deployment, Studio deployment, asset upload, or AI image generation.

## Architecture

```text
MCP client
  -> stdio connector
     -> strict tool schema
     -> risk / approval policy
     -> transport router
        -> official Sanity MCP
        -> official @sanity/client read fallback
```

Provider content is returned as `untrusted_provider_data` and must never be treated as instructions or permission changes.

## Authentication and least privilege

Set `SANITY_API_TOKEN` to a scoped bearer token. Credentials stay in the connector transport and are never MCP tool arguments or outputs.

Use the narrowest Sanity role that permits the workflows you enable. Read-only deployments should use read access. Authoring deployments should grant only the content/schema/release permissions required by these tools. Do not grant project, token, dataset, or CORS administration unless required elsewhere.

## Environment variables

Copy `.env.example` and configure:

- `SANITY_PROJECT_ID` — required.
- `SANITY_DATASET` — default `production`.
- `SANITY_API_TOKEN` — required.
- `SANITY_API_VERSION` — default `2026-07-28`, intentionally pinned. Sanity recommends static date-based API versions.
- `SANITY_MCP_URL` — default `https://mcp.sanity.io`, HTTPS only.
- `SANITY_MCP_ENABLED` — default `true`.
- `SANITY_TIMEOUT_MS` — bounded timeout configuration.
- `SANITY_MAX_READ_RETRIES` — bounded read retry configuration; writes are never blindly retried.
- `SANITY_APPROVAL_SECRET` — HMAC secret used for explicit execution approvals.
- `SANITY_ENABLE_DESTRUCTIVE` — default `false`.

## Installation

Requires Node.js 22.12+.

```bash
npm install
npm run check
npm test
```

## Running

```bash
npm start
```

The connector uses standard MCP stdio transport and works with MCP hosts that support stdio tool servers.

## Approval behavior

READ tools may execute automatically. WRITE and HIGH_RISK tools require an `approval_token` bound to the exact tool and payload. DESTRUCTIVE tools additionally require `SANITY_ENABLE_DESTRUCTIVE=true`.

Approval token:

```text
hex(HMAC-SHA256(
  SANITY_APPROVAL_SECRET,
  "<tool-name>\n<canonical-json-payload-without-approval_token>"
))
```

Changing document IDs, content, patches, or any other approved field invalidates the token.

## Rate limits and reliability

Sanity documents HTTP 429 throttling and recommends bounded exponential backoff for retryable reads. The official `@sanity/client` retries rate-limited queries; mutations are not automatically retried. This connector preserves that boundary: reads may fall back to the SDK, while writes fail closed instead of being replayed blindly.

Quotas depend on deployment and plan, so the connector does not invent a global requests-per-second limit.

## Error handling

Authentication and permission failures are non-retryable. HTTP 429 is classified as rate limiting. Upstream 5xx failures are surfaced as retryable availability failures. Validation and policy failures are non-retryable.

If a required official MCP tool is no longer advertised, the connector fails safely rather than trusting a newly discovered replacement tool.

## Security considerations

- API tokens remain in the connector layer.
- Only a fixed upstream MCP allowlist is callable.
- Upstream MCP tool discovery is validated before execution.
- The project, dataset, endpoint, credentials, and approval policy cannot be changed through agent tools.
- Publishing and unpublishing require explicit approval.
- Draft deletion is disabled by default.
- No arbitrary provider request tool exists.
- Retrieved Sanity content is explicitly marked untrusted.
- SDK fallback is read-only and limited to GROQ query / exact-document retrieval.
- Writes are not automatically retried.

## Tests

Unit tests require no live credentials. They cover tool-policy synchronization, authentication/config validation, read permission behavior, payload-bound approvals, destructive-operation denial, MCP preference, official SDK fallback, fail-closed writes, and GROQ fallback behavior.

## Limitations

- OAuth browser flows are not implemented inside this non-interactive connector; bearer-token auth is used. The upstream Sanity MCP itself supports OAuth.
- Only query and exact-document reads have SDK fallback.
- Schema, release, and all mutation tools require the official MCP server.
- Upstream MCP schemas can evolve; runtime discovery intentionally fails safely when a required named tool disappears.
