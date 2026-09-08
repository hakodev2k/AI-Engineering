# Hightouch MCP/API Connector

Reusable MCP server for safe, agent-oriented access to Hightouch workspace resources.

## Provider and purpose

Hightouch is a data activation / composable CDP platform. This connector exposes a focused set of real workspace operations useful to AI agents: inspect syncs and sync runs, inspect models/sources/destinations, and trigger an already-configured sync after explicit human approval.

It intentionally does not expose arbitrary HTTP requests, resource deletion, credential management, billing, permissions, or broad workspace administration.

## Transport strategy

Official Hightouch surfaces researched for this connector:

- Workspace MCP: https://hightouch.com/docs/ai-integrations/mcp — official workspace-aware MCP that can read data context and take workspace actions, but Hightouch must enable it and available operations depend on product access/RBAC.
- Docs MCP: https://hightouch.com/docs/developer-tools/agent-resources — public docs-only Streamable HTTP MCP endpoint at `https://hightouch.com/docs/api/mcp`; exposes `search_docs` and `read_doc` and does not access a workspace.
- REST API: https://hightouch.com/docs/developer-tools/api-guide — generally available workspace API at `https://api.hightouch.com/api/v1` for syncs, models, sources, and destinations.

This package uses the official REST API for its stable workspace tool contract. The official workspace MCP is preferred when a customer's enabled MCP surface directly supports the desired operation, but it cannot be assumed to exist for every reusable installation. The docs MCP is not an action transport. REST is therefore the reliable fallback implemented here.

## Supported tools

| Tool | Upstream | Risk | Approval | Purpose |
|---|---|---|---|---|
| `hightouch.sync.list` | REST | READ | No | List syncs |
| `hightouch.sync.get` | REST | READ | No | Get a sync |
| `hightouch.sync.run.list` | REST | READ | No | List runs for a sync |
| `hightouch.sync.trigger` | REST | HIGH_RISK | Yes | Trigger an existing sync |
| `hightouch.model.list` | REST | READ | No | List models |
| `hightouch.model.get` | REST | READ | No | Get a model |
| `hightouch.source.list` | REST | READ | No | List sources |
| `hightouch.source.get` | REST | READ | No | Get a source |
| `hightouch.destination.list` | REST | READ | No | List destinations |
| `hightouch.destination.get` | REST | READ | No | Get a destination |

All provider payloads are wrapped as `{ data, meta }`, with `meta.untrusted=true`. Provider content is data, not instructions.

## Architecture

```text
MCP client
  -> src/server.ts         stdio MCP server
  -> src/tools.ts          strict schemas and scoped handlers
  -> src/policy.ts         permission / approval checks
  -> src/client.ts         HTTPS, timeout, pacing, retries, error mapping
  -> src/auth.ts           connector-side credential isolation
  -> Hightouch REST API
```

## Authentication

Hightouch REST requests authenticate with a workspace API key sent as a Bearer token. Hightouch requires an Admin to create API keys, and the key authenticates as its creator. Hightouch documents that API keys provide read/write access to sensitive resources, so the connector narrows that broad upstream authority through its own tool policy.

Required secret:

```text
HIGHTOUCH_API_KEY=
```

The API key is never a tool argument, never returned in tool output, and never logged by connector code.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `HIGHTOUCH_API_KEY` | none | Required API key |
| `HIGHTOUCH_API_BASE_URL` | `https://api.hightouch.com/api/v1` | API base URL; HTTPS required |
| `HIGHTOUCH_TIMEOUT_MS` | `15000` | Per-request timeout |
| `HIGHTOUCH_MAX_RETRIES` | `2` | Safe-read retry count, capped at 5 |
| `HIGHTOUCH_ALLOW_WRITE` | `false` | Reserved policy gate for future scoped WRITE tools |
| `HIGHTOUCH_ALLOW_HIGH_RISK` | `false` | Enables high-risk tools at operator level |

