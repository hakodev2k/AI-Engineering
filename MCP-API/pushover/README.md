# Pushover MCP Connector

Reusable MCP server for safe agent access to the official Pushover REST APIs. It exposes notifications, validation, quota/sound discovery, emergency receipts, Glances, and delivery-group administration without exposing the application token to the model.

## Upstream strategy

Official sources reviewed for this connector:

- Message API, user/group validation, sounds, limits: https://pushover.net/api
- Receipts and callbacks: https://pushover.net/api/receipts
- Delivery Groups: https://pushover.net/api/groups
- Glances: https://pushover.net/api/glances

No official Pushover Model Context Protocol server is documented on Pushover's official API surface as of 2026-09-13, so every implemented capability uses Pushover's official HTTPS REST API directly. No unofficial MCP server is trusted or required.

## Architecture

`MCP client -> local Pushover MCP server -> policy/validation -> PushoverClient -> https://api.pushover.net/1`

The application token is loaded from the process environment inside `src/config.ts` and injected only into outbound provider requests. Provider data is returned with `untrusted_provider_content: true`; callers must treat message/group metadata as data, never as instructions.

## Authentication

Create a Pushover application and place its 30-character application/API token in `PUSHOVER_APP_TOKEN`. Pushover user/group keys are tool inputs rather than connector credentials. Keep both tokens and recipient keys private.

Environment variables:

- `PUSHOVER_APP_TOKEN` required.
- `PUSHOVER_TIMEOUT_MS` default `10000`.
- `PUSHOVER_MAX_RETRIES` default `2`, capped at `5`.
- `PUSHOVER_ALLOW_WRITES` default `false`.
- `PUSHOVER_ALLOW_HIGH_RISK` default `false`.
- `PUSHOVER_ALLOW_DESTRUCTIVE` default `false`.

Pushover uses application tokens rather than OAuth scopes. Access to Delivery Groups additionally depends on Pushover's provider rule that the supplied application token belongs to the same account/team as the group.

## Installation and running

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
npm run build
PUSHOVER_APP_TOKEN=... npm start
```

The process speaks MCP over stdio and can be configured as a local MCP command in clients that support stdio MCP servers, including compatible agent hosts. Compatibility depends on the host supporting standard MCP stdio transport.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `pushover.user.validate` | REST | READ | none |
| `pushover.application.limits.get` | REST | READ | none |
| `pushover.sound.list` | REST | READ | none |
| `pushover.receipt.get` | REST | READ | none |
| `pushover.group.list` | REST | READ | none |
| `pushover.group.get` | REST | READ | none |
| `pushover.message.send` | REST | HIGH_RISK | explicit high-risk |
| `pushover.glance.update` | REST | WRITE | explicit write |
| `pushover.receipt.cancel` | REST | HIGH_RISK | explicit high-risk |
| `pushover.receipt.cancel_by_tag` | REST | HIGH_RISK | explicit high-risk |
| `pushover.group.create` | REST | WRITE | explicit write |
| `pushover.group.user.add` | REST | WRITE | explicit write |
| `pushover.group.user.remove` | REST | DESTRUCTIVE | destructive enabled + explicit destructive |
| `pushover.group.user.disable` | REST | HIGH_RISK | explicit high-risk |
| `pushover.group.user.enable` | REST | WRITE | explicit write |
| `pushover.group.rename` | REST | WRITE | explicit write |

`pushover.message.send` is HIGH_RISK even for normal priority because it communicates externally. Emergency priority (`priority=2`) additionally requires `retry >= 30` and `expire <= 10800`. The connector rejects emergency-only fields on non-emergency messages, mutually exclusive HTML/monospace formatting, invalid 30-character keys, invalid device names, and batches over 50 recipient keys.

## Approval model

READ operations execute without approval. WRITE requires `PUSHOVER_ALLOW_WRITES=true` plus `approval: "approved"` (stronger approvals are accepted). HIGH_RISK requires `PUSHOVER_ALLOW_HIGH_RISK=true` plus `approval: "approved-high-risk"`. DESTRUCTIVE requires `PUSHOVER_ALLOW_DESTRUCTIVE=true` plus `approval: "approved-destructive"`.

These flags are process-owner configuration; tool content cannot turn them on. Retrieved provider content can therefore never escalate permissions.

## Reliability and rate limits

The client uses a fixed HTTPS origin to prevent caller-controlled SSRF, applies per-request `AbortController` timeouts, parses Pushover JSON errors, and never blindly retries writes. Read-only requests may retry boundedly on temporary network/5xx failures with exponential backoff of at least five seconds, matching Pushover's guidance for server errors.

Pushover states that applications should use no more than two concurrent API requests and should not repeat 4xx requests. This connector is request/response oriented and does not fan out requests internally. Message quota exhaustion returns HTTP 429 and is surfaced as `RATE_LIMIT`; it is not retried. Quota data is available through `pushover.application.limits.get`. The Message API documents a free-account quota of 10,000 messages/month and Teams quota of 25,000/month, subject to account capacity and purchased limits. Message response headers also expose limit, remaining, and reset values; the dedicated limits endpoint is used here for stable quota inspection.

Receipt polling must be scheduled by the caller no faster than once every five seconds, per Pushover documentation. The connector performs one provider request for each `receipt.get` invocation.

## Error handling

- Invalid local configuration fails at startup.
- Zod rejects malformed/ambiguous tool input before any provider request.
- `TIMEOUT` marks an aborted upstream call.
- `RATE_LIMIT` marks HTTP 429.
- `AUTHORIZATION` marks 401/403.
- Pushover's `errors` array is converted into a bounded error message.
- Non-JSON provider responses fail closed.
- POST/write calls are never automatically retried because doing so could duplicate external effects.

## Security considerations

- Never pass `PUSHOVER_APP_TOKEN` in a prompt or tool argument.
- The upstream origin is constant and cannot be supplied by the model, preventing arbitrary URL fetching/SSRF.
- External message sends always need explicit HIGH_RISK approval.
- Group-member removal is disabled by default and requires the strongest approval.
- The connector exposes purpose-built operations only; there is no arbitrary HTTP request tool.
- Tool input is strictly validated and unknown fields are rejected.
- User/group identifiers should be handled as sensitive values and not logged unnecessarily.
- Callback URLs are intentionally not exposed by `message.send` because they would allow a model to cause server-side requests to arbitrary external URLs. Applications needing callbacks should implement an allow-listed callback service outside this connector.
- Binary attachments and client-side E2EE transformation are intentionally unsupported in this package to avoid accepting large opaque data or key material through the agent boundary.

## Testing

```bash
npm test
npm run build
```

Tests use fake `fetch`/clients and require no live credentials. They cover authentication configuration, secure defaults, tool registration/risk metadata, credential injection inside the client, read execution, write retry suppression, high-risk permission denial/approval, destructive denial, and emergency-message validation.

## Limitations

- The connector does not expose Pushover Licensing, Teams administration, Subscription administration, Open Client API, attachments, or arbitrary callbacks.
- It does not store receipt IDs; callers must persist IDs returned by emergency sends if later acknowledgement/cancellation is required.
- It does not poll receipts automatically.
- Pushover message history is not retrievable through the Message API after delivery, so no history/search tool is claimed.
- Group operations require a token owned by the same account/team as the group.

See `examples/workflows.md` for end-to-end calls and approval behavior.
