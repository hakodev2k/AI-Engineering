# AssemblyAI MCP/API Connector

Reusable local MCP server for AssemblyAI speech-to-text workflows. It exposes a stable, provider-scoped tool contract for creating and reading asynchronous transcripts, segmentation, word search, subtitle export, and controlled deletion while keeping the AssemblyAI API key inside the connector process.

## Transport strategy

No official AssemblyAI MCP server was identified in current AssemblyAI official documentation during the 2026-08-22 review. AssemblyAI provides official REST APIs and official SDKs for pre-recorded and streaming speech-to-text. This connector therefore uses the official REST API and exposes it through a local MCP stdio server.

The external tool contract is intentionally narrower than the provider API. It does not expose arbitrary URLs, arbitrary endpoint invocation, account administration, billing, or key management.

Official sources researched:

- API overview: https://www.assemblyai.com/docs/api-reference/overview
- Speech-to-text fundamentals: https://www.assemblyai.com/blog/speech-to-text-api-fundamentals
- API-key guidance: https://support.assemblyai.com/articles/7562135267-how-to-get-your-api-key
- NA/EU endpoint guidance: https://support.assemblyai.com/articles/9762951419-
- Concurrency behavior: https://support.assemblyai.com/articles/7717276808-what-happens-if-i-reach-my-concurrency-limit
- Transcript sentences/paragraphs: https://www.assemblyai.com/blog/2-new-endpoints-to-return-transcripts-as-paragraphs-and-sentences
- Subtitle export: https://support.assemblyai.com/articles/6564548495-how-do-i-generate-subtitles
- Word search SDK support: https://www.assemblyai.com/blog/assemblyai-go-sdk-1-3-0

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- MCP stdio transport
- Native `fetch`

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

For development:

```bash
npm run dev
```

## Authentication

AssemblyAI REST requests use an API key in the `authorization` header. The connector reads the key from `ASSEMBLYAI_API_KEY` and never includes it in MCP tool schemas or normal output.

Use a secret manager or process-level secret injection in production. Never place the key in prompts, examples, source control, or agent-visible configuration.

## Regional API endpoints

The default pre-recorded transcription API origin is:

```text
https://api.assemblyai.com
```

AssemblyAI also documents an EU endpoint for pre-recorded speech-to-text workloads with EU data-residency requirements:

```text
https://api.eu.assemblyai.com
```

Set `ASSEMBLYAI_API_BASE_URL` to the appropriate official origin. Do not point this variable to arbitrary untrusted hosts.

## Environment variables

See `.env.example`.

- `ASSEMBLYAI_API_KEY`: required secret.
- `ASSEMBLYAI_API_BASE_URL`: defaults to the primary API origin.
- `ASSEMBLYAI_TIMEOUT_MS`: request timeout, 1-120 seconds; default 20 seconds.
- `ASSEMBLYAI_APPROVAL_MODE`: `required` by default.
- `ASSEMBLYAI_APPROVED_ACTIONS`: comma-separated externally approved write actions.
- `ASSEMBLYAI_ALLOW_DESTRUCTIVE`: `false` by default.

Approval state is controlled outside MCP tool input, so an agent cannot self-approve a mutation by adding a parameter.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `assemblyai.transcript.create` | `POST /v2/transcript` | WRITE | Required by default |
| `assemblyai.transcript.get` | `GET /v2/transcript/{id}` | READ | No |
| `assemblyai.transcript.list` | `GET /v2/transcript` | READ | No |
| `assemblyai.transcript.sentences` | `GET /v2/transcript/{id}/sentences` | READ | No |
| `assemblyai.transcript.paragraphs` | `GET /v2/transcript/{id}/paragraphs` | READ | No |
| `assemblyai.transcript.word_search` | `GET /v2/transcript/{id}/word-search` | READ | No |
| `assemblyai.subtitle.srt` | `GET /v2/transcript/{id}/srt` | READ | No |
| `assemblyai.subtitle.vtt` | `GET /v2/transcript/{id}/vtt` | READ | No |
| `assemblyai.transcript.delete` | `DELETE /v2/transcript/{id}` | DESTRUCTIVE | Required + disabled by default |

The create tool exposes a validated practical subset of commonly used transcription options: language controls, speaker labels, multichannel processing, formatting, profanity filtering, auto highlights, PII redaction, webhook callback URL, and optional speech-model selection. Unsupported or specialized fields should be added explicitly instead of through a generic raw-body escape hatch.

## Typical workflow

```text
MCP client
  -> assemblyai.transcript.create
  -> assemblyai.transcript.get
  -> assemblyai.transcript.sentences / paragraphs / word_search
  -> assemblyai.subtitle.srt / vtt
```

Deletion is intentionally separate and strongly gated.

## Permission model

Default policy:

