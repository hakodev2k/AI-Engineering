# Mailjet MCP/API Connector

Reusable MCP server exposing a deliberately bounded Mailjet surface for contact/list operations, delivery/message inspection, sender/template/campaign discovery, and approved transactional email sending.

## Upstream strategy

Mailjet has an official MCP implementation maintained in the `mailgun/mailjet-mcp-server` repository. It generates tools from Mailjet's OpenAPI schema and accepts dynamic credentials. This package does **not** mirror that broad generated endpoint surface. It uses Mailjet's official REST API directly so callers receive stable provider-scoped contracts, strict validation, explicit risk classification, and local approval enforcement. The official MCP implementation is documented as an available upstream option rather than being silently trusted or dynamically exposing newly discovered tools.

Official references used for this connector:
- Mailjet official MCP implementation: https://github.com/mailgun/mailjet-mcp-server
- Mailjet API reference: https://dev.mailjet.com/email/reference/overview/
- Mailjet Send API v3.1: https://dev.mailjet.com/email/guides/send-api-v31/
- Mailjet authentication: https://dev.mailjet.com/email/guides/#authentication
- Mailjet event tracking/webhooks: https://dev.mailjet.com/email/guides/webhooks/

## Architecture

MCP client -> `src/server.ts` -> strict tool schema -> `src/policy.ts` -> `src/client.ts` -> Mailjet HTTPS API. API credentials are read only inside connector configuration/client code and are never tool arguments or returned to the model. Provider responses are labeled as untrusted provider content.

## Authentication

Mailjet API calls use HTTP Basic authentication with the API key and secret key. Set `MAILJET_API_KEY` and `MAILJET_SECRET_KEY`. Keep keys in a secret manager or process environment. `.env.example` intentionally contains blank values. Use a dedicated key pair with only the access required by the Mailjet account/subaccount design; this connector cannot elevate Mailjet-side permissions.

## Environment

`MAILJET_API_KEY` and `MAILJET_SECRET_KEY` are required. `MAILJET_API_BASE` defaults to `https://api.mailjet.com` and must remain HTTPS. `MAILJET_TIMEOUT_MS` defaults to 15000. `MAILJET_MAX_RETRIES` defaults to 2. `MAILJET_REQUIRE_WRITE_APPROVAL` defaults to true. `MAILJET_ENABLE_DESTRUCTIVE` defaults to false; this version registers no destructive tools.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio transport, so it can be launched by MCP clients that support local stdio servers. Configure environment variables in the MCP host rather than passing credentials through prompts/tool calls.

## Tools and permissions

READ tools: `mailjet.contact.list`, `mailjet.contact.get`, `mailjet.contactlist.list`, `mailjet.contactlist.get`, `mailjet.message.list`, `mailjet.message.get`, `mailjet.sender.list`, `mailjet.template.list`, `mailjet.template.get`, `mailjet.campaign.list`, `mailjet.campaign.get`.

WRITE tools: `mailjet.contact.create`, `mailjet.contact.update`, `mailjet.contactlist.create`, `mailjet.contactlist.add_contact`. These require `approved:true` when the default write-approval policy is enabled.

HIGH_RISK tools: `mailjet.contactlist.remove_contact` and `mailjet.email.send`. These always require `approved:true`; sending email is an external communication and therefore never executes silently. Removing a contact from a list changes subscription state and is conservatively high risk.

No deletion endpoint is exposed. There is no generic raw-request tool.

## API routing

Contact, contact-list, message, sender, template, and campaign operations use Mailjet API v3 REST resources. Transactional sending uses Send API v3.1 `/v3.1/send`. Mutating requests are not blindly retried, preventing accidental duplicate sends/creates. Safe reads may use bounded exponential-backoff retries for throttling, transient server errors, timeouts, or network failures.

## Pagination and rate limits

List tools expose bounded `limit`/`offset` inputs and pass them as Mailjet `Limit`/`Offset`. The connector handles HTTP 429 and honors `Retry-After` when present. Mailjet limits can vary by service/account/API behavior, so this package intentionally does not claim a universal numeric quota. Callers should page deliberately and avoid large polling loops.

## Errors and reliability

Provider errors are converted to `MailjetError` with HTTP status and safe provider message. Authentication/authorization and validation errors are not retried. Read requests can retry at most `MAILJET_MAX_RETRIES` times. Retry delays are bounded. Requests use an abort timeout. POST/PUT operations pass `retryable:false` to prevent ambiguous duplicate mutations.

## Security

- Credentials never appear in MCP tool schemas.
- API base URL is configurable but restricted to HTTPS; callers cannot provide arbitrary per-call URLs, limiting SSRF exposure.
- Tool schemas validate IDs, emails, lengths, pagination, and message recipient counts.
- External email requires explicit approval.
- No permission-changing, billing, key-management, or delete tools are exposed.
- Retrieved Mailjet content is treated as untrusted data, not instructions.
- Do not log Authorization headers, secrets, or complete sensitive email bodies in production.
- Configure the MCP host to expose only this connector's declared tools; do not automatically import newly discovered upstream MCP tools.

## Webhooks

Mailjet supports event callbacks/webhooks, but this stdio connector does not run an inbound public HTTP listener and therefore does not register a webhook tool. Applications needing events should provision a hardened HTTPS receiver separately and validate/process event payloads according to Mailjet's official webhook guidance. This limitation is intentional rather than presenting an unsafe pseudo-webhook capability.

## Testing

`npm test` uses mocks only and needs no live Mailjet credentials. Tests cover required auth configuration, HTTPS restriction, tool registration, validation, approval denial, provider error mapping, credential isolation from URLs, and non-retry behavior for mutations.

## Examples

See `examples/workflows.md` for read, write, subscription, and approved-send workflows with expected output shapes and permission requirements.

## Limitations

This is a curated connector, not a complete Mailjet API mirror. It does not expose account administration, billing, API-key management, sender creation/validation, destructive deletion, campaign sending, template editing, or webhook administration. It also does not proxy the official Mailjet MCP server at runtime; REST was chosen for the implemented capabilities to keep a stable, auditable contract and avoid dynamic broad tool exposure.
