# Temporal Cloud MCP/API Connector

Reusable MCP connector for selected Temporal Cloud control-plane workflows. It exposes stable, provider-scoped MCP tools while using Temporal's official Cloud Ops REST API behind a local security boundary.

## Official sources researched

- Temporal Cloud Ops API reference: https://saas-api.tmprl.cloud/docs/httpapi.html
- Temporal Cloud API/proto repository: https://github.com/temporalio/cloud-api
- Temporal Cloud CLI (`tcld`) and API-key guidance: https://github.com/temporalio/tcld
- Temporal Cloud Terraform provider: https://registry.terraform.io/providers/temporalio/temporalcloud/latest/docs
- Namespace endpoints update: https://temporal.io/changelog/namespace-endpoints-ga

The current Cloud Ops API is hosted at `https://saas-api.tmprl.cloud` and uses Bearer API-key authentication plus provider-side RBAC. No official Temporal-hosted MCP server for the Cloud Ops control plane was identified in the official sources reviewed for this connector. Community Temporal MCP servers therefore are not used. The connector uses the official REST API directly.

## Transport strategy

```text
MCP client / AI agent
        |
        v
Temporal Cloud connector (stdio)
  - strict tool schemas
  - risk classification
  - payload-bound approvals
  - credential isolation
  - timeout / bounded read retry
        |
        v
Official Temporal Cloud Ops API
https://saas-api.tmprl.cloud
```

No arbitrary HTTP request tool, raw URL proxy, shell command, workflow execution primitive, API-key minting tool, or generic Cloud Ops endpoint is exposed.

## Authentication and least privilege

Set `TEMPORAL_CLOUD_API_KEY` to a Temporal Cloud API key issued to a user or service account. Requests use:

```text
Authorization: Bearer <TEMPORAL_CLOUD_API_KEY>
```

Temporal Cloud RBAC remains authoritative. Use the narrowest role that supports the enabled workflow. Current Cloud Ops documentation defines account-level roles such as Account Owner, Account Admin, Account Developer, Finance Admin, and Account Read, plus namespace-level roles such as Namespace Admin, Namespace Write, and Namespace Read.

For automation, prefer a dedicated service account with a short-lived/rotated API key and narrowly scoped namespace/account access. Do not place credentials in prompts, source files, examples, logs, or MCP tool parameters.

`TEMPORAL_CLOUD_ALLOWED_ACCOUNT_ID` can pin the connector to one expected account. At startup the connector reads `/cloud/account` and fails closed if the returned account ID differs.

## Environment variables

```text
TEMPORAL_CLOUD_API_KEY=
TEMPORAL_CLOUD_API_BASE_URL=https://saas-api.tmprl.cloud
TEMPORAL_CLOUD_TIMEOUT_MS=15000
TEMPORAL_CLOUD_MAX_RETRIES=2
TEMPORAL_CLOUD_ALLOW_WRITE=false
TEMPORAL_CLOUD_ALLOW_HIGH_RISK=false
TEMPORAL_CLOUD_ALLOW_DESTRUCTIVE=false
TEMPORAL_CLOUD_APPROVAL_SECRET=
TEMPORAL_CLOUD_ALLOWED_ACCOUNT_ID=
```