```text
READ         -> automatic
WRITE        -> external operator approval by default
HIGH_RISK    -> explicit approval
DESTRUCTIVE  -> explicit approval + destructive enable flag
```

To approve transcript creation for a controlled execution window:

```text
ASSEMBLYAI_APPROVED_ACTIONS=assemblyai.transcript.create
```

Deletion additionally requires:

```text
ASSEMBLYAI_APPROVED_ACTIONS=assemblyai.transcript.delete
ASSEMBLYAI_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals after the intended operation.

## Reliability and rate limits

AssemblyAI describes asynchronous pre-recorded transcription primarily in terms of account concurrency. When the asynchronous concurrency limit is reached, additional jobs are queued rather than discarded. Streaming sessions use different concurrency behavior and are not exposed by this connector.

The HTTP client implements:

- per-request timeout;
- up to three total attempts for read-only GET requests;
- bounded exponential backoff for transient read network/5xx failures;
- `Retry-After` handling for HTTP 429, capped to 10 seconds per wait;
- no automatic retries for POST or DELETE operations;
- immediate failure for normal authentication, authorization, validation, and other provider errors.

Not retrying mutations avoids duplicate transcript submissions or uncertain repeated deletion.

## Pagination

`assemblyai.transcript.list` exposes bounded page size up to 100 and forwards supported cursor-style identifiers (`before_id` / `after_id`) plus optional status/date filtering. The connector does not automatically crawl an unbounded transcript history.

## Webhooks

The create tool supports a validated `webhook_url` field because AssemblyAI officially supports completion callbacks for asynchronous transcription. The connector does not receive or validate inbound webhook requests itself. Production webhook receivers should validate expected source behavior, restrict accepted paths, enforce HTTPS, authenticate downstream actions, and treat all webhook content as untrusted data.

A webhook callback must never be allowed to silently widen connector permissions or trigger destructive tools without a separate approval decision.

## Security considerations

- API keys remain in the connector process and outbound provider header only.
- Tool callers cannot select arbitrary API endpoints or arbitrary provider origins.
- Retrieved transcript text, subtitle content, webhook payloads, metadata, speaker labels, and provider errors are untrusted data, not instructions.
- Tool inputs use strict IDs, URL validation, bounded arrays, bounded strings, and bounded pagination.
- Mutation approval is external to the model request.
- Destructive deletion is disabled by default.
- No account, billing, API-key, or permission-management APIs are exposed.
- No generic `execute_any_api_request` tool exists.
- Reads may retry; writes and deletes do not.
- `audio_url` and `webhook_url` are provider-consumed URLs; callers should only submit trusted HTTPS resources they are authorized to share with AssemblyAI.

## Data handling

Audio/video submitted through `audio_url` is sent to AssemblyAI for processing. Review AssemblyAI's current privacy, retention, regional-hosting, and contractual terms before sending regulated, confidential, or personal data. PII redaction is an optional transcription feature, not a replacement for an overall data-governance policy.

## Error handling

Expected error categories include:

- configuration validation failure for missing API key;
- `APPROVAL_REQUIRED` for unapproved write operations;
- `DESTRUCTIVE_DISABLED` for deletion without the explicit destructive enable flag;
- `NETWORK_OR_TIMEOUT` after bounded read retries;
- `AssemblyAIError` containing provider status and parsed response details;
- MCP/Zod validation errors for invalid tool inputs.

The connector does not intentionally include the configured API key in error messages.

## Testing

Unit tests require no live AssemblyAI credentials. They cover:

- missing authentication configuration;
- approved and denied writes;
- destructive-operation default denial;
- API-key header placement;
- no retry on authentication failures;
- bounded 429 retry for reads;
- no automatic write retry;
- registration of all intended tools;
- absence of a generic API escape hatch.

Run:

```bash
npm test
```

## MCP client usage

Any MCP client that supports launching a local stdio server can run the built connector. Example configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/assemblyai/dist/src/server.js"],
  "env": {
    "ASSEMBLYAI_API_KEY": "provided-by-secret-manager"
  }
}
```

Do not check a real API key into MCP client configuration.

## Limitations

- This is a focused MCP surface, not a complete AssemblyAI API wrapper.
- No official AssemblyAI MCP server was identified in the official sources checked on 2026-08-22; the implementation is REST-backed.
- Streaming STT (`wss://streaming.assemblyai.com/v3/ws`) is not exposed because a long-lived bidirectional audio stream does not map cleanly to these bounded request/response MCP tools.
- Sync STT and Voice Agent APIs are not exposed in this connector version.
- Local-file upload is intentionally omitted to avoid sending large binary/base64 payloads through the LLM/tool channel. Use an approved object store or application-owned upload layer to obtain a provider-accessible URL first.
- The connector does not host webhook receivers.
- Account, billing, team management, and API-key lifecycle operations are intentionally excluded.

See `examples/tool-calls.md` for concrete tool inputs and approval classifications.
