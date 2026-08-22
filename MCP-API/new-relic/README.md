# New Relic MCP/API Connector

Reusable local MCP server for New Relic observability workflows. It exposes a stable provider-scoped tool contract for accounts, entities, relationships, NRQL, and alert policies while keeping New Relic credentials inside the connector process.

## Transport strategy

New Relic provides an official remote MCP server and currently documents it as a preview feature. Regional endpoints are:

- US: `https://mcp.newrelic.com/mcp/`
- EU: `https://mcp.eu.newrelic.com/mcp/`
- JP: `https://mcp.jp.newrelic.com/mcp/`

The official MCP server supports OAuth or New Relic user API-key authentication and supports tool filtering through the `include-tags` header. New Relic documents tool groups including discovery, data access, alerting, incident response, performance analytics, and advanced analysis.

This connector does not automatically proxy the preview MCP tool surface. For the implemented operations it uses New Relic's recommended NerdGraph GraphQL API because NerdGraph provides stable typed query/mutation contracts, explicit pagination, and deterministic mutation semantics. This prevents a preview MCP server from silently expanding the effective tool set. The official MCP server remains the preferred direct integration when a client wants New Relic's broader preview analysis tools and accepts preview stability.

New Relic announced that REST API v2 and Deployments v0 are scheduled for end of life on July 31, 2027, and recommends NerdGraph migrations, so this connector intentionally does not build on legacy REST v2.

## Official sources researched

- Official New Relic MCP setup: https://docs.newrelic.com/docs/agentic-ai/mcp/setup/
- Official New Relic MCP tool reference: https://docs.newrelic.com/docs/agentic-ai/mcp/tool-reference/
- NerdGraph introduction: https://docs.newrelic.com/docs/apis/nerdgraph/get-started/introduction-new-relic-nerdgraph/
- NerdGraph usage limits: https://docs.newrelic.com/docs/apis/nerdgraph/nerdgraph-usage-limits/
- Entity API tutorial: https://docs.newrelic.com/docs/apis/nerdgraph/examples/nerdgraph-entities-api-tutorial/
- NRQL with NerdGraph: https://docs.newrelic.com/docs/apis/nerdgraph/examples/nerdgraph-nrql-tutorial/
- Alert policies with NerdGraph: https://docs.newrelic.com/docs/apis/nerdgraph/examples/nerdgraph-api-alerts-policies/
- Alerts with NerdGraph: https://docs.newrelic.com/docs/alerts/scale-automate/nerdgraph/nerdgraph-api-examples/

## Runtime

- Node.js 20+
- TypeScript
- Model Context Protocol SDK over stdio
- Native `fetch` for NerdGraph HTTPS calls

Install and verify from this directory:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

Development:

```bash
npm run dev
```

## Authentication

NerdGraph uses a New Relic user API key in the `API-Key` request header. Configure:

```text
NEW_RELIC_USER_API_KEY=
```

The key must belong to a user with access to the requested accounts and features. New Relic RBAC remains authoritative; this connector never widens permissions or creates API keys.

Credentials are not part of any MCP tool schema and are never expected in model prompts or tool arguments.

```text
Agent -> MCP tool -> connector -> credential/config layer -> New Relic
```

## Region

Set `NEW_RELIC_REGION` to one of:

```text
US
EU
JP
```

The connector maps regions to official NerdGraph endpoints:

- US: `https://api.newrelic.com/graphql`
- EU: `https://api.eu.newrelic.com/graphql`
- JP: `https://api.jp.newrelic.com/graphql`

The endpoint is not user-selectable through a tool call, preventing arbitrary-origin requests.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `newrelic.account.list` | NerdGraph | READ | No |
| `newrelic.entity.search` | NerdGraph entity search | READ | No |
| `newrelic.entity.get` | NerdGraph entity | READ | No |
| `newrelic.entity.related.list` | NerdGraph related entities | READ | No |
| `newrelic.entity.tag.search` | NerdGraph entity search | READ | No |
| `newrelic.entity.non_reporting.list` | NerdGraph entity search | READ | No |
| `newrelic.nrql.query` | NerdGraph NRQL | READ | No |
| `newrelic.alert.policy.list` | NerdGraph alerts | READ | No |
| `newrelic.alert.policy.get` | NerdGraph alerts | READ | No |
| `newrelic.alert.policy.create` | NerdGraph mutation | WRITE | Required by default |
| `newrelic.alert.policy.update` | NerdGraph mutation | WRITE | Required by default |
| `newrelic.alert.policy.delete` | NerdGraph mutation | DESTRUCTIVE | Required + disabled by default |

No generic GraphQL execution tool is exposed. GraphQL documents are owned by the connector; callers provide only scoped validated inputs.

## Real-world workflows

Typical read workflow:

```text
account.list
  -> entity.search
  -> entity.get
  -> entity.related.list
  -> nrql.query
```

Alert-policy workflow:

```text
alert.policy.list
  -> alert.policy.get
  -> recommend change
  -> operator approval
  -> alert.policy.update
```

Deletion remains a separate strongly guarded action.

## Environment variables

See `.env.example`.

- `NEW_RELIC_USER_API_KEY`: required secret.
- `NEW_RELIC_REGION`: `US`, `EU`, or `JP`; default `US`.
- `NEW_RELIC_TIMEOUT_MS`: HTTP timeout from 1 to 60 seconds; default 15 seconds.
- `NEW_RELIC_APPROVAL_MODE`: `required` by default; `disabled` only when an external policy engine provides equivalent control.
- `NEW_RELIC_APPROVED_ACTIONS`: comma-separated write actions approved by an operator.
- `NEW_RELIC_ALLOW_DESTRUCTIVE`: `false` by default.

