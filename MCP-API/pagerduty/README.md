# PagerDuty MCP/API Connector

Reusable MCP server for incident-response workflows across PagerDuty incidents, services, schedules, on-calls, escalation policies, and users.

## Transport strategy

PagerDuty provides an official hosted MCP server at `https://mcp.pagerduty.com/mcp` for US accounts and `https://mcp.eu.pagerduty.com/mcp` for EU accounts, plus an official self-hosted implementation at `PagerDuty/pagerduty-mcp-server`. Current PagerDuty documentation says MCP can retrieve incident data, manage services, and update on-call schedules, and recent MCP releases added OAuth authentication, Event Orchestration support, live service status, v3 schedules, webhooks, and extensions.

This connector intentionally exposes a narrower deterministic tool surface through PagerDuty's official REST API. The stable external MCP contract is easier to audit, permission, and test, and it avoids automatically trusting newly added upstream MCP tools. The official PagerDuty MCP remains appropriate for broader interactive workflows when its complete toolset is desired.

Official sources researched:

- PagerDuty MCP Server: https://support.pagerduty.com/main/docs/pagerduty-mcp-server
- PagerDuty MCP source/tool reference: https://github.com/PagerDuty/pagerduty-mcp-server
- PagerDuty REST API: https://developer.pagerduty.com/api-reference/
- API access keys: https://support.pagerduty.com/main/docs/api-access-keys
- REST API rate limits: https://support.pagerduty.com/main/docs/rest-api-rate-limits
- Service regions: https://support.pagerduty.com/main/docs/service-regions
- MCP June 2026 updates: https://support.pagerduty.com/main/changelog/may-mcp-announcements

## Runtime and installation

Requires Node.js 20+, TypeScript, and an MCP client capable of launching a local stdio server.

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

The REST connector uses a PagerDuty User API Token provided through `PAGERDUTY_API_TOKEN`. PagerDuty also supports scoped OAuth apps, and its hosted MCP supports authenticated remote access; this connector does not implement interactive OAuth because the selected REST contract is designed for service/bot execution.

Credentials stay inside the connector process and are attached only to PagerDuty requests:

```text
Authorization: Token token=<secret>
```

Incident mutations additionally require `PAGERDUTY_FROM_EMAIL`, because PagerDuty requires a `From` header for many incident write operations performed with a user token.

Use a dedicated bot/service identity where possible and grant only the PagerDuty permissions needed by the implemented tools. Do not expose the token or approval configuration to the LLM.

## Regions

US REST API default:

```text
https://api.pagerduty.com
```

EU REST API:

```text
https://api.eu.pagerduty.com
```

Set `PAGERDUTY_API_BASE_URL` to the correct service region.

## Environment variables

See `.env.example`.

- `PAGERDUTY_API_TOKEN`: required secret.
- `PAGERDUTY_API_BASE_URL`: REST API origin, US by default.
- `PAGERDUTY_FROM_EMAIL`: acting PagerDuty user's email; required by incident mutations.
- `PAGERDUTY_TIMEOUT_MS`: 1-60 second timeout, default 15 seconds.
- `PAGERDUTY_APPROVAL_MODE`: `required` by default.
- `PAGERDUTY_APPROVED_ACTIONS`: comma-separated write actions approved externally by an operator.
- `PAGERDUTY_ALLOW_DESTRUCTIVE`: reserved strong-approval safety switch; false by default.

Approval state is not accepted as a tool input, preventing an agent from self-approving.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `pagerduty.incident.list` | REST `GET /incidents` | READ | No |
| `pagerduty.incident.get` | REST `GET /incidents/{id}` | READ | No |
| `pagerduty.incident.acknowledge` | REST `PUT /incidents/{id}` | HIGH_RISK | Required |
| `pagerduty.incident.resolve` | REST `PUT /incidents/{id}` | HIGH_RISK | Required |
| `pagerduty.incident.reassign` | REST `PUT /incidents/{id}` | HIGH_RISK | Required |
| `pagerduty.service.list` | REST `GET /services` | READ | No |
| `pagerduty.service.get` | REST `GET /services/{id}` | READ | No |
| `pagerduty.schedule.list` | REST `GET /schedules` | READ | No |
| `pagerduty.schedule.get` | REST `GET /schedules/{id}` | READ | No |
| `pagerduty.oncall.list` | REST `GET /oncalls` | READ | No |
| `pagerduty.escalation_policy.list` | REST `GET /escalation_policies` | READ | No |
| `pagerduty.user.list` | REST `GET /users` | READ | No |

