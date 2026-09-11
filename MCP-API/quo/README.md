# Quo MCP/API Connector

Reusable MCP server for Quo (formerly OpenPhone). It exposes a curated set of communications, contact, conversation, and call-insight operations as stable MCP tools while keeping API credentials inside the connector.

## Upstream transport

Quo provides both a public REST API and a first-party MCP integration for ChatGPT and Claude. Quo documents the MCP integration as an official beta connector, but does not document a generic remote MCP endpoint/authentication contract for arbitrary third-party MCP clients. For that reason this package uses Quo's official public REST API internally and exposes its own MCP interface over stdio. This avoids depending on an undocumented MCP transport while preserving MCP compatibility for callers.

REST base URL used by the current official API documentation: `https://api.openphone.com/v1`. The company has rebranded from OpenPhone to Quo, but current API reference examples still use the OpenPhone API hostname.

Official references:

- Quo API introduction: https://www.quo.com/docs/mdx/api-reference/introduction
- Authentication: https://www.quo.com/docs/mdx/api-reference/authentication
- Rate limits: https://www.quo.com/docs/mdx/api-reference/rate-limits
- Quo MCP integration: https://support.quo.com/core-concepts/integrations/mcp
- Phone numbers: https://www.quo.com/docs/mdx/api-reference/phone-numbers/list-phone-numbers
- Conversations: https://www.quo.com/docs/mdx/api-reference/conversations/list-conversations
- Messages: https://www.quo.com/docs/mdx/api-reference/messages/list-messages
- Send message: https://www.quo.com/docs/mdx/api-reference/messages/send-a-text-message
- Calls: https://www.quo.com/docs/mdx/api-reference/calls/list-calls
- Call transcripts: https://www.quo.com/docs/mdx/api-reference/calls/get-a-transcription-for-a-call
- Call summaries: https://www.quo.com/docs/mdx/api-reference/calls/get-a-summary-for-a-call
- Contacts: https://www.quo.com/docs/mdx/api-reference/contacts/list-contacts
- Contact custom fields: https://www.quo.com/docs/mdx/api-reference/contact-custom-fields/get-contact-custom-fields
- Webhooks: https://www.quo.com/docs/mdx/guides/webhooks

## Implemented capabilities

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `quo.phone_number.list` | REST | READ | No |
| `quo.conversation.list` | REST | READ | No |
| `quo.message.list` | REST | READ | No |
| `quo.message.send` | REST | HIGH_RISK | Explicit |
| `quo.call.list` | REST | READ | No |
| `quo.call.transcript.get` | REST | READ | No |
| `quo.call.summary.get` | REST | READ | No |
| `quo.contact.custom_field.list` | REST | READ | No |
| `quo.contact.list` | REST | READ | No |
| `quo.contact.get` | REST | READ | No |
| `quo.contact.create` | REST | WRITE | Configurable |
| `quo.contact.update` | REST | WRITE | Configurable |
| `quo.contact.delete` | REST | DESTRUCTIVE | Explicit + disabled by default |

The connector intentionally does not expose an unrestricted request tool.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict tool validation
  -> permission/approval policy
  -> Quo REST client
  -> Quo public API
