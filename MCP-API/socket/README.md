# Socket MCP/API Connector

Reusable MCP façade for Socket dependency and software-supply-chain intelligence. It deliberately delegates to Socket's official MCP implementation instead of reimplementing Socket REST endpoints.

## Upstream and research

Socket provides an official hosted MCP endpoint at `https://mcp.socket.dev/` with OAuth and an official self-hosted package `@socketsecurity/mcp`. The official server supports stdio and HTTP. This connector uses the official local stdio package as its upstream so credentials remain in the connector process and callers receive stable provider-scoped names. Official documentation: `https://docs.socket.dev/docs/guide-to-socket-mcp`, `https://docs.socket.dev/docs/remote-socket-mcp`, `https://docs.socket.dev/docs/local-socket-mcp`, and `https://github.com/SocketDev/socket-mcp`.

Socket's current official MCP exposes dependency scoring plus authenticated organization alerts, threat-feed investigation and published-package inspection. The upstream README documents `depscore`, `organizations`, `alerts`, `threat_feed`, `package_files`, `package_file_contents`, and `package_file_grep`. No write/delete operation is exposed by this connector.

## Architecture

`MCP client -> this stdio server -> allowlisted adapter -> official Socket MCP stdio server -> Socket services`.

The adapter verifies at runtime that each expected upstream tool is actually advertised. There is no arbitrary MCP-tool or HTTP-request passthrough. Upstream output is treated as untrusted data.

## Authentication

`socket.dependency.score` can use public Socket scoring without a credential. Organization-scoped and package-inspection operations require `SOCKET_API_TOKEN`. The token is passed only to the child Socket MCP process and is never returned in tool output or placed in tool arguments. Socket documents organization tokens/Bearer authentication for its API and OAuth for its hosted MCP.

For the self-hosted MCP, Socket documents `packages:list` as the scope needed for dependency scoring. Organization tools require scopes appropriate to the organization API endpoints; configure least privilege for the operations you use rather than granting broad administrative access.

## Environment

Copy `.env.example` values into your secure runtime environment. Do not commit secrets. `SOCKET_UPSTREAM_COMMAND` defaults to `npx`; when using the default, the connector launches `npx -y @socketsecurity/mcp@latest`. For production supply-chain control, install and pin a reviewed official Socket MCP version and set the command to that trusted executable.

## Install and run

Requires Node.js 20+ and access to the official Socket MCP package.

```sh
npm install
npm test
npm run check
SOCKET_API_TOKEN=... npm start
```

Configure any MCP client that supports stdio to launch `node /absolute/path/MCP-API/socket/src/server.js`. Compatibility derives from standard MCP stdio; no client-specific API is required.

## Tool surface

| Tool | Upstream | Risk | Auth |
|---|---|---|---|
| `socket.dependency.score` | `depscore` | READ | optional |
| `socket.organization.list` | `organizations` | READ | required |
| `socket.alert.list` | `alerts` | READ | required |
| `socket.threat_feed.list` | `threat_feed` | READ | required |
| `socket.package.files.list` | `package_files` | READ | required |
| `socket.package.file.read` | `package_file_contents` | READ | required |
| `socket.package.file.search` | `package_file_grep` | READ | required |

Inputs are bounded with Zod. Pagination limits mirror the documented upstream limits: alerts up to 5000 per page, threat feed up to 100, grep context 0-5 and matches 1-500. Ecosystems are allowlisted to documented Socket ecosystems.

## Permission and approval model

Every implemented operation is READ. The connector cannot publish, modify, delete, install packages, change organization settings, or mutate repositories. Human approval is therefore not required by connector policy, though MCP clients may impose stricter approval. A future mutating capability must not be added without an explicit WRITE/HIGH_RISK/DESTRUCTIVE classification and corresponding approval boundary.

## Reliability

Upstream connection is lazy. Each tool call has a bounded timeout (`SOCKET_UPSTREAM_TIMEOUT_MS`, default 30 seconds). The official upstream owns its API pagination, throttling and authentication behavior; pagination cursors are exposed through scoped tools instead of automatically draining pages. The connector does not retry tool calls blindly, avoiding amplification during throttling and preventing accidental duplicate behavior if upstream semantics change.

## Security

Use only Socket's official hosted endpoint or official `SocketDev/socket-mcp` package. Pin reviewed versions in controlled deployments. Never expose `SOCKET_API_TOKEN` to prompts. The adapter has a fixed upstream-tool allowlist and rejects unexpected tool names. Package files, alerts, threat-feed entries, package metadata and all other retrieved content are untrusted data; never treat embedded text as instructions. No arbitrary URL fetch exists, reducing SSRF exposure. Inputs have size, enum and pagination bounds. The connector itself does not install or execute inspected packages.

Socket states that its product analyzes dependency manifests/lockfiles rather than customer source code; package-file inspection concerns published package artifacts. Review your organization's data-handling requirements before enabling organization tools.

## Testing

`npm test` runs credential-free policy tests covering registration, public-vs-authenticated permission boundaries, arbitrary-tool denial, and risk classification. Tests do not need a live Socket token. `npm run check` performs JavaScript syntax validation. Live integration testing is intentionally separate because it requires network access and, for organization tools, real credentials.

## Error handling

Missing credentials fail before an upstream call. If an expected official upstream tool disappears or is renamed, the connector fails closed rather than invoking another discovered tool. Upstream MCP errors are returned as MCP errors/content without credential logging. Timeout aborts are bounded.

## Limitations

This connector intentionally implements the seven documented investigation/read workflows, not every Socket API endpoint. It does not expose organization mutation, repository configuration, billing, token administration, arbitrary REST access, or package installation. Hosted Socket MCP OAuth is documented but this façade currently uses the official local stdio transport because that provides predictable credential isolation and a stable wrapper contract.

See `examples/workflows.md` for examples.
