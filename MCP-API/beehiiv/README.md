# beehiiv MCP/API Connector

Reusable MCP server exposing a curated beehiiv API v2 surface for newsletter, subscriber, automation, analytics, segment, and webhook workflows.

## Transport strategy

No official beehiiv MCP server was identified in the official developer documentation reviewed on 2026-09-04, so this connector uses beehiiv's official REST API directly at `https://api.beehiiv.com/v2`. It does not depend on community MCP implementations and does not expose arbitrary HTTP requests.

Official documentation used:
- API docs: https://developers.beehiiv.com/
- OAuth 2.0/scopes: https://developers.beehiiv.com/oauth2
- Rate limiting: https://developers.beehiiv.com/welcome/rate-limiting
- Subscriptions: https://developers.beehiiv.com/api-reference/subscriptions/index
- Create subscription: https://developers.beehiiv.com/api-reference/subscriptions/create
- Posts: https://developers.beehiiv.com/api-reference/posts/index
- Post preview: https://developers.beehiiv.com/api-reference/posts/preview
- Automations: https://developers.beehiiv.com/api-reference/automations/index
- Automation enrollment: https://developers.beehiiv.com/api-reference/automation-journeys/create
- Segments: https://developers.beehiiv.com/api-reference/segments/list-members
- Webhooks: https://developers.beehiiv.com/api-reference/webhooks/index
- Create webhook: https://developers.beehiiv.com/api-reference/webhooks/create
- Engagements: https://developers.beehiiv.com/api-reference/engagements/index
- Workspace permissions: https://developers.beehiiv.com/api-reference/workspaces/permissions

## Authentication and scopes

`BEEHIIV_API_KEY` is sent as an `Authorization: Bearer` header only inside the connector client. beehiiv also supports OAuth 2.0. For OAuth credentials, request only the scopes required by enabled tools: `identify:read`, `publications:read`, `posts:read`, `subscriptions:read`, `subscriptions:write`, `automations:read`, `automations:write`, `segments:read`, `webhooks:read`, and `webhooks:write`. API keys receive the workspace permissions documented by beehiiv. Use `beehiiv.workspace.permissions.get` to inspect effective permissions. The model never receives the raw credential.

## Tools

| Tool | Risk | Approval | Official capability |
|---|---|---|---|
| `beehiiv.workspace.permissions.get` | READ | No | Effective token permissions |
| `beehiiv.publication.list` | READ | No | List publications |
| `beehiiv.publication.engagements.get` | READ | No | Publication engagement metrics |
| `beehiiv.post.list` | READ | No | List posts |
| `beehiiv.post.preview.get` | READ | No | Generate protected preview URL |
| `beehiiv.subscription.list` | READ | No | List subscribers |
| `beehiiv.subscription.get_by_email` | READ | No | Exact subscriber lookup |
| `beehiiv.subscription.create` | WRITE | Yes | Create/reactivate subscriber |
| `beehiiv.automation.list` | READ | No | List automations |
| `beehiiv.automation.enroll` | WRITE | Yes | Enroll existing subscriber in API-triggered automation |
| `beehiiv.segment.members.list` | READ | No | List segment members |
| `beehiiv.webhook.list` | READ | No | List webhooks |
| `beehiiv.webhook.create` | HIGH_RISK | Yes | Create external webhook delivery target |

Delete subscription is intentionally not exposed because beehiiv documents it as irreversible and capable of deleting associated data and affecting premium billing.

## Safety model

Read-only execution is the default. Writes require `BEEHIIV_READ_ONLY=false`, `BEEHIIV_ALLOW_WRITE=true`, and, by default, an `approval` object with `confirmed:true` plus a human-authored reason. Webhook creation is HIGH_RISK because it sends publication events/data to an external URL; only HTTPS targets are accepted. Arbitrary URLs/paths are rejected, destructive endpoints are omitted, and retrieved provider content is wrapped with `untrusted:true` so callers do not treat newsletter content as instructions.

## Reliability and rate limits

beehiiv documents a limit of 180 requests/minute per organization and returns `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`. GET calls use bounded exponential/backoff-style retries for 429 and 5xx responses, up to `BEEHIIV_MAX_RETRIES` (default 3). Mutating calls are never automatically retried, preventing duplicate subscriptions, automation enrollments, or webhook creation. All calls use a bounded timeout.

## Install and run

```bash
cd MCP-API/beehiiv
npm install
npm run build
npm test
npm start
```

Node.js 20+ is required. The MCP server uses stdio and works with MCP clients that support stdio process servers, including custom agents and compatible desktop/IDE MCP hosts.

## Example write

```json
{"name":"beehiiv.subscription.create","arguments":{"publicationId":"pub_00000000-0000-0000-0000-000000000000","email":"reader@example.com","sendWelcomeEmail":false,"approval":{"confirmed":true,"reason":"Subscriber requested enrollment through the approved signup workflow"}}}
```

## Error handling

401 is mapped to authentication failure, 403 to missing OAuth scope/workspace or plan permission, 429 to throttling with retry timing when available, and other provider status codes remain explicit. Validation rejects malformed prefixed IDs, invalid emails, unbounded list limits, non-HTTPS webhook targets, and arbitrary provider paths.

## Limitations

- Post creation/sending is intentionally omitted because beehiiv's Send API is plan/feature-gated and publishing/sending external content needs a stricter prepare/review/execute workflow.
- Webhook deletion and subscriber deletion are not exposed.
- The connector does not host an OAuth browser callback; supply an already-issued API key or bearer token through the environment.
- Pagination is caller-controlled and bounded to 100 items per page.
