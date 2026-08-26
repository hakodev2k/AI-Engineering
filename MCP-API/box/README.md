# Box MCP/API Connector

Reusable MCP connector for Box content operations and V2 webhooks. The external interface is a scoped MCP tool set; upstream calls use the official Box REST API.

## Provider and transport

- Provider: Box
- MCP server exposed by this package: local stdio MCP server
- Upstream transport implemented: official Box REST API
- Official Box MCP server: no official Box-hosted MCP server was identified in Box developer documentation during this implementation, so this connector does not depend on an unofficial MCP server.
- API base: `https://api.box.com/2.0`
- Upload base: `https://upload.box.com/api/2.0`

Official references researched:

- Authentication: https://developer.box.com/guides/authentication/
- OAuth 2.0: https://developer.box.com/guides/authentication/oauth2/
- API reference: https://developer.box.com/reference/
- Rate limits: https://developer.box.com/guides/api-calls/permissions-and-errors/rate-limits/
- Common errors: https://developer.box.com/guides/api-calls/permissions-and-errors/common-errors/
- V2 webhooks: https://developer.box.com/guides/webhooks/v2/
- Webhook creation: https://developer.box.com/guides/webhooks/v2/create-v2/
- Webhook signatures: https://developer.box.com/guides/webhooks/v2/signatures-v2/

## Implemented capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---:|---:|
| `box.item.search` | REST | READ | No |
| `box.folder.list` | REST | READ | No |
| `box.file.get` | REST | READ | No |
| `box.folder.get` | REST | READ | No |
| `box.folder.create` | REST | WRITE | Yes |
| `box.file.upload` | REST upload endpoint | WRITE | Yes |
| `box.file.update` | REST | WRITE | Yes |
| `box.comment.list` | REST | READ | No |
| `box.comment.create` | REST | WRITE | Yes |
| `box.webhook.list` | REST | READ | No |
| `box.webhook.create` | REST | HIGH_RISK | Yes |
| `box.webhook.delete` | REST | DESTRUCTIVE | Yes + disabled by default |

The connector intentionally does not expose an unrestricted HTTP/API proxy.

## Architecture

```text
MCP client
  -> scoped Box MCP tool
  -> validation + risk/approval policy
  -> BoxClient
  -> credential injection inside connector
  -> official Box REST API
```

Provider responses are returned with `untrusted: true`. Content retrieved from Box must be treated as data rather than instructions and must never change connector permissions or approval policy.

## Authentication

Box API requests require an active Box access token. This package reads `BOX_ACCESS_TOKEN` from the process environment and injects it into the `Authorization: Bearer ...` header inside the client layer. The token is never part of MCP tool schemas and should never be placed in prompts.

For reusable multi-user applications, acquire the access token through Box OAuth 2.0 and store/refresh it in an external secure credential service. The connector accepts the resulting bearer token through its runtime environment. Box also supports other authorization models for appropriate application types; this connector deliberately does not implement credential issuance.

Use least privilege in the Box Developer Console. Enable only permissions necessary for the operations you expose. V2 webhook APIs require the Box `Manage Webhooks` application scope. Content operations require the corresponding read/write content permissions configured for the application and authorized user.

## Environment variables

```text
BOX_ACCESS_TOKEN=                       # required
BOX_API_BASE_URL=https://api.box.com/2.0
BOX_UPLOAD_BASE_URL=https://upload.box.com/api/2.0
BOX_TIMEOUT_MS=15000
BOX_MAX_RETRIES=3
BOX_APPROVAL_SECRET=                    # required for WRITE/HIGH_RISK/DESTRUCTIVE tools
BOX_ENABLE_DESTRUCTIVE=false
```

`BOX_API_BASE_URL` and `BOX_UPLOAD_BASE_URL` are configuration points for testing. In production, use the official Box hosts unless you deliberately terminate through a trusted enterprise proxy.

## Install and run

Requirements: Node.js 20+.

```bash
npm install
npm run build
BOX_ACCESS_TOKEN=... node dist/src/server.js
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "box": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/box/dist/src/server.js"],
      "env": {
        "BOX_ACCESS_TOKEN": "${BOX_ACCESS_TOKEN}",
        "BOX_APPROVAL_SECRET": "${BOX_APPROVAL_SECRET}"
      }
    }
  }
}
```

Compatibility depends on the client supporting MCP stdio servers. The connector uses the official Model Context Protocol TypeScript SDK and does not assume a specific agent vendor.

## Approval model

