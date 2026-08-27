# Contentful MCP/API Connector

Reusable, security-focused MCP connector for Contentful. It exposes stable provider-scoped tools while delegating supported content operations to Contentful's official MCP server over stdio.

## Official research

Research date: 2026-08-28.

Official sources:
- https://github.com/contentful/contentful-mcp-server
- https://www.contentful.com/developers/docs/references/content-management-api/overview/
- https://www.contentful.com/developers/docs/references/authentication/
- https://www.contentful.com/developers/docs/references/content-delivery-api/overview/
- https://www.contentful.com/developers/api-changes/

Contentful maintains `@contentful/mcp-server`. The official package is pinned here to `1.17.0`, whose package metadata requires Node.js 22+. The official MCP server supports content types, entries, assets, spaces/environments, locales, tags and AI Actions. This connector intentionally exposes only a reviewed subset.

## Transport strategy

The required operations are supported by the official MCP, so this connector uses the official MCP rather than reimplementing them over REST. The wrapper discovers the official server at runtime, fails closed if an allowlisted tool is missing, copies the upstream input schema, and adds only its own approval field where needed.

No arbitrary upstream tool invocation is exposed. Newly added official tools are not trusted automatically.

## Tools

| External tool | Official MCP tool | Risk | Approval |
|---|---|---:|---|
| `contentful.content_type.list` | `list_content_types` | READ | no |
| `contentful.content_type.get` | `get_content_type` | READ | no |
| `contentful.entry.search` | `search_entries` | READ | no |
| `contentful.entry.get` | `get_entry` | READ | no |
| `contentful.entry.snapshot.get` | `get_entry_snapshot` | READ | no |
| `contentful.entry.reference.resolve` | `resolve_entry_references` | READ | no |
| `contentful.entry.create` | `create_entry` | WRITE | yes |
| `contentful.entry.update` | `update_entry` | WRITE | yes |
| `contentful.entry.publish` | `publish_entry` | HIGH_RISK | yes |
| `contentful.entry.unpublish` | `unpublish_entry` | HIGH_RISK | yes |
| `contentful.entry.archive` | `archive_entry` | HIGH_RISK | yes |
| `contentful.entry.unarchive` | `unarchive_entry` | WRITE | yes |
| `contentful.entry.delete` | `delete_entry` | DESTRUCTIVE | yes + feature flag |
| `contentful.asset.list` | `list_assets` | READ | no |
| `contentful.asset.get` | `get_asset` | READ | no |

Not exposed: raw REST requests, arbitrary MCP calls, token/permission management, space deletion, environment creation/deletion, content-model mutation, asset upload, or AI Action invocation.

## Authentication and least privilege

The Content Management API uses OAuth bearer tokens. A personal Content Management API access token can be used for personal automation; reusable public integrations should use Contentful OAuth. Contentful documents that CMA tokens carry the rights of the represented user, so use a dedicated least-privilege user/role whenever possible.

Required:
```text
CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=
CONTENTFUL_SPACE_ID=
```

Optional:
```text
CONTENTFUL_ENVIRONMENT_ID=master
CONTENTFUL_HOST=api.contentful.com
CONTENTFUL_PROTECTED_ENVIRONMENTS=master
CONTENTFUL_APPROVAL_SECRET=
CONTENTFUL_ENABLE_DESTRUCTIVE=false
CONTENTFUL_TIMEOUT_MS=15000
CONTENTFUL_READ_RETRIES=2
```

Credentials remain in the connector/upstream process environment and never appear in tool schemas or outputs.

## Protected environments

Contentful's official MCP supports `PROTECTED_ENVIRONMENTS`. This wrapper defaults `master` to protected and forwards the configured protected environment list to the official server for defense in depth. READ tools remain available. WRITE/HIGH_RISK/DESTRUCTIVE tools are rejected before reaching upstream when the selected environment is protected.

## Approval model

READ tools may execute automatically. WRITE and HIGH_RISK tools require `CONTENTFUL_APPROVAL_SECRET` and a payload-bound `approval_token`:

```text
hex(HMAC-SHA256(CONTENTFUL_APPROVAL_SECRET, "<tool-name>\n<stable canonical JSON payload>"))
```

Changing the entry, version, fields or publish set invalidates the approval. DESTRUCTIVE tools additionally require `CONTENTFUL_ENABLE_DESTRUCTIVE=true`; an agent cannot enable this through a tool call.

`contentful.entry.delete` preserves the official upstream two-phase delete preview/confirm contract and adds the connector-level destructive gate and approval.

## Installation and running

```bash
npm install
npm run check
npm test
npm start
```

The connector uses standard MCP stdio and spawns the locally installed `contentful-mcp-server` binary, not an arbitrary caller-provided command.

## Reliability and rate limiting

Contentful documents CMA rate limiting. Current API change documentation states `x-contentful-ratelimit-second-limit` appears on 200 and 429 responses, while 429 responses also include `x-contentful-ratelimit-reset`.

Because this wrapper communicates through the official MCP rather than raw HTTP, those HTTP headers are not guaranteed to reach the wrapper. It therefore applies a bounded upstream timeout and retries only READ calls when the upstream error indicates 429/rate-limit/timeout/502/503/504. Backoff is bounded. Mutation calls are never retried automatically because their final provider state can be uncertain.

Version conflicts, Contentful validation, pagination semantics and provider-specific errors remain authoritative in the official MCP/CMA implementation.

## Security

- Retrieved provider content is tagged `untrusted_provider_data: true` and must never be treated as agent instructions.
- Credentials never enter LLM-facing tool parameters.
- Fixed local upstream binary and strict tool allowlist reduce MCP tool-injection risk.
- Official upstream schemas are reused rather than approximated.
- Protected environments are enforced in both wrapper and upstream MCP.
- Publishing/unpublishing/archiving require human approval.
- Delete is disabled by default.
- No automatic mutation retry.
- No permission-escalation or generic request tool exists.
- Space/environment/host are startup configuration, not agent-controlled tool arguments.

## Testing

Unit tests use fakes and require no live Contentful credentials. They cover authentication configuration, protected-environment defaults, tool registration, fail-closed upstream discovery, dynamic schema reuse, approval binding, destructive denial, credential isolation to the upstream process, upstream allowlisting, read retry and no write retry.

## Limitations

- One Contentful space/environment per connector process.
- Only the reviewed tool subset is exposed.
- Operational least privilege depends on the Contentful user/role represented by the CMA token.
- Upstream MCP timeouts may leave mutation state uncertain; mutations are therefore never retried by the wrapper.
- Delivery/Preview/GraphQL APIs are not used because these management workflows are already supported by the official MCP.
