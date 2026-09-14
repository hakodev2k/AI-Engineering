# LiveKit MCP/API Connector

Reusable MCP server for operational LiveKit room and participant workflows. Credentials remain inside the connector.

## Official research and transport

Current official sources checked on 2026-09-15: JS Server SDK (`https://docs.livekit.io/reference/server-sdk-js/`), Room Service API (`https://docs.livekit.io/reference/other/roomservice-api/`), room management, participant management, access-token grants, webhooks/events, quotas/limits, and LiveKit's Docs MCP (`https://docs.livekit.io/reference/developer-tools/docs-mcp/`).

LiveKit publishes an official MCP server for documentation/search, but not an operational room-administration MCP server. LiveKit Agents can consume MCP servers, which is an agent-framework feature rather than a LiveKit Cloud administration transport. This connector therefore uses the official `livekit-server-sdk` (Twirp-backed server APIs) for operational capabilities.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `livekit.room.list` | READ | no |
| `livekit.room.create` | WRITE | configurable; default yes |
| `livekit.room.metadata.update` | WRITE | configurable; default yes |
| `livekit.room.delete` | DESTRUCTIVE | always; disabled by default |
| `livekit.participant.list` | READ | no |
| `livekit.participant.get` | READ | no |
| `livekit.participant.permissions.update` | HIGH_RISK | always |
| `livekit.participant.remove` | HIGH_RISK | always |
| `livekit.track.mute` | HIGH_RISK | always |
| `livekit.data.send` | HIGH_RISK | always |
| `livekit.access_token.issue` | HIGH_RISK | always |
| `livekit.webhook.verify` | READ | no |

## Authentication and grants

Set `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` in the process environment or secret manager. They are not accepted as tool arguments. The SDK signs short-lived request tokens from the key/secret. The secret must remain server-side.

LiveKit grants relevant to these workflows include `roomList`, `roomCreate`, `roomAdmin`, `roomJoin`, `canPublish`, `canSubscribe`, and `canPublishData`. Provider-side authorization remains authoritative and the connector cannot elevate it.

`livekit.access_token.issue` mints a participant token with a maximum connector TTL of 24 hours and explicit media/data grants. Returned tokens are sensitive output.

## Approval model

READ tools may auto-execute. WRITE tools require approval by default. HIGH_RISK tools always require human approval. DESTRUCTIVE tools additionally require `LIVEKIT_ENABLE_DESTRUCTIVE=true` outside the model.

Approval IDs are payload-bound HMAC-SHA256 values produced by a trusted host UI from `LIVEKIT_APPROVAL_SECRET`, the tool name, and canonicalized arguments. They cannot be generated without the secret or replayed for a different payload.

## Security

Participant permission changes can unpublish tracks; participant removal force-disconnects users and on LiveKit Cloud revokes their token; track mute is moderation; `data.send` emits an external room message; token issuance grants room access; room deletion disconnects participants. These operations are therefore gated.

All room, participant, metadata, and webhook content is untrusted provider data. It must not alter permissions, tool exposure, secrets, or system behavior.

LiveKit webhooks use `application/webhook+json` and an Authorization JWT containing a SHA-256 payload hash. `livekit.webhook.verify` passes the exact raw body and Authorization header to the official `WebhookReceiver`; do not parse and reserialize the body before verification.

## Reliability and rate limits

LiveKit currently documents a Server API limit of 1,000 requests/minute per project. Tools perform one bounded operation and do not fan out recursively. The official SDK owns transport/auth. Connector code does not blindly retry mutations, moderation actions, messages, token issuance, or deletes after ambiguous failures.

Metadata inputs are capped at LiveKit's documented 512 KiB limit. Lists and text payloads are also bounded by schemas.

## Installation and run

Requires Node.js 20+.
```bash
cd MCP-API/livekit
npm install
npm run build
npm test
npm start
```
The exposed server uses MCP stdio transport and can be launched by MCP clients that support local stdio tool servers.

## Configuration

Copy `.env.example`; populate secrets from a secure credential provider. `LIVEKIT_URL` must be HTTPS except `http://localhost` for local self-hosted development. `LIVEKIT_APPROVAL_SECRET` must be at least 16 characters when approvals are required and should be distinct from `LIVEKIT_API_SECRET`.

## Error handling

Strict Zod validation runs before provider calls. Approval failures are local. SDK authentication, permission, throttling, and provider failures surface as MCP errors without intentionally exposing credentials. Writes are not automatically retried.

## Testing

`npm test` requires no live credentials. Fakes cover registration, read execution, approval denial and acceptance, payload-bound anti-replay, destructive defaults, and permission validation.

## Limitations

This connector intentionally omits billing/account administration, SIP trunk mutation, ingress creation, egress/recording start, agent deployment, Analytics API, and arbitrary Twirp passthrough. LiveKit Analytics is plan-gated and not required for the core room-control workflow. The official Docs MCP is documented but not proxied because it does not provide these operational capabilities. The connector validates webhooks but does not host an HTTP listener.
