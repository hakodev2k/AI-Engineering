# Groq MCP/API Connector

Reusable MCP server exposing selected GroqCloud capabilities through a stable, provider-scoped tool surface. The connector keeps the Groq API key inside the connector process, validates inputs, supports model allow-listing, separates read/write/high-risk/destructive operations, and applies bounded retry behavior only where replay is safe.

## Upstream strategy

Research basis (official sources, checked 2026-08-24):

- Groq API reference: https://console.groq.com/docs/api-reference
- Groq models: https://console.groq.com/docs/models
- Groq rate limits: https://console.groq.com/docs/rate-limits
- Groq API errors: https://console.groq.com/docs/errors
- Groq Responses API: https://console.groq.com/docs/responses-api
- Groq Batch API: https://console.groq.com/docs/batch
- Groq remote MCP support: https://console.groq.com/docs/tool-use/remote-mcp
- Official TypeScript SDK: https://github.com/groq/groq-typescript

Groq supports **remote MCP as a consumer feature**: Groq-hosted models can call tools exposed by remote MCP servers. That is not a Groq-hosted provider MCP server for Groq account, model, batch, file, or inference management. Therefore this connector uses Groq's official REST API for the implemented provider capabilities and exposes them outward as MCP tools.

The official `groq-sdk` was reviewed, but this package intentionally uses a small typed REST client so retry, timeout, replay-safety, approval, and error mapping remain explicit and auditable. No undocumented endpoint is used.

## Implemented capabilities

| MCP tool | Upstream | Permission | Approval |
|---|---|---:|---|
| `groq.model.list` | REST `GET /models` | READ | No |
| `groq.model.get` | REST `GET /models/{model}` | READ | No |
| `groq.chat.complete` | REST `POST /chat/completions` | WRITE | Configurable; required by default |
| `groq.response.create` | REST `POST /responses` | WRITE | Configurable; required by default |
| `groq.batch.list` | REST `GET /batches` | READ | No |
| `groq.batch.get` | REST `GET /batches/{id}` | READ | No |
| `groq.batch.create` | REST `POST /batches` | HIGH_RISK | Always |
| `groq.batch.cancel` | REST `POST /batches/{id}/cancel` | HIGH_RISK | Always |
| `groq.file.list` | REST `GET /files` | READ | No |
| `groq.file.get` | REST `GET /files/{id}` | READ | No |
| `groq.file.delete` | REST `DELETE /files/{id}` | DESTRUCTIVE | Always; disabled by default |

The connector deliberately does not expose a generic raw-request tool.

## Architecture

```text
MCP client
  -> stdio MCP server (`src/server.ts`)
  -> validation + policy (`src/config.ts`, `src/policy.ts`)
  -> bounded HTTP client (`src/client.ts`)
  -> https://api.groq.com/openai/v1
```

Third-party content returned by Groq is emitted as tool data. It is not interpreted as connector configuration or permission instructions.

## Authentication

Groq uses API-key bearer authentication for these endpoints.

```text
Authorization: Bearer $GROQ_API_KEY
```

The key is read only inside the connector process. It is never accepted as an MCP tool parameter and is not included in errors or examples.

Create a local environment file from `.env.example` and provide a Groq project-specific API key when possible. Groq projects can isolate keys and apply project-level limits; use the least-privileged operational project appropriate for the agent workload.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `GROQ_API_KEY` | Yes | - | Groq bearer credential |
| `GROQ_ALLOWED_MODELS` | No | empty = any accessible model | Comma-separated model allow-list |
| `GROQ_REQUIRE_WRITE_APPROVAL` | No | `true` | Require approval for ordinary billable inference writes |
| `GROQ_ENABLE_DESTRUCTIVE` | No | `false` | Enables destructive tools such as file deletion |
| `GROQ_APPROVAL_SECRET` | For approved operations | - | Local HMAC secret used to verify approval digests |
| `GROQ_TIMEOUT_MS` | No | `30000` | Per-request timeout, 1000..120000 ms |
| `GROQ_MAX_RETRIES` | No | `3` | Retry count for replay-safe requests, 0..5 |

`GROQ_ALLOWED_MODELS` is recommended for production agents. Example:

```text
GROQ_ALLOWED_MODELS=openai/gpt-oss-20b,openai/gpt-oss-120b
```

## Approval model

Approval digests are HMAC-SHA256 values of the exact MCP tool name using `GROQ_APPROVAL_SECRET` as the key. This makes approval tool-specific and prevents an approval for one operation from silently authorizing another.

Ordinary inference tools (`groq.chat.complete`, `groq.response.create`) require approval by default because they consume billable compute. Operators may set `GROQ_REQUIRE_WRITE_APPROVAL=false` for trusted, budget-controlled environments.

`groq.batch.create` and `groq.batch.cancel` always require approval. `groq.file.delete` always requires approval and additionally requires `GROQ_ENABLE_DESTRUCTIVE=true`.

