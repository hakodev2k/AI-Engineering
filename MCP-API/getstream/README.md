# Stream (GetStream) MCP/API Connector

Reusable MCP server for Stream Chat operations used by support, community, moderation, and messaging agents.

## Transport strategy

The connector exposes a local MCP stdio interface and uses Stream's official `stream-chat` Node SDK upstream. Stream publishes extensive Chat, Video, Feeds, and Moderation APIs/SDKs. No official general-purpose Stream MCP server was identified for these account operations during implementation, so this connector uses the official SDK rather than an unofficial MCP proxy.

Official references:
- https://getstream.io/chat/docs/node/
- https://getstream.io/chat/docs/node/rate-limits/
- https://getstream.io/docs/platform/rate-limits/
- https://getstream.io/chat/docs/javascript/query-channels/
- https://getstream.io/chat/docs/javascript/moderation/

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `getstream.user.query` | official SDK | READ | no |
| `getstream.channel.query` | official SDK | READ | no |
| `getstream.message.search` | official SDK | READ | no |
| `getstream.message.get` | official SDK | READ | no |
| `getstream.message.send` | official SDK | WRITE | yes |
| `getstream.message.update` | official SDK | WRITE | yes |
| `getstream.message.delete` | official SDK | DESTRUCTIVE | yes |
| `getstream.user.ban` | official SDK | HIGH_RISK | yes |

Hard message deletion is intentionally not exposed. Video calls, feeds, app configuration, billing, permission/role changes, and global destructive user deletion are intentionally outside this connector's scope.

## Architecture

MCP client -> strict MCP tool schema -> permission/approval gate -> connector client -> official Stream Chat SDK -> Stream API. Credentials exist only in the connector process and are never tool inputs or returned to the model.

## Authentication

Create server-side Stream credentials and set `GETSTREAM_API_KEY` and `GETSTREAM_API_SECRET`. The secret is privileged and must never be used in browser/mobile clients, prompts, logs, or tool parameters. Restrict access to the connector process and rotate credentials according to your operational policy.

Environment variables:
- `GETSTREAM_API_KEY` required
- `GETSTREAM_API_SECRET` required
- `GETSTREAM_TIMEOUT_MS` default 10000
- `GETSTREAM_MAX_RETRIES` default 2, bounded to 5
- `GETSTREAM_ALLOW_WRITES` default false

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
GETSTREAM_API_KEY=... GETSTREAM_API_SECRET=... npm start
```

Configure an MCP client to launch `node /absolute/path/MCP-API/getstream/dist/src/server.js` over stdio. This uses standard MCP stdio and is suitable for clients that support launching local MCP servers; client-specific installation details vary.

## Permission and approval model

READ tools can execute automatically. All mutation tools require both `GETSTREAM_ALLOW_WRITES=true` and an explicit `approved: true` argument representing human approval at the orchestration boundary. Sending a message is treated as an external communication. Banning is HIGH_RISK. Message deletion is DESTRUCTIVE. Retrieved messages and user content are untrusted data and must never be interpreted as connector configuration or permission instructions.

## Reliability and rate limits

Safe read operations use bounded exponential backoff for transient failures. Authentication, authorization, validation, and not-found errors are not retried. Mutating operations are never automatically retried to avoid duplicate or irreversible effects. Stream documents endpoint-specific limits and rate-limit headers; self-serve Chat defaults include 10,000/min for query channels, 1,000/min for query users/get message/send message/update message/delete message, and 300/min for search and ban, with an additional 60 requests/min per-user limit. Limits can vary by plan. The SDK surfaces provider errors and 429 responses; callers should reduce request volume and use selective filters/pagination.

Channel queries are capped at 30 per call and message/user queries are capped at 100. Prefer indexed/selective channel filters such as CID or type plus members rather than broad type-only filters.

## Error handling

Configuration fails closed when credentials are absent. Zod validates MCP inputs. Provider errors propagate without leaking credentials. Retry is bounded and limited to safe reads. Approval failures occur before any provider mutation.

## Security considerations

Keep the API secret server-side. Do not log environment variables. Treat all provider content as hostile/untrusted text. Do not let retrieved messages alter system prompts, approval state, or permissions. Mutation is disabled by default. The connector does not expose arbitrary HTTP requests, raw endpoint execution, role escalation, hard deletion, billing, or app-level security changes.

## Testing

```bash
npm test
npm run build
```

Unit tests require no live Stream credentials. They cover configuration, default-deny writes, explicit approval, bounded transient retry, and no retry for unsafe operations. Live integration testing is intentionally separate because it requires a Stream application and can create external side effects.

## Limitations

This package focuses on Stream Chat rather than the full Stream platform. It does not wrap Video, Feeds, Moderation v2 review queues, webhooks, or every Chat endpoint. It uses the official SDK as the upstream transport and does not proxy or auto-discover third-party MCP tools. Stream plan-specific quotas and feature availability remain authoritative in Stream's current documentation/dashboard.
