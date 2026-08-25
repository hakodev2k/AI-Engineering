# Airtable MCP/API Connector

Reusable MCP server for Airtable. The connector exposes a stable provider-scoped tool contract while preferring Airtable's official remote MCP server for supported record/base operations and falling back to Airtable's official Web API when MCP is unavailable, unauthenticated, or does not expose a compatible tool schema.

## Upstream strategy

Airtable maintains an official remote MCP server at `https://mcp.airtable.com/mcp`. Airtable documents support for reading/analyzing records, creating/updating records, creating bases, interface access, forms, interfaces, and automation drafts. Tool names and capabilities may change over time, so this connector discovers upstream tools dynamically and only calls known Airtable tool aliases when their required input schema can be satisfied. Otherwise the stable external tool falls back to the official REST API.

Implemented REST base URL: `https://api.airtable.com/v0`.

Official references:

- https://support.airtable.com/docs/using-the-airtable-mcp-server
- https://airtable.com/developers/web/api/introduction
- https://support.airtable.com/docs/creating-personal-access-tokens
- https://support.airtable.com/docs/managing-api-call-limits-in-airtable
- https://support.airtable.com/docs/airtable-webhooks-api-overview

## Authentication

Use a Personal Access Token (PAT) for direct API access, or an OAuth access token obtained by your application. Legacy user API keys no longer access Airtable's API.

`AIRTABLE_TOKEN` is always required because REST is the safety fallback. To use the official MCP path, set `AIRTABLE_MCP_TOKEN` to a token accepted by the Airtable MCP connection and leave `AIRTABLE_USE_MCP=true`. If MCP authentication is browser-managed by an external host instead of available to this process, set `AIRTABLE_USE_MCP=false`; the connector still works through the Web API.

Credentials stay inside the connector transport layer and are never returned through MCP tool output.

Recommended read-only scopes:

- `data.records:read`
- `schema.bases:read`
- `data.recordComments:read`
- `workspacesAndBases:read`

Add only when needed:

- `data.records:write` for record writes/deletes
- `data.recordComments:write` for comments
- `schema.bases:write` for schema/base creation workflows where required

Token resource access should be restricted to only the bases/workspaces the integration needs.

## Environment

Copy `.env.example` and set values in your runtime or secret manager.

- `AIRTABLE_TOKEN` — PAT/OAuth bearer token for Web API fallback.
- `AIRTABLE_MCP_URL` — defaults to Airtable's official MCP endpoint.
- `AIRTABLE_MCP_TOKEN` — optional MCP bearer token.
- `AIRTABLE_USE_MCP` — defaults to `true`.
- `AIRTABLE_ALLOWED_BASES` — comma-separated allowlist of base IDs; empty means no connector-level restriction.
- `AIRTABLE_ALLOWED_TABLES` — comma-separated table names/IDs or `base/table` pairs.
- `AIRTABLE_APPROVAL_SECRET` — secret used to verify explicit approvals for write/high-risk/destructive tools.
- `AIRTABLE_TIMEOUT_MS` — default `15000`.
- `AIRTABLE_MAX_RETRIES` — default `3`, bounded to `0..5`.

## Installation

Requires Node.js 20 or later.

```bash
npm install
npm run build
npm test
```

Run as an MCP stdio server:

```bash
npm start
```

Any MCP host that supports stdio servers can launch the built `dist/server.js`. Compatibility depends on the host's normal MCP stdio support; no host-specific extension is required.

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `airtable.base.list` | official MCP, REST fallback | READ | No |
| `airtable.base.create` | official MCP, REST fallback | HIGH_RISK | Yes |
| `airtable.schema.get` | REST | READ | No |
| `airtable.record.list` | official MCP, REST fallback | READ | No |
| `airtable.record.get` | official MCP, REST fallback | READ | No |
| `airtable.record.create` | official MCP, REST fallback | WRITE | Yes |
| `airtable.record.update` | official MCP, REST fallback | WRITE | Yes |
| `airtable.record.delete` | official MCP, REST fallback | DESTRUCTIVE | Yes |
| `airtable.comment.list` | REST | READ | No |
| `airtable.comment.create` | REST | WRITE | Yes |

The connector intentionally does not expose an unrestricted `request(url, body)` tool.

## Approval model

READ tools may run automatically after allowlist validation. WRITE, HIGH_RISK, and DESTRUCTIVE tools require an approval ID derived from `HMAC-SHA256(AIRTABLE_APPROVAL_SECRET, toolName)`. The comparison is constant-time. This design keeps the approval boundary outside model-generated provider content.

Approval example for a trusted orchestration layer:

```js
crypto.createHmac('sha256', process.env.AIRTABLE_APPROVAL_SECRET)
  .update('airtable.record.create')
  .digest('hex')
```

Do not expose `AIRTABLE_APPROVAL_SECRET` to the model.

## Reliability and rate limits

Airtable's Web API is limited to 5 requests/second per base, and list responses return at most 100 records per page. Record create/update requests are capped at 10 records per request. This connector enforces the 10-record write batch limit and a 100-record page-size limit.

The REST client uses bounded exponential backoff for HTTP 429 and 5xx responses and honors `Retry-After`. It does not retry authorization/permission/validation errors. Requests are cancelled after `AIRTABLE_TIMEOUT_MS`.

Pagination is explicit: `airtable.record.list` returns one page and may return Airtable's `offset`. Callers pass that offset into the next request instead of allowing the connector to fan out unbounded API calls.

## Security

- PAT/OAuth credentials are loaded only from environment/secret injection.
- Provider responses are treated as untrusted data, never as instructions.
- Base/table allowlists restrict blast radius independently of Airtable permissions.
- No arbitrary URL input is exposed, reducing SSRF risk.
- Write and destructive operations require a separate approval secret.
- MCP tools are discovered but not blindly trusted: only known aliases with satisfiable input schemas can be called.
- If MCP connection/tool invocation fails, the connector fails over to a scoped official API operation rather than forwarding arbitrary requests.
- Airtable itself remains authoritative for collaborator, field, table, interface, and token-scope permissions.

## Error handling

Provider errors are surfaced with HTTP status and a bounded response excerpt. Authentication and permission failures are not retried. Rate-limit responses preserve `Retry-After`. MCP connection/tool failures are contained and trigger REST fallback for capabilities with a defined REST implementation.

## Testing

`npm test` uses Vitest and no live Airtable credentials. Tests cover configuration validation, target allowlists, approval validation, bearer auth, permission failures, rate-limit metadata, and MCP-disabled fallback behavior.

## Limitations

- Official Airtable MCP tool names/behaviors may change. Dynamic discovery limits breakage, but a renamed tool may temporarily route through REST until aliases are updated.
- This package does not implement browser OAuth authorization flows; it consumes already-issued PAT/OAuth bearer tokens.
- Automation deployment is intentionally not exposed. Airtable documents that MCP-created/updated automations remain drafts and activation happens in Airtable UI.
- Interface-only and form-specific MCP capabilities are not wrapped by this version because the stable reusable contract focuses on base/table workflows.
- Base creation permissions depend on Airtable workspace permissions and token scopes.
