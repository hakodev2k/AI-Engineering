# Bitwarden MCP connector

Reusable read-only MCP server for Bitwarden organization administration and audit workflows. It wraps Bitwarden's official Public REST API; no official Bitwarden MCP server was identified in official documentation during implementation. The connector intentionally does not expose Password Manager vault items, Secrets Manager secret values, arbitrary HTTP calls, writes, deletes, invitations, permission changes, or billing operations.

## Official sources
- Public API: https://bitwarden.com/help/public-api/
- Password Manager APIs: https://bitwarden.com/help/bitwarden-apis/
- Event logs: https://bitwarden.com/help/event-logs/
- Secrets Manager SDK (not used by this connector): https://bitwarden.com/help/secrets-manager-sdk/

The Public API supports organization members, collections, groups, event logs, and policies. Cloud API bases are `https://api.bitwarden.com` and `https://api.bitwarden.eu`; authentication uses OAuth 2.0 client credentials at the corresponding identity service. The required organization scope is `api.organization`. Teams or Enterprise organization access is required.

## Transport and architecture
External interface: MCP over stdio. Upstream transport: official Bitwarden Public REST API. `src/auth.ts` obtains and caches bearer tokens; `src/client.ts` provides bounded retry, timeout, error mapping and pagination parameters; `src/tools.ts` defines strict scoped tools; `src/server.ts` registers them with the MCP SDK. Credentials never enter MCP tool inputs or outputs.

## Tools
| Tool | Capability | Risk | Approval |
|---|---|---|---|
| `bitwarden.member.list` | List members | READ | No |
| `bitwarden.member.get` | Read member | READ | No |
| `bitwarden.group.list` | List groups | READ | No |
| `bitwarden.group.get` | Read group | READ | No |
| `bitwarden.collection.list` | List collections | READ | No |
| `bitwarden.collection.get` | Read collection | READ | No |
| `bitwarden.policy.list` | List policies | READ | No |
| `bitwarden.policy.get` | Read policy | READ | No |
| `bitwarden.event.list` | List audit events | READ | No |

List endpoints accept Bitwarden `continuationToken`. Event listing also accepts ISO-8601 `start` and `end`. UUID inputs are validated and schemas reject unknown fields.

## Authentication and least privilege
Set `BITWARDEN_CLIENT_ID` to the organization API client id (`organization.*`) and `BITWARDEN_CLIENT_SECRET` to its secret. The connector requests only `scope=api.organization` using `grant_type=client_credentials`. Bitwarden documents organization API keys as broad organization credentials, so protect them like privileged secrets and rotate on suspected exposure. They are loaded only by the auth layer and are never logged or returned to callers.

Environment variables:
- `BITWARDEN_CLIENT_ID` (required)
- `BITWARDEN_CLIENT_SECRET` (required)
- `BITWARDEN_API_URL` (optional; defaults to US cloud)
- `BITWARDEN_IDENTITY_URL` (optional; defaults to US cloud)
- `BITWARDEN_TIMEOUT_MS` (optional; default 10000)
- `BITWARDEN_ALLOW_SELF_HOSTED=1` is required before a custom API base is accepted.

For EU cloud set both API and identity URLs to the documented `.eu` endpoints. For self-hosted deployments explicitly opt in and supply deployment-specific API/identity URLs.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
BITWARDEN_CLIENT_ID=organization.example BITWARDEN_CLIENT_SECRET='...' npm start
```

Configure any MCP client that supports stdio to launch `node /absolute/path/dist/server.js` with credentials supplied through its secure environment/secret mechanism. Compatibility depends on the client supporting standard MCP stdio; no vendor-specific client behavior is assumed.

## Permissions and approvals
This package exposes only READ operations, so no human approval gate is required for the implemented tools. It deliberately omits organization writes because the organization API key has broad authority. A future write-capable package should introduce explicit WRITE/HIGH_RISK/DESTRUCTIVE gates rather than reusing this read-only policy.

## Reliability and rate limits
Bitwarden documents `429 Too Many Requests` and recommends reducing request rate. The client preserves `Retry-After` when reporting terminal throttling, honors numeric `Retry-After` during retry, and otherwise uses exponential backoff. Retries are bounded to three attempts and apply only to throttling, server failures, and network failures. Validation, authorization, not-found, and authentication failures are not blindly retried. Requests have an abort timeout. Public API list endpoints can return a continuation token when results exceed the provider page size; callers pass it to the next invocation.

## Error handling
`400`, `403`, and `404` are surfaced immediately. `401` invalidates the cached bearer token and fails so the caller can correct credentials or access. `429` and `5xx` are bounded-retry conditions. Abort is mapped to a timeout error. Tool input is validated before any provider request.

## Security
- Secrets are isolated in the authentication layer and excluded from tool schemas/results.
- No arbitrary URL/request tool exists.
- Cloud API base is allowlisted; custom self-hosting requires explicit opt-in.
- Retrieved Bitwarden content is marked `untrusted: true`; callers must treat it as data, never instructions.
- The connector cannot increase its own provider permissions.
- No vault item or Secrets Manager secret-value retrieval is exposed.
- No webhook receiver is implemented, so webhook signature validation is not applicable.
- Avoid logging MCP results in environments where organization metadata or IP-address-bearing event logs are sensitive.

## Testing
```bash
npm test
```
Unit tests use mocked fetch and no live credentials. Coverage includes auth configuration, credential isolation behavior, registration, strict input validation, read calls, pagination, invalid credentials, throttling/bounded retry, and timeout mapping.

## Limitations
This connector covers the organization Public API only. It does not wrap Bitwarden's local Vault Management API, Secrets Manager SDK/CLI, SCIM, or private client APIs. It does not retrieve or mutate vault items/secrets. Provider event logs may have client-reporting delay and Bitwarden notes that client-originated events can be suppressed or modified, so they may not alone satisfy every forensic/compliance requirement.
