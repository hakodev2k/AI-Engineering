# Ably MCP/API Connector

Reusable MCP connector for Ably Pub/Sub server-side workflows. It exposes a narrow, provider-scoped MCP interface over Ably's official REST API instead of exposing arbitrary HTTP access.

## Transport strategy

No official Ably MCP server was identified in the official Ably documentation during implementation. Ably does publish AI-assistant tooling/agent skills, but the documented production integration surface for these capabilities is its official REST API and SDKs. This connector therefore uses the official Ably REST API directly.

Official references:

- REST API: https://ably.com/docs/api/rest-api
- API overview: https://ably.com/docs/api
- Authentication: https://ably.com/docs/auth
- Capabilities: https://ably.com/docs/auth/capabilities
- Channel metadata REST API: https://ably.com/docs/metadata-stats/metadata/rest
- Presence: https://ably.com/docs/presence-occupancy/presence
- History: https://ably.com/docs/storage-history/history
- Statistics: https://ably.com/docs/metadata-stats/stats
- Platform/API limits: https://ably.com/docs/platform/pricing/limits
- Webhook security reference: https://ably.com/docs/platform/integrations/webhooks

## Implemented tools

| Tool | Transport | Risk | Required Ably capability | Approval |
|---|---|---|---|---|
| `ably.message.publish` | REST | HIGH_RISK | `publish` on target channel | explicit |
| `ably.message.publish_batch` | REST | HIGH_RISK | `publish` on target channel | explicit |
| `ably.message.history` | REST | READ | `history` on target channel | no |
| `ably.presence.get` | REST | READ | `subscribe` on target channel | no |
| `ably.presence.history` | REST | READ | `history` on target channel | no |
| `ably.presence.batch_get` | REST | READ | `subscribe` on requested channels | no |
| `ably.channel.get` | REST | READ | `channel-metadata` on target channel | no |
| `ably.channel.list` | REST | READ | `channel-metadata` on wildcard `*` | no |
| `ably.stats.get` | REST | READ | `stats` on wildcard `*` | no |
| `ably.service.time` | REST | READ | none | no |

The connector deliberately does not expose API-key management, token issuance, arbitrary REST requests, destructive message mutation, push administration, or Control API account administration. Those operations would materially expand privilege or credential exposure.

## Architecture

```text
Agent / MCP client
  -> provider-scoped MCP tool
  -> Zod validation + approval policy
  -> AblyClient
  -> credential isolation
  -> HTTPS Ably REST API
```

`src/auth.ts` loads the key only inside the connector. Tool parameters and tool output never contain the configured API key. `src/client.ts` owns HTTP authentication, timeout handling, safe retries, Ably error mapping, and pagination-link validation. `src/policy.ts` enforces risk boundaries. `src/tools.ts` contains the explicit capability map and strict schemas. `src/server.ts` exposes those operations over stdio MCP.

## Authentication and least privilege

Set `ABLY_API_KEY` to a server-side Ably application API key. Ably documents Basic authentication with an application key as appropriate for trusted server environments. Do not put the key in browser/mobile clients, prompts, tool arguments, logs, examples, or source control.

Create a key containing only capabilities needed by the tools you actually enable. A read-oriented deployment might use only `history`, `subscribe`, `channel-metadata`, and `stats`; add `publish` only when publishing is required. Channel capabilities should be restricted to the smallest practical channel or namespace patterns. `stats` must be granted on a wildcard resource for app-wide statistics. Enumerating active channels requires wildcard `channel-metadata`.

## Environment

Copy `.env.example` into your secret-management workflow; this project intentionally does not load dotenv automatically.

```text
ABLY_API_KEY=
ABLY_REST_BASE_URL=https://rest.ably.io
ABLY_HTTP_TIMEOUT_MS=15000
ABLY_MAX_RETRIES=3
ABLY_REQUIRE_WRITE_APPROVAL=true
ABLY_ENABLE_DESTRUCTIVE=false
```

