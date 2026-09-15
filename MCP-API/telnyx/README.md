# Telnyx MCP/API Connector

Reusable MCP connector for Telnyx communications. It exposes a deliberately scoped subset of high-value operations while keeping credentials in the connector process and treating all provider data as untrusted.

## Upstream strategy

Telnyx provides an official hosted MCP endpoint at `https://api.telnyx.com/v2/mcp` and an official local MCP server. Official Telnyx material describes MCP coverage for messaging, voice/call control, phone numbers and AI assistants. This package exposes a stable provider-scoped contract and currently executes the selected operations through Telnyx API v2 so schemas, risk gates, retries and approval boundaries remain deterministic. The official MCP endpoint can be used independently by clients that prefer dynamic Telnyx endpoint discovery; this connector does not auto-discover or trust new upstream tools.

Official sources researched for this implementation: Telnyx MCP server/release documentation, Telnyx API-key documentation, Telnyx messaging rate-limit documentation, and Telnyx Voice/Messaging API material. API v2 uses a bearer API key. Account/API-key permissions remain authoritative.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `telnyx.phone_number.search` | READ | no |
| `telnyx.phone_number.list` | READ | no |
| `telnyx.messaging_profile.list` | READ | no |
| `telnyx.message.get` | READ | no |
| `telnyx.message.send` | HIGH_RISK | explicit |
| `telnyx.call.get` | READ | no |
| `telnyx.call.create` | HIGH_RISK | explicit |
| `telnyx.call.hangup` | HIGH_RISK | explicit |
| `telnyx.assistant.list` | READ | no |
| `telnyx.assistant.get` | READ | no |

Sending messages and placing/terminating calls affect external parties and therefore always require `approved: true`. Phone-number purchasing, assistant mutation, connection mutation, billing/security changes and deletion are intentionally not exposed.

## Authentication and configuration

Create a Telnyx API v2 key with only the permissions needed by the operations you intend to use. Store it as `TELNYX_API_KEY`; never expose it to prompts, browser code, logs, or tool output. Optional settings are shown in `.env.example`. `TELNYX_API_BASE` defaults to the official API v2 origin and should not be changed to an untrusted host.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run typecheck
npm test
TELNYX_API_KEY=... npm start
```

The server uses MCP stdio transport, suitable for MCP clients that can launch a local process. Configure the client to run this package's start command and inject secrets through its secure environment configuration.

## Reliability and rate limits

The client enforces request timeouts, supports caller cancellation, maps Telnyx errors, and performs at most three attempts with bounded exponential backoff for throttling/transient server/network failures. It does not retry validation, authentication, authorization, not-found, conflict, or semantic request failures. `Retry-After` is preserved when supplied. Pagination parameters are bounded to avoid accidental bulk retrieval.

Messaging throughput is sender/account dependent. Telnyx may queue messages when sender throughput is exceeded; applications should additionally enforce workload-specific queues and budgets. Never treat provider acceptance as proof of final delivery.

## Security

Credentials remain in `TelnyxClient`. Tool inputs use strict validation including E.164 numbers, bounded IDs/text/page sizes, HTTPS webhook/media URLs, and provider-relative API paths to reduce SSRF risk. Retrieved Telnyx content is wrapped with `untrusted: true`; callers must never interpret message bodies, assistant content, or metadata as system instructions. No arbitrary URL/request tool is exposed. High-risk operations require explicit approval. Destructive operations are absent and disabled by policy.

For outbound communications, applications remain responsible for consent, recipient authorization, anti-spam/telemarketing rules, emergency-calling restrictions, fraud controls, destination restrictions, and applicable carrier/regulatory requirements.

## Examples

Read message:
```json
{"tool":"telnyx.message.get","input":{"messageId":"MESSAGE_ID"},"permission":"READ","approval":false}
```

Send SMS after human approval:
```json
{"tool":"telnyx.message.send","input":{"from":"+15551234567","to":"+15557654321","text":"Service update","approved":true},"permission":"HIGH_RISK","approval":true}
```

Start a call after human approval:
```json
{"tool":"telnyx.call.create","input":{"connectionId":"CONNECTION_ID","from":"+15551234567","to":"+15557654321","webhookUrl":"https://example.com/telnyx/events","approved":true},"permission":"HIGH_RISK","approval":true}
```

Outputs preserve Telnyx response JSON under a provider-data envelope. Provider errors return a sanitized message, HTTP status and retry-after value when available.

## Testing

`npm test` uses mocked fetch responses and requires no live credentials. Tests cover tool registration, schema validation, approval enforcement, successful reads, auth failure behavior, throttling retries and SSRF-resistant relative-path validation.

## Limitations

This connector intentionally implements a small operational surface rather than the entire Telnyx API. Webhook receiving/signature verification is deployment-specific and is not implemented as an MCP tool. Number purchasing, billing, security configuration, API-key management and destructive resource operations are excluded. The official Telnyx MCP server may expose additional capabilities; they are not automatically enabled here.
