# FireHydrant MCP/API Connector

Reusable Model Context Protocol server for incident investigation, incident declaration, incident analytics, teams, alerts, status-page context, and guarded incident-response actions in FireHydrant.

## Transport strategy

FireHydrant provides an official local stdio MCP server (`firehydrant-mcp`) and a REST API. The official MCP server was publicly announced in beta and its generated source currently exposes a small tool surface including `list-incidents`, `create-incident`, alert listing, and retrospective operations. Its documented CLI passes the API key as `--api-key` on the subprocess command line. This connector therefore does **not** launch that subprocess: doing so would make a long-lived secret more visible to local process inspection. Instead, it exposes stable MCP tools itself and uses the official REST API with the credential isolated in the HTTP `Authorization` header. This also supplies capabilities that the current upstream MCP tool set does not expose.

Upstream capability check and API fallback are intentional rather than an unofficial MCP dependency.

Official sources researched:

- FireHydrant MCP announcement: https://firehydrant.com/changelog/introducing-firehydrant-mcp-server/
- Official MCP repository: https://github.com/freshworks-oss/firehydrant-mcp
- API overview/auth/rate limits: https://docs.firehydrant.com/reference/firehydrant-api
- API key guidance: https://docs.firehydrant.com/docs/api-keys
- Incidents: https://docs.firehydrant.com/reference/list_incidents
- Create incident: https://docs.firehydrant.com/reference/create_incident
- Incident events: https://docs.firehydrant.com/reference/list_incident_events
- Incident metrics: https://docs.firehydrant.com/reference/list_incident_metrics
- Mean-time report: https://docs.firehydrant.com/reference/get_mean_time_report
- Teams: https://docs.firehydrant.com/reference/list_teams
- Runbook actions: https://docs.firehydrant.com/reference/list_runbook_actions
- Runbook execution: https://docs.firehydrant.com/reference/create_runbook_execution
- Close incident: https://docs.firehydrant.com/reference/close_incident

## Runtime and architecture

Requires Node.js 20+.

```text
MCP client
   |
   v
src/server/index.ts
   |
   +--> src/tools/register.ts       stable MCP contracts + validation + risk gates
   +--> src/auth/config.ts          credentials/config/approval policy
   +--> src/client/firehydrant-client.ts
              |
              +--> GET reads: FireHydrant read-only API host where available
              +--> writes: FireHydrant primary REST API
```

The LLM receives tool schemas and tool outputs, never the raw API key. Retrieved provider content is marked `untrusted_provider_content: true` and must be treated as data, not instructions.

## Authentication

FireHydrant's REST API uses an API key in the HTTP header:

```text
Authorization: Bearer <token>
```

Create and manage API keys in FireHydrant. FireHydrant documentation notes that managing API keys requires Owner permissions and that API keys may act with powerful account permissions, so use a dedicated automation key and apply organization RBAC where available. Never paste the key into prompts or commit it.

Copy `.env.example` into your secret-management workflow and set:

```text
FIREHYDRANT_API_KEY=
FIREHYDRANT_REGION=us
FIREHYDRANT_TIMEOUT_MS=15000
FIREHYDRANT_MAX_RETRIES=2
FIREHYDRANT_WRITE_APPROVAL_REQUIRED=true
FIREHYDRANT_HIGH_RISK_ENABLED=false
```

`FIREHYDRANT_REGION` accepts `us` or `eu`. The US read path uses `https://api-read.firehydrant.io/v1` for supported GET operations. The EU configuration uses the EU primary API host for reads because this connector does not assume an undocumented EU read-only hostname.

## Installation

```bash
npm install
npm run build
npm start
```

The process is a stdio MCP server and can be configured by any MCP client that can launch a local command. Point the client at `npm start` (or `node dist/src/server/index.js`) with the required environment variables supplied by the client's secure environment configuration.

## Implemented tools

| Tool | Transport | Permission | Approval | Purpose |
|---|---|---:|---:|---|
| `firehydrant.incident.list` | REST; official MCP has analogous capability | READ | No | Search/list incidents with bounded filters and pagination |
| `firehydrant.incident.get` | REST | READ | No | Retrieve one incident |
| `firehydrant.incident.events.list` | REST | READ | No | Retrieve incident timeline events |
| `firehydrant.incident.alerts.list` | REST | READ | No | Retrieve alerts attached to an incident |
| `firehydrant.incident.links.list` | REST | READ | No | Retrieve external incident links |
| `firehydrant.incident.status_pages.list` | REST | READ | No | Retrieve status pages attached to an incident |
| `firehydrant.incident.metrics` | REST | READ | No | Retrieve time-bucketed incident analytics |
| `firehydrant.incident.mean_time` | REST | READ | No | Retrieve mean-time incident report |
| `firehydrant.team.list` | REST | READ | No | Search/list organization teams |
| `firehydrant.runbook.actions.list` | REST | READ | No | List available runbook integration actions |
| `firehydrant.incident.create` | REST; official MCP has analogous capability | WRITE | Yes by default | Declare an incident |
| `firehydrant.incident.alert.attach` | REST | WRITE | Yes by default | Attach already-ingested alerts to an incident |
| `firehydrant.runbook.execute` | REST | HIGH_RISK | Always | Attach and execute a runbook |
| `firehydrant.incident.close` | REST | HIGH_RISK | Always | Close an incident |

