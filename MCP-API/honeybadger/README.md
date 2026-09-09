# Honeybadger MCP/API Connector

Reusable MCP server for Honeybadger error tracking, Insights, project monitoring, check-ins, and uptime inspection.

This connector exposes stable `honeybadger.*` tools while keeping credentials inside the connector. It prefers Honeybadger's **official MCP server** for capabilities the official server currently exposes and uses Honeybadger's **official Data API** only for uptime capabilities that are documented by the API but are not currently listed among the official MCP tools.

## Official sources

Verified against current Honeybadger documentation on 2026-09-09:

- MCP: https://docs.honeybadger.io/resources/mcp/
- Official MCP source: https://github.com/honeybadger-io/honeybadger-mcp-server
- API overview: https://docs.honeybadger.io/api/
- Data API/auth/rate limits: https://docs.honeybadger.io/api/getting-started/
- Errors/faults: https://docs.honeybadger.io/api/faults/
- Projects: https://docs.honeybadger.io/api/projects/
- Insights: https://docs.honeybadger.io/api/insights/
- Check-ins: https://docs.honeybadger.io/api/check-ins/
- Uptime: https://docs.honeybadger.io/api/uptime/

Honeybadger provides a hosted MCP server at `https://mcp.honeybadger.io/mcp` and an EU endpoint at `https://eu-mcp.honeybadger.io/mcp`. Hosted MCP uses browser authorization with account selection and read-only/read-write access. The official server is also distributed as `ghcr.io/honeybadger-io/honeybadger-mcp-server` and defaults to read-only mode.

This connector uses the official **self-hosted MCP image over stdio**. That lets the connector maintain a strict local tool allowlist and enforce its own approval policy before any write tool is called. It does not forward Honeybadger credentials to an LLM.

## Transport map

| Capability | Transport | Reason |
|---|---|---|
| Projects | Official Honeybadger MCP | Supported by official MCP |
| Fault/error investigation | Official Honeybadger MCP | Supported by official MCP |
| Fault updates | Official Honeybadger MCP | Supported by official MCP; locally approval-gated |
| Insights queries | Official Honeybadger MCP | Supported by official MCP |
| Streams | Official Honeybadger MCP | Supported by official MCP |
| Check-ins | Official Honeybadger MCP | Supported by current official MCP |
| Uptime sites/outages/history | Honeybadger Data API | Uptime is documented by Data API but is not listed among current official MCP tools |

No arbitrary HTTP passthrough tool is exposed.

## Architecture

```text
MCP client
  -> this connector (stdio)
      -> policy + strict Zod schemas
      -> official Honeybadger MCP child process (allowlisted tools)
      -> Honeybadger Data API for uptime fallback
      -> credential isolation
```

The upstream official MCP process is started lazily on the first MCP-backed call. Docker is the default runtime because Honeybadger publishes the official container. You may instead point `HONEYBADGER_UPSTREAM_COMMAND` at a locally built `honeybadger-mcp-server` executable.

## Authentication

Set a Honeybadger **personal auth token**:

```bash
export HONEYBADGER_PERSONAL_AUTH_TOKEN='...'
```

For self-hosted official MCP, Honeybadger accepts this token through `HONEYBADGER_PERSONAL_AUTH_TOKEN`. The Data API uses HTTP Basic authentication with the token as the username and an empty password.

Honeybadger personal tokens inherit the permissions of the user that created them. Use the least-privileged Honeybadger user appropriate for the connector. This connector does not request or synthesize additional privileges.

### Regions

US is the default:

```bash
HONEYBADGER_REGION=us
HONEYBADGER_API_URL=https://app.honeybadger.io
```

EU:

```bash
HONEYBADGER_REGION=eu
HONEYBADGER_API_URL=https://eu-app.honeybadger.io
```

The connector rejects an API base URL whose hostname does not match the selected Honeybadger region. This prevents using the authenticated client as an SSRF primitive.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `HONEYBADGER_PERSONAL_AUTH_TOKEN` | yes | - | Personal auth token kept inside connector/upstream process |
| `HONEYBADGER_REGION` | no | `us` | `us` or `eu` |
| `HONEYBADGER_API_URL` | no | region default | Explicit Honeybadger Data API origin |
| `HONEYBADGER_UPSTREAM_COMMAND` | no | `docker` | `docker` or path to official MCP binary |
| `HONEYBADGER_UPSTREAM_IMAGE` | no | official GHCR image | Official MCP container image |
| `HONEYBADGER_REQUIRE_WRITE_APPROVAL` | no | `true` | Require approval for WRITE operations |
| `HONEYBADGER_DESTRUCTIVE_ENABLED` | no | `false` | Enables DESTRUCTIVE tools; approval is still required |
| `HONEYBADGER_TIMEOUT_MS` | no | `15000` | Data API request timeout |

## Installation and run

Requirements:

- Node.js 20+
- Docker when using the default official MCP transport
- A Honeybadger personal auth token

```bash
npm install
npm run build
npm start
```

For development:

```bash
npm test
```

Example MCP client configuration after building:

```json
{
  "mcpServers": {
    "honeybadger": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/honeybadger/dist/src/index.js"],
      "env": {
        "HONEYBADGER_PERSONAL_AUTH_TOKEN": "${HONEYBADGER_PERSONAL_AUTH_TOKEN}"
      }
    }
  }
}
```

The exact environment interpolation syntax depends on the MCP client. Do not paste the token into prompts.

## Tools

