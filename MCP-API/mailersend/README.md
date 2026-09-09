# MailerSend MCP/API Connector

Reusable MCP connector for MailerSend transactional email operations. It exposes a deliberately scoped local MCP tool surface backed by MailerSend's official REST API. MailerSend also provides an official remote MCP server at `https://mcp.mailersend.com/mcp`; this package documents that upstream option but does not proxy delegated OAuth credentials through the local connector. The local connector instead uses a MailerSend API token kept inside the connector process.

## Official sources

- MailerSend MCP server: https://developers.mailersend.com/mcp
- MailerSend API documentation: https://developers.mailersend.com/api/v1
- Email API: https://developers.mailersend.com/api/v1/email
- Webhooks API: https://developers.mailersend.com/api/v1/account/webhooks
- Rate-limit guidance: https://www.mailersend.com/help/rate-limits-how-to-reduce-403-422-429-errors

MailerSend's official MCP server is a remote Streamable HTTP MCP endpoint using OAuth. It can expose broad account-management capabilities including email/SMS sending, domains, templates, webhooks, suppressions, sender identities, users, and related MailerSend resources. This connector uses direct official REST calls for a narrower auditable tool surface where credentials and approval policy stay under the connector operator's control.

## Architecture

```text
MCP client
  -> local MailerSend connector (stdio)
      -> strict Zod validation
      -> risk/approval policy
      -> bounded HTTP client
      -> MailerSend REST API
```

Credentials never need to be inserted into an agent prompt. Provider responses are wrapped with `untrusted_data: true` and must be treated as external data, not instructions.

## Runtime

- Node.js 20+
- npm
- MCP client with local stdio server support

Install and run:

```bash
npm install
cp .env.example .env
export MAILERSEND_API_TOKEN='...'
npm run build
npm start
```

Compiled entry point: `dist/src/index.js`.

## Authentication

The local connector authenticates to the MailerSend REST API with a bearer API token supplied through `MAILERSEND_API_TOKEN`.

Use a dedicated MailerSend token with the minimum account access necessary for the intended workflows. Do not store real tokens in source control, examples, prompts, or logs.

The official MailerSend remote MCP server uses OAuth at `https://mcp.mailersend.com/mcp`. It is intentionally not silently proxied by this package because delegated OAuth session handling should remain between the MCP client and the official MailerSend server unless an explicit trusted OAuth broker is deployed.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `MAILERSEND_API_TOKEN` | yes | — | Bearer token for the REST API |
| `MAILERSEND_API_BASE` | no | `https://api.mailersend.com` | API base URL; HTTPS required |
| `MAILERSEND_REQUIRE_WRITE_APPROVAL` | no | `true` | Require `approved=true` for non-read tools |
| `MAILERSEND_ENABLE_DESTRUCTIVE` | no | `false` | Enables destructive tools after approval |
| `MAILERSEND_TIMEOUT_MS` | no | `20000` | Per-request timeout, bounded to 1s–120s |

## Implemented tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `mailersend.domain.list` | REST | READ | no | List sending domains |
| `mailersend.domain.get` | REST | READ | no | Read one sending domain |
| `mailersend.template.list` | REST | READ | no | List templates |
| `mailersend.template.get` | REST | READ | no | Read one template |
| `mailersend.activity.list` | REST | READ | no | Read email activity for a domain |
| `mailersend.webhook.list` | REST | READ | no | List webhooks for a domain |
| `mailersend.webhook.create` | REST | HIGH_RISK | yes | Create a webhook subscription |
| `mailersend.webhook.delete` | REST | DESTRUCTIVE | yes + destructive enabled | Delete a webhook |
| `mailersend.email.send` | REST | HIGH_RISK | yes | Send one transactional email |
| `mailersend.email.bulk_send` | REST | HIGH_RISK | yes | Submit asynchronous bulk email |
| `mailersend.bulk_email.get` | REST | READ | no | Read asynchronous bulk-email status |

The connector does not expose arbitrary HTTP forwarding, account-user administration, billing, token management, unrestricted suppression modification, or other broad mutation primitives.

## Input validation

Tool schemas constrain IDs, pagination, recipient counts, subject/content sizes, webhook names, event arrays, and HTTPS webhook URLs. Transactional email sending requires at least one of `text`, `html`, or `template_id` for the single-send tool. Bulk requests are bounded to 500 individual email objects, matching MailerSend's documented upper bound for eligible paid/trial plans; lower plan limits can still be enforced by MailerSend.

