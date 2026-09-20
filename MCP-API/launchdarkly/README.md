# LaunchDarkly MCP/API Connector

Reusable MCP server for controlled LaunchDarkly feature-management workflows.

## Transport strategy
LaunchDarkly has an official hosted MCP server at `https://mcp.launchdarkly.com/mcp/launchdarkly` using OAuth, plus the official `@launchdarkly/mcp-server` for local/federal/EU use. Those servers cover feature management, AgentControl and observability. This connector intentionally exposes a stable, permission-gated MCP surface backed by LaunchDarkly's official REST API so deployments can enforce local approval boundaries and use scoped service/personal access tokens. It does not proxy arbitrary API calls or dynamically trust upstream tools.

Official documentation researched: LaunchDarkly MCP server, hosted MCP server, local MCP server, REST API overview, API access tokens, and API versioning/migration documentation at `launchdarkly.com/docs`.

## Capabilities
13 tools are implemented: `launchdarkly.project.list`, `project.get`, `environment.list`, `flag.list`, `flag.get`, `flag.create`, `flag.update`, `flag.delete`, `segment.list`, `segment.get`, `segment.create`, `segment.update`, and `segment.delete`.

READ tools may run automatically. WRITE tools require `LAUNCHDARKLY_ALLOW_WRITE=true`. Updates are HIGH_RISK because flag/segment changes can alter application behavior and require `approval:true`. Deletes are DESTRUCTIVE and additionally require `LAUNCHDARKLY_ALLOW_DESTRUCTIVE=true` plus `approval:true`.

## Authentication and least privilege
Set `LAUNCHDARKLY_ACCESS_TOKEN` to a LaunchDarkly personal or service access token. REST access tokens can be scoped by base role, custom role, or inline policy; use the smallest policy that grants only the projects/environments and actions required. SDK keys, mobile keys, and client-side IDs are not REST credentials and are not accepted by this connector. Credentials stay in the connector process and are never returned in MCP output.

## Environment
Copy `.env.example` values into your secret manager/process environment. The API defaults to `https://app.launchdarkly.com/api/v2` and API version `20240415`. Override the base URL only for a trusted LaunchDarkly deployment; callers cannot supply URLs, preventing SSRF through tool parameters.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
LAUNCHDARKLY_ACCESS_TOKEN='from-secret-store' npm start
```

The server uses MCP stdio and therefore works with MCP clients capable of launching a local stdio server. Configure the client to execute `node /absolute/path/dist/server.js` with secrets supplied by the process environment/secret manager, not in prompts.

## REST behavior and reliability
Requests send `Authorization`, `LD-API-Version`, `Accept`, and JSON content headers. GET requests retry boundedly on HTTP 429/5xx and transient network errors with exponential backoff and jitter; `Retry-After` is honored. Mutating calls are never blindly retried. Requests time out using `AbortController`. Pagination is exposed as validated `limit`/`offset`; list calls do not automatically fan out across pages.

LaunchDarkly applies global, route, token, and sometimes IP-based limits. Exact quotas are not fixed publicly; clients should react to returned rate-limit headers and 429 responses instead of hard-coding quotas. This implementation preserves a 429 as an error after bounded retry.

## Errors
Provider HTTP errors are normalized as `LaunchDarklyError`; validation, approval, authentication configuration, network and timeout failures become MCP error results. 401/403 failures are not retried. Provider content is wrapped with `untrustedProviderData:true` and must be treated as data rather than instructions.

## Security
Use least-privilege tokens; keep tokens in a secret manager; do not log them; restrict environment inheritance; review every HIGH_RISK/DESTRUCTIVE call; and leave destructive mode off by default. Retrieved flag names, descriptions, rules and metadata are untrusted. Tool schemas reject unknown fields and restrict identifiers. No generic URL/request tool exists. The connector never discovers or enables new upstream MCP tools dynamically.

## Testing
`npm test` uses Node's test runner with mocks/fakes and requires no live credentials. Tests cover registration, strict validation, read routing, write denial and destructive approval boundaries. The client implementation additionally handles timeout, 429/5xx retry and provider errors.

## Limitations
This package focuses on projects, environments, feature flags and segments. AgentControl and observability are available from LaunchDarkly's official MCP server but are not re-exposed here. OAuth for the hosted MCP server is not implemented because this package uses the REST access-token model. Webhook management and account administration are intentionally omitted to keep the permission surface narrow. REST endpoint availability still depends on the LaunchDarkly plan and token policy.
