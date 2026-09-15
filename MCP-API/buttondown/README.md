# Buttondown MCP/API Connector

Reusable MCP server for Buttondown newsletter operations. It exposes a stable, provider-scoped tool surface over Buttondown's official REST API while keeping API credentials and approval secrets inside the connector process.

## Official transport research

Buttondown explicitly documents that it does **not** ship an official MCP server or official language SDK. It instead maintains an API-first product and an OpenAPI specification. This connector therefore uses the official REST API at `https://api.buttondown.com/v1` directly; no unofficial MCP dependency is trusted.

Official sources researched for this implementation (current on 2026-09-15):

- API overview: https://buttondown.com/features/api
- Authentication and API-key permissions: https://docs.buttondown.com/api-authentication
- API versioning: https://docs.buttondown.com/api-versioning
- Rate limits: https://docs.buttondown.com/api-rate-limits
- Subscriber create/retrieve/update: https://docs.buttondown.com/api-subscribers-create, https://docs.buttondown.com/api-subscribers-retrieve, https://docs.buttondown.com/api-subscribers-update
- Filtering/pagination: https://docs.buttondown.com/api-filtering
- Draft sending: https://docs.buttondown.com/api-emails-send-draft
- Tags: https://docs.buttondown.com/api-tags-list

The connector pins `X-API-Version: 2026-04-01`, which Buttondown documents as the current API version. Upgrade deliberately after reviewing Buttondown's changelog and rerunning tests.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `buttondown.subscriber.list` | REST | READ | No |
| `buttondown.subscriber.get` | REST | READ | No |
| `buttondown.subscriber.create` | REST | WRITE | Default yes |
| `buttondown.subscriber.update` | REST | WRITE | Default yes |
| `buttondown.subscriber.delete` | REST | DESTRUCTIVE | Always + disabled by default |
| `buttondown.email.list` | REST | READ | No |
| `buttondown.email.get` | REST | READ | No |
| `buttondown.email.create` | REST | WRITE | Default yes |
| `buttondown.email.update` | REST | WRITE | Default yes |
| `buttondown.email.send_draft` | REST | HIGH_RISK | Always |
| `buttondown.tag.list` | REST | READ | No |

The connector deliberately omits unrestricted HTTP requests, API-key administration, newsletter settings, automations, bulk imports, public broadcast execution, surveys, forms, and webhook administration. A draft-review send is included because it supports a controlled prepare/review workflow; public broadcast sending is not exposed in this version.

## Architecture

```text
MCP client / agent
  -> stdio MCP server
  -> strict Zod schemas
  -> risk + exact-payload approval gate
  -> credential-isolated Buttondown REST client
  -> https://api.buttondown.com/v1
```

Provider content is wrapped with `untrustedProviderData: true`. Subscriber metadata, email bodies, tags, and provider errors are data, not instructions, and must never modify tool permissions or system behavior.

## Authentication and least privilege

Set `BUTTONDOWN_API_KEY`. Buttondown authenticates API calls with `Authorization: Token <key>`. Buttondown supports multiple API keys with independent permissions including `subscriber_access`, `email_access`, `sending_access`, `administrivia_access`, `automations_access`, `forms_access`, `styling_access`, and `surveys_access`; permissions can be configured at narrower read/write levels where supported.

For this connector, grant only subscriber/email permissions required by the enabled workflows and sending permission only when `buttondown.email.send_draft` is needed. Avoid the primary full-access key for agent workloads. The key is never accepted as a tool argument or returned in output.

## Environment

Copy `.env.example` and inject secrets through a process secret store.

- `BUTTONDOWN_API_KEY`: required.
- `BUTTONDOWN_API_BASE_URL`: defaults to and is restricted to `https://api.buttondown.com/v1`.
- `BUTTONDOWN_API_VERSION`: defaults to `2026-04-01`.
- `BUTTONDOWN_TIMEOUT_MS`: 1,000-120,000 ms; default 15,000.
- `BUTTONDOWN_MAX_READ_RETRIES`: 0-5; default 2.
- `BUTTONDOWN_REQUIRE_WRITE_APPROVAL`: default `true`.
- `BUTTONDOWN_ENABLE_DESTRUCTIVE`: default `false`.
- `BUTTONDOWN_APPROVAL_SECRET`: required for approval-gated execution.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The connector serves MCP over stdio and can be launched by MCP clients that support local stdio servers. Supply environment variables through the MCP host's secure process configuration rather than prompts.

## Permission and approval model

READ operations can execute automatically. WRITE operations require approval by default. HIGH_RISK operations always require approval. DESTRUCTIVE operations additionally require `BUTTONDOWN_ENABLE_DESTRUCTIVE=true` and exact target confirmation.

Approval is an HMAC-SHA256 digest over the exact tool name and canonicalized payload excluding `approvalToken`. A trusted approval service/UI computes it using `BUTTONDOWN_APPROVAL_SECRET`; the model must never receive that secret. Any change to recipient, email body, subscriber, or other input invalidates approval.

`buttondown.email.send_draft` is HIGH_RISK because it sends external email, even though it is intended for review rather than a public broadcast. Subscriber deletion is DESTRUCTIVE. Subscriber updates can have consequential semantics: Buttondown documents that changing an active premium subscriber to `unsubscribed` can cancel the backing Stripe subscription, so this connector intentionally does not expose arbitrary subscriber `type` mutation.

## Rate limits and reliability

Buttondown documents a general API limit of 600 requests/minute and a separate default limit of 100 `POST /v1/subscribers` calls/day. Every API response includes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`; throttling returns HTTP 429 with `Retry-After`. The connector surfaces rate-limit metadata.

Only retry-safe reads are automatically retried, using bounded exponential backoff and `Retry-After` when available. Writes, sends, and deletes are attempted once so ambiguous transport failures cannot silently duplicate side effects. Authentication, permission, validation, and ordinary 4xx errors are not blindly retried. Every request has an AbortController timeout.

List tools expose bounded page/page-size controls. The connector does not recursively crawl all pages.

## Validation and security

Tool schemas are strict and bounded. Provider IDs/email path keys reject path/query separators and are URL-encoded. Email recipient counts, body sizes, tag counts, page sizes, and metadata shapes are bounded. The API host is fixed to Buttondown's official HTTPS host, preventing caller-controlled SSRF. No arbitrary provider request or URL-fetch tool exists.

Buttondown supports a firewall-bypass header for trusted subscriber creation, but this connector intentionally does not expose it: bypassing provider anti-abuse controls should remain an operator-owned integration decision. Credentials and approval secrets are never logged or returned. Retrieved content cannot expand scopes or register tools.

## Errors

Provider errors are normalized into `ButtondownError` with HTTP status and optional retry timing. Authentication/permission failures require operator action. Timeout/network failures are explicit. Provider bodies are bounded before inclusion in errors, and authorization headers are never returned.

## Tests

`npm test` compiles the connector and runs unit tests without live credentials. Coverage includes missing authentication, official-host pinning, exact-payload approval, destructive default denial, credential placement inside the transport, 429 read retry, and no blind retry for writes.

## Examples

See `examples/workflows.md` for subscriber inspection, subscriber creation, draft creation, reviewer send, and destructive deletion examples with permissions and approval requirements.

## Limitations

This connector implements a curated 11-tool operational subset, not Buttondown's complete API. It does not implement public broadcast send, imports, newsletter/account settings, automations, forms, surveys, webhook management, API-key lifecycle, billing, or arbitrary OpenAPI execution. Buttondown does not provide an official MCP server or official SDK, so all provider operations here use the official REST API. Plan-specific features and provider-side API-key permissions remain authoritative.
