# Akamai MCP/API Connector

Reusable MCP server for selected Akamai CDN operations using Akamai's official REST APIs and official `akamai-edgegrid` authentication library.

## Transport strategy

Akamai currently documents an MCP server for TrafficPeak analytics, but the Property Manager API (PAPI) and Fast Purge API capabilities implemented here are exposed through official REST APIs. This connector therefore uses direct REST for these workflows rather than routing them through an unrelated MCP surface.

Official references:

- EdgeGrid authentication: https://techdocs.akamai.com/developer/docs/edgegrid
- Official Node EdgeGrid library: https://github.com/akamai/AkamaiOPEN-edgegrid-node
- Property Manager API: https://techdocs.akamai.com/property-mgr/reference/api
- Property Manager rate/resource limits: https://techdocs.akamai.com/property-mgr/reference/rate-and-resource-limiting
- Fast Purge API: https://techdocs.akamai.com/purge-cache/reference/api
- Fast Purge rate limits: https://techdocs.akamai.com/purge-cache/reference/rate-limiting
- Akamai TrafficPeak MCP: https://techdocs.akamai.com/trafficpeak/docs/mcp-server

## Supported capabilities

The MCP surface exposes ten provider-scoped tools:

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `akamai.property.list` | PAPI REST | READ | no |
| `akamai.property.get` | PAPI REST | READ | no |
| `akamai.property.hostnames.list` | PAPI REST | READ | no |
| `akamai.activation.list` | PAPI REST | READ | no |
| `akamai.activation.get` | PAPI REST | READ | no |
| `akamai.activation.create` | PAPI REST | HIGH_RISK | yes |
| `akamai.purge.rate_limit.get` | Fast Purge REST | READ | no |
| `akamai.purge.url.invalidate` | Fast Purge REST | WRITE | yes |
| `akamai.purge.cpcode.invalidate` | Fast Purge REST | WRITE | yes |
| `akamai.purge.tag.invalidate` | Fast Purge REST | WRITE | yes |

Deletion-based purge endpoints are intentionally not exposed. Akamai recommends invalidation in most cases because deletion can increase origin load and removes the ability to serve stale cached content if the origin is unavailable.

## Architecture

```text
MCP client
  -> stdio MCP server
     -> strict Zod validation
        -> risk/approval policy
           -> Akamai EdgeGrid auth client
              -> PAPI / Fast Purge REST APIs
```

Provider responses are returned as untrusted data. Retrieved strings never alter connector permissions, environment configuration, tool registration, or approval requirements.

## Authentication and least privilege

Create an API client in Akamai Control Center and provision only the API services needed for your intended tools. The connector uses EdgeGrid credentials and keeps them inside the connector process.

Required environment variables:

```text
AKAMAI_CLIENT_TOKEN=
AKAMAI_CLIENT_SECRET=
AKAMAI_ACCESS_TOKEN=
AKAMAI_HOST=
```

Optional:

```text
AKAMAI_ACCOUNT_SWITCH_KEY=
AKAMAI_TIMEOUT_MS=15000
AKAMAI_MAX_RETRIES=2
AKAMAI_ALLOW_WRITE=false
AKAMAI_ALLOW_HIGH_RISK=false
AKAMAI_ALLOW_DESTRUCTIVE=false
```

Recommended API client access:

- Property Manager `READ` for property and activation inspection.
- Property Manager `READ-WRITE` only when `akamai.activation.create` is needed.
- Purge Cache `READ-WRITE` only when Fast Purge tools are needed.

Do not place EdgeGrid credentials in prompts, MCP tool arguments, examples, logs, or source control.

## Installation

```bash
npm install
npm run build
```

Node.js 20 or newer is required by the official Akamai EdgeGrid Node library.

## Running

```bash
npm start
```

The server uses MCP stdio transport, so any MCP client capable of launching a local stdio server can connect by invoking the built server process with the required environment variables.

## Approval model

READ tools may run automatically when the configured Akamai API client has sufficient access.

WRITE tools require both:

1. `AKAMAI_ALLOW_WRITE=true`
2. `approved: true` in the validated tool call after human authorization

Property activation is HIGH_RISK because it can change live edge behavior. It requires both:

1. `AKAMAI_ALLOW_HIGH_RISK=true`
2. `approved: true`

`AKAMAI_ALLOW_DESTRUCTIVE` exists as a shared safety control, but this connector intentionally exposes no destructive tool.

## Reliability and rate limits

Read operations use bounded retries with exponential backoff and jitter for transient network failures, HTTP 429, 502, 503, and 504. Authentication, validation, permission failures, and write operations are not blindly retried.

The connector preserves numeric `Retry-After` values when Akamai returns them and caps local waiting. Requests have a configurable timeout.

Important provider limits include:

- PAPI default sustainable request rate: 100 requests per minute per account, with additional resource and activation limits exposed through Akamai headers.
- Fast Purge request bucket: 100 requests, refilling at 50 requests/second.
- Fast Purge object buckets include up to 10,000 URL/ARL objects, 300 CP codes, and 5,000 cache tags per applicable request/bucket constraints.
- This connector validates CP-code and cache-tag batch maxima and bounds URL input size before sending provider requests.

Avoid frequent activation polling. Akamai recommends progressively increasing delays while checking pending activation status.

## Error handling

Provider/network errors are normalized into MCP error responses containing a safe message plus status and retry-after metadata when available. Raw credentials are never included in error payloads.

Typical provider errors:

- `400` invalid parameters
- `401` EdgeGrid authentication failure
- `403` missing API service or Control Center permission
- `404` resource not found
- `409` conflicting activation in progress
- `422` configuration/validation issue
- `429` account or API rate limit exceeded
- `5xx` provider/transient failure

## Security considerations

- Credentials stay inside the EdgeGrid authentication layer.
- No arbitrary URL or generic `execute_any_api_request` tool is exposed, reducing SSRF and permission-escalation risk.
- Resource IDs are strictly validated before interpolation into provider paths.
- Purge object arrays have bounded sizes.
- All external provider content is treated as untrusted data, never as agent instructions.
- Newly introduced upstream capabilities are not auto-discovered or auto-enabled.
- Production activation always remains an explicit HIGH_RISK operation.
- Purge deletion APIs are intentionally omitted.

## Testing

Run:

```bash
npm test
```

Tests use a fake provider client and require no live credentials. They cover tool registration, input validation, read routing, write denial, explicit approval, HIGH_RISK activation gating, and purge object limits.

## Examples

See `examples/workflows.json` for representative MCP calls and expected output shapes.

## Limitations

- This package does not proxy Akamai's TrafficPeak MCP server because its tools are outside this connector's selected CDN workflow scope.
- It does not manage property rule trees, certificates, DNS zones, WAF policies, billing, IAM, or destructive Fast Purge deletion operations.
- PAPI access varies by Akamai contract, group, account-switch context, products, and API client grants; the connector cannot elevate those permissions.
- Activations are asynchronous. Use `akamai.activation.get` to inspect status rather than assuming a successful POST means rollout is complete.
