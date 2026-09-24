# Imgix MCP/API Connector

Reusable MCP stdio connector for the Imgix Management API. It exposes 10 stable tools for Sources, Asset Manager, cache purging, and analytics while keeping the API key inside the connector.

## Transport decision and official research
No official Imgix MCP server was identified in Imgix's current official documentation. The connector therefore uses the official REST Management API at `https://api.imgix.com/api/v1`.

Official sources (verified 2026-09-24):
- Management API overview/auth/rate limits: https://docs.imgix.com/en-US/apis/management/overview
- Sources: https://docs.imgix.com/en-US/apis/management/sources
- Assets: https://docs.imgix.com/en-US/apis/management/assets
- Purges: https://docs.imgix.com/en-US/apis/management/purges
- Reports: https://docs.imgix.com/en-US/apis/management/reports

Imgix uses JSON:API documents and Bearer API keys. API-key permissions include Sources, Analytics, Purge, Asset Manager Browse, and Asset Manager Edit. Use only permissions required by enabled workflows.

## Architecture
`MCP client -> strict Zod tools -> risk/approval policy -> credential-isolated REST client -> api.imgix.com`.

The upstream origin is fixed in code; agents cannot supply an arbitrary host. Provider output is marked `untrustedProviderData` and must be treated as data, never instructions.

## Requirements and installation
Node.js 20+.
```bash
npm install
npm run build
npm test
npm start
```
The server uses standard MCP stdio and works with MCP clients that can launch stdio subprocess servers.

## Authentication
Create an API key in the Imgix dashboard and inject `IMGIX_API_KEY` through the process environment/secret manager. Never put it in prompts, examples, logs, or source control. Imgix limits accounts to 20 API keys.

## Environment
- `IMGIX_API_KEY` required.
- `IMGIX_ALLOW_WRITE=false` default.
- `IMGIX_ALLOW_HIGH_RISK=false` default.
- `IMGIX_APPROVAL_SECRET` required for approved mutations.
- `IMGIX_TIMEOUT_MS=15000`, bounded 1–120 seconds.
- `IMGIX_MAX_READ_RETRIES=2`, bounded 0–5.

## Tools
| Tool | Permission | Risk | Approval |
|---|---|---|---|
| `imgix.source.list` | Sources | READ | no |
| `imgix.source.get` | Sources | READ | no |
| `imgix.asset.list` | Asset Manager Browse | READ | no |
| `imgix.asset.get` | Asset Manager Browse | READ | no |
| `imgix.asset.metadata.update` | Asset Manager Edit | WRITE | yes |
| `imgix.asset.add_from_origin` | Asset Manager Edit | WRITE | yes |
| `imgix.asset.refresh` | Asset Manager Edit + Purge | HIGH_RISK | yes |
| `imgix.cache.purge` | Purge | HIGH_RISK | yes |
| `imgix.report.list` | Analytics | READ | no |
| `imgix.report.get` | Analytics | READ | no |

No source creation/deletion, upload bytes, arbitrary HTTP, API-key administration, account/user changes, or billing operations are exposed.

## Approval model
READ runs automatically. WRITE requires `IMGIX_ALLOW_WRITE=true` plus an HMAC-SHA256 approval token bound to the exact tool and canonical arguments. HIGH_RISK additionally requires `IMGIX_ALLOW_HIGH_RISK=true`. The approval secret is held by the trusted host, not the model. Changing source, path, URL, or metadata invalidates approval. No destructive tools are implemented.

## Validation and security
Schemas reject unknown fields, bound page sizes/string lengths, validate source IDs, and require HTTPS for purge URLs. The connector never fetches purge URLs; it submits them only to Imgix. Imgix itself requires purge URLs to belong to the current account. Asset paths are URL encoded. Credentials never appear in tool inputs/results.

Retrieved filenames, metadata, custom fields, reports, and API errors are untrusted content. They cannot change permissions or approval policy.

## Reliability, pagination, and rate limits
Every request has an AbortController timeout. READ requests retry only transient network errors, HTTP 429, and 5xx responses with bounded exponential backoff and `Retry-After` support. Writes/high-risk operations are single-attempt to avoid duplicate side effects.

Imgix currently documents endpoint-specific limits: default 4/s, source create/update 60/hour, asset get 10/s, asset refresh 10/minute, upload v1 2/s, and purge 20/s. The connector avoids fan-out and exposes bounded asset pages instead of draining collections automatically.

Authentication/permission/validation failures are not retried. HTTP errors preserve status and provider JSON error data internally without exposing the API key.

## Examples
See `examples/workflows.md`.

## Testing
`npm test` uses mocks only. Tests cover auth configuration, tool registration, write denial, exact-payload approval, credential isolation, 429 read retry, and non-retry of writes. Live credentials are not required.

## Limitations
Asset Manager features can be plan-dependent; some attributes/details are Enterprise-only. This connector intentionally omits binary upload sessions, source provisioning/configuration, publish/unpublish, destructive operations, and rendering URL generation. Rendering transformations are URL-driven and are not Management API operations. Provider permissions and plan entitlements remain authoritative.
