# SparkPost MCP/API Connector

Reusable MCP server for safe SparkPost email operations. It exposes scoped tools over SparkPost's official REST API; no official SparkPost MCP server was identified during implementation, so this connector does not depend on an untrusted community MCP.

## Official sources
- API overview/authentication/rate limiting: https://developers.sparkpost.com/api/
- Transmissions: https://developers.sparkpost.com/api/transmissions/
- Events: https://developers.sparkpost.com/api/events/
- Templates: https://developers.sparkpost.com/api/templates/
- Suppression List: https://developers.sparkpost.com/api/suppression-list/
- Event Webhooks: https://developers.sparkpost.com/api/webhooks/

## Transport and architecture
MCP client -> local stdio MCP server -> validation/approval boundary -> `SparkPostClient` -> official SparkPost REST API. Credentials remain in the connector process and are never tool parameters or returned to the model. US and EU API base URLs are selected only from the fixed `SPARKPOST_REGION` allowlist, preventing arbitrary upstream URLs.

## Authentication
SparkPost uses API-key authentication in the `Authorization` header. Create an API key with only the SparkPost permissions required for the tools you intend to expose. The connector never logs or returns the key. Set `SPARKPOST_API_KEY`; do not place credentials in prompts or examples.

## Environment
Copy `.env.example` into your secret-management workflow. `SPARKPOST_REGION` is `us` or `eu`. `SPARKPOST_TIMEOUT_MS` defaults to 15000. Writes require approval by default. Destructive tools remain disabled unless `SPARKPOST_DESTRUCTIVE_ENABLED=true`, and still require explicit approval.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
SPARKPOST_API_KEY=... npm start
```

The server uses MCP stdio and can be launched by MCP clients that support local stdio servers. Client-specific configuration is intentionally not hard-coded.

## Implemented tools
| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `sparkpost.events.search` | Search recent message events with cursor pagination | READ | No |
| `sparkpost.metrics.summary` | Read deliverability metrics | READ | No |
| `sparkpost.template.list` | List templates | READ | No |
| `sparkpost.template.get` | Read a template | READ | No |
| `sparkpost.template.create` | Create draft template | WRITE | Configurable, default yes |
| `sparkpost.template.update` | Update template | WRITE | Configurable, default yes |
| `sparkpost.suppression.search` | Search suppressions | READ | No |
| `sparkpost.suppression.get` | Read recipient suppressions | READ | No |
| `sparkpost.suppression.upsert` | Add/update opt-out protection | HIGH_RISK | Always |
| `sparkpost.suppression.delete` | Remove suppression | DESTRUCTIVE | Disabled by default + always |
| `sparkpost.webhook.list` | List event webhooks | READ | No |
| `sparkpost.webhook.get` | Read webhook | READ | No |
| `sparkpost.webhook.create` | Create HTTPS event destination | HIGH_RISK | Always |
| `sparkpost.webhook.update` | Change webhook destination/events/status | HIGH_RISK | Always |
| `sparkpost.webhook.delete` | Delete webhook | DESTRUCTIVE | Disabled by default + always |
| `sparkpost.transmission.send` | Send/schedule email | HIGH_RISK | Always |
| `sparkpost.transmission.cancel_campaign` | Cancel scheduled campaign transmissions | DESTRUCTIVE | Disabled by default + always |

## Reliability and rate limits
SparkPost documents dynamic API rate limiting with HTTP 429 and recommends waiting/backoff; account sending limits can produce HTTP 420. The client preserves `Retry-After` when supplied, uses bounded retry/backoff for throttled/read requests, and does not blindly retry writes. GET operations can retry transient failures; write/destructive calls are explicitly non-retrying. Transmissions require a caller-provided UUID idempotency key and send it as SparkPost's `Idempotency-Key` header. Requests use bounded timeouts/AbortController.

Events support cursor pagination; the tool accepts a cursor and returns provider links unchanged so callers can continue deliberately rather than generating unbounded traffic. SparkPost retains Events API data for 10 days; aggregate metrics provide longer-lived reporting.

## Security and approvals
Provider content is untrusted data. It is serialized as tool output and never interpreted as connector configuration or permissions. Tool schemas constrain identifiers, email addresses, counts, and enum values. There is no raw arbitrary-request tool. Webhook targets require HTTPS, standard port 443, and reject obvious loopback/local names to reduce SSRF risk. Deployments should additionally enforce network egress/DNS controls because DNS rebinding/private-address resolution cannot be fully prevented by string validation alone.

Sending external email is HIGH_RISK and requires explicit human approval. Suppression changes can affect consent/compliance; additions/updates require approval, while removal is destructive and disabled by default. Webhook changes can exfiltrate event data, so creation/update require approval. Destructive tools cannot be enabled by model-supplied parameters.

## Error handling
Non-success responses become `SparkPostError` with HTTP status, bounded provider text, and `retryAfter` when available. Authentication, permission and validation failures are not retried. Tool input validation occurs before provider calls.

## Tests
```bash
npm test
```
Unit tests use mocked `fetch` and no live credentials. They cover configuration/auth validation, tool registration, SSRF target validation, write approval denial, destructive default denial, provider error mapping, throttling retry, and no retry for unsafe writes.

## Limitations
This intentionally does not expose every SparkPost endpoint, subaccount administration, API-key management, account/billing changes, arbitrary HTTP calls, or webhook authentication secrets. Template content and transmission options are passed as bounded provider objects where SparkPost's content model is broad; SparkPost remains authoritative for semantic validation. Webhook inbound signature/authentication handling belongs in the receiving application, not this outbound management connector. SparkPost feature availability can vary by account/Enterprise plan.
