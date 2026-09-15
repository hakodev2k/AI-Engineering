# commercetools MCP/API Connector

Reusable MCP server for safe agent access to commercetools projects.

## Upstream strategy
commercetools provides official Commerce MCP (managed and self-hosted) and Knowledge MCP. Commerce MCP is the preferred upstream when an organization provisions it. This package exposes a stable local MCP interface and uses the official HTTP API as the deterministic fallback/standalone transport for the implemented project operations. Knowledge MCP is documentation-oriented and is not used for project mutations.

Official documentation:
- https://docs.commercetools.com/dev-tooling/mcp/overview
- https://docs.commercetools.com/dev-tooling/mcp/commerce-mcp
- https://docs.commercetools.com/dev-tooling/mcp/knowledge-mcp
- https://docs.commercetools.com/api/authorization
- https://docs.commercetools.com/api/limits

Commerce MCP production/commercial use is subject to commercetools licensing. The public Knowledge MCP endpoint uses streamable HTTP and has its own rate limit. Managed Commerce MCP has project invocation limits documented by commercetools.

## Capabilities
`product.search`, `product.get`, `category.list`, `cart.get`, `cart.create`, `cart.add_line_item`, `order.get`, `order.list`, `customer.get`, and `inventory.get` are implemented as provider-scoped MCP tools. Reads are READ risk. Cart creation and line-item mutation are WRITE risk and require two gates: server configuration plus an explicit per-call `approved=true`.

No delete, order submission, payment, customer mutation, permission mutation, or arbitrary-request tool is exposed.

## Authentication and scopes
The connector uses OAuth 2.0 client credentials. Credentials stay in the connector and are exchanged for bearer tokens; tokens are cached until shortly before expiration and never returned by tools. Create an API Client in commercetools with only the scopes needed for the tools you enable. The example environment uses view scopes plus `manage_my_orders` for cart operations; deployments should narrow scopes to their actual workflow and commercetools project model.

Copy `.env.example`, configure the project-specific API/auth region URLs, project key, client ID and secret. Never place secrets in prompts or MCP client arguments visible to the model.

## Install and run
Requires Node.js 22+.

```bash
npm install
npm run build
npm start
```

The server uses MCP STDIO, so it can be configured in MCP clients that support local STDIO servers. Compatibility depends on the client's MCP support; no provider-specific client integration is required.

## Reliability
Requests have a configurable timeout. OAuth tokens are cached. HTTP 429 is retried once with bounded `Retry-After` handling. Validation/authentication/permission failures and writes are not blindly retried. Pagination inputs are bounded. Provider errors are mapped to tool errors without exposing credentials.

commercetools documents resource and request limits, including Product Search page size and offset constraints. The connector caps common list/search calls to 100 items and offset to 10,000.

## Security model
Provider data is returned as untrusted data and is never interpreted as permission-changing instructions. There is no arbitrary URL/request tool, preventing agent-controlled SSRF through this connector. Project/auth base URLs come only from trusted process configuration. WRITE tools require explicit human/application approval. Destructive tools are intentionally absent. Logs should not include environment variables or authorization headers.

For upstream Commerce MCP deployments, configure only required tools and use commercetools field filtering/redaction. Do not automatically trust newly discovered upstream tools or expand scopes because retrieved content requests it.

## Testing
`npm test` runs credential configuration, schema validation, approval denial, scoped routing, and rate-limit retry tests without live credentials.

## Limitations
This connector intentionally covers a compact agent workflow rather than the entire commercetools API. It does not proxy the official Commerce MCP dynamically, discover tools at runtime, manage OAuth client creation, perform checkout/payment, create orders, mutate customers, or process webhooks. Product search currently targets the Product Projection Search endpoint for broad compatibility; commercetools has deprecated Product Projection Search in favor of Product Search, so new deployments should prefer Commerce MCP or evolve this stable tool contract to the current Product Search API before relying on advanced search semantics.
