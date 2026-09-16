# LaunchDarkly MCP/API Connector

Reusable MCP server exposing a focused LaunchDarkly feature-management surface with strict validation, credential isolation, bounded retries, pagination, and approval gates.

## Upstream strategy

LaunchDarkly provides an official hosted MCP server at `https://mcp.launchdarkly.com/mcp/launchdarkly`, authenticated with OAuth. It covers feature management, AgentControl, observability, and metrics. LaunchDarkly also publishes the official local package `@launchdarkly/mcp-server`; it is intended especially for Federal/EU environments where hosted MCP is unavailable and uses an API access token. The official hosted server is preferred when a client can connect directly.

This reusable connector uses LaunchDarkly's official REST API v2 for its stable scoped tool contract. This keeps credentials in the connector boundary, allows local approval enforcement, and works where the hosted MCP transport cannot be embedded. No unofficial MCP server is used. The connector deliberately exposes only capabilities verified in the official feature-management API.

Official sources researched: LaunchDarkly MCP server documentation, hosted MCP documentation, local MCP documentation, REST API overview/reference, API access-token documentation, and REST API migration/versioning guidance.

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `launchdarkly.project.list` | REST | READ | No |
| `launchdarkly.project.get` | REST | READ | No |
| `launchdarkly.environment.list` | REST | READ | No |
| `launchdarkly.flag.list` | REST | READ | No |
| `launchdarkly.flag.get` | REST | READ | No |
| `launchdarkly.flag.create` | REST | WRITE | Yes by default |
| `launchdarkly.flag.update` | REST | WRITE | Yes by default |
| `launchdarkly.segment.list` | REST | READ | No |
| `launchdarkly.segment.get` | REST | READ | No |

No generic arbitrary-request, delete, token-management, role-management, billing, or production execution tool is exposed. Destructive operations are disabled.

## Authentication and least privilege

REST requests use a LaunchDarkly personal or service access token in `LAUNCHDARKLY_API_TOKEN`. SDK keys, mobile keys, and client-side IDs cannot authenticate REST API calls. For long-lived integrations, prefer a service token where available and grant only the project/environment actions needed by these tools. LaunchDarkly recommends least privilege and supports base roles, custom roles, and inline policies depending on plan.

Hosted MCP uses OAuth and applies the authorized user's LaunchDarkly permissions. Local official MCP uses an API access token and can be restricted with `--scope read` and explicit `--tool` allowlisting. Never put tokens in prompts or tool arguments.

## API version, rate limits, reliability

The connector explicitly sends `LD-API-Version: 20240415`. LaunchDarkly documents that API rate limits vary by route/authentication and are communicated through rate-limit headers; specific numeric limits are intentionally not hard-coded. HTTP 429 and transient 5xx responses are retried only for GET requests with bounded exponential backoff and `Retry-After` support. Writes are not blindly retried. Requests use an AbortController timeout. List tools expose bounded pagination.

## Security

Credentials are read only from connector environment configuration. The base URL is constant, resource keys are validated and URI encoded, and no caller-controlled URL is accepted, reducing SSRF risk. Provider-returned text is wrapped as `untrustedProviderData: true`; it cannot modify permissions, approval policy, or system behavior. WRITE operations require explicit `approved: true` by default. A hosting application should ensure that this boolean is supplied only after a trusted human approval event; an LLM must not self-approve.

The connector does not automatically discover or trust new upstream MCP tools. If using the official MCP server directly, configure the smallest allowed scope/tool set. Unexpected upstream permissions should fail closed.

## Installation and running

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# load secrets using your shell or secret manager
npm start
```

The server uses MCP stdio, so it can be launched by MCP clients supporting local stdio servers, including compatible agent hosts. Compatibility depends on the client's MCP stdio support; no client-specific behavior is assumed.

## Environment variables

`LAUNCHDARKLY_API_TOKEN` is required. `LAUNCHDARKLY_API_VERSION` defaults to `20240415`; timeout defaults to 15 seconds; retries default to 2; approval mode defaults to `write`.

## Error handling

Provider failures are converted to MCP error results with sanitized message, HTTP status, and Retry-After metadata when present. Validation and approval failures occur before provider calls. Authentication/permission errors are never retried. Credentials are never returned or logged.

## Testing

`npm test` uses mocks only and requires no live LaunchDarkly credentials. Tests cover auth configuration, tool registration, approval denial, successful approved write, 429 retry behavior, credential isolation, and unsafe-key validation.

## Limitations

This connector intentionally focuses on feature-management discovery/read and controlled flag mutation. It does not expose AgentControl, observability, metrics, flag deletion, environment deletion, access-token administration, custom-role administration, or webhooks. Use the official hosted/local MCP server directly for broader supported MCP capabilities after reviewing its permissions. REST API authorization remains subject to the permissions attached to the configured LaunchDarkly token.
