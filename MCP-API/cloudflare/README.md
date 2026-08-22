# Cloudflare MCP/API Connector

Reusable MCP server that exposes a small, stable, safety-oriented Cloudflare tool surface for zone discovery, DNS administration, and cache purging.

## Transport strategy

Cloudflare has an official remote MCP server at `https://mcp.cloudflare.com/mcp`. Cloudflare documents it as a token-efficient Code Mode server covering the full Cloudflare API, with OAuth as the recommended interactive authentication path and API-token bearer authentication available for automation.

This connector intentionally **does not relay Cloudflare's generic Code Mode `execute` capability**. The required workflows are better represented as narrow typed tools, so they use Cloudflare's official REST API directly. This avoids exposing arbitrary endpoint/code execution to an agent while preserving a stable external MCP contract.

Official sources researched for this implementation:

- Cloudflare official MCP: https://github.com/cloudflare/mcp and https://mcp.cloudflare.com/mcp
- Cloudflare domain-specific MCP servers: https://github.com/cloudflare/mcp-server-cloudflare
- API token permissions: https://developers.cloudflare.com/fundamentals/api/reference/permissions/
- API token creation and resource scoping: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
- API rate limits: https://developers.cloudflare.com/fundamentals/api/reference/limits/
- Zones API: https://developers.cloudflare.com/api/resources/zones/
- DNS records API: https://developers.cloudflare.com/api/resources/dns/subresources/records/
- Cache purge API: https://developers.cloudflare.com/api/resources/cache/methods/purge/

## Runtime

- Node.js 20+
- TypeScript
- MCP SDK over stdio
- `fetch` for Cloudflare REST API calls

Install and run:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

For local development:

```bash
npm run dev
```

## Authentication

Use a Cloudflare API token. Global API keys are deliberately unsupported.

Set:

```text
CLOUDFLARE_API_TOKEN=<secret token stored outside the agent prompt>
```

The token remains inside the connector process and is only placed in the outbound `Authorization: Bearer ...` header. Tool results, errors, examples, and logs do not intentionally expose it.

Use least privilege and restrict the token to only the zones needed. Cloudflare allows API tokens to be scoped both by permission and resource.

Recommended permissions by feature:

| Capability | Cloudflare token permission |
|---|---|
| `cloudflare.zone.list` | `Zone:Zone Read` |
| Zone/DNS reads | `Zone:DNS Read` (or another accepted read permission for zone details) |
| DNS create/update/delete | `Zone:DNS Write` |
| Cache purge | `Zone:Cache Purge` |

Do not grant DNS Write or Cache Purge when only read tools are needed.

## Environment variables

See `.env.example`.

- `CLOUDFLARE_API_TOKEN`: required secret.
- `CLOUDFLARE_API_BASE_URL`: defaults to `https://api.cloudflare.com/client/v4`.
- `CLOUDFLARE_TIMEOUT_MS`: request timeout, default 15000 ms, constrained to 1-60 seconds.
- `CLOUDFLARE_ALLOWED_WRITE_ZONE_IDS`: comma-separated zone IDs allowed for mutations. Writes fail closed if the target zone is absent.
- `CLOUDFLARE_APPROVAL_MODE`: `required` by default; `disabled` may be used only when an external policy layer already guarantees approval.
- `CLOUDFLARE_APPROVED_ACTIONS`: comma-separated action names approved by an operator, such as `cloudflare.dns.record.create`.
- `CLOUDFLARE_ALLOW_DESTRUCTIVE`: `false` by default. DNS deletion additionally requires this to be explicitly set to `true`.

Operator approval lives outside tool-call arguments. An agent therefore cannot self-approve by setting an `approved=true` parameter.

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `cloudflare.zone.list` | REST `GET /zones` | READ | No |
| `cloudflare.zone.get` | REST `GET /zones/{zone_id}` | READ | No |
| `cloudflare.dns.record.list` | REST `GET /zones/{zone_id}/dns_records` | READ | No |
| `cloudflare.dns.record.get` | REST `GET /zones/{zone_id}/dns_records/{record_id}` | READ | No |
| `cloudflare.dns.record.create` | REST `POST /zones/{zone_id}/dns_records` | WRITE | Required by default |
| `cloudflare.dns.record.update` | REST `PATCH /zones/{zone_id}/dns_records/{record_id}` | WRITE | Required by default |
| `cloudflare.dns.record.delete` | REST `DELETE /zones/{zone_id}/dns_records/{record_id}` | DESTRUCTIVE | Required and disabled by default |
| `cloudflare.cache.purge.urls` | REST `POST /zones/{zone_id}/purge_cache` | HIGH_RISK | Required |
| `cloudflare.cache.purge.everything` | REST `POST /zones/{zone_id}/purge_cache` | HIGH_RISK | Required |

