# LogSnag MCP/API Connector

Reusable MCP server for publishing application/business events, user properties, and realtime insights to LogSnag.

## Upstream research and transport

LogSnag's official developer documentation currently documents the HTTP API and official Node/React/Next/Vue/Deno/Web/Python SDKs. No official LogSnag MCP server is documented, so this connector uses the official REST API directly rather than trusting a community MCP server.

Official sources:
- https://docs.logsnag.com/
- https://docs.logsnag.com/api-reference/log
- https://docs.logsnag.com/api-reference/identify
- https://docs.logsnag.com/api-reference/insight
- https://docs.logsnag.com/api-reference/insight-mutate
- https://docs.logsnag.com/sdks/node

API base URL: `https://api.logsnag.com`. Authentication is `Authorization: Bearer <TOKEN>`.

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `logsnag.event.publish` | `POST /v1/log`, forces `notify=false` | WRITE | configurable; required by default |
| `logsnag.event.publish_notification` | `POST /v1/log`, forces `notify=true` | HIGH_RISK | always + server opt-in |
| `logsnag.user.identify` | `POST /v1/identify` | WRITE | configurable |
| `logsnag.insight.set` | `POST /v1/insight` | WRITE | configurable |
| `logsnag.insight.increment` | `PATCH /v1/insight` with `$inc` | WRITE | configurable |
| `logsnag.insight.decrement` | `PATCH /v1/insight` with negative `$inc` | WRITE | configurable |

The connector intentionally does not invent read/search/delete capabilities: the public API reference used here documents `/log`, `/identify`, and `/insight` publishing/mutation operations.

## Architecture

MCP client → strict Zod tool schema → approval policy → `LogSnagClient` → bearer credential injected inside connector → LogSnag HTTPS API. Provider data is treated as untrusted output and never interpreted as instructions. There is no arbitrary URL/request tool.

## Authentication and least privilege

Create an API token in LogSnag Settings. LogSnag documents tokens with different access levels and recommends limiting roles to a project/channel where possible. Keep the token server-side in `LOGSNAG_API_TOKEN`; never place it in prompts or tool parameters.

Copy `.env.example` and configure:
- `LOGSNAG_API_TOKEN` (required)
- `LOGSNAG_DEFAULT_PROJECT` (optional)
- `LOGSNAG_API_BASE_URL` (optional, HTTPS only)
- `LOGSNAG_TIMEOUT_MS` (default 10000)
- `LOGSNAG_MAX_RETRIES` (default 2)
- `LOGSNAG_REQUIRE_WRITE_APPROVAL` (default true)
- `LOGSNAG_ALLOW_NOTIFICATIONS` (default false)

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio servers. Configure the client to start `node /absolute/path/MCP-API/logsnag/dist/server.js` with credentials supplied in the process environment.

## Validation and safety

Project/channel names are restricted to lowercase letters, digits, and dashes. Event/title/user strings and maps are bounded. LogSnag tag/property keys follow the documented lowercase/dash format. Unknown fields are rejected. Notification events are separated into a HIGH_RISK tool and cannot execute unless both `approval=true` and `LOGSNAG_ALLOW_NOTIFICATIONS=true` are present. Normal event publishing always forces `notify=false`, preventing an agent from smuggling notification behavior through input.

User identification overwrites matching property keys in LogSnag, so it is classified WRITE. Insight mutations are also WRITE. This connector exposes no destructive operations.

## Reliability and rate limiting

Requests use an abort timeout and bounded exponential backoff. HTTP 429 and 5xx responses may be retried up to `LOGSNAG_MAX_RETRIES`; `Retry-After` is honored when supplied. Authentication, permission, validation, and other non-retryable 4xx responses are not retried. No write is blindly retried after a successful HTTP response; retries only occur when the provider explicitly returns a retryable failure or before a response is obtained.

LogSnag's public pages reviewed for this connector do not state a universal numeric rate limit, so no fictitious quota is encoded. Provider throttling is handled from HTTP 429/`Retry-After`.

## Security considerations

- Credentials stay in the client layer and are never returned in MCP output.
- Base URL must be HTTPS, reducing accidental credential disclosure and SSRF-style configuration abuse.
- Retrieved/provider response content is serialized as data only.
- Markdown descriptions are permitted only through the documented `parser=markdown`; callers should still treat rendered links/content as untrusted.
- Public/client-side LogSnag tokens should be scoped as documented; this server connector should normally use a private, least-privilege token.
- Notification delivery is an external side effect and therefore requires explicit human approval.
- Do not log environment variables or Authorization headers.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch` and require no live credentials. Coverage includes strict validation, approval denial, notification policy, credential isolation, 401 handling, throttling retry, and insight mutation transport.

## Limitations

This package only exposes operations confirmed in the official LogSnag API documentation researched for this implementation. It does not expose dashboard search, event retrieval, project administration, token administration, deletion, or webhook management. No official MCP transport is claimed. Numeric rate-limit quotas are not claimed because an authoritative fixed quota was not found in the reviewed public documentation.

See `examples/workflows.md` for tool calls and expected behavior.
