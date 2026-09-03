# Gorgias MCP/API Connector

Reusable MCP server for common Gorgias helpdesk workflows. It exposes stable provider-scoped tools over the official Gorgias REST API and is designed so raw credentials stay inside the connector process.

## Provider and transport strategy

Gorgias provides an official remote MCP server at:

```text
https://mcp.gorgias.com/mcp?gorgias_subdomain=YOUR_GORGIAS_SUBDOMAIN
```

As of September 2026, Gorgias documents this MCP integration as open beta for paid plans. It authenticates users through Gorgias and is intended for external AI assistants such as ChatGPT and Claude.

This reusable connector does **not** proxy arbitrary upstream MCP tools. The official MCP server is intentionally not auto-discovered or auto-invoked here because its remote OAuth session and tool surface are controlled by Gorgias rather than by this package, and automatically trusting newly advertised tools would weaken the connector's permission boundary. For the deterministic capabilities in this package, the connector uses Gorgias's official REST API, whose endpoint contracts, authentication, scopes, pagination, and rate-limit behavior are publicly documented. Clients that want Gorgias's full official MCP experience can connect to the Gorgias MCP endpoint directly, while this server provides a narrower auditable interface suitable for reusable agents.

Official sources researched:

- Gorgias MCP: https://docs.gorgias.com/en-US/connect-your-ai-assistant-to-the-gorgias-mcp-6310546
- REST API authentication: https://developers.gorgias.com/reference/authentication
- API keys: https://developers.gorgias.com/docs/access-tokens-api-keys
- OAuth2 bearer tokens: https://developers.gorgias.com/docs/oauth2-bearer-token
- OAuth2 scopes: https://developers.gorgias.com/docs/oauth2-scopes
- Rate limits: https://developers.gorgias.com/reference/limitations
- Requests/base URL: https://developers.gorgias.com/reference/requests
- Tickets: https://developers.gorgias.com/reference/list-tickets
- Ticket creation: https://developers.gorgias.com/reference/create-ticket
- Ticket update: https://developers.gorgias.com/reference/update-ticket
- Messages: https://developers.gorgias.com/reference/list-messages
- Message creation: https://developers.gorgias.com/reference/create-ticket-message
- Internal/outbound message guidance: https://developers.gorgias.com/docs/create-a-new-message-in-ticket-via-api
- Customers: https://developers.gorgias.com/reference/list-customers
- Tags: https://developers.gorgias.com/reference/list-tags

## Runtime

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The MCP server uses stdio and can be launched by clients that support stdio MCP child processes.

## Authentication

Two official Gorgias authentication models are supported.

### Private app / API key

Set:

```text
GORGIAS_SUBDOMAIN=your-subdomain
GORGIAS_API_EMAIL=agent@example.com
GORGIAS_API_KEY=...
```

Gorgias private API keys use HTTP Basic authentication with `email:API_KEY`. API-key actions inherit the permissions of the Gorgias user associated with the key. Use a dedicated least-privileged Gorgias user.

### OAuth2 bearer token

Set:

```text
GORGIAS_SUBDOMAIN=your-subdomain
GORGIAS_OAUTH_ACCESS_TOKEN=...
```

OAuth2 is required for public Gorgias apps. The relevant scopes for this connector are normally:

```text
account:read
users:read
customers:read
tickets:read
tickets:write
```

Use `offline` only when the surrounding credential service needs refresh-token support. This package accepts an already issued bearer access token; it does not embed an OAuth browser flow or store refresh tokens.

## Credential isolation

Tool inputs never contain access tokens, API keys, or passwords. Credentials are loaded from process environment and attached only inside the HTTP transport layer:

```text
Agent -> MCP tool -> connector -> credential layer -> Gorgias
```

Do not inject credentials into prompts, logs, examples, or model-visible tool arguments.

## Environment variables

- `GORGIAS_SUBDOMAIN` — required.
- `GORGIAS_API_EMAIL` and `GORGIAS_API_KEY` — required together for private-app Basic auth unless bearer auth is used.
- `GORGIAS_OAUTH_ACCESS_TOKEN` — optional alternative to API-key auth.
- `GORGIAS_TIMEOUT_MS` — request timeout, 1,000–120,000 ms; default 15,000.
- `GORGIAS_MAX_RETRIES` — bounded retry count, 0–5; default 2.
- `GORGIAS_REQUIRE_WRITE_APPROVAL` — defaults to `true`.
- `GORGIAS_APPROVED_ACTIONS` — comma-separated exact approval fingerprints supplied by a trusted control plane, not by the model.

