# Mollie MCP/API Connector

Reusable MCP server for Mollie payment operations with strict schemas, credential isolation, approval gates, bounded retries, rate-limit handling, and deterministic REST routing.

## Provider and transport

Mollie provides an official remote MCP server at `https://mcp.mollie.com/mcp`. Mollie's documentation states that the MCP server currently proxies Balances, Captures, Customers, Invoices, Mandates, Methods, Payments, Payment Links, Settlements, Subscriptions, Terminals, Webhooks, and Webhook Events APIs. It requires an Advanced access token and `profile.read`, plus resource-specific scopes.

This connector deliberately exposes its own stable MCP contract and calls Mollie's official REST API at `https://api.mollie.com/v2`. REST is used because the connector requires deterministic schemas and local approval enforcement, and because Refunds API is not currently listed among the official MCP server's supported APIs. No unofficial upstream MCP server is used.

Official references:

- MCP server: https://docs.mollie.com/docs/mollie-mcp-server
- API overview: https://docs.mollie.com/reference/overview
- Authentication/OAuth: https://docs.mollie.com/reference/oauth-api
- Permissions: https://docs.mollie.com/reference/permissions-api
- Payments: https://docs.mollie.com/reference/payments-api
- Payment Links: https://docs.mollie.com/reference/payment-links-api
- Customers: https://docs.mollie.com/reference/customers-api
- Refunds: https://docs.mollie.com/reference/refunds-api
- Rate limiting: https://docs.mollie.com/gu/reference/rate-limiting

## Architecture

```text
MCP client
  -> local Mollie MCP server
      -> strict Zod validation
      -> risk/approval policy
      -> credential provider
      -> Mollie REST client
          -> https://api.mollie.com/v2
```

Credentials are read only inside the connector authentication layer and are never returned in tool output. Provider content is marked `untrusted_provider_data` so callers do not treat external content as instructions.

## Authentication

Set `MOLLIE_ACCESS_TOKEN` to either a Mollie API key suitable for the target profile or an Advanced access token. For Advanced access tokens, grant only the scopes needed for enabled operations.

Implemented scope requirements:

| Capability | Scope |
|---|---|
| Read payments | `payments.read` |
| Create payments | `payments.write` |
| Read payment links | `payment-links.read` |
| Create payment links | `payment-links.write` |
| Read customers | `customers.read` |
| Create customers | `customers.write` |
| Read refunds | `refunds.read` |
| Create refunds | `refunds.write` |

When using Mollie's official MCP server separately, Mollie also requires `profile.read` for its tools.

## Environment variables

```text
MOLLIE_ACCESS_TOKEN=
MOLLIE_API_BASE_URL=https://api.mollie.com/v2
MOLLIE_TIMEOUT_MS=15000
MOLLIE_MAX_RETRIES=3
MOLLIE_WRITE_POLICY=require
MOLLIE_DESTRUCTIVE_POLICY=deny
```

`MOLLIE_API_BASE_URL` must be HTTPS and may not contain embedded credentials. The default should normally be retained.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
MOLLIE_ACCESS_TOKEN=... npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers.

Example client configuration:

```json
{
  "mcpServers": {
    "mollie": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/mollie/dist/src/index.js"],
      "env": {
        "MOLLIE_ACCESS_TOKEN": "your-token-from-a-secure-secret-store"
      }
    }
  }
}
```

Do not place secrets in prompts, source control, examples, or agent-visible context.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `mollie.payment.list` | REST | READ | none |
| `mollie.payment.get` | REST | READ | none |
| `mollie.payment.create` | REST | HIGH_RISK | explicit `approval=true` |
| `mollie.payment_link.list` | REST | READ | none |
| `mollie.payment_link.get` | REST | READ | none |
| `mollie.payment_link.create` | REST | WRITE | policy controlled; default explicit |
| `mollie.customer.list` | REST | READ | none |
| `mollie.customer.get` | REST | READ | none |
| `mollie.customer.create` | REST | WRITE | policy controlled; default explicit |
| `mollie.refund.list` | REST fallback | READ | none |
| `mollie.refund.get` | REST fallback | READ | none |
| `mollie.refund.create` | REST fallback | HIGH_RISK | explicit `approval=true` |

The connector intentionally does not expose arbitrary HTTP requests or generic endpoint execution.

## Permission model

`READ` tools may run automatically. `WRITE` tools use `MOLLIE_WRITE_POLICY`, which accepts `auto`, `require`, or `deny` and defaults to `require`. `HIGH_RISK` operations always require explicit approval regardless of the write policy. `DESTRUCTIVE` operations are not implemented and the destructive policy defaults to `deny`.

Creating a payment and creating a refund are treated as high-risk because they affect financial workflows. The connector does not implement refund cancellation, mandate revocation, subscription cancellation, or other destructive operations in this package.

## Validation

Inputs are validated before provider calls. Examples include Mollie resource ID prefixes, three-letter uppercase currency codes, decimal monetary values with exactly two fractional digits, URL syntax, maximum description lengths, bounded pagination (`1..250`), and strict objects that reject unknown properties.

## Reliability and rate limits

Mollie rate limits are dynamic per merchant and can vary between read and write operations. Mollie may return `429 Too Many Requests` and provides `Retry-After` and rate-limit headers.

The connector:

- retries only idempotent `GET` requests;
- handles `429` and transient `5xx` responses with bounded exponential backoff;
- honors `Retry-After` when supplied;
- never blindly retries payment creation, payment-link creation, customer creation, or refunds;
- applies request timeouts;
- surfaces provider errors without leaking credentials;
- supports provider pagination through `from` and bounded `limit` parameters.

Authentication and authorization errors are not retried.

## Error behavior

Provider failures are returned as MCP tool errors. Validation and approval failures occur before the network request. Timeout errors identify the configured timeout duration. Mollie HTTP errors preserve status internally and use Mollie's `detail` or `title` message where available.

## Security considerations

- Credentials remain inside the connector and are transmitted only as the Mollie `Authorization: Bearer` header.
- Base URL validation requires HTTPS and rejects embedded usernames/passwords.
- Resource identifiers are validated and URI-encoded before interpolation.
- No arbitrary URL-fetch or provider-request tool is exposed, limiting SSRF and privilege escalation surfaces.
- Provider responses are untrusted data. They must not alter policy, permissions, tool configuration, or system instructions.
- High-risk financial actions require explicit human approval.
- Write retries are disabled to avoid duplicate monetary actions.
- Use test credentials while developing and least-privilege live credentials in production.
- Secret logging should remain disabled in the host environment.

## Testing

Unit tests use mocks/fakes and do not require live Mollie credentials.

```bash
npm test
npm run build
```

Coverage includes authentication configuration, header-injection rejection, approval enforcement, destructive-policy denial, provider error mapping, throttled read retry, prevention of write retries, tool registration, and input validation.

## Real-world workflows

Common flows include reading a payment during customer support, generating an approved payment link for an invoice, creating an approved checkout payment, listing historical refunds, and issuing an explicitly approved partial refund. See `examples/workflows.md`.

## Limitations

This package implements a focused subset of Mollie's platform rather than every endpoint. It does not currently wrap balances, captures, invoices, mandates, methods, settlements, subscriptions, terminals, or webhook-management APIs. Those are supported upstream by Mollie's official MCP server and can be added later only with explicit stable contracts and appropriate safety boundaries.

OAuth authorization-code acquisition and refresh-token persistence are intentionally not embedded in this stdio package; deployments should provision a valid API key or Advanced access token through a secure credential provider. The connector does not claim support for any operation not represented in the tool table above.
