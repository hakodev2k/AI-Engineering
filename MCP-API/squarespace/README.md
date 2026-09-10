# Squarespace MCP/API Connector

Reusable MCP connector for Squarespace Commerce workflows. It exposes a stable, provider-scoped stdio MCP interface for order investigation, transaction lookup, inventory inspection/adjustment, product reads/updates, and contact reads/updates while keeping Squarespace credentials inside the connector process.

## Transport strategy

No official Squarespace-operated MCP server was identified in the current Squarespace Developer Platform documentation during this run. The connector therefore uses Squarespace's official Commerce REST APIs directly and presents them as narrow MCP tools.

Official sources researched on 2026-09-10:

- Developer platform: https://developers.squarespace.com/
- Authentication and permissions: https://developers.squarespace.com/commerce-apis/authentication-and-permissions
- OAuth 2.0: https://developers.squarespace.com/commerce-apis/oauth
- Rate limits: https://developers.squarespace.com/commerce-apis/rate-limits
- Request requirements: https://developers.squarespace.com/commerce-apis/making-requests
- Idempotency keys: https://developers.squarespace.com/commerce-apis/idempotency-key
- Orders API: https://developers.squarespace.com/commerce-apis/orders
- Inventory API: https://developers.squarespace.com/commerce-apis/inventory
- Products API v2: https://developers.squarespace.com/commerce-apis/products
- Contacts API: https://developers.squarespace.com/commerce-apis/contacts
- Transactions API: https://developers.squarespace.com/commerce-apis/transactions
- API changelog: https://developers.squarespace.com/commerce-apis/changelog

Squarespace's December 18, 2025 release made Products API v2 generally available. The v2 endpoints are used here for new product integrations. The Contacts API became available in April 2026 and is the modern replacement for the maintenance-mode Profiles API, so this connector uses Contacts rather than Profiles.

## Architecture

```text
MCP client / AI agent
        |
        v
Squarespace connector (stdio MCP)
  - stable provider-scoped tools
  - strict validation
  - permission/risk policy
  - exact-payload approval verification
  - timeout + bounded read retries
        |
        v
Credential-isolated REST client
        |
        v
https://api.squarespace.com
```

Provider-returned order/customer/product/transaction content is marked `untrustedProviderData: true`. Retrieved text is data and must never be interpreted as instructions that can alter connector permissions, approval policy, or system behavior.

## Authentication

Squarespace Commerce APIs accept either an API key or an OAuth access token in the `Authorization: Bearer ...` header. Configure exactly one:

```text
SQUARESPACE_API_KEY=
```

or:

```text
SQUARESPACE_ACCESS_TOKEN=
```

The raw credential is never accepted as an MCP tool argument and is never included in tool output.

### Least privilege

Squarespace permissions are granted per website. Use the smallest permission set matching enabled tools.

Relevant API-key permission families include:

- Orders: Read Only for reads; Read and Write for fulfillment/order mutation.
- Inventory: Read Only for stock inspection; Read and Write for stock adjustment.
- Products: Read Only for product inspection; Read and Write for product mutation.
- Contacts: `CONTACT_READONLY` for reads or `CONTACT` for mutation.
- Transactions: Read Only.

For OAuth, use the corresponding website-scoped permissions. Current Contacts documentation names `website.contacts.read` and `website.contacts`; current authentication documentation also distinguishes read-only and read/write permission levels for Orders, Inventory, Products, Contacts, and Transactions.

This package does not implement browser authorization-code exchange or refresh-token storage. Multi-tenant applications should obtain/refresh OAuth tokens in a trusted credential broker and inject the current access token into this connector. Interactive OAuth credentials and refresh tokens must remain outside the LLM context.

## Environment variables

Copy `.env.example` into your secret-management workflow.

- `SQUARESPACE_API_KEY` — API key; mutually exclusive with access token.
- `SQUARESPACE_ACCESS_TOKEN` — current OAuth access token; mutually exclusive with API key.
- `SQUARESPACE_API_BASE_URL` — defaults to and is restricted to `https://api.squarespace.com`.
- `SQUARESPACE_USER_AGENT` — required provider-identifying User-Agent value; default `ReusableSquarespaceMCP/1.0`.
- `SQUARESPACE_TIMEOUT_MS` — per-attempt timeout, 1,000–120,000 ms; default 15,000.
- `SQUARESPACE_MAX_RETRIES` — maximum additional read retries, 0–5; default 2.
- `SQUARESPACE_REQUIRE_WRITE_APPROVAL` — defaults to `true` for ordinary WRITE tools.
- `SQUARESPACE_ENABLE_HIGH_RISK` — defaults to `false`.
- `SQUARESPACE_APPROVAL_SECRET` — operator-held HMAC secret, at least 16 characters.

