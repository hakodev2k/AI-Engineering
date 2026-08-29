# Airbyte MCP/API Connector

Reusable MCP server for safely inspecting and operating Airbyte data-replication workloads.

## Upstream strategy
Airbyte launched an official public **Knowledge MCP Server** at `https://airbyte.mcp.kapa.ai`. It exposes Airbyte knowledge (documentation, OpenAPI specs, GitHub material, YouTube, website/community content) for question answering; it is not documented as an operational control plane for running replication jobs. Operational tools in this connector therefore use Airbyte's official Public REST API at `https://api.airbyte.com/v1`.

Official sources researched for this implementation:
- Knowledge MCP: https://airbyte.com/blog/knowledge-mcp-server
- Public API getting started: https://reference.airbyte.com/reference/getting-started
- Authentication: https://reference.airbyte.com/reference/authentication
- Access token: https://reference.airbyte.com/reference/createaccesstoken
- Workspaces: https://reference.airbyte.com/reference/listworkspaces
- Sources: https://reference.airbyte.com/reference/listsources and https://reference.airbyte.com/reference/getsource
- Destinations: https://reference.airbyte.com/reference/getdestination
- Connections: https://reference.airbyte.com/reference/listconnections and https://reference.airbyte.com/reference/getconnection
- Streams: https://reference.airbyte.com/reference/getstreamproperties
- Jobs: https://reference.airbyte.com/reference/listjobs, https://reference.airbyte.com/reference/getjob, https://reference.airbyte.com/reference/createjob, https://reference.airbyte.com/reference/canceljob

## Authentication
Airbyte Cloud applications provide a `client_id` and `client_secret`. The connector exchanges them at `/v1/applications/token` using the client-credentials grant and sends the returned short-lived Bearer token to the Public API. Airbyte documents Cloud access tokens as valid for about three minutes, so the client caches only briefly and refreshes on a 401 once. For local self-managed instances with auth explicitly disabled, set `AIRBYTE_AUTH_MODE=none`.

Applications inherit the permissions of the Airbyte user that created them. For least privilege, create the application under a dedicated user restricted to the workspaces this connector needs.

Raw credentials never appear in MCP tool schemas or outputs.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `airbyte.workspace.list` | REST | READ | no |
| `airbyte.source.list` | REST | READ | no |
| `airbyte.source.get` | REST | READ | no |
| `airbyte.destination.list` | REST | READ | no |
| `airbyte.destination.get` | REST | READ | no |
| `airbyte.connection.list` | REST | READ | no |
| `airbyte.connection.get` | REST | READ | no |
| `airbyte.stream.list` | REST | READ | no |
| `airbyte.job.list` | REST | READ | no |
| `airbyte.job.get` | REST | READ | no |
| `airbyte.job.sync` | REST | WRITE | yes |
| `airbyte.job.reset` | REST | HIGH_RISK | yes |
| `airbyte.job.cancel` | REST | HIGH_RISK | yes |

The connector intentionally does **not** expose source/destination creation or credential mutation because those APIs commonly require third-party database/API secrets in request bodies; accepting such values through an LLM tool would violate credential isolation. Connection deletion is also intentionally omitted.

## Architecture
```text
MCP client
  -> stdio MCP server
     -> strict provider-scoped tool schema + validation
        -> risk/approval policy
           -> credential-isolated Airbyte client
              -> OAuth client-credentials token
                 -> Airbyte Public REST API
```

## Environment
`AIRBYTE_API_URL` defaults to `https://api.airbyte.com/v1`. `AIRBYTE_TOKEN_URL` defaults to `https://api.airbyte.com/v1/applications/token`. `AIRBYTE_CLIENT_ID` and `AIRBYTE_CLIENT_SECRET` are required in client-credentials mode. `AIRBYTE_AUTH_MODE` is `client_credentials` or `none`; `none` is intended only for explicitly unauthenticated self-managed installations. `AIRBYTE_TIMEOUT_MS` defaults to 15000, `AIRBYTE_MAX_RETRIES` to 3 (maximum 5), and `AIRBYTE_APPROVAL_SECRET` gates mutating actions.

Non-local API endpoints must use HTTPS. HTTP is accepted only for localhost/loopback self-managed development.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run check
npm test
npm start
```
The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers.

## Approval behavior
READ tools execute without approval. `job.sync`, `job.reset`, and `job.cancel` require a 64-character HMAC-SHA256 approval token generated over the exact tool name and canonical payload, excluding `approval_token`. Approval therefore cannot be silently reused for a different connection, job, or action. The approval secret is an environment value and cannot be changed through MCP.

## Reliability and rate limits
Airbyte's public reference does not document one universal account-wide requests-per-second quota, so the connector does not invent a quota. Safe reads use bounded exponential backoff for 429/502/503/504 and honor integer `Retry-After` values. Mutating job operations are never blindly retried. A local timeout and MCP cancellation signal bound requests. List pagination is constrained to Airbyte's documented 1–100 limit and a bounded offset.

Authentication failures are not treated as generic retryable failures. A 401 causes one token refresh because Cloud access tokens are short-lived; subsequent authorization failures surface to the caller.

## Security
Provider responses are marked `untrusted_provider_data`; third-party content must never be treated as instructions. Common secret/token/password/credential-shaped response fields are redacted recursively. No generic `request(url, body)` MCP tool exists, preventing SSRF and arbitrary endpoint access. Tool IDs must be UUIDs where Airbyte documents UUID resources. Mutation tools require explicit payload-bound approval. Source and destination credential APIs, OAuth override APIs, permission changes, deletion, and arbitrary configuration mutation are not exposed.

## Testing
Unit tests require no live Airbyte credentials. They cover registry/policy consistency, auth configuration, HTTPS restrictions, UUID/pagination validation, approval binding, secret redaction, client-credentials Bearer authentication, bounded retries, no blind mutation retry, and short-lived-token refresh after 401.

## Limitations
This package does not proxy Airbyte's Knowledge MCP because that server serves documentation/knowledge rather than the operational capabilities implemented here. It does not create or update sources/destinations because those operations can contain third-party credentials. It does not create/update/delete connections; the operational write surface is deliberately limited to already-configured replication jobs. Self-managed endpoint paths vary by deployment; configure both API and token URLs explicitly when they differ from Airbyte Cloud.
