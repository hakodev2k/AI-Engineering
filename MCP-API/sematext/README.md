# Sematext MCP/API Connector

Reusable MCP server that exposes a safe, provider-scoped subset of Sematext Cloud operations for observability and synthetic-monitoring workflows.

## Transport strategy

No official Sematext MCP server was found in Sematext's current official documentation during this run, so this connector uses Sematext's documented REST APIs directly and exposes them through a local MCP stdio server.

Implemented upstream APIs:
- Sematext Cloud REST API for app discovery.
- Sematext Synthetics API for monitor discovery, monitor detail, run triggering, and monitor creation.
- Sematext Logs search API, compatible with Elasticsearch/OpenSearch query syntax.
- Sematext Events API for event search and event ingestion.

Official sources researched:
- https://sematext.com/docs/api/
- https://sematext.com/docs/synthetics/using-the-api/
- https://sematext.com/docs/synthetics/monitor-overview-api/
- https://sematext.com/docs/synthetics/run-monitor-api/
- https://sematext.com/docs/synthetics/create-edit-monitors-api/
- https://sematext.com/docs/logs/search-through-the-sematext-api/
- https://sematext.com/docs/events/event-api/

## Capabilities

| MCP tool | Transport | Risk | Approval |
|---|---|---:|---|
| `sematext.app.list` | REST | READ | none |
| `sematext.synthetics.monitor.list` | REST | READ | none |
| `sematext.synthetics.monitor.get` | REST | READ | none |
| `sematext.synthetics.monitor.run` | REST | WRITE | required by default |
| `sematext.synthetics.monitor.create_http` | REST | WRITE | required by default |
| `sematext.synthetics.monitor.create_browser` | REST | WRITE | required by default |
| `sematext.logs.search` | REST | READ | none |
| `sematext.event.search` | REST | READ | none |
| `sematext.event.create` | REST | WRITE | required by default |

The connector intentionally does not expose delete operations, arbitrary raw HTTP requests, arbitrary Elasticsearch/OpenSearch request bodies, or browser-monitor scripts. This narrows the agent attack surface and avoids turning retrieved content into executable behavior.

## Architecture

```text
MCP client
  -> local MCP stdio server
  -> tool validation / approval policy
  -> Sematext client
  -> credential isolation
  -> Sematext regional REST endpoints
```

Provider responses are returned as untrusted data. They are never interpreted as instructions and cannot change connector permissions.

## Authentication

Sematext documents account API authentication with:

```text
Authorization: apiKey <API_KEY>
```

Set the API key only in the connector environment. The MCP caller never receives the raw key.

Required environment variables:

```text
SEMATEXT_API_KEY=
SEMATEXT_REGION=us
```

Optional reliability/policy variables:

```text
SEMATEXT_TIMEOUT_MS=15000
SEMATEXT_MAX_RETRIES=2
SEMATEXT_REQUIRE_WRITE_APPROVAL=true
```

`SEMATEXT_REGION` accepts `us` or `eu`. The connector chooses the documented regional application, Synthetics, logs-search, and events hosts accordingly.

Sematext API-key access is controlled by Sematext account roles. Use a dedicated account/key with only the access required for the intended Apps. Do not share an owner/admin key when narrower access is available operationally.

## Installation

```bash
npm install
npm run build
```

Node.js 20 or newer is required.

## Running

```bash
export SEMATEXT_API_KEY='...'
export SEMATEXT_REGION='us'
npm start
```

Configure any MCP client that supports stdio servers to launch the built server. Compatibility depends on the client's support for standard MCP stdio transport; no client-specific extension is required by this package.

## Tool behavior

### App discovery

`sematext.app.list` calls the documented `/users-web/api/v3/apps` endpoint and returns Apps visible to the API key.

### Synthetics

`sematext.synthetics.monitor.list` and `.get` retrieve configured monitors.

