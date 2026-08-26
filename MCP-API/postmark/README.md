# Postmark MCP/API Connector

Reusable MCP connector for Postmark transactional email workflows. The connector exposes a deliberately scoped set of provider-qualified tools while delegating supported operations to ActiveCampaign/Postmark's official MCP server (`@activecampaign/postmark-mcp`). It adds a local security boundary for approval, recipient restrictions, webhook URL restrictions, validation, retries, and timeouts.

## Upstream transport

Primary transport: **official Postmark MCP server over stdio**.

Official sources researched for this connector:

- Postmark MCP server: https://github.com/ActiveCampaign/postmark-mcp
- Postmark MCP product page: https://postmarkapp.com/lp/mcp
- Postmark developer docs: https://postmarkapp.com/developer
- API overview/authentication: https://postmarkapp.com/developer/api/overview
- Email API: https://postmarkapp.com/developer/api/email-api
- Templates API: https://postmarkapp.com/developer/api/templates-api
- Messages API: https://postmarkapp.com/developer/api/messages-api
- Webhooks API: https://postmarkapp.com/developer/api/webhooks-api

The official MCP server currently exposes 24 tools. This connector intentionally allowlists only the subset needed for common agent workflows rather than forwarding arbitrary upstream tool calls.

## Architecture

```text
MCP client / agent
        |
        v
Postmark connector MCP server
  - strict input schemas
  - risk classification
  - exact-argument approval checks
  - recipient-domain allowlist
  - webhook URL allowlist
  - bounded read-only retry policy
        |
        v
Official @activecampaign/postmark-mcp
        |
        v
Postmark API
```

The Postmark server token exists only in the connector process and the official upstream MCP child-process environment. It is never returned as tool output or passed as a tool argument.

## Authentication and permissions

Postmark's official MCP server uses a **Postmark Server Token** (`POSTMARK_SERVER_TOKEN`). Postmark distinguishes Server Tokens from Account Tokens. This connector does not request or use an Account Token and therefore does not expose account-level server-management operations.

Postmark Server Tokens do not provide granular OAuth-style scopes. A server token can perform the server-level operations available to that Postmark server. For least privilege, create a dedicated Postmark server for agent/MCP traffic and configure only the verified senders and message streams that are required.

Required environment variables:

- `POSTMARK_SERVER_TOKEN` — Postmark server API token.
- `POSTMARK_DEFAULT_SENDER_EMAIL` — verified sender used by the official MCP server when `from` is omitted.
- `POSTMARK_APPROVAL_SECRET` — at least 16 characters; used only by this connector to validate human approvals.

Optional environment variables:

- `POSTMARK_DEFAULT_MESSAGE_STREAM` — defaults to `outbound`.
- `POSTMARK_WEBHOOK_URL_ALLOWLIST` — comma-separated HTTPS URL prefixes allowed for webhook creation.
- `POSTMARK_RECIPIENT_DOMAIN_ALLOWLIST` — comma-separated recipient domains permitted for send tools.
- `POSTMARK_UPSTREAM_TIMEOUT_MS` — 1,000–120,000 ms; defaults to 30,000 ms.

See `.env.example`. Never commit real tokens or approval secrets.

## Installation

Requirements:

- Node.js 20+
- npm/npx
- A Postmark account and Postmark Server Token
- A verified Postmark sender address

```bash
npm install
npm run build
npm start
```

At runtime the connector launches the official upstream MCP package with:

```text
npx -y @activecampaign/postmark-mcp
```

The upstream package receives `POSTMARK_SERVER_TOKEN`, `DEFAULT_SENDER_EMAIL`, `DEFAULT_MESSAGE_STREAM`, and the webhook allowlist through its child-process environment.

## MCP client configuration

After building this connector, configure an MCP client to launch `dist/src/server.js` over stdio. Example shape:

```json
{
  "mcpServers": {
    "postmark-connector": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/postmark/dist/src/server.js"],
      "env": {
        "POSTMARK_SERVER_TOKEN": "set-securely-outside-version-control",
        "POSTMARK_DEFAULT_SENDER_EMAIL": "sender@example.com",
        "POSTMARK_DEFAULT_MESSAGE_STREAM": "outbound",
        "POSTMARK_APPROVAL_SECRET": "set-securely-outside-version-control"
      }
    }
  }
}
```

This is standard stdio MCP and can be used by MCP clients that support launching local stdio servers. Compatibility depends on the client's MCP implementation and configuration model.

## Implemented tools

| Tool | Upstream MCP tool | Risk | Approval |
|---|---|---|---|
| `postmark.server.get` | `getServerInfo` | READ | No |
| `postmark.email.search` | `searchOutboundMessages` | READ | No |
| `postmark.email.get` | `getMessageDetails` | READ | No |
| `postmark.delivery.diagnose` | `diagnoseDelivery` | READ | No |
| `postmark.bounce.search` | `searchBounces` | READ | No |
| `postmark.stats.get` | `getDeliveryStats` | READ | No |
| `postmark.template.list` | `listTemplates` | READ | No |
| `postmark.template.get` | `getTemplate` | READ | No |
| `postmark.email.send` | `sendEmail` | HIGH_RISK | Yes |
| `postmark.template.send` | `sendEmailWithTemplate` | HIGH_RISK | Yes |
| `postmark.webhook.list` | `listWebhooks` | READ | No |
| `postmark.webhook.create` | `createWebhook` | HIGH_RISK | Yes |
| `postmark.webhook.delete` | `deleteWebhook` | DESTRUCTIVE | Yes |

