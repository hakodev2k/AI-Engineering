# Redis Cloud MCP/API Connector

Reusable MCP connector for Redis Cloud administration. Redis publishes an official Redis Cloud MCP server (`redis/mcp-redis-cloud`) for subscription/database administration and an official Redis Cloud REST API. This connector uses the official REST API behind a small, stable MCP tool contract so permission and human-approval boundaries are enforced locally. It does not replace the separate official Redis MCP server used to read/write data inside a Redis database.

## Official sources researched
- Redis MCP install / Redis Cloud MCP: https://redis.io/docs/latest/integrate/redis-mcp/install/
- Redis MCP overview: https://redis.io/docs/latest/integrate/redis-mcp/
- Redis Cloud REST API getting started: https://redis.io/docs/latest/operate/rc/api/get-started/
- REST authentication: https://redis.io/docs/latest/operate/rc/api/get-started/enable-the-api/
- REST usage/rate limit: https://redis.io/docs/latest/operate/rc/api/get-started/use-rest-api/
- Redis Cloud MCP source: https://github.com/redis/mcp-redis-cloud

Redis documents the Cloud MCP server as an administrative server for Redis Cloud, including subscription/database management; database data access belongs to the separate Redis MCP server. The REST API endpoint is `https://api.redislabs.com/v1`. Redis Cloud API access is disabled by default and must be enabled by an account owner. Calls require both the account key in `x-api-key` and user key in `x-api-secret-key`. Redis documents a limit of 400 requests per minute per Account API key.

## Architecture / transport
Node.js 20+ and TypeScript. External callers use MCP over stdio. `src/server.ts` defines eight provider-scoped tools; `src/security.ts` enforces approval policy; `src/client.ts` performs authenticated REST calls. Agent callers never receive either API key. The upstream official MCP remains a valid alternative when its native tool surface and security policy meet the deployment's needs; this package intentionally uses REST for deterministic local policy enforcement.

## Install and run
```bash
npm install
npm run build
npm test
REDIS_CLOUD_ACCOUNT_KEY=... REDIS_CLOUD_USER_KEY=... npm start
```
Configure a standard stdio MCP client to execute `node /absolute/path/dist/src/server.js`.

## Environment
`REDIS_CLOUD_ACCOUNT_KEY` and `REDIS_CLOUD_USER_KEY` are required. `REDIS_CLOUD_API_BASE_URL` defaults to the official v1 endpoint and must use HTTPS. `REDIS_CLOUD_TIMEOUT_MS` defaults to 15000. `REDIS_CLOUD_REQUIRE_WRITE_APPROVAL` is documented for deployment policy and defaults true; all implemented provisioning/update operations are conservatively HIGH_RISK and always require explicit per-call approval. `REDIS_CLOUD_ALLOW_DESTRUCTIVE` defaults false.

## Tools
| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `redis-cloud.subscription.list` | List subscriptions | READ | No |
| `redis-cloud.subscription.get` | Read subscription | READ | No |
| `redis-cloud.database.list` | List databases | READ | No |
| `redis-cloud.database.get` | Read database | READ | No |
| `redis-cloud.task.get` | Poll async task | READ | No |
| `redis-cloud.database.create` | Provision database | HIGH_RISK | Explicit |
| `redis-cloud.database.update` | Change bounded database capacity/name | HIGH_RISK | Explicit |
| `redis-cloud.database.delete` | Delete database | DESTRUCTIVE | Explicit + disabled by default |

Creation is intentionally bounded to name, memory, throughput measurement, and replication rather than exposing an arbitrary REST body. Update is restricted to name and memory. Unsupported provider options should be configured through Redis Cloud directly or added later as explicit validated fields after checking the current API schema.

## Permissions and approval
Redis Cloud API keys are powerful account credentials. Use user keys belonging to the least-privileged account role suitable for the intended operations and restrict allowed source IPs where supported. READ tools may run automatically. Provisioning/update can change capacity or billing and therefore require `approved: true`. Deletion additionally requires operator-controlled `REDIS_CLOUD_ALLOW_DESTRUCTIVE=true`; an agent cannot turn this on through MCP.

## Reliability / rate limits
Every request has a timeout. Safe GET requests retry at most once for HTTP 429/5xx with a bounded delay honoring `Retry-After` up to five seconds. Writes are never automatically retried because Redis Cloud operations can be asynchronous and replay could duplicate or conflict with changes. Authentication/authorization/validation errors are not retried. Provider errors preserve status and retry metadata. List operations rely on the official endpoint response rather than generating hidden fan-out calls.

## Security
Credentials live only in process environment/configuration and HTTP headers. They are not MCP inputs or outputs and should never be inserted into prompts. The API base URL is operator configuration, not agent-controlled, and HTTPS is required, reducing SSRF and credential-exfiltration risk. IDs and database names are validated. Provider responses are labeled `UNTRUSTED_PROVIDER_DATA`; their contents are data, never instructions that may alter permissions or tool behavior. No arbitrary HTTP proxy exists.

When using the official Redis Cloud MCP directly, pin/trust Redis's implementation, inspect its enabled tools, keep credentials in client secret configuration, and do not automatically grant newly introduced upstream tools elevated permissions.

## Testing
`npm test` uses mocks and requires no live credentials. Tests cover approval denial, destructive-default denial, input validation, credential isolation, permission-error behavior, and the no-retry rule for writes.

## Limitations
This package deliberately implements eight high-value Cloud administration capabilities rather than the full API. It does not manipulate Redis keys/data, subscriptions/billing, access keys, roles, networking, Active-Active topology, backups, or maintenance configuration. It does not implement the upstream MCP protocol as a proxy; instead it exposes its own MCP server backed by the official REST API. Database creation fields vary by Redis Cloud plan/subscription type, so callers must supply values supported by the selected subscription and handle provider validation errors.
