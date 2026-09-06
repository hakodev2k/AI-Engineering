# Webflow MCP/API Connector

Reusable MCP server exposing a focused, safety-classified subset of Webflow Data API capabilities for AI agents and MCP clients.

## Provider and purpose

Provider: **Webflow**.

This connector supports common headless workflows around sites, pages, CMS collections, and CMS items. It intentionally separates draft/content preparation from publication and destructive operations so an agent cannot silently publish or delete content.

## Supported transport

External interface: MCP over stdio using `@modelcontextprotocol/sdk`.

Provider transport used by this connector: Webflow Data API v2 over HTTPS (`https://api.webflow.com/v2`).

Webflow also operates an official remote MCP server at `https://mcp.webflow.com/mcp`. The official server uses OAuth, supports Webflow Data and Designer capabilities, and is the preferred direct integration when an MCP client can own the Webflow OAuth session. This reusable connector deliberately uses the official Data API for its headless provider transport because it must enforce its own stable tool contracts, permission policy, approval boundaries, and credential isolation without forwarding an MCP client's OAuth credentials to another MCP server. The official MCP capability was checked before choosing this transport.

The Webflow MCP server is not proxied or mirrored here. Designer-canvas operations are therefore outside this connector's scope.

## Official sources

- Webflow MCP overview: https://developers.webflow.com/mcp/reference/overview
- Webflow MCP getting started: https://developers.webflow.com/mcp/reference/getting-started
- Webflow MCP architecture: https://developers.webflow.com/mcp/reference/how-it-works
- Webflow Data API/CMS reference: https://developers.webflow.com/data/reference
- Authentication: https://developers.webflow.com/data/docs/getting-started-authentication
- OAuth: https://developers.webflow.com/data/docs/oauth
- Scopes: https://developers.webflow.com/data/docs/scopes
- Rate limits: https://developers.webflow.com/data/reference/rate-limits
- Webhooks: https://developers.webflow.com/data/docs/working-with-webhooks
- Site publishing: https://developers.webflow.com/data/reference/sites/publish

Research baseline: 2026-09-06.

## Capability map

| MCP tool | Provider route | Permission | Risk | Approval |
|---|---|---|---|---|
| `webflow.site.list` | `GET /v2/sites` | READ | READ | none |
| `webflow.site.get` | `GET /v2/sites/{site_id}` | READ | READ | none |
| `webflow.page.list` | `GET /v2/sites/{site_id}/pages` | READ | READ | none |
| `webflow.page.get` | `GET /v2/pages/{page_id}` | READ | READ | none |
| `webflow.page.content.get` | `GET /v2/pages/{page_id}/dom` | READ | READ | none |
| `webflow.collection.list` | `GET /v2/sites/{site_id}/collections` | READ | READ | none |
| `webflow.collection.get` | `GET /v2/collections/{collection_id}` | READ | READ | none |
| `webflow.item.list` | `GET /v2/collections/{collection_id}/items` | READ | READ | none |
| `webflow.item.get` | `GET /v2/collections/{collection_id}/items/{item_id}` | READ | READ | none |
| `webflow.item.create` | `POST /v2/collections/{collection_id}/items` | WRITE | WRITE | configurable; on by default |
| `webflow.item.update` | `PATCH /v2/collections/{collection_id}/items/{item_id}` | WRITE | WRITE | configurable; on by default |
| `webflow.item.publish` | `POST /v2/collections/{collection_id}/items/publish` | WRITE | HIGH_RISK | always required |
| `webflow.item.delete` | `DELETE /v2/collections/{collection_id}/items/{item_id}` | WRITE | DESTRUCTIVE | always required + disabled by default |
| `webflow.site.publish` | `POST /v2/sites/{site_id}/publish` | WRITE | HIGH_RISK | always required |

The connector does not expose a generic arbitrary-request tool.

## Architecture

```text
MCP client / agent
        |
        v
Webflow MCP connector (stdio)
  |-- strict Zod input validation
  |-- permission and approval policy
  |-- credential isolation
  |-- bounded retry / timeout handling
  |-- provider error mapping
        |
        v
Webflow Data API v2
```

Provider responses and page/CMS content are treated as untrusted data. Retrieved content is never interpreted as permission policy or connector configuration.

## Authentication

Set `WEBFLOW_ACCESS_TOKEN` in the connector process environment. It may be a Webflow OAuth access token, site token, or workspace token, provided it has access to the requested resources and the least-privilege scopes required by the enabled tools.

Credentials are read only inside the connector configuration/client layer. Tool inputs never accept access tokens, refresh tokens, API keys, client secrets, passwords, or arbitrary authorization headers. The LLM therefore does not need to receive raw provider credentials.

### Required scopes

Read operations need the corresponding read scopes, primarily:

- `sites:read`
- `pages:read`
- `cms:read`

Mutating CMS operations require `cms:write`. Site/page publishing requires `sites:write`.

Actual availability also depends on the Webflow role, site/workspace access, token type, and the resources granted during OAuth authorization. Configure only the scopes needed for the tool set you intend to use.

## Environment variables

Copy `.env.example` values into your process environment or secret manager. Do not commit real credentials.

- `WEBFLOW_ACCESS_TOKEN` — required bearer credential.
- `WEBFLOW_PERMISSIONS` — `read` (default) or `write`.
- `WEBFLOW_REQUIRE_WRITE_APPROVAL` — defaults to `true`.
- `WEBFLOW_ALLOW_DESTRUCTIVE` — defaults to `false`.
- `WEBFLOW_TIMEOUT_MS` — request timeout, default `15000`, allowed `1000..120000`.
- `WEBFLOW_MAX_RETRIES` — retries for safe GET requests, default `2`, allowed `0..5`.

