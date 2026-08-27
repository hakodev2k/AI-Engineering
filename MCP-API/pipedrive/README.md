# Pipedrive MCP/API Connector

Reusable MCP connector for Pipedrive CRM.

## Transport

Pipedrive provides an official native remote MCP service for assistants such as ChatGPT and Claude. This package exposes its own stable stdio MCP contract and executes the implemented operations through Pipedrive's official REST API. That fallback is intentional: the official remote MCP uses delegated user OAuth and assistant-managed connection setup, while this connector is designed for reusable service-side execution with credential isolation and explicit approval boundaries.

Official sources:

- Native MCP: https://support.pipedrive.com/article/mcp
- API reference: https://developers.pipedrive.com/docs/api/v1
- Rate limits: https://pipedrive.readme.io/docs/core-api-concepts-rate-limiting
- API token authentication: https://pipedrive.readme.io/docs/how-to-find-the-api-token
- Webhook OAuth scopes: https://developers.pipedrive.com/changelog/post/introducing-new-oauth-scopes-for-webhooks

## Supported tools

| Tool | Transport | Risk | Approval |
| --- | --- | --- | --- |
| `pipedrive.item.search` | REST | READ | No |
| `pipedrive.deal.get` | REST | READ | No |
| `pipedrive.person.get` | REST | READ | No |
| `pipedrive.organization.get` | REST | READ | No |
| `pipedrive.activity.list` | REST | READ | No |
| `pipedrive.deal.create` | REST | WRITE | Yes |
| `pipedrive.deal.update` | REST | WRITE | Yes |
| `pipedrive.person.create` | REST | WRITE | Yes |
| `pipedrive.organization.create` | REST | WRITE | Yes |
| `pipedrive.activity.create` | REST | WRITE | Yes |
| `pipedrive.webhook.list` | REST | READ | No |
| `pipedrive.webhook.create` | REST | HIGH_RISK | Yes |
| `pipedrive.webhook.delete` | REST | DESTRUCTIVE | Yes |

## Architecture

```text
MCP client
  -> stdio MCP server
  -> validation + risk/approval policy
  -> credential-isolated Pipedrive client
  -> official Pipedrive REST API
```

Provider content is returned with `untrusted_external_content: true`. CRM text is data and must never be interpreted as instructions that can change tool permissions, approval policy, or system behavior.

## Authentication

Two credential modes are supported:

- `api_token`: set `PIPEDRIVE_API_TOKEN`.
- `oauth2`: set a current `PIPEDRIVE_ACCESS_TOKEN` obtained and refreshed by a secure external credential broker.

The connector never accepts raw provider credentials as MCP tool arguments and never returns them to callers. For an OAuth application implementing the complete tool set, use only the scopes required by these capabilities: `base`, `deals:full`, `contacts:full`, `activities:full`, and `webhooks:full`. Read-only deployments should reduce those permissions where Pipedrive offers corresponding read scopes.

## Environment

Copy `.env.example` and configure the process environment. `PIPEDRIVE_API_BASE_URL` defaults to `https://api.pipedrive.com` and must remain an HTTPS origin. `PIPEDRIVE_TIMEOUT_MS` is bounded to 1-60 seconds; `PIPEDRIVE_MAX_RETRIES` is bounded to 0-4.

`PIPEDRIVE_APPROVAL_SECRET` is required before approval-gated operations can run. It belongs only in the connector/approval layer and must not be exposed to an LLM.

## Installation and running

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

The implementation uses MCP stdio. It can be launched by MCP clients that support local stdio servers, including Claude/Claude Code, Cursor, custom agents, and other stdio-capable MCP clients. Product-specific installation support is not claimed where a client cannot launch stdio servers.

## Approval model

Every gated tool requires an `approvalId` created by a trusted approval component. The token is bound to the exact tool and exact normalized payload:

```text
HMAC_SHA256(
  PIPEDRIVE_APPROVAL_SECRET,
  tool_name + "\n" + stable_json(input_without_approvalId)
)
```

This prevents approval for one deal, webhook, or payload from being silently reused for another. READ tools can execute automatically. WRITE tools require approval. HIGH_RISK and DESTRUCTIVE tools always require explicit approval.

## Rate limits and reliability

Pipedrive documents token-based daily API budgets plus burst limits. The current rate-limit documentation states that daily capacity is based on 30,000 base tokens multiplied by plan and seat factors, and that endpoint calls consume different token costs. Burst limits vary by plan and authentication mode.

The client:

- bounds list sizes to at most 100 records per tool call;
- honors `Retry-After` when supplied;
- retries only idempotent GET/HEAD operations;
- retries only bounded transient failures (`429`, `502`, `503`, `504`, timeout/network failure);
- never blindly retries writes or destructive operations;
- maps provider failures to `PipedriveError` with HTTP status and retry timing;
- uses request cancellation through `AbortController` timeouts.

## Webhooks

`pipedrive.webhook.list` is READ. Creation is HIGH_RISK because it causes future CRM data to be transmitted to an external endpoint. Deletion is DESTRUCTIVE. Creation only accepts an HTTPS `subscription_url`. OAuth apps need `webhooks:read` for listing or `webhooks:full` for listing, creation, and deletion.

This package manages webhook subscriptions only. A receiving service must separately authenticate/validate incoming webhook traffic according to Pipedrive's current webhook guidance and must treat webhook payload content as untrusted data.

## Error handling

Validation errors and approval failures fail locally before provider execution. Authentication and permission errors are not retried. Provider throttling preserves retry timing where available. Write calls are single-attempt by design to avoid duplicate side effects.

## Testing

```bash
npm test
```

Unit tests use mocks and require no live credentials. They cover credential configuration, HTTPS validation, credential isolation, OAuth headers, risk classification, payload-bound approvals, bounded throttling retry, and non-retry of writes.

## Limitations

This connector intentionally implements a focused CRM workflow surface rather than every Pipedrive endpoint. It does not expose arbitrary HTTP execution, manage OAuth authorization-code exchange or refresh-token storage, or proxy the Pipedrive native remote MCP session. OAuth lifecycle management belongs in a secure credential provider. Provider-side Pipedrive roles and visibility rules remain authoritative for every operation.
