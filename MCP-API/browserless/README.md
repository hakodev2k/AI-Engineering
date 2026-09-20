# Browserless MCP/API Connector

Reusable MCP gateway for Browserless browser automation. It exposes a deliberately bounded tool surface for public-web research, rendering, extraction, crawling and artifact export while keeping the Browserless credential inside the connector.

## Upstream strategy

Browserless provides an official hosted MCP server at `https://mcp.browserless.io/mcp`, with OAuth or bearer-token authentication, and an official npm MCP server (`@browserless.io/mcp`). The official MCP includes stateful browser-agent automation, Smart Scraper, REST-backed tools, account tools and resources. For this reusable safety gateway, the implemented tools use Browserless's official REST surfaces so schemas, SSRF restrictions, approval boundaries, retry policy and output marking remain fixed and auditable. Use the official hosted MCP directly when stateful browser interaction is required.

Official documentation researched for this connector:
- https://docs.browserless.io/mcp/overview
- https://docs.browserless.io/mcp/browserless-mcp-server/setup
- https://docs.browserless.io/mcp/rest-api-tools
- https://docs.browserless.io/mcp/browser-agent
- https://docs.browserless.io/rest-apis/screenshot-api
- https://docs.browserless.io/

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `browserless.page.content` | REST `/content` | READ | No |
| `browserless.page.screenshot` | REST `/screenshot` | READ | No |
| `browserless.page.pdf` | REST `/pdf` | READ | No |
| `browserless.page.scrape` | REST `/smart-scrape` | READ | No |
| `browserless.web.search` | REST `/search` | READ | No |
| `browserless.site.map` | REST `/map` | READ | No |
| `browserless.site.crawl` | REST `/crawl` | READ | No |
| `browserless.page.export` | REST `/export` | WRITE | Yes |

The connector intentionally does not expose arbitrary Puppeteer/JavaScript execution. Stateful logins, form filling and multi-step browser control belong on Browserless's official `browserless_agent` MCP tool, where the user can grant the appropriate account/session permissions explicitly.

## Authentication and credential isolation

Set `BROWSERLESS_TOKEN` in the process environment. The token is read only by the connector client and is never returned through MCP. `BROWSERLESS_BASE_URL` defaults to `https://production-sfo.browserless.io` and must use HTTPS. Browserless REST APIs authenticate with the account API token; the official hosted MCP additionally supports OAuth.

No OAuth scopes apply to API-token REST access. Access is bounded by the Browserless token/account configuration. Prefer a dedicated least-privilege Browserless token where account controls permit it.

## Install and run

Requirements: Node.js 20+ for this gateway. Browserless's own local MCP package currently documents Node.js 24+.

```bash
npm install
npm run build
BROWSERLESS_TOKEN=... npm start
```

Configure any stdio-capable MCP client to launch `node /absolute/path/to/browserless/dist/server.js` and provide `BROWSERLESS_TOKEN` through the client's secret/environment facility rather than prompt text.

Environment variables:
- `BROWSERLESS_TOKEN` — required secret API token.
- `BROWSERLESS_BASE_URL` — optional HTTPS Browserless regional/private endpoint.
- `BROWSERLESS_TIMEOUT_MS` — request timeout, default 30000.
- `BROWSERLESS_WRITE_APPROVAL` — reserved deployment-policy setting; per-call export approval is still mandatory.

## Safety model

All target URLs pass strict HTTP(S) validation. Localhost, loopback, link-local, RFC1918 IPv4 and `.local` targets are rejected to reduce SSRF risk. Retrieved page content is wrapped as `untrustedProviderData` so callers can preserve the instruction/data boundary. The connector never treats retrieved content as permission or configuration. Arbitrary upstream URLs and arbitrary code execution are not exposed.

`browserless.page.export` requires `approved: true` because it creates an artifact. READ tools execute without approval. There are no destructive tools. An agent cannot alter these classifications through tool input.

## Reliability and rate limits

Requests have cancellation via `AbortController` and a configurable timeout. HTTP 429 and 5xx failures are retried at most twice after the initial attempt, using `Retry-After` when supplied or bounded exponential backoff. Authentication, authorization, validation and other non-retryable 4xx responses are not retried. Search, map and crawl inputs have explicit result/depth limits to prevent accidental request amplification.

Browserless plans have account-specific usage/concurrency limits, so the connector does not invent a fixed quota. Provider 429 responses are preserved as throttling failures after bounded retries. For account usage, plan and session diagnostics, Browserless's official MCP exposes read-only account tools.

## Error handling

Provider errors become `BrowserlessError` with HTTP status and optional `Retry-After`. Network/timeout errors are bounded by the retry policy. Binary screenshot/PDF/export results are returned as base64 plus MIME type. JSON and text responses are normalized into the MCP response envelope.

## Events

This connector is request/response oriented and does not register Browserless webhooks. Browserless session/request observability is available through the official MCP account tools and Browserless dashboard.

## Testing

```bash
npm test
```

Unit tests require no live token. They cover credential configuration, HTTPS enforcement, SSRF blocking, permission/approval enforcement, successful reads, non-retryable authentication errors and bounded rate-limit retry behavior.

## Limitations

This gateway is intentionally stateless. It does not proxy Browserless's stateful Browser Agent, account-management tools, custom Puppeteer execution, authenticated profiles, CAPTCHA/stealth plan guarantees, or arbitrary BrowserQL. Use the official Browserless MCP for those capabilities after reviewing the permissions and plan features of the target Browserless account.
