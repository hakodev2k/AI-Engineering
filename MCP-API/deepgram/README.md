# Deepgram MCP/API Connector

Reusable local MCP server for selected Deepgram speech and account-observability workflows. It exposes a stable, provider-scoped tool contract while keeping the Deepgram API key inside the connector process.

## Transport strategy

Deepgram provides two first-party MCP options:

- Deepgram CLI built-in MCP server: `dg mcp` over stdio, or `dg mcp --transport sse --port 8000`.
- Deepgram documentation MCP server: `https://api.dx.deepgram.com/kapa/mcp` (alternative `https://deepgram.mcp.kapa.ai`).

The CLI MCP server provides direct Deepgram API access, and the docs MCP server provides documentation retrieval. This connector does not dynamically proxy either upstream MCP server. Instead, it uses Deepgram's official HTTPS REST API for a fixed allowlist of 14 tools. That choice keeps the effective permissions, schemas, cost boundaries, and data-transfer behavior reviewable and prevents newly discovered upstream tools from silently expanding agent authority.

Official sources researched for this implementation:

- Agentic developer tools / official MCP: https://developers.deepgram.com/developer-tools/agentic-tools
- Authentication: https://developers.deepgram.com/reference/authentication
- API rate limits: https://developers.deepgram.com/reference/api-rate-limits
- Concurrency guidance: https://developers.deepgram.com/docs/working-with-concurrency-rate-limits
- Pre-recorded transcription: https://developers.deepgram.com/reference/speech-to-text/listen-pre-recorded
- Public models: https://developers.deepgram.com/reference/manage/models/list
- Projects: https://developers.deepgram.com/reference/manage/projects/list
- Project models: https://developers.deepgram.com/reference/manage/projects/models/list
- Project members: https://developers.deepgram.com/reference/manage/members/list
- Project keys: https://developers.deepgram.com/reference/manage/keys/list
- Project requests: https://developers.deepgram.com/reference/manage/requests/list
- Usage fields: https://developers.deepgram.com/reference/manage/usage/list
- Usage breakdown: https://developers.deepgram.com/reference/manage/usage/breakdown/get

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- MCP stdio transport
- Native `fetch` for Deepgram REST calls

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

Deepgram REST requests use a project API key:

```text
Authorization: Token <DEEPGRAM_API_KEY>
```

Set the key only in the connector environment or a secrets manager. Do not place it in prompts, MCP tool arguments, examples, logs, or source control.

Deepgram API keys are project-scoped and can be assigned roles/scopes. Use the least-privileged key that can perform the enabled read operations and transcription calls. This connector does not create API keys because Deepgram's create-key response contains the new secret value; exposing that result through an agent tool would violate credential isolation. It also does not delete keys, projects, members, or other security-sensitive resources.

## Environment variables

See `.env.example`.

- `DEEPGRAM_API_KEY`: required secret.
- `DEEPGRAM_API_BASE_URL`: defaults to `https://api.deepgram.com`; must use HTTPS. Deepgram also documents regional endpoints such as `https://api.eu.deepgram.com` and `https://api.au.deepgram.com`.
- `DEEPGRAM_TIMEOUT_MS`: per-request timeout, default 30 seconds, bounded to 1-120 seconds.
- `DEEPGRAM_APPROVAL_MODE`: `required` by default. Set `disabled` only when an external policy engine provides equivalent approval.
- `DEEPGRAM_APPROVED_ACTIONS`: comma-separated actions approved by an operator.
- `DEEPGRAM_MAX_AUDIO_BYTES`: maximum decoded base64 audio size, default 8 MiB and hard-capped at 25 MiB by configuration validation.

Approval state is external configuration, not an MCP argument. A model cannot self-approve by adding a field to a tool call.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `deepgram.auth.validate` | REST `GET /v1/auth/token` | READ | No |
| `deepgram.model.list` | REST `GET /v1/models` | READ | No |
| `deepgram.model.get` | REST `GET /v1/models/{model_id}` | READ | No |
| `deepgram.project.list` | REST `GET /v1/projects` | READ | No |
| `deepgram.project.get` | REST `GET /v1/projects/{project_id}` | READ | No |
| `deepgram.project.model.list` | REST `GET /v1/projects/{project_id}/models` | READ | No |
| `deepgram.project.member.list` | REST `GET /v1/projects/{project_id}/members` | READ / PII | No |
| `deepgram.project.key.list` | REST `GET /v1/projects/{project_id}/keys` | READ / credential metadata | No |
| `deepgram.project.key.get` | REST `GET /v1/projects/{project_id}/keys/{key_id}` | READ / credential metadata | No |
| `deepgram.project.request.list` | REST `GET /v1/projects/{project_id}/requests` | READ | No |
| `deepgram.project.usage.fields` | REST `GET /v1/projects/{project_id}/usage/fields` | READ | No |
| `deepgram.project.usage.breakdown` | REST `GET /v1/projects/{project_id}/usage/breakdown` | READ | No |
| `deepgram.speech.transcribe_url` | REST `POST /v1/listen` | HIGH_RISK / billable data transfer | Required by default |
| `deepgram.speech.transcribe_base64` | REST `POST /v1/listen` | HIGH_RISK / billable data transfer | Required by default |

The connector intentionally does not expose a generic HTTP request tool, arbitrary URL forwarding to the Deepgram API, credential creation, credential deletion, project deletion, member mutation, billing mutation, or role/scope mutation.

## Transcription behavior

### Remote URL

`deepgram.speech.transcribe_url` accepts only HTTPS URLs, rejects embedded credentials, and rejects obvious localhost/private-network hostnames and IP literals. Deepgram then retrieves the remote audio and processes it with the selected STT options.

