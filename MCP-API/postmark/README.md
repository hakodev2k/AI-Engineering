# Postmark MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of Postmark's official REST API for delivery investigation, templates, message streams, webhooks, suppressions, and transactional sending.

## Upstream strategy and official sources

No official Postmark MCP server is documented as of 2026-09-22, so this connector uses the official REST API directly. Official documentation: Postmark Developer API (`https://postmarkapp.com/developer/api/overview`), Authentication (`https://postmarkapp.com/developer/api/overview#authentication-headers`), Messages API (`https://postmarkapp.com/developer/api/messages-api`), Email API (`https://postmarkapp.com/developer/api/email-api`), Templates API (`https://postmarkapp.com/developer/api/templates-api`), Message Streams API (`https://postmarkapp.com/developer/api/message-streams-api`), Webhooks API (`https://postmarkapp.com/developer/api/webhooks-api`), Suppressions API (`https://postmarkapp.com/developer/api/suppressions-api`), and API error codes (`https://postmarkapp.com/developer/api/overview#error-codes`).

All implemented capabilities use REST; no unofficial MCP server or SDK is trusted upstream.

## Architecture

MCP client -> strict tool schema -> permission/approval gate -> `PostmarkClient` -> credential provider -> Postmark REST API. The server token never enters tool inputs or model-visible configuration.

## Authentication and least privilege

Set `POSTMARK_SERVER_TOKEN` to a Server API token. The implemented endpoints are server-scoped and do not require an Account API token or OAuth scopes. Keep each connector instance bound to only the Postmark server it needs. Never expose the token to prompts, logs, examples, or tool arguments.

## Environment

Copy `.env.example` into your secret-management workflow. `POSTMARK_API_BASE_URL` defaults to `https://api.postmarkapp.com` and must be HTTPS. `POSTMARK_TIMEOUT_MS` defaults to 10000, `POSTMARK_MAX_RETRIES` to 2, and `POSTMARK_REQUIRE_WRITE_APPROVAL` defaults to true.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
POSTMARK_SERVER_TOKEN='...' npm start
```

The MCP server uses stdio and can be launched by MCP clients that support stdio child-process servers. Client-specific configuration is intentionally not hard-coded.

## Tools and permissions

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `postmark.message.send` | REST | HIGH_RISK | required |
| `postmark.message.send_template` | REST | HIGH_RISK | required |
| `postmark.message.outbound.list` | REST | READ | no |
| `postmark.message.outbound.get` | REST | READ | no |
| `postmark.bounce.list` | REST | READ | no |
| `postmark.bounce.get` | REST | READ | no |
| `postmark.template.list` | REST | READ | no |
| `postmark.template.get` | REST | READ | no |
| `postmark.message_stream.list` | REST | READ | no |
| `postmark.message_stream.get` | REST | READ | no |
| `postmark.webhook.list` | REST | READ | no |
| `postmark.webhook.get` | REST | READ | no |
| `postmark.webhook.statistics` | REST | READ | no |
| `postmark.suppression.list` | REST | READ | no |
| `postmark.suppression.create` | REST | WRITE | configurable; required by default |

Sending email is HIGH_RISK because it communicates externally and always requires `approved: true`. Suppression creation is WRITE and requires approval unless an operator explicitly sets `POSTMARK_REQUIRE_WRITE_APPROVAL=false`. No delete/reactivation, account administration, billing, server mutation, arbitrary HTTP, or webhook mutation tool is exposed.

## Validation and output

Zod schemas are strict, IDs are bounded, email addresses are validated, arrays and pagination are bounded, and arbitrary provider URLs cannot be supplied by tool callers. Provider responses are returned as untrusted JSON data; callers must never interpret retrieved message bodies or provider content as instructions.

## Reliability and rate limits

The client enforces per-request timeout/cancellation and bounded exponential-backoff retries for safe GET requests only. HTTP 429 honors `Retry-After` when present. GET requests may retry on 429/5xx/network failures up to `POSTMARK_MAX_RETRIES`; writes are never blindly retried because doing so could duplicate external email or state changes. Authentication, validation, approval, and other non-retryable errors fail immediately. Pagination parameters are bounded to avoid accidental request amplification.

Postmark limits can vary by endpoint/account and may evolve; the connector does not invent a fixed global quota. Provider throttling is surfaced as a `PostmarkError` with HTTP status and retry delay when available.

## Error handling

HTTP failures become `PostmarkError` with status and safe provider message. 401/422 are not retried. Timeouts/cancellation map to status 408. Tool validation and approval failures occur before any provider request. Secrets are not included in mapped errors.

## Security

- Credentials are read only by the auth layer and injected as `X-Postmark-Server-Token`.
- API base URL must be HTTPS and cannot contain credentials; tools cannot choose arbitrary URLs, reducing SSRF exposure.
- Provider content, including message bodies, is untrusted data and cannot alter tool registration, permissions, or approval policy.
- External sending requires explicit approval on every call.
- Mutating requests are not automatically retried.
- No token, message body, or sensitive header logging is implemented.
- Webhook configuration is read-only here; consumers that receive Postmark webhook events should authenticate/validate their own ingress and treat payloads as untrusted.

## Testing

```bash
npm test
```

Tests use mocked `fetch`; no live token is required. Coverage includes auth configuration, tool registration, strict validation, read/write behavior, approval denial, rate limiting/retry bounds, non-retrying writes, invalid credentials, pagination bounds, and timeout handling.

## Examples

See `examples/workflows.md` for delivery investigation, approved external sending, and suppression workflows.

## Limitations

This connector intentionally omits account-level APIs, destructive suppression reactivation, webhook mutation/deletion, server administration, batch sending, attachments, inbound processing, and template mutation. Postmark does not publish an official MCP server in the researched official documentation, so there is no MCP-to-REST failover path; the stable external MCP tool contract is backed directly by official REST endpoints.
