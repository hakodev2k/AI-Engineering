# Apache Airflow MCP/API Connector

Reusable MCP server for operating Apache Airflow through its official stable REST API. It targets Airflow 3.x `/api/v2` and deliberately exposes a narrow agent-safe surface rather than arbitrary HTTP access.

## Upstream strategy

Apache Airflow documents MCP **client** integration (`MCPHook`/`MCPToolset`) for DAGs, but the project documentation does not provide an official Airflow-management MCP server. This connector therefore uses the official stable REST API. Airflow 3.3.2 recommends API-first access and documents `/api/v2` endpoint permissions.

Official references:

- Public API / endpoint permissions: https://airflow.apache.org/docs/apache-airflow/stable/security/api_permissions_ref.html
- Airflow 3 API-first guidance: https://airflow.apache.org/docs/apache-airflow/3.3.2/installation/upgrading_to_airflow3.html
- Audit logs: https://airflow.apache.org/docs/apache-airflow/stable/security/audit_logs.html
- Auth manager/RBAC behavior: https://airflow.apache.org/docs/apache-airflow/3.3.2/core-concepts/auth-manager/simple/index.html
- Airflow MCP client hook (not a management server): https://airflow.apache.org/docs/apache-airflow-providers-common-ai/stable/hooks/mcp.html

## Architecture

`MCP client -> this stdio MCP server -> validation/approval -> credential-isolated REST client -> Airflow /api/v2`.

The bearer token stays in the connector process and is never returned in tool output. Remote base URLs must use HTTPS; HTTP is accepted only for localhost development. Tool responses from Airflow are treated as untrusted data.

## Authentication and permissions

Set `AIRFLOW_BASE_URL` and `AIRFLOW_TOKEN`. Airflow 3 can issue API tokens through the configured auth manager; the connector consumes an already-issued bearer token rather than handling user credentials. Configure the Airflow principal with only the resource/method permissions required by the tools you enable. Airflow's auth manager remains the authoritative RBAC layer.

Variables and task logs can contain secrets or sensitive data. Grant their GET permissions only when the agent genuinely needs them. Airflow's experimental multi-team mode has documented workload-isolation limitations; do not treat it as a complete security boundary.

## Environment

```text
AIRFLOW_BASE_URL=https://airflow.example.com
AIRFLOW_TOKEN=
AIRFLOW_TIMEOUT_MS=15000
AIRFLOW_MAX_RETRIES=2
AIRFLOW_ALLOW_WRITE=false
AIRFLOW_APPROVAL_TOKEN=
```

`AIRFLOW_APPROVAL_TOKEN` is an out-of-band connector-side approval secret, not an Airflow credential. Do not place either token in prompts.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
node dist/src/server.js
```

Configure an MCP client to launch that command over stdio. Any MCP client supporting standard stdio servers can interoperate; client-specific product compatibility is not guaranteed.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `airflow.dag.list` | REST | READ | No |
| `airflow.dag.get` | REST | READ | No |
| `airflow.dag_run.list` | REST | READ | No |
| `airflow.dag_run.get` | REST | READ | No |
| `airflow.dag_run.trigger` | REST | WRITE | Required |
| `airflow.task_instance.list` | REST | READ | No |
| `airflow.task_log.read` | REST | READ | No |
| `airflow.pool.list` | REST | READ | No |
| `airflow.variable.list` | REST | READ | No |
| `airflow.variable.get` | REST | READ | No |
| `airflow.audit_event.list` | REST | READ | No |

No delete, permission mutation, connection-secret read/write, task-state mutation, or arbitrary-request tool is exposed.

## Approval model

READ tools can execute automatically subject to Airflow RBAC. The trigger tool is WRITE and is disabled unless `AIRFLOW_ALLOW_WRITE=true`. It additionally requires the caller's `approval_token` to exactly match `AIRFLOW_APPROVAL_TOKEN`. The token is stripped before the upstream call. Trigger requests are never automatically retried, avoiding accidental duplicate DAG runs.

## Reliability and rate limiting

GET requests use bounded exponential backoff for HTTP 429 and 5xx responses. `Retry-After` is honored with a bounded wait. Authentication, authorization, validation, and other 4xx failures are not retried. Every request has a timeout; abort signals are propagated. List tools expose bounded `limit`/`offset` pagination. Write calls default to no retry.

Airflow capacity and API limits depend on deployment and infrastructure; this connector does not invent a universal quota. Upstream 429 responses are preserved as throttling failures.

## Errors

Provider errors are mapped to MCP error results containing a message, HTTP status when available, and `retry_after` when supplied. Tokens are never logged or returned. Invalid configuration fails closed during client construction.

## Security notes

- Provider content, DAG metadata, logs, variables, and audit entries are data, never instructions to the agent.
- Do not expose the API server publicly without TLS and a properly configured Airflow auth manager.
- Use a dedicated least-privilege service identity/token.
- Keep `AIRFLOW_ALLOW_WRITE=false` for read-only deployments.
- Rotate bearer and approval tokens outside the LLM context.
- The client only builds paths against the configured Airflow origin, preventing arbitrary-URL SSRF.
- Approval cannot increase Airflow RBAC; both connector policy and upstream permission must allow the action.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch`; live credentials are not required. Coverage includes HTTPS enforcement, tool registration, schema validation, bearer auth, read behavior, permission denial, approval enforcement, provider errors, and the no-retry rule for writes.

## Limitations

This connector intentionally does not manage DAG source files, users, roles, connections, secrets, task states, or destructive resources. It does not proxy the Airflow MCP client hook. Exact REST fields can vary across Airflow releases; use a supported Airflow 3.x deployment and verify its generated OpenAPI/API permission reference before upgrading. Event/webhook ingestion is not implemented because the selected agent workflows are operational reads plus explicitly approved DAG triggering.