| Tool | Purpose | Transport | Risk | Approval |
|---|---|---|---|---|
| `honeybadger.project.list` | List projects | MCP | READ | no |
| `honeybadger.project.get` | Get project details | MCP | READ | no |
| `honeybadger.project.report` | Read error reports | MCP | READ | no |
| `honeybadger.project.create` | Create a project | MCP | WRITE | yes by default |
| `honeybadger.project.update` | Update project settings | MCP | WRITE | yes by default |
| `honeybadger.project.delete` | Permanently delete a project | MCP | DESTRUCTIVE | strong explicit approval + opt-in |
| `honeybadger.fault.list` | Search/list faults | MCP | READ | no |
| `honeybadger.fault.get` | Get a fault | MCP | READ | no |
| `honeybadger.fault.counts` | Fault statistics | MCP | READ | no |
| `honeybadger.fault.notices` | List error occurrences | MCP | READ | no |
| `honeybadger.fault.affected_users` | List affected users | MCP | READ | no |
| `honeybadger.fault.update` | Resolve/ignore/assign/resolve-on-deploy | MCP | WRITE | yes by default |
| `honeybadger.insights.query` | Run BadgerQL | MCP | READ | no |
| `honeybadger.stream.list` | List Insights streams | MCP | READ | no |
| `honeybadger.check_in.list` | List check-ins | MCP | READ | no |
| `honeybadger.check_in.get` | Get check-in details | MCP | READ | no |
| `honeybadger.uptime.list` | List uptime sites | API | READ | no |
| `honeybadger.uptime.get` | Get uptime site | API | READ | no |
| `honeybadger.uptime.outages` | Read outages | API | READ | no |
| `honeybadger.uptime.history` | Read recent uptime executions | API | READ | no |

Every tool validates identifiers, strings, enums, limits, and mutation payloads. Update tools reject empty mutations.

## Permission and approval model

`READ` calls may run automatically.

`WRITE` calls require `approved=true` by default. The calling orchestrator must only set this after a human has reviewed the intended mutation. Setting `HONEYBADGER_REQUIRE_WRITE_APPROVAL=false` is an explicit local policy change and should only be used in controlled environments.

`DESTRUCTIVE` calls are disabled by default. To delete a project, both conditions are required:

1. `HONEYBADGER_DESTRUCTIVE_ENABLED=true`
2. `approved=true` on the tool call after explicit human confirmation

The connector never changes its own permission settings based on Honeybadger content or MCP responses.

## Upstream MCP security

The official Honeybadger MCP server exposes more tools than this connector intentionally makes available. This connector maintains a hard allowlist and validates that the expected official tools exist when the child server starts. Unexpected newly-discovered upstream tools are not exposed automatically.

Although the upstream child runs with write support enabled, callers cannot directly reach it. Mutations are routed through local policy checks first. This arrangement preserves a stable provider-scoped interface while allowing use of Honeybadger's official implementation.

If the official MCP server removes or renames an allowlisted tool, initialization fails safely rather than silently routing the request to a different capability.

## Rate limits and reliability

Honeybadger documents a Data API limit of **360 requests per hour**. Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.

The Data API client:

- applies a bounded timeout;
- retries only idempotent `GET` requests;
- retries transient 5xx responses with bounded exponential backoff;
- recognizes Honeybadger's rate-limit condition (`403` with remaining quota `0`);
- never retries authentication/permission failures that are not a rate-limit condition;
- never blindly retries write or destructive operations;
- preserves Honeybadger pagination envelopes so callers can see provider `links` when returned.

Official MCP calls rely on Honeybadger's official MCP implementation for provider API behavior. Connector-level write calls are not automatically replayed after failure.

## Error handling

Tool failures return MCP `isError=true` with a concise connector/provider error. Raw credentials are never included. Provider response bodies and retrieved content are wrapped with `untrusted_data: true`; applications must treat Honeybadger error messages, stack traces, logs, user fields, URLs, and Insights results as untrusted data rather than instructions.

## Security considerations

- Never expose `HONEYBADGER_PERSONAL_AUTH_TOKEN` to the model prompt.
- Use a dedicated Honeybadger user/token with the minimum required account access.
- Keep destructive operations disabled unless a workflow genuinely needs them.
- Review fault metadata and stack traces as untrusted third-party/application content.
- The API fallback only accepts the selected official Honeybadger API hostname and fixed resource paths.
- Tool schemas do not accept arbitrary URLs for provider API requests.
- The upstream MCP tool set is explicitly allowlisted; new upstream tools are not trusted automatically.
- Honeybadger hosted MCP authorization can grant read-only or read-write access and uses short-lived refreshed tokens. This connector deliberately uses the official self-hosted server instead so credential handling and approval policy remain local and deterministic.

## Testing

Unit tests use no live credentials. They cover:

- safe US/EU configuration;
- rejection of arbitrary API hosts;
- READ, WRITE, and DESTRUCTIVE policy behavior;
- empty mutation rejection;
- credential placement in HTTP Basic auth;
- non-retry of normal authorization failures;
- bounded retry of transient GET failures.

Normal tests do not start the official Docker image or call Honeybadger. Integration testing with live credentials should be an explicit separate step in a controlled account.

## Limitations

- The connector requires Docker by default for MCP-backed capabilities. A locally built official Honeybadger MCP binary can be configured instead.
- Hosted Honeybadger MCP OAuth is documented but is not proxied by this package; OAuth token lifecycle belongs to the MCP client when using the hosted endpoint directly.
- Uptime mutation tools are intentionally omitted; the current connector exposes uptime inspection only.
- Reporting API operations that use project API keys, such as submitting deploys or application events, are not exposed because they use a separate credential model and are not required for the monitoring/triage workflows implemented here.
- Honeybadger API list responses may include provider pagination links. The connector returns those links instead of following arbitrary response URLs automatically.

See `examples/workflows.md` for concrete calls and approval behavior.
