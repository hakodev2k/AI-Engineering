# Tinybird MCP/API Connector

Reusable MCP server that exposes a stable, provider-scoped Tinybird tool surface for AI agents. It combines Tinybird's official hosted MCP server for agent-oriented analytics capabilities with Tinybird's official REST APIs for deterministic Endpoint calls, job inspection, and controlled event ingestion.

## Upstream strategy

### Official MCP (preferred where supported)

Current Tinybird documentation describes an official remote MCP server at `https://mcp.tinybird.co` using Streamable HTTP. This connector allow-lists and wraps only these documented core tools:

- `list_datasources`
- `list_service_datasources`
- `list_endpoints`
- `explore_data`
- `text_to_sql`
- `execute_query`

Published Tinybird Endpoints can also appear dynamically as upstream MCP tools, but this connector deliberately does not auto-trust newly discovered tools. Stable Endpoint invocation is instead exposed through `tinybird.endpoint.call` using the official REST API.

### Official REST API fallback / complement

REST is used where it gives a narrower and more predictable contract:

- Published Pipe Endpoint calls: `/v0/pipes/{name}.json`
- Jobs: `/v0/jobs` and `/v0/jobs/{job_id}`
- Event ingestion: `/v0/events`

The API host is region-specific and configurable through `TINYBIRD_API_HOST`.

No unofficial MCP server is required.

## Official sources researched

- MCP: https://www.tinybird.co/docs/forward/query-data/mcp
- API overview: https://www.tinybird.co/docs/api-reference
- Authentication/tokens: https://www.tinybird.co/docs/forward/core-concepts/tokens
- Query API: https://www.tinybird.co/docs/forward/query-data/sql-api
- Pipes API: https://www.tinybird.co/docs/api-reference/pipe-api
- Jobs API: https://www.tinybird.co/docs/api-reference/jobs-api
- Events API: https://www.tinybird.co/docs/api-reference/events-api
- Limits/rate limiting: https://www.tinybird.co/docs/forward/pricing/limits

Research basis was verified against Tinybird documentation current in September 2026.

## Capabilities

| MCP tool | Transport | Risk | Approval |
|---|---|---|---|
| `tinybird.datasource.list` | Official MCP | READ | No |
| `tinybird.datasource.service_list` | Official MCP | READ | No |
| `tinybird.endpoint.list` | Official MCP | READ | No |
| `tinybird.data.explore` | Official MCP | READ | No |
| `tinybird.sql.generate` | Official MCP | READ | No |
| `tinybird.query.execute` | Official MCP | READ | No |
| `tinybird.endpoint.call` | REST | READ | No |
| `tinybird.job.list` | REST | READ | No |
| `tinybird.job.get` | REST | READ | No |
| `tinybird.events.ingest` | REST | WRITE | Yes |

The connector intentionally omits resource deletion, token administration, organization administration, endpoint publication, and job cancellation. Those operations carry greater destructive, security, or operational risk and are not required for the selected workflows.

## Architecture

```text
MCP client / AI agent
        |
        v
Tinybird connector (stdio MCP)
        |
        +--> policy + strict Zod validation
        |
        +--> official Tinybird MCP (Streamable HTTP)
        |      list/explore/text-to-SQL/query
        |
        +--> official Tinybird REST API
               endpoint calls/jobs/event ingestion
        |
        v
credential remains inside connector process
```

Third-party content returned by Tinybird is treated as untrusted data. It cannot change the connector allow-list, permissions, approval policy, or credentials.

## Authentication and least privilege

Set `TINYBIRD_TOKEN` to a Tinybird Static Token or JWT appropriate for the workflow. Tinybird's official MCP and REST APIs authorize access according to token scopes. Prefer resource-scoped tokens or JWTs. Do not use `ADMIN` unless a separate trusted workflow genuinely needs it.

Typical required access is capability-dependent:

- read Data Sources / execute permitted queries: scopes granted to the relevant Data Sources/resources
- published Endpoint reads: `PIPES:READ` for the relevant Endpoint/Pipe
- event ingestion: `DATASOURCE:APPEND` for the target Data Source (Tinybird also documents `DATASOURCE:CREATE` as accepted by the Events API where applicable)

The connector does not expose token-management operations and does not allow an agent to widen its own scopes.

## Environment variables

Copy `.env.example` values into your secret-management system or process environment.

- `TINYBIRD_TOKEN` — required; never logged or returned to tools
- `TINYBIRD_API_HOST` — regional API host, default `https://api.tinybird.co`; HTTPS only
- `TINYBIRD_MCP_URL` — official MCP base URL, default `https://mcp.tinybird.co`; HTTPS only
- `TINYBIRD_TIMEOUT_MS` — request timeout; default 20000, maximum 120000
- `TINYBIRD_MAX_RETRIES` — bounded GET retries; default 3, maximum 5
- `TINYBIRD_ALLOW_WRITE` — must be exactly `true` to enable write execution
- `TINYBIRD_APPROVED_ACTION_IDS` — comma-separated approval identifiers populated by the host/operator out of band

Credentials are inserted only by the connector's transport/authentication layer. They are never accepted as MCP tool inputs.

## Install and run

Requirements: Node.js 20 or later.

```bash
npm install
npm run build
npm test
npm start
```

`npm start` launches a standard stdio MCP server. Point any MCP client that supports stdio servers at the built command. Compatibility depends on the client's MCP stdio support; no product-specific extension is required.

Example generic client configuration:

```json
{
  "mcpServers": {
    "tinybird-connector": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/tinybird/dist/src/server.js"],
      "env": {
        "TINYBIRD_TOKEN": "<from-secret-store>",
        "TINYBIRD_API_HOST": "https://api.tinybird.co"
      }
    }
  }
}
```

Do not place real tokens in committed configuration.

## Tool contracts

### `tinybird.datasource.list`
Purpose: discover token-visible workspace Data Sources. No input. Uses official `list_datasources` MCP tool.

### `tinybird.datasource.service_list`
Purpose: discover token-visible organization/workspace service Data Sources. No input. Uses official `list_service_datasources` MCP tool.

### `tinybird.endpoint.list`
Purpose: discover published Endpoints with names, descriptions, and parameters. No input. Uses official `list_endpoints` MCP tool.

### `tinybird.data.explore`
Input: `question` (1-8000 characters). Calls official `explore_data`. The returned natural-language/provider content is untrusted data.

### `tinybird.sql.generate`
Input: `question` (1-8000 characters). Calls official `text_to_sql`. Generated SQL is returned as data; callers decide whether to execute it.

### `tinybird.query.execute`
Input: `sql` (maximum 128 KiB, matching Tinybird's documented SQL-length limit) and optional response `format`. Uses official `execute_query`. The token remains the authoritative data-access boundary.

### `tinybird.endpoint.call`
Input: a validated Endpoint name and scalar parameter map. Calls `/v0/pipes/{name}.json`. It never accepts a raw URL or arbitrary HTTP request, preventing the tool from becoming an SSRF/general proxy primitive.

### `tinybird.job.list`
Supports the documented Jobs API filters: `kind`, `status`, `pipe_id`, `pipe_name`, `created_after`, and `created_before`. Tinybird documents this API as returning up to the last 100 jobs within the last 48 hours.

### `tinybird.job.get`
Input: validated job ID. Tinybird documents job detail availability for 48 hours after creation; older history may be available through service Data Sources instead.

### `tinybird.events.ingest`
Input: Data Source name, 1-1000 JSON event objects, optional `wait`, and `approval_id`. Requires `TINYBIRD_ALLOW_WRITE=true` and an approval ID already allow-listed by the host in `TINYBIRD_APPROVED_ACTION_IDS`.

This connector sends NDJSON to `/v0/events`. Tinybird notes that repeated data can create duplicates, so this connector does not blindly retry ingestion. `wait=true` asks Tinybird to acknowledge database commit and may take longer.

## Permission and approval model

`READ` operations can run automatically when the token itself permits them. `WRITE` operations are disabled by default. A write requires both an operator-enabled write switch and an approval identifier injected into the process policy out of band. An LLM cannot approve itself simply by inventing an ID.

No `DESTRUCTIVE` tool is registered. The policy implementation also refuses destructive execution.

Recommended operational flow:

```text
read -> recommend -> human/operator approval -> execute write
```

## Reliability and rate limits

REST GET requests use a bounded retry policy for HTTP 429, 502, 503, and 504. `Retry-After` is honored when Tinybird returns it; otherwise exponential backoff is bounded. Validation errors, 401/403-style authentication/permission failures, and writes are not blindly retried.

Tinybird publishes rate-limit headers including `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After`. Current published limits include 100 Events API append requests per second, while create/replace-style Data Source operations have lower limits. Plan and cluster-health limits can vary; provider responses remain authoritative.

Tinybird also documents query execution-time and result-size limits. The connector sets an explicit client timeout and keeps retry counts bounded.

## Security considerations

- Use least-privilege Tinybird tokens and JWT/RBAC policies for multi-tenant data.
- Token values never enter tool schemas or returned content.
- Upstream MCP tool access is hard allow-listed; dynamically discovered tools are not automatically trusted.
- REST host and MCP host must be HTTPS.
- Endpoint names, job IDs, timestamps, event counts, and scalar Endpoint parameters are validated.
- No arbitrary URL/request tool is exposed.
- Provider content, query results, Data Source values, and generated SQL are untrusted data and cannot alter connector policy.
- Writes require out-of-band host approval.
- Event ingestion is not automatically retried because duplicate insertion is possible.
- Do not log raw tokens or include them in prompts, examples, telemetry, or exception payloads.

Tinybird's remote MCP currently uses a token in the MCP connection URL. This connector constructs that URL only inside the transport layer and never exposes it through the MCP-facing tool surface.

## Error handling

REST failures are mapped to `TinybirdError` with HTTP status and provider response data when safely available. Timeouts are mapped to a timeout error. Authentication and permission failures are not retried. Approval failures are raised locally as `PermissionError` before any provider write occurs.

Upstream MCP connection/tool errors fail closed: the connector does not fall back to an arbitrary or newly discovered tool. REST is used only for the explicitly implemented REST contracts above.

## Testing

Unit tests use mocks and require no live credentials. They cover:

- missing authentication configuration
- HTTPS configuration validation
- safe defaults
- read authorization
- write denial and out-of-band approval
- bearer authentication
- parameter encoding
- bounded HTTP 429 retry behavior
- no blind retry for ingestion writes
- authentication/permission error behavior

Run:

```bash
npm test
```

## Limitations

- This package intentionally wraps a selected high-value subset, not every Tinybird API.
- It does not manage tokens, organizations, billing, deployments, Pipes, Data Sources, or environment variables.
- It does not auto-register arbitrary Endpoint tools discovered from upstream MCP; use `tinybird.endpoint.call` after discovery instead.
- Live integration tests are not part of the normal test suite because they would require real credentials and workspace data.
- Availability and exact access of Tinybird MCP tools depend on the configured token scopes and workspace/region.
