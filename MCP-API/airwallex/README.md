# Airwallex MCP Connector

Reusable MCP server exposing a focused, safety-gated subset of Airwallex financial operations through Airwallex's official REST API.

## Transport strategy

Airwallex currently provides official Developer MCP and Docs MCP connectors for integration development. The Developer MCP is sandbox-focused and the Docs MCP is documentation-only. This connector therefore uses the official REST API for operational capabilities so the same external MCP tool contract can work against sandbox or production. It does not proxy arbitrary API requests.

Official references:
- Airwallex Developer MCP / Docs MCP: https://www.airwallex.com/docs/developer-tools/ai/developer-mcp
- API overview: https://www.airwallex.com/docs/developer-tools/api
- Authentication: https://www.airwallex.com/docs/api/authentication/api_access_token
- API key scopes: https://www.airwallex.com/docs/developer-tools/api/api-key-scopes
- Rate limits: https://www.airwallex.com/docs/developer-tools/api/rate-limits
- Balances: https://www.airwallex.com/docs/api/2024-08-07/core_resources/balances
- Beneficiaries: https://www.airwallex.com/docs/api/2025-02-14/payouts/beneficiaries
- Transfers: https://www.airwallex.com/docs/api/payouts/transfers
- Webhooks: https://www.airwallex.com/docs/api/webhooks/webhooks

## Capabilities

Implemented tools:

| Tool | Risk | Upstream |
|---|---|---|
| `airwallex.balance.current` | READ | REST |
| `airwallex.balance.history` | READ | REST |
| `airwallex.beneficiary.list` | READ | REST |
| `airwallex.beneficiary.get` | READ | REST |
| `airwallex.beneficiary.validate` | READ | REST |
| `airwallex.beneficiary.create` | HIGH_RISK | REST |
| `airwallex.beneficiary.update` | HIGH_RISK | REST |
| `airwallex.transfer.list` | READ | REST |
| `airwallex.transfer.get` | READ | REST |
| `airwallex.transfer.validate` | READ | REST |
| `airwallex.transfer.create` | HIGH_RISK | REST |
| `airwallex.transfer.cancel` | DESTRUCTIVE | REST |
| `airwallex.webhook.list` | READ | REST |

The beneficiary and transfer APIs use dynamic schemas. The MCP schemas validate stable safety-critical fields while allowing Airwallex's documented scenario-specific fields to pass through. Call the validation tools before create operations.

## Architecture

`src/config.ts` validates runtime configuration. `src/client.ts` performs authentication, access-token caching, timeouts, bounded retries, rate-limit handling, API versioning, and error mapping. `src/policy.ts` enforces operator-controlled risk gates. `src/tools.ts` defines and registers scoped MCP tools. `src/server.ts` exposes them over MCP stdio.

Provider responses are treated as untrusted data and serialized as tool output only. They cannot modify connector permissions or configuration.

## Authentication

Airwallex uses Client ID + API key to obtain an access token from `POST /api/v1/authentication/login`. The connector keeps those credentials inside the connector process, caches the bearer token, and never returns raw credentials to the MCP caller. Access tokens are reused until close to expiry.

Use scoped API keys instead of unrestricted admin keys. Airwallex documents resource scopes such as `balance:read` and separate read/write scopes for payout resources. Grant only the scopes required for tools you enable.

Environment variables:

```text
AIRWALLEX_CLIENT_ID=
AIRWALLEX_API_KEY=
AIRWALLEX_ENV=sandbox
AIRWALLEX_LOGIN_AS=
AIRWALLEX_API_VERSION=2025-08-29
AIRWALLEX_TIMEOUT_MS=10000
AIRWALLEX_MAX_RETRIES=2
AIRWALLEX_WRITE_MODE=deny
AIRWALLEX_HIGH_RISK_MODE=deny
```

`AIRWALLEX_LOGIN_AS` is optional and is sent only when obtaining a token for a permitted target account. Sandbox and production credentials are separate.

## Permission and approval model

READ tools run automatically after authentication. WRITE tools are controlled by `AIRWALLEX_WRITE_MODE`. HIGH_RISK and DESTRUCTIVE tools are controlled by `AIRWALLEX_HIGH_RISK_MODE` and default to denied. These gates are process configuration and cannot be elevated by MCP tool arguments, so retrieved content or an agent cannot silently grant itself additional authority.

Creating or editing a beneficiary and creating a transfer are classified HIGH_RISK because they can alter payout destinations or move money. Transfer cancellation is DESTRUCTIVE. Production use should additionally place the MCP server behind the host application's human-approval workflow.

## Reliability and rate limiting

The client uses AbortController timeouts and bounded exponential backoff. GET requests and validation calls may retry on 429 and transient 5xx errors. Mutation operations such as creating a beneficiary, creating a transfer, updating a beneficiary, and canceling a transfer are not blindly retried, preventing duplicate financial actions.

Airwallex documents global production limits of 100 requests/second and 50 concurrent requests, with lower sandbox limits, while specific endpoints/resources may have tighter limits. Authentication is separately limited and access tokens should be reused. The connector honors `Retry-After` when present.

## Security

- No credentials in tool schemas, prompts, outputs, examples, or logs.
- Scoped keys and least privilege are recommended.
- Sandbox is the default environment.
- Write and high-risk execution is denied by default.
- No arbitrary URL or arbitrary endpoint tool is exposed, preventing SSRF-style endpoint abuse.
- IDs are path-encoded and query parameters are generated with `URLSearchParams`.
- Provider content is untrusted data and cannot change policy.
- Network calls are HTTPS-only because base URLs are fixed in configuration.
- Non-idempotent financial operations are not automatically retried.
- Account data may require additional SCA in connected-account contexts; the connector does not fabricate or bypass SCA tokens.

## Installation

```bash
npm install
npm run build
```

Copy `.env.example` to your secret-managed runtime environment and supply sandbox credentials first.

Run:

```bash
npm start
```

The server uses MCP stdio and can be launched by MCP clients that support local stdio servers, including compatible desktop/coding-agent clients. Custom agents can spawn the process using the normal MCP stdio protocol.

## Example MCP client configuration

```json
{
  "mcpServers": {
    "airwallex": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/airwallex/dist/src/server.js"],
      "env": {
        "AIRWALLEX_CLIENT_ID": "${AIRWALLEX_CLIENT_ID}",
        "AIRWALLEX_API_KEY": "${AIRWALLEX_API_KEY}",
        "AIRWALLEX_ENV": "sandbox"
      }
    }
  }
}
```

## Testing

```bash
npm test
npm run build
```

Unit tests use mocked fetch responses and require no live Airwallex credentials. They cover configuration validation, default-deny policy, tool uniqueness, authentication-token reuse, and prevention of blind retry for non-idempotent writes.

## Limitations

This package intentionally omits card issuing, payment acceptance, billing, FX execution, permission administration, and arbitrary endpoint access. It does not bypass provider-side SCA or account permissions. Dynamic payout fields vary by destination, currency, transfer method, and API version; use Airwallex validation endpoints and current official schemas before executing high-risk operations.
