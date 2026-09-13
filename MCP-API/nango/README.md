# Nango MCP Connector

Reusable MCP server for safe Nango environment discovery, Connect session creation, and tightly controlled forwarding to already-configured upstream MCP integrations.

## Official sources and transport

The connector uses Nango's official REST API at `https://api.nango.dev`. Nango documents bearer authentication with the environment secret key, provider discovery (`GET /providers`, `GET /providers/{provider}`), configured integration listing (`GET /integrations`), Connect session creation (`POST /connect/sessions`), and MCP forwarding via `/mcp` using `Provider-Config-Key` and `Connection-Id`. Nango also publishes the official Node SDK `@nangohq/node`; this package intentionally uses standards-based `fetch` to keep timeout and retry behavior explicit.

Nango is not treated as one universal upstream MCP server with an unrestricted tool set. Its documented MCP integration path proxies an already-configured provider MCP connection. MCP forwarding is therefore limited here to initialize, tools/list, and an explicitly approved tools/call operation.

Official documentation:
- https://docs.nango.dev/reference/api/providers/list
- https://docs.nango.dev/reference/api/providers/get
- https://docs.nango.dev/reference/api/integration/list
- https://docs.nango.dev/reference/api/connect/sessions/create
- https://nango.dev/docs/api-integrations/granola-mcp
- https://nango.dev/docs/api-integrations/digits-mcp

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `nango.provider.list` | REST | READ | No |
| `nango.provider.get` | REST | READ | No |
| `nango.provider.search` | REST + local filter | READ | No |
| `nango.integration.list` | REST | READ | No |
| `nango.integration.search` | REST + local filter | READ | No |
| `nango.connect_session.create` | REST | WRITE | Configurable; required by default |
| `nango.mcp.initialize` | Nango MCP proxy | READ | No |
| `nango.mcp.tools.list` | Nango MCP proxy | READ | No |
| `nango.mcp.tool.call` | Nango MCP proxy | HIGH_RISK | Always |

The connector intentionally does not expose Nango's generic HTTP proxy endpoint as an arbitrary MCP tool. It also does not expose credential-export or environment-variable endpoints because those can return secrets.

## Authentication and least privilege

Set `NANGO_SECRET_KEY` to the secret key for the intended Nango environment. The key remains inside the connector and is never accepted as a tool parameter. Nango's platform API key is environment-scoped rather than an OAuth scope list; use a separate least-privilege Nango environment/key for each trust boundary.

`NANGO_BASE_URL` defaults to the official cloud API. HTTPS is mandatory and loopback/local hosts are rejected to reduce SSRF and misconfiguration risk. Self-hosted deployments may use an HTTPS DNS origin reachable by the connector runtime.

## Approval model

`READ` tools execute directly. `WRITE` tools require approval by default; set `NANGO_REQUIRE_WRITE_APPROVAL=false` only in a controlled runtime. `HIGH_RISK` always requires explicit approval. `DESTRUCTIVE` is disabled by default; this connector currently exposes no destructive tool.

Approvals use opaque IDs supplied through `NANGO_APPROVED_ACTION_IDS`. A matching ID is consumed once in-process. Production deployments should issue IDs only after a real human confirmation.

## Install and run

```bash
npm install
cp .env.example .env
npm run build
npm start
```

The server uses MCP stdio. Point an MCP client's local server command at `node dist/src/server.js` and inject secrets through the process environment rather than prompts or command-line arguments.

## Reliability and rate limiting

Requests have configurable timeouts. Safe GET requests retry boundedly on 429/502/503/504 with exponential backoff and honor numeric `Retry-After`. Mutating POST calls and MCP tool calls are not blindly retried, preventing accidental duplicate external actions. Authentication, permission, validation, and ordinary client errors are not retried. Provider error text is bounded and the Nango secret key is redacted.

Provider and integration searches perform one official list request and filter locally, avoiding request amplification. Nango's generic proxy has its own documented retry controls, but it is deliberately not surfaced by this connector.

## Security

Third-party provider data, integration metadata, and MCP tool descriptions/results are returned as `untrusted` data. They never alter approval policy. Tool names and identifiers are length/pattern validated. Credentials never enter MCP tool schemas. No credential-export or environment-variable retrieval endpoint is implemented. The connector does not auto-trust newly discovered upstream MCP tools: discovery is READ-only, while every upstream `tools/call` is classified HIGH_RISK and requires a one-use human approval ID.

Connect session responses contain a short-lived token. Treat it as sensitive: hand it only to the trusted Connect UI flow and do not log it or place it into model prompts.

## Testing

`npm test` uses fake fetch implementations and requires no live credentials. Tests cover auth configuration, unsafe base URL rejection, approval enforcement and one-use consumption, destructive-default denial, bearer/header construction, 429 retry, no retry on invalid credentials, and no blind retry of mutating requests.

`npm run build` performs strict TypeScript compilation. In restricted build environments where package installation is unavailable, install the declared dependencies before running build/tests.

## Limitations

This package does not create/delete Nango integrations, export stored third-party credentials, retrieve Nango environment variables, or expose unrestricted proxy requests. It does not infer whether a particular upstream MCP tool is read-only; because upstream MCP capabilities can change independently, `nango.mcp.tool.call` is conservatively HIGH_RISK. Upstream provider scopes and permissions are configured in Nango and the provider's authorization flow, not expanded by this connector.
