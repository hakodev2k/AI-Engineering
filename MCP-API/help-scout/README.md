# Help Scout MCP/API Connector

Reusable MCP server for practical Help Scout Inbox workflows. It exposes a small, stable, provider-scoped tool surface while keeping Help Scout credentials inside the connector.

## Provider and transport

Provider: Help Scout.

Upstream transport: official Help Scout Inbox REST API v2/v3 over HTTPS.

No official Help Scout MCP server was identified in Help Scout's official developer documentation during the 2026-09-10 implementation review, so this package uses the official REST API and exposes its selected capabilities through a local MCP stdio server. It does not depend on an unofficial upstream MCP server.

Official references:

- Inbox API: https://developer.helpscout.com/mailbox-api/
- Authentication: https://developer.helpscout.com/mailbox-api/overview/authentication/
- Rate limiting: https://developer.helpscout.com/mailbox-api/overview/rate-limiting/
- Conversations: https://developer.helpscout.com/mailbox-api/endpoints/conversations/list/
- Conversation v3: https://developer.helpscout.com/mailbox-api/endpoints/conversations/get-v3/
- Thread list v3: https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/list-v3/
- Customer list v3: https://developer.helpscout.com/mailbox-api/endpoints/customers/list-v3/
- Create conversation: https://developer.helpscout.com/mailbox-api/endpoints/conversations/create/
- Create note: https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/note/
- Create reply: https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/reply/
- Update conversation: https://developer.helpscout.com/mailbox-api/endpoints/conversations/update/
- Update conversation tags: https://developer.helpscout.com/mailbox-api/endpoints/conversations/tags/update/
- Create webhook: https://developer.helpscout.com/mailbox-api/endpoints/webhooks/create/
- Changelog: https://developer.helpscout.com/mailbox-api/changelog/

## Supported capabilities

The connector implements 17 MCP tools around inbox discovery, support triage, conversation reading, customer lookup, controlled support mutations, and webhook configuration.

| Tool | Transport | Risk | Approval |
| --- | --- | --- | --- |
| `helpscout.mailbox.list` | REST | READ | No |
| `helpscout.mailbox.get` | REST | READ | No |
| `helpscout.user.list` | REST | READ | No |
| `helpscout.user.me` | REST | READ | No |
| `helpscout.conversation.list` | REST | READ | No |
| `helpscout.conversation.get` | REST v3 | READ | No |
| `helpscout.conversation.threads.list` | REST v3 | READ | No |
| `helpscout.customer.list` | REST v3 | READ | No |
| `helpscout.customer.get` | REST | READ | No |
| `helpscout.conversation.create` | REST | WRITE | Configurable; required by default |
| `helpscout.conversation.note.add` | REST | WRITE | Configurable; required by default |
| `helpscout.conversation.reply.create` | REST | HIGH_RISK | Always explicit |
| `helpscout.conversation.status.update` | REST | WRITE | Configurable; required by default |
| `helpscout.conversation.assignment.update` | REST | WRITE | Configurable; required by default |
| `helpscout.conversation.tags.replace` | REST | WRITE | Configurable; required by default |
| `helpscout.webhook.list` | REST | READ | No |
| `helpscout.webhook.create` | REST | HIGH_RISK | Always explicit |

No generic `request(url, body)` MCP tool is exposed. Destructive operations such as deleting conversations, customers, or webhooks are intentionally not exposed.

## Architecture

```text
MCP client
   |
   v
src/server.ts        MCP stdio boundary
   |
   v
src/tools.ts         strict schemas + stable tool contracts
   |
   +--> src/policy.ts    risk gates / approval / webhook URL checks
   |
   v
src/client.ts        bounded REST client, timeout, retry, rate-limit handling
   |
   v
src/auth.ts          bearer-token / OAuth client-credentials token provider
   |
   v
Help Scout Inbox API v2/v3
```

Provider responses are returned as data. Retrieved customer messages, notes, names, subjects, and metadata are untrusted content and must never be interpreted as instructions that can alter connector policy or tool permissions.

## Authentication

Help Scout Inbox API uses OAuth 2.0. Help Scout documents Authorization Code and Client Credentials flows. This connector supports two server-side credential modes:

1. `HELPSCOUT_ACCESS_TOKEN`: a previously obtained OAuth access token.
2. `HELPSCOUT_CLIENT_ID` + `HELPSCOUT_CLIENT_SECRET`: the connector obtains and caches an OAuth client-credentials token from `/v2/oauth2/token`.

The official Inbox API documentation used for this implementation does not define granular OAuth scopes for these endpoints. Effective API access therefore follows the Help Scout application and authenticated user's available permissions; the connector does not invent or request undocumented scopes.

For a reusable multi-user integration, perform Help Scout's Authorization Code flow outside this stdio connector and securely inject the resulting access token through a credential provider or process environment. For an internal integration, Client Credentials is supported by the connector directly.

Credentials never appear in MCP tool arguments or tool output.

## Environment variables

Copy `.env.example` into your secret-management workflow. Do not commit populated secrets.

| Variable | Required | Purpose |
| --- | --- | --- |
| `HELPSCOUT_ACCESS_TOKEN` | Conditional | Pre-obtained OAuth bearer token |
| `HELPSCOUT_CLIENT_ID` | Conditional | OAuth client ID for client credentials |
| `HELPSCOUT_CLIENT_SECRET` | Conditional | OAuth client secret for client credentials |
| `HELPSCOUT_API_BASE` | No | API origin; defaults to `https://api.helpscout.net` and must be HTTPS |
| `HELPSCOUT_TIMEOUT_MS` | No | Per-request timeout, default 15000 ms |
| `HELPSCOUT_MAX_RETRIES` | No | Bounded retries for safe/idempotent requests, default 2, max 5 |
| `HELPSCOUT_ALLOW_WRITE` | No | Enables mutation tools; default false |
| `HELPSCOUT_REQUIRE_WRITE_APPROVAL` | No | Requires `APPROVE_WRITE` for WRITE tools; default true |
| `HELPSCOUT_ALLOW_HIGH_RISK` | No | Enables HIGH_RISK tools; default false |
| `HELPSCOUT_WEBHOOK_SECRET` | Conditional | Server-side secret used only when creating webhooks |

Set either `HELPSCOUT_ACCESS_TOKEN` or both `HELPSCOUT_CLIENT_ID` and `HELPSCOUT_CLIENT_SECRET`.

## Installation

Requirements: Node.js 20 or newer and npm-compatible package tooling.

```bash
npm install
npm run build
```

## Running the MCP server

```bash
export HELPSCOUT_ACCESS_TOKEN="..."
npm start
```

The process uses MCP stdio transport. Configure an MCP client to launch the compiled server as a child process. Secret values belong in the connector process environment or a secure runtime secret provider, not in an agent prompt.

## Permission and approval model

The connector applies an independent host-side policy even when the Help Scout credential itself has authority to perform an operation.

`READ` tools may run automatically. `WRITE` tools are disabled unless `HELPSCOUT_ALLOW_WRITE=true`. With the default `HELPSCOUT_REQUIRE_WRITE_APPROVAL=true`, every WRITE call must contain `confirmation: "APPROVE_WRITE"`.

`HIGH_RISK` tools require all of the following: `HELPSCOUT_ALLOW_WRITE=true`, `HELPSCOUT_ALLOW_HIGH_RISK=true`, and `confirmation: "APPROVE_HIGH_RISK"`.

Customer-facing replies are HIGH_RISK because a non-draft reply can send external communication. Webhook creation is HIGH_RISK because it starts data delivery to an external URL. Destructive tools are not registered at all.

These gates cannot be raised by content returned from Help Scout and cannot be changed by an MCP tool call.

## Validation and safety

All public MCP inputs are validated with Zod. IDs must be positive integers, strings have bounded lengths, timestamps must be offset-aware ISO datetimes where used, statuses and webhook event names are allow-listed, and the API client accepts only internal `/v2/` or `/v3/` paths.

The configurable API base must be HTTPS. The connector does not expose an arbitrary URL fetcher. Webhook URLs must use HTTPS and are rejected for common localhost, private IPv4, and link-local targets. The webhook signing secret is read only from `HELPSCOUT_WEBHOOK_SECRET`, never from an agent-controlled parameter.