The connector intentionally does not expose a generic request/URL tool, arbitrary REST proxy, incident deletion/archive endpoint, permission administration, billing actions, or secret-management operations.

## Permission and approval model

`READ` tools may run automatically. `WRITE` tools require `approved: true` when `FIREHYDRANT_WRITE_APPROVAL_REQUIRED=true` (the default). This boolean represents approval already collected by the host/human for the exact action; it is not permission for the agent to self-approve.

`HIGH_RISK` tools require both:

1. `FIREHYDRANT_HIGH_RISK_ENABLED=true`, deliberately configured outside the prompt; and
2. `approved: true` for the exact invocation.

Thus a model cannot silently elevate itself by merely setting the tool argument when the server-level high-risk gate is disabled.

## Reliability and rate limits

FireHydrant documents API-key rate limiting at the account level as 50 requests per 10 seconds / 300 requests per minute, with HTTP `429` and `Retry-After`. The client preserves `Retry-After` and uses bounded exponential backoff for safe GET requests only. The default retry count is 2 and the configurable maximum is 5.

Writes are **never automatically retried**, preventing duplicate incident declarations, repeated runbook executions, repeated alert attachments, or accidental lifecycle transitions. HTTP `429`, provider 4xx/5xx responses, malformed credentials, network errors, and timeouts surface as tool errors. Requests use an `AbortController` timeout.

Pagination is explicit (`page`, `per_page`) and `per_page` is capped at 200, matching FireHydrant's documented maximum. The connector avoids hidden pagination loops so an agent cannot accidentally generate a burst of API calls.

## Security considerations

- API keys stay in the connector process and are only placed in the outbound authorization header.
- No credentials are logged or returned in errors.
- Tool arguments use strict IDs, bounded strings, enumerations, date validation, and bounded arrays.
- No caller-controlled URL is accepted, eliminating a generic SSRF surface.
- Provider responses are wrapped and labelled as untrusted content; they cannot change permissions, approval rules, or server configuration.
- High-risk runbook execution and incident closing fail closed unless server configuration enables them.
- Destructive archive/delete operations are not exposed.
- The official MCP server is trusted as FireHydrant's official implementation, but this connector deliberately avoids spawning it with secrets in command-line arguments. If FireHydrant later provides a credential-safe remote transport or environment-based secret injection with equivalent contracts, an upstream MCP transport can be added without changing these external tool names.

## Error model

`FireHydrantError` records provider HTTP status, parsed response body, and `Retry-After` where present. MCP handlers return errors with `isError: true`. Authentication and permission errors are not retried. Provider bodies can be inspected by application code but raw credentials never appear in generated error messages.

## Testing

Normal tests do not require live credentials:

```bash
npm test
```

The suite verifies:

- missing credential rejection;
- stable tool registration metadata;
- READ/WRITE/HIGH_RISK permission boundaries;
- explicit high-risk enablement;
- credential isolation in the authorization header;
- selection of the read-only host for safe reads;
- provider error mapping without key leakage; and
- no blind retries for writes.

Run `npm run build` as an additional type-safety gate.

## Examples

See `examples/workflows.md` for incident investigation, reliability analytics, incident declaration, runbook execution, and incident closing examples with permission/approval expectations.

## Limitations

- This package intentionally uses the official REST API rather than proxying FireHydrant's current local MCP beta because the documented upstream launch method places its API key in a command-line argument and its generated tool surface is narrower than the workflows implemented here.
- The connector does not store or refresh credentials; FireHydrant API keys are static secrets supplied by the host environment.
- It does not auto-follow pagination.
- It does not expose every FireHydrant endpoint.
- The US read-only API may lag the primary API by up to roughly 30 seconds according to FireHydrant documentation, so immediately-after-write reads can be briefly stale.
- Compatibility is limited to MCP clients capable of launching a stdio MCP server; no hosted Streamable HTTP endpoint is included.
