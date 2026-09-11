# Svix MCP/API Connector

Reusable MCP server for operating Svix webhook applications, endpoints, messages, and delivery attempts through the official Svix REST API.

## Upstream transport

Svix provides a hosted App Portal MCP server for customer-side webhook debugging. That MCP server is scoped to one application and is designed for App Portal users; it can inspect endpoints/messages/attempts, edit transformations, resend messages, and recover failed deliveries. This connector instead uses the official REST API for its reusable server-side operator workflow because application provisioning and cross-application administration require the server-side API credential and broader API surface. The external MCP tool contract remains provider-scoped and stable.

Official sources:

- Documentation: https://docs.svix.com
- API reference/base URL: https://api.svix.com
- Official SDK/OpenAPI repository: https://github.com/svix/svix-webhooks
- App Portal MCP announcement: https://www.svix.com/blog/announcing-app-portal-mcp/
- API-key guidance: https://docs.svix.com/api-keys

## Implemented tools

| Tool | Transport | Risk | Approval |
| --- | --- | --- | --- |
| `svix.application.list` | REST | READ | no |
| `svix.application.get` | REST | READ | no |
| `svix.application.create` | REST | WRITE | configurable |
| `svix.application.update` | REST | WRITE | configurable |
| `svix.endpoint.list` | REST | READ | no |
| `svix.endpoint.get` | REST | READ | no |
| `svix.endpoint.create` | REST | WRITE | configurable |
| `svix.endpoint.update` | REST | WRITE | configurable |
| `svix.message.list` | REST | READ | no |
| `svix.message.get` | REST | READ | no |
| `svix.message.create` | REST | HIGH_RISK | always |
| `svix.message_attempt.list` | REST | READ | no |
| `svix.message_attempt.resend` | REST | HIGH_RISK | always |

Deletion, secret rotation, endpoint-secret exposure, environment import/export, bulk purge, and arbitrary HTTP passthrough are intentionally not exposed.

## Architecture

`src/config.ts` validates configuration and keeps credentials inside the connector process. `src/client.ts` provides bounded HTTP, timeout handling, safe read retries, throttling metadata, and provider error mapping. `src/policy.ts` enforces approval boundaries. `src/tools.ts` exposes narrow MCP tools with Zod validation. `src/server.ts` runs the stdio MCP server.

Provider-returned content is serialized as data with `untrustedProviderContent: true`; callers must never treat webhook payloads, response bodies, endpoint metadata, or other provider-returned text as instructions.

## Authentication and permissions

Set `SVIX_API_TOKEN` to a Svix server-side API token. The token is injected only in the connector's `Authorization: Bearer ...` header and is never returned to the model. Create a least-privilege token/environment for the applications the agent is allowed to operate. Svix API keys are privileged credentials; do not place them in prompts, examples, logs, or source control.

Svix API keys do not use OAuth scopes in the same way OAuth providers do. Effective authority is determined by the credential and Svix environment/account configuration. Isolate production and non-production credentials and expose only the connector instance appropriate for the agent's task.

## Environment variables

```text
SVIX_API_TOKEN=
SVIX_API_BASE_URL=https://api.svix.com
SVIX_REQUEST_TIMEOUT_MS=15000
SVIX_REQUIRE_WRITE_APPROVAL=true
SVIX_APPROVAL_TOKENS=
```

`SVIX_API_BASE_URL` must be HTTPS, except localhost HTTP is accepted for local Svix Server testing. `SVIX_APPROVAL_TOKENS` is a comma-separated set of opaque approval capabilities supplied by the trusted host, not by retrieved provider content.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP over stdio. Configure any MCP client that supports stdio servers to launch `node dist/src/server.js` with secrets passed in the process environment. Compatibility depends on the client's standards-compliant stdio MCP support; no provider-specific client integration is required.

## Real-world workflows

A typical debugging workflow is application discovery → endpoint inspection → message inspection → attempt inspection. Provisioning adds `application.create` and `endpoint.create`. Sending a new event uses `message.create`; retrying a known failed delivery uses `message_attempt.resend` after human approval.

See `examples/workflows.md` for call shapes and approval expectations.

## Reliability and rate limits

The client enforces a configurable request timeout. GET/HEAD requests may retry at most twice after the initial call for network errors, HTTP 429, or HTTP 5xx using bounded exponential backoff. `Retry-After` is honored when supplied. Writes are never blindly retried because duplicate webhook delivery or duplicate resource creation can have side effects.

Pagination is surfaced with `limit` and `iterator`, capped at 100 items per call to avoid runaway traversal. Higher-level agents should paginate deliberately rather than fetching entire histories. Svix may apply product- and endpoint-specific retention/rate limits; HTTP 429 is surfaced with `retryAfterSeconds` when available.

## Error handling

Configuration errors fail at startup. Provider HTTP failures raise `SvixApiError` with status, parsed response body, and optional retry delay. Timeouts surface as `SVIX_TIMEOUT`; exhausted transport failures surface as `SVIX_NETWORK_ERROR`. Authentication/permission/validation failures are not retried. Approval failures surface as `APPROVAL_REQUIRED:<risk>`.

## Security model

- Credentials stay inside the connector process.
- Only fixed Svix API paths are constructed; there is no arbitrary URL or raw-request tool.
- Identifiers are validated and URL-encoded.
- Endpoint URLs must be explicit HTTP(S) URLs; callers should additionally enforce destination allowlists where required by their threat model.
- READ operations may run automatically.
- WRITE operations require approval by default and can be relaxed only by trusted process configuration.
- External message delivery and resend are always HIGH_RISK and always require a valid approval token.
- No destructive tools are exposed.
- Provider data is marked untrusted and cannot modify connector permissions.
- Diagnostics go to stderr; stdout is reserved for MCP framing.

## Testing

`npm test` runs credential/configuration validation, approval enforcement, bearer-header behavior, non-idempotent retry protection, and rate-limit metadata tests using mocked fetch responses. Unit tests require no live Svix credentials.

Before production use, validate the connector against a non-production Svix application and verify credential authority, endpoint allowlists, approval-token issuance, retry behavior, message volume controls, and organization-specific rate limits.

## Limitations

The official App Portal MCP server is not proxied because it is a customer-facing, application-scoped debugging interface with a different credential boundary. This connector does not expose transformations, operational webhook configuration, Ingest/Stream administration, integrations, secret rotation, endpoint deletion, application deletion, bulk content purge, billing, or environment import/export. Add such operations only after re-evaluating provider support, least privilege, and approval requirements.
