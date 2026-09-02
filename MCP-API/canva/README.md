# Canva MCP/API Connector

Reusable Model Context Protocol server that exposes a constrained Canva tool surface for agent workflows while keeping OAuth credentials inside the connector.

## Provider and transport strategy

Canva has an official remote MCP server at `https://mcp.canva.com/mcp`. Canva documents it as supporting design generation/editing/discovery, search, assets and brand management, export, and commenting. Canva also states that third-party AI products integrating the remote MCP server can require Canva access/allowlisting and per-user authentication. This package does not bypass that OAuth/access-control boundary and does not forward Connect API credentials to an upstream MCP server.

For the executable, reusable contracts in this connector, the selected transport is Canva's official Connect REST API at `https://api.canva.com/rest/v1`. This is the safe fallback where the official MCP integration is access-controlled or cannot be embedded non-interactively by a reusable package. Agent callers use the same MCP-facing tool interface regardless of the REST transport underneath.

Official sources researched for this implementation:

- Canva MCP: https://www.canva.dev/docs/mcp/
- Canva Connect API: https://www.canva.dev/docs/connect/api-reference/
- Authentication: https://www.canva.dev/docs/connect/authentication/
- Generate access token: https://www.canva.dev/docs/connect/api-reference/authentication/generate-access-token/
- Security recommendations: https://www.canva.dev/docs/connect/guidelines/security/
- Designs: https://www.canva.dev/docs/connect/api-reference/designs/
- Assets: https://www.canva.dev/docs/connect/api-reference/assets/
- Exports: https://www.canva.dev/docs/connect/api-reference/exports/
- Resizes: https://www.canva.dev/docs/connect/api-reference/resizes/
- MCP prohibited use: https://www.canva.dev/docs/mcp/prohibited-use/

## Runtime

Node.js 20 or newer.

```bash
npm install
npm run build
npm test
npm start
```

The connector exposes a stdio MCP server through `@modelcontextprotocol/sdk`, making it usable by MCP clients that can launch a local stdio server process.

## Authentication

Canva Connect uses OAuth 2.0 Authorization Code with PKCE. The connector supports either:

1. A valid user access token in `CANVA_ACCESS_TOKEN`.
2. A rotating Canva refresh token with `CANVA_CLIENT_ID` and `CANVA_CLIENT_SECRET`.
3. A persistent secret token-cache file plus client credentials.

Canva currently documents access tokens as short-lived (currently four hours, subject to change) and refresh tokens as one-time-use rotating credentials. When refresh credentials are configured, the connector authenticates the token request with HTTP Basic authentication against `/oauth/token`, rotates the in-memory refresh token, and optionally persists the new access/refresh pair to `CANVA_TOKEN_CACHE_FILE` with mode `0600`.

For production, put the cache outside the repository on encrypted storage or use an equivalent platform secret provider. If you use refresh-token mode without `CANVA_TOKEN_CACHE_FILE`, the rotated token remains safe in memory for the life of the process but must be captured/replaced by your external credential lifecycle before a restart. Never commit a token cache.

The LLM never receives access tokens, refresh tokens, client secrets, or token endpoint responses. Tool parameters never accept credentials.

## Required scopes

Request only scopes needed for the tools you enable:

- `profile:read` — user profile and user capabilities.
- `design:meta:read` — list/search designs and get design metadata.
- `design:content:read` — pages, export formats, datasets, exports, resize status.
- `design:content:write` — create designs and create resized copies.
- `asset:read` — asset metadata and asset-upload job status.
- `asset:write` — URL asset import.

Some operations also require account capabilities. In particular, Canva's resize APIs require the `resize` capability; query `canva.user.capabilities.get` before attempting a resize.

## Environment variables

```text
CANVA_ACCESS_TOKEN=
CANVA_REFRESH_TOKEN=
CANVA_CLIENT_ID=
CANVA_CLIENT_SECRET=
CANVA_TOKEN_CACHE_FILE=
CANVA_API_BASE_URL=https://api.canva.com/rest/v1
CANVA_MCP_URL=https://mcp.canva.com/mcp
CANVA_TIMEOUT_MS=15000
CANVA_MAX_RETRIES=2
CANVA_REQUIRE_WRITE_APPROVAL=true
CANVA_APPROVED_ACTIONS=
```

`CANVA_API_BASE_URL` is configurable for controlled testing but should remain the official Canva API in production. `CANVA_MCP_URL` records the official MCP endpoint and is intentionally not used to bypass Canva's remote-MCP OAuth/access program.

## Tool list

