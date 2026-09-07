# Metabase MCP/API Connector

Reusable MCP server for safe, agent-oriented access to a configured Metabase instance.

## Provider and transport strategy

Metabase is a business-intelligence platform with an official MCP server, a versioned Agent API, and the broader Metabase REST API.

Official sources researched for this connector:

- MCP server: https://www.metabase.com/docs/latest/ai/mcp
- Agent API: https://www.metabase.com/docs/latest/ai/agent-api
- API keys: https://www.metabase.com/docs/latest/people-and-groups/api-keys
- Working with the Metabase API: https://www.metabase.com/learn/metabase-basics/administration/administration-and-operation/metabase-api
- API changelog: https://www.metabase.com/docs/latest/developers-guide/api-changelog

Metabase's official MCP endpoint is served by each enabled instance at:

```text
https://{your-metabase}/api/metabase-mcp
```

The official MCP flow is designed for an MCP client that authenticates a person against the Metabase instance. This connector intentionally does **not** proxy arbitrary upstream MCP tools or forward its service credential to an upstream MCP session. For reusable service-to-service operation it uses the official HTTP APIs with an API key held only inside the connector. The versioned Agent API is preferred for semantic-layer search; the regular REST API is used for content operations that the Agent API does not cover here.

The architecture is therefore:

```text
MCP client
  -> this connector (stdio MCP)
     -> validation + risk/approval policy
        -> Metabase Agent API for semantic search
        -> Metabase REST API for content/read/write workflows
           -> X-API-Key injected inside client layer
```

## Supported capabilities

The connector exposes 12 stable provider-scoped tools:

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `metabase.content.search` | REST `/api/search` | READ | No |
| `metabase.collection.tree` | REST | READ | No |
| `metabase.collection.get` | REST | READ | No |
| `metabase.collection.items` | REST | READ | No |
| `metabase.question.get` | REST | READ | No |
| `metabase.question.run` | REST | READ | No |
| `metabase.dashboard.get` | REST | READ | No |
| `metabase.agent.search` | Agent API v1 | READ | No |
| `metabase.collection.create` | REST | WRITE | Yes |
| `metabase.dashboard.create` | REST | WRITE | Yes |
| `metabase.question.create_native` | REST | WRITE | Yes |
| `metabase.question.update_metadata` | REST | WRITE | Yes |

No delete, archive, permission-management, user-management, admin-setting, credential-management, or unrestricted raw API tool is exposed. Destructive operations are disabled by policy.

## Authentication and least privilege

Create a Metabase API key and assign it to a group with only the permissions needed by the data and collections the connector should access. API-key permissions are inherited from the group associated with the key.

The connector sends:

```http
X-API-Key: <credential stored in METABASE_API_KEY>
```

The key is loaded by `src/config.ts` and injected by `src/client.ts`. It is never accepted as an MCP tool argument, returned in tool output, or intentionally logged.

Metabase also supports session tokens and, for applicable plans/configurations, JWT authentication for the Agent API. This implementation deliberately supports only API-key authentication so that the credential model is small, explicit, and reusable. It does not request or manage user passwords, session tokens, or JWT signing secrets.

## Environment

Copy `.env.example` values into your secret-management mechanism:

```text
METABASE_BASE_URL=https://metabase.example.com
METABASE_API_KEY=...
METABASE_TIMEOUT_MS=15000
METABASE_MAX_RETRIES=3
METABASE_REQUIRE_WRITE_APPROVAL=true
```

`METABASE_BASE_URL` must be an HTTP(S) URL. Do not expose a privileged internal Metabase URL to untrusted users. For self-hosted deployments, network egress controls should restrict this connector to the intended Metabase host to reduce SSRF and lateral-movement risk.

## Installation

Requirements: Node.js 20 or later.

```bash
npm install
npm run build
npm start
```

The server uses MCP over stdio, so it can be launched by clients that support stdio MCP servers. Configure the client to execute the built `dist/src/index.js` process and provide environment variables through the client's secret/environment mechanism.

## Tool behavior

### Discovery and reading

`metabase.content.search` searches visible Metabase content without exposing a generic endpoint executor. `metabase.collection.tree`, `metabase.collection.get`, and `metabase.collection.items` support collection navigation. `metabase.question.get`, `metabase.question.run`, and `metabase.dashboard.get` support common BI inspection workflows.

