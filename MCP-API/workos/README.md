# WorkOS MCP/API Connector

Reusable MCP server exposing a focused set of WorkOS enterprise identity, Directory Sync, environment event, and Audit Log operations for AI agents.

## Transport strategy

WorkOS has an official remote Management MCP server at `https://mcp.workos.com/mcp` using streamable HTTP and OAuth. As of August 5, 2026, WorkOS documents four management tools (`whoami`, `list_operations`, `query`, `mutate`) which discover and execute hundreds of workspace operations. It inherits the signed-in dashboard user's team/environment permissions, can be restricted from production or writes by team admins, strips secrets from responses, and requires explicit confirmation for selected irreversible deletes.

This package intentionally uses the official REST API (`https://api.workos.com`) for its implemented application-facing operations. The connector is designed for unattended/headless MCP runtimes where a server-side WorkOS API key is already held by the connector. It does not attempt to capture or proxy the browser OAuth session required by the official Management MCP server. Interactive agents that need broad WorkOS workspace administration should connect to the official Management MCP directly; this connector provides a narrower, predictable tool contract with no arbitrary API escape hatch.

WorkOS also publishes `@workos/mcp-docs-server`, an official local MCP documentation server. That server supplies documentation/search/changelog context rather than tenant business operations, so it is not used as the execution transport here.

## Official sources researched

- Management MCP: https://mcp.workos.com/mcp and https://workos.com/blog/install-workos-plugin-claude-chatgpt-codex
- REST API reference: https://workos.com/docs/reference
- Organizations: https://workos.com/docs/reference/organization
- Directory Sync: https://workos.com/docs/reference/directory-sync
- Directory users: https://workos.com/docs/reference/directory-sync/directory-user
- Directory groups: https://workos.com/docs/reference/directory-sync/directory-group
- Events API: https://workos.com/docs/reference/events
- Audit Log events: https://workos.com/docs/reference/audit-logs/event
- Rate limits: https://workos.com/docs/reference/rate-limits
- MCP documentation server: https://workos.com/blog/workos-mcp-documentation-server

## Capabilities

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `workos.organization.list` | REST | READ | none |
| `workos.organization.get` | REST | READ | none |
| `workos.directory.list` | REST | READ | none |
| `workos.directory.get` | REST | READ | none |
| `workos.directory_user.list` | REST | READ | none |
| `workos.directory_user.get` | REST | READ | none |
| `workos.directory_group.list` | REST | READ | none |
| `workos.directory_group.get` | REST | READ | none |
| `workos.event.list` | REST | READ | none |
| `workos.audit_event.create` | REST | WRITE | explicit human |

No delete, credential rotation, impersonation, arbitrary URL, or arbitrary REST request tool is exposed.

## Authentication and permissions

Set a WorkOS server API key in `WORKOS_API_KEY`. The credential is read only by `src/config.ts` and sent by `src/client.ts` as `Authorization: Bearer ...`; it is never returned in MCP output or placed into model-visible tool arguments.

WorkOS API keys inherit the environment and permissions configured for that key. Use a key scoped to the environment and capabilities needed by this connector. Do not use a broader production key when a restricted key is sufficient.

The only connector write is Audit Log event creation. It is blocked unless the human-controlled runtime setting `WORKOS_WRITE_APPROVED=true` is present. The flag is intentionally outside tool arguments so an agent cannot elevate itself by supplying `approved: true`.

## Environment variables

```text
WORKOS_API_KEY=
WORKOS_API_BASE_URL=https://api.workos.com
WORKOS_TIMEOUT_MS=15000
WORKOS_MAX_RETRIES=2
WORKOS_WRITE_APPROVED=false
```

`WORKOS_API_BASE_URL` must use HTTPS. The configurable base URL exists for controlled test/proxy environments; do not point it at arbitrary user-supplied hosts.

## Install and run

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport, so compatible clients can launch the built `dist/src/server.js` process and consume the registered tools. Compatibility depends on the client supporting standard MCP stdio servers; no vendor-specific client protocol is required.

## Pagination

List tools expose bounded cursor pagination. `limit` is capped at 100. `before` and `after` cursors are passed through to WorkOS. Consumers should persist cursors in their own state instead of repeatedly rescanning entire collections.

Directory user group membership deserves special attention: WorkOS deprecated the unbounded `groups` field on Directory User objects and, for teams created on or after May 1, 2026, it is empty by default. Use `workos.directory_group.list` with `userId` to fetch memberships.

## Rate limits and reliability

WorkOS documents a general limit of 6,000 requests per 60 seconds per API key. Directory Users are additionally limited to 4 requests per second per directory. The connector avoids fan-out loops and exposes pagination rather than recursively fetching all pages.

The HTTP client uses request timeouts and bounded exponential backoff. GET operations may retry transient network errors, 429 responses, and 5xx responses up to `WORKOS_MAX_RETRIES` (maximum 5). `Retry-After` is honored for 429s. Authentication/authorization/validation errors are not retried. POST writes are not blindly retried; the Audit Log tool requires a UUID idempotency key and WorkOS documents idempotency support for this endpoint.

## Error handling

Provider errors are mapped to `WorkOSError` with HTTP status when available. Timeouts become explicit timeout errors. The connector never logs or returns the configured API key.

## Security model

Provider data is marked `untrusted-provider-data` in MCP responses. Retrieved organization names, directory attributes, event payloads, and other third-party content must be treated as data rather than instructions. Tool policy and permissions are static code and cannot be changed by provider content.

Input schemas bound identifiers, strings, arrays, pagination, event names, timestamps, and audit event target counts. There is no unrestricted request tool, no caller-controlled hostname, and no silent permission expansion.

The official Management MCP is not automatically discovered or trusted by this connector. If an interactive client connects to it separately, rely on WorkOS OAuth/team/environment controls and review its discovered operations before write access is enabled.

## Testing

```bash
npm test
```

Unit tests require no WorkOS credentials and cover authentication configuration, HTTPS validation, tool registration, bearer-token requests, permission denial/approval, provider error mapping, bounded 429 retry behavior, and the rule that POST writes are not blindly retried.

## Example workflows

See `examples/workflows.md` for organization/directory inspection, event synchronization, and approved Audit Log event creation.

## Limitations

- This package does not implement the browser OAuth flow for WorkOS Management MCP; use the official remote server directly for broad interactive workspace administration.
- It does not expose destructive operations, API key/client-secret management, user impersonation, billing changes, or arbitrary REST calls.
- It does not automatically consume webhooks. Use `workos.event.list` for pull-based synchronization or implement a separate verified webhook receiver using WorkOS webhook verification guidance.
- Audit Log event schemas must be configured in WorkOS before events using those schemas can be emitted successfully.
