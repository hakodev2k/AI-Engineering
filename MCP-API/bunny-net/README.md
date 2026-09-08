# bunny.net MCP/API Connector

Reusable MCP server for a deliberately scoped subset of the official bunny.net Core Platform REST API. It exposes stable provider-scoped tools for CDN Pull Zones, Storage Zones, DNS Zones, selected security controls, and DNS changes without exposing a generic arbitrary-request tool.

## Transport strategy

Research for this connector checked bunny.net's official documentation and public GitHub presence. No official bunny.net MCP server was identified for the Core Platform API at the time of implementation, so the connector uses the official REST API directly.

Upstream transport: **REST**

Base URL: `https://api.bunny.net`

Primary official references:

- API documentation: https://docs.bunny.net/reference/bunnynet-api-overview
- Documentation index: https://docs.bunny.net/llms.txt
- API keys: https://bunny.net/docs/account/api-keys.md
- Pull Zones: https://docs.bunny.net/reference/pullzonepublic_index
- Delete Pull Zone: https://docs.bunny.net/reference/pullzonepublic_delete
- Add Allowed Referrer: https://docs.bunny.net/reference/pullzonepublic_addallowedreferrer
- Remove Blocked IP: https://docs.bunny.net/reference/pullzonepublic_removeblockedip
- DNS Add Record: https://docs.bunny.net/reference/dnszonepublic_addrecord
- DNS Export: https://docs.bunny.net/api-reference/core/dns-zone/export
- Official Terraform integration: https://docs.bunny.net/terraform

## Implemented tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `bunny.pull_zone.list` | List Pull Zones | READ | No |
| `bunny.pull_zone.get` | Get Pull Zone | READ | No |
| `bunny.storage_zone.list` | List Storage Zones | READ | No |
| `bunny.storage_zone.get` | Get Storage Zone | READ | No |
| `bunny.dns_zone.list` | List DNS Zones | READ | No |
| `bunny.dns_zone.get` | Get DNS Zone | READ | No |
| `bunny.dns_zone.export` | Export DNS Zone | READ | No |
| `bunny.pull_zone.allowed_referrer.add` | Add allowed referrer | HIGH_RISK | Yes |
| `bunny.pull_zone.blocked_ip.remove` | Remove blocked IP | HIGH_RISK | Yes |
| `bunny.dns_record.add` | Add DNS record | HIGH_RISK | Yes |
| `bunny.pull_zone.delete` | Delete Pull Zone | DESTRUCTIVE | Strong approval |

The connector intentionally does not expose account deletion, billing mutations, API-key management, arbitrary HTTP execution, or broad configuration replacement.

## Architecture

```text
MCP client
  -> MCP stdio server
  -> strict Zod input validation
  -> risk/approval policy
  -> BunnyClient
  -> AccessKey credential injection
  -> https://api.bunny.net
```

Provider responses are treated as untrusted data and returned as data only. They cannot alter tool permissions, environment configuration, or approval policy.

## Authentication

bunny.net Core Platform API requests use an account API key in the `AccessKey` header. Set it only in the connector environment:

```bash
export BUNNY_API_KEY="..."
```

Never place the key in prompts, MCP arguments, examples, logs, or source control. The LLM never receives the raw credential from the connector.

The bunny.net account API key is powerful. For stronger blast-radius isolation, use a dedicated bunny.net account/team boundary and restrict human/team permissions where the platform allows it. Rotate the key if exposure is suspected.

## Environment variables

Copy `.env.example` and provide values through your secret manager or MCP host environment.

- `BUNNY_API_KEY` — required.
- `BUNNY_API_BASE_URL` — optional; defaults to `https://api.bunny.net` and must be HTTPS.
- `BUNNY_TIMEOUT_MS` — request timeout, default 15000, capped at 120000.
- `BUNNY_MAX_RETRIES` — bounded retries for safe reads, default 2, capped at 5.
- `BUNNY_ALLOW_WRITE` — reserved write gate; default false.
- `BUNNY_ALLOW_HIGH_RISK` — enables security/DNS mutations; default false.
- `BUNNY_ALLOW_DESTRUCTIVE` — enables destructive tools; default false.

