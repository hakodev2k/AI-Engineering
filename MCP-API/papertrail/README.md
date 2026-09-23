# Papertrail MCP/API Connector

Reusable MCP server for SolarWinds Papertrail log investigation and safe saved-search management. It exposes stable provider-scoped MCP tools while using Papertrail's official HTTP API directly.

## Transport and official sources

No official Papertrail MCP server was found in Papertrail's official documentation during research on 2026-09-23, so all implemented capabilities use the official REST/HTTP API. Sources: `https://www.papertrail.com/help/http-api/`, `https://www.papertrail.com/help/search-api/`, `https://www.papertrail.com/help/settings-api/`, `https://www.papertrail.com/help/web-hooks/`, and `https://www.papertrail.com/help/permanent-log-archives/`.

The API base is fixed to `https://papertrailapp.com/api/v1` to prevent SSRF. Authentication uses the `X-Papertrail-Token` header. The token remains inside the connector and is never returned to MCP clients.

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `papertrail.event.search` | REST | READ | No |
| `papertrail.system.list` | REST | READ | No |
| `papertrail.system.get` | REST | READ | No |
| `papertrail.group.list` | REST | READ | No |
| `papertrail.group.get` | REST | READ | No |
| `papertrail.search.list` | REST | READ | No |
| `papertrail.search.get` | REST | READ | No |
| `papertrail.search.create` | REST | WRITE | Yes |
| `papertrail.search.update` | REST | WRITE | Yes |
| `papertrail.archive.list` | REST | READ | No |
| `papertrail.usage.get` | REST | READ | No |

Destructive group/search/system deletion, user administration, arbitrary API requests, archive binary downloads, webhook mutation, and log ingestion are deliberately not exposed.

## Architecture

`src/auth.ts` validates configuration and isolates credentials. `src/client.ts` implements the official HTTP transport, cancellation/timeout behavior, bounded retries, rate-limit handling, and error mapping. `src/tools.ts` owns strict Zod validation, risk metadata, and approval gates. `src/server.ts` exposes the tools over MCP stdio. Tests use mocked fetch only.

## Authentication and configuration

Create a Papertrail API token with only the account access needed for the implemented operations. Papertrail's API token model does not provide per-tool OAuth scopes, so least privilege is enforced through a dedicated integration token plus this connector's tool allowlist and write gate.

Copy `.env.example` and set `PAPERTRAIL_API_TOKEN`. Optional values are `PAPERTRAIL_TIMEOUT_MS` (default 10000), `PAPERTRAIL_MAX_RETRIES` (default 2), and `PAPERTRAIL_ALLOW_WRITES` (default false). `PAPERTRAIL_API_BASE_URL` is documented for deployment consistency but only the official HTTPS origin is accepted.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
PAPERTRAIL_API_TOKEN=... npm start
```

The server uses MCP stdio and can be launched by MCP clients that support local stdio servers. Compatibility depends on the client's support for standard MCP stdio rather than provider-specific integration behavior.

## Permissions and approval

READ tools execute automatically. WRITE tools are denied unless `PAPERTRAIL_ALLOW_WRITES=true`, and every write call must additionally include `approved: true`, representing explicit human approval. No HIGH_RISK or DESTRUCTIVE tools are registered. Retrieved log messages are untrusted data and cannot alter permissions or configuration.

## Search, pagination, and rate limits

`papertrail.event.search` supports Papertrail query text, system/group scope, epoch time bounds, and a bounded result limit. Papertrail search responses expose paging IDs such as `min_id` and `max_id`; callers can use the provider's documented search semantics for controlled scrolling rather than issuing broad request storms.

Papertrail documents API rate-limit status headers. The client handles HTTP 429 and server errors for READ requests with bounded exponential backoff and honors `X-RateLimit-Reset` or `Retry-After` when supplied. Writes are never automatically retried because duplicate mutations are unsafe. Authentication, authorization, and validation failures are not retried.

## Errors and reliability

Every request has a configurable timeout and accepts cancellation internally. Provider HTTP failures become `PapertrailError` with status and retry timing when available. Network failures are retried only for reads. 401/403 responses surface immediately so credentials or account access can be corrected.

## Security

The connector never logs or returns the API token. The upstream host is fixed, preventing user-controlled SSRF. Inputs are strict and no arbitrary URL/HTTP tool exists. Provider log content is treated as untrusted data; clients must not interpret retrieved text as system or tool instructions. Write capability requires both deployment opt-in and per-call approval. Secrets belong in environment variables or a secure process-level secret provider, never prompts or examples.

Papertrail webhooks are officially supported for saved-search alerts, but this package does not create or validate inbound webhook endpoints; therefore it does not claim webhook management support.

## Testing

```bash
npm test
```

Tests cover missing authentication, tool registration, strict validation, credential isolation in headers, read behavior, write denial, human approval, throttling/retry behavior, no-retry writes, and authentication errors. Tests require no live credentials.

## Limitations

This connector intentionally implements a focused operational subset of Papertrail's API. It does not expose account/user administration, deletion, archive file download, destinations, or arbitrary settings endpoints. Papertrail API capabilities and limits can change; validate official documentation before expanding the allowlist.
