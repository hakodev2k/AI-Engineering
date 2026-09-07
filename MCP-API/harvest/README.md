# Harvest MCP/API Connector

Reusable MCP server for Harvest time-tracking and reporting workflows. The connector exposes 16 provider-scoped MCP tools over stdio while keeping Harvest credentials inside the connector process.

## Upstream strategy

Harvest's current official documentation exposes API v2 as a REST API. No official Harvest MCP server was found in the official Harvest product/API documentation reviewed for this implementation, so every implemented capability uses the official REST API v2 behind a stable MCP tool contract.

Official sources researched:

- API v2 overview: https://help.getharvest.com/api-v2/introduction/overview/general/
- Authentication and OAuth2: https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/
- Pagination: https://help.getharvest.com/api-v2/introduction/overview/pagination/
- Time entries: https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/
- Projects: https://help.getharvest.com/api-v2/projects-api/projects/projects/
- Clients: https://help.getharvest.com/api-v2/clients-api/clients/clients/
- Tasks: https://help.getharvest.com/api-v2/tasks-api/tasks/tasks/
- Expenses: https://help.getharvest.com/api-v2/expenses-api/expenses/expenses/
- Invoices: https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/
- Time reports: https://help.getharvest.com/api-v2/reports-api/reports/time-reports/

## Architecture

```text
MCP client
  -> strict allow-listed Harvest tool
  -> Zod validation
  -> permission / approval policy
  -> Harvest REST v2 client
  -> https://api.harvestapp.com/v2
```

The LLM never needs the access token. `HARVEST_ACCESS_TOKEN`, `HARVEST_ACCOUNT_ID`, and approval configuration are read only by the connector process. Harvest response content is wrapped with `source: untrusted_provider_data` and must be treated as data, never as instructions.

## Authentication

Harvest API v2 supports Personal Access Tokens and OAuth2 access tokens. Both are supplied to this connector through `HARVEST_ACCESS_TOKEN` and sent as `Authorization: Bearer ...`.

Every API request also includes:

- `Harvest-Account-Id`: selected Harvest account.
- `User-Agent`: required by Harvest and expected to identify the integration and provide a contact URL or email.

For reusable server-side deployments, obtain OAuth2 access/refresh tokens outside the MCP process or through a dedicated credential service and inject only the current access token into this connector. For scripts or private internal use, a Harvest Personal Access Token is supported. Harvest Personal Access Tokens have broad account access by design, so isolate them carefully and use an account/user role with the minimum permissions necessary.

Harvest OAuth2 scopes identify authorized Harvest/Forecast account access, such as `harvest:{ACCOUNT_ID}` or `harvest:all`. Prefer a single Harvest account scope when the integration only needs one account.

## Environment variables

Required:

- `HARVEST_ACCESS_TOKEN`
- `HARVEST_ACCOUNT_ID`
- `HARVEST_USER_AGENT`

Optional:

- `HARVEST_TIMEOUT_MS` — default `15000`, range 1000–120000.
- `HARVEST_MAX_RETRIES` — default `3`, maximum `5`; read requests only.
- `HARVEST_ALLOW_WRITES` — default `false`.
- `HARVEST_APPROVAL_TOKEN` — required for every WRITE operation when writes are enabled.

Never commit real secrets. `.env.example` contains blank credential values only.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio. Standards-compatible MCP clients that can launch a local stdio process can configure `node dist/src/server.js` and inject environment variables from their secret-management mechanism. Compatibility depends on the client's stdio MCP support; this package does not claim hosted HTTP MCP support.

## Tools

| Tool | Transport | Permission | Risk | Approval |
|---|---|---|---|---|
| `harvest.user.me` | REST v2 | Harvest account access | READ | No |
| `harvest.user.list` | REST v2 | User read | READ | No |
| `harvest.client.list` | REST v2 | Client read | READ | No |
| `harvest.client.get` | REST v2 | Client read | READ | No |
| `harvest.project.list` | REST v2 | Project read | READ | No |
| `harvest.project.get` | REST v2 | Project read | READ | No |
| `harvest.task.list` | REST v2 | Task read | READ | No |
| `harvest.time_entry.list` | REST v2 | Timesheet read | READ | No |
| `harvest.time_entry.get` | REST v2 | Timesheet read | READ | No |
| `harvest.time_entry.create` | REST v2 | Timesheet write | WRITE | Yes |
| `harvest.time_entry.update` | REST v2 | Timesheet write | WRITE | Yes |
| `harvest.time_entry.stop` | REST v2 | Timesheet write | WRITE | Yes |
| `harvest.time_entry.restart` | REST v2 | Timesheet write | WRITE | Yes |
| `harvest.expense.list` | REST v2 | Expense read | READ | No |
| `harvest.invoice.list` | REST v2 | Invoice read; Harvest role may require Administrator or permitted Manager | READ | No |
| `harvest.report.project_time` | REST v2 Reports API | Reports read | READ | No |

