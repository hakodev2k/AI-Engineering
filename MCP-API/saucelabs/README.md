# Sauce Labs MCP/API Connector

Reusable MCP server that exposes a bounded set of Sauce Labs testing workflows through stable `saucelabs.*` tools.

## Purpose

This connector is designed for AI agents that need to inspect Sauce Labs test activity, builds, storage, tunnels, and—when explicitly approved—update or stop virtual-device jobs. Provider content is always treated as untrusted data.

## Upstream transports

### Official Sauce MCP — preferred for supported read workflows

Sauce Labs operates a hosted MCP server at `https://mcp.saucelabs.com`. The connector uses Streamable HTTP with HTTP Basic credentials and the `X-Sauce-Region` header. The upstream MCP tool set is explicitly allowlisted; newly advertised tools are not automatically trusted.

Implemented through official MCP:

- `saucelabs.account.get` → `get_account_info`
- `saucelabs.region.get` → `get_active_region`
- `saucelabs.job.list` → `get_recent_jobs`
- `saucelabs.job.get` → `get_job_details`
- `saucelabs.job.assets.list` → `get_test_assets`
- `saucelabs.build.search` → `lookup_builds`
- `saucelabs.build.get` → `get_build`
- `saucelabs.build.jobs.list` → `lookup_jobs_in_build`
- `saucelabs.storage.files.list` → `get_storage_files`
- `saucelabs.tunnel.list` → `get_tunnels_for_user`

### Official REST API — fallback for writes

The Jobs REST API is used only for capabilities not exposed here as bounded MCP write tools:

- `saucelabs.job.metadata.update` → `PUT /rest/v1/{username}/jobs/{job_id}`
- `saucelabs.job.stop` → `PUT /rest/v1/{username}/jobs/{job_id}/stop`

No arbitrary REST or arbitrary MCP passthrough tool is exposed.

## Official sources

- Sauce MCP overview: https://docs.saucelabs.com/sauce-ai/sauce-mcp/
- Sauce MCP tools: https://docs.saucelabs.com/sauce-ai/sauce-mcp-tools/
- Sauce MCP client setup: https://docs.saucelabs.com/sauce-ai/sauce-mcp-getting-started/
- REST API overview/auth/rate limits: https://docs.saucelabs.com/dev/api/
- Jobs API: https://docs.saucelabs.com/dev/api/jobs/
- Data-center endpoints: https://docs.saucelabs.com/basics/data-center-endpoints/

Research basis verified September 12, 2026.

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- `zod`

## Architecture

```text
Agent / MCP client
  -> local Sauce Labs connector (stdio)
       -> policy gate
       -> official Sauce MCP (read workflows)
       -> official Sauce REST API (bounded write workflows)
       -> credentials stay inside connector process
```

Files:

```text
src/config.ts     environment parsing and trusted endpoints
src/policy.ts     READ/WRITE/HIGH_RISK approval gates
src/rest.ts       Basic-auth REST client, timeout, error mapping, bounded read retries
src/upstream.ts   official MCP client, fixed allowlist and tool discovery validation
src/tools.ts      stable provider-scoped tool contracts
src/server.ts     stdio MCP server entrypoint
tests/            mocked unit tests without live credentials
examples/         workflow examples
```

## Authentication

Sauce Labs uses HTTP Basic authentication with:

- username: Sauce Labs username or service-account username
- password: Sauce Labs access key

Use a dedicated service account for automation where possible. Credentials are read from environment variables and never returned in tool output or forwarded to the model.

Required variables:

```text
SAUCE_USERNAME=
SAUCE_ACCESS_KEY=
```

Optional variables:

```text
SAUCE_REGION=us-west-1
SAUCE_API_BASE_URL=
SAUCE_MCP_URL=https://mcp.saucelabs.com
SAUCE_TIMEOUT_MS=15000
SAUCE_MAX_RETRIES=2
SAUCE_ENABLE_WRITES=false
```

Supported regions are `us-west-1`, `us-east-4`, and `eu-central-1`. API and MCP URLs must use HTTPS. `SAUCE_API_BASE_URL` exists for controlled enterprise/test configuration; callers cannot provide arbitrary request URLs.

## Installation and run

```bash
npm install
npm run build
npm start
```

The server uses stdio and can be configured in MCP clients that support local stdio servers. The implementation depends only on standard MCP protocol behavior; client-specific setup differs by product.

