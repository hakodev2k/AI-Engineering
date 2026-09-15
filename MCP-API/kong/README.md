# Kong Konnect MCP/API Connector

Reusable MCP server for Kong Konnect API-platform discovery and governed MCP catalog workflows.

## Upstream strategy
Kong provides an official hosted **Kong Konnect MCP Server**. Current regional endpoints are `https://us.mcp.konghq.com/`, `https://eu.mcp.konghq.com/`, and `https://au.mcp.konghq.com/`. Kong documents token authentication with a Personal Access Token (PAT) or System Account Access Token and states that queries respect Konnect RBAC and regional boundaries. The official server exposes specialized tools for control planes, Gateway Services, Routes, Consumers, Consumer Groups, plugins, vaults, analytics/debugging, and documentation search.

This package exposes a deliberately smaller, stable provider-scoped MCP contract. It uses official Konnect REST APIs for the implemented operations rather than dynamically forwarding arbitrary upstream MCP tools. This makes schemas, approval boundaries, retry behavior, and credential isolation deterministic while preserving compatibility with the same Konnect resources. Direct use of Kong's official MCP server remains recommended for interactive discovery/debugging that benefits from Kong's evolving native toolset.

Official sources researched: Kong Konnect MCP documentation and installation guide, Kong's official MCP release material, Kong Gateway entity documentation, Konnect Catalog MCP-server documentation, and kongctl authentication documentation.

## Architecture
`MCP client -> local stdio server -> strict tool schema -> approval boundary -> KongClient -> regional Konnect REST API`. The token is read only by the connector. Provider responses are labeled `untrustedProviderData:true` and must be treated as data, never instructions.

## Authentication
Set `KONG_KONNECT_TOKEN` to a Konnect PAT for user-context operation or a System Account Access Token for machine-to-machine workflows. Prefer a system account with the narrowest Konnect roles needed for the selected resources. The connector cannot elevate the token's permissions. Credentials are never returned to the model.

Set `KONG_KONNECT_REGION` to `us`, `eu`, or `au`; this pins requests to a known official regional host and prevents agent-controlled SSRF. No arbitrary URL/request tool exists.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
KONG_KONNECT_TOKEN=... KONG_KONNECT_REGION=us npm start
```

Configure an MCP client to launch `node /absolute/path/dist/src/server.js` over stdio.

## Tool catalog
| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `kong.control-plane.list` | list control planes | READ | no |
| `kong.control-plane.get` | get control plane metadata | READ | no |
| `kong.service.list` | list Gateway Services | READ | no |
| `kong.service.get` | get a Gateway Service | READ | no |
| `kong.route.list` | list Routes | READ | no |
| `kong.route.get` | get a Route | READ | no |
| `kong.consumer.list` | list Consumers | READ | no |
| `kong.plugin.list` | list configured plugins | READ | no |
| `kong.catalog.mcp-server.list` | list registered MCP servers | READ | no |
| `kong.catalog.mcp-server.create` | register MCP metadata in Catalog | WRITE | yes |

Catalog registration creates inventory metadata; it does not deploy or proxy an MCP server. Destructive tools, plugin mutation, credential creation, permission changes, and production configuration mutation are intentionally not exposed in this connector version.

## Permissions and approval
READ tools may execute automatically. WRITE requires the call envelope's `approved:true`; an embedding application should set that only after human approval. HIGH_RISK and DESTRUCTIVE categories are supported by the policy model but no such executable tools are exposed here. `KONG_KONNECT_APPROVE_WRITES` is reserved for embedding-policy configuration and does not bypass the per-call approval boundary in this version.

## Reliability and rate limits
Requests have a configurable timeout. Safe GET requests retry at most twice after the initial attempt using bounded exponential backoff for HTTP 429, transient 5xx, timeout, or network failure. `Retry-After` is honored when present. Writes are never blindly retried because an ambiguous failure can follow a committed mutation. Authentication, permission, and validation failures are not retried. List inputs use bounded page sizes (1–100) to avoid accidental fan-out.

Konnect limits vary by service/resource and plan; this connector intentionally does not invent a universal numeric quota. It responds to provider throttling and preserves the retry boundary rather than assuming a fixed allowance.

## Security
- Token remains inside the connector/auth layer and is not part of tool input or output.
- Regional hosts are allowlisted by configuration enum; callers cannot provide upstream URLs.
- Resource IDs are constrained and URL encoded.
- Provider text is untrusted data and cannot alter permissions, schemas, or tool registration.
- There is no unrestricted REST proxy and no automatic trust of newly discovered upstream MCP tools.
- Write execution has a separate approval field that is stripped from provider payloads.
- System-account tokens are preferred for automation because Konnect roles can bound machine permissions independently of a human PAT.
- Catalog MCP records should be reviewed before being treated as approved tools; registration alone is not proof that a remote server is safe.

## Official MCP vs REST
Kong's hosted MCP is remote Streamable HTTP and is the richer transport for AI-native exploration, analytics, active tracing/debugging, documentation search, and broader entity querying. The REST implementation here is selected for the fixed reusable contract above. Agent callers interact only with the local `kong.*` tools and do not receive credentials or arbitrary upstream MCP discovery.

## Examples
See `examples/workflows.json`. Calls use an envelope such as `{ "input": {"controlPlaneId":"..."}, "approved": false }`. Expected output is provider JSON wrapped with risk and `untrustedProviderData` metadata.

## Testing
`npm test` uses mocked fetch and no live credentials. Tests cover authentication configuration, tool registration, strict validation, read behavior, credential isolation, write approval, bounded pagination, rate-limit retries, and the no-retry rule for writes.

## Limitations
The official Kong MCP server has capabilities beyond this stable subset, including analytics, active tracing/debugging, documentation search, and additional Gateway entities. They are not claimed as local tools here. This connector also does not manage on-prem Kong Gateway Admin APIs, secrets/vault values, RBAC, billing, or destructive lifecycle actions. Endpoint versions can evolve; verify Kong's current Konnect API reference when extending the tool surface.
