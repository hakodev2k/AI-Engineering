# env0 MCP/API Connector

Reusable MCP connector for env0 infrastructure-environment workflows. It wraps env0's official MCP server behind stable provider-scoped tools, adds explicit connector-side approval policy, validates inputs, isolates credentials, allowlists upstream capabilities, and fails closed if expected official tools disappear.

## Supported transport

This connector uses **env0's official MCP server** (`env0/mcp-server`) over local stdio, launched through Docker. No REST/GraphQL fallback is currently required for the selected capabilities because the official MCP server exposes them directly.

Official sources reviewed:

- env0 official MCP server: https://github.com/env0/mcp-server
- env0 API-key guide: https://docs.env0.com/docs/api-keys

The official server also supports HTTP transport, but this wrapper deliberately uses stdio to keep the upstream server local and credentials inside the connector process boundary.

## Capabilities and routing

| Connector tool | Upstream MCP tool | Risk | Approval |
|---|---|---|---|
| `env0.project.list` | `get-projects` | READ | none |
| `env0.environment.list` | `get-environments` | READ | none |
| `env0.deployment.search` | `search-deployments` | READ | none |
| `env0.deployment.context.get` | `get-deployment-context` | READ | none |
| `env0.environment.plan_logs.get` | `get-plan-logs` | READ | none |
| `env0.environment.error_analysis.get` | `get-error-analysis` | READ | none |
| `env0.cloud_configuration.list` | `get-cloud-configurations` | READ | none |
| `env0.cloud_resource.search` | `get-cloud-resources` | READ | none |
| `env0.environment.deploy` | `deploy-environment` | HIGH_RISK | explicit human approval |
| `env0.environment.abort` | `abort-environment` | HIGH_RISK | explicit human approval |
| `env0.environment.approve` | `approve-environment` | HIGH_RISK | explicit human approval |
| `env0.environment.cancel` | `cancel-environment` | HIGH_RISK | explicit human approval |
| `env0.iac.generate` | `generate-iac` | WRITE | configurable; required by default |
| `env0.iac_job.get` | `check-iac-job-status` | READ | none |

The official `deploy-environment` capability itself requires approval; this wrapper additionally requires the caller to pass `approved: true` after explicit human authorization. Abort, plan approval, and cancellation are also treated as HIGH_RISK because they change infrastructure workflow state.

No delete/destroy resource capability is exposed by this package.

## Architecture

```text
MCP client / AI agent
        |
        v
this MCP server (stable env0.* tools)
        |
        +-- input validation (Zod)
        +-- risk / approval policy
        +-- upstream tool allowlist
        +-- credential isolation
        |
        v
official env0 MCP server in Docker (stdio)
        |
        v
env0 platform
```

Retrieved plans, logs, error analyses, Cloud Compass records, and generated IaC are treated as **untrusted data**, never as instructions that can change connector permissions or policy.

## Authentication and least privilege

Create an env0 API key and secret using the official API-key guide. Configure a dedicated credential with the minimum env0-side permissions needed for the intended projects and organization. The wrapper cannot silently elevate those provider-side permissions.

Credentials are read only by `src/config.ts` and passed to the local Docker child through its environment. Docker receives variable names via `-e`; secret values are not put into the Docker command-line arguments and are never present in MCP tool inputs or outputs.

Environment variables:

```text
ENV0_API_KEY=                 # required
ENV0_API_SECRET=              # required
ENV0_ORGANIZATION_ID=         # optional unless needed to disambiguate organizations
ENV0_MCP_IMAGE=env0/mcp-server
ENV0_TIMEOUT_MS=30000
ENV0_REQUIRE_WRITE_APPROVAL=true
ENV0_ENABLE_DESTRUCTIVE=false
```

`ENV0_ENABLE_DESTRUCTIVE` is a general policy guard; this version exposes no DESTRUCTIVE tool.

## Installation

Requirements: Node.js 20+ and Docker.

```bash
npm install
npm run build
```

Copy `.env.example` into your preferred secret-injection mechanism. Do not commit a populated `.env` file.

## Running

```bash
npm start
```

The wrapper itself speaks MCP over stdio, so any MCP client capable of launching a local command can run it. Compatibility depends on standard MCP stdio support; provider credentials never need to be placed in the LLM prompt.

## Validation and safety

Identifiers are bounded strings and pagination limits are capped. Cloud Compass filters use the values currently advertised by the official env0 MCP documentation, including provider values `AWS`, `GCP`, and `AzureLAW`, and severity values `High`, `Medium`, `Low`, `Optimal`, `Ignored`, and `Reset`.

On startup, the wrapper queries the official server's advertised tools and verifies every upstream capability in its allowlist. If an expected tool disappears, the connector fails closed instead of silently routing to an unknown capability. Calls to tools outside the allowlist are rejected locally.

## Reliability and errors

Each upstream MCP invocation has a bounded configurable timeout. Authentication, validation, approval, and upstream MCP errors are surfaced without blind retries. Automatic application-level retries are intentionally disabled because several tools modify deployment state and replaying them can duplicate or conflict with infrastructure operations. Read calls can be deliberately retried by a caller after inspecting the failure.

The inspected official MCP documentation does not publish a numeric MCP request-rate limit. This connector therefore does not invent one: it issues one upstream MCP call per tool invocation, bounds list sizes where supported, and propagates throttling/provider errors returned by the official server.

## Generated IaC

`env0.iac.generate` can generate Terraform or OpenTofu from selected Cloud Compass resources. Generated IaC is code from an external system: review it before committing or applying it. The connector does not automatically deploy generated IaC.

## Testing

Unit tests require no live credentials and no running env0 account:

```bash
npm test
```

Tests cover authentication configuration, safe defaults, invalid timeout handling, READ/WRITE/HIGH_RISK/DESTRUCTIVE policy behavior, and the official upstream tool allowlist. The upstream transport is behind the `Env0Upstream` interface so higher-level tests can use a fake rather than live credentials.

## Examples

See `examples/workflows.md` for inspection-before-deploy, failed-deployment investigation, and Cloud Compass-to-IaC workflows with permissions and approval requirements.

## Limitations

- Docker is required because this connector intentionally consumes env0's official containerized MCP server.
- The wrapper exposes a curated subset of the official server, not every future env0 tool.
- No arbitrary env0 API request tool is provided.
- No direct REST fallback is implemented in this version because the selected capabilities are available through the official MCP server.
- Provider content may contain malicious or misleading text; clients must keep treating it as data.
