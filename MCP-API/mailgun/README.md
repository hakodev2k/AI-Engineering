# Mailgun MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of Mailgun's official Email API for agent workflows.

## Transport strategy

No official Mailgun MCP server was identified in Mailgun's current official documentation during implementation. This connector therefore uses the official Mailgun REST API directly and exposes stable MCP tools to clients. The upstream API uses HTTP Basic Auth with username `api` and a Mailgun API key. US and EU regions are supported through `MAILGUN_REGION`.

Official references used: Mailgun API Overview, Authentication, Domains API, Events API, Domain Templates API, Domain Webhooks API, Sending Messages documentation, official Node SDK reference, and Mailgun rate-limit documentation at https://documentation.mailgun.com/.

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `mailgun.domain.list` | REST | READ | No |
| `mailgun.domain.get` | REST | READ | No |
| `mailgun.domain.verify` | REST | WRITE | Policy-controlled |
| `mailgun.event.list` | REST | READ | No |
| `mailgun.message.send` | REST | HIGH_RISK | Explicit human approval |
| `mailgun.template.list` | REST | READ | No |
| `mailgun.template.get` | REST | READ | No |
| `mailgun.webhook.list` | REST | READ | No |
| `mailgun.webhook.get` | REST | READ | No |
| `mailgun.webhook.set` | REST | HIGH_RISK | Explicit human approval |
| `mailgun.webhook.delete` | REST | DESTRUCTIVE | Explicit approval and disabled by default |

The connector intentionally does not expose arbitrary API requests, account keys, SMTP credentials, billing, subaccount administration, IP allowlist mutation, or bulk suppression deletion.

## Architecture

`server.ts` registers MCP tools. `tools.ts` owns strict input schemas and provider-specific operations. `policy.ts` enforces risk gates before provider calls. `client.ts` isolates credentials, region selection, timeouts, error mapping, and bounded retries. Provider responses are returned as untrusted external data and are never interpreted as instructions.

## Authentication and least privilege

Set `MAILGUN_API_KEY` in the connector process environment. Mailgun authenticates API requests using Basic Auth (`api:<key>`). A Domain Sending Key is the narrowest credential for send-only workflows, but it cannot satisfy read/domain/event/webhook tools. For the full connector use an account API key and restrict tool policy at the connector boundary. Never place credentials in prompts or tool arguments.

Mailgun uses `https://api.mailgun.net` for US domains and `https://api.eu.mailgun.net` for EU domains. Set `MAILGUN_REGION=eu` for EU infrastructure.

## Environment

Copy `.env.example` and configure the connector runtime securely. `MAILGUN_ALLOW_WRITE`, `MAILGUN_ALLOW_HIGH_RISK`, and `MAILGUN_ALLOW_DESTRUCTIVE` default to false. `MAILGUN_DEFAULT_DOMAIN` is optional; explicit domain parameters override it.

## Install and run

```bash
npm install
npm run build
MAILGUN_API_KEY=... node dist/src/server.js
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers, including custom agents and compatible desktop/developer clients. Compatibility depends on the client's support for the MCP stdio protocol; no client-specific behavior is assumed.

## Real-world workflows

Read-only delivery triage: `mailgun.domain.list` → `mailgun.event.list` → inspect delivery failures. Template inspection: `mailgun.template.list` → `mailgun.template.get`. Operational sending: inspect domain/template state first, prepare a message, obtain human approval, then call `mailgun.message.send`. Webhook management: `mailgun.webhook.list` → `mailgun.webhook.get` → obtain approval → `mailgun.webhook.set`.

## Validation and safety

Domains and email addresses are validated. Event pages are capped at Mailgun's documented maximum of 300. Domain pages are capped at 1000. Recipient arrays are bounded. Message bodies and subjects have size limits at the connector layer. Webhook URLs must use HTTPS and are limited to three URLs per event type, matching Mailgun's documented webhook behavior. Retrieved Mailgun content is treated as untrusted data.

Sending email is classified HIGH_RISK because it communicates externally. Webhook changes are HIGH_RISK because they redirect operational event data. Webhook deletion is DESTRUCTIVE and remains disabled unless `MAILGUN_ALLOW_DESTRUCTIVE=true` and the call includes `approved:true`.

## Reliability and rate limits

Requests have configurable timeouts. Retries are bounded and apply only to safe GET/HEAD requests for 429 or 5xx responses, with `Retry-After` honored when provided and exponential backoff otherwise. Mutating operations are never blindly retried. Authentication, permission, and validation failures are not retried. Mailgun documents API rate limiting at 500 requests per 10 seconds for relevant APIs; callers should avoid polling when webhooks are available.

Events API pagination information is passed through from Mailgun. This connector does not automatically follow provider-supplied paging URLs, avoiding unbounded retrieval and reducing SSRF risk.

## Webhooks

Mailgun supports domain and account webhooks. This connector implements scoped domain webhook reads/updates/deletes only. Mailgun's documentation states that HTTPS webhook endpoints require trusted CA-signed certificates. Webhook payload verification and receiver hosting are outside this MCP server; applications receiving Mailgun webhooks should validate Mailgun signatures before processing events.

## Error handling

Provider HTTP errors are mapped to `MailgunError` with status and optional `Retry-After`. Timeouts produce a deterministic timeout error. MCP tool failures return `isError: true` and do not leak the API key.

## Testing

```bash
npm test
```

Unit tests use mocks and require no live credentials. They cover tool registration, read execution, explicit send approval, destructive-policy denial, and HTTPS webhook validation.

## Limitations

Attachments/MIME uploads, template mutation, suppression mutation, mailing-list administration, account webhooks, Metrics API, stored-message retrieval, inbound routes, validation API, subaccounts, IP management, and credential/key management are intentionally not implemented. The connector does not claim an upstream MCP transport because current official Mailgun documentation used for this implementation documents REST/SDK integrations rather than an official MCP server.
