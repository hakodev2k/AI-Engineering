# Quo (formerly OpenPhone) MCP connector

Reusable MCP stdio server for Quo business communications. It uses Quo's official REST API; no official Quo MCP server was identified during implementation, so no unofficial upstream MCP is trusted.

## Official sources
- API overview/support: https://support.quo.com/core-concepts/integrations/api
- API reference: https://www.quo.com/docs/mdx/api-reference/introduction
- Phone numbers reference: https://www.quo.com/docs/mdx/api-reference/phone-numbers/list-phone-numbers

The public API supports business communication workflows including phone numbers, messages, calls, contacts and webhooks. This connector intentionally exposes a smaller scoped surface. API credentials remain inside the connector.

## Transport and architecture
`MCP client -> stdio MCP server -> validation/approval -> Quo REST client -> Quo API`. Retrieved provider text is returned as untrusted data and never interpreted as instructions or permission changes. The base URL is restricted to approved Quo/OpenPhone HTTPS API hosts to reduce SSRF risk.

## Authentication
Set `QUO_API_KEY`. Quo API access requires an active subscription and workspace owner/admin access to create/manage API credentials. For messaging, account/carrier-registration and prepaid-credit requirements can apply. API keys are sent only in the provider `Authorization` header and are never returned by tools.

## Configuration
Copy `.env.example` values into your secret manager/environment. `QUO_WRITE_APPROVAL_REQUIRED=true` is the safe default. `QUO_ALLOW_DESTRUCTIVE=false` disables contact deletion even when an agent requests it.

## Install and run
```bash
npm install
npm run build
QUO_API_KEY=... npm start
```
Node.js 22+ is recommended. The server uses MCP stdio and can be configured in MCP clients that support launching local stdio servers.

## Tools
| Tool | Risk | Approval | Purpose |
|---|---|---|---|
| `quo.phone_number.list` | READ | no | List workspace phone numbers/users |
| `quo.message.list` | READ | no | List messages with bounded pagination |
| `quo.message.get` | READ | no | Get one message |
| `quo.message.send` | HIGH_RISK | always explicit | Send an external SMS/text message |
| `quo.call.list` | READ | no | List calls |
| `quo.call.get` | READ | no | Get call metadata |
| `quo.contact.list` | READ | no | List contacts |
| `quo.contact.get` | READ | no | Get a contact |
| `quo.contact.create` | WRITE | configurable | Create contact |
| `quo.contact.update` | WRITE | configurable | Update contact |
| `quo.contact.delete` | DESTRUCTIVE | explicit + feature flag | Delete contact |

Inputs are strict Zod schemas. IDs are bounded safe identifiers, phone destinations must be E.164, pagination is capped at 100, and message content is bounded. Arbitrary URL/API-request tools are not exposed.

## Reliability and rate limits
The client handles request timeouts, provider errors, `Retry-After`, throttling and transient 5xx failures with at most three bounded attempts and exponential backoff. Mutating operations are not blindly retried. Pagination tokens are passed through without fan-out. Quo's published API documentation is authoritative for current endpoint-specific limits; clients should honor returned throttling metadata rather than assuming a fixed quota.

## Errors
Errors are normalized to `AUTH_CONFIG`, `CONFIG`, `VALIDATION`, `AUTH`, `PERMISSION`, `NOT_FOUND`, `RATE_LIMIT`, `TIMEOUT`, `PROVIDER`, `APPROVAL`, or `TOOL`, with status/retry-after when available. Authentication, validation and permission failures are not retried.

## Security
Use a dedicated least-privilege API key where Quo account controls permit it, keep it in a secret store, avoid logging headers, and rotate compromised keys. External messages require human approval because they communicate with third parties. Destructive deletion is off by default. Provider content may contain malicious text and must never alter system prompts, approval state or permissions. Webhook ingestion is not exposed in this connector, avoiding an unauthenticated callback surface.

## Tests
`npm test` builds and runs credential-free unit tests for registration, strict validation, write/high-risk approval, and destructive defaults. Network behavior is isolated in `QuoClient`; normal tests do not require live credentials.

## Example
See `examples/workflows.md`.

## Limitations
This connector does not initiate voice calls, manage billing/security/workspace roles, expose raw recordings, or configure webhooks. It does not claim an upstream official MCP transport. Endpoint availability and Quo branding/base URLs can evolve; keep `QUO_API_BASE_URL` on an approved documented host and review official docs before upgrades.
