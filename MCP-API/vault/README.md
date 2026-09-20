# HashiCorp Vault MCP/API Connector

Reusable MCP server for a deliberately narrow set of HashiCorp Vault operations. Research against current HashiCorp Developer documentation found the official Vault HTTP API as the supported programmatic interface; no official HashiCorp Vault MCP server was confirmed for this connector, so the implementation uses the official API rather than an unofficial MCP dependency.

Official references: https://developer.hashicorp.com/vault/api-docs, https://developer.hashicorp.com/vault/api-docs/secret/kv/kv-v2, https://developer.hashicorp.com/vault/api-docs/system/health, https://developer.hashicorp.com/vault/api-docs/system/leader, and https://developer.hashicorp.com/vault/api-docs/system/auth.

## Architecture and authentication
Node.js 20+ / TypeScript. MCP is exposed over stdio; handlers call `VaultClient`, which talks to `VAULT_ADDR/v1/*` over HTTPS. Vault client tokens are supplied only through `VAULT_TOKEN` and sent in `X-Vault-Token`. Enterprise/HCP namespace selection is optional via `VAULT_NAMESPACE` / `X-Vault-Namespace`. Tokens are never MCP arguments or outputs. Use a dedicated Vault policy granting only the exact paths/capabilities needed by enabled workflows; the connector cannot elevate its token.

## Install / run
```bash
npm install
npm run build
npm test
VAULT_ADDR=https://vault.example.com VAULT_TOKEN=... npm start
```
Point any stdio-capable MCP client at `node /absolute/path/dist/src/server.js`. Product-specific compatibility beyond standard MCP stdio is not claimed.

## Tools and permissions
| Tool | API | Risk | Approval |
|---|---|---|---|
| `vault.system.health` | GET /v1/sys/health | READ | No |
| `vault.system.leader` | GET /v1/sys/leader | READ | No |
| `vault.auth.list` | GET /v1/sys/auth | READ | No |
| `vault.kv.list` | GET KV v2 metadata with list=true | READ | No |
| `vault.kv.read` | GET KV v2 data | READ | No |
| `vault.kv.write` | POST KV v2 data | WRITE | Default yes |
| `vault.kv.delete-latest` | DELETE KV v2 data | DESTRUCTIVE | Explicit + feature flag |
| `vault.kv.undelete` | POST KV v2 undelete | WRITE | Default yes |

KV tools require a KV version 2 mount. CAS is supported on writes to prevent accidental lost updates. The connector intentionally does not expose arbitrary Vault paths, token creation, root operations, seal/unseal, policy mutation, auth-method mutation, or permanent secret-version destruction.

## Environment
`VAULT_ADDR` (required HTTPS URL), `VAULT_TOKEN` (required), `VAULT_NAMESPACE` (optional), `VAULT_TIMEOUT_MS` (default 10000), `VAULT_REQUIRE_WRITE_APPROVAL` (default true), and `VAULT_ALLOW_DESTRUCTIVE` (default false). Production deployments should inject these through a secret manager/process environment and avoid shell history.

## Reliability
Requests time out. READ requests receiving 429 or 5xx retry once with a bounded delay honoring `Retry-After` up to three seconds. Writes and destructive operations are never automatically retried. 4xx authentication, permission, and validation failures are not retried. Provider errors retain HTTP status and retry metadata. KV list/read are naturally request-scoped; this connector does not invent pagination where the Vault endpoint does not define it.

## Security
Vault content is highly sensitive. Returned provider data is marked `UNTRUSTED_PROVIDER_DATA`; callers must treat values as data, never instructions, and should avoid placing secrets into model context unless explicitly necessary and authorized. Tool inputs are path-validated and traversal is rejected. `VAULT_ADDR` is operator configuration rather than a tool argument, preventing agent-controlled SSRF. TLS is mandatory in configuration. Write approval is enforced in code. Soft-delete is classified DESTRUCTIVE and needs both explicit per-call approval and `VAULT_ALLOW_DESTRUCTIVE=true`.

Vault's own ACL policy remains the primary authorization boundary. Grant `read/list` for read tools, `create/update` only where writes are required, and `delete` only for the narrowly intended KV paths. Do not grant `sudo` merely to make this connector work.

## Tests
`npm test` requires no live Vault. Mocks verify credential isolation, error mapping/no retry on permission failures, traversal rejection, write approval, and destructive-default denial.

## Limitations
Only KV v2 plus selected system discovery endpoints are implemented. Auth login flows, token renewal, dynamic secrets engines, leases, transit, PKI, namespaces management, streaming monitor logs, and administrative mutation are intentionally outside this connector's contract. Health endpoint status semantics vary by active/standby/sealed state as documented by HashiCorp.
