# Buildkite MCP/API Connector

Reusable MCP connector for Buildkite CI/CD workflows. It presents stable provider-scoped MCP tools while preferring Buildkite's official remote MCP server for capabilities that Buildkite exposes there, and using the official REST API only where the MCP surface is incomplete or as a bounded read fallback.

## Provider and purpose

Provider: Buildkite.

Primary workflows:

- discover pipelines and builds
- inspect builds and jobs
- search and read job logs
- inspect artifacts and annotations
- trigger, cancel, or rebuild builds with approval controls
- retry or unblock jobs with approval controls
- create annotations with approval controls
- delete artifacts through an explicit destructive REST fallback

## Official sources researched

The implementation and capability map were checked against current Buildkite documentation on 2026-08-27:

- Buildkite APIs: https://buildkite.com/docs/apis
- Official MCP server overview: https://buildkite.com/docs/apis/mcp-server
- Official MCP tools: https://buildkite.com/docs/apis/mcp-server/tools
- MCP toolsets: https://buildkite.com/docs/apis/mcp-server/tools/toolsets
- Remote MCP configuration: https://buildkite.com/docs/apis/mcp-server/remote/configuring-ai-tools
- REST API overview: https://buildkite.com/docs/apis/rest-api
- REST rate limits: https://buildkite.com/docs/apis/rest-api/rate-limits
- API token management and scopes: https://buildkite.com/docs/apis/managing-api-tokens
- Pipelines REST API: https://buildkite.com/docs/apis/rest-api/pipelines
- Builds REST API: https://buildkite.com/docs/apis/rest-api/builds
- Artifacts REST API: https://buildkite.com/docs/apis/rest-api/artifacts
- Official open-source MCP server: https://github.com/buildkite/buildkite-mcp-server

Buildkite provides both remote and local official MCP servers. The remote OAuth endpoint is `https://mcp.buildkite.com/mcp`; the headless API-token pass-through endpoint is `https://mcp.buildkite.com/direct`. This connector uses `/direct` because it is designed to run as a reusable non-interactive service. The configured API token is retained inside the connector and is never returned to the MCP caller.

## Transport strategy

| Connector capability | Upstream | Reason |
|---|---|---|
| organization read | official MCP | official `user_token_organization` tool |
| pipeline list/get | official MCP, REST read fallback | official MCP first; REST provides same read capability |
| build list/get | official MCP, REST read fallback | official MCP first; fallback is safe and idempotent |
| build create/cancel/rebuild | official MCP | official Buildkite MCP supports them; mutations are not blindly retried or duplicated through REST |
| job list/get/retry/unblock | official MCP | official `builds` toolset |
| log search/read | official MCP | Buildkite MCP adds log processing/caching that is more suitable than exposing raw logs directly |
| artifact list | official MCP | official `artifacts` toolset |
| artifact delete | REST API | official MCP artifact tools expose list/get but not delete; Buildkite REST explicitly supports deletion |
| annotation list/create | official MCP | official `annotations` toolset |

The connector never exposes an arbitrary HTTP or arbitrary GraphQL execution tool.

## Architecture

```text
MCP client / agent
        |
        v
Buildkite connector MCP server
        |
        +--> policy + strict Zod validation + approval gate
        |
        +--> official Buildkite remote MCP (/direct)
        |       toolsets: user,pipelines,builds,logs,artifacts,annotations
        |
        +--> official Buildkite REST API v2
                bounded read fallback + artifact.delete only
```

Credential flow:

```text
Agent -> connector tool -> credential held in process env -> Buildkite
```

The token is not accepted as a tool argument and is not inserted into tool output.

## Authentication

Create a Buildkite API access token for a Buildkite user that is a member of the target organization. Buildkite documents granular REST scopes. Grant only the scopes needed by the tools you actually enable.

Scopes used by this connector:

