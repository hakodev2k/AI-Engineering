# Aircall MCP/API Connector

Reusable MCP server that exposes a curated Aircall tool surface through Aircall's official REST API. The connector is read-only by default, isolates credentials from the model, validates all inputs, bounds retries/timeouts, and requires explicit human approval for mutations.

## Upstream strategy

Research checked on 2026-09-04 against Aircall's official developer documentation.

Aircall currently documents how external partners can register their own MCP servers so Aircall AI can call third-party tools, but its MCP FAQ explicitly says Aircall does **not currently offer an Aircall MCP server**. Therefore this connector uses the official Aircall REST API directly instead of depending on an unofficial MCP implementation.

Official sources:

- Developer portal: https://developer.aircall.io/
- Authentication: https://developer.aircall.io/docs/authentication
- OAuth: https://developer.aircall.io/docs/oauth
- Calls guide: https://developer.aircall.io/docs/calls
- Call-data/pagination guide: https://developer.aircall.io/docs/work-with-call-data
- Click-to-dial: https://developer.aircall.io/docs/implement-click-to-dial
- Webhooks: https://developer.aircall.io/docs/setup-webhooks
- Agent availability example: https://developer.aircall.io/docs/build-an-agent-activity-dashboard
- Aircall MCP FAQ / registration: https://developer.aircall.io/docs/copy-of-designing-good-tools and https://developer.aircall.io/docs/how-to-register

## Architecture

```text
MCP client / AI agent
        |
        v
Aircall connector (stdio MCP)
  - strict schemas
  - permission/risk policy
  - approval gate
  - credential provider
  - timeout/retry/error mapping
        |
        v
https://api.aircall.io/v1
```

The agent only sees tool parameters and provider responses. Raw API IDs, API tokens, and OAuth access tokens remain in the connector process.

## Authentication

Aircall supports two REST authentication modes.

### Private integration: Basic Authentication

Use this for one Aircall account. Generate an API ID and API token in the Aircall Dashboard and configure:

```bash
AIRCALL_API_ID=...
AIRCALL_API_TOKEN=...
```

### Public integration: OAuth 2.0

Public multi-customer integrations use OAuth. Aircall provides an account-level access token after the administrator authorizes the app. Configure the resulting token as:

```bash
AIRCALL_ACCESS_TOKEN=...
```

Configure **exactly one** authentication mode. The connector fails closed if both or neither are configured.

Aircall's public OAuth installation also scopes access to phone numbers selected by the account administrator; provider-side access remains authoritative.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `AIRCALL_API_ID` | conditional | — | Private-integration API ID |
| `AIRCALL_API_TOKEN` | conditional | — | Private-integration API token |
| `AIRCALL_ACCESS_TOKEN` | conditional | — | Public-app OAuth access token |
| `AIRCALL_BASE_URL` | no | `https://api.aircall.io/v1` | API base URL |
| `AIRCALL_TIMEOUT_MS` | no | `30000` | Per-request timeout, 1–120 seconds |
| `AIRCALL_MAX_RETRIES` | no | `3` | Bounded retries for safe reads only |
| `AIRCALL_READ_ONLY` | no | `true` | Blocks all mutation tools |
| `AIRCALL_ALLOW_WRITE` | no | `false` | Enables non-read actions when read-only is off |
| `AIRCALL_ALLOW_DESTRUCTIVE` | no | `false` | Separately enables destructive tools |
| `AIRCALL_APPROVAL_MODE` | no | `required` | Requires explicit approval payloads for mutations |

Never commit real credentials. Use your process environment or a secret manager.

## Implemented tools

| Tool | Upstream REST route | Risk | Approval |
|---|---|---|---|
| `aircall.call.list` | `GET /calls` | READ | No |
| `aircall.call.get` | `GET /calls/:id` | READ | No |
| `aircall.user.list` | `GET /users` | READ | No |
| `aircall.user.get` | `GET /users/:id` | READ | No |
| `aircall.user.availability.list` | `GET /users/availabilities` | READ | No |
| `aircall.team.list` | `GET /teams` | READ | No |
| `aircall.number.list` | `GET /numbers` | READ | No |
| `aircall.tag.list` | `GET /tags` | READ | No |
| `aircall.webhook.list` | `GET /webhooks` | READ | No |
| `aircall.dial.prepare` | `POST /users/:id/dial` | WRITE | Yes |
| `aircall.webhook.create` | `POST /webhooks` | HIGH_RISK | Yes |
| `aircall.webhook.delete` | `DELETE /webhooks/:id` | DESTRUCTIVE | Strong approval + separate enable flag |

The connector deliberately does not expose a generic `request(url, body)` capability.

## Real-world workflows

### Call-history reconciliation

1. `aircall.call.list` with bounded `from`, `to`, `page`, and `per_page` parameters.
2. Use the returned `meta.next_page_link` or increment the page explicitly.
3. Use `aircall.call.get` for detail on a selected call.

