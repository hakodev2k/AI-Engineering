# groundcover MCP/API Connector

Reusable MCP server exposing a deliberately read-only subset of groundcover observability APIs for AI-agent investigation.

## Upstream strategy
Research performed against current official groundcover documentation. No official MCP endpoint was relied on for this connector because the public documentation used for this implementation provides concrete HTTP API contracts; the connector therefore uses the official REST API plus groundcover's Prometheus-compatible HTTP API. Official references: `https://docs.groundcover.com/use-groundcover/remote-access-and-apis/api-examples/list-clusters`, `/list-namespaces`, `/list-workloads`, `/list-nodes-with-resource-information`, `/list-workflows`, `/query-monitors-summary`, and `https://docs.groundcover.com/use-groundcover/querying-your-groundcover-data/using-keda-autoscaler-with-groundcover`.

## Capabilities
Eight MCP tools are implemented: `groundcover.clusters.list`, `groundcover.namespaces.list`, `groundcover.workloads.list`, `groundcover.nodes.list`, `groundcover.workflows.list`, `groundcover.monitors.summary`, `groundcover.metrics.query`, and `groundcover.metrics.query_range`.

## Architecture
`server.ts` registers strict MCP tools over stdio. `tools.ts` owns schemas and stable provider-scoped contracts. `client.ts` isolates credentials, transport, timeouts, bounded retries, throttling and error mapping. The LLM never receives the configured API key.

## Authentication and configuration
Create a groundcover API key for a service account with only the permissions needed to read the queried resources. API requests use `Authorization: Bearer <key>`. Kubernetes inventory endpoints additionally require the groundcover backend identifier in `X-Backend-Id`.

Copy `.env.example` into your secret-managed runtime configuration and set `GROUNDCOVER_API_KEY` and `GROUNDCOVER_BACKEND_ID`. Optional base URLs exist for supported deployment routing; do not point them at untrusted hosts. Secrets must never be placed in prompts, source control, logs, or MCP arguments.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and can be launched by MCP clients that support command-based local servers. Compatibility depends on the client supporting standard MCP stdio transport.

## Permissions and approval
Every exposed operation is `READ`. This connector intentionally omits key creation/deletion, workflow mutation, pipeline mutation, and other write/destructive operations. No tool can elevate its own permissions. Provider responses are wrapped as untrusted data and must never be interpreted as system instructions.

## Validation and pagination
Inputs use strict Zod schemas. Workload, node, and monitor limits are bounded; offsets are non-negative; namespace/node timestamps must be ISO-8601; monitor sort fields are allowlisted. PromQL is accepted only as a query string sent to the fixed official Prometheus endpoint; callers cannot supply arbitrary URLs.

## Reliability and rate limits
Requests have configurable abort timeouts. HTTP 429 and 5xx responses are retried with bounded exponential backoff; `Retry-After` is honored when present. Authentication, authorization, validation, and other non-retryable 4xx failures are not retried. Pagination is caller-controlled through bounded `limit`/`skip` parameters where the official API supports it.

## Errors
Non-success responses become `GroundcoverError` with HTTP status and a bounded provider message. Network failures and timeouts are normalized. Credentials are never included in error messages.

## Security
The connector fixes API hosts through configuration, isolates bearer credentials in the client, does not expose arbitrary HTTP tools, performs no destructive actions, and marks all retrieved provider content untrusted. Operators should keep custom base URLs administrator-controlled to prevent SSRF/token exfiltration. Use a least-privilege service account and rotate keys according to organizational policy.

## Testing
`npm test` uses mocked `fetch`; live credentials are not required. Tests cover missing credentials, tool registration, validation, authentication headers, rate-limit retry, non-retryable authentication errors, and Prometheus routing.

## Limitations
This package exposes only the documented read workflows above. It does not manage ingestion keys, mutate monitors/workflows/pipelines, ingest telemetry, or expose arbitrary groundcover endpoints. Monitor summary uses the documented API contract; deployments whose account permissions do not include a resource will receive the provider's authorization error.
