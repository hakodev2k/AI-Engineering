# Cronitor MCP/API Connector

Reusable MCP server that exposes a constrained, provider-scoped interface to Cronitor. The connector uses Cronitor's official HTTPS APIs directly; no official Cronitor upstream MCP server was found in the current official documentation reviewed for this implementation.

## Supported transport

- External interface: MCP over stdio.
- Upstream management transport: Cronitor REST API at `https://cronitor.io/api`.
- Upstream telemetry transport: Cronitor Telemetry API at `https://cronitor.link`.
- API version: `2025-11-28` via `Cronitor-Version` header.
- SDK dependency: only the official Model Context Protocol TypeScript SDK is used for the local MCP server. Provider operations use `fetch` against Cronitor's documented API rather than an unofficial provider SDK/MCP implementation.

Official references used during implementation:

- https://cronitor.io/docs/api
- https://cronitor.io/docs/monitors-api
- https://cronitor.io/docs/telemetry-api
- https://cronitor.io/docs/issues-api
- https://cronitor.io/docs/statuspages-api

## Capabilities

The connector intentionally exposes workflow-oriented operations instead of unrestricted HTTP access:

| Tool | Transport | Required scope | Risk | Approval |
| --- | --- | --- | --- | --- |
| `cronitor.monitor.list` | REST | `monitor:read` | READ | no |
| `cronitor.monitor.get` | REST | `monitor:read` | READ | no |
| `cronitor.monitor.create` | REST | `monitor:write` | WRITE | configurable, default yes |
| `cronitor.monitor.update` | REST | `monitor:write` | WRITE | configurable, default yes |
| `cronitor.monitor.pause` | REST | `monitor:write` | WRITE | configurable, default yes |
| `cronitor.monitor.delete` | REST | `monitor:write` | DESTRUCTIVE | strong approval + feature flag |
| `cronitor.issue.list` | REST | `issue:read` | READ | no |
| `cronitor.issue.get` | REST | `issue:read` | READ | no |
| `cronitor.issue.create` | REST | `issue:write` | HIGH_RISK | always |
| `cronitor.issue.update` | REST | `issue:write` | HIGH_RISK | always |
| `cronitor.issue.delete` | REST | `issue:write` | DESTRUCTIVE | strong approval + feature flag |
| `cronitor.statuspage.list` | REST | `statuspage:read` | READ | no |
| `cronitor.statuspage.get` | REST | `statuspage:read` | READ | no |
| `cronitor.statuspage.create` | REST | `statuspage:write` | HIGH_RISK | always |
| `cronitor.statuspage.update` | REST | `statuspage:write` | HIGH_RISK | always |
| `cronitor.statuspage.delete` | REST | `statuspage:write` | DESTRUCTIVE | strong approval + feature flag |
| `cronitor.telemetry.send` | Telemetry API | `monitor:telemetry` | WRITE | configurable, default yes |

Issue and status-page mutations are `HIGH_RISK` because they may communicate incident information externally or alter access/public visibility.

## Architecture

```text
MCP client
  -> src/server.ts
  -> src/tools.ts            strict schemas + stable tool contracts
  -> src/policy.ts           risk/approval/destructive boundaries
  -> src/client.ts           auth, timeout, retry, error/rate-limit handling
  -> Cronitor REST / Telemetry APIs
```

Credentials remain in `src/config.ts`/`src/client.ts`; raw keys are never returned to the model. Provider response bodies are wrapped with `untrusted_provider_content: true` to reinforce that retrieved text/data is not trusted instruction material.

## Authentication and least privilege

Cronitor's REST API uses API-key authentication through HTTP Basic Auth: the API key is the username and the password is empty. All management requests use HTTPS.

Create a custom Cronitor API key with only the scopes needed for enabled workflows:

- `monitor:read` for monitor discovery/read.
- `monitor:write` for monitor create/update/pause/delete.
- `issue:read` for issue retrieval.
- `issue:write` for issue create/update/delete.
- `statuspage:read` for status-page retrieval.
- `statuspage:write` for status-page create/update/delete.
- `monitor:telemetry` for telemetry events.

A separate telemetry-only key is recommended for `CRONITOR_TELEMETRY_KEY`. Cronitor's telemetry key is embedded in the telemetry URL by provider design; the connector isolates that URL inside the client and never exposes it in tool output.

Cronitor documents that its default SDK Integration key has broad resource access. For agent deployments, prefer custom least-privilege keys instead of the broad default key.

## Environment variables

Copy `.env.example` into your secret-management flow; do not commit a populated `.env` file.

```text
CRONITOR_API_KEY=
CRONITOR_TELEMETRY_KEY=
CRONITOR_API_BASE=https://cronitor.io/api
CRONITOR_TELEMETRY_BASE=https://cronitor.link
CRONITOR_API_VERSION=2025-11-28
CRONITOR_REQUIRE_WRITE_APPROVAL=true
CRONITOR_ENABLE_DESTRUCTIVE=false
CRONITOR_TIMEOUT_MS=15000
```

