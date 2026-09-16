# MailerLite MCP/API Connector

Reusable MCP server exposing a deliberately bounded MailerLite tool surface for subscriber, group, and campaign workflows.

## Official upstreams and transport choice

MailerLite operates an official hosted MCP server at `https://mcp.mailerlite.com/mcp` using Streamable HTTP and account authorization. Official documentation states it can manage subscribers, campaigns, groups and other MailerLite resources. This connector records that official MCP as the preferred interactive upstream, but implements its stable reusable server contract with MailerLite's official REST API because a local/server connector cannot safely impersonate or forward an end-user MCP OAuth session. This avoids forwarding MCP credentials and lets operators provision a least-privilege MailerLite API token in the connector credential layer. No unofficial MCP server is used.

Official sources: MailerLite Developers MCP documentation (`developers.mailerlite.com/mcp`), MailerLite MCP connection guide (`mailerlite.com/help/how-to-connect-mailerlites-mcp`), MailerLite Developers Getting Started and API reference (`developers.mailerlite.com`).

## Capabilities

Ten tools are implemented: subscriber list/get/upsert/delete, group list/get, campaign list/get/create/schedule. Read tools are READ. Upsert and draft creation are WRITE. Scheduling is HIGH_RISK because it can send external communication. Subscriber deletion is DESTRUCTIVE. No arbitrary HTTP tool is exposed.

## Authentication and credential isolation

Set `MAILERLITE_API_TOKEN` in the server environment. The token is read only by the connector and is never accepted as a tool argument or returned to the model. `MAILERLITE_API_BASE_URL` defaults to the official HTTPS API. HTTP URLs and credential-bearing URLs are rejected. MailerLite API tokens inherit permissions from their account context; provision and rotate the narrowest token/account access appropriate to these tools. The official hosted MCP instead uses its own authorization flow and is not proxied here.

## Install and run

Requires Node.js 22+.

```bash
npm install
npm run build
MAILERLITE_API_TOKEN=... npm start
```

The server uses MCP over stdio, so any client that supports a standard stdio MCP server can launch it. Compatibility depends on the client's MCP support; no client-specific behavior is required.

## Configuration

`MAILERLITE_API_TOKEN` is required. Optional: `MAILERLITE_API_BASE_URL`, `MAILERLITE_TIMEOUT_MS` (default 15000), `MAILERLITE_MAX_RETRIES` (default 3, capped at 5), and `MAILERLITE_APPROVE_WRITES` (default false). Do not place secrets in prompts or checked-in configuration.

## Tools and approval

`mailerlite.subscriber.list`, `mailerlite.subscriber.get`, `mailerlite.group.list`, `mailerlite.group.get`, `mailerlite.campaign.list`, and `mailerlite.campaign.get` are READ and may execute automatically. `mailerlite.subscriber.upsert` and `mailerlite.campaign.create` are WRITE and require `approved: true` unless an operator explicitly sets `MAILERLITE_APPROVE_WRITES=true`. `mailerlite.campaign.schedule` is HIGH_RISK and always requires literal `approved: true`. `mailerlite.subscriber.delete` is DESTRUCTIVE and always requires literal `approved: true`. Tool schemas are strict and bounded.

## Reliability and rate limits

The official API documents a global limit of 120 requests/minute and returns HTTP 429 with `X-RateLimit-*` and `Retry-After`; import creation has a separate 5 requests/minute limit. This connector does not expose imports. It preserves `Retry-After`, bounds retries, and retries only idempotent GET requests for throttling, 5xx, and transient network failures. It does not blindly retry writes or destructive actions. Pagination inputs are bounded. Requests have a timeout and accept cancellation internally.

## Errors

Provider responses are normalized to `AUTHENTICATION_FAILED`, `PERMISSION_DENIED`, `RATE_LIMITED`, `VALIDATION_FAILED`, `PROVIDER_ERROR`, `TIMEOUT`, or `NETWORK_ERROR`. Provider error text is capped before returning to callers. Authentication, permission, and validation failures are not retried.

## Security

Credentials stay in the auth/client layer. Retrieved subscriber and campaign content is untrusted data, never instructions. The connector exposes no arbitrary URL fetch, preventing tool-driven SSRF. The API base URL must be HTTPS and cannot contain embedded credentials. High-impact actions require explicit approval. Operators should avoid logging environment variables or full provider payloads containing personal data. For the official hosted MCP, authorize only trusted clients, review its requested permissions, and do not automatically trust newly discovered tools.

## Tests

`npm test` uses Node's test runner with mocked fetch behavior and no live credentials. Tests cover missing auth, approval denial, registration, strict validation, authentication mapping, and rate-limit handling. `npm run build` type-checks the implementation.

## Limitations

This connector intentionally does not expose every MailerLite endpoint, bulk imports, arbitrary API calls, webhook mutation, account administration, or campaign deletion. It does not proxy the official hosted MCP OAuth session. API availability and exact account permissions remain controlled by MailerLite and the operator's plan/token. Campaign scheduling must be reviewed by a human because it can cause external email delivery.
