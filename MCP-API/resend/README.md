# Resend MCP/API Connector

Reusable MCP server for constrained Resend workflows.

## Official upstreams
Resend launched its official MCP server on 2026-04-07 with local stdio and Streamable HTTP support, and launched the hosted remote MCP endpoint with OAuth on 2026-07-07. The hosted endpoint is `https://mcp.resend.com/mcp`; headless clients may use a Resend API key as a Bearer token. Official MCP documentation states full-platform coverage across email, contacts, broadcasts, domains, webhooks, segments, topics, contact properties, API keys, and received email. Resend's REST API remains the fallback/direct transport.

Official references:
- https://resend.com/docs/mcp-server
- https://resend.com/mcp
- https://resend.com/changelog/mcp
- https://resend.com/changelog/remote-mcp-server
- https://resend.com/docs/api-reference/introduction

## Transport strategy
The provider has a trusted official MCP implementation. This package nevertheless exposes a stable local MCP contract backed by the official REST API for its deliberately narrow capability set; this permits strict schemas, fixed allowlists, local approval boundaries, and credential isolation without dynamically trusting 85+ upstream tools. Deployments needing broader Resend functionality should use the official remote MCP directly rather than an unofficial server. No capability here depends on a community MCP implementation.

## Capabilities
Fourteen tools: email list/get/send; domain list/get/verify; contact list/get/create/update; segment list/get; webhook list/get. The connector intentionally omits deletes, API-key management, broadcast sending, batch sending, and arbitrary requests. Those operations exist upstream but have larger permission or blast-radius concerns.

## Architecture
MCP stdio client -> strict Zod tool schema -> risk/approval policy -> credential-isolated REST client -> `https://api.resend.com`. Returned provider content is wrapped as `untrustedProviderData` and is never interpreted as instructions or policy.

## Authentication and scopes
Set `RESEND_API_KEY`. REST calls use `Authorization: Bearer`. Resend API keys can be created with Full access or Sending access; use the least privilege compatible with the enabled tools. A sending-only deployment should expose only send-related operations; metadata/contact/domain tools require an appropriately authorized key. The official remote MCP supports OAuth and account-granted permissions; this local REST-backed connector does not handle OAuth refresh tokens.

## Environment
Copy `.env.example`. The REST origin is pinned exactly to `https://api.resend.com`, preventing caller-controlled SSRF. API keys never appear in tool schemas, provider output, examples, or logs.

## Install / run
Node.js 20+:

    npm install
    npm run build
    npm start

The package exposes a standard MCP stdio server. Any client capable of launching stdio MCP servers can integrate it; client-specific compatibility is not asserted beyond that protocol requirement.

## Permission model
READ tools may execute automatically. WRITE tools require `approved:true` when `RESEND_WRITE_APPROVAL=required` (default). Sending email is an external communication and always follows the WRITE gate. Domain verification and contact mutation are also WRITE. DESTRUCTIVE operations are disabled/not registered. There is no tool for changing permissions or generating API keys.

## Reliability / rate limits
Reads use bounded exponential backoff for network failures, HTTP 429, and transient 5xx responses, honoring `Retry-After` when supplied. Retry count is capped at five. Mutating calls are not blindly retried, avoiding duplicate email or repeated side effects. Requests use abort-based timeouts. List calls are cursor-aware and bounded to 1..100 items per request to prevent runaway retrieval. Resend rate limits are surfaced through HTTP 429/provider errors rather than hidden; exact limits may vary by endpoint/account and should be read from current official API documentation/response headers.

## Errors
Provider errors map to `ResendError(status, code, message, retryAfter)`. Validation, authentication configuration, approval, and host-policy failures happen before mutation. MCP error responses expose bounded messages, not credentials.

## Security
The LLM never receives the API key. Provider content is untrusted data. The connector has no arbitrary URL/request tool, pins the provider host, strictly validates inputs, bounds content/list sizes, refuses destructive actions, and requires human approval for writes. It does not dynamically discover or auto-enable tools from the upstream MCP server, preventing unexpected capability expansion. Webhook receiving/signature validation is outside this read-only webhook metadata surface.

## Tests
`npm test` uses mocks only and covers missing authentication, tool registration, strict validation, approval denial, pagination bounds, API error mapping, 429 retry, and no blind write retry.

## Limitations
This package is intentionally narrower than Resend's official MCP server. It does not proxy OAuth, received-email attachments, templates, broadcasts, topics, contact properties, API-key administration, webhook mutation, deletes, scheduling, batch sends, or automations. Use Resend's official MCP when those capabilities are required and apply equivalent least-privilege/human-approval controls in the calling environment.
