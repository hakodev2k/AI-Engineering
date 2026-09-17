# UptimeRobot MCP/API Connector

Reusable MCP server for UptimeRobot monitoring workflows. It exposes a stable, provider-scoped tool contract for monitors, maintenance windows, public status pages, and alert integrations while keeping the UptimeRobot API key inside the connector process.

## Transport strategy

No official UptimeRobot MCP server was found in UptimeRobot's current official API, help-center, or CLI documentation as of 2026-08-22. UptimeRobot does provide an official v3 REST API and an official CLI built on that API. This connector therefore uses the official v3 REST API behind a local MCP stdio server.

Official sources researched:

- UptimeRobot API v3 documentation: https://uptimerobot.com/api/v3/
- UptimeRobot API overview: https://uptimerobot.com/api/
- UptimeRobot v3 launch notes: https://uptimerobot.com/blog/introducing-the-uptimerobot-v3-api/
- UptimeRobot API help: https://help.uptimerobot.com/en/articles/11620152-how-to-use-uptimerobot-s-api
- Official UptimeRobot CLI: https://github.com/uptimerobot/uptimerobot-cli
- Webhook integration and v3 integration API examples: https://help.uptimerobot.com/en/articles/14498593-webhook-integration
- Multi-location v3 examples: https://help.uptimerobot.com/en/articles/11358522-understanding-uptimerobot-locations-and-multi-location-feature

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- MCP stdio transport
- Native `fetch` for UptimeRobot REST calls

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

For development:

```bash
npm run dev
```

## Authentication

UptimeRobot v3 uses an API key presented as a bearer credential:

```text
Authorization: Bearer <UPTIMEROBOT_API_KEY>
```

UptimeRobot documents account-specific keys, monitor-specific keys, and read-only keys. For this connector:

- use a read-only key when only read tools are needed;
- use an account-specific key only when create/update/delete monitor operations are enabled;
- monitor-specific keys are too narrow for the complete connector surface.

Never expose the key to the LLM. Inject it into the connector process from an environment secret or secret manager.

## Environment variables

See `.env.example`.

- `UPTIMEROBOT_API_KEY`: required.
- `UPTIMEROBOT_API_BASE_URL`: defaults to `https://api.uptimerobot.com/v3`.
- `UPTIMEROBOT_TIMEOUT_MS`: per-request timeout, default 15 seconds.
- `UPTIMEROBOT_APPROVAL_MODE`: `required` by default.
- `UPTIMEROBOT_APPROVED_ACTIONS`: comma-separated write actions approved by an operator.
- `UPTIMEROBOT_ALLOW_DESTRUCTIVE`: `false` by default.

Approval state is external configuration, not a model-controlled tool argument.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `uptimerobot.monitor.list` | REST `GET /monitors` | READ | No |
| `uptimerobot.monitor.get` | REST `GET /monitors/{id}` | READ | No |
| `uptimerobot.monitor.create` | REST `POST /monitors` | WRITE | Required by default |
| `uptimerobot.monitor.update` | REST `PATCH /monitors/{id}` | WRITE | Required by default |
| `uptimerobot.monitor.delete` | REST `DELETE /monitors/{id}` | DESTRUCTIVE | Required and disabled by default |
| `uptimerobot.maintenance_window.list` | REST `GET /maintenance-windows` | READ | No |
| `uptimerobot.maintenance_window.get` | REST `GET /maintenance-windows/{id}` | READ | No |
| `uptimerobot.status_page.list` | REST `GET /psps` | READ | No |
| `uptimerobot.status_page.get` | REST `GET /psps/{id}` | READ | No |
| `uptimerobot.integration.list` | REST `GET /integrations` | READ | No |
| `uptimerobot.integration.get` | REST `GET /integrations/{id}` | READ | No |

The monitor mutation schema intentionally exposes a practical typed subset of v3 fields. It does not expose an arbitrary JSON body or generic HTTP escape hatch.

## Real-world workflows

Typical agent workflows include:

```text
List monitors
-> inspect one monitor
-> recommend a change
-> request approval
-> update interval or endpoint
```

