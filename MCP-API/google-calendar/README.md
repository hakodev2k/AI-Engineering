# Google Calendar MCP/API Connector

Reusable MCP server that exposes a bounded Google Calendar capability surface for AI agents. It prefers Google's official Google Calendar MCP server where a matching tool exists, and uses the official Calendar REST API only for capabilities not exposed by the selected MCP surface (`event.instances` and `event.move`).

## Upstream strategy

Google now provides an official Google Calendar MCP server at `https://calendarmcp.googleapis.com/mcp/v1`. As of September 2026 it is in the Google Workspace Developer Preview Program. This connector uses an explicit allowlist of upstream MCP tools and does not discover or trust new tools automatically.

Official sources used for this implementation:

- Google Calendar MCP configuration: https://developers.google.com/workspace/calendar/api/guides/configure-mcp-server
- Google Calendar MCP tools reference: https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list
- Calendar REST API reference: https://developers.google.com/workspace/calendar/api/v3/reference
- Event REST methods: https://developers.google.com/workspace/calendar/api/v3/reference/events
- Calendar usage limits: https://developers.google.com/workspace/calendar/api/guides/quota
- Google Workspace agent-tool/API safety model: https://developers.google.com/workspace/tools-safety
- OAuth scopes: https://developers.google.com/identity/protocols/oauth2/scopes
- Calendar release notes: https://developers.google.com/workspace/calendar/release-notes

The official MCP currently documents tools including `list_calendars`, `search_events`, `list_events`, `get_event`, `suggest_time`, `create_event`, `update_event`, `respond_to_event`, and `delete_event`. The REST API documents recurring-event `instances` and `move`; this connector uses REST only for those two capabilities.

## Architecture

```text
MCP client
  -> this stdio MCP server
     -> policy + strict Zod schemas
     -> OAuth token provider
     -> official Google Calendar MCP (preferred)
     -> official Google Calendar REST API (two scoped fallbacks)
```

Credentials remain inside this connector process. Provider-returned titles, descriptions, locations, attendee data, and other text are labeled `untrusted-provider-data`; callers must never interpret returned content as instructions or permission changes.

## Runtime and installation

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses stdio, so stdout is reserved for MCP framing. Put configuration and secrets in the process environment; do not put tokens in prompts, tool arguments, examples, or source control.

## Authentication

Use OAuth 2.0. For long-running operation, configure a refresh token:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

A short-lived `GOOGLE_ACCESS_TOKEN` is also supported for controlled sessions. When refresh credentials are present, the connector refreshes the access token through `https://oauth2.googleapis.com/token`, caches it until close to expiration, and performs at most one refresh cycle after an upstream `401`. Authentication failures are not repeatedly retried.

### Least-privilege scopes

Read-only deployments should grant only the MCP/API scopes needed by enabled tools:

- `https://www.googleapis.com/auth/calendar.calendarlist.readonly`
- `https://www.googleapis.com/auth/calendar.events.readonly`
- `https://www.googleapis.com/auth/calendar.events.freebusy`

Write tools require:

- `https://www.googleapis.com/auth/calendar.events`

Google's official MCP tool reference documents `calendar.events` or the broader `calendar` scope for write tools. This connector does not require the broader `calendar` scope and deliberately does not implement ACL or calendar-sharing administration.

The official MCP service must also be enabled in the Google Cloud project (`calendarmcp.googleapis.com`) and, while the service remains Developer Preview, the account/project must satisfy Google's Developer Preview requirements.

## Environment variables

