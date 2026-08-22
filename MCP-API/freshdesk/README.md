# Freshdesk MCP/API Connector

Reusable MCP server for Freshdesk customer-support workflows. It exposes a stable, provider-scoped tool contract for tickets, conversations, contacts, agents, groups, and account metadata while keeping the Freshdesk API key inside the connector process.

## Transport strategy

Freshworks currently provides an official **Developer MCP server** as part of its Agentic Developer Toolkit. That MCP server is designed for Freshworks app-development and Developer Portal workflows such as app validation, packaging, upload, version management, deployment status, and publishing. It is not a helpdesk ticket-execution transport.

For Freshdesk operational data, this connector therefore uses the official **Freshdesk REST API v2** directly. Agent callers see the same MCP tool interface and do not need to know the upstream transport.

Official sources researched for this implementation:

- Freshdesk REST API v2: https://developers.freshdesk.com/api/
- Freshworks Agentic Developer Toolkit: https://freshworks.dev/docs/agentic-dev-tools/
- Developer MCP installation/configuration: https://freshworks.dev/docs/tutorials/foundations/agentic-dev-tools/install/

## Runtime

- Node.js 20+
- TypeScript
- MCP SDK over stdio
- Native `fetch` for Freshdesk HTTPS calls

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

For development:

```bash
npm run dev
```

## Authentication

Freshdesk API v2 supports API-key authentication using HTTP Basic auth where the API key is the username and any dummy password can be used. This connector sends:

```text
Authorization: Basic base64(<FRESHDESK_API_KEY>:X)
```

Required environment variables:

```text
FRESHDESK_DOMAIN=
FRESHDESK_API_KEY=
```

`FRESHDESK_DOMAIN` is the Freshdesk subdomain only, for example `acme-support`, not a URL. The connector validates it and constructs only `https://<domain>.freshdesk.com/api/v2/...`, which prevents callers from choosing an arbitrary outbound host.

Freshdesk API access follows the permissions of the agent identified by the API key. Use a dedicated least-privileged agent where possible and give it only the helpdesk access required by enabled tools. Never expose the key to the LLM, tool arguments, logs, examples, or source control.

## Environment variables

See `.env.example`.

- `FRESHDESK_DOMAIN`: required Freshdesk subdomain.
- `FRESHDESK_API_KEY`: required secret.
- `FRESHDESK_TIMEOUT_MS`: per-request timeout, default 15 seconds, range 1-60 seconds.
- `FRESHDESK_APPROVAL_MODE`: `required` by default; `disabled` only when an external policy engine provides equivalent approval.
- `FRESHDESK_APPROVED_ACTIONS`: comma-separated write actions currently approved by an operator.

Approval state is process configuration, not a tool parameter, so an agent cannot self-approve inside its request.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `freshdesk.account.get` | REST `GET /account` | READ | No |
| `freshdesk.ticket.list` | REST `GET /tickets` | READ | No |
| `freshdesk.ticket.get` | REST `GET /tickets/{id}` | READ | No |
| `freshdesk.ticket.search` | REST `GET /search/tickets` | READ | No |
| `freshdesk.ticket.create` | REST `POST /tickets` | WRITE | Required by default |
| `freshdesk.ticket.update` | REST `PUT /tickets/{id}` | WRITE | Required by default |
| `freshdesk.conversation.list` | REST `GET /tickets/{id}/conversations` | READ | No |
| `freshdesk.ticket.reply` | REST `POST /tickets/{id}/reply` | HIGH_RISK | Required |
| `freshdesk.ticket.note.create` | REST `POST /tickets/{id}/notes` | WRITE | Required |
| `freshdesk.contact.list` | REST `GET /contacts` | READ | No |
| `freshdesk.contact.get` | REST `GET /contacts/{id}` | READ | No |
| `freshdesk.contact.search` | REST `GET /contacts/autocomplete` | READ | No |
| `freshdesk.contact.create` | REST `POST /contacts` | WRITE | Required by default |
| `freshdesk.contact.update` | REST `PUT /contacts/{id}` | WRITE | Required by default |
| `freshdesk.agent.list` | REST `GET /agents` | READ | No |
| `freshdesk.group.list` | REST `GET /groups` | READ | No |

No delete, bulk-delete, merge, agent-administration, automation-rule mutation, mailbox mutation, credential-management, or arbitrary HTTP-request tool is exposed.

## Real-world workflows

A support triage agent can use:

```text
freshdesk.ticket.search
  -> freshdesk.ticket.get
  -> freshdesk.conversation.list
  -> recommend next action
  -> operator approval
  -> freshdesk.ticket.update or freshdesk.ticket.reply
```

A customer lookup workflow can use:

```text
freshdesk.contact.search
  -> freshdesk.contact.get
  -> freshdesk.ticket.search
```

A routing workflow can use:

```text
freshdesk.group.list
  -> freshdesk.agent.list
  -> recommend assignee/group
  -> operator approval
  -> freshdesk.ticket.update
```

## Input validation

- Freshdesk subdomains are syntax-validated and cannot contain dots, schemes, paths, or ports.
- IDs must be positive integers.
- List pages are bounded; page size is capped at 100, matching Freshdesk's documented maximum.
- Deep pagination is bounded because Freshdesk recommends avoiding page numbers above 500.
- Search strings, ticket subjects, descriptions, replies, notes, tags, contact fields, and email arrays have explicit size limits.
- Ticket status and priority values are restricted to the standard API values exposed by this connector.
- Update tools reject empty updates.
- No tool accepts a raw URL or arbitrary provider request.

Provider-returned tickets, messages, names, descriptions, tags, and other text are untrusted data. They must never be interpreted as instructions that can modify connector policy or permissions.

## Permission and approval model

Default policy:

```text
READ       -> automatic, subject to Freshdesk agent permission
WRITE      -> explicit operator approval by default
HIGH_RISK  -> explicit operator approval
DESTRUCTIVE -> not exposed
```

For example, temporarily approve ticket creation with:

```text
FRESHDESK_APPROVED_ACTIONS=freshdesk.ticket.create
```

Multiple approved actions may be comma-separated. Remove temporary approvals after the intended change window.

`freshdesk.ticket.reply` is HIGH_RISK because it sends external communication to a customer. Public notes may also notify users depending on Freshdesk behavior and configuration, so note creation is approval-gated as well.

## Rate limits and reliability

Freshdesk documents account-wide API rate limits that vary by plan. Current documentation lists minute-level plan limits and notes that trial accounts default to 50 calls per minute. Freshdesk also returns rate-limit information in response headers including:

- `X-RateLimit-Total`
- `X-RateLimit-Remaining`
- `X-RateLimit-Used-CurrentRequest`
- `Retry-After` on throttling

The connector does not hard-code a universal quota.

For read-only GET requests:

- at most three total attempts are made;
- HTTP 429 honors `Retry-After`, with each wait capped to 10 seconds;
- transient network/timeout failures use bounded exponential backoff.

Write requests are never automatically retried. This prevents duplicate ticket creation, duplicate replies, duplicate notes, or repeated updates when the provider outcome is uncertain.

Every request has an abort timeout. Authentication, authorization, validation, and ordinary provider errors fail without retrying.

## Error handling

Expected categories include:

- configuration validation errors for missing/invalid domain or API key;
- `APPROVAL_REQUIRED` for unapproved writes;
- `VALIDATION_ERROR` for empty updates or invalid tool arguments;
- `NETWORK_OR_TIMEOUT` after bounded read retries;
- `FreshdeskApiError` containing provider HTTP status and response details.

Provider errors are surfaced without intentionally including the configured API key.

## Security considerations

- Credentials exist only in connector configuration and outbound authorization headers.
- The LLM never receives raw provider credentials through tool schemas.
- The outbound Freshdesk host is derived from a validated subdomain; arbitrary URLs are impossible through tool inputs.
- There is no generic `execute_request`, raw endpoint, or unrestricted proxy tool.
- Read results are untrusted content and cannot alter approvals, permissions, or runtime configuration.
- Writes require approval outside the model request.
- No destructive operations are registered.
- Writes are not retried automatically.
- Use a dedicated low-privilege Freshdesk agent/API key for production automation.
- Ticket and contact data may contain personal or confidential information; minimize logs and downstream persistence.

## Testing

Unit tests require no live Freshdesk account. They cover:

- missing credentials;
- domain/SSRF validation;
- approved and denied writes;
- fixed Freshdesk host construction;
- API-key Basic authentication;
- no write retries;
- bounded 429 read retries;
- no retry for authorization errors;
- expected MCP tool registration and absence of a generic request escape hatch.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for sample inputs, risk classification, and approval requirements.

## MCP client configuration

Any MCP client that can launch a local stdio server can run the built connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/freshdesk/dist/src/server.js"],
  "env": {
    "FRESHDESK_DOMAIN": "acme-support",
    "FRESHDESK_API_KEY": "provided-by-secret-manager"
  }
}
```

Do not check real credentials into MCP client configuration.

## Limitations

- This connector intentionally covers a focused operational subset rather than the entire Freshdesk API.
- Freshworks' official Developer MCP is not used for helpdesk operations because its documented purpose is app-development/publishing workflow automation.
- Authentication uses Freshdesk API keys; this package does not implement a separate OAuth authorization-code flow.
- Ticket fields are a practical typed subset and do not expose unrestricted custom-field JSON.
- Attachments are not implemented because safe multipart upload and content scanning require a separate explicit design.
- Destructive APIs, bulk mutations, contact deletion/merge, agent administration, billing-sensitive settings, mailbox configuration, and automation-rule changes are intentionally unavailable.
