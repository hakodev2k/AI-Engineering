# Shopify MCP/API Connector

Reusable MCP server for scoped Shopify merchant-administration workflows. It exposes predictable MCP tools over Shopify's official GraphQL Admin API while keeping shop credentials inside the connector process.

## Transport strategy

Shopify currently has multiple official MCP surfaces, but they serve different purposes:

- Shopify Dev MCP (`npx -y @shopify/dev-mcp@latest`) is a local, authentication-free developer assistant for Shopify documentation, API schema exploration, validation, and code-generation workflows.
- Storefront MCP (`https://{shop}.myshopify.com/api/mcp`) is shopper-facing and exposes storefront commerce capabilities such as catalog search, cart operations, and policy questions.
- Merchant administration in this connector uses the official GraphQL Admin API because neither official MCP surface is the right authorization or capability boundary for products, orders, inventory, locations, and app webhook administration.

The connector does not proxy arbitrary upstream MCP tools and does not expose arbitrary GraphQL execution. That prevents tool discovery or a model-supplied query from silently expanding permissions.

Official sources researched:

- Shopify Dev MCP: https://shopify.dev/docs/apps/build/ai-toolkit
- Shopify Dev MCP / Polaris setup: https://shopify.dev/docs/api/polaris/using-mcp
- Storefront MCP overview: https://shopify.dev/docs/apps/build/storefront-mcp
- Storefront MCP server: https://shopify.dev/docs/apps/build/storefront-mcp/servers/storefront
- GraphQL Admin API: https://shopify.dev/docs/api/admin-graphql/2026-07
- Authentication overview: https://shopify.dev/docs/apps/build/authentication-authorization
- Access tokens: https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens
- Access scopes: https://shopify.dev/docs/api/usage/access-scopes
- API limits: https://shopify.dev/docs/api/usage/limits
- Webhooks: https://shopify.dev/docs/api/admin-graphql/2026-07/objects/WebhookSubscription

## Runtime

- Node.js 20+
- TypeScript
- MCP SDK over stdio
- Native `fetch` for GraphQL Admin API calls

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

Development mode:

```bash
npm run dev
```

## Authentication

Every GraphQL Admin API request uses:

```text
X-Shopify-Access-Token: SHOPIFY_ADMIN_ACCESS_TOKEN
```

and is sent only to:

```text
https://SHOPIFY_SHOP_DOMAIN/admin/api/SHOPIFY_API_VERSION/graphql.json
```

The shop domain is validated as `*.myshopify.com`, so tool input cannot redirect credentials to an arbitrary host.

How an application obtains its access token depends on how the Shopify app is deployed. Shopify supports token exchange for embedded apps, authorization code grants for standalone/API-only apps, and client credentials for server-side integrations acting on stores in the same organization. This reusable connector intentionally accepts an already-issued Admin API token through process configuration rather than exposing OAuth secrets or token acquisition to the LLM.

For background automation, use an appropriate offline/service-side token and store it in a secret manager. Never pass the token through prompts or tool parameters.

## Least-privilege scopes

Enable only scopes required by the tools you actually use:

| Capability | Scope |
|---|---|
| Product reads | `read_products` |
| Product mutations | `write_products` (write includes read access for that resource) |
| Order reads | `read_orders` |
| Inventory reads | `read_inventory` |
| Location reads | `read_locations` |
| Webhook administration | app/topic-dependent access; webhook topics can also require access to their underlying resource |

Reading orders older than the normal order-access window can require Shopify's separately approved `read_all_orders` access. This connector does not assume that permission exists.

The connector does not request or escalate scopes. Scope grants stay under Shopify's app installation and merchant approval process.

## Environment variables

See `.env.example`.

- `SHOPIFY_SHOP_DOMAIN`: required canonical `*.myshopify.com` domain.
- `SHOPIFY_ADMIN_ACCESS_TOKEN`: required secret.
- `SHOPIFY_API_VERSION`: defaults to `2026-07`.
- `SHOPIFY_TIMEOUT_MS`: 1–60 seconds, default 15 seconds.
- `SHOPIFY_APPROVAL_MODE`: `required` by default; set `disabled` only when an external policy engine provides equivalent approval.
- `SHOPIFY_APPROVED_ACTIONS`: comma-separated write actions approved by an operator.
- `SHOPIFY_ALLOW_DESTRUCTIVE`: `false` by default and additionally required for destructive tools.

Approval is connector configuration, not a tool argument. An AI agent cannot grant itself approval in a request.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `shopify.access_scope.list` | GraphQL Admin | READ | No |
| `shopify.shop.get` | GraphQL Admin | READ | No |
| `shopify.product.list` | GraphQL Admin | READ | No |
| `shopify.product.get` | GraphQL Admin | READ | No |
| `shopify.product.create` | GraphQL Admin | WRITE | Required by default |
| `shopify.product.update` | GraphQL Admin | WRITE | Required by default |
| `shopify.product.delete` | GraphQL Admin | DESTRUCTIVE | Required + disabled by default |
| `shopify.order.list` | GraphQL Admin | READ | No |
| `shopify.order.get` | GraphQL Admin | READ | No |
| `shopify.location.list` | GraphQL Admin | READ | No |
| `shopify.inventory_level.list` | GraphQL Admin | READ | No |
| `shopify.webhook.list` | GraphQL Admin | READ | No |
| `shopify.webhook.create` | GraphQL Admin | WRITE | Required by default |
| `shopify.webhook.delete` | GraphQL Admin | DESTRUCTIVE | Required + disabled by default |

