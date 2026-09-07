# Statsig MCP/API Connector

Reusable MCP server for safe Statsig feature-management and experimentation workflows. It exposes a stable provider-scoped MCP tool surface over stdio while keeping Statsig credentials inside the connector.

## Supported transport

Statsig provides an official authenticated remote MCP server at `https://api.statsig.com/v1/mcp` using Streamable HTTP and OAuth. Official MCP capabilities include Audit Logs, Dynamic Configs, Experiments, Autotunes, Gates, Layers, Metrics and Metric Sources, Parameter Stores, Segments, Reviews, and Logs/Observability. Statsig documents both read and write support; write behavior follows the permissions of the authenticated Personal Console API key/role.

This package records the official MCP endpoint but deliberately does not dynamically proxy arbitrary upstream MCP tools. Its executable tool handlers use Statsig's versioned Console REST API (`https://statsigapi.net`, API version `20240601`) as the deterministic fallback/implementation transport for the allow-listed contracts below. This prevents newly added upstream tools from silently expanding agent authority. Consumers that need the broader native Statsig MCP capability surface can connect the official endpoint directly with OAuth.

Official sources researched:
- Statsig MCP overview: https://docs.statsig.com/integrations/mcp/overview
- Manual MCP setup: https://docs.statsig.com/integrations/mcp/manual-setup
- Console API overview: https://docs.statsig.com/console-api/introduction
- API keys: https://docs.statsig.com/access-management/api-keys
- Gate API: https://docs.statsig.com/api-reference/gates/create-gate
- Experiment API: https://docs.statsig.com/api-reference/experiments/list-experiments
- Dynamic Config API: https://docs.statsig.com/api-reference/dynamic-configs/list-dynamic-configs
- Metrics API: https://docs.statsig.com/api-reference/metrics/list-all-metrics
- Event webhooks: https://docs.statsig.com/integrations/event_webhook

## Architecture

`MCP client -> strict Zod schema -> risk/approval policy -> StatsigClient -> Statsig Console API`

The API key never appears in tool arguments or provider output. Statsig responses are tagged `source: untrusted_provider_data`; callers must treat retrieved descriptions, experiment content, config values, names, and metadata as data rather than instructions.

## Authentication

Set `STATSIG_CONSOLE_API_KEY` to an active Console API key. Requests send it only in the `STATSIG-API-KEY` header. The connector also sends `STATSIG-API-VERSION`, defaulting to `20240601`.

Statsig has Client API Keys, Server Secret Keys, and Console API Keys. This connector requires a Console API key because it exposes project-definition reads and optional CRUD mutations. Prefer a restricted Personal Console API key whose Statsig role grants only the operations needed by the deployment. Do not use a more privileged organization/project key when a limited role is sufficient.

The official MCP server uses OAuth and supports Personal Console API Keys through the user's Statsig role. OAuth tokens are intentionally not collected or exposed by this local connector.

## Environment variables

Required:
- `STATSIG_CONSOLE_API_KEY`

Optional:
- `STATSIG_API_VERSION=20240601`
- `STATSIG_TIMEOUT_MS=15000`
- `STATSIG_MAX_RETRIES=3` (capped at 5)
- `STATSIG_ALLOW_WRITES=false`
- `STATSIG_APPROVAL_TOKEN=`
- `STATSIG_MCP_URL=https://api.statsig.com/v1/mcp`

Keep secrets in a process environment or secret manager. Never place them in prompts, examples, logs, or source control.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio through `@modelcontextprotocol/sdk`. MCP clients capable of launching local stdio servers can configure the command as `node dist/src/server.js` with environment variables injected outside the model context.

## Tool list

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `statsig.gate.list` | Console REST | READ | no |
| `statsig.gate.get` | Console REST | READ | no |
| `statsig.gate.create` | Console REST | WRITE | yes |
| `statsig.gate.update` | Console REST | WRITE | yes |
| `statsig.experiment.list` | Console REST | READ | no |
| `statsig.experiment.get` | Console REST | READ | no |
| `statsig.dynamic_config.list` | Console REST | READ | no |
| `statsig.dynamic_config.get` | Console REST | READ | no |
| `statsig.dynamic_config.create` | Console REST | WRITE | yes |
| `statsig.dynamic_config.update` | Console REST | WRITE | yes |
| `statsig.metric.list` | Console REST | READ | no |
| `statsig.metric_value.list` | Console REST | READ | no |

