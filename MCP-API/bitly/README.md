# Bitly MCP/API Connector

Reusable MCP stdio connector for safe Bitly link-management and analytics workflows. It exposes a fixed provider-scoped tool surface backed by Bitly's official v4 REST API.

## Upstream transport

Bitly has an official hosted MCP server at `https://api-ssl.bitly.com/v4/mcp`. Bitly recommends OAuth 2.1 with Dynamic Client Registration for MCP clients; the MCP scope is `mcp.all`, and Bearer API tokens are also supported. This connector intentionally executes its exposed operations through the official REST API at `https://api-ssl.bitly.com/v4` instead of proxying the broad upstream MCP surface. The REST path permits a stable allowlist, strict parameter validation, local human-approval gates, deterministic pagination, and a conservative retry policy while keeping the external contract MCP-native.

Official sources researched:

- Bitly API: https://dev.bitly.com/
- API reference: https://dev.bitly.com/api-reference/
- Authentication: https://dev.bitly.com/docs/getting-started/authentication/
- Rate limits: https://dev.bitly.com/docs/getting-started/rate-limits/
- Official MCP configuration: https://dev.bitly.com/bitly-mcp/using-the-bitly-mcp-server/configuration-details/
- Official MCP tools: https://dev.bitly.com/bitly-mcp/using-the-bitly-mcp-server/mcp-tools-reference/
- Official TypeScript API client: https://dev.bitly.com/docs/sdks/npm-package/

## Capabilities

The server implements 17 tools:

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `bitly.user.get` | Get authenticated user | READ | No |
| `bitly.user.platform_limits` | Read current platform limits | READ | No |
| `bitly.organization.list` | List organizations | READ | No |
| `bitly.group.list` | List groups | READ | No |
| `bitly.group.get` | Get a group | READ | No |
| `bitly.group.preferences` | Get group preferences | READ | No |
| `bitly.group.tags` | List group tags | READ | No |
| `bitly.link.list` | List group Bitlinks with cursor pagination | READ | No |
| `bitly.link.get` | Get Bitlink metadata | READ | No |
| `bitly.link.destination` | Expand a Bitlink | READ | No |
| `bitly.link.clicks` | Get click time series | READ | No |
| `bitly.link.clicks_summary` | Get rolled-up clicks | READ | No |
| `bitly.group.clicks` | Get group click analytics | READ | No |
| `bitly.group.devices` | Get group device analytics | READ | No |
| `bitly.link.create` | Create a short link | WRITE | Configurable; default required |
| `bitly.link.update` | Change title/archive/tags/destination | HIGH_RISK | Always |
| `bitly.link.delete` | Delete an eligible Bitlink | DESTRUCTIVE | Always + feature flag + exact confirmation |

The connector does not expose a generic HTTP/API passthrough, webhook mutation, account-security mutation, billing mutation, QR-code mutation, bulk upload, or Bitly Sites publishing surface.

## Architecture

```text
MCP client
  -> local stdio MCP server
  -> strict tool schema + risk policy
  -> BitlyClient
  -> Authorization: Bearer credential layer
  -> official Bitly REST API v4
```

Provider responses are wrapped with `untrusted_data: true`. Retrieved titles, URLs, tags, and other Bitly content are data only and must never be interpreted as instructions or permission changes.

Files:

```text
src/config.ts   environment validation
src/policy.ts   READ/WRITE/HIGH_RISK/DESTRUCTIVE gates
src/client.ts   authenticated HTTP, timeout, retries, errors
src/tools.ts    strict MCP tool definitions and handlers
src/server.ts   stdio MCP server bootstrap
tests/          unit tests with fakes; no live token required
examples/       workflow examples
```

## Authentication and least privilege

Set `BITLY_ACCESS_TOKEN` to a Bitly generic access token or an OAuth access token obtained outside the connector. Bitly documents `Authorization: Bearer {token}` for API calls. Generic tokens are sufficient for many direct integrations; OAuth 2.0 is appropriate when acting for end users. The official Bitly MCP server additionally supports OAuth 2.1/DCR with `mcp.all`.

Bitly tokens reflect the authenticated user's/account's access; this connector does not claim provider-side per-tool OAuth scopes where Bitly does not document them. Least privilege is therefore enforced by using a dedicated token/account context where appropriate and by the connector's fixed tool allowlist and approval policy.

