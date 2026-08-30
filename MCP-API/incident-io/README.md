# incident.io MCP Connector

Reusable, security-focused MCP adapter for incident.io's official hosted MCP server. It exposes a stable provider-scoped allowlist for incident response, alert analysis, on-call schedules, escalation handling, teams, and follow-ups while keeping the incident.io API key inside the connector process.

## Official sources researched
Current as of 2026-08-30:

- Remote MCP server: https://docs.incident.io/ai/remote-mcp
- Hosted MCP endpoint: https://mcp.incident.io/mcp
- Public API reference: https://api-docs.incident.io/
- Webhooks: https://docs.incident.io/integrations/webhooks
- API close-incident permission guidance: https://docs.incident.io/integrations/api-close-incidents
- March 31, 2026 hosted MCP release: https://incident.io/changelog/remote-mcp-server

incident.io's official MCP server supports OAuth for interactive users and Bearer API keys for automated systems. This connector uses the official MCP server directly; REST fallback is intentionally unnecessary for the implemented capabilities because all 20 are explicitly exposed by the official MCP surface.

## Architecture

```text
MCP client / agent
  -> local stdio MCP connector
     -> provider-scoped allowlist + approval policy
        -> official MCP client over Streamable HTTP
           -> https://mcp.incident.io/mcp
              -> incident.io
```

The connector calls `tools/list`, validates that every allowlisted upstream tool still exists, reuses the upstream JSON Schema as the source of truth, and fails closed if incident.io removes or renames a required tool. Newly discovered tools are never exposed automatically.

## Authentication and least privilege

Set `INCIDENT_IO_API_KEY` to an incident.io API key. The official MCP documentation states that automated systems can send the key as `Authorization: Bearer <api-key>` to the hosted MCP endpoint. Create a team-scoped or otherwise least-privileged key where available and grant only the permissions needed by the enabled operations.

The credential is never accepted as a tool parameter, included in LLM-visible configuration, or forwarded to callers.

## Environment variables

- `INCIDENT_IO_MCP_URL`: defaults to `https://mcp.incident.io/mcp`; HTTPS only.
- `INCIDENT_IO_API_KEY`: required Bearer API key.
- `INCIDENT_IO_TIMEOUT_MS`: request timeout; default 20000, range 1000-120000.
- `INCIDENT_IO_APPROVAL_SECRET`: local secret used to verify payload-bound approval HMACs for writes.
- `INCIDENT_IO_ENABLE_HIGH_RISK`: defaults to `false`; required for incident mutation and escalation response tools.

## Supported tools

| Connector tool | Official upstream MCP tool | Risk | Approval |
|---|---|---|---|
| `incident-io.incident.list` | `incident_list` | READ | no |
| `incident-io.incident.get` | `incident_show` | READ | no |
| `incident-io.incident.stats` | `incident_stats` | READ | no |
| `incident-io.incident.create` | `incident_create` | WRITE | yes |
| `incident-io.incident.update` | `incident_update` | HIGH_RISK | yes + feature gate |
| `incident-io.incident.update_history.list` | `incident_update_list` | READ | no |
| `incident-io.follow_up.list` | `follow_up_list` | READ | no |
| `incident-io.follow_up.create` | `follow_up_create` | WRITE | yes |
| `incident-io.alert.list` | `alert_list` | READ | no |
| `incident-io.alert.get` | `alert_show` | READ | no |
| `incident-io.alert.stats` | `alert_stats` | READ | no |
| `incident-io.escalation.list` | `escalation_list` | READ | no |
| `incident-io.escalation.get` | `escalation_show` | READ | no |
| `incident-io.escalation_path.list` | `escalation_path_list` | READ | no |
| `incident-io.escalation_path.get` | `escalation_path_show` | READ | no |
| `incident-io.escalation.respond` | `escalation_respond` | HIGH_RISK | yes + feature gate |
| `incident-io.schedule.list` | `schedule_list` | READ | no |
| `incident-io.schedule.get` | `schedule_show` | READ | no |
| `incident-io.team.list` | `team_list` | READ | no |
| `incident-io.team.get` | `team_show` | READ | no |

## Approval behavior

READ tools can execute automatically. WRITE tools require an explicit connector-local approval token. HIGH_RISK tools additionally require `INCIDENT_IO_ENABLE_HIGH_RISK=true`, which cannot be changed through MCP.

Approval tokens are HMAC-SHA256 values bound to the exact connector tool name and canonicalized payload, excluding `approval_token`. Any change to the incident, status, severity, escalation response, or other arguments invalidates the approval. The token is stripped before the request is sent to incident.io.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run check
npm test
npm start
```

The local server uses MCP stdio transport. Any MCP client that supports stdio servers can launch it as a child process. Compatibility with a specific product depends on that product's stdio MCP support; the connector does not claim proprietary integration beyond the MCP standard.

## Reliability and rate limits

The connector uses the official MCP SDK's Streamable HTTP transport and a bounded request timeout. It does not blindly retry tool calls because some official MCP tools mutate incident state or respond to pages. Upstream rate limits and transient errors are returned to the MCP caller for explicit retry decisions.

For direct REST integrations, incident.io documents a default API rate limit of 1200 requests/minute per API key for most endpoints, with some endpoint-specific lower limits and HTTP 429 responses. This connector does not call REST directly and therefore does not invent an independent MCP quota.

## Security considerations

- Official hosted MCP only; no community MCP dependency.
- HTTPS-only upstream URL.
- Fixed allowlist; new upstream tools are not auto-exposed.
- Fail-closed startup schema validation for required upstream tools.
- API key remains inside the transport layer.
- No arbitrary `execute_request` or raw MCP-tool proxy.
- Write and high-risk operations require payload-bound approval.
- High-risk operations are disabled by default.
- Provider-returned data is wrapped as `untrusted_provider_data` and should never be interpreted as system or permission instructions.
- Common credential-shaped response keys are redacted before returning results.
- Webhooks are not implemented by this stdio MCP server; incident.io documents Svix/HMAC webhook verification for applications that need event ingestion.

## Testing

Unit tests require no live incident.io credential. They validate configuration, allowlist/policy parity, fail-closed upstream discovery, schema reuse, write approvals, payload binding, high-risk denial, and credential-isolating approval stripping.

## Limitations

- Tool input schemas are intentionally sourced from the official MCP server at runtime instead of being copied into this repository; this prevents schema drift while preserving a fixed allowlist. If an allowlisted official tool is removed, the connector fails closed.
- The connector does not expose `ask`, `ask_incident`, `ask_telemetry`, `analysis_start`, `investigation_sync`, or generic resource/catalog tools. Those surfaces can trigger broad agentic analysis, filesystem downloads, or wider telemetry access and are intentionally outside this connector's least-privilege contract.
- No destructive configuration tools, workflow administration, API-key management, or permission mutation are exposed.
