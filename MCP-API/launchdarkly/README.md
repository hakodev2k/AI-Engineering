# LaunchDarkly MCP/API Connector

Reusable Model Context Protocol connector for LaunchDarkly feature-management workflows. It exposes a stable provider-scoped MCP tool surface while routing each capability to an official LaunchDarkly transport.

## Upstream strategy

LaunchDarkly currently provides both a hosted MCP server and an official local MCP server. The hosted MCP endpoint is `https://mcp.launchdarkly.com/mcp/launchdarkly`, uses OAuth, and is the preferred upstream for commercial LaunchDarkly accounts. LaunchDarkly documents the local `@launchdarkly/mcp-server` package for Federal and EU environments where hosted MCP is not available. LaunchDarkly's REST API remains the supported transport for broader management operations and for configured fallback paths.

This connector routes feature-flag list/get/create/update/delete through the official MCP server when MCP credentials are configured. Projects, environments, segments, and webhooks use the official REST API. Read-only feature-flag MCP failures may fall back to REST. Write operations never automatically replay through REST after an attempted MCP write because an ambiguous failure could otherwise duplicate a mutation.

Official sources researched for this implementation:

- Hosted MCP: https://launchdarkly.com/docs/home/getting-started/mcp-hosted
- MCP overview and available product areas: https://launchdarkly.com/docs/home/getting-started/mcp
- Official local MCP implementation: https://github.com/launchdarkly/mcp-server
- REST API overview, authentication, versioning, errors, and rate limits: https://launchdarkly.com/docs/api
- API access tokens and token permissions: https://launchdarkly.com/docs/home/account/api
- Feature flags API: https://launchdarkly.com/docs/api/feature-flags
- Projects API: https://launchdarkly.com/docs/api/projects
- Environments API: https://launchdarkly.com/docs/api/environments
- Segments API: https://launchdarkly.com/docs/api/segments
- Webhooks API and webhook signatures: https://launchdarkly.com/docs/api/webhooks

## Architecture

```text
MCP client / agent
        |
        v
LaunchDarkly connector MCP server
        |
        +-- policy + approval boundary
        |
        +-- official LaunchDarkly MCP
        |     +-- hosted Streamable HTTP + OAuth bearer token
        |     +-- local @launchdarkly/mcp-server + service/personal token
        |
        +-- official LaunchDarkly REST API
              +-- projects / environments
              +-- flag fallback
              +-- segments / webhooks
```

Credentials are read only by the connector process. Tool callers never receive the raw API token or OAuth bearer token. Provider responses are wrapped as `untrustedProviderData: true`; retrieved provider text must be treated as data, not as instructions to the agent.

## Runtime

- Node.js 20 or later
- npm
- `npx` available when `LAUNCHDARKLY_MCP_MODE=local`

Install and build:

```bash
npm install
npm run build
```

Run the MCP server over stdio:

```bash
npm start
```

During development:

```bash
npx tsx src/server.ts
```

## Authentication

### REST and local MCP

Set `LAUNCHDARKLY_ACCESS_TOKEN` to a LaunchDarkly personal or service API access token. Prefer a service token or a narrowly scoped personal token with only the permissions required by the tools you enable. LaunchDarkly REST API tokens are sent in the `Authorization` request header. SDK keys, mobile keys, and client-side IDs are not valid REST API credentials and must not be used here.

LaunchDarkly access-token permissions are role based rather than a fixed OAuth-scope string list. Use a Reader/custom read-only role for read-only deployments. Add only the resource actions necessary for feature-flag creation/update, segment mutation, or webhook management when those tools are enabled.

### Hosted MCP

Hosted LaunchDarkly MCP uses OAuth. This connector does not perform browser-based interactive authorization on behalf of an agent. When `LAUNCHDARKLY_MCP_MODE=hosted`, a trusted OAuth-capable credential broker must provision the already-authorized bearer token into `LAUNCHDARKLY_MCP_ACCESS_TOKEN`. The token stays in the connector process and is never surfaced through a tool result.

