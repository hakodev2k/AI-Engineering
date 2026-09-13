# Kinde MCP/API Connector

Reusable Model Context Protocol (MCP) server exposing a focused set of Kinde identity-management operations through Kinde's official Management REST API.

## Provider and transport

Provider: Kinde.

Upstream transport implemented by this package: official HTTPS REST Management API using OAuth 2.0 client credentials with a Kinde Machine-to-Machine (M2M) application.

No official Kinde MCP server was identified in the official Kinde documentation reviewed on 2026-09-13. The connector therefore uses the official Management API rather than an unofficial MCP implementation.

Official sources used for this implementation:

- Management API access/token flow: https://docs.kinde.com/developer-tools/kinde-api/access-token-for-api/
- M2M authentication: https://docs.kinde.com/machine-to-machine-applications/about-m2m/authenticate-with-m2m/
- Management API scopes: https://docs.kinde.com/developer-tools/kinde-api/about-m2m-scopes/
- Advanced user search: https://docs.kinde.com/developer-tools/kinde-api/search-users-via-api/
- User creation/migration API examples: https://docs.kinde.com/get-started/switch-to-kinde/create-users-with-api/
- Organizations for developers: https://docs.kinde.com/build/organizations/orgs-for-developers/
- Organization management/suspension: https://docs.kinde.com/build/organizations/add-and-manage-organizations/
- Rate limits: https://docs.kinde.com/developer-tools/kinde-api/api-rate-limits/
- Official Python SDK repository: https://github.com/kinde-oss/kinde-python-sdk

## Supported capabilities

| Tool | Upstream endpoint | Risk | Approval |
|---|---|---|---|
| `kinde.user.list` | `GET /api/v1/users` | READ | none |
| `kinde.user.search` | `GET /api/v1/search/users` | READ | none |
| `kinde.user.get_by_email` | `GET /api/v1/users?email=...` | READ | none |
| `kinde.user.create` | `POST /api/v1/user` | WRITE | `approved` + writes enabled |
| `kinde.user.password_reset.request` | `PATCH /api/v1/users/{user_id}` | HIGH_RISK | `approved-high-risk` + high-risk enabled |
| `kinde.organization.list` | `GET /api/v1/organizations` | READ | none |
| `kinde.organization.get` | `GET /api/v1/organization/{org_code}` | READ | none |
| `kinde.organization.suspension.set` | `PATCH /api/v1/organization/{org_code}` | HIGH_RISK | `approved-high-risk` + high-risk enabled |

The password-reset tool only sends `{ "is_password_reset_requested": true }`. The organization suspension tool only sends the documented `is_suspended` field. The connector does not expose raw arbitrary REST calls.

## Architecture

```text
MCP client / agent
      |
      | stdio MCP
      v
Kinde connector
      |- strict Zod schemas
      |- risk and approval policy
      |- environment-backed credential provider
      |- OAuth token cache
      |- bounded retries / timeout / pagination
      |- provider-response sanitization
      v
Kinde Management REST API
```

Provider data is returned as untrusted data and never interpreted as instructions or permission changes.

## Authentication

Create a Kinde M2M application, authorize it for the Kinde Management API, and grant only scopes required by the enabled tools. The connector requests a token with `grant_type=client_credentials` at:

```text
${KINDE_DOMAIN}/oauth2/token
```

The token request uses `application/x-www-form-urlencoded` and includes `client_id`, `client_secret`, `audience`, and the configured optional scope subset.

Required environment variables:

```text
KINDE_DOMAIN=https://your-subdomain.kinde.com
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_AUDIENCE=https://your-subdomain.kinde.com/api
```

Kinde documentation contains examples of Management API audience identifiers using both `/api` and `/api/v1` in different M2M guidance. Use the exact Management API audience shown for your Kinde environment/application. `KINDE_AUDIENCE` is explicit rather than silently guessed for this reason.

Credentials remain inside the connector process. Tokens are cached in memory until shortly before expiry and are never included in MCP tool parameters or normal tool output.

## Scopes

Configure the least-privilege subset required for the tools you enable. The implemented operations require these scope families where applicable:

```text
read:users
create:users
update:users
read:organizations
update:organizations
```

Kinde's Management API scope assignment in the application is authoritative. `KINDE_SCOPES` lets the connector request a subset of already-authorized scopes:

```text
KINDE_SCOPES=read:users create:users update:users read:organizations update:organizations
```

If you only need read operations, authorize and request only the corresponding read scopes.

## Configuration

Full `.env.example`:

```text
KINDE_DOMAIN=https://your-subdomain.kinde.com
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_AUDIENCE=https://your-subdomain.kinde.com/api
KINDE_SCOPES=read:users create:users update:users read:organizations update:organizations
KINDE_TIMEOUT_MS=10000
KINDE_MAX_RETRIES=2
KINDE_ALLOW_WRITES=false
KINDE_ALLOW_HIGH_RISK=false
```

