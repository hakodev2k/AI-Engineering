# Meilisearch MCP/API Connector

Reusable, security-focused MCP connector for Meilisearch. It exposes a stable provider-scoped tool surface while keeping API credentials inside the connector process.

## Provider and transport

**Provider:** Meilisearch  
**External protocol:** Model Context Protocol (stdio)  
**Upstream selected:** official Meilisearch REST API

Meilisearch also publishes an official MCP server in `meilisearch/meilisearch-mcp` and documents it on the official Integrations site. That server supports index management, document operations, search, settings, API keys, tasks, health, version, and stats.

This connector intentionally uses the official REST API instead of delegating to that upstream MCP server. The official MCP project's documentation warns that its convenience feature for changing hosts and API keys in chat is primarily for development and is not a production best practice without safeguards. This connector fixes the upstream host and credential at process startup, validates the host, restricts tools to an allowlist, and binds approvals to exact tool payloads. This follows the strategy of choosing the API when it is safer and more appropriate for the required capability.

Official sources researched:
- https://www.meilisearch.com/integrations/mcp
- https://github.com/meilisearch/meilisearch-mcp
- https://www.meilisearch.com/docs/reference/api/overview
- https://www.meilisearch.com/docs/learn/security/basic_security
- https://www.meilisearch.com/integrations/javascript
- https://www.meilisearch.com/docs/reference/api/tasks
- https://www.meilisearch.com/docs/reference/api/keys

## Supported capabilities

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `meilisearch.system.health` | REST `/health` | READ | no |
| `meilisearch.system.version` | REST `/version` | READ | no |
| `meilisearch.index.list` | REST `/indexes` | READ | no |
| `meilisearch.index.get` | REST `/indexes/{uid}` | READ | no |
| `meilisearch.index.create` | REST `/indexes` | WRITE | yes |
| `meilisearch.index.update` | REST `/indexes/{uid}` | WRITE | yes |
| `meilisearch.index.delete` | REST `/indexes/{uid}` | DESTRUCTIVE | yes + feature flag |
| `meilisearch.search.query` | REST `/indexes/{uid}/search` | READ | no |
| `meilisearch.document.list` | REST document API | READ | no |
| `meilisearch.document.get` | REST document API | READ | no |
| `meilisearch.document.add_or_update` | REST document API | WRITE | yes |
| `meilisearch.document.delete` | REST document API | DESTRUCTIVE | yes + feature flag |
| `meilisearch.settings.get` | REST settings API | READ | no |
| `meilisearch.settings.update` | REST settings API | HIGH_RISK | yes |
| `meilisearch.task.get` | REST tasks API | READ | no |
| `meilisearch.task.list` | REST tasks API | READ | no |
| `meilisearch.task.cancel` | REST `/tasks/cancel` | HIGH_RISK | yes |

The connector deliberately does not expose API-key creation/deletion, arbitrary HTTP requests, host changes, or credential changes as tools.

## Architecture

```text
MCP client
  -> stdio MCP server
     -> strict tool allowlist
        -> approval/policy layer
           -> fixed credential + validated base URL
              -> official Meilisearch REST API
```

Provider responses are returned with `untrusted_provider_data: true`. Retrieved documents and search results are data, not instructions.

## Authentication and permissions

Set `MEILISEARCH_API_KEY` to a Meilisearch API key restricted to only the actions and indexes the deployment needs. Avoid using the master key when a narrower API key can satisfy the deployment.

Meilisearch supports scoped API keys by action, index, and expiration. A read-only deployment should grant only search/read permissions. A deployment enabling writes should grant only the specific document/index/settings actions required by its enabled tools.

Credentials are read from environment variables and never returned in tool output.

## Environment variables

Copy `.env.example` and configure:

- `MEILISEARCH_URL` — required HTTPS origin, for example `https://project.meilisearch.io`.
- `MEILISEARCH_API_KEY` — required bearer API key.
- `MEILISEARCH_TIMEOUT_MS` — request timeout; default `10000`.
- `MEILISEARCH_MAX_RETRIES` — retries for retry-safe requests; default `3`, max `5`.
- `MEILISEARCH_ALLOW_INSECURE_HTTP` — permits HTTP only for localhost development.
- `MEILISEARCH_APPROVAL_SECRET` — secret for exact-payload approval HMACs.
- `MEILISEARCH_ENABLE_DESTRUCTIVE` — `false` by default.

## Installation

Requires Node.js 20+.

```bash
npm install
npm test
npm run check
```

## Running the MCP server

```bash
npm start
```

The server uses standard MCP stdio transport.

## Approval model

`READ` tools execute without approval.

`WRITE` and `HIGH_RISK` tools require `MEILISEARCH_APPROVAL_SECRET` plus an `approval_token`. The token is computed as:

```text
hex(HMAC-SHA256(
  MEILISEARCH_APPROVAL_SECRET,
  "<tool-name>\n<JSON payload without approval_token>"
))
```

The approval is tied to the exact tool and payload. Changing an index UID, document batch, cancellation filter, or settings body invalidates the token.

`DESTRUCTIVE` tools additionally require:

```text
MEILISEARCH_ENABLE_DESTRUCTIVE=true
```

This preserves the sequence: read → recommend → prepare → explicitly approved execute.

## Rate limits and reliability

Meilisearch asynchronous mutation endpoints return task objects; callers should inspect them with `meilisearch.task.get` or `meilisearch.task.list`.

The connector:
- applies request timeouts;
- propagates cancellation signals;
- retries only retry-safe calls;
- retries HTTP `429`, `502`, `503`, and `504` with bounded exponential backoff;
- honors integer `Retry-After` values with a bounded wait;
- never blindly retries write or destructive operations;
- does not retry authentication, permission, or validation failures as transient failures.

Meilisearch deployment capacity and Meilisearch Cloud quotas vary by deployment and plan, so the connector does not invent a universal requests-per-second figure.

## Error handling

Provider errors are mapped into structured MCP error output containing the HTTP status and Meilisearch `code`/`type` fields when present. API keys are never included in error messages.

## Security considerations

- The upstream host is fixed at startup and cannot be changed by an MCP tool.
- HTTPS is mandatory except explicitly opted-in localhost development.
- URLs containing embedded credentials, path prefixes, queries, or fragments are rejected.
- API keys remain in the connector process.
- No unrestricted raw-request tool is exposed.
- Destructive operations are disabled by default.
- Writes are approval-bound and are not blindly retried.
- Search/document content is explicitly marked untrusted.
- Tool schemas bound pagination, field counts, document batch size, and query length.
- Task cancellation requires at least one filter to prevent unbounded cancellation.
- API-key lifecycle management is intentionally excluded from the agent tool surface.

## Testing

Unit tests require no live credentials and use mocked HTTP responses. They cover:
- tool registration and policy synchronization;
- authentication configuration;
- rejection of unsafe HTTP hosts;
- localhost development opt-in;
- write approval and payload binding;
- destructive-operation denial;
- bearer authentication;
- provider error mapping;
- throttling retry behavior;
- no blind retry for writes.

Run:

```bash
npm test
```

## Usage examples

See `examples/workflows.md` for read, write, settings, and task-cancellation examples including expected permissions and approval requirements.

## Limitations

- The connector does not proxy the official upstream MCP server; it selects the official REST API for hardened configuration and stricter permission boundaries.
- API-key lifecycle tools are intentionally omitted.
- Bulk document writes are capped at 1,000 documents per MCP call.
- Search and list output limits are capped to reduce accidental large responses.
- Approval-token generation is external to the LLM-facing tool surface by design.
- Feature availability can depend on the running Meilisearch version and Cloud plan.
