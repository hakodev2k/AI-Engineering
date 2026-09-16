# Descope MCP/API Connector

Reusable safety facade over Descope's official remote MCP server. It exposes exactly eight stable provider-scoped tools, keeps the upstream credential inside the connector, marks provider output untrusted, and places connector-side approval in front of mutation buckets.

## Official transport and research
Descope operates official regional MCP servers at `https://mcp.descope.com` (US) and `https://mcp.euc1.descope.com` (EU). The official server covers the full Descope Management API and documentation search. Official documentation states that sessions begin read-only and write access requires explicit, time-bounded elevation. The server also supports Cross-App Access (XAA).

Official sources researched:
- https://docs.descope.com/mcp/mcp-server
- https://docs.descope.com/mcp
- https://docs.descope.com/mcp/sdks/express
- https://docs.descope.com/mcp/sdks/python

This package does not use an unofficial server and does not duplicate the Management REST API. Every provider operation is forwarded to Descope's official MCP server. This preserves Descope's own project selection, authorization, operation discovery, and read/write elevation model while adding a stable local policy boundary.

## Tools
| Connector tool | Official upstream tool | Risk | Approval |
|---|---|---|---|
| `descope.operation.discover` | `list_operations` | READ | no |
| `descope.session.inspect` | `session` | READ | no |
| `descope.project.read` | `project_read` | READ | no |
| `descope.project.write` | `project_write` | WRITE | yes |
| `descope.access_control.read` | `access_control_read` | READ | no |
| `descope.access_control.write` | `access_control_write` | HIGH_RISK | yes |
| `descope.docs.search` | `docs_search` | READ | no |
| `descope.docs.ask` | `docs_ask_question` | READ | no |

Descope intentionally groups many Management API operations into MCP bucket tools. Call `descope.operation.discover` first to obtain the current operation catalog and schemas. This connector does not invent or hard-code operation names that may evolve. It does not expose arbitrary HTTP requests, arbitrary MCP server URLs, destructive buckets, credential administration, billing, or a tool that changes connector policy.

## Architecture
```text
MCP client/agent
  -> local stdio connector
     -> strict bounded schema
     -> READ/WRITE/HIGH_RISK policy
     -> payload-bound approval
     -> credential-isolated MCP client
     -> official regional Descope MCP server
```

## Authentication
The official Descope MCP server uses Descope's managed MCP authorization model. Descope documents OAuth 2.1, user consent, scopes, DCR/CIMD, and optional Cross-App Access. This connector expects a short-lived already-authorized access token in `DESCOPE_MCP_ACCESS_TOKEN`; obtaining/refreshing that token belongs to the trusted MCP host or credential provider. The token is only inserted into the upstream Authorization header and never appears in tool arguments/results.

For interactive clients that can authenticate directly, connecting to Descope's official remote MCP server is the simplest option. This wrapper is useful when a local reusable contract and additional approval policy are required.

## Configuration
```text
DESCOPE_MCP_ACCESS_TOKEN=
DESCOPE_REGION=us                 # us | eu
DESCOPE_TIMEOUT_MS=20000          # 1000..120000
DESCOPE_ALLOW_WRITE=false
DESCOPE_APPROVAL_SECRET=
```
Never store real values in source control or prompts.

## Installation and running
Requires Node.js 20+.
```bash
npm install
npm run build
npm test
npm start
```
The connector serves standard MCP over stdio and is usable by MCP clients that can launch local stdio servers. The upstream is Streamable HTTP through the official MCP TypeScript SDK.

## Permission and human approval
READ tools can execute automatically. `descope.project.write` is WRITE. `descope.access_control.write` is HIGH_RISK because access-control changes can grant or revoke authorization. Mutations are disabled unless `DESCOPE_ALLOW_WRITE=true`.

Every mutation also requires `approvalId = HMAC-SHA256(DESCOPE_APPROVAL_SECRET, toolName + "\n" + canonicalJson(argumentsWithoutApprovalId))`. Generate this outside model context only after a human reviews the exact operation and payload. Changing the operation or any input invalidates approval. The connector cannot mint approval tokens or enable writes through a tool call.

Descope's own upstream write elevation remains authoritative as an additional control; connector approval does not bypass provider permissions or session elevation.

## Reliability, cancellation, and rate limits
Every upstream call has a bounded timeout and supports cancellation through AbortSignal. The connector does not blindly retry MCP tool calls because bucket operations can be mutating and the wrapper cannot safely infer idempotency from arbitrary discovered operations. If a read fails due to throttling or transient upstream failure, the caller should retry deliberately after respecting provider guidance.

Descope's public MCP documentation does not publish one universal numeric rate limit for all Management API/MCP operations, so this connector does not invent one. Operation discovery and bounded caller-driven pagination should be preferred over aggressive polling.

## Security
- Only official US/EU Descope MCP hosts are selectable; callers cannot supply a URL.
- Credentials remain in the connector transport layer.
- Provider responses are wrapped with `untrustedProviderData: true`; users, tenants, flows, audit logs, docs, and access-control data are data, not instructions.
- Newly discovered upstream operations are not automatically registered as new external MCP tools.
- Write buckets are operator-disabled by default and require payload-bound human approval.
- The connector exposes no destructive bucket and no arbitrary REST/MCP request tool.
- Access-control mutation is HIGH_RISK.
- Upstream Descope permissions, scopes, project selection, and time-bounded write elevation still apply.

## Errors
Local validation, missing credentials, write denial, and approval failure stop before upstream execution. Upstream MCP/auth failures are returned as connector errors without returning the access token. Authentication failures require user/operator action rather than automatic credential retry.

## Testing
`npm test` uses a fake upstream and no live credentials. Tests cover missing auth, official regional host pinning, exact tool count, read allowance, write denial, payload-bound approval, approval stripping before forwarding, and exact mapping to official MCP tool names.

## Examples
See `examples/workflows.md`. The intended pattern is discover -> read -> prepare -> human approve -> execute. For project/access-control operations, always use `descope.operation.discover` to retrieve the current official operation/schema before execution.

## Limitations
- OAuth browser login and token refresh/persistence are delegated to a trusted host/credential provider.
- The wrapper exposes the documented high-level official MCP buckets rather than mirroring the full dynamically discovered Management API catalog.
- Destructive management operations are intentionally not exposed.
- No automatic retry is performed for bucket tool calls because operation idempotency cannot be safely inferred.
- Private-cloud Descope deployments require Descope Support to enable the MCP server and are not represented by the public US/EU endpoints.
