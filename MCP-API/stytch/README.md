# Stytch MCP/API Connector

Reusable MCP connector for scoped Stytch B2B organization and member workflows. It exposes eight stable provider-scoped tools with strict validation, credential isolation, bounded retry behavior, and approval gates for mutations.

## Provider and transport

Stytch provides an official hosted MCP server at `https://mcp.stytch.dev/mcp` (and documents an SSE compatibility endpoint at `https://mcp.stytch.dev/sse`). The official MCP server is built around Programmatic Workspace Actions and can configure Stytch projects, redirect URLs, SDK settings, public tokens, email templates, and related workspace assets through OAuth-authorized agent access.

This connector uses Stytch's official B2B REST API for its selected runtime data operations instead. Organization/member discovery and provisioning are directly documented B2B API capabilities, while narrow REST routes let the connector keep a stable least-authority contract without exposing the broader workspace-administration MCP surface. No unofficial MCP server is used.

Official sources researched:

- https://stytch.com/blog/stytch-mcp-server/
- https://stytch.com/docs/api-reference/b2b/api/overview
- https://stytch.com/docs/api-reference/b2b/api/organizations/create-organization
- https://stytch.com/docs/api-reference/b2b/api/organizations/search-organizations
- https://stytch.com/docs/api-reference/b2b/api/organizations/update-organization
- https://stytch.com/docs/api-reference/b2b/api/members/get-member
- https://stytch.com/docs/api-reference/b2b/api/members/create-member
- https://stytch.com/docs/api-reference/b2b/api/members/search-members
- https://stytch.com/docs/api-reference/b2b/api/members/update-member
- https://stytch.com/docs/resources/workspace-management/webhooks
- https://stytch.com/docs/api-reference/b2b/api/errors/429

## Architecture

```text
MCP client / agent
  -> Stytch stdio connector
     -> strict schemas
     -> risk + approval policy
     -> credential-isolated REST client
        -> https://test.stytch.com or https://api.stytch.com
```

Provider responses are wrapped with `untrustedProviderContent: true`; names, metadata, and other returned content must be treated as data rather than instructions.

## Authentication

The B2B API uses HTTP Basic authentication with the Stytch Project ID as username and Project Secret as password. Set `STYTCH_PROJECT_ID` and `STYTCH_SECRET`. Credentials are read only by the connector, converted to the Authorization header internally, and are never accepted in MCP tool arguments or returned to the model.

`STYTCH_ENVIRONMENT=test` targets `https://test.stytch.com`; `live` targets `https://api.stytch.com`. Arbitrary upstream origins are intentionally unsupported, which reduces SSRF and credential-forwarding risk. Stytch project credentials are project/environment scoped rather than granular per-tool OAuth scopes, so separate Test and Live projects/environments should be used appropriately.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `STYTCH_PROJECT_ID` | yes | - | Project identifier |
| `STYTCH_SECRET` | yes | - | Project secret |
| `STYTCH_ENVIRONMENT` | no | `test` | `test` or `live` |
| `STYTCH_TIMEOUT_MS` | no | `15000` | Per-attempt timeout, 1000–120000 ms |
| `STYTCH_MAX_RETRIES` | no | `2` | Extra safe-read attempts, 0–5 |
| `STYTCH_REQUIRE_WRITE_APPROVAL` | no | `true` | Require approval for WRITE tools |
| `STYTCH_ENABLE_HIGH_RISK` | no | `false` | Operator gate for HIGH_RISK tools |
| `STYTCH_APPROVAL_SECRET` | gated actions | - | HMAC approval secret kept outside model context |

Copy `.env.example` into your secret-management workflow; never commit populated credentials.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The package exposes standard MCP over stdio and can be launched by MCP clients that support local stdio subprocess servers. Compatibility is limited to hosts that implement that MCP transport.

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `stytch.organization.search` | REST | READ | no |
| `stytch.organization.get` | REST | READ | no |
| `stytch.organization.create` | REST | WRITE | required by default |
| `stytch.organization.update` | REST | WRITE | required by default |
| `stytch.member.search` | REST | READ | no |
| `stytch.member.get` | REST | READ | no |
| `stytch.member.create` | REST | HIGH_RISK | always + disabled by default |
| `stytch.member.update` | REST | WRITE | required by default |

