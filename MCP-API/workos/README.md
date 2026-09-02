# WorkOS MCP/API Connector

Reusable MCP server for bounded WorkOS organization, AuthKit user, membership, invitation, and SSO-connection workflows. Credentials remain in the connector; the agent receives only scoped tool contracts and provider responses.

## Transport strategy

WorkOS publishes an official `@workos/mcp-docs-server`, introduced June 12, 2025, with documentation-oriented tools (`workos_search`, `workos_docs`, `workos_examples`, `workos_changelogs`). It is useful for developer documentation but does not provide account-management operations. Therefore none of this connector's operational capabilities are forced through that MCP server.

Operational tools use the official WorkOS REST API at `https://api.workos.com`. This is the safer and complete official transport for the selected workflows.

Official sources researched:
- https://workos.com/blog/workos-mcp-documentation-server
- https://workos.com/mcp
- https://workos.com/docs/reference/api-authentication
- https://workos.com/docs/reference/rate-limits
- https://workos.com/docs/reference/organization
- https://workos.com/docs/reference/authkit/organization-membership
- https://workos.com/docs/reference/authkit/invitation
- https://workos.com/docs/reference/sso/connection
- https://workos.com/docs/authkit/users-organizations

## Runtime

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
WORKOS_API_KEY=... npm start
```

The connector exposes MCP over stdio and can be launched by MCP clients that support stdio subprocess servers.

## Authentication and least privilege

Set `WORKOS_API_KEY` to a secret WorkOS API key (`sk_...`). Requests use `Authorization: Bearer <key>` over HTTPS. WorkOS documents secret API keys as capable of performing any API request and scoped to the key's environment; there is no documented per-key scope mechanism. Use a dedicated staging/production environment and operational controls appropriate to the account.

The API key is never accepted as a tool argument, never returned to the LLM, and should be injected through a secret manager or process environment.

## Environment
- `WORKOS_API_KEY` — required.
- `WORKOS_API_BASE_URL` — default `https://api.workos.com`; HTTPS enforced.
- `WORKOS_TIMEOUT_MS` — default 15000, range 1000–120000.
- `WORKOS_MAX_RETRIES` — default 2, range 0–5.
- `WORKOS_REQUIRE_WRITE_APPROVAL` — default true.
- `WORKOS_APPROVED_ACTIONS` — comma-separated exact action fingerprints set outside the agent.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `workos.organization.list` | REST | READ | none |
| `workos.organization.get` | REST | READ | none |
| `workos.organization.create` | REST | WRITE | configurable; required by default |
| `workos.organization.update` | REST | WRITE | configurable; required by default |
| `workos.user.list` | REST | READ | none |
| `workos.user.get` | REST | READ | none |
| `workos.membership.list` | REST | READ | none |
| `workos.membership.get` | REST | READ | none |
| `workos.membership.create` | REST | HIGH_RISK | explicit |
| `workos.membership.roles.update` | REST | HIGH_RISK | explicit |
| `workos.invitation.list` | REST | READ | none |
| `workos.invitation.get` | REST | READ | none |
| `workos.invitation.send` | REST | HIGH_RISK | explicit |
| `workos.invitation.revoke` | REST | HIGH_RISK | explicit |
| `workos.connection.list` | REST | READ | none |
| `workos.connection.get` | REST | READ | none |

No organization/user deletion, membership deactivation, SSO configuration mutation, authentication impersonation, password reset, billing, arbitrary HTTP, or unrestricted API passthrough is exposed.

## Approval model

`WRITE` operations require approval by default and can be relaxed by operators for low-risk metadata workflows. `HIGH_RISK` operations always require an exact fingerprint in `WORKOS_APPROVED_ACTIONS`. Approval is configuration, not an agent parameter, so the model cannot self-approve.

Examples:
```text
WORKOS_APPROVED_ACTIONS=workos.membership.create:org_123:user_456,workos.invitation.send:person@example.com:org_123
```

The intended control flow is Read → Recommend/Prepare → Human approval → Execute.

The connector also refuses to set an organization domain state to `verified` via `organization.update`; ownership verification should happen through an explicitly approved administrative process.

## Rate limits and reliability

WorkOS documents a general limit of 6,000 requests per 60 seconds per API key. AuthKit `/user_management/*` reads are documented at 1,000 requests per 10 seconds and writes at 500 requests per 10 seconds, with tighter limits for authentication/email-delivery operations. Endpoint-specific limits supersede the general limit.

Safe GETs use bounded exponential backoff with jitter on HTTP 429, transient 5xx, and network failure. `Retry-After` is preserved. Writes, invitations, access changes, and other mutations are never blindly retried. All requests have cancellation-backed timeouts.

List tools expose WorkOS cursor parameters (`before`, `after`, `limit`) instead of automatically traversing unlimited pages. This avoids unnecessary API amplification.

## Error handling

Validation happens before provider calls. WorkOS 401/403 and other non-transient errors are surfaced without retry. HTTP status and `Retry-After` are retained in `WorkOSApiError`. Provider data is treated as untrusted content and cannot change connector policy.

## Security considerations

- Secret API key isolated in the transport layer.
- HTTPS is required even for an overridden API base URL.
- No arbitrary URL or generic API execution tool, reducing SSRF risk.
- Provider-returned user/org content is untrusted data, never instructions.
- Access grants and role changes are explicitly approved.
- External invitation email is explicitly approved.
- Destructive deletion and credential/session operations are intentionally excluded.
- Organization domain verification cannot be silently elevated by a tool call.

## Testing

`npm test` uses mocked HTTP only; no live credentials are required. Tests cover authentication configuration, HTTPS enforcement, credential isolation, write/high-risk permission denial, exact approvals, 429 retry, mutation non-retry, and repeated-array query encoding.

## Examples

See `examples/workflows.md`.

## Limitations

This package intentionally implements a focused subset of WorkOS. The official APIs also support Directory Sync, Audit Logs, Admin Portal, authentication/session operations, domain verification, API Keys, Events, and other workflows that are omitted to keep the agent surface reusable and safer. WorkOS's official MCP docs server is documentation-only and is not an operational fallback.
