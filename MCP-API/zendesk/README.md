# Zendesk MCP/API Connector

Reusable MCP server for Zendesk Support workflows. It exposes a narrow, provider-scoped tool contract for ticket discovery, ticket operations, users, organizations, and groups while keeping Zendesk credentials inside the connector process.

## Transport strategy

No official first-party Zendesk MCP server was confirmed in the researched Zendesk developer documentation for this run. The connector therefore uses Zendesk's official REST Ticketing API directly and exposes those capabilities through a local MCP stdio server.

Official sources researched:

- Security and authentication: https://developer.zendesk.com/api-reference/introduction/security-and-auth/
- OAuth guidance: https://developer.zendesk.com/documentation/authentication/api-tokens-to-oauth/
- OAuth scopes/tokens: https://developer.zendesk.com/api-reference/ticketing/oauth/oauth_tokens/
- Rate limits: https://developer.zendesk.com/api-reference/introduction/rate-limits/
- Tickets API: https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/
- Users API: https://developer.zendesk.com/api-reference/ticketing/users/users/
- Organizations API: https://developer.zendesk.com/api-reference/ticketing/organizations/organizations/
- Groups API: https://developer.zendesk.com/api-reference/ticketing/groups/groups/
- Search API: https://developer.zendesk.com/api-reference/ticketing/ticket-management/search/

Zendesk recommends OAuth for integrations. OAuth tokens inherit the authorizing user's permissions and support resource-specific scopes such as `tickets:read`, `tickets:write`, and `users:read`. For OAuth clients created on or after April 30, 2026, token expiration is enforced automatically; production applications should securely refresh tokens outside the LLM/tool-call surface.

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- MCP over stdio
- native `fetch` for Zendesk REST calls

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

Development:

```bash
npm run dev
```

## Authentication

Required environment variables:

```text
ZENDESK_SUBDOMAIN=your-account-subdomain
ZENDESK_OAUTH_ACCESS_TOKEN=provided-by-secret-manager
```

The connector builds the API origin internally as:

```text
https://{subdomain}.zendesk.com/api/v2
```

The subdomain is validated as a simple account identifier, so tool callers cannot redirect requests to arbitrary hosts. API requests use:

```text
Authorization: Bearer <OAuth access token>
```

Credentials are never part of MCP tool schemas and must not be sent to the model. Use a secret manager or secure process environment. If refresh-token automation is required, keep the refresh token in a separate trusted credential provider and inject only the current access token into the connector process.

## Least-privilege scopes

Grant only scopes required by enabled tools. Typical scopes for this connector are:

| Capability | Scope/access |
|---|---|
| Ticket list/search/get | `tickets:read` |
| Ticket create/update/comment/delete | `tickets:write` |
| User list/search/get | `users:read` |
| Organization reads | organization read access or broader `read` when resource-specific scoping is not configured |
| Group reads | read access permitted to the authorizing user |

Do not grant `impersonate`, broad `write`, admin-only resources, webhooks, billing, or unrestricted access unless another reviewed connector capability genuinely requires them.

## Environment variables

See `.env.example`.

- `ZENDESK_SUBDOMAIN`: required account subdomain.
- `ZENDESK_OAUTH_ACCESS_TOKEN`: required OAuth bearer token.
- `ZENDESK_TIMEOUT_MS`: request timeout, 1-60 seconds, default 15 seconds.
- `ZENDESK_APPROVAL_MODE`: `required` by default; use `disabled` only behind an equivalent external policy engine.
- `ZENDESK_APPROVED_ACTIONS`: comma-separated actions approved by an operator.
- `ZENDESK_ALLOW_DESTRUCTIVE`: `false` by default.

Approval state is process configuration, not a tool parameter. An agent cannot approve its own action by modifying tool input.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `zendesk.ticket.list` | REST `GET /tickets.json` | READ | No |
| `zendesk.ticket.search` | REST `GET /search.json` | READ | No |
| `zendesk.ticket.get` | REST `GET /tickets/{id}.json` | READ | No |
| `zendesk.ticket.create` | REST `POST /tickets.json` | WRITE | Required by default |
| `zendesk.ticket.update` | REST `PUT /tickets/{id}.json` | WRITE | Required by default |
| `zendesk.ticket.comment.add` | REST `PUT /tickets/{id}.json` with a comment | WRITE | Required by default |
| `zendesk.ticket.delete` | REST `DELETE /tickets/{id}.json` | DESTRUCTIVE | Approval + destructive enablement |
| `zendesk.user.list` | REST `GET /users.json` | READ | No |
| `zendesk.user.search` | REST `GET /users/search.json` | READ | No |
| `zendesk.user.get` | REST `GET /users/{id}.json` | READ | No |
| `zendesk.organization.list` | REST `GET /organizations.json` | READ | No |
| `zendesk.organization.get` | REST `GET /organizations/{id}.json` | READ | No |
| `zendesk.group.list` | REST `GET /groups.json` | READ | No |