For normal human-facing AI clients that natively support OAuth, LaunchDarkly recommends connecting those clients directly to the hosted MCP endpoint.

## Environment variables

Copy `.env.example` into your secret-management workflow; do not commit populated credentials.

| Variable | Purpose |
| --- | --- |
| `LAUNCHDARKLY_ACCESS_TOKEN` | REST API token and local MCP token |
| `LAUNCHDARKLY_API_BASE_URL` | REST origin; default `https://app.launchdarkly.com` |
| `LAUNCHDARKLY_API_VERSION` | `LD-API-Version`; default `20240415` |
| `LAUNCHDARKLY_TIMEOUT_MS` | Request timeout; default 15000 ms |
| `LAUNCHDARKLY_MAX_RETRIES` | Maximum retries for safe read requests; default 3 |
| `LAUNCHDARKLY_MCP_MODE` | `hosted`, `local`, or `rest` |
| `LAUNCHDARKLY_MCP_SERVER_URL` | Hosted endpoint; must remain on `mcp.launchdarkly.com` |
| `LAUNCHDARKLY_MCP_ACCESS_TOKEN` | Pre-authorized OAuth bearer token for hosted MCP |
| `LAUNCHDARKLY_APPROVAL_SECRET` | Secret used by an external approval service to mint approval IDs |
| `LAUNCHDARKLY_ALLOW_DESTRUCTIVE` | Must be exactly `true` before destructive tools can run |

Federal and EU customers should configure the appropriate LaunchDarkly REST origin documented by LaunchDarkly and generally use `LAUNCHDARKLY_MCP_MODE=local` because hosted MCP is not available in those environments.

## Tool catalog

| Tool | Transport | Risk | Approval |
| --- | --- | --- | --- |
| `launchdarkly.project.list` | REST | READ | no |
| `launchdarkly.project.get` | REST | READ | no |
| `launchdarkly.environment.list` | REST | READ | no |
| `launchdarkly.flag.list` | MCP preferred, REST read fallback | READ | no |
| `launchdarkly.flag.get` | MCP preferred, REST read fallback | READ | no |
| `launchdarkly.flag.create` | MCP preferred, REST only when MCP is not configured | WRITE | required |
| `launchdarkly.flag.update` | MCP preferred, REST only when MCP is not configured | HIGH_RISK | required |
| `launchdarkly.flag.delete` | MCP preferred, REST only when MCP is not configured | DESTRUCTIVE | required + disabled by default |
| `launchdarkly.segment.list` | REST | READ | no |
| `launchdarkly.segment.get` | REST | READ | no |
| `launchdarkly.segment.create` | REST | WRITE | required |
| `launchdarkly.segment.update` | REST | HIGH_RISK | required |
| `launchdarkly.webhook.list` | REST | READ | no |
| `launchdarkly.webhook.create` | REST | HIGH_RISK | required |
| `launchdarkly.webhook.delete` | REST | DESTRUCTIVE | required + disabled by default |

The connector intentionally does not expose an unrestricted `request(url, body)` or arbitrary upstream MCP tool. The upstream MCP allowlist contains only the official feature-flag tools used by this package.

## Human approval model

The connector separates read, write, high-risk, and destructive actions.

- READ tools execute without an approval token.
- WRITE tools require an `approvalId`.
- HIGH_RISK tools require an `approvalId`; feature-flag updates are high risk because they can change rollout or targeting behavior, and webhook creation can exfiltrate activity data to an external URL.
- DESTRUCTIVE tools require an `approvalId` and are disabled unless `LAUNCHDARKLY_ALLOW_DESTRUCTIVE=true`.

An approval service outside the LLM computes:

```text
HMAC-SHA256(LAUNCHDARKLY_APPROVAL_SECRET, exact-tool-name)
```

and supplies that digest as `approvalId`. The model should not know `LAUNCHDARKLY_APPROVAL_SECRET` and therefore cannot mint its own approval. This is an execution boundary, not a substitute for an organizational authorization system.

## Reliability

