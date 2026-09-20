# Socket.dev MCP/API Connector

Reusable MCP server for Socket.dev software-supply-chain security workflows. It exposes a deliberately small, stable tool surface over Socket's official REST API. Socket also publishes an official MCP server (`SocketDev/socket-mcp`); this connector keeps its own constrained contract so approval, validation, and credential isolation remain explicit and portable.

## Official sources
- REST API/reference: https://docs.socket.dev/reference/introduction-to-socket-api
- Authentication: https://docs.socket.dev/reference/authentication
- API tokens/scopes: https://docs.socket.dev/docs/api-keys
- Quota/rate limiting: https://docs.socket.dev/reference/quota
- Full scans: https://docs.socket.dev/reference/createorgfullscan
- Official MCP repository: https://github.com/SocketDev/socket-mcp

## Transport
All implemented tools use Socket's official REST API at `https://api.socket.dev/v0`. The deprecated JavaScript SDK is intentionally not used. The official MCP server is documented as an upstream alternative, not automatically delegated to: this avoids trusting newly discovered upstream tools and keeps this connector's permission boundary deterministic.

## Authentication
Set `SOCKET_API_TOKEN` to an organization token. The connector sends it only as a Bearer header from the client layer; it is never returned in MCP results. Optionally set `SOCKET_ORG_SLUG`. Tokens are organization-scoped and should carry only scopes required by enabled workflows.

Recommended least-privilege scopes: `alerts:list`, `repo:list`, `full-scans:list`, `packages:list`; add `full-scans:create` only if scan creation is required. Socket documents per-token quota and returns HTTP 429 with `Retry-After` when quota is exhausted.

## Installation
Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by any MCP host that supports stdio subprocess servers. Compatibility depends on the host's MCP implementation; no host-specific protocol extensions are required.

## Configuration
Copy `.env.example` values into your secure process environment. `SOCKET_API_BASE_URL` is configurable for testing but should remain the official HTTPS endpoint in production. `SOCKET_TIMEOUT_MS` defaults to 20000. `SOCKET_APPROVE_WRITES=false` disables mutating POST operations by default.

## Tools
| Tool | Purpose | Risk | Scope | Approval |
|---|---|---|---|---|
| `socket.quota.get` | Read token quota | READ | none | no |
| `socket.organization.list` | Discover organizations | READ | token access | no |
| `socket.alert.list` | Filter/paginate alerts | READ | `alerts:list` | no |
| `socket.repository.list` | List repositories | READ | `repo:list` | no |
| `socket.full_scan.list` | List scans | READ | `full-scans:list` | no |
| `socket.full_scan.get` | Read scan/SBOM artifacts | READ | `full-scans:list` | no |
| `socket.package.inspect` | Inspect a PURL | READ semantics | `packages:list` | conservative POST gate |
| `socket.full_scan.create` | Create a scan | WRITE | `full-scans:create` | yes |

No delete, arbitrary HTTP, token-management, policy mutation, or permission-management tool is exposed.

## Approval model
READ tools execute automatically. `socket.full_scan.create` requires both `approved:true` and `SOCKET_APPROVE_WRITES=true`; this prevents an agent from enabling its own write capability. `socket.package.inspect` is semantically read-only but Socket exposes PURL inspection via POST, so this version conservatively applies the POST gate. This can be separated into semantic read/write gating in a future connector revision without broadening scopes.

## Reliability
Requests have bounded timeouts and map provider failures to `SocketError`. HTTP 429 captures `Retry-After` so the MCP caller can defer rather than spin. Authentication, permission, and validation failures are not retried. The connector itself performs no automatic retries, preventing accidental quota amplification and unsafe duplicate writes. Cursor-based alert pagination is exposed explicitly.

## Security
Credentials stay in the connector process. Tool schemas constrain organization slugs, IDs, pagination sizes, enum filters, and PURLs. Provider responses are wrapped with `trust: untrusted-provider-data`; retrieved package/repository/alert content must never be interpreted as system instructions. Arbitrary URLs and raw endpoint execution are not exposed, limiting SSRF and privilege-escalation paths. Use an OS/process secret manager for `SOCKET_API_TOKEN`; never place a real token in MCP configuration committed to source control.

## Rate limits and quota
Socket assigns quota costs per endpoint and maximum hourly quota per token. `socket.quota.get` consumes zero quota according to the official reference. On insufficient quota Socket returns 429 and `Retry-After`; callers should wait that duration. Avoid high-cardinality pagination loops and fetch only pages needed for the workflow.

## Testing
`npm test` compiles then runs Node's built-in test runner. Unit tests require no live Socket credentials and cover missing authentication configuration, write approval denial, timeout mapping, and 429/Retry-After handling. Provider calls should be integration-tested separately with a low-privilege test token.

## Limitations
The connector intentionally implements a focused subset rather than every Socket endpoint. It does not expose Threat Feed (special license), alert-resolution mutation, policy mutation, webhooks, token administration, or destructive operations. Full-scan creation accepts the provider request payload as a structured object because Socket scan upload representations can vary by manifest workflow; callers remain constrained to the single full-scan endpoint and explicit approval boundary. Consult the current official API reference before enabling write workflows.