See `.env.example`.

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`: OAuth refresh credentials.
- `GOOGLE_ACCESS_TOKEN`: optional short-lived alternative.
- `GOOGLE_CALENDAR_MCP_URL`: pinned by validation to `calendarmcp.googleapis.com`.
- `GOOGLE_CALENDAR_API_BASE_URL`: pinned to `www.googleapis.com`.
- `GOOGLE_OAUTH_TOKEN_URL`: pinned to `oauth2.googleapis.com`.
- `GOOGLE_CALENDAR_TIMEOUT_MS`: per-call timeout, 1–120 seconds.
- `GOOGLE_CALENDAR_MAX_RETRIES`: bounded retries for safe/read operations, 0–5.
- `GOOGLE_CALENDAR_APPROVAL_SECRET`: at least 32 characters; required to enable any write/high-risk/destructive action.

Host pinning prevents configuration from redirecting OAuth credentials or bearer tokens to arbitrary servers.

## Tools

| Tool | Transport | Risk | Approval | Purpose |
| --- | --- | --- | --- | --- |
| `google_calendar.calendar.list` | official MCP | READ | no | List accessible calendars |
| `google_calendar.event.search` | official MCP | READ | no | Semantic search of the primary calendar |
| `google_calendar.event.list` | official MCP | READ | no | List events with explicit constraints and pagination |
| `google_calendar.event.get` | official MCP | READ | no | Read one event |
| `google_calendar.event.instances` | REST fallback | READ | no | List instances of a recurring event |
| `google_calendar.availability.suggest` | official MCP | READ | no | Suggest free time for attendee emails |
| `google_calendar.event.create` | official MCP | WRITE | yes | Create a timed event; can add attendees |
| `google_calendar.event.update` | official MCP | WRITE | yes | Modify selected event fields |
| `google_calendar.event.respond` | official MCP | HIGH_RISK | yes | Accept/tentatively accept/decline an invitation |
| `google_calendar.event.move` | REST fallback | HIGH_RISK | yes | Move a default event to another calendar/organizer |
| `google_calendar.event.delete` | official MCP | DESTRUCTIVE | yes | Delete an event |

No arbitrary REST or MCP passthrough is exposed. The connector does not expose ACL changes, sharing/permission changes, calendar deletion, billing, or unrestricted webhook creation.

## Approval model

All mutation tools are disabled unless `GOOGLE_CALENDAR_APPROVAL_SECRET` is configured. Approval is cryptographically bound to both the action and target resource:

```text
approvalId = hex(HMAC-SHA256(secret, action + ":" + resource))
```

Resource strings are:

- create: `{calendarId}`
- update/delete: `{calendarId}/{eventId}`
- respond: `{calendarId}/{eventId}:{responseStatus}`
- move: `{calendarId}/{eventId}->{destinationCalendarId}`

This prevents an approval generated for one event/action from silently authorizing another. Approval issuance belongs to the host application or human-review layer, not the model. Never expose the approval secret to the LLM.

`event.create` and `event.update` default `notificationLevel` to `NONE` to reduce accidental external mail. If the approved call adds attendees or changes notification behavior, the human reviewer should treat the resulting invitations/notifications as externally visible side effects. `event.respond` is always HIGH_RISK because it communicates an attendance decision. `event.delete` is DESTRUCTIVE.

## Reliability and rate limits

Each upstream request has an abort timeout. Safe/read requests use bounded exponential backoff with jitter for `429`, `502`, `503`, and `504`, honoring a valid `Retry-After` value up to 60 seconds. Writes, invitation responses, moves, and deletes are not automatically retried because the first request may have succeeded even when the response was lost.

As documented by Google after the May 1, 2026 quota update, new Calendar API projects have standard limits of 10,000 requests per minute per project and 600 requests per minute per user per project, plus a standard daily threshold of 1,000,000 requests per project. Google can return `403 usageLimits` or `429 usageLimits` for quota enforcement. Quotas and future billing policy can change; verify the official quota page before production rollout.

Pagination is explicit and bounded. `calendar.list` and MCP event listing limit page sizes to documented maximums; recurring instances are also returned one page per tool call. The connector does not automatically crawl every page.

## Error handling

The connector maps upstream failures to short errors without returning raw credential-bearing requests or provider error bodies. Important cases:

- `401`: one refresh attempt when refresh credentials exist, then fail.
- `403`: report likely scope, permission, Developer Preview access, or quota denial; no blind retry.
- `429` / transient `5xx`: bounded retry only for safe/read operations.
- timeout: abort the upstream request; for a mutation, treat the outcome as unknown and verify with a read before attempting another write.
- validation failure: rejected locally by Zod before reaching Google.
- MCP JSON-RPC error: returned as a sanitized connector error.

## Security considerations

- OAuth credentials and bearer tokens stay in the auth layer and are never tool inputs or outputs.
- Upstream MCP tools are hard allowlisted; newly introduced provider tools are not trusted automatically.
- Upstream hostnames are pinned to official Google hosts to reduce SSRF/token exfiltration risk.
- Redirects are rejected.
- Provider text is untrusted data. Event descriptions, attachments, attendee names, and locations cannot alter system instructions, scopes, approval policy, or the tool allowlist.
- Mutation approval is scoped by HMAC and the secret never enters model context.
- External notifications default off where the official MCP tool supports notification controls.
- The connector does not implement ACL/permission administration.
- Logs should never include tokens, refresh tokens, approval secrets, private event bodies, or attendee lists.

## Examples

See `examples/workflows.json` for read, availability, create, and delete examples with output shape, permission classification, and approval requirements. The strings shown for approval IDs are intentionally non-secret placeholders; the host approval layer computes real values.

## Tests

```bash
npm test
```

Unit tests require no live Google credentials. They cover credential validation, host pinning/SSRF protection, tool inventory/risk categories, approval scoping and denial, OAuth refresh caching, rate-limit retry behavior, non-retry of writes, and REST pagination encoding.

Before production enablement, separately test with a dedicated Google Cloud project and test account using intentionally low quota settings as recommended by Google.

## Limitations

- Google Calendar MCP is Developer Preview as of September 2026 and may change; the wrapper intentionally fails instead of accepting unknown tools.
- `event.search` follows Google's MCP contract and searches the primary calendar.
- This connector exposes timed event creation/update only; it does not currently expose every special event type, recurrence authoring field, attachment field, working-location variant, or arbitrary Event resource property.
- `event.move` follows the REST API rule that only default events can be moved; birthday, focus-time, Gmail, out-of-office, and working-location events cannot be moved.
- No service-account domain-wide delegation flow is implemented. Use a user OAuth grant appropriate to the intended identity.
- No webhook/channel management is exposed. For high-scale event-driven integrations, implement a separate verified receiver and explicit channel lifecycle policy rather than granting an agent unrestricted callback URLs.
- The connector is an MCP stdio server. It can be launched by MCP clients that support stdio process servers; compatibility still depends on each client's configuration and authentication model.
