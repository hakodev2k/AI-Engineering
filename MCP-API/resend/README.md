# Resend MCP/API Connector

Reusable MCP stdio server exposing a deliberately constrained Resend surface for agent workflows.

## Official transport research
Resend launched its official MCP server on 2026-04-07. It provides full platform tool groups and supports local `resend-mcp` plus Streamable HTTP. On 2026-07-07 Resend launched the hosted remote server at `https://mcp.resend.com/mcp` with OAuth; headless clients can instead use a Resend API key as a Bearer token. Resend states the remote server covers emails, templates, broadcasts, contacts, logs, webhooks and more. This package records that official MCP availability but uses the official REST API internally to keep a fixed, auditable allowlist, credential isolation, strict schemas, and connector-owned approval boundaries.

Official sources: https://resend.com/mcp ; https://resend.com/changelog/mcp ; https://resend.com/changelog/remote-mcp-server ; https://resend.com/docs/api-reference ; https://resend.com/changelog/api-rate-limit

## Capabilities
Twelve MCP tools: email list/get; domain list/get; contact list/get; segment list/get; webhook list/get; email send; contact create. This is intentional coverage, not a proxy for Resend's 85+ official MCP tools. Destructive, API-key management, broadcast send, domain mutation, webhook mutation, batch send, and arbitrary API requests are not exposed.

## Architecture
MCP client -> stdio server -> strict Zod schema -> approval policy -> Resend REST client -> `https://api.resend.com`. Returned provider content is wrapped as `untrustedProviderData`; it is data, never instructions.

## Authentication and scopes
Set `RESEND_API_KEY`. REST calls use `Authorization: Bearer`. The key never enters tool parameters. Resend API keys can be created with Full access or Sending access; the read/management tools require a key permitted for those API resources, while a least-privilege sending-only deployment should expose only send workflows operationally. The hosted official MCP can use OAuth, but this connector does not collect or persist OAuth tokens.

## Environment / installation
Copy `.env.example`. Node.js 20+ is required. Run `npm install`, `npm run build`, then `npm start`. The API origin is pinned to prevent SSRF. `RESEND_TIMEOUT_MS`, `RESEND_MAX_RETRIES`, and `RESEND_WRITE_APPROVAL` configure reliability/policy without exposing secrets.

## Tools and permissions
READ (automatic): `resend.email.list`, `resend.email.get`, `resend.domain.list`, `resend.domain.get`, `resend.contact.list`, `resend.contact.get`, `resend.segment.list`, `resend.segment.get`, `resend.webhook.list`, `resend.webhook.get`.

WRITE (approval required by default): `resend.email.send`, `resend.contact.create`. Email sends are external communications and always require `approved:true`. Destructive actions are disabled and not registered.

## Rate limits and reliability
Resend documents a default API limit of 10 requests/second and returns `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset`, and `retry-after`; exceeding the window yields HTTP 429. The client parses retry timing, uses bounded exponential backoff for retryable READ failures, limits configured retries to five, bounds list pages to 100, and uses abort-based timeouts. Mutating calls are not blindly retried, preventing duplicate sends/contacts. Authentication, validation, permission, and non-transient provider failures are not retried.

## Errors
Provider errors map to `ResendError` with status, provider code/name, message, and optional retry delay internally. MCP callers receive bounded error text. Invalid origin, pagination, schemas, or approval fail before provider mutation.

## Security
Credentials stay in the auth layer. No arbitrary URL/request tool exists. API origin is allowlisted. Provider content is untrusted. Inputs are strict and bounded. Writes require approval. Retrieved content cannot alter permissions. No API-key creation/deletion, account administration, destructive action, permission escalation, or automatic trust of newly discovered upstream MCP tools is permitted.

## Tests
`npm test` requires no live credentials. Tests cover auth configuration, tool registration, strict validation, permission denial, pagination, provider error mapping, 429 retry, and non-retry of writes.

## Limitations
This connector intentionally does not proxy the official Resend MCP server, implement OAuth, receive/verify webhooks, download inbound attachments, manage API keys, mutate domains/webhooks, or execute broadcasts. Those capabilities exist upstream but are excluded to keep this reusable agent-facing contract least-privileged and auditable.
