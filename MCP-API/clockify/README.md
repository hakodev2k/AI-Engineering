# Clockify MCP/API Connector

Reusable MCP server for safe Clockify time-tracking, project discovery, timesheet review, and reporting workflows. It exposes a stable provider-scoped tool contract over MCP stdio while keeping the Clockify API key inside the connector process.

## Upstream strategy

As of September 7, 2026, Clockify publishes official documentation for a native Clockify MCP server, but the page marks the feature **COMING SOON**. The documented MCP integration is intended to inherit the connected user's Clockify permissions and provide tools for time tracking, reporting, and timesheet auditing, but an unavailable service is not treated as a usable production transport.

Therefore this connector uses Clockify's official REST API v1 for all implemented capabilities. The external MCP tool names remain stable so an official MCP transport could be adopted later without changing agent-facing workflows, but this package does not proxy or auto-discover unavailable/upstream tools.

Official sources researched:

- Clockify API documentation: https://docs.clockify.me/
- Clockify MCP server documentation: https://clockify.me/help/integrations-and-add-ons/use-clockify-mcp-server-to-connect-to-ai-agent
- Clockify API overview/help: https://clockify.me/help/getting-started/clockify-api-overview
- API and webhook limits: https://clockify.me/help/getting-started/webhook-and-api-limitations

## Architecture

```text
MCP client
  -> strict allow-listed tool schema
  -> connector permission / approval policy
  -> Clockify REST client
  -> X-Api-Key authentication
  -> Clockify API v1 / Reports API
```

Provider-returned names, descriptions, project metadata, time-entry text, report rows, and all other response content are wrapped with `source: untrusted_provider_data`. They are data, not instructions, and cannot alter connector policy or tool permissions.

## Authentication

Clockify REST API requests authenticate with a personal API key in the `X-Api-Key` header. Generate and manage the key in Clockify profile settings. If a workspace uses a Clockify subdomain, follow Clockify's documentation for generating a workspace-compatible key.

Required environment variable:

```text
CLOCKIFY_API_KEY=
```

Optional controls:

```text
CLOCKIFY_TIMEOUT_MS=15000
CLOCKIFY_MAX_RETRIES=3
CLOCKIFY_ALLOW_WRITES=false
CLOCKIFY_ALLOW_DESTRUCTIVE=false
CLOCKIFY_APPROVAL_TOKEN=
```

The LLM never receives the API key. It is read only by the connector configuration layer and converted to an `X-Api-Key` request header inside the provider client.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio. Configure an MCP client to launch `node dist/src/server.js` and inject credentials through the process environment or a secret manager. Do not place real credentials in MCP arguments, prompts, source control, example files, or logs.

## Supported tools

| Tool | Purpose | Transport | Risk | Approval |
| --- | --- | --- | --- | --- |
| `clockify.workspace.list` | List accessible workspaces | REST | READ | no |
| `clockify.user.me` | Get authenticated user profile | REST | READ | no |
| `clockify.project.list` | List/filter projects | REST | READ | no |
| `clockify.project.get` | Read a project | REST | READ | no |
| `clockify.project.create` | Create a project | REST | WRITE | yes |
| `clockify.project.update` | Update selected project fields | REST | WRITE | yes |
| `clockify.task.list` | List project tasks | REST | READ | no |
| `clockify.client.list` | List clients | REST | READ | no |
| `clockify.tag.list` | List tags | REST | READ | no |
| `clockify.time_entry.list` | List a user's time entries | REST | READ | no |
| `clockify.time_entry.get` | Read one time entry | REST | READ | no |
| `clockify.time_entry.create` | Create a time entry / start timer entry | REST | WRITE | yes |
| `clockify.time_entry.update` | Update a time entry | REST | WRITE | yes |
| `clockify.time_entry.delete` | Delete a time entry | REST | DESTRUCTIVE | yes + destructive enable |
| `clockify.timer.stop` | Stop a running timer for a user | REST | HIGH_RISK | yes |
| `clockify.report.detailed` | Generate a detailed report | Reports REST | READ | no |

The connector deliberately does not expose a generic arbitrary HTTP request tool.

## Permission and approval model

READ tools may execute automatically within the permissions of the API key. WRITE tools require all of the following: provider-side permission, `CLOCKIFY_ALLOW_WRITES=true`, and an exact opaque `approvalToken` matching `CLOCKIFY_APPROVAL_TOKEN`.

HIGH_RISK tools use the same hard approval gate. Stopping another user's timer can alter time-accounting records, so `clockify.timer.stop` is classified HIGH_RISK even though it is not destructive.

