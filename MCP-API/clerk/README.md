# Clerk MCP/API Connector

Reusable MCP server that exposes a curated, safety-gated subset of Clerk tenant administration through Clerk's official Backend REST API.

## Transport decision

Clerk provides a **beta remote MCP server** for AI development assistance. Its documented purpose is to give agents current Clerk SDK snippets and implementation patterns. It is useful while coding with Clerk, but it is not the administration transport used here.

This connector therefore uses Clerk's official Backend API (`https://api.clerk.com/v1`) for account, organization, invitation, and session operations. Clerk's Backend API is authenticated with a Secret Key as a Bearer token and is also wrapped by Clerk's official backend SDKs.

Official sources researched for this connector:

- Clerk MCP server (Beta): https://clerk.com/docs/guides/ai/mcp/clerk-mcp-server
- Clerk Backend API reference: https://clerk.com/docs/reference/backend-api
- `clerkClient` / official backend SDK overview: https://clerk.com/docs/reference/backend/overview
- System and Backend API rate limits: https://clerk.com/docs/guides/how-clerk-works/system-limits
- Organization invitation API/SDK: https://clerk.com/docs/reference/backend/organization/create-organization-invitation

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `clerk.user.list` | Backend API | READ | No |
| `clerk.user.get` | Backend API | READ | No |
| `clerk.user.update` | Backend API | WRITE | Yes |
| `clerk.organization.list` | Backend API | READ | No |
| `clerk.organization.get` | Backend API | READ | No |
| `clerk.organization.update` | Backend API | WRITE | Yes |
| `clerk.organization.membership.list` | Backend API | READ | No |
| `clerk.organization.invitation.list` | Backend API | READ | No |
| `clerk.organization.invitation.create` | Backend API | HIGH_RISK | Yes |
| `clerk.session.list` | Backend API | READ | No |
| `clerk.session.get` | Backend API | READ | No |
| `clerk.session.revoke` | Backend API | HIGH_RISK | Yes |
| `clerk.invitation.create` | Backend API | HIGH_RISK | Yes |

No arbitrary HTTP proxy and no delete endpoint are exposed.

## Architecture

MCP client → strict tool schema → permission/approval policy → Clerk REST client → Clerk Backend API.

`CLERK_SECRET_KEY` exists only inside the connector's HTTP client. It is placed into the provider Authorization header and is never included in tool results, descriptions, logs, or model-visible arguments.

## Authentication and permissions

Create a Clerk Secret Key for the target Clerk application instance and inject it as `CLERK_SECRET_KEY`. Backend API requests are authenticated with `Authorization: Bearer <secret key>`.

Use a dedicated application/instance and operational process appropriate to the environment. Clerk Secret Keys are powerful credentials, so keep them in a secret manager and never expose them to prompts, browser code, repository files, or client-side applications.

This connector deliberately does not offer any tool that creates API keys, changes organization roles/permissions, changes passwords/MFA, or deletes users/organizations.

## API version

The connector sends `Clerk-Version`, configurable through `CLERK_API_VERSION`, defaulting to `2025-04-10`. Pinning a version avoids accidental behavior changes. Update and test this value deliberately when adopting a newer Clerk Backend API version.

## Environment variables

- `CLERK_SECRET_KEY` — required.
- `CLERK_API_BASE_URL` — defaults to `https://api.clerk.com/v1`; HTTPS is enforced to reduce credential leakage/SSRF risk.
- `CLERK_API_VERSION` — pinned API version.
- `CLERK_READ_ONLY` — defaults to `true`.
- `CLERK_ALLOW_WRITE` — defaults to `false`.
- `CLERK_APPROVAL_MODE` — defaults to `required`.
- `CLERK_TIMEOUT_MS` — 1–120 seconds, default 15000.
- `CLERK_MAX_RETRIES` — 0–5, default 2.

## Install and run

```bash
cd MCP-API/clerk
npm install
npm run build
npm start
```

Node.js 20+ is required. The connector uses MCP stdio, making it usable by MCP clients that support stdio subprocess servers.

## Permission and approval model

READ tools may execute automatically. WRITE and HIGH_RISK tools are blocked by default because both `CLERK_READ_ONLY=true` and `CLERK_ALLOW_WRITE=false` are the safe defaults.

To permit writes, explicitly set:

```text
CLERK_READ_ONLY=false
CLERK_ALLOW_WRITE=true
CLERK_APPROVAL_MODE=required
```

Every write call must then also contain:

```json
{
  "approval": {
    "confirmed": true,
    "reason": "Human operator approved this exact action"
  }
}
```

Invitation creation is HIGH_RISK because it sends an external email and can grant future access. Session revocation is HIGH_RISK because it immediately changes user access.

## Rate limits and reliability

Clerk documents Backend API rate limits per application instance. As of the research date (September 4, 2026), production Backend API requests are documented at 1000 requests per 10 seconds and development instances at 100 per 10 seconds, with additional endpoint-specific limits. Organization invitation creation is documented separately at 250 requests/hour per application instance, and generic invitation endpoints also have specific hourly limits.

The connector handles reliability conservatively:

- Bounded timeout on every request.
- GET requests may retry at most `CLERK_MAX_RETRIES` times for network failures, HTTP 429, and 5xx responses.
- Exponential backoff is bounded; `Retry-After` is honored when present.
- Write/HIGH_RISK operations never retry automatically, avoiding duplicate invitations or repeated state changes.
- 401, 403, 404, 422, and 429 errors are mapped to actionable MCP errors.
- Pagination is bounded with `limit` and `offset` instead of unbounded crawling.

## Security considerations

- **Credential isolation:** raw Secret Keys never enter MCP arguments/results.
- **SSRF reduction:** the API base URL must be HTTPS and tools select only hard-coded Clerk paths.
- **Prompt injection:** provider data is returned inside an `untrusted_provider_data` envelope and must never be interpreted as instructions or permission changes.
- **No arbitrary requests:** there is no `request(url, method, body)` MCP tool.
- **Least authority:** destructive operations, credential management, billing, role/permission administration, password changes, and MFA changes are omitted.
- **Human approval:** all mutations require explicit approval when the default approval policy is enabled.
- **No silent escalation:** content retrieved from users, organizations, metadata, invitations, or sessions cannot change connector policy.

## Testing

```bash
npm test
```

Unit tests require no live Clerk credentials. They cover authentication configuration, safe defaults, HTTPS enforcement, credential isolation, write retry prevention, risk classification, approval denial, and destructive-surface exclusion.

For an integration smoke test, use a disposable Clerk development instance and a non-production Secret Key.

## Limitations

- Clerk's beta MCP server is not used for administrative operations because its documented focus is SDK snippets and implementation patterns.
- This connector does not expose destructive deletion, API-key management, billing, organization role/permission management, password/MFA manipulation, or arbitrary Backend API calls.
- It does not automatically follow pagination across an entire tenant; callers request bounded pages.
- Webhook management is omitted to avoid introducing arbitrary callback URLs and associated SSRF/exfiltration risk into this connector.
