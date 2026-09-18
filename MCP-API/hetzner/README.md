# Hetzner Cloud MCP Connector

Reusable MCP server exposing a deliberately scoped subset of the official Hetzner Cloud REST API for infrastructure inspection and controlled server lifecycle operations.

## Upstream and sources

Transport is **REST only**. No official Hetzner MCP server was identified during implementation, so this connector uses the official Cloud API directly. Official references: `https://docs.hetzner.cloud/reference/cloud`, `https://docs.hetzner.com/cloud/api/getting-started/generating-api-token/`, and `https://docs.hetzner.com/cloud/api/getting-started/using-api/`.

Hetzner project API tokens are Bearer tokens and can be created as Read or Read & Write. Tokens are project-scoped. Use Read whenever this connector is deployed only for discovery/inspection; lifecycle tools require Read & Write.

## Implemented tools

| Tool | Operation | Risk | Approval |
|---|---|---|---|
| `hetzner.server.list` | Paginated server inventory | READ | No |
| `hetzner.server.get` | Server metadata/status | READ | No |
| `hetzner.server_type.list` | Available server types | READ | No |
| `hetzner.image.list` | Images | READ | No |
| `hetzner.network.list` | Networks | READ | No |
| `hetzner.volume.list` | Volumes | READ | No |
| `hetzner.server.create` | Create server | HIGH_RISK | Yes |
| `hetzner.server.power_on` | Power on | HIGH_RISK | Yes |
| `hetzner.server.power_off` | Power off | HIGH_RISK | Yes |
| `hetzner.server.reboot` | Reboot | HIGH_RISK | Yes |
| `hetzner.server.delete` | Delete server | DESTRUCTIVE | Yes + matching server ID |

The connector intentionally does not expose an arbitrary HTTP proxy, permission management, billing operations, SSH execution, or bulk deletion.

## Architecture

MCP client -> strict MCP tool schema -> approval boundary -> `HetznerClient` -> official Hetzner Cloud API. Credentials are read by the connector process and are never returned in tool output. Provider data is wrapped as `untrustedProviderData`; callers must treat names, labels and other remote content as data rather than instructions.

## Authentication and environment

Copy `.env.example` into your secret-management workflow. `HETZNER_API_TOKEN` is required. `HETZNER_API_BASE_URL` defaults to `https://api.hetzner.cloud/v1`; do not point it at an untrusted host. `HETZNER_TIMEOUT_MS` defaults to 15000 and `HETZNER_MAX_RETRIES` to 2. `HETZNER_APPROVAL_TOKEN` gates all state-changing tools. Supply approval out-of-band from a trusted orchestrator; do not place it in model prompts or repository files.

Hetzner's token permission model is coarse: Read allows GET; Read & Write allows GET/POST/PUT/DELETE. This connector adds a narrower local permission boundary so possession of a write-capable provider token does not itself authorize tool execution.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
HETZNER_API_TOKEN=... node dist/src/server.js
```

Configure an MCP client to launch the command above over stdio and inject environment variables using its credential facility. Compatibility is with MCP clients that support stdio servers; exact client configuration varies.

## Reliability and rate limits

GET requests use bounded exponential backoff for network failures, HTTP 5xx and 429. Writes are never automatically retried, avoiding duplicate or repeated state changes. Requests have a configurable timeout and accept cancellation in the client layer. Collection tools use provider pagination and cap `perPage` at 50.

The official API documents a default rate limit of 3600 requests/hour/project and returns `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`. On 429 the connector preserves the reset-derived retry interval in `HetznerError`. It does not busy-loop or fan out pagination automatically.

## Error handling

Provider errors become `HetznerError` with HTTP status and provider message. Authentication/permission/validation failures are not retried. Timeout aborts fail the current call. Destructive operations are never retried. A delete additionally requires `confirmServerId` to exactly match `id`.

## Security

Use one project-scoped token per environment and the least provider permission possible. Keep tokens and approval material in a secret store. Do not log request headers. Provider responses may contain attacker-controlled labels/names and are untrusted. Tool schemas constrain IDs, names, collection sizes and allowed lifecycle actions. There is no URL input, preventing tool-level SSRF through arbitrary destinations. The API base URL is operator configuration and must remain trusted. Creating servers is billable and runtime changes can cause outages, so those operations always require explicit approval. Deletion is destructive and uses both approval and resource-ID confirmation.

## Testing

```bash
npm test
```

Tests use mocked `fetch` and require no live credentials. They cover auth configuration, pagination/header construction, provider error mapping, rate-limit metadata, bounded read retries, and the rule that write failures are not retried. Approval and destructive confirmation are enforced in the MCP handlers and documented in examples.

## Limitations

This connector intentionally implements a useful core rather than every Hetzner endpoint. It does not manage load balancers, firewalls, DNS records, certificates, placement groups, primary/floating IPs, SSH keys, snapshots, backups, or server mutation beyond the listed lifecycle actions. It does not implement OAuth because the Cloud API workflow documented for this use case uses project API tokens. It does not proxy any unofficial MCP server.
