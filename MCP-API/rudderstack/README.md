# RudderStack MCP/API Connector

Reusable local MCP server for scoped RudderStack workflows.

## Official upstreams researched

- RudderStack documentation: https://www.rudderstack.com/docs/
- Official hosted MCP: https://mcp.rudderstack.com/mcp and https://mcp.rudderstack.com/docs
- Event Stream / SDK documentation is linked from the official docs and documents standardized Identify, Track, Page, Screen, Group, Alias, and Batch-style event collection.
- Workspace configuration is exposed by RudderStack at `https://api.rudderlabs.com/workspaceConfig` using the workspace token as Basic-auth username.
- RudderStack also documents REST APIs for management features such as Transformations. This connector intentionally does not expose transformation mutation or arbitrary HTTP passthrough.

The official RudderStack MCP is centrally hosted, uses browser-based RudderStack authorization, and advertises tools for sources, destinations, transformations, events, and documentation. It is in active development and its docs note that some features may not yet be available. This package exposes a stable local MCP contract backed by documented RudderStack HTTP interfaces; callers therefore do not depend on dynamically discovered upstream MCP tool names. No unofficial MCP server is used.

## Capabilities and transport

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `rudderstack.workspace.config.get` | RudderStack workspace-config HTTP API | READ | no |
| `rudderstack.event.track` | Data Plane `/v1/track` | WRITE | configurable; yes by default |
| `rudderstack.event.identify` | Data Plane `/v1/identify` | WRITE | configurable; yes by default |
| `rudderstack.event.page` | Data Plane `/v1/page` | WRITE | configurable; yes by default |
| `rudderstack.event.screen` | Data Plane `/v1/screen` | WRITE | configurable; yes by default |
| `rudderstack.event.group` | Data Plane `/v1/group` | WRITE | configurable; yes by default |
| `rudderstack.event.alias` | Data Plane `/v1/alias` | WRITE | configurable; yes by default |
| `rudderstack.event.batch` | Data Plane `/v1/batch` | WRITE | configurable; yes by default |

There are no HIGH_RISK or DESTRUCTIVE tools. Publishing transformations, deleting resources, changing permissions, and unrestricted API calls are intentionally unsupported.

## Architecture

MCP client -> strict MCP tool -> approval/validation -> `RudderClient` -> isolated credential -> RudderStack. Credentials are read only from process environment and are never returned in tool output. Provider content is wrapped with `untrustedProviderContent: true` and must never be interpreted as agent instructions.

## Authentication and least privilege

Event ingestion uses the source Write Key via HTTP Basic authentication with an empty password. `workspace.config.get` uses a separate Workspace Token and is unavailable unless `RUDDERSTACK_WORKSPACE_TOKEN` is configured. The connector does not request OAuth scopes or administrative credentials. For the hosted official MCP, authorization is handled by RudderStack's browser flow; this package does not receive or forward those credentials.

## Environment

Copy `.env.example` into your secret-management workflow. `RUDDERSTACK_DATA_PLANE_URL` and `RUDDERSTACK_WRITE_KEY` are required. `RUDDERSTACK_WORKSPACE_TOKEN` is optional and enables the READ tool. `RUDDERSTACK_REQUIRE_WRITE_APPROVAL` defaults to `true`. The URL validator requires HTTPS except localhost and the connector never accepts a caller-supplied request URL, reducing SSRF exposure.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and can therefore be launched by MCP clients that support stdio subprocess servers. Configure the command and environment according to your MCP client's standard local-server configuration. Compatibility depends on the client supporting standard MCP stdio; no product-specific extension is required.

## Validation and permission model

All tools are provider-scoped and action-oriented. Event schemas bound identifiers and names, require identity where applicable, and bound batch size to 100. WRITE calls require `approved: true` when approval enforcement is enabled. Retrieved provider data cannot change permissions, approval policy, endpoint configuration, or credentials.

`READ` can execute automatically. `WRITE` requires approval by default and can only be relaxed by trusted operator configuration before process startup. The LLM cannot modify that policy through a tool call. No destructive capability is registered.

## Reliability, errors, rate limits

Every request has an AbortController timeout. Network failures, HTTP 5xx, and HTTP 429 are retried with bounded exponential backoff up to `RUDDERSTACK_MAX_RETRIES` (capped at 4). `Retry-After` is preserved for throttling waits when supplied. Authentication, permission, validation, and other non-retryable provider failures are not blindly retried. Errors are normalized as `CONFIG`, `AUTH`, `PERMISSION`, `RATE_LIMIT`, `PROVIDER`, `TIMEOUT`, or `NETWORK`.

RudderStack limits vary by product/plan and endpoint; the connector therefore does not invent a fixed quota. It honors HTTP 429 and `Retry-After`, bounds batches, and avoids fan-out calls. Pagination is not needed by the implemented event-ingestion tools or the single workspace-config read.

## Security considerations

- Never place Write Keys or Workspace Tokens in prompts, examples, logs, or source control.
- Keep the data-plane URL operator-controlled; tools cannot override it.
- Treat event payloads and workspace configuration as untrusted third-party data.
- Approval is checked before any WRITE request.
- No arbitrary URL/request tool exists.
- No dynamically discovered upstream MCP tools are auto-trusted.
- The connector does not implement webhooks, so webhook signature validation is outside its surface.
- Avoid placing secrets or unnecessary PII in event properties; RudderStack Transformations and governance features can provide additional controls upstream.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch`; live credentials are not required. Coverage includes auth configuration, unsafe URL rejection, schema validation, tool/risk registration, invalid credentials, throttling/retry, workspace-token isolation, and provider error mapping.

## Limitations

This package does not proxy the hosted official MCP, dynamically discover MCP tools, manage destinations/sources, mutate transformations, publish configuration, expose analytics queries, or implement webhook receivers. Those capabilities should only be added after confirming current official contracts, exact permissions, and approval boundaries. The connector deliberately favors a small stable contract over undocumented endpoints.

See `examples/workflows.md` for safe invocation examples.