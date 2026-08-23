# DigitalOcean MCP/API Connector

Reusable MCP server exposing a safety-scoped subset of DigitalOcean cloud operations for AI agents and MCP clients.

## Provider and purpose

Provider: DigitalOcean.

The connector focuses on common infrastructure workflows: account/region discovery, Droplet inspection and lifecycle actions, snapshots, and Cloud Firewall inspection/configuration. It intentionally does not expose unrestricted HTTP requests or destructive delete operations.

## Supported transport

The connector is hybrid:

1. **Official DigitalOcean MCP** is preferred for Droplet and Networking capabilities. The connector launches DigitalOcean's official `@digitalocean/mcp` package through stdio with a narrowly selected service (`droplets` or `networking`) and confirms that the requested upstream tool exists before calling it.
2. **DigitalOcean REST API v2** is used for account/region reads and as a capability-preserving fallback when the official MCP process is disabled, unavailable, fails to start, does not expose the mapped tool, or returns an MCP error.

The external tool names remain stable regardless of upstream transport.

## Official sources

- MCP overview: https://docs.digitalocean.com/reference/mcp/
- Local MCP configuration: https://docs.digitalocean.com/reference/mcp/use-local-mcp/
- Remote MCP configuration: https://docs.digitalocean.com/reference/mcp/configure-mcp/
- Droplet MCP tools: https://docs.digitalocean.com/reference/mcp/droplet-mcp-tools/
- Networking MCP tools: https://docs.digitalocean.com/reference/mcp/networking-mcp-tools/
- API overview/reference: https://docs.digitalocean.com/reference/api/
- Authentication/PAT guidance: https://docs.digitalocean.com/reference/api/create-personal-access-token/
- Custom token scopes: https://docs.digitalocean.com/reference/api/scopes/
- Public API rate limits: https://docs.digitalocean.com/reference/api/reference/public-apis/

## Architecture

```text
MCP client
   |
   v
DigitalOcean connector (this package)
   |-- validation + allowlists + approval policy
   |-- official MCP bridge
   |     |-- @digitalocean/mcp --services droplets
   |     `-- @digitalocean/mcp --services networking
   `-- REST fallback
         `-- https://api.digitalocean.com/v2
