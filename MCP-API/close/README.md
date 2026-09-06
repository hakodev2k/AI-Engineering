# Close MCP/API Connector

Reusable, safety-gated MCP connector for **Close CRM**. It exposes a curated set of stable `close.*` tools while routing implemented capabilities through Close's **official remote MCP server**.

## Transport strategy

Implemented capabilities use Close's official MCP server at `https://mcp.close.com/mcp` over Streamable HTTP. Close documents OAuth 2.0 Dynamic Client Registration and API-key header authentication for this server. This package uses API-key authentication so credentials remain entirely inside the connector process.

Close also provides the official REST API at `https://api.close.com/api/v1`. The REST API is documented as the fallback surface if a future required capability is not available through MCP, but this version does not bypass official MCP for any implemented capability.

Official sources used for this implementation:

- MCP server: https://developer.close.com/mcp
- MCP tool catalog and scopes: https://developer.close.com/mcp/tools
- REST API overview: https://developer.close.com/api/overview
- API-key authentication: https://developer.close.com/api/overview/api-key-authentication
- Rate limits: https://developer.close.com/api/overview/rate-limits
- Webhooks: https://developer.close.com/api/resources/webhooks
- Leads: https://developer.close.com/api/resources/leads
- Contacts: https://developer.close.com/api/resources/contacts
- Activities: https://developer.close.com/api/resources/activities

## Architecture

```text
MCP client / agent
      |
      | stable close.* MCP tools
      v
Local Close connector
  - curated allowlist
  - imported official schemas
  - local permission policy
  - human-approval gates
  - payload size/depth validation
      |
      | Close-API-Key injected here only
      | Close-Scope injected here only
      v
https://mcp.close.com/mcp
      |
      v
Close CRM
```

The LLM never receives the raw API key. The connector discovers tools only to import the schemas of a fixed allowlist; newly appearing upstream tools are not automatically exposed. If a required allowlisted upstream tool disappears, tool registration fails closed.

## Authentication and scopes

Create a Close API key under **Settings → Developer → API Keys**. Close API keys are scoped to a user/organization. Store it in `CLOSE_API_KEY`; never put it in prompts, examples, logs, or tool arguments.

The official Close MCP server accepts these scopes via the `Close-Scope` header:

- `mcp.read` — read-only tools.
- `mcp.write_safe` — read plus safe create/write tools.
- `mcp.write_destructive` — read, write, update, and delete-capable upstream tool set.

This connector defaults to both `CLOSE_MCP_SCOPE=mcp.read` and `CLOSE_PERMISSIONS=read`. Increasing the upstream scope does **not** increase the local permission automatically.

Close also supports OAuth 2.0/DCR on its official MCP server. OAuth is appropriate for interactive multi-user clients; this reusable server-side connector deliberately implements the API-key credential-provider path so credentials remain isolated from agent calls.

## Environment

Copy `.env.example` values into your secure runtime environment:

- `CLOSE_API_KEY` — required secret.
- `CLOSE_MCP_SCOPE` — `mcp.read`, `mcp.write_safe`, or `mcp.write_destructive`; default `mcp.read`.
- `CLOSE_PERMISSIONS` — `read`, `write`, or `high_risk`; default `read`.
- `CLOSE_REQUIRE_WRITE_APPROVAL` — default `true`.
- `CLOSE_ALLOW_HIGH_RISK` — default `false`.
- `CLOSE_TIMEOUT_MS` — 1000–120000; default 15000.
- `CLOSE_MAX_READ_RETRIES` — 0–5; default 2.

