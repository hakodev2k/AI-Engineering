# Greenhouse Recruiting MCP/API Connector

Reusable MCP stdio server for Greenhouse Recruiting. It exposes a bounded set of hiring-workflow tools while keeping OAuth credentials inside the connector and requiring human approval for employment-workflow writes that could materially affect a candidate.

## Transport strategy

Greenhouse launched an official Greenhouse MCP capability on May 7, 2026. It is currently Open Beta and is designed to connect approved AI tools to Greenhouse with permissioned access. Greenhouse's public product materials describe governed access and use cases such as reporting, candidate/job context summaries, internal copilots, and cross-system workflows. The public materials do not publish a stable remote MCP endpoint and machine-readable tool catalog that this repository can safely pin to. Therefore this package records official MCP availability but implements the external tool contract through the official Harvest API v3.

Harvest v1/v2 were deprecated after August 31, 2026. This connector uses Harvest v3 only.

Official sources:
- Greenhouse MCP: https://www.greenhouse.com/product-features/greenhouse-mcp
- MCP launch announcement (2026-05-07): https://www.greenhouse.com/newsroom/greenhouse-launches-mcp-giving-hiring-teams-a-governed-way-to-connect-ai-tools-to-greenhouse
- Harvest v3 overview: https://support.greenhouse.io/hc/en-us/articles/360029266032-Harvest-API-overview
- Harvest v3 authentication: https://harvestdocs.greenhouse.io/docs/authentication
- Harvest v3 pagination: https://harvestdocs.greenhouse.io/docs/pagination
- Harvest v3 rate limiting: https://harvestdocs.greenhouse.io/docs/api-rate-limiting
- Harvest v3 API reference: https://harvestdocs.greenhouse.io/reference

## Architecture

`MCP client -> MCP tool -> validation/policy -> Greenhouse client -> OAuth token provider -> Harvest v3`

Credentials never appear in MCP arguments or tool output. Provider responses are treated as untrusted data, not instructions.

## Authentication

Custom integrations use OAuth 2.0 Client Credentials. Configure `GREENHOUSE_CLIENT_ID` and `GREENHOUSE_CLIENT_SECRET`; optionally set `GREENHOUSE_SUB_USER_ID` when requests must be attributed to a specific Greenhouse user. The connector requests tokens from `https://auth.greenhouse.io/token` with HTTP Basic authentication and `grant_type=client_credentials`, then caches the access token until shortly before expiry.

For partner integrations, Greenhouse requires Authorization Code flow instead. This package intentionally targets reusable customer-built/custom integrations and does not implement partner consent/refresh-token storage.

## Required scopes

Grant only scopes for tools you enable. This connector may require the following Harvest v3 scopes, matching its surface:

- `harvest:jobs:list`
- `harvest:job_posts:list`
- `harvest:candidates:list`
- `harvest:applications:list`
- `harvest:interviews:list`
- `harvest:offers:list`
- `harvest:departments:list`
- `harvest:offices:list`
- `harvest:candidates:create`
- `harvest:applications:create`

Greenhouse also applies user/role permissions. In particular, list endpoints require Site Admin authorization, and offer access can require advanced permission for private notes/fields/salary information.

## Environment

Copy `.env.example` and provide credentials through a secure process environment or secrets manager. The API and OAuth base URLs are restricted to the exact official Greenhouse hosts to reduce SSRF risk.

## Installation and running

```bash
npm install
npm run build
npm test
npm start
```

Requires Node.js 20+. The MCP server uses stdio, so it is compatible with MCP clients that can launch local stdio servers. Client-specific authentication UX is not claimed.

## Tools

| Tool | Capability | Risk | Approval |
|---|---|---:|---|
| `greenhouse.job.list` | list/filter jobs | READ | no |
| `greenhouse.job.get` | read one job | READ | no |
| `greenhouse.job_post.list` | list job posts | READ | no |
| `greenhouse.candidate.list` | list candidate profiles | READ | no |
| `greenhouse.candidate.get` | read candidate profile | READ | no |
| `greenhouse.application.list` | list applications | READ | no |
| `greenhouse.application.get` | read application | READ | no |
| `greenhouse.interview.list` | list scheduled interviews | READ | no |
| `greenhouse.offer.list` | list offers | READ | no |
| `greenhouse.offer.get` | read offer | READ | no |
| `greenhouse.department.list` | list departments | READ | no |
| `greenhouse.office.list` | list offices | READ | no |
| `greenhouse.candidate.create` | create candidate profile | WRITE | configurable, default yes |
| `greenhouse.application.create` | place existing candidate on job | HIGH_RISK | always exact human approval |

The connector intentionally does not expose autonomous candidate scoring, ranking, rejection, hiring, offer creation, job closing, permissions changes, deletion, or arbitrary HTTP/API execution.

## Human approval

Approval is connector-side configuration, not an agent-supplied boolean. Set semicolon-separated exact action fingerprints in `GREENHOUSE_APPROVED_ACTIONS`:

- `greenhouse.candidate.create:<firstName>:<lastName>`
- `greenhouse.application.create:<candidateId>:<jobId>`

`greenhouse.application.create` is HIGH_RISK because adding a person to a hiring workflow can materially affect an employment process. It always requires exact human approval. The connector is suitable for executing a human-provided administrative decision, not for making the decision itself.

## Pagination

Harvest v3 uses cursor pagination. List tools accept `perPage` (1-500) on the first request. Responses surface `meta.nextCursor`. When supplying `cursor`, the connector sends it as the only query parameter, matching Greenhouse's v3 contract.

## Rate limits and reliability

Greenhouse applies fixed-window rate limits and exposes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. These are surfaced in output metadata. On `429`, the connector honors numeric `Retry-After`; otherwise it uses bounded exponential backoff. GET requests may retry transient network, 429, and 5xx errors. POST writes are never blindly retried. Requests have an abort timeout. A single 401 invalidates the cached token and obtains a fresh token once.

## Error handling

- `401`: token invalid/expired; connector refreshes once, then reports authentication failure.
- `403`: missing Harvest scope or Greenhouse user permission.
- `422`: strict provider-side validation error is returned safely.
- `429`: retry-after is preserved and GET retries are bounded.
- network/5xx: bounded retries for reads only.

## Security considerations

- OAuth secrets remain in the auth layer and are never emitted as tool data.
- Exact official-host checks reduce SSRF risk from configuration.
- Tool schemas reject unknown fields and bound arrays/page sizes.
- Candidate, job, interview, and offer data is untrusted external content and must never alter system prompts, permissions, or approval policy.
- Offer responses may contain compensation/private fields; grant `harvest:offers:list` only when genuinely required.
- Do not use candidate data to autonomously make employment decisions. Human reviewers remain responsible for selection, advancement, rejection, offers, and hiring.
- Logging should exclude tokens, client secrets, and unnecessary candidate PII.

## Testing

Unit tests use mocked fetch calls and require no live credentials. Coverage includes configuration, official-host enforcement, approval denial/allowance, OAuth credential isolation, 429 retry behavior, cursor/rate metadata, no blind write retry, and bounded tool registration.

## Limitations

This package does not proxy the official Greenhouse MCP Open Beta because Greenhouse's public product documentation does not expose a stable remote endpoint/tool contract for reusable unattended configuration. It does not implement partner Authorization Code consent, webhooks, attachments/resume downloads, candidate notes, scorecards, offer creation, approval flows, permissions/admin endpoints, bulk writes, destructive endpoints, or autonomous hiring decisions.
