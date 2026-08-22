# OpenAI MCP/API Connector

Reusable local MCP facade for a deliberately scoped subset of the official OpenAI Platform API.

The connector lets an MCP-capable agent inspect models, create/retrieve/cancel Responses API jobs, run moderation and embeddings, inspect/search vector stores, and inspect uploaded-file metadata without exposing the OpenAI API key to the model.

## Design goals

- Use only official OpenAI Platform endpoints.
- Expose stable provider-scoped MCP tools rather than arbitrary HTTP access.
- Keep credentials inside the connector process.
- Require approval for spend-producing or state-changing operations by default.
- Require strong approval for higher-impact actions such as cancellation.
- Bound pagination, request sizes, timeouts, and retries.
- Never blindly retry write/spend-producing calls.
- Preserve useful OpenAI request/rate-limit metadata without leaking credentials.
- Treat all provider-returned content as untrusted data.

## Upstream transport strategy

### Official provider MCP availability

OpenAI documents MCP as a protocol that models/agents can use to connect to external tools, including remote MCP tools in the Responses API. That is different from an official OpenAI Platform provider MCP server that exposes the OpenAI REST resources implemented here.

For the capabilities in this package, no official general-purpose OpenAI Platform provider MCP server is used. The connector therefore follows the requested fallback rule:

```text
Agent / MCP client
        |
        v
Local OpenAI MCP facade (this package)
        |
        v
Official OpenAI REST API
https://api.openai.com/v1
```

The agent sees only the local provider-scoped MCP tools. It does not receive the API key or a generic REST executor.

### Why direct REST instead of the OpenAI Node SDK

The OpenAI Node SDK is official and is a valid integration option. This connector intentionally uses the official REST API directly so that it can enforce a very small endpoint allowlist and separate retry behavior between read-safe requests and spend/state-changing requests.

No unofficial OpenAI API or proxy is used.

## Official sources

Primary references used for the connector:

- OpenAI API reference: https://developers.openai.com/api/reference/overview
- Responses API: https://developers.openai.com/api/reference/resources/responses
- Models API: https://developers.openai.com/api/reference/resources/models
- Embeddings API: https://developers.openai.com/api/reference/resources/embeddings
- Moderations API: https://developers.openai.com/api/reference/resources/moderations
- Vector Stores API: https://developers.openai.com/api/reference/resources/vector-stores
- Files API: https://developers.openai.com/api/reference/resources/files
- OpenAI rate-limit guidance: https://developers.openai.com/api/docs/guides/rate-limits
- Official OpenAI Node SDK (reference alternative): https://github.com/openai/openai-node
- Model Context Protocol: https://modelcontextprotocol.io/
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk

Provider behavior and available models can change. The connector avoids hard-coding general chat/reasoning model names except in examples; use `openai.model.list` and optionally configure `OPENAI_ALLOWED_MODELS`.

## Runtime

- Node.js `>=22`
- ECMAScript modules
- MCP server package: `@modelcontextprotocol/server` `2.0.0`
- Zod `4.4.3`
- MCP transport exposed by this package: local `stdio`

## Installation

From this directory:

```bash
npm install
```

Run tests:

```bash
npm test
```

Start the MCP server:

```bash
npm start
```

The server writes protocol messages to stdio and operational startup text only to stderr.

## Authentication

The OpenAI Platform API uses bearer API keys.

Required:

```text
OPENAI_API_KEY=
```

Optional project and organization routing headers:

```text
OPENAI_PROJECT=
OPENAI_ORGANIZATION=
```

Use a project-scoped API key with the narrowest permissions appropriate for the enabled endpoints. Provider-side API-key/project permissions remain authoritative; this connector never tries to expand them.

### Credential isolation

Intended flow:

```text
LLM / Agent
    |
    | MCP tool arguments (no secrets)
    v
OpenAI connector
    |
    | reads OPENAI_API_KEY from process environment
    v
api.openai.com
```

