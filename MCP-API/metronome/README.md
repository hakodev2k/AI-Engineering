# Metronome MCP/API Connector

Reusable MCP stdio server for Metronome billing and usage workflows. The connector presents a narrow agent-facing tool surface over Metronome's official REST API, keeps bearer credentials entirely inside the connector, and places explicit approval boundaries around actions that can change financial state.

## Upstream research and transport

Official sources reviewed on 2026-09-15:

- API reference and OpenAPI surface: https://docs.metronome.com/api-reference/introduction and https://api.metronome.com/v1/docs/openapi
- Authentication: https://docs.metronome.com/api-reference/authentication
- Idempotency: https://docs.metronome.com/api-reference/idempotency
- Status/error handling: https://docs.metronome.com/api-reference/status-codes
- SDKs: https://docs.metronome.com/guides/get-started/developer-sdks
- Customers: https://docs.metronome.com/api-reference/customers/list-customers and https://docs.metronome.com/api-reference/customers/create-a-customer
- Usage ingestion/search: https://docs.metronome.com/api-reference/usage/ingest-events and https://docs.metronome.com/api-reference/usage/search-events
- Billable metrics: https://docs.metronome.com/api-reference/billable-metrics/list-all-billable-metrics and https://docs.metronome.com/api-reference/billable-metrics/create-a-billable-metric
- Threshold notifications: https://docs.metronome.com/api-reference/alerts/create-a-threshold-notification
- Contracts: https://docs.metronome.com/api-reference/contracts/create-a-contract
- Customer invoice endpoint is also documented in Metronome's custom invoice integration guide: https://docs.metronome.com/integrations/invoice-integrations/custom-invoice-integrations

No official Metronome MCP server was found in Metronome's official documentation during this run. The official REST API is therefore the upstream transport. Metronome also publishes official SDKs; its January 16, 2026 changelog lists Node SDK v3.0.0. This connector intentionally uses direct REST rather than adding the SDK dependency so its safety, retry, and approval behavior remains explicit and auditable.

## Authentication and permissions

Set `METRONOME_BEARER_TOKEN` to an API token. Metronome documents that tokens inherit the creator's permissions by default, but can be limited by access level (including read-only), environment (for example sandbox-only), and endpoint through Metronome. Request the narrowest token compatible with the enabled tools.

The MCP model never receives the bearer token. Do not put API tokens in prompts, tool inputs, logs, examples, or source control.

## Tool surface

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `metronome.customer.list` | `GET /v1/customers` | READ | no |
| `metronome.customer.create` | `POST /v1/customers` | WRITE | configurable |
| `metronome.customer.archive` | `POST /v1/customers/archive` | DESTRUCTIVE | required + disabled by default |
| `metronome.usage.ingest` | `POST /v1/ingest` | HIGH_RISK | required |
| `metronome.usage.search` | `POST /v1/events/search` | READ | no |
| `metronome.billable_metric.list` | `GET /v1/billable-metrics` | READ | no |
| `metronome.billable_metric.create` | `POST /v1/billable-metrics/create` | HIGH_RISK | required |
| `metronome.invoice.list` | `GET /v1/customers/{id}/invoices` | READ | no |
| `metronome.alert.create` | `POST /v1/alerts/create` | HIGH_RISK | required |
| `metronome.contract.create` | `POST /v1/contracts/create` | HIGH_RISK | required |

`usage.search` is semantically read-only although the provider exposes it as POST. The connector caps it at 25 transaction IDs because Metronome explicitly says the endpoint is heavily rate limited and intended for sampling, not per-event polling.

## Approval model

READ tools may run automatically. WRITE tools require connector-side approval by default and can be relaxed only through deployment configuration. HIGH_RISK tools always require an opaque host-injected approval grant because they can affect metering, pricing, notifications, or billing agreements. DESTRUCTIVE tools additionally require `METRONOME_ENABLE_DESTRUCTIVE=true`.

`customer.archive` is intentionally classified DESTRUCTIVE: Metronome states that customer archival cannot be undone, automatically archives contracts, and voids corresponding invoices.

## Idempotency, retries, and rate limits

Metronome supports `Idempotency-Key` on POST requests and retains keys for at least 24 hours. Usage ingestion additionally deduplicates by `transaction_id` for 34 days. The connector accepts an optional `idempotencyKey` for mutating POSTs and forwards it unchanged after validation.

GET requests use bounded exponential backoff for network failures, HTTP 429, and transient 5xx errors; `Retry-After` is honored when supplied. POST requests are never automatically retried, even when an idempotency key exists, so an agent cannot silently duplicate or repeat billing mutations. Authentication, authorization, validation, approval, and conflict failures are not retried.

Metronome publishes workload-specific limits rather than one universal API quota. Its high-volume ingestion guide documents very high event throughput and batches of up to 100 events, while the Event Search endpoint is described as heavily rate limited. The connector therefore caps ingest batches at 100, search samples at 25, and ordinary page sizes at 100.

## Security

- Credentials are loaded only from environment/secret management and are never part of tool schemas.
- The API base URL is pinned to `https://api.metronome.com` to prevent bearer-token forwarding and SSRF.
- All schemas use `additionalProperties: false`; IDs, timestamps, lengths, batch sizes, pagination, and enum values are validated again in handlers.
- Arbitrary REST passthrough is not exposed.
- Arbitrary SQL billable metrics are intentionally not exposed even though the provider supports them; this connector only creates standard streaming metrics.
- Provider responses are returned with `untrustedProviderData: true`. Names, custom fields, invoice text, event properties, and provider error text must be treated as data, never instructions.
- The connector does not let tool calls change token scope, approval policy, API endpoint, or destructive-mode configuration.

## Installation and running

Node.js 20+ is required.

```bash
cd MCP-API/metronome
npm install
npm run build
npm start
```

Configure your MCP host to launch `node /absolute/path/MCP-API/metronome/dist/src/index.js` and inject `METRONOME_BEARER_TOKEN` from its secret store. The server uses MCP stdio transport and can be used by MCP clients that support launching local stdio tool servers.

## Error behavior

Metronome's standard 4xx JSON `message` is mapped to an MCP tool error without returning authorization headers or tokens. HTTP 401/403, 404, 409, 429 and provider 5xx errors remain distinguishable internally through `MetronomeError.status`; 429 also preserves `Retry-After` when present. Timeouts use `AbortController`.

## Tests

```bash
npm test
```

Unit tests use a fake provider client and require no live credentials. They cover tool registration, approval denial, bounded pagination, request mapping/idempotency, usage ingestion, rate-limit-aware search limits, the no-SQL metric boundary, required alert fields, and destructive defaults.

## Limitations

- OAuth is not implemented because Metronome's documented API authentication for this integration is bearer-token based; token lifecycle/rotation remains an operator responsibility.
- No upstream MCP fallback is implemented because no official Metronome MCP server was found in the official sources reviewed.
- Billing-provider configuration, contract editing, invoice mutation, credits/commits mutation, and arbitrary pricing SQL are intentionally omitted to keep this default agent surface narrow and reviewable.
- This connector does not receive webhooks. Metronome can emit notifications/webhooks, but webhook receiver deployment and signature/authentication requirements belong in a separately hardened inbound service rather than a local stdio MCP server.
