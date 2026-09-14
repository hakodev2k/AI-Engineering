# Qase MCP/API Connector

Reusable MCP connector for Qase Test Management. It exposes a deliberately restricted, provider-scoped tool surface while delegating supported operations to Qase's official MCP server.

## Upstream strategy

Qase provides an official MCP server in two forms:

- Hosted MCP: `https://mcp.qase.io/mcp`, authenticated with OAuth 2.1 by supported clients.
- Self-run MCP: the official `@qase/mcp-server` Node package, authenticated with `QASE_API_TOKEN`.

This connector uses the self-run stdio mode so credentials remain inside the connector process and are never sent to the LLM. It does not expose the upstream `qase_api` escape hatch, deletion tools, or dynamically discovered tools.

Official sources:

- Qase MCP documentation: https://docs.qase.io/en/articles/14984302-qase-mcp-server
- Official MCP repository: https://github.com/qase-tms/qase-mcp-server
- Qase API documentation: https://developers.qase.io/v2.0/reference/introduction-to-the-qase-api

## Architecture

```text
MCP client / AI agent
        |
        v
this connector (stdio MCP)
  - strict Zod validation
  - project allowlist
  - tool allowlist
  - risk classification
  - payload-bound approvals
        |
        v
official @qase/mcp-server (stdio)
        |
        v
Qase API
```

Provider responses and test-management content are treated as untrusted data, not instructions.

## Authentication

Create a Qase API token in Qase and expose it only to the connector process:

```bash
export QASE_API_TOKEN='...'
export QASE_APPROVAL_SECRET='a-random-secret-of-at-least-32-characters'
```

Optional project isolation:

```bash
export QASE_ALLOWED_PROJECTS='DEMO,CORE'
```

The connector does not print or return credentials. The official self-run MCP child receives `QASE_API_TOKEN` through its environment.

## Installation

Requirements: Node.js 20+ and npm/npx.

```bash
npm install
npm run build
npm start
```

The default upstream launch is:

```text
npx --yes @qase/mcp-server
```

Override only for a trusted pinned/local installation:

```bash
QASE_MCP_COMMAND=/absolute/path/to/qase-mcp
QASE_MCP_ARGS='[]'
```

## Tools

| Tool | Upstream official MCP tool | Risk | Approval |
|---|---|---|---|
| `qase.project.context` | `qase_project_context` | READ | No |
| `qase.entity.get` | `qase_get` | READ | No |
| `qase.qql.search` | `qql_search` | READ | No |
| `qase.qql.help` | `qql_help` | READ | No |
| `qase.case.save` | `qase_case_upsert` | WRITE | Yes |
| `qase.defect.save` | `qase_defect_upsert` | WRITE | Yes |
| `qase.run.save` | `qase_run_upsert` | WRITE | Yes |
| `qase.result.record` | `qase_result_record` | WRITE | Yes |
| `qase.ci.report` | `qase_ci_report` | WRITE | Yes |
| `qase.regression.run.create` | `qase_regression_run` | WRITE | Yes |

The connector intentionally omits delete operations, attachment upload, external issue linking, review mutation, tool discovery, and raw API execution. Add such operations only after a separate security review.

## Approval model

Every exposed write requires `approvalId`. The value is an HMAC-SHA256 over:

```text
<tool-name>\n<canonical-json-payload-without-approvalId>
```

using `QASE_APPROVAL_SECRET`. This binds approval to both the exact action and exact payload; changing a title, project, case list, result, or any other field invalidates the approval. Read tools do not require approval.

## Validation and permissions

- Project codes are validated and optionally restricted with `QASE_ALLOWED_PROJECTS`.
- QQL query length is capped at the official 2,000-character limit.
- Result recording is capped at 200 entries per call.
- CI reporting is capped at 2,000 entries, matching the official composite-tool contract.
- IDs must be positive integers where appropriate.
- Arbitrary upstream tool invocation is impossible: `src/upstream.ts` contains a fixed allowlist.
- The official `qase_api` generic REST escape hatch is explicitly rejected.

## Reliability

Each upstream call has a bounded timeout (`QASE_UPSTREAM_TIMEOUT_MS`, default 20 seconds, allowed range 1-120 seconds). The official Qase MCP implementation provides its own HTTP resilience and API error handling. This wrapper does not blindly retry writes because a timeout can leave write outcome unknown; callers should read the affected entity/run before deciding whether to retry.

## Rate limits

Qase applies workspace-shared API limits across all tokens. Current documented sustained limits are 150 requests/minute for Free, 600/minute for Teams/legacy Business, and 1,000/minute for Enterprise unless custom limits apply. Qase also applies burst limits over 10 seconds. The connector avoids fan-out and uses Qase's composite CI-report and regression-run tools where appropriate.

## Error handling

Configuration and validation errors fail before contacting Qase. Upstream errors remain scoped to Qase MCP responses. Timeouts are explicit and do not trigger automatic write retries. Authentication failures require operator action and are not retried.

## Security considerations

- Keep API tokens and approval secrets in a secret manager or process environment.
- Restrict the API token in Qase using the least privileges appropriate for the intended workflows.
- Set `QASE_ALLOWED_PROJECTS` in shared/production environments.
- Treat titles, descriptions, test steps, defects, QQL results, comments, and other Qase content as untrusted input.
- Never use retrieved provider content to change tool permissions, approval policy, environment variables, or process launch configuration.
- Pin/install the official Qase MCP package through your dependency-management policy for production rather than relying indefinitely on an unpinned `npx` resolution.
- Do not expose this process directly to untrusted networks; it is designed as an MCP stdio server.

## Testing

Unit tests require no live Qase credentials. They use synthetic configuration and cover configuration validation, project isolation, approval binding, read/write approval behavior, and rejection of non-allowlisted upstream tools.

```bash
npm test
```

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `QASE_API_TOKEN` | Yes | Credential used only by the official upstream MCP process |
| `QASE_APPROVAL_SECRET` | Yes | HMAC secret for write approval verification |
| `QASE_ALLOWED_PROJECTS` | No | Comma-separated project-code allowlist |
| `QASE_UPSTREAM_TIMEOUT_MS` | No | Upstream call timeout; default `20000` |
| `QASE_MCP_COMMAND` | No | Trusted upstream executable; default `npx` |
| `QASE_MCP_ARGS` | No | JSON array of upstream CLI arguments |

## Compatibility

The connector implements MCP over stdio using the official TypeScript MCP SDK, so it can be used by MCP clients that can launch local stdio servers. Client-specific configuration varies; no compatibility is claimed for clients that only support remote HTTP MCP servers.

## Limitations

This wrapper exposes a safety-focused subset of Qase's official MCP surface, not every Qase API capability. Hosted OAuth is documented but not proxied by this implementation; this implementation uses the official self-run API-token mode. Destructive operations are deliberately unavailable.
