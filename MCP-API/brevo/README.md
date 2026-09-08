# Brevo MCP/API Connector

Reusable MCP server that exposes a deliberately scoped subset of Brevo operations for AI agents while keeping credentials, permission decisions, retries, and provider transport inside the connector.

## Provider and transport

Brevo provides both a REST API at `https://api.brevo.com/v3` and an official remote MCP service at `https://mcp.brevo.com/v1/brevo/mcp`. Current Brevo documentation states that the main MCP endpoint combines 27 modules and that MCP tokens grant full read/write account access. Brevo also exposes focused MCP servers for contacts, campaigns, analytics, templates, deals, companies, tasks, lists, segments, senders, domains, webhooks, and other modules.

This package **implements its public tools over Brevo REST v3**. The official MCP server was evaluated first, but REST is used for these operations because it lets this connector enforce stable, narrow tool schemas, method-specific retry policy, local permission gates, webhook target validation, and a fixed API origin. No generic REST passthrough is exposed. The official MCP server remains documented as an upstream option, but is not proxied by this package.

Official references researched for this implementation:

- Brevo MCP Server: https://developers.brevo.com/docs/mcp-protocol
- MCP tool configuration: https://developers.brevo.com/docs/integration-guide
- API overview: https://developers.brevo.com/docs/getting-started
- API-key authentication: https://developers.brevo.com/docs/api-key-authentication
- Authentication schemes / OAuth 2.0: https://developers.brevo.com/docs/authentication-schemes
- Rate limits: https://developers.brevo.com/docs/api-limits
- Rate-limit headers: https://developers.brevo.com/docs/limit-headers
- API concepts and pagination: https://developers.brevo.com/docs/how-it-works
- Secured webhooks: https://developers.brevo.com/docs/secured-webhooks

## Implemented capabilities

| MCP tool | Transport | Risk | Approval | Purpose |
|---|---|---:|---|---|
| `brevo.account.get` | REST | READ | No | Read account metadata |
| `brevo.contact.list` | REST | READ | No | List contacts with bounded pagination |
| `brevo.contact.get` | REST | READ | No | Read one contact |
| `brevo.contact.create` | REST | WRITE | Host flag | Create a contact |
| `brevo.contact.update` | REST | WRITE | Host flag | Update a contact/list membership |
| `brevo.contact.delete` | REST | DESTRUCTIVE | Strong host flag | Delete a contact |
| `brevo.campaign.list` | REST | READ | No | List email campaigns |
| `brevo.campaign.get` | REST | READ | No | Read campaign metadata |
| `brevo.campaign.create` | REST | WRITE | Host flag | Create a draft email campaign |
| `brevo.campaign.send` | REST | HIGH_RISK | Explicit host flag | Send an existing campaign |
| `brevo.email.send` | REST | HIGH_RISK | Explicit host flag | Send transactional email |
| `brevo.sender.list` | REST | READ | No | List sender identities |
| `brevo.webhook.list` | REST | READ | No | List webhooks |
| `brevo.webhook.create` | REST | HIGH_RISK | Explicit host flag | Create an external event destination |
| `brevo.webhook.delete` | REST | DESTRUCTIVE | Strong host flag | Delete a webhook |

The connector intentionally omits unrestricted account/user administration, API-key management, arbitrary requests, and broad campaign mutation operations.

## Architecture

```text
MCP client / agent
      |
      v
Brevo MCP connector (stdio)
  |- Zod input schemas
  |- permission gate
  |- fixed-origin REST client
  |- timeout / bounded retry
  |- rate-limit handling
  |- webhook SSRF validation
      |
      v
Credential layer (BREVO_API_KEY)
      |
      v
https://api.brevo.com/v3
```

The model never needs the API key. It calls MCP tools; the server reads credentials from its process environment.

## Authentication

### API key

Set `BREVO_API_KEY` to a Brevo API key. The client sends it only in the `api-key` header to the fixed `https://api.brevo.com/v3` origin.

Brevo also supports OAuth 2.0 for delegated integrations. This package does not implement the interactive OAuth authorization/refresh flow because it is designed as a reusable server-to-server connector. For multi-tenant apps, place an OAuth-aware credential provider in front of the `BrevoClient` and preserve the same tool contracts and policy gates.

### Least privilege

Brevo API keys and MCP tokens are account credentials rather than per-tool capability tokens. Least privilege is therefore enforced locally by exposing only named operations and by separating READ, WRITE, HIGH_RISK, and DESTRUCTIVE execution. Do not pass keys through prompts or MCP arguments.

## Environment variables

Copy `.env.example` and provide values through your secret manager or process environment.

| Variable | Required | Default | Meaning |
|---|---:|---|---|
| `BREVO_API_KEY` | Yes | - | Brevo API key |
| `BREVO_API_BASE_URL` | No | `https://api.brevo.com/v3` | Must remain the official origin; alternate origins are rejected |
| `BREVO_TIMEOUT_MS` | No | `15000` | Per-attempt timeout |
| `BREVO_MAX_RETRIES` | No | `2` | Maximum bounded retries, capped at 5 |
| `BREVO_ALLOW_WRITE` | No | `false` | Enables WRITE tools |
| `BREVO_ALLOW_HIGH_RISK` | No | `false` | Enables externally impactful sends/webhook creation |
| `BREVO_ALLOW_DESTRUCTIVE` | No | `false` | Enables delete operations |

