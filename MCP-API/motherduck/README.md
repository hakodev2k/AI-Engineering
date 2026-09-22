# MotherDuck MCP Connector

A reusable safety wrapper around MotherDuck's official remote MCP server. It exposes eight stable, provider-scoped tools, pins an allowlist of official upstream capabilities, keeps credentials inside the transport layer, and puts read/write SQL behind distinct permission boundaries.

## Official transport research

MotherDuck operates an official remote MCP server at `https://api.motherduck.com/mcp`. Official materials describe catalog tools including `list_databases`, `list_shares`, `list_tables`, `list_columns`, `search_catalog`, documentation Q&A, and separate `query` (read-only) and `query_rw` (read-write) SQL tools. MotherDuck also exposes Flights and Dives capabilities through MCP, but this connector intentionally does not proxy those mutation-heavy surfaces because their exact tool contracts evolve with those products.

Official sources researched 2026-09-22:
- https://motherduck.com/product/mcp-server/
- https://motherduck.com/blog/dev-diary-building-mcp/
- https://motherduck.com/learn/motherduck-ai-agent-data-layer/
- https://motherduck.com/blog/flights-agent-native-ingest/

The official MCP transport is preferred over rebuilding catalog/query semantics with REST or SDK calls. No unofficial MCP server is used. There is therefore no API fallback for these eight capabilities: unexpected MCP tool removal fails closed.

## Architecture

`MCP client -> local strict schema -> permission/approval gate -> allowlisted upstream adapter -> official MotherDuck remote MCP`.

At first connection the adapter calls MCP `tools/list` and verifies every allowlisted upstream tool exists. Newly discovered tools are not trusted or exposed automatically. Calls can only target the compile-time allowlist.

## Authentication

Interactive MCP clients can authenticate directly with MotherDuck OAuth. This reusable non-interactive wrapper supports a MotherDuck token from `MOTHERDUCK_TOKEN`, sent as a Bearer token only by the upstream transport. The token is never accepted as a tool argument or included in model-visible output. Use the narrowest MotherDuck principal/token permissions available; read-only credentials are recommended unless `query_rw` is genuinely required.

## Environment

`MOTHERDUCK_TOKEN` is required for this non-interactive wrapper. `MOTHERDUCK_MCP_URL` defaults to the official endpoint and must be HTTPS without embedded credentials. `MOTHERDUCK_TIMEOUT_MS` defaults to 15000. `MOTHERDUCK_REQUIRE_WRITE_APPROVAL` defaults to true.

## Install and run

Node.js 20+:
```bash
npm install
npm run build
MOTHERDUCK_TOKEN='...' npm start
```
The local server uses stdio and can be launched by any MCP client capable of spawning a stdio server. Compatibility depends on standard MCP stdio support; no client-specific proprietary integration is required.

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `motherduck.database.list` | `list_databases` | READ | no |
| `motherduck.share.list` | `list_shares` | READ | no |
| `motherduck.table.list` | `list_tables` | READ | no |
| `motherduck.column.list` | `list_columns` | READ | no |
| `motherduck.catalog.search` | `search_catalog` | READ | no |
| `motherduck.docs.ask` | `ask_docs_question` | READ | no |
| `motherduck.query.read` | `query` | READ | no |
| `motherduck.query.write` | `query_rw` | HIGH_RISK | always |

`query_rw` can execute INSERT, UPDATE, DELETE, CREATE/DROP and schema changes according to upstream permissions, so the wrapper classifies the entire tool HIGH_RISK rather than trying to parse SQL perfectly. It always requires `approved: true`; upstream MotherDuck permissions remain an independent authorization boundary. The connector does not expose a generic upstream-tool executor.

## Reliability, limits, and cancellation

Every upstream call has a bounded timeout and supports caller cancellation. The connector deliberately does not automatically retry MCP calls: a transport failure after a write may be ambiguous, and retrying could duplicate mutations. MotherDuck's official MCP additionally constrains query result sizes; official engineering documentation reports a 2,048-row result cap and response truncation safeguards. Treat truncation notices as partial results and narrow the next query instead of issuing uncontrolled pagination loops.

Provider-side throttling and quota/cost policy can vary by account and compute configuration. MCP errors are surfaced to the caller rather than hidden by invented retry or quota rules.

## Security

- Credentials remain in the auth/transport layer and are never tool inputs.
- Upstream endpoint must be HTTPS and cannot contain embedded credentials, reducing SSRF/credential-leak risk.
- Only eight pre-approved upstream tool names can execute; newly discovered MCP tools fail closed rather than gaining authority.
- Retrieved schemas, comments, docs, and query results are untrusted data, never instructions; they cannot alter the allowlist or approval policy.
- `query_rw` requires explicit human approval and should use a sandbox/clone or least-privilege token when possible.
- No arbitrary URL, arbitrary MCP tool, credential-forwarding, billing, org-admin, token-management, Flight deletion, or Dive publication capability is exposed.
- The wrapper logs no tokens or query results.

## Error handling

Strict Zod schemas reject ambiguous input before transport. Missing credentials and unsafe endpoint configuration fail at startup/use. Missing expected upstream tools fail closed. Authentication/permission/provider errors are not retried. Timeout/cancellation returns an explicit connector error.

## Testing

`npm test` uses a fake upstream; no live credentials are required. Tests cover auth configuration, HTTPS validation, allowlisting, tool registration, input validation, read routing, write denial, explicit approval, and cancellation/error propagation.

## Limitations

This package intentionally exposes only the stable analytics/catalog core documented by MotherDuck. Flights and Dives are not proxied even though official MCP supports them; their higher-risk lifecycle operations deserve separate schemas and approval policies. OAuth browser flow is delegated to direct official MCP clients; this wrapper uses a pre-provisioned token for non-interactive operation. No REST fallback is attempted when official MCP is unavailable because the selected capabilities are specifically backed by the official MCP contract.
