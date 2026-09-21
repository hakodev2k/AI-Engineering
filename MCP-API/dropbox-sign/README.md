# Dropbox Sign MCP Connector

Reusable MCP server for Dropbox Sign (formerly HelloSign) using the official Dropbox Sign REST API v3. No official Dropbox Sign-specific MCP server was found during research; Dropbox's official remote MCP is for Dropbox file workflows, not the Sign API, so this connector uses the official Sign API directly.

## Official sources
- API overview: https://developers.hellosign.com/docs/overview
- API reference: https://developers.hellosign.com/api/reference
- Authentication: https://developers.hellosign.com/api/reference/authentication
- Signature request files: https://developers.hellosign.com/api/signature-request/files
- Dropbox remote MCP: https://help.dropbox.com/integrations/connect-dropbox-mcp-server

## Transport and architecture
MCP client -> local stdio MCP server -> validation/approval boundary -> credential-isolated REST client -> `https://api.hellosign.com/v3`.

Credentials are read only inside the connector. Provider-returned text is untrusted data and is never interpreted as tool instructions or permission changes. The connector exposes no arbitrary URL/request tool, preventing SSRF-style endpoint substitution.

## Authentication
Set either `DROPBOX_SIGN_API_KEY` (HTTP Basic with API key as username) or `DROPBOX_SIGN_ACCESS_TOKEN` (OAuth bearer token). OAuth is recommended for multi-user applications. Never put credentials in prompts or tool arguments. `DROPBOX_SIGN_CLIENT_ID` is reserved for deployments that use embedded/OAuth application configuration; it is not transmitted unless a future explicitly implemented endpoint requires it.

Copy `.env.example` and inject secrets through your runtime/secret manager. OAuth scopes are endpoint-specific in Dropbox Sign; grant only the scopes shown by the official API reference for the endpoints you enable. API keys inherit the API account's permissions and therefore require especially careful secret isolation.

## Installation
Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and therefore works with MCP clients that support launching local stdio servers. Configure the client to execute `node /absolute/path/MCP-API/dropbox-sign/dist/src/server.js` with credentials supplied in the process environment.

## Implemented tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `dropbox_sign.account.get` | REST | READ | No |
| `dropbox_sign.signature_request.list` | REST | READ | No |
| `dropbox_sign.signature_request.get` | REST | READ | No |
| `dropbox_sign.signature_request.files` | REST | READ | No |
| `dropbox_sign.template.list` | REST | READ | No |
| `dropbox_sign.template.get` | REST | READ | No |
| `dropbox_sign.signature_request.send_with_template` | REST | WRITE/HIGH_RISK | Yes |
| `dropbox_sign.signature_request.remind` | REST | WRITE | Yes |
| `dropbox_sign.signature_request.cancel` | REST | DESTRUCTIVE | Yes |

Writes require `DROPBOX_SIGN_APPROVE_WRITES=true` for the execution context. Production callers should set this only after explicit human confirmation and unset it immediately afterward. Sending a signature request or reminder communicates externally; canceling changes request state.

## Validation and safety
Inputs use strict Zod constraints for identifiers, email addresses, pagination, enums and bounded text. There is no generic HTTP proxy. Credentials never appear in tool schemas or outputs. Downloads are returned as base64 because MCP stdio text tools cannot safely stream arbitrary binary data through this implementation. Large signed files can therefore consume memory; production deployments should enforce process/output limits.

## Reliability and rate limits
Every API call has an abort timeout (`DROPBOX_SIGN_TIMEOUT_MS`, default 15 seconds). HTTP/provider failures are surfaced without blind retries, which avoids duplicating signature sends, reminders or cancellation actions. Dropbox Sign documents default limits of up to 100 requests/minute for standard endpoints, 25/minute for higher-tier endpoints, and 10/minute in test mode; it also returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. A `429` is surfaced to the caller so orchestration can wait until the provider window resets rather than retrying writes blindly.

Pagination is exposed on list operations to avoid large fan-out. Authentication, permission and validation failures are never retried automatically.

## Errors
Missing credentials fail locally. Provider 4xx/5xx responses become connector errors. Timeouts abort the request. A write attempted without approval fails before any provider request is made. Dropbox Sign may return `409` while requested files are being prepared; callers should retry that read later with bounded backoff.

## Testing
```bash
npm test
```
Unit tests do not use live credentials. They verify construction, default write gating, and credential non-exposure. Provider HTTP should be mocked for expanded integration suites; live tests belong in an opt-in environment.

## Security considerations
Use least-privilege OAuth where practical, rotate API keys, redact process environments from logs, and do not log authorization headers. Treat document names, signer names/messages and API responses as untrusted content. Human approval is mandatory before external messages or state-changing actions. Do not let retrieved document content alter approval state. Keep destructive behavior gated.

## Limitations
This connector intentionally does not create templates, delete templates, bulk-send, create embedded signing sessions, or accept arbitrary local file uploads. Those operations add plan requirements, binary handling, or higher risk and are not required for the core reusable workflow. Webhook ingestion is not implemented because this stdio server has no public HTTP listener. Direct non-template send is also not implemented; use an existing Dropbox Sign template through the implemented send-with-template tool. The official Dropbox remote MCP is not used as a substitute because it targets Dropbox storage capabilities rather than the Dropbox Sign API surface.
