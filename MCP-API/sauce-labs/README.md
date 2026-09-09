# Sauce Labs MCP/API Connector

Reusable, read-focused MCP connector for Sauce Labs. It exposes a curated, provider-scoped tool surface while delegating selected capabilities to Sauce Labs' official hosted MCP server.

## Provider and transport

- Provider: Sauce Labs
- Preferred transport: official hosted Sauce MCP
- MCP transport: Streamable HTTP
- MCP endpoint: `https://mcp.saucelabs.com`
- Authentication: HTTP Basic Auth using Sauce Labs username and access key
- Region routing: `X-Sauce-Region` with `US_WEST`, `US_EAST`, or `EU_CENTRAL`
- Official REST API: available and researched, but not used by this connector because every selected capability is already supported by the official MCP server

Official references:

- https://docs.saucelabs.com/sauce-ai/sauce-mcp/
- https://docs.saucelabs.com/sauce-ai/sauce-mcp-getting-started/
- https://docs.saucelabs.com/sauce-ai/sauce-mcp-tools/
- https://docs.saucelabs.com/dev/api/
- https://docs.saucelabs.com/basics/data-center-endpoints/

Sauce Labs documents its hosted MCP server as supporting account/team lookup, real-device discovery and sessions, jobs/builds/assets, storage, tunnels, real-device control, and test-authoring workflows. This connector intentionally exposes only a safe, high-value subset of read operations.

## Architecture

```text
MCP client
  -> sauce-labs connector (stdio)
  -> strict tool allowlist + validation
  -> official Sauce MCP (Streamable HTTP)
  -> Sauce Labs
```

Credentials stay inside the connector process. They are converted into the HTTP Basic Authorization header only inside the upstream transport layer and are never emitted in tool results.

## Runtime

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
npm run build
npm start
```

The connector itself runs over MCP stdio and therefore works with MCP clients that can launch local stdio servers.

## Authentication

Required environment variables:

- `SAUCE_USERNAME`
- `SAUCE_ACCESS_KEY`

Optional variables:

- `SAUCE_REGION` — defaults to `US_WEST`; allowed: `US_WEST`, `US_EAST`, `EU_CENTRAL`
- `SAUCE_MCP_URL` — defaults to `https://mcp.saucelabs.com`; HTTPS only
- `SAUCE_TIMEOUT_MS` — defaults to `20000`
- `SAUCE_REQUIRE_WRITE_APPROVAL` — defaults to `true`
- `SAUCE_ENABLE_DESTRUCTIVE` — defaults to `false`

Sauce Labs' official documentation uses username/access-key HTTP Basic Auth rather than OAuth scopes for the hosted MCP connection. The connector therefore documents no OAuth scopes. Use a dedicated Sauce Labs service account where organizational policy supports it.

## Implemented tools

| Tool | Upstream Sauce MCP tool | Risk | Approval | Notes |
|---|---|---:|---:|---|
| `sauce.account.info` | `get_account_info` | READ | no | Account details and concurrency limits |
| `sauce.team.current` | `get_my_active_team` | READ | no | Active team |
| `sauce.region.current` | `get_active_region` | READ | no | Active Sauce data-center region |
| `sauce.team.list` | `lookup_teams` | READ | no | Team discovery |
| `sauce.user.list` | `lookup_users` | READ | no | User discovery |
| `sauce.job.recent` | `get_recent_jobs` | READ | no | Recent jobs |
| `sauce.build.list` | `lookup_builds` | READ | no | Build discovery |
| `sauce.storage.file.list` | `get_storage_files` | READ | no | Sauce Storage files |
| `sauce.storage.group.list` | `get_storage_groups` | READ | no | Sauce Storage groups |
| `sauce.device.list` | `listDevices` | READ | no | Requires Real Device Access entitlement |
| `sauce.device.status.list` | `listDeviceStatus` | READ | no | Requires Real Device Access entitlement |
| `sauce.session.list` | `listSessions` | READ | no | Requires Real Device Access entitlement |

