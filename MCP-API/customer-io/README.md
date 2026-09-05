# Customer.io MCP/API Connector

Reusable local MCP server for Customer.io agent workflows. It exposes a deliberately bounded set of profile, segment, automation, newsletter, transactional-email, and reporting-webhook tools through Customer.io's documented App API.

## Transport strategy

Customer.io has an official remote MCP server (verified 2026-09-06) at `https://mcp.customer.io/mcp` for US accounts and `https://mcp-eu.customer.io/mcp` for EU accounts. It uses HTTP transport (not SSE), Customer.io OAuth, workspace selection, and user-scoped permissions. The official MCP is the preferred upstream for interactive clients that can complete its OAuth flow and need broad Customer.io authoring capabilities.

This package uses the official App API for the implemented tool contract because the App API exposes stable, documented endpoint schemas and App API-key authentication suitable for reusable server-side integrations. Customer.io's public MCP documentation describes broad capabilities and scopes but does not publish a stable upstream MCP tool-name contract that this package could safely hard-code. The connector therefore does not guess or dynamically trust discovered upstream tools.

Official sources:
- https://docs.customer.io/ai/mcp/get-started/
- https://docs.customer.io/ai/mcp/chatgpt/
- https://docs.customer.io/accounts/security/ai-settings/
- https://docs.customer.io/integrations/api/app/
- https://docs.customer.io/integrations/api/app/tag/send-messages/sendemail/
- https://docs.customer.io/integrations/api/webhooks/

## Authentication and permissions

The App API uses a bearer App API Key. Create a scoped key in Customer.io account settings and keep it in `CUSTOMERIO_APP_API_KEY`. App API keys are normally workspace-specific; trusted service-account flows can additionally require `X-Workspace-Id`, supported through `CUSTOMERIO_WORKSPACE_ID`.

The local MCP process reads credentials from its environment. Credentials never appear in MCP tool schemas, tool arguments, or normal outputs.

Customer.io's official MCP has these documented scopes: `read` (default), `read:sensitive`, `write`, `write:live`, and `configure`. `write:live` and sensitive access also depend on account-level MCP security settings and the user's own role. These MCP scopes are documented for the upstream service; they are not interchangeable with App API-key permissions.

## Environment

Copy `.env.example` and set the key. `CUSTOMERIO_REGION` must be `us` or `eu`; the base URL is selected internally to prevent arbitrary-host SSRF.

`CUSTOMERIO_APPROVED_ACTIONS` is a semicolon-separated allowlist of exact action fingerprints. Approval is intentionally out-of-band; an agent cannot pass `approved=true` in a tool call and elevate itself.

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `customerio.profile.search` | App API | READ | No |
| `customerio.profile.attributes.get` | App API | READ | No |
| `customerio.profile.segments.list` | App API | READ | No |
| `customerio.profile.messages.list` | App API | READ | No |
| `customerio.segment.list` | App API | READ | No |
| `customerio.segment.get` | App API | READ | No |
| `customerio.segment.members.list` | App API | READ | No |
| `customerio.segment.create_manual` | App API | WRITE | Configurable; default yes |
| `customerio.automation.list` | App API | READ | No |
| `customerio.automation.get` | App API | READ | No |
| `customerio.automation.actions.list` | App API | READ | No |
| `customerio.newsletter.list` | App API | READ | No |
| `customerio.transactional.email.send` | App API | HIGH_RISK | Always |
| `customerio.reporting_webhook.list` | App API | READ | No |
| `customerio.reporting_webhook.create` | App API | HIGH_RISK | Always |
| `customerio.reporting_webhook.delete` | App API | DESTRUCTIVE | Always + disabled by default |

The connector intentionally does not expose a raw HTTP request tool, profile deletion, live automation edits, suppression changes, broadcast triggering, marketing-newsletter sends, or arbitrary content publication.

## Architecture

`server.ts` registers MCP tools and maps them to fixed provider operations. `tools.ts` owns strict schemas and risk labels. `policy.ts` enforces connector-side approval fingerprints. `client.ts` isolates the bearer credential, applies timeouts, maps response errors, and performs bounded retries for read-only operations. `config.ts` selects only official US/EU API hosts.

Provider content is untrusted data. Retrieved profile attributes, message history, segment names, and webhook metadata must never be treated as instructions that can change connector permissions.

## Rate limits and reliability

Customer.io documents a 10 requests/second limit for most App API endpoints. Transactional message endpoints share the higher soft ingress limit documented as 3000 requests per 3 seconds; API-triggered broadcasts are limited to 1 request every 10 seconds. This connector does not implement broadcasts.

GET requests retry only network failures, HTTP 429, and 5xx responses, with bounded exponential backoff and `Retry-After` support. Mutating requests are never blindly retried. Every request has an abort timeout. Pagination is explicit and bounded rather than auto-draining large datasets.

## Webhook safety

Reporting webhook creation is HIGH_RISK because events can contain customer/message data and send it to an external endpoint. The connector only accepts HTTPS endpoint URLs and requires explicit approval. Customer.io signs reporting webhooks using `X-CIO-Signature` with HMAC-SHA256 and includes `X-CIO-Timestamp`; receivers should verify signatures and reject stale timestamps. Customer.io documents retry/backlog behavior for failed deliveries.

## Transactional-email safety

Transactional sends are external communications and always require human approval. The tool accepts one recipient and does not expose attachments or arbitrary sender/body overrides. It is designed to use an existing Customer.io transactional message/template and supports `queueDraft` for workflows that should prepare rather than immediately deliver.

## Install, run, test

```bash
npm install
npm run build
npm test
npm start
```

Requires Node.js 20+. The server uses MCP stdio, so it is compatible with MCP clients that can launch local stdio servers. For clients that support remote OAuth MCP directly, prefer Customer.io's official remote MCP server when you need its broader feature set.

## Limitations

This connector does not proxy the official remote MCP server because Customer.io does not document a stable public tool-name contract for safe hard-coded routing. It does not manage OAuth sessions for the official MCP, sensitive-profile MCP scope, Pipelines ingestion, Track API events, Design Studio publishing, subscription/suppression changes, or full marketing broadcast execution. Those capabilities should use the official MCP or dedicated documented APIs with separate permission review.