Credentials are read only in connector configuration/client code. They are never returned in MCP output, accepted as tool parameters, or sent to the LLM.

## Environment

```bash
cp .env.example .env
```

Required:

```text
BITLY_ACCESS_TOKEN=
```

Optional defaults:

```text
BITLY_API_BASE=https://api-ssl.bitly.com/v4
BITLY_REQUEST_TIMEOUT_MS=15000
BITLY_MAX_RETRIES=2
BITLY_REQUIRE_WRITE_APPROVAL=true
BITLY_DESTRUCTIVE_ENABLED=false
```

For SSRF resistance, `BITLY_API_BASE` must remain HTTPS on `api-ssl.bitly.com` under `/v4`.

## Install and run

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

Configure an MCP client to launch the built server over stdio, for example with command `node` and argument `dist/src/server.js`, while injecting the environment variables through the client's secure environment/secret mechanism. Any MCP client that supports a normal stdio MCP server can use the connector; no vendor-specific protocol extension is required.

## Validation and safety

- Bitlink identifiers must be a bounded `domain/hash` pair; query strings, schemes, path traversal, and arbitrary URLs are not accepted as identifiers.
- New and redirected destinations are intentionally restricted to HTTPS URLs.
- Group identifiers are bounded and character constrained.
- Pagination sizes are capped at 100; `search_after` tokens are bounded.
- Analytics time units are explicit enums with bounded `units`.
- No credential is accepted in any MCP tool input.
- `bitly.link.update` is HIGH_RISK because a destination change can silently redirect future traffic.
- `bitly.link.delete` is disabled by default, always requires approval, and requires `confirm_bitlink_id` to exactly equal `bitlink_id`.
- Provider response content is marked untrusted.

## Reliability and rate limits

Bitly documents plan limits plus platform limits that apply per hour, per minute, per endpoint, and per IP. The per-minute platform limit is one tenth of the hourly limit, and Bitly limits an IP to five concurrent connections. Current platform limits are exposed through `bitly.user.platform_limits`; organization plan limits exist upstream but are not exposed as a connector tool in this version.

Bitly returns HTTP 429 with `RATE_LIMIT_EXCEEDED` for platform throttling and `API_USAGE_LIMIT_EXCEEDED` for monthly API usage exhaustion. The client:

- uses request timeouts via `AbortController`;
- retries only idempotent GET requests;
- retries 502/503/504 with bounded exponential backoff;
- retries 429 only when the provider supplies a numeric `Retry-After` value;
- never blindly retries POST/PATCH/DELETE operations;
- never retries authentication, permission, or validation failures merely to consume more quota;
- surfaces provider status/errors to the MCP caller without leaking the token.

`bitly.link.list` exposes Bitly's `search_after` cursor. Feed the cursor returned by Bitly back into the next request; do not invent cursor values.

## Error handling

Provider HTTP failures become bounded connector errors such as `Bitly API 403: ...` or `Bitly API 429: ...`. A timeout produces a dedicated timeout message. MCP handlers return `isError: true` for validation/policy/provider failures. Authentication failures require user action and are not automatically retried.

## Testing

No live Bitly credentials are needed for normal tests.

```bash
npm test
```

Tests cover configuration and unsafe-host rejection, approval policy, destructive default denial, Bearer credential injection, pagination query forwarding, read execution, write denial, strong deletion confirmation, bounded GET retry, non-retry of mutating failures, and Bitlink identifier validation.

## Examples

See `examples/workflows.md` for link inspection, click analytics, cursor pagination, creation, redirection, and deletion examples with permission/approval requirements.

## Limitations

- This connector deliberately implements a useful subset of Bitly rather than every API or official MCP capability.
- The official remote Bitly MCP server is researched and documented but is not proxied by this package; REST is selected for this connector's strict local security boundary.
- QR codes, campaigns, channels, webhooks, custom Bitlinks, bulk import/export, and Bitly Sites are not exposed here.
- `DELETE /v4/bitlinks/{bitlink}` is subject to Bitly's provider-side eligibility rule for an unedited-hash Bitlink.
- Some API capabilities and rate allowances depend on the Bitly subscription plan and authenticated account permissions.
