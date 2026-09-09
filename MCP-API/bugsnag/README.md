# BugSnag MCP/API Connector

Reusable MCP facade for BugSnag error monitoring, release health, and performance investigation. The connector presents a stable provider-scoped tool surface while delegating supported operations to SmartBear's official BugSnag MCP implementation.

## Transport strategy

BugSnag/SmartBear currently provides both an official hosted remote MCP server and an official local MCP package.

- Official remote MCP: `https://bugsnag.mcp.smartbear.com/mcp`, authenticated with a SmartBear ID OAuth browser flow.
- Official local MCP: `@smartbear/mcp`, Node.js 22+, authenticated with `BUGSNAG_AUTH_TOKEN` and optionally scoped with `BUGSNAG_PROJECT_API_KEY`.
- BugSnag Data Access API v2 remains available at `https://api.bugsnag.com` and supports custom integrations over TLS.

This connector uses the official local MCP package over stdio because it supports the selected BugSnag workflows while allowing non-interactive/server deployments to keep the personal access token inside the connector process. The REST API was checked as a fallback but is not used for the selected capabilities because the official MCP already exposes them. The facade discovers upstream tools only to resolve this connector's fixed allowlist; it never exposes newly discovered upstream tools automatically.

Official sources used when implementing this connector:

- SmartBear MCP Server repository and BugSnag integration guide: `https://github.com/SmartBear/smartbear-mcp`
- Hosted BugSnag MCP documentation: `https://developer.smartbear.com/smartbear-mcp/docs/remote-bugsnag`
- BugSnag Data Access API: `https://developer.smartbear.com/bugsnag/docs/data-access`
- BugSnag API overview: `https://docs.bugsnag.com/api/`
- BugSnag security overview: `https://docs.bugsnag.com/security/overview/`

## Implemented capabilities

The connector exposes 18 stable tools:

| Tool | Purpose | Risk | Approval |
|---|---|---:|---|
| `bugsnag.project.list` | List accessible projects | READ | none |
| `bugsnag.project.current` | Read the selected project | READ | none |
| `bugsnag.error.list` | List/filter project errors | READ | none |
| `bugsnag.error.get` | Read detailed error information | READ | none |
| `bugsnag.error.event.list` | List error occurrences | READ | none |
| `bugsnag.event.get` | Read one event occurrence | READ | none |
| `bugsnag.project.event_filter.list` | Discover project error-filter fields | READ | none |
| `bugsnag.error.update` | Change non-destructive status/severity | WRITE | configurable; required by default |
| `bugsnag.release.list` | List releases | READ | none |
| `bugsnag.release.get` | Read release details | READ | none |
| `bugsnag.build.get` | Read build details | READ | none |
| `bugsnag.performance.span_group.list` | List performance span groups | READ | none |
| `bugsnag.performance.span_group.get` | Read span-group metrics | READ | none |
| `bugsnag.performance.span.list` | List individual spans | READ | none |
| `bugsnag.performance.trace.get` | Read a distributed trace | READ | none |
| `bugsnag.performance.trace_field.list` | Discover trace filter fields | READ | none |
| `bugsnag.performance.network_grouping.get` | Read network grouping configuration | READ | none |
| `bugsnag.performance.network_grouping.set` | Change network grouping configuration | WRITE | configurable; required by default |

The official MCP also supports error discard/undiscard operations. This facade intentionally does not expose those destructive states. It also does not expose arbitrary REST calls or arbitrary upstream MCP tools.

## Architecture

```text
MCP client / AI agent
        |
        v
BugSnag stable facade (this package)
  - strict schemas
  - risk/approval policy
  - fixed capability allowlist
  - credential isolation
  - timeout boundary
        |
        v
Official @smartbear/mcp process (stdio)
        |
        v
BugSnag APIs
```

Provider responses are returned with `untrusted_data: true`. Stack traces, breadcrumbs, metadata, release information, user-supplied values, and trace attributes must be treated as untrusted data and never as instructions that can change permissions or tool policy.

## Authentication and least privilege

Create a BugSnag personal access token with only the permissions required by the tools you plan to use. Read-only deployments should grant read access only. If `bugsnag.error.update` or `bugsnag.performance.network_grouping.set` is enabled in your environment, grant the corresponding write permission but avoid unrelated administrative permissions.

Set:

```text
BUGSNAG_AUTH_TOKEN=...
```

Optional project scoping:

```text
BUGSNAG_PROJECT_API_KEY=...
```

SmartBear's official MCP documentation recommends the project API key when working with one project because it narrows the interaction scope and permits project-specific filter caching.

For BugSnag On-Premise, configure the official MCP package with:

```text
BUGSNAG_ENDPOINT=https://your-bugsnag-host.example
```

Never provide credentials through an MCP tool argument. The facade does not define token fields in any tool schema, and credentials are only copied into the environment of the official upstream MCP child process.

