# Rollbar MCP/API Connector

Reusable safety wrapper for Rollbar error-monitoring workflows. Node.js 20+ is required. The connector exposes stable `rollbar.*` MCP tools while keeping Rollbar credentials inside the connector process.

## Transport strategy
Rollbar publishes the official `@rollbar/mcp-server` stdio server. This connector pins `0.6.0`, starts it as a child MCP process, validates its expected tool set at startup, and allowlists only documented tools. Read workflows and item updates use the official MCP implementation. `rollbar.deployment.create` uses Rollbar's official REST API because deployment creation is not exposed by the official MCP tool set.

Official sources researched for this connector: Rollbar MCP Server Setup (`docs.rollbar.com/docs/mcp-server-setup`), official `rollbar/rollbar-mcp-server` repository and v0.6.0 package metadata, Rollbar API (`docs.rollbar.com/reference/getting-started-1`), List all items, Create item, and Rollbar Rate Limits documentation.

## Capabilities
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `rollbar.project.list` | official MCP `list-projects` | READ | no |
| `rollbar.item.get` | official MCP `get-item-details` | READ | no |
| `rollbar.item.list` | official MCP `list-items` | READ | no |
| `rollbar.item.top` | official MCP `get-top-items` | READ | no |
| `rollbar.occurrence.list` | official MCP `list-occurrences` | READ | no |
| `rollbar.deployment.list` | official MCP `get-deployments` | READ | no |
| `rollbar.version.get` | official MCP `get-version` | READ | no |
| `rollbar.replay.get` | official MCP `get-replay` | READ | no |
| `rollbar.item.update` | official MCP `update-item` | WRITE | required by default |
| `rollbar.deployment.create` | REST `/deploy` | HIGH_RISK | required |

No delete/admin/token-management operations are exposed.

## Authentication and least privilege
Rollbar API authentication uses `X-Rollbar-Access-Token`. Prefer a project token with `read` scope. For `item.update`, the official MCP requires a project read/write token; account-token mode requires read+write because project resolution reads projects before updating. Deployment creation deliberately uses a separate `ROLLBAR_POST_SERVER_TOKEN` with `post_server_item` scope so an agent does not gain general write access merely to record a deployment. Rollbar's encrypted access tokens are shown only when created; store them in a secrets manager or environment, never source control.

Copy `.env.example` values into the runtime environment. `ROLLBAR_API_BASE` defaults to the official HTTPS endpoint and is host-allowlisted to reduce SSRF risk. Add private/self-hosted Rollbar hosts explicitly only after trust review.

## Install and run
```bash
npm install
npm run build
npm test
npm start
```
The server speaks MCP over stdio and can therefore be launched by MCP clients that support local stdio servers. Configure the client command to run `node /absolute/path/to/dist/index.js` and provide credentials through the process environment. Do not put tokens in prompts or tool arguments.

## Approval model
READ calls may run automatically. WRITE calls require `approved=true` when `ROLLBAR_REQUIRE_WRITE_APPROVAL=true` (default). HIGH_RISK deployment recording always passes the same approval gate. `approved=true` is an execution acknowledgement, not a mechanism for the model to self-authorize; the host must only set it after a human approves the exact intended mutation.

## Reliability and rate limits
The official MCP server owns its API behavior for MCP-routed tools. The REST fallback uses a bounded 15-second default timeout and does not blindly retry writes. HTTP 401/403 becomes an authentication/scope error. HTTP 429 preserves `Retry-After` or Rollbar's remaining-seconds information for the caller. Rollbar documents per-token configurable limits and the headers `X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, `X-Rate-Limit-Remaining-Seconds`, and `X-Rate-Limit-Reset`. Because deployment creation is a mutation, callers should wait and obtain renewed approval rather than automatically replaying a throttled request.

## Security
Credentials are passed only from the wrapper environment to the official MCP child process or REST client and are never returned to MCP callers. Newly discovered upstream MCP tools are ignored; missing expected tools fail startup. Provider responses are wrapped with `untrusted_data:true`: stack traces, request payloads, titles, comments, and replay content must be treated as untrusted data and never as instructions. Input schemas bound identifiers, page sizes, strings, environments, and response token budgets. API-base overrides require HTTPS and an explicit host allowlist. Logs must not include tokens or raw authorization headers.

Session replays can contain sensitive user data. Only request them when authorized for the relevant project and environment, minimize retention, and prefer the official MCP resource delivery mode where appropriate. The wrapper does not elevate Rollbar scopes and cannot create tokens or change permissions.

## Testing
`npm test` uses Vitest and no live credentials. Tests cover credential configuration, SSRF-style API-base rejection, separate deployment credentials, throttling, and authentication/scope error mapping. The upstream wrapper additionally validates the official MCP tool inventory at runtime before serving callers.

## Limitations
The official Rollbar MCP server is under active development, so this wrapper pins a reviewed release instead of `latest`. Upgrade intentionally after reviewing upstream tool/schema and permission changes. The public Rollbar API has limitations around occurrence listing for group items; the official MCP reports that condition rather than fabricating empty results. This connector does not expose occurrence ingestion, token management, project administration, destructive operations, or arbitrary HTTP requests.

See `examples/workflows.md` for safe triage, update, and deployment flows.
