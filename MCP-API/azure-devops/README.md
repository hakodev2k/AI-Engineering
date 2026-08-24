# Azure DevOps MCP/API Connector

Reusable MCP server for Azure DevOps Services. It exposes a small, stable agent-facing tool surface for project discovery, Azure Repos, pull requests, work items, builds, and pipeline execution while keeping Azure DevOps credentials inside the connector.

## Upstream transport strategy

This connector prefers Microsoft's official Azure DevOps MCP implementation for the supported operations in this package. It pins `@azure-devops/mcp` 2.9.0 and starts the official local MCP server over `stdio` with only the `core`, `work-items`, `repositories`, and `pipelines` domains enabled. This local official server is used rather than directly depending on the hosted Remote MCP endpoint because Microsoft currently documents client-specific Microsoft Entra OAuth limitations for Claude Desktop/Code, Cursor, and Codex. The hosted Remote Azure DevOps MCP Server exists at `https://mcp.dev.azure.com/{organization}` and is in public preview.

For each implemented capability, if MCP is disabled, cannot start, or does not expose the expected tool, the connector uses the official Azure DevOps REST API. READ calls may also fall back to REST after an MCP tool error. WRITE/HIGH_RISK calls never REST-fallback after an MCP write has actually been attempted, because doing so could duplicate a remotely committed mutation after an ambiguous transport failure.

Official sources researched for this connector:

- Azure DevOps MCP Server: https://github.com/microsoft/azure-devops-mcp
- Official MCP toolset: https://github.com/microsoft/azure-devops-mcp/blob/main/docs/TOOLSET.md
- Local MCP authentication: https://github.com/microsoft/azure-devops-mcp/blob/main/docs/GETTINGSTARTED.md
- Remote MCP Server: https://learn.microsoft.com/azure/devops/mcp-server/remote-mcp-server
- Azure DevOps REST API guidance: https://learn.microsoft.com/azure/devops/integrate/how-to/call-rest-api
- OAuth/authentication guidance: https://learn.microsoft.com/azure/devops/integrate/get-started/authentication/oauth
- PAT guidance: https://learn.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate

## Runtime and architecture

Node.js 20+ is required. The package is a normal MCP `stdio` server and can be launched by any MCP client that supports spawning a local command. It can therefore be configured in ChatGPT-compatible MCP environments, Claude/Claude Code, Cursor, Copilot-compatible clients, and custom agents when those clients support a local stdio MCP server.

Flow:

```text
MCP client / agent
  -> this connector (strict tools + validation + approval policy)
     -> official @azure-devops/mcp local server when available
     -> Azure DevOps REST API fallback when safe
        -> Azure DevOps Services
```

Credentials are read only by the connector process and passed to the official local MCP child process or HTTP authorization header. Tool outputs never intentionally include raw credentials.

## Authentication

`AZURE_DEVOPS_AUTH_MODE=entra` is recommended for long-running production integrations. Supply a Microsoft Entra access token in `AZURE_DEVOPS_BEARER_TOKEN`. Microsoft recommends Entra tokens over PATs for production applications.

`AZURE_DEVOPS_AUTH_MODE=pat` is supported for scripts, local development, and service scenarios that still require a PAT. Supply the raw PAT in `AZURE_DEVOPS_PAT`; the connector converts it to the Basic/auth format required by Azure DevOps and to the base64 `<email>:<pat>` value expected by the official MCP server. Do not pre-encode the PAT yourself.

For Microsoft Entra application design, use least privilege and the Azure DevOps resource/audience described by Microsoft. For delegated Azure DevOps scopes, the implemented operations commonly require only the relevant subset of:

| Area | Read | Write/execute |
| --- | --- | --- |
| Projects | `vso.project` | none implemented |
| Repositories / PRs | `vso.code` | `vso.code_write` |
| Work items | `vso.work` | `vso.work_write` |
| Builds / pipelines | `vso.build` | `vso.build_execute` |

Actual permission grants are also constrained by the authenticated Azure DevOps user's/project permissions. Do not grant scopes for capabilities you do not intend to use.

