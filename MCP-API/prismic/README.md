# Prismic MCP/API Connector

Reusable read-only MCP server for Prismic repositories. It exposes stable, provider-scoped tools over stdio and uses Prismic's official `@prismicio/client` Document API SDK. Prismic also operates an official hosted MCP server at `https://mcp.prismic.io/mcp`; that upstream is the preferred surface for interactive content drafting, bulk edits, localization, release staging, and user-authorized publishing. This package deliberately does not duplicate those write workflows because the hosted MCP preserves Prismic's user permissions and draft/release review model.

## Official sources
- Prismic MCP: https://prismic.io/features/mcp
- MCP product update: https://prismic.io/updates/mcp
- Documentation: https://prismic.io/docs
- API Explorer / Document API capabilities: https://prismic.io/updates/api-explorer
- Migration API GA and 1 request/second migration limit: https://prismic.io/updates/general-availability-of-the-migration-api

## Transport and architecture
`MCP client -> this stdio server -> official @prismicio/client -> Prismic Document API/CDN`.
Credentials stay in process environment and are never returned to the model. The official remote MCP is not proxied here: doing so would require delegating an end-user OAuth session and dynamically trusting upstream tools, which is less predictable than using Prismic's hosted MCP directly for writes.

## Authentication
Set `PRISMIC_REPOSITORY_NAME`. For private repositories set `PRISMIC_ACCESS_TOKEN`; public repositories may not need a token. Use the least-privileged repository token suitable for content reads. Never place tokens in prompts, tool arguments, logs, examples, or source control.

Environment variables: `PRISMIC_REPOSITORY_NAME` (required), `PRISMIC_ACCESS_TOKEN` (optional for public content), `PRISMIC_TIMEOUT_MS` (1000-60000; default 10000), `PRISMIC_MAX_RETRIES` (0-4; default 2).

## Install and run
```bash
npm install
cp .env.example .env
# export values with your secret manager or shell; .env loading is intentionally not implicit
npm start
```
Any MCP client that supports a local stdio server can launch `node /absolute/path/MCP-API/prismic/src/server.js` with the required environment. Compatibility depends on the client's standard MCP stdio support.

## Tools
| Tool | Permission | Approval | Purpose |
|---|---|---|---|
| `prismic.document.get` | READ | No | Document by ID |
| `prismic.document.get_by_uid` | READ | No | Document by type + UID |
| `prismic.document.list_by_type` | READ | No | Paginated type query |
| `prismic.document.list_by_tag` | READ | No | Paginated tag query |
| `prismic.document.list_by_ids` | READ | No | Up to 50 IDs |
| `prismic.document.list_all` | READ | No | Bounded pagination |
| `prismic.document.search_fulltext` | READ | No | Full-text query on a validated `my.type.field` path |
| `prismic.repository.tags` | READ | No | Repository tags |

No WRITE, HIGH_RISK, or DESTRUCTIVE tool is registered. For content writes use the official Prismic MCP, whose changes are staged as drafts/releases; publishing is user-requested and requires the user's publishing rights. This connector cannot escalate those permissions.

## Reliability and rate limits
Pagination is bounded to 100 results per call. ID batches are capped at 50. Requests use a configurable timeout and at most four retries. Only HTTP 429 and 5xx/network failures are retried; `Retry-After` is honored when numeric, otherwise exponential backoff is used. Validation, authorization, and ordinary 4xx failures are not blindly retried. Prismic's published Content API limits and monthly quotas vary by caching/plan; callers should avoid polling and unnecessary broad queries. The separate Migration API is documented by Prismic as rate-limited to 1 request/second per repository and is not used by this server.

## Security
Provider content is explicitly wrapped as `untrusted:true`: documents may contain prompt-injection text and must never alter system policy, permissions, credentials, or approval decisions. Tool schemas bound query sizes and reject arbitrary URLs, so callers cannot turn this connector into an SSRF proxy. Repository endpoint construction is delegated to the official SDK from a validated repository name. Secrets remain in the connector process. The server exposes no generic request tool and no write/delete/publish operation.

## Errors
Provider/SDK errors are mapped to MCP errors with a bounded message. Tokens are never intentionally included. Authentication or scope failures require operator action and are not retried as transient errors.

## Tests
`npm test` validates authentication/configuration requirements and reliability bounds without live credentials. Network behavior is isolated in `createPrismicClient(config, fetchImpl)` so callers can inject a fake fetch for additional integration tests.

## Limitations
This connector intentionally covers Document API reads, not every Prismic endpoint. It does not create/update/archive documents, manipulate content models, upload assets, or publish releases. Those operations must not be inferred from the read tools. Use Prismic's official hosted MCP for supported agentic content workflows, or the official Migration API/SDK for purpose-built migrations with appropriate review and approval controls.
