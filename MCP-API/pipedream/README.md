# Pipedream MCP/API Connector

Reusable MCP server for the Pipedream Connect integration platform. It exposes a deliberately narrow, stable interface for discovering Pipedream apps/components/actions, inspecting connected-account metadata, resolving dynamic action configuration, and executing an explicitly selected action behind a mandatory human-approval gate.

## Official sources researched

Current sources checked for this connector on 2026-09-15:

- Pipedream product / Connect overview: https://pipedream.com/
- Official TypeScript SDK: https://github.com/PipedreamHQ/pipedream-sdk-typescript
- Generated SDK reference: https://github.com/PipedreamHQ/pipedream-sdk-typescript/blob/main/reference.md
- Official Connect demo and documented action/trigger patterns: https://pipedream.com/connect/demo
- Official remote MCP service is advertised at `https://remote.mcp.pipedream.net`; Pipedream also exposes app-specific MCP configuration via `https://mcp.pipedream.net/v2`.

The official SDK supports OAuth client-credentials authentication, token override, project/environment scoping, cursor pagination, abort signals, request timeouts, structured errors, raw response access, and bounded automatic retries with exponential backoff. Its documented retryable defaults include 408, 429, and 5xx; this connector narrows writes to zero retries.

## MCP vs SDK strategy

Pipedream has an official remote MCP server intended to expose dynamically discovered tools for thousands of downstream APIs. This connector does **not** proxy that dynamic catalog wholesale: doing so would make the stable MCP surface depend on newly discovered upstream tools and could silently expand agent permissions.

Instead, provider-management and Connect capabilities use Pipedream's official `@pipedream/sdk`. This preserves explicit schemas and approval boundaries. For end-user scenarios that intentionally need Pipedream's remote MCP tool catalog, connect that official server separately and apply an allowlist / policy layer at the MCP host.

No raw `proxy.*` API method is exposed here, even though the SDK supports it, because unrestricted downstream requests would bypass the connector's scoped tool contracts.

## Authentication

Set `PIPEDREAM_CLIENT_ID`, `PIPEDREAM_CLIENT_SECRET`, `PIPEDREAM_PROJECT_ID`, and `PIPEDREAM_PROJECT_ENVIRONMENT`. The SDK performs OAuth client-credentials authentication and token refresh internally. Credentials stay in the connector process and are never returned to the MCP client.

Pipedream Connect client credentials are project scoped rather than a user-selectable list of OAuth scopes in this SDK surface. Apply least privilege by using a dedicated Pipedream project/environment, limiting which downstream integrations/users are connected there, and separating development from production.

This connector deliberately does not expose `tokens.create` because Connect tokens are authentication material intended for client-side account-connect flows and must not be returned to an LLM.

## Tools

| Tool | Risk | Approval | Upstream |
|---|---|---|---|
| `pipedream.app.list` | READ | no | SDK |
| `pipedream.app.get` | READ | no | SDK |
| `pipedream.component.list` | READ | no | SDK |
| `pipedream.component.get` | READ | no | SDK |
| `pipedream.action.list` | READ | no | SDK |
| `pipedream.action.get` | READ | no | SDK |
| `pipedream.action.configure_prop` | READ | no | SDK |
| `pipedream.action.reload_props` | READ | no | SDK |
| `pipedream.account.list` | READ | no | SDK |
| `pipedream.action.run` | HIGH_RISK | always | SDK |

`account.list` always sets `includeCredentials: false`. The connector never returns downstream OAuth tokens or API keys.

## Approval and permission model

Discovery and inspection are READ. `pipedream.action.run` is always HIGH_RISK because its actual effects are defined by the selected downstream component: an action can send external messages, publish content, mutate records, create billable resources, or invoke destructive APIs. Every run therefore requires an opaque `approvalId` supplied by the MCP host / human-approval UI and matched inside the connector against `PIPEDREAM_APPROVAL_TOKEN`.

Approval does not grant new Pipedream project access and cannot modify credentials or environment configuration.

## Security

- Pipedream client ID/secret and OAuth tokens remain in the SDK/connector layer.
- Tool inputs reject common credential-bearing keys in configurable props, limiting accidental secret forwarding from the model.
- Connected-account credential inclusion is hard-disabled.
- Catalog metadata, remote prop labels/options, app responses, and action output are marked `untrustedProviderData`; callers must never treat them as instructions.
- No arbitrary HTTP/API proxy is exposed.
- The connector does not automatically trust new tools discovered from Pipedream's remote MCP server.
- Inputs have bounded lengths, object sizes, key counts, and page sizes.

## Reliability, rate limits, pagination, and cancellation

The SDK handles cursor pagination and surfaces 429 as a typed error. Pipedream's public SDK documentation describes retry behavior but does not publish a single universal numeric Connect API quota in the material used for this connector, so no numeric limit is invented here. READ calls use the SDK's bounded retry policy (default connector value: two retries) and a configurable timeout. HIGH_RISK action execution sets `maxRetries: 0` to avoid duplicate side effects.

List tools return one bounded page (maximum 100 items) plus Pipedream's cursor metadata; callers can pass the opaque `after` cursor to continue. SDK abort/timeout support is configured per request.

Authentication, permission, validation, and approved action execution failures are not retried by connector logic.

## Install and run

```bash
cd MCP-API/pipedream
npm install
npm run build
npm start
```

The local server uses MCP stdio transport. Any standards-compliant MCP host that can launch a local stdio tool server can use it. Example:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/pipedream/dist/src/index.js"],
  "env": {
    "PIPEDREAM_CLIENT_ID": "<secret-manager-reference>",
    "PIPEDREAM_CLIENT_SECRET": "<secret-manager-reference>",
    "PIPEDREAM_PROJECT_ID": "proj_xxx",
    "PIPEDREAM_PROJECT_ENVIRONMENT": "development"
  }
}
```

## Error handling

The wrapper maps SDK authentication, permission, throttling, timeout, provider, and network failures to sanitized connector errors. Raw auth headers, client secrets, and downstream account credentials are never returned. A 429 is surfaced as retryable metadata; HIGH_RISK action calls still use zero SDK retries.

## Tests

```bash
npm test
```

Unit tests use fakes and require no live Pipedream credentials. They cover stable tool registration, credential-like input rejection, pagination, credential suppression, approval denial, zero-retry action execution, and unknown-tool rejection.

## Limitations

- This package intentionally does not expose Pipedream's raw API proxy, Connect-token creation, account credential retrieval, arbitrary remote MCP tools, or trigger deployment.
- Trigger deployment is omitted because it introduces webhook-delivery trust and receiver verification concerns; add a narrowly scoped trigger surface only when a concrete receiver/security policy is defined.
- The connector does not attempt to infer whether an individual downstream action is harmless. All action execution is conservatively HIGH_RISK.
- `configuredProps` structures are component-defined and can evolve. Inspect `pipedream.action.get` and use configuration helper tools before running an action.