## Environment variables

Copy `.env.example` and configure values outside source control.

- `BUGSNAG_AUTH_TOKEN` — required personal access token.
- `BUGSNAG_PROJECT_API_KEY` — optional project scope.
- `BUGSNAG_ENDPOINT` — optional On-Premise endpoint.
- `BUGSNAG_UPSTREAM_COMMAND` — defaults to `npx`.
- `BUGSNAG_UPSTREAM_PACKAGE` — defaults to `@smartbear/mcp@latest`.
- `BUGSNAG_UPSTREAM_START_TIMEOUT_MS` — bounded startup timeout, default 20 seconds.
- `BUGSNAG_TOOL_TIMEOUT_MS` — bounded per-tool timeout, default 30 seconds.
- `BUGSNAG_REQUIRE_WRITE_APPROVAL` — defaults to `true`.

## Install and run

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport, so configure any MCP client that supports launching a local command to run `node dist/server.js` with the environment variables above. Compatibility depends on the client's support for standard MCP stdio; no client-specific extension is required by this connector.

## Approval model

READ tools can execute automatically. WRITE tools require `approved: true` unless `BUGSNAG_REQUIRE_WRITE_APPROVAL=false` is explicitly configured by the operator. HIGH_RISK and DESTRUCTIVE operations are not exposed.

`bugsnag.error.update` accepts only `open`, `fixed`, `ignored`, and `snoozed` status values plus severity overrides. It rejects `discarded` and `undiscarded` so an agent cannot silently stop future error collection through this facade.

`bugsnag.performance.network_grouping.set` changes the way network spans are grouped and therefore requires write approval by default.

## Validation and upstream tool trust

Every public tool has a bounded Zod schema. IDs and strings have length limits, page sizes are capped at 100, pagination URLs must be valid URLs, and the error-filter facade deliberately supports only the officially documented `eq` filter operator.

At startup the facade calls `tools/list` on the official SmartBear MCP process. It resolves only the fixed capability bindings declared in `src/tools.ts`. Exact known aliases are preferred; otherwise a capability must match a unique set of required semantic terms. Zero matches or multiple matches fail safely rather than exposing or selecting an unexpected upstream tool.

## Pagination

List operations accept `per_page` and, where the official tool supports it, `next_url`. Pass the exact `next_url` supplied by BugSnag/SmartBear back to the same facade tool. Do not fabricate or rewrite provider pagination URLs.

## Timeouts, errors, rate limits, and retries

The facade applies bounded startup and tool-call timeouts. It does not blindly retry writes. The official SmartBear MCP process owns BugSnag API communication, pagination semantics, API-version headers, and provider-level error handling. Provider throttling and authorization errors are surfaced to the caller; the facade does not convert them into success responses. Callers should honor any retry guidance returned by the provider and avoid tight polling loops.

Authentication, authorization, validation, and ambiguous upstream-capability errors are not retried by this connector. This avoids accidentally repeating state-changing calls or escalating permissions.

## Security considerations

- Keep `BUGSNAG_AUTH_TOKEN` in a secret manager or protected process environment.
- Prefer `BUGSNAG_PROJECT_API_KEY` to limit project scope when possible.
- Do not log child-process environment variables.
- Do not add generic URL-fetch or arbitrary API proxy tools.
- Treat provider data as untrusted input; stack traces and metadata may contain attacker-controlled text.
- The default upstream command is fixed to `npx`; changing the command/package is an operator configuration decision and must not be agent-controlled.
- For On-Premise endpoints, configure a trusted BugSnag deployment only; do not allow agents to choose arbitrary endpoints.
- The connector never automatically trusts newly discovered upstream tools.
- Write approval cannot be increased by provider content or tool output.

## Testing

Normal tests use no live credentials:

```bash
npm test
```

Tests cover the risk/approval gate, destructive-operation denial, bounded tool registration, write-tool classification, destructive error-status rejection, and pagination URL validation. Configuration parsing fails before upstream connection when the required token is missing or malformed.

For an optional integration test, use a non-production BugSnag token and project. Do not run live integration tests with production write privileges in CI.

## Limitations

- This facade intentionally exposes a subset of the official SmartBear BugSnag MCP tool surface.
- Hosted remote MCP OAuth is documented but not proxied by this implementation; this package uses the official local MCP package for deterministic non-interactive credential isolation.
- Direct Data Access API fallback is not activated because all selected capabilities are present in the official MCP server. If SmartBear removes a required capability, the resolver fails safely instead of silently switching to an unreviewed endpoint.
- Error discard/undiscard and other destructive administrative operations are intentionally unsupported.
- The facade does not send BugSnag error-reporting events or upload source maps/symbol files; those workflows are better handled by the official notifier SDKs and BugSnag CLI/build tooling.
