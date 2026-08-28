# Databricks MCP/API Connector

Reusable, security-focused MCP connector for Databricks workspace operations. It exposes a stable MCP stdio tool surface for compute clusters, Jobs API 2.2, SQL warehouses, and SQL Statement Execution while keeping Databricks credentials inside the connector process.

Research date: **2026-08-28**.

## Official sources researched

- Databricks REST API reference: https://docs.databricks.com/api/workspace/
- OAuth M2M authentication: https://docs.databricks.com/aws/en/dev-tools/auth/oauth-m2m
- Personal access token authentication: https://docs.databricks.com/aws/en/dev-tools/auth/pat
- Databricks MCP documentation: https://docs.databricks.com/aws/en/generative-ai/mcp/
- Clusters API: https://docs.databricks.com/api/workspace/clusters
- Jobs API 2.2: https://docs.databricks.com/api/workspace/jobs
- SQL Warehouses API: https://docs.databricks.com/api/workspace/warehouses
- Statement Execution API: https://docs.databricks.com/api/workspace/statementexecution

## MCP availability and transport strategy

Databricks provides managed/hosted MCP capabilities for selected data and agent workflows, including documented MCP access around Databricks-managed data/AI resources. Those managed MCP capabilities are useful when the required operation is natively represented by the managed server.

The operational capabilities implemented here—cluster lifecycle, Jobs API 2.2 runs, SQL warehouse lifecycle, and Statement Execution—are directly documented workspace REST APIs. This connector therefore uses the official REST API for those operations and exposes them through its own narrow MCP tool contract rather than routing through an unrelated upstream MCP toolset.

This avoids dynamic tool discovery, prevents arbitrary provider requests, and keeps each operational permission explicit.

## Supported tools

| MCP tool | Official upstream | Provider scope | Risk | Approval |
|---|---|---|---|---|
| `databricks.cluster.list` | `GET /api/2.1/clusters/list` | `clusters` | READ | no |
| `databricks.cluster.get` | `GET /api/2.1/clusters/get` | `clusters` | READ | no |
| `databricks.cluster.start` | `POST /api/2.1/clusters/start` | `clusters` | HIGH_RISK | yes |
| `databricks.cluster.restart` | `POST /api/2.1/clusters/restart` | `clusters` | HIGH_RISK | yes |
| `databricks.cluster.terminate` | `POST /api/2.1/clusters/delete` | `clusters` | DESTRUCTIVE | yes + feature gate |
| `databricks.job.list` | `GET /api/2.2/jobs/list` | `jobs` | READ | no |
| `databricks.job.get` | `GET /api/2.2/jobs/get` | `jobs` | READ | no |
| `databricks.job.run.list` | `GET /api/2.2/jobs/runs/list` | `jobs` | READ | no |
| `databricks.job.run.get` | `GET /api/2.2/jobs/runs/get` | `jobs` | READ | no |
| `databricks.job.run.start` | `POST /api/2.2/jobs/run-now` | `jobs` | HIGH_RISK | yes |
| `databricks.job.run.cancel` | `POST /api/2.2/jobs/runs/cancel` | `jobs` | HIGH_RISK | yes + feature gate |
| `databricks.warehouse.list` | `GET /api/2.0/sql/warehouses` | `sql` | READ | no |
| `databricks.warehouse.get` | `GET /api/2.0/sql/warehouses/{id}` | `sql` | READ | no |
| `databricks.warehouse.start` | `POST /api/2.0/sql/warehouses/{id}/start` | `sql` | HIGH_RISK | yes |
| `databricks.warehouse.stop` | `POST /api/2.0/sql/warehouses/{id}/stop` | `sql` | HIGH_RISK | yes |
| `databricks.sql.statement.execute` | `POST /api/2.0/sql/statements` | `sql` | HIGH_RISK | yes |
| `databricks.sql.statement.get` | `GET /api/2.0/sql/statements/{id}` | `sql` | READ | no |
| `databricks.sql.statement.cancel` | `POST /api/2.0/sql/statements/{id}/cancel` | `sql` | HIGH_RISK | yes + feature gate |

