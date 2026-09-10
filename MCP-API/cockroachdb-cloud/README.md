# CockroachDB Cloud MCP/API Connector

Reusable MCP connector for CockroachDB Cloud fleet discovery and tightly controlled destructive administration. The connector exposes a stable provider-scoped MCP surface over stdio and routes implemented operations to Cockroach Labs' official Cloud API.

## Transport strategy

Cockroach Labs provides an official managed MCP server at `https://cockroachlabs.cloud/mcp`. Current Cockroach Labs material describes it as a hosted HTTPS MCP service with Cloud RBAC, service-account API-key authentication for autonomous systems, OAuth 2.1 Authorization Code + PKCE for interactive clients, and platform-enforced read/write consent for database operations.

This connector does **not** proxy that broad managed MCP surface. Its selected workflows are CockroachDB Cloud control-plane operations: cluster inventory, node inventory, database/user inventory, connection-string metadata, version discovery, and narrowly scoped deletion. These operations are implemented with the official Cloud REST API at `https://cockroachlabs.cloud/api/v1`, where the connector can keep a fixed endpoint allowlist, exact schemas, deterministic retry behavior, and independent human-approval gates. The external interface remains MCP, so callers do not need to know that the upstream transport is REST.

Official sources researched for this implementation:

- Managed CockroachDB Cloud MCP server: https://www.cockroachlabs.com/blog/cockroachdb-ai-agents-managed-mcp-server/
- CockroachDB agent-ready architecture / MCP and service-account model: https://www.cockroachlabs.com/blog/cockroachdb-ai-agents-agent-ready-database/
- CockroachDB Cloud API overview and bearer authentication: https://www.cockroachlabs.com/blog/cockroachdb-cloud-api/
- CockroachDB Cloud API reference: https://www.cockroachlabs.com/docs/api/cloud/v1
- CockroachDB Cloud API product documentation: https://www.cockroachlabs.com/docs/cockroachcloud/cloud-api
- Official CockroachDB Cloud Go SDK: https://github.com/cockroachdb/cockroach-cloud-sdk-go

No community MCP implementation is a runtime dependency.

## Architecture

```text
MCP client / agent
      |
      v
cockroachdb-cloud connector (stdio)
  - strict bounded schemas
  - fixed tool allowlist
  - READ / DESTRUCTIVE classification
  - exact-payload approval validation
  - no arbitrary URL or API passthrough
      |
      v
CockroachCloudClient
  - bearer credential isolation
  - HTTPS/origin pinning
  - timeout + bounded read retries
  - 429 / Retry-After handling
      |
      v
https://cockroachlabs.cloud/api/v1
```

Provider responses are returned with `untrusted_provider_content: true`. Cluster names, database names, usernames, provider error text, and all other remote data must be treated as data rather than instructions.

## Authentication and permissions

Set `COCKROACH_CLOUD_API_KEY` to a CockroachDB Cloud service-account API key. The client sends it only in the provider `Authorization: Bearer ...` header. The credential is not accepted in MCP tool arguments and is never returned to the caller.

CockroachDB Cloud service accounts are governed by Cloud RBAC. Assign the connector a role at the narrowest organization/folder/cluster scope required for its enabled tools. A read-focused deployment should use read/operator permissions only. Destructive cluster or SQL-user deletion requires a Cloud role that permits those actions in addition to this connector's local approval gate.

The official managed MCP server also supports OAuth 2.1 with PKCE for interactive clients and service-account API keys for autonomous clients. This local connector does not implement a browser OAuth flow because it uses the Cloud API service-account model for headless reuse.

## Environment variables

Copy `.env.example` into your deployment's secret/configuration system; do not commit populated secrets.

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `COCKROACH_CLOUD_API_KEY` | yes | - | Service-account bearer credential |
| `COCKROACH_CLOUD_API_BASE_URL` | no | `https://cockroachlabs.cloud/api/v1` | Provider origin; must remain official HTTPS host/path |
| `COCKROACH_CLOUD_TIMEOUT_MS` | no | `15000` | Per-attempt timeout, bounded 1-120 seconds |
| `COCKROACH_CLOUD_MAX_RETRIES` | no | `2` | Additional attempts for safe reads, bounded 0-5 |
| `COCKROACH_CLOUD_REQUIRE_WRITE_APPROVAL` | no | `true` | Reserved policy default for future non-destructive writes |
| `COCKROACH_CLOUD_ALLOW_DESTRUCTIVE` | no | `false` | Host-side gate required for destructive tools |
| `COCKROACH_CLOUD_APPROVAL_SECRET` | conditional | - | HMAC secret used by a trusted approval component |

