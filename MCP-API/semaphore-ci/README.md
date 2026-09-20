# Semaphore CI MCP Connector

Reusable MCP server for Semaphore CI/CD. It exposes bounded project, workflow, pipeline, YAML-validation, and task operations through Semaphore's documented `v1alpha` REST API. No official Semaphore MCP server was identified during implementation, so upstream transport is REST only.

## Official sources
- API: https://docs.semaphoreci.com/CE-1.2/reference/api
- CLI/API-token behavior: https://docs.semaphoreci.com/EE/reference/semaphore-cli
- Workflow model: https://docs.semaphoreci.com/CE/using-semaphore/workflows
- Audit events: https://docs.semaphoreci.com/reference/audit-events

## Architecture
MCP client -> strict MCP tool schema -> approval/risk guard -> `SemaphoreClient` -> HTTPS Semaphore API. Credentials remain inside the connector and are never included in tool output. Provider responses are wrapped as `untrusted_provider_data`; callers must treat them as data, never instructions.

## Authentication
Set `SEMAPHORE_BASE_URL` to the organization/server HTTPS origin and `SEMAPHORE_API_TOKEN` to an API token from Semaphore account settings. The client sends `Authorization: Token ...` and the documented `SemaphoreCI v2.0 Client` User-Agent. Semaphore's documented API-token model does not expose OAuth scopes; effective access follows the token/user and server authorization. Use a dedicated least-privilege identity where possible.

## Install and run
Requires Node.js 20+.

```sh
npm install
npm run build
SEMAPHORE_BASE_URL=https://your-org.semaphoreci.com SEMAPHORE_API_TOKEN=... npm start
```

The server uses MCP stdio and therefore works with MCP clients that support stdio servers. Configure the client to launch `node dist/index.js` and inject credentials through its secret/environment facility.

## Tools
| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `semaphore.project.list` | list visible projects | READ | no |
| `semaphore.project.get` | project metadata | READ | no |
| `semaphore.workflow.list` | list project workflows | READ | no |
| `semaphore.workflow.get` | workflow metadata | READ | no |
| `semaphore.pipeline.list` | list project/workflow pipelines | READ | no |
| `semaphore.pipeline.get` | pipeline status/detail | READ | no |
| `semaphore.pipeline.validate_yaml` | validate pipeline YAML | READ | no |
| `semaphore.workflow.run` | execute a workflow | HIGH_RISK | explicit |
| `semaphore.pipeline.stop` | stop pipeline execution | HIGH_RISK | explicit |
| `semaphore.task.run` | execute configured task | HIGH_RISK | explicit |

Execution tools require literal `approved: true`; retries are disabled for them to prevent duplicate/unsafe execution. No delete, secret-management, deployment-target mutation, arbitrary URL, or arbitrary API-request tool is exposed.

## Reliability and rate limiting
Requests have configurable timeouts and bounded exponential retry for 429/502/503/504 on retryable operations. `Retry-After` is honored. Authentication, permission, validation, and other 4xx failures are not retried. Semaphore's API documentation specifies Link-header pagination and a default page size above 30 items; list tools expose bounded page/filter inputs and return provider data without recursively draining pages, preventing unbounded request amplification. The official documentation does not publish a universal numeric request quota; 429 is handled conservatively.

## Security
Only HTTPS provider origins are accepted. API paths are connector-defined, preventing SSRF through tool input. UUIDs, Git refs, SHA-1 commit identifiers, YAML size, and pipeline paths are validated. Tokens are never accepted as tool parameters or returned to the model. High-risk execution requires human approval. Retrieved provider content is untrusted. Logs should not print environment variables or request Authorization headers.

## Errors
Non-success responses become `SemaphoreError` with HTTP status and a bounded response excerpt. 401 requires credential repair; 403/404 require permission/resource review. 429 may be retried for safe calls. Timeouts surface as status 408. High-risk execution failures are returned without blind retries.

## Testing
`npm test` uses mocked `fetch`; no live credential is required. Tests cover auth configuration, HTTPS validation, permission/approval boundaries, credential injection, successful reads, invalid credentials/error mapping, throttling retry, and non-retry of execution calls.

## Limitations
This connector implements the documented v1alpha subset needed for common CI-agent workflows. It does not claim webhook management, secret access, deployment promotion, project deletion, or undocumented MCP capabilities. API availability can differ between Semaphore Cloud/Enterprise/Community editions; unsupported server endpoints fail safely with provider errors.
