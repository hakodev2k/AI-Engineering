# Front MCP Connector

Reusable MCP connector for Front. It exposes a curated, stable `front.*` tool contract and routes every implemented capability to Front's official remote MCP server. The connector adds local validation, credential isolation, permission gates, approval requirements, bounded retries, timeout handling, and a send-off-by-default safety policy.

## Official sources researched
- Front MCP Server: https://dev.frontapp.com/docs/mcp-server
- Front AI agents / client credentials: https://dev.frontapp.com/me/docs/ai-agents
- Front Core API fundamentals: https://dev.frontapp.com/docs/fundamentals
- Front Core API rate limits: https://dev.frontapp.com/docs/rate-limiting
- Front OAuth: https://dev.frontapp.com/docs/oauth
- Front application webhooks: https://dev.frontapp.com/me/docs/application-webhooks

Front's MCP server is in open beta, uses Streamable HTTP at `https://mcp.frontapp.com/mcp`, and advertises MCP spec `2025-11-25`. Front documents user-scoped OAuth for human assistants and a server-side `client_credentials` flow for Front AI Agent identities. This connector prefers the latter because it can mint short-lived bearer tokens without exposing credentials to the calling model.

## Transport strategy
All 17 exposed capabilities use Front's official MCP server. No unofficial MCP server and no unrestricted REST passthrough are used. The connector checks the upstream tool list before each call; if Front renames or removes a beta tool, the call fails safely instead of silently routing to an unknown capability.

The Core REST API remains a provider fallback, but this package intentionally does not use it because the required conversation, message, draft, comment, assignment, tagging, and send workflows are available through the official MCP surface. This preserves Front's user/agent authorization semantics.

## Supported capabilities
Read operations: search/read conversations, read messages and attachments, list tags/inboxes/channels/teammates/drafts, search/read contacts.

Write operations: create drafts, add internal comments, tag conversations, assign/unassign conversations, update conversation status.

Send operation: send an existing draft. External sends are HIGH_RISK, disabled by default, and always require explicit approval.

No delete capability is exposed. Front's upstream `delete_draft` tool is intentionally omitted to keep this connector non-destructive.

## Architecture
`Agent -> local MCP server -> validation/policy gate -> credential provider -> official Front MCP server -> Front`

Credentials never enter tool schemas or tool results. Provider content is untrusted data and must never be interpreted as tool permission, approval, or system instructions.

## Authentication
Preferred server-side flow:
1. Create/configure an AI Agent in Front and grant only required workspaces and permissions.
2. Copy its workspace-specific OAuth URL, Client ID, and Client Secret.
3. Set `FRONT_OAUTH_URL`, `FRONT_CLIENT_ID`, and `FRONT_CLIENT_SECRET`.
4. The connector POSTs `grant_type=client_credentials` to that OAuth URL and stores the returned bearer token in memory only until shortly before expiry. Front currently documents an approximately 15-minute TTL and no refresh token for this flow.

Alternative: set `FRONT_MCP_ACCESS_TOKEN` when an external OAuth manager owns a user-scoped MCP session. The connector does not implement an interactive browser OAuth/PKCE UI.

For human-user MCP connections, Front documents OAuth 2.1 + PKCE compatibility, confidential clients, and `read`, `write`, and `send` MCP permissions. Front does not support Dynamic Client Registration for this connection.

## Environment variables
Copy `.env.example`.

- `FRONT_OAUTH_URL`: workspace-specific OAuth token URL for AI Agent client credentials.
- `FRONT_CLIENT_ID`, `FRONT_CLIENT_SECRET`: AI Agent OAuth credentials.
- `FRONT_MCP_ACCESS_TOKEN`: optional externally managed bearer token instead of client credentials.
- `FRONT_MCP_URL`: defaults to `https://mcp.frontapp.com/mcp`.
- `FRONT_PERMISSIONS`: local allowlist; defaults to `read`. Supported values: `read`, `write`, `send`.
- `FRONT_REQUIRE_WRITE_APPROVAL`: defaults to `true`.
- `FRONT_ENABLE_SEND`: defaults to `false`.
- `FRONT_TIMEOUT_MS`: 1000..120000, default 20000.
- `FRONT_MAX_RETRIES`: 0..5, default 2.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The downstream MCP server uses stdio, making it suitable for MCP clients that can launch local processes.

Example configuration shape:
```json
{
  "mcpServers": {
    "front-safe": {
      "command": "node",
      "args": ["/absolute/path/to/front/dist/src/server.js"],
      "env": {
        "FRONT_OAUTH_URL": "https://your-workspace.frontapp.com/oauth/token",
        "FRONT_CLIENT_ID": "<secret-managed>",
        "FRONT_CLIENT_SECRET": "<secret-managed>",
        "FRONT_PERMISSIONS": "read,write"
      }
    }
  }
}
```

