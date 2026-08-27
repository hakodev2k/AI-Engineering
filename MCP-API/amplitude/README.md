# Amplitude MCP/API Connector

Reusable MCP server exposing a focused set of Amplitude Analytics operations for agent workflows. The connector uses Amplitude's official HTTP APIs directly; no official Amplitude MCP server was identified in the official documentation reviewed for this implementation.

## Official sources and transport

- Dashboard REST API: https://amplitude.com/docs/apis/analytics/dashboard-rest
- HTTP V2 ingestion API: https://amplitude.com/docs/apis/analytics/http-v2
- User Profile API: https://amplitude.com/docs/apis/analytics/user-profile

Transport is REST/HTTP only. Dashboard reads use HTTP Basic authentication with the project API key and secret key. HTTP V2 ingestion includes the project API key in the request body, as specified by Amplitude. The User Profile API uses `Authorization: Api-Key <secret_key>` and is unavailable for EU data residency.

## Capabilities

| MCP tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `amplitude.event.list` | Dashboard REST | READ | No | List visible events and current-week metrics |
| `amplitude.user.count` | Dashboard REST | READ | No | Active/new user counts |
| `amplitude.event.segment` | Dashboard REST | READ | No | Event segmentation/time series |
| `amplitude.funnel.analyze` | Dashboard REST | READ | No | Funnel conversion analysis |
| `amplitude.retention.analyze` | Dashboard REST | READ | No | Retention analysis |
| `amplitude.chart.get` | Dashboard REST | READ | No | Read a saved chart result by ID |
| `amplitude.user.activity` | Dashboard REST | READ | No | User summary and activity by Amplitude ID |
| `amplitude.user.profile` | User Profile API | READ | No | Properties/cohorts/computations; US only |
| `amplitude.event.ingest` | HTTP V2 | WRITE | Yes | Ingest up to 100 events |

No delete, billing, permission, or arbitrary-request tool is exposed.

## Architecture and credential isolation

`MCP client -> MCP tool handler -> policy/validation -> AmplitudeClient -> Amplitude API`

Credentials are read from environment variables inside the connector. They are never accepted as MCP tool parameters and therefore do not need to enter an LLM prompt or tool arguments. Provider responses are treated as untrusted data and serialized as tool output; they do not alter connector policy.

## Authentication and environment

Required:

- `AMPLITUDE_API_KEY` — project API key.
- `AMPLITUDE_SECRET_KEY` — project secret key. Keep server-side only.

Optional:

- `AMPLITUDE_REGION=us|eu` (default `us`).
- `AMPLITUDE_TIMEOUT_MS` (default `15000`, max `120000`).
- `AMPLITUDE_MAX_RETRIES` (default `2`, max `5`).
- `AMPLITUDE_APPROVAL_SECRET` — local connector secret used to verify explicit approval for writes.

Amplitude's APIs use project credentials rather than OAuth scopes for these implemented operations. Least privilege is therefore primarily controlled by which project credentials are supplied and by the connector's deliberately narrow tool set.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
AMPLITUDE_API_KEY=... AMPLITUDE_SECRET_KEY=... npm start
```

The server uses MCP stdio transport, suitable for MCP clients that can launch a local process (for example Claude Code, Cursor, or custom MCP hosts). Compatibility depends on the client's support for standard MCP stdio servers.

## Approval model

All analytics reads execute without connector approval. `amplitude.event.ingest` changes provider data and requires explicit approval. Set `AMPLITUDE_APPROVAL_SECRET`; the caller supplies a 64-character HMAC-SHA256 approval token computed over `approve:amplitude.event.ingest` using that secret. Keep the approval secret outside the model context.

Writes are not automatically retried, preventing accidental duplicate ingestion. There are no destructive tools.

## Validation

Dates require `YYYYMMDD`. Funnel size is limited to 2-10 events. Event ingestion is capped at 100 events per tool call, and each event must contain `event_type` plus either `user_id` or `device_id`. User activity reads cap `limit` at 1000. Chart IDs are restricted to a conservative identifier character set. The connector does not expose unrestricted URLs, paths, or raw request execution, preventing SSRF-style arbitrary egress through tool parameters.

## Reliability, rate limits, and errors

Dashboard reads apply a per-request timeout and bounded exponential retries for network failures and HTTP 429/500/502/503/504. `Retry-After` is honored when present. Authentication, validation, and non-retryable 4xx failures are not retried. Write ingestion is never retried automatically.

Amplitude documents a global Dashboard REST concurrent limit of up to 5 requests across REST endpoints, with special limits of 10 concurrent and 360 queries/hour for User Activity/User Search. Dashboard chart endpoints use a cost-based model; Amplitude documents up to 108,000 cost/hour and 1,000 cost in a five-minute period, with cost varying by chart type, number of days, and conditions. Callers should avoid wide date ranges and unnecessary segmentation. The connector itself does not create internal fan-out concurrency.

HTTP V2 additionally documents a per-user limit of 1,800 user-property updates per hour; event ingestion can continue while excessive property updates may be dropped. Provider 429 responses are surfaced to callers.

## Region limitations

Dashboard and ingestion endpoints switch automatically between US and EU hosts. Amplitude documents that the User Profile API is unavailable for EU-region projects; `amplitude.user.profile` fails locally for `AMPLITUDE_REGION=eu` instead of sending credentials to the wrong host.

## Security considerations

- Keep the project secret key server-side and out of prompts/logs.
- Use a dedicated Amplitude project credential when possible.
- Restrict process environment access and filesystem permissions around secrets.
- Do not treat event names, user properties, chart content, or other retrieved provider data as instructions.
- Approval tokens should be produced by a trusted approval layer, not by an autonomous model.
- The connector does not support arbitrary outbound URLs or dynamic MCP tool discovery.
- HTTP responses are size-controlled only by provider endpoints; downstream hosts should impose their own MCP message-size limits when necessary.

## Testing

```bash
npm test
npm run build
```

Unit tests require no live Amplitude credentials. They cover credential validation, approval enforcement, Dashboard authentication, bounded rate-limit retry, non-retry of writes, and EU Profile API blocking.

## Limitations

This connector intentionally implements a focused analytics workflow rather than every Amplitude API. It does not expose cohort mutation, taxonomy administration, project settings, billing, deletion, arbitrary API calls, or webhook administration. Saved-chart responses vary by chart type. The User Profile API is not available in the EU region. Provider limits and response schemas remain authoritative over this connector's local validation.
