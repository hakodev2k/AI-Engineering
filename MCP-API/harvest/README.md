# Harvest MCP Connector

Reusable MCP server for Harvest time tracking and reporting, backed by the official Harvest API v2. No official Harvest MCP server was identified during implementation, so all capabilities use the official REST API.

## Official sources
- API v2: https://help.getharvest.com/api-v2/
- Overview/auth/rate limits: https://help.getharvest.com/api-v2/introduction/overview/general/
- Time entries: https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/
- Projects: https://help.getharvest.com/api-v2/projects-api/projects/projects/
- Reports: https://help.getharvest.com/api-v2/reports-api/

## Architecture and authentication
MCP client -> strict tool schema -> permission gate -> HarvestClient -> `https://api.harvestapp.com/v2`. Credentials remain in the connector process. Configure `HARVEST_ACCESS_TOKEN`, `HARVEST_ACCOUNT_ID`, and a valid identifying `HARVEST_USER_AGENT`. Harvest API v2 uses OAuth2 bearer access tokens plus the account-id header. The connector does not log or return credentials. OAuth token acquisition/refresh is intentionally delegated to a secure credential provider; raw tokens must never be supplied through tool arguments.

## Tools
READ: `harvest.users.list`, `harvest.clients.list`, `harvest.projects.list`, `harvest.tasks.list`, `harvest.time_entries.list`, `harvest.time_entries.get`, `harvest.expenses.list`, `harvest.invoices.list`, `harvest.reports.time_projects`, `harvest.reports.uninvoiced`.

WRITE: `harvest.time_entries.create`, `harvest.time_entries.update`, `harvest.time_entries.stop`. Writes require both `HARVEST_ALLOW_WRITES=true` and `approved:true` on every call. No delete, invoice-send, payment, user-role, or project-delete operation is exposed.

Harvest permissions are inherited from the authenticated user; use a dedicated least-privilege OAuth identity appropriate to the tools enabled. Report visibility and write access vary by Harvest role/project assignment.

## Install and run
Requires Node.js 20+.

```sh
npm install
npm run build
npm start
```

Configure the process environment from `.env.example`; do not commit secrets. The server uses MCP stdio and can be launched by MCP clients that support stdio servers.

## Examples
Read projects: tool `harvest.projects.list`, input `{ "page": 1, "per_page": 100 }`; permission READ; no approval. Output is the Harvest response wrapped as `data` and flagged as untrusted provider content.

Create time: tool `harvest.time_entries.create`, input `{ "project_id": 1, "task_id": 2, "spent_date": "2026-09-21", "hours": 1.5, "notes": "Work", "approved": true }`; permission WRITE; explicit approval required and writes must be enabled.

Project report: tool `harvest.reports.time_projects`, input `{ "from": "2026-09-01", "to": "2026-09-21", "page": 1, "per_page": 100 }`; permission READ.

## Reliability and rate limits
GET requests retry at most twice for HTTP 429 and 5xx with bounded exponential delay and `Retry-After` support. Authentication, permission, validation, and write operations are not automatically retried. Requests use configurable timeouts. Pagination is explicit and capped at Harvest's documented maximum of 2000 records per page. Harvest documents 100 general API requests per 15 seconds and 100 Reports API requests per 15 minutes.

## Errors
The connector maps authentication, permission, throttling, timeout and provider errors to stable error codes. Zod rejects unknown/ambiguous fields before provider calls.

## Security
Provider responses are untrusted data, never instructions. Tool parameters cannot override base URL, headers, credentials, permissions, or transport, preventing arbitrary-request/SSRF behavior. Writes cannot silently elevate permission. Keep tokens in a secret manager/environment and restrict the OAuth identity. This connector does not ingest webhooks, so webhook-signature validation is not applicable.

## Testing
`npm test` uses mocks only; no live credentials. Tests cover auth configuration, tool registration, strict validation, read pagination, write denial/approval, invalid credentials, throttling retry, and timeout behavior.

## Limitations
REST only; no upstream MCP dependency. OAuth authorization-code/refresh-token UI is not implemented because deployment credential lifecycle differs by host; provide a valid access token securely. The connector intentionally omits destructive operations and invoice sending. API responses are passed through to preserve Harvest fields.