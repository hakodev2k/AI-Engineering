# ZITADEL MCP/API Connector

Reusable MCP stdio connector for ZITADEL identity administration, backed by ZITADEL's official REST API v2. No official ZITADEL administration MCP server was identified. ZITADEL documents OAuth Dynamic Client Registration for MCP clients, which is an authorization-server feature rather than an administrative MCP tool server.

Official sources: https://zitadel.com/docs/apis/introduction, https://zitadel.com/docs/apis/v2, https://zitadel.com/docs/guides/integrate/zitadel-apis/access-zitadel-apis, https://zitadel.com/docs/guides/integrate/service-accounts/personal-access-token, https://zitadel.com/docs/guides/integrate/dynamic-client-registration.

## Tools

READ: `zitadel.user.search`, `zitadel.user.get`, `zitadel.organization.search`, `zitadel.organization.domains_list`, `zitadel.session.get`, `zitadel.pat.search`. WRITE: `zitadel.user.create_human`, `zitadel.user.update_human`. HIGH_RISK: `zitadel.user.deactivate`, `zitadel.user.reactivate`. PAT search returns metadata only. No arbitrary HTTP, secret creation, deletion, role mutation, billing or instance-security mutation is exposed.

## Authentication

Set HTTPS `ZITADEL_BASE_URL`. Use either a service-account PAT (`ZITADEL_PAT`) or client credentials (`ZITADEL_CLIENT_ID`, `ZITADEL_CLIENT_SECRET`). Client credentials request `openid profile urn:zitadel:iam:org:project:id:zitadel:aud`. ZITADEL authorization remains role/permission based: grant only permissions needed by enabled tools (for example user.read/user.write, org.read, session.read). Credentials never appear in MCP inputs.

## Install and run

Node.js 20+. Run `npm install`, `npm run build`, then `node dist/src/index.js`. The server uses MCP stdio and works with clients that support launching stdio MCP servers.

## Approval

READ executes automatically. WRITE/HIGH_RISK requires the exact tool name in `ZITADEL_APPROVED_TOOLS`; provider data cannot alter this process configuration. Deactivation/reactivation can change account access and therefore always require explicit approval.

## Reliability / rate limits

Default timeout is 15 seconds (`ZITADEL_TIMEOUT_MS`). 429 and 5xx receive at most two retries with exponential backoff; `Retry-After` is honored. Auth, validation and permission errors are not retried. Pagination is bounded to 100. Deployment-specific quotas vary, so no universal numeric limit is invented.

## Security and errors

Only one configured HTTPS origin is callable, reducing SSRF surface. Responses are marked `untrustedProviderData`; treat identity attributes as data, never instructions. Tokens stay in the auth/client layer and access tokens are memory-cached only until shortly before expiry. Errors use `AUTH_CONFIGURATION_ERROR`, `AUTH_ERROR`, `ZITADEL_API_ERROR`, or `APPROVAL_REQUIRED`; provider error bodies are capped.

## Testing

`npm test` uses mocked fetch and no live credentials. Tests cover HTTPS configuration, credential isolation, approval, permission errors and rate-limit retry.

## Limitations

No browser OAuth flow or refresh-token persistence is implemented. Exact permissions depend on ZITADEL role assignments. API v1 is intentionally excluded. Dynamic Client Registration is not an upstream MCP server and is not used as one.