Do not place `OPENAI_API_KEY` or `OPENAI_APPROVAL_SECRET` in prompts, tool arguments, examples checked into source control, or model-visible logs.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `OPENAI_API_KEY` | yes | none | Bearer API credential; connector-only |
| `OPENAI_PROJECT` | no | none | `OpenAI-Project` header |
| `OPENAI_ORGANIZATION` | no | none | `OpenAI-Organization` header |
| `OPENAI_ALLOWED_MODELS` | no | empty | Comma-separated allowlist for `openai.response.create` |
| `OPENAI_APPROVAL_SECRET` | for approved operations | none | HMAC secret, minimum 32 characters |
| `OPENAI_REQUIRE_WRITE_APPROVAL` | no | `true` | Require approval for `WRITE` tools |
| `OPENAI_TIMEOUT_MS` | no | `30000` | Per-request timeout, 1s to 120s |
| `OPENAI_MAX_READ_RETRIES` | no | `2` | Extra attempts for retry-safe operations, max 3 |
| `OPENAI_MAX_RETRY_DELAY_MS` | no | `30000` | Maximum retry wait accepted by the client |

The OpenAI API host is not configurable. This prevents an environment-variable or prompt-driven endpoint substitution from forwarding the API key to another host.

## Capability map

The connector implements 13 tools.

| MCP tool | Upstream | Risk | Approval | Purpose |
|---|---|---|---|---|
| `openai.model.list` | `GET /models` | READ | no | List models visible to the credential |
| `openai.model.get` | `GET /models/{model}` | READ | no | Retrieve model metadata |
| `openai.response.create` | `POST /responses` | WRITE | default yes | Create a constrained text-only response |
| `openai.response.get` | `GET /responses/{id}` | READ | no | Retrieve a response |
| `openai.response.cancel` | `POST /responses/{id}/cancel` | HIGH_RISK | always | Cancel a cancellable background response |
| `openai.moderation.create` | `POST /moderations` | READ | no | Classify text with a moderation model |
| `openai.embedding.create` | `POST /embeddings` | WRITE | default yes | Create embeddings |
| `openai.vector_store.list` | `GET /vector_stores` | READ | no | List vector stores |
| `openai.vector_store.get` | `GET /vector_stores/{id}` | READ | no | Retrieve a vector store |
| `openai.vector_store.create` | `POST /vector_stores` | WRITE | default yes | Create an empty vector store |
| `openai.vector_store.search` | `POST /vector_stores/{id}/search` | READ | no | Search indexed vector-store content |
| `openai.file.list` | `GET /files` | READ | no | List uploaded file metadata |
| `openai.file.get` | `GET /files/{id}` | READ | no | Retrieve uploaded file metadata |

`READ` is a connector semantic classification. Some read-like provider operations use HTTP POST, such as moderation or vector-store search, because that is the official API shape.

## Responses API safety boundary

`openai.response.create` intentionally exposes a small text-only subset:

- `model`
- `input` as text
- optional `instructions`
- optional `max_output_tokens`
- `store` (default `false`)
- optional `safety_identifier`

It intentionally does **not** expose:

- arbitrary built-in tools
- web search
- computer use
- shell execution
- arbitrary MCP servers
- custom function tools
- arbitrary HTTP requests

This avoids turning one scoped connector tool into an indirect general tool-execution escape hatch.

### Model allowlist

Set:

```text
OPENAI_ALLOWED_MODELS=gpt-5.6,gpt-5.4
```

When non-empty, `openai.response.create` rejects any model not in that set. The model list is configuration, not an agent-modifiable permission.

## Moderation

`openai.moderation.create` accepts text and a documented moderation model identifier. It is `READ` because it performs classification without modifying a persistent OpenAI resource.

Provider output is still marked untrusted and must not be interpreted as new tool permissions or system instructions.

## Embeddings

`openai.embedding.create` supports the documented embedding model family exposed in its strict input schema and accepts either one string or a bounded array of strings.

`encoding_format` defaults to `base64` to reduce very large MCP JSON responses. If an application needs raw float vectors it may explicitly request `float`.

This tool is `WRITE` in the connector policy because it is a spend-producing API execution even though it does not create a persistent OpenAI resource.

