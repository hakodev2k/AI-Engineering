# Octopus Deploy MCP/API Connector

Reusable MCP server for safely integrating AI agents with Octopus Deploy.

## Transport strategy

The connector uses the official Octopus Remote MCP server for discovery operations that Octopus exposes as dedicated MCP tools, currently `find_spaces` and `find_projects`. It uses the official Octopus REST API for capabilities where a stable, explicit resource contract is preferable, including environments, releases, deployments, tasks, runbooks, release creation, deployment creation, and runbook execution.

Official references:

- Octopus MCP: https://octopus.com/docs/octopus-ai/mcp
- Remote MCP: https://octopus.com/docs/octopus-ai/mcp/remote
- REST API: https://octopus.com/docs/api
- Releases API: https://octopus.com/docs/api/releases
- Deployments API: https://octopus.com/docs/api/deployments
- Runbooks API: https://octopus.com/docs/api/runbooks
- API key guidance: https://octopus.com/docs/api/examples/users-and-teams/create-api-key

## Authentication

Set `OCTOPUS_URL` to your Octopus Deploy instance and `OCTOPUS_API_KEY` to an API key. Octopus recommends a dedicated Agent Service Account and Agent API key so agent actions are least-privileged and clearly auditable.

The connector keeps the API key inside the transport layer and never returns it in tool output. Remote MCP and REST both use `X-Octopus-ApiKey`.

## Environment variables

```text
OCTOPUS_URL=https://your-octopus-instance.example
OCTOPUS_API_KEY=
OCTOPUS_TIMEOUT_MS=15000
OCTOPUS_MAX_RETRIES=2
OCTOPUS_WRITE_APPROVED=false
OCTOPUS_HIGH_RISK_APPROVED=false
```

`OCTOPUS_WRITE_APPROVED` is a human-controlled runtime gate for ordinary writes. `OCTOPUS_HIGH_RISK_APPROVED` is a separate stronger gate for deployments and runbook execution. Enabling ordinary writes does not enable high-risk execution.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `octopus.space.search` | Official Remote MCP | READ | None |
| `octopus.project.search` | Official Remote MCP | READ | None |
| `octopus.environment.list` | REST | READ | None |
| `octopus.release.list` | REST | READ | None |
| `octopus.deployment.list` | REST | READ | None |
| `octopus.task.get` | REST | READ | None |
| `octopus.runbook.list` | REST | READ | None |
| `octopus.release.create` | REST | WRITE | `OCTOPUS_WRITE_APPROVED=true` |
| `octopus.deployment.create` | REST | HIGH_RISK | `OCTOPUS_HIGH_RISK_APPROVED=true` |
| `octopus.runbook.run` | REST | HIGH_RISK | `OCTOPUS_HIGH_RISK_APPROVED=true` |

No arbitrary REST, arbitrary GraphQL, or unrestricted upstream MCP proxy tool is exposed.

## Architecture

```text
MCP client
  -> local connector MCP server
      -> policy / approval gate
      -> official Octopus Remote MCP (allow-listed discovery tools)
      -> official Octopus REST API (scoped operations)
      -> credential remains inside connector
```

Provider responses are treated as untrusted data. Retrieved content is never interpreted as permission or policy instructions.

## Installation

Requirements: Node.js 20 or later and an Octopus Deploy instance reachable over HTTPS.

```bash
npm install
npm run build
npm start
```

The connector exposes MCP over stdio, which is compatible with MCP clients that can launch a local stdio server. Configure the client to launch `node dist/server.js` with the required environment variables.

## Reliability

REST calls use request timeouts, bounded retries, exponential backoff, `Retry-After` support for HTTP 429, and provider error mapping. Validation and permission errors are not retried. POST network failures are not blindly retried to avoid duplicate releases, deployments, or runbook runs.

Pagination parameters are bounded. Inputs use strict identifiers and size limits to reduce accidental or ambiguous calls.

Octopus rate limits can vary by server version and hosting environment. The connector therefore does not hard-code a provider-wide request quota; it honors HTTP 429 and `Retry-After` from the target instance.

## Security model

Use a dedicated Agent Service Account with only the permissions required for the selected spaces/projects. Do not use a highly privileged personal API key. Rotate API keys according to organizational policy.

Remote MCP tools are allow-listed. The connector does not automatically trust newly discovered upstream MCP tools. If Octopus adds tools later, they are not exposed until explicitly reviewed and added.

High-risk execution is denied by default. Deployments and runbook runs require an independent high-risk approval gate because they may alter production systems. Destructive delete operations are intentionally not implemented.

The connector validates the configured Octopus base URL once at startup and does not accept caller-provided target URLs, preventing arbitrary SSRF routing through tool arguments.

## Usage examples

See `examples/workflows.md` for discovery, release preparation, deployment, and runbook examples with risk classification and approval requirements.

## Testing

```bash
npm test
npm run typecheck
```

Unit tests use mocked `fetch`; live credentials are not required. Tests cover configuration, credential header behavior, approval separation, permission errors, throttling retry, and non-retry of POST network failures.

## Limitations

The Remote MCP contract surface evolves with Octopus Deploy. This connector intentionally uses only the documented dedicated discovery tools `find_spaces` and `find_projects`; all other implemented operations use explicit REST endpoints.

OAuth for Octopus Remote MCP was documented as planned rather than generally available as of August 17, 2026, so this connector uses API-key authentication.

REST schemas can differ on older/LTS self-hosted servers. For a self-hosted instance, use that instance's `/swaggerui/` and `/llms.txt` as the source of truth if an endpoint differs from the current documentation.