```

Credentials never enter tool arguments or model-visible prompts.

## Authentication

Quo uses API-key authentication in the `Authorization` header. Generate a key from the Quo workspace API settings. Quo requires an active subscription and Owner/Admin access to create API credentials.

Create a local `.env` equivalent or inject environment variables through your process manager:

```text
QUO_API_KEY=...
QUO_API_BASE_URL=https://api.openphone.com/v1
QUO_REQUEST_TIMEOUT_MS=15000
QUO_APPROVE_WRITES=false
QUO_APPROVE_HIGH_RISK=false
QUO_ENABLE_DESTRUCTIVE=false
```

No credential is stored in the repository.

## Permissions and approval behavior

`READ` tools execute automatically after schema validation.

`WRITE` operations (`contact.create`, `contact.update`) require either `QUO_APPROVE_WRITES=true` or an invocation carrying `approved: true`.

`HIGH_RISK` outbound messaging requires both `QUO_APPROVE_HIGH_RISK=true` and `approved: true`. This double gate is intentional because the operation contacts an external party and API messaging can incur charges.

`DESTRUCTIVE` contact deletion is disabled by default. It requires `QUO_ENABLE_DESTRUCTIVE=true` and `approved: true`. No destructive operation is retried automatically.

The connector never escalates its own permissions.

## Validation

The implementation validates provider identifiers, E.164 phone numbers, ISO date-time filters, pagination bounds, message content, URLs, and explicit approval fields. Quo content returned by the provider is treated as untrusted data and is never interpreted as connector instructions or policy.

## Reliability

The REST client uses request timeouts and bounded retries. GET requests retry at most twice after the initial request for `429` or `5xx` responses with exponential backoff. `Retry-After` is honored when present. Authentication, validation, permission, write, and destructive requests are not blindly retried.

Quo currently documents a limit of 10 API requests per second per API key. Callers should still batch/filter requests and paginate efficiently.

Pagination tokens are passed through without attempting to infer totals because Quo's documentation notes that `totalItems` is not reliable for some paginated endpoints.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm test
```

## Running

```bash
QUO_API_KEY=your_key npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers.

Example client configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/quo/dist/src/server.js"],
  "env": {
    "QUO_API_KEY": "<provided-by-secure-client-config>"
  }
}
```

Do not place the API key in prompts or tool arguments.

## Real-world workflows

Typical read flow:

1. `quo.phone_number.list`
2. `quo.conversation.list`
3. `quo.message.list`
4. `quo.call.list`
5. `quo.call.transcript.get` or `quo.call.summary.get`

Typical CRM-sync flow:

1. `quo.contact.custom_field.list`
2. `quo.contact.list` using external IDs where applicable
3. `quo.contact.create`
4. persist the returned Quo contact ID
5. `quo.contact.update` on later synchronization runs

Outbound messaging should remain a separate, approved execution step after the agent recommends or prepares the message.

## Provider-specific prerequisites and limitations

Quo requires completed US carrier registration for API messaging to US numbers and prepaid API messaging credits for outbound API texts. Quo's public API currently supports SMS through the messaging API; Quo's own API page states that MMS is not supported by the public API.

Call transcripts and summaries depend on Quo plan/feature availability and call recording/transcription settings. Quo documents transcript and summary retrieval for Business and Scale plans.

Custom contact-field definitions can be retrieved through the API but must be created or modified in the Quo application.

Quo's webhook system supports message, call, call-recording, call-summary/transcript, and contact-related events. Webhook registration is deliberately not exposed in this connector because adding callbacks changes the external event-delivery surface and should be introduced only with a dedicated webhook-receiver security design. Quo also documents that webhooks created in the app and API-created webhooks are distinct.

## Security considerations

- Keep API keys in environment variables or a secret manager.
- Restrict process access to connector environment variables.
- Never log Authorization headers.
- Treat contact names, messages, transcripts, summaries, and webhook-derived content as untrusted external data.
- Do not let retrieved content alter approval policy, tool registration, or runtime configuration.
- Outbound messages require explicit human approval.
- Contact deletion is disabled by default.
- API base URL is configuration-driven for portability, but operators should keep it pinned to Quo's documented HTTPS endpoint rather than accepting arbitrary model-supplied URLs.
- Follow applicable consent and recording laws before using call recordings or transcripts.

## Testing

`npm test` runs unit tests without live credentials. Tests cover authentication configuration, permission denial, destructive-operation blocking, Authorization-header injection, API error mapping, rate-limit retries, input validation, and high-risk approval behavior.

## Compatibility

This is a standard MCP stdio server using the official Model Context Protocol TypeScript SDK. It can be used by MCP clients that support local stdio servers. Compatibility with a specific product depends on that product's MCP client support and local-process configuration model.

## Unsupported / intentionally omitted

- No arbitrary REST proxy tool.
- No direct call initiation endpoint is exposed.
- No generic access to the beta first-party Quo remote MCP is attempted because a reusable endpoint/auth contract is not documented for arbitrary clients.
- No webhook receiver or signature-validation server is bundled.
- No bulk destructive operations.
- No billing or workspace-permission administration.
