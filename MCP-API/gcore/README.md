# Gcore MCP/API Connector

Reusable security wrapper around Gcore's official MCP server for cloud-infrastructure inspection and controlled instance operations.

## Transport strategy

Primary and only implemented upstream transport: **official Gcore MCP over stdio**.

Official sources researched for this connector:

- Gcore official MCP server: https://github.com/G-Core/gcore-mcp-server
- Gcore MCP developer guide: https://gcore.com/learning/mcp-developers-guide
- Gcore API reference: https://gcore.com/docs/api-reference
- Gcore Cloud API examples and authentication: https://gcore.com/docs/api-reference/cloud
- Gcore SDK-backed API examples: https://gcore.com/docs/api-reference/instances/list-suitable-flavors-for-instance-creation

The official MCP server is backed by Gcore's Python SDK and supports configurable toolsets/patterns through `GCORE_TOOLS`. This connector deliberately launches the official server with a fixed allowlist rather than exposing the full evolving Gcore tool catalog.

No REST fallback is needed for the selected capabilities because the official MCP server exposes them directly. If a future required capability is absent from MCP, add a narrowly scoped official API/SDK fallback behind the same provider-scoped external tool contract rather than exposing an arbitrary request tool.

## Architecture

```text
MCP client / AI agent
        |
        v
Gcore safe connector (stdio)
  - fixed external tool names
  - upstream schema discovery
  - strict additionalProperties=false boundary
  - permission/risk policy
  - payload-bound HMAC approval
  - bounded read retry + timeout
        |
        v
Official G-Core/gcore-mcp-server (stdio)
        |
        v
Gcore Python SDK / Gcore API
```

Credentials remain in the connector and official MCP child process. They are never accepted as MCP tool arguments and are never returned to the model.

## Requirements

- Node.js 20+
- npm
- `uvx` from Astral `uv`
- A Gcore API key with the least privileges needed for the selected project/region/resources

## Installation

```bash
npm install
npm run build
npm test
```

Run:

```bash
npm start
```

The connector itself exposes standard MCP over stdio and can be launched by MCP hosts that support local stdio servers.

## Authentication

Set:

```text
GCORE_API_KEY=
```

The official Gcore MCP server reads the API key from its process environment. Gcore's API documentation shows API-key authentication for Cloud API operations; the exact provider-side permissions available to a key remain authoritative.

Use the narrowest key/project access practical. Never place the key in prompts, source control, examples, or tool arguments.

Optional context variables supported by the official MCP implementation are forwarded by this connector:

```text
GCORE_CLOUD_PROJECT_ID=
GCORE_CLOUD_REGION_ID=
GCORE_CLIENT_ID=
```

`GCORE_BASE_URL` defaults to `https://api.gcore.com` and this connector rejects any other host or non-HTTPS value to prevent accidental credential forwarding or SSRF-style configuration abuse.

## Implemented tools

| External tool | Official MCP tool | Risk | Approval |
|---|---|---|---|
| `gcore.project.list` | `cloud.projs.ls` | READ | No |
| `gcore.region.list` | `cloud.rgns.ls` | READ | No |
| `gcore.instance.list` | `cloud.insts.ls` | READ | No |
| `gcore.instance.get` | `cloud.insts.get` | READ | No |
| `gcore.instance.create` | `cloud.insts.new` | WRITE | Yes + feature gate |
| `gcore.instance.update` | `cloud.insts.upd` | HIGH_RISK | Yes + feature gate |
| `gcore.instance.action` | `cloud.insts.action` | HIGH_RISK | Yes + feature gate |
| `gcore.instance.delete` | `cloud.insts.del` | DESTRUCTIVE | Yes + disabled-by-default gate |
| `gcore.volume.list` | `cloud.vols.ls` | READ | No |
| `gcore.network.list` | `cloud.nets.ls` | READ | No |
| `gcore.security_group.list` | `cloud.secgrps.ls` | READ | No |
| `gcore.ssh_key.list` | `cloud.sshkeys.ls` | READ | No |

The shortened upstream names follow the official Gcore MCP server's current shortening rules. At startup, the connector calls upstream `tools/list` and fails closed unless every allowlisted upstream tool is actually advertised.

## Tool schemas and validation

The official MCP server is the source of truth for provider argument schemas. This wrapper copies each allowlisted upstream input schema at startup and exposes it under a stable provider-scoped name.

For mutating tools, the wrapper adds exactly one connector-local field:

```text
approvalToken
```

The external schema is forced to `additionalProperties: false`, so callers cannot append arbitrary connector-level parameters. The approval field is stripped before forwarding to Gcore. Upstream Gcore schema validation still applies to provider arguments.

If Gcore removes or renames an allowlisted upstream capability, startup fails rather than silently substituting a different action.

