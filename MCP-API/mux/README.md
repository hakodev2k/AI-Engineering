# Mux MCP/API Connector

Reusable MCP connector for Mux Video. It exposes a narrow set of asset and live-stream operations through standard MCP stdio tools while keeping the Mux token pair inside the connector.

## Official sources researched
Research date: 2026-08-30.

- Mux fundamentals and official SDK/spec links: https://www.mux.com/docs/core/mux-fundamentals
- API request/authentication/rate-limit guidance: https://www.mux.com/docs/core/make-api-requests
- AI-agent security guidance: https://www.mux.com/docs/core/ai-agents
- Asset list API: https://www.mux.com/docs/api-reference/video/assets/list-assets
- Asset input-info API: https://www.mux.com/docs/api-reference/video/assets/get-asset-input-info
- Asset track API: https://www.mux.com/docs/api-reference/video/assets/create-asset-track
- Asset playback-ID deletion API: https://www.mux.com/docs/api-reference/video/assets/delete-asset-playback-id
- Live streaming guide/API links: https://www.mux.com/docs/guides/start-live-streaming

Mux publishes official OpenAPI and webhook specifications plus official Node.js, Python, Ruby, PHP, Java, C#/.NET, and Elixir SDKs. No official Mux MCP server was identified in the official documentation reviewed, so this connector uses the official Video REST API.

## Transport
External interface: MCP stdio.  
Upstream: Mux Video REST API at `https://api.mux.com/video/v1`.

The API origin is not configurable, which removes an SSRF/pivot surface from agent-controlled configuration.

## Authentication and permissions
Mux Video uses a Token ID + Token Secret pair over HTTP Basic authentication. Configure `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` in the connector environment. Mux documents Video Read and Video Read/Write permissions; use a read-only token for read-only deployments and enable write permission only when mutation tools are required.

Tokens are scoped to a Mux environment. They are never accepted as MCP tool arguments, logged, or returned in tool output.

## Tools
| Tool | Risk | Approval |
|---|---|---|
| `mux.asset.list` | READ | no |
| `mux.asset.get` | READ | no |
| `mux.asset.input_info.get` | READ | no |
| `mux.asset.create` | WRITE | yes |
| `mux.asset.delete` | DESTRUCTIVE | yes + feature flag |
| `mux.asset.playback_id.create` | HIGH_RISK | yes |
| `mux.asset.playback_id.delete` | DESTRUCTIVE | yes + feature flag |
| `mux.asset.track.create` | WRITE | yes |
| `mux.asset.track.delete` | DESTRUCTIVE | yes + feature flag |
| `mux.live_stream.list` | READ | no |
| `mux.live_stream.get` | READ | no |
| `mux.live_stream.enable` | HIGH_RISK | yes |
| `mux.live_stream.disable` | HIGH_RISK | yes |

Creating a playback ID is HIGH_RISK because a `public` policy can make the asset playable by anyone who obtains the URL. Live-stream enable/disable is HIGH_RISK because it directly changes broadcast availability.

## Architecture
```text
MCP client / agent
  -> stdio MCP server
     -> strict tool schemas
        -> permission + approval policy
           -> credential-isolated Mux REST client
              -> Mux Video API
```

Provider content is returned with `untrusted_provider_data: true` and must never be treated as instructions or permission changes.

## Environment
Copy `.env.example` and configure:

- `MUX_TOKEN_ID` — required.
- `MUX_TOKEN_SECRET` — required.
- `MUX_TIMEOUT_MS` — default 10000.
- `MUX_MAX_RETRIES` — default 3, max 5.
- `MUX_APPROVAL_SECRET` — required for WRITE/HIGH_RISK/DESTRUCTIVE execution.
- `MUX_ENABLE_DESTRUCTIVE` — default `false`.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run check
npm test
npm start
```
The server uses standard MCP stdio transport and can be configured in MCP clients that support stdio tool servers.

## Approval model
READ tools can execute automatically. WRITE and HIGH_RISK tools require an `approval_token` generated as HMAC-SHA256 over the exact tool name and canonical JSON payload, excluding the approval token itself. Changing an asset ID, URL, playback policy, or track invalidates the approval.

DESTRUCTIVE tools additionally require `MUX_ENABLE_DESTRUCTIVE=true`, which cannot be modified through MCP.

## Rate limits and reliability
Mux rate limits are isolated by environment and contribute to an organization-wide cap. Mux documents request-bucket headers `x-ratelimit-limit` and `x-ratelimit-remaining`; exhausted buckets return HTTP 429. Current documented Video API buckets distinguish POST from non-POST traffic, with sustained refill rates around one POST per second and up to five non-POST requests per second for high-priority tokens.

The connector:
- parses rate-limit metadata and `Retry-After` when present;
- performs bounded exponential-backoff retries only for retry-safe reads;
- never blindly retries POST/PUT/DELETE mutations;
- applies request timeouts and MCP cancellation;
- bounds list page sizes and identifiers.

Mux's AI-agent guidance specifically warns not to poll asset status more than once per second; prefer webhooks for status changes. This connector exposes status reads but does not implement an aggressive polling helper.

## Security
- Mux Token ID/Secret stay server-side.
- API base URL is fixed to Mux's official origin.
- No arbitrary HTTP/request tool exists.
- Retrieved Mux content is treated as untrusted data.
- `stream_key`, token, private-key, password, and credential-shaped provider fields are recursively redacted.
- Live-stream creation/reset-key tools are intentionally omitted because those operations return sensitive stream keys that should remain server-side.
- Signing-key management is omitted because signing-key creation returns private key material.
- Destructive tools are disabled by default.
- Public playback changes require explicit human approval.
- Input media/track URLs must be HTTPS and are sent only to Mux; the connector itself never fetches those URLs.

## Tests
Unit tests require no live Mux credentials. They cover tool registration, auth configuration, payload-bound approval, destructive denial, secret-field redaction, Basic auth construction, non-retry of auth failures, bounded 429 retry, and no blind retry of mutations.

Run:
```bash
npm test
```

## Limitations
- This connector focuses on Mux Video rather than Mux Data analytics.
- It does not expose access-token, signing-key, webhook-management, billing, or organization-administration APIs.
- It intentionally does not return live stream keys or signing private keys.
- Webhook event verification/ingestion is not implemented because this package is a stdio MCP server, not an HTTP listener; Mux publishes a machine-readable webhook specification for applications that need event handling.
- Some video features depend on account tier and environment permissions.
