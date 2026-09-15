# Umami MCP/API Connector

Reusable MCP server for Umami analytics. It exposes a deliberately scoped agent interface over Umami's official HTTP API. No upstream official Umami MCP server was identified during implementation, so the connector uses the official REST contract directly; Umami also publishes the `@umami/api-client` TypeScript client.

## Official sources
- API overview/client: https://docs.umami.is/docs/api/api-client
- Cloud API key authentication: https://docs.umami.is/docs/cloud/api-key
- Website statistics: https://docs.umami.is/docs/api/website-stats
- Events/event data: https://docs.umami.is/docs/api/events
- Realtime: https://docs.umami.is/docs/api/realtime

Umami Cloud API keys use Bearer authentication at `https://api.umami.is/v1`; optional `us`/`eu` region prefixes are supported. Cloud keys are documented at 50 calls per 15 seconds. The API-key surface excludes user/password administration routes.

## Runtime and architecture
Node.js 18.18+ and TypeScript. `src/config.ts` owns credentials/configuration, `src/client.ts` owns HTTP, timeout/retry/rate-limit behavior, `src/security.ts` owns permission gates and validation, `src/tools.ts` defines MCP contracts, and `src/server.ts` provides stdio MCP transport. Credentials remain in the connector process and are never returned in tool results.

## Authentication
Set `UMAMI_API_KEY`. This connector intentionally does not accept a username/password from an agent. For Umami Cloud, create an API key in Umami settings. For self-hosted deployments, configure `UMAMI_BASE_URL` to the compatible API base and supply a previously obtained bearer token through the same secret variable if appropriate for your deployment; do not put credentials in prompts.

## Environment
Copy `.env.example` values into your secret manager/process environment. `UMAMI_REGION` is optional (`us` or `eu`). `UMAMI_ALLOW_WRITES` defaults false. `UMAMI_ALLOW_DESTRUCTIVE` defaults false. Timeout defaults to 10 seconds.

## Installation
```bash
npm install
npm run build
npm start
```

The process speaks MCP over stdio and can be configured in MCP clients that support stdio servers. Compatibility depends on the client's MCP support; no vendor-specific integration is required.

## Tools and risk model
| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `umami.website.list` | List websites | READ | No |
| `umami.website.get` | Website metadata | READ | No |
| `umami.website.active` | Current active visitors | READ | No |
| `umami.analytics.stats` | Aggregate traffic stats | READ | No |
| `umami.analytics.pageviews` | Pageview series | READ | No |
| `umami.analytics.metrics` | Ranked dimensions | READ | No |
| `umami.event.list` | Event detail pagination | READ | No |
| `umami.event.stats` | Event aggregates/comparison | READ | No |
| `umami.realtime.get` | Last-30-minute realtime data | READ | No |
| `umami.website.create` | Create website | WRITE | Yes + write gate |
| `umami.website.update` | Update website | WRITE | Yes + write gate |
| `umami.website.delete` | Delete website/data | DESTRUCTIVE | Yes + destructive gate + ID confirmation |

The connector does not expose arbitrary HTTP execution, password/user administration, reset-analytics, or anonymous event ingestion. These exclusions reduce permission escalation, destructive-data, impersonation, and analytics-poisoning risk.

## Reliability
GET requests have a 10-second configurable timeout and at most two bounded retries for transient network failures, HTTP 429, and 5xx responses with exponential backoff. `Retry-After` is honored when supplied. Writes and deletes are never automatically retried because their idempotency cannot be assumed. Provider errors are mapped to `UmamiError`; throttling uses `RATE_LIMIT`. Pagination is exposed for website/event listing and metric offset/limit, capped to prevent accidental bulk extraction.

## Security
Provider content is returned with `untrusted_provider_data:true`; callers must treat analytics strings, referrers, URLs, event names, and other remote values as data rather than instructions. Tool schemas constrain UUIDs, time ranges, metric types, page sizes, and mutable fields. No secrets are logged or returned. Write permissions cannot be enabled by tool parameters. Destructive access requires an operator-side environment gate plus explicit call approval and exact identifier confirmation.

For self-hosted Umami, protect the service with TLS and network controls. Do not point `UMAMI_BASE_URL` at URLs supplied by model/tool input; it is operator configuration, which prevents tool-level SSRF. Rotate leaked API keys immediately.

## Rate limits
Umami Cloud documents 50 calls per 15 seconds per API key. This connector avoids fan-out operations and leaves pagination under caller control. On 429 it preserves `Retry-After` semantics and performs only bounded retries for reads.

## Testing
```bash
npm test
```
Tests require no live credentials. They cover configuration/authentication, validation, write/destructive permission denial, bearer header behavior, bounded rate-limit retry, and the no-retry rule for writes.

## Limitations
This package does not manage Umami users/passwords, ingest tracking events, reset website analytics, expose every event-data endpoint, or perform arbitrary provider calls. No official upstream Umami MCP server is used. API behavior can vary between Umami Cloud and self-hosted versions; pin and test your deployed Umami version before enabling writes.
