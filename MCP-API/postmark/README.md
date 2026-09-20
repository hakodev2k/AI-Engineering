# Postmark MCP/API Connector

Reusable MCP server exposing a constrained Postmark transactional-email surface. Upstream transport is Postmark's official HTTPS REST API; Postmark documents AI tooling including an MCP server, but this connector deliberately uses the REST API so its fixed tool contract, validation, approval policy, and credential isolation remain under connector control.

## Official sources
- Developer hub: https://postmarkapp.com/developer
- API overview/authentication: https://postmarkapp.com/developer/api/overview
- Email API: https://postmarkapp.com/developer/api/email-api
- Templates API: https://postmarkapp.com/developer/api/templates-api
- Messages API: https://postmarkapp.com/developer/api/messages-api
- Webhooks API: https://postmarkapp.com/developer/api/webhooks-api

## Capabilities
Twelve MCP tools cover server metadata; template list/get; outbound message list/details; bounce list/get; webhook list/get/statistics; single email send; and template email send. No delete, account administration, server creation, template mutation, arbitrary HTTP, or webhook mutation tool is exposed.

## Architecture and transport
MCP client -> stdio MCP server -> strict Zod schema -> permission/approval policy -> Postmark client -> official REST API. Provider responses are returned under `untrustedProviderData` and must never be treated as agent instructions. Credentials stay in the auth layer.

## Authentication and permissions
Set `POSTMARK_SERVER_TOKEN`. Postmark's server-level APIs authenticate with `X-Postmark-Server-Token`; this connector does not require the more privileged Account Token. Postmark server tokens are privileges rather than OAuth scopes, so no OAuth scope list applies. Restrict the token operationally to the intended Postmark server and rotate it in Postmark when needed.

## Environment
Copy `.env.example`. The API host is pinned to `https://api.postmarkapp.com` to prevent SSRF. Configure timeout/retry count and whether WRITE tools require approval. Tokens are never accepted as MCP tool parameters or emitted in responses/logs.

## Install and run
Requires Node.js 20+.

    npm install
    npm run build
    npm start

The server uses MCP stdio and can therefore be launched by MCP clients that support stdio child-process servers. Client-specific configuration is intentionally not claimed here.

## Tools and risk
READ: `postmark.server.get`, `postmark.template.list`, `postmark.template.get`, `postmark.message.outbound.list`, `postmark.message.outbound.get`, `postmark.bounce.list`, `postmark.bounce.get`, `postmark.webhook.list`, `postmark.webhook.get`, `postmark.webhook.statistics`.

WRITE: `postmark.email.send`, `postmark.email.send_template`. Both send external messages and require `approved:true` with default policy. Sends are never automatically retried because duplicate email is an undesirable side effect. DESTRUCTIVE operations are not exposed and policy code disables them.

## Reliability and rate limiting
Read calls have bounded exponential retries (maximum five configured attempts beyond the initial call) for 429 and transient 5xx/network failures. `Retry-After` is preserved when present. Authentication, validation, permission, and write-send failures are not blindly retried. Pagination inputs are bounded to 1..500 and non-negative offsets. Requests use abort-based timeouts.

Postmark documents endpoint-specific constraints, including up to 500 messages for batch email and a 500 maximum count on relevant message-open queries. This connector does not expose batch sending and bounds generic paginated reads to 500 to prevent runaway retrieval.

## Error handling
Provider failures become `PostmarkError` with HTTP status, provider ErrorCode, message, and optional retry delay internally. MCP responses return a bounded error string and never credentials. Invalid configuration, schemas, pagination, or approvals fail before a provider mutation.

## Security
HTTPS API origin is allowlisted exactly. No arbitrary URL tool exists. Third-party message/template content is untrusted data. Email addresses, IDs, pagination, and body sizes are validated. Raw secrets cannot enter tool inputs. Public email sends require human approval. No permission escalation, account-token operation, destructive tool, or automatic discovery of upstream MCP tools occurs.

## Tests
Run `npm test`. Unit tests require no live credentials and cover missing auth, registration, strict schemas, approval denial, pagination validation, provider error mapping, 429 retry for reads, and no blind retry for sends.

## Limitations
This connector intentionally omits account-level administration, template writes/deletes, webhook mutation/verification, batch sends, inbound processing, suppressions management, and destructive actions. It does not proxy Postmark's MCP server. Webhook receiving/signature policy is outside this outbound MCP process; only webhook metadata/statistics reads are exposed.
