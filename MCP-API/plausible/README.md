# Plausible Analytics MCP/API Connector

Reusable MCP stdio server for Plausible Analytics. It exposes a bounded, provider-scoped tool surface over Plausible's official Stats API v2, Enterprise Sites API, and Events API.

## Transport decision

No official Plausible MCP server was found in Plausible's official documentation during research on 2026-09-06, so this connector uses the official HTTP APIs directly rather than depending on an unofficial MCP implementation.

Official sources:
- Stats API v2: https://plausible.io/docs/stats-api
- Sites API: https://plausible.io/docs/sites-api
- Events API: https://plausible.io/docs/events-api
- Data access overview: https://plausible.io/docs/data-access

The Stats API is read-only and available on Business plans. The Sites API is an Enterprise feature. The Events API records pageviews/custom events and requires careful forwarding of visitor headers for correct unique-visitor attribution.

## Implemented MCP tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `plausible.stats.query` | Stats API v2 | READ | No |
| `plausible.site.list` | Sites API | READ | No |
| `plausible.team.list` | Sites API | READ | No |
| `plausible.site.get` | Sites API | READ | No |
| `plausible.goal.list` | Sites API | READ | No |
| `plausible.custom_property.list` | Sites API | READ | No |
| `plausible.guest.list` | Sites API | READ | No |
| `plausible.site.create` | Sites API | WRITE | Configurable; required by default |
| `plausible.site.update` | Sites API | WRITE | Configurable; required by default |
| `plausible.goal.ensure` | Sites API | WRITE | Configurable; required by default |
| `plausible.custom_property.ensure` | Sites API | WRITE | Configurable; required by default |
| `plausible.guest.invite` | Sites API | HIGH_RISK | Always exact approval |
| `plausible.event.track` | Events API | HIGH_RISK | Always exact approval + allowed-site list |
| `plausible.site.delete` | Sites API | DESTRUCTIVE | Disabled by default + exact approval |
| `plausible.goal.delete` | Sites API | DESTRUCTIVE | Disabled by default + exact approval |
| `plausible.custom_property.delete` | Sites API | DESTRUCTIVE | Disabled by default + exact approval |
| `plausible.guest.remove` | Sites API | DESTRUCTIVE | Disabled by default + exact approval |

No arbitrary URL/request tool is exposed.

## Authentication and least privilege

Plausible uses separate Bearer API keys for Stats API and Sites API. Keys are team-scoped. Configure only the key required for the tools you intend to use:
- `PLAUSIBLE_STATS_API_KEY`: Stats API reads only.
- `PLAUSIBLE_SITES_API_KEY`: Enterprise Sites API management.

The Events API endpoint does not use those keys. To keep an agent from generating analytics for arbitrary sites, event recording is gated by `PLAUSIBLE_ALLOWED_SITES` and HIGH_RISK approval.

Credentials remain inside the connector transport layer and are never included in MCP tool inputs or output.

## Environment

Copy `.env.example` and set only required values. `PLAUSIBLE_BASE_URL` defaults to `https://plausible.io`. Self-hosted installations can use a custom HTTPS base URL only when `PLAUSIBLE_ALLOW_CUSTOM_BASE_URL=true`; the base URL is configuration, never an agent-controlled tool argument.

Approval fingerprints are semicolon-separated in `PLAUSIBLE_APPROVED_ACTIONS`. Examples:
- `plausible.site.create:example.com`
- `plausible.goal.ensure:example.com:Signup`
- `plausible.guest.invite:example.com:person@example.net`
- `plausible.event.track:example.com:Purchase`
- `plausible.site.delete:example.com`

## Installation and running

```bash
npm install
npm run build
npm test
npm start
```

Requires Node.js 20+. The server communicates over MCP stdio and is suitable for MCP clients that can launch local stdio servers, including custom agents and IDE/desktop clients with stdio MCP support.

## Stats queries

`plausible.stats.query` calls `POST /api/v2/query`. Metrics are limited to documented Stats API metrics, dimensions are constrained to Plausible dimension prefixes, pagination is bounded, and no raw HTTP parameters are exposed. Stats API keys are limited to 600 requests per hour by default according to the official documentation.

Read queries use bounded exponential backoff for network errors, 429 responses, and 5xx errors. Numeric `Retry-After` is honored when present. Writes and destructive requests are never automatically retried.

## Sites API pagination and permissions

Sites API list endpoints use cursor pagination with `before`, `after`, and `limit`; this connector caps `limit` at 100. Sites API keys are scoped to the selected team and inherit Plausible role restrictions. Operations that require owner access will surface provider 403/404 errors rather than attempting permission escalation.

## Approval model

READ tools execute automatically. WRITE tools require exact human approval by default. HIGH_RISK always requires exact approval. DESTRUCTIVE is blocked unless `PLAUSIBLE_ALLOW_DESTRUCTIVE=true`, then still requires exact approval.

Approval is connector configuration, not a boolean supplied by the model. Retrieved analytics, goal names, domains, referrers, and other third-party content are treated as untrusted data and cannot change permissions.

## Events API safety

`plausible.event.track` requires `domain`, `name`, `url`, and `userAgent`. `X-Forwarded-For` is optional and should only contain the real client IP when forwarding server-side traffic. Incorrect proxy IPs can cause bot filtering; Plausible may still return HTTP 202. The connector returns `x-plausible-dropped` as `meta.dropped` when provided so callers can detect this case. Event props are capped at 30 key/value pairs.

## Errors and reliability

The connector maps authentication, permission/not-found, and throttling failures to actionable MCP errors. Requests have configurable abort timeouts. Retries are bounded by `PLAUSIBLE_MAX_RETRIES` and only apply to read-like operations (`GET` and Stats API v2 queries).

## Security considerations

- Secrets are read only from environment configuration.
- No tool accepts arbitrary URLs or auth headers.
- Custom base URLs require explicit operator opt-in and HTTPS.
- Writes cannot silently raise permissions.
- External invitations and analytics mutations require approval.
- Destructive actions are disabled by default.
- Provider-returned content is data, never instructions.
- Do not log API keys, forwarded visitor IPs, or sensitive custom properties.

## Testing

Unit tests require no live Plausible credentials. They cover safe defaults, custom-host SSRF controls, exact approvals, destructive denial, Stats API authentication isolation, 429 retry behavior, no blind write retry, and tool registration.

## Limitations

- Sites API tools require an Enterprise plan and appropriate team ownership/role.
- Stats API requires a Business plan or an applicable plan with API access.
- This connector intentionally does not expose shared-link creation because it can make analytics accessible through a share URL.
- It does not host webhook/event receivers because Plausible's documented APIs in this scope are Stats, Sites, and Events APIs rather than an event-subscription webhook product.
- It does not automatically acquire or rotate API keys; secret lifecycle remains with the operator's credential manager.
