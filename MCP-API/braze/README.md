# Braze MCP/API Connector

Reusable Node.js MCP connector for Braze customer-engagement workflows.

## Transport strategy

Braze provides an official MCP Server. Current Braze material describes it as a managed integration exposing dozens of API functions across campaign, Canvas, KPI and related categories. Prefer that official MCP for conversational read-only discovery/analytics where available. This package deliberately uses Braze's official REST API for its stable scoped tool contract, including write operations, so callers are not given a generic arbitrary-request primitive. The earlier MCP release was read-only; write/send behavior here therefore remains explicit REST and approval-gated.

Official sources: Braze MCP Server product documentation/articles; Braze REST API documentation and endpoint-specific rate-limit documentation. Consult the current Braze dashboard/docs for your REST instance hostname and API-key permissions because limits and permissions vary by endpoint/workspace.

## Capabilities

Ten tools are implemented: `braze.campaign.list`, `braze.campaign.details`, `braze.canvas.list`, `braze.canvas.details`, `braze.segment.list`, `braze.segment.details`, `braze.user.export`, `braze.user.track`, `braze.campaign.trigger`, and `braze.canvas.trigger`.

The first seven are READ. `user.track` is WRITE. Triggering a campaign or Canvas can send external communications and is HIGH_RISK. No delete/destructive tool is exposed.

## Authentication and least privilege

Create a Braze REST API key with only permissions needed by the tools you intend to enable. Set `BRAZE_API_KEY` and your workspace-specific `BRAZE_REST_ENDPOINT`. Credentials stay in the connector process and are only placed in the Authorization header; they are never returned to MCP callers. Braze API keys are permission-scoped rather than OAuth scopes for this REST usage.

## Install and run

Requires Node.js 20+.

```sh
npm install
cp .env.example .env
npm start
```

Configure the resulting stdio process in an MCP-compatible client. Compatibility depends on the client supporting standard MCP stdio servers.

## Permission and approval model

READ calls may run automatically. WRITE and HIGH_RISK calls require explicit approval; `BRAZE_APPROVE_WRITES=true` can provide an operator-level approval policy for ordinary writes, but high-risk send tools still expose and expect an `approved` argument in their strict schema. Destructive operations are intentionally absent. An agent cannot change API-key permissions.

## Reliability and rate limits

Requests have bounded timeouts and cancellation propagation. GET/read requests retry HTTP 429 and 5xx failures at most three times after the initial attempt using bounded exponential backoff and honoring `Retry-After`. Mutating and send operations set `retry:false` to avoid duplicate writes/messages. Braze rate limits are endpoint-specific; the connector preserves 429 status and Retry-After rather than inventing a universal quota. List endpoints expose bounded page inputs.

## Security

The REST endpoint is restricted to HTTPS Braze domains to reduce SSRF risk. IDs and pagination are validated. No arbitrary URL/API-request tool exists. Provider data is returned with `untrusted_provider_data: true`; retrieved text is data, never instructions. Secrets are not logged or returned. High-risk external messaging requires approval. Use separate least-privilege keys for different agent roles where possible.

## Error handling

Provider HTTP failures map to `BrazeError` with status and retry metadata. Authentication/permission/validation failures are not retried. Network aborts surface safely. MCP handlers return structured errors without credentials.

## Testing

```sh
npm test
```

Tests use mocked fetch responses and require no live credentials. They cover tool registration, auth configuration, SSRF endpoint validation, reads, approval denial, non-retry of writes, input validation, and throttling/error mapping.

## Limitations

This connector does not proxy every Braze endpoint, does not manage API keys/permissions, does not delete users/assets, and does not attempt to reproduce Braze's managed MCP analytics surface. Endpoint availability depends on your Braze plan, REST cluster, API-key permissions, and whether the referenced campaign/Canvas is configured for API triggering. For current endpoint quotas and payload limits, follow Braze's endpoint-specific REST documentation.
