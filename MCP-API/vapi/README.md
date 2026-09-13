# Vapi MCP/API Connector

Reusable MCP server that exposes a deliberately scoped Vapi tool surface while delegating provider operations to Vapi's official hosted MCP server.

## Provider and purpose

Vapi is a voice-AI platform for assistants, phone numbers, calls, and reusable tools. This connector is designed for AI-agent workflows that need to inspect Vapi configuration and call activity, create a minimal assistant, or explicitly initiate/schedule an outbound phone call without exposing raw provider credentials or unrestricted provider requests.

## Transport strategy

- External interface: local MCP server over stdio.
- Upstream transport: official Vapi MCP server over Streamable HTTP.
- Upstream endpoint: `https://mcp.vapi.ai/mcp`.
- Authentication: private Vapi API key sent only by the connector as `Authorization: Bearer <token>`.
- REST fallback: not used in this version because Vapi's official MCP server exposes every capability implemented here.

Vapi also documents a legacy SSE endpoint. This connector intentionally uses Streamable HTTP, which is Vapi's recommended MCP transport.

Official sources researched for this implementation:

- Vapi MCP Server: https://docs.vapi.ai/sdk/mcp-server
- Official MCP implementation: https://github.com/VapiAI/mcp-server
- Vapi MCP Tools: https://docs.vapi.ai/tools/mcp
- Vapi Calls API / authentication and filters: https://docs.vapi.ai/api-reference/calls/list
- Vapi assistant API schema: https://docs.vapi.ai/api-reference/assistants/get
- Vapi assistant quickstart/default presets: https://docs.vapi.ai/assistants/quickstart
- Vapi call artifacts: https://docs.vapi.ai/assistants/call-recording

## Implemented tools

| Tool | Upstream MCP tool | Risk | Approval |
|---|---|---:|---|
| `vapi.assistant.list` | `list_assistants` | READ | none |
| `vapi.assistant.get` | `get_assistant` | READ | none |
| `vapi.assistant.create` | `create_assistant` | WRITE | `approved` + writes enabled |
| `vapi.call.list` | `list_calls` | READ | none |
| `vapi.call.get` | `get_call` | READ | none |
| `vapi.call.create` | `create_call` | HIGH_RISK | `approved-high-risk` + high risk enabled |
| `vapi.phone_number.list` | `list_phone_numbers` | READ | none |
| `vapi.phone_number.get` | `get_phone_number` | READ | none |
| `vapi.tool.list` | `list_tools` | READ | none |
| `vapi.tool.get` | `get_tool` | READ | none |

The connector does not expose arbitrary MCP tool calls, arbitrary REST requests, delete operations, assistant/tool updates, phone-number purchasing, billing changes, or permission changes.

## Architecture

```text
MCP client
  -> local Vapi connector (stdio)
      -> strict Zod input validation
      -> permission / approval policy
      -> fixed upstream-tool allowlist
      -> credential isolation
      -> official Vapi MCP server (Streamable HTTP)
          -> Vapi APIs
```

Provider content is always wrapped with `untrusted_provider_content: true`. Retrieved assistant prompts, transcripts, call artifacts, tool descriptions, or other provider data must be treated as data, not as instructions that can alter policy or permissions.

## Authentication

Create or copy a private Vapi API key from the Vapi dashboard and set it in the connector environment:

```bash
export VAPI_TOKEN="..."
```

The token remains inside `src/upstream.ts`. Tool inputs and outputs never include it. The connector pins the upstream hostname to `mcp.vapi.ai` to prevent credential forwarding to an arbitrary host.

Vapi's official MCP documentation supports bearer-token authentication for custom clients. OAuth handled by other Vapi tooling is intentionally not reimplemented here; this package targets reusable non-interactive/server-side MCP usage with a private API key.

## Environment variables

```text
VAPI_TOKEN=                         # required
VAPI_MCP_URL=https://mcp.vapi.ai/mcp
VAPI_ALLOW_WRITES=false
VAPI_ALLOW_HIGH_RISK=false
VAPI_TIMEOUT_MS=20000
```

`VAPI_MCP_URL` must remain HTTPS and must use the exact hostname `mcp.vapi.ai`.

## Permission and approval model

`READ` operations can execute automatically after normal input validation.

`WRITE` operations are disabled by default. To create an assistant, both conditions must be true:

