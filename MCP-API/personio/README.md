# Personio MCP/API Connector

Reusable MCP server for Personio HR workflows. It wraps scoped official Personio REST APIs behind stable MCP tools and keeps credentials inside the connector process.

## Upstream strategy

No official Personio MCP server was identified during implementation, so this connector uses Personio's official REST APIs. Personio documents Employee, Attendance, Absence/Time-Off, Recruiting, Custom Reports and Webhooks APIs. Current v2 OpenAPI files also cover persons, employment, recruiting, reports, documents, absences, attendances, org data and webhooks. This connector deliberately implements a small operational subset rather than exposing arbitrary HTTP.

Official documentation:
- https://developer.personio.de/docs/getting-started-with-the-personio-api
- https://developer.personio.de/openapi
- https://developer.personio.de/docs/event-driven-data-from-personio
- https://developer.personio.de/v2.0/reference/webhooks

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `personio.employee.list` | REST v1 | READ | No |
| `personio.employee.get` | REST v1 | READ | No |
| `personio.employee.create` | REST v1 | WRITE | Yes |
| `personio.employee.update` | REST v1 | WRITE | Yes |
| `personio.time_off.list` | REST v1 | READ | No |
| `personio.time_off.create` | REST v1 | WRITE | Yes |
| `personio.attendance.list` | REST v1 | READ | No |
| `personio.webhook.list` | REST v2 | READ | No |
| `personio.webhook.get` | REST v2 | READ | No |

Employee updates intentionally allow only first/last name, position and weekly hours. Arbitrary field mutation and destructive operations are not exposed. Webhook mutation is intentionally omitted because changing callback destinations is security-sensitive.

## Authentication and permissions

Create a Personio custom integration under Marketplace > Connected integrations. The connector exchanges `PERSONIO_CLIENT_ID` and `PERSONIO_CLIENT_SECRET` through `/v1/auth`; credentials never enter MCP arguments or tool output. Personio requires readable employee attributes to be explicitly whitelisted. Grant only API permissions required by tools you enable. Webhook reads require the `personio:webhooks:read` scope. Personio documents separate credentials for Recruiting; this connector does not currently expose Recruiting operations.

Personio discourages browser-side API integrations because client credentials are trusted secrets. Run this connector server-side or locally as a subprocess.

## Configuration

Copy `.env.example` into your secret-management workflow. Required: `PERSONIO_CLIENT_ID`, `PERSONIO_CLIENT_SECRET`. Optional: `PERSONIO_BASE_URL`, `PERSONIO_TIMEOUT_MS`, `PERSONIO_APPROVE_WRITES`.

Writes are protected twice: `PERSONIO_APPROVE_WRITES=true` must be configured by the operator and each write call must include `approved: true` after explicit human approval. An agent cannot elevate the environment switch itself.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers. Configure the client to run the built `dist/src/server.js` process with credentials supplied through the client's secret/environment mechanism.

## Reliability and rate limits

Requests use a configurable timeout. HTTP 429 is retried at most twice and honors `Retry-After`, capped at 30 seconds per wait. Validation, authorization, authentication, and ordinary provider errors are not blindly retried. Personio increasingly recommends webhooks instead of repetitive polling where event-driven APIs are available.

## Pagination

Employee, time-off and attendance list tools expose bounded `limit`/`offset` parameters. The maximum connector page size is 200 to prevent accidental bulk extraction and excessive calls.

## Security model

Provider data is untrusted content, never instructions. There is no generic URL/request tool, preventing agent-controlled SSRF through this connector. The base URL must use HTTPS. Secrets are not logged or returned. Writes require explicit approval. Destructive employee deletion, webhook mutation, permission changes, payroll changes, compensation changes, document access and Recruiting writes are not implemented.

Personio currently documents TLS 1.2 support. Personio also announced an API TLS certificate transition on 22 September 2026 from RSA 2048 to ECDSA P-256; integrations using certificate pinning or custom trust stores must prepare for that change. This connector relies on the runtime trust store and does not pin leaf certificates.

## Personio approval semantics

For `personio.time_off.create`, `skip_approval` defaults to `false` in this connector so Personio's configured approval workflow is preserved. Setting it to true changes provider-side approval behavior and should only be used when the integrating system legitimately owns approvals.

## Testing

```bash
npm test
```

Unit tests require no live Personio credentials. They cover credential configuration, HTTPS enforcement, schema validation, write denial and read routing. Provider integration testing should use a non-production Personio environment with least-privilege credentials.

## Limitations

This is not a proxy for the entire Personio API. It does not implement Recruiting, reports, compensation, documents, employee deletion, webhook writes, absence deletion, attendance writes, OAuth partner flows, or v2 person/employment mutation. Personio remains the source of truth for HR data; consumers should prefer event-driven synchronization where supported and avoid aggressive polling.
