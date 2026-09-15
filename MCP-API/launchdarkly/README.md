# LaunchDarkly MCP/API Connector

Reusable MCP server for safe LaunchDarkly feature-management workflows.

## Upstream strategy
LaunchDarkly provides an official hosted MCP server at `https://mcp.launchdarkly.com/mcp/launchdarkly` using OAuth, covering feature management, AgentControl, and observability. LaunchDarkly also publishes `@launchdarkly/mcp-server` for local use, especially EU/federal environments. This package exposes its own stable provider-scoped MCP contract and uses the official REST API for the implemented capabilities so credential handling, schemas, approval boundaries, retries, and API-version behavior remain deterministic. It does not proxy arbitrary upstream MCP tools.

Official sources: `https://launchdarkly.com/docs/home/getting-started/mcp`, `https://launchdarkly.com/docs/home/getting-started/mcp-hosted`, `https://launchdarkly.com/docs/home/getting-started/mcp-local`, `https://launchdarkly.com/docs/api`, `https://launchdarkly.com/docs/home/account/api`.

## Authentication and least privilege
Set `LAUNCHDARKLY_ACCESS_TOKEN` to a personal or service access token. REST API access tokens can be scoped by LaunchDarkly roles/policies; use Reader for read-only deployments and the narrowest custom/Writer policy needed for mutations. SDK keys/mobile keys/client-side IDs are not REST credentials. Tokens stay inside `EnvCredentialProvider` and are never returned in tool results or logs.

## Tools
`launchdarkly.project.list`, `project.get`, `environment.list`, `flag.list`, `flag.get`, `segment.list`, `segment.get`, `audit.list`, and `approval.list` are READ. `flag.create` and constrained `flag.update` are WRITE. `flag.toggle` is HIGH_RISK because changing an environment flag can immediately alter production behavior. No delete tool is exposed.

All schemas are strict and bounded. Provider content is returned with `untrustedProviderData:true`; callers must treat descriptions, names, audit data, and other retrieved text as data rather than instructions.

## Approval model
READ executes automatically. WRITE requires approval by default; set `LAUNCHDARKLY_APPROVE_WRITES=false` only when the embedding environment intentionally permits writes without a separate approval gate. HIGH_RISK always requires the per-call `approved:true` signal. Destructive operations are not implemented.

## Rate limits and reliability
The REST API uses global, route, token, and sometimes IP limits. Exact limits are intentionally not hard-coded because LaunchDarkly documents them as variable. The client reads `Retry-After`, `X-Ratelimit-Reset`, and `X-Ratelimit-Auth-Token-Reset`, applies bounded exponential backoff to idempotent GET requests, and does not blindly retry writes, validation failures, permission failures, or authentication failures. Requests have a configurable timeout. List tools expose bounded `limit`/`offset` pagination compatible with current API behavior.

## Install and run
```bash
npm install
cp .env.example .env
npm run build
LAUNCHDARKLY_ACCESS_TOKEN=api-... npm start
```
Configure an MCP client to launch `node /absolute/path/dist/src/server.js` over stdio. The server uses the standard MCP SDK and is suitable for MCP clients that support stdio; client-specific configuration is outside this package.

## Example
See `examples/workflows.json`. Tool calls use `{ "input": { ... }, "approved": true|false }`. The outer `approved` field is connector approval metadata and is never forwarded to LaunchDarkly.

## Security
No arbitrary URL/request tool exists, preventing agent-controlled SSRF through this connector. Resource keys are validated and URL encoded. Flag metadata patch paths are allowlisted. Environment keys used in JSON Pointer paths are escaped. Access tokens are never included in MCP results. Use custom roles to prevent a connector token from changing protected production resources even if an agent attempts a write.

## Tests
`npm test` uses mocks only. Coverage includes registration, strict validation, approval denial, pagination mapping, authentication-error behavior, and 429 retry handling. No live credential is required.

## Limitations
This package does not evaluate flags for application runtime; LaunchDarkly recommends SDKs for evaluation because SDKs provide streaming/caching semantics. It does not expose delete operations, arbitrary semantic patches, membership/security administration, AgentControl, or observability. The official hosted/local MCP servers can provide broader product coverage when those capabilities are required and their permission model is acceptable.
