# bunny.net MCP/API Connector

Reusable MCP server for selected bunny.net CDN, DNS and statistics workflows. Node.js 20+; stdio transport.

## Upstream strategy

The connector uses the official bunny.net REST API at `https://api.bunny.net`. bunny.net's 2026 developer documentation is OpenAPI-driven and documents CDN, DNS, Storage, Stream, Database, Shield, Edge Scripting and other product APIs. bunny.net also ships an official CLI and agent skills; its May 2026 community roundup mentions a community `bunnycdn-mcp`, but this connector does not trust or depend on that community MCP implementation. Direct official REST is used for the implemented contracts.

Official sources: bunny.net Developer Documentation (`https://docs.bunny.net`), API reference (`https://docs.bunny.net/reference`), developer-docs announcement (`https://bunny.net/blog/introducing-the-new-bunny-net-developer-documentation/`), and CLI announcement (`https://bunny.net/blog/introducing-the-bunny-net-cli/`). Re-check the current OpenAPI reference before extending endpoint coverage.

## Capabilities

Ten provider-scoped tools are implemented: `bunny.pullzone.list`, `bunny.pullzone.get`, `bunny.pullzone.create`, `bunny.pullzone.update`, `bunny.pullzone.delete`, `bunny.cache.purge_url`, `bunny.cache.purge_zone`, `bunny.dnszone.list`, `bunny.dnszone.get`, and `bunny.statistics.get`. No arbitrary HTTP passthrough is exposed.

## Architecture

MCP client -> strict Zod tool schema -> approval policy -> BunnyClient -> official REST API. Credentials are read only in `src/auth.ts` and injected into the `AccessKey` header; they are never tool inputs or MCP output. Provider content is wrapped as `untrustedData`.

## Authentication and configuration

Create a bunny.net API key with only the account access needed by these operations. Set `BUNNY_API_KEY`. Optional settings: `BUNNY_API_BASE_URL`, `BUNNY_TIMEOUT_MS`, `BUNNY_MAX_RETRIES`, and `BUNNY_ALLOW_WRITES`. Destructive deletion additionally requires `BUNNY_ALLOW_DESTRUCTIVE=true`. Do not expose either flag as an agent-controlled tool parameter.

## Install and run

```bash
npm install
npm run build
BUNNY_API_KEY=... npm start
```

Configure any MCP client that supports a local stdio MCP server to launch `node dist/server.js`. Compatibility depends on the client's support for standard MCP stdio transport.

## Permission model

READ tools may run automatically. WRITE tools require `BUNNY_ALLOW_WRITES=true` plus per-call `approved:true`. Cache purge is HIGH_RISK because it can cause origin load and user-visible cache misses and uses the same explicit approval gate. Pull-zone deletion is DESTRUCTIVE and additionally requires `BUNNY_ALLOW_DESTRUCTIVE=true`. The connector intentionally does not implement DNS mutation, security configuration, billing, token management, or raw API execution.

## Reliability and rate limits

Requests use AbortController timeouts. GET/HEAD reads retry only transient network failures, HTTP 429 and selected 5xx responses, with bounded exponential backoff and `Retry-After` support. Authentication, authorization, validation, and write failures are not blindly retried. List tools expose bounded pagination inputs so agents do not fan out uncontrolled requests. bunny.net can evolve product-specific limits; HTTP 429 is treated as authoritative throttling.

## Errors

Provider HTTP failures are mapped to `BunnyError` with status and response body retained internally. MCP handlers return concise errors without credentials. Missing credentials fail before the request. Zod rejects ambiguous/extra inputs. Timeouts surface as request failures after bounded read retries.

## Security

Keep API keys in environment/secret storage and rotate them using bunny.net controls. The base URL defaults to the fixed HTTPS API origin; deployments that override it must treat that as administrator configuration, not agent input. Never treat retrieved CDN/DNS metadata as instructions. Writes cannot elevate their own permission because enablement is process configuration. Destructive calls are disabled by default. Avoid logging request headers. For future webhook receivers, validate payload shape and follow bunny.net's current webhook authentication guidance before acting.

## Testing

`npm test` uses mocked fetch responses and no live credentials. Tests cover registration, schema validation, read authentication isolation, write approval, destructive approval, non-retry of authentication/write failures, and throttled-read retry behavior.

## Limitations

This connector deliberately covers a small high-value subset of bunny.net's platform. Storage object operations, Stream, Database, Edge Scripting, Magic Containers, Shield, billing and account security are not exposed. There is no upstream official bunny.net MCP dependency in this package. Pagination response shapes are passed through from the official API rather than normalized, preserving provider metadata while marking it untrusted.
