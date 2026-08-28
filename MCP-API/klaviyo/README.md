# Klaviyo MCP/API Connector

Reusable MCP stdio connector for Klaviyo's current JSON:API-based REST API. It exposes a narrow, agent-friendly tool surface for customer/profile discovery, lists, segments, metrics, events, and campaigns, with explicit approval for external writes.

## Transport decision
Klaviyo's official developer platform provides REST APIs, OAuth/private-key authentication, SDKs, OpenAPI specifications, webhooks, and rate-limit guidance. No official Klaviyo-hosted MCP server was found in the official developer documentation during research on 2026-08-28, so this connector uses the official REST API directly.

Official sources:
- https://developers.klaviyo.com/en/reference/api_overview
- https://developers.klaviyo.com/en/docs/authenticate_
- https://developers.klaviyo.com/en/docs/rate_limits_and_error_handling
- https://developers.klaviyo.com/en/docs/handle_your_apps_oauth_flow
- https://github.com/klaviyo/openapi

The connector pins the API revision through `KLAVIYO_REVISION` (default `2026-07-15`) rather than silently following a future breaking revision.

## Authentication and scopes
This package uses a **Klaviyo private API key** via `Authorization: Klaviyo-API-Key ...`. Keep the key in the connector environment; it is never accepted as a tool argument or returned to the model.

Grant only scopes needed by enabled tools:
- `profiles:read`
- `lists:read`
- `segments:read`
- `metrics:read`
- `events:read`
- `campaigns:read`
- `events:write` only if `klaviyo.event.create` is needed

For multi-customer SaaS integrations, Klaviyo OAuth is the appropriate provider model. This reusable server-to-server package intentionally uses a private key and does not implement an interactive OAuth callback service.

## Tools
| Tool | Risk | Approval | Upstream |
|---|---|---|---|
| `klaviyo.profile.list` | READ | no | REST |
| `klaviyo.profile.get` | READ | no | REST |
| `klaviyo.list.list` | READ | no | REST |
| `klaviyo.list.get` | READ | no | REST |
| `klaviyo.segment.list` | READ | no | REST |
| `klaviyo.segment.get` | READ | no | REST |
| `klaviyo.metric.list` | READ | no | REST |
| `klaviyo.metric.get` | READ | no | REST |
| `klaviyo.event.list` | READ | no | REST |
| `klaviyo.event.create` | WRITE | yes | REST |
| `klaviyo.campaign.list` | READ | no | REST |
| `klaviyo.campaign.get` | READ | no | REST |

No arbitrary HTTP request tool, credential-management tool, subscription-changing operation, or destructive profile/list deletion is exposed.

## Approval model
READ tools can execute automatically. `klaviyo.event.create` sends data into an external marketing/customer system and requires explicit approval.

Set `KLAVIYO_APPROVAL_SECRET`, then generate:
```text
hex(HMAC-SHA256(KLAVIYO_APPROVAL_SECRET, "<tool>\n<canonical JSON payload without approval_token>"))
```
Approval is bound to the exact metric, profile identity, properties, value, time, and unique ID. The model cannot mint an approval unless the approval secret is separately exposed, which this connector does not do.

## Reliability and rate limits
Klaviyo uses burst and steady fixed-window limits and returns 429 on throttling. Non-429 responses can include `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`; 429 uses `Retry-After`.

The connector:
- captures provider rate-limit metadata;
- retries only retry-safe requests on 429/502/503/504;
- respects integer `Retry-After` up to a bounded delay;
- uses exponential backoff otherwise;
- caps retries at 5;
- uses request timeouts and cancellation;
- does **not** blindly retry `event.create` because duplicate ingestion would be an external side effect.

Klaviyo documents endpoint-specific tiers (XS through XL). Do not assume one global quota.

## Pagination
Collection tools expose bounded `pageSize` and opaque `cursor`. The underlying API's JSON:API pagination links/cursors are returned unchanged inside the provider response. Filters and sorts are bounded strings and passed only to the specific Klaviyo endpoint; callers cannot choose arbitrary URLs.

## Security
- Fixed upstream origin `https://a.klaviyo.com` prevents SSRF through tool arguments.
- Credentials remain inside the connector.
- Inputs reject unknown top-level fields through MCP JSON schemas.
- Event property count is capped at 300, matching Klaviyo's documented event-property ingestion limit.
- Provider data is marked `untrusted_provider_data: true`; profile/campaign text must be treated as data, never instructions.
- Write approval is payload-bound.
- No deletion, billing, credential, or permission-management tools are provided.
- API revision is explicit and configurable.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run check
npm test
npm start
```
The server uses MCP stdio and can be used by MCP clients that support stdio tool servers.

## Environment
See `.env.example`:
- `KLAVIYO_API_KEY` required
- `KLAVIYO_REVISION` defaults to `2026-07-15`
- `KLAVIYO_TIMEOUT_MS` defaults to 10000
- `KLAVIYO_MAX_RETRIES` defaults to 3, maximum 5
- `KLAVIYO_APPROVAL_SECRET` required only for WRITE execution

## Error handling
Provider JSON:API errors are normalized to concise MCP errors with status/code and rate-limit metadata where available. Authentication, permission, and validation errors are never treated as transient retries.

## Tests
Tests use mocked fetch and no live Klaviyo credentials. They cover configuration, tool registration, approval enforcement and payload binding, auth/revision headers, rate-limit metadata, non-retryable authentication failures, and no blind retries for writes.

## Limitations
- OAuth token acquisition/refresh is not implemented in this server-to-server private-key package.
- Endpoint-specific filter grammar is intentionally not reimplemented; the connector only bounds and forwards filter/sort strings to fixed resource endpoints.
- Webhook administration is omitted to avoid introducing callback-URL SSRF and verification complexity in this connector.
- Destructive operations are intentionally omitted.
