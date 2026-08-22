# Better Stack MCP/API Connector

Reusable MCP server for Better Stack Uptime, incident, on-call, heartbeat, and status-page workflows. The connector exposes a stable provider-scoped tool contract while keeping Better Stack credentials inside the connector process.

## Transport strategy

Better Stack provides an official remote HTTP MCP server at `https://mcp.betterstack.com`. Better Stack recommends OAuth for MCP clients and also supports Bearer API tokens. The official server can restrict its tool surface with `X-MCP-Tools-Only` and `X-MCP-Tools-Except` headers.

This connector uses the official MCP server first for three reviewed read capabilities whose documented MCP tool identifiers are explicitly allowlisted:

- monitor collection: upstream `monitors`
- monitor details: upstream `monitor`
- incident collection: upstream `incidents`

If the official MCP server is unavailable, disabled, or rejects the call, those read operations transparently fall back to the official Uptime REST API. Other implemented reads use explicit REST endpoints. Mutations use REST so their schema, approval boundary, retry behavior, and provider endpoint remain deterministic.

The connector never discovers and automatically trusts newly added upstream MCP tools.

## Official sources researched

- Better Stack MCP server: https://betterstack.com/docs/getting-started/integrations/mcp/
- AI SRE vs MCP server: https://betterstack.com/docs/ai-sre/mcp-server-comparison/
- Uptime API authentication: https://betterstack.com/docs/uptime/api/getting-started-with-uptime-api/
- List monitors: https://betterstack.com/docs/uptime/api/list-all-existing-monitors/
- Create monitor: https://betterstack.com/docs/uptime/api/create-a-new-monitor/
- List heartbeats: https://betterstack.com/docs/uptime/api/list-all-existing-hearbeats/
- Create heartbeat: https://betterstack.com/docs/uptime/api/create-a-hearbeat/
- List incidents: https://betterstack.com/docs/uptime/api/list-all-incidents/
- List on-call schedules: https://betterstack.com/docs/uptime/api/on-call-calendar/
- List on-call events: https://betterstack.com/docs/uptime/api/list-on-call-calendar-events/
- Status page details: https://betterstack.com/docs/uptime/api/get-a-single-status-page/
- Incident log-drain events: https://betterstack.com/docs/uptime/api/reporting/

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- Local MCP server over stdio
- Official Better Stack remote MCP over Streamable HTTP
- Native `fetch` for REST fallback and mutations

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

Development:

```bash
npm run dev
```

## Authentication

Set `BETTERSTACK_API_TOKEN` to either:

- a team-scoped Uptime API token, preferred for least privilege; or
- a Global API token when multi-team access is intentionally required.

REST requests send:

```text
Authorization: Bearer $BETTERSTACK_API_TOKEN
```

The same token can authenticate the official MCP server when interactive OAuth is not being handled by the calling MCP client. Credentials are never part of MCP tool schemas or returned to the agent.

For a connector process, prefer a dedicated team-scoped Uptime API token containing only the resources required by the workflow. A Global API token can manage resources across teams and therefore has a wider blast radius.

## Environment variables

See `.env.example`.

- `BETTERSTACK_API_TOKEN`: required secret.
- `BETTERSTACK_API_BASE_URL`: defaults to `https://uptime.betterstack.com`.
- `BETTERSTACK_MCP_URL`: defaults to the official `https://mcp.betterstack.com` endpoint.
- `BETTERSTACK_USE_MCP`: defaults to `true`; set `false` to force REST reads.
- `BETTERSTACK_TIMEOUT_MS`: per REST request timeout, 1-60 seconds, default 15 seconds.
- `BETTERSTACK_APPROVAL_MODE`: `required` by default.
- `BETTERSTACK_APPROVED_ACTIONS`: comma-separated operator-approved write actions.
- `BETTERSTACK_ALLOW_DESTRUCTIVE`: reserved for future destructive tools and defaults to `false`.

Approval state is external configuration. An agent cannot approve its own write by adding a tool argument.

## Implemented tools

| Tool | Preferred upstream | Fallback | Risk | Approval |
|---|---|---|---:|---|
| `betterstack.monitor.list` | Official MCP `monitors` | REST `GET /api/v2/monitors` | READ | No |
| `betterstack.monitor.get` | Official MCP `monitor` | REST `GET /api/v2/monitors/{id}` | READ | No |
| `betterstack.monitor.create` | REST | — | WRITE | Required by default |
| `betterstack.heartbeat.list` | REST | — | READ | No |
| `betterstack.heartbeat.get` | REST | — | READ | No |
| `betterstack.heartbeat.create` | REST | — | WRITE | Required by default |
| `betterstack.incident.list` | Official MCP `incidents` | REST `GET /api/v3/incidents` | READ | No |
| `betterstack.incident.get` | REST | — | READ | No |
| `betterstack.on_call.list` | REST | — | READ | No |
| `betterstack.on_call.events` | REST | — | READ | No |
| `betterstack.status_page.list` | REST | — | READ | No |
| `betterstack.status_page.get` | REST | — | READ | No |

The official Better Stack MCP server supports a broader surface including incident mutation, monitoring, status pages, dashboards, telemetry, alerts, on-call data, and documentation search. Those upstream capabilities are not automatically exposed here; they must be reviewed and added to this connector as typed tools before an agent can invoke them.

