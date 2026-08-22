# Salesforce MCP Connector

Reusable local MCP gateway over Salesforce Hosted MCP Servers. It exposes a stable, provider-scoped tool contract while preserving Salesforce's own per-user authorization, field-level security, object permissions, sharing rules, and server-side governance.

## Transport strategy

Salesforce Hosted MCP Servers are generally available and are the preferred transport. This connector does not proxy Salesforce REST APIs broadly. Instead it routes capabilities to the narrowest official Salesforce server:

- READ -> `platform/sobject-reads`
- WRITE -> `platform/sobject-mutations`
- DESTRUCTIVE -> `platform/sobject-deletes`, disabled locally by default

Production endpoints use `https://api.salesforce.com/platform/mcp/v1/platform/...`; sandbox and scratch orgs use the `/sandbox/platform/...` form.

Official sources researched:

- Hosted MCP overview: https://developer.salesforce.com/docs/platform/hosted-mcp-servers/guide/hosted-mcp-servers-overview.html
- Standard servers: https://developer.salesforce.com/docs/platform/hosted-mcp-servers/references/reference/servers-reference.html
- SObject Reads: https://developer.salesforce.com/docs/platform/hosted-mcp-servers/guide/sobject-reads.html
- SObject Mutations: https://developer.salesforce.com/docs/platform/hosted-mcp-servers/guide/sobject-mutations.html
- SObject Deletes: https://developer.salesforce.com/docs/platform/hosted-mcp-servers/references/reference/sobject-deletes.html
- Salesforce MCP security guidance: https://developer.salesforce.com/docs/platform/hosted-mcp-servers/guide/general-best-practices.html
- Salesforce MCP ChatGPT setup: https://developer.salesforce.com/docs/platform/hosted-mcp-servers/guide/chatgpt.html
- OAuth client credentials reference for unattended service integrations: https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_client_credentials_flow.htm&type=5
- Platform API limits background: https://developer.salesforce.com/blogs/2024/11/api-limits-and-monitoring-your-api-usage

## Runtime

Node.js 20+, TypeScript, `@modelcontextprotocol/sdk`, stdio downstream transport, and Streamable HTTP upstream transport.

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

## Authentication

The connector requires `SALESFORCE_MCP_ACCESS_TOKEN`, an OAuth bearer token issued for the user or integration identity that is allowed to use the configured Hosted MCP server. Salesforce recommends per-user OAuth 2.0 with PKCE for Hosted MCP clients so normal Salesforce permissions remain authoritative.

The LLM never receives the token. It exists only in the connector process and is attached to outbound requests to the fixed Salesforce MCP origin.

For unattended server-to-server systems, Salesforce also documents OAuth 2.0 client credentials with an assigned integration user. That flow does not return refresh tokens and scopes are assigned to the External Client App rather than requested at the token endpoint. Token acquisition is intentionally kept outside this gateway so deployments can use their existing secure OAuth broker or secret manager.

## Environment

See `.env.example`.

- `SALESFORCE_MCP_ACCESS_TOKEN`: required bearer token.
- `SALESFORCE_ENVIRONMENT`: `production` or `sandbox`.
- `SALESFORCE_TIMEOUT_MS`: upstream tool-call timeout, 1-60 seconds.
- `SALESFORCE_APPROVAL_MODE`: `required` by default.
- `SALESFORCE_APPROVED_ACTIONS`: comma-separated operator-approved write/destructive actions.
- `SALESFORCE_ALLOW_DESTRUCTIVE`: `false` by default and independently required for delete tools.

## Implemented tools

| Tool | Official upstream | Risk | Approval |
|---|---|---:|---|
| `salesforce.schema.get` | SObject Reads | READ | No |
| `salesforce.record.query` | SObject Reads | READ | No |
| `salesforce.record.search` | SObject Reads | READ | No |
| `salesforce.user.get` | SObject Reads | READ | No |
| `salesforce.record.recent` | SObject Reads | READ | No |
| `salesforce.record.related.list` | SObject Reads | READ | No |
| `salesforce.record.create` | SObject Mutations | WRITE | Required by default |
| `salesforce.record.update` | SObject Mutations | WRITE | Required by default |
| `salesforce.record.related.update` | SObject Mutations | WRITE | Required by default |
| `salesforce.record.delete` | SObject Deletes | DESTRUCTIVE | Strong approval + opt-in |
| `salesforce.record.related.delete` | SObject Deletes | DESTRUCTIVE | Strong approval + opt-in |

