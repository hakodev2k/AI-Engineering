# Honeycomb MCP/API Connector

Reusable MCP connector for Honeycomb observability. It exposes a stable, provider-scoped MCP surface while routing operations to Honeycomb's official hosted MCP server. The connector deliberately allowlists a small set of high-value investigation and configuration capabilities rather than forwarding arbitrary upstream tools.

## Transport strategy

Primary upstream transport: official Honeycomb hosted MCP over Streamable HTTP.

US endpoint: `https://mcp.honeycomb.io/mcp`

EU endpoint: `https://mcp.eu1.honeycomb.io/mcp`

Honeycomb's official documentation states that MCP supports observability investigation capabilities such as running queries, finding columns, fetching traces, BubbleUp, service maps, and configuration operations for Boards, Triggers, and SLOs. Because these required operations are available through the official MCP server, this connector does not add a parallel REST fallback for the same capabilities.

The connector validates at connection time that every upstream tool in its allowlist is actually advertised by the official server. If Honeycomb removes or renames a required tool, startup fails safely instead of silently routing to something else.

## Official sources researched

- Honeycomb MCP concepts: https://docs.honeycomb.io/integrations/mcp/concepts
- Honeycomb MCP troubleshooting and endpoints: https://docs.honeycomb.io/integrations/mcp/troubleshooting
- Honeycomb MCP use cases: https://docs.honeycomb.io/integrations/mcp/use-cases
- Honeycomb API introduction: https://docs.honeycomb.io/api/introduction
- Honeycomb API authentication: https://docs.honeycomb.io/api/authentication
- Honeycomb API permissions: https://docs.honeycomb.io/api/permissions
- Honeycomb API rate limits: https://docs.honeycomb.io/api/rate-limit

Research refreshed for this connector run on 2026-08-26.

## Supported capabilities

| Connector tool | Official upstream MCP tool | Risk | Approval |
|---|---|---:|---:|
| `honeycomb.environment.list` | `list_environments` | READ | No |
| `honeycomb.dataset.list` | `list_datasets` | READ | No |
| `honeycomb.column.find` | `find_columns` | READ | No |
| `honeycomb.query.run` | `run_query` | READ | No |
| `honeycomb.trace.get` | `get_trace` | READ | No |
| `honeycomb.bubbleup.run` | `run_bubbleup` | READ | No |
| `honeycomb.service-map.get` | `get_service_map` | READ | No |
| `honeycomb.board.create` | `create_board` | WRITE | Yes |
| `honeycomb.trigger.create` | `create_trigger` | HIGH_RISK | Yes |
| `honeycomb.slo.update` | `update_slo` | HIGH_RISK | Yes |

The connector does not expose arbitrary upstream MCP tool execution and does not expose arbitrary REST requests.

## Architecture

```text
MCP client
  -> local stdio MCP server
  -> validation + permission/approval policy
  -> fixed Honeycomb upstream-tool allowlist
  -> Streamable HTTP client
  -> official Honeycomb hosted MCP
```

Provider responses are treated as untrusted data. Returned Honeycomb content is serialized into tool output and is never interpreted as permission or policy instructions.

## Authentication

Honeycomb MCP supports OAuth 2.1 for interactive clients and API-key authentication for headless/unattended agents. This reusable local connector uses the headless API-key path so credentials remain inside the connector process.

Set `HONEYCOMB_MCP_API_KEY` to the Honeycomb MCP key pair in `<key-id>:<key-secret>` form. The connector sends it only in the upstream `Authorization` header as `Bearer <key-id>:<key-secret>`.

For OAuth deployments implemented by an MCP host directly, Honeycomb documents `mcp:read` for read access and `mcp:write` for mutating MCP tools. This connector itself does not implement an OAuth browser flow.

Never place the Honeycomb key in an agent prompt, MCP tool argument, example, or checked-in file.

## Environment variables

Copy `.env.example` values into a secure runtime secret store or process environment.

- `HONEYCOMB_MCP_URL`: official US or EU Honeycomb MCP URL only.
- `HONEYCOMB_MCP_API_KEY`: required `<key-id>:<key-secret>` credential.
- `HONEYCOMB_APPROVAL_SECRET`: operator-held HMAC key used for write/high-risk approvals.
- `HONEYCOMB_TIMEOUT_MS`: request timeout, 1,000-60,000 ms; default 15,000.
- `HONEYCOMB_MAX_RETRIES`: bounded retry count for READ tools only, 0-5; default 2.
- `HONEYCOMB_MAX_PAYLOAD_BYTES`: upper bound for tool payload JSON; default 32 KiB.

