# LaunchDarkly MCP/API Connector

Reusable MCP stdio bridge for LaunchDarkly feature-management workflows. LaunchDarkly also provides an official hosted MCP server at `https://mcp.launchdarkly.com/mcp/launchdarkly` using OAuth, plus an official local MCP server. Hosted MCP supports feature management, AgentControl, and observability; it is unavailable in federal/EU instances, where LaunchDarkly documents the local server. This package deliberately uses LaunchDarkly's official REST API for its stable provider-scoped tools so API tokens stay in the connector and callers receive one deterministic contract.

## Official sources

- MCP: `https://launchdarkly.com/docs/home/getting-started/mcp`
- Hosted MCP: `https://launchdarkly.com/docs/home/getting-started/mcp-hosted`
- Local MCP: `https://launchdarkly.com/docs/home/getting-started/mcp-local`
- REST API/auth/rate limits/versioning: `https://launchdarkly.com/docs/api`
- Access-token permissions: `https://launchdarkly.com/docs/home/account/api`

## Install and run

Requires Node.js 20+.

```sh
npm install
npm run build
LAUNCHDARKLY_ACCESS_TOKEN=... npm start
```

Configure any MCP client that supports a stdio server to run `node dist/server.js`. The connector does not expose credentials to tool arguments or outputs.

## Authentication and permissions

REST requests use a LaunchDarkly personal or service access token in the `Authorization` header and explicitly send `LD-API-Version` (default `20240415`). SDK/mobile/client-side keys are not REST credentials. Create the narrowest LaunchDarkly role/inline policy that covers the projects/environments and operations required. Prefer Reader for read-only deployments; Writer/custom policies only where mutations are needed. Service tokens are suitable for long-lived integrations. Hosted MCP instead uses LaunchDarkly OAuth and inherits the authorized user's permissions.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `launchdarkly.project.list` | READ | no |
| `launchdarkly.project.get` | READ | no |
| `launchdarkly.environment.list` | READ | no |
| `launchdarkly.flag.list` | READ | no |
| `launchdarkly.flag.get` | READ | no |
| `launchdarkly.flag.status` | READ | no |
| `launchdarkly.flag.create` | WRITE | yes by default |
| `launchdarkly.flag.update` | HIGH_RISK | always |
| `launchdarkly.flag.archive` | HIGH_RISK | always |

Update accepts bounded JSON Patch operations and blocks permission-like paths. Archive is implemented as the documented flag archived-state patch rather than deletion. No destructive tool is exposed.

## Reliability and errors

Requests have configurable timeouts and cancellation through `AbortController`. Pagination is bounded to 100 items. HTTP 429 and transient 5xx responses receive at most two retries with jitter/backoff; `Retry-After` and LaunchDarkly reset headers are honored when present. Authentication, permission and validation failures are never retried. Errors are mapped to `AUTH`, `PERMISSION`, `RATE_LIMIT`, `TIMEOUT`, or `PROVIDER` without leaking the token.

LaunchDarkly uses global, route, token, and IP rate limits. Exact quotas are intentionally not hard-coded because LaunchDarkly documents them as variable; the connector reacts to returned headers.

## Security

Provider responses are treated as untrusted data. Credentials are connector-side only. Paths are fixed under LaunchDarkly's API origin, preventing caller-controlled SSRF. Keys, pagination, patch count/path, and text sizes are validated. Writes require approval; high-risk flag changes always require explicit approval. Retrieved provider text never changes permissions, tool registration, or runtime configuration. Logs do not contain credentials.

## Tests

```sh
npm test
```

Unit tests use fake fetch responses and no live credentials. They cover auth configuration, registration, validation, read behavior, approval denial, pagination bounds, provider auth errors, and rate-limit retry.

## Limitations

This connector intentionally covers feature-management operations only. AgentControl and observability remain available through LaunchDarkly's official MCP but are not proxied here. Webhooks, access-token administration, role changes, billing, deletion, and arbitrary REST calls are not exposed. API permissions and availability still depend on the LaunchDarkly account plan and token role.
