# Scaleway MCP/API Connector

A reusable MCP connector for safe, agent-oriented access to selected Scaleway cloud operations.

## Transport strategy

No official Scaleway MCP server was identified during implementation. This connector therefore exposes a local MCP server and uses the official Scaleway REST APIs directly. The official JavaScript SDK is used as a reference for API shape, pagination, and error semantics, but the runtime deliberately uses `fetch` so the connector remains small and auditable.

Official sources:

- Developer API: https://www.scaleway.com/en/developers/api
- Instance API: https://www.scaleway.com/en/developers/api/instance
- Kubernetes API: https://www.scaleway.com/en/developers/api/kubernetes
- Container Registry API: https://www.scaleway.com/en/developers/api/registry
- Account/Project API: https://www.scaleway.com/en/developers/api/account/project
- IAM/API keys: https://www.scaleway.com/en/docs/iam/how-to/create-api-keys/
- Official JavaScript SDK: https://github.com/scaleway/scaleway-sdk-js

## Supported workflows

The connector intentionally focuses on infrastructure discovery and bounded operational control:

| Tool | Capability | Transport | Risk | Approval |
|---|---|---|---|---|
| `scaleway.project.list` | List Projects | REST | READ | No |
| `scaleway.instance.list` | List Instances in a zone | REST | READ | No |
| `scaleway.instance.get` | Inspect one Instance | REST | READ | No |
| `scaleway.instance.list_actions` | Read currently allowed Instance actions | REST | READ | No |
| `scaleway.instance.perform_action` | `poweron`, `poweroff`, or `reboot` | REST | HIGH_RISK | Explicit |
| `scaleway.kubernetes.cluster.list` | List Kapsule/Kosmos clusters | REST | READ | No |
| `scaleway.kubernetes.cluster.get` | Inspect one managed cluster | REST | READ | No |
| `scaleway.registry.namespace.list` | List Registry namespaces | REST | READ | No |
| `scaleway.registry.namespace.get` | Inspect namespace metadata/status | REST | READ | No |
| `scaleway.registry.image.list` | List Registry images | REST | READ | No |

Destructive operations such as deleting Instances, Kubernetes clusters, Projects, namespaces, or images are intentionally not implemented.

## Authentication and permissions

Scaleway APIs authenticate requests using the secret part of an API key in the `X-Auth-Token` header. API keys inherit the IAM permissions of their bearer (an IAM user or application). For production automation, use an IAM application with the narrowest policy required by the enabled tools rather than a broadly privileged personal key.

The LLM never receives the raw credential. `SCW_SECRET_KEY` is read only inside the connector process and is attached to outbound requests by `ScalewayClient`.

Required environment variable:

```text
SCW_SECRET_KEY=
```

Useful optional configuration:

```text
SCW_ORGANIZATION_ID=
SCW_PROJECT_ID=
SCW_DEFAULT_ZONE=fr-par-1
SCW_DEFAULT_REGION=fr-par
SCW_TIMEOUT_MS=15000
SCW_MAX_RETRIES=2
SCW_MAX_PAGES=10
SCW_ALLOW_WRITE=false
SCW_ALLOW_HIGH_RISK=false
```

`SCW_ALLOW_HIGH_RISK=true` only enables the possibility of executing `scaleway.instance.perform_action`; each call must still provide `approved: true`. This separates administrator configuration from per-action human approval.

## Runtime and installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio servers.

Example client configuration:

```json
{
  "mcpServers": {
    "scaleway": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/scaleway/dist/src/server.js"],
      "env": {
        "SCW_SECRET_KEY": "<provided-by-secure-runtime>",
        "SCW_PROJECT_ID": "<optional-project-id>",
        "SCW_ALLOW_HIGH_RISK": "false"
      }
    }
  }
}
```

Do not embed real credentials in committed MCP client configuration. Use your client's secret store, process environment, or deployment secret manager.

## Input validation

Zones are restricted to Scaleway's documented Availability Zone identifiers used by this connector. Regions are restricted to `fr-par`, `nl-ams`, `pl-waw`, and `it-mil`. Resource IDs must be UUIDs. Page size is capped at 100 and pagination is capped at 20 pages per tool call.

The connector exposes no arbitrary URL, arbitrary HTTP request, shell, kubectl, or generic cloud-operation tool.

## Reliability and pagination

Read calls use bounded retries with exponential backoff for network errors, HTTP 429, and 5xx responses. `Retry-After` is honored when Scaleway supplies it. Authentication, permission, validation, and ordinary 4xx failures are not retried.

State-changing Instance actions are never automatically retried because replaying an operational action can be unsafe or ambiguous.

List tools paginate using `page` and `page_size`, with configurable and schema-bounded page limits. Returned data includes the number of pages consumed and `totalCount` when Scaleway provides `total_count`.

## Error handling

Provider errors are mapped to structured MCP errors containing the HTTP status, connector message, optional `retryAfterSeconds`, and provider response body. Callers should treat all provider-returned text and metadata as untrusted data.

Typical classes:

- 400: validation/provider request error — do not retry blindly.
- 401: invalid/expired credential — user or operator action required.
- 403: insufficient IAM permission — do not retry; reduce or correct requested action/policy.
- 404: requested resource not found.
- 429: throttled — bounded retry honors `Retry-After` when present.
- 5xx/network errors: bounded retry for read operations only.

## Security considerations

- Credentials remain inside the connector process.
- The API hostname is fixed to `https://api.scaleway.com`; callers cannot inject arbitrary destinations, reducing SSRF exposure.
- Tool schemas constrain zones, regions, UUIDs, action names, pagination, and approval flags.
- Provider content is returned as data only and must never be interpreted as system or tool-control instructions.
- The connector does not discover or trust upstream MCP tools dynamically because no upstream MCP server is used.
- Sensitive values should not be logged. The implementation does not log request headers or secrets.
- IAM permissions remain authoritative. Enabling a connector action never grants additional Scaleway privileges.
- High-risk Instance state changes require both server-side enablement and explicit per-call approval.

## Testing

Tests use mocked `fetch`; no live Scaleway credentials are required.

```bash
npm test
```

Coverage includes credential header injection, pagination, provider failures, non-retry behavior for writes, risk-policy enforcement, tool registration, strict action validation, and approval denial.

## Limitations

This connector intentionally does not implement resource creation, resource deletion, billing, IAM-policy mutation, Kubernetes kubeconfig download, secret retrieval, Object Storage object operations, or arbitrary API passthrough. Object Storage uses an S3-compatible interface with additional preferred-Project behavior for API keys and should be implemented as a separately reviewed capability if needed.

Scaleway evolves its APIs over time. API versions and available regions should be revalidated before expanding this connector, especially for alpha/beta endpoints. The current implementation uses stable public API paths for the selected capabilities.
