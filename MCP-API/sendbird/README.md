# Sendbird MCP/API Connector

Reusable MCP server for Sendbird Chat Platform API v3. The connector exposes a small, agent-oriented surface for users, group channels, and messages while keeping Sendbird credentials inside the connector process.

## Transport and official sources

No official Sendbird MCP server was identified during the 2026-09-21 research pass, so implemented capabilities use Sendbird's official REST Platform API rather than an unofficial MCP dependency. Official documentation used: `https://sendbird.com/docs/chat/platform-api/v3/prepare-to-use-api`, `https://sendbird.com/docs/chat/platform-api/v3/application/understanding-rate-limits/rate-limits`, and the Platform API v3 user/channel/message documentation under `https://sendbird.com/docs/chat/platform-api/v3`.

API base URL: `https://api-{application_id}.sendbird.com/v3`. Authentication uses the `Api-Token` request header. Sendbird documents master and secondary API tokens; prefer a secondary token for routine integration access. This connector never returns or logs the configured token.

## Capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `sendbird.user.list` | REST | READ | No |
| `sendbird.user.get` | REST | READ | No |
| `sendbird.user.create` | REST | WRITE | Configurable, default required |
| `sendbird.user.update` | REST | WRITE | Configurable, default required |
| `sendbird.channel.list` | REST | READ | No |
| `sendbird.channel.get` | REST | READ | No |
| `sendbird.channel.create` | REST | WRITE | Configurable, default required |
| `sendbird.message.list` | REST | READ | No |
| `sendbird.message.send` | REST | HIGH_RISK | Always explicit |

Deletion, token administration, moderation, application configuration, billing, and arbitrary HTTP tools are intentionally not exposed.

## Architecture

`server.ts` defines strict MCP schemas and scoped tools. `policy.ts` owns validation and approval enforcement. `client.ts` owns credentials, the fixed provider origin, timeout handling, provider errors, and bounded read-only throttling retries. The fixed origin plus relative-only paths prevents callers from turning the connector into an SSRF proxy. Provider content is wrapped as untrusted data.

## Authentication and environment

Copy `.env.example` values into your secure runtime environment. Required: `SENDBIRD_APPLICATION_ID` and `SENDBIRD_API_TOKEN`. Optional: `SENDBIRD_TIMEOUT_MS` (default 10000) and `SENDBIRD_WRITE_APPROVAL_REQUIRED` (default true). Sendbird API tokens are application credentials rather than OAuth scopes, so there is no OAuth scope list to request. Keep the token in a secret manager/environment injection layer and out of prompts, tool arguments, source control, telemetry, and logs.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport, so clients capable of launching a stdio MCP process can configure the command as `node <connector-path>/dist/server.js` with credentials injected into the process environment. Compatibility depends on the client's MCP stdio support; no provider-specific client integration is required.

## Permission and approval model

READ tools execute without approval. WRITE tools call the policy gate; approval is required by default and may only be relaxed by trusted operator configuration, not by retrieved provider content. `sendbird.message.send` is HIGH_RISK because it communicates externally and therefore always requires `approved: true`, even if ordinary WRITE approval is relaxed. The connector exposes no DESTRUCTIVE tool.

`approved` is an execution boundary signal expected to be supplied only after the host has obtained human approval. Hosts should not let an LLM self-assert approval.

## Reliability and rate limits

Sendbird rate limits vary by plan/MAU and endpoint. The official docs publish default per-method limits and return `429` with `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `X-RateLimit-RetryAfter`. The client preserves the retry-after value in `SendbirdError` and performs at most two bounded retries for GET requests only. Writes are never blindly retried, avoiding duplicate users/channels/messages. Requests have a configurable timeout and accept cancellation signals internally. Pagination tokens are exposed on list tools where Sendbird uses them.

Authentication/permission/validation errors are surfaced without retry. Provider error messages are treated as data, not instructions.

## Security

The API host is derived only from a validated application ID; tools cannot provide arbitrary URLs. IDs are trimmed, length-bounded, control-character rejected, and path values are URL encoded. Tool schemas cap list sizes and message length. Credentials are isolated in `SendbirdClient`. External messages require human approval. Sendbird-returned text, nicknames, channel names, and messages can contain prompt injection and are explicitly marked `untrusted_provider_data`; consumers must not use them to change system policy, permissions, approval state, or tool configuration.

The connector does not implement webhooks. If webhook support is added later, signature/authenticity verification must be implemented before event payloads are trusted.

## Testing

```bash
npm test
```

Unit tests require no live credentials and cover authentication configuration, validation, query pagination encoding, READ behavior, WRITE denial, and HIGH_RISK approval. Network behavior is isolated in the client; integration testing against a real Sendbird application should use a dedicated non-production application and secondary API token.

## Examples

See `examples/workflows.md` for read and approved-write flows and expected output shape.

## Limitations

This connector intentionally covers useful Chat Platform API v3 workflows rather than every Sendbird product or endpoint. It does not expose Sendbird Calls, Live, Business Messaging, moderation/admin configuration, destructive operations, token management, file upload, or an unofficial upstream MCP server. User/channel/message response schemas are returned as provider JSON wrapped in the MCP text envelope, so downstream applications should validate any fields they depend on. No live-provider test is required for the unit test suite.
