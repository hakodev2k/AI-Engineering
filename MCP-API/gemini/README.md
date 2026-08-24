# Google Gemini MCP/API Connector

Reusable MCP server exposing a constrained set of Google Gemini API capabilities for agent workflows. The external interface is MCP over stdio; upstream calls use the official Gemini REST API.

## Official sources

- Gemini API reference: https://ai.google.dev/api
- Getting started/authentication: https://ai.google.dev/gemini-api/docs/get-started
- API keys: https://ai.google.dev/gemini-api/docs/api-key
- Files API: https://ai.google.dev/gemini-api/docs/files
- Embeddings: https://ai.google.dev/gemini-api/docs/embeddings
- Rate limits: https://ai.google.dev/gemini-api/docs/rate-limits

Google's official Gemini SDK can consume MCP tools experimentally, but Google does not currently expose these Gemini API operations through an official provider-side Gemini MCP server. Therefore this connector uses the official REST API directly rather than depending on an unofficial MCP implementation.

## Transport and architecture

```text
MCP client
  -> stdio MCP server
  -> validation / allowlists / approval policy
  -> Gemini REST client
  -> https://generativelanguage.googleapis.com/v1beta
```

Credentials remain inside the connector process and are sent only as the `x-goog-api-key` HTTP header. Returned provider content is treated as untrusted data and is serialized as tool output; it never changes tool permissions or configuration.

## Authentication

Set `GEMINI_API_KEY`. Google documents standard and authorization API keys; this connector accepts the resulting Gemini API key value and never exposes it to MCP callers. Restrict the key/project according to Google Cloud and AI Studio controls appropriate to your environment.

## Environment variables

- `GEMINI_API_KEY` — required.
- `GEMINI_APPROVAL_SECRET` — HMAC secret used for explicit approvals.
- `GEMINI_REQUIRE_APPROVAL_FOR_BILLABLE` — defaults to `true`.
- `GEMINI_ALLOWED_MODELS` — comma-separated model allowlist; empty permits any syntactically valid model identifier.
- `GEMINI_ALLOWED_UPLOAD_ROOTS` — comma-separated absolute/relative filesystem roots. Upload is disabled when empty.
- `GEMINI_TIMEOUT_MS` — request timeout, default 30000.
- `GEMINI_MAX_RETRIES` — bounded retry count for GET operations only, default 3, maximum 5.
- `GEMINI_MAX_RESPONSE_BYTES` — response body safety cap, default 1 MiB.

## Supported tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `gemini.model.list` | List available models | READ | No |
| `gemini.model.get` | Read model metadata | READ | No |
| `gemini.token.count` | Count tokens before generation | READ | No |
| `gemini.content.generate` | Generate content | WRITE / billable | Configurable, on by default |
| `gemini.embedding.create` | Create text embeddings | WRITE / billable | Configurable, on by default |
| `gemini.file.list` | List Files API objects | READ | No |
| `gemini.file.get` | Read file metadata | READ | No |
| `gemini.file.upload` | Upload local data to Gemini | HIGH_RISK | Required |
| `gemini.file.delete` | Delete an uploaded file | DESTRUCTIVE | Required |

The connector intentionally does not expose an arbitrary HTTP-request tool.

## Approval model

Approval tokens are HMAC-SHA256 digests of the exact tool name using `GEMINI_APPROVAL_SECRET`. Generate them in a trusted approval layer, not in the LLM prompt. For example, an approval service may compute the digest for `gemini.file.upload` only after a human confirms the file and destination operation. The connector uses timing-safe comparison.

Generation and embedding calls are billable and default to approval-required. Set `GEMINI_REQUIRE_APPROVAL_FOR_BILLABLE=false` only when your surrounding policy and budget controls allow autonomous usage. Upload and delete always require approval.

## Reliability and rate limits

Google applies Gemini quotas per project and commonly measures RPM, TPM and RPD. Exact limits vary by model and account tier; consult AI Studio and the official rate-limit documentation instead of hard-coding quota numbers.

The client preserves `Retry-After` on provider errors and retries only idempotent GET calls on 429/5xx/network failures, using bounded exponential backoff. It does not blindly retry POST generation, embedding, upload, or DELETE operations, preventing duplicate billable or destructive effects. Requests are cancelled on timeout.

Pagination tokens from `model.list` and `file.list` are passed through directly and page sizes are validated.

## Files security

Uploading data is an explicit trust-boundary crossing. `gemini.file.upload` is disabled until `GEMINI_ALLOWED_UPLOAD_ROOTS` is configured. Paths are canonicalized and must remain under an allowed root; only regular files are accepted. The implementation validates MIME syntax, enforces Gemini's documented 2 GB per-file maximum, and only follows resumable upload URLs hosted on `generativelanguage.googleapis.com` to prevent SSRF credential forwarding.

Gemini Files API objects are temporary and Google documents automatic deletion after 48 hours. The API supports metadata retrieval but not file download through this connector. The connector never logs API keys or includes them in query strings.

## Install and run

```bash
cd MCP-API/gemini
npm install
npm run build
GEMINI_API_KEY=... npm start
```

Any MCP client capable of launching a stdio server can run the built `dist/src/server.js` process. Compatibility depends on the client's standard MCP stdio support; no vendor-specific client extension is required.

## MCP client example

```json
{
  "mcpServers": {
    "gemini": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/gemini/dist/src/server.js"],
      "env": {
        "GEMINI_API_KEY": "<secret-from-secure-store>",
        "GEMINI_ALLOWED_MODELS": "gemini-3.5-flash,gemini-embedding-001",
        "GEMINI_ALLOWED_UPLOAD_ROOTS": "/approved/input"
      }
    }
  }
}
```

Do not put real credentials in checked-in client configuration; use the client's secure environment/secret mechanism.

## Tool behavior and validation

`gemini.content.generate` currently exposes a deliberately bounded text-generation contract: prompt, optional system instruction, temperature, maximum output tokens and response MIME type. It does not expose arbitrary provider JSON, arbitrary tool/function execution, URL fetching, or code execution.

`gemini.embedding.create` supports text input, selected task types and 128–3072 output dimensions. The default model is `gemini-embedding-001`; configure `GEMINI_ALLOWED_MODELS` accordingly. Google also offers newer multimodal embedding models, but this connector's embedding tool is intentionally text-only because its schema does not accept arbitrary file/media inputs.

Files tool names accept only the provider's `files/<id>` shape. Model identifiers are restricted to a simple safe identifier grammar and may additionally be allowlisted.

## Error handling

Provider non-2xx responses become `GeminiApiError` with HTTP status and, where supplied, `Retry-After`. Response bodies are capped before JSON parsing. Authentication/permission failures are returned immediately and are not retried. Timeout failures are surfaced clearly to the MCP caller.

## Tests

Unit tests require no live Gemini credentials and cover:

- missing authentication configuration;
- model allowlist enforcement;
- upload-root denial;
- approval validation;
- credential isolation from URLs;
- provider error mapping and `Retry-After` preservation;
- no automatic retries for billable POST requests;
- bounded retries for transient GET failures.

Run:

```bash
npm test
npm run typecheck
```

## Limitations

This connector deliberately omits image/video generation, live/web tools, arbitrary function calling, Batch API, cached content, File Search stores, tuning, and administrative/billing operations. Those can materially expand cost, data exposure, or permission surface and should be added only with dedicated schemas and policy controls.

The connector does not implement OAuth exchange flows or rotate keys. Credential lifecycle belongs in the surrounding secret manager or deployment platform. It also does not download uploaded Files API content because the official Files API documentation describes metadata access rather than a general download capability.
