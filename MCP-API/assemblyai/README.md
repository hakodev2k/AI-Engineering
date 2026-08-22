# AssemblyAI MCP/API Connector

Reusable local MCP server for AssemblyAI speech-to-text and transcript-analysis workflows. The connector keeps the AssemblyAI API key inside the connector process and exposes a stable allowlisted MCP tool surface instead of arbitrary HTTP access.

## Transport strategy

AssemblyAI provides an official Streamable HTTP documentation MCP server at `https://mcp.assemblyai.com/docs`. Current AssemblyAI guidance documents four documentation tools: `search_docs`, `get_pages`, `list_sections`, and `get_api_reference`. That MCP endpoint is useful for live API documentation, but it is not used as the operational transport for this connector.

Operational capabilities use AssemblyAI's official REST API and LLM Gateway because these interfaces provide explicit endpoint semantics, deterministic validation, and predictable write/destructive boundaries. The connector does not proxy newly discovered upstream MCP tools automatically.

Official sources researched for this implementation:

- Documentation MCP guidance: https://www.assemblyai.com/docs/ and https://mcp.assemblyai.com/docs
- API reference: https://www.assemblyai.com/docs/api-reference/overview
- Speech-to-text API fundamentals: https://www.assemblyai.com/blog/speech-to-text-api-fundamentals
- PII redaction: https://www.assemblyai.com/docs/guardrails/redact-pii-from-transcripts
- Redacted audio endpoint: https://www.assemblyai.com/docs/api-reference/transcripts/get-redacted-audio/
- LLM Gateway: https://www.assemblyai.com/blog/reintroducing-llm-gateway
- Official Node SDK: https://github.com/AssemblyAI/assemblyai-node-sdk

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk` over stdio
- native `fetch` for AssemblyAI APIs

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

Development:

```bash
npm run dev
```

## Authentication

AssemblyAI uses an API key in the `authorization` request header. The value is the raw API key; this connector does not add a Bearer prefix.

Set:

```text
ASSEMBLYAI_API_KEY=
```

Never expose the key to the model or place it in tool arguments. Inject it through environment configuration or a secret manager.

The default API origin is `https://api.assemblyai.com`. EU async transcription users can configure `https://api.eu.assemblyai.com` when their account/use case requires EU data residency. LLM Gateway uses `https://llm-gateway.assemblyai.com` by default.

## Environment variables

See `.env.example`.

- `ASSEMBLYAI_API_KEY`: required secret.
- `ASSEMBLYAI_API_BASE_URL`: optional transcription API origin.
- `ASSEMBLYAI_LLM_BASE_URL`: optional LLM Gateway origin.
- `ASSEMBLYAI_TIMEOUT_MS`: request timeout, default 20 seconds.
- `ASSEMBLYAI_APPROVAL_MODE`: `required` by default.
- `ASSEMBLYAI_APPROVED_ACTIONS`: comma-separated operator-approved write actions.
- `ASSEMBLYAI_ALLOW_DESTRUCTIVE`: `false` by default; required for deletion in addition to explicit action approval.

Approval state is connector configuration, not a model-controlled tool argument.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `assemblyai.transcript.list` | REST `GET /v2/transcript` | READ | No |
| `assemblyai.transcript.get` | REST `GET /v2/transcript/{id}` | READ | No |
| `assemblyai.transcript.create` | REST `POST /v2/transcript` | WRITE/COST | Required by default |
| `assemblyai.transcript.wait` | REST polling `GET /v2/transcript/{id}` | READ | No |
| `assemblyai.transcript.paragraphs` | REST `GET /v2/transcript/{id}/paragraphs` | READ | No |
| `assemblyai.transcript.sentences` | REST `GET /v2/transcript/{id}/sentences` | READ | No |
| `assemblyai.transcript.subtitles` | REST `GET /v2/transcript/{id}/srt|vtt` | READ | No |
| `assemblyai.transcript.redacted_audio` | REST `GET /v2/transcript/{id}/redacted-audio` | READ | No |
| `assemblyai.transcript.delete` | REST `DELETE /v2/transcript/{id}` | DESTRUCTIVE | Strong approval; disabled by default |
| `assemblyai.llm.analyze_transcript` | LLM Gateway `POST /v1/chat/completions` | WRITE/COST | Required by default |

### Create-transcript options

The connector exposes a deliberately narrow set of commonly useful request fields: HTTPS `audio_url`, language selection/detection, speaker labels, punctuation/formatting, profanity filtering, PII text/audio redaction, and HTTPS webhook URL. Specialized AssemblyAI fields should be added explicitly with validation instead of using an arbitrary JSON pass-through.

The API accepts public audio/video URLs. This connector intentionally does not expose local filesystem upload because allowing a model to choose arbitrary local paths would widen the data-exfiltration boundary.

### LLM analysis

`assemblyai.llm.analyze_transcript` calls the OpenAI-compatible AssemblyAI LLM Gateway and references the stored transcript using the exact `{{ transcript }}` substitution tag. The caller selects a currently supported AssemblyAI Gateway model. Since model availability changes, current model names should be checked against AssemblyAI's live documentation before changing long-lived configuration.

## Architecture

