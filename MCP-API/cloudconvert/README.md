# CloudConvert MCP/API Connector

Reusable MCP server for CloudConvert file-processing workflows. It exposes a stable, provider-scoped tool contract, keeps credentials inside the connector, prefers CloudConvert's official hosted MCP server when a compatible OAuth-backed tool is available, and falls back to CloudConvert API v2 for deterministic programmatic operations and capabilities not exposed by the hosted MCP server (notably task cancellation and webhook management).

## Official upstreams researched

- Official MCP server: `https://mcp.cloudconvert.com` (Streamable HTTP, OAuth 2.0). CloudConvert documents tools for conversion, optimization, watermarking, website capture, thumbnails, merge/archive, metadata, PDF operations, jobs and discovery.
- API v2: `https://api.cloudconvert.com/v2` with Bearer API keys or OAuth 2.0 access tokens.
- Official API docs describe fine-grained scopes: `user.read`, `user.write`, `task.read`, `task.write`, `webhook.read`, `webhook.write`.
- CloudConvert documents dynamic rate limiting for job/task creation via `X-RateLimit-*` and `Retry-After`, and explicitly advises clients not to automatically retry failed conversion tasks because CloudConvert already retries retryable task failures internally.
- Webhook events include `job.created`, `job.finished`, and `job.failed`; webhook requests are HMAC-SHA256 signed in `CloudConvert-Signature`.

Sources: https://cloudconvert.com/docs/integrations/mcp-server , https://cloudconvert.com/docs/getting-started/introduction , https://cloudconvert.com/docs/api-reference/jobs , https://cloudconvert.com/docs/api-reference/tasks , https://cloudconvert.com/docs/api-reference/webhooks .

## Transport strategy

The connector uses capability-level routing. For `user.get`, basic job/task reads, conversion, optimization, OCR and website capture, it first attempts the official MCP server when `CLOUDCONVERT_MCP_ACCESS_TOKEN` is present. The bridge connects only to the exact official endpoint, discovers tools, applies a fixed allowlist, and calls an upstream tool only when its discovered input schema is compatible with the normalized arguments. If MCP is unavailable, authentication has not been provisioned, or schema compatibility cannot be proven, the connector falls back to API v2.

Task cancellation and webhook management use API v2 because those operations are documented by the REST API but are not in the official MCP tool list as of 2026-09-15. Advanced jobs use API v2 so the connector can enforce a bounded task graph and block arbitrary command execution and credential-bearing import headers.

## Tools

| Tool | Transport | Risk | Scope | Approval |
|---|---|---|---|---|
| `cloudconvert.user.get` | MCP -> REST | READ | `user.read` | no |
| `cloudconvert.job.list` | REST | READ | `task.read` | no |
| `cloudconvert.job.get` | REST | READ | `task.read` | no |
| `cloudconvert.task.get` | REST | READ | `task.read` | no |
| `cloudconvert.file.convert` | MCP -> REST | WRITE | `task.write` | configurable |
| `cloudconvert.file.optimize` | MCP -> REST | WRITE | `task.write` | configurable |
| `cloudconvert.pdf.ocr` | MCP -> REST | WRITE | `task.write` | configurable |
| `cloudconvert.website.capture` | MCP -> REST | WRITE | `task.write` | configurable |
| `cloudconvert.job.create` | REST | HIGH_RISK | `task.write` | required |
| `cloudconvert.task.cancel` | REST | WRITE | `task.write` | configurable |
| `cloudconvert.webhook.list` | REST | READ | `webhook.read` | no |
| `cloudconvert.webhook.create` | REST | HIGH_RISK | `webhook.write` | required |
| `cloudconvert.webhook.delete` | REST | DESTRUCTIVE | `webhook.write` | required + disabled by default |

## Authentication and least privilege

For hosted MCP, complete CloudConvert's OAuth 2.0 authorization flow outside the model and place the resulting access token in the connector's credential provider/environment as `CLOUDCONVERT_MCP_ACCESS_TOKEN`. CloudConvert's hosted MCP requests `user.read`, `task.read`, and `task.write`. The model never receives the token.

