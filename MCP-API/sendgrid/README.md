# Twilio SendGrid MCP/API Connector

Reusable Node.js MCP server exposing scoped SendGrid Web API v3 operations. Twilio's hosted MCP at `mcp.twilio.com/docs` is an official documentation/OpenAPI search-and-retrieve server; it does not execute authenticated SendGrid account operations, so this connector uses the official SendGrid REST API for execution.

## Official sources

Research basis: Twilio SendGrid Web API v3 documentation, Authentication, API Key Permissions, Rate Limits, Mail Send, Contacts, Templates/Suppressions API references, and Twilio MCP documentation. API base is `https://api.sendgrid.com/v3` (EU regional accounts may configure `https://api.eu.sendgrid.com/v3`). Official SendGrid SDKs exist, but this connector uses REST directly to keep tool behavior explicit.

## Capabilities

Ten tools are implemented: `sendgrid.mail.send`, `sendgrid.template.list`, `sendgrid.template.get`, `sendgrid.contact.search`, `sendgrid.contact.upsert`, `sendgrid.contact.delete`, `sendgrid.list.list`, `sendgrid.list.get`, `sendgrid.suppression.get`, and `sendgrid.suppression.delete`.

## Architecture and security

MCP stdio -> strict Zod schemas -> policy gate -> REST client -> SendGrid. Credentials stay in the auth layer and are never tool inputs. Provider content is returned as untrusted data, never interpreted as instructions. The base URL is allow-listed to SendGrid HTTPS hosts, preventing arbitrary SSRF. The connector never exposes a raw HTTP tool. External email is HIGH_RISK; destructive contact deletion is disabled unless explicitly enabled. Removing an unsubscribe is HIGH_RISK because it changes recipient messaging eligibility.

## Authentication and least privilege

Set `SENDGRID_API_KEY` to a scoped SendGrid API key. Grant only permissions needed by the tools you enable, such as Mail Send for sending, Templates read for template tools, Marketing contacts/lists permissions for marketing tools, and suppression read/delete permissions for suppression tools. SendGrid API keys support endpoint-level scopes; avoid Full Access. Do not pass keys through prompts or tool arguments.

## Install and run

Requires Node.js 20+.

```sh
npm install
cp .env.example .env
# load variables using your secret manager or shell
npm start
```

The server uses MCP stdio and can be configured by MCP clients that support launching local stdio servers. Client-specific configuration is outside this package.

## Permission model

READ tools may execute automatically. WRITE tools require approval by default (`SENDGRID_WRITE_APPROVAL_REQUIRED=true`). HIGH_RISK always requires explicit `approved:true`. DESTRUCTIVE additionally requires `SENDGRID_ALLOW_DESTRUCTIVE=true`. Tool output never changes these controls.

## Reliability and rate limits

The REST client applies a configurable timeout, cancellation propagation, provider error mapping, and at most three attempts with exponential backoff for 429/5xx on safe/retry-enabled requests. Authentication, validation and permission failures are not retried. Mail send and destructive calls explicitly disable retries. SendGrid returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`; these are preserved. `Retry-After` is honored when present. Pagination inputs are bounded. Endpoint-specific limits vary; Email Activity, not implemented here, is documented at 6 requests/minute.

Mail Send supports at most 1,000 recipients and SendGrid imposes message-size limits; this connector bounds recipient count and body sizes before transport. Sender verification/domain authentication remains a provider-side prerequisite.

## Errors

Validation errors are raised before network calls. Provider non-2xx responses become `SendGridError` with status, parsed provider details, and retry-after metadata. Abort/timeout errors propagate without exposing credentials.

## Tests

Run `npm test`. Tests use fakes only and cover auth configuration, tool registration, validation, approval/permission denial, base-URL security, read execution, rate limiting, bounded retry, provider failure and non-retry of mail sends. No live credentials are required.

## Limitations

No account-administration, API-key management, billing, sender/domain mutation, webhook creation, marketing campaign send, or arbitrary API execution is exposed. OAuth refresh is not applicable because SendGrid Web API authentication here uses API keys. The official Twilio MCP server is documentation-only for this use case and therefore is not an execution transport.
