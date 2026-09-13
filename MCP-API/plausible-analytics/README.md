# Plausible Analytics MCP Connector

Reusable MCP server for Plausible Analytics using the official REST APIs. No official Plausible MCP server was found during implementation, so all capabilities use documented Plausible HTTP APIs.

## Official sources
- Stats API v2: https://plausible.io/docs/stats-api
- Events API: https://plausible.io/docs/events-api
- Sites API: https://plausible.io/docs/sites-api

The Stats API is read-only and uses a team-scoped Bearer API key. Plausible documents a default Stats API limit of 600 requests/hour. The Events API records pageviews/custom events and requires correct `User-Agent` and, when proxying a real visitor, `X-Forwarded-For` for unique-visitor calculation. Sites API is Enterprise-only and is intentionally not exposed by this connector.

## Implemented tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `plausible.stats.query` | Stats API v2 | READ | no |
| `plausible.stats.overview` | Stats API v2 | READ | no |
| `plausible.stats.timeseries` | Stats API v2 | READ | no |
| `plausible.stats.pages` | Stats API v2 | READ | no |
| `plausible.stats.sources` | Stats API v2 | READ | no |
| `plausible.stats.countries` | Stats API v2 | READ | no |
| `plausible.stats.devices` | Stats API v2 | READ | no |
| `plausible.stats.goals` | Stats API v2 | READ | no |
| `plausible.stats.realtime` | Stats API v2 | READ | no |
| `plausible.event.pageview` | Events API | WRITE | yes |
| `plausible.event.custom` | Events API | WRITE | yes |

## Architecture
`src/config.ts` validates runtime configuration and keeps credentials outside tool inputs. `src/client.ts` owns HTTP transport, auth, timeout, error mapping, rate-limit handling and bounded exponential backoff. `src/policy.ts` defines risk/approval policy. `src/tools.ts` exposes scoped MCP tools with Zod schemas. `src/server.ts` hosts the stdio MCP server.

## Authentication and least privilege
Create a Plausible Stats API key for the team containing only the sites the connector should read. Store it as `PLAUSIBLE_STATS_API_KEY`; it is never returned to the model and is sent only to `/api/v2/query`. Event ingestion does not receive or forward this key.

Environment variables:
- `PLAUSIBLE_STATS_API_KEY` required.
- `PLAUSIBLE_BASE_URL` optional; defaults to `https://plausible.io` and must be HTTPS.
- `PLAUSIBLE_TIMEOUT_MS` defaults to 10000.
- `PLAUSIBLE_MAX_RETRIES` defaults to 2, capped at 5.
- `PLAUSIBLE_ALLOW_EVENT_WRITES` defaults to false.

## Install and run
```bash
npm install
npm run build
PLAUSIBLE_STATS_API_KEY=... npm start
```
The server uses stdio and is suitable for MCP clients that can launch a local command. Configure the client to execute `node dist/src/server.js` with credentials supplied through its secure environment/secret mechanism.

## Permissions and approval
Read tools may execute without approval. Event tools mutate analytics data, may affect billable event volume, and are therefore disabled by default. They require both `PLAUSIBLE_ALLOW_EVENT_WRITES=true` and the strict input field `approved: true`. Retrieved analytics data is treated as untrusted content and never changes permissions or configuration.

## Reliability
The client aborts calls at the configured timeout. Read requests retry only transient network failures, HTTP 429 and 5xx responses, with bounded exponential backoff and `Retry-After` support. Authentication/permission/validation errors are not retried. Event writes are never automatically retried to avoid duplicate analytics events. Pagination is explicit on the generic query tool through `limit` and `offset`; responses can request `total_rows` metadata.

## Security
- Credentials remain in the connector process and are not tool parameters.
- Base URL must use HTTPS.
- No arbitrary URL/request tool is exposed.
- Event URLs must parse as URLs and `data:` URLs are rejected.
- Event custom properties are scalar-only, limited to 30 keys and bounded string lengths.
- Revenue currency is constrained to three uppercase characters and amount is validated.
- Public/external analytics writes require explicit human approval and an opt-in runtime flag.
- Do not place PII or secrets in event URLs/custom properties; Plausible URLs and event data should be treated as externally stored analytics data.

## Error handling
Provider non-success responses become connector errors with status information. 429 responses preserve `Retry-After` for retry timing. Plausible may accept an event with HTTP 202 but drop it due to bot filtering; the connector surfaces `x-plausible-dropped` as `dropped: true`.

## Testing
```bash
npm test
```
Unit tests require no live credentials and use fake fetch implementations. They cover auth configuration, HTTPS validation, risk policy, approval denial, read authorization, credential isolation for event writes, dropped-event signaling and bounded rate-limit retry.

## Limitations
- Plausible Business Stats API availability depends on the user's Plausible plan.
- Enterprise Sites API operations are not implemented because they require Enterprise access and add destructive/admin workflows outside this connector's analytics focus.
- The connector does not create goals or sites; `plausible.stats.goals` reads goal analytics only.
- Events API unique-visitor accuracy depends on callers supplying truthful `User-Agent` and, when appropriate, visitor `X-Forwarded-For` values.