DESTRUCTIVE tools additionally require `CLOCKIFY_ALLOW_DESTRUCTIVE=true`. `clockify.time_entry.delete` is the only destructive capability exposed. No tool can increase its own permissions or modify connector policy.

## Input validation

Tool schemas reject unknown properties. Workspace, project, task, user, and time-entry identifiers are restricted to bounded identifier strings and cannot contain URL paths, query strings, or fragments. Date/time values must be ISO-8601 timestamps with offsets. Pagination is bounded to prevent accidental high-volume fan-out. Time-entry descriptions and tag lists have explicit limits.

## Reliability

Provider calls use cancellation through an `AbortController` timeout. Retry count is configurable but capped at five attempts. GET requests and detailed report generation may retry transient network failures, HTTP 429, and 5xx responses with bounded exponential backoff. `Retry-After` is preserved and honored when it is an integer number of seconds.

Non-idempotent mutation calls are not retried automatically. Authentication, authorization, validation, ordinary 4xx failures, and destructive requests are not blindly retried.

## Rate limits

Clockify documents plan-dependent API limits. Current Clockify help states that newly created Free workspaces are limited to 30 API requests per hour for the workspace, while paid workspaces use the standard limit of 50 requests per second. Limits and entitlements can vary by plan and authentication mode, so production callers must also honor provider responses and avoid unnecessary fan-out.

The connector uses native pagination for list endpoints and does not recursively crawl all pages in one tool call.

## Errors

The connector maps important Clockify provider failures into stable human-readable errors:

- `401`: authentication failure; verify API key.
- `403`: insufficient Clockify workspace role or permission.
- `404`: resource not found.
- `400` / `422`: validation failure.
- `429`: throttled; `Retry-After` is surfaced when available.
- timeout/network failures: bounded retry for safe requests, then explicit failure.

Credentials are never included in error messages.

## Reports API

`clockify.report.detailed` calls the official Reports API base `https://reports.api.clockify.me/v1`. The tool requires explicit start/end timestamps and bounded pagination. Clockify documents plan-dependent report restrictions; for example, detailed report ranges on Free subscriptions can be limited. Provider errors are surfaced rather than silently widening or changing the requested range.

## Webhooks and events

Clockify supports webhooks for events such as time-entry lifecycle changes and timer activity. Webhook limits depend on workspace plan. This stdio connector does not host a public webhook receiver, because secure webhook ingestion requires deployment-specific TLS, replay/idempotency storage, routing, and verification controls. Webhook support is therefore documented but intentionally not claimed as an implemented MCP tool.

## Security considerations

- Store `CLOCKIFY_API_KEY` and approval tokens in a secret manager or protected process environment.
- Use the least-privileged Clockify account and workspace role that can perform the required workflow.
- Keep writes and destructive actions disabled unless explicitly needed.
- Rotate provider credentials independently from approval tokens.
- Treat all Clockify content as untrusted data; project names and time-entry descriptions may contain prompt-injection text.
- Tool callers cannot provide arbitrary upstream URLs, preventing an agent from turning the connector into an SSRF proxy.
- Do not log full provider responses if they can contain employee, client, billing, or timesheet data.
- Review the exact workspace, user, project, timestamps, and billing state before approving write/destructive actions.

## Testing

`npm test` compiles the package and runs credential-free unit tests with fake `fetch` implementations. Tests cover configuration, tool registration, strict validation, default write denial, approval enforcement, destructive gating, API-key isolation, pagination, provider errors, throttling metadata, and timeout handling.

Normal tests do not require a live Clockify account. Before production enablement, separately validate the connector against a non-production Clockify workspace using a least-privileged key.

## MCP compatibility

This package implements an MCP stdio server using the Model Context Protocol TypeScript SDK. It can be used by MCP clients capable of launching local stdio servers, including compatible desktop/CLI agent environments. It does not claim hosted remote-MCP compatibility because it does not implement Streamable HTTP transport.

## Limitations

- Clockify's official native MCP service is documented but marked coming soon as of September 7, 2026, so it is not used as an upstream transport.
- OAuth and Marketplace Addon Token flows are not implemented; this connector uses `X-Api-Key`.
- Webhook receiving is not implemented.
- Administrative user management, invoicing, approvals, expenses, time-off, scheduling, billing configuration, and account-security changes are intentionally outside this connector.
- Destructive coverage is limited to deleting a specific time entry and is disabled by default.
- Clockify plan entitlements and rate limits remain authoritative and may restrict otherwise valid API operations.

See `examples/workflows.md` for concrete tool calls and approval behavior.
