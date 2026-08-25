# Calendly MCP/API Connector

Reusable MCP server that exposes stable, provider-scoped Calendly tools while preferring Calendly's official hosted MCP server and falling back to Calendly API v2 when configured.

## Official sources

- Calendly MCP: https://developer.calendly.com/calendly-mcp-server
- Supported MCP tools: https://developer.calendly.com/supported-tools
- API v2: https://developer.calendly.com/getting-started
- Authentication: https://developer.calendly.com/authentication
- OAuth scopes: https://developer.calendly.com/scopes

Calendly's hosted MCP endpoint is `https://mcp.calendly.com/`. It uses OAuth 2.1 Authorization Code + PKCE with Dynamic Client Registration and exposes scheduling-oriented tools. This connector accepts an already-issued MCP access token from a secure OAuth/DCR broker through `CALENDLY_MCP_ACCESS_TOKEN`; it never places tokens into prompts or tool arguments. When MCP credentials are not supplied, `CALENDLY_API_TOKEN` can use API v2 directly for internal/single-account deployments.

## Capabilities

The connector implements 13 tools: current user; event-type list/get/create/update; available-time search; busy-time search; scheduled-event list/get/cancel; invitee list; direct booking; and single-use scheduling links. The upstream MCP names are allowlisted and mapped from stable external tool names. REST fallback is endpoint-specific and never exposes arbitrary URLs.

## Transport

`CALENDLY_TRANSPORT=auto` prefers official MCP when `CALENDLY_MCP_ACCESS_TOKEN` is present, otherwise REST. `mcp` forces the official hosted server. `rest` forces API v2. MCP credentials must come from Calendly's OAuth 2.1/DCR/PKCE flow; personal access tokens are for API v2 and are not forwarded to MCP.

## Authentication and least privilege

For MCP, Calendly currently advertises `mcp:scheduling:read` and `mcp:scheduling:write`. For API v2, use the least-privilege OAuth scopes required by your enabled tools (for example `availability:read`, `scheduled_events:read`, `invitees:read`, plus corresponding write scopes for mutations). PATs are appropriate only for private/internal single-account use. OAuth 2.1 is the recommended public-app model.

## Install and run

```bash
npm install
cp .env.example .env
npm run build
npm start
```

The server uses stdio MCP transport and is suitable for MCP clients that can launch local processes. Configure your client to execute `node dist/server.js` with credentials injected by its secret/environment facility.

## Tool list and risk

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `calendly.user.get_current` | Authenticated user | READ | No |
| `calendly.event_type.list` | List event types | READ | No |
| `calendly.event_type.get` | Read event type | READ | No |
| `calendly.availability.list_times` | Find open times | READ | No |
| `calendly.availability.list_busy_times` | Read busy windows | READ | No |
| `calendly.event.list` | List scheduled events | READ | No |
| `calendly.event.get` | Read event | READ | No |
| `calendly.invitee.list` | List invitees | READ | No |
| `calendly.booking.create` | Create a booking | WRITE | Yes by default |
| `calendly.event.cancel` | Cancel an event | DESTRUCTIVE | Yes |
| `calendly.scheduling_link.create_single_use` | Create single-use link | WRITE | Yes by default |
| `calendly.event_type.create` | Create event type | WRITE | Yes by default |
| `calendly.event_type.update` | Update event type | WRITE | Yes by default |

Approval tokens are HMAC-SHA256 over the exact tool name and normalized arguments. Generate them in a trusted approval service using `CALENDLY_APPROVAL_SECRET`; do not expose that secret to the LLM. Setting `CALENDLY_REQUIRE_WRITE_APPROVAL=false` is intended only for tightly controlled environments.

## Reliability

REST requests have bounded retries for transient 408/429/5xx failures, exponential backoff, `Retry-After` support, timeouts, cancellation propagation, and pagination inputs. Write/destructive calls are marked non-retryable to avoid duplicate side effects. Authentication/validation/permission errors are not intentionally retried.

## Security

Provider-returned text is untrusted data, never instructions. The connector has no generic HTTP proxy, does not accept caller-supplied base URLs, keeps credentials inside transport clients, validates all tool inputs, allowlists upstream MCP tools, requires approval for writes/destructive operations, and does not permit retrieved content to change policy.

## Testing

```bash
npm test
```

Unit tests use mocks only and require no live credentials. They cover configuration, tool registration, input validation, approval enforcement, read/write routing, retry behavior, and transport selection.

## Limitations

Direct booking via Calendly's Scheduling API can require a paid plan. Some endpoints/scopes depend on plan and organization role. Webhooks, routing forms, org invitations, and no-show management are intentionally not exposed. The connector does not perform interactive DCR itself; for upstream MCP, a trusted OAuth broker/client must obtain and refresh the access token. REST OAuth refresh-token storage/rotation belongs in the surrounding credential provider; the connector consumes only an access token/PAT through environment injection.