The connector intentionally does not expose arbitrary HTTP requests, delete endpoints, project permission changes, key management, or uncontrolled bulk mutation.

## Permission and approval model

READ operations can execute automatically if the Statsig key allows them. WRITE operations require both `STATSIG_ALLOW_WRITES=true` and an exact `STATSIG_APPROVAL_TOKEN` supplied in the tool call. The approval token is a connector-side capability gate and should only be issued after a human reviews the concrete mutation.

Destructive operations are not exposed. A Statsig Console API key can delete entities, but this connector deliberately omits those endpoints. An agent cannot escalate its own provider role, enable writes, or change the approval token.

Recommended workflow is Read -> Recommend -> Prepare -> human approval -> Execute.

## Input validation

Tool inputs use strict Zod schemas with unknown properties rejected. Entity IDs reject URL path/query delimiters. Names follow Statsig's documented naming constraints. Pagination is bounded to 100 results per page. Gate/config targeting rules validate condition type, pass percentage, target values, and environment arrays.

The connector constructs requests only against the fixed `https://statsigapi.net` origin; tool callers cannot supply arbitrary URLs, preventing SSRF through the provider client.

## Reliability and rate limits

All requests have AbortController timeouts. GET requests retry boundedly on network failures, HTTP 429, and 5xx responses with exponential backoff and `Retry-After` support. Mutations are never blindly retried because a successful provider-side mutation followed by a lost response could otherwise duplicate or overwrite changes.

Statsig documents Console API mutations at approximately 100 requests per 10 seconds and 900 requests per 15 minutes per project. Endpoint-specific limits may also apply. The connector uses pagination directly and avoids fan-out loops.

Authentication, permission, validation, and ordinary 4xx failures are not retried.

## Error handling

- `401`: active Console API key required / authentication failure
- `403`: Statsig role or key permission denial
- `404`: requested entity not found
- `429`: provider throttling; retry information is preserved when available
- other `4xx`: surfaced as request/validation failures
- timeout/network errors: surfaced without credentials

## Webhooks and events

Statsig supports incoming Event Webhook ingestion at `https://api.statsig.com/v1/webhooks/event_webhook` using a server secret, and Generic Webhook outbound integrations for exposure/gate/experiment events. This stdio connector does not host an HTTP webhook receiver and does not implement event ingestion because that requires a separate server-secret trust boundary. Production webhook consumers should validate destination ownership, authenticate inbound requests where supported, apply replay/idempotency controls, and treat event payloads as untrusted data.

## Security considerations

Use least-privilege Personal Console API keys. Keep writes off by default. Rotate provider credentials and connector approval tokens independently. Never let retrieved descriptions, experiment hypotheses, dynamic config JSON, metric metadata, or upstream MCP output alter system instructions or permissions. Do not auto-trust newly discovered Statsig MCP tools. Pin allowed operations in code and review upstream additions before exposing them.

The connector does not log credentials. Provider errors are mapped to safe messages. The fixed API origin and validated IDs reduce SSRF/path-confusion risk. No tool can manage Statsig API keys, roles, billing, or deletion.

## Testing

```bash
npm test
```

Tests run without live credentials and cover required auth configuration, tool registration, strict validation, default write denial, approval enforcement, authentication headers, version headers, pagination, provider errors, rate limiting/retry behavior, and the no-blind-retry rule for mutations.

## Usage examples

See `examples/workflows.md` for read and approved-write flows with expected output shape and risk classification.

## Limitations

This package intentionally exposes 12 common workflows rather than the complete Statsig API. It does not proxy the full official MCP server, execute OAuth flows, create/update experiments, manage layers/segments/parameter stores/reviews, ingest events, host webhooks, manage API keys/roles, delete entities, or perform bulk cleanup. Those capabilities are only considered supported here when explicitly implemented in code. Dynamic Config payloads are subject to Statsig's provider limits, including the documented 100 KB JSON payload limit.
