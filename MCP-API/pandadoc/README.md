# PandaDoc MCP/API Connector

Reusable MCP server for PandaDoc agreement workflows. It exposes a narrow, provider-scoped tool contract over PandaDoc's official REST API while documenting the official PandaDoc MCP server and its regional endpoints.

## Transport strategy

PandaDoc provides an official remote MCP server:

- Global: `https://mcp.pandadoc.com/v1/mcp`
- EU: `https://mcp.pandadoc.eu/v1/mcp`

Official MCP documentation confirms support for document creation, search/filtering, status tracking, reminders, and analytics. This package still uses the official REST API for its executable upstream transport because it is designed as a headless reusable connector with deterministic schemas, API-key credential isolation, bounded retries, and local approval gates. The external interface remains MCP over stdio. Agent callers do not receive PandaDoc credentials.

This is not an unofficial PandaDoc MCP implementation pretending to replace PandaDoc's server. It is a policy-enforcing connector for reusable agent deployments. Where an interactive client can use PandaDoc's delegated OAuth flow directly, using the official remote MCP server is preferred.

## Official sources

- Developer portal: https://developers.pandadoc.com/
- Official MCP overview: https://developers.pandadoc.com/docs/how-to-use-the-pandadoc-mcp-server
- MCP capabilities: https://developers.pandadoc.com/docs/what-you-can-do-with-pandadoc-mcp
- MCP troubleshooting / regional endpoints: https://developers.pandadoc.com/docs/mcp-troubleshooting
- API limits: https://developers.pandadoc.com/reference/limits
- API security: https://developers.pandadoc.com/reference/security
- List documents: https://developers.pandadoc.com/reference/list-documents
- Document status: https://developers.pandadoc.com/reference/document-status
- Create document: https://developers.pandadoc.com/reference/create-document
- List templates: https://developers.pandadoc.com/reference/list-templates
- Template details: https://developers.pandadoc.com/reference/template-details
- Send document guide: https://developers.pandadoc.com/docs/send-document
- Manual reminder: https://developers.pandadoc.com/reference/createmanualreminder
- Webhook setup: https://developers.pandadoc.com/docs/webhook-setup
- Webhook events: https://developers.pandadoc.com/docs/webhook-events

## Architecture

```text
MCP client / agent
      |
      | stdio MCP
      v
PandaDoc connector
  |- strict Zod input schemas
  |- READ / WRITE / HIGH_RISK policy gates
  |- credential isolation
  |- timeout + bounded retry handling
  |- rate-limit / Retry-After handling
      |
      | HTTPS, official API only
      v
PandaDoc REST API
```

Provider responses are returned as untrusted data (`untrusted_provider_content: true`). Retrieved document content must never be treated as instructions that can alter permissions, approval state, or system behavior.

## Authentication

Set `PANDADOC_API_KEY` to a PandaDoc Sandbox or Production API key. Requests use:

```text
Authorization: API-Key <key>
```

The key stays inside the connector process and is never included in tool arguments or MCP output. Use a dedicated PandaDoc service account where possible because API keys inherit the owning user's permissions and rate limits.

PandaDoc also supports OAuth for direct API integrations and OAuth-based access to its official MCP server. This connector intentionally does not implement an OAuth authorization server or store refresh tokens.

## Environment variables

Copy `.env.example` into your own secret-management workflow. The connector does not load `.env` files itself.