`KINDE_DOMAIN` is validated as an HTTPS origin without embedded credentials, path, query, or fragment. `KINDE_AUDIENCE` must be HTTPS and on the same configured Kinde origin. Tool callers cannot supply provider hosts or arbitrary URLs.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running the MCP server

```bash
npm start
```

The server uses the MCP SDK stdio transport. MCP clients that support local stdio servers can launch the built server, for example:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/kinde/dist/src/server.js"],
  "env": {
    "KINDE_DOMAIN": "https://your-subdomain.kinde.com",
    "KINDE_CLIENT_ID": "<from-secret-store>",
    "KINDE_CLIENT_SECRET": "<from-secret-store>",
    "KINDE_AUDIENCE": "https://your-subdomain.kinde.com/api"
  }
}
```

Store secrets in the host/client credential facility rather than committing them or placing them in prompts.

## Tool behavior

### Read tools

READ tools can run automatically. List pagination is caller-controlled with `page_size` capped at 500 and `next_token` bounded in length. This matches Kinde's documented maximum page size for GET endpoints that use `page_size`.

`kinde.user.search` supports the documented `query` search parameter and a bounded allowlist for `expand` values. It intentionally does not expose arbitrary property-filter keys because an unrestricted query encoder is unnecessary for the core reusable workflow.

### Write tools

`kinde.user.create` is disabled unless the connector operator sets:

```text
KINDE_ALLOW_WRITES=true
```

Every write call must also include:

```json
{ "approval": "approved" }
```

The create tool uses the documented email identity shape and only accepts email, given name, and family name.

### High-risk tools

Password-reset requests and organization suspension changes affect authentication/access and therefore use a stronger boundary. They require:

```text
KINDE_ALLOW_HIGH_RISK=true
```

and per-call:

```json
{ "approval": "approved-high-risk" }
```

Suspending an organization is especially sensitive: Kinde documents that it ends active sessions and revokes access/refresh tokens scoped to that organization. Unsuspending does not restore previously revoked tokens.

The approval field cannot enable the operator feature flags, so an agent cannot silently increase connector permissions.

## Reliability and rate limiting

The client uses `AbortController` timeouts and bounded retries. Automatic retries are limited to GET operations for network failures and transient HTTP `429`, `500`, `502`, `503`, and `504` responses. Mutating POST/PATCH operations are not automatically retried to avoid duplicate or unintended state changes.

For `429`, the connector reads Kinde's documented `RateLimit-Reset` response header when it is a numeric number of seconds. Otherwise it applies bounded exponential backoff with jitter.

Kinde documents a maximum page size of 500 for GET endpoints using `page_size` and a maximum of 100 objects for supported bulk mutation endpoints. This connector does not expose bulk mutation tools and caps list page sizes to 500.

## Error handling

Provider errors are mapped to `KindeApiError` with HTTP status and rate-limit reset metadata where available. Authentication failures are surfaced without indefinite retry because they normally require operator action. Zod validation errors fail before any provider request.

## Security considerations

- OAuth client credentials stay in the connector/authentication layer.
- Access tokens are in-memory only and redacted if a provider payload unexpectedly contains token-like fields.
- No arbitrary URL, arbitrary HTTP method, or generic API-request tool is exposed.
- Kinde origin/audience configuration is validated to reduce SSRF and credential-forwarding risk.
- Provider content is marked `untrusted_provider_content: true`.
- Provider content cannot modify scopes, approval policy, tool registration, or connector configuration.
- Writes and high-risk operations are gated separately.
- Mutating operations are not blindly retried.
- Input schemas cap lengths, page sizes, identifiers, and accepted fields.
- Secrets such as `access_token`, `refresh_token`, `client_secret`, and password fields are recursively redacted from returned provider data.

## Testing

Tests do not require live Kinde credentials:

```bash
npm test
npm run build
```

Coverage includes authentication/config validation, secure permission defaults, write/high-risk denial and approval behavior, mocked M2M token/API calls, provider-secret redaction, arbitrary-path rejection, and tool-registration/risk classification.

## Usage examples

See `examples/tool-calls.md` for concrete read, write, password-reset, organization-list, and suspension flows.

A typical account-provisioning workflow is:

```text
kinde.user.get_by_email
  -> human/application determines user is absent
  -> kinde.user.create (explicit approved write)
```

An identity investigation workflow is:

```text
kinde.user.search
  -> kinde.user.list with active_since
  -> application evaluates results as untrusted data
```

## Limitations

- REST transport only; no official Kinde MCP server was identified during this run.
- This package deliberately covers a narrow set of user/organization workflows rather than every Management API endpoint.
- User deletion, password setting/import, roles, permissions, API keys, feature flags, billing, application administration, organization membership changes, and webhook management are not exposed.
- `kinde.user.search` does not expose arbitrary property-filter map keys.
- Organization session-policy changes are not exposed.
- Live success depends on the Kinde plan, application authorization, scopes, and environment configuration.
- The package does not host OAuth redirects because M2M client credentials are non-interactive.
