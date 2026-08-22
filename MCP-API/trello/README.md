# Trello MCP/API Connector

Reusable MCP server for Trello task-management workflows. It exposes a stable provider-scoped tool contract for boards, lists, cards, comments, and webhooks while keeping Trello credentials inside the connector process.

## Transport strategy

Trello now provides an official cloud MCP server at `https://mcp.trello.com/v1`. It uses OAuth 2.0, is workspace-scoped, supports reading/searching Trello data and performing permitted actions, and intentionally does not expose permanent destructive deletes. Trello documents support for MCP-capable clients including ChatGPT, Claude, Cursor, VS Code, and Gemini CLI.

This package uses Trello's official REST API for its implemented tools. The REST transport provides a narrow deterministic allowlist, explicit approval gates, predictable mutation semantics, and testable rate-limit behavior. The official Trello MCP server remains the preferred direct option when a client can use Trello's interactive OAuth flow and its workspace-scoped permission model.

Official sources researched:

- Trello MCP: https://support.atlassian.com/trello/docs/connect-trello-to-ai-assistants-with-trello-mcp/
- Trello REST API introduction: https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/
- Authorization: https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/
- Rate limits: https://developer.atlassian.com/cloud/trello/guides/rest-api/rate-limits/
- Webhooks: https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/
- REST reference: https://developer.atlassian.com/cloud/trello/rest/

## Runtime

- Node.js 20+
- TypeScript
- Model Context Protocol SDK over stdio
- Native `fetch` for Trello REST calls

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

REST calls require a Trello API key plus a user token. Trello supports its authorization route and OAuth 1.0 for REST authorization. This connector expects credentials to be provisioned externally and injected through environment variables:

```text
TRELLO_API_KEY=
TRELLO_TOKEN=
```

The token must never be sent to the model. It is added only by `src/client.ts` to outbound Trello requests.

For new interactive integrations, prefer the official Trello MCP OAuth 2.0 flow when possible because it is workspace-scoped and presents explicit consent to the user.

## Environment variables

See `.env.example`.

- `TRELLO_API_KEY`: required.
- `TRELLO_TOKEN`: required.
- `TRELLO_API_BASE_URL`: defaults to `https://api.trello.com/1`.
- `TRELLO_TIMEOUT_MS`: request timeout, default 15 seconds.
- `TRELLO_APPROVAL_MODE`: `required` by default.
- `TRELLO_APPROVED_ACTIONS`: comma-separated externally approved write actions.
- `TRELLO_ALLOW_ARCHIVE`: `false` by default; separately enables archive actions after approval.

Approval state is connector configuration, not a tool argument, so an agent cannot self-approve.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `trello.member.get` | REST | READ | No |
| `trello.board.list` | REST | READ | No |
| `trello.board.get` | REST | READ | No |
| `trello.board.create` | REST | WRITE | Required by default |
| `trello.list.list` | REST | READ | No |
| `trello.list.create` | REST | WRITE | Required by default |
| `trello.card.search` | REST | READ | No |
| `trello.card.get` | REST | READ | No |
| `trello.card.create` | REST | WRITE | Required by default |
| `trello.card.update` | REST | WRITE | Required by default |
| `trello.card.move` | REST | WRITE | Required by default |
| `trello.card.comment` | REST | WRITE / external communication | Required |
| `trello.card.archive` | REST | HIGH_RISK reversible | Required + archive opt-in |
| `trello.webhook.create` | REST | WRITE | Required |

Permanent destructive delete operations are intentionally not exposed.

## Real-world workflows

Typical agent flow:

```text
Search cards
  -> inspect a card
  -> inspect its board/lists
  -> create or update a card
  -> move it between lists
  -> optionally comment
```

For event-driven automation:

```text
Choose board/card model
  -> create HTTPS webhook
  -> validate incoming webhook in the receiving service
  -> treat webhook content as untrusted data
```

## Architecture