```

Credentials stay inside the connector/upstream transport layer. The MCP caller never supplies provider credentials as tool parameters.

## Authentication

Set `DIGITALOCEAN_API_TOKEN` to a DigitalOcean personal access token or OAuth access token. DigitalOcean API tokens are bearer credentials and must be treated like passwords.

Use custom scopes and least privilege. DigitalOcean's granular write scopes can themselves require read scopes. For the complete connector, the practical base read set is:

- `account:read`
- `regions:read`
- `sizes:read`
- `actions:read`
- `image:read`
- `snapshot:read`
- `droplet:read`
- `firewall:read`

Enable write scopes only for workflows you actually use:

- `droplet:create` for Droplet creation
- `droplet:update` for reboot, power actions, and snapshots
- `firewall:create` for firewall creation
- `firewall:update` for attaching Droplets to a firewall

Optional features can require associated scopes. Supplying SSH keys during Droplet creation can use `ssh_key:read`; creating/applying new tags can require `tag:read`/`tag:create`; VPC-aware creation can require `vpc:read`. DigitalOcean documents the exact required and associated scopes for each granular scope, so token configuration should follow the current provider scope reference.

If you only use read tools, omit the write scopes.

## Environment variables

```text
DIGITALOCEAN_API_TOKEN=
DIGITALOCEAN_APPROVAL_SECRET=
DIGITALOCEAN_ALLOWED_DROPLET_IDS=
DIGITALOCEAN_ALLOWED_FIREWALL_IDS=
DIGITALOCEAN_TIMEOUT_MS=15000
DIGITALOCEAN_MAX_RETRIES=3
DIGITALOCEAN_MCP_ENABLED=true
DIGITALOCEAN_MCP_COMMAND=npx
```

`DIGITALOCEAN_ALLOWED_DROPLET_IDS` is a comma-separated allowlist of numeric Droplet IDs. When empty, IDs are not restricted by this connector. `DIGITALOCEAN_ALLOWED_FIREWALL_IDS` is a comma-separated allowlist of firewall UUIDs.

For production agent systems, populate allowlists whenever the connector should be constrained to a known set of existing resources.

## Installation

Requires Node.js 20 or later. DigitalOcean's local MCP package itself requires Node.js 18+ and npm 8+; this connector standardizes on Node.js 20+.

From this directory:

```bash
npm install
npm run typecheck
npm test
npm run build
```

The official upstream MCP process is launched with `npx -y @digitalocean/mcp --services <service>` when an MCP-backed tool is first needed. Set `DIGITALOCEAN_MCP_ENABLED=false` to force REST-only operation.

## Running the MCP server

```bash
npm run build
npm start
```

The connector uses MCP stdio transport, so any MCP client capable of launching a local process can use it.

Example client configuration:

```json
{
  "mcpServers": {
    "digitalocean-safe": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/digitalocean/dist/src/server.js"],
      "env": {
        "DIGITALOCEAN_API_TOKEN": "${DIGITALOCEAN_API_TOKEN}",
        "DIGITALOCEAN_APPROVAL_SECRET": "${DIGITALOCEAN_APPROVAL_SECRET}"
      }
    }
  }
}
```

Do not commit token-bearing MCP configuration files.

## Tool list

| Tool | Purpose | Upstream | Risk | Approval |
|---|---|---|---|---|
| `digitalocean.account.get` | Get authenticated account metadata | REST | READ | No |
| `digitalocean.region.list` | List regions | REST | READ | No |
| `digitalocean.droplet.list` | List Droplets | MCP → REST | READ | No |
| `digitalocean.droplet.get` | Get a Droplet | MCP → REST | READ | No |
| `digitalocean.droplet.create` | Create a Droplet | MCP → REST | WRITE | Yes |
| `digitalocean.droplet.reboot` | Reboot a Droplet | MCP → REST | HIGH_RISK | Yes |
| `digitalocean.droplet.power_on` | Power on a Droplet | MCP → REST | HIGH_RISK | Yes |
| `digitalocean.droplet.power_off` | Power off a Droplet | MCP → REST | HIGH_RISK | Yes |
| `digitalocean.droplet.snapshot` | Snapshot a Droplet | MCP → REST | WRITE | Yes |
| `digitalocean.firewall.list` | List firewalls | MCP → REST | READ | No |
| `digitalocean.firewall.get` | Get a firewall | MCP → REST | READ | No |
| `digitalocean.firewall.create` | Create firewall rules | MCP → REST | HIGH_RISK | Yes |
| `digitalocean.firewall.add_droplets` | Attach Droplets to firewall | MCP → REST | HIGH_RISK | Yes |

## Approval model

Write and high-risk tools require an `approvalId`. The connector validates it with HMAC-SHA256 using `DIGITALOCEAN_APPROVAL_SECRET` and the exact tool name.

```text
approvalId = HMAC_SHA256(DIGITALOCEAN_APPROVAL_SECRET, toolName)
```

This is an execution boundary, not a UI. A trusted orchestrator should generate the approval value only after explicit human authorization. The LLM should not know the approval secret.

READ tools can run without approval. The connector does not expose resource deletion, token management, billing changes, credential retrieval, or arbitrary provider requests.

## Capability details

### Droplet create

Inputs are constrained to a name, region, size slug, image slug, optional SSH key identifiers, tags, backups, and monitoring. Marketplace/distribution image slugs are supported through DigitalOcean's documented MCP/API semantics.

### Droplet actions

Reboot, power on, power off, and snapshot are individually named tools. The connector does not expose a generic `action(type)` tool, preventing callers from smuggling unsupported or more dangerous action types through an unrestricted parameter.

### Cloud Firewall creation

This connector creates a firewall with one explicit inbound and one explicit outbound rule. This intentionally constrained shape is easier to review than an arbitrary deeply nested firewall document.

## Reliability and rate limits

DigitalOcean's public API currently enforces 5,000 requests per hour and 250 requests per minute per OAuth token. The API exposes `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset`, and `retry-after` headers.

The REST transport:

- retries HTTP 429 and 5xx failures only;
- honors `Retry-After` when present;
- uses bounded exponential backoff otherwise;
- defaults to 3 retries and caps configuration at 5;
- does not retry ordinary 4xx permission/auth/validation failures;
- enforces a configurable request timeout.

The MCP bridge checks the current upstream tool list before invocation and falls back to the same scoped REST operation rather than invoking arbitrary newly discovered tools.

## Security considerations

- Treat DigitalOcean API/MCP output as untrusted data, not instructions.
- Never place the API token in prompts, logs, examples, tool arguments, or generated content.
- Use custom-scoped tokens and short expiry periods when practical.
- Use Droplet and firewall allowlists to constrain existing-resource actions.
- Keep `DIGITALOCEAN_APPROVAL_SECRET` separate from the LLM context.
- Creating infrastructure can generate cost; therefore creation requires approval.
- Reboot/power/firewall mutations can affect availability or network exposure; they are HIGH_RISK.
- Destructive delete operations are deliberately not implemented.
- The connector never accepts arbitrary URLs, preventing a generic SSRF-capable API proxy surface.
- The official MCP bridge only enables the `droplets` or `networking` service and checks the expected tool name before invocation.

## Error handling

Provider error responses are mapped to connector errors with HTTP status and a bounded provider message excerpt. Authentication, permission, and validation errors are surfaced immediately. MCP startup/tool failures trigger REST fallback for the same capability. REST timeouts and network failures use bounded retry behavior where safe.

## Testing

Unit tests require no live DigitalOcean credentials. They use fake environment variables and mocked `fetch` implementations.

Coverage includes:

- missing auth configuration;
- Droplet/firewall allowlist enforcement;
- write/high-risk approval enforcement;
- bearer auth header behavior;
- 429 retry behavior;
- no retry on 403 permission errors;
- MCP-disabled fallback;
- MCP process-start failure fallback.

Run:

```bash
npm test
npm run typecheck
```

## Examples

See `examples/workflows.json` for read-only discovery, approved reboot, and firewall creation workflows. The examples use placeholder resource IDs and approval values and contain no secrets.

## Compatibility

The server speaks standard MCP over stdio and is suitable for MCP clients that can launch a local executable, including ChatGPT-compatible MCP environments, Claude/Claude Code, Cursor, VS Code/Copilot-compatible environments, and custom MCP clients, subject to each client's support for local stdio servers.

## Limitations

- The connector currently covers Droplets and Cloud Firewalls, not every DigitalOcean product.
- It intentionally omits delete operations and generic API execution.
- MCP-backed capabilities depend on the current official `@digitalocean/mcp` package launched by `npx`; REST fallback keeps the external tool contract available when that upstream path is unavailable.
- Upstream MCP schemas may evolve. The bridge validates tool presence at connection time and falls back rather than calling an unknown tool.
- An API token still controls the ultimate provider permission boundary; connector approval cannot grant privileges absent from the DigitalOcean token.