For REST fallback, create an API key with only the scopes required by enabled tools. A read-only deployment can use only `user.read` and/or `task.read`; add `task.write` only for processing/cancellation, `webhook.read` for listing webhooks, and `webhook.write` only when webhook mutation is needed.

Do not put provider credentials in prompts, examples, tool arguments, logs, or source control.

## Approval model

READ tools may execute automatically. WRITE tools require connector-side approval by default. HIGH_RISK tools always require approval. DESTRUCTIVE tools additionally require `CLOUDCONVERT_ENABLE_DESTRUCTIVE=true` and are therefore disabled by default.

`approvalId` is an opaque host-side grant, not a provider credential. The MCP host or approval UI should inject it out-of-band; the connector compares it against `CLOUDCONVERT_APPROVAL_TOKEN`. An agent cannot increase provider scopes or enable destructive mode through a tool call.

## Security

All URL-taking tools require HTTPS and reject localhost, common private/link-local IP ranges, and metadata hostnames. Advanced jobs are limited to 20 named tasks, reject command/FFmpeg/ImageMagick/GraphicsMagick operations, reject custom import headers (to avoid forwarding credentials), and validate direct task URLs. Provider content is returned with `untrustedProviderData: true`; callers must treat filenames, metadata, converted content, and provider messages as data rather than instructions.

The upstream MCP bridge connects only to `https://mcp.cloudconvert.com`, uses an explicit tool allowlist, discovers the provider schema before invocation, and never forwards REST API keys to MCP. Webhook signing secrets are recursively removed from tool outputs. Your webhook receiver is still responsible for HMAC-SHA256 verification of `CloudConvert-Signature`.

## Reliability and rate limits

REST requests use `AbortController` timeouts, bounded exponential backoff, `Retry-After` for 429 responses, and bounded pagination. Network and 5xx retries are limited to GET requests; write requests are not blindly retried. A 429 may be retried because the provider rejected the request before execution. Conversion tasks that enter CloudConvert's `error` state are never automatically retried by this connector.

## Installation

```bash
cd MCP-API/cloudconvert
npm install
npm run build
```

Copy `.env.example` to `.env` or inject equivalent values from a secret manager. Node.js 20+ is required.

## Running

```bash
npm start
```

The server uses MCP stdio transport, so any MCP host capable of launching a local stdio server can run it. Example host configuration:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/cloudconvert/dist/src/index.js"],
  "env": { "CLOUDCONVERT_API_KEY": "<secret-from-host>" }
}
```

The connector is protocol-oriented rather than tied to a single AI product; compatibility requires an MCP client that supports stdio tool servers. The official CloudConvert hosted MCP endpoint itself can also be connected directly by clients that support remote Streamable HTTP and OAuth.

## Error handling

Provider HTTP errors are mapped to structured MCP errors with status/code/message internally; raw authorization headers and API keys are never returned. Authentication and permission failures are not retried. Validation and approval failures are local and happen before provider calls.

## Testing

```bash
npm test
```

Unit tests use fakes and do not require live CloudConvert credentials. They cover tool registration, URL validation/SSRF guards, read pagination, conversion job construction, approval denial, blocking arbitrary command tasks, and destructive-operation defaults.

## Limitations

- Official hosted MCP file-processing tools currently require input files to be reachable by HTTP/HTTPS; this connector intentionally narrows that to HTTPS for safer agent use.
- OAuth browser authorization/refresh-token persistence belongs to the MCP host or external credential provider; this package consumes a pre-authorized access token and never asks an LLM to handle it.
- Upstream MCP tool schemas can evolve. The bridge falls back to REST rather than guessing when discovered schemas do not match the normalized arguments.
- This connector does not expose CloudConvert's arbitrary command execution tool, password-bearing PDF decryption/encryption tools, or custom import headers because those are inappropriate for a default reusable agent surface.
- Export URLs are temporary and should not be treated as durable storage.