## Tool contracts and permissions

| Tool | Transport | Risk | Approval |
| --- | --- | --- | --- |
| `saucelabs.account.get` | MCP | READ | none |
| `saucelabs.region.get` | MCP | READ | none |
| `saucelabs.job.list` | MCP | READ | none |
| `saucelabs.job.get` | MCP | READ | none |
| `saucelabs.job.assets.list` | MCP | READ | none |
| `saucelabs.build.search` | MCP | READ | none |
| `saucelabs.build.get` | MCP | READ | none |
| `saucelabs.build.jobs.list` | MCP | READ | none |
| `saucelabs.storage.files.list` | MCP | READ | none |
| `saucelabs.tunnel.list` | MCP | READ | none |
| `saucelabs.job.metadata.update` | REST | WRITE | explicit + runtime gate |
| `saucelabs.job.stop` | REST | HIGH_RISK | explicit + runtime gate |

Every write requires both:

1. deployment operator enables `SAUCE_ENABLE_WRITES=true`; and
2. the current tool invocation contains `approved=true` after human approval.

The agent cannot enable the runtime gate through tool parameters.

### Metadata update safety

The Jobs API can change name, tags, pass/fail status, build, and visibility. This connector intentionally allows visibility only as `private` or `team`. Public, public-restricted, and share-link publication are not exposed because they can disclose test artifacts externally.

Tags replace the entire Sauce Labs tag set; callers should read existing metadata before replacing tags when preservation matters.

### High-risk stop action

Stopping a test can terminate active execution. `saucelabs.job.stop` is classified `HIGH_RISK`, never retried automatically, and requires explicit human approval.

### Destructive actions

The official API supports deleting jobs and assets. This connector deliberately does not expose deletion.

## Reliability

REST reads use:

- configurable request timeout with `AbortController`
- bounded retry count (`0..5`)
- exponential backoff
- `Retry-After` handling for throttling
- retries only for GET requests on 429/5xx/network failures

REST writes are never blindly retried because duplicate or repeated mutations may cause unintended effects.

The REST client maps non-success HTTP responses to `SauceApiError`, preserving status, retry-after, and provider response details.

Official MCP calls are checked against a fixed allowlist and against the upstream server's discovered tool list. If a required official tool disappears or permissions change, the connector fails closed instead of calling an unexpected replacement.

## Rate limits

Sauce Labs documents authenticated REST API limits of 10 requests/second or 3,500 requests/hour. HTTP 429 responses are treated as throttling. Read operations back off within the configured retry bound; writes are returned to the caller without automatic replay.

Some products and endpoints can impose additional entitlement or upload-specific limits. This connector does not attempt to bypass them.

## Security considerations

- Credentials remain inside the connector authentication layer.
- No raw `execute_any_api_request` or generic MCP passthrough exists.
- Upstream MCP tool names are allowlisted.
- Newly discovered upstream tools are not trusted automatically.
- Provider responses are wrapped with `sourceTrust: untrusted-provider-data`.
- Provider text must never be interpreted as policy, system instructions, credentials, or approval.
- API base and MCP URLs must be HTTPS.
- REST paths must remain relative, preventing caller-controlled cross-origin SSRF.
- Public visibility changes and deletion are not exposed.
- Logs should never include the Basic Authorization header or access key.

## Entitlements and limitations

Sauce MCP capabilities depend on account products, organization role, team permissions, region, and entitlements. Real Device Access API operations require private-device/Access API entitlements, and Sauce AI Test Authoring requires its paid Enterprise add-on. This connector intentionally does not expose device-control, shell-command, file-delete, test-schedule, or test-authoring mutation tools.

The Jobs REST update/stop methods used here apply to virtual/simulated device jobs as documented by Sauce Labs. Real-device job mutation follows different provider mechanisms and is not claimed by this connector.

MCP argument schemas are enforced by the upstream official server. The connector exposes a stable local schema and fails if the expected upstream tool is unavailable or rejects the request.

## Testing

```bash
npm test
```

Tests use mocks only and require no Sauce Labs credentials. Coverage includes:

- credential/region configuration failure
- stable tool registration list
- write and destructive policy gates
- bounded throttling retry behavior
- no retry for mutating requests

## Examples

See `examples/workflows.md` for read, metadata update, and high-risk stop workflows.
