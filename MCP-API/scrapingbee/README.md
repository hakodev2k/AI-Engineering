# ScrapingBee MCP/API Connector

Reusable MCP server for safe, read-oriented live-web workflows through ScrapingBee. It exposes a stable provider-scoped interface, keeps the API key inside the connector, prefers ScrapingBee's official hosted MCP server when a compatible allowlisted tool is available, and falls back to the official REST APIs where the same capability is documented.

## Official sources researched

Current official sources checked on 2026-09-15:

- Remote MCP: https://www.scrapingbee.com/documentation/remote-mcp/
- HTML API: https://www.scrapingbee.com/documentation/
- Google API: https://www.scrapingbee.com/documentation/google-api/
- Product/API overview: https://www.scrapingbee.com/

ScrapingBee runs an official hosted Streamable HTTP MCP server at `https://mcp.scrapingbee.com/mcp`. Its documented tools include `get_page_text`, `get_page_html`, `extract_page_data`, `get_screenshot`, `get_file`, `fast_search`, `get_google_search_results`, AI endpoints, Amazon/Walmart endpoints, YouTube endpoints, and `get_scrapingbee_usage`. The hosted MCP authenticates by placing the ScrapingBee API key in its connection URL query string. The connector constructs that URL only inside the credential/transport layer and never exposes the full authenticated URL to the LLM.

The REST HTML and Google APIs now recommend `Authorization: Bearer <API_KEY>`; the older `api_key` query parameter is deprecated for those APIs. This connector uses the Bearer header for REST calls.

## Transport strategy

Capability routing is transparent to callers:

1. For capabilities with an official MCP tool, the connector attempts the pinned ScrapingBee MCP endpoint first.
2. It discovers upstream tools, restricts them to a fixed allowlist, and invokes an MCP tool only when the discovered schema can satisfy its required fields.
3. If MCP is unavailable or schema compatibility cannot be established, page and search operations fall back to documented REST endpoints.
4. `scrapingbee.account.usage` is MCP-only because this connector does not claim an undocumented REST usage endpoint.

No arbitrary provider request passthrough is exposed.

## Supported tools

| Tool | Upstream | Risk | Permission | Approval |
|---|---|---|---|---|
| `scrapingbee.page.text` | MCP -> HTML API | READ | `scrape:read` | only premium/stealth options |
| `scrapingbee.page.html` | MCP -> HTML API | READ | `scrape:read` | only premium/stealth options |
| `scrapingbee.page.extract` | MCP -> HTML API | READ | `scrape:read` | only premium/stealth options |
| `scrapingbee.page.screenshot` | MCP -> HTML API | READ | `scrape:read` | only premium/stealth options |
| `scrapingbee.search.web` | MCP fast search -> Google API | READ | `search:read` | no |
| `scrapingbee.search.google.news` | MCP -> Google API | READ | `search:read` | no |
| `scrapingbee.search.google.images` | MCP -> Google API | READ | `search:read` | no |
| `scrapingbee.search.google.maps` | MCP -> Google API | READ | `search:read` | no |
| `scrapingbee.search.google.shopping` | MCP -> Google API | READ | `search:read` | no |
| `scrapingbee.account.usage` | official MCP only | READ | `account:read` | no |

The connector intentionally does not expose write/destructive operations because the selected ScrapingBee workflows are retrieval/search operations. That makes the default agent surface materially safer.

## Authentication

Set `SCRAPINGBEE_API_KEY` from a secret manager or environment variable. ScrapingBee uses account API keys rather than OAuth scopes for the documented APIs implemented here, so least privilege is achieved by keeping the key inside the connector and exposing only bounded read tools.

For REST calls, the key is sent only as an `Authorization: Bearer` header. For official MCP calls, ScrapingBee requires the key in the MCP URL query parameter; the connector constructs that URL in memory and pins the host/path to `https://mcp.scrapingbee.com/mcp` so an agent cannot redirect the credential to another server.

Never put the API key in prompts, tool inputs, logs, source control, examples, or error messages.

## Environment variables

Copy `.env.example` and populate only the secrets/settings you need.

- `SCRAPINGBEE_API_KEY` — required.
- `SCRAPINGBEE_API_BASE_URL` — defaults to `https://app.scrapingbee.com/api/v1`.
- `SCRAPINGBEE_MCP_URL` — pinned default `https://mcp.scrapingbee.com/mcp`; non-default values are rejected by the upstream MCP bridge.
- `SCRAPINGBEE_PREFER_MCP` — defaults to `true`.
- `SCRAPINGBEE_TIMEOUT_MS` — request timeout.
- `SCRAPINGBEE_MAX_RETRIES` — bounded retry count, capped at 5.
- `SCRAPINGBEE_MAX_RESPONSE_BYTES` — output-size guard, capped at 5 MB.
- `SCRAPINGBEE_COST_APPROVAL_TOKEN` — opaque host/operator grant for expensive proxy modes.
- `SCRAPINGBEE_REQUIRE_COST_APPROVAL` — defaults to `true`.

