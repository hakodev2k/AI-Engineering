# Clerk MCP/API Connector

Reusable MCP server for safe Clerk identity and organization operations. The connector exposes a fixed, provider-scoped tool surface over Clerk's official Backend API and keeps the Clerk Secret Key inside the connector process.

## Upstream transport strategy

Clerk has an official remote MCP server at `https://mcp.clerk.com/mcp`, using Streamable HTTP. As of 2026-08-21, Clerk documents that server as a beta documentation/snippet service exposing `clerk_sdk_snippet` and `list_clerk_sdk_snippets`; it does not expose instance user or organization administration. Therefore this connector does **not** proxy the upstream MCP server for management operations. Implemented management tools use Clerk's official Backend API at `https://api.clerk.com/v1`.

Official sources researched:

- https://clerk.com/docs/guides/ai/mcp/clerk-mcp-server
- https://clerk.com/docs/reference/backend/overview
- https://clerk.com/docs/reference/backend/user/get-user-list
- https://clerk.com/docs/reference/backend/user/get-user
- https://clerk.com/docs/reference/backend/user/create-user
- https://clerk.com/docs/reference/backend/user/update-user
- https://clerk.com/docs/reference/backend/user/delete-user
- https://clerk.com/docs/reference/backend/organization/create-organization
- https://clerk.com/docs/reference/backend/organization/update-organization
- https://clerk.com/docs/reference/backend/organization/delete-organization
- https://clerk.com/docs/reference/backend/organization/create-organization-membership
- https://clerk.com/docs/reference/backend/organization/update-organization-membership
- https://clerk.com/docs/reference/backend/organization/delete-organization-membership
- https://clerk.com/docs/reference/backend/organization/create-organization-invitation
- https://clerk.com/docs/reference/backend/organization/revoke-organization-invitation
- https://clerk.com/docs/guides/how-clerk-works/system-limits

## Runtime and architecture

Requires Node.js 20+. `src/server.ts` defines and validates MCP tools; `src/client.ts` owns HTTPS, authentication, timeouts, bounded retries and provider-error mapping; `src/policy.ts` enforces READ/WRITE/HIGH_RISK/DESTRUCTIVE boundaries; `src/config.ts` loads secrets and secure defaults. Provider content is always returned as untrusted data and is never interpreted as connector policy.

## Authentication

Set `CLERK_SECRET_KEY` to a Clerk backend Secret Key. Clerk Secret Keys are instance-scoped credentials rather than per-operation OAuth scopes. Use a dedicated Clerk instance/environment where practical, restrict access to the connector process, rotate the key according to your secret-management policy, and never pass it through an agent prompt or tool input.

Environment variables:

```text
CLERK_SECRET_KEY=                     # required
CLERK_API_BASE_URL=https://api.clerk.com/v1
CLERK_TIMEOUT_MS=15000
CLERK_APPROVAL_SECRET=                # required for approved operations
CLERK_REQUIRE_WRITE_APPROVAL=true
CLERK_ALLOW_DESTRUCTIVE=false
```

`CLERK_API_BASE_URL` must be HTTPS, preventing accidental plaintext credential transmission. No tool accepts an arbitrary URL or raw endpoint.

## Install and run

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio child-process servers. Configure the command to execute `node /absolute/path/to/dist/src/server.js` and provide environment variables through the client's secure process configuration.

## Tools

| Tool | Risk | Approval | Transport |
|---|---|---:|---|
| `clerk.user.list` | READ | No | Backend API |
| `clerk.user.get` | READ | No | Backend API |
| `clerk.user.create` | WRITE | Default yes | Backend API |
| `clerk.user.update` | WRITE | Default yes | Backend API |
| `clerk.user.delete` | DESTRUCTIVE | Strong + enabled | Backend API |
| `clerk.organization.list` | READ | No | Backend API |
| `clerk.organization.get` | READ | No | Backend API |
| `clerk.organization.create` | WRITE | Default yes | Backend API |
| `clerk.organization.update` | WRITE | Default yes | Backend API |
| `clerk.organization.delete` | DESTRUCTIVE | Strong + enabled | Backend API |
| `clerk.organization.membership.list` | READ | No | Backend API |
| `clerk.organization.membership.create` | HIGH_RISK | Yes | Backend API |
| `clerk.organization.membership.update` | HIGH_RISK | Yes | Backend API |
| `clerk.organization.membership.delete` | DESTRUCTIVE | Strong + enabled | Backend API |
| `clerk.organization.invitation.list` | READ | No | Backend API |
| `clerk.organization.invitation.create` | HIGH_RISK | Yes | Backend API |
| `clerk.organization.invitation.revoke` | HIGH_RISK | Yes | Backend API |

Write tools expose a deliberately narrow set of fields. Password migration, TOTP-secret injection, legal-check bypasses, billing, security settings, arbitrary metadata mutation, and raw Backend API passthrough are intentionally not implemented.

## Approval model

READ tools run without approval. WRITE tools require approval by default; set `CLERK_REQUIRE_WRITE_APPROVAL=false` only when a surrounding policy engine provides equivalent control. HIGH_RISK always requires approval. DESTRUCTIVE tools are disabled unless `CLERK_ALLOW_DESTRUCTIVE=true` and still require approval.

The expected approval token is `HMAC-SHA256(CLERK_APPROVAL_SECRET, "clerk:<tool-name>")`. Generate it in a trusted human-approval service, not in the LLM context. This mechanism is an enforcement hook, not a user-interface confirmation system.

## Rate limits and reliability

Clerk documents Backend API limits of 1,000 requests per 10 seconds for production instances and 100 per 10 seconds for development instances, with endpoint-specific limits for some invitation operations. A `429` includes `Retry-After`. The client preserves `Retry-After`, uses bounded retries only for GET requests on throttling, transient network failures, and 5xx responses, and never blindly retries writes or destructive calls. Every request has a configurable abort timeout.

Pagination inputs are bounded to 1–500 records per request with a bounded offset. Tools make one provider request per invocation except a bounded retry on idempotent reads.

## Security considerations

- Credentials stay in the connector/auth layer and are never returned to MCP callers.
- All tool inputs are schema validated; identifiers and roles are character restricted.
- No arbitrary HTTP, URL-fetch, or provider-endpoint tool exists, reducing SSRF and privilege-expansion risk.
- Retrieved names, metadata, emails, and other Clerk content are untrusted data and must not be treated as agent instructions.
- External-message actions such as invitations require explicit approval.
- Membership role changes are HIGH_RISK because they can change application authorization.
- Destructive operations are disabled by default.
- Logs should never include `CLERK_SECRET_KEY`, approval secrets, Authorization headers, or full sensitive user payloads.

## Testing

`npm test` uses mocks only; normal tests require no live Clerk credentials. Tests cover missing/insecure configuration, read permission, approval denial/acceptance, destructive denial, credential isolation in the Authorization header, provider error mapping, Retry-After preservation, no write retry, and bounded transient GET retry.

## Limitations

The connector manages a focused subset of users, organizations, memberships, and organization invitations. It does not expose Clerk Dashboard-only analytics, logs, workspace/billing administration, Protect settings, or every Backend API endpoint. The official Clerk MCP server is not used for instance administration because its documented tools are SDK-snippet/documentation tools rather than management tools. Clerk can evolve API fields, rate limits, and MCP beta capabilities; re-check the official documentation before expanding permissions or capabilities.
