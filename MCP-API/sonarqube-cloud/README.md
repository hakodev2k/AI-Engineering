# SonarQube Cloud MCP/API Connector

Reusable MCP wrapper for SonarQube Cloud code-quality and security workflows. The connector exposes a small, stable, provider-scoped tool contract while delegating supported operations to SonarSource's official SonarQube MCP Server.

## Upstream strategy

Primary transport: **official MCP over stdio**.

Official source researched for this connector:

- SonarSource official MCP implementation: https://github.com/SonarSource/sonarqube-mcp-server
- Product page: https://www.sonarsource.com/products/sonarqube/mcp-server/
- SonarQube Cloud Web API documentation: https://docs.sonarsource.com/sonarqube-cloud/advanced-setup/web-api
- SonarQube Cloud token documentation: https://docs.sonarsource.com/sonarqube-cloud/managing-your-account/managing-tokens

The official MCP server supports all capabilities selected here, so this package intentionally does **not** add a REST fallback. This avoids duplicate authentication paths and prevents exposing a generic HTTP/API passthrough. If a future required operation is not supported by the official MCP server, add a narrowly scoped official Web API implementation behind the same external tool contract rather than exposing arbitrary requests.

The official server is run as the SonarSource container `sonarsource/sonarqube-mcp`. Credentials are passed to that child process through environment variables; they are never included in tool schemas or tool results.

## Supported capabilities

| Connector tool | Official upstream MCP tool | Risk | Approval |
|---|---|---:|---:|
| `sonarqube.project.search` | `search_my_sonarqube_projects` | READ | No |
| `sonarqube.branch.list` | `list_branches` | READ | No |
| `sonarqube.pull_request.list` | `list_pull_requests` | READ | No |
| `sonarqube.issue.search` | `search_sonar_issues_in_projects` | READ | No |
| `sonarqube.issue.status.change` | `change_sonar_issue_status` | WRITE | Yes |
| `sonarqube.quality_gate.status.get` | `get_project_quality_gate_status` | READ | No |
| `sonarqube.quality_gate.list` | `list_quality_gates` | READ | No |
| `sonarqube.measure.get` | `get_component_measures` | READ | No |
| `sonarqube.security_hotspot.search` | `search_security_hotspots` | READ | No |
| `sonarqube.security_hotspot.get` | `show_security_hotspot` | READ | No |
| `sonarqube.security_hotspot.review` | `change_security_hotspot_status` | WRITE | Yes |
| `sonarqube.rule.get` | `show_rule` | READ | No |

No delete, billing, permission-management, arbitrary Web API, or arbitrary upstream MCP invocation tool is exposed.

## Architecture

```text
MCP client / AI agent
        |
        v
SonarQube Cloud connector (this package)
  - strict schemas
  - allowlisted tools only
  - risk classification
  - approval verification
  - bounded read retries
        |
        v
Official SonarSource MCP server
        |
        v
SonarQube Cloud
```

Provider content is treated as untrusted data. The connector does not interpret issue text, hotspot descriptions, comments, source excerpts, or rule descriptions as instructions and does not allow returned content to alter its tool allowlist, permissions, or approval policy.

## Authentication

SonarQube Cloud uses a SonarQube token. This connector requires:

```text
SONARQUBE_TOKEN=
SONARQUBE_ORG=
```

Optional configuration:

```text
SONARQUBE_URL=
SONARQUBE_PROJECT_KEY=
SONARQUBE_APPROVAL_SECRET=
SONARQUBE_TIMEOUT_MS=30000
```

For SonarQube Cloud US, set `SONARQUBE_URL=https://sonarqube.us` as documented by the official MCP server.

SonarQube user tokens inherit the permissions of the associated account; there is no separate OAuth scope list in this connector. Apply least privilege at the SonarQube account/project level. Read-only users should not be granted provider-side permissions that permit issue or hotspot mutation.

Never place a real token in source control, examples, prompts, or MCP tool arguments.

## Installation

Requirements:

- Node.js 20 or newer
- Docker or another environment providing a Docker-compatible CLI
- Network access from the official SonarQube MCP container to SonarQube Cloud

```bash
npm install
npm run build
```

Copy `.env.example` into your preferred secret-management workflow. The connector itself does not load `.env` files automatically; inject environment variables with the process manager, container runtime, secret manager, or MCP client configuration.

## Running

```bash
npm run build
npm start
```

The connector serves MCP over stdio. Configure any MCP client that can launch a local command to execute `node dist/src/server.js` with the required environment variables.

