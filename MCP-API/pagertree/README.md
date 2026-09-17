# PagerTree MCP/API Connector

Reusable MCP server for PagerTree on-call and alert workflows. The upstream transport is PagerTree REST API v4; no official PagerTree MCP server was identified during implementation, so this connector deliberately uses the official API rather than an unofficial MCP intermediary.

## Official sources
- API introduction: https://pagertree.com/docs/api/introduction
- Authentication: https://pagertree.com/docs/api/authentication
- Alerts: https://pagertree.com/docs/api/alerts
- Teams/current on-call: https://pagertree.com/docs/api/teams
- Schedules: https://pagertree.com/docs/api/schedules
- Escalation policies: https://pagertree.com/docs/api/escalation-policies
- Pagination/filtering: https://pagertree.com/docs/api/pagination-and-filters

PagerTree documents a REST API at `https://api.pagertree.com/api/v4`, JSON responses, HTTPS-only requests, Bearer API-key authentication, and list pagination with `limit` (1-100) plus `offset`/`page`. API tokens are account-scoped and should be protected as privileged credentials.

## Implemented tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `pagertree.alert.list` | REST | READ | No |
| `pagertree.alert.get` | REST | READ | No |
| `pagertree.alert.comment.list` | REST | READ | No |
| `pagertree.team.list` | REST | READ | No |
| `pagertree.team.get` | REST | READ | No |
| `pagertree.team.current_oncall` | REST | READ | No |
| `pagertree.team.alert.list` | REST | READ | No |
| `pagertree.schedule.list` | REST | READ | No |
| `pagertree.escalation_policy.list` | REST | READ | No |
| `pagertree.alert.create` | REST | HIGH_RISK WRITE | Yes |
| `pagertree.alert.acknowledge` | REST | WRITE | Yes |
| `pagertree.alert.resolve` | REST | WRITE | Yes |
| `pagertree.alert.comment.create` | REST | WRITE | Yes |

Delete, team mutation, router mutation, schedule mutation, escalation-policy mutation, broadcasts, user invitations, and arbitrary API execution are intentionally not exposed. PagerTree alert handoff is also not claimed because official alert documentation describes handoff through mobile/web UI rather than the documented alert API operations.

## Architecture and security
`MCP client -> stdio MCP server -> validation/approval boundary -> PagerTreeClient -> official HTTPS API`. The API key remains in the connector process and is never returned to the model. Provider responses are wrapped with `untrusted_provider_data: true`; callers must not interpret retrieved text as instructions. The client rejects non-HTTPS base URLs and cross-origin URL construction, bounds pagination, uses timeouts, maps provider errors, and retries only 429/5xx failures up to three attempts. Write operations are not retried blindly.

Writes require both `PAGERTREE_ALLOW_WRITE=true` and an exact `PAGERTREE_APPROVAL_TOKEN` supplied to the tool call. Store that approval secret outside prompts and rotate it as appropriate. READ tools can run without approval. The connector never escalates its own privileges.

## Authentication
Create an account-scoped API token in PagerTree user settings and set `PAGERTREE_API_KEY`. PagerTree documents `Authorization: Bearer <API_KEY>`. PagerTree does not document fine-grained OAuth scopes for this API-key mechanism; least privilege therefore means using an appropriately privileged PagerTree account/token and exposing only the narrowly implemented tools.

## Install and run
Requires Node.js 20+.

```bash
npm install
cp .env.example .env
npm run build
PAGERTREE_API_KEY=... node dist/server.js
```

Configure any MCP client that supports a local stdio MCP server to launch the command above with environment variables supplied by its secure configuration mechanism. Compatibility depends on the client's support for standard MCP stdio; no vendor-specific client behavior is required by the implementation.

## Environment
`PAGERTREE_API_KEY` is required. `PAGERTREE_BASE_URL` defaults to the official v4 endpoint. `PAGERTREE_TIMEOUT_MS` defaults to 15000. `PAGERTREE_ALLOW_WRITE` defaults false. `PAGERTREE_APPROVAL_TOKEN` is required for writes.

## Reliability and rate handling
The official pagination contract is respected with maximum `limit=100`. HTTP 429 and 5xx responses use bounded exponential backoff; `Retry-After` is preserved when supplied and capped for local waiting. Authentication, permission, validation, and other 4xx failures are not retried. Requests use `AbortController` timeouts. PagerTree documentation does not publish a universal numeric request-per-window limit in the sources used here, so the connector does not invent one.

## Testing
`npm test` uses mocked fetch responses and requires no live credentials. Tests cover missing credentials, HTTPS validation, credential injection, provider error mapping, and bounded transient retries. `npm run build` performs strict TypeScript compilation.

## Limitations
This connector intentionally covers high-value alert triage, on-call discovery, schedules, and escalation-policy discovery rather than the full PagerTree API. It does not implement inbound webhooks, broadcasts, destructive deletes, user management, or arbitrary router YAML mutation. API keys are broad relative to OAuth scopes; deploy this process with secret isolation and minimal PagerTree account permissions.