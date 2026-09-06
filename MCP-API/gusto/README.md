# Gusto MCP/API Connector

Reusable MCP server for agent workflows over the official Gusto App Integrations API. It exposes a small, deterministic set of HR/payroll tools instead of arbitrary HTTP access, keeps OAuth credentials inside the connector, validates all inputs, and gates every mutating operation behind explicit human approval.

## Transport strategy

Gusto provides two official MCP offerings as of 2026-09-06:

- The customer-data Gusto MCP server at `https://mcp.api.gusto.com`, intended for supported AI clients with dynamic client registration. Gusto explicitly recommends isolation, trusted clients, manual confirmation for every tool call, and verification of outputs.
- The Embedded Dev Assistant MCP at `https://embedded-payroll.readme.io/mcp`, which is a documentation/developer-assistance MCP for API reference search, documentation lookup, and code generation rather than a production payroll execution surface.

This connector does **not** proxy either remote MCP server. The customer-data MCP's exact public tool contract is not documented as a stable allowlist suitable for security-sensitive automation, while the Dev Assistant MCP is documentation-oriented. For the concrete capabilities below, the official REST API v2026-06-15 is safer and more deterministic. The external interface remains MCP, so callers do not issue raw REST requests.

Official sources researched:

- Gusto MCP: https://gusto.com/product/integrations/gusto-mcp
- Embedded Dev Assistant MCP: https://docs.gusto.com/embedded-payroll/docs/dev-assistant-mcp
- App Integrations API: https://docs.gusto.com/app-integrations/
- OAuth2: https://docs.gusto.com/app-integrations/docs/oauth2
- Scopes: https://docs.gusto.com/app-integrations/docs/scopes
- Rate limits: https://docs.gusto.com/app-integrations/docs/rate-limits
- June 2026 API version: https://docs.gusto.com/app-integrations/changelog/june-2026

## Implemented tools

| Tool | Official scope | Risk | Approval |
|---|---|---:|---:|
| `gusto.company.get` | `companies:read` | READ | no |
| `gusto.company.locations.list` | `companies:read` | READ | no |
| `gusto.employee.list` | `employees:read` | READ | no |
| `gusto.employee.get` | `employees:read` | READ | no |
| `gusto.employee.home_addresses.list` | `employees:read` | READ | no |
| `gusto.employee.time_off_activities.list` | `employee_time_off_activities:read` | READ | no |
| `gusto.employee.pay_stubs.list` | `pay_stubs:read` | READ | no |
| `gusto.payroll.list` | `payrolls:read` | READ | no |
| `gusto.payroll.get` | `payrolls:read` | READ | no |
| `gusto.employee.create` | `employees:manage` | HIGH_RISK | always |
| `gusto.employee.update` | `employees:write` | HIGH_RISK | always |
| `gusto.payroll.prepare` | `payrolls:write employees:read` | HIGH_RISK | always |

The connector intentionally does not expose payroll processing, termination/deletion, benefits changes, tax/security changes, arbitrary API requests, or PDF downloads. Gusto's own payroll guidance states that payroll processing itself must be reviewed and confirmed in Gusto rather than processed through this API workflow.

## Architecture

```text
MCP client
  -> stdio MCP server
     -> strict tool schema
     -> risk/approval policy
     -> Gusto client
     -> credential provider
     -> official Gusto REST API
```

Provider responses are treated as untrusted data. They are returned to the caller as data and never interpreted as instructions that can alter permissions, configuration, tool registration, or approval policy.

## Authentication

Gusto App Integrations uses OAuth2 company-level access/refresh token pairs. Strict access means a grant is associated with one company. Access tokens expire after two hours. Refresh tokens are single-use and rotate when exchanged.

Set `GUSTO_ACCESS_TOKEN` from your secure credential store. Optional in-process refresh is enabled only when all of `GUSTO_REFRESH_TOKEN`, `GUSTO_CLIENT_ID`, and `GUSTO_CLIENT_SECRET` are supplied. The new access/refresh values are retained only in process memory; this package does not write credentials to disk. Production deployments should use a persistent encrypted credential provider if they need refresh-token durability across restarts.

The LLM never receives raw tokens. Authorization headers are constructed inside the connector transport.

## Environment variables

Copy `.env.example` and supply values through your process manager or secret store.

