# Anthropic MCP/API Connector

Reusable MCP server exposing a constrained Anthropic API surface for model discovery, token counting, synchronous Messages API calls, and Message Batches.

## Transport strategy

The external interface is MCP over stdio. Upstream Anthropic operations use the official HTTPS REST API at `https://api.anthropic.com`.

Anthropic publishes and supports the Model Context Protocol and supports MCP clients/connectors in Claude products and in the Messages API, but Anthropic does not provide a dedicated official upstream MCP server whose tools represent the Anthropic API operations implemented here. Therefore this connector does not depend on an unofficial MCP server. If Anthropic later publishes an official provider MCP server for these operations, it can be introduced behind the same stable tool names after capability/schema validation.

Official references:

- Anthropic developer/API documentation: https://docs.anthropic.com/
- Messages API and tool use: https://docs.anthropic.com/en/api/messages
- Token counting: https://docs.anthropic.com/en/docs/build-with-claude/token-counting
- Message Batches: https://docs.anthropic.com/en/docs/build-with-claude/batch-processing
- Models API: https://docs.anthropic.com/en/api/models-list
- MCP overview: https://docs.anthropic.com/en/docs/mcp
- Rate limits: https://docs.anthropic.com/en/api/rate-limits

## Architecture

```text
MCP client
  -> MCP stdio server (`src/server.ts`)
     -> validation + model allowlist
     -> approval policy (`src/policy.ts`)
     -> isolated API-key client (`src/client.ts`)
     -> Anthropic REST API
```

Provider responses are treated as untrusted data and are returned as tool output, never interpreted as permission or configuration instructions.

## Authentication

Set `ANTHROPIC_API_KEY` to an Anthropic Console API key. The key remains inside the connector and is sent only in the `x-api-key` HTTP header to the configured Anthropic API origin. It is never accepted as a tool argument or returned in tool output.

The connector also sends `anthropic-version`, defaulting to `2023-06-01`.

Anthropic API keys do not use OAuth scopes. Least privilege is enforced at the connector layer with a model allowlist and per-tool approval boundaries. Use a provider-side workspace/key configuration with only the organizational access needed by the deployment.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | yes | - | Provider API key |
| `ANTHROPIC_VERSION` | no | `2023-06-01` | Anthropic API version header |
| `ANTHROPIC_BASE_URL` | no | `https://api.anthropic.com` | HTTPS Anthropic-compatible API origin |
| `ANTHROPIC_ALLOWED_MODELS` | no | all visible models | Comma-separated exact model IDs |
| `ANTHROPIC_APPROVAL_SECRET` | for write/high-risk tools | - | HMAC secret for approval tokens |
| `ANTHROPIC_TIMEOUT_MS` | no | `30000` | Request timeout, 1–120 seconds |
| `ANTHROPIC_MAX_RETRIES` | no | `3` | Bounded retries for GET only, 0–5 |
| `ANTHROPIC_MAX_OUTPUT_TOKENS` | no | `8192` | Local maximum accepted `maxTokens` |
| `ANTHROPIC_MAX_BATCH_REQUESTS` | no | `1000` | Local maximum requests per batch tool call |

`ANTHROPIC_BASE_URL` must be HTTPS and cannot contain embedded credentials. For the strongest SSRF boundary, leave it at the default Anthropic origin.

## Installation and running

Requires Node.js 20 or newer.

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

The server communicates using MCP stdio and can be launched by MCP clients that support a local stdio server command. Compatibility depends on the client implementing standard MCP stdio transport; no vendor-specific client extension is required.

## Tools

| Tool | Purpose | Risk | Approval |
| --- | --- | --- | --- |
| `anthropic.model.list` | List models visible to the API key | READ | no |
| `anthropic.model.get` | Get one model's metadata | READ | no |
| `anthropic.message.count_tokens` | Count input tokens without generating output | READ | no |
| `anthropic.message.create` | Generate a Claude response | WRITE | yes |
| `anthropic.batch.list` | List Message Batches | READ | no |
| `anthropic.batch.get` | Get Message Batch status/metadata | READ | no |
| `anthropic.batch.results` | Fetch completed batch results as JSONL text | READ | no |
| `anthropic.batch.create` | Submit asynchronous message requests | WRITE | yes |
| `anthropic.batch.cancel` | Cancel a batch still being processed | HIGH_RISK | yes |

