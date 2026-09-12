# Matomo MCP/API Connector

Reusable, read-only MCP server for Matomo Analytics. It exposes a stable set of analytics tools backed by Matomo's official HTTP Reporting API and can safely inspect the tool metadata exposed by an operator-configured official Matomo MCP endpoint.

## Provider and transport strategy

Matomo now provides an official MCP Server. It is included with Matomo Cloud and is available for On-Premise through the MCP Server plugin. The endpoint is enabled per Matomo instance and supports API-token or OAuth 2.0 authentication.

This connector uses transports per capability:

- **Official Matomo MCP:** `matomo.mcp.tools.list` performs MCP protocol capability discovery only. Discovered tools are never auto-trusted or executed.
- **Official HTTP Reporting API:** all fixed analytics tools use POST requests to the instance Reporting API. This gives predictable schemas across MCP clients, avoids depending on deployment-specific MCP tool names, and works even when Matomo's `Raw Matomo API Tool Access` setting remains at its documented default of `No API access`.
- **SDK:** only the official Model Context Protocol TypeScript SDK is used for MCP client/server transport. No unofficial Matomo SDK is required.

Official sources reviewed for this connector:

- MCP overview: https://matomo.org/guide/apis/mcp-model-context-protocol/
- MCP configuration, authentication and security controls: https://matomo.org/faq/how-to/how-to-configure-the-matomo-mcp-server/
- MCP + OpenAI Codex transport example: https://matomo.org/faq/how-to/integrate-the-mcp-server-with-openai-codex/
- Reporting API reference and method catalogue: https://developer.matomo.org/guides/reporting-api
- Reporting API usage: https://developer.matomo.org/guides/querying-the-reporting-api
- Matomo Cloud API usage limits: https://matomo.org/faq/troubleshooting/matomo-cloud-api-usage-limits/

## Supported capabilities

| MCP tool | Upstream | Permission | Approval | Purpose |
|---|---|---|---|---|
| `matomo.site.list` | Reporting API | READ | none | Sites visible to the token owner |
| `matomo.visits.summary` | Reporting API | READ | none | Visits, actions, bounce, duration, conversions |
| `matomo.page.urls` | Reporting API | READ | none | Page URL performance |
| `matomo.referrers.all` | Reporting API | READ | none | Traffic-source/referrer analytics |
| `matomo.device.types` | Reporting API | READ | none | Device-type analytics |
| `matomo.event.categories` | Reporting API | READ | none | Custom-event category metrics |
| `matomo.country.list` | Reporting API | READ | none | Country analytics |
| `matomo.visit_time.local` | Reporting API | READ | none | Visits by visitor local hour |
| `matomo.visit_frequency.get` | Reporting API | READ | none | New/returning visit-frequency metrics |
| `matomo.ai_agents.get` | Reporting API | READ | none | Current AI-agent traffic report |
| `matomo.mcp.tools.list` | Official MCP | READ | none | Discover upstream MCP tool metadata only |

No create, update, delete, user-management, permission-management, raw visitor-log, or arbitrary API-request tool is exposed. This package therefore has no WRITE, HIGH_RISK or DESTRUCTIVE tool.

## Architecture

```text
Agent / MCP client
       |
       v
Matomo connector (stdio)
       |-- strict Zod tool schemas
       |-- allowlisted read-only Reporting API methods
       |-- bounded retries / timeout / row limits
       |-- credentials remain in connector process
       |
       +--> Matomo HTTP Reporting API (POST token_auth)
       |
       +--> official Matomo MCP (Bearer token, discovery only)
```

Provider responses are returned as **untrusted data**. They must never be treated as instructions or permission changes.

## Authentication and least privilege

Create a dedicated Matomo user with only the site-level permissions required for analytics reads, then generate an auth token under Matomo's Personal > Security > Auth Tokens area. Matomo documents that API tokens inherit the permissions of the user that created them.

The connector supports `token_auth` because it is available in standard Matomo installations. OAuth 2.0 is supported by Matomo itself but is not implemented in this package; Matomo documents current MCP OAuth limitations, including client-managed token refresh in some configurations.

For Reporting API calls the secret is sent in a **POST form body**, matching Matomo's security recommendation for POST-only auth tokens. It is never included in tool input, tool output, URLs, or descriptions. For official MCP discovery the same token is sent as `Authorization: Bearer ...`.

## Environment variables