## Permission and human-approval model

Safe defaults:

```text
GCORE_ALLOW_WRITE=false
GCORE_ALLOW_HIGH_RISK=false
GCORE_ALLOW_DESTRUCTIVE=false
```

READ tools can execute automatically.

WRITE tools require both `GCORE_ALLOW_WRITE=true` and a valid payload-bound approval token.

HIGH_RISK tools require both `GCORE_ALLOW_HIGH_RISK=true` and approval. Instance updates and lifecycle actions are high risk because they can alter running infrastructure or availability.

DESTRUCTIVE tools require `GCORE_ALLOW_DESTRUCTIVE=true` and approval. Instance deletion is disabled by default.

The approval secret is stored only in the connector process:

```text
GCORE_APPROVAL_SECRET=
```

A trusted approval component computes:

```text
HMAC-SHA256(
  GCORE_APPROVAL_SECRET,
  "<exact external tool name>\n<canonical JSON payload without approvalToken>"
)
```

Any payload change invalidates the approval. The model must not receive `GCORE_APPROVAL_SECRET` and therefore cannot mint its own approval.

## Reliability

Every upstream connect, discovery, and tool call has a configurable timeout:

```text
GCORE_UPSTREAM_TIMEOUT_MS=30000
```

Allowed range: 1,000–120,000 ms.

READ operations retry at most two additional times for bounded transient failures such as provider throttling, timeout, selected 5xx conditions, and connection resets. Backoff is exponential and capped locally.

WRITE, HIGH_RISK, and DESTRUCTIVE operations are attempted once only. They are never blindly retried because an ambiguous MCP/network failure could occur after the provider has already committed the state change.

Authentication, authorization, validation, and policy failures are not treated as retryable mutations.

## Rate limits

Gcore exposes many APIs and limits can vary by product/capability. This connector does not invent a universal quota. The official MCP/SDK/API response remains authoritative for throttling behavior. When a read operation surfaces a recognizable 429/rate-limit error, the connector performs only its bounded retry policy; callers should avoid polling loops and should respect provider-specific limits documented for the exact Gcore service in use.

## Security considerations

- **Credential isolation:** `GCORE_API_KEY` exists only in the connector/upstream process environment.
- **Fixed provider origin:** `GCORE_BASE_URL` must resolve to the official `https://api.gcore.com` origin.
- **Upstream tool restriction:** `GCORE_TOOLS` is generated by this connector from a fixed allowlist. The agent cannot widen it.
- **No arbitrary requests:** no raw HTTP, generic API request, shell, or arbitrary MCP passthrough tool is exposed.
- **Fail closed:** required upstream tools must be present in official MCP discovery before the connector starts serving.
- **Prompt-injection resistance:** instance metadata, names, descriptions, provider errors, and other Gcore-returned content are wrapped as `untrustedProviderData` and must be treated as data, not instructions.
- **Permission separation:** read, write, high-risk, and destructive behavior is enforced locally in addition to Gcore-side authorization.
- **Approval isolation:** approval secrets never enter tool schemas or upstream requests.
- **Mutation replay safety:** state-changing calls are not automatically retried.
- **No privilege escalation tools:** this connector does not expose API-key creation, IAM/role mutation, billing changes, secret mutation/readback, or broad cleanup toolsets.

## Testing

Unit tests require no live Gcore credentials:

```bash
npm test
```

The suite covers required authentication configuration, official-origin enforcement, safe default policy, provider-scoped tool registration metadata, read authorization, write denial, destructive isolation, exact-payload approval acceptance, and approval invalidation after argument mutation.

A live integration smoke test should use a disposable non-production Gcore project with narrowly scoped credentials.

## Examples

See `examples/workflows.md` for infrastructure inspection, instance creation, lifecycle/update operations, and destructive deletion approval behavior.

## Error handling

Configuration errors fail at startup. Upstream discovery mismatch fails closed. Policy failures stop before the Gcore MCP call. Provider/MCP errors propagate without intentionally exposing the API key or approval secret. Timeouts are explicit. Mutations are never retried after ambiguous failures.

## Limitations

- This wrapper exposes 12 focused capabilities rather than the full Gcore MCP surface.
- It requires `uvx` to launch Gcore's official Python MCP server.
- It does not implement browser OAuth; the official Gcore MCP path used here is API-key based.
- It does not expose bare metal, GPU clusters, inference, load-balancer mutation, DNS, WAAP, billing, cleanup, container registry mutation, secret management, or broad wildcard toolsets.
- It does not expose a REST fallback because all selected capabilities are present in the official MCP server today.
- Exact project/region availability and provider-side authorization depend on the supplied Gcore account and API key.
- Upstream schemas can evolve; the connector intentionally discovers them at runtime and fails closed on missing allowlisted capabilities.