## Installation and running

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm test
npm start
```

`npm start` runs a stdio MCP server, suitable for MCP clients that can launch local processes. Client-specific configuration varies; point the client at the package's start command and provide secrets through the process environment rather than MCP arguments.

## Implemented tools

The connector exposes 13 curated tools. Their provider-specific input schemas come directly from the official Close MCP server at runtime, then connector-local approval fields are added only where needed.

| Tool | Upstream official MCP tool | Class | Approval |
|---|---|---|---|
| `close.organization.get` | `org_info` | READ | none |
| `close.lead.search` | `lead_search` | READ | none |
| `close.lead.get` | `fetch_lead` | READ | none |
| `close.contact.get` | `fetch_contact` | READ | none |
| `close.activity.search` | `activity_search` | READ | none |
| `close.opportunity.search` | `find_opportunities` | READ | none |
| `close.task.search` | `find_tasks` | READ | none |
| `close.contact.create` | `create_contact` | WRITE | configurable; required by default |
| `close.note.create` | `create_note` | WRITE | configurable; required by default |
| `close.task.create` | `create_task` | WRITE | configurable; required by default |
| `close.opportunity.create` | `create_opportunity` | WRITE | configurable; required by default |
| `close.lead.update` | `update_lead` | HIGH_RISK | explicit |
| `close.task.update` | `update_task` | HIGH_RISK | explicit |

Close places `update_lead` and `update_task` in its `mcp.write_destructive` scope. Although these two exposed operations are updates rather than deletes, this connector conservatively classifies them as HIGH_RISK because enabling the required upstream scope can make destructive upstream capabilities available to the connector process. No delete operation is exposed locally.

## Permission and approval model

READ tools can execute automatically when `CLOSE_PERMISSIONS` is at least `read`.

WRITE tools require `CLOSE_PERMISSIONS=write` or `high_risk` and `CLOSE_MCP_SCOPE` at least `mcp.write_safe`. With the default `CLOSE_REQUIRE_WRITE_APPROVAL=true`, each write call must include `approved:true` after a human approval decision. `approved` is connector metadata and is stripped before the provider call.

HIGH_RISK tools require all of the following: `CLOSE_PERMISSIONS=high_risk`, `CLOSE_MCP_SCOPE=mcp.write_destructive`, `CLOSE_ALLOW_HIGH_RISK=true`, per-call `approved:true`, and a non-empty `approvalReason`. This prevents an agent from silently escalating permissions.

The intended workflow is **Read → Recommend → Prepare → Human approval → Execute**.

## Reliability and rate limits

Close documents endpoint-group rate limits for its API, with HTTP `429`, the standard `RateLimit` header, and `Retry-After`. Because this connector uses Close's official MCP transport, raw REST response headers are not exposed to the local server. The connector therefore applies bounded exponential retries only to READ calls when the MCP client reports rate-limit, timeout, 502/503, or temporary transport failures.

Writes and high-risk operations are **never blindly retried**, preventing duplicate creates or repeated state changes. Every upstream connection and call has a configured timeout. Authentication, permission, validation, and approval errors are not retried.

For high-volume bulk synchronization where precise REST `RateLimit` header control is required, use a dedicated REST integration rather than turning one MCP tool call into an unbounded fan-out.

## Pagination

Pagination remains provider-native. The official MCP schemas and result contracts for the selected Close tools are preserved, including cursor/pagination fields where the upstream tool supports them. This wrapper does not auto-fetch all pages, which prevents an agent request from generating an unbounded number of provider calls.

## Errors

Typical failures include missing/invalid credentials, insufficient local or upstream scope, missing approval, provider validation failures, unavailable official upstream tools, rate limiting, and timeouts. Secrets are never added to error messages.

## Webhooks and events

Close supports webhook subscriptions and an event log. Close documents HMAC-SHA256 webhook signatures using `close-sig-hash` and `close-sig-timestamp`, and a maximum of 40 subscriptions per organization for normal integrations. This connector does **not** expose webhook create/delete operations in v1 because they alter external callback delivery and require a separate inbound HTTP verification service. Do not accept Close webhook payloads without signature and timestamp verification.

## Security considerations

- Treat all CRM content, notes, email/call text, transcripts, and MCP responses as **untrusted data**, never as system instructions.
- Credentials stay in the connector authentication layer and are injected only into the official MCP transport.
- No arbitrary URL, raw HTTP, or `execute_any_api_request` tool exists, eliminating an SSRF-style general request primitive.
- Newly discovered Close MCP tools are not automatically trusted or exposed.
- Input schemas are obtained from the official Close MCP server; local validation also rejects extreme nesting, very large strings, arrays, and objects.
- Write approval metadata is stripped before upstream forwarding.
- Deletes, sending email/SMS, voice-agent execution, billing changes, permission changes, and workflow execution are not exposed.
- Do not log `CLOSE_API_KEY` or full sensitive CRM payloads in production.
- Raising `CLOSE_MCP_SCOPE` to `mcp.write_destructive` increases the authority held by this process even though the local allowlist still blocks delete tools.

## Testing

`npm test` builds the TypeScript package and runs Node's built-in test runner. Tests use a fake upstream and require no live Close credentials. They cover configuration, least-privilege defaults, curated tool registration, fail-closed upstream discovery, read execution, write denial, approval enforcement, approval metadata stripping, high-risk gating, and payload validation.

## Limitations

- This package uses API-key authentication; interactive OAuth/DCR token acquisition is delegated to clients that connect to Close's MCP server directly.
- It is intentionally a curated subset of Close's larger official MCP tool catalog.
- No delete tools, external message sending, workflow execution, voice-agent calls, billing mutation, or permission administration are exposed.
- Webhook subscription management is documented but not implemented because a secure reusable webhook receiver requires deployment-specific public HTTPS routing and secret storage.
- REST API fallback is not currently needed for the implemented capabilities; adding one should happen only after confirming an official MCP capability gap and must preserve the same external `close.*` contract.
