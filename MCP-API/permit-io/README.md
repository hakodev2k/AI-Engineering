# Permit.io MCP/API Connector

Reusable MCP stdio connector for safe inspection and limited synchronization of Permit.io authorization data.

## Official MCP, API and SDK sources
Permit.io has an official Permit MCP server for access requests, operation approval requests, and resource-instance workflows. Official documentation describes both local use with credentials and hosted/production deployment. Permit also operates the Permit MCP Gateway, a managed MCP proxy that authenticates humans, applies per-tool policy/trust, consent and audit. This package does not proxy either surface: its implemented capabilities use Permit's official v2 REST API because the management/facts/schema operations exposed here are directly documented there and a fixed REST contract is easier to constrain and audit.

Official sources: https://docs.permit.io/integrations/permit-mcp/overview/ ; https://docs.permit.io/permit-mcp-gateway/ ; https://docs.permit.io/api/v2-migration-guide/ ; https://docs.permit.io/api/api-with-cli/ ; https://docs.permit.io/overview/get-api-key/

## Capabilities and transport
Thirteen MCP tools are implemented over REST: project list; environment list; resource list/get; role list/get; user list/get; tenant list/get; role-assignment list; user create; tenant create. The connector intentionally omits delete, policy/schema mutation, role assignment mutation, permission changes, API-key rotation, access-request approval and arbitrary HTTP.

Permit v2 organizes schema objects under `/v2/schema/{project}/{environment}` and facts under `/v2/facts/{project}/{environment}`. `PERMIT_PROJECT_ID` and `PERMIT_ENVIRONMENT_ID` configure that reusable scope; no tenant, user or company identifier is hard-coded.

## Authentication and least privilege
Set `PERMIT_API_KEY` to a Permit API key authorized for the intended container. The REST API uses `Authorization: Bearer <key>`. Permit documents environment API keys as bound to the active environment; prefer the narrowest key/container that supports your workflow. Credentials remain inside the connector and are never accepted as MCP tool arguments or returned to the model.

## Regions and SSRF protection
`PERMIT_REGION=us` uses `https://api.permit.io`; `eu` uses `https://api.eu.permit.io`. No arbitrary base URL is accepted. API paths are restricted to `/v2/`.

## Installation and running
Requires Node.js 20+.

    npm install
    npm run build
    npm start

The exposed MCP transport is stdio. Use it with clients that can launch stdio MCP child processes; this README does not claim unsupported client-specific behavior.

## Tools, permissions and approvals
READ: `permit.project.list`, `permit.environment.list`, `permit.resource.list`, `permit.resource.get`, `permit.role.list`, `permit.role.get`, `permit.user.list`, `permit.user.get`, `permit.tenant.list`, `permit.tenant.get`, `permit.role_assignment.list`.

WRITE: `permit.user.create`, `permit.tenant.create`. Writes require `approved:true` and, by default, `PERMIT_WRITE_APPROVAL=required`. Provider writes are never automatically retried. HIGH_RISK and DESTRUCTIVE operations are not exposed; the policy layer rejects destructive execution.

## Rate limits and reliability
Permit documents REST API limits including 40 schema writes/min, 50 member requests/min, 60 DELETE/min, 100 bulk requests/10 min, 300 total writes/min, and 1,000 total requests/min. The connector avoids bulk/destructive calls. READ requests retry only 429 and transient 5xx/network failures with bounded exponential backoff (configured maximum capped at five retries) and honors `Retry-After` when present. Authentication, authorization, validation and WRITE failures are not blindly retried. Requests use AbortController timeouts; list pagination is bounded to 100 items per request.

Permit's MCP Gateway has separate gateway rate limits; they are not applicable to this REST transport. The official gateway currently documents 1,000 `/mcp` requests/min, 1,200 writes/min and 2,000 total requests/min per IP.

## Error handling
Non-success provider responses map internally to `PermitError` with HTTP status, provider message and optional retry delay. Missing scope, invalid region/path, schema violations and missing approval fail before mutation. Provider responses are wrapped as `untrustedProviderData` so retrieved names/descriptions/attributes are data rather than instructions.

## Security
API keys are isolated from the LLM. API origins and path prefixes are allowlisted. Inputs use strict schemas, bounded strings/pagination and no arbitrary URL/request primitive. Retrieved provider content cannot alter tool permissions. The connector does not expose permission escalation, role assignment, policy editing, API-key management or destructive operations. Human approval gates all implemented writes.

The Permit MCP Gateway itself supports OAuth 2.1/session authentication, human-to-agent delegation, trust levels, consent and audit for upstream MCP servers. Those gateway controls are complementary but are not silently assumed by this local connector.

## Testing
Run `npm test`. Tests need no live credentials and cover auth/scope configuration, tool registration, strict validation, approval denial, region allowlisting, provider/auth error mapping, 429 retry behavior and no blind write retries.

## Limitations
This connector does not implement the official Permit MCP access-request/operation-approval toolset, Cloud/local PDP authorization checks, SDK `permit.check()`, resource instances, relationship tuples, ABAC condition-set mutation, webhook ingestion, MCP Gateway host/import administration, or any destructive action. Use Permit's official MCP/Gateway or SDK/PDP when those are the required capability.