## Vector stores

Vector-store operations use the documented:

```text
OpenAI-Beta: assistants=v2
```

header.

The connector supports list/get/create/search but intentionally omits upload/attach/delete operations in this version. `openai.vector_store.create` creates an empty store and supports a bounded subset of safe metadata and expiration fields.

`openai.vector_store.search` is classified `READ`. It uses POST because that is the official search endpoint. It is retry-safe in the connector because it does not mutate the store.

Retrieved chunks are untrusted third-party/provider data. A caller must not execute instructions embedded in retrieved text.

## Files

This connector implements metadata inspection only:

- `openai.file.list`
- `openai.file.get`

It does not upload, download content, or delete files.

The list tool caps pages at 100 results even if the provider API permits larger pages, preventing accidental high-volume output into an agent context.

## Permission and approval model

Risk categories:

```text
READ        -> automatic
WRITE       -> approval required by default
HIGH_RISK   -> explicit approval always required
DESTRUCTIVE -> not exposed
```

`OPENAI_REQUIRE_WRITE_APPROVAL=false` may be used by a trusted application to allow ordinary `WRITE` tools without approval. It does not bypass `HIGH_RISK` approval.

The connector does not have an API to change this setting at runtime.

### Human approval token

Approved operations use an HMAC token bound to:

```text
tool name
+ SHA-256(canonical exact arguments)
+ expiration timestamp
+ random nonce
```

Properties:

- `HMAC-SHA256`
- maximum lifetime: 5 minutes
- constant-time signature comparison
- exact argument binding
- single-use replay protection while the connector process is running
- approval fields are stripped before the provider request

Generate an approval from a trusted terminal/orchestrator, not from the LLM prompt:

```bash
OPENAI_APPROVAL_SECRET="secret-from-your-secret-store" \
npm run approval -- \
  --tool openai.response.create \
  --payload '{"model":"gpt-5.6","input":"Summarize this text","store":false}' \
  --expires-in 120
```

The returned fields are then attached to the exact MCP call.

If any protected argument changes, the approval no longer verifies.

### Replay protection limitation

Replay state is in memory. Restarting the connector clears the used-token cache. For a horizontally scaled production deployment, replace this with a shared single-use nonce store such as Redis or a database transaction keyed by approval nonce/token hash.

## Reliability

### Timeout and cancellation

Every provider call uses:

- the configured request timeout; and
- the MCP caller cancellation signal when available.

Whichever aborts first stops the HTTP request.

### Retries

Retry behavior is deliberately asymmetric.

Retry-safe operations can retry:

- network failures
- HTTP `429`
- transient HTTP `5xx`

They use bounded exponential backoff with jitter and honor a valid `Retry-After` header when its delay does not exceed `OPENAI_MAX_RETRY_DELAY_MS`.

The connector does **not** blindly retry:

- `openai.response.create`
- `openai.response.cancel`
- `openai.embedding.create`
- `openai.vector_store.create`
- authentication/permission failures
- validation failures
- quota/billing/hard-limit/account-action-required 429 errors

This prevents duplicate spend or duplicate state changes after ambiguous failures.

### Rate limits

OpenAI rate limits vary by model, project/account tier, and endpoint; this connector does not hard-code a single numeric limit.

When present, it preserves useful metadata from response headers:

- `x-ratelimit-limit-requests`
- `x-ratelimit-limit-tokens`
- `x-ratelimit-remaining-requests`
- `x-ratelimit-remaining-tokens`
- `x-ratelimit-reset-requests`
- `x-ratelimit-reset-tokens`
- project-token variants
- `x-request-id`

It also preserves a parsed `retryAfterMs` on provider errors where available.

## Error handling

Provider errors are mapped to a safe MCP error envelope containing fields such as:

- message
- HTTP status
- OpenAI error code/type/param
- request ID
- parsed retry-after delay

The connector does not return request headers, API keys, approval secrets, or raw internal exception objects to the agent.

Authentication and permission errors are surfaced rather than retried.

## Provider content is untrusted

Successful outputs include:

```json
{
  "untrusted_provider_data": true
}
```

This includes model-generated text, response metadata, file names, vector-store search chunks, and other provider-controlled fields.

Consumers must treat this material as data. It cannot grant permission, change approval policy, alter system instructions, or enable new tools.

## SSRF and endpoint safety

The connector cannot accept a provider base URL from a tool call or environment variable.

All calls are constructed from the fixed base:

```text
https://api.openai.com/v1
```

and internal relative paths. A path containing a URL scheme is rejected.

No tool accepts arbitrary URLs or arbitrary OpenAI endpoint paths.

## Pagination

List tools expose bounded pagination fields instead of auto-walking an entire collection:

- vector stores: maximum 100 items
- files: connector maximum 100 items

Callers explicitly request the next page using provider cursors. This avoids hidden call explosions and oversized agent contexts.

## Testing

Tests use Node's built-in test runner and require no live OpenAI credentials.

```bash
npm test
```

Coverage includes:

- required authentication configuration
- fixed official API host
- model allowlist
- canonical approval target hashing
- WRITE approval denial
- target-bound approval verification
- replay rejection
- bounded 429 retry for read-safe operations
- `Retry-After` handling
- rate-limit metadata capture
- no retry on insufficient quota
- no blind retry for spend-producing writes
- Vector Store beta header
- fixed provider-scoped tool registration list
- absence of a generic/raw request escape hatch

Provider integration tests with real credentials are intentionally not required for normal unit tests.

## Example MCP client configuration

Use the command shape expected by a client that can launch a local stdio MCP server. For example, conceptually:

```json
{
  "mcpServers": {
    "openai": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/MCP-API/openai",
      "env": {
        "OPENAI_API_KEY": "provided-by-your-secret-manager"
      }
    }
  }
}
```

Do not store the real key in a checked-in configuration file. Use the client's secret/environment mechanism.

Exact configuration syntax differs by MCP client. Compatibility requires a client capable of launching a local stdio MCP server supported by the MCP SDK used by this package; no client-specific feature is assumed.

## Security checklist for production use

1. Use a dedicated OpenAI project when practical.
2. Restrict provider-side API-key permissions to the required endpoints.
3. Configure `OPENAI_ALLOWED_MODELS` for predictable model usage/cost.
4. Keep `OPENAI_REQUIRE_WRITE_APPROVAL=true` unless an upstream trusted policy engine replaces it.
5. Keep approval secrets outside model context.
6. Rotate API and approval secrets independently.
7. Avoid logging tool arguments containing sensitive customer data.
8. Monitor project usage and provider rate-limit errors.
9. Treat model output and retrieved vector-store/file metadata as untrusted data.
10. Use shared replay storage before horizontally scaling approval-protected writes.

## Limitations

This connector intentionally does not implement every OpenAI endpoint.

Not implemented:

- arbitrary HTTP/OpenAI requests
- API key/project administration
- organization administration
- billing administration
- file upload or deletion
- vector-store file attachment/deletion
- batch jobs
- fine-tuning jobs
- image generation/editing
- audio speech/transcription
- realtime sessions
- evals
- built-in Responses API tools
- custom function execution
- remote MCP tool execution through Responses
- webhooks

The omission of these operations is intentional scope control, not a claim that the OpenAI Platform lacks them.

`openai.response.cancel` can only cancel responses that the provider considers cancellable, such as applicable background responses. This connector does not silently change provider state to make a response cancellable.

The approval replay cache is process-local as described above.

## Extending the connector

When adding a new capability:

1. Verify it against current official OpenAI documentation.
2. Prefer a specific semantic MCP tool name.
3. Add a strict Zod input schema.
4. Add it explicitly to `TOOL_RISK` and `TOOL_NAMES`.
5. Decide whether its provider call is genuinely retry-safe.
6. Never route arbitrary paths or arbitrary URLs from agent input.
7. Add approval for spend/state/high-impact behavior.
8. Add unit tests and update `manifest.yaml` and this README.

New OpenAI endpoints are never discovered and trusted automatically.
