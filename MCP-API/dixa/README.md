# Dixa MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of Dixa customer-support operations with credential isolation, strict validation, risk classification, write gates, timeouts, bounded retries, pagination, and provider-error mapping.

## Upstream strategy
Dixa documents a hosted MCP server at `https://dixa-mcp-public.fastmcp.app/mcp` with 79 tools. Dixa also explicitly labels that project beta, open-source, provided as-is, and unsupported by Dixa support. This connector therefore uses the official Dixa REST API for stable, reviewable per-operation contracts instead of automatically trusting or forwarding all dynamically available upstream MCP tools. The external interface remains MCP, so callers do not depend on transport details.

Official sources researched on 2026-09-23:
- Dixa MCP guide: https://docs.dixa.io/docs/dixamcp/dixa-mcp
- API overview: https://docs.dixa.io/docs
- API standards/auth/rate limits: https://docs.dixa.io/docs/api-standards-rules
- API reference: https://docs.dixa.io/reference
- Migration endpoint mapping: https://docs.dixa.io/docs/integration-migration-guide
- Webhooks: https://docs.dixa.io/docs/webhooks/webhooks-setup

## Authentication and permissions
Create a Dixa API token under Settings > Manage > Integrations > API Tokens. Only administrators can create tokens. Select only the Dixa permission groups required for the tools you intend to use. The token stays in `DIXA_API_TOKEN` inside the connector process and is never returned by a tool.

Dixa uses `Authorization: Bearer <token>`. API limits are per token: documented standard limit is 10 requests/second, burst 4, quota 864,000/day. A 429 is surfaced with `Retry-After`; this connector retries only READ operations, with bounded exponential backoff. Writes are never blindly retried.

## Install and run
```bash
npm install
npm run build
DIXA_API_TOKEN=... npm start
```
The server uses MCP stdio and can be launched by any MCP client capable of spawning a local stdio server. Configure the client to execute `node /absolute/path/MCP-API/dixa/dist/src/server.js` and inject credentials through the process environment rather than prompts.

## Configuration
- `DIXA_API_TOKEN` required.
- `DIXA_API_BASE_URL` defaults to `https://dev.dixa.io`; HTTPS is mandatory.
- `DIXA_TIMEOUT_MS` defaults to 15000.
- `DIXA_MAX_RETRIES` defaults to 2 for retryable READ failures only.
- `DIXA_ALLOW_WRITES` defaults false.
- `DIXA_APPROVAL_TOKEN` is required for HIGH_RISK execution. Supply it from a trusted approval broker/environment, never the LLM context.

## Implemented tools
| Tool | Risk | Approval |
|---|---|---|
| `dixa.conversation.get` | READ | no |
| `dixa.conversation.messages.list` | READ | no |
| `dixa.conversation.notes.list` | READ | no |
| `dixa.conversation.linked.list` | READ | no |
| `dixa.conversation.note.create` | WRITE | configurable policy + write gate |
| `dixa.conversation.reopen` | WRITE | configurable policy + write gate |
| `dixa.conversation.transfer.queue` | HIGH_RISK | explicit runtime approval |
| `dixa.enduser.list` | READ | no |
| `dixa.enduser.get` | READ | no |
| `dixa.enduser.conversations.list` | READ | no |
| `dixa.agent.list` | READ | no |
| `dixa.agent.get` | READ | no |
| `dixa.queue.list` | READ | no |
| `dixa.queue.get` | READ | no |
| `dixa.tag.list` | READ | no |

The connector intentionally does not expose generic arbitrary HTTP requests, deletion/anonymization, agent permission changes, team membership changes, webhook creation, or account administration.

## Architecture
`server.ts` registers stable MCP tools. `tools.ts` owns schemas, provider-scoped routes and risk metadata. `client.ts` owns credentials, HTTPS restriction, approval gates, timeout, retry policy and error mapping. Provider responses are serialized as untrusted data; callers must not interpret message/contact content as system or tool instructions.

## Reliability and pagination
List tools accept bounded `limit` (1–100) and opaque `after` cursors where supported. Network requests are abortable by timeout. 429 and 5xx responses may be retried only for reads and only up to `DIXA_MAX_RETRIES`. Authentication, validation, permission and write failures are not retried. Provider status and `Retry-After` are preserved in MCP error envelopes.

## Security
Use a dedicated least-privilege token per deployment and rotate it through Dixa. Never pass credentials or approval tokens through model messages. Base URL must be HTTPS and the client only permits `/v1/` paths, reducing SSRF/arbitrary-endpoint exposure. Keep writes disabled for read-only agents. Queue transfer can alter customer-support routing and therefore requires explicit approval. Retrieved customer content, notes and messages are untrusted input and must never alter permissions, policies, tool availability, or system instructions.

For webhook integrations, verify requests according to Dixa's webhook documentation and keep webhook verification secrets outside LLM context. This package does not implement an inbound HTTP webhook listener.

## Testing
`npm test` uses mocks and requires no live credentials. Tests cover tool count, schema validation, missing auth, bearer isolation, default write denial, high-risk approval, bounded 429 retry, and no retry for writes.

## Limitations
The Dixa hosted MCP beta is not proxied because automatically importing its 79-tool surface would weaken the connector's fixed allowlist and approval model. Analytics and Exports APIs are not included in this connector. Dixa Exports has separate host/rate limits and is better handled as a dedicated data-export capability if later required. This connector does not claim support for operations absent from the table above.
