# Nylas MCP/API Connector

Reusable MCP connector for Nylas email, calendar, contacts, and webhook-verification workflows. It exposes a stable provider-scoped tool surface while keeping the Nylas API key inside the connector process.

## Upstream transport strategy

Nylas has an official remote MCP server. US applications use `https://mcp.us.nylas.com`; EU applications use `https://mcp.eu.nylas.com`. It uses Streamable HTTP with Bearer authentication and exposes typed email, calendar, contacts, and Notetaker tools.

This connector prefers the official Nylas MCP server for implemented capabilities. Every upstream MCP call is constrained to an explicit allowlist. If the official MCP call is unavailable or fails, the connector falls back to the corresponding official Nylas v3 REST endpoint while preserving the same local MCP tool contract.

The REST fallback endpoints are `https://api.us.nylas.com/v3` and `https://api.eu.nylas.com/v3`.

Official sources researched for this implementation:

- Nylas MCP server: https://developer.nylas.com/docs/dev-guide/mcp/
- Authentication: https://developer.nylas.com/docs/v3/auth/
- Granular scopes: https://developer.nylas.com/docs/dev-guide/scopes/
- API reference: https://developer.nylas.com/docs/reference/api/
- Messages: https://developer.nylas.com/docs/reference/api/messages/
- Threads: https://developer.nylas.com/docs/reference/api/threads/
- Drafts: https://developer.nylas.com/docs/reference/api/drafts/
- Events: https://developer.nylas.com/docs/reference/api/events/
- Rate limits: https://developer.nylas.com/docs/dev-guide/platform/rate-limits/
- Webhook signature verification: https://developer.nylas.com/docs/cookbook/use-cases/build/verify-webhook-signatures/

## Authentication and scopes

Server-side calls use a Nylas application API key as a Bearer token. A connected account is represented by a `grant_id`. The API key grants application-level access to connected grants, so it must never be exposed to the model, logs, examples, or client-visible tool output.

Nylas uses OAuth 2.0 to create grants for connected Gmail, Microsoft, Yahoo, iCloud, IMAP, Exchange, and supported conferencing accounts. Provider permissions are established when the user authorizes the grant. Request only scopes required by the enabled workflows.

Typical minimum Google scopes for this connector are:

- message reads: `https://www.googleapis.com/auth/gmail.readonly`
- draft create/update: `https://www.googleapis.com/auth/gmail.compose`
- message send: `https://www.googleapis.com/auth/gmail.send` or a documented more-permissive alternative
- calendar/event reads: `https://www.googleapis.com/auth/calendar.events.readonly` or `calendar.readonly`
- event create/update/delete: `https://www.googleapis.com/auth/calendar.events`
- contacts read: `https://www.googleapis.com/auth/contacts.readonly`

For Microsoft grants use the equivalent Nylas-documented Microsoft Graph scopes such as `Mail.Read`, `Mail.ReadWrite`, `Mail.Send`, `Calendars.Read`, `Calendars.ReadWrite`, and contacts permissions as required. Scope names vary by provider; the Nylas scope documentation is authoritative.

## Environment

Copy `.env.example` and set values through your secret manager or process environment.

- `NYLAS_API_KEY` — required; secret application API key.
- `NYLAS_REGION` — `us` (default) or `eu`.
- `NYLAS_GRANT_ID` — optional default grant. A tool call can provide `grant_id` instead.
- `NYLAS_TIMEOUT_MS` — 1,000–90,000 ms; default 30,000.
- `NYLAS_MAX_RETRIES` — 0–5; default 3.
- `NYLAS_APPROVE_WRITES` — allows ordinary WRITE tools without per-call approval when set to `true`.
- `NYLAS_APPROVE_HIGH_RISK` — server-side enablement for external-send operations. HIGH_RISK calls still require `approved: true` on every call.
- `NYLAS_ENABLE_DESTRUCTIVE` — server-side enablement for destructive tools. DESTRUCTIVE calls still require `approved: true` on every call.
- `NYLAS_WEBHOOK_SECRET` — optional secret used by `nylas.webhook.verify`.

## Installation and running

Requires Node.js 20 or later.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport locally. Configure any stdio-capable MCP client to launch `node dist/index.js` with credentials supplied through the process environment.

## Tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `nylas.grant.get` | Read grant metadata | READ | none |
| `nylas.message.list` | List/search messages with bounded pagination | READ | none |
| `nylas.message.get` | Read one message | READ | none |
| `nylas.thread.list` | List/search threads | READ | none |
| `nylas.draft.create` | Create a draft | WRITE | configurable/per-call |
| `nylas.draft.update` | Update a draft | WRITE | configurable/per-call |
| `nylas.draft.send` | Send a saved draft externally | HIGH_RISK | explicit per call + server enablement |
| `nylas.message.send` | Send an external email | HIGH_RISK | explicit per call + server enablement |
| `nylas.calendar.list` | List calendars | READ | none |
| `nylas.event.list` | List calendar events | READ | none |
| `nylas.event.get` | Read one event | READ | none |
| `nylas.event.create` | Create an event | WRITE | configurable/per-call |
| `nylas.event.update` | Update an event | WRITE | configurable/per-call |
| `nylas.event.delete` | Delete an event | DESTRUCTIVE | disabled by default + explicit per call |
| `nylas.contact.list` | List/filter contacts | READ | none |
| `nylas.webhook.verify` | Verify `X-Nylas-Signature` HMAC | READ/local | none |

