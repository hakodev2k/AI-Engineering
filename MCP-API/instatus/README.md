# Instatus MCP/API Connector

Reusable MCP server that exposes a scoped Instatus status-page workflow over the official Instatus REST API. No official Instatus MCP server was identified during implementation, so all implemented capabilities use the documented REST API rather than an unofficial MCP server.

## Official sources
- API documentation: https://instatus.com/help/api
- API reference: https://api.instatus.com/
- Product/help documentation: https://instatus.com/help

Validate provider documentation before production rollout because endpoint fields and enum values can evolve.

## Transport and architecture
`MCP client -> local stdio MCP server -> policy/validation -> InstatusClient -> HTTPS REST API`.
Credentials are read only inside connector configuration and are never tool arguments or returned to the model. Provider content is untrusted data and is never interpreted as instructions.

## Capabilities
Fourteen provider-scoped tools are implemented: `instatus.page.list`, `instatus.page.get`, `instatus.component.list`, `instatus.component.get`, `instatus.component.update`, `instatus.incident.list`, `instatus.incident.get`, `instatus.incident.create`, `instatus.incident.update`, `instatus.incident.delete`, `instatus.maintenance.list`, `instatus.maintenance.get`, `instatus.maintenance.create`, and `instatus.maintenance.delete`.

## Authentication
Create an Instatus API key with only the access needed for the pages this connector operates. Set `INSTATUS_API_KEY`; never place the key in prompts, tool input, source control, logs, or examples. This connector sends it as a Bearer credential to the configured HTTPS API base. Instatus API-key permissions are account/provider controlled; use the narrowest key available and separate read-only automation from publishing automation when possible.

## Environment
Copy `.env.example` into your secret-managed runtime configuration. `INSTATUS_API_BASE` defaults to `https://api.instatus.com/v1` and must be HTTPS. `INSTATUS_TIMEOUT_MS` defaults to 15000; `INSTATUS_MAX_RETRIES` defaults to 2. `INSTATUS_APPROVE_WRITES=false` makes writes require per-call approval. `INSTATUS_ENABLE_DESTRUCTIVE=false` disables deletes even when approval is supplied.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
INSTATUS_API_KEY=... npm start
```

The process uses MCP stdio and can therefore be configured as a local MCP command by clients that support stdio servers. Compatibility depends on the client supporting standard MCP stdio transport; no client-specific proprietary integration is required.

## Permission and approval model
READ tools may run without approval. `component.update` is WRITE and requires approval unless writes are explicitly enabled by operator configuration. Incident publishing/updating and maintenance publishing are HIGH_RISK because they change externally visible service-status communication; they require explicit human approval by default. Incident and maintenance deletion are DESTRUCTIVE, are disabled by default, require `INSTATUS_ENABLE_DESTRUCTIVE=true`, and also require `approved:true`.

This separation supports Read -> Recommend -> Prepare -> Execute workflows. The connector cannot elevate its own permissions.

## Validation and safety
IDs accept only alphanumeric, underscore, and hyphen characters and are length bounded. Human-visible strings, arrays, durations, and timestamps are bounded/validated with Zod. The API base must use HTTPS, reducing accidental SSRF/custom clear-text targets. No arbitrary URL/request tool exists. Retrieved page/incident/component content must be treated as untrusted provider data and cannot alter policy or tool registration.

## Reliability, errors, and rate limiting
Requests use a bounded timeout and support caller cancellation. Read/write requests may retry transient network errors, HTTP 5xx, and HTTP 429 with bounded exponential backoff; `Retry-After` is preserved when supplied. Authentication, authorization, validation, and ordinary 4xx errors are not blindly retried. DELETE is never retried automatically. Provider failures are mapped to `ProviderError` with HTTP status and optional retry-after information.

Instatus may enforce limits according to current service/API policy; this connector does not invent a fixed quota. It reacts to HTTP 429 and `Retry-After` rather than assuming an undocumented numeric limit. List tools issue one provider request and do not create hidden fan-out.

## Tool inputs
Read tools require only the relevant `pageId` and resource ID. Mutation tools expose only fields needed for the supported workflow and never expose a generic REST request. Mutation calls accept `approved`; HIGH_RISK and DESTRUCTIVE operations require it under the policy described above.

## Testing
Run:

```bash
npm test
```

Tests use mocked fetch responses and no live credentials. Coverage includes missing authentication configuration, write/destructive policy, credential isolation, successful reads, authentication failure without retry, bounded transient retry, and the no-retry rule for DELETE.

## Examples
See `examples/workflows.md` for read, incident publishing, and maintenance workflows with expected permission/approval behavior.

## Security considerations
Keep API keys in a secret manager and rotate on exposure. Run separate instances/keys for different trust domains. Do not log authorization headers. Review all public status messages before execution. Keep destructive operations disabled unless an operator explicitly needs them. Do not let text retrieved from incidents/components instruct the agent to change configuration, approvals, credentials, or permissions.

## Limitations
This connector intentionally does not expose page deletion, arbitrary HTTP calls, subscriber management, team/account administration, billing, or other operations that were not selected for the core status-management workflow. It does not implement webhooks because the selected workflow is request/response MCP tooling. It uses REST only; no unofficial MCP dependency is introduced.