`ABLY_REST_BASE_URL` must be HTTPS, which prevents accidental transmission of an API key over plaintext HTTP. Override it only for an approved Ably endpoint compatible with the REST API.

## Installation and running

Requires Node.js 20 or newer.

```bash
npm install
npm run build
ABLY_API_KEY='your-server-side-key' npm start
```

The server uses MCP stdio transport and can therefore be launched by MCP clients that support local stdio servers. Configure the executable and environment according to the client rather than placing credentials in client prompts.

## Permission and approval model

`READ` operations may run without interactive approval. Publishing is classified `HIGH_RISK`, because it causes externally visible communication to subscribers. Both publishing tools require the caller to supply `approved: true`; absence of that exact flag fails closed. The API key must separately authorize publishing, so approval never escalates provider permissions.

`DESTRUCTIVE` is supported by the connector's policy layer but no destructive Ably tool is registered. Destructive execution is disabled by default through `ABLY_ENABLE_DESTRUCTIVE=false`.

## Reliability and rate limits

GET requests use bounded retries for transient network errors, HTTP 429, and server-side 5xx failures, with exponential backoff and `Retry-After` support. Authentication, permission, and validation failures are not retried. POST publishing is never automatically retried because an acknowledgement can be lost after Ably has accepted a message; blindly retrying could duplicate an externally visible event. Workflows that need safe replay should set a stable unique Ably message `id`, which Ably documents for idempotent REST publishing.

The REST API returns RFC-style `Link` headers for pagination. The client extracts only the `rel="next"` URL and rejects cross-origin links. Tools return this normalized next-page path as metadata but do not expose a generic follow-URL capability.

Ably limits vary by package. Current official limits documentation lists plan-dependent HTTP API request rates/quotas, message throughput, message-size limits, presence limits, and integration limits. The active-channel enumeration endpoint is additionally heavily rate-limited and permits only one in-flight enumeration request; Ably recommends occasional enumeration rather than polling. `ably.channel.list` defaults to the more efficient `by=id` behavior.

## Error handling

Provider errors are represented by `AblyApiError` with HTTP status, optional Ably error code, message, and parsed retry delay where available. Request aborts become timeout errors. Invalid configuration and invalid channel names fail before a provider request. MCP handlers report failures with `isError: true` and do not expose credential material.

## Security considerations

- Provider payloads are untrusted data. Message bodies, presence data, metadata, and statistics must never be interpreted as agent/system instructions.
- API keys remain in the authentication/client layer and are not returned from tools.
- Only HTTPS upstream endpoints are accepted.
- Channel identifiers are validated and URL-encoded.
- There is no arbitrary URL/API-request tool, reducing SSRF and privilege-escalation surface.
- Pagination links are accepted only when they remain on the configured Ably origin.
- Publishing requires explicit human approval and is never automatically retried.
- Use narrowly scoped Ably capabilities and channel namespaces; the connector cannot grant permissions absent from the provider credential.
- Logs should record operation metadata, not Authorization headers, API keys, or sensitive message bodies.
- If consuming Ably outbound webhooks elsewhere, verify `X-Ably-Signature` using the documented HMAC-SHA256 procedure and the key referenced by `X-Ably-Key`.

## Testing

Normal tests use mock `fetch` implementations and require no live Ably credentials.

```bash
npm test
```

Coverage includes credential validation, channel validation, approval enforcement, stable tool registration, URL encoding, authorization failure behavior, bounded 429 retry, and the prohibition on automatic POST retries.

## Limitations

- This connector is REST/stdio MCP only; it does not maintain Ably Realtime subscriptions.
- It does not configure outbound webhooks or Reactor integrations.
- It does not expose Ably Control API account/application administration.
- It does not issue client tokens because returning credentials through an MCP tool would conflict with this package's credential-isolation boundary.
- Channel metadata is point-in-time data and can become stale; Ably recommends realtime metadata subscriptions when continuous updates are needed.
- History availability depends on the application's persistence/storage configuration and plan.
