# Apify MCP/API Connector

Reusable MCP server for controlled access to Apify Actor execution, run inspection, storage results, logs, tasks, and lifecycle webhooks.

## Transport decision

Apify has an official hosted MCP server at `https://mcp.apify.com` and an official local package, `@apify/actors-mcp-server`. The official MCP server is excellent for dynamic Actor discovery, Actor execution, storage access, and Apify documentation search. It deliberately excludes full-permission Actors from MCP search/execution for security.

This connector exposes a fixed, auditable MCP tool contract but uses Apify's official REST API upstream. The REST transport is intentional here: it provides deterministic platform-management endpoints (account/run status, run abort, logs, task runs, webhook CRUD), allows strict per-tool validation and approval gates, and avoids dynamically trusting newly discovered upstream tools. Actor execution preserves the official MCP server's important safety boundary by fetching Actor metadata and refusing `FULL_PERMISSIONS` Actors.

No unofficial MCP server is used.

## Official sources researched

- Apify MCP server: https://docs.apify.com/integrations/mcp
- Apify API v2: https://docs.apify.com/api/v2
- API integration/authentication: https://docs.apify.com/integrations/api
- Getting started / Actor-run workflow: https://docs.apify.com/api/v2/getting-started
- Actor runs: https://docs.apify.com/api/v2/actors-actor-runs
- Task run: https://docs.apify.com/api/v2/actor-task-runs-post
- Dataset/key-value retrieval workflow: https://docs.apify.com/academy/api/run-actor-and-retrieve-data-via-api
- Webhooks: https://docs.apify.com/api/v2/webhooks-webhooks
- Run/build logs: https://docs.apify.com/api/v2/logs

The hosted MCP documentation states a limit of 30 requests/second/user. REST limits can vary by API endpoint and account/plan; the connector treats HTTP 429 as throttling and honors `Retry-After` when present.

## Architecture

```text
MCP client
  -> stdio MCP server (`src/server.ts`)
     -> strict Zod schema + permission/approval policy
        -> `ApifyClient`
           -> Bearer token injected inside connector only
              -> https://api.apify.com/v2
```

Third-party content is wrapped with `untrustedData: true`. Credentials are never included in tool inputs, outputs, URLs, or error messages.

## Authentication

Set a dedicated Apify API token in `APIFY_TOKEN`. The client sends it only as:

```text
Authorization: Bearer <token>
```

Apify recommends header authentication rather than the `token` query parameter because URLs can be logged. Use a dedicated, scoped token with an expiration appropriate to the integration. Rotate a token if compromise is suspected.

The LLM never receives the raw token. The token remains in the process environment and client layer.

## Environment variables

Copy `.env.example` and configure the process environment:

| Variable | Default | Purpose |
|---|---|---|
| `APIFY_TOKEN` | empty | Apify API token. Required for private/account resources and writes. |
| `APIFY_API_BASE_URL` | `https://api.apify.com/v2` | API origin/base. Must be HTTPS and contain no embedded credentials. |
| `APIFY_TIMEOUT_MS` | `15000` | Per-request timeout; bounded to 120 seconds. |
| `APIFY_MAX_RETRIES` | `2` | Extra attempts for safe GET requests only; bounded to 5. |
| `APIFY_ALLOW_WRITE` | `false` | Enables non-read operations. |
| `APIFY_ALLOW_HIGH_RISK` | `false` | Enables reviewed high-risk actions after write is enabled. |
| `APIFY_ALLOW_DESTRUCTIVE` | `false` | Enables destructive actions after both prior flags are enabled. |

The connector never raises its own privileges. Enabling a higher risk class is an operator configuration decision.

