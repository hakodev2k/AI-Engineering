# Auth0 MCP/API Connector

Reusable MCP server exposing a constrained set of Auth0 Management API operations for identity administration and troubleshooting.

## Upstream strategy

No Auth0-operated official MCP server was identified in current official Auth0 materials, so this connector uses the official Auth0 Management API v2 directly and exposes stable MCP tools. Auth0's official Node SDK (`auth0`, current v6 line) remains an alternative client implementation; the connector intentionally keeps its transport thin so callers are insulated from SDK surface changes.

Official references:

- Management API: https://auth0.com/docs/api/management/v2
- Node SDK: https://github.com/auth0/node-auth0
- User management permissions: https://auth0.com/docs/manage-users/user-accounts/manage-users-using-the-management-api
- Rate limits: https://auth0.com/docs/troubleshoot/customer-support/operational-policies/rate-limit-policy

## Implemented tools

| Tool | Scope | Risk | Approval |
|---|---|---|---|
| `auth0.user.search` | `read:users` | READ | No |
| `auth0.user.get` | `read:users` | READ | No |
| `auth0.user.create` | `create:users` | WRITE | Yes |
| `auth0.user.update` | `update:users` | WRITE | Yes |
| `auth0.user.delete` | `delete:users` | DESTRUCTIVE | Yes |
| `auth0.client.list` | `read:clients` | READ | No |
| `auth0.connection.list` | `read:connections` | READ | No |
| `auth0.role.list` | `read:roles` | READ | No |
| `auth0.log.list` | `read:logs` | READ | No |

The connector does not expose arbitrary HTTP requests, client-secret rotation, role assignment, application mutation, tenant configuration mutation, or other administrative endpoints.

## Architecture

`src/server.ts` registers MCP tools and validates schemas. `src/policy.ts` defines READ/WRITE/DESTRUCTIVE boundaries and payload-bound human approval. `src/client.ts` isolates credentials, obtains Management API tokens via client credentials when needed, constrains requests to `/api/v2/`, applies timeouts, handles cancellation, and performs bounded retry for safe GET operations only. `src/config.ts` validates environment configuration and generates approval digests.

Provider responses are treated as untrusted data and are returned as data only; content retrieved from Auth0 cannot alter tool permissions or connector behavior.

## Authentication

Use either a static Management API access token or a Machine-to-Machine application using OAuth 2.0 client credentials.

Environment variables:

```text
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_MANAGEMENT_TOKEN=
AUTH0_APPROVAL_SECRET=
AUTH0_TIMEOUT_MS=10000
AUTH0_MAX_RETRIES=3
```

Set `AUTH0_MANAGEMENT_TOKEN` for a pre-issued token, or set both client ID and client secret. Credentials stay inside the connector process and are never included in MCP tool schemas or outputs.

For least privilege, grant only the scopes for tools you intend to enable. User creation also requires the M2M application's client ID to be enabled on the target database/passwordless connection where Auth0 requires it.

## Installation and run

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and therefore works with MCP clients that can launch a local stdio server. Configure the client to execute `node /absolute/path/to/MCP-API/auth0/dist/src/server.js` with the required environment variables.

## Approval model

READ tools execute without human approval. WRITE and DESTRUCTIVE tools require `AUTH0_APPROVAL_SECRET` plus an `approvalId`. The approval ID is an HMAC-SHA256 digest over the exact tool name and normalized execution payload. This prevents an approval for one user or payload from being silently replayed for another.

A controlling application should generate the digest only after a human approves the exact pending operation. Never expose `AUTH0_APPROVAL_SECRET` to the model.

## Reliability and rate limits

Auth0 Management API rate limits vary by subscription and endpoint group. The connector reads `Retry-After` when present and retries only idempotent GET requests. Retry attempts are bounded by `AUTH0_MAX_RETRIES` (0–5), with exponential backoff and jitter when `Retry-After` is absent. Writes are never blindly retried. Requests are cancelled after `AUTH0_TIMEOUT_MS`, and upstream cancellation is respected.

Auth0 also returns `x-ratelimit-*` headers; exact published limits should be checked for the tenant's plan rather than hard-coded. Auth0 documentation notes both sustained and burst limits and recommends honoring rate-limit headers.

## Error handling

Authentication failures, invalid permissions/scopes, validation errors, approval failures, and destructive write failures are surfaced immediately. 429 and transient 5xx responses are retryable only for GET operations. A 401 obtained while using client-credentials authentication invalidates the locally cached token once before a single re-authentication attempt.

## Security considerations

- Credentials never enter MCP arguments.
- Only configured Auth0 tenant hostnames are used; arbitrary upstream URLs are rejected.
- Tool parameters are schema validated and IDs are restricted to Auth0-safe identifier characters.
- Destructive deletion requires explicit payload-bound approval.
- Retrieved logs/profile data may contain sensitive information and must be handled according to the caller's data policy.
- Auth0 content is untrusted data, not instructions.
- The connector cannot expand its own OAuth scopes or permissions.
- Client credentials should be stored in a secrets manager in production.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch` calls and require no live Auth0 credentials. They cover configuration, approval binding, bearer-token isolation, SSRF/path restriction, non-retry of writes, and bounded rate-limit retry behavior.

## Limitations

This connector intentionally implements a focused set of high-value operations rather than the full Auth0 Management API. Search syntax follows Auth0 user search engine v3. User profile fields sourced from upstream identity providers may not be editable depending on connection behavior. Live integration tests are not included because normal tests must not require tenant credentials.