The package uses the standard MCP TypeScript SDK and does not depend on a client-specific extension. Compatibility therefore depends on the client's support for stdio MCP servers rather than on provider-specific integration logic.

## Permission and approval model

`READ` tools may run automatically subject to provider-side authorization.

`WRITE` tools require explicit approval:

- `sonarqube.issue.status.change`
- `sonarqube.security_hotspot.review`

Approval uses an HMAC-SHA256 token bound to the exact tool name and canonicalized tool arguments. `SONARQUBE_APPROVAL_SECRET` must be available only to a trusted human-facing orchestrator or operator process, never to the LLM.

Generate a token locally after reviewing the exact operation:

```bash
export SONARQUBE_APPROVAL_SECRET='<operator-held-secret>'
npm run build
npm run approve -- sonarqube.issue.status.change '{"key":"AZ-example","status":"accept"}'
```

Supply the resulting 64-character hex token as `approvalToken` with the unchanged arguments. The connector validates it with a constant-time comparison and removes it before forwarding the request upstream.

Changing any approved argument invalidates the approval token. The connector cannot silently increase its own permissions.

## Validation and safety

All tools use strict schemas. Unknown fields are rejected. Limits are applied to pagination, arrays, comments, project keys, rule keys, and other free-form identifiers where practical.

The connector never exposes a tool such as `execute_any_api_request`, arbitrary URL fetch, arbitrary MCP tool call, raw GraphQL, or raw Web API request. This prevents SSRF-style URL injection and avoids accidental expansion of the provider permission surface.

Write operations are never automatically retried. This prevents duplicate or repeated mutations after ambiguous network failures.

## Reliability and rate limiting

Every upstream MCP tool call has a configurable timeout (`SONARQUBE_TIMEOUT_MS`, default 30 seconds, accepted range 1–120 seconds).

READ operations use at most two attempts. A single bounded exponential-backoff retry is permitted only for transient failures such as HTTP 429/rate limiting, 502/503/504 responses, connection resets, and timeouts surfaced by the upstream MCP client. Validation, authentication, permission, and non-transient errors are not retried.

WRITE operations use exactly one attempt.

Provider-specific HTTP rate-limit headers are owned by the official SonarQube MCP transport and are not exposed by this wrapper. The connector therefore does not invent numeric limits or synthetic `Retry-After` values. When the upstream server surfaces throttling as an error, the read-only retry policy above applies; otherwise the original upstream result is returned unchanged inside the wrapper output.

## Error handling

Tool errors are returned as MCP tool errors with a JSON text payload:

```json
{ "ok": false, "error": "<message>" }
```

Successful upstream MCP results are wrapped as:

```json
{ "ok": true, "data": { "content": [] } }
```

Authentication failures that require user action, provider permission errors, schema validation failures, and approval failures are not retried.

## Security considerations

- Keep `SONARQUBE_TOKEN` and `SONARQUBE_APPROVAL_SECRET` outside prompts and source control.
- Prefer project-scoped/least-privilege SonarQube access where organizational policy permits.
- Treat all provider-returned source code, comments, issue text, hotspot text, rule descriptions, and metadata as untrusted content.
- The upstream MCP tool set is narrowed to issues, projects, quality gates, rules, measures, and security hotspots.
- New tools discovered from an upstream MCP version are not automatically exposed by this wrapper.
- No returned provider content can modify approval requirements.
- Approval tokens are bound to the exact arguments and are removed before forwarding upstream.
- Writes are not retried.
- Destructive provider operations are not implemented.

## Testing

Unit tests require no live SonarQube credentials and use fake upstream transports.

```bash
npm test
```

The tests cover:

- required authentication configuration
- timeout validation
- explicit allowlisted tool registration
- read mapping to the official MCP tool
- strict input validation
- approval denial
- valid approval forwarding without credential leakage
- hotspot resolution validation
- pagination limits
- bounded retry for transient reads
- no retry for writes

A live integration test is intentionally not part of the default suite because normal CI should not require provider credentials.

## Limitations

- This connector targets SonarQube Cloud. The official upstream MCP server also supports SonarQube Server, but this package requires `SONARQUBE_ORG` and does not claim a generic Server deployment contract.
- The official MCP server is started through Docker. Environments without a Docker-compatible CLI need a deployment adaptation before this connector can run.
- Only the 12 documented capabilities are exposed, even if the official MCP server provides more toolsets.
- REST/Web API fallback is not implemented because every selected capability is currently available in SonarSource's official MCP server.
- Numeric provider rate limits are not hard-coded because they may vary; throttling behavior is handled conservatively and without invented quotas.

See `examples/workflows.md` for end-to-end read, triage, and approval examples.