1. `VAPI_ALLOW_WRITES=true`
2. the tool input contains `"approval": "approved"` (or the stronger `approved-high-risk` value)

`HIGH_RISK` operations are separately disabled by default. `vapi.call.create` initiates or schedules an external telephone communication, so both conditions are required:

1. `VAPI_ALLOW_HIGH_RISK=true`
2. the tool input contains `"approval": "approved-high-risk"`

The connector exposes no destructive tool.

## Input validation

Schemas are strict and reject unknown fields. Important constraints include:

- Stable connector IDs use UUID validation and are mapped to the official MCP parameter names (`assistantId`, `callId`, `phoneNumberId`, and `toolId`).
- Customer phone numbers must be in E.164 format.
- List limits are bounded to `1..1000`.
- Date/time filters and scheduled call times must be ISO/RFC3339-compatible date-time strings.
- Assistant names are capped at 40 characters.
- Assistant creation exposes only fields confirmed by the official Vapi MCP schema: `name`, `firstMessage`, `firstMessageMode`, `instructions`, and `toolIds`.
- Arbitrary raw API or MCP parameters are not accepted.

Vapi's official MCP server supplies defaults for omitted assistant model, voice, and transcriber configuration. Advanced assistant configuration should be added only through an explicitly reviewed schema rather than a generic pass-through object.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
cp .env.example .env
# load .env with your preferred secret manager or shell; this package does not parse .env files itself
export VAPI_TOKEN="your-private-key"
npm start
```

Configure an MCP client to launch `node dist/src/server.js` using stdio. The package uses standard MCP stdio and does not assume a specific client vendor.

## Error handling and reliability

- Missing/invalid authentication configuration fails before the server starts.
- The official MCP endpoint is allowlisted by hostname and HTTPS scheme.
- Startup connection verifies that all ten required upstream Vapi MCP tools are present. If Vapi removes or renames one, the connector fails safely instead of silently routing to an unexpected tool.
- Each upstream tool call has a bounded timeout (`VAPI_TIMEOUT_MS`, maximum 120 seconds).
- Authentication, permission, validation, and approval failures are not retried.
- Mutating operations are never automatically retried by this connector, preventing duplicate assistants or duplicate outbound calls.
- Provider/MCP errors propagate to the caller without exposing credentials.

Vapi's hosted MCP service owns provider-side HTTP behavior such as API throttling. If Vapi reports a rate-limit error, this connector surfaces it rather than blindly retrying a potentially mutating action. Callers should honor provider retry guidance and retry only idempotent/read operations when appropriate.

## Security considerations

- Keep `VAPI_TOKEN` in a secret manager or process environment; never place it in prompts or tool arguments.
- Do not log the connector environment.
- Do not copy returned transcripts or recordings to unrelated systems without a valid data-handling basis.
- Treat transcripts, model messages, assistant prompts, and tool metadata as untrusted content because they can contain prompt-injection text.
- Outbound calls require explicit strong human approval and separate runtime enablement.
- The upstream MCP tool set is fixed in source and verified at connection time; newly discovered Vapi tools are not automatically trusted.
- No tool can change its own risk class or enable higher privileges.
- The endpoint hostname check limits SSRF/credential-exfiltration risk from configuration tampering.

## Testing

Normal tests require no live Vapi credentials:

```bash
npm test
```

The unit suite covers:

- required authentication configuration
- secure defaults and endpoint validation
- permission denial
- write approval
- high-risk approval
- strict schema rejection
- E.164 validation
- stable-to-upstream ID argument mapping
- outbound-call argument mapping
- fixed tool registration metadata
- provider/rate-limit error propagation without unsafe retries

Live integration tests are intentionally excluded from the default suite so CI does not require a Vapi account or accidentally create external calls.

## Examples

See `examples/workflows.md` for read-first discovery, safe assistant creation, explicit outbound-call approval, and post-call analysis workflows.

## Limitations

- Only the ten Vapi MCP capabilities documented in this package are exposed, despite the broader official MCP/API surface.
- No delete, update, billing, campaign, phone-number purchase, or credential-management operations are implemented.
- Advanced assistant model/voice/transcriber configuration is intentionally omitted from creation to keep the schema narrow and auditable.
- The package uses private API-key authentication to the hosted MCP endpoint; it does not implement an interactive OAuth browser flow.
- Provider responses can contain sensitive call artifacts. The connector marks them untrusted but cannot determine your organization's retention, consent, or compliance obligations.