REST reads use a bounded timeout and bounded exponential backoff. HTTP 429 and 5xx responses are retried only for safe read methods. When present, `Retry-After` and LaunchDarkly rate-limit reset headers are honored. Writes are not blindly retried.

LaunchDarkly documents multiple dynamic rate-limit layers, including global, route, access-token, and IP-based limits. The exact call counts are intentionally not hard-coded because LaunchDarkly states those limits may vary and should be handled through returned headers.

Pagination is exposed explicitly through bounded `limit` and `offset` inputs for projects, environments, flags, and segments so agents do not accidentally fan out across large accounts.

Provider HTTP failures are mapped to `LaunchDarklyError` with status, a stable connector code, optional retry-after information, and provider details. Timeout and network failures are distinguished.

## Security considerations

- API credentials remain in process environment/credential infrastructure and never enter agent prompts or tool output.
- REST base URLs must use HTTPS.
- Hosted MCP is pinned to the official `mcp.launchdarkly.com` hostname to reduce SSRF/configuration risk.
- The local MCP transport starts the official `@launchdarkly/mcp-server` package with a single allowlisted tool and `read` or `write` scope per invocation.
- Provider content is explicitly labeled untrusted to reduce prompt-injection confusion.
- Tool inputs use bounded lengths, provider key validation, bounded arrays, and constrained JSON Patch operations.
- Webhook destinations must use HTTPS. LaunchDarkly supports an optional webhook secret and signs webhook payloads with `X-LD-Signature` using HMAC-SHA256; consumers should verify that signature before trusting inbound webhook events.
- LaunchDarkly notes webhook delivery may be retried once and is not guaranteed, so webhook consumers should be idempotent and tolerant of missed/out-of-order events.
- Destructive tools are off by default.
- No tool can increase its own LaunchDarkly token permissions.

## Feature-flag transport behavior

When MCP is configured, flag tools use LaunchDarkly's official MCP capability names:

- `list-feature-flags`
- `get-feature-flag`
- `create-feature-flag`
- `update-feature-flag`
- `delete-feature-flag`

For local MCP, the connector launches the official package with `--tool` to restrict discovery to the single requested operation and uses `--scope read` or `--scope write` as appropriate.

If a read-only MCP operation fails, the connector can safely retry that read through REST. If a write MCP operation was attempted, it is not automatically replayed through REST because the connector cannot know whether the upstream mutation committed before the failure was observed. When MCP is not configured at all, the corresponding official REST operation is used directly.

## Real-world workflows

Common flows include:

```text
project.list
  -> environment.list
  -> flag.list
  -> flag.get
  -> flag.create (approval)
  -> flag.update (strong approval)
```

and:

```text
segment.list
  -> segment.get
  -> segment.create/update (approval)
  -> flag.update targeting (strong approval)
```

Operational integrations can use:

```text
webhook.list
  -> webhook.create (strong approval)
  -> external receiver validates X-LD-Signature
```

Concrete MCP call examples are in `examples/tools.md`.

## Testing

Unit tests use fakes and do not require live LaunchDarkly credentials.

```bash
npm test
```

The suite covers configuration validation, permission/approval denial, destructive-default behavior, server construction/tool registration path, request authentication headers, rate-limit retry behavior, no-blind-retry behavior for writes, and timeout error mapping.

## Limitations

- This connector intentionally implements a focused subset of LaunchDarkly rather than every REST endpoint.
- Hosted MCP interactive OAuth authorization must be performed by a trusted OAuth-capable client or credential broker before this connector can use a hosted bearer token.
- AgentControl and LaunchDarkly observability MCP tools are not exposed in this package; the connector focuses on reusable feature-management workflows.
- Big/list-based/synced segment capabilities can be plan-dependent. This connector exposes basic segment CRUD operations supported by the Segments API and does not pretend Enterprise-only features are universally available.
- The REST API should not be used by application runtime code to evaluate feature flags. LaunchDarkly recommends its SDKs for evaluation because SDKs provide streaming/caching behavior designed for application traffic.
- `dryRun` for `launchdarkly.flag.update` requires the official MCP route in this connector; REST fallback deliberately refuses to emulate it.