The connector intentionally does not expose arbitrary HTTP requests, API-key administration, organization administration, billing mutation, or unrestricted beta features.

## Approval model

READ tools can execute without approval. WRITE and HIGH_RISK tools require an `approvalId` equal to the lowercase hex HMAC-SHA256 of the exact tool name using `ANTHROPIC_APPROVAL_SECRET` as the key. Generate that token outside the model/agent boundary after a human or trusted policy engine approves the action.

Example derivation:

```text
HMAC-SHA256(secret=ANTHROPIC_APPROVAL_SECRET, message="anthropic.message.create")
```

The approval secret itself must never be placed in prompts or tool arguments. A token is tool-specific, so approval for message creation cannot authorize batch cancellation.

`anthropic.message.create` and `anthropic.batch.create` require approval because they initiate billable inference. `anthropic.batch.cancel` is HIGH_RISK because it changes execution state and can discard unfinished work.

## Validation and safety

Inputs use strict bounded Zod schemas. Model IDs can be restricted with `ANTHROPIC_ALLOWED_MODELS`. Message text, system prompts, batch size, maximum output tokens, cursors, and IDs all have local bounds to limit accidental context or cost amplification.

Credentials are available only to the transport/client layer. Retrieved model or message content is untrusted data; it cannot modify the model allowlist, approval policy, environment, tool registry, or system behavior.

The connector does not accept user-provided URLs for upstream requests. API paths are fixed by individual tools, reducing SSRF and arbitrary-endpoint risks.

## Reliability and rate limits

Every request has an AbortController timeout. The client parses `retry-after` and the provider `request-id` when available. Only GET requests are automatically retried on HTTP 429 or 5xx, with bounded exponential backoff capped at 8 seconds and at `ANTHROPIC_MAX_RETRIES` attempts beyond the initial request.

POST requests are not automatically retried. This prevents ambiguous network failures from silently duplicating billable message or batch submissions. Callers may inspect the provider error/request ID and explicitly decide whether a new POST is safe.

Anthropic rate limits depend on organization usage tier and model. The provider documents request/token limits and returns rate-limit headers plus `retry-after` on throttling. This connector does not hard-code tier values because they vary by account and can change.

Pagination uses Anthropic cursor parameters (`before_id`, `after_id`, `limit`) and returns provider pagination metadata to the caller. Tools make one page request per invocation rather than automatically crawling all pages.

## Errors

Non-2xx provider responses are mapped to `AnthropicApiError`, preserving HTTP status, request ID when present, retry-after when present, and a bounded excerpt of the response body. Authentication/permission/validation errors are not retried automatically. Timeouts surface as explicit timeout errors.

Batch results use the provider JSONL response and are returned as text rather than parsed as one JSON document.

## Usage examples

See `examples/workflows.json` for machine-readable examples with tool names, inputs, expected output shapes, risk classes, and approval requirements.

Typical flow:

```text
anthropic.model.list
  -> anthropic.message.count_tokens
  -> human/policy approval
  -> anthropic.message.create
```

Batch flow:

```text
human/policy approval
  -> anthropic.batch.create
  -> anthropic.batch.get
  -> anthropic.batch.results
```

## Testing

Unit tests require no live Anthropic credentials. They cover required authentication configuration, safe base URL validation, model allowlisting, approval enforcement, isolated auth headers, bounded GET retry behavior, no automatic POST retry, error mapping, and JSONL batch-result handling.

Run:

```bash
npm test
npm run typecheck
```

## Limitations

- Text message content is implemented; this connector intentionally does not expose every Messages API content block, tool-use option, streaming mode, Files API feature, beta feature, or administrative endpoint.
- API key lifecycle/rotation is owned by the deployment's secret manager and Anthropic Console, not by this connector.
- The connector does not implement an OAuth flow because the direct Anthropic API uses API-key authentication for this use case.
- The connector does not automatically estimate financial cost; callers should use token counting, model pricing, and organizational budgets before approving inference.
- The connector exposes no destructive account, workspace, key, or billing operations.