DNS mutation schemas intentionally support a practical subset of Cloudflare record types: `A`, `AAAA`, `CNAME`, `TXT`, `MX`, `SRV`, `CAA`, and `NS`. Unsupported specialized record structures should be handled by a future explicit typed tool rather than a generic request escape hatch.

## Architecture

```text
MCP client
   |
   v
src/server.ts                stable typed MCP tools
   |
   +--> src/config.ts        credential/config loading + approval policy
   |
   +--> src/client.ts        bounded HTTP transport, timeout, error mapping
   |
   v
Cloudflare REST API
```

Cloudflare's official MCP is documented and preferred for broad exploratory Cloudflare workflows, but it is not proxied here because its Code Mode interface intentionally permits broad API execution. Narrow REST calls are safer for this connector's selected capabilities.

## Reliability and rate limiting

Cloudflare documents a global API limit of 1,200 requests per five minutes per user/account token and 200 requests per second per IP, with some endpoints having additional product-specific limits. REST responses can include `Ratelimit`, `Ratelimit-Policy`, and `retry-after` headers.

The connector:

- applies a bounded timeout to every request;
- retries read-only `GET` calls at most three attempts;
- honors `retry-after` for read throttling, capped at 10 seconds per retry;
- uses exponential delay for transient read network failures;
- does **not** blindly retry `POST`, `PATCH`, or `DELETE`, preventing duplicate or repeated mutations;
- returns provider HTTP failures as explicit errors.

Pagination is exposed directly on list tools with bounded page sizes so agents do not accidentally fan out into large request storms.

## Security model

Provider content is untrusted data. Callers must not interpret DNS names, TXT records, comments, metadata, or API messages as instructions that can change connector policy.

Security controls include:

- no raw `execute_any_request` or arbitrary URL tool;
- fixed Cloudflare API origin from configuration, never from tool input;
- API token isolated in the connector process;
- strict zone/record ID validation;
- bounded string/array/page sizes;
- write-zone allowlist independent of token scope;
- operator-managed approval action allowlist;
- destructive DNS deletion disabled by default;
- no automatic permission escalation;
- no mutation retries;
- no credential forwarding to MCP clients or upstream content.

For production, run the connector with a dedicated token scoped to exact zones and minimum permissions, and protect its environment/secret store separately from the LLM runtime.

## Human approval flow

Recommended flow:

```text
Read -> Recommend -> Operator approves action externally -> Execute
```

Example for DNS create:

```text
CLOUDFLARE_ALLOWED_WRITE_ZONE_IDS=0123456789abcdef0123456789abcdef
CLOUDFLARE_APPROVED_ACTIONS=cloudflare.dns.record.create
```

For deletion, the operator must also explicitly enable:

```text
CLOUDFLARE_ALLOW_DESTRUCTIVE=true
```

Remove approvals after the intended change window.

## Errors

Typical surfaced categories:

- configuration validation failures;
- `WRITE_DENIED` when a zone is outside the write allowlist;
- `APPROVAL_REQUIRED` when a write has not been approved externally;
- `DESTRUCTIVE_DISABLED` for DNS deletion with destructive operations disabled;
- `NETWORK_OR_TIMEOUT` for exhausted transient read failures;
- `CloudflareApiError` for Cloudflare HTTP/API failures.

Authentication and permission failures are not retried.

## Tests

Unit tests require no live credentials. They cover:

- missing authentication configuration;
- zone write isolation;
- approval denial and allowance;
- destructive-operation default denial;
- authorization-header placement;
- provider error mapping;
- no write retries;
- bounded read retry on HTTP 429.

Run:

```bash
npm test
```

## MCP client configuration

Any MCP client that can launch a local stdio server can point to the built server. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/cloudflare/dist/src/server.js"],
  "env": {
    "CLOUDFLARE_API_TOKEN": "provided-by-your-secret-manager"
  }
}
```

Do not embed real tokens in checked-in client configuration.

## Limitations

- The connector does not expose the complete Cloudflare API.
- Cloudflare's official MCP exists, but its broad Code Mode execution surface is deliberately not proxied.
- OAuth interactive authorization to Cloudflare MCP is not implemented because selected operations use REST API tokens.
- Specialized DNS record data structures beyond the documented subset are not represented.
- Cache purge-by-tag/host/prefix is not exposed; only URL-targeted purge and full-zone purge are implemented.
- Webhooks/events are not implemented because they are not required for the selected operational workflow.
