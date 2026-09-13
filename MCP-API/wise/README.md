# Wise MCP Connector

Reusable MCP server for controlled Wise Platform workflows using Wise's official REST API.

## Upstream strategy

No official Wise MCP server was identified in Wise's official developer documentation during this implementation. The connector therefore uses the official Wise Platform REST API directly and exposes a stable MCP interface. API version defaults to `2026Q3` and is configurable with `WISE_API_VERSION` so callers do not depend on raw REST paths.

Official references researched:

- https://docs.wise.com/guides/developer
- https://docs.wise.com/guides/developer/auth-and-security/personal-api-token
- https://docs.wise.com/api-reference/quote
- https://docs.wise.com/guides/product/send-money/recipients
- https://docs.wise.com/api-reference/transfer
- https://docs.wise.com/guides/product/accounts/balance-accounts
- https://docs.wise.com/guides/developer/errors

## Capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `wise.quote.create` | `POST /profiles/{profileId}/quotes` | WRITE | configurable, on by default |
| `wise.quote.get` | `GET /profiles/{profileId}/quotes/{quoteId}` | READ | no |
| `wise.recipient.list` | `GET /accounts` | READ | no |
| `wise.recipient.requirements` | `GET /quotes/{quoteId}/account-requirements` | READ | no |
| `wise.transfer.create` | transfer creation API | HIGH_RISK | explicit |
| `wise.transfer.get` | `GET /transfers/{transferId}` | READ | no |
| `wise.transfer.cancel` | `PUT /transfers/{transferId}/cancel` | DESTRUCTIVE | disabled by default + explicit |
| `wise.transfer.fund_from_balance` | `POST /profiles/{profileId}/transfers/{transferId}/payments` | HIGH_RISK | explicit |
| `wise.balance.list` | `GET /profiles/{profileId}/balances` | READ | no |
| `wise.balance.get` | `GET /profiles/{profileId}/balances/{balanceId}` | READ | no |
| `wise.balance.statement` | JSON statement endpoint | READ | no |
| `wise.account_details.list` | account-details endpoint | READ | no |

Recipient creation is deliberately not exposed because recipient field requirements are corridor- and regulation-dependent. Agents can retrieve current dynamic requirements, but applications should collect and validate beneficiary banking data in a dedicated trusted UI before adding broader write support.

## Authentication and permissions

Set `WISE_API_TOKEN` to a Wise-issued bearer token. For direct Wise Business automation, Wise documents Personal API Tokens; partner integrations can use the applicable Wise OAuth/UserToken model. Tokens remain inside the connector and are never included in MCP responses. Use the least-privileged credential permitted for the operations you enable.

Personal API tokens have product/region limitations. In particular, Wise documents that advanced balance-statement/funding access is not universally available for personal-token integrations; endpoint access depends on account/region and agreement. A 401/403 is surfaced without retries so the operator can correct authorization rather than have an agent escalate permissions.

Environment:

```text
WISE_API_TOKEN=
WISE_API_VERSION=2026Q3
WISE_TIMEOUT_MS=10000
WISE_MAX_RETRIES=2
WISE_REQUIRE_WRITE_APPROVAL=true
WISE_ALLOW_DESTRUCTIVE=false
```

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio child processes. Client-specific configuration varies; point the client at `node dist/src/server.js` with the environment variables supplied through its secret/configuration mechanism.

## Permission and approval model

`READ` operations execute automatically. `WRITE` operations require `approval: "approved"` by default. `HIGH_RISK` operations require `approval: "approved-high-risk"`. `DESTRUCTIVE` operations are rejected unless `WISE_ALLOW_DESTRUCTIVE=true` and the high-risk approval token is supplied.

Creating a transfer is HIGH_RISK even though it does not fund the transfer, because it prepares an external financial transaction. Funding a transfer moves money and always requires explicit high-risk approval. Cancellation is DESTRUCTIVE because it changes transaction state and can be irreversible once accepted.

The connector never accepts arbitrary URLs or raw API requests, preventing agent-driven SSRF and scope expansion.

## Reliability and rate limits

Requests have bounded timeouts and at most five configured retries. Only throttling (`429`) and server/network failures are retried; authentication, permission, validation and other client failures are returned immediately. `Retry-After` is honored when present and exponential backoff is used otherwise.

Wise currently documents gateway limits such as 100 requests/second and 1000 requests/minute for partner accounts, while limits for personal-token business accounts vary by client/platform. Service-specific limits may also apply. Do not treat those figures as a throughput target.

Transfer creation uses caller-provided `customerTransactionId` UUID for Wise idempotency. The connector does not blindly retry financial write operations at the tool layer. Balance statement intervals are limited to Wise's documented maximum of 469 days.

## Error model

Provider HTTP errors are normalized into `WiseError` with HTTP status, provider code/message, and `retryAfter` when supplied. `401`/`403` are never retried. `429` is retried within the configured bound. Wise `409` business conflicts (for example a transfer that cannot be cancelled) surface to the caller without retry.

## Security

- Treat all Wise response content as untrusted data; MCP results are tagged `untrusted_provider_content: true`.
- Credentials are read only by the connector configuration/client layer and are not emitted in logs or tool output.
- Strict Zod schemas reject unknown fields, malformed currencies/UUIDs, invalid IDs and ambiguous quote amounts.
- No unrestricted HTTP-proxy tool exists.
- Destructive operations are disabled by default.
- High-risk financial execution always requires explicit human approval.
- Do not place bank-account details or tokens in prompts. Use trusted collection/storage paths in the surrounding application.
- Balance statements may be SCA-protected depending on account region; the connector fails safely when additional authentication is required.

## Testing

`npm test` runs without live Wise credentials. Tests cover missing authentication configuration, tool inventory, validation, read routing, permission denial, high-risk approval, destructive-default denial, bounded rate-limit retry behavior, authentication failure behavior, and statement date limits. HTTP is mocked using injected `fetch` implementations.

## Limitations

This connector intentionally does not create recipients, create/close balances, perform balance conversion, configure webhooks, modify security settings, or manage billing. These can be added only after matching current Wise API requirements and extending the approval/permission model. Actual endpoint availability depends on Wise account type, region, token type, KYC/SCA state, and commercial agreement.