## Supported capabilities

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `gorgias.account.get` | REST | READ | none |
| `gorgias.ticket.list` | REST | READ | none |
| `gorgias.ticket.get` | REST | READ | none |
| `gorgias.ticket.create` | REST | WRITE | required by default |
| `gorgias.ticket.update` | REST | WRITE | required by default |
| `gorgias.message.list` | REST | READ | none |
| `gorgias.message.get` | REST | READ | none |
| `gorgias.message.internal_note.create` | REST | WRITE | required by default |
| `gorgias.message.reply.send` | REST | HIGH_RISK | explicit approval always |
| `gorgias.customer.list` | REST | READ | none |
| `gorgias.customer.get` | REST | READ | none |
| `gorgias.tag.list` | REST | READ | none |
| `gorgias.user.list` | REST | READ | none |

No deletion, trashing, permission changes, billing operations, or arbitrary REST passthrough are exposed.

## Approval model

READ tools may run automatically. WRITE tools require connector-controlled approval by default. `GORGIAS_REQUIRE_WRITE_APPROVAL=false` can relax normal WRITE tools, but it never bypasses `HIGH_RISK` approval.

Outbound replies are `HIGH_RISK` because they send external communications. For example:

```text
GORGIAS_APPROVED_ACTIONS=gorgias.message.reply.send:456:customer@example.com
```

The exact approval fingerprint includes the ticket and destination. The model cannot self-approve because approval is not a tool argument.

## Tool behavior

### Ticket discovery and reading

`gorgias.ticket.list` supports customer filtering, trashed inclusion, documented sort orders, and bounded cursor pagination. `gorgias.ticket.get` returns a single ticket.

### Ticket creation

`gorgias.ticket.create` creates an incoming API-channel ticket with `from_agent=false`. It intentionally avoids sending an external message. Gorgias requires at least one message when a ticket is created.

### Ticket updates

`gorgias.ticket.update` exposes only common workflow fields: status, priority, subject, unread state, assignee user, and assignee team. It deliberately excludes trash timestamps and other destructive or broad metadata mutation.

### Internal notes

`gorgias.message.internal_note.create` uses the official `internal-note` channel, `from_agent=true`, and an existing Gorgias user email as sender. Internal notes are not shared with customers.

### Customer replies

`gorgias.message.reply.send` sends an email message through Gorgias. The `fromAddress` must correspond to an existing email integration in the Gorgias account. This tool always requires explicit approval.

## Rate limits and reliability

Gorgias documents a leaky-bucket rate limiter. Current documented limits are:

- OAuth2 apps: 80 requests per 20-second window.
- API-key integrations: 40 requests per 20-second window.
- Enterprise accounts use the same request limits with a 10-second window.

The API returns HTTP 429 when throttled and exposes `Retry-After` plus `X-Gorgias-Account-Api-Call-Limit` headers.

This connector:

- honors `Retry-After` when present;
- uses bounded exponential backoff for safe GET requests after 429, 5xx, or network failures;
- applies cancellation-backed timeouts;
- does not automatically retry write or external-send operations;
- caps pagination at ten pages per tool call to prevent uncontrolled request amplification;
- propagates authentication, validation, and permission errors without retrying them.

## Security considerations

- Provider content is treated as untrusted data, never executable instructions.
- Tool schemas validate IDs, email addresses, limits, sort orders, status, and priority.
- No arbitrary URL or arbitrary provider-request tool exists, reducing SSRF and privilege-escalation risk.
- The provider base URL is derived only from a validated Gorgias subdomain.
- Credentials stay in process configuration and are never returned in tool output.
- Normal writes and external communication are separated from read workflows.
- High-risk actions use exact external approval fingerprints.
- Official Gorgias MCP is not blindly proxied; newly advertised upstream MCP tools cannot silently expand this connector's permissions.
- Do not log Authorization headers or raw secrets.

## Webhooks and events

Gorgias can send HTTP integration events when tickets are created or updated and when messages are added. This connector does not open an inbound HTTP listener, so webhook ingestion is intentionally outside its stdio server scope. An application can place a verified webhook receiver in front of this package and pass resulting IDs into the read tools.

## Testing

Run:

```bash
npm test
```

Unit tests require no live Gorgias credentials. They cover:

- missing authentication configuration;
- OAuth and private API-key configuration;
- credential placement in the HTTP transport;
- default write denial;
- mandatory HIGH_RISK approval;
- 429 retry handling;
- non-retry of writes;
- cursor pagination.

## Examples

See `examples/workflows.md`.

## Limitations

- This package does not implement an interactive OAuth authorization-code or refresh-token store. Supply a bearer token from a secure external credential service when using OAuth.
- It does not proxy the official Gorgias MCP server; connect to Gorgias MCP directly when its broader conversational toolset is desired.
- It intentionally omits destructive deletion/trash operations, permission changes, billing, rules/macros administration, integration configuration, and unrestricted API access.
- Outbound email delivery depends on existing Gorgias channel configuration and provider-side permissions.
- Gorgias account roles and OAuth scopes remain the ultimate authorization boundary; connector approval is an additional local safety layer, not a replacement for least-privilege provider permissions.
