# Trigger.dev MCP/API Connector

Reusable MCP server for safe Trigger.dev task execution and operational inspection. It exposes scoped, provider-specific tools rather than a generic HTTP proxy.

## Transport strategy

Trigger.dev has an **official local MCP server** distributed through the Trigger.dev CLI (`npx trigger.dev@latest mcp`) for project setup, documentation search, task triggering, debugging, deployment, run inspection, agent chat, prompt management, reports, and related coding workflows. The official MCP is best for interactive coding-agent workflows and can be installed in dev-only mode.

This connector intentionally uses the **official Trigger.dev HTTP Management API** behind its own MCP surface. That transport is more appropriate for a reusable headless connector because it supports environment-scoped secret keys, stable programmatic endpoints, explicit least-privilege policy enforcement, bounded retries, strict validation, and no dynamic upstream tool discovery. The agent-facing contract does not expose raw API requests.

Official TypeScript SDK equivalents are documented by Trigger.dev for the same management operations, but this connector uses direct REST calls to keep credential handling and retry semantics entirely inside the connector.

## Official sources

- Official MCP server: https://trigger.dev/changelog/official-mcp-server
- MCP launch documentation / dev-only mode: https://trigger.dev/launchweek/2/official-mcp-server
- Management API authentication: https://trigger.dev/docs/management/authentication
- API keys: https://trigger.dev/docs/apikeys
- Trigger task: https://trigger.dev/docs/management/tasks/trigger
- Batch trigger: https://trigger.dev/docs/management/tasks/trigger-batch
- Runs: https://trigger.dev/docs/runs
- List runs: https://trigger.dev/docs/management/runs/list
- Retrieve run: https://trigger.dev/docs/management/runs/retrieve
- Cancel run: https://trigger.dev/docs/management/runs/cancel
- Replay run: https://trigger.dev/docs/management/runs/replay
- Reschedule run: https://trigger.dev/docs/management/runs/reschedule
- Retrieve batch: https://trigger.dev/docs/management/batches/retrieve
- Batch results: https://trigger.dev/docs/management/batches/retrieve-results
- List schedules: https://trigger.dev/docs/management/schedules/list
- Retrieve schedule: https://trigger.dev/docs/management/schedules/retrieve
- Limits: https://trigger.dev/docs/limits

## Capabilities

| MCP tool | Transport | Risk | Approval |
|---|---|---:|---|
| `trigger-dev.task.trigger` | REST | WRITE | configurable |
| `trigger-dev.task.batch_trigger` | REST | WRITE | configurable |
| `trigger-dev.run.list` | REST | READ | none |
| `trigger-dev.run.get` | REST | READ | none |
| `trigger-dev.run.cancel` | REST | HIGH_RISK | explicit + enabled |
| `trigger-dev.run.replay` | REST | HIGH_RISK | explicit + enabled |
| `trigger-dev.run.reschedule` | REST | WRITE | configurable |
| `trigger-dev.batch.get` | REST | READ | none |
| `trigger-dev.batch.results` | REST | READ | none |
| `trigger-dev.schedule.list` | REST | READ | none |
| `trigger-dev.schedule.get` | REST | READ | none |

Deletion, environment-variable mutation, deployment promotion, queue mutation, bulk actions, billing, and project/organization administration are intentionally not exposed.

## Authentication and least privilege

Set `TRIGGER_SECRET_KEY` to a Trigger.dev environment secret key. The key remains inside the connector process and is only sent in the `Authorization: Bearer ...` header to the configured Trigger.dev API origin. Never place the key in an agent prompt or tool input.

Trigger.dev now supports multiple environment API keys and access presets. Prefer an **Observer** key for read-only use. Use **Task operator** or **Operator** only when task triggering/run operations are required. Narrow keys to specific tasks when Trigger.dev permits it. Avoid unrestricted keys unless the connector genuinely requires them.

For self-hosted Trigger.dev, set `TRIGGER_API_URL`. Non-HTTPS URLs are rejected except localhost/127.0.0.1.

## Environment variables

```text
TRIGGER_SECRET_KEY=                 # required
TRIGGER_API_URL=https://api.trigger.dev
TRIGGER_TIMEOUT_MS=15000
TRIGGER_MAX_RETRIES=2
TRIGGER_ALLOW_WRITE=false
TRIGGER_ALLOW_HIGH_RISK=false
```

`TRIGGER_ALLOW_WRITE=true` allows WRITE tools without per-call approval. HIGH_RISK operations still require both `TRIGGER_ALLOW_HIGH_RISK=true` and `approved=true` in the tool call.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server speaks MCP over stdio and can therefore be launched by MCP clients that support local stdio servers. Configure the process environment in the client rather than embedding secrets in command arguments.

## Tool behavior

### Task triggering

Single-task trigger accepts JSON payload plus bounded Trigger.dev options such as idempotency key, concurrency key, delay, TTL, tags, and queue configuration. Batch trigger accepts 1–1000 items. Use batch trigger instead of repeated single triggers when appropriate.

### Runs

Run IDs must match `run_...`. Listing is bounded to 100 results per call and exposes a controlled subset of filters. `run.cancel` is HIGH_RISK because it stops executing work. `run.replay` is HIGH_RISK because it creates a new execution from an earlier payload. `run.reschedule` only succeeds for runs in Trigger.dev's DELAYED state.

### Batches and schedules

Batch and schedule tools are read-only. Batch results include only completed runs according to Trigger.dev's API behavior.

## Rate limits and reliability

Trigger.dev documents a general API limit of **1,500 requests per minute**. Batch trigger supports up to **1,000 items** in current Trigger.dev versions. The connector:

- retries only safe GET requests;
- uses bounded exponential backoff;
- honors `Retry-After` and `x-ratelimit-reset` when supplied;
- never blindly retries POST operations, including trigger/cancel/replay/reschedule;
- applies request timeouts and AbortSignal cancellation;
- maps non-2xx responses to `TriggerApiError` with status, response body, and retry timing when available.

Authentication, permission, validation, and write failures are not retried automatically.

## Security

- Credentials remain in environment/configuration, never MCP tool arguments.
- The API origin is fixed by configuration; cross-origin requests are blocked to reduce SSRF risk.
- Tool identifiers and resource IDs have strict schemas.
- No generic URL/request tool exists.
- Retrieved Trigger.dev payloads, outputs, logs, metadata, task content, and other provider data are untrusted data. MCP clients must not treat them as instructions or permission changes.
- The connector does not dynamically discover or trust new upstream MCP tools.
- Destructive administrative operations are not implemented.
- Avoid logging Authorization headers or raw secrets.

## Official MCP coexistence

For interactive development you may separately install Trigger.dev's official MCP server using the CLI. Trigger.dev documents a `--dev-only` mode that prevents production-data access. This connector does not proxy that upstream server because dynamic tool sets and interactive CLI authentication are a poorer fit for the stable production-facing contract here.

## Testing

```bash
npm test
```

Tests use mocked `fetch` and no live credentials. They cover bearer-auth isolation, write retry behavior, strict identifier validation, bounded batch/tag inputs, run filter encoding, permission denial, and explicit HIGH_RISK approval.

## Limitations

- This package does not create or deploy Trigger.dev task source code.
- It does not expose the official MCP server's coding-assistant/project-initialization features.
- It does not fetch oversized payload/output presigned URLs; callers receive the provider response as-is.
- Cursor pagination is surfaced only through the supported run-list `after` field and schedule page/perPage fields.
- Webhook ingestion is not implemented because this connector is a stdio MCP server and no inbound HTTP listener is opened.
