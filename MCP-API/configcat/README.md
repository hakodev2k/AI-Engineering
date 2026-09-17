# ConfigCat MCP/API Connector

Reusable safety-gated MCP server for ConfigCat feature-flag operations.

## Transport strategy

ConfigCat publishes an official local stdio MCP server, `@configcat/mcp-server`, which uses Public Management API Basic Auth credentials and supports organizations, members/permissions, products, configs, environments, flags/settings, tags, segments, integrations/webhooks, audit logs, stale-flag reports, code references, and SDK/code assistance. Official setup: https://configcat.com/docs/advanced/mcp-server/ .

This reusable connector uses ConfigCat's official Public Management REST API (`https://api.configcat.com`) behind a fixed allowlist instead of dynamically proxying the broad official MCP tool set. This provides stable provider-scoped contracts and a stronger local approval boundary for runtime flag changes. ConfigCat explicitly says the Management API is for management, not runtime flag evaluation; applications should use ConfigCat SDKs or Proxy for evaluation. API reference: https://configcat.com/docs/api/reference/configcat-public-management-api/ .

Official sources researched on 2026-09-17: ConfigCat MCP Server docs, Public Management API reference/OpenAPI, Feature Flag & Setting Values docs, Products/Configs/Environments/Segments/Webhooks/Integrations/Audit Log docs, and subscription limits.

## Capabilities

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `configcat.product.list` | REST | READ | No |
| `configcat.environment.list` | REST | READ | No |
| `configcat.config.list` | REST | READ | No |
| `configcat.flag.list` | REST | READ | No |
| `configcat.flag.value.get` | REST | READ | No |
| `configcat.segment.list` | REST | READ | No |
| `configcat.webhook.list` | REST | READ | No |
| `configcat.integration.list` | REST | READ | No |
| `configcat.audit.list` | REST | READ | No |
| `configcat.flag.value.update` | REST | HIGH_RISK | Explicit + enabled |

Destructive operations, member/permission administration, credential management, product/config/environment deletion, webhook/integration mutation, SDK-key rotation, arbitrary HTTP, and generic upstream MCP invocation are not exposed.

## Authentication and least privilege

Set `CONFIGCAT_API_USER` and `CONFIGCAT_API_PASS` to dedicated Public Management API credentials. The connector constructs HTTP Basic Auth internally; credentials never appear in MCP tool arguments or results. ConfigCat Public API credentials inherit their configured account/product permissions, so create a dedicated credential with only the permissions needed by these tools. The official MCP uses the same credential model.

## Installation and run

Requires Node.js 20+.

```bash
cd MCP-API/configcat
npm install
npm test
npm start
```

The server speaks MCP over stdio and can be launched by MCP clients that support local stdio servers. For clients that prefer ConfigCat's complete official tool set, configure `npx -y @configcat/mcp-server` directly after reviewing its permissions.

## Configuration

See `.env.example`. `CONFIGCAT_BASE_URL` defaults to the official HTTPS API origin and must remain an HTTPS origin. `CONFIGCAT_TIMEOUT_MS` is bounded to 1–120 seconds. `CONFIGCAT_MAX_READ_RETRIES` is bounded to 0–5. `CONFIGCAT_ALLOW_HIGH_RISK` defaults false.

## Permissions and approvals

READ tools may execute automatically. Runtime flag-value mutation is classified HIGH_RISK because a feature-flag change can immediately alter production application behavior. `configcat.flag.value.update` therefore requires both `CONFIGCAT_ALLOW_HIGH_RISK=true` and an explicit approval object with a human reason. No DESTRUCTIVE tools are registered. The connector cannot elevate the Public API credential's provider permissions.

The update tool accepts only bounded JSON Patch operations and restricts patch roots to ConfigCat's documented value fields. V1 supports `value`, `rolloutRules`, and `percentageRules`; V2 supports `defaultValue`, `targetingRules`, and `percentageEvaluationAttribute`. Callers should read the current value first and submit the smallest patch. Product/environment approval and reason policies enforced by ConfigCat remain authoritative.

## Reliability, pagination, and rate limits

ConfigCat documents rate-limit metadata in `X-Rate-Limit-Remaining` and `X-Rate-Limit-Reset`, and HTTP 429 with `Retry-After`. ConfigCat does not publish one universal numeric Management API quota, so this connector does not invent one. READ calls use bounded exponential backoff for network failures, 429, and 5xx responses; authentication/permission errors are not retried. Mutating calls are never blindly retried. Every request has an AbortController timeout.

List endpoints used here are naturally bounded by ConfigCat's corresponding API responses. Audit filtering is constrained to the official product audit-log query parameters; callers should use narrow date windows. The legacy V1 audit endpoint is used for its simple bounded-window semantics; ConfigCat marks it deprecated in favor of V2, so a future connector revision should migrate once the desired V2 pagination contract is pinned.

## Error handling

Provider failures map to `ConfigCatError` with HTTP status and `Retry-After` when present. Tool errors are sanitized before MCP output. Credentials and Authorization headers are never included. Invalid UUIDs, dates, patch operations, patch paths, and approval objects are rejected before provider calls.

## Security

Provider content is returned under `untrustedProviderData` and must be treated as data, never as instructions. The configured API host is validated and cross-origin calls are blocked, preventing caller-selected SSRF targets. There is no raw URL/request tool. Secrets remain in the connector process. Newly added official MCP tools are not automatically trusted. Permission/member/security administration and deletion are deliberately excluded. Logs should never include environment secrets or Authorization headers.

ConfigCat webhooks can notify applications when feature flags change, but this stdio connector does not open an inbound HTTP listener or manage webhook registrations. Host applications that consume webhooks should validate provider authenticity according to ConfigCat's current webhook guidance and treat payloads as untrusted input.

## Testing

`npm test` uses Node's built-in test runner and mocked fetch; no live ConfigCat credentials are required. Tests cover auth configuration, HTTPS-origin validation, tool registration, credential isolation, high-risk denial, bounded 429 retry, and no blind write retry.

## Examples

See `examples/workflows.md` for inventory, rollout inspection, and approved flag-update flows. Tool output includes provider data plus available rate-limit metadata.

## Limitations

This connector intentionally implements a focused operational subset rather than ConfigCat's complete Management API/MCP surface. It does not evaluate flags for end users, manage organizations/members/permissions, create/delete resources, mutate webhooks/integrations, rotate SDK keys, upload code references, or expose the official MCP server's code-editing/SDK-assistance tools. Use ConfigCat SDKs/Proxy for runtime evaluation and the official MCP directly for broader interactive administration after permission review.
