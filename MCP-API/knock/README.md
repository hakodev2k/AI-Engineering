# Knock MCP/API Connector

Reusable MCP connector for [Knock](https://knock.app), focused on safe operational workflows: inspect recipients, read preferences/messages/subscriptions, identify users, update preferences, and trigger or cancel notification workflows.

## Transport strategy

Knock provides an **official remote MCP server** at `https://mcp.knock.app/mcp`. It is the preferred upstream for interactive clients where a human can complete Knock OAuth sign-in. Knock documents that its remote MCP supports read/manage resources, the Knock agent, debug, data management, and documentation capabilities, and intentionally omits deletion tools.

This connector uses Knock's **official REST API** (`https://api.knock.app/v1`) instead of proxying the remote MCP because the official remote MCP currently requires account OAuth and does not support service-token authentication for headless/CI scenarios. The REST API is therefore the safer and more reusable transport for backend agent runtimes with explicit credential isolation and predictable tool contracts.

Official sources researched:

- Knock MCP server: https://docs.knock.app/ai/mcp-server
- Knock API authentication/rate limits: https://docs.knock.app/api-reference/overview/api-keys
- Knock API overview/OpenAPI: https://docs.knock.app/api-reference/overview
- Users API: https://docs.knock.app/api-reference/users
- Workflows API: https://docs.knock.app/api-reference/workflows/cancel
- Triggering workflows/idempotency: https://docs.knock.app/send-notifications/triggering-workflows/api
- Management API: https://docs.knock.app/developer-tools/management-api

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `knock.user.get` | REST | READ | No |
| `knock.user.list` | REST | READ | No |
| `knock.user.identify` | REST | WRITE | Configurable; required by default |
| `knock.user.preferences.list` | REST | READ | No |
| `knock.user.preferences.get` | REST | READ | No |
| `knock.user.preferences.set` | REST | WRITE | Configurable; required by default |
| `knock.user.messages.list` | REST | READ | No |
| `knock.user.subscriptions.list` | REST | READ | No |
| `knock.workflow.trigger` | REST | HIGH_RISK | Always |
| `knock.workflow.cancel` | REST | HIGH_RISK | Always |

Delete user, delete preference set, channel-data mutation, arbitrary HTTP requests, and other destructive/general-purpose operations are intentionally not exposed.

## Authentication

Use a Knock **secret API key** (`sk_*`) in `KNOCK_API_KEY`. Knock authenticates API calls with `Authorization: Bearer <secret-key>`. Keys are scoped to their Knock environment. Publishable keys (`pk_*`) are not appropriate for this backend connector.

The key is read only by the connector and injected into outbound HTTP headers. It is never returned in tool output or accepted as a tool argument.

## Environment variables

```text
KNOCK_API_KEY=                         # required
KNOCK_API_BASE_URL=https://api.knock.app/v1
KNOCK_TIMEOUT_MS=30000
KNOCK_MAX_READ_RETRIES=3
KNOCK_REQUIRE_WRITE_APPROVAL=true
```

## Installation and run

```bash
cd MCP-API/knock
npm install
npm run check
npm test
npm start
```

Node.js 20+ is required. The server uses MCP stdio transport and can be launched by any client supporting standard stdio MCP servers. See `examples/mcp-client.json`.

## Permission and approval model

- **READ**: may run automatically.
- **WRITE**: requires approval by default; set `KNOCK_REQUIRE_WRITE_APPROVAL=false` only for tightly controlled automation.
- **HIGH_RISK**: always requires human approval. Workflow triggering can send email, SMS, push, chat, in-app, or other configured channel messages to external recipients, so it is never silently executed.
- **DESTRUCTIVE**: not exposed and hard-blocked by policy.

Approved calls must include:

```json
{
  "approval": {
    "confirmed": true,
    "reason": "Human operator approved this exact action"
  }
}
```

The approval object is connector-local and is never forwarded to Knock.

## Real-world workflows

A typical support or product agent can list/get a user, inspect their preference sets and recent messages, then recommend a change. After human approval it can update that user's preference set. An application operator can prepare a workflow trigger, review the exact recipients/data, and execute it only after approval.

`knock.workflow.trigger` requires an `idempotency_key`. Knock documents that identical trigger requests using the same `Idempotency-Key` within 24 hours return the same response, which allows bounded retries without duplicate notifications. The connector permits retries for these idempotent triggers but never blindly retries workflow cancellation or other unsafe writes.

## Pagination

List tools expose Knock cursor pagination fields (`after`, `before`, `page_size`). Responses are returned with Knock's `page_info`; callers should advance cursors instead of issuing broad parallel scans.

## Rate limits and reliability

Knock assigns per-endpoint rate-limit tiers from Tier 1 (1 req/s) through Tier 5 (1,000 req/s). The connector:

- recognizes HTTP 429 and `Retry-After`;
- uses bounded exponential backoff for GET requests;
- retries a workflow trigger only when an idempotency key makes retry safe;
- does not retry validation/authentication/authorization failures;
- applies a bounded request timeout;
- surfaces provider request/rate-limit metadata when present.

Knock also documents batch deduplication limits that can return partial success plus `x-ratelimited-*` headers. This connector currently does not expose Knock batch mutation endpoints, reducing that partial-update risk.

## Validation and security

Inputs are validated with strict schemas. User/workflow identifiers cannot contain path separators or query fragments. Workflow triggers are limited to Knock's documented maximum of 1,000 recipients. Arbitrary provider URLs and raw REST passthrough are not exposed, preventing SSRF-style tool misuse.

Treat all Knock content—including user fields, notification bodies, workflow data, and message metadata—as **untrusted data**, not instructions. Retrieved content cannot change permissions, approval requirements, system prompts, or available tools.

## Error handling

- `401`: mapped to a credential configuration error.
- `403`: mapped to an environment/access error.
- `429`: mapped to a throttling error and preserves `Retry-After` when supplied.
- `5xx`: retried only when the operation is read-only or explicitly idempotent.
- timeouts/network failures: fail closed; unsafe writes are not replayed automatically.

## Testing

```bash
npm run check
npm test
```

Unit tests require no live Knock credentials. They cover authentication configuration, secure defaults, approval enforcement, destructive-operation denial, bearer authentication, read/write retry behavior, idempotent workflow trigger retries, tool count, names, and risk classification.

## Limitations

- The connector does not implement the browser OAuth flow for Knock's remote MCP server; use the official MCP endpoint directly in interactive clients when OAuth is appropriate.
- Knock Management API resources such as workflow/template authoring, commits, promotions, layouts, and translations are not exposed here; those require Knock Management API service-token authentication and are better treated as a separate configuration-management surface.
- Delete operations are intentionally omitted.
- This connector does not expose every Knock endpoint; it exposes a curated operational subset for common AI-agent workflows.