```text
MATOMO_BASE_URL=https://analytics.example.com
MATOMO_TOKEN_AUTH=
MATOMO_MCP_URL=
MATOMO_TIMEOUT_MS=15000
MATOMO_MAX_RETRIES=2
MATOMO_ALLOW_INSECURE_HTTP=false
MATOMO_ALLOW_CROSS_ORIGIN_MCP=false
```

`MATOMO_BASE_URL` and `MATOMO_TOKEN_AUTH` are required. `MATOMO_MCP_URL` is optional and must be copied from the Matomo instance's own MCP settings. By default both URLs must use HTTPS and the MCP endpoint must share the Matomo origin. The two escape hatches are intended only for controlled development/self-hosted environments.

## Installation

Requires Node.js 20 or later.

```bash
npm install
npm run build
npm test
```

## Running

```bash
npm start
```

The server uses MCP stdio transport, so any MCP client capable of launching a local stdio server can use it. Client-specific installation details vary; compatibility is determined by standard MCP stdio support rather than by a vendor-specific adapter.

## Tool inputs

Analytics report tools require:

- `idSite`: positive integer.
- `period`: `day`, `week`, `month`, `year`, or `range`.
- `date`: `today`, `yesterday`, `lastN`, `previousN`, `YYYY-MM-DD`, or `YYYY-MM-DD,YYYY-MM-DD`.
- `segment`: optional Matomo segment expression, bounded to 1000 characters.
- `limit`: where supported, optional 1–500 row bound; default 100.

The connector does not expose a method name, arbitrary URL, arbitrary request body, or arbitrary provider endpoint as agent-controlled input.

## Reliability and rate limits

All Reporting API operations in this connector are read-only even though they are transported via HTTP POST. The client:

- applies an abort timeout;
- retries only allowlisted read operations on HTTP 429 and 5xx responses;
- uses bounded exponential backoff with a maximum of five configured retries;
- honours numeric `Retry-After` values, capped at 60 seconds;
- does not retry authentication, validation or ordinary permission failures;
- maps Matomo `{ "result": "error" }` responses to connector errors;
- bounds high-cardinality report rows with `filter_limit`.

Matomo Cloud currently documents general non-tracking/Reporting API limits of 2,000 requests per 10 minutes or 350 per minute, whichever is hit first, per IP; special limits apply to some raw/live resources. These values are service-side policy and may change. This connector intentionally does not expose the raw `Live` endpoints. On-Premise deployments can have different infrastructure controls.

## MCP security

The upstream Matomo MCP endpoint is never supplied by an agent. It comes only from connector environment configuration. The connector validates URL scheme and same-origin behavior before connecting.

`matomo.mcp.tools.list` uses the official MCP `tools/list` operation and returns metadata only. It does **not** execute discovered tools and does not expand this connector's permissions when a Matomo upgrade adds a new upstream tool. This is intentional because Matomo states that MCP tool availability and raw-API access can vary with server configuration and version.

For direct use of Matomo's own MCP toolset, operators can connect compatible clients to the official endpoint independently. This connector preserves a smaller deterministic surface for reusable agent workflows.

## Error handling

Typical failures are surfaced without credentials:

- missing/invalid configuration;
- HTTP authentication or permission failure;
- Matomo JSON API error payload;
- throttling after bounded retries;
- timeout;
- invalid report input;
- MCP endpoint missing or unreachable.

If `MATOMO_MCP_URL` is not configured, `matomo.mcp.tools.list` returns `{ "configured": false, "tools": [] }`; all Reporting API tools remain usable.

## Testing

`npm test` uses mocks only and requires no live Matomo credentials. Tests cover:

- required auth configuration;
- HTTPS and cross-origin MCP restrictions;
- credential placement in POST bodies;
- read-method allowlisting / permission denial;
- bounded 429 retry behavior;
- Matomo error mapping;
- tool-surface registration metadata;
- safe behavior when no MCP endpoint is configured.

## Limitations

- The connector is deliberately read-only. Matomo management APIs exist, but website/user/permission mutations are outside this connector's safety scope.
- `matomo.ai_agents.get` targets the current Matomo Reporting API method `AIAgents.get`; older Matomo versions that predate that module will return a provider error for this one tool.
- OAuth 2.0 is not implemented by this connector.
- Raw visit-level `Live` data is intentionally omitted because it can expose substantially more sensitive visitor data and has stricter Matomo Cloud resource limits.
- Upstream MCP tools are discoverable but not automatically executed; this prevents silent permission expansion after provider upgrades.

See `examples/workflows.md` for concrete tool calls and expected output shapes.