READ tools execute without connector-level approval. WRITE and HIGH_RISK tools require an explicit `approvalId`. The approval value is an HMAC-SHA256 digest of the exact tool name using `BOX_APPROVAL_SECRET`.

Example generator outside the agent process:

```bash
node -e "const c=require('crypto'); console.log(c.createHmac('sha256', process.env.BOX_APPROVAL_SECRET).update('box.folder.create').digest('hex'))"
```

Approval material should be produced by a trusted human-approval/control-plane component, not by the model. `box.webhook.delete` additionally requires `BOX_ENABLE_DESTRUCTIVE=true` so an agent cannot enable destructive capability through tool input.

## Validation and safety

- Box IDs must be numeric strings.
- Search strings, names, descriptions, comments, pagination, webhook triggers, and base64 uploads are bounded by schemas.
- Webhook callback URLs must be valid HTTPS URLs.
- No tool accepts arbitrary API paths, methods, headers, or destinations.
- Secrets are process-local and not returned in tool outputs.
- Retrieved Box content is flagged as untrusted.
- Destructive webhook deletion is disabled by default.
- Write calls are never blindly retried.
- HTTP authentication/permission failures are surfaced to the caller rather than retried.

For webhook receivers, verify Box V2 signatures before trusting event payloads. Box documents `BOX-SIGNATURE-PRIMARY`, timestamp validation, HMAC verification, and signature-key rotation in its V2 webhook signature guide. This connector creates and manages webhooks; it is not an inbound webhook HTTP server.

## Reliability and rate limits

The REST client applies an AbortController timeout to every request. GET/HEAD/OPTIONS requests may retry transient HTTP `429` and `5xx` responses with bounded exponential backoff. `Retry-After` is preserved and honored for retried rate-limited reads. Mutating operations are not automatically retried because replay can duplicate or unexpectedly repeat side effects.

Box documents a general user rate limit of approximately 1,000 API requests per minute, an upload limit of 240 uploads per minute per user, and stricter search limits including 6 searches/second per user, 60 searches/minute per user, and 12 searches/second per enterprise. Limits may vary by endpoint and service conditions. On rate limiting, Box returns HTTP 429 and a `retry-after` header.

Pagination is explicit. Folder/comment/search tools expose offset-based pagination and webhook listing exposes marker pagination. The connector does not automatically crawl all pages, avoiding accidental high-volume retrieval.

## Error handling

Provider errors are mapped to structured MCP error output containing an error class, HTTP status, optional `retryAfter`, and Box response details. Network and timeout failures are mapped to connector errors. Invalid input is rejected by MCP schemas before the provider call.

Authentication failures and authorization failures require operator action and are not retried. Mutating calls are also not retried automatically.

## File upload limitation

`box.file.upload` is intended for small agent-generated artifacts. It accepts base64 content and converts it to Box multipart upload form data. The MCP input schema limits the encoded payload to avoid oversized tool calls. For large files, use Box's official chunked upload workflow in a dedicated transfer service rather than passing large binary payloads through an LLM/MCP message.

## Webhook behavior

This package implements V2 webhook list/create/delete. Box V2 webhooks attach to specific files or folders, require HTTPS callback addresses, support many event triggers, and include signed payload support. Box documents a limit of one webhook for each item/application/authenticated-user combination and a maximum of 1,000 webhooks per application/user combination. Do not assume V1 webhooks are returned by the V2 listing API.

Webhook creation is HIGH_RISK because it causes future outbound notifications to an external URL. It therefore requires explicit approval and HTTPS validation. Deletion is DESTRUCTIVE and disabled by default.

## Tests

Normal unit tests require no live Box credentials.

```bash
npm install
npm test
npm run build
```

Tests cover missing authentication configuration, policy registration, write approval, destructive denial, bearer credential isolation, a read operation, provider error mapping, rate-limit metadata, and bounded retry behavior using mocked `fetch`.

## Limitations

- No upstream Box MCP dependency is used; all implemented provider operations use Box REST APIs.
- OAuth browser flow, token refresh persistence, enterprise service-account provisioning, and token vaulting are deployment concerns and are intentionally kept outside the MCP tool interface.
- This connector does not download raw file bytes, manage collaborations, shared links, legal holds, retention policies, Box Sign, metadata templates, or administrative enterprise settings.
- Large/chunked uploads are not exposed as MCP tools.
- It creates/manages V2 webhooks but does not host or verify inbound webhook HTTP requests.

See `examples/workflows.md` for representative tool calls.