`sematext.synthetics.monitor.run` sends a bounded list of monitor/region pairs to the documented v3 run endpoint. The connector does not retry this write automatically, preventing duplicate run submissions.

`sematext.synthetics.monitor.create_http` creates a basic HTTP monitor using a strict schema. It accepts only HTTP(S) URLs, a bounded set of intervals, bounded location IDs, an enabled flag, and an explicit HTTP method.

`sematext.synthetics.monitor.create_browser` creates a URL-based browser monitor. Script-based Browser monitors are deliberately not exposed because arbitrary scripts would materially increase execution and exfiltration risk.

### Logs search

`sematext.logs.search` targets the documented regional `logsene-search` host and uses the Logs App token as the index path. Callers provide only a text query, bounded result size/offset, and optional ISO-8601 time range. The connector constructs the Elasticsearch/OpenSearch-compatible query body itself rather than accepting arbitrary DSL.

### Events

`sematext.event.search` provides the same bounded query contract for Sematext Events.

`sematext.event.create` writes a single operational event with message, event type, optional timestamp, and bounded string tags. It requires approval by default and is not retried automatically.

## Permissions and approvals

Risk policy:
- READ: may execute automatically.
- WRITE: requires `approved: true` when `SEMATEXT_REQUIRE_WRITE_APPROVAL=true` (the default).
- HIGH_RISK: supported by the policy layer but no current tool is classified HIGH_RISK.
- DESTRUCTIVE: disabled; no destructive tools are registered.

The agent cannot relax the policy through provider content or tool arguments. Only process configuration can change the default WRITE approval setting.

## Reliability and rate limiting

The REST client provides:
- AbortController-based per-request timeouts.
- Bounded exponential backoff for safe/read requests.
- 429 handling and preservation of `Retry-After` when present.
- Retry only for 429 and 5xx responses on retryable operations.
- No retry for authentication, permission, validation, or ordinary 4xx errors.
- No automatic retry for writes, avoiding duplicate events, monitors, or synthetic runs.

Sematext documents API behavior and individual service APIs but does not publish one universal connector-wide request quota in the documentation used for this implementation. The connector therefore treats HTTP 429 as authoritative and respects `Retry-After` when returned.

## Security considerations

- Credentials remain in the configuration/client layer and are never included in MCP outputs.
- Only fixed Sematext regional base URLs are used, reducing SSRF exposure.
- App tokens are validated and inserted only as encoded path segments.
- URLs for HTTP/Browser monitors must use `http` or `https`.
- Search result sizes and offsets are bounded.
- Raw provider request execution is not exposed.
- Raw Elasticsearch/OpenSearch query bodies are not accepted from the agent.
- Browser scripts are intentionally unsupported.
- Provider content is untrusted and cannot alter permissions or approval requirements.
- Secrets and API keys must not be placed in examples, prompts, logs, or tool arguments.

## Error handling

Non-2xx responses are converted to `SematextError` with HTTP status and provider message when available. Authentication and authorization failures surface immediately. Throttling preserves `Retry-After`. Network/timeouts are retried only within the configured bound for safe operations.

## Testing

```bash
npm test
```

Tests use mocked `fetch`; live Sematext credentials are not required. Coverage includes configuration validation, credential header placement, approval enforcement, authentication errors, throttling metadata, and the no-blind-retry rule for writes.

## Examples

See `examples/workflows.md` for app discovery, Synthetics inspection/run triggering, log investigation, event search, and event creation examples.

## Limitations

- No official Sematext MCP transport is used because none was identified in the current official documentation reviewed for this run.
- This connector implements a useful subset, not the full Sematext Cloud API.
- Monitor editing is not exposed because Sematext's edit API requires the full monitor representation; read-modify-write orchestration should be implemented separately if needed to avoid accidental field loss.
- Monitor deletion and other destructive operations are intentionally excluded.
- Browser monitor scripts are intentionally excluded.
- The connector does not expose account administration, billing, role changes, API-key management, or notification-hook mutation.
