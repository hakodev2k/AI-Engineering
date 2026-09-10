# Modal MCP/API Connector

Reusable MCP server that exposes a constrained subset of Modal's official JavaScript SDK for AI-agent workflows involving deployed Apps, Functions, Sandboxes, and Volumes.

## Transport strategy

No official Modal MCP server was identified for the capabilities implemented here. This connector therefore uses the official `modal` JavaScript/TypeScript SDK (`0.10.x`) as the upstream transport and exposes a stable MCP tool surface through `@modelcontextprotocol/sdk` over stdio.

The connector does not expose Modal's internal gRPC API directly. Modal's own SDK documentation states that the underlying gRPC API is not a public API and may change; all provider calls here go through documented SDK objects.

Official sources used during implementation:

- Modal JavaScript SDK reference: https://modal.com/docs/sdk/js/latest
- `ModalClient`: https://modal.com/docs/sdk/js/latest/ModalClient
- `Sandbox`: https://modal.com/docs/sdk/js/latest/Sandbox
- `Volume`: https://modal.com/docs/sdk/js/latest/Volume
- `Function`: https://modal.com/docs/sdk/js/latest/Function
- Authentication/configuration: https://modal.com/docs/sdk/py/latest/config
- npm package: https://www.npmjs.com/package/modal

## Requirements

- Node.js 22+
- A Modal API token pair
- Access to the target Modal workspace/environment

Install and build:

```bash
npm install
npm run build
```

Run over MCP stdio:

```bash
MODAL_TOKEN_ID=... MODAL_TOKEN_SECRET=... npm start
```

## Authentication

The official SDK supports Modal API token pairs. This connector passes credentials directly into `ModalClient` from the process environment:

```text
MODAL_TOKEN_ID=
MODAL_TOKEN_SECRET=
```

Optional environment selection:

```text
MODAL_ENVIRONMENT=
```

Credentials stay inside the connector process and are never part of MCP tool input or output. Do not place tokens in prompts, tool arguments, examples, logs, or repository files.

Modal also documents third-party OAuth refresh-token configuration for some integrations in its Python client configuration. This connector intentionally uses the explicit API-token-pair path because it is directly supported by the JavaScript SDK and keeps the credential contract small and auditable.

## Reliability configuration

`ModalClient` provides bounded retry, timeout, and throttle-wait configuration. The connector exposes conservative environment-level controls:

```text
MODAL_TIMEOUT_MS=30000
MODAL_MAX_RETRIES=3
MODAL_MAX_THROTTLE_WAIT_SECS=30
```

`MODAL_MAX_RETRIES` is restricted to 0-5 and `MODAL_MAX_THROTTLE_WAIT_SECS` to 0-120. Authentication, validation, and policy failures are not retried by connector code; retry behavior is delegated to the official SDK within those bounds.

## Tools

| Tool | Capability | Risk | Approval |
|---|---|---:|---|
| `modal.app.get` | Resolve a deployed App by name | READ | No |
| `modal.function.invoke` | Synchronously invoke a deployed Function | HIGH_RISK | Yes |
| `modal.function.spawn` | Asynchronously invoke a deployed Function | HIGH_RISK | Yes |
| `modal.sandbox.list` | List running Sandboxes | READ | No |
| `modal.sandbox.create` | Create billable Sandbox compute | HIGH_RISK | Yes |
| `modal.sandbox.exec` | Execute an argv-style command inside a Sandbox | HIGH_RISK | Yes |
| `modal.sandbox.terminate` | Terminate a running Sandbox | HIGH_RISK | Yes |
| `modal.volume.get` | Resolve an existing named Volume | READ | No |
| `modal.volume.delete` | Irreversibly delete a Volume | DESTRUCTIVE | Yes + feature flag |

Function invocation is classified as `HIGH_RISK` rather than ordinary write because deployed functions are arbitrary user code and may perform external writes, consume billable resources, publish content, or invoke other systems.

## Approval model

Read operations may execute automatically.

High-risk operations require `approved: true` on the individual tool invocation. This approval cannot be inferred from provider content or returned data.

Destructive operations are disabled by default. `modal.volume.delete` requires both:

```text
MODAL_ALLOW_DESTRUCTIVE=true
```