The connector deliberately does not expose arbitrary request execution, user/role administration, billing, integrations, or account-level security settings.

## Architecture

```text
MCP client
   |
   v
src/server.ts        strict tool schemas + risk boundaries
   |
   +--> src/config.ts   credentials + external approval policy
   |
   +--> src/client.ts   REST transport + timeout/retry/error handling
   |
   v
PagerDuty REST API
```

Provider-returned incident titles, descriptions, notes, service metadata, schedule names, user fields, and errors are untrusted data and must never be interpreted as instructions that alter tool permissions or system behavior.

## Permission and approval model

Default policy:

```text
READ         -> automatic
WRITE        -> operator approval
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> explicit approval + destructive safety switch
```

For example, acknowledging an incident requires:

```text
PAGERDUTY_APPROVED_ACTIONS=pagerduty.incident.acknowledge
```

Resolving or reassigning requires the corresponding action name. Remove temporary approvals when the operation window ends.

## Reliability and rate limiting

PagerDuty exposes `ratelimit-limit`, `ratelimit-remaining`, and `ratelimit-reset` response headers and returns HTTP 429 when throttled. The connector retries only read-only GET operations, with at most three total attempts. It respects `ratelimit-reset` or `retry-after`, capped to ten seconds per wait, and uses bounded exponential backoff for transient read network failures.

Writes are never automatically retried because a timeout after a mutation can leave the remote outcome uncertain. Authentication, authorization, validation, and provider errors fail immediately.

List operations expose bounded `limit` and `offset` parameters to avoid accidental request fan-out.

## Validation and security

- API base URL is configuration, never a tool-selected arbitrary URL.
- IDs are constrained to PagerDuty-style alphanumeric identifiers.
- Pagination, arrays, strings, and time fields are bounded.
- Incident statuses and urgency values are enums.
- Writes require external approval.
- Credentials are never tool inputs or outputs.
- No generic `execute_any_api_request` tool exists.
- No automatic privilege expansion or upstream MCP tool discovery occurs.
- Provider content is treated as untrusted data.
- Mutation retries are disabled.

For production, isolate secrets in a secret manager and run the connector with the minimum PagerDuty role/scopes required.

## Error handling

Expected categories include:

- configuration validation failures;
- `CONFIG_ERROR` when a mutation needs `PAGERDUTY_FROM_EMAIL`;
- `APPROVAL_REQUIRED` for unapproved writes;
- `DESTRUCTIVE_DISABLED` for future destructive tools unless strongly enabled;
- `NETWORK_OR_TIMEOUT` after bounded read retries;
- `PagerDutyApiError` for PagerDuty HTTP failures.

Secrets are not intentionally included in surfaced errors.

## Testing

Unit tests require no live PagerDuty credentials. They cover missing auth configuration, approval enforcement, provider headers, required `From` behavior, no write retries, bounded read-rate-limit retries, scoped tool registration, and absence of a generic request escape hatch.

```bash
npm test
```

## Examples

See `examples/tool-calls.md` for tool inputs, risk classifications, and approval requirements.

## MCP client configuration

Any MCP client that can launch a local stdio server can use the built connector:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/pagerduty/dist/src/server.js"],
  "env": {
    "PAGERDUTY_API_TOKEN": "provided-by-secret-manager",
    "PAGERDUTY_FROM_EMAIL": "pagerduty-bot@example.com"
  }
}
```

Do not commit real credentials into client configuration.

## Limitations

- This is a curated operational subset, not the complete PagerDuty REST API.
- The official hosted/self-hosted PagerDuty MCP server is documented but not proxied.
- Interactive OAuth for the hosted MCP is not implemented here.
- Service, schedule, escalation-policy, and user mutations are intentionally omitted.
- Incident notes, response plays, Event Orchestration, webhooks, extensions, and analytics are not exposed in this first safety-focused surface.
- Correct PagerDuty account permissions and plan features are still enforced by PagerDuty upstream.
