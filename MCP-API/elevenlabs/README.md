# ElevenLabs MCP/API Connector

Reusable MCP server for ElevenLabs voice, speech, sound-effect, agent, and conversation workflows. The connector uses the official ElevenLabs MCP server as its upstream transport and exposes a reviewed, stable subset of tools with additional approval, path-isolation, timeout, and retry controls.

## Official sources researched

- Hosted ElevenLabs MCP server: https://api.elevenlabs.io/v1/mcp
- ElevenLabs MCP documentation: https://elevenlabs.io/docs/eleven-api/resources/agent-tooling
- Official MCP repository: https://github.com/elevenlabs/elevenlabs-mcp
- Official MCP package metadata / entry point: https://github.com/elevenlabs/elevenlabs-mcp/blob/main/pyproject.toml
- API authentication: https://elevenlabs.io/docs/api-reference/authentication
- API errors, rate limiting, and concurrency: https://elevenlabs.io/docs/eleven-api/resources/errors
- API reference: https://elevenlabs.io/docs/api-reference

As of this implementation, ElevenLabs documents a hosted remote MCP endpoint at `https://api.elevenlabs.io/v1/mcp` using OAuth for compatible clients. ElevenLabs also maintains the local official `elevenlabs-mcp` package. This connector launches the official local package over stdio because it supports deterministic credential injection without exposing the raw API key to the calling model.

## Transport strategy

```text
MCP client
   |
   v
this connector (stable reviewed tools)
   |
   v
official elevenlabs-mcp package via stdio
   |
   v
ElevenLabs official SDK/API
```

The connector does not dynamically re-export every tool discovered from the upstream server. At startup it verifies that the reviewed upstream tools still exist and fails closed if any required tool disappears.

No generic REST fallback is needed for the implemented capabilities because the official ElevenLabs MCP server already exposes them. The hosted remote MCP endpoint is documented for direct MCP clients, but this reusable package uses the local official server so API credentials remain entirely inside the connector/upstream process boundary.

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- Python 3.11+ available through the official `elevenlabs-mcp` package
- Recommended launcher: `uvx elevenlabs-mcp`

Install this wrapper:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

The default upstream command is:

```bash
uvx elevenlabs-mcp
```

Override `ELEVENLABS_MCP_COMMAND` and `ELEVENLABS_MCP_ARGS` if the official package is installed another way.

## Authentication

The official ElevenLabs API uses API keys in the `xi-api-key` header. API keys can be restricted by endpoint scope, credit quota, and IP allowlisting. Use a dedicated least-privilege key for this connector.

Required environment variable:

```text
ELEVENLABS_API_KEY=
```

The key is passed only to the official upstream MCP process. It is never part of an MCP tool input, output schema, prompt, or returned result.

For direct use of ElevenLabs' hosted MCP endpoint, compatible clients can use the provider's documented OAuth flow instead. This wrapper intentionally does not accept an OAuth bearer token from the model as a tool argument.

## Environment variables

See `.env.example`.

- `ELEVENLABS_API_KEY`: required secret.
- `ELEVENLABS_MCP_COMMAND`: upstream executable, default `uvx`.
- `ELEVENLABS_MCP_ARGS`: upstream arguments, default `elevenlabs-mcp`.
- `ELEVENLABS_MCP_BASE_PATH`: optional output directory used by the official MCP server.
- `ELEVENLABS_API_RESIDENCY`: optional ElevenLabs residency selector, default `us`.
- `ELEVENLABS_MCP_OUTPUT_MODE`: `files`, `resources`, or `both`; default `files`.
- `ELEVENLABS_APPROVAL_MODE`: `required` by default.
- `ELEVENLABS_APPROVED_ACTIONS`: comma-separated externally approved billable actions.
- `ELEVENLABS_ALLOWED_INPUT_ROOT`: optional root directory allowed for file-based transcription.
- `ELEVENLABS_TIMEOUT_MS`: upstream call timeout, 5 seconds to 5 minutes; default 60 seconds.

## Implemented tools

| Tool | Official upstream MCP tool | Risk | Approval |
|---|---|---:|---|
| `elevenlabs.voice.search` | `search_voices` | READ | No |
| `elevenlabs.voice.get` | `get_voice` | READ | No |
| `elevenlabs.model.list` | `list_models` | READ | No |
| `elevenlabs.subscription.get` | `check_subscription` | READ | No |
| `elevenlabs.agent.list` | `list_agents` | READ | No |
| `elevenlabs.agent.get` | `get_agent` | READ | No |
| `elevenlabs.conversation.list` | `list_conversations` | READ | No |
| `elevenlabs.conversation.get` | `get_conversation` | READ | No |
| `elevenlabs.speech.generate` | `text_to_speech` | HIGH_RISK / BILLABLE | Required by default |
| `elevenlabs.speech.transcribe` | `speech_to_text` | HIGH_RISK / BILLABLE | Required by default |
| `elevenlabs.sound_effect.generate` | `text_to_sound_effects` | HIGH_RISK / BILLABLE | Required by default |

