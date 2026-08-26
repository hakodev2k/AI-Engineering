# Fly.io MCP/API Connector

Reusable MCP server exposing a bounded subset of Fly.io platform operations through stable provider-scoped tools.

## Provider and transport strategy

Fly.io documents an official `flyctl mcp server`, while `fly mcp` commands are still marked experimental. Fly.io also documents the Machines REST API at `https://api.machines.dev/v1` for Apps, Machines, Volumes, Certificates, and Tokens.

This connector intentionally uses the official Machines REST API instead of delegating agent authority to the broader experimental `flyctl` MCP surface. The direct API enables a fixed allowlist, strict parameter validation, deterministic approval checks, bounded retries, and no dynamic tool discovery. Agent callers still interact only through MCP tools.

Official sources researched:

- https://fly.io/docs/mcp/
- https://fly.io/docs/mcp/flyctl-server/
- https://fly.io/docs/machines/api/
- https://fly.io/docs/machines/api/working-with-machines-api/
- https://fly.io/docs/machines/api/machines-resource/
- https://fly.io/docs/machines/api/apps-resource/
- https://fly.io/docs/machines/api/volumes-resource/
- https://fly.io/docs/security/tokens/

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod schema
  -> permission / approval gate
  -> FlyClient
  -> official Fly Machines REST API
```

Provider data is returned with `untrusted_provider_content: true`; retrieved platform content must never be interpreted as agent instructions.

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- `zod`

## Installation

```bash
npm install
npm run build
```

## Authentication

Set `FLY_API_TOKEN` to a Fly.io token. Fly.io recommends narrowly scoped tokens instead of broad auth tokens. Prefer app-scoped deploy tokens for connectors dedicated to one application when the desired endpoint is supported; use broader organization-level tokens only when cross-app operations are required.

Credentials remain inside the connector process and are attached only to outbound `Authorization: Bearer ...` headers. They are not accepted as MCP tool inputs and are never returned in tool output.

## Environment variables

```text
FLY_API_TOKEN=
FLY_API_BASE_URL=https://api.machines.dev/v1
FLY_ORG_SLUG=
FLY_REQUIRE_WRITE_APPROVAL=true
FLY_APPROVAL_SECRET=
FLY_TIMEOUT_MS=15000
```

`FLY_API_BASE_URL` is restricted to an HTTPS endpoint or Fly.io's documented internal `_api.internal` endpoint to reduce SSRF risk.

## Tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `fly.app.list` | List apps in an organization | READ | No |
| `fly.app.get` | Read app metadata | READ | No |
| `fly.app.create` | Create an app | WRITE | By default |
| `fly.app.delete` | Delete an app | DESTRUCTIVE | Always |
| `fly.machine.list` | List machines | READ | No |
| `fly.machine.get` | Read machine state/configuration | READ | No |
| `fly.machine.start` | Start a machine | HIGH_RISK | Always |
| `fly.machine.stop` | Stop a machine | HIGH_RISK | Always |
| `fly.machine.delete` | Permanently delete a machine | DESTRUCTIVE | Always |
| `fly.volume.list` | List volumes | READ | No |
| `fly.volume.get` | Read volume metadata | READ | No |
| `fly.volume.create` | Create a volume | WRITE | By default |
| `fly.volume.delete` | Permanently delete a volume | DESTRUCTIVE | Always |

The implementation does not expose arbitrary URLs, arbitrary provider requests, secrets management, billing, organization membership, networking/security-policy mutation, or deployment from source.

## Approval model

READ tools execute automatically.

WRITE tools require approval when `FLY_REQUIRE_WRITE_APPROVAL=true` (default). HIGH_RISK and DESTRUCTIVE tools always require approval.

Approval tokens are HMAC-SHA256 digests bound to both exact tool name and exact JSON payload:

```text
HMAC_SHA256(FLY_APPROVAL_SECRET, tool_name + "\n" + JSON.stringify(payload))
```

This prevents approval for one action or payload from being silently reused for another. The approval secret itself is never passed through the model or MCP input.

## Reliability and rate limits

The client applies a configurable timeout, retries only read operations on HTTP 429 and 5xx failures, uses bounded exponential backoff, honors `Retry-After`, and does not blindly retry create/start/stop/delete operations. Authentication, authorization, and validation failures are surfaced immediately.

Fly.io's effective limits can vary by API/service and response. The connector therefore treats HTTP 429 plus `Retry-After` as authoritative instead of hard-coding an undocumented global quota.

## Error handling

Provider non-2xx responses become `FlyApiError` values containing HTTP status, a bounded provider message, and parsed `Retry-After` when present. Timeout and network failures become explicit connector errors.

## Security considerations

- Use least-privilege Fly.io tokens.
- Never place tokens in prompts or tool arguments.
- Keep `FLY_APPROVAL_SECRET` outside model context.
- REST origin configuration is validated.
- Tool schemas reject ambiguous app names and resource IDs.
- Destructive operations are non-retryable and approval-gated.
- Provider content is treated as untrusted data.
- No dynamic upstream MCP tool discovery occurs.
- Logs should never contain tokens or approval secrets.

The official `flyctl` MCP server exists, but this connector does not automatically trust or forward its evolving tool set. A future stable, capability-scoped Fly.io MCP transport can be placed behind the same external tool contracts.

## Running

```bash
export FLY_API_TOKEN='...'
export FLY_ORG_SLUG='personal'
npm run build
npm start
```

Any MCP client capable of launching a standard stdio MCP server can execute `node dist/server.js` with the required environment variables. No vendor-specific client behavior is assumed.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch` and require no live Fly.io credentials. They cover credential configuration, API-origin validation, permission classification, approval binding, provider errors, non-retryable writes, and bounded transient retries.

## Limitations

- Implements 13 focused capabilities rather than the full Fly.io API.
- Does not allocate public IP addresses; Fly.io documents this via `flyctl` or GraphQL.
- Does not implement app secrets, certificates, OIDC token minting, leases, machine updates, cordon/uncordon, snapshots, or volume resize.
- Does not proxy the experimental official `flyctl mcp server`.
- Actual API reach depends on the scope of the Fly.io token supplied by the operator.