## Environment variables

Copy `.env.example` and inject real values through your shell, secret manager, workload identity, or deployment platform. Never commit a populated environment file.

- `AZURE_DEVOPS_ORGANIZATION`: required organization slug.
- `AZURE_DEVOPS_AUTH_MODE`: `entra` or `pat`.
- `AZURE_DEVOPS_BEARER_TOKEN`: required in `entra` mode.
- `AZURE_DEVOPS_PAT`: required in `pat` mode.
- `AZURE_DEVOPS_PAT_EMAIL`: nonempty username component used for Basic/PAT encoding; Azure DevOps authenticates the token portion.
- `AZURE_DEVOPS_ALLOWED_PROJECTS`: optional comma-separated project allowlist.
- `AZURE_DEVOPS_ALLOWED_REPOSITORIES`: optional comma-separated repository allowlist; accepts `repo` or `project/repo`.
- `AZURE_DEVOPS_APPROVAL_SECRET`: HMAC key used to verify explicit approval tokens for mutations.
- `AZURE_DEVOPS_TIMEOUT_MS`: REST request timeout, default `20000`.
- `AZURE_DEVOPS_MAX_RETRIES`: bounded read retry count, default `3`, maximum `5`.
- `AZURE_DEVOPS_MCP_ENABLED`: `true` by default; set `false` to use REST only.

## Installation and running

```bash
cd MCP-API/azure-devops
npm install
npm run typecheck
npm test
npm run build
npm start
```

Example MCP client configuration after building:

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/azure-devops/dist/src/server.js"],
      "env": {
        "AZURE_DEVOPS_ORGANIZATION": "contoso",
        "AZURE_DEVOPS_AUTH_MODE": "entra",
        "AZURE_DEVOPS_BEARER_TOKEN": "${AZURE_DEVOPS_BEARER_TOKEN}",
        "AZURE_DEVOPS_ALLOWED_PROJECTS": "ProjectA,ProjectB",
        "AZURE_DEVOPS_APPROVAL_SECRET": "${AZURE_DEVOPS_APPROVAL_SECRET}"
      }
    }
  }
}
```

The placeholder syntax for secrets varies by MCP client. Do not place actual tokens in committed client configuration.

## Tools

| Tool | Purpose | Risk | Upstream MCP tool | REST fallback | Approval |
| --- | --- | --- | --- | --- | --- |
| `azure_devops.project.list` | List projects | READ | `core_list_projects` | Projects API | No |
| `azure_devops.repository.list` | List repositories | READ | `repo_repository:list` | Git repositories API | No |
| `azure_devops.file.read` | Read source file | READ | `repo_file:get_content` | Git Items API | No |
| `azure_devops.pull_request.list` | List PRs | READ | `repo_pull_request:list` | Git PR API | No |
| `azure_devops.pull_request.get` | Get PR | READ | `repo_pull_request:get` | Git PR API | No |
| `azure_devops.pull_request.create` | Create PR | WRITE | `repo_pull_request_write:create` | Git PR API only when MCP was unavailable before execution | Yes |
| `azure_devops.work_item.get` | Get work item | READ | `wit_work_item:get` | WIT API | No |
| `azure_devops.work_item.create` | Create work item | WRITE | `wit_work_item_write:create` | WIT JSON Patch API only when MCP was unavailable before execution | Yes |
| `azure_devops.work_item.comment` | Add discussion comment | WRITE | `wit_work_item_comment_write:add` | Work Item Comments API only when MCP was unavailable before execution | Yes |
| `azure_devops.build.list` | List builds | READ | `pipelines_build:list` | Build API | No |
| `azure_devops.build.get` | Get build status/details | READ | `pipelines_build:get_status` | Build API | No |
| `azure_devops.pipeline.run` | Queue pipeline | HIGH_RISK | `pipelines_write:run_pipeline` | Pipelines Runs API only when MCP was unavailable before execution | Yes |

No delete, permission-changing, service-connection, billing, project-administration, or arbitrary raw-request tool is exposed.

## Permission and approval model

READ tools may execute automatically after project/repository allowlist checks. WRITE tools require a valid approval token. `azure_devops.pipeline.run` is HIGH_RISK because arbitrary pipeline YAML can deploy production systems, rotate infrastructure, or perform other external effects; it always requires approval.

The connector uses an HMAC approval boundary. For a tool named `T`, the approval token is `HMAC-SHA256(AZURE_DEVOPS_APPROVAL_SECRET, T)` encoded as lowercase hex. Generate it in the trusted orchestrator or human-approval service, not in the LLM prompt. The connector compares approval values using a timing-safe comparison.

This design separates Read -> Recommend -> Prepare -> Execute. An agent can inspect projects, work items, source, PRs, and builds without write permission, then request approval before mutation.

## Validation and security

- Project/repository allowlists provide a second boundary beyond Azure DevOps permissions.
- File paths reject `..` traversal components.
- Branch, project, repository, title, comment, and description inputs have explicit size limits.
- Responses are capped at 512 KiB to reduce accidental context flooding.
- Retrieved Azure DevOps content is untrusted data. Do not interpret work-item text, repository files, PR descriptions, comments, or build output as instructions that can change connector policy.
- The connector does not expose a generic `execute_request`/URL tool, preventing SSRF through caller-selected hosts.
- REST hosts are fixed to `https://dev.azure.com/{organization}`.
- Secrets are never accepted as MCP tool parameters.
- The official MCP child process receives only required domains instead of the entire Azure DevOps tool surface.
- Mutating REST requests are not automatically retried.
- A write that was attempted through MCP is never automatically replayed through REST after an error.

