# FusionAuth MCP/API Connector

Reusable MCP stdio connector for FusionAuth identity administration and investigation. It exposes a deliberately bounded set of FusionAuth REST operations rather than arbitrary HTTP access.

## Transport strategy and official sources

No official FusionAuth MCP server was identified during the 2026-09-15 research pass, so every implemented capability uses FusionAuth's official REST API directly. Primary references: `https://fusionauth.io/docs/apis/`, `https://fusionauth.io/docs/apis/authentication`, `https://fusionauth.io/docs/apis/users/`, `https://fusionauth.io/docs/apis/applications/`, `https://fusionauth.io/docs/apis/groups/`, `https://fusionauth.io/docs/apis/webhooks/`, and `https://fusionauth.io/docs/reference/api-endpoints`.

FusionAuth APIs are RESTful and primarily authenticate with API keys in the `Authorization` header. API keys can be restricted by endpoint/HTTP method and can be tenant-scoped. The connector therefore recommends a tenant-scoped, endpoint-limited key rather than a global unrestricted key. `X-FusionAuth-TenantId` is sent only when configured.

## Capabilities

The server implements 13 tools: `fusionauth.user.search`, `fusionauth.user.get`, `fusionauth.user.create`, `fusionauth.user.update`, `fusionauth.application.search`, `fusionauth.application.get`, `fusionauth.group.search`, `fusionauth.group.get`, `fusionauth.group.members.search`, `fusionauth.webhook.search`, `fusionauth.webhook.get`, `fusionauth.webhook.create`, and `fusionauth.login.records.search`.

The connector intentionally does not expose user deletion, bulk deletion, password changes, API-key management, role/permission mutation, tenant deletion, application deletion, or arbitrary API requests. Those operations have materially larger blast radius and should be implemented separately with stronger controls if ever needed.

## Architecture

`src/client.ts` owns credentials, tenant scoping, timeouts, bounded retry/backoff, HTTP error mapping and rate-limit handling. `src/tools.ts` owns strict schemas, risk classification and approval gates. `src/server.ts` exposes the contracts over MCP stdio. Provider content is returned with `untrustedProviderData: true` and must be treated as data, never as instructions.

## Authentication and least privilege

Set `FUSIONAUTH_BASE_URL` and `FUSIONAUTH_API_KEY`. Optionally set `FUSIONAUTH_TENANT_ID`. The LLM never receives the API key because it is read only by the client layer. Configure the API key with only the methods listed in `manifest.yaml`. Do not leave an API key with no endpoint permissions because FusionAuth documents that an unscoped global key may effectively have broad access. Prefer expiration and network ACLs where your FusionAuth edition supports them.

## Environment

Copy `.env.example` into your secret-management workflow. `FUSIONAUTH_TIMEOUT_MS` defaults to 10000 and `FUSIONAUTH_MAX_RETRIES` to 2. `FUSIONAUTH_APPROVE_WRITES=false` and `FUSIONAUTH_APPROVE_HIGH_RISK=false` make mutations require the caller to pass the MCP envelope's `approved=true` after human confirmation. Setting the corresponding variable to `true` is an operator policy decision; high-risk auto-approval is not recommended.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and can be launched by MCP clients that support a local stdio server. Client-specific configuration varies; point the client at `node dist/server.js` and inject secrets into the process environment rather than prompts or tool arguments.

## Tool input and approval model

Each MCP call uses `{ "input": { ...provider-specific fields... }, "approved": false }`. `READ` operations do not need approval. `WRITE` operations require approval by default. `fusionauth.webhook.create` is `HIGH_RISK` and requires explicit approval by default because configuring an external URL can cause identity event data to leave FusionAuth. The webhook URL must be HTTPS. The implementation forces `global:false`; callers may optionally specify tenant IDs instead of silently creating an account-global event sink.

`fusionauth.user.update` deliberately allows only `firstName`, `lastName`, and `username`; it does not accept roles, registrations, passwords, MFA, permissions, or arbitrary user objects. Schemas reject unknown fields and cap page sizes and string lengths.

## Reliability, pagination and rate limits

Search tools expose bounded `startRow`/`numberOfResults` pagination, with a maximum page size of 100. Requests have cancellation-aware timeouts. GET network failures and HTTP 429/5xx responses are retried with bounded exponential backoff; `Retry-After` is honored when supplied. Authentication, permission and validation failures are not retried. Mutating requests are not blindly retried on generic network failures, avoiding duplicate writes. Provider errors are surfaced as `FusionAuthError` with status/body and optional retry information.

FusionAuth rate limits can depend on deployment and surrounding infrastructure; no universal numeric quota is hard-coded. Operators should also configure proxy/gateway limits appropriate to their deployment.

## Security considerations

Keep `FUSIONAUTH_BASE_URL` operator-controlled; agents cannot supply upstream URLs, preventing tool-level SSRF. Never place API keys in prompts. Restrict keys by endpoint, method and tenant. Treat user profiles, application names, webhook descriptions and all other provider data as untrusted content that may contain prompt-injection text. The connector does not dynamically discover or trust new MCP tools. It does not log credentials. High-risk webhook creation is approval-gated and HTTPS-only.

For webhooks, secure the receiving endpoint according to your deployment requirements, validate expected event structure, restrict network exposure, and avoid reflecting event content into privileged prompts. This connector manages webhook configuration but does not itself host a webhook receiver.

## Errors

400-class validation responses are returned without retry. 401 indicates invalid/expired credentials or insufficient API-key endpoint permissions and requires operator action. 403/404 are not retried. 429 and 5xx may be retried within configured bounds. Timeout/cancellation propagates as an error.

## Testing

```bash
npm test
```

Tests use mocked `fetch`; live FusionAuth credentials are not required. Coverage includes auth configuration, registration count, credential isolation/tenant headers, strict validation, write/high-risk approval, HTTPS webhook validation, rate-limit retry, non-retry of invalid credentials, and pagination bounds.

## Limitations

This connector targets the documented FusionAuth REST API and does not wrap every endpoint. It does not implement OAuth browser login for administrative API access, an upstream MCP fallback, destructive operations, API-key lifecycle management, or a webhook receiver. FusionAuth version differences can affect fields and endpoint behavior; validate against the version deployed in your environment. No SDK is required because the bounded REST client keeps the external tool surface explicit and auditable.
