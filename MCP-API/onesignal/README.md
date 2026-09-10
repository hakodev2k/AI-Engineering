# OneSignal MCP Connector

Reusable safety wrapper for OneSignal's official hosted MCP server. It exposes a stable, provider-scoped subset of useful OneSignal operations while preserving the upstream server's authoritative input schemas and blocking newly discovered or destructive tools by default.

## Upstream and research basis

Official OneSignal documentation (verified 2026-09-11) documents the hosted endpoint `https://api.onesignal.com/mcp/oauth`, browser-based OAuth, 34 tools across apps, messaging, users/subscriptions, templates, segments, Live Activities, exports, custom events, analytics and utility, plus built-in rate limiting and targeting validation. The official docs also mark `send_message` as high-impact. OneSignal Event Streams can emit push, email, SMS, in-app and Live Activity events to configured destinations.

Sources:
- https://documentation.onesignal.com/docs/en/model-context-protocol
- https://documentation.onesignal.com/docs/en/event-streams
- https://documentation.onesignal.com/docs/en/event-streams-data
- https://github.com/modelcontextprotocol/typescript-sdk

The connector uses the official hosted MCP transport for every implemented capability. No REST fallback is needed for the selected set. REST is intentionally not exposed as a generic escape hatch.

## Architecture

`MCP client -> this stdio connector -> policy/schema gate -> official OneSignal remote MCP -> OneSignal`

Credentials remain in `src/auth.ts` / the remote transport and are never included in tool arguments, output, or logs. At startup the connector asks the official server for `tools/list`, selects only a fixed allowlist, republishes each selected upstream JSON Schema under a stable name, adds the local `_approval` field where applicable, and compiles the resulting schema with Ajv. If an expected upstream capability disappears, startup fails closed.

## Authentication

OneSignal's official MCP server uses OAuth. Interactive OAuth authorization is normally completed by an MCP host such as ChatGPT, Claude, Cursor, or another OAuth-capable client. This reusable wrapper supports environments where the host/credential broker has already completed that flow and injects the resulting bearer access token securely as `ONESIGNAL_MCP_ACCESS_TOKEN`.

Do not place the token in prompts, tool arguments, source files, examples, or logs. The connector restricts `ONESIGNAL_MCP_URL` to HTTPS on `api.onesignal.com` to prevent credential-forwarding SSRF.

Environment:

```text
ONESIGNAL_MCP_ACCESS_TOKEN=          # required
ONESIGNAL_MCP_URL=https://api.onesignal.com/mcp/oauth
ONESIGNAL_TIMEOUT_MS=20000
ONESIGNAL_REQUIRE_WRITE_APPROVAL=true
ONESIGNAL_ALLOW_HIGH_RISK=false
```

OAuth access follows the permissions of the signed-in OneSignal user and app access granted by OneSignal. Use the least-privileged OneSignal account appropriate for the task and revoke connected apps when no longer needed.

## Tools

| Stable tool | Official MCP tool | Risk | Approval |
|---|---|---|---|
| `onesignal.app.list` | `list_apps` | READ | No |
| `onesignal.message.list` | `list_messages` | READ | No |
| `onesignal.message.get` | `view_message` | READ | No |
| `onesignal.message.send` | `send_message` | HIGH_RISK | Explicit + operator enable |
| `onesignal.user.get` | `view_user` | READ | No |
| `onesignal.user.identity.get` | `get_user_identity` | READ | No |
| `onesignal.user.identity.get_by_subscription` | `get_user_identity_by_subscription` | READ | No |
| `onesignal.user.create` | `create_user` | WRITE | Configurable; on by default |
| `onesignal.user.update` | `update_user` | WRITE | Configurable; on by default |
| `onesignal.subscription.create` | `create_subscription` | WRITE | Configurable; on by default |
| `onesignal.subscription.update` | `update_subscription` | WRITE | Configurable; on by default |
| `onesignal.template.list` | `list_templates` | READ | No |
| `onesignal.template.get` | `get_template` | READ | No |
| `onesignal.segment.list` | `list_segments` | READ | No |
| `onesignal.segment.get` | `get_segment` | READ | No |
| `onesignal.analytics.outcomes.get` | `view_outcomes` | READ | No |