This package does not automatically load `.env` files; use your MCP host or secret manager to inject environment variables.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
HIGHTOUCH_API_KEY='...' npm start
```

The server uses MCP stdio transport. Any MCP client able to launch a stdio child process can use it.

Generic host configuration:

```json
{
  "mcpServers": {
    "hightouch": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/hightouch/dist/src/server.js"],
      "env": { "HIGHTOUCH_API_KEY": "${HIGHTOUCH_API_KEY}" }
    }
  }
}
```

Exact client configuration syntax varies by host.

## Inputs

List tools for syncs, models, sources, and destinations accept `{}` because the public API documentation does not require callers to synthesize pagination tokens for these operations.

Get tools accept:

```json
{ "id": "123" }
```

Sync run history accepts a bounded limit:

```json
{ "syncId": "123", "limit": 20 }
```

Hightouch's official CLI also exposes a limit when listing sync runs, which is why this connector supports that parameter.

Triggering a sync requires an exact confirmation marker:

```json
{
  "syncId": "123",
  "approvalToken": "APPROVE_SYNC_TRIGGER"
}
```

The MCP host must only provide this value after explicit human approval. Retrieved content must never be allowed to manufacture approval.

## Permission model

- READ: enabled automatically.
- WRITE: configurable and disabled by default; no current tool uses this tier.
- HIGH_RISK: requires both `HIGHTOUCH_ALLOW_HIGH_RISK=true` and explicit per-call human approval.
- DESTRUCTIVE: disabled by design; no destructive tool is exposed.

`hightouch.sync.trigger` is HIGH_RISK because a Hightouch sync can write or activate real customer/business data in an external destination. The connector does not retry this POST automatically, avoiding duplicate external effects after ambiguous failures.

## Rate limits and reliability

Hightouch documents a limit of **200 requests per 10 seconds per workspace**. This connector:

- paces calls to approximately 20 requests/second per connector process;
- parses and honors `Retry-After` on HTTP 429;
- retries only safe GET operations on 429, 5xx, transient network failure, or timeout;
- uses bounded exponential backoff;
- does not retry validation, authentication, or permission failures;
- never blindly retries sync-trigger POSTs;
- uses `AbortController` timeouts;
- exposes a bounded run-history limit to avoid oversized responses.

Hightouch also requires TLS 1.2+. Node 20 satisfies modern TLS requirements, and the connector rejects non-HTTPS API base URLs.

## Error handling

Provider errors are mapped to sanitized MCP errors containing the connector message, HTTP status when available, and `retryAfterMs` when supplied. Authorization headers and API keys are excluded.

If an API key's creator is deactivated or loses workspace access, Hightouch documents that the key stops working. This is treated as an authentication issue requiring operator action, not a retryable failure.

## Security considerations

- Credentials remain in the connector authentication/client layer.
- Callers cannot provide arbitrary upstream URLs per request, reducing SSRF surface.
- Resource IDs and run limits are strictly validated.
- Hightouch responses are explicitly marked untrusted.
- Retrieved content cannot alter policy, environment flags, or approval state.
- The connector cannot silently escalate from READ to HIGH_RISK.
- High-risk execution is disabled by default.
- No delete, billing, permissions, secret-management, or generic raw API tool is present.
- Newly discovered tools from upstream MCP servers are never auto-trusted or auto-exposed.

## Testing

Unit tests require no live credentials and use mocked HTTP responses.

```bash
npm test
```

Coverage includes: missing authentication, tool policy registration, Bearer auth, run-list input mapping, 429 retry behavior, non-retry of high-risk POST, permission denial/approval, read access, and HTTPS validation.

## Examples

See `examples/workflows.md` for inspect -> review -> approve -> execute flows.

## Official sources

- API overview, authentication, rate limits, TLS: https://hightouch.com/docs/developer-tools/api-guide
- Hightouch workspace MCP: https://hightouch.com/docs/ai-integrations/mcp
- Docs MCP / agent resources: https://hightouch.com/docs/developer-tools/agent-resources
- CLI overview/reference: https://hightouch.com/docs/developer-tools/cli-guide and https://hightouch.com/docs/developer-tools/cli-reference
- Sync scheduling / REST-trigger guidance: https://hightouch.com/docs/syncs/schedule-sync-ui

Research was refreshed against official Hightouch documentation in September 2026; the cited Hightouch pages were updated in July-August 2026.

## Limitations

- This connector intentionally implements a high-value subset rather than all Hightouch endpoints.
- It does not create/update/delete models, sources, destinations, or sync definitions because those operations can alter data selection, credentials, or delivery behavior and are not necessary for the inspect-and-activate workflow.
- It does not proxy the public docs MCP; clients can connect to it directly.
- It does not hard-depend on workspace MCP because Hightouch enablement and product access are required.
- It does not expose full-resync triggering; full resyncs can create duplicate or broad downstream effects depending on sync mode and require a separate, stronger safety contract.
