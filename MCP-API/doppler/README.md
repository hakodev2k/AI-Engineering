# Doppler MCP/API Connector

Reusable MCP server for Doppler secrets-management workflows. It exposes a small, stable provider-scoped tool surface while routing supported operations through Doppler's official MCP server when available and falling back to the official Doppler REST API when the MCP process is disabled, unavailable, or does not expose the requested tool.

## Official sources researched

- Doppler MCP Server: https://docs.doppler.com/docs/mcp
- Official MCP implementation: https://github.com/DopplerHQ/mcp-server
- Doppler API reference: https://docs.doppler.com/reference/api
- Secret list: https://docs.doppler.com/reference/secrets-list
- Secret names: https://docs.doppler.com/reference/secrets-names
- Secret retrieve: https://docs.doppler.com/reference/secrets-get
- Secret update: https://docs.doppler.com/reference/secrets-update
- Secret download: https://docs.doppler.com/reference/secrets-download
- Service tokens: https://docs.doppler.com/docs/service-tokens
- Token formats: https://docs.doppler.com/reference/auth-token-formats
- Platform and API limits: https://docs.doppler.com/docs/platform-limits

The official Doppler MCP server is currently documented as experimental. It runs locally over stdio through `@dopplerhq/mcp-server`, auto-generates tools from Doppler's OpenAPI specification, supports `--read-only`, `--project`, and `--config`, and can authenticate with `DOPPLER_TOKEN`.

## Transport strategy

The connector prefers Doppler's official MCP tools for operations for which the official server advertises a stable corresponding tool, including `projects_list`, `projects_get`, `configs_list`, `configs_get`, `secrets_list`, `secrets_get`, `secrets_update`, and `secrets_download`.

If the upstream MCP process cannot start, the tool is absent, MCP is disabled, or the MCP call fails, the connector uses the official REST API at `https://api.doppler.com/v3` for the same external tool contract. `doppler.secret.names` uses REST directly because it is useful as a deliberately value-minimizing discovery operation.

Agent callers do not need to know which upstream transport completed the request.

## Implemented tools

| Tool | Purpose | Risk | Approval |
|---|---|---:|---:|
| `doppler.project.list` | List accessible projects | READ | No |
| `doppler.project.get` | Get project metadata | READ | No |
| `doppler.config.list` | List configs in a project | READ | No |
| `doppler.config.get` | Get config metadata | READ | No |
| `doppler.secret.names` | List secret names without intentionally requesting values | READ | No |
| `doppler.secret.list` | Read secret values from a config | HIGH_RISK | Yes |
| `doppler.secret.get` | Read one secret value | HIGH_RISK | Yes |
| `doppler.secret.download` | Download selected secret values as JSON | HIGH_RISK | Yes |
| `doppler.secret.update` | Create or update named secrets | HIGH_RISK | Yes |

No delete, project mutation, workplace administration, account administration, token creation, config rollback, or permission-changing tools are exposed. Those provider capabilities exist in broader Doppler surfaces but are intentionally excluded from this connector.

## Architecture

```text
MCP client
   |
   v
Doppler wrapper MCP server
   |-- policy + strict Zod validation
   |-- connector-local credential boundary
   |-- approval gate for sensitive reads/writes
   |
   +--> official Doppler MCP server (preferred where mapped)
   |
   +--> official Doppler REST API (fallback / names-only read)
```

Provider responses are returned as untrusted external data. Secret-bearing responses are additionally marked `sensitive: true`. Retrieved provider content must never be interpreted as tool-policy or system instructions.

## Authentication

Set `DOPPLER_TOKEN` in the connector process environment. Tokens are never accepted as MCP tool arguments and are never intentionally returned in tool output.

Prefer a Doppler Service Token scoped to the smallest project/config needed. Doppler documents service tokens as an appropriate least-privilege mechanism for config-scoped application access. Keep `DOPPLER_READ_ONLY=true` unless secret updates are explicitly required.

Supported recognized Doppler token prefixes include CLI, personal, service, service-account, service-account-identity, audit, and SCIM token families. The connector only validates the prefix locally; Doppler remains authoritative for validity and permissions.

## Environment variables

```text
DOPPLER_TOKEN=                 # required
DOPPLER_PROJECT=               # optional fixed project scope
DOPPLER_CONFIG=                # optional fixed config scope
DOPPLER_READ_ONLY=true         # default true
DOPPLER_USE_UPSTREAM_MCP=true  # default true
DOPPLER_APPROVAL_SECRET=       # required for sensitive tools
DOPPLER_TIMEOUT_MS=15000       # 1000..120000
DOPPLER_MAX_RETRIES=3          # 0..5
```

When `DOPPLER_PROJECT` and/or `DOPPLER_CONFIG` are set, callers cannot override them with a different target. This is an application-level guard in addition to Doppler token scoping; it is not a substitute for least-privilege provider credentials.

## Installation

Requirements: Node.js 20 or later and an MCP-compatible client.

```bash
npm install
npm run build
```

