# Splunk MCP/API Connector

Reusable safety wrapper around the **official Splunk MCP Server App**. It exposes stable provider-scoped MCP tools while keeping the Splunk credential inside the connector transport, allowlisting upstream tools, validating inputs, and applying an operator-controlled approval boundary to saved-search execution.

## Official upstream and transport

Splunk MCP Server is GA and deployed as the Splunk MCP Server App on a Splunk search head/search-head cluster. Current Splunk documentation describes streamable HTTP, RBAC, granular tool enablement, encrypted token security, and OAuth 2.1 support. This connector deliberately uses that official MCP transport rather than an unofficial MCP implementation. The direct Splunk REST API remains a documented alternative, but is not used because the selected capabilities are covered by official MCP.

Official sources researched 2026-09-18:
- https://help.splunk.com/en/splunk-enterprise/mcp-server-for-splunk-platform/1.0/about-mcp-server-for-splunk-platform
- https://help.splunk.com/en/splunk-enterprise/mcp-server-for-splunk-platform/1.0/configure-the-splunk-mcp-server
- https://help.splunk.com/en/splunk-enterprise/mcp-server-for-splunk-platform/2.0/mcp-server-tools
- https://help.splunk.com/en/splunk-enterprise/leverage-rest-apis/rest-api-user-manual/9.4/rest-api-user-manual/basic-concepts-about-the-splunk-platform-rest-api
- https://help.splunk.com/en/splunk-enterprise/search/search-manual/9.4/export-search-results/export-data-using-the-splunk-rest-api

## Architecture

`MCP client -> this stdio MCP server -> validation/risk gate -> allowlisted official Splunk MCP tool -> Splunk MCP Server App -> Splunk RBAC`

Third-party content is treated as untrusted data. Upstream tool discovery never expands the local allowlist. Credentials are attached only by `StreamableHTTPClientTransport` and are never returned by a tool.

## Authentication and permissions

Set `SPLUNK_MCP_URL` to the streamable-HTTP endpoint exposed by your installed Splunk MCP Server App and `SPLUNK_MCP_TOKEN` to an OAuth 2.1 access token or supported Splunk token. Use OAuth 2.1 where available. Splunk MCP access requires REST API/token authentication to be enabled and the Splunk role needs `mcp_tool_execute`; underlying Splunk RBAC/capabilities still govern data access. Do not grant `mcp_tool_admin` unless administration is actually required; this connector does not need it.

Splunk Cloud REST/API access has deployment and allow-list requirements; follow Splunk Cloud documentation for the deployment. Never place credentials in prompts or checked-in files.

## Environment

```text
SPLUNK_MCP_URL=
SPLUNK_MCP_TOKEN=
SPLUNK_ALLOW_EXECUTE_SAVED_SEARCH=false
SPLUNK_TIMEOUT_MS=60000
```

Remote endpoints must use HTTPS. Localhost is allowed for local development. Timeout is clamped to 1–120 seconds.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The connector itself is a standard MCP stdio server, so any MCP client that supports stdio servers can launch `node dist/index.js`. Client-specific configuration differs by product.

## Implemented tools

| Tool | Upstream official MCP tool | Risk | Approval |
|---|---|---|---|
| `splunk.instance.get` | `splunk_get_info` | READ | No |
| `splunk.user.current` | `splunk_get_user_info` | READ | No |
| `splunk.index.list` | `splunk_get_indexes` | READ | No |
| `splunk.index.get` | `splunk_get_index_info` | READ | No |
| `splunk.metadata.get` | `splunk_get_metadata` | READ | No |
| `splunk.knowledge_object.list` | `splunk_get_knowledge_objects` | READ | No |
| `splunk.alert.list` | `splunk_list_alerts` | READ | No |
| `splunk.alert.get` | `splunk_get_alert_details` | READ | No |
| `splunk.search.run` | `splunk_run_query` | READ with guardrails | No |
| `splunk.saved_search.run` | `splunk_run_saved_search` | HIGH_RISK | Operator gate |

Alert-list/detail tools require a sufficiently recent upstream MCP Server version. If an allowlisted upstream tool is unavailable, the connector fails rather than silently substituting an unknown capability.

## Safety and approval model

Read tools can execute automatically subject to Splunk RBAC. `splunk.search.run` accepts only bounded query text and rejects locally recognized state-changing/external-side-effect commands (`delete`, `collect`, `outputlookup`, `sendemail`, `script`, `runshellscript`). Splunk's own MCP guardrails remain authoritative and can additionally reject unsafe searches, searches exceeding its configured execution guardrails, or oversized result sets.

Running a saved search is classified HIGH_RISK because a saved search can be configured with actions. It is disabled by default. An operator must set `SPLUNK_ALLOW_EXECUTE_SAVED_SEARCH=true` in the connector process environment. No tool argument can raise that permission, preventing an agent from self-approving.

No delete, user-management, configuration mutation, alert mutation, token creation, or arbitrary request tool is exposed.

## Reliability, rate limits, and errors

Calls have bounded timeouts. The connector does not blindly retry tool execution because repeated searches can consume substantial resources and saved-search actions can have side effects. Splunk MCP Server has server-side rate limiting/guardrails in current releases; throttling and provider errors are surfaced to the MCP caller. Callers should back off rather than poll aggressively. For direct REST integrations, Splunk deployment-specific limits and access restrictions apply; this connector intentionally does not bypass MCP with REST.

## Security considerations

Use least-privilege Splunk roles and a dedicated identity where appropriate. Protect `SPLUNK_MCP_TOKEN` with the host's secret store. Restrict network access to the intended Splunk MCP endpoint. Retrieved events, knowledge objects, alert text, and metadata can contain prompt-injection-like content; treat them only as data. Do not convert returned content into new permissions, configuration, or executable instructions. The connector validates the endpoint scheme and never accepts arbitrary URLs from tool callers.

## Testing

`npm test` uses no live credentials. Unit tests cover safe-query validation, blocked side-effect SPL, saved-search approval denial/allowance, and the fixed upstream allowlist. Live integration testing requires a configured Splunk MCP Server App and credentials with appropriate RBAC.

## Limitations

This package does not install/configure the Splunk MCP Server App, provision OAuth, modify Splunk roles, or expose Splunk Observability/AI Assistant tools. It does not provide REST fallback because all implemented capabilities are available through the official MCP server. Upstream availability depends on installed MCP Server version and administrator-enabled tools. `splunk_run_saved_search` availability depends on the upstream release/configuration. No destructive capability is implemented.