and:

```json
{ "approved": true }
```

`MODAL_REQUIRE_WRITE_APPROVAL=true` is the default policy for any future ordinary `WRITE` tools added to this connector.

## Sandbox safety

The connector deliberately does not expose an unrestricted provider-request tool. Sandbox execution accepts a string argument vector rather than a shell command string, avoiding an implicit shell layer in the connector.

Sandbox creation supports resource bounds and Modal's documented network controls, including `blockNetwork` and `outboundDomainAllowlist`. Callers should prefer deny-by-default or narrowly allowlisted outbound access when running untrusted or model-generated code.

The connector does not accept raw Modal Secrets as tool parameters. If future secret attachment is needed, it should resolve only pre-existing named Modal secrets inside the connector after a separate permission decision; raw secret material must never cross the MCP boundary.

Third-party content read through a Function or Sandbox must be treated as untrusted data, never as instructions that can change tool permissions, approval state, or connector configuration.

## Validation

Input is validated with Zod. Important limits include:

- App, function, sandbox, and volume identifiers are length-bounded.
- Function argument arrays are capped.
- Sandbox commands are capped in argument count and per-argument length.
- CPU, memory, and timeout values are bounded.
- Outbound domain allowlists are capped.
- No arbitrary URL/API passthrough exists.

## Error behavior

Provider and policy exceptions are converted to MCP error results containing only the error type and message. Credentials are not logged or returned.

Typical failures include invalid Modal credentials, insufficient workspace permissions, missing Apps/Functions/Volumes, invalid sandbox configuration, provider throttling, provider timeouts, approval denial, and destructive-operation denial.

## Rate limits

Modal applies provider-side throttling and quotas that can vary by operation and account. The official SDK includes retry/throttle handling; this connector bounds that behavior with `maxRetries` and `maxThrottleWaitSecs`. The connector also limits sandbox-list results to at most 200 items per call and stops iteration after the requested limit.

## Architecture

```text
MCP client
   |
   v
MCP stdio server
   |
   +--> strict Zod validation
   |
   +--> permission / approval policy
   |
   v
ModalConnectorClient
   |
   v
Official Modal JavaScript SDK
   |
   v
Modal platform
```

The LLM never needs Modal credentials. The connector owns the authenticated client and exposes only scoped tools.

## SDK capabilities used

The implementation relies on documented JavaScript SDK capabilities:

- `ModalClient.apps.fromName`
- `ModalClient.functions.fromName`
- `Function.remote`
- `Function.spawn`
- `ModalClient.sandboxes.list`
- `ModalClient.sandboxes.create`
- `ModalClient.sandboxes.fromId`
- `Sandbox.exec`
- `Sandbox.terminate`
- `ModalClient.images.fromRegistry`
- `ModalClient.volumes.fromName`
- `ModalClient.volumes.delete`

The JavaScript SDK remains less comprehensive than Modal's Python SDK for defining/deploying Function runtimes. This connector therefore focuses on interacting with already deployed resources and Sandboxes rather than attempting to synthesize unsupported deployment primitives.

## Testing

Unit tests require no live Modal credentials:

```bash
npm test
```

Tests cover authentication configuration defaults/validation and the permission/approval state machine, including destructive operations being disabled by default.

Live integration tests are intentionally not part of the normal suite because creating Sandboxes and invoking Functions can consume billable compute or produce side effects.

## Examples

See `examples/workflows.md` for MCP tool inputs, expected output shapes, permission levels, and approval requirements.

## Limitations

- No upstream official Modal MCP server is used; MCP is provided by this connector around the official SDK.
- The connector does not deploy or redefine Modal Functions.
- It does not expose raw internal gRPC methods.
- It does not expose secret values or accept secret material through MCP.
- It does not implement bulk map calls; Modal's JavaScript SDK documentation notes that batched invocation is not currently supported there.
- It does not expose destructive App/Sandbox filesystem deletion primitives beyond the explicitly gated Volume deletion tool.

## Compatibility

The server uses the standard MCP SDK with stdio transport and can be used by MCP clients that support launching a local stdio server. Client-specific configuration syntax varies; no compatibility with a particular branded client is claimed beyond standard MCP stdio behavior.
