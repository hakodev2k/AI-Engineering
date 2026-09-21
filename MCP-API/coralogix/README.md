# Coralogix MCP Connector

Reusable, safety-scoped MCP adapter for Coralogix observability. It exposes five stable provider-scoped READ tools and delegates them to Coralogix's official remote MCP server v2. It intentionally does not expose upstream write, alert-management, parsing-rule, Olly/costly, permission, or destructive tools.

## Official sources and transport
Coralogix operates an official remote Streamable HTTP MCP server. Current docs: `https://coralogix.com/docs/user-guides/mcp-server/overview/` and setup: `https://coralogix.com/docs/user-guides/mcp-server/setup/`. OAuth 2.1/OIDC is documented at `https://coralogix.com/docs/user-guides/mcp-server/oauth/`. API reference: `https://coralogix.com/docs/api-reference/`.

This connector uses **official MCP**, not REST/SDK fallback, because the required telemetry capabilities are directly supported by the trusted upstream server. Coralogix MCP v2 is the default. The upstream endpoint is region/domain dependent and must be configured explicitly.

## Capabilities
| Tool | Upstream MCP tool | Risk | Approval |
|---|---|---|---|
| `coralogix.logs.query` | `get_logs` | READ | No |
| `coralogix.metrics.query` | `get_metrics` | READ | No |
| `coralogix.traces.query` | `get_traces` | READ | No |
| `coralogix.schema.get` | `get_schemas` | READ | No |
| `coralogix.dataprime.docs` | `read_dataprime_intro_docs` | READ | No |

The connector verifies these upstream tools during connection and fails closed if any is unavailable. It never discovers and forwards arbitrary newly-added tools.

## Architecture and security
`MCP client/agent -> local stdio connector -> allowlist + strict Zod validation -> official Coralogix remote MCP -> Coralogix RBAC`.

Credentials remain in the connector process and are sent only as the Bearer header to the validated official Coralogix endpoint. The endpoint validator restricts the host to `api.<domain>.coralogix.com` and the MCP path, reducing SSRF risk. Provider telemetry is explicitly wrapped as untrusted data. No provider response can alter the tool allowlist or permission policy. Secrets are never logged.

Coralogix supports OAuth 2.1/OIDC for compatible MCP clients and personal API keys. This wrapper uses a personal API key because it runs as a reusable stdio gateway; provision a dedicated personal key with only the read permissions needed for logs, metrics, traces and schemas. OAuth is preferable when connecting a compatible client directly to Coralogix because Coralogix enforces the signed-in user's access controls and refresh flow.

## Environment
Copy `.env.example` values into your secret manager/runtime environment. `CORALOGIX_MCP_URL` must match your Coralogix domain, for example `https://api.eu2.coralogix.com/mgmt/api/v1/mcp`. `CORALOGIX_API_KEY` is required. Never place a real key in source control.

## Install and run
Requires Node.js 20+.

```bash
npm install
CORALOGIX_MCP_URL=https://api.eu2.coralogix.com/mgmt/api/v1/mcp CORALOGIX_API_KEY='<secret>' npm start
```

Configure any MCP client that supports stdio to launch `npm start` in this directory. Compatibility depends on the client supporting standard MCP stdio servers; no client-specific behavior is required.

## Reliability
Calls have configurable timeouts and bounded retries with exponential backoff. Authentication, permission and validation failures are not retried. The connector does not retry destructive operations because none are exposed. Coralogix's remote MCP service owns telemetry query pagination/result semantics; callers should constrain query windows and limits to avoid excessive data transfer. MCP/service throttling surfaces as an upstream error; bounded retries prevent retry storms.

## Permissions and approvals
All exposed tools are READ and may execute without human approval. WRITE, HIGH_RISK and DESTRUCTIVE capabilities are deliberately absent. Although Coralogix's official MCP server can manage alerts and parsing rules, those capabilities require a separate reviewed connector policy before exposure. Olly is also omitted because it is opt-in and requires the costly-use header.

## Errors
Startup fails on missing credentials, an invalid/non-official endpoint, or missing required upstream tools. Runtime errors preserve provider/MCP failure context without echoing credentials. Authentication and permission failures require operator action rather than retries.

## Testing
`npm test` uses fakes only and requires no Coralogix credentials. Tests cover authentication configuration, SSRF endpoint validation, allowlisting, read invocation, denial of arbitrary tools, non-retryable auth failures, bounded transient retry, and timeout cancellation.

## Limitations
This package intentionally provides a narrow observability-read surface rather than mirroring the full Coralogix MCP catalog. It does not expose alert/parsing-rule mutation, Notification Center administration, custom roles, Olly, RUM-specific convenience tools, REST/gRPC APIs, webhooks, or ingestion. Query syntax and returned fields remain governed by Coralogix and account RBAC.