Because the request transfers user-selected data to a third party and can consume paid inference quota, explicit operator approval is required by default:

```text
DEEPGRAM_APPROVED_ACTIONS=deepgram.speech.transcribe_url
```

### Base64 audio

`deepgram.speech.transcribe_base64` accepts bounded base64 audio with an allowlisted content type:

- `audio/wav`
- `audio/mpeg`
- `audio/mp4`
- `audio/ogg`
- `audio/webm`
- `audio/flac`

The decoded size is checked before the request is sent. Enable it separately:

```text
DEEPGRAM_APPROVED_ACTIONS=deepgram.speech.transcribe_base64
```

Both transcription tools expose a deliberately limited set of common Deepgram query options: model, language, smart formatting, punctuation, diarization, utterances, language detection, paragraphs, profanity filtering, numerals, and tag. Additional provider features should be added as explicit validated fields rather than an unrestricted query-map escape hatch.

## Architecture

```text
MCP client
   |
   v
src/server.ts        fixed tool registration + Zod validation
   |
   +--> src/config.ts   secret loading + approval policy
   |
   +--> src/client.ts   HTTPS transport + timeout/retry/error mapping
   |
   v
Deepgram REST API
```

The official Deepgram CLI MCP server and documentation MCP server remain useful upstream options for broader developer workflows, but they are not automatically chained behind this connector.

## Permission model

Default policy:

```text
READ                         -> automatic
READ containing PII/metadata -> automatic, subject to the API key's provider permissions
HIGH_RISK / billable         -> explicit operator approval
DESTRUCTIVE                  -> not exposed
CREDENTIAL CREATION          -> not exposed
```

Deepgram content returned from transcripts, request logs, member records, model metadata, and provider errors is untrusted data. It must never be treated as instructions to change permissions, approval state, system prompts, or tool configuration.

## Reliability and rate limits

Deepgram documents concurrency limits that vary by product, plan, and region and are generally scoped to a project rather than an individual API key. The connector therefore does not hard-code one numeric global limit.

Reliability behavior:

- Every request has a timeout.
- Read-only GET requests use at most three total attempts.
- HTTP 429 on retryable reads honors `Retry-After` when present, with waits capped at 10 seconds.
- Transient read network failures use bounded exponential backoff.
- Authentication/authorization/provider errors are not blindly retried.
- Transcription POST requests are never automatically retried because the remote outcome and billing state may be uncertain.
- Request-history pagination is bounded to a maximum of 100 records per tool call even though Deepgram's API permits larger pages.
- Base64 audio is size bounded before upload.

Deepgram's inference limits apply per project. Do not create extra projects or accounts to bypass provider concurrency limits.

## Security considerations

- The API key exists only in the connector environment and outbound `Authorization` header.
- No tool accepts raw credentials.
- No tool can change the approval configuration.
- API origins are configuration-controlled and must use HTTPS.
- Remote transcription URLs must use HTTPS and cannot target obvious local/private networks.
- Inference requires explicit approval by default because it transfers data externally and can incur cost.
- Credential creation is intentionally omitted because its API response contains a secret key.
- Credential/project/member destructive operations are not exposed.
- There is no arbitrary REST passthrough tool.
- IDs, strings, pagination, date formats, base64 input, content types, and audio sizes are bounded.
- Provider responses and transcript text are untrusted content, not policy.

For production, use a dedicated Deepgram project/API key with only the roles/scopes required by these tools and rotate credentials according to your organization policy.

## Error handling

Expected connector errors include:

- configuration validation failure when the API key is missing;
- `CONFIG_ERROR` for non-HTTPS API origins;
- `APPROVAL_REQUIRED` for transcription without operator approval;
- `VALIDATION_ERROR` for unsafe remote URLs, invalid base64, unsupported content types, or oversized audio;
- `NETWORK_OR_TIMEOUT` after bounded retryable failures;
- `DeepgramApiError` with provider HTTP status and parsed response details.

The connector does not intentionally include the configured API key in errors.

## Testing

Unit tests require no live Deepgram account. They cover:

- missing credentials;
- HTTPS-only API configuration;
- approved and denied inference;
- API-key placement in the provider header;
- authorization failures without retry;
- bounded retry on HTTP 429 reads;
- no retry for inference POST requests;
- exact MCP tool registration;
- absence of generic-request and credential-creation escape hatches;
- required approval gates for both transcription tools.

Run:

```bash
npm test
npm run typecheck
```

## Usage examples

See `examples/tool-calls.md` for representative inputs, risk classifications, and approval requirements.

## MCP client configuration

Any MCP client that can launch a local stdio server can run the built connector. Example configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/deepgram/dist/src/server.js"],
  "env": {
    "DEEPGRAM_API_KEY": "provided-by-secret-manager"
  }
}
```

This implementation does not provide a remote HTTP MCP endpoint. Compatibility therefore depends on the client supporting local stdio MCP servers.

For broader first-party MCP behavior, Deepgram's documented CLI MCP server can be launched separately with `dg mcp`, and the documentation MCP server is available over HTTP at the official endpoint above.

## Limitations

- Only selected high-value REST operations are exposed; this is not a complete Deepgram API wrapper.
- Streaming STT, streaming TTS, Voice Agent WebSocket workflows, and text-to-speech binary output are not implemented in this local connector.
- The official `dg mcp` server is documented but not proxied.
- Credential creation/deletion and project/member/security mutations are intentionally excluded.
- Usage breakdown exposes a conservative subset of provider filters.
- Remote URL validation blocks obvious local/private destinations but cannot independently prove the security or ownership of every public URL.
- Transcription results are returned as Deepgram JSON text; the connector does not persist transcripts.