Approval flags must be controlled by the MCP host/operator, not generated by the agent. This prevents a tool call from silently escalating its own permission.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
```

## Running the MCP server

```bash
BREVO_API_KEY='your-secret-from-a-secret-manager' npm start
```

The server uses MCP stdio transport, which is supported by MCP clients capable of launching local commands. Example generic configuration:

```json
{
  "mcpServers": {
    "brevo-safe": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/brevo/dist/src/server.js"],
      "env": {
        "BREVO_API_KEY": "${BREVO_API_KEY}",
        "BREVO_ALLOW_WRITE": "false",
        "BREVO_ALLOW_HIGH_RISK": "false",
        "BREVO_ALLOW_DESTRUCTIVE": "false"
      }
    }
  }
}
```

Actual environment interpolation syntax depends on the MCP host. Keep credentials in the host's secure environment/secret store.

## Permission model and approval behavior

`READ` calls may run automatically. `WRITE` calls are denied unless the operator enables `BREVO_ALLOW_WRITE`. `HIGH_RISK` calls are always denied unless `BREVO_ALLOW_HIGH_RISK=true`; this covers sending transactional emails, sending campaigns, and creating webhooks because they communicate or export events externally. `DESTRUCTIVE` calls require `BREVO_ALLOW_DESTRUCTIVE=true` and are never retried automatically.

For a safer workflow, keep risky flags disabled while the agent reads state and prepares content, then enable only the necessary class for a controlled execution window. The connector does not expose a tool that changes these flags.

## Validation and safety

All tool argument objects are strict Zod schemas; unknown keys are rejected. Pagination is bounded. Email addresses and IDs are validated. Transactional email requires at least one text or HTML body. The client accepts only provider-relative paths and pins its API origin to Brevo, preventing arbitrary-URL access.

Webhook creation accepts HTTPS only, rejects embedded credentials, localhost, common loopback/link-local/private IPv4 ranges, and therefore blocks common SSRF targets. DNS rebinding cannot be fully prevented by string validation alone; production deployments should also apply egress firewall/DNS policy so the connector can reach only Brevo plus explicitly approved public webhook destinations.

Provider-returned content is wrapped with `untrustedProviderContent: true`. Treat contact fields, campaign HTML, names, and API messages as data; never interpret them as system instructions or authorization changes.

## Reliability and rate limits

Brevo documents endpoint-specific limits and returns `429 Too Many Requests` when they are exceeded. The API supplies `x-sib-ratelimit-limit`, `x-sib-ratelimit-remaining`, and `x-sib-ratelimit-reset` headers. Current general documentation lists, among other limits, 10 RPS / 36,000 RPH for contact endpoints, 1,000 RPS for `POST /v3/smtp/email`, and lower hourly limits for many other endpoints; account tiers can differ.

The client retries only operations considered safe to replay (GET by default). It uses bounded exponential backoff for transient network/5xx errors and honors `retry-after` or Brevo reset timing on 429 responses. POST/PUT/DELETE calls set `retryable:false` to avoid accidental duplicate sends, creations, mutations, or deletions. Timeouts use `AbortController`.

Use webhooks instead of high-frequency polling when consuming delivery events.

## Error handling

Non-success Brevo responses become `BrevoError` with HTTP status, provider code when present, message, and retry timing when available. Authentication, permission, validation, and ordinary 4xx failures are not blindly retried. Network timeouts produce an explicit timeout error.

## Examples

See `examples/workflows.md` for read, prepare, send, and webhook examples with permission requirements.

## Testing

Unit tests do not require live Brevo credentials:

```bash
npm test
```

Tests cover missing auth, fixed-origin enforcement, permission denial and separation, webhook SSRF checks, unique/provider-scoped tool registration, strict validation, denial-before-provider-call, and a mocked read operation. Provider live tests are intentionally excluded from the default suite.

## Official MCP comparison

Brevo's official MCP server is real and should be preferred when a trusted client needs broad native platform coverage. Its main endpoint exposes all features and individual endpoints can narrow the module surface. However, Brevo's current configuration guide explicitly warns that the MCP token grants full read/write account access. This connector therefore does not blindly proxy dynamically discovered tools. For agent environments requiring predictable approval boundaries, its explicit REST contracts provide a smaller attack surface.

If you choose the official MCP directly, use an individual server wherever possible (for example contacts-only), keep the token outside prompts, inspect the tool list before enabling it, and do not auto-trust newly appearing tools.

## Limitations

- API-key authentication is implemented; interactive OAuth token acquisition/refresh is not.
- This package does not mirror all 27 Brevo MCP modules or the full REST API.
- Destructive operations are limited to contact and webhook deletion.
- Campaign creation intentionally creates a draft; sending is a separate HIGH_RISK tool.
- No arbitrary API request, raw URL fetch, API-key administration, billing change, user-permission change, or account deletion capability is exposed.
- Webhook DNS-level egress policy must be enforced by the deployment environment for defense in depth.