```text
MCP client
   |
   v
src/server.ts        typed MCP tools + validation
   |
   +--> src/config.ts   credential loading + approval policy
   |
   +--> src/client.ts   Trello REST transport + bounded retries
   |
   v
Trello REST API
```

The connector does not proxy arbitrary upstream MCP tools or arbitrary Trello endpoints.

## Permission model

Default policy:

```text
READ       -> automatic
WRITE      -> external operator approval by default
HIGH_RISK  -> explicit approval + separate feature opt-in
DESTRUCTIVE-> not implemented
```

Example temporary approval:

```text
TRELLO_APPROVED_ACTIONS=trello.card.create,trello.card.move
```

Archiving additionally requires:

```text
TRELLO_APPROVED_ACTIONS=trello.card.archive
TRELLO_ALLOW_ARCHIVE=true
```

Remove temporary approvals after the intended change window.

## Rate limits and reliability

Trello currently documents limits of 300 requests per 10 seconds per API key and 100 requests per 10 seconds per token. Requests to `/1/members/` also have a route-specific limit of 100 requests per 900 seconds. Trello returns HTTP 429 when limits are exceeded and provides rate-limit headers including interval, maximum, and remaining counts.

The connector retries read-only GET requests up to three total attempts for transient network/timeout failures or throttling. Writes are never retried automatically because their remote outcome may be uncertain. Authentication, authorization, validation, and ordinary provider errors fail immediately.

List/search tools are bounded to avoid uncontrolled fan-out. Prefer Trello nested resources and webhooks instead of high-frequency polling.

## Security considerations

- Credentials are not part of any MCP input schema.
- The model cannot choose an arbitrary outbound host.
- The connector exposes no generic raw HTTP tool.
- Card descriptions, comments, board text, member data, and webhook payloads are untrusted content, not instructions.
- Writes are controlled by external approval configuration.
- Archive is separately disabled by default.
- Permanent delete operations are not implemented.
- Webhook callback URLs must use HTTPS.
- Provider errors are surfaced without intentionally including configured credentials.
- Retries are bounded and write operations are not retried.
- Inputs use bounded strings, IDs, filters, and search limits.

Webhook receivers should independently validate Trello webhook authenticity according to Trello's webhook documentation before acting on received events.

## Errors

Expected connector errors include:

- environment validation failure for missing credentials;
- `APPROVAL_REQUIRED` for writes without operator approval;
- `ARCHIVE_DISABLED` for archive without explicit opt-in;
- `NETWORK_OR_TIMEOUT` after bounded read retries;
- `TrelloApiError` containing provider status and response details;
- Zod validation errors for malformed tool inputs.

## Testing

Unit tests require no live Trello credentials. They cover:

- missing credentials;
- approved and denied writes;
- archive default denial;
- credential isolation inside the transport;
- authorization failures;
- no retry for writes;
- bounded retry for throttled reads;
- intended tool registration;
- absence of generic request or delete escape hatches.

Run:

```bash
npm test
```

## Examples

See `examples/tool-calls.md` for input shapes, risk classes, and approval requirements.

## MCP client configuration

Any client capable of launching a local stdio MCP server can run this connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/trello/dist/src/server.js"],
  "env": {
    "TRELLO_API_KEY": "provided-by-secret-manager",
    "TRELLO_TOKEN": "provided-by-secret-manager"
  }
}
```

Do not store real credentials in source-controlled client configuration.

Clients that support remote MCP and browser OAuth can alternatively connect directly to the official Trello MCP endpoint at `https://mcp.trello.com/v1`.

## Limitations

- This is intentionally not a complete Trello REST wrapper.
- The package does not implement the official Trello MCP OAuth flow; it documents and prefers that flow for direct remote-MCP use.
- REST authentication here uses API key + user token rather than OAuth 2.0.
- Permanent delete operations are not exposed.
- Board/list/card administration is intentionally limited to common task workflows.
- Webhook creation is exposed, but webhook hosting and validation belong to the caller's service.
- Enterprise administration, billing, Power-Up administration, and workspace membership changes are not exposed.