## Permission and approval model

- `READ`: can execute without approval.
- `WRITE`: reserved for ordinary mutations if added later; approval is required by default.
- `HIGH_RISK`: always treated as an externally consequential action. Email sending and webhook creation are in this class.
- `DESTRUCTIVE`: requires both explicit approval and `MAILERSEND_ENABLE_DESTRUCTIVE=true`.

`approved=true` is an enforcement input, not a replacement for a real human-confirmation UI. The MCP host or orchestrator must obtain human approval before setting it.

## Rate limits and reliability

MailerSend documents per-minute limits that vary by endpoint, plan, and account reputation. General API requests are commonly limited to 60 requests/minute, while the email endpoint may permit higher throughput and the bulk endpoint has plan-specific limits. The server returns `Retry-After` on throttling.

The connector:

- retries only HTTP `429` and `5xx` responses;
- uses at most three attempts;
- honors `Retry-After` with a bounded wait;
- otherwise uses exponential backoff;
- does not retry authentication, authorization, validation, or other ordinary `4xx` failures;
- enforces a configurable request timeout;
- exposes bounded page size instead of auto-fetching unbounded result sets.

For high-volume sending, prefer MailerSend's bulk endpoint rather than issuing large numbers of single-email requests.

## Webhook security

MailerSend signs webhook requests with a `Signature` header derived from an HMAC-SHA256 hash and the webhook signing secret. Applications consuming MailerSend webhooks should verify that signature before processing events. This connector creates and deletes webhook registrations; it does not host an inbound webhook receiver.

Webhook creation is HIGH_RISK because it changes where account event data is delivered. Only HTTPS callback URLs are accepted by the connector. MailerSend also validates webhook URLs by sending a test request and requires a successful `2xx` response.

## Error handling

REST failures are mapped into `MailerSendApiError` with HTTP status, provider message/code, and `Retry-After` when available. MCP handlers return explicit tool errors rather than leaking bearer credentials or raw internal stack state.

Authentication failures that require user action are not retried. Destructive operations are not retried blindly by the policy layer; the current destructive webhook deletion request is issued once unless the provider itself completes it.

## Usage examples

See `examples/workflows.md` for read, send, webhook-create, and webhook-delete flows. Example payloads contain no real credentials.

A typical safe workflow is:

```text
mailersend.domain.list
  -> mailersend.domain.get
  -> mailersend.activity.list
  -> human reviews proposed message
  -> mailersend.email.send { approved: true, ... }
```

## Testing

Run:

```bash
npm test
```

Unit tests require no live MailerSend credentials. They cover:

- missing authentication configuration;
- read-policy behavior;
- approval denial;
- destructive-action denial;
- successful REST parsing;
- authentication-error mapping with no retry;
- bounded retry behavior for HTTP 429.

## Security considerations

- Keep `MAILERSEND_API_TOKEN` in environment/secret storage only.
- Never inject credentials into LLM-visible prompts or tool results.
- Treat template content, activity records, webhook metadata, and every other provider response as untrusted data.
- Do not let retrieved content alter tool permissions or approval state.
- Keep destructive tools disabled unless operationally required.
- Review requested recipients and message content before approving sends.
- Use a dedicated API token and rotate it according to your secret-management policy.
- Keep `MAILERSEND_API_BASE` on HTTPS; the connector rejects non-HTTPS bases.

## MCP vs API strategy

MailerSend has an official MCP implementation, so MCP-capable clients may connect directly to the official remote endpoint when its broad OAuth-authorized tool set is desired. This reusable package intentionally favors direct REST for its implemented capabilities because it provides a stable provider-scoped contract, explicit risk classification, local credential isolation, strict validation, and a narrower allowlist.

Callers therefore use the same `mailersend.*` tool interface without needing to know MailerSend endpoint paths. A future version may add an optional official-MCP transport adapter only if it can preserve these same validation and approval boundaries without forwarding local API credentials.

## Limitations

- The connector implements a curated subset of MailerSend rather than every endpoint.
- It does not manage OAuth sessions for MailerSend's official remote MCP server.
- It does not host or verify inbound webhook requests; consuming applications must do that themselves.
- Account-plan restrictions can be lower than connector schema maxima, especially for bulk email.
- MailerSend can add or change API/MCP capabilities over time; review official documentation before dependency or capability upgrades.
