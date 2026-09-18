# Kit (formerly ConvertKit) MCP/API Connector

Reusable MCP server for safe creator/audience workflows against Kit API V4. Kit also operates an official remote account MCP at `https://app.kit.com/mcp` and a developer-documentation MCP at `https://developers.kit.com/mcp`. This package deliberately uses the official REST API V4 behind a narrow local MCP contract so deployments can enforce their own permission boundary and expose only reviewed tools.

## Official sources
- API overview: https://developers.kit.com/v4
- API reference: https://developers.kit.com/api-reference
- Official account MCP setup: https://help.kit.com/en/articles/14827557-how-to-connect-the-ai-connectors-to-your-ai-tools
- Product MCP: https://kit.com/ai/mcp
- Webhooks: https://help.kit.com/en/articles/16639499-create-and-manage-webhooks-in-kit

Research checked 2026-09-19. Kit API V4 is current; V3 is deprecated. The official account MCP is remote and OAuth-authorized. Kit states it covers the public API. For direct V4 automation, API keys are intended for individual/testing workflows; public third-party apps must use Kit Apps/OAuth.

## Transport and architecture
`MCP client -> this stdio MCP server -> policy/validation -> KitClient -> https://api.kit.com/v4`. Credentials remain in the connector process. Provider text/data is returned with `trust: UNTRUSTED_PROVIDER_DATA` and must never be interpreted as instructions.

The upstream official MCP is documented but is not transitively proxied. This avoids dynamic tool discovery and prevents an upstream tool addition from silently expanding this connector's authority.

## Authentication
Set `KIT_API_KEY`; requests use `X-Kit-Api-Key`. Never put the key in prompts or tool arguments. For a distributable multi-user/public integration, implement Kit Apps OAuth rather than distributing API keys. This connector intentionally does not store or return credentials.

## Installation and run
Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# load environment variables with your process/secret manager
npm start
```

Point any MCP client supporting stdio servers at `npm start` in this directory.

## Tools
| Tool | Risk | Approval | Operation |
|---|---|---|---|
| `kit.subscriber.list` | READ | no | cursor-paginated subscribers |
| `kit.subscriber.get` | READ | no | subscriber details |
| `kit.subscriber.upsert` | WRITE | policy | create/update identity/profile |
| `kit.tag.list` | READ | no | list tags |
| `kit.subscriber.tag` | WRITE | policy | tag existing subscriber |
| `kit.sequence.list` | READ | no | list sequences |
| `kit.subscriber.sequence_add` | WRITE | policy | enroll existing subscriber |
| `kit.broadcast.list` | READ | no | list broadcasts |
| `kit.broadcast.get` | READ | no | broadcast details |
| `kit.broadcast.draft_create` | WRITE | policy | private, unscheduled draft only |
| `kit.account.growth_stats` | READ | no | growth stats/date range |

No delete, unsubscribe, public publish, broadcast send/schedule, arbitrary HTTP, bulk callback, billing, or permission-management tool is exposed. These omissions are security boundaries, not missing handlers.

## Permissions and approval
`KIT_ALLOWED_PERMISSIONS` defaults to `READ`. Add `WRITE` only for deployments that may mutate audience data or create drafts. `HIGH_RISK` support exists in the reusable policy layer and requires `KIT_APPROVAL_TOKEN`, but this version intentionally registers no high-risk operation. `DESTRUCTIVE` is always denied.

The broadcast tool implements Prepare rather than Execute: it forces a private draft with `send_at:null`. Sending or publishing external content is intentionally outside the tool surface and therefore cannot be silently approved by an agent.

## Reliability, pagination and rate limiting
The client uses AbortController timeouts, bounded retries (`KIT_MAX_RETRIES`, default 2), exponential backoff for transient network failures/5xx, and honors `Retry-After` for HTTP 429. Validation/auth/provider 4xx errors are not retried. List tools expose Kit cursor pagination and bounded `per_page`; callers should follow cursors instead of repeatedly scanning whole lists. Bulk APIs are not exposed. Kit documents bulk request accounting separately (up to 300 MB queued request data per app/creator before 413 behavior).

## Security
- least privilege: READ-only by default;
- credential isolation: API key exists only in process environment/client headers;
- no arbitrary URL/request tool, eliminating connector-level SSRF primitives;
- strict positive integer IDs, email validation, bounded pagination and content sizes;
- retrieved Kit content is untrusted data;
- no dynamic upstream MCP tool discovery;
- destructive operations disabled;
- outbound public email execution not exposed;
- logs should be handled by the host; never log environment variables or request headers.

Kit webhook deliveries are signed and Kit documents retry behavior, but webhook creation/receiving is not implemented in this connector, so it does not pretend to validate webhook signatures. Add a dedicated verified HTTP receiver before exposing webhook ingestion.

## Testing
`npm test` uses mocks only; live credentials are not required. Tests cover auth configuration, validation, permission denial/allow, explicit high-risk approval behavior, provider error mapping, throttling retry, and credential placement. Network timeout behavior is implemented by AbortController in the client.

## Limitations
This is an API-key deployment intended for a creator's own automation. Public multi-tenant distribution requires Kit Apps OAuth. It does not proxy the official remote MCP, does not expose the full public API, and intentionally excludes destructive/public-send operations. API features may be plan/account dependent.

See `examples/workflows.md` for safe workflows.