`metabase.agent.search` calls the versioned Agent API endpoint `POST /api/agent/v1/search`. Metabase documents this endpoint family specifically for agentic BI and says it searches tables and metrics within the authenticated principal's permissions.

### Writes

Write tools accept only bounded, purpose-specific fields. They require `approval: true` in the MCP call, and the server removes that policy field before schema validation/provider dispatch. This makes approval explicit without leaking policy controls into the provider payload.

`metabase.question.create_native` constructs the Metabase card payload itself. The caller supplies only the database ID, collection, metadata, and SQL string; it cannot inject arbitrary card fields. The SQL is sent to Metabase as a saved native question definition. Database access remains governed by Metabase permissions and the configured database connection.

The connector intentionally does not expose deletion, trash/archive, permission graphs, API-key management, settings changes, or other administrative actions.

## Permission and approval model

- **READ** tools may execute automatically after input validation.
- **WRITE** tools require connector write permission and explicit human approval.
- **HIGH_RISK** would always require approval; no high-risk operation is currently exposed.
- **DESTRUCTIVE** operations are disabled by the policy layer.

Approval is an execution boundary, not a substitute for Metabase permissions. The API key's group should still be least-privileged.

## Reliability

`src/client.ts` provides:

- request timeout and cancellation propagation;
- bounded retry count (`0..5`);
- exponential backoff for safe GET retries;
- retry handling for `429`, `502`, `503`, and `504` on GET operations;
- `Retry-After` parsing for seconds or HTTP-date values;
- explicit provider error mapping;
- no blind retry of write operations;
- no retry of authentication, permission, or validation failures.

Metabase deployment limits depend on deployment/version and infrastructure, so this connector does not invent a fixed global quota. When Metabase returns HTTP 429 with `Retry-After`, the connector preserves that throttling signal for safe GET retries.

Collection listing is explicitly bounded by `limit <= 100` and an offset. Saved-question execution remains subject to Metabase's own query behavior and database limits.

The Agent API itself documents a maximum of 200 query rows per request and continuation-token pagination for its query endpoint. This connector currently exposes Agent API search but not the general Agent query endpoint, avoiding an under-specified generic query tool.

## Security considerations

Third-party/provider content is untrusted data. MCP clients and agents must not treat question names, dashboard descriptions, query result cells, collection text, or other Metabase-returned content as instructions. This connector returns provider data without allowing that data to mutate permissions or tool registration.

Security controls include:

- API key kept in environment/secret storage and injected only by the client layer;
- no tool accepts credentials;
- no unrestricted URL or arbitrary REST request tool;
- configured base URL is fixed after startup;
- strict Zod input validation and JSON-schema `additionalProperties: false`;
- bounded string and numeric inputs;
- write approval enforcement before provider calls;
- destructive tools disabled;
- no dynamic trust of newly discovered upstream MCP tools;
- no credential forwarding to the official upstream MCP server;
- safe error messages without intentional secret echoing.

For multi-user scenarios, prefer user-scoped authentication to Metabase's official MCP/Agent API when each user's Metabase permissions must be preserved individually. An API key represents the permissions of its assigned group, not an individual user's session.

## API compatibility

Metabase documents the general REST API as unversioned and warns that it can change. This connector therefore keeps its REST surface deliberately small and purpose-specific. Check Metabase's API changelog when upgrading Metabase.

The Agent API is versioned and explicitly intended for agentic BI. The official MCP server is built on that Agent API. This package does not claim that all Metabase REST endpoints are stable, nor does it expose undocumented administrative behavior.

## Testing

Normal tests require no live credentials:

```bash
npm test
```

The test suite covers configuration validation, write approval, destructive-operation denial, credential injection, provider error mapping, bounded rate-limit retry, tool registration/input validation, and approval denial. HTTP behavior uses a fake `fetch`; no real Metabase instance is required.

For deployment validation, run the built connector against a non-production Metabase instance with a least-privilege API key before enabling write tools in production workflows.

## Limitations

- The connector uses stdio transport downstream; it does not itself host Streamable HTTP or SSE.
- It does not proxy Metabase's official MCP server because doing so would require a separate interactive/user authentication lifecycle and dynamic upstream tool handling.
- It does not implement the full Metabase API.
- It does not expose destructive/admin operations.
- It does not manage OAuth/JWT/session lifecycle.
- General Metabase REST APIs are unversioned and may require connector updates after a Metabase upgrade.
- Agent API query construction/execution is intentionally not exposed until a stable, tightly validated query contract is implemented; saved-question execution is provided instead.
