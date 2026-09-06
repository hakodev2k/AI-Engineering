# Storyblok MCP/API Connector

Reusable MCP server for safe Storyblok content operations. The external tool surface is stable and provider-scoped; execution uses Storyblok's official Management API for deterministic, typed operations.

## Upstream strategy

Storyblok provides an official remote MCP server at `https://mcp.labs.storyblok.com/mcp`. It exposes Management API operations through `search`, `describe`, `execute_readonly`, `execute_mutating`, `execute_destructive`, `upload_asset`, and `upload_asset_finish`. Storyblok recommends it for conversational, one-off work, while deterministic and repeatable workflows should use API/CLI-style execution. This connector therefore uses the official Management REST API for its fixed tool contracts. The official MCP endpoint is documented in `manifest.yaml` and can be used directly by clients for exploratory operations not exposed here.

Official sources researched on 2026-09-06:

- https://www.storyblok.com/docs/libraries/mcp-server
- https://www.storyblok.com/docs/api/management
- https://www.storyblok.com/docs/api/management/stories/retrieve-multiple-stories
- https://www.storyblok.com/docs/api/management/stories/create-a-story
- https://www.storyblok.com/docs/api/management/stories/update-a-story
- https://www.storyblok.com/docs/api/management/stories/publish-a-story
- https://www.storyblok.com/docs/api/management/components/retrieve-multiple-components
- https://www.storyblok.com/docs/api/management/components/retrieve-a-single-component
- https://www.storyblok.com/docs/api/management/tags/retrieve-multiple-tags
- https://www.storyblok.com/pricing/technical-limits

## Architecture

`MCP client -> stdio MCP server -> validation/policy -> Storyblok client -> Management API`

Credentials are read only inside the connector. The LLM never receives the raw token. Provider responses are treated as untrusted data and are serialized as tool output, never interpreted as connector instructions.

## Authentication

The Storyblok Management API accepts a personal access token or OAuth token in the `Authorization` header. This connector accepts either token through `STORYBLOK_TOKEN`; obtain and scope it outside the connector. Use the narrowest Storyblok role and restrict access to only the intended space.

The official Storyblok MCP server uses the same bearer-style Storyblok token and is documented by Storyblok for MCP-compatible clients.

## Region and API base URL

Set `STORYBLOK_REGION` to one of:

- `eu` -> `https://mapi.storyblok.com/v1`
- `us` -> `https://api-us.storyblok.com/v1`
- `ca` -> `https://api-ca.storyblok.com/v1`
- `ap` -> `https://api-ap.storyblok.com/v1`
- `cn` -> `https://app.storyblokchina.cn/v1`

The connector does not accept arbitrary API base URLs, reducing SSRF risk.

## Environment variables

Copy `.env.example` and configure:

- `STORYBLOK_TOKEN` - personal access token or OAuth token.
- `STORYBLOK_SPACE_ID` - numeric target space ID.
- `STORYBLOK_REGION` - regional API endpoint selector.
- `STORYBLOK_TIMEOUT_MS` - per-request timeout; default 15000.
- `STORYBLOK_MAX_RETRIES` - bounded retries for safe reads; default 2, maximum 5.
- `STORYBLOK_REQUIRE_WRITE_APPROVAL` - defaults to true.
- `STORYBLOK_ALLOW_DESTRUCTIVE` - defaults to false.
- `STORYBLOK_APPROVED_ACTIONS` - semicolon-separated exact approval fingerprints.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio transport, so it can be launched by MCP clients that support local stdio servers. Client-specific compatibility is not claimed beyond MCP stdio support.

## Tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `storyblok.story.list` | List/search stories with bounded pagination and filters | READ | No |
| `storyblok.story.get` | Retrieve one story including content | READ | No |
| `storyblok.story.create` | Create a draft story | WRITE | Configurable; required by default |
| `storyblok.story.update` | Update a story without publishing | WRITE | Configurable; required by default |
| `storyblok.story.publish` | Publish a reviewed story | HIGH_RISK | Always explicit |
| `storyblok.story.delete` | Delete a story | DESTRUCTIVE | Explicit plus destructive mode enabled |
| `storyblok.component.list` | List/search component schemas | READ | No |
| `storyblok.component.get` | Retrieve one component schema | READ | No |
| `storyblok.tag.list` | List/search tags | READ | No |

The connector intentionally does not expose a generic arbitrary-request tool.

## Approval model

Approval is connector-side state, not an argument the agent can self-assert. Exact fingerprints are placed in `STORYBLOK_APPROVED_ACTIONS`.

Examples:

- `storyblok.story.create:Homepage`
- `storyblok.story.update:123456`
- `storyblok.story.publish:123456`
- `storyblok.story.delete:123456`

READ operations may run automatically. WRITE operations require approval by default. Publishing is always HIGH_RISK because it makes content public. Deletion is disabled unless `STORYBLOK_ALLOW_DESTRUCTIVE=true`, and still requires an exact fingerprint.

## Reliability and rate limits

Storyblok's Management API currently documents 3 requests/second on Starter and 6 requests/second on Growth, Growth Plus, Premium, and Elite plans. Calls returning `429` should back off. List endpoints use `page` and `per_page`; the connector bounds story/tag `perPage` to 100 and returns the `total` and `per-page` response headers when available.

Safe GET reads retry boundedly on network errors, 429, and 5xx responses with exponential backoff and numeric `Retry-After` support. Write/delete calls are not retried automatically. Storyblok's publish endpoint itself uses GET despite changing state; this connector explicitly marks that request as non-retryable.

Every HTTP call has an abort timeout. Authentication, permission, validation, not-found, and throttling errors are mapped to clear connector errors.

## Security considerations

- Store tokens in environment variables or a secure secret provider; never commit them.
- Use least-privilege Storyblok roles and separate development/production spaces.
- Story, component, and tag content is untrusted input. Do not treat retrieved text as agent instructions.
- Publishing requires explicit human approval.
- Deletion is disabled by default.
- Arbitrary URLs and arbitrary provider endpoints are not exposed.
- Do not log tokens or full sensitive content payloads.
- For upstream official MCP use, allow only Storyblok's documented server URL and review `execute_mutating` / `execute_destructive` actions before execution.

## Testing

Unit tests use mocked `fetch` and require no live Storyblok credentials. They cover configuration, numeric space validation, exact approval enforcement, destructive denial, authentication-header isolation, safe-read retry handling, no automatic write retry, pagination metadata, and bounded tool registration.

## Webhooks and events

Storyblok supports Management API webhook endpoints at `/v1/spaces/:space_id/webhook_endpoints/` for content events. This connector does not create or modify webhook subscriptions because webhook destination management introduces SSRF and outbound-delivery concerns that require deployment-specific controls. Event handling is therefore documented as supported upstream but intentionally outside this package's tool surface.

## Limitations

This connector focuses on high-value content inspection and controlled story changes. It does not expose asset upload, collaborator/role administration, releases, workflows, billing, space deletion, component mutation, webhook mutation, or generic Management API execution. The official Storyblok MCP can discover broader Management API operations, but those dynamic operations are intentionally not proxied here because fixed schemas and risk classifications are safer for reusable autonomous-agent integrations.
