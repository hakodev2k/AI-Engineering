# Intercom MCP/API Connector

Reusable MCP server for Intercom customer-support workflows. It exposes a stable provider-scoped tool contract for contacts, conversations, Help Centers, and articles while keeping Intercom credentials inside the connector process.

## Transport strategy

Intercom provides an official hosted MCP server at `https://mcp.intercom.com/mcp` using Streamable HTTP. Its documentation currently states that the MCP server is supported only for US-hosted workspaces. It supports OAuth or bearer-token authentication and currently exposes six read/search tools covering conversations and contacts: universal `search`/`fetch`, `search_conversations`, `get_conversation`, `search_contacts`, and `get_contact`.

This connector uses Intercom's official REST API for its implemented tool contract. REST is the safer and more reusable transport here because it supports US, EU, and AU regional workspaces and also provides the required controlled write operations such as replying, adding notes, assigning, closing/reopening conversations, and updating contacts. For a US-only workflow that needs only conversation/contact reads, using Intercom's official remote MCP server directly is preferred.

The connector does not proxy or auto-discover upstream MCP tools, so a provider-side MCP tool addition cannot silently expand this connector's permissions.

Official sources researched for this implementation:

- Intercom official MCP documentation repository: https://github.com/intercom/intercom-mcp-server
- Intercom REST API reference 2.16: https://developers.intercom.com/docs/references/rest-api/api.intercom.io
- REST API overview and regional hosting: https://developers.intercom.com/docs/build-an-integration/learn-more/rest-apis
- Contacts API: https://developers.intercom.com/docs/references/rest-api/api.intercom.io/contacts
- Conversations API: https://developers.intercom.com/docs/references/rest-api/api.intercom.io/conversations
- Help Center API: https://developers.intercom.com/docs/references/rest-api/api.intercom.io/help-center
- Rate limiting: https://developers.intercom.com/docs/references/1.0/rest-api/errors/rate-limiting
- Webhooks: https://developers.intercom.com/docs/webhooks

## Runtime

- Node.js 20+
- TypeScript
- MCP SDK over stdio
- Native `fetch` for Intercom REST calls

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

The REST API uses bearer authentication:

```text
Authorization: Bearer <INTERCOM_ACCESS_TOKEN>
Intercom-Version: 2.16
```

Set `INTERCOM_ACCESS_TOKEN` through a secrets manager or process environment. The token is loaded only in `src/config.ts` and attached to outbound Intercom requests in `src/client.ts`; it is never part of an MCP tool schema and should never be placed in an LLM prompt.

For public Intercom apps, use an OAuth access token with only the permissions required by the enabled tools. For private apps, use the app access token with equivalent least privilege.

## Regional hosting

Intercom REST supports three regional API origins:

| Workspace region | Base URL |
|---|---|
| US | `https://api.intercom.io` |
| EU | `https://api.eu.intercom.io` |
| AU | `https://api.au.intercom.io` |

Set `INTERCOM_API_BASE_URL` to the correct HTTPS origin. The connector rejects non-HTTPS origins to reduce credential-leak and SSRF risk.

Intercom's official hosted MCP server is currently documented as US-workspace-only, which is the main reason this package uses REST for its stable cross-region contract.

## Permissions

Exact app permission labels can vary with Intercom app configuration, but the token must have only the data access needed for the tools enabled in your deployment:

| Capability | Required access |
|---|---|
| `admin.me` | Read authenticated admin |
| Contact search/get | Read contacts |
| Contact update | Write contacts |
| Conversation list/get | Read conversations |
| Reply/note/assign/close/reopen | Write conversations |
| Help Center/article reads | Read Help Center/content |

Do not grant workspace-administration, billing, app-management, or unrelated permissions to a token used only for this connector.

## Environment variables

See `.env.example`.

- `INTERCOM_ACCESS_TOKEN`: required bearer/OAuth access token.
- `INTERCOM_API_BASE_URL`: regional API origin, default `https://api.intercom.io`.
- `INTERCOM_API_VERSION`: default `2.16`.
- `INTERCOM_TIMEOUT_MS`: request timeout, 1–60 seconds, default 15 seconds.
- `INTERCOM_APPROVAL_MODE`: `required` by default. Set `disabled` only when an external policy engine provides equivalent approval.
- `INTERCOM_APPROVED_ACTIONS`: comma-separated write actions approved by an operator.
- `INTERCOM_ALLOW_DESTRUCTIVE`: reserved strong-approval gate; defaults to `false`.

Approval is connector configuration, not a tool-call parameter. An agent cannot self-approve by including an `approved=true` field.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `intercom.admin.me` | REST `GET /me` | READ | No |
| `intercom.contact.search` | REST `POST /contacts/search` | READ | No |
| `intercom.contact.get` | REST `GET /contacts/{id}` | READ | No |
| `intercom.contact.update` | REST `PUT /contacts/{id}` | WRITE | Required by default |
| `intercom.conversation.list` | REST `GET /conversations` | READ | No |
| `intercom.conversation.get` | REST `GET /conversations/{id}` | READ | No |
| `intercom.conversation.reply` | REST `POST /conversations/{id}/reply` | HIGH_RISK | Explicit approval |
| `intercom.conversation.note.add` | REST `POST /conversations/{id}/reply` | WRITE | Required by default |
| `intercom.conversation.assign` | REST `POST /conversations/{id}/parts` | WRITE | Required by default |
| `intercom.conversation.close` | REST `POST /conversations/{id}/parts` | WRITE | Required by default |
| `intercom.conversation.reopen` | REST `POST /conversations/{id}/parts` | WRITE | Required by default |
| `intercom.help_center.list` | REST `GET /help_center/help_centers` | READ | No |
| `intercom.article.search` | REST `GET /articles/search` | READ | No |