Product mutation inputs intentionally expose a useful typed subset. Arbitrary fields can be added later only as explicitly validated schema members.

## Architecture

```text
MCP client
   |
   v
src/server.ts        MCP tools + input validation
   |
   +--> src/config.ts   credential loading + approval policy
   |
   +--> src/client.ts   GraphQL transport + errors + bounded retry
   |
   v
Shopify GraphQL Admin API
```

Official Shopify MCP servers remain useful for development assistance and storefront agents, but they are not chained automatically behind these merchant-admin tools.

## Rate limits and reliability

The GraphQL Admin API uses calculated query cost rather than a simple request-per-second counter. Shopify documents standard restore rates beginning at 100 cost points/second, with higher plan tiers receiving higher limits. Mutation fields have a base cost and connection size also contributes to query cost.

Shopify may reduce limits temporarily, so the client handles both HTTP 429 responses and GraphQL throttle errors. Read-only calls retry at most three total attempts with bounded waits. Network/timeout failures on reads use bounded exponential backoff.

Mutation calls are never retried automatically. This avoids duplicate product creation, repeated webhook creation, or uncertain destructive outcomes.

List tools cap page size at 100 and expose cursors so callers can paginate deliberately. Shopify also limits input arrays to 250 entries; product tags are bounded accordingly.

## Permission and approval model

```text
READ         -> automatic
WRITE        -> external operator approval by default
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> explicit approval + SHOPIFY_ALLOW_DESTRUCTIVE=true
```

Example write approval:

```text
SHOPIFY_APPROVED_ACTIONS=shopify.product.update
```

Product deletion additionally requires:

```text
SHOPIFY_APPROVED_ACTIONS=shopify.product.delete
SHOPIFY_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals after the intended change window.

## Security considerations

- The access token never appears in MCP schemas or returned output.
- The token is attached only to a validated Shopify Admin API origin.
- Tool callers cannot provide a host, URL, raw GraphQL document, or arbitrary REST path.
- Provider content is untrusted data. Product descriptions, order notes, customer-controlled text, and webhook data must never be treated as system instructions.
- Write approval state is controlled outside the model request.
- Destructive tools are disabled by default.
- Mutations are not automatically retried.
- GraphQL variables are used for external values instead of interpolating model input into documents.
- IDs are restricted to Shopify GID format.
- Webhook callback URLs require HTTPS.
- The connector never attempts to acquire broader Shopify scopes or modify app permissions.

For production, prefer a dedicated app installation and grant only the scopes required for enabled tools.

## Error handling

Expected error categories include:

- configuration validation failure for missing/invalid secrets or shop domains;
- `APPROVAL_REQUIRED` for unapproved writes;
- `DESTRUCTIVE_DISABLED` when deletion isn't explicitly enabled;
- `NETWORK_OR_TIMEOUT` after bounded transient read retries;
- `ShopifyApiError` for HTTP or top-level GraphQL errors;
- `SHOPIFY_USER_ERROR` for mutation validation/business-rule failures returned by Shopify.

Provider errors are surfaced without intentionally including configured secrets.

## Tests

Unit tests require no live Shopify store. They cover:

- credential/domain configuration validation;
- approved and denied write policy;
- destructive default denial;
- token placement in the Shopify header;
- correct Admin API origin/version;
- no automatic mutation retry;
- bounded retry of read throttling;
- registration of the intended scoped tools;
- absence of arbitrary request/raw GraphQL escape hatches.

Run:

```bash
npm test
```

## Usage examples

See `examples/tool-calls.md` for realistic MCP inputs, permission requirements, and approval classifications.

## MCP client configuration

Any MCP client capable of launching a local stdio server can run the built connector. Example configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/shopify/dist/src/server.js"],
  "env": {
    "SHOPIFY_SHOP_DOMAIN": "example.myshopify.com",
    "SHOPIFY_ADMIN_ACCESS_TOKEN": "provided-by-secret-manager"
  }
}
```

Do not check real tokens into MCP configuration files.

For development-only Shopify assistance, clients can separately run Shopify's official Dev MCP package. For shopper-facing commerce, use the store's official Storefront MCP endpoint instead of this Admin connector.

## Limitations

- This is not a complete Shopify Admin API wrapper.
- Shopify Dev MCP is documented but not proxied because it is development-oriented rather than merchant-admin transport.
- Storefront MCP is documented but not proxied because it is shopper-facing.
- The connector accepts an already-issued Admin API token; it does not implement an interactive OAuth UI.
- Product variants, media, publications, fulfillment mutations, refunds, customer mutations, discounts, billing, app installation management, and permission changes are intentionally not exposed.
- Order operations are read-only.
- Inventory operations are read-only.
- Webhook creation supports HTTPS callbacks only.
- Access to some order history and webhook topics depends on additional Shopify approval/scopes outside this connector.
