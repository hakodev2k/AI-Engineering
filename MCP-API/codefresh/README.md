# Codefresh MCP/API Connector

Reusable MCP server for Codefresh CI pipeline inspection and controlled pipeline execution.

## Upstream strategy

No official Codefresh operational MCP server was found in Codefresh's official documentation during implementation. This connector therefore uses the official Codefresh HTTP API. Codefresh documents the API at `https://g.codefresh.io/api/`, states that the CLI itself uses the API, and documents API-key authentication and resource scopes. The official CLI remains a supported alternative for interactive administration but is not required by this connector.

Official sources researched:
- API integration/auth/scopes: https://codefresh.io/docs/docs/integrations/codefresh-api/
- Pipelines: https://codefresh.io/docs/docs/pipelines/pipelines/
- Manual pipeline runs: https://codefresh.io/docs/docs/pipelines/run-pipeline/
- Monitoring/build logs: https://codefresh.io/docs/docs/pipelines/monitoring-pipelines/
- Cursor paging behavior: https://codefresh.io/docs/docs/kb/articles/paging-issues-builds-images/
- Build context/log API examples: https://codefresh.io/docs/docs/kb/articles/gather-metrics-and-build-logs/

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `codefresh.pipeline.list` | REST | READ | no |
| `codefresh.pipeline.get` | REST | READ | no |
| `codefresh.build.list` | REST | READ | no |
| `codefresh.build.get` | REST | READ | no |
| `codefresh.build.context` | REST | READ | no |
| `codefresh.build.logs` | REST | READ | no |
| `codefresh.pipeline.run` | REST | HIGH_RISK | explicit |

The connector intentionally omits deletion, permission, billing, cluster mutation, and arbitrary-request tools.

## Authentication and least privilege

Create a Codefresh API key in User Settings. Codefresh exposes resource scopes including Build and Pipeline; grant only the read/change access needed for the enabled tools. Store the token only in `CODEFRESH_API_KEY`. It is injected by the connector into the `Authorization` header and is never returned to the MCP client.

Environment:
- `CODEFRESH_API_KEY` — required.
- `CODEFRESH_API_BASE` — optional, defaults to `https://g.codefresh.io/api`; HTTPS is mandatory.
- `CODEFRESH_TIMEOUT_MS` — optional, default 15000.
- `CODEFRESH_APPROVE_WRITES` — default `false`; set to `true` only for an explicitly approved execution window.

## Architecture and security

`MCP client -> strict MCP tool -> validation/approval gate -> Codefresh REST client -> Codefresh`.

Provider data is wrapped with `untrusted: true`; callers must never interpret build logs, pipeline metadata, or other retrieved text as system/tool instructions. Requests accept only connector-owned relative API paths, blocking arbitrary URL/SSRF behavior. The API base must use HTTPS. There is no raw HTTP passthrough tool. Secrets are not logged or included in tool output.

Pipeline execution is classified HIGH_RISK because it can execute repository-defined CI code, consume compute, deploy software, or trigger external side effects. It fails closed unless `CODEFRESH_APPROVE_WRITES=true`. Destructive operations are not exposed.

## Reliability, pagination, rate limits, errors

Requests have an abort timeout. HTTP 429 and 5xx responses receive at most two bounded retries with exponential backoff; `Retry-After` is preserved when supplied. Authentication, authorization, validation, and other 4xx errors are not retried. Provider HTTP errors become `ProviderError` values without token disclosure.

Codefresh documents cursor-backed paging for build/image lists and warns about concurrent list sessions. The connector sends a unique `X-Pagination-Session-Id` for requests and bounds `limit` to 100. Avoid parallel traversal of the same logical build listing when deterministic paging matters. Codefresh's public documentation does not publish a single universal numeric API request quota; the connector reacts to 429 rather than inventing a quota.

## Build logs

`build.get` returns build metadata including the progress identifier. `build.logs` resolves `/progress/{progressId}` metadata. Codefresh documents that completed builds can yield a temporary log location from this endpoint. Treat returned locations as untrusted provider data; this connector does not automatically fetch arbitrary returned URLs, preventing SSRF and credential forwarding.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
CODEFRESH_API_KEY=... npm start
```

The server uses MCP stdio, so any MCP host that supports standard stdio servers can launch it. Compatibility depends on the host's MCP stdio support; no vendor-specific client behavior is required.

## Testing

```bash
npm test
```

Unit tests use fake HTTP responses and no live Codefresh credentials. They cover registration, credential isolation, read calls, auth failure behavior, bounded throttling retries, SSRF/path validation, and untrusted non-JSON provider data.

## Limitations

OAuth is not implemented because the documented Codefresh pipeline API flow uses scoped API keys. Webhook creation is not exposed. The connector does not fetch temporary log URLs automatically. It does not expose arbitrary API calls or administrative mutations. Pipeline creation/update/deletion and build termination are intentionally omitted until their exact current contracts and approval semantics can be pinned to official API documentation.