## Installation

```bash
cd MCP-API/scrapingbee
npm install
npm run build
```

Node.js 20+ is required.

## Running

```bash
npm start
```

The connector itself is a local MCP stdio server. An MCP host can launch `dist/src/index.js`. Example:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/scrapingbee/dist/src/index.js"],
  "env": {
    "SCRAPINGBEE_API_KEY": "<secret-from-host>"
  }
}
```

This package is usable by MCP clients that can launch stdio servers. The upstream ScrapingBee server is remote Streamable HTTP; callers do not need to know which transport handled a particular capability.

## Permission and approval model

Every exposed operation is classified `READ`. Ordinary requests may run automatically. Premium and stealth proxy modes can consume substantially more credits than normal requests, so the connector treats those flags as a conditional cost-sensitive action: by default they require an opaque `costApprovalId` supplied by the host/operator and matched against `SCRAPINGBEE_COST_APPROVAL_TOKEN`.

An agent cannot disable the approval gate through a tool call and cannot change provider credentials or upstream endpoints.

## Rate limits and credit handling

ScrapingBee charges credits according to endpoint/features. Its current HTML API documentation describes a cost ladder from normal requests through JavaScript, premium proxies, and stealth proxies, with AI extraction adding credits. Google API requests have their own credit costs. Plan-level concurrency limits apply.

The official MCP documentation states that MCP calls consume the same credits as the underlying API, adds no MCP surcharge, and may return HTTP 429 under global or account concurrency pressure. `get_scrapingbee_usage` is documented as limited to 6 calls per minute.

REST handling honors `Retry-After` on 429 responses and uses bounded exponential backoff for 429 and transient 5xx/network failures. Because all implemented REST calls are GET/read operations, retries are safe from provider-side mutation. Authentication, validation, and approval failures are never retried.

## Security

Provider content is untrusted input. The MCP response wrapper sets `untrustedProviderData: true`; consuming agents must treat scraped text, HTML, search snippets, selectors, and metadata as data, never as instructions that can alter permissions or system policy.

Target URL tools enforce HTTPS, reject credentials embedded in URLs, and block localhost, common metadata hosts, and literal private/link-local IPv4/IPv6 ranges. This reduces SSRF risk. Deployments with stronger network controls should also enforce egress filtering/DNS resolution policy at the runtime layer because DNS rebinding cannot be fully prevented by string validation alone.

Extraction rules are capped at 30 fields with bounded selector lengths. Search queries and selectors are length-limited. Responses are size-limited before being returned to the model. Binary screenshots are base64 encoded only after the size check.

The official MCP bridge pins the ScrapingBee endpoint, uses a fixed tool allowlist, checks discovered required fields before invocation, and falls back rather than guessing when schemas change. The REST API key is never forwarded as an Authorization header to the upstream MCP server; MCP receives it only in the provider-required query parameter on the pinned server URL.

## Error handling

Tool failures are returned as MCP errors with a sanitized type/message. Expected categories include validation, authentication, rate limiting, timeout/network failure, upstream provider error, approval denial, and unavailable MCP-only capability. Authorization headers and API keys are never included in returned error data.

## Testing

```bash
npm test
```

Tests use fakes and require no live ScrapingBee credentials. They cover unique tool registration, read-only risk classification, SSRF/URL validation, cost approval, REST fallback construction, official MCP preference, extraction validation, and safe failure of the MCP-only usage capability.

## Limitations

- The connector intentionally exposes a focused subset of ScrapingBee rather than every upstream MCP tool.
- It does not expose ChatGPT/Gemini prompting or retail/YouTube specialist tools in order to keep the package centered on reusable web retrieval/search workflows and avoid redundant model-to-model delegation.
- It does not expose JavaScript scenarios or arbitrary POST/PUT forwarding because those can trigger state-changing actions on third-party websites.
- Private-network scraping is intentionally blocked even though the provider API can technically accept broad URLs.
- Premium/stealth proxy use is gated by connector approval but still consumes the account's ScrapingBee credits after approval.
- ScrapingBee can change upstream MCP schemas. Runtime discovery causes this connector to fail over safely instead of assuming undocumented parameters.