## Real-world workflows

The implemented surface supports workflows such as:

```text
List monitors
  -> inspect one monitor
  -> inspect active incidents
  -> inspect current on-call
  -> create a new monitor after approval
```

and:

```text
List heartbeats
  -> inspect a scheduled-job heartbeat
  -> inspect unresolved incidents
  -> inspect the public status page state
```

## Permission and approval model

Default policy:

```text
READ         -> automatic
WRITE        -> external operator approval by default
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> explicit approval + destructive-enable flag
```

Current connector mutations are monitor creation and heartbeat creation. Both require their exact action name in `BETTERSTACK_APPROVED_ACTIONS` when approval mode is `required`.

Example:

```text
BETTERSTACK_APPROVED_ACTIONS=betterstack.monitor.create
```

The connector intentionally does not expose incident acknowledgement/resolution, status-page publication changes, escalation changes, deletion, user/role administration, billing, token management, or other high-impact actions in this version.

## Reliability

REST GET operations use at most three attempts. Network/time-out failures use bounded exponential backoff. HTTP `429` is retried only for GET requests and honors `Retry-After` when present, with each wait capped at 10 seconds.

Mutation requests are never automatically retried. This avoids duplicate resource creation when the provider may have accepted a request but the caller did not receive the response.

Authentication, authorization, validation, and normal provider errors fail immediately.

Better Stack documents endpoint pagination for monitors, heartbeats, incidents, on-call schedules, and status pages. The connector exposes an explicit bounded `page` input instead of automatically fetching an unbounded number of pages. Better Stack documents incident list pages with a maximum of 50 records per page; callers should iterate only as needed.

Better Stack documentation does not publish a single universal request quota for every Uptime API endpoint. The connector therefore treats HTTP `429` plus provider retry metadata as authoritative rather than inventing a fixed quota.

## Security

- Credentials remain in environment/secrets storage and are attached only to outbound Better Stack transports.
- Provider content is untrusted data, never instructions.
- No tool accepts an arbitrary URL for the Better Stack API origin.
- No generic `execute_request`, raw REST endpoint, or unrestricted MCP passthrough tool exists.
- Upstream MCP access is hard-allowlisted to reviewed identifiers.
- `X-MCP-Tools-Only` is sent to the official MCP server to reduce the upstream tool surface.
- Tool schemas bound IDs, strings, URLs, ports, periods, and pagination.
- Write approvals live outside model-controlled tool arguments.
- Writes are not retried automatically.
- The connector never attempts to widen API-token permissions.
- Retrieved incident text, monitor names, URLs, metadata, status-page text, and MCP responses must be treated as potentially malicious or prompt-injection-bearing data.

## Error handling

Expected failure categories include:

- configuration validation error for a missing token;
- `APPROVAL_REQUIRED` for unapproved writes;
- `DESTRUCTIVE_DISABLED` for any future destructive tool when not explicitly enabled;
- `UPSTREAM_MCP_DISABLED` when MCP use is intentionally disabled;
- `UPSTREAM_MCP_TOOL_NOT_ALLOWED` for any upstream tool outside the reviewed allowlist;
- `NETWORK_OR_TIMEOUT` after bounded REST read retries;
- `BetterStackApiError` containing provider HTTP status and parsed provider error data.

MCP-first reads intentionally fall back to the documented REST endpoint if the upstream MCP call fails. REST errors are then surfaced normally rather than silently returning partial data.

## Tests

Tests require no live Better Stack credentials. They cover:

- missing authentication configuration;
- approved and denied writes;
- destructive-action default denial;
- credential placement in the Bearer header;
- authorization errors without retry;
- no mutation retry;
- bounded HTTP 429 retry for reads;
- expected MCP tool registration;
- absence of a generic API escape hatch;
- reviewed upstream MCP allowlist enforcement.

Run:

```bash
npm test
```

## MCP client configuration

Any MCP client capable of launching a local stdio process can use the built connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/better-stack/dist/src/server.js"],
  "env": {
    "BETTERSTACK_API_TOKEN": "provided-by-secret-manager"
  }
}
```

Do not store a real token in source-controlled client configuration.

Clients that can connect directly to remote HTTP MCP can also use Better Stack's official server at `https://mcp.betterstack.com`, preferably with OAuth. Direct use is appropriate when the broader Better Stack toolset is desired and the client/operator can enforce its own tool allowlist and approval policy.

## Examples

See `examples/tool-calls.md` for sample tool inputs and approval classifications.

## Limitations

- This is intentionally not a complete Better Stack API wrapper.
- Only three upstream MCP identifiers are allowlisted because their identifiers are explicitly shown in Better Stack's official MCP configuration documentation.
- The local adapter uses API-token authentication to the upstream MCP server; it does not implement an interactive OAuth browser flow.
- MCP-first reads fall back to REST when MCP is unavailable; callers do not need to change tool names.
- Monitor creation exposes a practical, validated subset of Better Stack's full monitor configuration model.
- Heartbeat creation exposes the core scheduling and alert-channel fields.
- No delete tools are exposed.
- Incident mutations, escalation changes, status-page writes, dashboard writes, telemetry queries, user/role administration, token administration, and billing actions are intentionally out of scope.
