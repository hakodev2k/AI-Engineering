# Mistral AI MCP/API Connector

Reusable MCP server that exposes selected Mistral AI capabilities through stable, provider-scoped tools while keeping the API key inside the connector process.

## Transport strategy

This connector uses the official Mistral REST API at `https://api.mistral.ai`.

Mistral Studio supports registering external MCP servers as **Connectors**, and Mistral Vibe can consume MCP servers, but this is the opposite direction: Mistral does not currently publish an official MCP server that exposes its inference API as MCP tools. Therefore this package uses the official REST API directly and exposes its own MCP interface.

Official documentation used for this connector:

- Mistral API reference: https://docs.mistral.ai/api
- Chat completions: https://docs.mistral.ai/studio/conversations/chat-completion
- Embeddings: https://docs.mistral.ai/api/endpoint/embeddings
- FIM: https://docs.mistral.ai/api/endpoint/fim
- Moderation/Classifiers: https://docs.mistral.ai/api/endpoint/classifiers
- OCR: https://docs.mistral.ai/api/endpoint/ocr
- Audio transcription: https://docs.mistral.ai/api/endpoint/audio/transcriptions
- Studio API-key setup: https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key
- Known limitations/rate limits: https://docs.mistral.ai/resources/known-limitations
- Mistral Connectors/MCP: https://docs.mistral.ai/studio/connectors

## Implemented tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `mistral.model.list` | List models available to the API key | READ | No |
| `mistral.model.get` | Read one model card | READ | No |
| `mistral.chat.complete` | Non-streaming chat completion | WRITE/billable | Configurable |
| `mistral.embedding.create` | Create embeddings | WRITE/billable | Configurable |
| `mistral.code.complete` | Fill-in-the-middle code completion | WRITE/billable | Configurable |
| `mistral.moderation.text` | Moderate raw text | READ classification | No |
| `mistral.moderation.chat` | Moderate chat messages | READ classification | No |
| `mistral.ocr.process` | OCR a public HTTPS document/image URL | WRITE/billable | Configurable |
| `mistral.audio.transcribe` | Transcribe a public HTTPS audio URL | WRITE/billable | Configurable |

No delete, billing, API-key administration, fine-tuning mutation, public publishing, or arbitrary HTTP proxy tool is exposed.

## Architecture

```text
MCP client
  -> stdio MCP server (`src/server.ts`)
  -> validation / policy / model allowlist
  -> `MistralClient`
  -> Authorization: Bearer <MISTRAL_API_KEY>
  -> https://api.mistral.ai/v1/...
```

Provider responses are treated as untrusted data and returned as MCP text containing JSON. Retrieved/generated provider content is never interpreted as configuration, policy, approval, or tool-registration instructions.

## Authentication

Mistral Studio API access uses an API key sent as a bearer token. Configure it only in the connector environment:

```bash
MISTRAL_API_KEY=...
```

The model/agent never receives the raw key. Mistral's current public API-key model does not expose per-endpoint OAuth-style scopes. Use a dedicated key, configure expiration where possible, rotate it regularly, and separate workspaces/accounts when stronger isolation is required.

## Environment variables

Copy `.env.example` and inject secrets using your runtime/secret manager.

- `MISTRAL_API_KEY`: required bearer API key.
- `MISTRAL_API_BASE_URL`: defaults to `https://api.mistral.ai`; must be HTTPS and credential-free.
- `MISTRAL_ALLOWED_MODELS`: optional comma-separated allowlist. Empty means any model visible to the key.
- `MISTRAL_REQUIRE_APPROVAL_FOR_WRITE`: `true` requires approval tokens for billable generation/processing tools.
- `MISTRAL_APPROVAL_SECRET`: HMAC secret used only when write approval is enabled.
- `MISTRAL_TIMEOUT_MS`: request timeout, default `30000`, allowed `1000..120000`.
- `MISTRAL_MAX_RETRIES`: retry count for idempotent GET requests only, default `3`, maximum `5`.
- `MISTRAL_MAX_OUTPUT_TOKENS`: connector-side maximum for chat/FIM output, default `4096`.
- `MISTRAL_MAX_INPUT_CHARS`: connector-side aggregate input safety limit, default `200000`.

## Approval behavior

When `MISTRAL_REQUIRE_APPROVAL_FOR_WRITE=true`, each WRITE tool requires a 64-character HMAC-SHA256 approval token derived from the configured secret and exact tool name. READ tools never accept approval as a way to increase privileges.

