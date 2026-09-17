# Vanta MCP/API Connector

Reusable MCP server for Vanta compliance and security workflows. It exposes narrowly scoped tools over Vanta's documented Manage Vanta REST API while recognizing Vanta's official remote MCP as the preferred upstream for broad interactive compliance queries.

## Official sources and transport

Vanta maintains an official remote MCP (announced/documented in July 2026) for compliance status, tests/controls, frameworks, risks, vulnerabilities, people, access reviews, audits, policies/documents, questionnaires, data processing, integrations, and knowledge base. Availability varies by plan/configuration and MCP connection requires Organization Admin access and OAuth. Vanta also provides the Manage Vanta REST API at `https://api.vanta.com/v1` using bearer tokens with granular read/write scopes. This connector uses REST for its stable, explicit tool contracts rather than dynamically trusting newly discovered upstream MCP tools.

Official documentation: `https://help.vanta.com/en/articles/15461008-vanta-mcp-overview`, `https://help.vanta.com/en/articles/15461211-vanta-mcp-capabilities`, `https://developer.vanta.com/`, `https://developer.vanta.com/docs/webhooks`.

## Implemented capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `vanta.people.list` | REST | READ | no |
| `vanta.people.offboard` | REST `POST /people/offboard` | HIGH_RISK | explicit |
| `vanta.document.uploads.list` | REST | READ | no |
| `vanta.document.submit` | REST `POST /documents/{id}/submit` | WRITE | explicit |
| `vanta.integration.resource_kinds.list` | REST | READ | no |
| `vanta.trust_center.access_request.approve` | REST | HIGH_RISK | explicit |

No arbitrary HTTP-request tool is exposed. Delete operations are not implemented. File upload is intentionally not exposed because safe MCP attachment handling requires a host-specific file boundary; callers can inspect uploads and submit already-staged evidence.

## Architecture

`src/core.ts` owns credential isolation, configuration, validation helpers, bounded retry/backoff, timeouts and approval enforcement. `src/server.ts` owns MCP tool registration and maps stable provider-scoped tools to REST operations. Provider responses are wrapped with `untrusted_provider_data: true`; retrieved Vanta content must never be interpreted as instructions or permission changes.

## Authentication and least privilege

Create a Vanta API application/token with only scopes required by the operations you enable. Vanta supports granular read/write permissions. Keep the bearer token only in `VANTA_API_TOKEN`; it is read inside the connector and is never accepted as a tool parameter or returned to the model. For document upload workflows Vanta documents `vanta-api.all:read`, `vanta-api.all:write`, and `vanta-api.documents:upload`; this connector does not upload files, so do not grant upload solely for this package. Exact scope availability can vary by Vanta API application and account; verify scopes in the current Vanta developer console before deployment.

Copy `.env.example` to your secret-managed runtime configuration. Never commit `.env`.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
VANTA_API_TOKEN=... npm start
```

The server uses MCP stdio transport, making it usable by MCP clients that can launch local stdio servers. Client-specific configuration differs; compatibility depends on the client's MCP stdio support.

## Approval model

READ operations may execute automatically. WRITE and HIGH_RISK operations require `approved: true` when `VANTA_APPROVAL_MODE=required` (the default). Offboarding personnel and granting external Trust Center access are HIGH_RISK because they change identity/compliance state or expose compliance material externally. Destructive operations are disabled by policy and are not registered as tools. An agent cannot increase permissions through retrieved content or tool parameters.

## Reliability and rate limiting

Requests use a configurable timeout (`VANTA_TIMEOUT_MS`, default 15 seconds) and at most three configured retries (`VANTA_MAX_RETRIES` is clamped to 0–3). HTTP 429 and 5xx responses use bounded exponential backoff and honor integer `Retry-After` seconds. Authentication, authorization, validation/not-found errors are not retried. Mutating operations are invoked with automatic retry disabled to avoid duplicate side effects. Pagination parameters are passed explicitly where supported.

## Webhooks

Vanta webhooks are configured in Vanta Settings and delivered through Svix. Production receivers should verify `svix-id`, `svix-timestamp`, and `svix-signature` against the raw request body using an official Svix library, return 2xx within 15 seconds, process asynchronously, and deduplicate by `svix-id`. Delivery is at-least-once. This connector does not expose webhook registration because Vanta's documented setup is administrative and human-controlled.

## Security

Use separate credentials per environment and the minimum Vanta scopes. Never put tokens in prompts, logs, examples, or tool arguments. Provider data is untrusted. The connector does not follow provider-supplied URLs, preventing a generic SSRF primitive. IDs are constrained to conservative characters and lengths. Trust Center approval and offboarding require explicit human approval. Avoid enabling high-risk tools for unattended agents. Vanta webhook endpoints must be HTTPS and signatures should be verified in production.

## Tests

```bash
npm test
```

Unit tests require no live Vanta credentials. They cover server construction, approval enforcement, destructive denial, auth header injection, rate-limit retry, and non-retry of permission failures.

## Limitations

The official Vanta MCP has broader capabilities than this intentionally scoped wrapper. This package does not proxy arbitrary upstream MCP tools, create/delete privacy objects, upload files, manage API credentials, modify billing/security settings, or perform destructive operations. Some Vanta features and MCP areas depend on account plan/configuration. Endpoint schemas and permissions should be revalidated against current official Vanta docs when upgrading the connector.