No arbitrary `call_any_postmark_tool` or raw HTTP endpoint tool is exposed.

## Approval model

Read-only operations may execute without approval. Sending external email, registering a persistent webhook, and deleting a webhook require a human approval token.

Approval is an HMAC-SHA256 digest over:

1. the exact external MCP tool name, and
2. a canonical representation of the exact arguments, excluding the `approval` field.

This prevents an approval created for one recipient, subject, webhook URL, or webhook ID from being silently reused for different arguments.

Generate an approval token with:

```bash
POSTMARK_APPROVAL_SECRET='your-secret' \
node examples/create-approval.mjs \
  postmark.email.send \
  '{"to":"user@example.com","subject":"Hello","textBody":"Body"}'
```

Then add the returned digest to the same argument object as `approval`.

## Safety controls

### External email

`postmark.email.send` and `postmark.template.send` are classified `HIGH_RISK` because they send messages to external recipients. Both require exact-argument approval and are never retried automatically.

If `POSTMARK_RECIPIENT_DOMAIN_ALLOWLIST` is set, every `to` recipient must belong to one of the configured domains.

The connector caps direct send recipients at 50, matching Postmark's documented per-message recipient limit. It does not expose the upstream batch-send tools, reducing accidental blast radius.

### Webhooks and SSRF/data exfiltration

Webhook creation requires:

- HTTPS URL
- at least one enabled trigger
- explicit approval
- optional match against `POSTMARK_WEBHOOK_URL_ALLOWLIST`

The official Postmark MCP server also supports a webhook allowlist. The connector forwards its configured allowlist upstream for defense in depth.

Postmark's webhook documentation notes that webhook endpoints should be protected appropriately. Webhook content must be treated as untrusted external data.

### Prompt injection

Email bodies, templates, message history, webhook payload-derived data, and provider responses are untrusted data. They must never be interpreted as instructions that can raise permissions, change approval policy, reveal credentials, or bypass tool schemas.

### Credentials

- credentials are read from environment variables only
- credentials are never accepted as MCP tool parameters
- credentials are not included in tool responses
- no Account Token is required
- do not place `.env` files containing secrets in version control

## Reliability

The connector applies an upstream timeout to every call. Read-only operations may retry transient failures up to 3 total attempts with exponential backoff. The transient classifier covers rate-limit, timeout, temporary service, DNS retry, and connection-reset failures.

Mutating operations are attempted **once only**. External sends, webhook creation, and webhook deletion are never blindly retried because doing so could duplicate or repeat side effects.

Postmark returns HTTP `429` when API use exceeds acceptable limits. Postmark's public API overview does not document one universal fixed request-per-second quota for all API methods, so this connector does not invent a numeric limit. It relies on the official MCP implementation and bounded backoff for read-only calls.

## Pagination and bounds

`postmark.email.search` and `postmark.bounce.search` expose bounded pagination controls:

- `count`: 1–500, default 50
- `offset`: non-negative integer

`listTemplates` follows the official MCP implementation, which currently returns the first 100 templates and reports truncation when applicable.

## Error handling

Configuration is validated at startup. Invalid tool arguments are rejected by MCP/Zod schemas before provider execution. Approval failures and allowlist failures stop before the upstream MCP tool is invoked.

Provider/MCP errors are propagated to the MCP caller without exposing the connector's server token. Authentication failures require operator action and are not retried as writes.

## Testing

Unit tests use a fake upstream and require no live Postmark credentials.

```bash
npm test
```

Coverage includes:

- authentication/configuration validation
- schema bounds
- risk classification
- approval binding to exact arguments
- approval denial before execution
- recipient-domain restrictions
- webhook HTTPS/allowlist checks
- stripping approval data before upstream forwarding
- bounded retry for transient read operations
- no blind retry for high-risk writes

## Usage examples

See `examples/workflows.md` for read, send, webhook-create, and destructive webhook-delete workflows. See `examples/create-approval.mjs` for generating approval tokens outside the agent/tool call path.

## Rate limits and provider limits

Postmark's public API documentation currently documents `429 Rate Limit Exceeded` and requires clients to reduce request rate when it occurs. Sending constraints documented by Postmark include a 10 MB maximum for a single email and a maximum of 50 recipients across To/CC/BCC. This connector additionally constrains the `to` field to at most 50 recipients; Postmark remains authoritative for aggregate recipient and payload enforcement.

## Limitations

- This connector exposes 13 of the official Postmark MCP server's 24 tools by design.
- It does not expose batch sends, template mutation, suppression mutation, bounce activation, or arbitrary provider requests.
- It does not use account-level Postmark APIs or Account Tokens.
- It does not implement a webhook receiver; it manages Postmark webhook registrations only.
- It does not inspect or rewrite email content for business-policy compliance.
- The official upstream MCP package is resolved through `npx`; production deployments should pin/package dependencies according to their software supply-chain policy.

## Transport decision

Postmark maintains an official MCP server with native coverage for email sending, templates, message search, diagnostics, bounces, suppressions, stats, server information, and webhooks. Because every capability implemented here is supported by the official MCP server, this connector uses MCP for all implemented operations and does not add a redundant REST fallback. If a future required capability is absent from the official MCP server, add a narrowly scoped official Postmark REST/SDK fallback behind the same external tool contract rather than exposing raw HTTP.
