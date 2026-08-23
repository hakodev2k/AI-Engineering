# Xero MCP/API Connector

Reusable MCP wrapper for Xero accounting workflows. The connector exposes a deliberately small, stable tool surface and delegates supported operations to Xero's official open-source MCP server (`@xeroapi/xero-mcp-server`). Credentials remain in the connector process and are never placed in model prompts.

## Upstream strategy

Xero provides an official local/STDIO MCP server maintained by `XeroAPI`. This connector therefore uses that MCP server as the primary upstream transport for every implemented capability instead of reimplementing the Accounting API. The upstream package itself uses Xero's official APIs/SDK.

Official sources researched for this connector:

- Xero AI Toolkit / MCP: https://developer.xero.com/ai
- Official MCP server: https://github.com/XeroAPI/xero-mcp-server
- OAuth 2.0 overview: https://developer.xero.com/documentation/guides/oauth2/overview
- OAuth scopes: https://developer.xero.com/documentation/guides/oauth2/scopes/
- Accounting API overview: https://developer.xero.com/documentation/api/accounting/overview
- API rate limits: https://developer.xero.com/documentation/best-practices/api-call-efficiencies/rate-limits
- Webhooks: https://developer.xero.com/documentation/guides/webhooks/overview/

The official MCP server currently supports contact management, accounts, invoices, payments, reports, bank transactions, payroll and other operations. This wrapper intentionally exposes only a safer subset.

## Implemented tools

| Tool | Upstream MCP tool | Risk | Approval |
| --- | --- | --- | --- |
| `xero.organisation.read` | `list-organisation-details` | READ | No |
| `xero.account.list` | `list-accounts` | READ | No |
| `xero.contact.list` | `list-contacts` | READ | No |
| `xero.invoice.list` | `list-invoices` | READ | No |
| `xero.payment.list` | `list-payments` | READ | No |
| `xero.report.profit_loss` | `list-profit-and-loss` | READ | No |
| `xero.report.balance_sheet` | `list-report-balance-sheet` | READ | No |
| `xero.report.trial_balance` | `list-trial-balance` | READ | No |
| `xero.contact.create` | `create-contact` | WRITE | Yes |
| `xero.invoice.create_draft` | `create-invoice` | HIGH_RISK | Yes |

The upstream `create-invoice` implementation sets invoice status to `DRAFT`. This wrapper does not expose payment creation, invoice approval, destructive actions, payroll mutation, bank-transaction mutation, or arbitrary upstream tool execution.

## Architecture

```text
MCP client / agent
      |
      v
xero-connector (this package)
  - strict schemas
  - tool allowlist
  - risk/approval gate
  - credential isolation
      |
      v
Official Xero MCP server over STDIO
      |
      v
Xero official API / SDK
```

Third-party content returned from Xero must be treated as untrusted data. It must not be interpreted as permission to call write tools or as instructions that override agent/system policy.

## Authentication

Xero requires OAuth 2.0 for new integrations. The official MCP server supports two relevant modes:

1. **Custom Connection**: configure `XERO_CLIENT_ID` and `XERO_CLIENT_SECRET`. This is suitable for a server-to-server connection to one Xero organisation where Xero Custom Connections are available.
2. **Bearer token**: configure `XERO_CLIENT_BEARER_TOKEN`. This is useful when another trusted component owns the OAuth/PKCE flow and injects a short-lived token at runtime.

Do not pass access tokens to the LLM. Store them in a secret manager or environment supplied only to the connector process.

### Environment

Copy `.env.example` into your secret/configuration system. Do not commit a populated `.env` file.

`XERO_SCOPES` is forwarded only to the official Xero MCP subprocess. If omitted, the upstream server uses its documented defaults. Prefer granular scopes for new integrations.

Suggested read-only scopes for the implemented read tools include:

- `accounting.contacts.read`
- `accounting.invoices.read`
- `accounting.payments.read`
- `accounting.settings.read`
- `accounting.reports.profitandloss.read`
- `accounting.reports.balancesheet.read`
- `accounting.reports.trialbalance.read`

Write tools additionally require the corresponding write scopes such as `accounting.contacts` and `accounting.invoices`.

## Permission and approval model

READ tools may execute automatically when the configured Xero token has the required scope.

WRITE and HIGH_RISK tools are disabled by default. An operator outside the model must deliberately start the process with:

```text
XERO_WRITE_MODE=allow
```