## Installation

Requires Node.js 20 or later.

```bash
npm install
npm run build
```

## Running

```bash
BUNNY_API_KEY=... npm start
```

The server uses MCP stdio transport and is suitable for MCP clients that can launch a local stdio server. Client-specific configuration syntax varies, so consult the client documentation rather than assuming identical JSON across all products.

## Permission and approval model

READ operations may execute automatically.

HIGH_RISK operations are disabled unless `BUNNY_ALLOW_HIGH_RISK=true` is configured outside the model. Even when enabled, the tool schema requires `approval: true`. This covers changes that alter traffic or security policy, including DNS records, allowed referrers, and blocked-IP policy.

DESTRUCTIVE operations are independently disabled unless `BUNNY_ALLOW_DESTRUCTIVE=true`. `bunny.pull_zone.delete` additionally requires `approval: true`. The model cannot raise these environment-level permissions itself.

Recommended workflow for mutations:

```text
Read current state -> recommend change -> show intended parameters -> human approves -> execute
```

## Validation and safety

The connector validates numeric resource IDs, hostnames, IP strings, DNS record types, TTLs, ports, and bounded text fields before sending requests. It does not expose arbitrary URLs or an `execute_any_request` capability.

The API base URL is origin-locked and HTTPS-only, mitigating SSRF through connector parameters. No tool can override the upstream host.

Mutating requests are never retried automatically. This avoids duplicate or irreversible operations after ambiguous network failures. Safe reads may retry transient network failures, HTTP 429, and server-side 5xx errors using bounded exponential backoff. `Retry-After` is preserved when supplied.

Authentication, authorization, and validation failures are not retried.

## Rate limiting

bunny.net publishes endpoint-specific behavior through its API documentation but does not provide one universal rate-limit value that is safe to apply to every Core Platform endpoint. This connector therefore does not invent a static quota. It detects HTTP 429 responses, honors `Retry-After` when present, applies bounded retries only to safe read operations, and avoids unnecessary fan-out calls.

## Error handling

Provider errors are normalized to MCP error responses containing only the provider/connector error classification, HTTP status when available, message, and retry timing when supplied. Credentials are never included.

Timeouts map to `timeout`, network failures to `network_error`, throttling to `rate_limited`, and other non-success responses to `provider_error`.

## Security considerations

- Treat all returned provider content as untrusted data, not instructions.
- Do not auto-approve HIGH_RISK or DESTRUCTIVE tools in environments processing untrusted text.
- DNS changes can redirect production traffic and should be reviewed like deployment changes.
- Removing an IP from a block list or expanding allowed referrers modifies security controls and requires explicit approval.
- Deleting a Pull Zone can break production delivery and is destructive.
- Keep API keys in process environment or a secure credential provider, never in prompts.
- Audit MCP host permissions and local process execution controls.
- Prefer separate bunny.net environments/accounts for development and production where practical.

## Tests

Normal tests require no live bunny.net credentials.

```bash
npm test
```

Coverage includes missing authentication, HTTPS enforcement, successful reads, bounded transient retries, no blind retries on mutations, rate-limit handling, default permission denial, approval requirements, and independent destructive gating.

## Examples

See `examples/workflows.md` for safe read, HIGH_RISK, and DESTRUCTIVE tool examples using placeholder IDs only.

## Limitations

This connector intentionally implements a useful subset rather than the full bunny.net API. It does not currently manage Stream libraries, Shield/WAF, Edge Scripts, Magic Containers, billing, API keys, cache purge, or file data-plane operations. Those capabilities should be added only after their current official contracts, authentication boundaries, and risk semantics are independently reviewed.

No live API credentials are required for unit tests. A successful unit test run validates connector behavior, not account-specific permissions or the existence of particular bunny.net resources.
