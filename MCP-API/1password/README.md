# 1Password MCP/API Connector

Reusable MCP server for safe 1Password automation. It uses the official 1Password Connect Server REST API for deterministic vault/item workflows and recognizes the official 1Password Environments MCP Server as the preferred transport for runtime secret injection into agent processes.

## Transport strategy

1Password now provides an official Environments MCP Server for supported coding-agent workflows. Its key security property is that credentials can be injected into authorized runtime processes without entering model context. This connector does not proxy or reproduce those secret-reveal semantics. For vault inventory, item metadata, controlled item mutation, Connect activity, and health checks it uses the official Connect Server API instead.

Official sources researched for this implementation:
- https://www.1password.dev/connect/api-reference
- https://www.1password.dev/connect/get-started
- https://1password.com/blog/1password-trusted-access-layer-for-openai-codex
- https://1password.com/blog/the-1password-environments-mcp-server-is-now-on-cursor-marketplace

The Connect API reference documents bearer-token authentication, vault/item CRUD, files, API activity, health and metrics. The current API specification linked by 1Password is 1.8.1.

## Supported tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `1password.server.health` | REST | READ | no |
| `1password.vault.list` | REST | READ | no |
| `1password.vault.get` | REST | READ | no |
| `1password.item.list` | REST | READ | no |
| `1password.item.get_redacted` | REST | READ | no |
| `1password.file.list` | REST | READ | no |
| `1password.activity.list` | REST | READ | no |
| `1password.item.create` | REST | WRITE | configurable, default yes |
| `1password.item.replace` | REST | WRITE | configurable, default yes |
| `1password.item.archive` | REST | DESTRUCTIVE | always; disabled by default |

## Authentication and permissions

Deploy a 1Password Connect server and create a Connect access token scoped only to vaults this connector should access. Set `ONEPASSWORD_CONNECT_HOST` and `ONEPASSWORD_CONNECT_TOKEN`. The token remains inside the connector HTTP layer and is never returned by tools.

The official Environments MCP Server is preferable when an AI agent needs to use a secret rather than inspect or manage vault metadata, because secret values can remain outside model context.

## Security model

READ operations may execute automatically. WRITE operations require connector-side approval by default. DESTRUCTIVE operations require exact approval and `ONEPASSWORD_ALLOW_DESTRUCTIVE=true`. Approvals are configured outside tool arguments in `ONEPASSWORD_APPROVED_ACTIONS`; an agent cannot self-approve.

`item.get_redacted` removes values from fields whose type is `CONCEALED` or whose purpose is `PASSWORD`. File content retrieval is intentionally not exposed. Retrieved titles, URLs, notes and metadata remain untrusted data and must never be interpreted as instructions or permission changes.

The Connect host is configurable because Connect is self-hosted, but HTTPS is mandatory. Deployments should additionally enforce network allowlists/private networking around the Connect endpoint.

## Reliability

GET calls use bounded retries for network errors, HTTP 429 and 5xx responses, with `Retry-After` support and exponential backoff. Mutation requests are not blindly retried. Every request has an abort timeout. List/filter tools use provider-side filtering rather than client-side full-vault scans.

1Password Connect does not publish one universal fixed request quota in the API reference; deployments should respect HTTP 429 and `Retry-After` responses and keep polling bounded.

## Install and run

```bash
npm install
npm run build
npm test
npm start
```

Requires Node.js 20+. The server uses MCP stdio and can be launched by MCP clients that support stdio servers.

## Configuration

Copy `.env.example` and provide the Connect endpoint/token. Approval fingerprints are semicolon-separated, for example:

```text
ONEPASSWORD_APPROVED_ACTIONS=1password.item.create:vault123:Agent Note;1password.item.replace:vault123:item456
```

## Testing

Unit tests require no live credentials. They cover HTTPS validation, approval denial/grant, destructive default-deny behavior, bounded 429 retry, non-retry of writes, and tool registration.

## Limitations

This connector intentionally does not expose raw secret values, file content, arbitrary REST requests, vault administration, account permissions, billing, or unrestricted patch operations. It does not replace the official Environments MCP Server for secure runtime secret injection. Item creation/replacement should be used only where agents are explicitly authorized to supply the item data they send.
