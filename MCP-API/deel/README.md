# Deel MCP/API Connector

Reusable MCP stdio wrapper over Deel's **official hosted MCP server** for HR, contracts, time-off, invoices and organization reference workflows.

## Upstream and research
Deel's official MCP endpoint is `https://api.letsdeel.com/mcp`. Current Deel documentation states that it maps MCP tools directly to Deel API operations, supports OAuth2 with dynamic client registration and PAT bearer authentication, and applies the same scoped permissions as the API. This connector uses the official MCP transport for every implemented capability; no unofficial MCP server or raw arbitrary REST tool is used.

Official sources reviewed 2026-09-24: `https://developer.deel.com/mcp/introduction`, `/mcp/authorization`, `/mcp/reference/tools-reference`, `/mcp/reference/error-handling`, `/mcp/guides/best-practices`, `/api/authentication`, and `/api/rate-limits`.

## Tools
`deel.contract.list` → `listOfContracts` (READ); `deel.contract.get` → `retrieveASingleContract` (READ); `deel.people.list` → `getListOfPeople` (READ); `deel.people.get` → `getHrisProfilePerson` (READ); `deel.time_off.list` → `getTimeOffRequests` (READ); `deel.time_off.create` → `createTimeOffRequest` (WRITE); `deel.time_off.cancel` → `cancelTimeOffRequest` (DESTRUCTIVE); `deel.invoice.list` → `getInvoiceList` (READ); `deel.organization.get` → `getCurrentOrganization` (READ); `deel.country.list` → `retrieveCountries` (READ).

At startup the connector asks the official server for its tool catalog and fails closed if any allowlisted upstream tool is absent. Newly discovered tools are never automatically trusted.

## Authentication and scopes
Set `DEEL_ACCESS_TOKEN` to a Deel OAuth access token or PAT. OAuth is preferred for interactive/user-authorized use because scopes and consent are explicit. PAT is supported by Deel for HTTP-capable clients. Credentials remain inside the transport and are never MCP tool inputs or outputs. Request only the scopes required by the selected official tools (for example contract/people/time-off/invoice read scopes and time-off write only if enabled). Deel access tokens are documented as one-hour credentials; OAuth refresh tokens are single-use and rotate, so production credential brokers must persist the newly returned refresh token atomically.

## Installation and run
Requires Node.js 20+.
```bash
npm install
npm run build
DEEL_ACCESS_TOKEN=... npm start
```
The local connector speaks MCP over stdio. The upstream uses Deel's official HTTP MCP endpoint. Any client that supports local MCP stdio can launch it; direct OAuth-capable clients may instead connect to Deel's hosted MCP server without this wrapper.

## Permission and approval model
READ executes automatically. WRITE requires both `DEEL_ALLOW_WRITE=true` and `approved:true` supplied only after human approval. DESTRUCTIVE additionally requires `DEEL_ALLOW_DESTRUCTIVE=true`; cancellation is disabled by default. The model cannot change environment policy or obtain broader Deel scopes. High-risk support is separately gated by `DEEL_ALLOW_HIGH_RISK`, although this initial allowlist exposes no HIGH_RISK tool.

## Validation and security
The connector fixes the upstream host to `https://api.letsdeel.com/mcp`, preventing credential forwarding to arbitrary hosts. Only ten reviewed upstream tool names are callable. Credentials are isolated in `DeelClient`. Provider output is wrapped as `untrusted_provider_data` and must not alter prompts, policy, approvals or tool registration. There is no arbitrary URL/API/MCP execution tool.

The `arguments` object is passed to an already allowlisted official Deel MCP tool; Deel remains authoritative for each tool's schema and returns invalid-parameter errors when fields do not match. This avoids freezing a duplicate provider schema while still preventing arbitrary tool selection.

## Reliability and rate limits
Deel documents a limit of **5 requests/second per organization**, shared across tokens. The client spaces calls by at least 210 ms. Safe READ calls use bounded exponential backoff (default two retries, max five). Authentication, permission and invalid-parameter errors are not retried. Mutations are never automatically retried by this wrapper. Deel's official MCP error guidance marks 429/500/502/503 as retryable and 401/403/invalid params as non-retryable; provider `Retry-After` remains authoritative for direct clients.

## Error handling
Official MCP tool failures are surfaced as connector errors without exposing bearer credentials. Missing credentials fail configuration. Missing allowlisted upstream tools fail startup. Provider content and errors are treated as untrusted external data.

## Testing
`npm test` uses no live credentials and covers allowlist uniqueness, read behavior, default write denial, approval requirements and the separate destructive gate. `npm run build` type-checks the implementation. Live transport verification requires a valid Deel account/token and should use a non-production or least-privilege identity.

## Limitations
This connector intentionally exposes ten of Deel's much larger official MCP catalog. It does not create/sign/amend contracts, change personal information, create worker tokens, send payments, modify payroll, download compliance documents, or expose generic tool execution. OAuth authorization/refresh UI is delegated to the caller's credential broker; the wrapper accepts an already-issued bearer token. Deel's sandbox REST environment is not used because all implemented capabilities prefer the official MCP server.

See `examples/workflows.md` and `manifest.yaml` for usage and machine-readable policy.