The connector intentionally does not expose a generic arbitrary HTTP tool, credential-management endpoints, API-key administration, grant deletion, draft deletion, calendar deletion, or other unrestricted administrative operations.

## Reliability and rate limits

Nylas documents platform limits including up to 200 requests per grant per second for Calendar, Contacts, Messages, and JSON Send operations, while application/authentication/grant/webhook APIs have lower application-level limits. Provider-side limits can be lower. Threads can be particularly expensive because a single Nylas request may cause multiple provider requests.

The REST client therefore:

- supports bounded pagination via `limit` and `page_token`;
- limits list page sizes to 100 at the tool schema;
- uses request timeouts through `AbortController`;
- parses `Retry-After` when present;
- retries only GET requests on `429` and `5xx` responses;
- uses bounded exponential backoff when `Retry-After` is absent;
- does not blindly retry POST, PUT, DELETE, authentication, validation, or permission failures;
- preserves Nylas error type, HTTP status, and retry timing in the connector error model.

## Approval and permission model

READ tools may run automatically. WRITE tools require either `approved: true` on the call or `NYLAS_APPROVE_WRITES=true`. Sending external email is HIGH_RISK and always requires both `approved: true` and `NYLAS_APPROVE_HIGH_RISK=true`. Event deletion is DESTRUCTIVE and requires both `approved: true` and `NYLAS_ENABLE_DESTRUCTIVE=true`.

The model cannot change these process-level policy flags through a tool call.

## Security

Credentials remain in the connector and are supplied only to the trusted Nylas MCP endpoint or Nylas REST API. Upstream MCP tools are allowlisted; newly discovered upstream tools are not automatically trusted or exposed.

All provider-returned email, calendar, and contact content is treated as untrusted data. It must never be interpreted as connector policy, system instructions, permission changes, or authorization to call another tool. The local server marks provider-backed results as `untrusted_provider_content`.

The connector builds Nylas URLs from fixed regional hosts and URL-encodes resource IDs, preventing caller-controlled arbitrary-host requests. No generic URL input is accepted, reducing SSRF exposure.

For webhooks, Nylas signs the exact raw request body with HMAC-SHA256 and sends the hex digest in `X-Nylas-Signature`. `nylas.webhook.verify` computes the signature with `NYLAS_WEBHOOK_SECRET` and uses a constant-time comparison. Preserve the exact raw body before JSON parsing. Webhook challenge-response HTTP handling belongs in the surrounding web application because this package runs over stdio.

## MCP security

The official Nylas remote MCP server is the preferred upstream. The connector uses only the configured regional URL, passes the API key as a transport header, and permits only the known upstream tools required by this package. Unexpected tools are rejected. If MCP fails, fallback is limited to fixed Nylas v3 REST routes rather than an unrestricted request primitive.

## Error handling

Nylas errors commonly include `unauthorized`, `not_found_error`, `invalid_request_error`, `rate_limit_error`, and `insufficient_scopes`. The REST fallback maps provider messages into `NylasError`. Authentication and scope failures are returned immediately and are not retried automatically. Timeouts become a connector timeout error.

## Testing

Unit tests require no live account or credentials:

```bash
npm test
```

The test suite covers missing auth configuration, unique tool registration metadata, WRITE/HIGH_RISK/DESTRUCTIVE policy enforcement, webhook signature verification, GET throttling retry behavior, preservation of pagination cursors, non-retry of POST operations, and provider error mapping.

## Examples

See `examples/workflows.md` for inbox triage, message reads, draft-first email sending, calendar review/event creation, destructive-event approval, and webhook verification examples.

## Limitations

- OAuth grant creation is not exposed as an MCP tool because it requires provider authorization and user consent. Establish grants separately using Nylas Hosted OAuth, `@nylas/connect`, service accounts where supported, or another documented Nylas authentication method.
- Attachments, Scheduler, Notetaker, Smart Compose, folder mutation, contact mutation, message mutation/deletion, and webhook subscription management are intentionally outside this connector's current stable surface.
- The upstream Nylas MCP server has its own request timeout (documented as 90 seconds). The REST fallback uses `NYLAS_TIMEOUT_MS`.
- Provider-specific behavior and scopes vary. Always validate the grant's effective scopes before enabling write or send workflows.