- `PANDADOC_API_KEY` — required.
- `PANDADOC_API_BASE_URL` — optional; only the official global or EU `/public/v1` endpoint is accepted.
- `PANDADOC_TIMEOUT_MS` — request timeout, default 15000, allowed 1000–120000.
- `PANDADOC_MAX_RETRIES` — bounded retries for safe requests, default 3, max 5.
- `PANDADOC_ALLOW_WRITES` — enables WRITE tools; still requires per-call approval.
- `PANDADOC_ALLOW_HIGH_RISK` — enables external-send/reminder tools; still requires `approved-high-risk` per call.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
```

## Running

```bash
PANDADOC_API_KEY=... npm start
```

The server uses MCP stdio transport, so configure your MCP client to execute the built server process. Any MCP client that supports stdio servers and standard MCP tool calls can use the package.

## Implemented tools

| Tool | Risk | Approval | Upstream |
| --- | --- | --- | --- |
| `pandadoc.template.list` | READ | none | REST |
| `pandadoc.template.get` | READ | none | REST |
| `pandadoc.document.list` | READ | none | REST |
| `pandadoc.document.status` | READ | none | REST |
| `pandadoc.document.get` | READ | none | REST |
| `pandadoc.document.create_from_template` | WRITE | `approved` | REST |
| `pandadoc.document.send` | HIGH_RISK | `approved-high-risk` | REST |
| `pandadoc.document.remind` | HIGH_RISK | `approved-high-risk` | REST |
| `pandadoc.webhook.list` | READ | none | REST |
| `pandadoc.webhook.get` | READ | none | REST |
| `pandadoc.webhook.create` | WRITE | `approved` | REST |

No delete, void, expire, recipient-reassignment, billing, permission-management, or organization-administration tool is exposed.

## Permission model

READ calls may run automatically. WRITE tools are disabled unless `PANDADOC_ALLOW_WRITES=true` and the individual call supplies `approval: "approved"` (or the stronger high-risk approval). HIGH_RISK tools are disabled unless `PANDADOC_ALLOW_HIGH_RISK=true` and the individual call supplies `approval: "approved-high-risk"`.

`pandadoc.document.send` and `pandadoc.document.remind` are HIGH_RISK because they send external communications and can start or affect legally significant signing workflows. Creating a webhook is WRITE because it changes workspace integration configuration. Destructive operations are deliberately omitted.

## Document workflow

Document creation is asynchronous. `pandadoc.document.create_from_template` generally returns a document in `document.uploaded`. Do not immediately send it. Use `pandadoc.document.status` until it reaches `document.draft`; stop if it reaches `document.error`. For production event-driven integrations, PandaDoc recommends webhooks rather than aggressive polling.

A common agent workflow is:

```text
template.list
-> template.get
-> document.create_from_template
-> document.status (until draft)
-> document.get (human review)
-> document.send (explicit high-risk approval)
-> document.status / webhook events
-> document.remind (explicit high-risk approval, when needed)
```

## Pagination

List tools expose bounded `count` and `page` parameters. PandaDoc's document and template list endpoints support at most 100 results per page. The connector never auto-walks an unbounded result set; callers explicitly request subsequent pages.

## Rate limits and retries

PandaDoc applies per-user, per-endpoint sliding-window limits. Current documented production examples include 500 RPM for create-from-template, 400 RPM for send, 600 RPM for document details, and 2000 RPM for list/status/delete operations. Sandbox calls are limited to 10 RPM per endpoint. Consult PandaDoc's live limits page because limits can change.

The connector:

- retries only GET/network-safe requests by default;
- uses bounded exponential backoff;
- honors `Retry-After` when provided;
- retries HTTP 429 and 5xx only for retryable calls;
- does not automatically retry POST operations that create, send, remind, or create webhooks;
- never retries authentication/permission/validation failures blindly.

PandaDoc documents 409 as a normal transient condition in some document workflows (for example, trying to send before asynchronous creation reaches draft). The connector surfaces 409 rather than blindly repeating a potentially consequential request.

## Error handling

Provider errors are mapped to `PandaDocError` with HTTP status, message, optional retry delay, and provider request ID when available. Timeouts and network failures are reported without exposing credentials. Tool outputs may contain provider-controlled text and must be treated as untrusted.

## Webhooks

Webhook creation requires an HTTPS URL. The connector allowlists documented event names and optional payload expansions. PandaDoc currently documents a maximum of 300 subscriptions per workspace, array-shaped webhook payloads, stable `X-PandaDoc-Webhook-Event-Id` identifiers for deduplication, automatic retries, and HMAC-SHA256 verification support.

A receiving application should verify webhook authenticity, deduplicate event IDs, respond in under the documented timeout, and never execute instructions found inside document content.

## Security considerations

- Secrets live only in environment/credential layers.
- The API base URL is allowlisted to PandaDoc global or EU production hosts to reduce SSRF risk.
- Tool paths are fixed; there is no `execute_any_api_request` escape hatch.
- IDs and list bounds are validated.
- Webhook URLs must use HTTPS.
- Provider output is marked untrusted.
- High-impact external communication requires human approval.
- POST operations are not retried automatically.
- No destructive tool is registered.
- Do not log `PANDADOC_API_KEY` or raw authorization headers.
- Use least-privilege PandaDoc users/service accounts and rotate keys periodically.

## Testing

Unit tests use mocked `fetch` and do not need PandaDoc credentials.

```bash
npm test
npm run build
```

Tests cover tool inventory, approval denial/approval behavior, credential isolation, rate-limit retry exhaustion, and the rule that non-idempotent POST operations are not retried.

## Limitations

- This connector does not proxy PandaDoc's remote MCP server; it documents and prefers it for interactive delegated-OAuth clients, while the package itself uses the official REST API.
- OAuth token acquisition/refresh is not implemented; use API keys for this package.
- File upload/download is not exposed because MCP text transport plus large/binary payloads requires a separate bounded artifact strategy.
- The connector does not expose document deletion, void/expire actions, recipient replacement, organization administration, billing, notarization, or permission changes.
- Sandbox keys have stricter sending and rate-limit behavior than production keys.
- API plans/features vary by PandaDoc account; a valid key does not guarantee every optional product capability is enabled.