| Tool | Transport | Required scope(s) | Risk | Approval |
|---|---|---|---|---|
| `canva.user.profile.get` | REST | `profile:read` | READ | none |
| `canva.user.capabilities.get` | REST | `profile:read` | READ | none |
| `canva.design.list` | REST | `design:meta:read` | READ | none |
| `canva.design.get` | REST | `design:meta:read` | READ | none |
| `canva.design.pages.list` | REST | `design:content:read` | READ | none |
| `canva.design.export_formats.list` | REST | `design:content:read` | READ | none |
| `canva.design.dataset.get` | REST | `design:content:read` | READ | none |
| `canva.asset.get` | REST | `asset:read` | READ | none |
| `canva.asset.upload_job.get` | REST | `asset:read` | READ | none |
| `canva.asset.url_upload_job.get` | REST | `asset:read` | READ | none |
| `canva.design.export_job.get` | REST | `design:content:read` | READ | none |
| `canva.design.resize_job.get` | REST | `design:content:read`, `design:content:write` | READ | none |
| `canva.design.create` | REST | `design:content:write` | WRITE | configurable; required by default |
| `canva.asset.url_upload.create` | REST | `asset:write` | WRITE | configurable; required by default |
| `canva.design.export.create` | REST | `design:content:read` | WRITE | configurable; required by default |
| `canva.design.resize.create` | REST | `design:content:read`, `design:content:write` | WRITE | configurable; required by default |

No arbitrary HTTP request tool, delete tool, public publishing tool, billing tool, permission-changing tool, or unrestricted upstream-MCP invocation is exposed.

## Approval model

READ tools execute automatically. WRITE tools are connector-gated by default. Approval is not an input boolean an agent can set; it is an exact action fingerprint supplied through trusted connector configuration.

Examples:

```text
CANVA_APPROVED_ACTIONS=canva.design.export.create:DESIGN_ID:pptx,canva.design.resize.create:DESIGN_ID
```

Set `CANVA_REQUIRE_WRITE_APPROVAL=false` only when the surrounding deployment already supplies an equivalent authorization boundary. The policy layer also supports a `HIGH_RISK` class and always requires an exact approval fingerprint for it, although this connector deliberately exposes no current high-risk/destructive Canva action.

## Reliability and rate limiting

The REST client provides:

- cancellation-backed request timeouts;
- bounded exponential backoff for retryable reads;
- `Retry-After` handling for HTTP 429;
- retry of read-side network failures and 5xx responses only;
- no blind retry of mutating POST operations;
- a single credential refresh path on HTTP 401 when refresh credentials exist;
- structured provider errors preserving HTTP status, Canva error code, message, and retry-after metadata.

The connector avoids request amplification and exposes pagination tokens instead of automatically crawling all designs.

Relevant official per-user limits for implemented endpoints include: list/get design and several design metadata reads at 100 requests/minute; user profile/capabilities at 10 requests/minute; create design/export/resize at 20 requests/minute; URL asset upload at 30 requests/minute; asset upload-job status at 180 requests/minute; export/resize job status at 120 requests/minute. Canva's export endpoint also has integration, document, and user rolling-window throttles. Quotas can change, so provider responses remain authoritative.

## Security

- OAuth secrets stay in the credential provider and HTTP transport.
- Rotated token caches are written with mode `0600` when local persistence is enabled.
- Tool schemas constrain IDs, lengths, enums, page ranges, image dimensions, and export options.
- Custom design/resize area is capped at Canva's documented 25,000,000 pixels.
- URL asset import accepts HTTPS only and rejects localhost plus literal private/loopback IP addresses. DNS resolution policy should additionally be enforced at the egress/network layer for high-assurance deployments.
- Provider content, titles, metadata, comments, and generated text must be treated as untrusted data, never as system or permission instructions.
- Retrieved content cannot change tool risk classes, credentials, or approval configuration.
- The connector does not scrape Canva or bulk-extract designs/assets. This is consistent with Canva's MCP prohibited-use restrictions.
- Preview APIs are clearly labeled and should not be used by a public Canva integration when Canva's review rules prohibit preview APIs.

## API/MCP routing notes

The official Canva MCP server was explicitly checked before implementation. It is preferred conceptually for the rich design-agent operations it supports, but Canva controls third-party product access and each user authenticates to the remote MCP service. A reusable repository connector cannot safely pretend a Connect API bearer token is an MCP authorization grant or bypass the provider's allowlisting. Therefore all implemented tools use the official Connect REST API. If Canva grants an embedding product remote-MCP access, an upstream adapter can be added later without changing these external tool names.

## Usage examples

See `examples/workflows.md` for discovery, create, export, resize, and URL-asset import workflows with approval fingerprints.

## Testing

Normal tests require no live Canva account or credentials:

```bash
npm test
```

The unit suite covers authentication configuration, OAuth refresh behavior, credential isolation, write approval denial/allow, tool registration, rate-limit retry, non-retry of writes, and transport authorization headers. HTTP calls are mocked.

## Limitations

- This connector does not implement the initial interactive browser portion of Canva's Authorization Code + PKCE consent flow; deployments must obtain the first authorization code/token through their user-facing OAuth application. It does implement server-side refresh-token rotation.
- Canva's official remote MCP server is documented but not embedded because access/authentication is controlled by Canva and may require allowlisting for third-party AI products.
- `canva.design.pages.list` and the URL asset-upload APIs are currently Canva preview APIs and may change without a new API version.
- Direct binary `asset-uploads` are intentionally not exposed because passing arbitrary file bytes through LLM tool arguments is undesirable; use URL upload for suitable public assets or a dedicated trusted file-ingress layer.
- Delete/update asset operations exist in Canva's API but are intentionally omitted to keep destructive and broad mutation capabilities out of the default agent surface.
