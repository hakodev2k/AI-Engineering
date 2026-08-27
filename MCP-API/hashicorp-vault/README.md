# HashiCorp Vault MCP/API Connector

Reusable MCP connector for HashiCorp Vault. It wraps HashiCorp's official Vault MCP Server for supported KV, mount, and PKI capabilities and uses the official Vault HTTP API only for authentication, health, and capability checks not exposed by that MCP server.

Research date: 2026-08-27.

## Official sources

- Vault MCP overview: https://developer.hashicorp.com/vault/docs/ai/mcp-server/overview
- Vault MCP reference: https://developer.hashicorp.com/vault/docs/ai/mcp-server/reference
- Vault MCP deployment: https://developer.hashicorp.com/vault/docs/ai/mcp-server/deploy
- Official MCP repository: https://github.com/hashicorp/vault-mcp-server
- HTTP API: https://developer.hashicorp.com/vault/api-docs
- AppRole: https://developer.hashicorp.com/vault/docs/auth/approle
- Policies: https://developer.hashicorp.com/vault/docs/concepts/policies
- Resource/rate-limit quotas: https://developer.hashicorp.com/vault/docs/concepts/resource-quotas

## Transport strategy

The official Vault MCP Server is currently beta and supports stdio and StreamableHTTP. Its documented tools cover mount management, KV list/read/write/delete, and PKI management/issuance. This connector uses the official MCP server over stdio for those supported operations.

Two preflight capabilities are not part of the official MCP tool set and therefore use the official REST API:

- `vault.system.health` -> `/v1/sys/health`
- `vault.permission.check` -> `/v1/sys/capabilities-self`

The official documentation warns that the upstream MCP server can expose Vault secrets to MCP clients/LLMs. For credential isolation, this connector deliberately does not expose upstream `read_secret`. It supports listing secret paths and approved writes/deletes, but not retrieval of stored secret values.

## Tools and risk model

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `vault.system.health` | REST | READ | no |
| `vault.permission.check` | REST | READ | no |
| `vault.mount.list` | MCP `list_mounts` | READ | no |
| `vault.mount.create` | MCP `create_mount` | HIGH_RISK | yes |
| `vault.mount.delete` | MCP `delete_mount` | DESTRUCTIVE | yes + feature flag |
| `vault.secret.list` | MCP `list_secrets` | READ | no |
| `vault.secret.write` | MCP `write_secret` | WRITE | yes |
| `vault.secret.delete` | MCP `delete_secret` | DESTRUCTIVE | yes + feature flag |
| `vault.pki.enable` | MCP `enable_pki` | HIGH_RISK | yes |
| `vault.pki.issuer.list` | MCP `list_pki_issuers` | READ | no |
| `vault.pki.issuer.read` | MCP `read_pki_issuer` | READ | no |
| `vault.pki.issuer.create` | MCP `create_pki_issuer` | HIGH_RISK | yes |
| `vault.pki.role.list` | MCP `list_pki_roles` | READ | no |
| `vault.pki.role.read` | MCP `read_pki_role` | READ | no |
| `vault.pki.role.create` | MCP `create_pki_role` | HIGH_RISK | yes |
| `vault.pki.role.delete` | MCP `delete_pki_role` | DESTRUCTIVE | yes + feature flag |
| `vault.pki.certificate.issue` | MCP `issue_pki_certificate` | HIGH_RISK | yes |

## Architecture

```text
MCP client / agent
  -> this connector (stdio)
     -> strict external schemas
     -> approval / destructive gates
     -> fixed upstream tool allowlist
        -> official Vault MCP Server (stdio)
     -> REST fallback
        -> health / capabilities-self / AppRole login
```

The upstream MCP tool list is checked at connection time. Missing expected tools fail closed; newly discovered upstream tools are not automatically exposed.

## Authentication

Choose exactly one mode.

### Vault token

```text
VAULT_TOKEN=
```

### AppRole

```text
VAULT_APPROLE_ROLE_ID=
VAULT_APPROLE_SECRET_ID=
VAULT_APPROLE_MOUNT=approle
```

