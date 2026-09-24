# Dapr MCP/API Connector

Reusable MCP stdio server that exposes a deliberately bounded subset of the official Dapr HTTP building-block APIs. It targets a Dapr sidecar through loopback only and keeps the optional Dapr API token inside the connector.

## Upstream strategy

Dapr does not provide an official MCP server that replaces its building-block API. Dapr does provide `MCPServer` resources for consuming remote MCP servers. This connector therefore uses Dapr's official HTTP API directly rather than discovering or trusting arbitrary upstream MCP tools.

Official sources: Dapr API reference (`https://docs.dapr.io/reference/api/`), API token authentication (`https://docs.dapr.io/operations/security/api-token/`), API allowlist (`https://docs.dapr.io/operations/configuration/api-allowlist/`), alpha/beta API lifecycle (`https://docs.dapr.io/operations/support/alpha-beta-apis/`).

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `dapr.metadata.get` | HTTP API | READ | no |
| `dapr.health.get` | HTTP API | READ | no |
| `dapr.state.get` | HTTP API | READ | no |
| `dapr.state.save` | HTTP API | WRITE | configurable/per-call |
| `dapr.state.delete` | HTTP API | HIGH_RISK | explicit |
| `dapr.secret.get` | HTTP API | READ | no |
| `dapr.pubsub.publish` | HTTP API | WRITE | configurable/per-call |
| `dapr.service.invoke` | HTTP API | HIGH_RISK | explicit + admin enable |
| `dapr.lock.acquire` | HTTP alpha API | WRITE | configurable/per-call |
| `dapr.lock.release` | HTTP alpha API | WRITE | configurable/per-call |

The distributed lock API is explicitly alpha in current Dapr documentation. The connector does not expose shutdown, cryptography, arbitrary bindings, arbitrary raw requests, workflow mutation, or actor mutation.

## Architecture and security

`server.ts` exposes MCP tools over stdio; `tools.ts` owns strict Zod schemas, risk policy, and fixed endpoint routing; `client.ts` owns credentials, timeout, bounded retry, rate-limit handling, and HTTP error mapping. The LLM never receives `DAPR_API_TOKEN`.

The HTTP endpoint is restricted to `localhost`, `127.0.0.1`, or `::1` to prevent SSRF and accidental exposure of a remote sidecar. For remote Dapr deployments, terminate authentication/network policy in a trusted local proxy. Dapr itself recommends API allowlisting to reduce attack surface. Treat every provider/application response as untrusted data.

Dapr API token authentication is optional at runtime. When enabled on the sidecar, set `DAPR_API_TOKEN`; the connector sends it only in the `dapr-api-token` header. Dapr uses a shared token rather than OAuth scopes. Least privilege is therefore enforced through Dapr's API allowlist plus this connector's fixed tool allowlist.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
DAPR_HTTP_ENDPOINT=http://127.0.0.1:3500 npm start
```

Environment variables are documented in `.env.example`. Writes are denied unless either `DAPR_ALLOW_WRITES=true` or the individual call contains `approved:true`. High-risk calls require both `DAPR_ALLOW_HIGH_RISK=true` and `approved:true`. Destructive-class tools are not exposed.

Any MCP client capable of launching a stdio server can use the built artifact. Configure the command as `node /absolute/path/dist/src/server.js` and provide environment variables through the client's secure environment mechanism.

## Reliability and rate limits

Requests have an abort timeout (`DAPR_TIMEOUT_MS`, default 10s). Safe GET/HEAD operations retry boundedly (`DAPR_MAX_RETRIES`, default 2) for network errors, HTTP 429, and 5xx with exponential backoff; `Retry-After` is honored when present. Mutating requests are never automatically retried because doing so could duplicate side effects. Dapr's core API does not define one universal provider-wide request quota; effective throttling can depend on components, resiliency policies, and downstream services, so 429 is handled generically.

State, secret, and service identifiers are validated and URL components are encoded. Pagination is not applicable to the selected direct key/resource operations. The connector intentionally does not implement the alpha Query State API.

## Errors

HTTP failures are mapped to `DaprError` with status and optional retry-after. MCP handlers return structured `{ok:false,error}` text payloads and set `isError`. Authentication failures are not retried. Validation and approval failures occur before network access.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch`; no live Dapr or credentials are required. Coverage includes tool registration, SSRF boundary, validation, credential isolation, approval denial, high-risk approval, read behavior, no-retry writes, and throttled-read retry.

## Limitations

This package wraps the official HTTP API; it does not proxy Dapr gRPC. It does not implement OAuth because Dapr's sidecar API authentication mechanism is the optional shared API token. It does not expose arbitrary service URLs or arbitrary Dapr endpoints. `service.invoke` remains HIGH_RISK even for GET because the connector cannot prove the target application's semantics. Distributed locks use Dapr's alpha API and can change between Dapr releases.
