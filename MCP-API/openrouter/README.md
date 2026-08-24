# OpenRouter MCP/API Connector

Reusable MCP server for bounded, approval-aware access to OpenRouter model discovery, benchmarks, generation metadata, usage analytics, chat inference, and embeddings.

## Transport strategy

OpenRouter publishes an official remote MCP server at `https://mcp.openrouter.ai/mcp` for live model data, pricing, benchmarks, documentation search, and test inference. This connector researches and documents that upstream but uses OpenRouter's official REST API for its exported agent tools because these capabilities need deterministic schemas, separate inference/management credentials, explicit approval boundaries, and predictable retry behavior. It does not depend on unofficial MCP servers.

Official sources:

- OpenRouter MCP announcement and endpoint: https://openrouter.ai/blog/announcements/openrouter-mcp-server/
- API quickstart: https://openrouter.ai/docs/quickstart
- Models: https://openrouter.ai/docs/api/api-reference/models/get-models
- Benchmarks: https://openrouter.ai/docs/api/api-reference/benchmarks/get-benchmarks
- Generation metadata/content: https://openrouter.ai/docs/api/api-reference/generations/get-generation and https://openrouter.ai/docs/api/api-reference/generations/list-generation-content
- Credits: https://openrouter.ai/docs/api/api-reference/credits/get-credits
- Activity: https://openrouter.ai/docs/api/api-reference/analytics/get-user-activity
- Analytics meta/query: https://openrouter.ai/docs/api/api-reference/beta-analytics/get-analytics-meta and https://openrouter.ai/docs/api/api-reference/beta-analytics/query-analytics

## Runtime and architecture

Node.js 20+ and the official Model Context Protocol TypeScript SDK are used. The local MCP server communicates over stdio. Credentials remain inside the connector and are inserted only into outbound OpenRouter requests.

```text
MCP client -> local MCP server -> validation/policy -> credential selection -> OpenRouter REST API
```

Provider responses and model output are treated as untrusted data. They are serialized as tool output and never interpreted as permission changes or connector configuration.

## Authentication

`OPENROUTER_API_KEY` is used for inference, embeddings, benchmarks, and generation operations. `OPENROUTER_MANAGEMENT_KEY` is used for credits, activity, and analytics endpoints that require a management key. Keeping them separate supports least privilege.

No secret is accepted as a tool argument and no credential is returned in tool output or errors.

## Environment variables

Copy `.env.example` and configure only the capabilities you need:

- `OPENROUTER_API_KEY`: standard OpenRouter API key.
- `OPENROUTER_MANAGEMENT_KEY`: management key for management-only reads.
- `OPENROUTER_APPROVAL_SECRET`: local secret used to verify explicit approvals for spend-producing or sensitive tools.
- `OPENROUTER_ALLOWED_MODELS`: optional comma-separated exact model allowlist. Empty means no connector-side model restriction.
- `OPENROUTER_APP_TITLE`: optional `X-Title` attribution header.
- `OPENROUTER_HTTP_REFERER`: optional `HTTP-Referer` attribution header.
- `OPENROUTER_TIMEOUT_MS`: request timeout, default 20000, allowed 1000..120000.
- `OPENROUTER_MAX_RETRIES`: bounded retries, default 3, allowed 0..5.

## Installation

From `MCP-API/openrouter`:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

The server uses stdio, so any MCP client that supports a local stdio MCP process can launch `node dist/server.js`. Compatibility depends on the client's support for standard MCP stdio transport; no product-specific integration is claimed beyond that protocol requirement.

## Tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `openrouter.model.list` | List/filter/sort current model metadata | READ | No |
| `openrouter.benchmark.list` | Read supported benchmark data | READ | No |
| `openrouter.generation.get` | Read one generation's routing/usage metadata | READ | No |
| `openrouter.generation.content.get` | Read retained prompt/completion content | HIGH_RISK | Yes |
| `openrouter.activity.list` | Read recent endpoint activity | READ | No |
| `openrouter.credits.get` | Read purchased/used credits | READ | No |
| `openrouter.analytics.meta` | Discover analytics schema | READ | No |
| `openrouter.analytics.query` | Run bounded analytics aggregation | READ | No |
| `openrouter.inference.chat` | Execute one non-streaming chat completion | WRITE | Yes |
| `openrouter.embedding.create` | Create embeddings | WRITE | Yes |

All schemas are bounded. There is no raw arbitrary URL/request tool.

## Approval model

READ tools execute without connector-level approval when their required credential exists. `openrouter.generation.content.get` requires approval because retained prompts/completions may contain sensitive user or application data. Chat and embedding calls require approval because they transmit supplied content to an external provider and consume credits.

An approval value is the lowercase hex HMAC-SHA256 of the exact tool name using `OPENROUTER_APPROVAL_SECRET`. Generate it outside the model/agent boundary. For example, approval for `openrouter.inference.chat` is `HMAC_SHA256(secret, "openrouter.inference.chat")`. The raw approval secret must never be sent to the model.

## Reliability and rate limits

The client honors `Retry-After` when supplied and otherwise uses bounded exponential backoff. Safe GET requests retry on HTTP 429 and 5xx up to `OPENROUTER_MAX_RETRIES`. `openrouter.analytics.query` is a read-only POST and is explicitly retryable. Chat-completion and embedding POSTs are not automatically retried because retrying may duplicate billable work.

OpenRouter rate limits depend on account/key/model/provider and may change. The connector therefore follows server responses instead of hard-coding a universal request rate. OpenRouter's public dataset endpoints can have their own documented fixed limits; those endpoints are not exposed here.

## Error handling

HTTP errors are mapped to `OpenRouterError` with status and bounded provider error text. `Retry-After` is preserved when available. Authentication/permission and validation failures are never blindly retried. Request timeouts use `AbortController`; network failures are retried only when the operation is classified retry-safe.

## Security considerations

- Credentials are environment-only and never MCP inputs.
- Exact model allowlisting can prevent agents from silently escalating to unapproved models.
- Tool arguments are schema validated and size bounded.
- The base URL is fixed to `https://openrouter.ai/api/v1`, eliminating arbitrary-request SSRF behavior.
- Provider content is untrusted data and cannot alter tool permissions.
- Stored generation content is approval-gated.
- Inference and embeddings are approval-gated and not automatically retried.
- Management credentials are isolated from inference credentials.
- Optional `dataCollection: "deny"` can be passed to the chat provider-routing configuration when supported by the routed provider/policy.

## Examples

See `examples/workflows.json` for model discovery, analytics, approved chat inference, and approved embedding calls. Examples contain no real secrets.

## Testing

`npm test` uses mocks only and requires no live OpenRouter credentials. Tests cover configuration bounds, model allowlisting, approval enforcement, bearer-token isolation, provider error mapping, safe GET retry behavior, and non-retry behavior for spend-producing POSTs.

## Limitations

- Streaming inference is intentionally not exported; the MCP tool returns one bounded non-streaming completion.
- Image, video, speech, transcription, key mutation, billing mutation, and destructive/account-administration operations are intentionally outside this connector's current scope.
- Analytics is beta upstream and its supported metrics/dimensions/operators should be discovered with `openrouter.analytics.meta` before issuing queries.
- The official OpenRouter remote MCP server is not proxied through this package. It remains preferable for interactive model/pricing/docs exploration in clients that can complete OpenRouter's OAuth flow; this connector uses official REST for the concrete reusable operations above.
