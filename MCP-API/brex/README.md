# Brex MCP Connector

Reusable MCP server for scoped Brex finance/team read workflows.

## Upstream strategy

Brex launched an official MCP server (Beta) in April 2026 with OAuth and API-key authentication for natural-language access to expenses, users, cards, and related data. This package intentionally uses Brex's official REST API (`https://api.brex.com`) for its implemented operations because the REST contracts, scopes, pagination, tracing, and rate-limit behavior are explicitly documented and allow deterministic least-privilege wrapping. No unofficial MCP server or SDK is required.

Official sources researched:
- https://developer.brex.com/
- https://developer.brex.com/guides/authentication
- https://developer.brex.com/guides/roles_permissions_scopes
- https://developer.brex.com/guides/rate_limits
- https://developer.brex.com/guides/pagination
- https://developer.brex.com/guides/idempotency
- https://developer.brex.com/guides/webhooks
- https://developer.brex.com/changelog

## Capabilities

The connector exposes 15 MCP tools: users list/get, cards list/get, departments list, locations list, legal entities list/get, titles list, primary card account get, cash accounts list, primary card transactions list, cash transactions list, vendors list/get.

All implemented tools are `READ`. Sensitive write operations such as card creation, user changes, vendor mutation, transfers, billing, and destructive actions are intentionally not exposed. The policy layer rejects destructive operations and is ready to require approval if future write/high-risk tools are added.

## Authentication and scopes

Set `BREX_ACCESS_TOKEN` to a Brex user token or OAuth-derived bearer token. Credentials stay inside the connector process and are never returned through MCP. Request only scopes needed by the tools you enable:

`users.readonly`, `cards.readonly`, `departments.readonly`, `locations.readonly`, `legal_entities.readonly`, `titles.readonly`, `accounts.card.readonly`, `accounts.cash.readonly`, `transactions.card.readonly`, `transactions.cash.readonly`, `vendors.readonly`.

Brex user tokens are bearer tokens. Brex documents that unused user tokens expire after 90 days and tokens associated with inactive users stop working.

## Install and run

```bash
npm install
cp .env.example .env
# export variables from your secret manager or shell; do not commit .env
npm run build
npm start
```

Runtime: Node.js 20+; transport: MCP stdio.

## Configuration

- `BREX_ACCESS_TOKEN` required.
- `BREX_API_BASE_URL` defaults to `https://api.brex.com` and must use HTTPS.
- `BREX_TIMEOUT_MS` defaults to 10000.
- `BREX_MAX_RETRIES` defaults to 2 and is capped at 5.
- `BREX_DEFAULT_PAGE_SIZE` defaults to 100.

## Reliability

List calls return one provider page at a time and preserve `next_cursor`; callers explicitly choose whether to continue, preventing unbounded API consumption. Requests use cancellation timeouts. Network failures, HTTP 429, and 5xx responses receive bounded exponential-backoff retries. Authentication, validation, and permission failures are not retried. `Retry-After` is honored for throttling, capped at 30 seconds. `X-Brex-Trace-Id` is preserved in `BrexApiError` for support/debugging.

Brex documents a general limit of up to 1,000 requests per 60 seconds per Client ID and Brex account, with separate operational limits for transfers, international wires, and card creation. This connector does not implement those write operations.

## Security

Inputs are strict Zod schemas; there is no arbitrary URL/request tool. Resource IDs are URL-encoded. The base URL must be HTTPS. Card PAN retrieval is not implemented and `cards.pan` is not requested. Provider output is wrapped with `untrusted_provider_content: true`; remote content must be treated as data, never as policy or instructions. Tokens are never logged or included in errors/output.

## Errors

Non-success responses throw `BrexApiError` with status, optional Brex trace ID, and optional retry-after metadata. Invalid local configuration fails before server startup. Timeouts raise a clear timeout error.

## Testing

```bash
npm test
npm run build
```

Tests use mocked `fetch`; no live Brex credentials are required. Coverage includes authentication configuration, HTTPS enforcement, bearer authorization, pagination, query construction, API error mapping, trace IDs, tool registration metadata, and policy/approval boundaries.

## Limitations

This connector is intentionally read-only. It does not proxy Brex's beta MCP server, expose arbitrary Brex endpoints, retrieve card PANs, create cards/transfers/vendors, or register webhook subscriptions. Brex API availability and individual scopes depend on the Brex account and administrator-granted access.
