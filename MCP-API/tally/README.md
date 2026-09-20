# Tally MCP/API Connector

Reusable MCP server for safe Tally form and submission workflows.

## Official sources and transport
Tally provides an official remote MCP server at `https://api.tally.so/mcp`. Tally recommends OAuth for MCP and also supports API-key authentication. Official MCP capabilities include creating/editing forms, browsing/searching forms, and fetching submission data; Tally explicitly states MCP cannot delete forms or individual submissions. Tally also provides the official REST API at `https://api.tally.so`.

Sources: https://tally.so/help/mcp, https://tally.so/help/api, https://developers.tally.so/api-reference/introduction, https://tally.so/help/webhooks.

This connector exposes a fixed local MCP interface backed by the official REST API. The official MCP was preferred during research and is appropriate for broad interactive use; REST is used here because the package needs deterministic schemas, a small allowlist, explicit write approvals, version pinning, and credential isolation. No unofficial MCP dependency is used.

## Capabilities
Eight tools: workspace list/get; form list/search/get/create/update; submission list. Search is a bounded local filter over one API page. No delete, organization membership, invite, billing, or arbitrary HTTP tool is exposed.

## Architecture
MCP stdio -> strict Zod schema -> risk/approval policy -> Tally REST client -> official API. Provider content is wrapped under `untrustedProviderData` and must be treated as data, never instructions.

## Authentication
Set `TALLY_API_KEY`; requests use `Authorization: Bearer`. Credentials remain inside the connector and never enter MCP tool parameters. Tally's official remote MCP supports OAuth, but this REST-backed package intentionally does not store/refresh OAuth credentials.

## API version and environment
Tally versions its API by date. `TALLY_API_VERSION` defaults to `2025-02-01` and is sent as `tally-version`; review Tally's changelog before changing it. Copy `.env.example`. The API origin is pinned exactly to `https://api.tally.so` to prevent SSRF.

## Install and run
Node.js 20+: `npm install`, `npm run build`, `npm start`. The server uses MCP stdio and is reusable by clients that can launch stdio MCP processes.

## Permission model
READ tools may run automatically. Form creation and update are WRITE and require `approved:true` under the default policy. Tally form PATCH semantics replace the complete blocks array, so `tally.form.update` requires callers to provide the full blocks array; callers should first GET the form, modify the intended blocks, then submit the full set. DESTRUCTIVE operations are disabled/not registered.

## Rate limits, pagination, reliability
Tally documents 100 API requests/minute and recommends webhooks instead of polling for continuous submission sync. List endpoints use page/limit pagination and `hasMore`; this connector bounds limit to 100. Reads use bounded exponential backoff for 429/transient 5xx/network failures and honor `Retry-After`; retries are capped at five configured attempts beyond the initial request. Writes are not blindly retried. Abort-based request timeouts are configurable.

## Webhooks/events
Tally webhooks emit new form submissions. Endpoints must return 2xx within 10 seconds. Tally can sign requests with `Tally-Signature` using HMAC-SHA256 and retries failed delivery after documented backoff intervals. This MCP process does not host an inbound HTTP receiver, so webhook creation/receiving is intentionally unsupported here; production receivers must verify signatures before processing payloads.

## Errors and security
HTTP/provider failures map to `TallyError` with status and optional retry delay. Authentication, schema, host, pagination, and approval failures occur before mutation. Raw credentials are never logged or returned. Provider form/submission text is untrusted and cannot modify connector permissions. IDs are constrained, list sizes and block counts are bounded, no arbitrary URL exists, and no retrieved content is executed.

## Tests
`npm test` requires no live credentials. Tests cover auth configuration, tool registration, strict validation, approval denial, pagination, permission/provider errors, 429 retry, and no blind retry for writes.

## Limitations
This safety-focused connector is narrower than Tally's full REST API and official MCP. It does not expose deletes, submission deletion, webhook administration, organization membership/invites, workspace mutation, billing, or arbitrary block-specific convenience builders. Form blocks are passed as structured records and must conform to Tally's official block schema. Use the official MCP directly for broader interactive functionality when its permission model is acceptable.
