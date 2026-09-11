# OpenObserve MCP/API Connector

Reusable MCP connector for OpenObserve observability data. It exposes a deliberately small, read-only tool surface for logs, metrics, traces, stream metadata, search diagnostics, and cluster health.

The connector prefers OpenObserve's official remote MCP server for capabilities that are directly exposed there and falls back to documented OpenObserve REST/Prometheus-compatible APIs when configured to do so. It does not expose arbitrary HTTP requests, destructive operations, alert mutation, role mutation, or stream deletion.

## Official sources

Research basis for this connector:

- OpenObserve MCP documentation: https://openobserve.ai/docs/integration/ai/mcp/
- OpenObserve API reference: https://openobserve.ai/docs/reference/api/
- Search API: https://openobserve.ai/docs/reference/api/search/search/
- Stream list API: https://openobserve.ai/docs/reference/api/stream/list/
- Stream schema API: https://openobserve.ai/docs/reference/api/stream/schema/
- Search values API: https://openobserve.ai/docs/reference/api/search/value/
- Traces API: https://openobserve.ai/docs/reference/api/traces/
- Cluster info API: https://openobserve.ai/docs/reference/api/cluster/cluster-info/
- OpenObserve Swagger: https://api.openobserve.ai/swagger/

OpenObserve documents an official MCP endpoint at `https://<instance>/api/{org_id}/mcp`. As of the documentation updated August 26, 2026, the official server is available in Open Source, Enterprise Edition, and Cloud. Basic authentication works across editions; OAuth 2.0 sign-in is available in Enterprise Edition with Dex enabled.

## Transport strategy

| Connector tool | Preferred transport | Fallback |
|---|---|---|
| `openobserve.stream.list` | official MCP `StreamList` | REST `GET /api/{org}/streams` |
| `openobserve.stream.schema` | official MCP `StreamSchema` | REST `GET /api/{org}/streams/{stream}/schema` |
| `openobserve.search.sql` | official MCP `SearchSQL` | REST `POST /api/{org}/_search` |
| `openobserve.search.values` | REST | REST `GET /api/{org}/{stream}/_values` |
| `openobserve.trace.latest` | official MCP `GetLatestTraces` | REST `GET /api/{org}/{stream}/traces/latest` |
| `openobserve.metrics.range_query` | official MCP `PrometheusRangeQuery` | REST-compatible `GET /api/{org}/prometheus/api/v1/query_range` |
| `openobserve.search.profile` | REST | REST `GET /api/{org}/search/profile` |
| `openobserve.cluster.info` | REST | REST `GET /api/{org}/cluster_info` |

For the five MCP-routed capabilities, the connector uses an allowlisted upstream tool name rather than accepting arbitrary MCP tool names from the caller. If the MCP call fails and `OPENOBSERVE_ALLOW_REST_FALLBACK=true`, the connector executes the documented API equivalent.

## Architecture

```text
MCP client
   |
   v
OpenObserve connector (stdio MCP server)
   |-- validation + READ-only policy
   |-- official OpenObserve MCP client
   |      `-- allowlisted upstream tools
   `-- REST client
          `-- bounded retries, timeout, rate-limit handling