The model cannot change process environment variables, so it cannot silently escalate itself from read-only to write-enabled mode. Use a separate read-only deployment when strong isolation is required.

Financially sensitive actions that are not required for the supported workflows remain unregistered rather than merely hidden.

## Installation

Requirements:

- Node.js 20+
- npm/npx available on `PATH`
- Xero developer credentials or a runtime bearer token

Install and validate from this directory:

```bash
npm install
npm run check
```

The first connector request starts Xero's official MCP package through:

```bash
npx -y @xeroapi/xero-mcp-server@latest
```

For stricter production reproducibility, pin the upstream package version according to your dependency policy after validating it against Xero's current release.

## Running

```bash
npm run build
npm start
```

Configure an MCP client to launch `node dist/server.js` with the required Xero environment variables. This package uses STDIO MCP and writes diagnostics only to stderr.

## Validation

Schemas reject ambiguous or excessive input before an upstream write occurs. Contact creation validates name length and optional email/phone. Draft invoice creation requires:

- a contact UUID;
- `ACCREC` or `ACCPAY` type;
- 1-50 line items;
- bounded description, quantity, amount, account-code and tax-type fields;
- optional ISO `YYYY-MM-DD` date.

No unrestricted URL, endpoint, HTTP method, arbitrary MCP tool name or raw provider request tool is exposed.

## Reliability and errors

The upstream MCP client is lazily connected. Each connect/tool operation is bounded by a 30-second timeout. The wrapper does not blindly retry writes. Upstream MCP errors are normalized as `UPSTREAM_MCP_ERROR`, timeout failures as `UPSTREAM_TIMEOUT`, configuration failures as `AUTH_CONFIG_ERROR`, and disabled writes as `APPROVAL_REQUIRED`.

Xero enforces tenant and app rate limits. Current official documentation describes a 5-call concurrent tenant limit, 60 calls/minute per tenant, daily tenant limits depending on app tier, and an app-wide minute limit. Xero returns rate-limit headers and `Retry-After` when throttled. The official MCP/API layer remains authoritative for these responses. Prefer bounded pagination and avoid unnecessary repeated reads.

## OAuth and scope notes

Xero supports OAuth authorization-code/PKCE flows and Custom Connections. As of 2026, Xero is migrating newly created apps toward granular scopes; consult the current scopes page before deploying because scope availability and migration timelines can change.

For long-lived regular OAuth connections, request `offline_access` only when refresh-token capability is required. Refresh tokens and client secrets belong in the authentication layer, never in tool arguments or model context.

## Webhooks

Xero supports webhooks for selected event categories. This connector does not host a webhook receiver because webhook ingress requires deployment-specific public routing, signature verification, replay protection and durable processing. Add a separate verified webhook adapter when event-driven workflows are required; do not expose an unauthenticated callback as an MCP tool.

## Security considerations

- Only the allowlisted environment variables required to launch the child process are inherited; unrelated process secrets are not forwarded.
- Use least-privilege Xero scopes.
- Keep write mode disabled for analysis/reporting agents.
- Treat contact names, invoice descriptions, references and all provider-returned text as untrusted content.
- Never convert provider text into tool permissions or policy changes.
- Do not log bearer tokens, client secrets, invoice data or personal information.
- Do not add arbitrary HTTP or arbitrary upstream-MCP passthrough tools.
- Review the upstream official MCP package and pin a validated version for high-assurance deployments.
- Rotate credentials after any suspected disclosure.

## Tests

`tests/connector.test.ts` uses a fake upstream; no live Xero credentials are required. It covers authentication configuration, stable read-tool routing, write denial, input validation and approved contact/draft-invoice routing.

Run:

```bash
npm test
```

## Limitations

- This connector does not itself perform interactive OAuth authorization or refresh-token persistence; supply Custom Connection credentials or a bearer token from a trusted auth component.
- It depends on Xero's official local MCP server being available through npm/npx.
- Read tools intentionally expose the official upstream tool's default result shape rather than creating a second Xero data model.
- Pagination/filter controls are not exposed yet because this wrapper deliberately avoids guessing or widening upstream command contracts beyond the official MCP schemas researched for this version.
- No payment creation, posting/approval, delete, payroll mutation, bank-transaction mutation, attachment upload or webhook receiver is implemented.

## Compatibility

The server speaks standard STDIO MCP using the Model Context Protocol SDK. It can be used by MCP clients that support launching local STDIO servers. Client-specific setup varies, so consult the MCP client's documentation rather than assuming a particular product configuration.
