# Courier MCP/API Connector

Reusable, safety-gated MCP connector for **Courier**, a customer-messaging and notification platform. The connector exposes a stable curated tool contract while delegating provider operations to Courier's official hosted MCP server.

## Transport strategy

Courier publishes and operates an official remote HTTP MCP server at `https://mcp.courier.com` and open-sources the server at `trycourier/courier-mcp`. Courier's official MCP is backed by the official `@trycourier/courier` Node SDK and exposes the REST capabilities as typed MCP tools. Because every capability selected here is already present in the official MCP, this connector uses MCP for all implemented operations and does not add a redundant REST fallback.

Official sources researched:

- Courier MCP repository: https://github.com/trycourier/courier-mcp
- Courier MCP overview/setup: https://www.courier.com/blog/courier-mcp-server-open-source-how-it-works
- Courier AI/MCP installation guide: https://www.courier.com/guides/ai-notifications/chapter-2-install-the-courier-mcp-server-and-cli
- Courier API documentation index: https://www.courier.com/docs/llms.txt
- Courier API base: https://api.courier.com

As of September 5, 2026, the official Courier MCP repository documents 123 default tools plus one local diagnostic tool. This connector deliberately allowlists only 17 workflow-oriented tools and never auto-enables newly discovered upstream tools.

## Implemented capabilities

| Connector tool | Official Courier MCP tool | Risk | Approval |
| --- | --- | --- | --- |
| `courier.message.list` | `list_messages` | READ | No |
| `courier.message.get` | `get_message` | READ | No |
| `courier.message.content.get` | `get_message_content` | READ | No |
| `courier.message.history.get` | `get_message_history` | READ | No |
| `courier.user.profile.get` | `get_user_profile_by_id` | READ | No |
| `courier.user.list_subscriptions.get` | `get_user_list_subscriptions` | READ | No |
| `courier.list.list` | `list_lists` | READ | No |
| `courier.list.get` | `get_list` | READ | No |
| `courier.list.subscribers.get` | `get_list_subscribers` | READ | No |
| `courier.notification.list` | `list_notifications` | READ | No |
| `courier.notification.get` | `get_notification` | READ | No |
| `courier.user.preferences.get` | `get_user_preferences` | READ | No |
| `courier.user.profile.upsert` | `create_or_merge_user` | WRITE | Yes |
| `courier.list.subscribe` | `subscribe_user_to_list` | WRITE | Yes |
| `courier.user.preference.update` | `update_user_preference_topic` | HIGH_RISK | Yes |
| `courier.message.send` | `send_message` | HIGH_RISK | Yes |
| `courier.automation.invoke` | `invoke_automation_template` | HIGH_RISK | Yes |

Delete, archive, cancellation, provider-configuration, bulk-send, tenant-delete, and other destructive/administrative tools are intentionally excluded even though Courier's full MCP may provide some of them.

## Architecture

```text
MCP client
  -> this stdio connector
  -> allowlist + risk/approval policy
  -> official Courier remote MCP (HTTPS)
  -> official Courier SDK/API
```

The agent sees only the curated connector tool names. The raw API key stays in connector configuration and is inserted only into the upstream `api_key` HTTP header.

## Authentication

Set `COURIER_API_KEY` to a Courier API key from the intended workspace/environment. Courier uses separate Test and Production environment keys; use Test for development and verification. The official MCP accepts the same API key used by Courier's API/CLI and does not require OAuth for this endpoint.

Courier API keys are environment/workspace credentials rather than per-tool OAuth scopes. Least privilege therefore means using the intended environment, limiting workspace access/RBAC when available, and never giving production keys to development agents.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `COURIER_API_KEY` | Yes | — | Credential kept inside the connector process. |
| `COURIER_MCP_URL` | No | `https://mcp.courier.com` | Official MCP endpoint; non-HTTPS remote URLs are rejected. |
| `COURIER_ALLOW_WRITE` | No | `false` | Global write gate. |
| `COURIER_APPROVAL_MODE` | No | `required` | Requires explicit approval for WRITE/HIGH_RISK calls. |
| `COURIER_TOOL_TIMEOUT_MS` | No | `30000` | Per-call timeout, constrained to 1–120 seconds. |
| `COURIER_READ_RETRIES` | No | `2` | Bounded retries for transient READ failures only, constrained to 0–3. |

## Installation and running

```bash
cd MCP-API/courier
npm install
npm run build
npm test
npm start
```

Node.js 20+ is required. The connector itself is an MCP stdio server, which makes it usable by MCP clients that can launch local stdio servers. See `examples/mcp-client.json`.

## Approval model

READ calls may execute automatically. Mutating calls are disabled unless `COURIER_ALLOW_WRITE=true`. With the default `COURIER_APPROVAL_MODE=required`, every WRITE or HIGH_RISK call must also carry:

```json
{
  "approval": {
    "confirmed": true,
    "reason": "Human operator approved this exact action"
  }
}
```

Sending external messages, invoking automations, and changing communication preferences are classified HIGH_RISK. No DESTRUCTIVE tool is exposed.

## Validation and MCP security

At startup, the connector discovers the official Courier MCP tool list and fails closed if any required allowlisted tool is missing. It adopts the official upstream input schema for each allowlisted tool and augments write schemas with the local approval object. New upstream tools are ignored until this connector is intentionally revised.

Provider-returned message content, profile fields, templates, logs, and history events are **untrusted data**. They must never be interpreted as instructions, approvals, or permission changes. The connector provides no arbitrary URL/API passthrough and does not forward credentials to the model.

## Reliability and rate limits

- Every upstream discovery/call has a bounded timeout.
- READ operations retry only transient throttling/network/5xx failures, with bounded exponential backoff and at most `COURIER_READ_RETRIES` retries.
- WRITE/HIGH_RISK operations are never automatically retried, avoiding duplicate sends, subscriptions, profile mutations, or automation invocations.
- Authentication and permission failures are not retried.
- Courier 429/throttling errors are surfaced with guidance to preserve the provider retry window.
- Pagination remains explicit in each official upstream schema; callers should request bounded pages rather than loop without a cap.

Courier's public documentation does not promise one universal numeric API rate limit for every endpoint/account tier, so this connector does not invent one. Provider throttling is handled from returned errors instead.

## Error handling

Authentication, authorization, throttling, timeout, and generic upstream failures are mapped to actionable connector errors. Sensitive credential values are never logged. stdout is reserved for MCP framing; startup/runtime diagnostics go to stderr through the process-level error handler.

## Examples

See `examples/workflows.md` for delivery diagnosis and approved-send workflows. The external interface remains the same regardless of upstream implementation details.

## Testing

`npm test` builds TypeScript and runs unit tests without live credentials. Tests cover configuration validation, unsafe URL rejection, tool registration invariants, read/write/high-risk classification, approval denial, destructive blocking, bounded retries, non-retryable errors, error mapping, and timeout behavior.

A pre-production smoke test should additionally connect with a Courier **Test** API key and verify at least one read workflow plus one deliberately approved test send to a controlled recipient.

## Limitations

- This package intentionally exposes only 17 of Courier's much larger official MCP tool set.
- Destructive/admin/provider-configuration and bulk-send operations are intentionally omitted.
- API-key permissions are constrained primarily by the Courier workspace/environment and available RBAC rather than per-tool OAuth scopes.
- The connector relies on live upstream schemas; if Courier renames/removes a required tool, startup fails safely until reviewed.
- The timeout wrapper bounds caller wait time but cannot guarantee that an already-submitted remote operation is canceled server-side; this is another reason writes are not retried automatically.