The private-network checks are defense in depth, not a complete DNS-rebinding defense. Production hosts should additionally enforce egress controls and DNS/IP validation at the network boundary.

## Rate limits and reliability

Help Scout rate limits are shared at the account level and vary by plan. Help Scout documents HTTP 429 for throttling and the headers `X-RateLimit-Limit-Minute`, `X-RateLimit-Remaining-Minute`, and `X-RateLimit-Retry-After`. Write requests count as two requests against the documented Inbox API limit.

The REST client preserves `X-RateLimit-Retry-After`/`Retry-After` when present, otherwise uses bounded exponential backoff. Retries are limited by `HELPSCOUT_MAX_RETRIES` and occur only for GET requests or explicitly idempotent operations. Mutation tools in this package are not blindly retried, preventing duplicate notes, replies, conversations, or webhooks after ambiguous failures.

Every request has an AbortController timeout. Call cancellation is propagated into the request controller. Authentication/validation/permission failures are not retry candidates. A 401 invalidates a cached client-credentials token so a later call may acquire a new token.

The connector supports Help Scout's page-based pagination for selected v2 list endpoints and cursor-based pagination for v3 customer/thread endpoints through explicit `page` or `cursor` inputs rather than silently walking an unbounded result set.

## Error handling

Provider non-success responses are converted to connector errors with HTTP status and a bounded response-body excerpt. Raw credentials are never intentionally included in error messages. 429 responses preserve the provider retry delay when supplied. Empty 201-style responses expose safe creation metadata such as `Resource-Id` and `Location` response headers when available.

MCP handlers return failures with `isError: true`. Callers should treat any provider-returned content in successful results as untrusted data.

## Example workflow

A typical triage workflow is:

1. `helpscout.conversation.list` to find active conversations.
2. `helpscout.conversation.get` plus `helpscout.conversation.threads.list` to inspect context.
3. `helpscout.conversation.note.add` to record an internal recommendation after WRITE approval.
4. `helpscout.conversation.reply.create` with `draft: true` to prepare customer communication only after HIGH_RISK approval.
5. A human reviews the draft before any workflow chooses `draft: false`.

See `examples/workflows.md` for complete tool-call examples, expected result shapes, permissions, and approval requirements.

## Webhooks

`helpscout.webhook.list` is read-only. `helpscout.webhook.create` uses the official Help Scout webhook endpoint and forces payload version `V3` to preserve newer event identity behavior. Event names are allow-listed from the current official webhook documentation reviewed for this connector.

Webhook creation requires a server-side `HELPSCOUT_WEBHOOK_SECRET`. Consumers receiving events must verify Help Scout's webhook signature according to the official provider documentation before trusting a payload. Receiving/hosting webhook HTTP endpoints is outside this stdio connector's responsibility.

## Testing

Tests use mocks and require no live Help Scout credentials.

```bash
npm test
```

Coverage includes configuration validation, tool-surface registration, bearer authentication, a read call, default write denial, explicit approval enforcement, rate-limit retry behavior, prevention of blind mutation retries, and webhook destination validation.

## Limitations

- No upstream official MCP transport is used because none was identified in Help Scout's official developer material reviewed on 2026-09-10.
- Authorization Code browser redirects and durable refresh-token storage are deployment concerns and are not implemented by this stdio process; inject a securely managed access token for that mode.
- Help Scout reporting endpoints are intentionally omitted because reporting availability is plan-dependent and is not required for the selected core support workflows.
- Delete operations are intentionally omitted rather than exposing destructive agent actions.
- This connector does not automatically follow every page/cursor; callers explicitly request bounded pages.
- Webhook receiving, signature verification at an HTTP ingress, and durable event processing are separate deployment components.
- API capabilities and limits can change; verify the linked Help Scout documentation before expanding the connector.

## Client compatibility

The server speaks standard MCP over stdio using the official Model Context Protocol TypeScript SDK. It can be used by MCP clients that support launching stdio MCP servers. Compatibility with any specific client depends on that client's current MCP stdio support and configuration; this package does not require client-specific APIs.