The connector never increases its own permissions and never derives approval from model output or provider-returned content.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
export GROQ_API_KEY='...'
npm start
```

The server uses MCP over stdio and can be launched by any MCP client capable of starting a local command and speaking MCP over standard input/output.

Example client command configuration:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/groq/dist/src/server.js"],
  "env": {
    "GROQ_API_KEY": "provided-by-your-secret-manager",
    "GROQ_ALLOWED_MODELS": "openai/gpt-oss-20b"
  }
}
```

Do not place a real API key in a repository-tracked MCP configuration file.

## Tool behavior

### Model discovery

`groq.model.list` lists active models visible to the authenticated project. `groq.model.get` retrieves one model and also enforces the local allow-list when configured.

### Synchronous inference

`groq.chat.complete` accepts only `system`, `user`, and `assistant` messages, bounds message count and content size, disables streaming, and exposes a limited set of generation controls.

`groq.response.create` exposes the Groq Responses API with text input and optional instructions. The Responses API is beta according to current Groq documentation, so callers should tolerate provider-side evolution.

Neither inference tool accepts arbitrary remote MCP server URLs. This prevents an agent from using this connector to dynamically attach an untrusted MCP server and expose prompt/context data.

### Batch jobs

`groq.batch.create` creates a batch against the officially supported `/v1/chat/completions` endpoint using an already uploaded Groq file with purpose `batch`. Completion windows are restricted to 24 hours through 7 days.

This connector does not upload local files. That is intentional: accepting arbitrary filesystem paths from an agent would broaden the connector's data-exfiltration surface. Files may be uploaded through a separate controlled ingestion process, after which their IDs can be passed to `groq.batch.create`.

`groq.batch.list` supports cursor pagination via the provider `cursor` value. `groq.batch.get` reads one job. `groq.batch.cancel` is high-risk because cancelling work can discard pending execution and is never retried automatically.

### Files

`groq.file.list` and `groq.file.get` expose metadata only. `groq.file.delete` is destructive and disabled by default.

## Rate limits

Groq rate limits vary by model, plan, organization, and project. Current official documentation describes limits including requests/minute, requests/day, tokens/minute, tokens/day, input/output token limits, and audio limits where applicable. The exact applicable limits should be read from the Groq Console for the authenticated project.

The API may return `429 Too Many Requests` and a `retry-after` header. This connector preserves `retry-after` internally and uses it for bounded retry on replay-safe GET operations. It also uses exponential backoff for safe transient GET failures.

Billable POST requests, batch cancellation, and DELETE operations are **not automatically retried**, preventing duplicate inference, duplicate batch creation, or repeated destructive actions.

## Errors and reliability

The client maps non-2xx responses to `GroqApiError` with HTTP status and a bounded provider error body. Credentials are never added to error text.

Handled reliability cases include:

- request timeout via `AbortController`
- bounded retries for safe GET requests
- `Retry-After` on throttling
- 5xx transient errors on safe reads
- no blind retry of billable or destructive operations
- fixed Groq base URL to avoid user-controlled SSRF destinations
- strict model/resource identifier validation
- configurable model allow-list

Authentication and validation failures are not retried.

## Security considerations

1. Keep `GROQ_API_KEY` in a secret manager or process environment, not prompts or tool arguments.
2. Use project-specific API keys and project limits to contain spend and blast radius.
3. Set `GROQ_ALLOWED_MODELS` in production to prevent unexpected model selection.
4. Leave write approval enabled unless the calling agent operates inside an explicit budget/control boundary.
5. Leave destructive tools disabled unless deletion is genuinely required.
6. Treat model output and other provider-returned text as untrusted data. It must not alter local policy, allowed models, approval requirements, or system instructions.
7. Remote MCP support documented by Groq is intentionally not exposed through these tools because arbitrary MCP endpoints can receive model context and therefore require a separate trust decision.
8. Debug HTTP logging is not implemented, reducing accidental credential or prompt leakage.

## Testing

Unit tests do not require live Groq credentials.

```bash
npm test
npm run typecheck
npm run build
```

Tests cover required authentication configuration, model allow-list enforcement, approval success/failure, destructive-operation gating, bearer authentication, provider error mapping, and the no-retry rule for billable POST operations.

## Example workflows

See `examples/workflows.json` for machine-readable examples with tool input, expected output shape, permission class, and approval requirements.

A common agent workflow is:

```text
model.list (READ)
  -> select an allow-listed model
  -> chat.complete (WRITE + approval by default)
```

For asynchronous workloads:

```text
file already uploaded by trusted ingestion process
  -> batch.create (HIGH_RISK + approval)
  -> batch.get / batch.list (READ)
  -> batch.cancel only when explicitly approved
```

## Limitations

- Groq remote MCP is a consumer capability, not used as the upstream transport for this provider connector.
- Responses API is currently beta.
- Audio transcription/translation/speech are not exposed in this version because safe reusable binary/file transport would require additional data-ingestion controls.
- File upload/download is intentionally omitted to avoid arbitrary local-path access and uncontrolled bulk data transfer from agent calls.
- Fine-tuning endpoints are intentionally omitted because training data submission, lifecycle changes, and deletion require a separate stronger governance model.
- Live rate limits are account/project-specific and are not hard-coded.
