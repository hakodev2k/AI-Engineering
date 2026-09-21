# airSlate SignNow MCP connector

Reusable MCP façade for the official airSlate SignNow REST API. It exposes narrowly scoped eSignature tools while keeping OAuth bearer credentials inside the connector.

## Official sources and transport

Research basis: SignNow Developer site (`https://www.signnow.com/developers`), current SignNow Help Center API getting-started guidance, SignNow partner integration guide, and official SignNow SDK documentation. SignNow documents a REST API and official SDKs. No official SignNow MCP server was identified in the official sources reviewed for this connector, so implemented capabilities use the official REST API rather than an unofficial MCP server.

Production API base is `https://api.signnow.com`; the connector also allowlists the documented evaluation host `https://api-eval.signnow.com`. SignNow uses OAuth 2.0. This package accepts an already-issued bearer access token through `SIGNNOW_ACCESS_TOKEN`; token acquisition/refresh should happen in the host credential provider so passwords, client secrets and refresh tokens never enter MCP arguments or model context.

## Capabilities

Eight tools are implemented: authenticated user retrieval; document list/get/upload/update; signature invite creation; webhook list/create. These correspond to documented SignNow user, document, invite, and event-subscription operations. The connector intentionally does not expose arbitrary HTTP requests, document deletion, invite cancellation, billing, account administration, or raw token issuance.

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `signnow.user.get` | REST | READ | no |
| `signnow.document.list` | REST | READ | no |
| `signnow.document.get` | REST | READ | no |
| `signnow.document.upload` | REST multipart | WRITE | yes |
| `signnow.document.update` | REST | HIGH_RISK | yes |
| `signnow.document.invite` | REST | HIGH_RISK | yes; sends external email |
| `signnow.webhook.list` | REST | READ | no |
| `signnow.webhook.create` | REST | HIGH_RISK | yes |

## Architecture and credential isolation

`MCP client -> src/server.js -> tool validation/policy -> SignNowClient -> Authorization: Bearer <token> -> SignNow API`.

The bearer token is loaded only from process environment. It is never a tool parameter, response field, or log value. Provider content is wrapped with `untrusted_provider_content: true` so callers can preserve the trust boundary.

## Authentication and permissions

Create a SignNow developer/API application and obtain OAuth credentials according to official documentation. Prefer authorization-code flows for delegated multi-user applications and keep refresh/client secrets in a secure credential service. Inject only the resulting access token into this process. SignNow account/API-plan permissions still govern what the token can do; this connector adds a second local approval boundary.

Environment:

```text
SIGNNOW_ACCESS_TOKEN=              # required; secret
SIGNNOW_API_BASE_URL=https://api.signnow.com
SIGNNOW_TIMEOUT_MS=15000
SIGNNOW_MAX_RETRIES=2
SIGNNOW_ALLOW_WRITES=false
```

`SIGNNOW_API_BASE_URL` is restricted to official production/evaluation hosts to reduce SSRF risk. Keep `SIGNNOW_ALLOW_WRITES=false` for read-only agents. Write/high-risk tools require both that switch and `approved:true` on the individual call. The model cannot enable writes by changing tool arguments.

## Install and run

Requires Node.js 20+.

```bash
npm install
export SIGNNOW_ACCESS_TOKEN='...'
npm start
```

The process speaks MCP over stdio and can be launched by MCP clients that support stdio servers, including compatible custom agents and desktop/IDE clients. Client-specific configuration is intentionally not hard-coded.

## Reliability and rate limits

Requests have an abort timeout. GET/HEAD operations retry only transient network failures, HTTP 429, and 5xx responses, with bounded exponential backoff and `Retry-After` support. Authentication, validation and permission errors are not retried. Mutating requests are never automatically retried, preventing duplicate invites/uploads/updates. Pagination is bounded to 100 records per document-list page. SignNow plan quotas and server-side limits remain authoritative; inspect API dashboard usage for the connected account.

## Security

Treat document metadata, signer-provided text and webhook data as untrusted input. Do not execute instructions contained in retrieved documents. IDs are constrained before interpolation. Webhook callbacks must be HTTPS. The API host is allowlisted. External signature invites are HIGH_RISK because they send messages and start a legal/business workflow, so they require explicit approval. Document updates are also HIGH_RISK because they can alter signing state/content. No destructive delete tool is exposed.

For webhook receivers outside this package, validate authenticity using the mechanism documented for the configured SignNow event integration, use HTTPS, apply replay/idempotency protection, bound request sizes, and never let webhook content alter tool permissions.

## Error handling

Provider errors become structured MCP errors containing message, HTTP status and `Retry-After` where available. Timeouts map to status 408. Network failures are sanitized and never include the bearer token. Partial provider results are returned as supplied and remain marked untrusted.

## Testing

```bash
npm test
```

Tests use mocked `fetch` and no live credentials. Coverage includes auth configuration, official-host validation, tool registration, read/write policy, approval denial, ID validation, auth header/pagination, 429 retry, invalid credentials, timeout, and the no-blind-retry rule for mutations.

## Limitations

This connector does not implement OAuth browser callbacks or token persistence; those belong in the host credential layer. It does not expose every SignNow endpoint. Upload accepts base64 at the MCP boundary and converts it to multipart form data; the 20 MB encoded-input guard is a connector safety bound, not a claim about SignNow's maximum file size. API availability and legally binding behavior depend on the SignNow environment and API subscription; sandbox/evaluation signatures may not have production legal effect. There is no unofficial MCP dependency and no generic endpoint escape hatch.