`COCKROACH_CLOUD_API_BASE_URL` is deliberately pinned to `cockroachlabs.cloud` and `/api/v1` so an agent cannot redirect the bearer credential to another host.

## Installation

Requirements:

- Node.js 20 or later
- npm
- a CockroachDB Cloud service account with an API key

```bash
npm install
npm run build
npm test
```

## Running the MCP server

```bash
COCKROACH_CLOUD_API_KEY='provided-by-secret-manager' npm start
```

The server uses standard MCP stdio transport. It can be launched by MCP hosts that support local stdio child processes. Product compatibility depends on the host's support for standard MCP stdio; this package does not depend on vendor-specific client behavior.

Generic configuration shape after build:

```json
{
  "mcpServers": {
    "cockroachdb-cloud": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/cockroachdb-cloud/dist/src/server.js"],
      "env": {
        "COCKROACH_CLOUD_API_KEY": "${COCKROACH_CLOUD_API_KEY}",
        "COCKROACH_CLOUD_ALLOW_DESTRUCTIVE": "false"
      }
    }
  }
}
```

Keep actual API keys and approval secrets in the MCP host's secret store or process environment rather than in source-controlled configuration.

## Implemented tools

| Tool | Cloud API operation | Risk | Approval |
|---|---|---:|---|
| `cockroachdb_cloud.cluster.list` | `GET /clusters` | READ | no |
| `cockroachdb_cloud.cluster.get` | `GET /clusters/{cluster_id}` | READ | no |
| `cockroachdb_cloud.cluster.nodes.list` | `GET /clusters/{cluster_id}/nodes` | READ | no |
| `cockroachdb_cloud.cluster.connection_string.get` | `GET /clusters/{cluster_id}/connection-string` | READ | no |
| `cockroachdb_cloud.cluster.version.list` | `GET /cluster-versions` | READ | no |
| `cockroachdb_cloud.database.list` | `GET /clusters/{cluster_id}/databases` | READ | no |
| `cockroachdb_cloud.sql_user.list` | `GET /clusters/{cluster_id}/sql-users` | READ | no |
| `cockroachdb_cloud.cluster.delete` | `DELETE /clusters/{cluster_id}` | DESTRUCTIVE | always + disabled by default |
| `cockroachdb_cloud.sql_user.delete` | `DELETE /clusters/{cluster_id}/sql-users/{name}` | DESTRUCTIVE | always + disabled by default |

The connector intentionally omits arbitrary HTTP execution, cluster creation/scaling, SQL password creation/update, networking mutation, billing, service-account/API-key administration, backup mutation, replication mutation, and Cloud RBAC changes.

## Tool contracts

Every tool has a fixed provider-scoped name, purpose, input schema, permission classification, provider output envelope, validation behavior, and approval rule. Unknown fields are rejected by strict Zod schemas.

Cluster IDs must be UUIDs. SQL usernames use a conservative bounded identifier pattern. Pagination uses explicit `page` and `limit` values, with `limit` capped at 100 per call. The connection-string tool restricts `os` to `MAC`, `LINUX`, or `WINDOWS` and only accepts bounded database/user names.

The connector exposes no `execute_any_api_request`, raw URL, raw HTTP-method, or dynamic upstream MCP executor.

## Permission model

### READ

READ tools can execute automatically if the service account has provider-side access. These tools cannot change connector configuration or RBAC.

### DESTRUCTIVE

Cluster deletion and SQL-user deletion are destructive. They require all of the following:

1. `COCKROACH_CLOUD_ALLOW_DESTRUCTIVE=true` configured by the MCP host/operator.
2. `COCKROACH_CLOUD_APPROVAL_SECRET` of at least 16 characters, kept outside model context.
3. an HMAC-SHA256 `approvalId` bound to the exact tool name and canonicalized input payload.
4. an exact repeated confirmation field (`confirmClusterId` or `confirmUsername`) matching the target.

The approval digest is:

```text
HMAC-SHA256(
  COCKROACH_CLOUD_APPROVAL_SECRET,
  tool_name + "\n" + canonical_json(input_without_approvalId)
)
```

Changing the cluster ID, username, or confirmation invalidates an existing approval. The approval secret is never an MCP tool parameter.

Use `examples/create-approval.mjs` from a trusted human-approval service/operator environment to produce a token after reviewing the exact request.

## Read -> recommend -> execute separation

A safe agent workflow is:

```text
cluster.list / cluster.get
  -> database.list / sql_user.list / nodes.list
  -> recommend an action to a human
  -> human approves exact destructive payload
  -> connector verifies host gate + exact confirmation + HMAC
  -> execute once
```

The connector contains no tool that can enable destructive mode or mint its own approval.

## Reliability

Every provider request has a bounded `AbortController` timeout. Safe GET requests may retry transient network failures and HTTP `429`, `502`, `503`, or `504` responses up to `COCKROACH_CLOUD_MAX_RETRIES` additional attempts. Backoff is exponential and bounded; `Retry-After` is honored when the provider supplies it.

Authentication, authorization, validation, not-found, conflict, and other ordinary 4xx errors are not retried. DELETE operations are attempted exactly once, even on transient failures, because an ambiguous response might arrive after the provider already committed the destructive action.

Cockroach Labs' public documentation reviewed for this connector does not establish one universal fixed request quota that should be hard-coded across all Cloud API operations. The implementation therefore treats provider throttling responses and `Retry-After` metadata as authoritative rather than inventing a numeric quota.

## Pagination

List operations expose provider page controls explicitly. The connector never walks all pages automatically. This keeps result volume and API usage bounded and lets the agent/human decide whether additional pages are necessary.

## Error handling

Provider non-success responses become `CockroachCloudError` instances with HTTP status, bounded provider body, and parsed retry timing when available. Network failures and timeouts are surfaced as connector errors. The bearer API key is never copied into error text.

Downstream consumers should not interpret provider error messages as instructions to alter system prompts, request broader roles, bypass approval, or expose credentials.

## Security considerations

- **Credential isolation:** service-account API keys remain inside the connector transport layer.
- **Least privilege:** CockroachDB Cloud RBAC remains authoritative; scope service accounts to the minimum required clusters/folders and roles.
- **SSRF/credential exfiltration defense:** the API origin is validated and pinned to official CockroachDB Cloud HTTPS infrastructure.
- **Prompt injection:** all provider-returned fields are marked untrusted data.
- **No privilege escalation:** no MCP tool can change connector permission flags, API keys, service-account roles, or organization RBAC.
- **No generic provider proxy:** callers cannot choose arbitrary paths, methods, or hosts.
- **Destructive defaults:** destructive tools are disabled by default, require exact per-call approval, require target confirmation, and are never automatically retried.
- **Sensitive metadata:** connection strings can reveal cluster/user/database topology even without a password; downstream clients should avoid logging or publishing them.

## Managed MCP comparison

CockroachDB Cloud's official hosted MCP server is the preferred direct provider integration when the desired workflow is schema exploration, read-only SQL, query planning, or other database-level interactions covered by its managed MCP tools. Cockroach Labs documents platform-side Cloud RBAC, `mcp:read`/`mcp:write` OAuth scopes for interactive clients, service-account API-key support for autonomous agents, read-only-by-default behavior, and explicit consent for writes.

This package solves a different integration problem: predictable cloud control-plane MCP tools with a small static surface and an independent local approval boundary. It therefore uses official REST instead of adding a redundant proxy around the managed MCP service.

## Testing

Normal tests use mocked `fetch` and require no live CockroachDB Cloud credentials.

```bash
npm test
```

Coverage includes:

- missing credential rejection;
- API-origin pinning;
- bounded retry configuration;
- stable risk classification for all nine tools;
- automatic READ permission;
- destructive default denial;
- approval binding to the exact payload;
- bearer header injection without returning the key;
- bounded retry of throttled reads;
- no blind retry for DELETE;
- MCP server construction without provider calls.

## Examples

See:

- `examples/workflows.md` for cluster inventory, database/user review, connection-string inspection, version discovery, SQL-user deletion, and cluster deletion flows.
- `examples/create-approval.mjs` for generating an exact-payload HMAC approval outside the LLM context.

No example contains real provider credentials.

## Limitations

- This connector implements nine focused Cloud API capabilities rather than the complete CockroachDB Cloud API.
- It does not proxy the official CockroachDB managed MCP server; clients needing database SQL/schema MCP operations should use that official service directly or build a separately reviewed narrow wrapper.
- It does not create SQL users because that API requires handling a SQL password; avoiding that capability keeps SQL credentials out of the model-facing tool surface.
- It does not create or resize clusters, modify networking, change maintenance/backup settings, manage physical replication, manage service accounts/API keys, or alter RBAC.
- Provider-side role/plan/cluster restrictions can make an otherwise valid tool call return 403/404; the connector does not broaden privileges in response.
- The Cloud API remains authoritative for exact response shapes and provider-side validation. Expand this connector only after re-checking current official API and RBAC documentation.