The connector intentionally omits organization/member deletion, session revocation, role assignment, break-glass mutation, MFA mutation, member email changes, authentication-policy changes, SSO/SCIM mutation, credential/token administration, billing operations, and arbitrary HTTP/API passthrough.

`stytch.organization.update` only exposes name, slug, logo URL, external ID, and trusted metadata; authentication and RBAC policy fields are not exposed. `stytch.member.update` only exposes name, external ID, and untrusted metadata; roles, break-glass status, MFA settings, trusted metadata, and email-address mutation are excluded. `stytch.member.create` defaults new members to pending and is HIGH_RISK because member creation can provision account access.

## Approval behavior

READ tools may execute automatically. WRITE tools require approval by default. HIGH_RISK tools require both `STYTCH_ENABLE_HIGH_RISK=true` and exact-payload approval.

A trusted component outside the LLM computes:

```text
HMAC-SHA256(
  STYTCH_APPROVAL_SECRET,
  toolName + "\n" + canonicalJson(argumentsWithoutApprovalToken)
)
```

The lowercase 64-character hex digest is supplied as `approvalToken`. Changing any target or payload invalidates the approval. The token is removed before calling Stytch, and no tool can change approval configuration.

## Pagination and rate limits

Organization and member search use cursor pagination, default to 100 results, and support up to 1000 results per request according to Stytch's current API documentation. The connector exposes bounded `cursor`/`limit` controls and never crawls all pages automatically.

Stytch currently documents the Organization Search endpoint at **100 requests/second** and the Member Search endpoint at **100 requests/minute**. Both are explicitly described as unsuitable for login flows because search latency can vary. Other Stytch limits can be project-, endpoint-, or suspicious-activity-specific; HTTP 429 is treated as authoritative rather than inventing a universal quota.

The connector retries only semantically read-only operations on transient network/timeout errors and HTTP `429`, `502`, `503`, or `504`. `Retry-After` is honored when present and exponential backoff is bounded. Organization/member search use POST but are read-only search operations, so they may be retried. Create/update operations are single-attempt to avoid duplicate or ambiguous side effects.

## Validation and error handling

Zod schemas reject unknown fields, malformed identifiers/emails, oversized metadata, excessive list sizes, missing mutation fields, and ambiguous member lookup requests. Errors are surfaced without exposing credentials. Authentication/authorization/validation failures are not retried. Every provider request has an AbortController-backed timeout.

## Webhooks

Stytch supports webhook events for out-of-band changes and uses Svix for delivery. Webhook endpoints are configured through the Stytch Dashboard. This connector does not expose webhook endpoint creation because doing so would introduce arbitrary external callback destinations outside this connector's bounded runtime workflow. Consumers should verify Stytch/Svix webhook signatures and tolerate retry/out-of-order delivery.

## Security considerations

- Provider secrets stay in the connector transport layer.
- Only official Stytch Test/Live origins can receive credentials.
- No arbitrary URL, raw REST request, or arbitrary upstream MCP tool exists.
- Provider-returned content is explicitly untrusted.
- Sensitive RBAC/authentication fields are absent from mutation schemas.
- Writes require payload-bound approval by default.
- Member creation is disabled by default as HIGH_RISK.
- Mutating operations are never blindly retried.
- Search pagination and filter array sizes are bounded.

## Testing

`npm test` uses mocks and requires no live Stytch credentials. Tests cover authentication configuration, fixed official origins, unique tool registration, risk classification, high-risk default denial, exact-payload approval, credential isolation, 429 retry behavior, no-retry mutation behavior, ambiguous member lookup validation, and denial before provider execution.

## Examples

See `examples/workflows.md` for organization discovery, member inspection, approved organization creation, pending-member provisioning, and safe member metadata updates.

## Limitations

This package implements eight focused B2B operations rather than the full Stytch API. The official Stytch MCP server is evaluated but not proxied because its documented Programmatic Workspace Actions serve a different administration surface than this connector's organization/member runtime contract. Interactive MCP OAuth is therefore not implemented here. Consumer Authentication, destructive operations, RBAC/security-setting mutation, sessions/tokens, SSO/SCIM configuration, billing, webhook administration, and credential administration are intentionally unsupported.