Approval is connector configuration, not a tool parameter. The model cannot self-approve by adding a field to its request.

## Permissions and least privilege

New Relic user keys inherit the permissions and account grants of their users. Provision a dedicated user/service identity where appropriate and grant only the accounts and product permissions required by enabled tools.

Recommended boundaries:

- Account/entity/NRQL reads: read access only to necessary accounts/data.
- Alert-policy reads: alert viewing rights for necessary accounts.
- Alert-policy create/update/delete: alert-management rights only where operationally required.
- Do not grant organization administration, API-key management, billing, user management, or security-administration privileges for this connector.

New Relic's official MCP documentation likewise states that MCP actions are governed by the RBAC permissions of the configured API key or OAuth profile.

## Approval model

Default policy:

```text
READ        -> automatic
WRITE       -> explicit operator approval by default
HIGH_RISK   -> explicit operator approval
DESTRUCTIVE -> explicit approval + destructive enablement
```

Example create approval:

```text
NEW_RELIC_APPROVED_ACTIONS=newrelic.alert.policy.create
```

Delete additionally requires:

```text
NEW_RELIC_APPROVED_ACTIONS=newrelic.alert.policy.delete
NEW_RELIC_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals after the intended change window.

## Pagination

Entity search returns `nextCursor`; callers may pass that cursor to the next scoped entity-search call. New Relic documents a maximum of 200 entities per entity-search response.

Alert-policy listing also returns `nextCursor` and accepts the next cursor on later calls.

The connector does not automatically crawl every page, which prevents accidental large account-wide scans.

## Rate limits and reliability

NerdGraph guarantees up to 25 concurrent requests per user. New Relic states that NerdGraph is concurrency-limited rather than request-rate-limited; requests over the concurrency limit may receive HTTP 429.

This connector performs one upstream request per MCP tool call. It retries read-only operations up to three total attempts for transient network failures and HTTP 429 responses, using bounded backoff and honoring `Retry-After` when present. Mutations are never automatically retried because their remote outcome may be uncertain.

Every request has a configurable timeout. Authentication/authorization errors, GraphQL errors, validation errors, and mutation failures fail immediately rather than being blindly retried.

## Security considerations

- User API keys never appear in tool inputs.
- The connector only sends credentials to the configured official regional NerdGraph endpoint.
- There is no generic HTTP, REST, GraphQL, or arbitrary-URL escape hatch.
- Entity-search inputs are bounded; tag keys use a restricted character set.
- IDs and GUIDs use bounded validated formats.
- NRQL is intentionally exposed only as a read query interface; it cannot invoke NerdGraph mutations.
- Alert writes use connector-owned GraphQL mutations and strict enumerations.
- Provider-returned entity names, tags, telemetry, NRQL values, and alert metadata are untrusted data, never policy or instructions.
- Approval state is outside model-controlled tool arguments.
- Destructive alert-policy deletion is disabled by default.
- Mutations are never automatically retried.
- The preview official MCP server is not chained automatically, so newly introduced upstream MCP tools cannot silently expand permissions.

## Official MCP security posture

If using New Relic's official MCP server directly, prefer OAuth where practical, apply least-privilege New Relic RBAC, and use `include-tags` to restrict the exposed tool groups. Do not automatically trust newly added preview tools without review.

The official MCP server currently advertises categories such as `discovery`, `data-access`, `alerting`, `incident-response`, `performance-analytics`, and `advanced-analysis`. This connector intentionally does not mirror that dynamic preview inventory.

## Error handling

Expected categories include:

- configuration validation errors for missing/invalid environment values;
- `APPROVAL_REQUIRED` for unapproved writes;
- `DESTRUCTIVE_DISABLED` for deletion without destructive enablement;
- `VALIDATION_ERROR` for semantically incomplete write requests;
- `NETWORK_OR_TIMEOUT` after bounded read retries;
- `NewRelicApiError` for HTTP or GraphQL errors.

Error objects never intentionally include the configured API key.

## Testing

Unit tests use mocked `fetch` and require no live New Relic account. Coverage includes:

- missing credentials;
- regional endpoint selection;
- approved and denied writes;
- destructive default denial;
- API-key header placement;
- GraphQL error mapping;
- no mutation retries;
- bounded read throttling retry;
- intended scoped MCP tool registration;
- absence of a generic GraphQL escape hatch.

Run:

```bash
npm test
```

## MCP client configuration

Any MCP client that can launch a local stdio server can use the built connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/new-relic/dist/src/server.js"],
  "env": {
    "NEW_RELIC_USER_API_KEY": "provided-by-secret-manager",
    "NEW_RELIC_REGION": "US"
  }
}
```

Do not commit real keys into client configuration.

Clients that support remote HTTP MCP can instead connect directly to New Relic's official MCP endpoint when they explicitly want its preview analysis tools and authentication flow.

## Limitations

- This is a focused connector, not a complete NerdGraph wrapper.
- New Relic's official MCP server is researched and documented but not proxied because it is currently preview and exposes a dynamic analysis-oriented tool surface.
- OAuth for the official remote MCP server is not implemented by this local connector; this connector uses a New Relic user API key for NerdGraph.
- NRQL queries remain subject to New Relic NRQL data/query limits.
- The connector does not expose account/user/key administration, billing, workflows, destinations, muting rules, condition CRUD, dashboard mutations, deployments, or security configuration.
- Alert-policy deletion is intentionally disabled by default.
- Legacy REST API v2 is intentionally not used.
