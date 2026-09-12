# Port MCP/API Connector

Reusable MCP connector for [Port](https://www.port.io/) developer portal/catalog workflows. It exposes a stable provider-scoped tool surface while using Port's official remote MCP server first for supported catalog/workflow capabilities and the official REST API as a bounded fallback for direct reads.

## Official sources

- Port MCP overview: https://docs.port.io/agent-management/port-mcp-server/overview/
- Available MCP tools: https://docs.port.io/agent-management/port-mcp-server/available-tools/
- Machine authentication: https://docs.port.io/agent-management/port-mcp-server/token-based-authentication/
- Port API: https://docs.port.io/api-reference/port-api/
- Access token: https://docs.port.io/api-reference/create-an-access-token/
- Rate limits: https://docs.port.io/api-reference/rate-limits/
- Rate-limit best practices: https://docs.port.io/api-reference/rate-limits/rate-limit-best-practices/

Research validated on 2026-09-12.

## Transport strategy

Port provides an official remote MCP server at `https://mcp.port.io/v1`. This connector prefers that server for the implemented catalog, action, workflow, scorecard, integration, and upsert/trigger operations. Headless authentication uses Port's documented OAuth `client_credentials` exchange at `https://mcp.port.io/v1/token`.

The official REST API at `https://api.port.io/v1` is used only for explicit read fallbacks (`port.blueprint.get.fallback` and `port.entity.get.fallback`). No arbitrary REST or GraphQL passthrough tool is exposed.

## Capabilities and tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `port.blueprint.list` | MCP `list_blueprints` | READ | none |
| `port.entity.list` | MCP `list_entities` | READ | none |
| `port.action.list` | MCP `list_actions` | READ | none |
| `port.workflow.list` | MCP `list_workflows` | READ | none |
| `port.scorecard.list` | MCP `list_scorecards` | READ | none |
| `port.integration.list` | MCP `list_integrations` | READ | none |
| `port.action.permissions.get` | MCP `get_action_permissions` | READ | none |
| `port.workflow.run.get` | MCP `get_workflow_run` | READ | none |
| `port.blueprint.get.fallback` | REST | READ | none |
| `port.entity.get.fallback` | REST | READ | none |
| `port.entity.upsert` | MCP `upsert_entity` | WRITE | explicit |
| `port.blueprint.upsert` | MCP `upsert_blueprint` | WRITE | explicit |
| `port.workflow.trigger` | MCP `trigger_run` | WRITE | explicit |

Destructive Port capabilities such as deleting blueprints/entities/actions/workflows are intentionally not exposed.

## Authentication

Set Port machine credentials in environment variables:

```bash
PORT_CLIENT_ID=
PORT_CLIENT_SECRET=
```

For MCP, the connector exchanges these for a short-lived bearer token with `grant_type=client_credentials`. Port documents access tokens as typically valid for about three hours and the MCP token endpoint as limited to 50 requests per 15 minutes per client; the connector caches tokens until near expiry.

For REST fallback, the same credentials are exchanged using Port's official `/v1/auth/access_token` endpoint. Raw client secrets and bearer tokens remain in the connector layer and are never returned by tools.

Optional configuration:

```bash
PORT_MCP_URL=https://mcp.port.io/v1
PORT_API_URL=https://api.port.io/v1
PORT_TIMEOUT_MS=15000
PORT_MAX_RETRIES=2
PORT_WRITE_APPROVED=false
```

`PORT_WRITE_APPROVED=true` is an operator-controlled runtime gate. A write still requires the tool call to include `approved: true`; both conditions must be satisfied.

## Permissions and approval model

READ tools may execute automatically subject to Port RBAC. WRITE tools require explicit human approval and the runtime write gate. The connector does not attempt permission escalation. Port MCP tool visibility itself depends on the authenticated caller's Port role and permissions.

Port's upstream MCP server can expose many more tools than this package uses. The connector keeps a hard-coded allow-list and rejects any attempt to invoke newly discovered/unexpected upstream tools.

## Reliability

- MCP and REST calls use short-lived bearer tokens rather than exposing long-lived credentials.
- REST reads use bounded retries only for `429` and transient `5xx` responses.
- REST retries are not applied to mutations because mutations are routed through MCP and must not be blindly replayed.
- REST requests use `AbortController` timeouts.
- `401` invalidates cached REST credentials once and re-authenticates.
- `x-ratelimit-reset` is honored when available; otherwise exponential backoff is bounded.
- MCP failures close the upstream session so a later call establishes a fresh transport/token.

Port currently documents organization-level limits including 35,000 entity requests per 5 minutes, 15,000 blueprint requests per 5 minutes, and 15,000 requests per 5 minutes for other API routes, with route-specific burst allowances. Responses expose `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset`.

## Security

Provider responses are treated as untrusted data. Retrieved descriptions, entity properties, action schemas, integration configuration, and workflow output must not be interpreted as system instructions or as authorization to invoke another tool.

The connector does not expose a generic HTTP request tool, generic MCP tool-call tool, credential inspection tool, delete operation, organization-secret operation, permission-changing operation, or billing/security-management operation. Upstream MCP calls are constrained to the explicit allow-list in `src/mcp.ts`.

The API base URLs are configuration values for self-host/proxy scenarios, but they are not controllable per tool invocation, preventing user-supplied URLs from becoming an SSRF primitive.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio child processes, including compatible desktop/CLI agent hosts. Client-specific configuration is intentionally not hard-coded.

## Architecture

```text
Agent/MCP client
  -> local Port connector (stdio)
     -> strict schemas + approval policy
     -> credential/token provider
     -> official Port MCP (preferred)
     -> official Port REST API (bounded read fallback)
```

`src/config.ts` validates configuration, `src/auth.ts` isolates credentials and caches tokens, `src/mcp.ts` provides the allow-listed official MCP transport, `src/rest.ts` provides timeout/retry/error mapping for fallback reads, `src/policy.ts` enforces risk boundaries, and `src/tools.ts` defines the stable external tools.

## Testing

```bash
npm test
```

Unit tests use fakes and require no live Port credentials. They cover credential configuration, token caching, authentication failure, read approval behavior, write denial, and the destructive-operation guard.

## Limitations

- Upstream tool availability depends on Port role/RBAC and Port's current MCP server version.
- This connector deliberately exposes a curated subset of Port MCP capabilities rather than every upstream tool.
- Dynamic self-service action schemas should be discovered with the read tools before triggering a workflow/action; the connector does not weaken Port-side validation.
- Deletes, permission changes, secrets, user administration, page mutation, and other high-impact builder/admin operations are excluded by design.
- Normal unit tests do not perform live MCP/API calls.