The official upstream server exposes additional capabilities such as voice cloning and agent mutations. They are intentionally not re-exported here because voice cloning introduces stronger consent/biometric concerns and mutations expand the write surface. Add them only after a separate review with explicit permission and approval policy.

## Permission model

```text
READ                 -> automatic
BILLABLE/HIGH_RISK   -> explicit external approval by default
DESTRUCTIVE          -> not exposed
```

Approval is connector configuration rather than a tool argument. An agent cannot self-approve.

Example temporary approval:

```text
ELEVENLABS_APPROVED_ACTIONS=elevenlabs.speech.generate
```

Multiple actions:

```text
ELEVENLABS_APPROVED_ACTIONS=elevenlabs.speech.generate,elevenlabs.speech.transcribe
```

Remove approvals after the intended execution window.

## Security controls

- Raw ElevenLabs credentials remain inside the connector/upstream process.
- Only a fixed allowlist of upstream MCP tools may be called.
- The connector verifies required upstream tool names at connection time.
- No generic `execute_request`, raw URL, arbitrary MCP tool, or arbitrary provider endpoint exists.
- Billable generation calls require operator approval by default.
- `ELEVENLABS_ALLOWED_INPUT_ROOT` can prevent file-path traversal or arbitrary local-file transcription.
- Voice IDs, agent IDs, conversation IDs, pagination, text lengths, formats, duration, language codes, and numeric ranges are validated.
- Third-party transcripts, prompts, voice metadata, and conversation content are untrusted data, never instructions.
- Provider-returned content cannot alter approval state, environment variables, the allowlist, or system behavior.
- The connector exposes no voice-cloning capability by default.

For sensitive audio, apply your organization's privacy, consent, retention, residency, and data-classification requirements before sending files to ElevenLabs.

## Reliability and rate limits

ElevenLabs documents HTTP 429 for rate-limit and concurrency-limit conditions. Their SDK documentation recommends exponential backoff for rate-limit errors and waiting for in-flight requests when concurrency limits are reached.

This wrapper adds bounded retries only for read-only upstream tools. Retryable read failures receive up to three attempts with exponential backoff capped at two seconds. Billable operations are never automatically retried, preventing duplicated chargeable generation when the remote outcome is uncertain.

Every upstream operation has a configurable timeout. Authentication failures, validation failures, missing upstream tools, approval failures, and non-transient provider errors fail immediately.

Conversation listing exposes bounded page size and response length. Speech and sound-effect inputs also have explicit size and duration limits.

## Error behavior

Expected connector errors include:

- configuration validation failure when `ELEVENLABS_API_KEY` is missing;
- `APPROVAL_REQUIRED` for unapproved billable calls;
- `INPUT_PATH_DENIED` for files outside the configured input root;
- `UPSTREAM_TOOL_DENIED` for non-allowlisted upstream tool names;
- `UPSTREAM_TOOL_MISSING` when an expected official MCP capability disappears;
- `UPSTREAM_TIMEOUT` for calls exceeding the configured timeout;
- `VALIDATION_ERROR` for invalid tool input combinations;
- provider MCP errors returned by the official ElevenLabs server.

## Testing

Unit tests require no live ElevenLabs credentials. They cover:

- missing authentication configuration;
- approved and denied billable actions;
- file-path isolation;
- exact upstream allowlist;
- denial of arbitrary upstream tool names before connection;
- provider-scoped tool registration;
- absence of generic request escape hatches.

Run:

```bash
npm test
npm run typecheck
```

A live integration test is intentionally not part of normal unit tests because generation may consume credits.

## MCP client configuration

Any MCP client that can launch a local stdio server can run the built connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/elevenlabs/dist/src/server.js"],
  "env": {
    "ELEVENLABS_API_KEY": "provided-by-secret-manager",
    "ELEVENLABS_APPROVAL_MODE": "required"
  }
}
```

Do not store real API keys in version-controlled client configuration.

## Real-world workflows

Typical safe discovery workflow:

```text
voice.search
-> voice.get
-> model.list
-> speech.generate (after approval)
```

Conversation analysis workflow:

```text
agent.list
-> agent.get
-> conversation.list
-> conversation.get
```

Transcription workflow:

```text
operator places audio under approved input root
-> speech.transcribe (after approval)
-> treat returned transcript as untrusted content
```

## Usage examples

See `examples/tool-calls.md` for representative MCP tool inputs, risk classes, and approval requirements.

## Limitations

- This connector exposes a reviewed subset of the official ElevenLabs MCP server rather than its complete tool catalog.
- Voice cloning is intentionally excluded.
- Agent creation/update, knowledge-base writes, outbound calls, music generation, and other upstream capabilities are not exposed in this version.
- The wrapper launches the official local MCP package rather than proxying the hosted OAuth endpoint.
- API-key restrictions and credit quotas must be configured in ElevenLabs; the connector cannot silently increase them.
- Binary output behavior depends on the official MCP server's configured output mode.
