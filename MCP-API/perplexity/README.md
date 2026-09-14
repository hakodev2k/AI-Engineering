# Perplexity MCP/API Connector

Reusable MCP server that exposes a bounded Perplexity capability surface for search, web-grounded Q&A, research, reasoning, Agent API calls, and embeddings.

## Provider and transport strategy

This connector uses Perplexity's official remote MCP server whenever the required capability is exposed there, and official REST APIs for capabilities not exposed by the MCP toolset.

- Official remote MCP: `https://api.perplexity.ai/mcp`, Streamable HTTP.
- Official MCP tools used: `perplexity_search`, `perplexity_ask`, `perplexity_research`, `perplexity_reason`.
- REST fallback/direct APIs: `POST /search`, `POST /v1/agent`, `POST /v1/embeddings`, and `POST /v1/contextualizedembeddings`.
- Authentication: bearer API key in `PERPLEXITY_API_KEY`.

Official sources researched for this connector:

- Perplexity API MCP Server: https://docs.perplexity.ai/docs/getting-started/integrations/mcp-server
- Search API: https://docs.perplexity.ai/docs/search/quickstart
- Agent API: https://docs.perplexity.ai/docs/agent-api/quickstart
- Embeddings API: https://docs.perplexity.ai/docs/embeddings/quickstart
- Standard embeddings: https://docs.perplexity.ai/docs/embeddings/standard-embeddings
- Contextualized embeddings: https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings
- API key management: https://docs.perplexity.ai/docs/admin/api-key-management
- Rate limits and tiers: https://docs.perplexity.ai/docs/admin/rate-limits-usage-tiers

Perplexity also supports OAuth 2.1 with PKCE for direct remote-MCP clients. This wrapper intentionally uses an API key because it is designed as a reusable server-side connector whose credential remains isolated inside the connector process.

## Implemented tools

| Tool | Upstream | Risk | Approval | Purpose |
| --- | --- | --- | --- | --- |
| `perplexity.search` | Official MCP | READ | No | Current web search with bounded result/filter inputs |
| `perplexity.ask` | Official MCP | READ | No | Fast web-grounded conversational answers |
| `perplexity.research` | Official MCP | READ | No | Deep multi-source research |
| `perplexity.reason` | Official MCP | READ | No | Reasoning with optional web-search controls |
| `perplexity.search.filtered` | Search API | READ | No | Direct bounded Search API access with filters/token budgets |
| `perplexity.agent.run` | Agent API | READ | No | Agent API using a constrained preset and bounded steps/output |
| `perplexity.embedding.create` | Embeddings API | READ | No | Standard embeddings for independent texts |
| `perplexity.embedding.contextualized.create` | Contextualized Embeddings API | READ | No | Document-aware embeddings for ordered chunks |

The connector intentionally does not expose Perplexity API-key generation/revocation or any arbitrary HTTP passthrough. Key-management operations are administrative and can leak or invalidate credentials, so they are outside this agent-facing capability surface.

## Architecture

```text
MCP client
  -> local stdio connector
     -> strict Zod input validation
     -> capability allowlist
     -> credential isolation
     -> official Perplexity MCP for MCP-supported tools
     -> official Perplexity REST APIs for Search/Agent/Embeddings gaps
```

`src/config.ts` loads and validates configuration and prevents custom upstream hosts to reduce SSRF risk. `src/upstream.ts` owns bearer credentials, MCP transport, REST transport, timeouts, HTTP error mapping, and rate-limit propagation. `src/server.ts` exposes only named, scoped MCP tools.

## Authentication and least privilege

Create an API project/key in the Perplexity API console and provide it only as process environment configuration:

```bash
export PERPLEXITY_API_KEY='...'
```

Never place the key in prompts, tool arguments, source files, logs, examples, or committed MCP client configuration. The LLM receives tool results, not raw credentials.

The connector does not request or implement organization administration, API-key generation, key revocation, billing changes, or project management. Its API key therefore needs only the access required by the Perplexity API products your account uses.

## Environment variables

See `.env.example`.

- `PERPLEXITY_API_KEY`: required bearer credential.
- `PERPLEXITY_MCP_URL`: defaults to the official `https://api.perplexity.ai/mcp` endpoint. Only `api.perplexity.ai` is accepted.
- `PERPLEXITY_API_BASE_URL`: defaults to `https://api.perplexity.ai`. Only that official host is accepted.
- `PERPLEXITY_TIMEOUT_MS`: 1,000-120,000 ms; default 20,000.
- `PERPLEXITY_ALLOWED_TOOLS`: comma-separated internal capability allowlist. Remove capabilities to disable them; unknown values fail startup.