The MCP URL validator rejects non-HTTPS URLs and hosts other than `mcp.honeycomb.io` and `mcp.eu1.honeycomb.io`, reducing SSRF and credential-forwarding risk.

## Install and build

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

## Run

```bash
export HONEYCOMB_MCP_API_KEY='<key-id>:<key-secret>'
export HONEYCOMB_APPROVAL_SECRET='<independent-operator-secret>'
npm start
```

The server communicates with local MCP hosts over stdio.

Example MCP host configuration after build:

```json
{
  "mcpServers": {
    "honeycomb-safe": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/honeycomb/dist/src/server.js"],
      "env": {
        "HONEYCOMB_MCP_API_KEY": "${HONEYCOMB_MCP_API_KEY}",
        "HONEYCOMB_APPROVAL_SECRET": "${HONEYCOMB_APPROVAL_SECRET}"
      }
    }
  }
}
```

Use your MCP host's secure environment-variable mechanism rather than hard-coding real values in configuration.

## Permission and approval model

READ tools can execute without approval.

WRITE and HIGH_RISK tools require explicit, payload-bound human approval. An approval is an HMAC-SHA256 digest computed from the connector tool name, a newline, and the exact canonical JSON payload. The approval secret remains outside the model. Any payload change invalidates the approval.

The connector never allows a tool call to change its own risk classification or expand the upstream allowlist.

Destructive tools are not exposed in this version. Alerting changes are HIGH_RISK because creating a Trigger or changing an SLO can alter operational notifications and reliability policy.

## Reliability and rate limits

READ operations use bounded exponential backoff for transient failures such as 429 responses, timeouts, selected 5xx responses, and connection resets. Writes and high-risk operations are never blindly retried because repeating a mutating operation can create duplicates or change state twice.

Honeycomb documents general API rate-limit headers (`RateLimit` and `RateLimit-Policy`) and 429 behavior, with `Retry-After` on most REST endpoints. For MCP specifically, Honeycomb documents per-tool limits: many tools share a default around 50 calls/minute, while discovery tools can be higher and expensive/mutating tools such as service-map and trigger operations can be lower. Actual server policy is authoritative and may vary by tool or plan.

The local connector preserves upstream errors, redacts obvious credential patterns, and lets the MCP client decide whether a failed read should be retried later.

## Validation and security

- Official Honeycomb MCP hosts only; no arbitrary endpoint configuration.
- Fixed upstream tool allowlist validated against upstream discovery.
- Credential-like top-level tool fields such as token, password, authorization, and API-key names are rejected.
- Payload size is bounded.
- Credentials are injected only by the connector transport layer.
- Provider content is untrusted and cannot modify policy.
- Write/high-risk approvals are timing-safe and bound to the exact payload.
- Only READ calls are retried.
- Errors redact Bearer values and Honeycomb-looking key material.
- No arbitrary URL, method, REST path, or generic MCP tool executor is exposed.

Because official Honeycomb MCP schemas can evolve, the wrapper intentionally forwards a JSON object to each fixed capability instead of freezing a stale copy of Honeycomb's upstream schema. The official MCP server remains the final schema/permission validator, while this connector adds transport, host, size, credential, risk, and approval controls.

## Testing

Unit tests do not require live Honeycomb credentials.

```bash
npm test
```

Tests cover official-host validation, credential configuration, upstream allowlist registration, credential-like parameter rejection, payload limits, read behavior, approval denial, payload-bound approval, and no-retry policy for mutating tools.

A live integration test is intentionally not part of the default test suite because it would require real credentials and could consume production observability data or perform writes.

## Examples

See `examples/workflows.md` for investigation, trace, BubbleUp, board creation, and high-risk alerting examples with required permission and approval behavior.

## Limitations

- Honeycomb Intelligence must be enabled for the Honeycomb team for MCP tools to be available.
- This implementation uses API-key authentication upstream; OAuth 2.1 is documented but not implemented by this local proxy.
- It exposes ten curated operations, not Honeycomb's entire MCP surface.
- It does not expose REST ingestion, Management API key administration, environment deletion, recipient administration, or destructive resource deletion.
- The upstream official MCP server is authoritative for exact operation payload schema, environment access, Honeycomb-side permissions, and plan-specific limits.
- If the official server no longer advertises one of the allowlisted tools, the connector fails closed during connection.
