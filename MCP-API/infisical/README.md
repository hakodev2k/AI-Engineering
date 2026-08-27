# Infisical MCP/API Connector

Reusable MCP connector for Infisical Secrets Management using the official Node.js SDK. It is designed for agent workflows that need secret inventory and controlled mutations **without returning stored secret values or connector authentication credentials to the LLM**.

## Official sources researched

Research date: 2026-08-27.

- Node.js SDK: https://infisical.com/docs/sdks/languages/node
- Official Node SDK repository: https://github.com/Infisical/node-sdk-v2
- Machine Identities / Universal Auth: https://infisical.com/blog/introducing-machine-identities
- Project permissions: https://infisical.com/docs/internals/permissions/project-permissions
- MCP secret-management guidance: https://infisical.com/blog/managing-secrets-mcp-servers
- Agent Proxy / credential brokering: https://infisical.com/blog/agent-proxy

## Transport strategy

Infisical publishes MCP security guidance and agent credential-brokering infrastructure. For the required Secrets Management operations, this connector uses the **official `@infisical/sdk`** directly rather than an unofficial upstream MCP server. The connector itself exposes a small MCP stdio tool allowlist.

## Capabilities

| Tool | Upstream | Infisical permission | Risk | Approval |
|---|---|---|---|---|
| `infisical.auth.status` | SDK auth | identity login | READ | no |
| `infisical.secret.list_metadata` | SDK | `secrets:describeSecret` | READ | no |
| `infisical.secret.list_imported_metadata` | SDK | `secrets:describeSecret` | READ | no |
| `infisical.secret.get_metadata` | SDK | `secrets:describeSecret` | READ | no |
| `infisical.secret.exists` | SDK | `secrets:describeSecret` | READ | no |
| `infisical.secret.create` | SDK | `secrets:create` | WRITE | yes |
| `infisical.secret.update` | SDK | `secrets:edit` | WRITE | yes |
| `infisical.secret.delete` | SDK | `secrets:delete` | DESTRUCTIVE | yes + feature flag |

Infisical permissions distinguish `describeSecret` from `readValue`. This connector always uses `viewSecretValue: false`, disables secret-reference expansion on metadata reads, recursively strips secret-value fields from provider responses, and does not expose a stored-secret-value read tool.

## Architecture

```text
MCP client/agent
  -> stdio MCP server
     -> strict tool schemas + policy
        -> payload-bound human approval for writes
           -> official @infisical/sdk
              -> Machine Identity Universal Auth
                 -> Infisical Cloud/self-hosted
```

## Authentication

Use a dedicated Infisical Machine Identity with Universal Auth:

```text
INFISICAL_CLIENT_ID=
INFISICAL_CLIENT_SECRET=
```

The SDK exchanges these for a short-lived access token. Credentials stay inside the connector and are never accepted as MCP arguments or returned in tool output.

Use the narrowest project role possible. Metadata-only deployments need `secrets:describeSecret`. Add `secrets:create`, `secrets:edit`, or `secrets:delete` only when the corresponding tools are needed. **Do not grant `secrets:readValue` to this connector.**

## Environment variables

- `INFISICAL_SITE_URL`: defaults to `https://app.infisical.com`; HTTPS origin only.
- `INFISICAL_CLIENT_ID`: required.
- `INFISICAL_CLIENT_SECRET`: required.
- `INFISICAL_TIMEOUT_MS`: default `10000`, range 1000–120000.
- `INFISICAL_APPROVAL_SECRET`: required for WRITE/DESTRUCTIVE execution.
- `INFISICAL_ENABLE_DESTRUCTIVE`: defaults to `false`.

## Installation and running

Current Infisical SDK v5+ requires Node.js 20+.

```bash
npm install
npm run check
npm test
npm start
```

The server uses standard MCP stdio transport and therefore works with MCP clients that support stdio tool servers.

## Permission and approval model

READ tools execute automatically.

WRITE tools require an `approval_token` computed as:

```text
hex(HMAC-SHA256(
  INFISICAL_APPROVAL_SECRET,
  "<tool-name>\n<stable canonical JSON payload without approval_token>"
))
```

The approval is bound to the exact tool and exact payload, preventing an approval for one secret/path/environment/value from being replayed for another.

DESTRUCTIVE operations additionally require `INFISICAL_ENABLE_DESTRUCTIVE=true`, which cannot be changed through an MCP tool.

## Reliability and errors

The connector adds a bounded local timeout and normalized error classification. It deliberately does not implement connector-side blind retries for secret writes/deletes. Authentication is reused after successful login. 401/403 are treated as authorization failures, 429 as throttling, ordinary 4xx as non-retryable request errors, and 5xx as provider availability errors.

Infisical request limits vary by plan/deployment; no universal fixed request-per-second number is documented, so this connector does not invent one.

## Security considerations

- Provider content is untrusted data, never agent instructions.
- Existing secret values are never returned.
- Secret references are not expanded during metadata reads.
- Machine identity credentials remain connector-internal.
- No arbitrary HTTP/SDK execution tool exists.
- No project, identity, role, API-key, or permission-management tools are exposed.
- Writes require exact-payload human approval.
- Deletes are disabled by default.
- The base URL is restricted to a clean HTTPS origin, reducing SSRF/configuration risk.
- Project, environment, and path are explicit inputs; no organization-specific values are hard-coded.
- Logs must not include environment variables, authentication responses, or request bodies containing secret values.

For workloads that actually need to consume secret values, prefer Infisical process injection, workload identity, Agent Proxy/credential brokering, or another non-LLM credential path instead of adding a generic `secret.read_value` tool.

## Tests

Unit tests use fakes and require no live Infisical credentials. They cover configuration validation, registry/policy consistency, read access, payload-bound write approval, destructive denial, `viewSecretValue: false`, disabled reference expansion, secret-value sanitization, and authentication reuse.

## Limitations

- Stored secret values are intentionally unavailable through this MCP interface.
- Dynamic secret leases are intentionally omitted because their core output is credential material.
- Administrative project/identity/role operations are omitted to prevent permission escalation.
- Universal Auth is implemented; other machine-auth methods can be added later behind the same tool contract.
- The local timeout bounds the connector wait but cannot guarantee cancellation inside every SDK version.