- `read_user` - official MCP user functions
- `read_organizations` - organization lookup
- `read_pipelines` - pipeline list/get
- `read_builds` - build/job/annotation reads
- `read_build_logs` - log tools
- `read_artifacts` - artifact list/read metadata
- `write_builds` - build create/cancel/rebuild, retry/unblock jobs, create annotations
- `write_artifacts` - destructive artifact deletion

For read-only installations, omit write scopes and do not provide approval material. Buildkite's remote MCP also supports read-only routing, but this wrapper keeps one stable endpoint and additionally enforces its own per-tool policy.

Buildkite's GraphQL API is not used because normal GraphQL API-token access is not granularly scoped in the same way as REST. Buildkite documents Portals as the mechanism for restricted GraphQL operations; none are required by this connector.

## Environment variables

Copy `.env.example` into your secret-management workflow. Do not commit real values.

Required:

- `BUILDKITE_API_TOKEN`

Optional:

- `BUILDKITE_MCP_URL` - defaults to `https://mcp.buildkite.com/direct`; code restricts this to `mcp.buildkite.com` over HTTPS
- `BUILDKITE_API_BASE_URL` - defaults to `https://api.buildkite.com/v2`; code restricts this to `api.buildkite.com` over HTTPS
- `BUILDKITE_TOOLSETS` - defaults to `user,pipelines,builds,logs,artifacts,annotations`
- `BUILDKITE_APPROVAL_SECRET` - HMAC secret held by the trusted approval controller and connector
- `BUILDKITE_TIMEOUT_MS` - default `20000`
- `BUILDKITE_MAX_READ_RETRIES` - default `3`

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

## Run as an MCP server

```bash
BUILDKITE_API_TOKEN=... npm start
```

The connector uses MCP stdio transport outward to clients. It connects upstream to Buildkite's official Streamable HTTP MCP endpoint.

Example generic client configuration after building:

```json
{
  "mcpServers": {
    "buildkite-connector": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/buildkite/dist/src/server.js"],
      "env": {
        "BUILDKITE_API_TOKEN": "<provided-by-secret-manager>"
      }
    }
  }
}
```

A client capable of launching stdio MCP servers can use this package. Compatibility depends on the client supporting standard MCP stdio transport; the connector does not rely on a client-specific extension.

## Tool list

| Tool | Purpose | Scope | Risk | Approval |
|---|---|---|---|---|
| `buildkite.organization.get` | resolve organization for token | `read_organizations` | READ | no |
| `buildkite.pipeline.list` | list pipelines | `read_pipelines` | READ | no |
| `buildkite.pipeline.get` | read one pipeline | `read_pipelines` | READ | no |
| `buildkite.build.list` | list/filter builds | `read_builds` | READ | no |
| `buildkite.build.get` | read one build | `read_builds` | READ | no |
| `buildkite.build.create` | trigger build | `write_builds` | WRITE | yes |
| `buildkite.build.cancel` | cancel running build | `write_builds` | HIGH_RISK | yes |
| `buildkite.build.rebuild` | rebuild prior build | `write_builds` | WRITE | yes |
| `buildkite.job.list` | list build jobs | `read_builds` | READ | no |
| `buildkite.job.get` | get job | `read_builds` | READ | no |
| `buildkite.job.retry` | retry job | `write_builds` | WRITE | yes |
| `buildkite.job.unblock` | unblock gated job | `write_builds` | HIGH_RISK | yes |
| `buildkite.logs.search` | regex-search processed logs | `read_build_logs` | READ | no |
| `buildkite.logs.read` | read bounded log entries | `read_build_logs` | READ | no |
| `buildkite.artifact.list` | list build artifacts | `read_artifacts` | READ | no |
| `buildkite.artifact.delete` | delete artifact | `write_artifacts` | DESTRUCTIVE | yes |
| `buildkite.annotation.list` | list annotations | `read_builds` | READ | no |
| `buildkite.annotation.create` | create annotation | `write_builds` | WRITE | yes |

All input schemas constrain identifiers, enums, lengths, ranges, and pagination. Tool responses are treated as untrusted provider data.

## Approval model

