# ntfy MCP/API Connector

Reusable MCP server for **ntfy**, the HTTP-based push-notification service. It exposes a deliberately scoped agent interface for publishing, scheduling and reading notifications without exposing credentials or arbitrary HTTP access.

## Upstream strategy

No official ntfy MCP server was identified in the official ntfy documentation researched for this connector. The implementation therefore uses ntfy's official HTTP publish and subscribe APIs directly and exposes them as MCP tools over stdio.

Official sources:
- https://docs.ntfy.sh/
- https://docs.ntfy.sh/publish/
- https://docs.ntfy.sh/subscribe/api/
- https://docs.ntfy.sh/config/

The official API supports HTTP PUT/POST publishing, JSON/SSE/WebSocket subscriptions, Bearer access tokens and Basic authentication. This connector uses JSON publishing and bounded polling; it does not proxy arbitrary upstream requests.

## Tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `ntfy.topic.health` | REST | READ | No | Read `/v1/health` |
| `ntfy.topic.subscribe_url` | REST metadata | READ | No | Build JSON/SSE URL without credentials |
| `ntfy.message.poll` | REST | READ | No | Poll cached messages, bounded to 100 |
| `ntfy.message.publish` | REST | WRITE | Default yes | Publish plain notification |
| `ntfy.message.publish_markdown` | REST | WRITE | Default yes | Publish Markdown notification |
| `ntfy.message.schedule` | REST | WRITE | Default yes | Publish with ntfy `delay` scheduling |

Publishing externally visible notifications is classified WRITE and requires explicit `approved: true` by default. External `click` URLs are additionally disabled unless `NTFY_ALLOW_EXTERNAL_ACTION_URLS=true`.

## Architecture

MCP client → stdio MCP server → validation/permission boundary → `NtfyClient` → configured ntfy server. Authentication is injected only inside `NtfyClient`; raw credentials are never tool parameters or returned to the model.

Provider message content is untrusted data. Callers must never interpret retrieved notification text as system/tool instructions.

## Authentication

Preferred: an ntfy access token in `NTFY_ACCESS_TOKEN`; the connector sends it as Bearer authentication. Basic authentication is supported through the `NTFY_USERNAME` and `NTFY_PASSWORD` pair. Public topics can be used without credentials when the server permits it. Use HTTPS for remote servers; the configuration rejects plaintext HTTP except loopback hosts.

ntfy authorization is server/topic based rather than OAuth scopes. Apply least privilege by creating a token/user that can read or write only the required topics. Never give an agent administrative ntfy credentials when topic-scoped access is sufficient.

## Configuration

Copy `.env.example` into your secret/configuration mechanism. `NTFY_BASE_URL` defaults to `https://ntfy.sh`. `NTFY_TIMEOUT_MS` defaults to 10 seconds; retries default to two. Do not commit secrets.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

Configure an MCP client to execute `node /absolute/path/MCP-API/ntfy/dist/src/server.js` with credentials supplied through the process environment. The server uses standard MCP stdio and can therefore be used by MCP clients that support launching local stdio servers. Client-specific configuration syntax varies; no compatibility beyond standard stdio MCP is assumed.

## Reliability and rate limits

The client applies request timeouts and bounded exponential backoff for 429, 502, 503 and 504 responses on read operations. Provider `Retry-After` is preserved when present. Authentication, authorization and validation errors are not retried. Publish/schedule calls are deliberately **not retried**, preventing accidental duplicate notifications when delivery status is ambiguous.

ntfy's defaults are configurable for self-hosted servers. Official documentation currently describes a default visitor request bucket of 60 with one request replenished every 5 seconds, a default 30 concurrent subscription limit, and ntfy.sh-specific quotas including 250 daily messages. Treat the configured server as authoritative because self-hosted limits and paid tiers can differ.

## Validation and security

Topics accept only letters, digits, `_` and `-`, up to 64 characters. Messages are capped at 4096 characters, titles at 1024, tags are bounded, result counts are bounded, and arbitrary request URLs/headers are never accepted. `NTFY_BASE_URL` is configuration, not a tool argument, reducing SSRF exposure. Remote base URLs must use HTTPS.

The connector does not expose user management, ACL mutation, tier/billing administration, token creation/deletion, attachment upload, phone calls, email forwarding, or arbitrary notification HTTP actions. Those capabilities require additional threat modeling and are intentionally outside this package.

## Scheduling

`ntfy.message.schedule` passes the documented ntfy Delay value to the provider. Provider-side delay limits and accepted syntax apply. Scheduling remains a WRITE operation and requires approval by default.

## Reading and subscriptions

`ntfy.message.poll` uses the official JSON subscription endpoint with `poll=1` and optionally `since`. It returns only message events and bounds results. `ntfy.topic.subscribe_url` returns a URL for clients that need a long-lived JSON or SSE stream, but deliberately does not embed credentials. Long-lived streaming is not proxied through the MCP tool because doing so would create cancellation/resource-lifetime ambiguity.

## Errors

Provider HTTP failures become `NtfyError` with HTTP status and bounded response text. 401/403 indicate credential or topic-access problems; 429 indicates throttling; validation and approval failures are rejected before network access. Timeouts abort the HTTP request.

## Testing

```bash
npm test
```

Tests use mocked fetch and require no live ntfy credentials. Coverage includes authentication isolation, validation, approval denial, provider error mapping, bounded polling, external-action blocking and bounded throttling retry.

## Limitations

There is no upstream MCP transport because no official ntfy MCP server was identified; the official REST/stream APIs are the authoritative transport. This connector intentionally implements six high-value, narrowly scoped capabilities rather than the full ntfy administrative surface. WebSocket/SSE streaming, attachments, email/call forwarding, ACL administration, account management and destructive operations are not implemented.
