# Linode MCP/API Connector

Reusable MCP server for Akamai Cloud Computing (Linode) infrastructure discovery, observability, and tightly controlled instance lifecycle operations.

## Transport strategy

No Akamai/Linode-operated official MCP server was identified in the official documentation reviewed for this run. Community MCP implementations exist, but this connector does not trust or depend on them. It uses the official Linode API v4 directly at `https://api.linode.com/v4` and exposes a narrow MCP stdio interface.

Official sources researched:

- API reference: https://techdocs.akamai.com/linode-api/reference
- List Linodes: https://techdocs.akamai.com/linode-api/reference/get-linode-instances
- Get Linode: https://techdocs.akamai.com/linode-api/reference/get-linode-instance
- Linode statistics: https://techdocs.akamai.com/linode-api/reference/get-linode-stats
- Response/rate-limit headers: https://techdocs.akamai.com/linode-api/reference/response-headers
- Rate limits: https://techdocs.akamai.com/linode-api/reference/rate-limits

## Runtime

Node.js 20+, TypeScript, official Model Context Protocol TypeScript SDK. Install with `npm install`, run `npm run build`, `npm test`, then `npm start`.

## Authentication and least privilege

Set `LINODE_API_TOKEN` to a Linode personal access token or OAuth access token. The connector sends it only as `Authorization: Bearer <token>` to the fixed official API host. Credentials are never accepted as MCP tool inputs or returned in output.

Use the narrowest OAuth scopes and IAM permissions available. Read-only instance workflows require `linodes:read_only`; instance lifecycle actions require corresponding read/write authority. Volume and domain reads require their matching read-only scopes. Linode response headers include `X-Accepted-OAuth-Scopes` and `X-OAuth-Scopes`, which can help diagnose insufficient scope without broadening credentials blindly.

## Environment

`LINODE_API_TOKEN` is required. `LINODE_API_BASE_URL` defaults to and is pinned to `https://api.linode.com/v4`. `LINODE_TIMEOUT_MS` defaults to 15000. `LINODE_MAX_RETRIES` defaults to 2 and is capped at 5. `LINODE_ALLOW_HIGH_RISK` and `LINODE_ALLOW_DESTRUCTIVE` default to false. `LINODE_APPROVAL_SECRET` is required for mutations and must remain outside model context.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `linode.instance.list` | READ | no |
| `linode.instance.get` | READ | no |
| `linode.instance.stats` | READ | no |
| `linode.region.list` | READ | no |
| `linode.type.list` | READ | no |
| `linode.volume.list` | READ | no |
| `linode.firewall.list` | READ | no |
| `linode.domain.list` | READ | no |
| `linode.instance.boot` | HIGH_RISK | yes + operator enable |
| `linode.instance.shutdown` | HIGH_RISK | yes + operator enable |
| `linode.instance.reboot` | HIGH_RISK | yes + operator enable |
| `linode.instance.delete` | DESTRUCTIVE | yes + disabled by default + exact confirmation |

The connector deliberately omits arbitrary HTTP execution, billing/payments, token administration, IAM mutation, root-password reset, rescue/rebuild, resource creation, DNS mutation, and other broad administrative actions.

## Approval model

READ tools execute automatically. HIGH_RISK tools require `LINODE_ALLOW_HIGH_RISK=true` plus a payload-bound `approvalToken`. DESTRUCTIVE tools require `LINODE_ALLOW_DESTRUCTIVE=true`, payload-bound approval, and `confirm: "DELETE LINODE <id>"`.

Approval is HMAC-SHA256 over the exact tool name, newline, and canonical JSON payload excluding `approvalToken`. The secret is never a tool parameter. Changing the target instance or confirmation invalidates approval.

## Reliability and rate limits

All calls have bounded timeouts. Only GET requests retry transient 429/5xx/network failures, with bounded exponential backoff and `Retry-After` support. Mutations are single-attempt, preventing repeated reboot/shutdown/delete after ambiguous failures. Authentication, permission, and validation errors are not retried.

Linode currently documents 200 requests/minute for paginated GET collections and 1600 requests/minute for most other operations, with endpoint-specific limits. Instance statistics are limited to 50 requests/minute. The connector returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` metadata when present and never auto-walks pagination.

## Pagination

List tools expose `page` and `pageSize`; page size follows Linode's documented 25-500 bounds. This prevents hidden fan-out and lets callers deliberately request subsequent pages.

## Security

The API origin is fixed to `api.linode.com`, reducing SSRF and credential-forwarding risk. Tool inputs are strict and bounded. Credentials remain in the client layer. Provider responses are wrapped with `untrustedProviderData: true`; instance labels, domains, metadata, errors, and other provider content are data, not instructions. Retrieved content cannot enable writes, alter risk classifications, change credentials, or mint approvals.

No generic request tool or community MCP passthrough exists. High-impact lifecycle operations require an operator-controlled environment gate and external approval. Destructive deletion is disabled by default and never retried.

## Errors

HTTP provider failures become `LinodeError` with status, optional retry timing, and provider details. Network/timeouts surface as `NETWORK_OR_TIMEOUT`. Approval failures occur before any provider call. Secrets are not intentionally included in error messages.

## Testing

`npm test` requires no live credentials. Tests cover missing auth, official-host pinning, high-risk default denial, exact-payload approval, bearer credential placement, and prevention of mutation retries.

## Examples

See `examples/workflows.md` for inventory, health inspection, approved reboot, and destructive deletion workflows.

## Limitations

This connector intentionally implements a small server-centric surface rather than the complete Linode API. It does not create instances or volumes, modify firewalls/DNS, manage LKE, databases, NodeBalancers, Object Storage, support tickets, billing, users, OAuth clients, or personal access tokens. No official upstream MCP is used because none was identified in Akamai/Linode official sources; community implementations are not treated as trusted provider infrastructure.
