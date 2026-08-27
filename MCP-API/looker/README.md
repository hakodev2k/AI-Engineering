# Looker MCP/API Connector

Reusable Model Context Protocol connector for Google Cloud Looker. It exposes a stable, provider-scoped tool contract while preferring the official Looker-managed MCP server for governed Explore queries and using the official Looker API 4.0 as fallback and for capabilities not covered by the selected MCP tool.

## Official upstreams researched

- Looker-managed MCP server (Preview): `https://docs.cloud.google.com/looker/docs/mcp`
- MCP administration/tool allowlist: `https://docs.cloud.google.com/looker/docs/admin-panel-platform-mcp`
- Looker API overview: `https://docs.cloud.google.com/looker/docs/api-overview`
- Looker API authentication: `https://docs.cloud.google.com/looker/docs/api-auth`
- Looker API 4.0 reference: `https://docs.cloud.google.com/looker/docs/reference/looker-api/latest`
- ScheduledPlan methods: `https://docs.cloud.google.com/looker/docs/reference/looker-api/latest/methods/ScheduledPlan`

The managed MCP endpoint is `${LOOKER_BASE_URL}/mcp`, uses OAuth 2.1, is currently a Preview feature, and is available for Looker-hosted Looker (original) and Looker (Google Cloud core). Customer-hosted Looker is not supported by the managed server. Looker disables managed MCP tools by default; an administrator must explicitly enable required tools. The connector checks that the official `looker_query` tool is exposed before calling it.

## Transport strategy

`looker.query.run` first attempts the official managed MCP `looker_query` tool when `LOOKER_USE_MCP=true` and `LOOKER_MCP_ACCESS_TOKEN` is configured. If the managed MCP is unavailable, not configured, or the tool is disabled, it falls back to Looker API 4.0 by creating and running a query. Content metadata and ScheduledPlan operations use the official REST API 4.0 because it provides explicit, stable contracts for those operations.

No unofficial MCP server is required.

## Tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---:|---:|---|
| `looker.model.list` | REST | READ | No | List visible LookML models |
| `looker.explore.get` | REST | READ | No | Read Explore metadata |
| `looker.query.run` | MCP → REST fallback | READ | No | Run a governed Explore query |
| `looker.look.get` | REST | READ | No | Read a saved Look |
| `looker.dashboard.get` | REST | READ | No | Read a dashboard |
| `looker.content.search` | REST | READ | No | Search content metadata by title |
| `looker.scheduled_plan.search` | REST | READ | No | Search schedules |
| `looker.scheduled_plan.get` | REST | READ | No | Read a schedule |
| `looker.scheduled_plan.create` | REST | HIGH_RISK | Yes | Create recurring external delivery |
| `looker.scheduled_plan.run` | REST | HIGH_RISK | Yes | Run an external delivery once |
| `looker.scheduled_plan.delete` | REST | DESTRUCTIVE | Yes | Delete a schedule |

## Authentication

### Managed MCP

Looker-managed MCP uses OAuth 2.1. Register the MCP client in Looker as documented by Google, obtain an access token outside the LLM context, and supply it to the connector through `LOOKER_MCP_ACCESS_TOKEN`. The connector never places that token into MCP tool arguments or model-visible prompts.

Fine-grained OAuth scopes are not currently supported by the managed MCP preview; authorization relies on the instance tool allowlist and the authenticated user's Looker permissions. Enable only `looker_query` for this connector's MCP path unless additional tools are intentionally added later.

### REST fallback

Set `LOOKER_CLIENT_ID` and `LOOKER_CLIENT_SECRET` for a least-privilege Looker API user. The connector exchanges these credentials at `/api/4.0/login`, caches the resulting access token in process memory until shortly before expiry, and sends only the access token to provider endpoints. API calls execute with the permissions of the API user bound to those credentials.

Required permissions depend on the content the API user needs to see. Schedule operations additionally require the user's corresponding schedule permissions; listing schedules for all users requires `see_schedules`.

## Environment

Copy `.env.example` and configure:

