# Unleash MCP/API Connector

Reusable MCP tool server for safe feature-flag operations against hosted or self-hosted Unleash. The connector exposes stable provider-scoped tools, keeps credentials in the connector layer, prefers Unleash's official MCP implementation when a compatible tool is available, and falls back to the official Admin API for deterministic management operations.

## Official sources researched

Unleash's official MCP server is generally available as `@unleash/mcp`; it supports local stdio operation and an Enterprise remote Streamable HTTP endpoint at `<instance>/api/admin/mcp`. The official tool set includes `evaluate_change`, `detect_flag`, `create_flag`, `wrap_change`, `list_projects`, `list_flags`, `get_flag_state`, `set_flag_rollout`, `toggle_flag_environment`, `remove_flag_strategy`, and `cleanup_flag`. The remote server uses OAuth 2.0 Dynamic Client Registration (DCR); local MCP accepts `UNLEASH_BASE_URL` and a personal access token.

Official Admin API base path is `<instance>/api/admin`. It supports projects, feature flags, per-environment state, activation strategies, archive validation, archive, and permanent deletion of archived flags. Service account tokens or personal access tokens authenticate Admin API requests; service accounts are preferred for production automation. Backend/frontend SDK tokens are intentionally not used for administrative mutation because their purpose and scope differ.

Documentation: https://docs.getunleash.io/integrate/mcp , https://docs.getunleash.io/api/admin-api-overview , https://docs.getunleash.io/api , https://docs.getunleash.io/concepts/api-tokens-and-client-keys , https://docs.getunleash.io/api/add-feature-strategy , https://docs.getunleash.io/api/archive-features , https://docs.getunleash.io/api/validate-archive-features , https://docs.getunleash.io/api/delete-features . Research verified 2026-09-15.

## Transport strategy

The connector launches the official local MCP package through stdio only for a fixed allowlist. It discovers upstream tool schemas and invokes MCP only when the normalized arguments are schema-compatible; otherwise it fails closed to the official Admin API rather than guessing. This preserves one external contract regardless of upstream transport.

`project.list`, `flag.list`, `flag.create`, `flag.environment.get`, flag toggles, and strategy removal can prefer official MCP where compatible. Exact reads, bounded strategy creation, archive impact validation, archive, and permanent deletion use the Admin API because the REST contract is explicit and lets this connector enforce its own approval boundary. The connector does not expose arbitrary Admin API requests.

## Tools

| Tool | Primary transport | Risk | Approval |
|---|---|---|---|
| `unleash.project.list` | MCP -> REST | READ | no |
| `unleash.flag.list` | MCP -> REST | READ | no |
| `unleash.flag.get` | REST | READ | no |
| `unleash.flag.create` | MCP -> REST | WRITE | configurable |
| `unleash.flag.environment.get` | MCP -> REST | READ | no |
| `unleash.flag.environment.enable` | MCP -> REST | HIGH_RISK | required |
| `unleash.flag.environment.disable` | MCP -> REST | HIGH_RISK | required |
| `unleash.strategy.list` | REST | READ | no |
| `unleash.strategy.add` | REST | HIGH_RISK | required |
| `unleash.strategy.remove` | MCP -> REST | HIGH_RISK | required |
| `unleash.flag.archive.validate` | REST | READ | no |
| `unleash.flag.archive` | REST | HIGH_RISK | required |
| `unleash.flag.delete` | REST | DESTRUCTIVE | required + disabled by default |

## Authentication and least privilege

Set `UNLEASH_BASE_URL` and `UNLEASH_PAT`. For production automation, use a dedicated Unleash service account token with only the instance/project permissions required by the enabled tools. Personal access tokens are supported for local developer use. Do not use backend or frontend SDK tokens for this connector's Admin API operations.

The official local MCP process receives credentials through its environment. Credentials are never accepted as tool parameters and are never returned to the model. For the Enterprise remote MCP server, OAuth/DCR should be handled by the MCP host; this connector documents that path but does not ask an LLM to process OAuth credentials.

## Permissions and approval

READ executes automatically. WRITE requires approval by default and can be relaxed for controlled non-production deployments. HIGH_RISK always requires `approvalId`. Environment enable/disable and activation-strategy changes are HIGH_RISK because they can immediately change user exposure, especially in production. Permanent deletion is DESTRUCTIVE and additionally requires `UNLEASH_ENABLE_DESTRUCTIVE=true`.

The approval grant is connector-local and should be injected by a trusted host/UI after a human review. It is not an Unleash token and cannot expand Unleash permissions.

## Security

Provider content and MCP responses are treated as untrusted data. The official MCP bridge allows only known tools and discovers their schemas before invocation. It does not forward credentials in tool arguments. Project/environment/flag/strategy identifiers are validated and URL-encoded. Pagination is bounded. The connector deliberately offers no raw endpoint, arbitrary URL, arbitrary JSON Patch, token-management, user/role-management, or project-deletion tool.

`flag.archive.validate` implements Read -> Recommend -> Execute: dependency impact can be inspected before `flag.archive`. Permanent delete only accepts archived feature names through Unleash's documented batch-delete endpoint.

## Reliability and rate limiting

Requests use cancellation timeouts and bounded exponential backoff. GET requests can retry transient 429/5xx/network failures and honor `Retry-After`; mutations are not blindly retried because their execution status may be ambiguous. Authentication, authorization, validation, and approval errors are never retried. Pagination is capped at 100 items per request.

Unleash deployment/resource limits vary by product/version/plan, so this connector does not hard-code a guessed global request quota. Provider throttling is surfaced to callers and `Retry-After` is preserved internally.

## Installation and running

```bash
cd MCP-API/unleash
npm install
npm run build
npm start
```

Node.js 20+ is required. The connector itself is a stdio MCP server. The first preferred-MCP call may ask `npx` to resolve the official `@unleash/mcp` package; set `UNLEASH_PREFER_OFFICIAL_MCP=false` to use only the official Admin API in environments where runtime package resolution is prohibited.

Example MCP host entry:
```json
{"command":"node","args":["/absolute/path/MCP-API/unleash/dist/src/index.js"],"env":{"UNLEASH_BASE_URL":"https://example.getunleash.io","UNLEASH_PAT":"<secret-from-host>"}}
```

Any MCP client that can launch a stdio tool server can use this package. The remote official Unleash MCP server may be connected directly by clients that support Streamable HTTP plus its OAuth/DCR flow.

## Error handling

REST provider errors are normalized internally with HTTP status, provider error code/message, and Retry-After where supplied. Secret headers/tokens are never included in tool output. Upstream MCP failure or schema drift causes safe REST fallback for the same normalized operation.

## Testing

```bash
npm test
```

Tests use fakes and require no live credentials. They verify registration, input validation, pagination, API fallback, write approval, high-risk gating, archive validation, and destructive defaults.

## Limitations

- This package does not implement OAuth DCR for remote MCP; that belongs to the connecting MCP host. It uses the official local stdio MCP for preferred transport.
- `set_flag_rollout` is not proxied directly because this connector intentionally models rollout as a bounded `strategy.add` operation whose parameters can be reviewed before execution.
- Feature types and endpoint availability depend on the Unleash version/plan. The `sunset` type was introduced in 2026; older self-hosted instances may reject it.
- Unleash project/role permissions remain authoritative; connector approval never bypasses provider authorization.
