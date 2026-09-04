# Pusher MCP/API Connector

Reusable MCP server for **Pusher Channels**. It exposes a curated, provider-scoped tool surface for channel discovery, presence inspection, event publishing, authenticated-user messaging, connection termination, and webhook verification.

## Transport strategy

No official Pusher MCP server was identified in current official Pusher documentation. This connector therefore uses the official **Pusher Channels Node.js REST SDK** (`pusher` / `pusher-http-node`) and exposes those capabilities as MCP tools over stdio.

Official sources researched:

- Pusher Channels HTTP API: https://pusher.com/docs/channels/server_api/http-api/
- Pusher server libraries: https://pusher.com/docs/channels/channels_libraries/libraries/
- Official Node SDK: https://github.com/pusher/pusher-http-node
- User authentication: https://pusher.com/docs/channels/server_api/authenticating-users/
- Channel authorization: https://pusher.com/docs/channels/server_api/authorizing-users/
- Webhooks: https://pusher.com/docs/channels/server_api/webhooks/
- Quotas: https://pusher.com/legal/quotas/

The connector does not expose arbitrary REST calls.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `pusher.channel.list` | SDK `get(/channels)` | READ | No |
| `pusher.channel.get` | SDK `get(/channels/{channel})` | READ | No |
| `pusher.presence.users.list` | SDK `get(/channels/{channel}/users)` | READ | No |
| `pusher.event.publish` | SDK `trigger` | WRITE | Yes |
| `pusher.event.publish_batch` | SDK `triggerBatch` | WRITE | Yes |
| `pusher.user.event.publish` | SDK `sendToUser` | WRITE | Yes |
| `pusher.user.connections.terminate` | SDK `terminateUserConnections` | HIGH_RISK | Yes |
| `pusher.webhook.verify` | SDK `webhook().isValid()` | READ | No |

Pusher documents a maximum of 100 target channels for a single multi-channel trigger and 10 events for a batch trigger; the MCP schemas enforce those bounds. Event and channel names are length-bounded. Presence-user lookup requires a `presence-` channel.

## Architecture

```text
MCP client
   ↓ stdio
Pusher connector
   ├─ strict MCP schemas
   ├─ risk/approval policy
   ├─ credential isolation
   └─ official Pusher Node SDK
          ↓ signed HTTPS REST
      Pusher Channels
```

Provider content returned from channels, presence state, or webhook bodies is untrusted data and must never be treated as instructions that can change permissions or tool policy.

## Authentication

Pusher Channels server operations use application credentials:

- `PUSHER_APP_ID`
- `PUSHER_KEY`
- `PUSHER_SECRET`
- `PUSHER_CLUSTER`

These values stay inside the connector and official SDK. They are never accepted as MCP tool parameters and are never returned to the model.

Use credentials for the narrowest Pusher application required by the workload. This connector cannot increase permissions beyond the configured app.

## Environment variables

```text
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
PUSHER_USE_TLS=true
PUSHER_TIMEOUT_MS=30000
PUSHER_READ_ONLY=true
PUSHER_ALLOW_WRITE=false
PUSHER_APPROVAL_MODE=required
```

TLS is enabled by default. Timeouts are constrained to 1–120 seconds.

## Installation

```bash
cd MCP-API/pusher
npm install
npm run build
```

Node.js 20+ is required by this connector. The current official `pusher` package used here is 5.3.x.

## Running

```bash
npm start
```

The server uses MCP stdio. See `examples/mcp-client.json` for a client configuration.

## Permission model

`READ` operations may run automatically. Publishing messages is externally visible behavior, so `WRITE` operations are blocked by default and require both:

```text
PUSHER_READ_ONLY=false
PUSHER_ALLOW_WRITE=true
```

When `PUSHER_APPROVAL_MODE=required` (the default), every write or high-risk call must also contain:

```json
{
  "approval": {
    "confirmed": true,
    "reason": "Human operator approved this exact operation"
  }
}
```

Terminating a user's live connections is classified `HIGH_RISK` because it disrupts active sessions. It requires explicit human approval. The connector exposes no application deletion, credential rotation, billing, or other destructive operation.

## Usage examples

Read channel state:

```json
{
  "name": "pusher.channel.get",
  "arguments": {
    "channel": "presence-support",
    "info": "user_count"
  }
}
```

Publish after human approval:

```json
{
  "name": "pusher.event.publish",
  "arguments": {
    "channels": ["private-order-123"],
    "event": "order.updated",
    "data": { "status": "shipped" },
    "approval": {
      "confirmed": true,
      "reason": "Approved notification for order 123"
    }
  }
}
```

Verify a webhook:

```json
{
  "name": "pusher.webhook.verify",
  "arguments": {
    "key": "webhook-x-pusher-key",
    "signature": "64-hex-character-signature",
    "rawBody": "{\"time_ms\":1327078148132,\"events\":[]}"
  }
}
```

The webhook tool verifies the Pusher HMAC signature before returning parsed events.

## Reliability and error handling

The official SDK signs HTTP requests with the configured app secret and uses a bounded request timeout. The connector maps authentication/signature, authorization, and throttling failures to actionable errors. It does not automatically retry write or high-risk operations, preventing duplicate publishes or repeated connection termination.

Read operations should be retried by callers only with bounded exponential backoff. Do not retry validation, authentication, or permission failures until the underlying configuration changes.

## Rate limits and quotas

Pusher Channels plans define message and concurrent-connection quotas. A published message counts both the API request and downstream deliveries, so broadcasting to many subscribers can consume quota rapidly. The connector avoids polling-heavy designs and supports application-state queries directly through the official SDK.

Use channel and presence queries sparingly for monitoring and prefer Pusher webhooks for event-driven state changes. Pusher webhook delivery retries non-2xx responses with exponential backoff for a limited period; webhook consumers should therefore be idempotent.

## Security considerations

- App credentials never enter model prompts or tool input.
- No arbitrary HTTP endpoint or raw signed-request tool is exposed.
- Write mode is disabled by default.
- Human approval is required for external messages and connection termination.
- Webhook signatures are validated before event content is trusted as authentic Pusher data.
- Retrieved channel names, user identifiers, event payloads, and webhook content remain untrusted data.
- The connector does not expose `authorizeChannel` or `authenticateUser` as agent tools because those methods mint bearer authorization material and belong in application-controlled authentication endpoints.
- End-to-end encryption master keys are intentionally unsupported as MCP parameters and must never be exposed to an agent.

## Testing

```bash
npm test
```

Unit tests require no live Pusher credentials. They verify required configuration, safe defaults, timeout validation, write denial, approval requirements, risk classification, curated tool registration, and the destructive-tool block.

For live smoke testing, use a disposable Pusher Channels application and keep write mode disabled until read operations have been verified.

## Limitations

- Only Pusher Channels is implemented; Pusher Beams is a separate product/API and is not claimed here.
- There is no upstream MCP dependency because no official Pusher MCP server was found in the researched official sources.
- Channel authorization and user-auth token minting are deliberately not exposed to AI agents.
- The connector does not provide dashboard administration, app creation/deletion, billing, or credential management.
- Provider-side quotas vary by Pusher plan and remain authoritative.