```text
LOOKER_BASE_URL=https://your-instance.looker.com
LOOKER_CLIENT_ID=
LOOKER_CLIENT_SECRET=
LOOKER_MCP_ACCESS_TOKEN=
LOOKER_USE_MCP=true
LOOKER_TIMEOUT_MS=20000
LOOKER_MAX_RETRIES=3
LOOKER_APPROVAL_SECRET=
```

`LOOKER_BASE_URL` must be HTTPS. Do not commit secrets. Use a secret manager or injected environment variables in production.

## Approval model

READ tools may execute automatically. Schedule creation and one-time execution can transmit data to external recipients and therefore require explicit human approval. Schedule deletion is destructive and also requires approval.

Approval is represented by an HMAC-SHA256 digest of the exact tool name using `LOOKER_APPROVAL_SECRET`. This is intended as a connector-side enforcement hook: the approval token should be produced by a trusted orchestration layer after a human confirms the action. Agents cannot derive a valid approval token unless the orchestration layer exposes the secret, which it must not do.

The connector never retries schedule create, run, or delete operations automatically.

## Reliability

REST requests have configurable timeouts, cancellation propagation, bounded exponential backoff, `Retry-After` handling, and a maximum of five retries. Only retry-safe calls are retried. Validation, authorization, authentication, and destructive/write failures are not blindly replayed. Provider error bodies are bounded before being surfaced.

The managed MCP client checks the upstream tool manifest before invoking `looker_query`. MCP failures matching connectivity, timeout, configuration, or disabled-tool conditions trigger the documented REST fallback. Unexpected MCP errors fail closed rather than silently changing behavior.

## Rate limits and quotas

Looker API endpoints may return HTTP 429. The connector preserves `Retry-After` behavior and performs bounded retries for safe reads. The Looker-managed MCP server consumes the same instance administrative and query-oriented API quotas; high agent activity can affect available quota. The managed MCP preview also has fixed server capacity and can experience occasional timeouts.

## Security considerations

- Provider content is treated as untrusted data, never as executable instructions.
- Credentials stay in the connector process and are not passed as tool arguments.
- `LOOKER_BASE_URL` is configuration-only and must use HTTPS, reducing SSRF exposure from agent-controlled parameters.
- The connector exposes scoped tools rather than arbitrary HTTP execution.
- Managed MCP tools are allowlisted by exact name; newly discovered tools are not trusted automatically.
- High-risk external delivery and destructive deletion require explicit approval.
- Write/destructive operations are not automatically retried.
- Use a dedicated least-privilege Looker user for API credentials.
- Managed MCP activity is auditable in Looker System Activity and, for Looker (Google Cloud core), Cloud Audit Logs.

## Install and run

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers, including clients that can execute arbitrary MCP server commands. Compatibility depends on the client's stdio MCP support and configuration format; this package does not claim native packaging for any specific client.

Example generic client configuration:

```json
{
  "mcpServers": {
    "looker": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/looker/dist/src/server.js"],
      "env": {
        "LOOKER_BASE_URL": "https://your-instance.looker.com",
        "LOOKER_CLIENT_ID": "<from-secret-store>",
        "LOOKER_CLIENT_SECRET": "<from-secret-store>"
      }
    }
  }
}
```

## Tests

`npm test` uses mocks and requires no live Looker credentials. Coverage includes configuration validation, credential isolation, read authentication, risk classification, approval denial/acceptance, rate-limit retry behavior, and non-retryable write behavior.

## Limitations

- The managed MCP integration is a Looker Preview feature and may change.
- This connector accepts an already-issued managed MCP OAuth access token; it does not implement interactive browser OAuth registration or refresh-token persistence.
- Only `looker_query` is routed through the managed MCP path. Other tools intentionally use the stable REST API 4.0 contract.
- Customer-hosted Looker cannot use the Looker-managed MCP preview; REST fallback remains available when the API endpoint is reachable.
- The connector implements a focused subset of useful Looker operations rather than the entire API.
- External schedule destinations may impose additional provider-specific configuration and policy requirements.

See `examples/workflows.md` for tool-call examples and `manifest.yaml` for the machine-readable capability/risk declaration.