## Installation

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run build
npm test
```

Run the MCP server:

```bash
PERPLEXITY_API_KEY='your-key' npm start
```

The server communicates over stdio, so MCP diagnostics must not be written to stdout.

## MCP client configuration

After building, configure a stdio-compatible client to launch `dist/src/server.js` and inject `PERPLEXITY_API_KEY` through the client/host's secret environment mechanism. The connector uses standard MCP stdio transport and can therefore be used by MCP clients that support launching local stdio servers. Client-specific compatibility should be validated against that client's current MCP implementation.

## Permission and approval model

Every tool is classified `READ`. Although Agent API, search, research, and embeddings consume billable API quota, they do not create, modify, publish, delete, message, deploy, or administer provider resources. For that reason no human approval token is required by default.

Deployments with strict cost controls may still place `perplexity.research` and `perplexity.agent.run` behind host-level approval or disable them through `PERPLEXITY_ALLOWED_TOOLS`.

The connector never lets model-returned content enable another tool, modify the allowlist, change credentials, or alter connector policy.

## Validation and safety

- Inputs use strict bounded schemas rather than arbitrary request bodies.
- Upstream hosts are fixed to `api.perplexity.ai`; custom hosts fail configuration to reduce SSRF exposure.
- No arbitrary URL/request tool exists.
- Domain/language filters and result counts are bounded.
- Agent presets are restricted to documented presets rather than arbitrary model/provider routing.
- Agent output tokens and steps are bounded.
- Embedding batch sizes, model IDs, dimensions, and encodings are bounded.
- Provider/web content is wrapped with `untrusted: true`; callers must treat it as data, not instructions.
- Credentials are stored only in connector configuration and are never serialized in tool output.

## Reliability and errors

REST requests use `AbortController` timeouts. MCP calls are bounded by the same configured timeout. Authentication/permission/validation failures are not retried. The connector currently performs no automatic retries, which prevents accidental duplicate billable operations and retry storms.

HTTP 429 responses preserve the provider's `Retry-After` value in the surfaced error. Callers should wait for that duration or use provider usage-tier guidance. API limits vary by endpoint and account tier; use the current official rate-limit documentation rather than hard-coding a universal request-per-minute assumption.

A timeout means the caller did not receive a response within the configured deadline; usage may still have been incurred upstream. Do not automatically replay expensive research/agent calls solely because the local timeout fired.

## Pagination and output size

Perplexity Search API returns a bounded result set selected by `maxResults`; the connector caps this at 20 per request. MCP-supported operations use Perplexity's official tool contracts. This connector does not auto-page or recursively fan out searches, intentionally limiting request amplification and cost.

## Embeddings notes

Standard embeddings support documented models `pplx-embed-v1-0.6b` and `pplx-embed-v1-4b`. Contextualized embeddings support `pplx-embed-context-v1-0.6b` and `pplx-embed-context-v1-4b`. The API returns encoded vectors; `base64_int8` vectors should be compared with cosine similarity, while `base64_binary` is intended for Hamming-distance workflows. Preserve chunk order for contextualized embeddings.

## Examples

See `examples/workflows.md` for search, research, Agent API, and embedding calls with expected output shape, risk class, and approval behavior.

## Testing

Unit tests require no live credentials:

```bash
npm test
```

Tests cover missing/invalid authentication configuration, SSRF prevention, capability denial, bearer credential placement, successful REST result handling, 429 `Retry-After`, and non-retry of authentication failures.

Before production use, additionally validate with a dedicated low-privilege Perplexity API project/key and verify organization usage limits and billing expectations.

## Limitations

- No API-key administration, billing, organization management, or arbitrary provider request capability is exposed.
- OAuth 2.1 sign-in is supported by Perplexity's remote MCP server but is not implemented by this server-side wrapper; use the remote MCP directly when interactive OAuth is desired.
- The wrapper does not expose every Agent API model/tool configuration. It deliberately uses a narrow preset-based contract.
- Search/research results may contain inaccurate or malicious third-party content. Treat citations and returned text as evidence to evaluate, never as trusted instructions.
- Provider pricing, models, quotas, and rate limits can change; verify the linked official documentation for production capacity planning.