Never commit populated credentials or approval secrets.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
npm test
```

## Running the MCP server

```bash
npm start
```

The connector uses standard MCP stdio transport. MCP clients that support launching a local stdio server can run `node dist/src/server.js` with environment variables supplied through the host's secure secret/configuration mechanism.

A generic configuration shape is:

```json
{
  "mcpServers": {
    "squarespace": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/squarespace/dist/src/server.js"],
      "env": {
        "SQUARESPACE_API_KEY": "<injected-by-secret-store>",
        "SQUARESPACE_ENABLE_HIGH_RISK": "false"
      }
    }
  }
}
```

Product-specific compatibility depends on each client's stdio MCP support; the connector does not rely on proprietary client extensions.

## Implemented capabilities

| MCP tool | Provider endpoint | Risk | Approval |
|---|---|---:|---|
| `squarespace.order.list` | `GET /1.0/commerce/orders` | READ | No |
| `squarespace.order.get` | `GET /1.0/commerce/orders/{id}` | READ | No |
| `squarespace.order.fulfill` | `POST /1.0/commerce/orders/{id}/fulfillments` | HIGH_RISK | Always + feature gate |
| `squarespace.transaction.list` | `GET /1.0/commerce/transactions` | READ | No |
| `squarespace.transaction.get` | `GET /1.0/commerce/transactions/{documentIds}` | READ | No |
| `squarespace.inventory.list` | `GET /1.0/commerce/inventory` | READ | No |
| `squarespace.inventory.adjust` | `POST /1.0/commerce/inventory/adjustments` | HIGH_RISK | Always + feature gate |
| `squarespace.product.list` | `GET /v2/commerce/products` | READ | No |
| `squarespace.product.get` | `GET /v2/commerce/products/{productIds}` | READ | No |
| `squarespace.product.update` | `POST /v2/commerce/products/{productId}` | WRITE | Required by default |
| `squarespace.contact.list` | `GET /v1/contacts` | READ | No |
| `squarespace.contact.get` | `GET /v1/contacts/{contactId}` | READ | No |
| `squarespace.contact.query` | `POST /v1/contacts/query` | READ | No |
| `squarespace.contact.update` | `PATCH /v1/contacts/{contactId}` | WRITE | Required by default |

The connector intentionally omits arbitrary REST execution, site billing, credential management, contact deletion, product deletion, order creation/import, discount mutation, webhook management, and other broad account/admin operations.

## Permission and approval model

READ tools can execute automatically after local validation and provider authorization.

WRITE tools require connector approval by default. Set `SQUARESPACE_REQUIRE_WRITE_APPROVAL=false` only when an equivalent trusted approval boundary exists outside this connector.

HIGH_RISK tools require both:

1. `SQUARESPACE_ENABLE_HIGH_RISK=true`, configured outside the model.
2. A valid `approvalToken` bound to the exact tool name and exact payload.

Approval tokens are HMAC-SHA256 digests:

```text
HMAC-SHA256(
  SQUARESPACE_APPROVAL_SECRET,
  "<tool-name>\n<canonical JSON payload without approvalToken>"
)
```

Any change to the target order, product, contact, inventory item, stock quantity, notification behavior, or other approved argument invalidates the token. The approval secret must be held by a trusted human-facing UI/service or operator process and must not be exposed to the model.

`order.fulfill` is HIGH_RISK because it changes order state and can optionally send an external customer notification. `inventory.adjust` is HIGH_RISK because it can materially change available-to-sell quantities. Product/contact mutation is WRITE.

No DESTRUCTIVE capability is exposed in this version.

## Validation

Tool schemas are intentionally bounded:

- provider identifiers use conservative character and length limits;
- order payment/fulfillment values use documented enums;
- date filters require offset-aware ISO 8601 timestamps;
- transaction/product multi-get calls accept at most 50 IDs;
- contact result pages are capped locally at 100 entries despite provider support for larger pages;
- inventory adjustment batches are capped at 100 entries per operation class;
- stock quantities are integer-bounded;
- idempotency keys are limited to Squarespace's documented 64-character alphanumeric/dash/underscore form;
- shipment URLs must parse as URLs;
- no tool accepts a provider URL, API token, or arbitrary HTTP path.

## Rate limits and reliability

Squarespace currently documents a general Commerce API rate limit of 300 requests per minute, equivalent to five requests per second. Requests beyond the limit return HTTP 429 with a one-minute cooldown. Create Order has a separate 100-requests-per-hour limit when authenticated with an API key, but this connector does not expose order creation.

The connector applies bounded retries only to retry-safe reads. HTTP 429, 502, 503, and 504 plus transient network/timeouts can be retried up to `SQUARESPACE_MAX_RETRIES`; `Retry-After` is honored with a bounded wait when present. Authentication, permission, validation, and ordinary 4xx failures are not treated as transient.

State-changing POST/PATCH calls are never blindly retried. Inventory adjustment requires Squarespace's `Idempotency-Key` header; callers should keep the same key for a logically identical retry. Squarespace documents successful idempotency keys as effective for at least 48 hours.

`contact.query` is a POST but semantically read-only, so it is explicitly marked retryable. Mutating POST/PATCH operations remain single-attempt.

## Pagination

Orders, transactions, inventory, products, and contacts expose provider cursor pagination. This connector returns provider pagination metadata rather than automatically crawling all pages. Agents should deliberately pass `nextPageCursor` into a subsequent tool call.

This prevents hidden fan-out, limits data exposure, and avoids unnecessary provider requests.

## Error handling

Non-success responses become `SquarespaceError` values containing a sanitized connector message, HTTP status, optional `Retry-After`, and provider error body. Credentials are never appended to error text.

Typical handling:

- `401/403`: authentication or permission problem; operator action required; no blind retry.
- `402`: website billing/expiration state can prevent API access; operator action required.
- `409`: provider conflict such as state/idempotency conflict; inspect before retrying.
- `429`: throttled; bounded safe-read retry may honor `Retry-After`.
- `5xx`: bounded safe-read retry only.
- timeout/network failure: bounded safe-read retry; mutations fail without replay.

## Security considerations

- Credentials remain in the connector transport layer and never enter MCP arguments/results.
- API origin is pinned to the official Squarespace host to reduce SSRF and credential exfiltration risk.
- No generic `execute_request`, arbitrary REST path, or arbitrary URL tool exists.
- Order/customer/contact/transaction/product text is untrusted provider content.
- Customer data can contain personal information; request only required records and protect downstream logs/storage.
- Marketing preference changes are WRITE operations and require approval by default.
- Customer shipment notification is high risk and must be explicitly approved.
- Inventory changes are high risk, idempotency-protected, and never blindly replayed by the connector.
- Provider-side website permissions remain authoritative; connector policy never increases token permissions.
- Avoid logging authorization headers, complete customer objects, or HMAC secrets.

## MCP security

Because no first-party Squarespace MCP server was identified, this package does not dynamically discover or trust upstream MCP tools. The external MCP surface is static and defined locally. If Squarespace later launches an official MCP server, adoption should require exact tool allowlisting, schema validation, credential isolation, least privilege, and fail-closed handling of newly discovered capabilities.

## Testing

Normal unit tests require no Squarespace credentials:

```bash
npm test
```

The suite covers:

- authentication configuration;
- official-host enforcement;
- tool/policy registration consistency;
- credential injection only in the REST transport;
- high-risk default denial;
- exact-payload approval verification;
- approval invalidation after payload mutation;
- non-retry of writes;
- bounded 429 retry for reads;
- denial before provider execution when high-risk tools are disabled.

## Usage examples

See `examples/workflows.md` for order triage, inventory correction, product update, contact lookup/update, and order fulfillment examples. All identifiers and secrets are placeholders.

## Limitations

- No official Squarespace MCP transport is assumed; all implemented provider capabilities use REST.
- Browser OAuth authorization, refresh-token storage, and token rotation are external credential-provider responsibilities.
- The connector intentionally implements 14 high-value commerce operations rather than the complete Squarespace API surface.
- Order creation/import is omitted because it creates financially relevant commerce records and has a distinct API-key rate limit.
- Webhook subscriptions are omitted because Squarespace requires OAuth for the Webhook Subscriptions API and safe reusable webhook management also needs callback destination/receiver verification design.
- Product mutation is intentionally limited to name, description, and visibility; variant pricing/attributes and product creation/deletion should be separately reviewed.
- Contact deletion and address-book mutation are omitted.
- Discounts, analytics, Website API, Forms API, image upload, and product-variant mutation are not exposed in this version.
- Provider API versions, permission names, and limits can evolve; revalidate official documentation before expanding capabilities.
