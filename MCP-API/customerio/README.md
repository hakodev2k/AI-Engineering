# Customer.io MCP/API Connector

Reusable MCP server for Customer.io customer-engagement workflows. It exposes a stable, provider-scoped tool contract while keeping API and OAuth credentials inside the connector process.

## Upstream strategy

Customer.io currently provides an official remote MCP server over HTTP at `https://mcp.customer.io/mcp` for US accounts and `https://mcp-eu.customer.io/mcp` for EU accounts. Customer.io documents the MCP server as OAuth-authenticated, workspace-scoped, and permission-scoped; the default scope is `read`, with additional scopes for sensitive reads, writes, and deletes. Customer.io also provides its official App API at `https://api.customer.io` and `https://api-eu.customer.io`.

This connector uses the official MCP server only for authenticated capability discovery and `cio_auth_status`. It uses the official App API for its stable, narrow business tools because those contracts can be constrained to specific endpoints and App API key permissions without exposing Customer.io MCP's generic `cio_read_api`, `cio_write_api`, or `cio_delete_api` passthrough tools to agents. This deliberately follows the safer API fallback path for reusable automation while still validating the official MCP surface.

Official sources researched on 2026-09-02:
- https://docs.customer.io/ai/mcp/get-started/
- https://docs.customer.io/ai/mcp/ide/
- https://docs.customer.io/integrations/api/app/
- https://docs.customer.io/integrations/api/customerio-apis/
- https://docs.customer.io/integrations/api/app/tag/send-messages/
- https://docs.customer.io/integrations/api/app/tag/segments/listsegments/
- https://docs.customer.io/integrations/api/app/tag/customers/getpeoplefilter/

## Capabilities

The server implements 18 tools: official MCP tool discovery and auth status; segment listing and membership; customer search, attributes, segments, activities, and delivery history; campaign listing and actions; broadcast listing, metadata and triggers; transactional metadata and metrics; plus two explicitly approved send operations.

No generic HTTP passthrough, delete operation, live-data mutation, billing operation, permission change, profile deletion, or arbitrary MCP tool invocation is exposed.

## Authentication and scopes

`CUSTOMERIO_APP_API_KEY` is required. App API requests use `Authorization: Bearer <key>`. Customer.io App API keys can be created with scopes; grant only the read/send permissions needed for the implemented tools.

`CUSTOMERIO_MCP_ACCESS_TOKEN` is optional and only needed for the two `customerio.mcp.*` tools. Customer.io's official MCP uses OAuth and prompts users to choose workspaces and permissions. The connector does not implement an interactive browser login. Supply an OAuth access token through a secure host/secret provider if MCP inspection is required; never place it in prompts or tool parameters.

Documented Customer.io MCP scopes include `read` by default plus `read:sensitive`, `write`, and `delete` where allowed. This connector never requests or uses delete functionality. Sensitive profile data is not necessary for its default workflows.

## Environment

- `CUSTOMERIO_APP_API_KEY` — required App API key.
- `CUSTOMERIO_REGION` — `us` or `eu`, default `us`.
- `CUSTOMERIO_API_BASE_URL` — optional override; defaults by region.
- `CUSTOMERIO_MCP_URL` — optional override; defaults by region.
- `CUSTOMERIO_MCP_ACCESS_TOKEN` — optional OAuth token for MCP inspection only.
- `CUSTOMERIO_TIMEOUT_MS` — 1000–120000, default 15000.
- `CUSTOMERIO_MAX_RETRIES` — 0–5, default 2.
- `CUSTOMERIO_REQUIRE_WRITE_APPROVAL` — defaults true.
- `CUSTOMERIO_APPROVED_ACTIONS` — comma-separated approval fingerprints controlled outside agent input.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The connector exposes a stdio MCP server and can be launched by MCP clients capable of running local stdio servers, including general-purpose agent hosts that implement MCP stdio process configuration.

## Tool list and risk model

| Tool | Transport | Risk | Approval |
|---|---|---:|---|
| `customerio.mcp.tools.list` | official MCP | READ | none |
| `customerio.mcp.auth.status` | official MCP | READ | none |
| `customerio.segment.list` | App API | READ | none |
| `customerio.segment.members.list` | App API | READ | none |
| `customerio.customer.search` | App API | READ | none |
| `customerio.customer.attributes.get` | App API | READ | none |
| `customerio.customer.segments.get` | App API | READ | none |
| `customerio.customer.activities.list` | App API | READ | none |
| `customerio.customer.messages.list` | App API | READ | none |
| `customerio.campaign.list` | App API | READ | none |
| `customerio.campaign.actions.list` | App API | READ | none |
| `customerio.broadcast.list` | App API | READ | none |
| `customerio.broadcast.get` | App API | READ | none |
| `customerio.broadcast.triggers.list` | App API | READ | none |
| `customerio.transactional.get` | App API | READ | none |
| `customerio.transactional.metrics.get` | App API | READ | none |
| `customerio.transactional.email.send` | App API | HIGH_RISK | explicit exact approval |
| `customerio.broadcast.trigger` | App API | HIGH_RISK | explicit exact approval |

Sending an external message or triggering a broadcast is never self-approved by a tool argument. Approval fingerprints must be injected through connector configuration. Normal WRITE approval can be configured for future scoped writes, but HIGH_RISK remains blocked unless its exact fingerprint is present.

## Rate limits and reliability

Customer.io documents a general App API limit of 10 requests per second, while API-triggered broadcasts are limited to one request every 10 seconds. Transactional send endpoints share a high-throughput soft ingress limit documented as 3000 requests per 3 seconds. The connector does not attempt to saturate any of these limits.

GET requests and the semantically read-only customer-search POST use bounded exponential backoff for network failures, HTTP 429, and 5xx responses. External send operations are not blindly retried. `Retry-After` is preserved when supplied. Each call has a cancellation-backed timeout.

Pagination is deliberately bounded at the tool/request level. The segment-members tool returns one bounded page rather than automatically pulling an unbounded audience.

## Validation and errors

Identifiers, numeric IDs, enum values, limits, timestamps, and message inputs are validated with Zod before provider calls. Provider HTTP errors preserve status and retry hints in the connector client. Authentication and permission failures are not retried. Unknown or malformed JSON is never interpreted as instructions.

## Security considerations

- API and OAuth tokens live only in configuration/transport layers.
- There is no `execute_any_api_request` tool.
- Customer.io-returned profile and message content is untrusted data, not agent instruction.
- The optional MCP integration lists tools and calls only the documented `cio_auth_status`; newly discovered tools are not auto-trusted or auto-invoked.
- No delete tools are exposed even though the upstream MCP supports a delete scope/tool.
- Broadcast and transactional sends require explicit connector-side human approval.
- Use a dedicated App API key with minimum scopes and rotate it if exposed.
- Use Customer.io account controls to keep sensitive attributes unavailable to MCP unless there is a reviewed need.

## Testing

`npm test` uses mocks and requires no live Customer.io credentials. Tests cover required configuration, regional endpoints, credential isolation, rate-limit retry behavior, no blind retry for sends, and high-risk approval denial/allow behavior.

## Limitations

The connector intentionally omits profile mutation/deletion, segment creation/deletion, newsletter publishing, webhook management, live-data mutation, and generic Customer.io MCP API passthrough. Customer.io's official MCP can perform broader workspace operations, but those capabilities are not automatically safe for reusable autonomous agents. The optional MCP access token must be acquired by an OAuth-capable host; this package does not perform an interactive OAuth browser flow.
