# bunny.net MCP/API Connector

Reusable MCP server that exposes a deliberately small, safety-reviewed subset of the official bunny.net REST API for CDN, Storage, and DNS workflows.

## Transport strategy

No official bunny.net MCP server was identified in the reviewed official documentation on 2026-09-08. bunny.net does publish official REST API documentation and an official Terraform provider, so this connector uses the official REST API at `https://api.bunny.net` and exposes stable MCP tools over stdio.

The connector does not expose a generic arbitrary HTTP request tool. Each capability maps to a fixed provider path and a strict input schema.

## Official sources reviewed

- API reference: https://docs.bunny.net/reference
- DNS record creation: https://docs.bunny.net/reference/dnszonepublic_addrecord
- Pull Zone allowed-referrer update: https://docs.bunny.net/reference/pullzonepublic_addallowedreferrer
- Pull Zone deletion: https://docs.bunny.net/reference/pullzonepublic_delete
- Storage Zone statistics: https://docs.bunny.net/reference/storagezonepublic_storagezonestatistics
- Official Terraform provider documentation: https://docs.bunny.net/terraform
- Terraform authentication quickstart: https://docs.bunny.net/docs/terraform-quickstart

The reviewed API reference uses the `AccessKey` header with a bunny.net API key. The documentation reviewed did not describe OAuth scopes for these account APIs, so this connector does not invent a scope model. Keep the key server-side and use the least-privileged credential arrangement available to your bunny.net account/environment.

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `bunny.pull_zone.list` | REST | READ | No |
| `bunny.pull_zone.get` | REST | READ | No |
| `bunny.storage_zone.list` | REST | READ | No |
| `bunny.storage_zone.get` | REST | READ | No |
| `bunny.storage_zone.statistics` | REST | READ | No |
| `bunny.dns_zone.list` | REST | READ | No |
| `bunny.dns_zone.get` | REST | READ | No |
| `bunny.dns_zone.export` | REST | READ | No |
| `bunny.dns_record.create` | REST | HIGH_RISK | Explicit human approval |
| `bunny.pull_zone.allowed_referrer.add` | REST | HIGH_RISK | Explicit human approval |
| `bunny.pull_zone.delete` | REST | DESTRUCTIVE | Strong approval + disabled by default |

These operations support common agent workflows such as inventory inspection, storage-capacity review, DNS review, controlled DNS change, CDN access-policy change, and guarded resource retirement.

## Architecture

```text
MCP client
  -> stdio MCP server
     -> strict tool schema
        -> risk/approval policy
           -> BunnyClient
              -> CredentialProvider
                 -> official bunny.net REST API
```

Provider content is returned with `source: "untrusted-provider-data"`. Retrieved names, comments, records, or other remote content must never be interpreted as agent instructions.

## Authentication and credential isolation

Set:

```bash
BUNNYNET_API_KEY=
```

The API key is read only by the connector configuration/authentication layer and is inserted into the `AccessKey` request header by `BunnyClient`. It is never returned by a tool and must never be placed in an LLM prompt.

The official API host is pinned to `https://api.bunny.net` to reduce SSRF risk. `BUNNYNET_API_BASE_URL` exists only for explicit configuration validation and currently accepts the official host only.

## Environment variables

```text
BUNNYNET_API_KEY=                 # required
BUNNYNET_API_BASE_URL=https://api.bunny.net
BUNNYNET_TIMEOUT_MS=15000
BUNNYNET_MAX_RETRIES=3
BUNNYNET_APPROVAL_MODE=required
BUNNYNET_ALLOW_DESTRUCTIVE=false
```

`BUNNYNET_ALLOW_DESTRUCTIVE` is false by default. Do not enable it globally for unattended agents.

## Install and run

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers. Client-specific configuration syntax differs by product; point the client at the built `dist/server.js` process and provide credentials through the process environment rather than through chat context.

## Tool behavior

### Read tools

Read tools can execute without approval. Inputs use positive numeric resource IDs and bounded date validation where relevant.

### High-risk tools

`bunny.dns_record.create` can alter production routing. `bunny.pull_zone.allowed_referrer.add` changes CDN access policy. Both require `approved: true` in a call only after a human has explicitly approved the exact change.

The connector does not provide a way for provider-returned content to set `approved` or change policy configuration.

### Destructive tool

`bunny.pull_zone.delete` is disabled unless the operator explicitly sets:

```text
BUNNYNET_ALLOW_DESTRUCTIVE=true
```

The call then still requires `approved: true` and an `approvalToken` of at least eight characters. This implements an additional execution barrier; callers should still present the exact Pull Zone ID and impact to a human before execution.

## Reliability

- Default timeout: 15 seconds, configurable from 1 to 120 seconds.
- Cancellation: caller abort signals are combined with the timeout signal.
- Retry count: bounded to 0-5 retries.
- Automatic retries are restricted to `GET` requests.
- Retryable read failures: HTTP 408, 429, 5xx, and transient network `TypeError` failures.
- Mutating `POST`, `PUT`, and `DELETE` requests are never retried automatically, avoiding duplicate or repeated state changes.
- `Retry-After` is honored when it contains an integer number of seconds, capped at 30 seconds.
- `x-ratelimit-limit` and `x-ratelimit-remaining` are parsed when returned by the provider.

The reviewed bunny.net documentation did not present one universal fixed rate-limit number for all implemented account endpoints. The connector therefore handles throttling dynamically rather than inventing a limit.

## Error handling

Provider failures are mapped to `BunnyApiError` with HTTP status, optional parsed provider body, and optional `Retry-After`. Authentication, permission, and validation failures are not blindly retried. MCP handlers return structured error text without credentials.

## Security considerations

- API credentials remain in the connector/auth layer.
- The API origin is pinned to the official bunny.net account API host.
- Tool handlers expose fixed relative paths only; absolute URLs and path values containing protocol syntax are rejected.
- There is no unrestricted `execute_any_api_request` capability.
- Input schemas are strict and reject unknown fields.
- DNS and access-policy mutations require explicit approval.
- Destructive deletion is disabled by default and requires a stronger second gate when enabled.
- Provider responses are treated as untrusted data to reduce prompt-injection risk.
- Logs should never include the `AccessKey` header or full environment values.

## Webhooks and events

The official documentation review included searches for webhook/event capabilities. No general webhook mechanism was required for the implemented CDN/Storage/DNS workflows, so this connector does not expose webhook registration or event ingestion and makes no unsupported claim about a provider-wide event contract.

## Testing

Normal tests do not require live credentials and use mocked `fetch` implementations.

```bash
npm test
```

Coverage includes:

- authentication/config defaults and invalid configuration
- API key header injection
- SSRF/path rejection
- provider error mapping
- bounded retry behavior for reads
- no retry for mutations
- tool registration
- strict ID validation
- high-risk approval denial/allow
- destructive-operation disabled-by-default behavior

## Limitations

- This connector intentionally covers a focused subset of the bunny.net account REST API rather than every product or endpoint.
- It does not manage billing, account credentials, API-key rotation, certificates, Shield/WAF policy, Stream libraries, Edge Scripts, or Magic Containers.
- It does not expose arbitrary API requests.
- It does not emulate an upstream MCP server because no official bunny.net MCP server was identified in the official documentation review.
- Account API key granularity depends on bunny.net account capabilities; this package does not invent OAuth scopes or provider permissions that are not documented.

See `examples/workflows.md` for safe call examples and approval expectations.
