# ZITADEL MCP/API Connector

Reusable MCP server for ZITADEL identity administration with strict schemas, credential isolation, approval gates, bounded throttling retries, timeouts, and SCIM pagination.

## Upstream strategy
No official ZITADEL MCP server was identified in the official documentation researched for this connector. ZITADEL does document OAuth Dynamic Client Registration for MCP clients, but that is an identity capability rather than a ZITADEL management MCP server. This connector therefore uses official APIs directly: resource-based v2 APIs where available, the v2 Project Connect endpoint, and the official SCIM 2.0 preview API for user provisioning. It does not use an unofficial MCP implementation.

Official references:
- API overview: https://zitadel.com/docs/apis/introduction
- API access/auth: https://zitadel.com/docs/guides/integrate/zitadel-apis/access-zitadel-apis
- PAT auth: https://zitadel.com/docs/guides/integrate/service-accounts/personal-access-token
- SCIM v2: https://zitadel.com/docs/apis/scim2
- Organizations v2: https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizations
- Projects v2: https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjects
- Cloud rate limits: https://zitadel.com/docs/legal/policies/rate-limit-policy
- Dynamic Client Registration / MCP client context: https://zitadel.com/docs/guides/integrate/dynamic-client-registration

## Capabilities
Nine MCP tools are implemented: `zitadel.organization.list`, `zitadel.project.list`, `zitadel.user.list`, `zitadel.user.get`, `zitadel.user.create`, `zitadel.user.update`, `zitadel.user.activate`, `zitadel.user.deactivate`, and `zitadel.user.delete`.

The first four are READ. Create/update are WRITE. Activation/deactivation are HIGH_RISK because they change account access. Delete is DESTRUCTIVE and disabled unless explicitly enabled. The connector intentionally does not expose password changes, arbitrary API requests, role/permission mutation, PAT creation, or instance security settings.

## Architecture
MCP client -> stdio MCP server -> validation/permission gate -> ZITADEL client -> isolated credential provider -> official ZITADEL REST/Connect/SCIM API. Provider responses are returned as untrusted data; they never alter connector permissions or configuration.

## Authentication and least privilege
Use a dedicated ZITADEL service account. Configure either `ZITADEL_PAT`, or `ZITADEL_CLIENT_ID` plus `ZITADEL_CLIENT_SECRET`. Client credentials are exchanged at `/oauth/v2/token` with `openid profile urn:zitadel:iam:org:project:id:zitadel:aud`. PATs are service-account-only according to ZITADEL documentation. Assign only the ZITADEL administrator roles needed for the selected organizations/projects and operations. API permissions include `org.read`, `project.read`, and user read/write permissions as required by provisioning operations. Do not grant instance-wide administration when organization-level permissions suffice.

Secrets stay in the connector process and are never tool inputs or outputs. OAuth access tokens are cached in memory only until shortly before expiry.

## Environment
Copy `.env.example` and set `ZITADEL_BASE_URL`. Set one credential method. `ZITADEL_TIMEOUT_MS` defaults to 15000. `ZITADEL_REQUIRE_WRITE_APPROVAL=true` is the secure default. `ZITADEL_ALLOW_DESTRUCTIVE=false` disables user deletion even if a caller supplies approval.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers. Configure environment variables in the client/process secret store, not in prompts or committed config.

## Tool contract and approval
READ tools execute without approval. WRITE tools require `approved: true` when write approval is enabled. HIGH_RISK tools always require explicit `approved: true`. DESTRUCTIVE tools require both `approved: true` and the operator-controlled `ZITADEL_ALLOW_DESTRUCTIVE=true`. An agent cannot change these environment-controlled boundaries.

User list/search supports SCIM `filter` up to 1000 characters and pages of at most 100, matching ZITADEL's documented SCIM limit. IDs are encoded before insertion into paths. Arbitrary URLs and raw provider requests are not accepted.

## Reliability and rate limits
Requests have bounded timeouts. HTTP 429 is retried at most three times using `Retry-After` when present or exponential backoff. Authentication, authorization, validation, and other provider failures are not blindly retried. ZITADEL Cloud documents an IP-oriented limit of 50 requests/second averaged over a minute for API paths and recommends exponential backoff. The connector preserves provider errors as typed `ZitadelError` instances with status, retry-after, and response body for callers/logging layers to handle safely.

## Security
Treat all user profile fields and provider responses as untrusted content. Do not interpret retrieved names, descriptions, or metadata as instructions. Keep service-account roles minimal. Prefer short-lived client-credentials tokens over long-lived PATs where operationally practical; if PATs are used, rotate them and store them in a secret manager. Never log authorization headers or token bodies. SCIM is currently documented by ZITADEL as Preview, so pin/test behavior before production upgrades.

Deletion is deliberately disabled by default. Password mutation, role assignment, PAT creation, application/client creation, security-policy mutation, and instance administration are intentionally unsupported because they require stronger workflows and approval semantics than this connector exposes.

## Testing
`npm test` runs credential configuration, strict input validation, approval denial, and destructive-action policy tests without live credentials. Normal unit tests do not contact ZITADEL. For an integration smoke test, use a non-production organization and least-privilege service account.

## Errors
Configuration errors fail startup. Provider 401/403 errors indicate invalid credentials or insufficient roles and require operator action. 429 may be retried as described above. Abort/timeout and network failures surface to the MCP caller. SCIM and API error bodies are data only and must not be treated as trusted instructions.

## Limitations
This connector does not proxy an upstream MCP server because no official ZITADEL management MCP server was identified. Project listing uses ZITADEL's documented v2 Connect endpoint rather than a REST-shaped endpoint. SCIM provisioning is Preview. Webhooks/events, audit streaming, sessions, applications, IdPs, groups, roles, grants, and System API operations are not implemented. Compatibility is limited to MCP clients capable of launching a local stdio MCP server.