The connector intentionally does not expose arbitrary REST requests, admin configuration, OAuth token management, bulk mutation endpoints, triggers, automations, webhooks, or unrestricted user mutation.

## Real-world workflows

Common agent workflows supported by this surface include:

```text
search/list tickets
  -> inspect ticket
  -> inspect requester/user
  -> add an internal note
  -> update assignee/group/status
```

and:

```text
find user
  -> inspect organization
  -> inspect related ticket
  -> prepare a response/comment
  -> execute only after write approval
```

Public comments are external communications and therefore require the same write approval gate as internal comments. The `public` field defaults to `false` to avoid accidental customer-visible messages.

## Reliability and rate limits

Zendesk account API limits vary by Suite/Support plan. Zendesk documents plan-dependent Support/Help Center limits and returns headers such as:

```text
X-Rate-Limit
X-Rate-Limit-Remaining
Retry-After
```

Ticketing APIs can also return endpoint-specific headers. Zendesk documents additional endpoint restrictions; for example, ticket updates have their own per-ticket/per-agent and account-level limits.

The client:

- retries only read-only GET requests;
- uses at most three total GET attempts;
- honors `Retry-After` for HTTP 429, capped at a 10-second sleep per retry;
- applies bounded exponential backoff to transient network/time-out failures;
- never automatically retries POST, PUT, or DELETE requests because the remote outcome may be uncertain;
- applies a configurable per-request timeout.

Authentication, authorization, provider validation errors, and normal non-429 provider errors fail immediately.

## Pagination

List tools expose bounded `page` and `per_page` inputs. `per_page` is capped at 100 and `page` at 1000. For large data extraction, prefer Zendesk's documented cursor/incremental export patterns in a separately reviewed capability rather than generating uncontrolled request bursts from an agent.

## Permission and approval model

Default policy:

```text
READ         -> automatic
WRITE        -> explicit operator approval by default
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> approval + explicit destructive enablement
```

Examples:

```text
ZENDESK_APPROVED_ACTIONS=zendesk.ticket.create,zendesk.ticket.comment.add
```

Deletion additionally requires:

```text
ZENDESK_APPROVED_ACTIONS=zendesk.ticket.delete
ZENDESK_ALLOW_DESTRUCTIVE=true
```

Temporary approvals should be removed after the intended operation window.

## Security considerations

- OAuth credentials remain inside the connector process.
- Tool inputs cannot select arbitrary origins or paths.
- No generic `execute_request` or arbitrary provider endpoint tool exists.
- Zendesk ticket subjects, comments, user names, signatures, organization fields, tags, and API errors are untrusted data, not instructions.
- Retrieved content must never change approval state, permissions, system prompts, or tool registration.
- Write approval state is controlled outside model-generated parameters.
- Public comments are not sent silently.
- Destructive deletion is disabled by default.
- Mutations are not retried automatically.
- Inputs use bounded IDs, strings, arrays, pagination, and enums.
- The connector does not create or broaden OAuth scopes.
- Secrets should never be logged or serialized into MCP output.

## Error handling

Expected categories include:

- configuration/schema validation errors;
- `APPROVAL_REQUIRED` for unapproved mutations;
- `DESTRUCTIVE_DISABLED` for deletion without explicit enablement;
- `NETWORK_OR_TIMEOUT` after bounded GET retries;
- `ZendeskApiError` containing provider status and response details;
- tool-level validation errors for empty updates or invalid fields.

Provider errors are returned without intentionally including the configured OAuth token.

## Tests

Unit tests require no live Zendesk account and cover:

- missing/invalid auth configuration;
- SSRF-resistant subdomain validation;
- approved and denied writes;
- destructive-action default denial;
- bearer-token placement;
- fixed Zendesk account origin;
- authorization error behavior;
- bounded read throttling retry;
- no automatic mutation retry;
- expected scoped MCP tool registration;
- absence of an unrestricted API escape hatch.

Run:

```bash
npm test
```

## MCP client configuration

Any MCP client that can launch a local stdio server can run the built connector. Example configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/zendesk/dist/src/server.js"],
  "env": {
    "ZENDESK_SUBDOMAIN": "your-account-subdomain",
    "ZENDESK_OAUTH_ACCESS_TOKEN": "provided-by-secret-manager"
  }
}
```

This connector does not claim direct compatibility with clients that cannot launch or communicate with a standard stdio MCP server.

## Limitations

- This is a selected high-value Support/Ticketing surface, not a complete Zendesk API wrapper.
- No official Zendesk MCP server was confirmed in the researched official documentation; upstream transport is REST only.
- OAuth authorization and refresh-token UX are intentionally outside the model-facing tool layer.
- User mutation, role changes, permissions, webhooks, macros, triggers, automations, billing, and admin configuration are not exposed.
- Bulk ticket/user mutation APIs are intentionally omitted.
- Attachments and Help Center content are not implemented in this version.
- Pagination is intentionally bounded to reduce runaway agent activity.