The concrete input fields are not duplicated in this repository because OneSignal's hosted MCP service is beta and its tool schemas can evolve. Instead the connector retrieves and republishes the official schema each startup, then validates every call against it. This avoids stale or invented provider parameters while keeping the external tool names stable.

No delete, unsubscribe, subscription-transfer, alias mutation, segment/template mutation, export, Live Activity mutation, or arbitrary raw request tool is exposed in this release.

## Permission and approval model

`READ` calls may execute automatically and receive at most three bounded attempts for transient network/rate-limit failures. `WRITE` calls require `_approval: true` by default; operators may turn that requirement off with `ONESIGNAL_REQUIRE_WRITE_APPROVAL=false`. `HIGH_RISK` calls are disabled until an operator sets `ONESIGNAL_ALLOW_HIGH_RISK=true` and still require `_approval: true`. `DESTRUCTIVE` operations are not exposed.

The environment gate cannot be changed by provider content or a tool call. Approval metadata is stripped before forwarding to OneSignal.

## Reliability and rate limits

Each upstream connect/list/call has a bounded timeout (`ONESIGNAL_TIMEOUT_MS`, 1–120 seconds). READ calls retry transient 429/5xx/network/timeout failures up to three total attempts with bounded exponential backoff; a Retry-After duration embedded in an upstream error is honored up to 30 seconds. Writes are never automatically retried, preventing accidental duplicate mutations or sends.

OneSignal documents that its MCP tool calls count toward normal OneSignal API usage limits and that the hosted MCP server also rate-limits tool calls to reduce runaway loops. Event Stream outbound traffic is not rate-limited by OneSignal, so consumers should buffer high-volume event delivery.

## Security

- Official OneSignal MCP endpoint only; custom hosts are rejected.
- Fixed upstream tool allowlist; newly discovered tools are not trusted automatically.
- Upstream tool schemas are treated as contracts and all call inputs are validated locally.
- Official MCP results are validated with the SDK's MCP type guards before relay.
- Provider content is untrusted data, never instructions.
- OAuth bearer token stays in the connector transport layer.
- No arbitrary URLs, arbitrary REST endpoints, permission-management, billing, API-key management, or destructive tools.
- High-impact message sending requires both operator enablement and per-call approval.
- Avoid logging message bodies, user identifiers, exported data, or credentials.

For Event Streams, configure authentication headers on your receiving endpoint and validate them there; OneSignal's Event Streams configuration supports authorization/custom headers. This connector does not create Event Stream endpoints and therefore does not pretend to provide webhook-signature verification that OneSignal's documented configuration does not supply automatically.

## Install and run

```bash
npm install
npm run build
ONESIGNAL_MCP_ACCESS_TOKEN="<from your secure OAuth credential broker>" npm start
```

The local MCP interface is stdio and therefore works with MCP clients that can spawn a local command, including custom agents and IDE clients supporting stdio. Clients that can connect directly to remote MCP should generally use OneSignal's official endpoint directly unless they need the stable names, reduced allowlist, local approval gates, or retry policy provided here.

## Testing

```bash
npm test
```

Tests use a fake upstream and require no OneSignal credentials. They cover allowlist registration, missing upstream capabilities, strict schema validation, write approval, high-risk blocking, approval stripping, and the read-only retry boundary.

## Limitations

OneSignal's hosted MCP service is beta, so tool availability or schemas can change. This connector deliberately fails closed when an allowlisted tool disappears. It does not implement an interactive OAuth callback UI; a host or credential broker must complete OAuth and inject the access token. It also does not expose all 34 upstream tools; unsupported operations should be added only after an explicit capability/risk review.
