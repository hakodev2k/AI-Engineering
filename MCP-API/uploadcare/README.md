# Uploadcare MCP/API Connector

Reusable MCP server for Uploadcare file-management and webhook workflows. It exposes scoped MCP tools while keeping Uploadcare credentials inside the connector.

## Upstream transport and official sources

No official Uploadcare MCP server was identified in the official documentation researched for this connector, so implemented capabilities use Uploadcare's official REST API. Uploadcare documents three APIs: Upload API, REST API, and URL API; this connector intentionally uses REST API only for management operations.

Official documentation:
- REST API: https://uploadcare.com/docs/api/rest/
- Authentication: https://uploadcare.com/docs/api/rest/authentication/
- API overview and OpenAPI specs: https://uploadcare.com/docs/api/
- JavaScript clients: https://uploadcare.com/docs/integrations/javascript/
- Webhooks: https://uploadcare.com/docs/api/rest/webhook/webhooks-list/

## Capabilities

Implemented MCP tools: `uploadcare.file.list`, `uploadcare.file.search`, `uploadcare.file.get`, `uploadcare.file.metadata.get`, `uploadcare.file.metadata.update`, `uploadcare.file.store`, `uploadcare.file.delete`, `uploadcare.webhook.list`, `uploadcare.webhook.create`, `uploadcare.webhook.update`, and `uploadcare.webhook.delete`.

The connector does not expose arbitrary REST calls, uploads, conversions, add-ons, billing, project administration, or URL transformations. Those remain unsupported here even though Uploadcare may provide APIs for some of them.

## Architecture and security

MCP stdio -> strict Zod schemas -> permission/approval gate -> signed Uploadcare REST client -> `https://api.uploadcare.com`.

Production authentication uses Uploadcare's `Uploadcare` scheme. The secret key signs method, body MD5, content type, date, and request URI using HMAC-SHA1; the secret itself is not forwarded to the model or sent in the Authorization header. The base URL is pinned to Uploadcare HTTPS to prevent SSRF through configuration. Provider responses are returned as untrusted data only.

Webhook targets must be HTTPS. In production, additionally enforce your organization's destination allowlist outside the model boundary. Webhook signing secrets returned by the provider are sensitive and should be redacted by host logging/telemetry.

## Authentication and environment

Required: `UPLOADCARE_PUBLIC_KEY`, `UPLOADCARE_SECRET_KEY`. Optional: `UPLOADCARE_API_BASE` (must remain `https://api.uploadcare.com`), `UPLOADCARE_TIMEOUT_MS`, `UPLOADCARE_MAX_RETRIES`, `UPLOADCARE_ALLOW_WRITES`, `UPLOADCARE_ALLOW_DESTRUCTIVE`.

Uploadcare project API keys authorize REST API access; Uploadcare does not describe OAuth scopes for this API, so this connector does not invent scope names. Use a dedicated project secret and rotate it according to your credential policy.

## Permission and approval model

`READ`: list/search/get file data and list webhooks; may run automatically. `WRITE`: metadata changes, storing files, webhook create/update; disabled unless `UPLOADCARE_ALLOW_WRITES=true`. `DESTRUCTIVE`: file/webhook deletion; disabled unless `UPLOADCARE_ALLOW_DESTRUCTIVE=true` and the tool input contains explicit `approved: true`. An agent cannot change these environment policies.

## Reliability, pagination, and rate limits

List/search inputs cap page size at 100 and expose offset explicitly. Requests have bounded timeouts and bounded exponential retries. Only READ calls retry transient network errors, HTTP 429, and 5xx responses. Authentication, validation, permission, WRITE, and DESTRUCTIVE failures are not blindly retried. `Retry-After` is preserved internally as milliseconds on `ConnectorError.retryAfter`. Uploadcare documents HTTP 429 responses but does not publish a universal numeric REST quota in the referenced endpoint documentation, so this connector does not invent one.

## Install and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
npm run build
node dist/index.js
```

Configure the environment in your MCP host's process environment; do not place secrets in prompts or tool arguments. The server uses MCP stdio and therefore works with MCP clients that support stdio subprocess servers.

## Error model

Connector errors use stable codes: `AUTH_CONFIG`, `CONFIG`, `VALIDATION`, `PERMISSION_DENIED`, `APPROVAL_REQUIRED`, `AUTHENTICATION`, `NOT_FOUND`, `RATE_LIMITED`, `UPSTREAM`, `PROVIDER_ERROR`, `TIMEOUT`, and `NETWORK`.

## Tests

```bash
npm test
```

Tests use fake fetch implementations and require no live Uploadcare credentials. They cover auth configuration, SSRF/base URL validation, UUID validation, write/destructive gates, request signing, auth failure behavior, and arbitrary URL rejection.

## Limitations

This package does not implement Upload API uploads, URL API image transforms, document/video conversion, add-ons, or webhook receiver signature verification because it is an outbound management connector rather than an inbound HTTP service. File deletion and webhook deletion are deliberately high-friction. REST API version `v0.7` is explicitly requested through the Accept header; review Uploadcare versioning documentation before changing it.
