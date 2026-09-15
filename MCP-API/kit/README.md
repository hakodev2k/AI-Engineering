# Kit MCP Connector

Reusable local MCP facade for Kit (formerly ConvertKit), backed by Kit's official remote MCP server.

## Upstream and research

Kit publishes the official account MCP at `https://app.kit.com/mcp` and a separate developer-documentation MCP at `https://developers.kit.com/mcp`. Kit documents 65+ account tools and OAuth-based authorization. Official references:

- https://help.kit.com/en/articles/14827557-how-to-connect-the-kit-mcp-to-your-ai-tools
- https://help.kit.com/en/articles/15072804-kit-mcp-tools
- https://kit.com/ai/mcp

The account MCP is the preferred transport because Kit officially exposes the required account operations there, including subscribers, tags, sequences, broadcasts, analytics, and webhooks. No unofficial MCP server is used. This package does not add a REST fallback because the selected capabilities are already documented on the official MCP and routing through a second transport would widen credentials and permissions without adding required coverage.

## Capabilities

The facade deliberately exposes a smaller stable allowlist rather than all discovered upstream tools: account lookup; subscriber list/get/create/update/tag/unsubscribe; tag list; sequence list; broadcast list/get/stats/create/update; and webhook list. Public sending/scheduling, webhook creation, bulk destructive changes, deletes, sequence deletion, custom-field deletion, and arbitrary upstream calls are intentionally not exposed.

Kit's official tool reference classifies reads as read-only, `unsubscribe` and deletes as destructive, and several writes as open-world. Kit also documents that destructive/open-world operations may return an in-app confirmation deep link rather than executing immediately.

## Architecture

`MCP client -> local stdio server -> policy/validation -> KitClient -> official Kit remote MCP -> Kit account`

Credentials are read only by `KitClient`; they are never tool parameters and are never returned to the model. Third-party content returned by Kit is data, not executable instructions.

## Authentication

Kit's official MCP uses OAuth. Complete Kit's OAuth authorization in a trusted MCP/OAuth client and provide the resulting access token to this connector through a secure runtime secret named `KIT_MCP_ACCESS_TOKEN`. Do not put tokens in prompts, source control, examples, or logs. Revoke access in Kit when no longer required.

Required environment:

- `KIT_MCP_URL` defaults to the official `https://app.kit.com/mcp`; normally do not change it.
- `KIT_MCP_ACCESS_TOKEN` OAuth bearer token; required.
- `KIT_REQUEST_TIMEOUT_MS` defaults to 20000.
- `KIT_APPROVAL_MODE=required` makes WRITE tools require approval; hosts with their own approval gate may set another value. DESTRUCTIVE always requires explicit approval.

The upstream OAuth grant controls the actual account permissions. This facade cannot elevate them.

## Install and run

```bash
npm install
npm run build
KIT_MCP_ACCESS_TOKEN='...' npm start
```

Configure any MCP client that supports local stdio servers to execute `node dist/src/server.js`. Compatibility depends on the client supporting standard MCP stdio; no client-specific private API is required.

## Tool contracts

| Tool | Risk | Approval |
|---|---|---|
| kit.account.get | READ | no |
| kit.subscriber.list | READ | no |
| kit.subscriber.get | READ | no |
| kit.subscriber.create | WRITE | configurable; default required |
| kit.subscriber.update | WRITE | configurable; default required |
| kit.subscriber.tag | WRITE | configurable; default required |
| kit.subscriber.unsubscribe | DESTRUCTIVE | required |
| kit.tag.list | READ | no |
| kit.sequence.list | READ | no |
| kit.broadcast.list | READ | no |
| kit.broadcast.get | READ | no |
| kit.broadcast.stats | READ | no |
| kit.broadcast.create | WRITE | configurable; default required |
| kit.broadcast.update | WRITE | configurable; default required |
| kit.webhook.list | READ | no |

Schemas constrain IDs, email addresses, pagination size, allowed enrichment fields, subject/body sizes, and approval metadata. There is no arbitrary URL/body request tool.

## Reliability and rate limits

Every upstream call has a bounded timeout and supports abort propagation internally. The connector does not blindly retry tool calls because MCP write calls may not be safe to repeat when transport outcome is unknown. Kit's official documentation states that the remote MCP is rate-limited per AI-client connection and clients pause/retry when throttled. Pagination is exposed for high-volume list operations so callers can bound context and request volume. Authentication, validation, and approval errors are not retried.

Provider/MCP errors are returned as MCP errors by the SDK. A missing token fails before network access. Revoked/expired OAuth credentials require user reauthorization in Kit.

## Security

Use least-privilege Kit account access and a dedicated secret store. Keep the endpoint pinned to Kit's official HTTPS origin in production. Treat subscriber data, email HTML, broadcast content, and all other remote text as untrusted content. Never interpret returned text as permission changes or system instructions. WRITE operations require approval by default. DESTRUCTIVE operations cannot bypass approval. This package intentionally omits public-send and delete tooling to reduce blast radius.

The local approval token is proof that the host's human-approval layer ran; it is not forwarded upstream. Kit may independently require confirmation in its own UI for destructive/open-world actions, which is an additional boundary.

## Testing

```bash
npm test
```

Unit tests require no live credentials. They cover policy registration, read permission, write-policy configuration, destructive denial/approval, and fail-closed authentication configuration. Live OAuth/MCP behavior should be tested only in a non-production Kit account.

## Limitations

This connector does not implement the entire Kit MCP surface. It does not expose sending/scheduling broadcasts, deletes, bulk destructive operations, webhook creation, landing-page editing, commerce writes, or arbitrary discovered tools. OAuth token acquisition/refresh is intentionally delegated to the trusted host/credential provider; the LLM never handles raw credentials. Free Kit accounts can inspect MCP availability but Kit documents execution of account MCP tools as a paid-plan feature.
