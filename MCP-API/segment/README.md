# Twilio Segment MCP/API Connector

Reusable MCP server that exposes selected Twilio Segment Public API capabilities as stable, provider-scoped tools for AI agents and MCP clients.

## Upstream transport

This connector uses the official Segment Public API over HTTPS. During implementation, no official Segment MCP server was identified in Segment's official MCP/API documentation, so there is no unofficial MCP dependency and no upstream MCP credential forwarding.

Official sources researched:

- Segment Public API: https://docs.segmentapis.com/
- Getting Started / regional endpoints: https://docs.segmentapis.com/tag/Getting-Started/
- Authentication and token permissions: https://docs.segmentapis.com/tag/Authentication/
- Sources: https://docs.segmentapis.com/tag/Sources/
- Destinations: https://docs.segmentapis.com/tag/Destinations/
- Tracking Plans: https://docs.segmentapis.com/tag/Tracking-Plans/
- Catalog: https://docs.segmentapis.com/tag/Catalog/
- Request validation: https://docs.segmentapis.com/tag/Request-Validation/
- API versioning: https://docs.segmentapis.com/tag/Versioning/

## Runtime and architecture

Requires Node.js 20 or later. The MCP server uses stdio transport from the Model Context Protocol TypeScript SDK.

```text
MCP client
  -> Segment MCP server
     -> schema validation
     -> permission / approval gate
     -> credential-isolated REST client
     -> Segment Public API
```

Credentials remain in the connector environment and are never returned to the model.

## Authentication

Create a **Public API token** in the Segment Workspace settings. Segment Public API tokens are scoped to the Workspace in which they are created and inherit permissions configured for that token. Use the least-privileged token that can perform only the operations required by your deployment.

Set:

```text
SEGMENT_PUBLIC_API_TOKEN=<secret>
SEGMENT_REGION=us
```

`SEGMENT_REGION=us` uses `https://api.segmentapis.com`. `SEGMENT_REGION=eu` uses `https://eu1.api.segmentapis.com`.

Additional configuration:

```text
SEGMENT_REQUEST_TIMEOUT_MS=15000
SEGMENT_MAX_RETRIES=3
SEGMENT_APPROVAL_SECRET=<secret used only by the approval service>
SEGMENT_REQUIRE_WRITE_APPROVAL=true
```

Do not place real secrets in MCP prompts, source control, examples, or logs.

## Install and run

```bash
npm install
npm run build
npm start
```

A generic stdio MCP client can launch `node /absolute/path/to/MCP-API/segment/dist/server.js` with the environment variables above. Compatibility depends on the client supporting standard MCP stdio servers.

## Implemented tools

| Tool | Capability | Risk | Approval |
|---|---|---|---|
| `segment.workspace.get` | Read token-scoped Workspace | READ | No |
| `segment.source.list` | List Sources | READ | No |
| `segment.source.get` | Read Source | READ | No |
| `segment.source.create` | Create Source from catalog metadata | WRITE | Yes by default |
| `segment.destination.list` | List Destinations | READ | No |
| `segment.destination.get` | Read Destination | READ | No |
| `segment.destination.update` | Update writable Destination fields | WRITE | Yes by default |
| `segment.catalog.source.list` | List Source catalog integrations | READ | No |
| `segment.catalog.destination.list` | List Destination catalog integrations | READ | No |
| `segment.tracking_plan.list` | List Tracking Plans | READ | No |
| `segment.tracking_plan.get` | Read Tracking Plan | READ | No |
| `segment.tracking_plan.create` | Create Tracking Plan | WRITE | Yes |
| `segment.tracking_plan.update` | Update Tracking Plan | WRITE | Yes |
| `segment.tracking_plan.delete` | Delete Tracking Plan | DESTRUCTIVE | Yes |

Tracking Plan operations require the relevant Segment Protocols capability where Segment documents that requirement.

## Approval model

READ tools may execute automatically. WRITE tools require approval by default. DESTRUCTIVE tools always require explicit approval.

Approval tokens are HMAC-SHA256 values bound to both the exact tool name and exact payload. They should be produced by an external approval component that knows `SEGMENT_APPROVAL_SECRET`; the LLM should not know that secret. Changing a payload invalidates the prior approval.

`SEGMENT_REQUIRE_WRITE_APPROVAL=false` can disable approval for ordinary WRITE tools in tightly controlled environments, but it does not bypass DESTRUCTIVE approval.

## Validation and safety

- Resource identifiers are constrained to 1-255 characters and a conservative identifier character set.
- Source slugs are validated before network calls.
- Destination updates reject empty update payloads.
- Tracking Plan updates reject empty update payloads.
- There is no arbitrary `execute_any_request` or arbitrary URL tool.
- The API hostname is selected only from the fixed US/EU Segment endpoints, preventing user-controlled SSRF through tool parameters.
- Retrieved Segment data is treated as untrusted data and is returned as JSON; it does not alter connector policy or tool permissions.
- Credentials are only read inside connector configuration and request layers.

## Reliability and rate limits

The REST client applies a configurable timeout and supports cancellation through `AbortSignal` internally. GET/HEAD requests retry only on `429` and `5xx` responses or transient network failures, with bounded exponential backoff. Non-idempotent writes are not blindly retried.

When Segment returns throttling metadata, the connector preserves it in `SegmentApiError.retryAfter` using `Retry-After` or `X-RateLimit-Reset`. Segment documents endpoint-specific limits for some resources; callers should avoid polling aggressively and should respect returned throttling information.

The current list tools request one provider page and return Segment's pagination metadata unchanged. They intentionally do not fan out across every page, which avoids unexpected high-volume API usage. Clients can decide whether another page is necessary when a future tool version exposes a stable documented pagination contract.

## Error handling

Provider HTTP failures are mapped to `SegmentApiError`, which includes HTTP status, optional retry metadata, and parsed provider details. Authentication, authorization, and validation failures are not retried. Segment `422` validation responses remain visible to the caller as structured error details.

Common failures include:

- `401/403`: invalid token or insufficient token permissions.
- `404`: resource not found or unavailable to the token.
- `422`: provider-side input validation failure.
- `429`: rate limit exceeded.
- `5xx`: temporary Segment service failure; only idempotent reads are retried.

## Examples

See `examples/workflows.md` for read, write, and destructive workflows with expected permission boundaries.

## Tests

```bash
npm test
```

Unit tests use mocked HTTP responses and require no live Segment token. Coverage includes authentication configuration, region selection, permission classification, payload-bound approval, successful reads, throttling retries, provider validation errors, and the guarantee that failed writes are not blindly retried.

## Limitations

- No official Segment MCP transport is used because no official Segment MCP server was identified in the official documentation reviewed for this implementation.
- The connector intentionally implements a focused subset of the Public API rather than every Segment endpoint.
- Deletion/suppression Regulations, user access administration, billing, and other high-impact administrative operations are not exposed.
- Destination creation is not exposed because destination settings are catalog-specific and are safer to configure through a dedicated validated tool before adding it to this connector.
- Tracking Plan rule mutation is not implemented; only plan-level CRUD is exposed.
- List operations currently return one provider page rather than automatically traversing all pages.
