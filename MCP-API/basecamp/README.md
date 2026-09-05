# Basecamp MCP/API Connector

Reusable MCP stdio server for Basecamp project-management workflows. The connector exposes a deliberately bounded tool surface backed by Basecamp's official REST API and keeps OAuth credentials inside the connector process.

## Transport strategy

As verified on 2026-09-06, Basecamp publicly advertises official ChatGPT/Claude connectors and full MCP support as **coming soon**, while its production REST API, CLI, and official SDKs are available today. Therefore this connector uses the official Basecamp REST API now rather than depending on an unavailable MCP transport. When Basecamp's official MCP becomes generally available, capabilities can be migrated behind the same external tool names without changing callers.

Official sources:
- Basecamp API reference: https://github.com/basecamp/bc-api
- Official SDKs: https://github.com/basecamp/basecamp-sdk
- Basecamp CLI / agent support: https://basecamp.com/agents
- Basecamp pricing/features (MCP status): https://basecamp.com/pricing

## Supported capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `basecamp.profile.get` | REST | READ | no |
| `basecamp.project.list` | REST | READ | no |
| `basecamp.project.get` | REST | READ | no |
| `basecamp.people.list` | REST | READ | no |
| `basecamp.project.people.list` | REST | READ | no |
| `basecamp.todolist.get` | REST | READ | no |
| `basecamp.todo.list` | REST | READ | no |
| `basecamp.todo.get` | REST | READ | no |
| `basecamp.todo.create` | REST | WRITE | configurable, default yes |
| `basecamp.todo.complete` | REST | WRITE | configurable, default yes |
| `basecamp.todo.uncomplete` | REST | WRITE | configurable, default yes |
| `basecamp.message.list` | REST | READ | no |
| `basecamp.message.get` | REST | READ | no |
| `basecamp.message.draft.create` | REST | WRITE | configurable, default yes |
| `basecamp.message.publish` | REST | HIGH_RISK | always |
| `basecamp.comment.list` | REST | READ | no |
| `basecamp.comment.create` | REST | HIGH_RISK | always |

No arbitrary HTTP request, project deletion, trashing, permission modification, or account-administration tool is exposed.

## Architecture

`MCP client -> MCP stdio server -> validation/policy -> BasecampClient -> OAuth bearer token -> https://3.basecampapi.com/{account_id}`

Retrieved Basecamp HTML/rich text is treated as untrusted data, never as instructions. The tool schemas are strict and provider-scoped.

## Authentication

Basecamp uses OAuth 2.0. Supply a valid access token in `BASECAMP_ACCESS_TOKEN`; do not place it in prompts or tool arguments. Token acquisition/refresh is intentionally external to the MCP tool surface so refresh tokens and client secrets are never exposed to the model.

Basecamp requires an identifiable `User-Agent` containing an application name and contact link/email. Set `BASECAMP_USER_AGENT` accordingly.

## Environment variables

Copy `.env.example` and set:
- `BASECAMP_ACCESS_TOKEN` — OAuth access token.
- `BASECAMP_ACCOUNT_ID` — numeric Basecamp account ID.
- `BASECAMP_USER_AGENT` — required identifiable application string.
- `BASECAMP_TIMEOUT_MS` — request timeout, default 15000.
- `BASECAMP_MAX_RETRIES` — bounded read retry count, default 2, max 5.
- `BASECAMP_REQUIRE_WRITE_APPROVAL` — defaults to `true`.
- `BASECAMP_APPROVED_ACTIONS` — semicolon-separated exact fingerprints issued by a human-controlled runtime.

## Permission and approval model

READ operations may run automatically. WRITE operations require exact approval by default. HIGH_RISK operations always require exact approval, even when ordinary writes are configured for automatic execution.

Examples:
- `basecamp.todo.create:123:Ship release`
- `basecamp.todo.complete:456`
- `basecamp.message.draft.create:789:Project update`
- `basecamp.message.publish:987`
- `basecamp.comment.create:654`

Agent-provided approval booleans are not accepted; approval lives only in connector configuration.

## Reliability, pagination, and rate limits

Basecamp collection responses use RFC 5988 `Link` headers and `X-Total-Count`. This connector exposes bounded page parameters and returns pagination metadata rather than automatically draining entire collections.

GET requests retry only on network failures, HTTP 429, and transient 500/502/503/504 errors. Retries are bounded with exponential backoff and honor numeric `Retry-After`. Non-GET writes are never blindly retried. Basecamp documents multiple dynamic rate limits; a common first threshold is around 50 requests per 10 seconds per IP, so the implementation reacts to provider headers instead of hard-coding a single quota.

HTTP 507 is treated as a non-retryable account/project/storage/webhook limit condition. 401/403/404/400/422 are surfaced without retries. A 404 with `Reason: Account Inactive` is mapped explicitly.

## Security considerations

- OAuth tokens stay in the connector transport layer.
- Only `https://3.basecampapi.com` is permitted for API calls, preventing arbitrary URL/SSRF usage.
- Strict Zod validation rejects unknown tool parameters.
- Rich-text content is untrusted third-party data.
- Publishing messages and posting comments are HIGH_RISK because they communicate externally and may notify people.
- Message creation is deliberately draft-only; publication is a separate approved step.
- No destructive delete/trash tools are exposed.
- Never log bearer tokens or full retrieved sensitive content.

## Install, run, test

```bash
npm install
npm run build
npm test
npm start
```

Requires Node.js 20+. The server uses MCP stdio and can be launched by MCP clients that support stdio servers. Client-specific OAuth UX is intentionally not claimed.

## Limitations

This connector does not host webhooks, upload files, manage account permissions, modify people, create/delete projects, trash recordings, or expose every Basecamp endpoint. It also does not proxy a Basecamp MCP server because Basecamp's public site still describes full MCP support as coming soon as of 2026-09-06. Tool IDs must be discovered from real Basecamp data; `basecamp.project.get` returns each project's dock so agents can locate enabled tool IDs such as `todoset` and `message_board`.
