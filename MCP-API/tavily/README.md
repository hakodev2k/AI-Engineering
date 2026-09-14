# Tavily MCP/API Connector

Reusable MCP server that gives agents a stable Tavily tool surface for web search, extraction, site mapping/crawling, asynchronous deep research, and API-usage inspection. Credentials stay inside the connector.

## Official sources and transport strategy

Tavily operates an official remote MCP server at `https://mcp.tavily.com/mcp/` and publishes the official `tavily-ai/tavily-mcp` server. The MCP implementation exposes search, extract, map, and crawl. It supports remote Streamable HTTP and OAuth-capable clients; API-key Bearer authentication is also documented. This connector uses only those four upstream MCP tools through a fixed allowlist and falls back to the official REST API if the MCP connection or discovered schema is unavailable/incompatible.

Tavily API v2-style endpoints use base URL `https://api.tavily.com` and Bearer API-key authentication. REST is used for Research (`POST /research`, `GET /research/{request_id}`) and Usage (`GET /usage`) because those capabilities are documented by Tavily's API reference and are not part of the official Tavily MCP server's four-tool surface.

Official references:

- https://docs.tavily.com/documentation/mcp
- https://github.com/tavily-ai/tavily-mcp
- https://docs.tavily.com/documentation/api-reference/introduction
- https://docs.tavily.com/documentation/api-reference/endpoint/search
- https://docs.tavily.com/documentation/api-reference/endpoint/extract
- https://docs.tavily.com/documentation/api-reference/endpoint/map
- https://docs.tavily.com/documentation/api-reference/endpoint/crawl
- https://docs.tavily.com/documentation/api-reference/endpoint/research
- https://docs.tavily.com/documentation/api-reference/endpoint/research-get
- https://docs.tavily.com/documentation/api-reference/endpoint/usage
- https://docs.tavily.com/documentation/rate-limits

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `tavily.web.search` | official MCP -> REST | READ | no |
| `tavily.web.extract` | official MCP -> REST | READ | no |
| `tavily.website.map` | official MCP -> REST | READ | no |
| `tavily.website.crawl` | official MCP -> REST | READ | no |
| `tavily.research.create` | REST | WRITE | required by default |
| `tavily.research.get` | REST | READ | no |
| `tavily.usage.get` | REST | READ | no |

Search/extract/map/crawl are classified READ because they do not mutate the user's Tavily resources, although they consume API credits. Research creation starts a potentially long-running, separately rate-limited paid task, so it is WRITE and gated by connector-side approval by default.

## Authentication and credential isolation

Set `TAVILY_API_KEY` from a secret manager or environment. The REST client sends it only as `Authorization: Bearer ...`. The MCP bridge sends the same key only to the exact official `mcp.tavily.com` endpoint and never includes it in model-visible arguments or results.

Tavily remote MCP also supports OAuth for compatible clients. This connector itself consumes an API key so it can provide deterministic REST fallback. If an MCP host handles OAuth independently, it may connect directly to Tavily's hosted MCP endpoint instead.

Optional `TAVILY_PROJECT_ID` is sent as `X-Project-ID` for usage attribution. Optional `TAVILY_HUMAN_ID` is forwarded as `X-Human-Id`; use an opaque internal identifier rather than email or other direct PII.

## Installation and running

```bash
cd MCP-API/tavily
npm install
npm run build
npm start
```

Node.js 20+ is required. The generated MCP server uses stdio transport and therefore works with MCP hosts that can launch a local stdio server. Example:

```json
{
  "command":"node",
  "args":["/absolute/path/MCP-API/tavily/dist/src/index.js"],
  "env":{"TAVILY_API_KEY":"<secret-from-host>"}
}
```

## Permissions and approvals

READ tools may execute automatically. `tavily.research.create` requires `approvalId` by default. The MCP host or approval UI must inject that grant out-of-band; the connector compares it with `TAVILY_APPROVAL_TOKEN`. Set `TAVILY_REQUIRE_RESEARCH_APPROVAL=false` only when an operator has explicitly accepted the billing/latency impact. There are no destructive tools in this connector.

## Validation and security

Tool schemas reject undeclared properties. URL-based tools accept only HTTPS URLs and reject localhost, common private/link-local IP ranges, and metadata endpoints to reduce SSRF risk. Mapping and crawling default `allowExternal` to false and impose tighter connector-side breadth/limit caps than Tavily's maximums, preventing an agent from silently expanding a crawl to hundreds of external pages.

The official upstream MCP bridge connects only to Tavily's official host, discovers tools, enforces an explicit `tavily-search`/`tavily-extract`/`tavily-map`/`tavily-crawl` allowlist, and falls back rather than trusting newly discovered tools or guessing schemas. Every provider response is marked `untrustedProviderData:true`; retrieved web content is data, not executable instructions.

## Reliability and rate limits

REST operations use `AbortController` timeouts and bounded retries. Authentication, validation, permission, and ordinary write failures are never blindly retried. GET requests may retry transient 5xx/network failures. HTTP 429 honors Tavily's `retry-after` header.

Tavily documents these limits as of September 2026:

- Default: Development 100 RPM; Production 1,000 RPM.
- Crawl: 100 RPM for both environments.
- Research creation: 20 RPM for both environments. Polling `GET /research/{id}` uses the default limit.
- Usage endpoint: 10 requests per 10 minutes.

Callers should poll research with backoff instead of busy-looping and avoid unnecessary high-depth crawls. Search `advanced` can cost more credits than `basic`; this connector defaults to `basic`.

## Errors

Provider errors are converted into MCP error responses without authorization headers or keys. `401`/`403` are surfaced without retry. `429` carries Tavily's throttling message and is retried only within the bounded retry budget. Validation and approval errors occur before provider calls.

## Testing

```bash
npm test
```

Tests use fakes and do not require live credentials. They cover registration, URL/SSRF validation, MCP preference with REST fallback, bounded crawl defaults, research approval, research creation, and usage retrieval.

## Limitations

- OAuth token acquisition/refresh is intentionally delegated to OAuth-capable MCP hosts; the connector's REST fallback requires `TAVILY_API_KEY`.
- The official MCP bridge only uses tools whose discovered schemas match the normalized arguments; otherwise it safely falls back to REST.
- This package does not expose unrestricted provider requests, account/key administration, arbitrary headers, or any destructive operation.
- Research streaming is not exposed through the stdio tool contract; research is created asynchronously and retrieved with `tavily.research.get`.
- Public web data can contain prompt injection, malicious text, stale information, or unsafe links. Downstream agents must preserve the untrusted-data boundary.