`CRONITOR_API_KEY` is required to start. `CRONITOR_TELEMETRY_KEY` is required only for `cronitor.telemetry.send`.

## Install and run

```bash
npm install
npm run build
npm start
```

The server communicates over stdio and can be launched by MCP clients that support local stdio servers. Configure environment variables in the MCP client's secret/environment facility; never place keys in model prompts.

Example generic MCP configuration shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/cronitor/dist/src/server.js"],
  "env": {
    "CRONITOR_API_KEY": "${secret:CRONITOR_API_KEY}",
    "CRONITOR_TELEMETRY_KEY": "${secret:CRONITOR_TELEMETRY_KEY}"
  }
}
```

The `${secret:...}` syntax above is illustrative; use the secret-reference mechanism provided by your MCP host.

## Reliability and rate limits

Management API requests use a bounded three-attempt retry strategy only for transient `429` and `5xx` failures/network failures. Authentication, permission, validation and other normal `4xx` errors are not retried. Mutating requests are invoked with retries disabled to avoid duplicating non-idempotent operations.

When a `429` response provides `Retry-After`, the connector preserves and uses the value for retry delay. Other transient retries use bounded exponential backoff. Every request has an abort timeout controlled by `CRONITOR_TIMEOUT_MS`.

Cronitor documents API rate limiting generally and returns `429` on excess requests. The Status Pages API documentation specifies 1000 authenticated requests/hour. The Telemetry API documents per-monitor limits of 10 requests/second with burst capacity and per-IP limits of 50 requests/second with burst capacity. Callers should batch reads and avoid polling more frequently than operationally necessary.

## Pagination and bounded inputs

List tools expose documented filter/query parameters without an arbitrary raw-request escape hatch. Arrays, messages, query text, request headers and body lengths are bounded by schemas to reduce abuse and accidental oversized calls. Issue listing includes a page parameter. Provider pagination metadata is returned unchanged so callers can explicitly request subsequent pages.

## Security

- No generic `execute_any_api_request` capability exists.
- API bases default to fixed official HTTPS hosts. If overridden for testing/private gateway use, the administrator owns that trust decision.
- Resource keys are validated before being inserted into URL paths, preventing path traversal.
- Check-monitor request URLs are validated as URLs. Creating a Cronitor check causes Cronitor infrastructure to make the configured network request; therefore monitor creation is treated as an approved write and should be restricted by organizational policy to approved targets.
- Writes require `approved=true` by default.
- Incident/status-page writes always require explicit human approval.
- Delete operations require both `approved=true` and `CRONITOR_ENABLE_DESTRUCTIVE=true`.
- Retrieved provider content is untrusted data, never instructions, and cannot modify connector policy.
- Credentials are never included in MCP responses or examples.
- The connector does not automatically discover or trust upstream tools because it does not use an upstream MCP server.
- Sensitive values should not be placed in monitor names, notes, incident messages or logs unless intended to be stored in Cronitor.

## Error handling

Provider HTTP errors are surfaced with their status and body. Typical meanings include:

- `400`: invalid input/provider validation failure.
- `401`: missing/invalid API key.
- `403`: key lacks required scope.
- `404`: resource not found.
- `429`: throttled; `Retry-After` is retained when provided.
- `5xx`: transient provider error; read operations may be retried within the bounded policy.

Timeouts produce a connector-level timeout error. Destructive calls fail locally before any provider call unless the destructive feature flag is enabled.

## Testing

Tests require no live Cronitor credentials.

```bash
npm test
```

The suite covers authentication/version headers, non-retryable validation failures, bounded transient retries, telemetry transport, safe approval defaults, destructive-operation denial, path validation, and registration of every documented MCP tool.

## Limitations

- No official Cronitor MCP server was identified in the official materials reviewed; this package wraps documented Cronitor APIs behind a local MCP interface.
- The connector implements a focused set of monitor, issue, status-page and telemetry workflows, not every Cronitor endpoint. Groups, integrations, notification lists, maintenance windows, metrics, sites and API-key administration are deliberately not exposed in this version.
- Status-page component CRUD is supported by Cronitor's API but intentionally omitted to keep the first connector surface focused; monitor/status-page association can still be configured through supported Cronitor workflows outside this package.
- Private/password-protected page secret fields are intentionally not accepted by the status-page tools to avoid passing page passwords through model-visible tool arguments.
- Telemetry ingestion may return an HTTP success before downstream credential validation completes, according to Cronitor's telemetry design. A successful `telemetry.send` result therefore means the collector accepted the HTTP request, not that downstream monitor processing is guaranteed.

See `examples/workflows.md` for concrete tool calls, expected response shapes, permissions and approval requirements.