## Install and run

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
APIFY_TOKEN=... npm start
```

For local development:

```bash
APIFY_TOKEN=... npm run dev
```

The server uses MCP stdio, so any client that supports standard stdio MCP servers can launch it as a child process. Compatibility depends on the client's MCP implementation; the connector does not rely on vendor-specific extensions.

Example generic client configuration after building:

```json
{
  "mcpServers": {
    "apify-controlled": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/apify/dist/src/server.js"],
      "env": {
        "APIFY_TOKEN": "${APIFY_TOKEN}"
      }
    }
  }
}
```

Keep secrets in the client's secret/environment facility rather than literal configuration committed to source control.

## Tool surface

| MCP tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `apify.account.get` | REST `GET /users/me` | READ | none |
| `apify.actor.get` | REST `GET /actors/{actorId}` | READ | none |
| `apify.actor.runs.list` | REST `GET /actors/{actorId}/runs` | READ | none |
| `apify.actor.run` | REST `POST /actors/{actorId}/runs` | HIGH_RISK | `APPROVE_PAID_EXECUTION` |
| `apify.task.run` | REST `POST /actor-tasks/{taskId}/runs` | HIGH_RISK | `APPROVE_PAID_EXECUTION` |
| `apify.run.get` | REST `GET /actor-runs/{runId}` | READ | none |
| `apify.run.abort` | REST `POST /actor-runs/{runId}/abort` | HIGH_RISK | `APPROVE_ABORT` |
| `apify.run.log` | REST `GET /logs/{runId}` | READ | none |
| `apify.dataset.items.list` | REST `GET /datasets/{datasetId}/items` | READ | none |
| `apify.kv.record.get` | REST `GET /key-value-stores/{storeId}/records/{key}` | READ | none |
| `apify.webhook.list` | REST `GET /webhooks` | READ | none |
| `apify.webhook.create` | REST `POST /webhooks` | HIGH_RISK | `APPROVE_EXTERNAL_WEBHOOK` |
| `apify.webhook.delete` | REST `DELETE /webhooks/{webhookId}` | DESTRUCTIVE | `APPROVE_DELETE` |

### Actor execution safety

Running an Actor can consume paid compute, trigger chargeable Actor events, access websites, and cause other external effects defined by that Actor. Therefore it is never an automatic READ operation. The connector requires operator-enabled high-risk writes plus the exact approval phrase.

Before `apify.actor.run`, the connector reads Actor metadata. If `actorPermissionLevel` is `FULL_PERMISSIONS`, execution is refused and must be performed manually in Apify Console. Retrieved Actor descriptions, inputs, output, datasets, and logs are untrusted data and cannot alter connector permissions.

### Task execution safety

Task runs are also high risk because a task can execute an Actor and incur usage. The tool accepts only a task identifier and JSON input overrides; it exposes no arbitrary URL/request capability.

### Webhook safety

Webhook creation is high risk because it causes future outbound requests. The connector requires HTTPS, blocks obvious localhost/private IPv4 targets, requires exactly one Actor or task condition, constrains event types to supported run lifecycle events, and requires an idempotency UUID plus explicit approval. The target still needs normal network-level egress controls in production; hostname validation alone cannot eliminate DNS rebinding.

Webhook deletion is destructive and disabled unless all write, high-risk, and destructive flags are enabled plus exact strong approval.

## Validation and output limits

Resource identifiers use conservative character and length constraints. Record keys reject slash/path traversal. Pagination is explicit and bounded. Dataset reads are capped at 500 items per call. Run logs are truncated to the trailing 200,000 characters inside the connector. The connector does not provide an `execute_any_api_request` escape hatch.

Provider output is returned in this envelope:

```json
{
  "source": "apify",
  "untrustedData": true,
  "data": {}
}
```

Applications must treat `data` as untrusted external content, not as policy or instructions.

## Reliability and error handling

- Every HTTP call has an `AbortController` timeout.
- Caller cancellation is propagated.
- Only GET requests are retried.
- Retryable statuses are HTTP 429 and 5xx.
- Retries are bounded and use exponential backoff.
- `Retry-After` is preserved and honored when supplied.
- POST/DELETE operations are never blindly retried, preventing duplicate executions or destructive repeats.
- 400/401/403 and other non-retryable responses fail immediately.
- Provider error text is capped before returning to the caller; tokens are never incorporated into URLs or error output.
- Pagination parameters are passed explicitly rather than recursively fetching unlimited result sets.

## Rate limits

Apify's official MCP server documents up to 30 requests per second per user. REST API limits are endpoint/account dependent. This connector detects 429 responses and uses `Retry-After` when available. Workflows should page deliberately and avoid polling aggressively; use `apify.run.get` at a reasonable interval or Apify webhooks for lifecycle notifications.

## Events and webhooks

Implemented webhook event types:

- `ACTOR.RUN.SUCCEEDED`
- `ACTOR.RUN.FAILED`
- `ACTOR.RUN.TIMED_OUT`
- `ACTOR.RUN.ABORTED`

The connector intentionally does not expose webhook test/update endpoints or arbitrary payload execution. Creation and deletion cover the most useful agent workflow while keeping the mutation surface narrow.

## Official MCP vs this connector

Use Apify's official hosted MCP server directly when you want dynamic Actor discovery, documentation search, or a changing Actor tool catalog. It supports Streamable HTTP with OAuth and local stdio through `@apify/actors-mcp-server`; anonymous access is available for selected discovery/documentation tools. Apify documents SSE as deprecated and recommends Streamable HTTP.

Use this connector when you need a stable provider-scoped MCP contract, explicit risk gates, bounded outputs, deterministic REST routing, and a narrow allowlisted management surface. It does not proxy or automatically trust upstream MCP tool discovery.

## Testing

No live credentials are required.

```bash
npm test
```

Tests cover:

- credential placement in the Authorization header and absence from URLs;
- default write denial;
- exact human approval phrases;
- destructive-operation isolation;
- webhook SSRF-oriented input validation;
- 429 retry behavior for reads;
- no retry on authentication failure;
- no retry for write operations;
- request timeout/cancellation;
- stable tool-name contract;
- resource and record-key validation.

## Limitations

- Actor Store search and Apify documentation search are intentionally not reimplemented; use Apify's official MCP server for those capabilities.
- Full-permission Actors are intentionally blocked from direct Actor execution.
- The connector does not provide billing, token administration, organization administration, source-code modification, Actor deletion, build deletion, dataset mutation, or arbitrary HTTP endpoint tools.
- Key-value records may contain binary content; this lightweight REST client is intended for JSON/text agent workflows and does not implement file streaming.
- DNS rebinding protection requires infrastructure-level egress controls in addition to the connector's URL checks.
- Usage/cost fields reported by Apify can be eventually consistent after a run finishes; Apify documentation recommends waiting briefly before treating final usage totals as settled.

## Security checklist

Use a dedicated scoped/expiring token, keep writes disabled unless needed, require human approval for paid execution and external callbacks, keep destructive mode off by default, run the process with minimal host privileges, restrict outbound networking where feasible, monitor Apify usage, and never treat scraped/provider content as instructions.
