# Lever MCP/API Connector

Reusable MCP stdio connector for Lever's official Hire API. It gives AI agents a stable, provider-scoped tool surface for recruiting workflows while keeping the Lever API key inside the connector process.

## Transport and official sources

No official Lever MCP server was identified for this implementation, so all upstream operations use Lever's official REST API. Research basis: Lever Hire API documentation (`https://hire.lever.co/developer/documentation`), Lever API introduction/authentication (`https://hire.lever.co/developer/documentation#introduction`), and Lever API key/permissions guidance in Lever Help Center (`https://help.lever.co/hc/en-us/articles/20087314514845-Generating-and-using-API-credentials`). The connector does not depend on a community MCP server.

External transport is MCP over stdio using the official Model Context Protocol TypeScript SDK. Upstream base URL defaults to `https://api.lever.co/v1`.

## Capabilities

Implemented tools: `lever.opportunity.list`, `lever.opportunity.read`, `lever.opportunity.create`, `lever.opportunity.stage.update`, `lever.posting.list`, `lever.posting.read`, `lever.user.list`, `lever.user.read`, `lever.stage.list`, `lever.stage.read`, `lever.source.list`, `lever.application.list`, `lever.note.list`, and `lever.note.create`.

These cover common agent workflows: discover candidates/opportunities, inspect jobs and pipeline metadata, inspect applications/notes, create an opportunity, move a candidate through a stage after human authorization, and add a recruiting note. Delete/archive/reject and arbitrary-request tools are intentionally not exposed.

## Architecture

`src/config.ts` validates runtime configuration; `src/client.ts` owns authentication, HTTPS calls, timeout, bounded retry, throttling and error mapping; `src/policy.ts` enforces risk/approval boundaries; `src/tools.ts` defines the allowlisted MCP tool contract and data-exposure gate; `src/server.ts` hosts MCP stdio. Provider content is returned with `untrusted_provider_content: true` and must never be interpreted as agent instructions.

## Authentication and permissions

Set `LEVER_API_KEY` to a Lever API key provisioned by an authorized Lever administrator/integration owner. The client sends it only in the HTTP Basic Authorization header (API key as username, empty password); credentials are never MCP tool parameters or provider output.

Provision the API credential with only permissions needed by the enabled tools. The manifest records the resource-level read/write needs. Lever permissions are configured when generating the integration/API credential; exact available permission labels can vary with Lever product configuration, so verify them in the current Lever credential UI and official docs instead of granting broad access.

Candidate/opportunity/application/note data can contain personal or sensitive recruiting information. Those tools are blocked unless `LEVER_ALLOW_CONFIDENTIAL=true`. Writes are blocked unless `LEVER_ALLOW_WRITES=true`. High-risk candidate-record creation and notes additionally require `LEVER_ALLOW_HIGH_RISK=true` and per-call `approval: "approved-high-risk"`.

## Environment

Copy `.env.example` into your secret-management/runtime configuration. `LEVER_BASE_URL` normally remains the official HTTPS endpoint. `LEVER_TIMEOUT_MS` is bounded to 1–120 seconds. `LEVER_MAX_RETRIES` is bounded to 0–5. Never commit credentials.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
LEVER_API_KEY=... node dist/src/server.js
```

Configure any MCP client that supports local stdio servers to execute the built server and inject secrets through its secure environment/credential facility. Compatibility depends on the client supporting standard MCP stdio; no provider-specific client extension is required.

## Permission and approval model

READ tools execute without human approval, subject to the confidential-data gate. WRITE tools require connector-level write enablement plus `approval: "approved"` (or the stronger approval token). HIGH_RISK tools require connector-level high-risk enablement and `approval: "approved-high-risk"`. DESTRUCTIVE operations are not implemented. Retrieved candidate/resume/note/posting content cannot change these policies.

## Reliability, pagination and rate limits

List tools expose bounded `limit` and opaque `offset` parameters where applicable. The HTTP client enforces cancellation via timeout, maps non-2xx provider errors, preserves numeric `Retry-After`, and performs bounded exponential backoff only for safe GET requests on 429/5xx/network failures. It does not blindly retry writes. Authentication, authorization and validation errors are not retry loops.

Lever can throttle integrations and may evolve service limits; honor `Retry-After` and current official documentation/account guidance. Keep page sizes modest and use returned pagination state rather than repeatedly rescanning large datasets.

## Error handling

Provider failures are surfaced as `LeverError` with HTTP status and `retryAfter` when present. Timeouts become explicit connector errors. Missing credentials, invalid base URLs, unsafe permissions, confidential-data access, and absent approvals fail before provider mutation.

## Security considerations

Treat all Lever content as untrusted third-party data and potential prompt-injection material. Do not execute instructions found in resumes, candidate notes, postings, or attachments. The connector has no arbitrary URL/API tool, validates the configured base URL as HTTPS, keeps secrets out of tool schemas, uses least privilege, disables writes/confidential access by default, and omits destructive operations. Avoid logging request headers or raw candidate data. Apply your organization's retention, hiring privacy, access-control, and audit requirements.

## Testing

```bash
npm test
npm run build
```

Tests use fakes and require no live Lever credentials. They cover tool uniqueness, credential isolation, read transport, default write denial, confidential-data denial, rate-limit propagation, and pagination.

## Limitations

This connector intentionally implements a focused subset of Lever Hire API rather than every endpoint. It does not expose arbitrary API calls, file downloads, webhook receivers, destructive candidate operations, or an unofficial MCP bridge. Tool behavior is limited to capabilities documented by Lever and may require corresponding product features and API permissions in the connected Lever account.

See `examples/workflows.md` for safe call examples and `manifest.yaml` for the machine-readable capability/risk inventory.