The upstream gateway calls `tools/list` only to locate reviewed Salesforce tool aliases. It never exposes newly discovered upstream tools automatically and has no generic dispatch tool.

## Validation

Object names, record IDs, relationship paths, payload sizes, and string lengths are bounded. SOQL submitted through `salesforce.record.query` must contain both `WHERE` and `LIMIT`; this follows Salesforce's own hosted-MCP guidance for reducing accidental broad scans.

Create/update payloads accept scalar field values only and are capped at 100 fields per call. Complex or specialized Salesforce APIs should be added as explicit reviewed tools rather than passed through an arbitrary request escape hatch.

## Permission and approval model

```text
READ         -> automatic
WRITE        -> external operator approval by default
DESTRUCTIVE  -> explicit approval + SALESFORCE_ALLOW_DESTRUCTIVE=true
```

Approval state is environment-controlled, not supplied as a tool argument, so an agent cannot self-approve.

Example:

```text
SALESFORCE_APPROVED_ACTIONS=salesforce.record.update
```

Deletion additionally requires:

```text
SALESFORCE_APPROVED_ACTIONS=salesforce.record.delete
SALESFORCE_ALLOW_DESTRUCTIVE=true
```

Salesforce remains the final authorization authority. Hosted MCP calls still respect the authenticated user's object permissions, field-level security, validation rules, and sharing model.

## Reliability and rate limits

Every upstream tool call has a bounded timeout. Provider authentication, authorization, validation, and MCP errors are returned without automatically retrying mutations. This avoids duplicate record creation or repeated destructive actions when the remote outcome is uncertain.

Salesforce API usage is governed by org entitlements and protection limits. Salesforce documents rolling 24-hour API allocations and may return `403 REQUEST_LIMIT_EXCEEDED` when system protection limits are enforced. Hosted MCP can also return its own transport or tool errors. The gateway surfaces those errors rather than hiding them with unbounded retries.

For larger extraction or ingestion workloads, use Salesforce's purpose-built Bulk APIs rather than repeatedly calling agent tools.

## Security

- Fixed Salesforce MCP origins prevent caller-controlled SSRF.
- Bearer credentials never appear in tool schemas or normal output.
- No generic REST request, raw URL, Discover/Dispatch, or arbitrary upstream-tool passthrough exists.
- Upstream tool discovery is constrained by explicit alias allowlists.
- Salesforce record content, schema guidance, text fields, and MCP responses are untrusted data and must never alter connector permissions or approval policy.
- Writes and deletes are routed to separate official Salesforce MCP servers.
- Deletes are locally disabled by default even if the Salesforce user has delete permission.
- Prefer the read-only server for deployments that do not need mutations.

## Testing

Unit tests require no live Salesforce credentials. They cover required auth configuration, production/sandbox endpoint selection, approval denial, destructive default denial, upstream alias allowlisting, stable tool registration, absence of a generic request escape hatch, and SOQL safety validation.

```bash
npm test
```

## MCP client configuration

Any MCP client capable of launching a local stdio server can run the built gateway:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/salesforce/dist/src/server.js"],
  "env": {
    "SALESFORCE_MCP_ACCESS_TOKEN": "provided-by-secure-token-broker",
    "SALESFORCE_ENVIRONMENT": "production"
  }
}
```

Clients with first-class remote MCP plus OAuth support can also connect directly to Salesforce's official Hosted MCP endpoints. Direct connection is preferable when this gateway's stable naming and extra approval policy are not needed.

## Limitations

- The connector intentionally covers core SObject workflows only.
- It does not expose arbitrary Apex, Flow, Data 360, Tableau, Headless 360, Marketing Cloud, Setup, or API Catalog dispatch capabilities.
- It does not implement the interactive OAuth browser flow itself; deployments inject a securely obtained bearer token.
- Upstream Hosted MCP servers must be enabled by a Salesforce administrator and supported by the org edition.
- Salesforce may evolve upstream tool names; the connector fails closed if none of its reviewed aliases exists.
- Delete operations move records to Salesforce's Recycle Bin subject to Salesforce behavior; no undelete tool is exposed here.

See `examples/tool-calls.md` for example inputs and risk classifications.