For example, the approval digest for `mistral.chat.complete` is HMAC-SHA256(`MISTRAL_APPROVAL_SECRET`, `mistral.chat.complete`). The approval mechanism belongs in the host/operator layer; do not ask an LLM to generate or retain the secret.

## Safety boundaries

The connector applies model allowlisting, input/output size limits and strict schemas. OCR/audio URL inputs must use HTTPS and obvious localhost/RFC1918/link-local destinations are rejected to reduce SSRF exposure. Operators should additionally enforce egress controls or DNS/IP resolution policy in production because hostname rebinding and provider-side fetch behavior cannot be fully mitigated by string validation alone.

Chat/FIM/embedding/OCR/audio POST requests are not automatically retried. This prevents accidental duplicate billable inference when a response is lost after the provider accepted a request. Only idempotent GET requests are retried, using bounded exponential backoff. `429` and provider errors are surfaced to callers, including `retry-after` when supplied.

Mistral states that rate limits vary by subscription tier/model and that requests-per-second and tokens-per-minute can be enforced independently. This connector therefore does not hard-code a quota. It limits retry count and leaves tenant-specific concurrency control to the host.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
```

## Running

```bash
export MISTRAL_API_KEY="..."
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients capable of spawning local stdio servers. Clients must support the MCP version implemented by `@modelcontextprotocol/sdk` used by this package.

Example generic client configuration:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/mistral/dist/server.js"],
  "env": {
    "MISTRAL_API_KEY": "${MISTRAL_API_KEY}",
    "MISTRAL_ALLOWED_MODELS": "mistral-small-latest,mistral-embed,mistral-ocr-latest,voxtral-mini-latest"
  }
}
```

Exact configuration keys differ across ChatGPT-compatible clients, Claude/Claude Code, Cursor, Copilot-compatible environments, and custom agents. Compatibility depends on whether that client supports local stdio MCP servers; this package does not claim provider-specific integrations beyond MCP stdio.

## Tool notes

### Chat

`mistral.chat.complete` deliberately exposes a bounded subset of the official Chat Completion API. It supports text system/user/assistant messages, temperature, max tokens, safe prompt, and text/JSON-object response format. Raw arbitrary request forwarding is intentionally not provided.

### Embeddings

`mistral.embedding.create` supports one text or a bounded array of texts, optional output dimension, and supported output dtypes.

### FIM

`mistral.code.complete` uses `POST /v1/fim/completions`. The chosen model must support FIM; the connector does not infer support from the model name.

### Moderation

`mistral.moderation.text` uses `POST /v1/moderations`; `mistral.moderation.chat` uses `POST /v1/chat/moderations`. The default alias is `mistral-moderation-latest`, but an allowlist can require a pinned model instead.

### OCR

`mistral.ocr.process` accepts only a remote `document_url` or `image_url`. Local filesystem upload is intentionally not exposed through the MCP tool. Public HTTPS, Base64 and uploaded-file flows are supported by Mistral itself, but only the remote URL subset is implemented here to keep the tool contract and credential/data boundary narrow.

### Audio transcription

`mistral.audio.transcribe` uses the official `/v1/audio/transcriptions` endpoint with `file_url`, optional language, diarization and timestamp granularity. Local file upload and streaming transcription are not exposed in this connector.

## Error handling

- `400`: validation/provider request error; not retried.
- `401`: invalid or missing API key; not retried.
- `402`: account/billing activation required; not retried.
- `403`: authorization/policy failure; not retried.
- `429`: surfaced for POST; GET may retry up to configured bound.
- `5xx`: surfaced for POST; idempotent GET may retry with exponential backoff.
- timeout/network error: POST fails immediately; GET may retry within the configured bound.

The client truncates provider error bodies included in exceptions to avoid unbounded error output.

## Testing

Tests use mocked `fetch` and do not require live Mistral credentials:

```bash
npm test
npm run typecheck
```

Coverage includes missing auth, model allowlisting, SSRF-oriented URL validation, approval checks, bearer authentication, provider errors, no-retry semantics for billable POST operations, and retry behavior for idempotent throttled reads.

## Limitations

- No official Mistral-provider MCP upstream exists to route these inference operations through, so REST is the authoritative upstream transport.
- No streaming tools are exposed; MCP callers receive bounded non-streaming results.
- No file-upload endpoint, batch jobs, fine-tuning, Agents administration, Connectors administration, API-key administration, custom voice creation, speech generation, or destructive operations are exposed.
- URL safety validation is defense-in-depth rather than a substitute for network egress controls.
- API/model availability, prices and tier-specific limits can change; query `mistral.model.list` and consult current official documentation for deployment decisions.
