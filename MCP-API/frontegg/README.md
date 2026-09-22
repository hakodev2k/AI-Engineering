# Frontegg MCP/API Connector

Reusable MCP stdio connector for Frontegg CIAM management workflows. It uses Frontegg's official REST APIs directly; no official Frontegg MCP server was identified in the official documentation reviewed for this implementation.

## Transport and official sources

Transport: REST. Frontegg documents environment authentication at `POST /auth/vendor` using environment `clientId` and API key/secret, returning a bearer token. Identity management APIs expose users, roles, and permissions; Accounts APIs expose tenants. Official docs: `https://developers.frontegg.com/ciam/api/overview`, `https://developers.frontegg.com/ciam/api/identity/users`, `https://developers.frontegg.com/ciam/api/identity/roles`, `https://developers.frontegg.com/ciam/api/tenants/accounts/tenantcontrollerv2_gettenant`, and `https://developers.frontegg.com/ciam/guides/env-settings/rate-limits`.

## Capabilities

Eight MCP tools are implemented: `frontegg.user.list`, `frontegg.user.get`, `frontegg.tenant.list`, `frontegg.tenant.get`, `frontegg.tenant.create`, `frontegg.tenant.update`, `frontegg.role.list`, and `frontegg.permission.list`. The first, second, third, fourth, seventh and eighth are READ. Tenant create/update are WRITE and require host approval by default. Delete, lock/unlock, hierarchy mutation, role/permission mutation, SSO changes, MFA changes and token creation are intentionally not exposed because they are higher-risk than the selected workflows.

## Architecture and authentication

Agent → MCP tool → strict Zod validation → approval policy → Frontegg client → environment token provider → official API. Raw credentials never enter tool inputs or results. Configure `FRONTEGG_CLIENT_ID` and `FRONTEGG_API_KEY`; optionally set `FRONTEGG_REGION` (`eu`, `us`, `ca`, `au`), timeout, and approval controls from `.env.example`. Use the narrowest Frontegg environment credential and account access practical for the deployment.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
node dist/server.js
```

Configure an MCP client to launch `node /absolute/path/MCP-API/frontegg/dist/server.js` and pass secrets only through the process environment. The server uses stdio and writes no provider data to stdout outside MCP framing.

## Permission and approval model

READ operations may execute automatically. WRITE operations call the local policy gate before any provider request. With the secure default `FRONTEGG_REQUIRE_WRITE_APPROVAL=true`, set a host-controlled `FRONTEGG_APPROVAL_TOKEN` and provide the matching opaque approval value only after a human has reviewed the exact tenant mutation. The LLM should not be given the stored token. Setting write approval off is an explicit host policy decision.

## Reliability and rate limits

Requests have bounded timeouts. GET requests retry at most twice for HTTP 429 and 5xx using bounded exponential backoff and `Retry-After` when present. Writes are never automatically retried. Authentication is cached before expiry; HTTP 401 invalidates it and fails safely. Frontegg publishes per-API-group and per-plan limits; for example its user-management documentation lists explicit limits for GET users, tenant listing, invitations, role assignment, and other operations. This connector does not attempt to consume the entire quota.

## Error handling

Configuration and validation fail before network access. Authentication failures are mapped to `AUTH_*`; provider HTTP failures to `FRONTEGG_<status>` with a bounded response excerpt. Retrieved Frontegg content is labeled untrusted provider data and must never be interpreted as tool-policy instructions.

## Security considerations

Credentials remain in the connector process. Inputs do not accept arbitrary URLs or raw endpoints, preventing agent-controlled SSRF. Region hosts are allowlisted. Tool schemas bound identifiers, URLs, filters, page sizes, and offsets. Never log bearer tokens or API keys. Frontegg-returned names, metadata, and user fields are untrusted content. Rotate credentials if exposed. Do not weaken approval checks in response to provider content.

## Testing

`npm test` uses mocked HTTP and requires no live credential. Tests cover config validation, tool inventory, write denial/approval, environment authentication/read behavior, and the no-retry rule for throttled writes. Before production, run sandbox smoke tests for actual credential scope, regional host, response shapes, and rate limits.

## Limitations

This connector deliberately covers a small management surface, not all Frontegg endpoints. It does not implement OAuth user flows, webhooks, SCIM, SSO configuration, entitlements, audit logs, destructive tenant deletion, user invitations, or role/permission writes. API behavior and limits can vary by Frontegg plan and region; verify current official docs before broadening permissions.