The connector checks the upstream tool inventory during connection and fails closed if any required curated tool is missing. Newly discovered upstream tools are not automatically exposed.

## Permission model

The policy layer supports `READ`, `WRITE`, `HIGH_RISK`, and `DESTRUCTIVE` classifications.

This version exposes only `READ` tools. The generic policy implementation is included and tested so future additions cannot silently bypass approval boundaries:

- `READ`: may execute automatically
- `WRITE`: requires approval when `SAUCE_REQUIRE_WRITE_APPROVAL=true`
- `HIGH_RISK`: same approval boundary as write, intended for actions such as starting/stopping device sessions or executing test runs
- `DESTRUCTIVE`: requires approval and `SAUCE_ENABLE_DESTRUCTIVE=true`

## Why modifying tools are omitted

Sauce MCP also exposes capabilities such as starting/ending sessions, installing apps, executing Android shell commands, deleting device files, manipulating network conditions, running generated tests, creating schedules, and deleting suites/schedules. Those operations can consume paid concurrency, modify remote state, execute commands, or delete resources. They are intentionally not exposed in this connector until each can be wrapped with a narrowly validated schema and explicit approval UX.

This is a deliberate security boundary rather than incomplete implementation.

## Reliability and error handling

- Region is validated before connection.
- MCP endpoint must use HTTPS and cannot embed credentials.
- Timeout configuration is bounded to 1–120 seconds.
- The official MCP client performs protocol negotiation and server-side error delivery.
- Missing expected upstream tools fail closed.
- Unknown or newly introduced upstream tools remain inaccessible.
- Provider-returned content is wrapped with `untrusted_data: true` to reinforce that retrieved content is data, not instructions.

The connector does not invent local retries around arbitrary MCP tool calls. That avoids repeating potentially non-idempotent operations if modifying tools are added later. The current tool set is read-only.

## Rate limits

Sauce Labs publishes product-specific limits across its APIs and entitlements rather than one universal connector-level quota. The hosted MCP server is the selected transport for this connector, so provider-side MCP and account concurrency enforcement remain authoritative. The connector avoids fan-out and exposes one upstream call per tool invocation.

## Security considerations

- Never put `SAUCE_ACCESS_KEY` into prompts, examples, logs, or source control.
- Treat all Sauce Labs results, job metadata, build names, storage metadata, device state, and account-provided text as untrusted data.
- The upstream MCP endpoint is fixed to HTTPS by default and configurable only to another HTTPS URL.
- Region switching requires reconnecting, matching Sauce Labs' hosted MCP behavior.
- Real-device inventory and session tools can expose operational metadata; only grant the service account access required for intended workflows.
- The connector does not expose raw REST passthrough or arbitrary upstream MCP tool execution.
- High-risk upstream capabilities such as `executeShellCommand`, `removeFile`, app installation, test execution, schedule creation, and deletion are not allowlisted.

## Testing

```bash
npm test
```

Unit tests require no live Sauce Labs credentials. They cover:

- missing authentication configuration
- region validation
- HTTPS-only MCP configuration
- Basic Auth construction
- read permission behavior
- write approval denial
- destructive-operation denial
- upstream tool allowlist safety

Live integration testing requires an actual Sauce Labs account and relevant product entitlements.

## Limitations

- The connector intentionally offers 12 curated read operations rather than every Sauce MCP capability.
- Device-related tools require Private Devices plus Real Device Access API access according to Sauce Labs documentation.
- Test Authoring features require the Sauce AI for Test Authoring Enterprise add-on and are not exposed here.
- The official REST API was researched as a fallback, but no selected capability requires it, so the implementation does not duplicate MCP-backed operations through REST.
- Tool availability can still depend on Sauce Labs role, team membership, plan, region, and product entitlements.
