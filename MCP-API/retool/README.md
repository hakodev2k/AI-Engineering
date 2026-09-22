# Retool MCP/API Connector

Reusable read-only MCP connector for Retool organization inventory and inspection. It targets Node.js 20+ and exposes standard MCP over stdio.

## Transport and official sources

The implemented transport is Retool's Management REST API v2. Retool documents the API under `https://docs.retool.com/reference/api/v2` and organization/API concepts under Retool Docs. Cloud requests use `https://api.retool.com/api/v2`; self-hosted deployments can configure their own HTTPS Retool origin. Retool also exposes its OpenAPI specification from a Retool instance at `/api/v2/spec`, which should be consulted before adding new endpoint coverage. Retool Workflows separately support webhook triggers such as `/v1/workflows/{workflow-id}/startTrigger`; workflow execution is intentionally not exposed here because it can cause arbitrary downstream side effects.

Research for this connector found no need to depend on a third-party MCP server. The direct official Management API is the smaller trust boundary for these read operations. The connector does not claim that Retool provides an official general-purpose MCP server for this management surface.

## Capabilities

Ten tools are implemented: `retool.app.list`, `retool.app.get`, `retool.workflow.list`, `retool.workflow.get`, `retool.folder.list`, `retool.folder.get`, `retool.group.list`, `retool.group.get`, `retool.resource.list`, and `retool.resource.get`. All are READ. No generic HTTP passthrough is available.

## Architecture

MCP client -> strict Zod schema -> scoped tool handler -> RetoolClient -> official Management REST API. Provider responses are returned with `untrustedData:true`. Credentials are read only by the authentication/client layer and never accepted as MCP tool parameters or emitted to callers.

## Authentication and scopes

Set `RETOOL_API_TOKEN` to a Retool API access token created by an administrator with only the read permissions needed for apps, workflows, folders, groups, and resources. Retool's token permissions are the authoritative authorization boundary; do not grant write/admin scopes to a token used only with this connector. The API uses `Authorization: Bearer <token>`.

Environment variables: `RETOOL_API_TOKEN` (required), `RETOOL_BASE_URL` (optional HTTPS Retool origin; defaults to `https://api.retool.com`), `RETOOL_TIMEOUT_MS` (default 10000), and `RETOOL_MAX_RETRIES` (default 2, hard-bounded to 4).

## Install, configure, run

```bash
npm install
npm run build
RETOOL_API_TOKEN=... npm start
```

Point an MCP client that supports local stdio servers at `node dist/src/server.js`. Compatibility is based on standard MCP stdio support; no product-specific client integration is assumed.

## Tool contracts and permissions

Every tool has a provider-scoped stable name, purpose, strict input schema, READ risk classification, no approval requirement, and returns the provider's JSON response. List operations accept `page` and `pageSize`, with `pageSize` capped at 100. Get operations accept a conservative opaque identifier restricted to letters, digits, underscore, and hyphen. Write, high-risk, and destructive tools are absent by design, so an agent cannot silently escalate from inspection to execution.

## Reliability, rate limits, and errors

Requests use AbortController timeouts. GET requests retry only network/transient failures, HTTP 429, and selected 5xx responses. Retries are bounded and use exponential backoff; `Retry-After` is honored up to a bounded delay. HTTP 401/403, validation failures, and other non-transient provider errors are not retried. Pagination is caller-controlled and bounded to avoid accidental high-volume enumeration. Retool's current deployment/token policies remain authoritative for any additional service-side rate limits.

`RetoolError` preserves HTTP status, parsed provider body, and `Retry-After` internally. MCP handlers return concise error text and never include the bearer token. Missing credentials fail before a provider call.

## Security

Use a dedicated least-privilege token and secret storage. Never place the token in prompts, examples, logs, or tool arguments. `RETOOL_BASE_URL` is administrator configuration and must be HTTPS; agents cannot supply request hosts or arbitrary paths, limiting SSRF exposure. Retrieved app/workflow/resource metadata is untrusted data and cannot modify permissions or tool registration. This package does not expose workflow triggering, user/group mutation, resource configuration mutation, permission changes, source-control actions, or secrets.

If write tools are added later, each must receive its own explicit schema and WRITE/HIGH_RISK/DESTRUCTIVE classification, with human approval for side-effecting actions. Do not add an `execute_any_api_request` escape hatch.

## Testing

Run `npm test`. Unit tests use mocked `fetch` and no live credentials. They cover tool registration, strict validation, bearer-token isolation, authentication failure, throttling retry, pagination bounds, and rejection of insecure base URLs.

## Limitations

This connector intentionally covers a read-only subset of Retool's Management API. It does not execute Workflows, provision users, modify groups, edit apps/resources, change permissions, expose SCIM, or access resource credentials. API availability and token permissions can vary by Retool plan/deployment; consult the live official `/api/v2/spec` for the deployed Retool version before extending the connector.