The official upstream MCP server is started with `npx -y @dopplerhq/mcp-server` only when an operation attempts to use it. For controlled production environments, pin and review the upstream package through your normal dependency-management process rather than relying on an unpinned network fetch.

## Run

```bash
export DOPPLER_TOKEN='your-token-from-a-secure-secret-provider'
export DOPPLER_PROJECT='example-app'
export DOPPLER_CONFIG='prd'
export DOPPLER_READ_ONLY='true'
node dist/src/server.js
```

Example MCP-client configuration:

```json
{
  "mcpServers": {
    "doppler-connector": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/doppler/dist/src/server.js"],
      "env": {
        "DOPPLER_TOKEN": "<injected-by-your-credential-provider>",
        "DOPPLER_PROJECT": "example-app",
        "DOPPLER_CONFIG": "prd",
        "DOPPLER_READ_ONLY": "true"
      }
    }
  }
}
```

Do not paste the real token into prompts or source-controlled MCP configuration. Use your operating-system keychain, process supervisor, CI secret store, or other credential provider.

## Approval model

`READ` metadata operations may run automatically. Secret values are treated as high-risk because they are credentials or sensitive configuration, even though the provider operation is technically a read.

Sensitive tools require a 64-character HMAC approval token derived locally from `DOPPLER_APPROVAL_SECRET` and the exact tool name. For example, a trusted approval layer can compute:

```js
import crypto from 'node:crypto';
const approvalId = crypto.createHmac('sha256', process.env.DOPPLER_APPROVAL_SECRET)
  .update('doppler.secret.get:execute')
  .digest('hex');
```

The approval secret must remain outside the model context. Human or policy-engine approval should happen before the approval token is issued. `doppler.secret.update` is additionally disabled while `DOPPLER_READ_ONLY=true`.

## Validation and safety

- Project, config, and secret identifiers are bounded and character-restricted.
- Secret updates are limited to 1-100 entries per call.
- Individual secret values are limited to 50 KiB, matching Doppler's documented secret-value abuse limit.
- Secret-list/download selection is limited to 100 names per call.
- No arbitrary URL, method, endpoint, or generic request tool is exposed.
- The API base URL is fixed to Doppler's official HTTPS API endpoint, preventing caller-controlled SSRF.
- Credentials remain in the connector transport layer.
- The upstream MCP child process receives the token through its environment, never through tool arguments.
- `--read-only` is passed to official MCP when the connector is read-only.
- Fixed project/config flags are passed upstream when configured.
- Unexpected or unavailable upstream MCP tools fail closed into the specifically implemented REST fallback; newly discovered MCP tools are not automatically exposed.

## Reliability and rate limits

REST requests have bounded timeouts and bounded exponential-backoff retries. Retries are limited to HTTP 429, HTTP 5xx, and transport failures. Permission/validation failures such as 4xx responses other than 429 are not retried. `Retry-After` is honored when present.

Doppler's platform-limits documentation currently publishes per-access-token API limits that vary by plan. At the time of this connector's research, the documented plan limits include separate read, secrets-read, and write budgets. The connector therefore avoids fan-out and exposes provider pagination rather than recursively loading an unbounded result set. Consult Doppler's current platform-limits page for the active limits on your plan.

## Errors

REST errors preserve the provider HTTP status and a bounded provider response excerpt. Authentication and scope failures are surfaced to the caller but are not retried. Timeouts report the configured timeout duration. MCP failures are not blindly propagated as permission-expanding behavior; the connector only falls back to the corresponding pre-defined REST operation.

## Testing

Unit tests do not require live Doppler credentials.

```bash
npm test
```

Tests cover authentication configuration, fixed-scope enforcement, approval requirements, read-only write denial, public tool-policy registration, credential placement in the REST layer, and provider error mapping.

## Real-world workflow

A typical agent workflow is:

```text
project.list
  -> config.list
  -> secret.names
  -> request human/policy approval
  -> secret.get or secret.list
  -> prepare proposed changes
  -> request explicit write approval
  -> secret.update
```

This preserves a useful `Discover -> Inspect names -> Approve sensitive read -> Recommend -> Approve write -> Execute` boundary.

## Limitations

- The connector intentionally exposes only nine high-value tools, not the complete Doppler API.
- Doppler's official MCP server is experimental, so REST fallbacks remain important.
- The connector does not implement an OAuth browser flow; it expects a Doppler token supplied securely at process start.
- It does not create, rotate, revoke, or reveal Doppler tokens.
- It does not expose dynamic-secret issuance controls.
- It does not implement webhooks, secret sync administration, audit-log search, workplace/user administration, config rollback, or destructive operations.
- Output schemas preserve provider data inside a stable wrapper but do not attempt to normalize every provider response field across Doppler API revisions.

## Compatibility

The server speaks MCP over stdio using the official Model Context Protocol TypeScript SDK. It can be used by MCP clients that support local stdio servers, including compatible desktop/CLI agents and custom MCP clients. Compatibility with any specific product depends on that product's current MCP transport support and configuration model.