and:

```text
List maintenance windows
-> inspect planned maintenance
-> compare with monitor state
-> report expected alert suppression window
```

or:

```text
List public status pages
-> inspect one page
-> correlate with monitor data
-> summarize customer-facing status
```

## Architecture

```text
MCP client
   |
   v
src/server.ts       typed MCP tools + validation
   |
   +--> src/config.ts   secrets + approval policy
   |
   +--> src/client.ts   REST transport + retry/error policy
   |
   v
UptimeRobot API v3
```

## Permission and approval model

Default policy:

```text
READ         -> automatic
WRITE        -> operator approval by default
HIGH_RISK    -> explicit approval
DESTRUCTIVE  -> explicit approval + destructive flag
```

To approve monitor creation temporarily:

```text
UPTIMEROBOT_APPROVED_ACTIONS=uptimerobot.monitor.create
```

Monitor deletion additionally requires:

```text
UPTIMEROBOT_APPROVED_ACTIONS=uptimerobot.monitor.delete
UPTIMEROBOT_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals after the intended change window.

## Rate limits and reliability

UptimeRobot publishes plan-based API limits:

- Free: 10 requests per minute.
- Pro: monitor limit x 2 requests per minute, capped at 5,000 requests per minute.

The API may return:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After`

The connector retries read-only GET operations up to three total attempts on throttling or transient network failures. It honors `Retry-After` or the reset epoch with a bounded wait. Mutation requests are never retried automatically because their outcome may be uncertain and repeating them could duplicate or repeat a destructive action.

Every request has a timeout. Authentication, authorization, validation, and normal provider errors fail without retry.

List tools expose bounded pagination parameters to avoid accidental unbounded API consumption.

## Error handling

Expected error categories include:

- configuration validation failures for missing credentials;
- `APPROVAL_REQUIRED` for writes without operator approval;
- `DESTRUCTIVE_DISABLED` for deletion without the explicit destructive flag;
- `VALIDATION_ERROR` for empty monitor updates;
- `NETWORK_OR_TIMEOUT` after bounded transient read retries;
- `UptimeRobotApiError` with provider HTTP status and response details.

Secrets are never intentionally included in surfaced errors.

## Security considerations

- The API key never appears in MCP tool schemas.
- Tool inputs cannot choose arbitrary HTTP origins.
- No generic raw-request tool is exposed.
- Retrieved monitor names, URLs, status-page content, integration configuration, and provider errors are untrusted data, not instructions.
- Integration reads can contain sensitive configuration. Do not forward those values to prompts, logs, or issue trackers unless explicitly required and authorized.
- Write approval state lives outside the model request.
- Destructive monitor deletion is disabled by default.
- Mutation requests are not retried.
- Inputs use bounded strings, IDs, intervals, timeouts, and page sizes.
- The connector cannot widen its own UptimeRobot credentials or permissions.

For production, prefer a read-only API key for read-only agent workflows and a separately controlled account-level key for approved mutations.

## Testing

Tests require no live UptimeRobot credentials. They cover:

- missing credential validation;
- approved and denied writes;
- destructive-action default denial;
- bearer credential placement;
- authorization-error handling;
- no retries for writes;
- bounded retry for rate limiting;
- expected tool registration;
- absence of a generic API escape hatch.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for representative tool inputs, required credential class, and approval behavior.

## MCP client configuration

Any MCP client that can launch a local stdio server can run the built connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/uptimerobot/dist/src/server.js"],
  "env": {
    "UPTIMEROBOT_API_KEY": "provided-by-secret-manager"
  }
}
```

Do not check real credentials into MCP client configuration.

## Limitations

- This is not a complete UptimeRobot API wrapper.
- No official UptimeRobot MCP server was found, so all implemented capabilities use REST.
- Monitor create/update exposes a deliberate typed subset of v3 fields.
- Maintenance-window, public-status-page, and integration mutations are intentionally not exposed in this version.
- Integration reads may return sensitive configuration and should be tightly permissioned.
- Account administration, billing, credential management, and arbitrary webhook creation are not exposed.
