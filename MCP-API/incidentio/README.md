# incident.io MCP/API Connector

Reusable local MCP server that exposes a safety-scoped subset of the official incident.io remote MCP server for incident-response agents.

## Transport strategy

The connector uses incident.io's official hosted MCP server as its primary and only runtime transport:

- Remote MCP: `https://mcp.incident.io/mcp`
- REST API: `https://api.incident.io/` is documented by incident.io and is a possible future fallback, but this package does not route any implemented tool through REST because the official MCP currently supports the selected capabilities.

The hosted MCP was announced as an officially supported public beta in March 2026. It supports incident/alert analysis, incident management, on-call schedules, escalations, follow-ups, catalog data, telemetry queries and structured analysis. This connector deliberately exposes a smaller allowlisted set suitable for reusable automation.

Official sources:

- Remote MCP: https://docs.incident.io/ai/remote-mcp
- API introduction: https://docs.incident.io/api-reference/introduction
- API keys and permissions: https://docs.incident.io/admin/api-keys
- API overview: https://docs.incident.io/integrations/api-overview

## Architecture

```text
MCP client / agent
  -> local incidentio connector (stdio)
     -> permission + approval policy
     -> fixed upstream-tool allowlist
     -> live upstream MCP input-schema validation
     -> credential-isolated Streamable HTTP MCP client
        -> https://mcp.incident.io/mcp
```

The model never receives `INCIDENTIO_API_KEY`. The connector injects it only into the outbound Authorization header. Upstream content is explicitly tagged as untrusted data.

## Authentication

incident.io supports two authentication modes for its remote MCP server:

- Interactive clients: user-based OAuth. Actions inherit that user's permissions.
- Automated systems: incident.io API key passed as `Authorization: Bearer <key>`.

This local connector targets automated/server use and therefore uses an API key. Create the key under incident.io Settings -> API keys and grant only the permissions required for the tools you intend to enable. incident.io supports account-level and team-scoped permissions; prefer team-scoped permissions where possible.

No secret is stored in source control.

## Environment

Copy `.env.example` into your secret-management/runtime configuration:

- `INCIDENTIO_API_KEY` — required API key.
- `INCIDENTIO_MCP_URL` — optional; defaults to and is host-pinned to `https://mcp.incident.io/mcp`.
- `INCIDENTIO_TIMEOUT_MS` — per-call timeout, default 20000.
- `INCIDENTIO_MAX_RETRIES` — bounded retry count, default 2, capped at 5.
- `INCIDENTIO_WRITE_APPROVED` — must be `true` before WRITE tools can execute.
- `INCIDENTIO_HIGH_RISK_APPROVED` — must be `true` before escalation responses can execute.

