# Stytch MCP/API Connector

Reusable MCP connector for scoped Stytch B2B organization and member workflows. The connector exposes eight stable, provider-qualified tools, keeps Stytch credentials inside the transport layer, validates all inputs, separates read and write authority, and requires explicit approval for account provisioning.

## Transport strategy

Stytch has an official hosted MCP server at `https://mcp.stytch.dev/mcp` (with an SSE compatibility endpoint documented at `https://mcp.stytch.dev/sse`). Stytch describes that server as an OAuth-authorized interface over Programmatic Workspace Actions for configuring Stytch projects, redirect URLs, SDK settings, public tokens, email templates, and related workspace assets.

This connector instead uses Stytch's official B2B REST API for the selected runtime data operations. Organization/member discovery and account provisioning are directly documented B2B API capabilities, and using narrow REST routes lets this package enforce deterministic schemas and local approval gates without exposing the broader workspace-administration MCP surface. No unofficial MCP implementation is used.

Official sources researched for this connector:

- Stytch MCP launch and supported workspace-action model: https://stytch.com/blog/stytch-mcp-server/
- B2B API overview/authentication: https://stytch.com/docs/api-reference/b2b/api/overview
- Create Organization: https://stytch.com/docs/api-reference/b2b/api/organizations/create-organization
- Search Organizations: https://stytch.com/docs/api-reference/b2b/api/organizations/search-organizations
- Update Organization: https://stytch.com/docs/api-reference/b2b/api/organizations/update-organization
- Get Member: https://stytch.com/docs/api-reference/b2b/api/members/get-member
- Create Member: https://stytch.com/docs/api-reference/b2b/api/members/create-member
- Search Members: https://stytch.com/docs/api-reference/b2b/api/members/search-members
- Update Member: https://stytch.com/docs/api-reference/b2b/api/members/update-member
- Webhooks: https://stytch.com/docs/resources/workspace-management/webhooks
- HTTP 429 guidance: https://stytch.com/docs/api-reference/b2b/api/errors/429

## Architecture

```text
MCP client / agent
    -> local stdio MCP connector
       -> strict schemas
       -> risk + payload-bound approval policy
       -> credential-isolated Stytch client
          -> https://test.stytch.com or https://api.stytch.com
```

Stytch responses are wrapped with `untrustedProviderContent: true`. Organization/member names, metadata, and other provider-returned text are data and must never be interpreted as instructions that alter system behavior, credentials, or permissions.

## Authentication

Stytch B2B API requests use HTTP Basic authentication with the Stytch Project ID as the username and Project Secret as the password. Configure:

```text
STYTCH_PROJECT_ID=
STYTCH_SECRET=
```

The connector constructs the Authorization header internally. Neither credential is accepted as an MCP argument or returned in a tool result.

`STYTCH_ENVIRONMENT=test` targets `https://test.stytch.com`; `live` targets `https://api.stytch.com`. Arbitrary API origins are intentionally unsupported, reducing SSRF and credential-forwarding risk.

Stytch's project credentials are project/environment scoped rather than per-tool OAuth scopes. Use separate Stytch Test and Live environments and give this connector only the project credential for the intended environment. Never expose Project Secrets to browser code, prompts, logs, or source control.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `STYTCH_PROJECT_ID` | yes | - | Stytch project identifier |
| `STYTCH_SECRET` | yes | - | Stytch project secret |
| `STYTCH_ENVIRONMENT` | no | `test` | `test` or `live`; selects an official Stytch origin |
| `STYTCH_TIMEOUT_MS` | no | `15000` | Per-attempt timeout, 1–120 seconds |
| `STYTCH_MAX_RETRIES` | no | `2` | Extra attempts for safe reads, 0–5 |
| `STYTCH_REQUIRE_WRITE_APPROVAL` | no | `true` | Requires approval for WRITE tools |
| `STYTCH_ENABLE_HIGH_RISK` | no | `false` | Enables HIGH_RISK tools after operator review |
| `STYTCH_APPROVAL_SECRET` | for gated actions | - | HMAC secret held outside model context |

See `.env.example`. Do not commit populated secrets.

