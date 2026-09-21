# Exa MCP/API Connector

Reusable MCP connector for Exa web search, content fetching, advanced search, and Exa Agent research. It exposes a small stable tool surface while delegating supported operations to Exa's official hosted MCP server.

## Upstream strategy

Transport: official Exa remote MCP over Streamable HTTP at `https://mcp.exa.ai/mcp`. Exa's official MCP repository documents `web_search_exa` and `web_fetch_exa` as defaults, with `web_search_advanced_exa` and `agent_run` opt-in tools. The connector explicitly allowlists only these four upstream tools; newly discovered upstream tools are never trusted automatically.

Official sources:
- Exa MCP docs: https://exa.ai/docs/reference/exa-mcp
- Official MCP implementation: https://github.com/exa-labs/exa-mcp-server
- Exa API docs: https://docs.exa.ai/

No REST fallback is needed for the implemented capabilities because the official MCP server supports all four. Unsupported Exa capabilities are intentionally not exposed.

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `exa.web.search` | `web_search_exa` | READ | No |
| `exa.web.search_advanced` | `web_search_advanced_exa` | READ | No |
| `exa.web.fetch` | `web_fetch_exa` | READ | No |
| `exa.research.run` | `agent_run` | WRITE / potentially billable | Required by default |

All returned web/provider content is wrapped with `trust: untrusted_external_content`. Retrieved text must never be treated as connector policy or instructions.

## Authentication

Exa's hosted MCP supports anonymous rate-limited access. For higher limits and Exa Agent, Exa documents OAuth or an API key. This local connector supports API-key credential isolation through `EXA_API_KEY`; the key remains in the transport layer and is never included in tool arguments or model-visible output. For interactive clients that want Exa-managed OAuth directly, connect the client to Exa's hosted MCP endpoint instead of placing OAuth tokens in prompts.

No provider scopes are requested by this package: Exa API keys authorize Exa service access according to the Exa account/key configuration. Use a dedicated key and restrict/rotate it in Exa where available.

## Environment

Copy `.env.example` values into your secret environment provider. `EXA_API_KEY` is optional for anonymous search/fetch but normally required for `agent_run`. `EXA_REQUIRE_APPROVAL=true` is the safe default. `EXA_TIMEOUT_MS` accepts 1000–120000. `EXA_MAX_RETRIES` accepts 0–4. Never commit `.env` or credentials.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The connector speaks MCP over stdio, so any MCP host capable of launching a local command can use `node /absolute/path/MCP-API/exa/dist/src/server.js`.

## Architecture

```text
MCP client / agent
  -> local Exa connector (strict schemas, approval, allowlist)
  -> credential-isolated Streamable HTTP MCP transport
  -> official Exa hosted MCP
  -> Exa search/research services
```

The LLM never receives `EXA_API_KEY`. The upstream tool allowlist prevents arbitrary MCP capability expansion. URL fetching accepts only explicit HTTP(S) URLs and batches at most ten URLs. Search result counts are capped at twenty.

## Permission and approval model

READ tools can run automatically. `exa.research.run` is classified WRITE because it starts an autonomous multi-step research job and may consume paid service usage. With the default configuration it requires the exact connector-local marker `APPROVE_EXA_RESEARCH`. The marker is stripped before the upstream call. Set `EXA_REQUIRE_APPROVAL=false` only in a trusted host that already enforces equivalent approval. There are no destructive tools in this connector.

## Reliability and rate limits

Calls use a bounded timeout and at most four configured retries. Retries are limited to likely transient network, throttling, and 502/503 failures with exponential backoff. Validation and approval failures are never sent upstream. Authentication failures are not intentionally retried. Exa's anonymous hosted MCP tier is rate-limited; authenticated account limits can vary, so the connector does not invent a numeric quota. Upstream rate-limit errors are surfaced after bounded retries.

## Security

- Credentials remain inside the connector transport.
- Upstream MCP tools are statically allowlisted.
- Third-party content is explicitly labeled untrusted.
- Strict Zod schemas constrain queries, result counts, dates, domains, URL schemes, and batch size.
- No arbitrary HTTP/API execution tool exists.
- Research requires approval by default.
- Secrets are never logged by connector code.
- Page text, search results, and upstream MCP responses cannot alter permissions, approval policy, tool registration, or system instructions.

## Testing

```bash
npm test
```

Unit tests use a fake upstream and require no live credentials. They cover configuration validation, schema validation, fetch batch limits, routing, approval denial, and approved research argument isolation. Network/MCP integration should be tested separately with a non-production Exa key when desired.

## Error handling

Invalid input fails locally through Zod. Missing approval fails locally. Transport, authentication, throttling, timeout, and provider errors are surfaced to the MCP host; only likely transient failures receive bounded retries. The connector does not silently fall back to an unofficial server or generic web provider.

## Compatibility

The package implements a standard stdio MCP server using the official TypeScript MCP SDK. It is suitable for MCP clients that can launch local stdio servers, including common desktop/IDE and custom-agent MCP hosts. Host-specific configuration is intentionally not hard-coded.

## Limitations

- OAuth is not brokered by this local wrapper; use `EXA_API_KEY` here or connect directly to Exa hosted MCP for its interactive OAuth flow.
- Exa Agent availability depends on authenticated account access and service plan.
- This connector deliberately exposes four goal-oriented capabilities rather than Exa's entire API.
- Provider content can contain prompt injection or malicious text and must remain untrusted data.
