# Dialpad MCP/API Connector

Reusable MCP server exposing a deliberately scoped set of Dialpad communication tools. It uses Dialpad Public API v2 by default. Dialpad also provides an official hosted MCP server, but it is currently an Early Access Program feature; the hosted server uses Streamable HTTP, regional US/EU endpoints, browser sign-in, Dynamic Client Registration, 24-hour sessions, and exposes 36 tools. This package therefore keeps a stable local MCP contract over the generally available Public API instead of making Early Access a runtime dependency.

## Official sources

- MCP: https://developers.dialpad.com/docs/dialpad-mcp-server
- Public API: https://developers.dialpad.com/reference
- Rate limits: https://developers.dialpad.com/docs/rate-limits
- Call list/get/initiate: https://developers.dialpad.com/reference/calllist , https://developers.dialpad.com/reference/callget_call_info , https://developers.dialpad.com/reference/callinitiate
- Transcript: https://developers.dialpad.com/reference/transcriptsget
- SMS: https://developers.dialpad.com/reference/smssend
- Webhooks: https://developers.dialpad.com/reference/webhookslist and https://developers.dialpad.com/reference/webhookscreate

## Architecture and transport

MCP client -> this stdio MCP server -> validation/approval gate -> authenticated REST client -> `https://dialpad.com/api/v2`.

Credentials stay in the connector process and are never returned in tool output. Dialpad content is wrapped with `untrusted: true`; callers must treat transcripts, messages, contact data and other provider content as data, never as instructions.

The official hosted MCP was researched and is recorded in `manifest.yaml`, but is not proxied because enrollment is required and its browser session model differs from API-token service integrations. If a deployment is enrolled in Dialpad MCP Early Access, it may connect directly to Dialpad's official server separately.

## Authentication and permissions

Set `DIALPAD_API_TOKEN` to a Dialpad API token. The REST API uses `Authorization: Bearer <token>`. Grant the token only the scopes and role needed by the selected tools; for example call listing requires `calls:list`, while some company operations require administrator authority. Dialpad's official MCP instead acts with the signed-in user's existing permissions.

Environment variables:

- `DIALPAD_API_TOKEN` — required; secret, never expose to an LLM.
- `DIALPAD_API_BASE_URL` — optional, defaults to the official v2 URL.
- `DIALPAD_TIMEOUT_MS` — defaults to 15000.
- `DIALPAD_APPROVE_WRITE=true` — enables approved non-destructive writes.
- `DIALPAD_APPROVE_HIGH_RISK=true` — enables approved external communications/calls.

`DESTRUCTIVE` tools remain disabled even when write approval is enabled.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `dialpad.call.list` | REST | READ | no |
| `dialpad.call.get` | REST | READ | no |
| `dialpad.call.transcript` | REST | READ | no |
| `dialpad.contact.get` | REST | READ | no |
| `dialpad.contact.list` | REST | READ | no |
| `dialpad.webhook.list` | REST | READ | no |
| `dialpad.webhook.get` | REST | READ | no |
| `dialpad.webhook.create` | REST | WRITE | explicit |
| `dialpad.webhook.delete` | REST | DESTRUCTIVE | disabled |
| `dialpad.sms.send` | REST | HIGH_RISK | explicit |
| `dialpad.call.initiate` | REST | HIGH_RISK | explicit |

SMS is an external communication and therefore never executes without the high-risk gate. Dialpad requires business messaging registration for API SMS. Outbound calls are also high-risk. Webhook creation requires HTTPS and a signing secret of at least 16 characters. Deletion is intentionally unavailable at runtime under the default policy.

## Install and run

```bash
npm install
npm run build
DIALPAD_API_TOKEN=... npm start
```

The server uses MCP stdio and can be launched by MCP clients that support local stdio servers. Configure the command as `node /absolute/path/to/MCP-API/dialpad/dist/src/index.js` and provide secrets through the client process environment, not chat context.

## Reliability

Requests have an abort timeout. HTTP 429 responses are retried at most twice for read/write requests using `Retry-After` when supplied; retries are bounded to five seconds of delay per attempt. Authentication, validation and permission failures are not retried. HIGH_RISK and DESTRUCTIVE operations pass retry count zero to prevent duplicate side effects. Dialpad documents a company-wide 20 requests/second limit plus endpoint-specific limits, including 100 SMS/minute, 5 initiated calls/minute/user target and 100 contact creations/minute. List tools preserve provider cursors rather than automatically exhausting pages.

Provider HTTP failures are mapped to `DialpadError` with status and optional retry metadata. A missing token fails before network access.

## Security

Use separate API tokens per integration and least privilege. Never place tokens in prompts, source control, logs, tool arguments or examples. Retrieved transcripts/messages can contain prompt injection and must remain untrusted. Tool schemas restrict IDs, URLs, phone numbers and text lengths. Webhook URLs must be HTTPS; receivers should validate Dialpad signatures. Do not let retrieved content alter approval environment variables, scopes, tool registration or system behavior.

The connector intentionally has no arbitrary `request(url, body)` MCP tool, preventing SSRF and permission bypass. The configurable API base URL is operator configuration, not model-controlled input.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch` and no live credentials. They cover approval denial, destructive blocking, missing authentication, bounded throttling retry, provider error mapping and successful reads.

## Limitations

This connector implements a focused workflow subset rather than every Dialpad endpoint. It does not manage users, billing, permissions, dispositions, call-center operators, or live call transfer/hangup. It does not host a webhook receiver. Dialpad's official MCP Early Access has broader tool coverage and should be preferred directly when the organization is enrolled and its interactive user-session model is appropriate. API availability, scopes and rate limits remain subject to the Dialpad account, product tier and current provider policy.