## Installation and running

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run build
npm test
npm start
```

The connector speaks MCP over stdio. It can be launched by MCP clients that support local stdio servers, including compatible developer clients and custom MCP agents. Product-specific compatibility is not claimed where a host cannot launch stdio servers.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `stytch.organization.search` | B2B REST | READ | no |
| `stytch.organization.get` | B2B REST | READ | no |
| `stytch.organization.create` | B2B REST | WRITE | required by default |
| `stytch.organization.update` | B2B REST | WRITE | required by default |
| `stytch.member.search` | B2B REST | READ | no |
| `stytch.member.get` | B2B REST | READ | no |
| `stytch.member.create` | B2B REST | HIGH_RISK | always + disabled by default |
| `stytch.member.update` | B2B REST | WRITE | required by default |

The package deliberately omits deletion, session revocation, role assignment, break-glass mutation, MFA mutation, member email changes, authentication-policy changes, SSO/SCIM configuration mutation, secret/token administration, and arbitrary API requests.

### Bounded organization mutation

`stytch.organization.update` only exposes name, slug, logo URL, external ID, and trusted metadata. It does not expose Stytch organization authentication settings such as allowed auth methods, MFA policy, JIT provisioning, email invitation policy, implicit RBAC role assignment, or SSO defaults.

### Bounded member mutation

`stytch.member.update` only exposes name, external ID, and untrusted metadata. Although Stytch's API supports more sensitive member mutation fields, this connector intentionally excludes roles, `is_breakglass`, MFA enrollment/phone changes, trusted metadata, and email-address mutation from the tool contract.

`stytch.member.create` is HIGH_RISK because creating a B2B member can provision account access. The connector defaults `createAsPending` to true, requires `STYTCH_ENABLE_HIGH_RISK=true`, and always requires exact-payload human approval.

## Approval model

READ operations execute automatically. WRITE operations require approval by default. HIGH_RISK operations require both an operator-controlled feature gate and approval.

A trusted approval component outside the LLM computes:

```text
HMAC-SHA256(
  STYTCH_APPROVAL_SECRET,
  toolName + "\n" + canonicalJson(argumentsWithoutApprovalToken)
)
```

The resulting lowercase 64-character hex digest is supplied as `approvalToken`. Any change to the target organization/member or payload invalidates the approval. The connector strips the approval token before calling Stytch. No MCP tool can change the feature gate or approval secret.

## Pagination and search

Stytch's organization and member search endpoints use cursor pagination. Both document a default page size of 100 and a maximum of 1000. This connector exposes explicit `cursor` and bounded `limit` fields and never automatically crawls all pages.

Organization search supports exact Organization ID and slug filters. Member search always requires one or more explicit organizations, preventing an unbounded project-wide member scan through this connector. `stytch.member.get` requires exactly one member identifier or email address.

Stytch warns that organization/member search endpoints are not designed for login flows and currently documents a 100 requests/second limit for these search endpoints. Use direct identifiers in authentication-critical paths instead of search.

## Reliability and rate limits

All upstream calls have cancellation-backed timeouts. Safe read operations are retried only on network/timeout failures and transient HTTP statuses `429`, `502`, `503`, and `504`, with bounded exponential backoff. `Retry-After` is honored when present.

Although the two search APIs use POST, their semantics are read-only; the connector marks those requests explicitly retryable. Mutating POST/PUT operations are single-attempt and are never blindly retried, preventing duplicate organization/member creation or ambiguous repeated updates.

Stytch uses HTTP 429 for throttling and recommends exponential backoff. Stytch also applies project and suspicious-activity rate limits; provider responses remain authoritative instead of this connector inventing one global quota.

## Error handling

Invalid schemas and approval failures stop before any provider call. Provider errors preserve HTTP status and retry timing where available while bounding returned error text. Authentication/permission/validation failures are not retried. Timeouts produce an explicit connector error.

## Webhooks

Stytch supports webhooks, powered by Svix, for out-of-band changes such as organization and member events. Webhook endpoints are configured through the Stytch Dashboard. This connector does not expose webhook endpoint creation because the selected B2B runtime workflow does not require an arbitrary external callback destination. Applications receiving Stytch webhooks should verify them using Stytch/Svix guidance, treat payloads as untrusted, and tolerate retries/out-of-order delivery.

## Security considerations

- Project credentials remain only in the connector's transport layer.
- API origins are fixed to official Test/Live Stytch hosts; callers cannot supply URLs.
- There is no generic HTTP or arbitrary MCP passthrough tool.
- Tool schemas are strict and bound sizes for identifiers, metadata, arrays, cursors, and pages.
- Sensitive auth/RBAC fields are absent from update schemas.
- Provider content is explicitly labeled untrusted.
- Writes use payload-bound approvals by default.
- Member provisioning is default-off HIGH_RISK.
- Mutations are never blindly retried.
- Search is bounded and explicit about organization scope.

## Testing

```bash
npm test
```

Unit tests require no live Stytch credentials. They cover required authentication configuration, fixed official environment origins, tool registration, risk classification, default high-risk denial, payload-bound approval, credential isolation, bounded throttling retry, no-retry mutation behavior, ambiguous member lookup validation, and denial-before-provider-call behavior.

## Examples

See `examples/workflows.md` for discovery, member inspection, organization creation, pending-member provisioning, and safe metadata update examples.

## Limitations

- This connector implements eight focused B2B operations, not Stytch's full API.
- Stytch's official hosted MCP server is evaluated but not proxied because its documented surface is Programmatic Workspace Actions rather than the narrow organization/member runtime contract selected here.
- Interactive OAuth for `mcp.stytch.dev` is therefore not implemented by this wrapper.
- No Consumer Authentication APIs are exposed.
- No delete, role/RBAC mutation, break-glass mutation, MFA mutation, session/token operation, SSO/SCIM mutation, billing, or credential-management tool is exposed.
- Search performance and provider limits are controlled by Stytch; this connector only bounds its own request behavior.