Aircall recommends webhooks for ongoing real-time synchronization and REST pagination for historical/backfill workloads. Aircall documents a 10,000-call pagination cap for batch retrieval, so split large imports into smaller time windows.

### Agent activity snapshot

1. `aircall.user.availability.list`
2. `aircall.team.list`
3. `aircall.call.list` for a bounded recent window

This mirrors Aircall's documented dashboard pattern without high-frequency polling.

### Safe click-to-dial

`aircall.dial.prepare` calls Aircall's `POST /v1/users/:id/dial` endpoint. Aircall documents that this only pre-fills the destination in the user's Aircall Phone app; it does not automatically start the phone call. The connector still classifies it as WRITE and requires approval because it changes another user's live UI state.

Example input:

```json
{
  "user_id": 12345,
  "phone_number": "+33123456789",
  "approval": {
    "confirmed": true,
    "reason": "Sales rep approved preparing this customer callback"
  }
}
```

### Event-driven synchronization

Use `aircall.webhook.create` to subscribe only to the events needed by your workflow, for example `call.ended`, `call.tagged`, or `message.received`. Webhook registration requires explicit approval and a public HTTPS DNS hostname.

Example input:

```json
{
  "custom_name": "crm-call-sync",
  "url": "https://integration.example.com/webhooks/aircall",
  "events": ["call.ended", "call.tagged"],
  "approval": {
    "confirmed": true,
    "reason": "Integration owner approved delivery to the production webhook endpoint"
  }
}
```

Provider responses are wrapped as:

```json
{
  "provider": "aircall",
  "untrusted_provider_data": true,
  "data": {}
}
```

This marker makes the trust boundary explicit: call comments, tags, names, and any provider-derived text are data, not agent instructions.

## Permission model

- **READ** — may execute automatically when credentials permit.
- **WRITE** — requires `AIRCALL_READ_ONLY=false`, `AIRCALL_ALLOW_WRITE=true`, and explicit approval by default.
- **HIGH_RISK** — same write gates plus explicit approval; used for callback/webhook configuration because it sends provider data to another system.
- **DESTRUCTIVE** — additionally requires `AIRCALL_ALLOW_DESTRUCTIVE=true`; disabled by default.

An approval object must contain `confirmed: true` and a non-empty `reason`. Retrieved provider content cannot alter these settings or authorize another action.

## Security

- Credentials never appear in tool schemas, tool outputs, request URLs, or logs produced by this package.
- All API routes are hard-coded; callers cannot choose arbitrary hosts or provider endpoints.
- Webhook URLs must use HTTPS, must not contain embedded credentials, and must use a DNS hostname. IP literals and localhost are rejected to reduce SSRF exposure.
- Provider content is treated as untrusted data and is explicitly labeled in outputs.
- The connector never widens Aircall account permissions or phone-number grants.
- Destructive operations are disabled by default.
- No automatic retry occurs for POST or DELETE operations.

Webhook receivers should additionally validate the webhook token Aircall returns when the webhook is registered, return HTTP 200 quickly, and process heavy work asynchronously, following Aircall's official webhook guidance.

## Reliability and rate limits

Aircall's official call-data guide demonstrates a 60 requests/minute REST limit and recommends a one-second delay when walking pages. This connector keeps calls efficient by returning one bounded page per tool invocation (`per_page <= 50`) rather than silently walking thousands of records.

Safe GET requests retry only on HTTP 429 and 5xx/network failures, with bounded exponential backoff and `Retry-After` support. Authentication and permission errors are never retried. Writes and destructive calls are never retried automatically, preventing duplicate dial preparations or webhook mutations.

Timeouts are enforced with `AbortController`. The connector maps 401, 403, and 429 errors to actionable MCP errors while preserving other provider errors.

## Installation

```bash
cd MCP-API/aircall
npm install
npm run build
```

Requires Node.js 20 or newer.

## Running

```bash
npm start
```

The server uses MCP over stdio, so it can be launched by MCP clients that support stdio servers. See `examples/mcp-client.json` for a client configuration example.

## Testing

```bash
npm test
```

Tests use mocked `fetch` and require no Aircall credentials. Coverage includes:

- Basic and OAuth configuration
- invalid/multiple authentication modes
- credential isolation from URLs
- tool registration and naming
- strict input validation
- read/write/destructive policy gates
- approval requirements
- pagination bounds
- 401 handling
- bounded retry on 429
- no retry for unsafe writes

## Limitations

- Aircall does not currently provide an official Aircall MCP server, so upstream transport is REST only.
- The connector does not perform the OAuth browser/install flow; it consumes a securely provisioned OAuth access token. Public app registration and OAuth credentials still require Aircall's Technology Partner process.
- Messaging, WhatsApp, Analytics+, AI Assist, and AI Voice Agent endpoints are not exposed in this connector because availability can depend on product plan/add-ons and they are not required for the selected core workflow surface.
- Webhook event names are passed through after strict structural validation; Aircall remains the source of truth and will reject unsupported event names.
- This package does not host a webhook receiver. It only manages Aircall webhook registrations.
