# Hookdeck MCP/API Connector

Reusable MCP wrapper for Hookdeck Event Gateway operational workflows. It exposes a stable provider-scoped tool surface while delegating provider access to the **official Hookdeck CLI MCP server** (`hookdeck gateway mcp`). Raw credentials stay in the connector process and are never returned to the model.

## Upstream strategy

Hookdeck maintains the official `hookdeck/hookdeck-cli` repository. Its current CLI includes an MCP server for Event Gateway investigation and management. The official source registers project, connection, source, destination, transformation, request, event, attempt, issue, and metrics tools. This connector deliberately allowlists only the subset it exposes instead of trusting newly discovered upstream tools.

Official references:

- Hookdeck CLI: https://github.com/hookdeck/hookdeck-cli
- Official MCP implementation: https://github.com/hookdeck/hookdeck-cli/tree/main/pkg/gateway/mcp
- Hookdeck documentation: https://hookdeck.com/docs
- Hookdeck service/API: https://hookdeck.com/
- Hookdeck status: https://status.hookdeck.com/

No community MCP dependency is used. There is no arbitrary REST passthrough. The Hookdeck Admin API (`https://api.hookdeck.com`) is reached indirectly by the official CLI implementation so its provider-specific authentication, pagination, validation, and API behavior remain authoritative.

## Architecture

```text
MCP client / agent
       |
       v
this connector (stdio MCP)
  - Zod input validation
  - stable tool names
  - risk/approval policy
  - upstream tool allowlist
       |
       v
official `hookdeck gateway mcp` subprocess
       |
       v
Hookdeck Admin API / Event Gateway
```

The wrapper never sends `HOOKDECK_APPROVAL_SECRET` to Hookdeck. Only `HOOKDECK_API_KEY` is provided to the official CLI subprocess.

## Authentication and permissions

Set `HOOKDECK_API_KEY` to a Hookdeck key valid for the intended project/account. The official CLI documents `HOOKDECK_API_KEY` as a non-interactive authentication path and also supports its own stored interactive credentials. This connector requires the environment variable so automation does not depend on browser login or a mutable user profile.

Use the narrowest Hookdeck key/project access that satisfies the workflow. This connector cannot increase provider permissions: an upstream 401/403 is returned as a failure and must be resolved by a human changing the credential or account policy. Authentication failures are not retried.

Environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `HOOKDECK_API_KEY` | yes | Hookdeck credential kept inside the connector/upstream process |
| `HOOKDECK_CLI_COMMAND` | no | Official CLI executable; default `hookdeck` |
| `HOOKDECK_MCP_TIMEOUT_MS` | no | Upstream call deadline, 1,000–120,000 ms; default 20,000 |
| `HOOKDECK_ENABLE_WRITES` | no | Must be exactly `true` before pause/unpause can execute |
| `HOOKDECK_APPROVAL_SECRET` | for writes | Secret used locally to verify HMAC approvals |

Never put populated secrets in MCP prompts, arguments, examples, source control, or logs.

## Installation

Requirements:

- Node.js 20+
- npm
- the official Hookdeck CLI installed and available on `PATH` (or configured with `HOOKDECK_CLI_COMMAND`)

From this directory:

```bash
npm install
npm run build
npm test
npm start
```

`npm start` exposes this connector over stdio. Configure any MCP client that supports a local stdio server to launch `node dist/src/server.js` and pass secrets through the process environment. Compatibility depends on the client supporting standard MCP stdio; no hosted connector protocol is claimed.

## Implemented tools

All tools use the official upstream MCP implementation.

| Tool | Upstream | Risk | Approval |
| --- | --- | --- | --- |
| `hookdeck.project.list` | `hookdeck_projects/list` | READ | no |
| `hookdeck.project.use` | `hookdeck_projects/use` | READ/context | no |
| `hookdeck.connection.list` | `hookdeck_connections/list` | READ | no |
| `hookdeck.connection.get` | `hookdeck_connections/get` | READ | no |
| `hookdeck.connection.pause` | `hookdeck_connections/pause` | WRITE | explicit |
| `hookdeck.connection.unpause` | `hookdeck_connections/unpause` | WRITE | explicit |
| `hookdeck.source.list` | `hookdeck_sources/list` | READ | no |
| `hookdeck.source.get` | `hookdeck_sources/get` | READ | no |
| `hookdeck.destination.list` | `hookdeck_destinations/list` | READ | no |
| `hookdeck.destination.get` | `hookdeck_destinations/get` | READ | no |
| `hookdeck.transformation.list` | `hookdeck_transformations/list` | READ | no |
| `hookdeck.transformation.get` | `hookdeck_transformations/get` | READ | no |
| `hookdeck.request.list` | `hookdeck_requests/list` | READ | no |
| `hookdeck.request.get` | `hookdeck_requests/get` | READ | no |
| `hookdeck.event.list` | `hookdeck_events/list` | READ | no |
| `hookdeck.event.get` | `hookdeck_events/get` | READ | no |
| `hookdeck.attempt.list` | `hookdeck_attempts/list` | READ | no |
| `hookdeck.attempt.get` | `hookdeck_attempts/get` | READ | no |