No arbitrary raw-request, deletion, invoice-send, payment, project-delete, client-delete, expense-delete, or other destructive tool is exposed.

## Real-world workflows

Typical safe flows include:

1. List projects and tasks, inspect recent time entries, then create an approved duration-based time entry.
2. Retrieve a time entry, review it, then update hours/notes after approval.
3. Inspect a running timer and stop or restart it only after approval.
4. List expenses and invoices for operational review without changing billing data.
5. Retrieve project-time reports for bounded periods to analyze utilization and billable hours.

See `examples/workflows.md` for concrete tool inputs and output shapes.

## Permission and approval model

READ tools can execute automatically after Harvest authenticates and authorizes the caller.

WRITE tools require both controls:

1. `HARVEST_ALLOW_WRITES=true` configured by the connector operator.
2. A call-specific `approvalToken` exactly matching the connector-side `HARVEST_APPROVAL_TOKEN`.

The token is a connector control secret, not a Harvest credential. It should only be issued after a human reviews the specific intended mutation. The connector compares the token using constant-time comparison when lengths match.

HIGH_RISK and DESTRUCTIVE categories are supported by the policy layer, but no destructive tools are exposed in this package. The agent cannot enable writes, change approval configuration, or increase Harvest permissions through tool arguments.

## Validation and security

- Tool names are allow-listed and provider-scoped.
- Input schemas reject unknown properties.
- Numeric IDs must be positive integers.
- Page size is bounded to Harvest's documented maximum of 2000.
- `page` and `cursor` cannot be supplied together.
- Report date ranges are validated and capped at Harvest's documented 365-day maximum.
- No caller-supplied URL is accepted, preventing arbitrary SSRF through tool parameters.
- The REST base URL is fixed to `https://api.harvestapp.com/v2`.
- Credentials never appear in tool inputs, outputs, logs, or examples.
- Harvest content, including notes, client names, project names, and invoice fields, is untrusted external data.
- Retrieved content cannot modify system policy, tool permissions, or connector configuration.

## Reliability and rate limits

Harvest documents these API throttles:

- General API requests: 100 requests per 15 seconds.
- Reports API requests: 100 requests per 15 minutes.

Harvest returns HTTP `429` when throttled and uses `Retry-After` to indicate when to retry. The connector preserves `Retry-After`, uses bounded exponential backoff, and retries only GET requests on network failures, 429, and 5xx responses. POST/PATCH writes are never blindly retried, avoiding duplicate or unintended mutations.

Every request has an `AbortController` timeout. Authentication, permission, validation, and ordinary 4xx errors are not retried. List tools expose Harvest pagination inputs and return Harvest pagination metadata unchanged so callers can continue deliberately rather than triggering automatic fan-out.

## Error handling

The MCP server maps common provider failures into concise safe errors:

- `400`: malformed request or missing required Harvest header/parameter.
- `401`: invalid/expired access token.
- `403`: insufficient account role or resource permission.
- `404`: missing resource.
- `422`: provider-side validation failure.
- `429`: throttled; includes retry-after information when provided.
- `5xx`: Harvest service failure after bounded read retries.
- timeout/network failures: surfaced without exposing credentials.

## OAuth2 token lifecycle

Harvest OAuth2 authorization-code integrations receive access and refresh tokens from `https://id.getharvest.com/api/v2/oauth2/token`. Refresh-token storage and rotation should be handled by a credential provider outside the LLM and outside this package. The connector intentionally accepts only the current bearer token so raw refresh tokens and client secrets are never exposed through MCP tools.

## Webhooks and events

No webhook receiver is implemented because the current Harvest API v2 documentation reviewed for this connector does not define a first-party webhook API suitable for the selected workflows. The connector therefore does not claim event-delivery capability.

## Testing

```bash
npm test
```

Tests require no live Harvest credentials. They use fake fetch implementations and cover configuration validation, tool registration, strict schemas, default write denial, explicit approval, credential/header isolation, pagination, provider permission errors, rate-limit metadata, non-retry of writes, and timeout behavior.

## Limitations

- No official Harvest MCP server was identified; transport is REST v2 only.
- This package does not run the OAuth2 authorization UI or persist refresh tokens.
- No destructive endpoints are exposed.
- Invoice creation/sending, payment mutation, expenses mutation, project/client mutation, and administrative account changes are intentionally excluded.
- Duration-based time-entry creation is implemented; start/end-time account mode and timer-start creation are not exposed as separate creation tools.
- Actual visible resources and writable operations depend on the authenticated Harvest user's role and account permissions.
- Reports API throttling is substantially stricter than the general API, so callers should avoid polling reports.
