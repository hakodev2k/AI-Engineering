# CircleCI MCP/API Connector

Reusable CircleCI integration connector that exposes a stable MCP tool surface while routing each capability to the most appropriate official CircleCI transport.

## Transport strategy

The connector prefers CircleCI's official hosted MCP server at `https://mcp.circleci.com/v1/mcp` for the run/workflow/job capabilities that CircleCI publishes there. The hosted server is currently documented by CircleCI as **Preview** and supports OAuth2 or a personal API token sent as a bearer token.

The connector uses the official CircleCI API v2 for capabilities that are not exposed by the hosted MCP tool set:

- `circleci.pipeline.get` → `GET /api/v2/pipeline/{id}`
- `circleci.pipeline.trigger` → recommended `POST /api/v2/project/{project-slug}/pipeline/run`

The old local `npx` CircleCI MCP server is not used; CircleCI documents that implementation as deprecated. The CircleCI CLI also contains an official local MCP server, but this connector deliberately uses the hosted MCP server for its curated CI diagnostic actions so it can run without requiring the CircleCI CLI on the host.

## Official sources researched

- CircleCI MCP overview: https://circleci.com/docs/guides/toolkit/circleci-mcp-overview/
- Connecting to the hosted CircleCI MCP server: https://circleci.com/docs/guides/toolkit/connecting-to-the-circleci-mcp-server/
- CircleCI API v2 reference: https://circleci.com/docs/api/v2/
- API developer guide: https://circleci.com/docs/guides/toolkit/api-developers-guide/
- Trigger options / recommended pipeline trigger API: https://circleci.com/docs/guides/orchestrate/triggers-overview/
- Managing API tokens: https://circleci.com/docs/guides/toolkit/managing-api-tokens/

Research was refreshed against CircleCI's official documentation in August 2026.

## Architecture

```text
MCP client
   |
   v
CircleCI connector MCP server
   |-- policy / approval gate
   |-- strict Zod validation
   |-- official hosted CircleCI MCP client
   `-- official CircleCI API v2 client
           |
           `-- credential isolation
```

Provider responses, build logs, test output, artifact names, and other retrieved data are treated as untrusted data. They never modify tool policy, permissions, credentials, or server behavior.

## Authentication

### API v2

CircleCI API v2 requires a personal API token. Set:

```bash
CIRCLECI_TOKEN=...
```

The token remains inside the connector and is sent in the `Circle-Token` header. It is never returned in MCP output.

CircleCI documents that manually created personal API tokens have broad read/write access. Where available in your deployment, prefer a scoped token created through CircleCI's OAuth 2.0 Dynamic Client Registration flow and select only the access level required by your workflows.

### Hosted MCP

The official hosted MCP supports OAuth2 and personal API token bearer authentication. This reusable headless connector accepts a bearer token from:

```bash
CIRCLECI_MCP_BEARER_TOKEN=...
```

If that variable is omitted, `CIRCLECI_TOKEN` is used as the hosted MCP bearer token. Interactive OAuth browser flows are intentionally left to the outer MCP host rather than embedding refresh tokens or authorization-code handling in this connector.

## Environment variables

```text
CIRCLECI_TOKEN=                         # required
CIRCLECI_MCP_BEARER_TOKEN=              # optional; defaults to CIRCLECI_TOKEN
CIRCLECI_API_BASE_URL=https://circleci.com/api/v2
CIRCLECI_MCP_URL=https://mcp.circleci.com/v1/mcp
CIRCLECI_REQUEST_TIMEOUT_MS=15000
CIRCLECI_MAX_RETRIES=3
CIRCLECI_APPROVAL_SECRET=               # required only for approval-gated actions
```

Non-HTTPS upstream URLs are rejected unless they point to localhost, which prevents accidental credential transmission to arbitrary plaintext hosts.

## Installation

Requirements:

- Node.js 20 or newer
- npm
- A CircleCI account and personal API token with access to the intended projects/orgs

```bash
npm install
npm run build
```

## Running

```bash
npm start
```

The connector uses MCP stdio transport. Any MCP client that supports launching a stdio MCP server can invoke it. Compatibility depends on the client correctly supporting the Model Context Protocol; no vendor-specific behavior is required by the connector itself.

Example client configuration after building:

```json
{
  "mcpServers": {
    "circleci": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/circleci/dist/src/server.js"],
      "env": {
        "CIRCLECI_TOKEN": "${CIRCLECI_TOKEN}",
        "CIRCLECI_APPROVAL_SECRET": "${CIRCLECI_APPROVAL_SECRET}"
      }
    }
  }
}
```

Do not paste real tokens into prompts or source-controlled MCP configuration files. Prefer the host's environment/secret-store feature.

## Tool catalog

