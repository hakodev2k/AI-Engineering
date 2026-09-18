# Factorial MCP/API Connector

Reusable MCP server for selected Factorial HR workflows. It exposes a narrow, stable agent interface over Factorial's official versioned REST API. Research for this connector used Factorial's current public API documentation and current `2026-07-01` API line.

## Upstream strategy
Factorial publishes an official REST API, OpenAPI specification, and official TypeScript/Python SDKs. The official TypeScript SDK is `@factorialco/api-client`; Factorial documents API-key and OAuth2 bearer authentication, cursor pagination and typed webhook support. No official Factorial-hosted MCP server was identified in the official developer documentation reviewed for this implementation, so this connector uses the official REST API directly while exposing MCP tools locally. This avoids relying on an unofficial MCP server.

Official references:
- API docs: https://apidoc.factorialhr.com/
- OpenAPI: https://api.factorialhr.com/oas/?version=2026-07-01
- SDKs: https://apidoc.factorialhr.com/docs/sdks-overview
- OAuth scopes: https://apidoc.factorialhr.com/docs/oauth-scopes
- Webhook policies: https://apidoc.factorialhr.com/docs/webhooks-policies
- API FAQ/rate limit: https://apidoc.factorialhr.com/docs/faqs

## Capabilities
Ten MCP tools are implemented: `factorial.employee.list`, `factorial.employee.get`, `factorial.location.list`, `factorial.timeoff.leave.list`, `factorial.attendance.shift.list`, `factorial.attendance.open_shift.list`, `factorial.project.time_record.list`, `factorial.webhook.list`, `factorial.webhook.get`, and `factorial.timeoff.leave.create`.

The first nine are READ. Leave creation is WRITE and requires `approved_by_human=true` when `FACTORIAL_REQUIRE_WRITE_APPROVAL=true` (default). Destructive HR operations, employee mutation, attendance mutation, permission changes, payroll changes, and webhook mutation are intentionally not exposed.

## Architecture
`src/server.ts` registers the MCP stdio server. `src/tools.ts` owns strict schemas, risk metadata and handlers. `src/client.ts` owns credentials, versioned API transport, timeout, bounded retry and provider-error mapping. Credentials never enter tool schemas or tool output.

## Authentication and permissions
Prefer OAuth2 because Factorial OAuth applications can be scoped and remain constrained by the authorizing user's Factorial permissions. Configure only the resource scopes required for the tools you enable (employees, locations, time off, attendance, project management and webhook/API access as applicable in your Factorial OAuth application). Factorial documents that scopes cover both read and write within their resources, so this connector adds its own narrower tool/approval boundary.

Factorial API keys are also supported using `x-api-key`, but Factorial states API keys grant broad access and cannot be customized. Use them only in controlled service integrations. Never expose either credential to an LLM.

Set exactly one preferred credential:
```text
FACTORIAL_TOKEN=<oauth bearer token>
# or
FACTORIAL_API_KEY=<broad api key>
```
The OAuth token wins if both are present.

## Installation and run
Requires Node.js 20+.
```bash
npm install
npm run build
FACTORIAL_TOKEN=... npm start
```
The server uses MCP stdio and can be launched by MCP clients that support local stdio servers. Configure the client to execute `node /absolute/path/MCP-API/factorial/dist/server.js` with credentials supplied through the process environment. Compatibility depends on the client's support for standard MCP stdio; no client-specific protocol extensions are used.

## Environment
Copy `.env.example` values into your secret manager/process environment. `FACTORIAL_API_VERSION` defaults to `2026-07-01`; `FACTORIAL_TIMEOUT_MS` defaults to 15000; `FACTORIAL_REQUIRE_WRITE_APPROVAL` defaults to true. Do not commit `.env` or tokens.

## Reliability and rate limits
GET calls retry at most twice after the initial attempt for throttling, transient 5xx and network errors, using bounded exponential backoff and honoring `Retry-After` when supplied. Authentication/authorization/provider validation errors are not retried. WRITE calls are explicitly `retry:false` to avoid duplicate side effects. Requests are timed out with `AbortController`; caller cancellation is propagated.

Factorial's FAQ documents a limit of 200 requests/minute for POST requests. The connector does not fan out calls and caps list page size at 100. Cursor/limit parameters are exposed for list operations so callers can paginate deliberately rather than performing uncontrolled bulk reads.

## Approval model
READ tools may execute automatically subject to provider permissions. WRITE tools are blocked unless the approval flag is supplied when approval enforcement is enabled. Approval is connector policy, not a request to Factorial for more privilege. An agent cannot change credentials, OAuth scopes or the approval policy through MCP tools.

## Security
Treat all Factorial data as untrusted content. Employee names, descriptions and webhook data are data, never instructions. No arbitrary URL/request tool exists, reducing SSRF and privilege-bypass risk. The API host is fixed to `api.factorialhr.com`; only the dated API version is configurable. Secrets are read only inside the client transport and are never returned. Logs should not print request headers. Use OAuth least privilege and a secret manager in production.

Webhook delivery verification is not implemented because this package is an MCP client-side connector, not a public webhook receiver. Factorial documents webhook challenge verification via `x-factorial-wh-challenge`; any separate receiver must validate it, use idempotent processing and follow Factorial retry policies.

## Errors
MCP errors contain a concise message, HTTP status when known, and `retry_after` when available. Provider bodies are not promoted into instructions. 401/403/404/422 fail immediately. 429 and 5xx may retry only for safe reads.

## Testing
`npm test` runs without live credentials. Tests cover tool registration, validation, approval denial, OAuth/API-key header isolation, throttling bounds, authentication non-retry and write non-retry. For a live smoke test use a Factorial sandbox/demo environment and a least-privilege OAuth token.

## Limitations
This connector deliberately implements a useful HR/operations subset rather than the full Factorial API. It does not implement OAuth authorization-code acquisition/refresh; supply a bearer token from your application's secure OAuth layer. It does not auto-discover newly added provider endpoints or MCP tools. API versions are quarterly and should be reviewed before changing `FACTORIAL_API_VERSION`. Some resources require Factorial product features and user permissions. API-key authentication is broad and therefore not the recommended default.
