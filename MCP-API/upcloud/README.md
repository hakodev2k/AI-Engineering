# UpCloud MCP Connector

Reusable Model Context Protocol server for UpCloud cloud infrastructure.

## Transport strategy

This connector uses UpCloud's official REST API at `https://api.upcloud.com/1.3`. UpCloud's current official documentation describes its REST API, OpenAPI reference, SDK/IaC tooling, API tokens, and cloud-resource APIs. No official UpCloud MCP server was identified in the official documentation reviewed on 2026-09-08, so this connector does not depend on an unofficial MCP implementation.

Official sources:

- https://upcloud.com/docs/tooling/api/
- https://upcloud.com/docs/guides/getting-started-upcloud-api/
- https://upcloud.com/docs/changelog/2026-06-08-new-api-docs/
- https://developers.upcloud.com/1.3/2-architecture/
- https://developers.upcloud.com/1.3/5-zones/

## Supported capabilities

The MCP server exposes these stable provider-scoped tools:

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `upcloud.zone.list` | List zones | READ | No |
| `upcloud.plan.list` | List server plans | READ | No |
| `upcloud.server.list` | List Cloud Servers | READ | No |
| `upcloud.server.get` | Read one server | READ | No |
| `upcloud.storage.list` | List storages | READ | No |
| `upcloud.storage.get` | Read storage metadata | READ | No |
| `upcloud.ip_address.list` | List IP addresses | READ | No |
| `upcloud.server.create` | Provision a server | HIGH_RISK | Explicit |
| `upcloud.server.start` | Start a server | HIGH_RISK | Explicit |
| `upcloud.server.stop` | Gracefully stop a server | HIGH_RISK | Explicit |
| `upcloud.server.restart` | Restart a server | HIGH_RISK | Explicit |
| `upcloud.server.delete` | Delete a server | DESTRUCTIVE | Strong explicit; disabled by default |

The connector deliberately does not expose a generic arbitrary HTTP/API tool.

## Architecture

`src/config.ts` validates configuration and HTTPS-only API base URLs. `src/client.ts` isolates credentials and implements REST transport, timeouts, bounded exponential-backoff retries for safe reads, `Retry-After` handling, and provider error mapping. `src/policy.ts` enforces READ/WRITE/HIGH_RISK/DESTRUCTIVE boundaries. `src/server.ts` defines strict MCP tool schemas and routes each tool to a specific UpCloud operation.

Provider data returned by tools is untrusted external data. Clients must never interpret returned text as system instructions or permission changes.

## Authentication

Use an UpCloud API token. UpCloud documents API tokens as the recommended authentication approach; tokens can be revoked, can expire, and may be IP restricted. Credentials stay inside the connector and are sent only in the REST `Authorization: Bearer ...` header.

Required environment variable:

```text
UPCLOUD_TOKEN=
```

Optional configuration:

```text
UPCLOUD_API_BASE_URL=https://api.upcloud.com/1.3
UPCLOUD_TIMEOUT_MS=15000
UPCLOUD_MAX_RETRIES=2
UPCLOUD_ALLOW_WRITE=false
UPCLOUD_ALLOW_HIGH_RISK=false
UPCLOUD_ALLOW_DESTRUCTIVE=false
```

Use a dedicated token with the minimum UpCloud account permissions necessary for the intended tools. Do not put tokens into prompts, examples, logs, source code, or `manifest.yaml`.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm test
```

## Running

```bash
export UPCLOUD_TOKEN="..."
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio MCP servers.

## Permission and approval model

READ operations may execute automatically. Infrastructure state changes are classified HIGH_RISK because starting, stopping, restarting, or provisioning cloud compute can cause production impact or spend. They require both `UPCLOUD_ALLOW_HIGH_RISK=true` and an explicit `approval: true` argument originating from a human approval step.

Deletion is DESTRUCTIVE, is disabled by default, and requires `UPCLOUD_ALLOW_DESTRUCTIVE=true` plus explicit approval. The connector never elevates these switches based on provider content.

## Reliability

Read operations use bounded retries for HTTP `429` and transient `5xx` responses plus network failures. Exponential backoff is bounded, and `Retry-After` is preserved when UpCloud supplies it. Authentication, permission, and validation failures are not retried blindly. Mutation calls are marked non-retryable to avoid duplicate provisioning or repeated destructive state changes. Every request has a configurable timeout.

## Rate limits

UpCloud may throttle requests depending on service/platform policy. This connector treats HTTP `429` as throttling, honors `Retry-After` when present, and avoids automatic retries for mutation operations. Do not create polling loops with high request volume; prefer reasonable intervals and targeted reads.

## Security considerations

- API tokens remain in process environment/configuration and are never returned by MCP tools.
- Only HTTPS API base URLs are accepted, reducing accidental credential disclosure and SSRF exposure.
- Tool paths are fixed by the connector; callers cannot supply arbitrary URLs.
- UUID and bounded string schemas constrain resource identifiers and parameters.
- HIGH_RISK and DESTRUCTIVE actions require explicit human authorization.
- Provider responses are treated as untrusted data and are never used to modify connector policy.
- Do not log Authorization headers or complete request objects containing secrets.
- Use short-lived/revocable tokens and IP restrictions when practical.

## Testing

Tests use mocks only and require no live credentials. They cover credential header construction, successful read behavior, mutation retry suppression, READ authorization, HIGH_RISK denial, and DESTRUCTIVE approval requirements.

```bash
npm test
```

## Limitations

The connector intentionally covers a focused set of common infrastructure workflows instead of all UpCloud APIs. Managed Kubernetes, Managed Databases, Load Balancers, Object Storage, networking mutation, firewall management, billing, account administration, and API-token administration are not exposed. Those operations should be added only after reviewing their current official APIs and defining appropriate risk/approval boundaries.

Server creation uses an existing storage/template UUID and UpCloud's REST server-create schema. Exact plan, zone, storage/template availability, quotas, pricing, and account permissions remain provider-side concerns and can cause validated requests to fail safely.