```text
MCP client
   |
   v
src/server.ts          strict MCP tool schemas and workflow validation
   |
   +--> src/config.ts  secret loading and approval policy
   |
   +--> src/client.ts  HTTP transport, timeouts, retry/error mapping
   |
   +--> api.assemblyai.com
   |
   +--> llm-gateway.assemblyai.com
```

AssemblyAI's official documentation MCP server remains an external source of live provider documentation; it is not chained into tool execution and cannot silently expand this connector's permissions.

## Permission model

Default policy:

```text
READ         -> may execute automatically
WRITE/COST   -> explicit operator approval by default
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> explicit approval + ASSEMBLYAI_ALLOW_DESTRUCTIVE=true
```

Example transcription approval:

```text
ASSEMBLYAI_APPROVED_ACTIONS=assemblyai.transcript.create
```

Example LLM analysis approval:

```text
ASSEMBLYAI_APPROVED_ACTIONS=assemblyai.llm.analyze_transcript
```

Deletion requires both:

```text
ASSEMBLYAI_APPROVED_ACTIONS=assemblyai.transcript.delete
ASSEMBLYAI_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals after the intended operation window.

## Reliability and rate limits

AssemblyAI async transcription uses account concurrency limits. When the account reaches its async transcription concurrency limit, additional transcription jobs are queued rather than requiring aggressive client-side resubmission. Streaming has separate concurrency behavior and is not exposed by this connector.

The HTTP client:

- applies a bounded per-request timeout;
- retries read-only GET requests up to three total attempts for HTTP 429, HTTP 5xx, and transient network failures;
- honors `Retry-After` when available, capped at 10 seconds;
- uses exponential backoff otherwise;
- never automatically retries POST or DELETE operations;
- fails authentication, permission, validation, and normal provider errors without blind retry.

`assemblyai.transcript.wait` polls no faster than once per second and has a maximum two-minute tool-call timeout. The default interval is three seconds, matching AssemblyAI's recommended polling pattern.

List requests are bounded to at most 100 items per call.

## Security considerations

- The API key is never present in any MCP input schema or output.
- Provider credentials are attached only in the outbound `authorization` header.
- Tool callers cannot select arbitrary HTTP origins or endpoints.
- `audio_url` and `webhook_url` must use HTTPS.
- Local arbitrary-file upload is intentionally not exposed.
- There is no `execute_any_request`, raw endpoint, or generic HTTP escape hatch.
- Transcript text, speaker utterances, webhook data, subtitle text, redacted-audio metadata, and LLM output are untrusted provider data and must not be treated as tool instructions or permission changes.
- Write/cost approval is controlled outside the model request.
- Transcript deletion is disabled by default and never retried.
- PII-audio generation requires PII redaction to be enabled.
- Redacted-audio URLs are temporary provider URLs; AssemblyAI documents a 24-hour availability window.
- The connector never creates or rotates API keys, changes billing, or increases permissions.

## Error handling

Typical errors are surfaced as:

- configuration validation errors for a missing/invalid API key;
- `APPROVAL_REQUIRED` for unapproved write/cost actions;
- `DESTRUCTIVE_DISABLED` for deletion without explicit destructive enablement;
- `VALIDATION_ERROR` for unsafe/inconsistent inputs;
- `NETWORK_OR_TIMEOUT` after bounded transient read retries;
- `AssemblyAiApiError` containing provider HTTP status and parsed response details.

Provider responses are returned without intentionally including the configured API key.

## Testing

Unit tests require no live AssemblyAI credentials. They cover:

- missing credential configuration;
- write approval and denial;
- destructive-action denial by default;
- credential placement in the provider header;
- authentication error handling;
- no mutation retries;
- bounded read retry after throttling;
- correct LLM Gateway routing;
- scoped MCP tool registration and absence of a generic request escape hatch.

Run:

```bash
npm test
npm run typecheck
```

## Usage examples

See `examples/tool-calls.md` for representative inputs, permission classifications, and approval requirements.

A typical workflow is:

```text
transcript.create
    -> transcript.wait
    -> transcript.get / paragraphs / sentences / subtitles
    -> llm.analyze_transcript (optional approval)
    -> transcript.delete (optional strong approval)
```

## MCP client configuration

Any MCP client capable of launching a local stdio server can run the built connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/assemblyai/dist/src/server.js"],
  "env": {
    "ASSEMBLYAI_API_KEY": "provided-by-secret-manager"
  }
}
```

Do not commit a real key to MCP client configuration files.

For live AssemblyAI documentation lookup, MCP clients supporting Streamable HTTP can separately connect to the official documentation MCP endpoint `https://mcp.assemblyai.com/docs`.

## Limitations

- This is a curated subset, not a full AssemblyAI API wrapper.
- The official documentation MCP endpoint is not proxied into operational tools.
- Streaming transcription and Voice Agent APIs are not exposed in this connector because they require long-lived streaming/session semantics beyond the local stdio request model used here.
- Local file upload is intentionally excluded to avoid arbitrary filesystem-read capability.
- Account management, billing, API-key management, and permission changes are not exposed.
- Webhook receiver hosting/signature infrastructure is outside this connector; only the HTTPS callback URL can be supplied when creating a transcript.
- LLM Gateway model availability and pricing can change; callers should consult current official docs before pinning a model for production.