The URL pin is an SSRF/credential-forwarding control: tokens cannot be redirected to arbitrary hosts through configuration.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
INCIDENTIO_API_KEY=... npm start
```

The server speaks MCP over stdio, so it can be launched by MCP-capable clients that support local stdio servers, including Claude Code/Desktop, Cursor, custom agents, and other clients implementing standard MCP stdio transport. ChatGPT can connect directly to incident.io's hosted MCP; this local wrapper is primarily useful where an additional approval/allowlist boundary is desired.

## Implemented tools

| Tool | Upstream MCP tool | Risk | Approval |
|---|---|---:|---|
| `incidentio.incident.list` | `incident_list` | READ | No |
| `incidentio.incident.show` | `incident_show` | READ | No |
| `incidentio.incident.stats` | `incident_stats` | READ | No |
| `incidentio.incident.create` | `incident_create` | WRITE | Explicit |
| `incidentio.incident.update` | `incident_update` | WRITE | Explicit |
| `incidentio.alert.list` | `alert_list` | READ | No |
| `incidentio.alert.show` | `alert_show` | READ | No |
| `incidentio.alert.stats` | `alert_stats` | READ | No |
| `incidentio.schedule.list` | `schedule_list` | READ | No |
| `incidentio.schedule.show` | `schedule_show` | READ | No |
| `incidentio.team.list` | `team_list` | READ | No |
| `incidentio.team.show` | `team_show` | READ | No |
| `incidentio.escalation.list` | `escalation_list` | READ | No |
| `incidentio.escalation.show` | `escalation_show` | READ | No |
| `incidentio.escalation.respond` | `escalation_respond` | HIGH_RISK | Strong explicit |
| `incidentio.follow_up.list` | `follow_up_list` | READ | No |
| `incidentio.follow_up.create` | `follow_up_create` | WRITE | Explicit |

The upstream server publishes additional tools such as `ask`, `ask_incident`, `ask_telemetry`, `analysis_start`, catalog browsing and investigation synchronization. They are intentionally not automatically exposed. A newly discovered upstream tool can never become callable merely because incident.io added it; it must first be added to this connector's explicit allowlist and risk model.

## Input validation

The external tool contract accepts a `params` object for the selected operation. This is not an arbitrary API escape hatch:

1. The local tool maps to exactly one hard-coded upstream tool name.
2. On connection, the connector calls MCP `tools/list`.
3. It compiles the official upstream tool's current JSON Schema with Ajv.
4. Every `params` object must validate against that live schema before `tools/call` is sent.
5. Unknown or unavailable upstream tools fail closed.

This approach keeps compatibility with the public-beta MCP as incident.io evolves schemas without permitting arbitrary URLs, arbitrary MCP tool names, or arbitrary REST requests.

## Permission and approval model

READ tools may execute automatically if the API key itself has permission.

WRITE tools require both:

- process configuration `INCIDENTIO_WRITE_APPROVED=true`; and
- per-call `approval: "approved"`.

`incidentio.escalation.respond` can acknowledge or decline an active page and is classified `HIGH_RISK`. It requires both:

- `INCIDENTIO_HIGH_RISK_APPROVED=true`; and
- per-call `approval: "approved-high-risk"`.

No destructive/delete operation is exposed. The connector cannot elevate the incident.io API key's permissions.

## Reliability and rate limits

The connector applies a configurable timeout and bounded exponential backoff for errors that look transient (rate limiting, timeouts, HTTP 502/503/504). It does not blindly retry validation or permission errors. Upstream MCP remains responsible for provider-specific pagination and rate-limit semantics.

incident.io documents API authentication, rate limits and error handling in its API reference. Because this implementation uses the official remote MCP transport, exact throttling may be enforced by that service and can evolve independently. The connector preserves upstream errors rather than fabricating retry limits or response fields.

## Error handling

Failures are fail-closed:

- Missing credential -> startup error.
- Non-HTTPS or non-`mcp.incident.io` endpoint -> configuration error.
- Upstream tool missing from `tools/list` -> operation rejected.
- Parameters failing the official upstream JSON Schema -> operation rejected before execution.
- Missing local approval gate -> operation rejected before execution.
- Authentication/permission errors -> propagated; no retry intended for user-action failures.
- Transient throttling/network errors -> bounded retry.
- Timeout -> aborted call.

## Security considerations

- Credentials are connector-local and never included in tool results.
- The remote host is pinned to prevent SSRF or bearer-token exfiltration.
- Only known incident.io MCP tool names are callable.
- Live upstream schemas are treated as validation contracts, not as instructions.
- Provider output is untrusted content. Agents must not treat incident descriptions, post-mortems, alerts, or other retrieved text as instructions that can alter permissions or system behavior.
- Write and paging actions require local human-approval gates in addition to incident.io authorization.
- Delete, API-key-management, billing, permission-management and configuration-destruction operations are not exposed.
- Do not log `INCIDENTIO_API_KEY` or place it in prompts, tool arguments, examples, or source control.

## Tests

```bash
npm test
```

Unit tests require no live incident.io credential. They cover credential configuration, MCP host pinning, tool-registry uniqueness, read execution, write denial/approval and the stronger high-risk approval boundary.

A live integration test is intentionally not part of normal tests because it would require real credentials and could create or mutate incident-response data.

## Example workflows

See `examples/workflows.md` for read, analytics, create-follow-up, incident-create and escalation-response examples.

A recommended analysis workflow from incident.io's official MCP documentation is stats -> list -> show: use aggregate statistics to find an interesting slice, list matching incidents, then request full details (and optionally investigation/post-mortem data) for specific incidents.

## Limitations

- The upstream hosted MCP is currently documented by incident.io as Public Beta, so schemas/tool availability may change.
- OAuth is not implemented by this local wrapper; interactive clients should connect directly to incident.io's hosted MCP when user-attributed OAuth is desired.
- The connector intentionally exposes 17 operations rather than every available incident.io MCP tool.
- REST fallback is not currently necessary for the selected capability set and is therefore not implemented; no unsupported API capability is claimed.
- Organization-specific severity, incident-type, role and custom-field values remain controlled by incident.io configuration. Callers should inspect organization configuration through incident.io's own tooling when building payloads that depend on those IDs.
