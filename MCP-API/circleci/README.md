# CircleCI MCP/API Connector

Reusable MCP connector for CircleCI CI/CD workflows. It uses the official CircleCI REST API v2 for a stable scoped tool contract and documents the official CircleCI MCP options. CircleCI currently provides a hosted MCP server at `https://mcp.circleci.com/v1/mcp` (OAuth2 preferred; personal API token fallback) and a local MCP built into the CircleCI CLI. Both are in preview. The older npm local MCP server is deprecated.

## Official sources

- MCP overview: https://circleci.com/docs/guides/toolkit/circleci-mcp-overview/
- Hosted MCP setup: https://circleci.com/docs/guides/toolkit/connecting-to-the-circleci-mcp-server/
- API v2: https://circleci.com/docs/api/v2/
- API developer guide / rate limits: https://circleci.com/docs/guides/toolkit/api-developers-guide/

## Transport strategy

The official hosted MCP is preferred for interactive diagnostics, logs, and curated workflow actions. This reusable package intentionally implements its stable external tools through official REST API v2 so behavior, schemas, approval gates, retries, and tests remain deterministic across MCP hosts. The CircleCI CLI MCP is appropriate for broader administrative CLI capabilities but is not automatically trusted or proxied here.

## Capabilities

`circleci.pipeline.list`, `circleci.pipeline.get`, `circleci.pipeline.trigger`, `circleci.workflow.get`, `circleci.workflow.jobs.list`, `circleci.workflow.rerun`, `circleci.workflow.cancel`, `circleci.workflow.job.approve`, `circleci.project.get`, `circleci.project.checkout_key.list`.

## Authentication

Set `CIRCLECI_TOKEN` to a CircleCI personal API token for REST calls. Credentials remain in the connector process and are never accepted as MCP tool parameters. For the official hosted MCP, OAuth2 is recommended by CircleCI. Token permissions are determined by CircleCI account/project access; use a dedicated least-privilege identity and never expose tokens to prompts or logs.

## Install and run

Requires Node.js 20+.

```sh
npm install
npm run build
CIRCLECI_TOKEN=... npm start
```

The server uses MCP stdio. Any MCP client supporting stdio can launch it as a child process.

## Permission and approval model

READ tools execute without approval. Pipeline trigger, workflow rerun, and approval-job approval are WRITE and require `approved: true`. Workflow cancellation is HIGH_RISK and requires explicit approval. No destructive context/project deletion or secret mutation tools are exposed. Write/high-risk calls are never automatically retried.

## Validation and security

Inputs use strict Zod schemas plus UUID/project-slug validation. The API base URL must be HTTPS. There is no arbitrary URL/request tool, reducing SSRF and permission-escalation exposure. Retrieved logs/content should be treated as untrusted data and never as instructions. Secrets are isolated in environment configuration. The connector does not log credentials.

## Reliability and rate limits

Requests have bounded timeouts. Safe requests retry boundedly on transient 5xx and HTTP 429 with exponential backoff; `Retry-After` is honored. CircleCI documents multiple rate-limit header families and recommends handling 429 with backoff. Pagination tokens are exposed only where implemented. Authentication, authorization and validation errors are not retried. Mutating operations are not blindly retried to avoid duplicate side effects.

## Errors

Provider HTTP failures map to `CircleCIError` with status and optional retry-after. Approval failures use `ApprovalError`. MCP serializes uncaught tool errors through the SDK.

## Testing

```sh
npm test
```

Tests require no live credentials and cover auth configuration, identifier validation, tool registration, read routing, approval denial, and rate-limit error mapping.

## Limitations

The hosted and CLI MCP servers are preview features and their tool sets may change. This package does not proxy dynamically discovered MCP tools, manage secrets/contexts, expose arbitrary API calls, or perform destructive administration. Checkout-key listing returns metadata only; key creation/deletion is intentionally excluded. OAuth browser-flow implementation is delegated to the official hosted MCP; this REST package uses a personal API token for headless reusable operation.