The connector intentionally exposes a narrow typed subset instead of a generic API-request tool.

## Official MCP availability

Intercom's hosted MCP server currently provides these read-focused capabilities for US-hosted workspaces:

- universal search across contacts and conversations;
- universal fetch by MCP resource ID;
- conversation search/get;
- contact search/get.

It supports OAuth authentication and bearer-token authentication. The recommended endpoint is Streamable HTTP at `https://mcp.intercom.com/mcp`; legacy SSE is deprecated.

This connector does not forward credentials to that remote MCP server. This avoids hidden tool-surface expansion and allows the same MCP tool contract to work for EU/AU workspaces using Intercom's official regional REST endpoints.

## Architecture

```text
MCP client
   |
   v
src/server.ts          strict tool schemas + handlers
   |
   +--> src/config.ts  credential loading + approval policy
   |
   +--> src/client.ts  HTTPS REST transport + retry/error policy
   |
   v
Intercom REST API 2.16
```

Provider-returned conversation bodies, contact fields, article content, custom attributes, and errors are untrusted data. They are returned as data only and must not be interpreted as connector policy or tool instructions.

## Approval model

Default policy:

```text
READ         -> automatic
WRITE        -> external operator approval by default
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> explicit strong approval and disabled-by-default gate
```

Example: temporarily approve a contact update:

```text
INTERCOM_APPROVED_ACTIONS=intercom.contact.update
```

External customer replies require their exact action to be approved:

```text
INTERCOM_APPROVED_ACTIONS=intercom.conversation.reply
```

Remove temporary approvals after the intended change window.

## Reliability and rate limits

Intercom documents REST rate-limit response headers including:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

As currently documented, default API limits are measured per app/workspace and distributed across 10-second windows. HTTP `429` indicates throttling.

The connector retries only read-only GET operations, up to three total attempts. On 429 it honors `Retry-After` when present, otherwise `X-RateLimit-Reset`, with each wait capped at 10 seconds. Other transient read network failures use bounded exponential backoff.

Mutation requests are never automatically retried. This avoids duplicate customer replies, duplicate notes, repeated assignment changes, or uncertain repeated state changes.

Every request has a configurable timeout. Authentication/authorization/provider errors fail immediately.

List and search tools bound page sizes to reduce accidental high-volume requests.

## Error handling

Expected categories include:

- configuration validation errors for missing token or invalid API origin;
- `APPROVAL_REQUIRED` for unapproved writes;
- `DESTRUCTIVE_DISABLED` for strong-gated destructive operations if added later;
- `VALIDATION_ERROR` for ambiguous or empty mutations;
- `NETWORK_OR_TIMEOUT` after bounded read retries;
- `IntercomApiError` carrying provider HTTP status and response body.

Secrets are never intentionally included in error messages.

## Security considerations

- Credentials never appear in MCP tool inputs or outputs.
- API origin must be HTTPS.
- Tool handlers cannot choose arbitrary URLs or endpoints.
- There is no `execute_any_request`, raw HTTP, or generic endpoint tool.
- IDs use a conservative character allowlist and bounded length.
- Search/filter strings, message bodies, custom attributes, pagination, and article searches are bounded.
- Writes require approval controlled outside the model request.
- External customer messages are explicitly classified HIGH_RISK.
- Writes are not retried automatically.
- Provider content is treated as untrusted data to reduce prompt-injection risk.
- The connector never modifies token scopes or attempts permission escalation.
- The official remote MCP server is not auto-discovered or dynamically proxied.

## Webhooks

Intercom supports webhooks for real-time events such as contact and conversation activity. Webhook subscription configuration is intentionally not exposed as an MCP tool because changing callback URLs and event subscriptions can expand data exposure.

For webhook consumers, validate provider requests, respond promptly, deduplicate events, and follow Intercom's documented retry/throttling behavior. Keep webhook secrets and verification logic outside the LLM context.

## Tests

Unit tests use mocks and require no live Intercom credentials. They cover:

- missing credentials;
- HTTPS-only API-origin validation;
- approved and denied write actions;
- bearer header and pinned Intercom API version;
- provider authorization failures;
- no automatic retries for writes;
- bounded 429 retry for reads;
- expected MCP tool registration;
- absence of generic request escape hatches.

Run:

```bash
npm test
npm run typecheck
```

## Usage examples

See `examples/tool-calls.md` for tool inputs, output expectations, permissions, and approval classifications.

## MCP client configuration

Any MCP client capable of launching a local stdio server can run the built connector. Example configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/intercom/dist/src/server.js"],
  "env": {
    "INTERCOM_ACCESS_TOKEN": "provided-by-secret-manager",
    "INTERCOM_API_BASE_URL": "https://api.intercom.io"
  }
}
```

Do not commit a real access token into MCP client configuration.

For US-hosted workspaces that only require contact/conversation reads, clients with authenticated remote-MCP support can instead connect directly to Intercom's official endpoint at `https://mcp.intercom.com/mcp` and use its OAuth flow.

## Limitations

- This is a curated operational surface, not a complete Intercom API wrapper.
- The official Intercom MCP server is documented but not proxied by this package.
- Intercom's official MCP server is currently documented as US-hosted-workspace-only.
- This connector uses REST for all implemented tools to preserve cross-region behavior and stable approval semantics.
- Contact update exposes only common profile fields and primitive custom attributes.
- Conversation creation, deletion, merging, snoozing, ticket mutation, admin management, app management, billing, and permission changes are intentionally omitted.
- Webhook subscription administration is intentionally omitted.
- The connector does not automatically discover newly added provider capabilities.