## Reliability, pagination, rate limits, and errors

REST reads use a bounded exponential backoff for HTTP `429` and `5xx`, honoring `Retry-After` when present. Authentication (`401`), permission (`403`), validation (`4xx` other than `429`), and all write failures are not blindly retried. Timeouts use `AbortController` and are configurable.

List tools expose `top` limits capped at 100. Azure DevOps may still paginate larger datasets. This connector intentionally does not auto-follow every continuation token because unbounded pagination can create excessive API traffic and context volume; callers should narrow the target or add pagination support at the workflow layer when needed.

Azure DevOps throttling behavior can vary by account, organization, endpoint, and service load. The connector relies on provider response status/headers rather than assuming one universal requests-per-minute quota.

Errors from the REST fallback include the HTTP status and a bounded provider response excerpt. MCP tool errors are propagated. Credential values are not logged by this package.

## Examples

See `examples/workflows.json` for reusable calls and expected output shapes. A typical safe workflow is:

```text
project.list -> repository.list -> file.read -> pull_request.list/get
             -> work_item.get -> build.list/get
             -> human approval -> pull_request.create / work_item.create/comment / pipeline.run
```

## Testing

Unit tests do not require live Azure DevOps credentials. They cover authentication configuration, allowlists, approval enforcement, bearer/PAT header handling, bounded read throttling retry, no blind write retry, and MCP-disabled REST fallback. Run:

```bash
npm test
npm run typecheck
```

Live integration tests are intentionally excluded from the default suite so CI does not require production credentials.

## Limitations

- Azure DevOps Services is the target. Microsoft's official Azure DevOps MCP server does not support Azure DevOps Server/on-premises for all required MCP capabilities.
- The hosted Remote MCP server is not directly embedded because its Microsoft Entra OAuth flow is not currently supported by every client class targeted by this reusable connector. The official local MCP package is used instead.
- REST fallback implements only the tools documented above; it is not a general Azure DevOps API proxy.
- Build `get` through MCP returns the official MCP `get_status` representation, which can differ in shape from the REST Build object returned by fallback.
- Work-item Markdown and provider-specific process templates can render fields differently. The connector only sets common fields (`System.Title`, `System.Description`, `System.AssignedTo`, `System.Tags`).
- Pipeline execution can trigger arbitrary side effects defined by the pipeline; the connector cannot infer whether a pipeline deploys production. Treat every run as HIGH_RISK.