Read operations may execute automatically when the token has the required provider scope.

Write, high-risk, and destructive tools require a cryptographic approval token. Approval is not a free-form boolean. A trusted controller outside the model computes:

```text
HMAC-SHA256(BUILDKITE_APPROVAL_SECRET, tool_name + "\n" + canonicalized_tool_arguments)
```

The model does not receive `BUILDKITE_APPROVAL_SECRET`. The resulting digest is supplied as `approval_id`. The connector recalculates it and performs constant-time comparison. Any change to the tool or its exact intent invalidates the approval.

`buildkite.artifact.delete` is destructive and therefore cannot run unless an exact approval is supplied. Mutations are never automatically retried after provider or transport failure because doing so could duplicate effects.

## Reliability and rate limits

Buildkite documents two REST limits: an organization-level rate limit and a per-user rate limit. At the time this connector was researched, Buildkite documented a default organization limit of 200 requests/minute and default per-user limit of 50 requests/minute, subject to plan-specific variation. Every REST response exposes organization and user rate-limit headers. `429` is used for throttling.

The connector:

- performs bounded retries only for explicitly idempotent reads
- honors `RateLimit-User-Reset`, `RateLimit-Reset`, or `Retry-After` when present
- uses exponential backoff for transient network failures
- never retries permission or validation errors
- never blindly retries mutation or destructive calls
- imposes an AbortController timeout on REST requests
- uses pagination parameters instead of unbounded list requests

Buildkite documents that requests routed through its remote MCP server use a separate remote-MCP limit; local MCP calls count toward normal organization REST limits.

## Error handling

REST failures are mapped to `BuildkiteError` with HTTP status and retry-after context when known. Provider bodies are truncated before inclusion in error messages. Authentication/authorization failures are returned immediately and are not retried.

MCP tool errors are converted into connector errors. Read tools with a defined REST equivalent can fall back to REST after an upstream MCP failure. Write tools intentionally do not fall back automatically because the connector cannot safely prove that an MCP mutation failed before Buildkite applied it.

## Security considerations

- Credentials are environment/config-layer data, never tool arguments.
- Upstream hosts are allowlisted to Buildkite's official HTTPS hosts, reducing SSRF risk.
- Only an explicit upstream MCP toolset allowlist is configured.
- The connector does not discover newly added upstream tools and auto-expose them.
- Provider content, logs, annotations, pipeline configuration, and artifact metadata are untrusted data and must not alter local permissions or instructions.
- No arbitrary API-request tool exists.
- Destructive operations require an exact external approval.
- Logs may contain secrets produced by CI jobs; callers should apply their own output/data-retention policy.
- Buildkite supports organization API IP allowlists; Buildkite documents that remote MCP egress addresses must be allowed when that feature is enabled.
- For custom artifact storage, Buildkite documents that deleting the Buildkite artifact record might not remove the object from customer-managed storage.

## Testing

Normal tests require no live Buildkite credentials.

```bash
npm test
```

The test suite covers:

- missing authentication configuration
- official-host validation
- read-vs-write approval behavior
- destructive classification
- exact HMAC approval binding
- throttled read retry
- permission failure behavior
- no retry for destructive operations
- registration of every declared tool

Live integration testing is intentionally separate because it requires a real Buildkite organization and token.

## Limitations

- Interactive OAuth for `https://mcp.buildkite.com/mcp` is not implemented by this headless wrapper; use Buildkite's native remote MCP endpoint directly for interactive clients that support its OAuth flow.
- Buildkite's official MCP server evolves independently. If an upstream tool schema changes, this wrapper's mapping should be reviewed against the official open-source MCP server and docs before upgrading.
- The connector intentionally omits pipeline deletion, cluster changes, agent management, billing/security changes, and unrestricted GraphQL operations.
- Log search/read rely on Buildkite's official MCP implementation; there is no raw REST fallback for these higher-level log-processing semantics.
- Artifact download content is not exposed as a connector tool to avoid unexpectedly returning large binary/base64 payloads to an agent.