The API origin is pinned to the official HTTPS host. Callers cannot redirect credentials to another origin.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run check
npm test
npm start
```

The connector exposes standard MCP over stdio and can be launched by MCP clients that support local stdio servers. Supply environment variables using the host's secure secret/configuration mechanism.

## Supported capabilities

| Tool | Cloud Ops operation | Risk | Approval |
|---|---|---:|---|
| `temporal_cloud.account.get` | `GET /cloud/account` | READ | No |
| `temporal_cloud.identity.get` | `GET /cloud/current-identity` | READ | No |
| `temporal_cloud.namespace.list` | `GET /cloud/namespaces` | READ | No |
| `temporal_cloud.namespace.get` | `GET /cloud/namespaces/{namespace}` | READ | No |
| `temporal_cloud.namespace.capacity.get` | `GET /cloud/namespaces/{namespace}/capacity-info` | READ | No |
| `temporal_cloud.region.list` | `GET /cloud/regions` | READ | No |
| `temporal_cloud.region.get` | `GET /cloud/regions/{region}` | READ | No |
| `temporal_cloud.user.list` | `GET /cloud/users` | READ | No |
| `temporal_cloud.user.get` | `GET /cloud/users/{userId}` | READ | No |
| `temporal_cloud.service_account.list` | `GET /cloud/service-accounts` | READ | No |
| `temporal_cloud.service_account.get` | `GET /cloud/service-accounts/{serviceAccountId}` | READ | No |
| `temporal_cloud.audit_log.list` | `GET /cloud/audit-logs` | READ | No |
| `temporal_cloud.operation.get` | `GET /cloud/operations/{asyncOperationId}` | READ | No |
| `temporal_cloud.namespace.create` | `POST /cloud/namespaces` | HIGH_RISK | Explicit |
| `temporal_cloud.namespace.tags.update` | `POST /cloud/namespaces/{namespace}/update-tags` | WRITE | Explicit |
| `temporal_cloud.namespace.delete` | `DELETE /cloud/namespaces/{namespace}` | DESTRUCTIVE | Explicit + disabled by default |

Namespace deletion permanently deletes the namespace and its data, so the connector requires the current `resourceVersion`, a payload-bound approval token, an operator-side destructive feature gate, and exact confirmation text.

## Permission and approval model

READ tools may execute automatically subject to Temporal Cloud RBAC.

WRITE requires `TEMPORAL_CLOUD_ALLOW_WRITE=true` plus an approval token.

HIGH_RISK requires `TEMPORAL_CLOUD_ALLOW_HIGH_RISK=true` plus an approval token. Namespace creation is HIGH_RISK because it creates billable infrastructure and can alter the control-plane topology.

DESTRUCTIVE requires `TEMPORAL_CLOUD_ALLOW_DESTRUCTIVE=true`, a valid approval token, and any tool-specific strong confirmation. Destructive operations are disabled by default.

Approval tokens are HMAC-SHA256 values bound to the exact external tool name and canonicalized exact payload excluding `approvalToken`:

```text
hex(HMAC-SHA256(
  TEMPORAL_CLOUD_APPROVAL_SECRET,
  "<tool-name>\n<canonical-json-payload>"
))
```

Changing a namespace name, region, retention period, tag, resource version, or other argument invalidates approval. The approval secret stays outside model context.

## Validation and security

Tool arguments use strict Zod validation. Identifiers and pagination are bounded. Namespace listing follows the provider's documented maximum page size of 1000. The connector constructs only fixed `/cloud/...` paths and rejects arbitrary paths, reducing SSRF and credential-exfiltration risk.

Provider-returned account data, user data, namespace descriptions, audit logs, tags, and error bodies are wrapped with `untrusted_provider_data: true`. They must be treated as data, never as instructions capable of changing tool permissions, approval policy, system prompts, or credentials.

The connector intentionally omits API-key creation/deletion, user/service-account mutation, group/RBAC mutation, connectivity-rule mutation, namespace failover, export sinks, audit-log sinks, custom roles, billing changes, Nexus mutation, and project administration. These are security-sensitive or account-administrative surfaces that require separate policy design.

## Reliability and rate limiting

Every request has a configurable `AbortController` timeout. GET requests use bounded retries for network errors and HTTP 429/502/503/504 responses. `Retry-After` is honored when returned; otherwise bounded exponential backoff is used.

Authentication, authorization, validation, and ordinary 4xx errors are not retried blindly. POST and DELETE requests are single-attempt by design because retrying an ambiguous mutation can duplicate provisioning or repeat destructive actions.

The public Cloud Ops OpenAPI/reference reviewed for this connector does not publish one universal numeric request quota, so the connector does not invent a fixed rate. Provider 429 responses and retry metadata remain authoritative.

## Pagination

List operations expose `pageSize` and `pageToken` rather than recursively crawling the account. This prevents hidden request amplification and lets callers deliberately follow `nextPageToken` when needed.

## Error handling

Non-success provider responses become `TemporalCloudError` objects internally with HTTP status, provider body, and `Retry-After` when present. MCP output contains only a bounded error summary and never the API key. Timeouts are surfaced explicitly.

Async namespace operations return Temporal Cloud async-operation IDs. Use `temporal_cloud.operation.get` to inspect completion/failure instead of blindly repeating a mutation.

## Real-world workflows

Common safe flows include:

```text
account.get
 -> namespace.list
 -> namespace.get
 -> namespace.capacity.get
 -> operation.get
```

and access review:

```text
identity.get
 -> user.list
 -> service_account.list
 -> audit_log.list
```

Provisioning follows `Inspect -> Recommend -> Human approval -> namespace.create -> operation.get`.

Deletion follows `namespace.get -> verify resourceVersion -> explicit human approval -> namespace.delete -> operation.get`.

See `examples/workflows.md` for concrete payloads.

## Testing

Normal tests use mocks/fakes and require no live Temporal Cloud credentials.

```bash
npm test
```

Coverage includes required authentication configuration, official-host enforcement, secure defaults, provider-scoped tool registration, payload-bound approval, credential injection in the HTTP layer, auth error non-retry behavior, write single-attempt behavior, and default denial of destructive deletion.

## Limitations

- This package manages the Temporal Cloud control plane; it does not execute or mutate workflow histories in a Namespace data plane.
- It does not implement browser OAuth/device login; service automation uses a pre-provisioned Cloud API key.
- No official Temporal Cloud Ops MCP transport is claimed because one was not identified in the current official documentation researched for this run.
- Only 16 high-value operations are exposed, not the complete Cloud Ops API.
- Projects are omitted because Temporal's current API documentation marks Projects as an upcoming feature that may not be enabled for every account.
- Namespace creation exposes a deliberately constrained subset of the full NamespaceSpec. Advanced mTLS, private connectivity, HA, codec-server, fairness, search-attribute, and provisioned-capacity configuration should be handled in separately reviewed tools instead of a broad raw spec passthrough.