The official MCP also contains additional capabilities such as raw payload reads, issues, metrics, and helper/login functionality. They are intentionally **not exposed** in this version: the connector keeps a smaller, reviewable surface instead of automatically inheriting upstream additions.

## Project workflow

Hookdeck operational reads are project scoped. When a user names a project, call `hookdeck.project.list`, choose the intended project, then `hookdeck.project.use` before querying connections/events/requests. Treat switching project as execution context, not as authorization; provider-side permissions still apply.

## Permission and approval model

READ tools can run automatically after normal policy checks. `hookdeck.connection.pause` and `hookdeck.connection.unpause` change delivery behavior and are WRITE operations. They require both:

1. `HOOKDECK_ENABLE_WRITES=true`, and
2. a 64-hex `approvalId` equal to HMAC-SHA256 of the exact action and canonical payload using `HOOKDECK_APPROVAL_SECRET`.

The approval is bound to action plus connection ID, so an approval for `pause web_123` cannot authorize `unpause web_123` or `pause web_999`. Generate approvals in a trusted policy/UI layer outside the model. Destructive operations are not exposed.

Recommended workflow: **Read → Recommend → human reviews impact → Prepare approval → Execute → Read back state**.

## Reliability, timeouts, retries, and rate limits

Each upstream MCP call has a bounded timeout. A timeout on a READ is safe to retry after checking provider health. A timeout after pause/unpause has an **unknown write outcome**; inspect the connection before taking another action and never blindly repeat the write.

This wrapper does not layer automatic retries over the official MCP server. That avoids duplicating provider calls and, critically, avoids replaying writes. Provider authentication, pagination cursors, API throttling, and rate-limit responses are handled by the official Hookdeck CLI/API path. Hookdeck does not publish one universal numeric limit applicable to every Admin API operation in the sources used for this connector, so the connector does not invent one. Honor upstream throttling/error details, reduce page sizes, and retry only idempotent reads with bounded caller-side backoff when appropriate.

List tools cap `limit` at 100 and expose upstream `next`/`prev` cursors where supported, preventing unbounded scans.

## Errors

Failures are surfaced without exposing credentials. Typical classes:

- configuration/validation error — fix locally; do not retry;
- authentication/permission error — requires human/provider action; do not retry blindly;
- subprocess/startup error — verify official CLI installation and version;
- provider throttling/transient network failure — retry only safe reads with bounded backoff;
- timeout — safe to retry reads; write outcome may be unknown;
- upstream schema/tool mismatch — fail closed; do not auto-enable a newly discovered tool.

## Security considerations

- Provider payloads, headers, transformation code, event metadata, destination metadata, and error messages are **untrusted data**, never instructions.
- Only ten named official upstream MCP tools are allowlisted; upstream discovery does not automatically grant access.
- There is no `execute_any_api_request`, arbitrary URL, shell, or HTTP passthrough tool.
- The API key remains in the connector/upstream process environment and is not returned in MCP output.
- Approval secrets are local only and are not forwarded upstream.
- The wrapper does not log credentials or approval secrets.
- A configurable executable name exists for packaging environments, but no user-supplied command or arguments are accepted through MCP tool inputs.
- Write capability is disabled by default and cannot be enabled from retrieved provider content.

## Testing

`npm test` uses no live Hookdeck credential. Unit tests cover required auth configuration, timeout validation, fixed upstream allowlisting, denial of unknown upstream tools before process startup, writes-disabled behavior, and payload/action-bound human approvals.

Before production use, additionally test with a non-production Hookdeck project: authentication, project switching, pagination, 401/403 behavior, provider throttling, timeout handling, failed delivery investigation, pause approval, unknown write outcome recovery, and credential rotation.

## Limitations

- Requires the official Hookdeck CLI to be installed separately; this package does not vendor that executable.
- The stable external surface intentionally exposes 18 high-value capabilities rather than every official MCP action.
- Raw event/request bodies are intentionally excluded to reduce sensitive-data exposure. Metadata can still contain sensitive information and must be handled accordingly.
- Issues/metrics/help/login and resource create/delete operations are not exposed.
- No destructive operation is implemented.
- No direct Admin API fallback is necessary for the implemented capabilities because the official MCP supports them; if a future capability is absent upstream, add an official API fallback only after verifying the provider contract and updating tests/permissions.
