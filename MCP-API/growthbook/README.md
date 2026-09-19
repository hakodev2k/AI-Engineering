# GrowthBook MCP/API Connector

Reusable, safety-scoped MCP server for GrowthBook feature flags and experiments. It exposes ten stable tools over GrowthBook's official REST API while deliberately avoiding arbitrary HTTP passthrough.

## Transport strategy

GrowthBook maintains the official open-source `growthbook/growthbook-mcp` server and publishes `@growthbook/mcp`. The official server supports stdio and Streamable HTTP, API-key/PAT authentication for stdio, and OAuth-protected HTTP mode. Its current architecture is intentionally thin: skills plus authenticated GrowthBook REST API read/write tools. That broad API bridge is useful for interactive agents, but this connector uses direct official REST calls behind a fixed allowlist so each operation has a strict schema, explicit risk class, deterministic retry policy, and connector-side approval gate.

Official sources researched for this implementation:

- MCP integration: https://docs.growthbook.io/integrations/mcp
- Official MCP source: https://github.com/growthbook/growthbook-mcp
- Official agent workflows/API examples: https://github.com/growthbook/skills
- GrowthBook API base: `https://api.growthbook.io`

The official MCP remains a good direct-client choice when its free-form API surface is acceptable. This package is preferable when an agent platform needs a narrower security boundary.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod tool schema
  -> risk/approval policy
  -> GrowthBookClient
  -> fixed-origin official GrowthBook REST API
```

Credentials never appear in tool inputs or outputs. Provider content is labelled untrusted and must never be interpreted as instructions or permission changes.

## Authentication

Set `GB_API_KEY` to a GrowthBook API key or personal access token accepted by the GrowthBook API. For GrowthBook Cloud the default API origin is `https://api.growthbook.io`. Self-hosted installations can set `GB_API_URL`.

Use the least-privileged credential available for the operations you enable. Read-only automation should use a credential that cannot mutate flags or experiments. Write-capable deployments should be isolated from read-only agent deployments.

```bash
cp .env.example .env
export GB_API_KEY='...'
```

Never commit credentials. The connector sends the credential only in the `Authorization: Bearer` header to the configured GrowthBook origin.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `GB_API_KEY` | yes | - | API key/PAT kept inside connector |
| `GB_API_URL` | no | `https://api.growthbook.io` | Cloud or self-hosted API origin |
| `GROWTHBOOK_TIMEOUT_MS` | no | `15000` | Per-request timeout |
| `GROWTHBOOK_MAX_RETRIES` | no | `2` | Bounded retries for GET only |
| `GROWTHBOOK_REQUIRE_WRITE_APPROVAL` | no | `true` | Require approval for WRITE |
| `GROWTHBOOK_APPROVAL_SECRET` | for approved writes | - | Runtime approval credential |
| `GROWTHBOOK_ENABLE_HIGH_RISK` | no | `false` | Explicitly enables high-risk tools |

`GB_API_URL` must be HTTPS except loopback HTTP for local self-hosting. Requests are origin-locked and only `/api/` paths are accepted.

## Installation and running

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and therefore works with MCP clients that can launch a local command, including Claude Code, Cursor, compatible Copilot/VS Code environments, and custom MCP hosts. Compatibility depends on the client's MCP stdio support; no vendor-specific integration is assumed.

Example client configuration:

```json
{
  "mcpServers": {
    "growthbook-safe": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/growthbook/dist/src/server.js"],
      "env": {
        "GB_API_KEY": "${GB_API_KEY}"
      }
    }
  }
}
```

## Tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `growthbook.project.list` | REST | READ | no | List projects |
| `growthbook.feature.list` | REST | READ | no | List feature flags with bounded pagination |
| `growthbook.feature.get` | REST | READ | no | Read one feature flag |
| `growthbook.feature.create` | REST | WRITE | yes by default | Create a feature flag |
| `growthbook.feature.toggle` | REST | WRITE | yes by default | Toggle a draft revision for one environment |
| `growthbook.experiment.list` | REST | READ | no | Search/list experiments |
| `growthbook.experiment.get` | REST | READ | no | Read experiment metadata |
| `growthbook.experiment.results` | REST | READ | no | Read experiment results |
| `growthbook.experiment.create` | REST | WRITE | yes by default | Create an experiment |
| `growthbook.experiment.stop` | REST | HIGH_RISK | always + enable flag | Stop a running experiment |

The feature endpoints follow GrowthBook's v2 feature API used by official GrowthBook skills. Experiment and project operations use the v1 API. The stop operation uses GrowthBook's dedicated `POST /api/v1/experiments/{id}/stop` endpoint rather than a generic update.

Create operations accept a JSON object because GrowthBook's feature and experiment schemas evolve and differ by configuration. The endpoint and HTTP method remain fixed; callers cannot provide a URL, path, or method.

## Permission and approval model

READ operations execute automatically. WRITE operations require a matching runtime approval secret by default. HIGH_RISK operations are disabled unless `GROWTHBOOK_ENABLE_HIGH_RISK=true`; enabling them does not bypass approval.

The approval secret is an orchestration credential, not a value the LLM should know. A trusted host should inject it only after human approval. The comparison is timing-safe. Provider-returned text cannot change these controls.

This connector exposes no delete endpoint and no generic `execute_request` tool.

## Reliability and rate limiting

Every request has a timeout and supports cancellation through the HTTP abort signal. GET requests retry only on `429` and `5xx`, with bounded exponential backoff. `Retry-After` is preserved and respected when present. POST operations are never blindly retried because mutation replay can duplicate or change state.

Authentication, authorization, and validation failures are not retried. API errors are mapped to structured MCP errors. Pagination is explicit and bounded for feature listing; experiment list size is capped at 100 per call.

GrowthBook deployment limits can vary by plan and self-hosted configuration, so this connector does not hard-code a universal request-per-second quota. Provider throttling is handled from HTTP status/headers.

## Security considerations

- Credential isolation: `GB_API_KEY` remains in the connector process.
- SSRF defense: callers cannot provide URLs; requests are fixed to the configured API origin.
- Prompt injection: all GrowthBook content is returned as `untrusted-provider-data`.
- Permission escalation: content and tool inputs cannot change risk classification.
- Mutations: explicit approval is required by default; high-risk execution is separately disabled by default.
- Retries: reads only; no blind mutation replay.
- Logging: this implementation does not log request headers, credentials, or payloads.
- Upstream MCP: the official server is trusted, but its free-form API tool is intentionally not proxied because a narrow allowlist provides a stronger agent boundary.

## Error handling

Failures return `{ ok: false, error: ... }` as MCP error content. HTTP errors include status and `Retry-After` when available. Invalid configuration fails at startup. Invalid tool input is rejected by the MCP/Zod schema before reaching GrowthBook.

## Testing

```bash
npm test
npm run build
```

Tests use mocked `fetch` and require no live credentials. Coverage includes tool count/route construction, identifier encoding, read/write/high-risk policy, API error mapping, rate-limit retry behavior, mutation non-retry behavior, and arbitrary-path rejection.

## Limitations

This connector intentionally implements a focused subset of GrowthBook. It does not expose arbitrary API calls, flag deletion, revision publication, rule editing, environment administration, data-source management, or organization administration. For broader interactive coverage, use GrowthBook's official MCP server and skills with an appropriately scoped credential and human review for mutations.

See `examples/workflows.md` for safe workflow examples.
