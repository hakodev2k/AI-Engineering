# Resend MCP/API Connector

Reusable MCP facade for Resend email infrastructure. The connector intentionally exposes a curated subset of high-value operations instead of arbitrary HTTP access.

## Upstream strategy
Resend provides an official hosted MCP server at `https://mcp.resend.com/mcp` with OAuth, and an official local `resend-mcp` server supporting stdio/Streamable HTTP. Resend states that its official MCP covers the platform, including emails, contacts, broadcasts, domains, webhooks, segments, topics, contact properties, API keys, received email and templates/logs as the platform evolves. This package uses the official REST API behind a stable, curated local MCP facade because it enforces connector-specific schemas, risk classes and approval boundaries. Deployments that want full upstream coverage can use the official Resend MCP directly.

Official references: Resend MCP documentation (`https://resend.com/mcp`), official MCP announcement (`https://resend.com/changelog/mcp`), remote MCP announcement (`https://resend.com/changelog/remote-mcp-server`), and API rate-limit announcement (`https://resend.com/changelog/api-rate-limit`).

## Implemented tools
`resend.email.list`, `resend.email.get`, `resend.email.send`, `resend.email.cancel`, `resend.contact.list`, `resend.contact.get`, `resend.contact.create`, `resend.contact.update`, `resend.domain.list`, `resend.domain.get`, `resend.domain.verify`, `resend.webhook.list`.

Read tools execute automatically. Contact/domain mutations are WRITE and require approval by default. Sending or cancelling external email is HIGH_RISK and always requires explicit `approved: true`. Destructive deletion and API-key administration are intentionally not exposed. Retrieved provider content is marked untrusted so agents must treat it as data, never instructions.

## Authentication and least privilege
Set `RESEND_API_KEY` only in the connector process. It is inserted into the Authorization header by `ResendClient` and is never returned by a tool. Create a Resend API key with only the access required for the tools you intend to use. For interactive clients, Resend's hosted MCP supports OAuth and lets users revoke permissions from Team settings. Headless use can authenticate to the official MCP with a Resend API key as Bearer token.

## Configuration
Copy `.env.example` into your secret-management workflow. `RESEND_API_BASE_URL` must be HTTPS. `RESEND_TIMEOUT_MS` defaults to 15 seconds. `RESEND_REQUIRE_WRITE_APPROVAL` defaults to true. `RESEND_ALLOW_DESTRUCTIVE` defaults to false; this package currently registers no destructive tools.

## Install and run
Requires Node.js 20+. Run `npm install`, `npm run build`, then `npm start`. The package exposes stdio MCP using the official Model Context Protocol TypeScript SDK, suitable for clients that support stdio MCP. Do not infer compatibility with clients that require another transport; use Resend's official remote MCP for those clients.

## Reliability and rate limits
Requests have bounded timeouts. HTTP 429 is retried at most twice using `Retry-After` when available. GET requests on 5xx are retried at most twice with exponential backoff. Writes are never blindly retried. Resend documents a default API rate limit of 10 requests/second and exposes `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset`, and `retry-after`; 429 responses are mapped to a structured connector error.

## Security
Credentials remain in the auth/client layer. API base URLs must be HTTPS, reducing SSRF/configuration risk. IDs are constrained before use and path components are encoded. Inputs have bounded lengths and recipient counts. External send/cancel operations require explicit human approval. Provider content is untrusted and must not change permissions or system behavior. Never log API keys or authorization headers.

## Errors
The client maps authentication, permission, throttling, timeout and provider failures to structured errors. Validation failures are rejected before network access. Authentication/permission failures and writes are not retried.

## Testing
Run `npm test`. Unit tests require no live credentials and cover registration, validation, approval denial, request routing and untrusted-content marking. Network behavior is isolated behind `ResendClient` and can be mocked.

## Limitations
This curated connector does not expose broadcasts, segments, topics, received-email attachments, templates, API-key administration, webhook mutation, or destructive delete operations. Those capabilities exist in the official Resend platform/MCP but are intentionally outside this connector's current safety-focused contract. The connector does not implement the upstream OAuth browser flow; use Resend's hosted MCP when OAuth is preferred.
