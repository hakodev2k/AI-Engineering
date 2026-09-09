# Unkey MCP/API Connector

Reusable MCP connector for Unkey API-key management and standalone rate limiting.

## Transport strategy

Unkey provides an official remote MCP server at `https://mcp.unkey.com/mcp/v2` and a dedicated rate-limiting MCP endpoint. This package deliberately uses Unkey's stable versioned v2 HTTP API (`https://api.unkey.com/v2/...`) behind a local MCP facade. The reason is security and determinism: this connector exposes a fixed, reviewed tool allowlist with strict schemas, explicit risk classes, and local approval enforcement rather than dynamically trusting upstream-discovered tools. The external MCP contract remains stable even if the upstream MCP tool catalog changes.

Official sources used during implementation:
- Unkey MCP documentation: https://www.unkey.com/docs/ai-code-gen/unkey-mcp
- v2 RPC API design: https://www.unkey.com/docs/api-reference/v2/rpc
- Root-key permissions: https://www.unkey.com/docs/platform/root-keys/permissions
- TypeScript SDK reference: https://www.unkey.com/docs/libraries/ts/api
- Key recovery/security: https://www.unkey.com/docs/security/recovering-keys
- Rate limiting: https://www.unkey.com/docs/platform/ratelimiting/introduction
- Rate-limit override API: https://www.unkey.com/docs/api-reference/v2/ratelimit/set-ratelimit-override

## Capabilities

| Tool | Upstream | Risk | Approval | Unkey permission |
|---|---|---|---|---|
| `unkey.api.create` | `apis.createApi` | WRITE | configurable, default yes | `api.*.create_api` |
| `unkey.api.get` | `apis.getApi` | READ | no | `api.{apiId}.read_api` |
| `unkey.key.list` | `keys.listKeys` | READ | no | `api.{apiId}.read_key` |
| `unkey.key.get` | `keys.getKey` | READ | no | `api.{apiId}.read_key` |
| `unkey.key.create` | `keys.createKey` | HIGH_RISK | yes | `api.{apiId}.create_key` |
| `unkey.key.update` | `keys.updateKey` | HIGH_RISK | yes | `api.{apiId}.update_key` |
| `unkey.key.verify` | `keys.verifyKey` | WRITE | configurable, default yes | `api.{apiId}.verify_key` |
| `unkey.key.reroll` | `keys.rerollKey` | HIGH_RISK | yes | `api.{apiId}.update_key` |
| `unkey.key.delete` | `keys.deleteKey` | DESTRUCTIVE | yes + feature flag | `api.{apiId}.delete_key` |
| `unkey.ratelimit.limit` | `ratelimit.limit` | WRITE | configurable, default yes | `ratelimit.*.limit` |
| `unkey.ratelimit.override.set` | `ratelimit.setOverride` | HIGH_RISK | yes | `ratelimit.*.set_override` |

Key plaintext recovery/decryption is intentionally not exposed. `getKey` and `listKeys` always send `decrypt:false`; the connector therefore does not require `decrypt_key`. Newly created/rerolled credentials may be returned once by Unkey and must be treated as secrets.

## Architecture

```text
MCP client
  -> local stdio MCP server
     -> strict tool schema
     -> local risk/approval policy
     -> Unkey v2 RPC client
     -> https://api.unkey.com
```

Credentials remain inside the connector. The root key is read from the process environment and is never returned in MCP output or accepted as a tool parameter.

## Authentication and least privilege

Create a dedicated Unkey root key with only the permissions required by the tools you intend to enable. Prefer API-scoped permissions such as `api.api_123.read_key` rather than workspace wildcards when practical. The full manifest lists the permissions needed for the complete package.

Set:

```bash
export UNKEY_ROOT_KEY="unkey_..."
```

Do not expose the root key to browser code, prompts, logs, examples, source control, or MCP arguments.

## Environment

Copy `.env.example` values into your secret manager or process environment.

- `UNKEY_ROOT_KEY` — required root key.
- `UNKEY_API_BASE` — default `https://api.unkey.com`.
- `UNKEY_REQUEST_TIMEOUT_MS` — 1,000–60,000 ms, default 15,000.
- `UNKEY_REQUIRE_WRITE_APPROVAL` — default `true`.
- `UNKEY_DESTRUCTIVE_ENABLED` — default `false`.
- `UNKEY_ALLOWED_API_HOSTS` — SSRF allowlist, default `api.unkey.com`.

Custom API bases must use HTTPS and their hostname must appear in the allowlist.

## Install and run

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server communicates over MCP stdio, so any MCP client capable of launching a local command can point at `node /absolute/path/to/dist/server.js` with the environment variables above.

## Tool behavior

Inputs are validated with Zod. IDs are prefix-validated (`api_`, `key_`), namespaces/identifiers are length bounded, URLs are not accepted from tool callers, and there is no generic/raw API tool.

WRITE operations are non-idempotent or may alter quota/state and therefore are not automatically retried. The HTTP client retries only explicitly retryable read calls, at most three total attempts, using bounded exponential backoff and honoring `Retry-After` for `429`. Authentication, validation and permission errors are never retried. Requests use an AbortController timeout.

Unkey v2 list endpoints use cursor pagination. `unkey.key.list` accepts a cursor and returns upstream pagination metadata; callers decide whether to request the next page, avoiding hidden request amplification.

## Risk and approval model

- **READ** — may execute automatically.
- **WRITE** — approval controlled by `UNKEY_REQUIRE_WRITE_APPROVAL` and required by default.
- **HIGH_RISK** — always explicit human approval. Credential issuance/rotation and access-control changes fall here.
- **DESTRUCTIVE** — explicit approval plus `UNKEY_DESTRUCTIVE_ENABLED=true`; disabled by default.

The `approved` tool field is only an execution gate indicating that a human already approved the exact operation. An agent must not set it autonomously.

## Security considerations

Unkey/provider responses are marked `untrusted_data:true`; retrieved names, metadata, analytics, errors, or other provider content must never be treated as instructions. No provider content can change the connector's tool allowlist, environment, permissions, approval policy, or destination host.

The connector blocks HTTP API bases and non-allowlisted hosts, reducing SSRF risk. It never logs the root key. Key creation output can contain a newly generated secret; MCP clients should avoid transcript persistence when issuing credentials and deliver the key only to the intended recipient.

Unkey hashes keys by default. Recoverable keys require extra encryption/decryption permissions; this connector intentionally refuses plaintext recovery to reduce secret-exfiltration risk.

## Errors and rate limits

Provider non-2xx responses are mapped to `UnkeyError` with status, provider detail, request ID and parsed `Retry-After` when available. Include the Unkey request ID when escalating provider-side incidents.

`ratelimit.limit` can return HTTP 200 while denying the operation; callers must inspect `data.success`. `unkey.key.verify` can consume configured credits or rate-limit quota, which is why it is classified as WRITE rather than READ.

## Testing

Normal tests require no live credentials:

```bash
npm test
```

Tests cover authentication configuration, SSRF protection, approval enforcement, destructive default denial, stable tool registration, permission/API error mapping, 429 retry handling, and prevention of retries for state-changing writes.

## Limitations

This package intentionally does not expose every Unkey API capability. It omits API deletion, plaintext key recovery, identity/RBAC administration, deployment operations, arbitrary analytics SQL, and generic RPC execution because those broaden privilege or risk beyond the focused key-management/rate-limiting workflow. It also does not dynamically proxy the official MCP catalog; the stable allowlist is intentional.