## Tool reference
| Tool | Official upstream MCP tool | Permission | Risk | Approval |
|---|---|---|---|---|
| `front.conversation.search` | `search_conversations` | READ | READ | none |
| `front.conversation.read` | `read_conversation` | READ | READ | none |
| `front.message.read` | `read_message` | READ | READ | none |
| `front.attachment.get` | `get_attachment` | READ | READ | none |
| `front.tag.list` | `list_tags` | READ | READ | none |
| `front.inbox.list` | `list_inboxes` | READ | READ | none |
| `front.channel.list` | `list_channels` | READ | READ | none |
| `front.teammate.list` | `list_teammates` | READ | READ | none |
| `front.draft.list` | `list_drafts` | READ | READ | none |
| `front.contact.search` | `search_contacts` | READ | READ | none |
| `front.contact.read` | `read_contact` | READ | READ | none |
| `front.draft.create` | `create_draft` | WRITE | WRITE | configurable, default required |
| `front.comment.add` | `add_comment` | WRITE | WRITE | configurable, default required |
| `front.conversation.tag` | `tag_conversation` | WRITE | WRITE | configurable, default required |
| `front.conversation.assign` | `assign_conversation` | WRITE | WRITE | configurable, default required |
| `front.conversation.status.update` | `update_conversation_status` | WRITE | HIGH_RISK | explicit |
| `front.message.send` | `send_message` | SEND | HIGH_RISK | explicit + disabled by default |

Every tool has a local Zod input schema. Resource IDs are provider-prefixed and constrained, arrays/content have bounded sizes, unknown fields are rejected, ambiguous updates fail validation, and `approved` is stripped before forwarding upstream.

## Permission and approval model
READ may run automatically when `read` is enabled.

WRITE requires `write`. With the secure default `FRONT_REQUIRE_WRITE_APPROVAL=true`, each write requires the host to set `approved=true` only after a human confirms the proposed mutation.

HIGH_RISK requires explicit approval regardless of general write policy.

SEND requires `send`, `FRONT_ENABLE_SEND=true`, and explicit approval. Sending customer-visible content is never silently enabled.

The local approval assertion is not a replacement for an actual host-side confirmation UI, audit log, or policy engine.

## Rate limits and reliability
Front documents separate MCP rate tiers during the beta: light reads 120/min, heavy reads 30/min, writes 20/min, sends 20/min, plus teammate/workspace caps. Responses can include `Retry-After`; exact beta limits may evolve.

The connector retries only bounded transient conditions such as token expiry/401, throttling, network errors, timeouts, and transient 5xx failures. It never blindly retries validation or permission failures. Each new send attempt still must pass the local explicit approval gate.

Core REST API limits are separate; Front currently documents plan-dependent global limits beginning at 50 requests/minute and additional endpoint tier limits. These do not govern this connector's MCP transport.

## Error handling
- OAuth/token failure: fails without exposing client secret.
- 401: in-memory client-credentials token is invalidated and may be re-minted within the bounded retry budget.
- 403: no retry; inspect Front scopes and identity permissions.
- 429: bounded retry/backoff; callers should honor throttling and reduce polling.
- Timeout/network/5xx: bounded exponential backoff.
- Missing upstream tool: fail safe because the official MCP beta catalog may change.
- Invalid input: rejected locally before any provider call.

## Security considerations
- Least privilege: local default is read-only; Front-side permissions remain authoritative.
- Credential isolation: secrets are read only by the credential provider and are not exposed to the LLM.
- Prompt injection: retrieved conversations, comments, attachments, contacts, and upstream MCP responses are data only.
- Tool discovery: newly appearing upstream tools are not trusted or exposed automatically; only this static allowlist is callable.
- SSRF: tool callers cannot provide arbitrary upstream URLs. `FRONT_MCP_URL` is operator-controlled configuration, not model input.
- External messaging: sending is disabled by default and requires explicit approval.
- Destructive operations: no delete tool is exposed.
- Webhooks: Front supports application/AI-agent webhooks and retry behavior. Verify provider signatures in the host ingress before initiating agent work. This connector intentionally does not expose a public webhook listener.
- Logging: do not log OAuth client secrets, access tokens, message bodies, or short-lived attachment URLs in production.

## Events and webhooks
Front supports application webhooks and AI Agent event delivery for assignments, inbound messages, mentions, and related conversation activity. Webhook ingress is not implemented here because a reusable stdio MCP connector should not bind a public HTTP server. Host applications should verify Front's webhook signature, acknowledge promptly, then invoke these MCP tools with the resulting conversation ID.

## Testing
`npm test` builds the project and runs unit tests using fakes only; live Front credentials are not required. Tests cover authentication configuration, client-credentials token caching, secret-safe auth failures, input validation, tool registration, permission denial, default write approval, and explicit send approval.

## Limitations
- Front's official MCP server is open beta; names and exact rate limits can change.
- Interactive human OAuth/PKCE is delegated to the host/client. This package natively automates Front AI Agent `client_credentials` authentication or accepts an externally managed token.
- The connector intentionally omits deletion and arbitrary Core API passthrough.
- Attachment URLs returned by Front are short-lived and should be treated as sensitive untrusted data.