| Tool | Upstream | Risk | Approval | Purpose |
|---|---|---|---|---|
| `circleci.run.list` | Official hosted MCP `list_runs` | READ | No | List runs, optionally by project/branch/status |
| `circleci.run.get` | Official hosted MCP `get_run` | READ | No | Read a run and its outcome/VCS/config error data |
| `circleci.workflow.list` | Official hosted MCP `list_workflows` | READ | No | List workflows for a run |
| `circleci.workflow.get` | Official hosted MCP `get_workflow` | READ | No | Read one workflow |
| `circleci.workflow.rerun` | Official hosted MCP `rerun_workflow` | HIGH_RISK | Yes | Rerun workflow; defaults to failed/downstream jobs |
| `circleci.workflow.cancel` | Official hosted MCP `cancel_workflow` | HIGH_RISK | Yes | Cancel a running workflow |
| `circleci.job.list` | Official hosted MCP `list_jobs` | READ | No | List jobs in a workflow |
| `circleci.job.get` | Official hosted MCP `get_job` | READ | No | Read job and step status |
| `circleci.job.logs` | Official hosted MCP `get_job_logs` | READ | No | Read job logs / failed-step output |
| `circleci.job.artifacts` | Official hosted MCP `list_artifacts` | READ | No | List job artifacts |
| `circleci.job.tests` | Official hosted MCP `list_job_tests` | READ | No | Read failing/all test results |
| `circleci.usage.download` | Official hosted MCP `download_usage_data` | READ | No | Request usage export for up to 31 days |
| `circleci.pipeline.get` | API v2 | READ | No | Get pipeline metadata by UUID |
| `circleci.pipeline.trigger` | API v2 recommended trigger endpoint | WRITE | Yes | Trigger a pipeline definition |

The upstream MCP client keeps an explicit allowlist. Newly added CircleCI MCP tools are not automatically exposed or trusted.

## Pipeline trigger inputs

`circleci.pipeline.trigger` uses CircleCI's recommended `project/<project-slug>/pipeline/run` endpoint. Required inputs are:

- `projectSlug`
- `definitionId`
- exactly one of `configBranch` / `configTag`
- exactly one of `checkoutBranch` / `checkoutTag`
- optional `parameters`
- `approvalToken`

CircleCI currently documents this API-trigger method for GitHub OAuth/App and Bitbucket Cloud/Data Center integrations. CircleCI's docs state that API-triggering is not currently supported for GitLab projects.

The connector enforces CircleCI's documented pipeline parameter bounds: no more than 100 entries, keys no longer than 128 characters, and values no longer than 512 characters after string conversion.

## Approval model

Read tools may execute automatically. State-changing tools require an approval token generated by a trusted UI/service that has access to `CIRCLECI_APPROVAL_SECRET`.

For a given tool and its exact arguments (excluding `approvalToken`), calculate:

```text
HMAC-SHA256(secret, toolName + "\n" + canonicalJson(args))
```

The connector canonicalizes object keys before computing the digest and compares tokens with a timing-safe equality check. This binds approval to the exact action and prevents an approval for one workflow, branch, or parameter set from being reused silently for another.

`CIRCLECI_APPROVAL_SECRET` must never be exposed to the LLM. The expected architecture is:

```text
Agent -> tool request -> trusted human approval UI -> connector -> CircleCI
```

## Reliability and rate limiting

For API v2 reads:

- Per-request timeout is configurable.
- Network failures, HTTP 429, 502, 503, and 504 are retried only for idempotent GET requests.
- Retry count is bounded and capped at 5.
- `Retry-After` is honored when CircleCI sends it.
- Otherwise exponential backoff is used.

`circleci.pipeline.trigger` is never automatically retried, including on 429, because blindly repeating a non-idempotent trigger could create duplicate pipelines.

CircleCI documents rate-limit headers including `RateLimit-*`, `X-RateLimit-*`, and `Retry-After`; the connector avoids polling loops and delegates pagination/chaining for hosted MCP capabilities to CircleCI's official MCP server.

## Error behavior

- Missing credentials fail at startup.
- Invalid non-HTTPS upstream configuration fails at startup.
- Validation errors are rejected before an upstream call.
- Approval failures are rejected before an upstream call.
- API 401/403 errors are not retried.
- API validation errors are not retried.
- Hosted MCP must expose the expected allowlisted tool and a compatible input field; otherwise the connector fails closed.
- Hosted MCP errors do not cause the connector to discover or invoke unapproved tools.

## Security considerations

- Credentials never appear in MCP outputs.
- Retrieved CircleCI content is untrusted data and cannot alter permission policy.
- Hosted MCP tools are allowlisted by exact name.
- The connector discovers each allowlisted upstream tool's published input schema and maps only known semantic fields to compatible schema properties.
- Arbitrary provider URL / raw API execution tools are not exposed.
- Pipeline triggers, reruns, and cancellations require explicit human approval.
- Destructive administrative operations, context-secret mutation, project settings changes, billing operations, runner-token creation, and arbitrary CircleCI CLI execution are intentionally not exposed.
- URL overrides are restricted to HTTPS except localhost, reducing credential exfiltration/SSRF risk.
- Logs and error messages should be handled as potentially sensitive CI data by downstream MCP hosts.

## Testing

Unit tests require no live CircleCI credentials.

```bash
npm test
```

Tests cover:

- required authentication configuration
- secure upstream URL validation
- approval binding and denial
- tool risk classifications
- API read retry behavior
- non-idempotent write no-retry behavior
- MCP tool registration through an in-memory transport
- execution of an injected read dependency
- denial of an unapproved write before CircleCI is reached

## Limitations

- CircleCI's hosted MCP server is currently in Preview; its upstream tool schemas may change. The connector detects the schema at connection time and fails closed when an expected semantic field cannot be mapped.
- The connector does not implement the CircleCI CLI MCP because doing so would require a local CircleCI CLI installation and would expose a much broader administrative surface.
- Interactive OAuth2 browser login and refresh-token lifecycle are expected to be handled by an outer MCP host. Headless operation uses bearer/PAT credentials from the connector environment.
- API pipeline triggering is not supported for GitLab integrations according to CircleCI's current documentation.
- Usage export behavior and availability depend on the organization's CircleCI plan and upstream limits.

## Development

```bash
npm run build
npm test
```

No live credentials are required to compile or run the unit tests.
