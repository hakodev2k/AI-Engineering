# Portainer MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of Portainer operations for AI agents. It targets the Portainer REST API and never exposes an arbitrary HTTP-request tool.

## Upstream strategy

Portainer's current platform exposes its management API under `/api` and supports personal access tokens. Portainer has also announced **Portainer-Command**, an MCP gateway for Portainer 3.x agentic operations. As of 2026-09-16 that gateway is described as upcoming rather than a stable general-purpose MCP surface, so this connector uses the official REST API for a stable, explicit tool contract. Portainer-Run separately advertises an MCP deployment path for its narrow AI-built-app workflow; that is not a substitute for the general Portainer management API.

Official sources:
- Portainer API documentation / Swagger is shipped with Portainer and is normally available from the instance documentation/API surface.
- Portainer 2.45 LTS release: https://www.portainer.io/blog/portainer-2-45-lts-release
- Portainer 3.0 / Portainer-Command announcement: https://www.portainer.io/blog/portainer-3-0-is-coming
- Portainer-Run MCP description: https://portainer.io/solutions/portainer-run
- Official Terraform provider announcement: https://portainer.io/blog/portainer-terraform-provider-now-ga-infrastructure-as-code-meets-container-management-simplicity

## Runtime and architecture

Node.js 20+, TypeScript, `@modelcontextprotocol/sdk`, stdio MCP transport. Flow: MCP client -> strict tool schema -> approval/permission guard -> `PortainerClient` -> credential header injection -> configured Portainer instance. The access token exists only in the connector process and is never returned to the model.

## Authentication

Set `PORTAINER_BASE_URL` and `PORTAINER_ACCESS_TOKEN`. The token is sent as `X-API-Key`. Create a dedicated Portainer user/token with only the RBAC rights needed for the environments and resources the agent should see. Do not use an administrator token unless the workflow genuinely requires it. Production base URLs must use HTTPS.

Environment variables:
- `PORTAINER_BASE_URL` — instance origin, for example `https://portainer.example.com`.
- `PORTAINER_ACCESS_TOKEN` — personal access token; secret.
- `PORTAINER_TIMEOUT_MS` — request timeout, default 15000.
- `PORTAINER_MAX_RETRIES` — bounded retry count for safe reads, default 2, maximum 4.
- `PORTAINER_ALLOW_WRITES` — must be exactly `true` to enable stack start/stop.
- `PORTAINER_APPROVAL_TOKEN` — out-of-band human approval value required for every high-risk execution.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `portainer.system.status` | REST | READ | No |
| `portainer.environment.list` | REST | READ | No |
| `portainer.environment.get` | REST | READ | No |
| `portainer.stack.list` | REST | READ | No |
| `portainer.stack.get` | REST | READ | No |
| `portainer.registry.list` | REST | READ | No |
| `portainer.user.list` | REST | READ | No |
| `portainer.container.list` | REST via environment Docker proxy | READ | No |
| `portainer.stack.start` | REST | HIGH_RISK | Explicit |
| `portainer.stack.stop` | REST | HIGH_RISK | Explicit |

The connector intentionally omits user creation/deletion, RBAC mutation, registry credential mutation, environment deletion, stack deletion, arbitrary Docker proxy requests, and Kubernetes mutation. Those operations have substantially larger blast radius and should be added only as dedicated, separately reviewed tools.

## Install and run

```bash
npm install
npm run build
PORTAINER_BASE_URL=https://portainer.example.com PORTAINER_ACCESS_TOKEN=... npm start
```

Configure any MCP client that supports a local stdio server to execute `node /absolute/path/dist/server.js`. Compatibility is protocol-based; this package does not claim product-specific certification.

## Reliability and rate limiting

Every request has an abort timeout. GET/HEAD operations retry only transient network failures, HTTP 429, and 5xx responses, with bounded exponential backoff and `Retry-After` support. Authentication, authorization, validation, and high-risk writes are never blindly retried. Stack start/stop uses no automatic retry because repeating an infrastructure mutation can produce ambiguous state. Pagination is delegated to the specific Portainer endpoint; this connector's selected list endpoints return the API's normal list result without hidden fan-out.

Portainer deployments and reverse proxies can impose different rate limits, so the connector does not invent a universal quota. HTTP 429 is preserved as `RATE_LIMIT`, and the server honors `Retry-After` on safe reads.

## Security model

Provider content is marked as untrusted before being returned. Names, labels, stack metadata, image metadata, and other retrieved content must never be interpreted as instructions. Tool schemas accept numeric IDs and booleans rather than URLs, preventing model-controlled SSRF through this connector. The base URL is administrator configuration, not a tool parameter. Credentials are injected in the client layer and are not accepted in tool arguments.

Writes are fail-closed: `PORTAINER_ALLOW_WRITES=true` is required and the caller must provide the exact current out-of-band approval token. Treat that token as a human authorization artifact, rotate it, and do not put it in prompts or persistent model context. Stack stop/start are classified HIGH_RISK because they change workload availability. A restart is intentionally two separate approved calls so an agent cannot silently stop and restart a production workload as one opaque action.

For internet-facing Portainer, follow Portainer's guidance: HTTPS, strong/external authentication, restricted network access, current releases, and least privilege.

## Errors

`AUTHENTICATION` maps HTTP 401, `PERMISSION` maps 403, `RATE_LIMIT` maps 429, `PROVIDER_ERROR` maps other non-success responses, `TIMEOUT` maps aborted requests, and `NETWORK` maps transport failures. Provider error bodies may contain untrusted text and should not be promoted into instructions.

## Testing

```bash
npm test
npm run build
```

Unit tests use fake fetch implementations and require no live credentials. They cover missing auth, credential injection, read behavior, permission denial, bounded 429 retry, write-disabled behavior, approval enforcement, and untrusted-output marking.

## Limitations

Portainer editions and versions can differ in endpoint availability and RBAC behavior. The connector is intentionally conservative and currently targets the stable 2.x API patterns used by Portainer 2.45 LTS while Portainer 3.0 is being introduced. Validate against the Swagger/OpenAPI documentation shipped with the exact Portainer instance before enabling writes. Portainer-Command should be re-evaluated when its supported MCP contract becomes generally available; until then no unofficial MCP dependency is used.