## Installation

Requirements: Node.js 22.3.0+ and npm.

```bash
npm install
npm run build
```

## Running the MCP server

```bash
WEBFLOW_ACCESS_TOKEN='...' npm start
```

Configure your MCP client to launch the package's compiled `dist/src/server.js` over stdio. Because this is a standard stdio MCP server, it can be used by MCP clients that support launching local stdio servers. Client-specific configuration remains the responsibility of the host environment.

## Permission and approval model

`READ` tools can run automatically when the token allows them.

`WRITE` tools require `WEBFLOW_PERMISSIONS=write`; by default they also require `approval: true`. An administrator may set `WEBFLOW_REQUIRE_WRITE_APPROVAL=false` for ordinary draft/staged mutations, but that setting never bypasses explicit approval for high-risk or destructive actions.

`HIGH_RISK` tools always require `approval: true`. This includes public CMS publication and site/page publication.

`DESTRUCTIVE` tools require `WEBFLOW_PERMISSIONS=write`, `WEBFLOW_ALLOW_DESTRUCTIVE=true`, and `approval: true`. The only destructive tool in this package is permanent CMS item deletion.

An agent cannot raise its own permissions through tool arguments. Permission policy is process configuration, not provider content or model input.

## Validation

Webflow resource identifiers are validated as 24-character hexadecimal object IDs. Tool input objects reject unknown properties. Pagination is bounded to `1..100` records per call with non-negative offsets. CMS item creation requires `fieldData.name` and `fieldData.slug`. CMS publication allows at most 100 item IDs per call. Site publication requires at least one target: custom domains or the Webflow subdomain.

## Reliability and rate limits

Webflow Data API rate limits are plan-dependent. Current official documentation lists 60 requests/minute for Starter and Basic, 120 requests/minute for CMS/eCommerce/Business, and custom limits for Enterprise. Responses expose `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After`. Site publish has an endpoint-specific limit of one successful publish per minute.

The client:

- applies a configurable timeout with `AbortController`;
- retries only safe `GET` requests;
- retries `429` and `5xx` responses with bounded exponential backoff;
- honors `Retry-After` when present;
- never blindly retries create/update/publish/delete operations;
- exposes explicit `limit` and `offset` for list pagination;
- maps authentication, permission, validation, not-found, conflict, rate-limit, and provider-service errors to concise MCP errors.

Network failures on safe reads are retried within `WEBFLOW_MAX_RETRIES`. Authentication and authorization errors are not retried because they normally require user or administrator action.

## Webhooks and events

Webflow supports webhooks for site, form, CMS, and other events. Webhook registration/ingestion is intentionally not implemented in this connector because a reusable inbound webhook listener requires a separately deployed HTTPS endpoint, signature/event handling, persistence, and lifecycle configuration. The connector therefore does not claim event-delivery support.

Use the official webhook documentation when building a dedicated event receiver: https://developers.webflow.com/data/docs/working-with-webhooks

## MCP security

Webflow's official MCP server was evaluated and is preferred when the consuming MCP client can connect to it directly and complete Webflow OAuth. This package does not automatically discover or trust upstream MCP tools, does not forward provider credentials to arbitrary endpoints, and does not accept a configurable upstream URL. The Webflow API base URL is fixed to prevent SSRF through tool inputs.

The connector also:

- does not log the bearer credential;
- has no arbitrary URL/request tool;
- restricts mutating operations through local policy before provider calls;
- treats Webflow content as untrusted data rather than executable instructions;
- keeps production publication behind explicit human approval;
- keeps deletion disabled unless enabled out-of-band by process configuration.

## Error behavior

Typical errors include:

- `400`: tool/provider validation failed;
- `401`: token invalid or expired;
- `403`: insufficient scope, role, or resource access;
- `404`: resource not found;
- `409`: conflicting provider state;
- `429`: throttled; retry information is preserved when available;
- `5xx`: transient Webflow service error;
- timeout/network errors: surfaced after bounded read retries.

OAuth refresh is intentionally owned by the credential provider or host application. Do not pass refresh tokens through MCP tool inputs.

## Testing

Tests require no live Webflow credentials. They use fake environment values and mocked `fetch` implementations.

```bash
npm test
```

Coverage includes configuration/auth requirements, strict IDs, tool registration, write permission denial, high-risk approval, destructive default denial, bearer credential isolation at the HTTP layer, successful reads, `429` retry behavior, and the rule that mutating `POST` requests are not retried blindly.

## Usage examples

See `examples/workflows.md` for read, draft-create, publish, site publish, and destructive-delete examples including required permission and approval behavior.

## Limitations

- This connector does not proxy Webflow's official remote MCP server.
- Designer API/canvas operations, components/styles/variables, asset upload, custom fonts, analytics, custom code management, forms, comments, e-commerce, users, and workspace administration are not exposed by this focused tool set.
- It does not implement OAuth authorization-code/PKCE UI or token refresh itself; the host supplies an access token securely.
- It does not create or receive Webhooks.
- Site/workspace access and available endpoints vary with account plan, role, token type, and scopes.
- Webflow's official MCP currently has broader capabilities than this connector. Use it directly when its OAuth/client model fits your workflow.

Only capabilities implemented in `src/server.ts` are documented as supported MCP tools here.
