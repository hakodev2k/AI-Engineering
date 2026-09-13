# GIPHY MCP Connector

Reusable Model Context Protocol server exposing scoped GIPHY discovery operations through the official GIPHY REST API.

## Transport

- External interface: MCP over stdio using `@modelcontextprotocol/sdk`.
- Upstream provider transport: official GIPHY REST API at `https://api.giphy.com`.
- Official MCP: no official GIPHY MCP server was identified in GIPHY's developer documentation as of 2026-09-13, so this connector uses the official REST API directly.

Official sources:
- https://developers.giphy.com/docs/api/
- https://developers.giphy.com/docs/api/endpoint/
- https://developers.giphy.com/docs/api/endpoint/trending/
- https://developers.giphy.com/docs/api/endpoint/random/
- https://developers.giphy.com/docs/api/endpoint/translate/

## Capabilities

Implemented MCP tools:

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `giphy.gif.search` | `GET /v1/gifs/search` | READ | No |
| `giphy.gif.trending` | `GET /v1/gifs/trending` | READ | No |
| `giphy.gif.random` | `GET /v1/gifs/random` | READ | No |
| `giphy.gif.translate` | `GET /v1/gifs/translate` | READ | No |
| `giphy.gif.get` | `GET /v1/gifs?ids=...` | READ | No |
| `giphy.sticker.search` | `GET /v1/stickers/search` | READ | No |
| `giphy.sticker.trending` | `GET /v1/stickers/trending` | READ | No |
| `giphy.sticker.random` | `GET /v1/stickers/random` | READ | No |
| `giphy.sticker.translate` | `GET /v1/stickers/translate` | READ | No |
| `giphy.tag.related` | `GET /v1/tags/related/{term}` | READ | No |
| `giphy.search.trending_terms` | `GET /v1/trending/searches` | READ | No |

The connector intentionally excludes upload and analytics-action registration because this package is designed as a safe read-oriented discovery connector. No arbitrary raw-HTTP tool is exposed.

## Authentication

Create a GIPHY developer application and API key, then set:

```bash
export GIPHY_API_KEY="..."
```

The API key remains inside the connector process. MCP callers never need to receive or pass it as a tool argument.

GIPHY beta API keys are documented as rate limited to 100 API calls per hour. Production access must be requested through the GIPHY Developer Dashboard. GIPHY also requires visible `Powered By GIPHY` attribution where API content is presented in an application.

## Environment

```text
GIPHY_API_KEY=                 # required
GIPHY_TIMEOUT_MS=10000         # optional
GIPHY_MAX_RETRIES=2            # optional; bounded to <=5
GIPHY_DEFAULT_RATING=g         # optional: g, pg, pg-13, r
```

## Install and run

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server communicates over stdio and can be launched by MCP clients that support stdio servers.

Example client configuration:

```json
{
  "mcpServers": {
    "giphy": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/giphy/dist/src/server.js"],
      "env": {
        "GIPHY_API_KEY": "${GIPHY_API_KEY}"
      }
    }
  }
}
```

## Architecture

`src/config.ts` validates secrets and operational settings. `src/client.ts` owns credential injection, timeout handling, bounded retry/backoff, throttling handling, and provider error mapping. `src/tools.ts` defines strict schemas and the stable provider-scoped MCP contract. `src/server.ts` wires the stdio server.

## Validation and pagination

Search/trending list tools cap `limit` at 50 and `offset` at 499 to avoid excessive result sets and to match documented GIPHY pagination constraints. Search and translate terms have explicit length bounds. Content rating accepts only `g`, `pg`, `pg-13`, or `r`.

For proxied applications, GIPHY documentation recommends forwarding end-user country/region information where applicable. The tools expose bounded `country_code` and `region` inputs rather than deriving them silently.

## Reliability

- Per-request timeout using `AbortController`.
- Network failures and HTTP 429/5xx may be retried with bounded exponential backoff.
- Authentication/validation/provider 4xx errors are not retried blindly.
- `Retry-After` is honored when present, with a bounded wait.
- Error responses are truncated before being surfaced so unexpectedly large provider payloads are not copied into agent context.

## Security

Provider responses and metadata are treated as untrusted data. Returned titles, usernames, descriptions, URLs, and tags must never be interpreted as instructions that alter permissions or agent policy. Credentials are only injected in the connector HTTP layer and are not included in tool schemas or output. The connector does not accept arbitrary upstream URLs, preventing tool-driven SSRF.

All implemented tools are READ operations. There are no WRITE, HIGH_RISK, or DESTRUCTIVE tools in this connector, so no human-approval gate is needed for the current capability set. Adding upload, moderation, account mutation, or external side-effect features would require explicit risk reclassification and approval policy changes.

## Testing

```bash
npm test
```

Tests use mocked `fetch` and do not require live credentials. They cover missing credentials, configuration validation, API-key injection, successful reads, authentication failure without retry, throttling retry bounds, and timeout mapping.

## Limitations

- GIPHY's documented requirement that Search and Trending calls be made client-side may affect whether a server-side proxy is appropriate for a particular product deployment; verify your use against GIPHY's current API Terms before production use.
- Production key limits and pricing are account-specific and are not assumed by this connector.
- This connector does not download media binaries; it returns GIPHY API metadata and rendition URLs.
- GIPHY analytics action registration and upload endpoints are intentionally out of scope.