AppRole is intended for machine/application authentication. The connector exchanges RoleID/SecretID for a Vault token and caches it only inside the connector process until near lease expiry. The token is passed only to the local official Vault MCP child process and the REST client; it is never a tool argument or tool result.

Use a dedicated Vault policy with the minimum paths/capabilities required. Vault policies are deny-by-default. Do not give this connector broad root/admin policies.

## Official MCP installation

Install HashiCorp's official `vault-mcp-server` binary using one of the documented methods: Docker, prebuilt binary, or Go source install. Official docs currently show:

```bash
go install github.com/hashicorp/vault-mcp-server/cmd/vault-mcp-server@latest
```

Default connector configuration:

```text
VAULT_MCP_COMMAND=vault-mcp-server
VAULT_MCP_ARGS=stdio
```

The official server is beta; HashiCorp recommends local/trusted use rather than broadly exposed network deployment. This connector therefore uses stdio and does not create an HTTP MCP listener.

## Environment

See `.env.example`.

`VAULT_ADDR` must be an HTTPS origin. Optional `VAULT_NAMESPACE` supports Vault Enterprise/HCP namespaces.

Reliability settings:

- `VAULT_TIMEOUT_MS` default `10000`
- `VAULT_MAX_RETRIES` default `3`, maximum `5`

Approval/security settings:

- `VAULT_APPROVAL_SECRET`
- `VAULT_ENABLE_DESTRUCTIVE=false`

## Human approval

READ tools can execute automatically.

WRITE/HIGH_RISK tools require an approval token bound to the exact tool and payload:

```text
hex(HMAC-SHA256(
  VAULT_APPROVAL_SECRET,
  "<tool-name>\n<stable canonical JSON payload without approval_token>"
))
```

DESTRUCTIVE tools additionally require:

```text
VAULT_ENABLE_DESTRUCTIVE=true
```

An agent cannot enable destructive mode, alter the upstream command, change Vault credentials, or widen Vault policies through any exposed tool.

## Rate limits and reliability

Vault supports operator-defined rate-limit quotas using token-bucket semantics, and HCP Vault Dedicated can impose tier/size-specific RPS limits. Effective limits are deployment-specific, so the connector does not invent a fixed global rate.

REST fallback behavior:

- bounded timeout;
- cancellation propagation;
- bounded exponential backoff;
- retries only 429/502/503/504 on safe REST operations;
- preserves integer `Retry-After` delays up to a bound;
- authentication, permission, and validation failures are not retried as transient.

MCP mutation calls are not automatically replayed by the connector.

## Security considerations

- Stored secret values cannot be read through this connector.
- No arbitrary REST request tool exists.
- No token, policy, or auth-method administration tools exist.
- Credentials remain in the connector/auth layer.
- Upstream MCP is official HashiCorp software and runs locally over stdio.
- The upstream tool surface is explicitly allowlisted.
- Retrieved provider content is labeled untrusted and must not be treated as instructions.
- Write, PKI, and destructive operations require approval.
- Destructive operations are disabled by default.
- PKI issuer private-key material can be supplied only to the narrowly scoped issuer-create tool and is not deliberately echoed by this connector.

## Installation / running

Requires Node.js 20+ and the official `vault-mcp-server` binary.

```bash
npm install
npm run check
npm test
npm start
```

The connector exposes standard MCP stdio tools and is suitable for MCP clients that support stdio tool servers.

## Tests

Unit tests require no live Vault credentials and cover tool registration, auth-mode configuration, HTTPS validation, AppRole token caching, Vault token/namespace headers, permission denial behavior, exact-payload approval, and destructive denial. The upstream implementation explicitly omits `read_secret` from its allowlist.

## Limitations

- The official HashiCorp Vault MCP Server is beta and its schemas may evolve.
- Secret value retrieval is intentionally unsupported.
- Policy/auth/token administration is intentionally unsupported.
- PKI role `config` remains provider-defined JSON because Vault PKI role options evolve; the call is still scoped to the official `create_pki_role` tool and requires approval.
- AppRole refresh is performed by re-login near token expiry rather than token renewal.