Databricks names the cluster termination operation `clusters/delete`, but it terminates the cluster asynchronously. The separate `clusters/permanent-delete` operation is intentionally **not exposed** by this connector.

## Architecture

```text
MCP client / AI agent
        |
        v
Databricks connector (stdio MCP)
  - strict schemas
  - provider-scoped allowlist
  - risk / approval policy
  - fixed workspace origin
  - credential provider
        |
        +--> OAuth M2M token provider (preferred)
        |       |
        |       v
        |    /oidc/v1/token
        |
        v
Official Databricks workspace REST APIs
```

Provider responses are marked `untrusted_provider_data: true`. Data returned by notebooks, jobs, SQL, cluster metadata, or other provider resources must be treated as data rather than as instructions that can change system behavior or permissions.

## Authentication

### Preferred: OAuth 2.0 machine-to-machine

Databricks recommends OAuth for service-principal automation. Configure:

```text
DATABRICKS_CLIENT_ID=
DATABRICKS_CLIENT_SECRET=
```

The connector requests an OAuth client-credentials token from:

```text
https://<workspace-host>/oidc/v1/token
```

with scope `all-apis`. Access tokens are short-lived; the connector caches them and refreshes before expiry. On one OAuth-authenticated HTTP 401 response, it invalidates the cached token and retries authentication once.

OAuth's `all-apis` token scope does not replace Databricks authorization. The service principal still needs only the workspace/object permissions necessary for the implemented operations. Use a dedicated service principal and least-privilege cluster, job, warehouse, catalog, schema, and table permissions.

### Fallback: personal access token

When OAuth cannot be used, configure:

```text
DATABRICKS_TOKEN=
```

PAT is treated as a legacy fallback. If OAuth client credentials and a PAT are both configured, OAuth is preferred.

The AI/LLM never receives client secrets, PATs, or OAuth access tokens. Credentials are accepted only through environment configuration and remain in the authentication layer.

## Environment variables

Copy `.env.example` and configure:

- `DATABRICKS_HOST` — required HTTPS workspace origin, such as `https://your-workspace.cloud.databricks.com`.
- `DATABRICKS_CLIENT_ID` — OAuth M2M service-principal client ID.
- `DATABRICKS_CLIENT_SECRET` — OAuth M2M service-principal client secret.
- `DATABRICKS_TOKEN` — PAT fallback when OAuth is unavailable.
- `DATABRICKS_TIMEOUT_MS` — request timeout; default `15000`.
- `DATABRICKS_MAX_RETRIES` — bounded safe-request retries; default `3`, maximum `5`.
- `DATABRICKS_APPROVAL_SECRET` — HMAC secret required by all non-read tools.
- `DATABRICKS_ENABLE_CLUSTER_TERMINATE` — `false` by default.
- `DATABRICKS_ENABLE_JOB_CANCEL` — `false` by default.
- `DATABRICKS_ENABLE_SQL_CANCEL` — `false` by default.

`DATABRICKS_HOST` must be a clean HTTPS origin. Paths, query strings, fragments, and embedded URL credentials are rejected, preventing an agent from steering the connector toward arbitrary endpoints.

## Installation

Requires Node.js 20+.

```bash
npm install
npm run check
npm test
```

## Running the MCP server

```bash
npm start
```

The connector uses the standard MCP stdio transport. It can be used by MCP clients that support stdio tool servers. No client is granted more Databricks privilege than the configured Databricks identity already has.

## Permission and approval model

READ tools can execute without approval.

Every WRITE/HIGH_RISK/DESTRUCTIVE action requires `DATABRICKS_APPROVAL_SECRET` and an `approval_token` bound to the exact tool and exact payload:

```text
hex(HMAC-SHA256(
  DATABRICKS_APPROVAL_SECRET,
  "<tool-name>\n<stable canonical JSON payload without approval_token>"
))
```

Changing a cluster ID, job ID, SQL statement, parameter, warehouse ID, or any other payload field invalidates the approval token.

Additional deployment gates prevent cancellation/termination tools from being activated by the agent itself:

```text
DATABRICKS_ENABLE_CLUSTER_TERMINATE=true
DATABRICKS_ENABLE_JOB_CANCEL=true
DATABRICKS_ENABLE_SQL_CANCEL=true
```

These flags cannot be changed through MCP.

## SQL execution safety

SQL execution is always classified `HIGH_RISK`. The connector does not attempt to infer whether arbitrary SQL text is read-only because comments, stored procedures, functions, multi-statement behavior, or provider SQL semantics can make naive parsing unsafe.

The connector instead applies these controls:

- explicit human approval bound to the full SQL payload;
- a fixed, configured Databricks identity;
- Databricks-native permissions for catalog/schema/table access;
- caller-supplied named parameters;
- result `row_limit` capped at 10,000;
- result `byte_limit` capped at 10 MiB;
- `INLINE` result disposition only;
- `JSON_ARRAY` result format only;
- external result links are never requested, avoiding temporary external-link credentials in MCP output.

For analytical agents, use a service principal with read-only Unity Catalog permissions and a dedicated warehouse wherever possible.

## Reliability, retries, and rate limiting

Databricks rate limits vary by workspace and endpoint. Databricks returns HTTP 429 when a rate limit is exceeded; this connector does not invent a universal requests-per-second value.

The connector:

- uses request timeouts and propagates MCP cancellation;
- handles paginated cluster, job, run, and warehouse listing;
- retries only retry-safe operations on network failure or HTTP 429/502/503/504;
- uses bounded exponential backoff;
- honors integer `Retry-After` headers with a bounded delay;
- does not retry authentication/authorization or validation failures as transient errors;
- does not blindly retry cluster/warehouse lifecycle actions, cancellation, or SQL execution;
- retries `jobs/run-now` only when `idempotency_token` is supplied, because Databricks documents that token as providing exactly-one-run semantics for repeated requests;
- refreshes OAuth once after an HTTP 401 before surfacing the error.

## Errors

Provider errors are normalized at the MCP boundary into categories including:

- `AUTHORIZATION` for 401/403;
- `RATE_LIMIT` for 429, preserving `Retry-After` when present;
- `PROVIDER` for other Databricks API failures;
- `CONNECTOR` for local configuration, validation, or policy failures.

Raw credentials are never included in normalized errors.

## Security considerations

- OAuth M2M is preferred over long-lived PATs.
- Credentials are environment-only and never tool arguments.
- Workspace host is fixed at startup and HTTPS-only.
- No arbitrary `execute_http_request` or unrestricted REST proxy exists.
- No credential, billing, permission, identity, policy, secret, token, or account-administration tools are exposed.
- Cluster permanent deletion is not exposed.
- Destructive/cancel actions are disabled by default.
- All mutations are payload-bound to explicit approval.
- Retrieved provider content is marked untrusted.
- SQL results are bounded and external result links are disabled.
- Tool inputs constrain IDs, pagination, SQL size, parameter count, row count, and result bytes.
- Databricks access control remains the primary authorization boundary; MCP policy is an additional boundary, not a substitute.

## Tests

Tests require no live Databricks credentials. They cover:

- tool/policy registration consistency;
- OAuth preference and PAT fallback;
- HTTPS workspace validation;
- exact-payload approval binding;
- destructive-operation denial;
- OAuth client-credentials exchange and caching;
- bearer authorization and pagination;
- rate-limit retry for safe reads;
- no blind retry for cluster starts;
- idempotent retry behavior for `jobs/run-now`;
- OAuth token invalidation and one-time reauthentication on 401.

Run:

```bash
npm test
```

## Limitations

- Managed Databricks MCP servers for data/agent use cases are not proxied; this connector uses official REST for its operational capability set.
- Cluster create/edit, permanent deletion, job create/update/delete, warehouse create/edit/delete, permissions, secrets, tokens, billing, and account administration are intentionally omitted.
- SQL execution is approval-gated regardless of statement text.
- OAuth M2M implemented here is workspace-host authentication; deployments needing account-level APIs should use a separately reviewed account-scoped connector.
- Retry behavior is intentionally conservative to avoid duplicate or disruptive side effects.