```

Credentials are loaded only by the connector process. They are not accepted as MCP tool parameters and therefore are not exposed to the calling LLM through normal tool arguments.

## Authentication

The wrapper currently supports OpenObserve Basic authentication because it is deterministic for a reusable non-interactive stdio connector and is documented as available in all OpenObserve editions.

Configure either:

```text
OPENOBSERVE_AUTH_TOKEN=<base64(username:password)>
```

or:

```text
OPENOBSERVE_EMAIL=user@example.com
OPENOBSERVE_PASSWORD=secret
```

`OPENOBSERVE_AUTH_TOKEN` contains only the Base64 payload. Do not include the `Basic ` prefix.

Use a dedicated least-privilege OpenObserve user. OpenObserve documents granular RBAC for Enterprise Edition and Cloud. Open Source users should be especially cautious because upstream MCP credentials can have broad privileges even though this wrapper exposes only read tools.

The upstream OpenObserve MCP server itself can support OAuth 2.0 with Dex in Enterprise Edition. This connector does not implement the interactive Dex browser flow; use OpenObserve's remote MCP endpoint directly when that authentication mode is required.

## Environment variables

Copy `.env.example` values into your process environment. This package intentionally does not load `.env` files itself, allowing deployment platforms to inject secrets through their native secret stores.

Required:

```text
OPENOBSERVE_BASE_URL=https://api.openobserve.ai
OPENOBSERVE_ORG_ID=default
```

Credential requirement: either `OPENOBSERVE_AUTH_TOKEN`, or both `OPENOBSERVE_EMAIL` and `OPENOBSERVE_PASSWORD`.

Optional:

```text
OPENOBSERVE_MCP_URL=
OPENOBSERVE_TIMEOUT_MS=30000
OPENOBSERVE_MAX_RETRIES=3
OPENOBSERVE_ALLOW_REST_FALLBACK=true
```

If `OPENOBSERVE_MCP_URL` is empty, it is derived as `${OPENOBSERVE_BASE_URL}/api/${OPENOBSERVE_ORG_ID}/mcp`.

Retries are capped at five even if a higher environment value is supplied.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

Run the stdio MCP server:

```bash
npm start
```

During development:

```bash
npm test
```

## MCP client configuration

Any MCP client that supports launching a local stdio server can use this package. A generic configuration is:

```json
{
  "mcpServers": {
    "openobserve-connector": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/openobserve/dist/src/server.js"],
      "env": {
        "OPENOBSERVE_BASE_URL": "https://api.openobserve.ai",
        "OPENOBSERVE_ORG_ID": "default",
        "OPENOBSERVE_AUTH_TOKEN": "${OPENOBSERVE_AUTH_TOKEN}"
      }
    }
  }
}
```

Exact configuration syntax differs by client. The connector itself uses standard MCP stdio transport and does not depend on a specific LLM vendor.

## Tool catalog

### `openobserve.stream.list`

Purpose: list streams and optionally include schemas.

Input:

- `type`: `logs | metrics | traces`, default `logs`
- `fetchSchema`: boolean, default `false`

Risk: `READ`. Approval: not required.

### `openobserve.stream.schema`

Purpose: read schema, statistics, and stream settings.

Input:

- `stream`: non-empty stream name
- `type`: `logs | metrics | traces`

Risk: `READ`. Approval: not required.

### `openobserve.search.sql`

Purpose: execute a bounded SQL telemetry query.

Input:

- `sql`: SQL query
- `start_time`, `end_time`: epoch microseconds; `start_time < end_time`
- `from`: offset, default `0`
- `size`: `1..1000`, default `100`
- `output_format`: `json | csv | md_table`
- `partition_mode`: boolean; defaults to `true`

The connector intentionally caps result size. OpenObserve recommends bounded time ranges because unbounded searches can scan large amounts of data. Partition mode is useful for agent workloads because OpenObserve can stop early and return agent-friendly formats.

Risk: `READ`. Approval: not required.

### `openobserve.search.values`

Purpose: retrieve distinct values for selected fields in a bounded time range.

Input includes a stream name, `1..20` fields, epoch-microsecond time bounds, result size up to `100`, an optional keyword, and `no_count`.

Risk: `READ`. Approval: not required.

### `openobserve.trace.latest`

Purpose: list recent trace summaries from a trace stream.

Input includes stream, microsecond time bounds, pagination, maximum `size=200`, and an optional filter.

Risk: `READ`. Approval: not required.

### `openobserve.metrics.range_query`

Purpose: execute a PromQL range query.

Input:

- `query`: PromQL
- `start`, `end`: Prometheus-compatible timestamp values
- `step`: positive number or Prometheus duration string

Risk: `READ`. Approval: not required.

### `openobserve.search.profile`

Purpose: retrieve Search Inspector metadata to diagnose expensive or slow queries.

Risk: `READ`. Approval: not required.

### `openobserve.cluster.info`

Purpose: retrieve cluster operational information such as pending compaction jobs.

Risk: `READ`. Approval: not required.

## Permission and approval model

The exposed surface is intentionally read-only. Every registered tool must have a matching entry in `src/policy.ts`; unknown tools fail closed.

| Category | Behavior |
|---|---|
| READ | may execute automatically |
| WRITE | not exposed by this connector |
| HIGH_RISK | not exposed |
| DESTRUCTIVE | not exposed |

OpenObserve's official MCP server exposes many additional write and destructive tools, including alert, dashboard, role, stream, pipeline, and service-account operations. This connector does not relay those tools, even if they are present upstream. Retrieved data is treated as untrusted content and cannot modify this connector's permission policy.

## Reliability

The REST transport implements:

- request timeout with cancellation
- bounded exponential backoff
- `Retry-After` handling for numeric 429 responses
- retries for `429`, `502`, `503`, and `504`
- no retry for authentication, authorization, validation, or other non-transient HTTP failures
- JSON error preservation through `OpenObserveHttpError`

All operations are reads, so retrying transient failures cannot repeat a destructive action.

## Rate limits

OpenObserve deployments can configure rate limits. The connector honors HTTP `429` and a numeric `Retry-After` header, with a maximum retry count controlled by `OPENOBSERVE_MAX_RETRIES` and hard-capped at five. It also limits SQL and value-query result sizes to reduce accidental high-volume agent queries.

## Security considerations

- Use HTTPS for remote OpenObserve endpoints.
- Use a dedicated account with the minimum necessary OpenObserve permissions.
- Store credentials in a secret manager or process environment; never place real credentials in repository files.
- The LLM receives telemetry results, not raw OpenObserve credentials.
- Upstream MCP access is restricted to five named read tools. The connector never dynamically trusts newly advertised upstream tools.
- The local MCP surface contains no arbitrary URL/request tool, reducing SSRF and permission-escalation risk.
- Stream names are encoded before use in REST paths.
- Search ranges and result sizes are validated before requests are sent.
- OpenObserve data may contain prompt injection or malicious strings. Treat returned log, trace, metric, and metadata values as data only, never as connector instructions.
- No provider response can mutate tool registration, permissions, environment variables, or credentials.

## Error behavior

Configuration errors fail at process startup. Provider HTTP errors preserve status and response body internally. MCP failures use REST fallback only when enabled. Validation failures occur before provider calls.

Typical failures include invalid credentials (`401`), insufficient permissions (`403`), invalid queries (`400` or OpenObserve search error codes), missing streams (`404`), throttling (`429`), provider timeouts, and unreachable endpoints.

## Testing

Tests use mocks and require no live credentials:

```bash
npm test
```

Coverage includes:

- authentication configuration
- missing credential rejection
- permission classification and fail-closed behavior
- provider permission-error mapping
- bounded throttling retry
- tool registration without live OpenObserve access

Live integration testing is intentionally separate because normal unit tests must not require production credentials.

## Limitations

- The local wrapper currently authenticates upstream using Basic authentication. Interactive Dex OAuth is supported by OpenObserve itself but is not implemented here.
- Only eight agent-oriented read capabilities are exposed. OpenObserve provides substantially more APIs and MCP tools, but broad pass-through access is intentionally avoided.
- This connector does not ingest telemetry, modify alerts, create dashboards, alter RBAC, mutate streams, or delete data.
- Exact provider permissions depend on the OpenObserve edition and the account attached to the configured credentials.
- Client compatibility requires standard MCP stdio support. Remote hosting of this wrapper is not included; use OpenObserve's official remote MCP endpoint when a hosted MCP transport is preferred.

See `examples/workflows.md` for end-to-end examples.