- `GUSTO_ACCESS_TOKEN` — required OAuth company access token.
- `GUSTO_REFRESH_TOKEN` — optional rotating refresh token.
- `GUSTO_CLIENT_ID` / `GUSTO_CLIENT_SECRET` — required together with refresh token.
- `GUSTO_REDIRECT_URI` — optional for refresh compatibility with the application configuration.
- `GUSTO_BASE_URL` — only `https://api.gusto-demo.com` or `https://api.gusto.com` are accepted.
- `GUSTO_API_VERSION` — fixed to stable `2026-06-15`.
- `GUSTO_TIMEOUT_MS` — request timeout, default 15000.
- `GUSTO_MAX_RETRIES` — bounded retry count for safe reads, default 2, maximum 5.
- `GUSTO_REQUIRE_WRITE_APPROVAL` — defaults to true. HIGH_RISK operations require approval regardless.
- `GUSTO_APPROVED_ACTIONS` — semicolon-separated exact approval fingerprints.

## Approval model

READ tools may execute automatically. All three mutations are HIGH_RISK because they alter employment records or payroll state and therefore always require an exact approval fingerprint generated from the target resource:

- `gusto.employee.create:<companyId>:<email-or-workEmail-or-firstName>`
- `gusto.employee.update:<employeeId>:<version>`
- `gusto.payroll.prepare:<companyId>:<payrollId>`

Approval is connector-side configuration; an agent cannot satisfy the gate by passing an `approved=true` argument. No DESTRUCTIVE tool is exposed.

`gusto.payroll.prepare` is intentionally HIGH_RISK because Gusto documents that preparing a previously calculated payroll nullifies `calculated_at` and totals. It should only run after a human verifies the exact payroll and intended employee set.

## Rate limits and reliability

Gusto documents a limit of 200 requests per minute per OAuth grant/application-user pair using a rolling 60-second window. The client preserves `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` in output metadata when present.

GET/HEAD calls use bounded exponential backoff for network failures, HTTP 429, and HTTP 5xx. Numeric `Retry-After` is honored. Mutating requests are never blindly retried for 5xx or network failures. A 401 may trigger one OAuth token refresh and one retry because the first request was rejected as unauthorized. Authentication, authorization, version, validation, conflict, and other non-transient provider errors are not retried.

Collection tools expose bounded `page`/`per` inputs and never auto-drain an entire account. The v2026-06-15 Payrolls API paginates by default; this connector therefore makes pagination explicit.

## Security considerations

- Only official Gusto API hosts are accepted, reducing SSRF risk.
- HTTPS is mandatory.
- No arbitrary URL or arbitrary provider-request tool exists.
- Tokens and client secrets are never included in MCP outputs or tool schemas.
- Inputs use strict Zod schemas with UUID, date, email, length, enum, pagination, and field-count constraints.
- Employee SSNs, home addresses, DOB, pay stubs, compensation, and payroll data are sensitive. Limit OAuth scopes to the exact tools you enable and avoid persisting tool output in model logs.
- Compensation data requires additional Gusto permissions where applicable; this connector does not request `compensations:read` as a baseline scope.
- Gusto MCP documentation itself recommends manual confirmation and isolation for sensitive data access. Apply the same operational discipline to this connector.
- Retrieved names, addresses, custom fields, and other provider content are untrusted data and cannot change policy.

## Installation and running

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio transport. Any MCP client capable of launching a local stdio server can use it. This repository does not claim client-specific OAuth UX or remote-MCP compatibility beyond the MCP stdio protocol implemented by `@modelcontextprotocol/sdk`.

## OAuth scopes

Do not request every scope automatically. Configure the Gusto application for only the tools you intend to expose. The full connector needs:

```text
companies:read
employees:read
employees:manage
employees:write
payrolls:read
payrolls:write
employee_time_off_activities:read
pay_stubs:read
```

`gusto.payroll.prepare` also requires `employees:read` when employee compensation data is included. If a production application has not been approved for a scope, Gusto will return 403.

## Error handling

The server maps common provider conditions into concise MCP errors: 401 reauthorization, 403 insufficient scope/company grant, 404 missing UUID, 406 API-version rejection, 409 optimistic-version conflict, 422 validation/invalid operation, and 429 throttling with `Retry-After` when available. Other provider responses are surfaced without exposing connector credentials.

## Testing

Unit tests require no live Gusto credentials. They cover:

- authentication/configuration defaults;
- official-host/SSRF rejection;
- incomplete refresh-token configuration;
- tool registration;
- strict input validation;
- exact human-approval denial/allow;
- 429 retry and rate metadata;
- no blind retry of writes;
- one-time 401 refresh behavior;
- in-memory refresh-token rotation.

## Limitations

- The official customer-data Gusto MCP is documented but not proxied because its exact tool allowlist is not publicly stable enough for this security-sensitive adapter.
- Refresh token rotation is durable only for the life of the process; production systems should replace `EnvCredentialProvider` with encrypted persistent storage.
- The connector does not process payroll, delete/terminate employees, modify benefits/taxes/security, download form/pay-stub PDFs, or host/verify webhooks.
- `gusto.employee.get` may return additional sensitive fields depending on scopes granted by the Gusto application; scope governance remains an administrator responsibility.
