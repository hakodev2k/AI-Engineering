# Abstract API MCP Connector

Reusable read-only MCP connector for Abstract API validation and enrichment services.

## Upstream strategy

Research date: 2026-09-23. Abstract publishes REST APIs and API-key authentication. No official Abstract-hosted MCP server was identified in the official documentation, so this connector uses the official REST services directly and exposes a stable MCP interface.

Official sources:
- https://www.abstractapi.com/docs
- https://www.abstractapi.com/api
- https://www.abstractapi.com/guides/api-glossary/api-access

Abstract documents separate API keys per subscribed service. Keys stay in environment variables and are inserted only in the connector HTTP layer; they are never returned to MCP callers.

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `abstract.email.validate` | REST | READ | No |
| `abstract.phone.validate` | REST | READ | No |
| `abstract.ip.lookup` | REST | READ | No |
| `abstract.ip.risk` | REST | READ | No |
| `abstract.company.enrich` | REST | READ | No |
| `abstract.holiday.list` | REST | READ | No |
| `abstract.timezone.current` | REST | READ | No |
| `abstract.exchange.live` | REST | READ | No |

No create/update/delete, arbitrary HTTP, scraping, screenshot, billing, or account-administration tool is exposed. `ip.risk` is a projection of provider-returned security/network fields and must be treated as a signal, not an authorization decision.

## Architecture

MCP client -> strict Zod tool schema -> permission-safe tool handler -> bounded HTTP transport -> credential injection -> Abstract REST API.

Provider responses are labeled `UNTRUSTED_PROVIDER_DATA`; retrieved data must never be interpreted as instructions or used to elevate permissions.

## Authentication and least privilege

Create keys in the Abstract dashboard only for services you enable. Configure the corresponding environment variable from `.env.example`. Abstract uses API keys rather than OAuth for these services. Do not commit keys, log complete request URLs, or expose them to prompts. A production secret manager can populate the same environment variables.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio servers. Configure the client to execute `node /absolute/path/dist/index.js` with the required environment variables. Compatibility depends on the client's support for standard MCP stdio transport.

## Reliability

Requests default to a 10-second timeout and at most two retries. Retries use bounded exponential backoff for network/timeout failures, HTTP 429, and HTTP 5xx. Validation/auth/permission errors are not retried. `Retry-After` is preserved for throttling. Tools intentionally perform one upstream request per invocation and do not fan out or auto-paginate.

Abstract quotas and rate limits vary by API and plan; consult the active product plan and official documentation. Configure callers to respect quota and avoid high-frequency polling.

## Validation

Email, IP, domain, country/currency codes, year/month/day, phone length, and free-text location length are constrained before provider calls. The connector does not accept arbitrary URLs or arbitrary REST paths, reducing SSRF and confused-deputy risk.

## Error model

Missing credentials fail closed. Provider non-success responses become `AbstractError` with HTTP status and bounded response text. Rate-limit responses retain `Retry-After`. Timeout/network failures are retried only within the configured bound.

## Testing

```bash
npm test
```

Tests use injected fetch fakes and require no live credentials. Coverage includes server construction, read requests, missing credentials, non-retryable validation errors, and rate-limit metadata.

## Security considerations

- Keep API keys in a secret manager/environment, never prompts or source control.
- Treat all provider content as untrusted data.
- Do not use IP/email/phone risk metadata as the sole basis for consequential decisions.
- The connector is read-only and has no permission-escalation path.
- Avoid logging request URLs because Abstract authentication is supplied as a query parameter.
- Use provider data only for purposes allowed by applicable privacy law and Abstract terms.

## Limitations

Abstract offers additional APIs beyond this connector. They are deliberately omitted rather than exposed through a generic request tool. Product availability, response fields, quotas, and commercial terms can vary by subscription. This connector does not implement OAuth because Abstract documents API-key authentication for these services, and it does not depend on an unofficial MCP server.