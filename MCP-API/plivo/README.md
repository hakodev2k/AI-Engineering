# Plivo MCP/API Connector

Reusable MCP facade over Plivo's official REST APIs for messaging and voice operations. No official Plivo MCP server was found in Plivo's current official documentation during implementation, so this connector uses the official REST API and exposes a stable MCP interface.

## Official sources and transport
Official Plivo documentation used: Voice API overview (`https://www.plivo.com/docs/voice/api/overview`), Messaging API overview (`https://www.plivo.com/docs/messaging/api/overview`), Calls API (`https://www.plivo.com/docs/voice/api/calls`), account/feature limits (`https://docs.plivo.com/docs/voice/concepts/account-limits`). Plivo documents JSON REST APIs under `https://api.plivo.com/v1/Account/{auth_id}/` using HTTP Basic authentication with Auth ID and Auth Token.

## Capabilities
Eleven tools are implemented: message list/get/send; call list/get/create/hangup; recording list/get; application list/get. READ tools may auto-execute. Sending a message, placing a call, or terminating an active call is HIGH_RISK because it communicates externally or changes a live communication session and therefore requires literal `approved:true`. Delete-resource and account/security administration tools are intentionally not exposed.

## Authentication
Set `PLIVO_AUTH_ID` and `PLIVO_AUTH_TOKEN` only in the connector environment or secret store. Credentials remain inside `PlivoClient`, are encoded into Basic Authorization only for provider requests, and are never returned to the MCP caller. Use an account/subaccount with the least privileges and geo permissions needed for the intended workflow.

## Installation and running
Requires Node.js 20+. Run `npm install`, `npm run build`, then `npm start`. The local server uses the official Model Context Protocol TypeScript SDK and stdio transport. Any client that supports standard stdio MCP can launch it; do not assume compatibility with clients that require remote HTTP transport.

## Configuration
`PLIVO_API_BASE_URL` defaults to `https://api.plivo.com` and must be HTTPS. `PLIVO_TIMEOUT_MS` defaults to 15000. `PLIVO_REQUIRE_WRITE_APPROVAL` defaults true. The connector never accepts an arbitrary request URL, preventing agents from turning credentials into a general-purpose HTTP proxy.

## Reliability, pagination, and limits
List tools expose bounded `limit` (1-20) and `offset`, matching Plivo's documented pagination. Requests have bounded timeouts. GET requests retry at most twice on 5xx with exponential backoff and on 429 while preserving `Retry-After` when supplied. Mutations are not automatically retried, avoiding duplicate messages/calls or repeated hangups. Plivo documents a default API limit of 300 requests per five seconds for call and non-call APIs; outbound calls additionally have account CPS limits. Messaging throughput is separately governed by account/channel MPS limits.

## Errors
401 maps to `AUTH`, 403 to `PERMISSION`, 429 to `RATE_LIMIT`, timeouts to `TIMEOUT`, and other non-success responses to `PROVIDER`. Validation errors are rejected before network access. Authentication and permission failures are never retried.

## Security
Provider responses are explicitly marked `untrusted-provider-content`; retrieved text or metadata is data, never instructions. Phone numbers require E.164 format. Resource identifiers are strictly constrained. Callback/answer URLs must be HTTPS, reducing SSRF exposure. Credentials are never logged or exposed. External communication and live-call termination require human approval. The connector cannot silently expand permissions and has no unrestricted raw-API tool.

## Testing
`npm test` uses mocks and requires no live Plivo credentials. Tests cover registration, strict input validation, approval denial, read routing, and untrusted-response marking. Client logic independently handles authentication configuration, provider errors, throttling, timeouts, and bounded retries.

## Limitations
No upstream MCP transport is used because an official Plivo MCP server was not identified. This connector deliberately omits bulk messaging, WhatsApp-specific workflows, number purchasing, billing, SIP credential/ACL mutation, application mutation, recording deletion, conferences, and compliance-registration APIs. Those should be added only with dedicated scopes, validation and approval semantics. Plivo account-specific geo permissions, throughput, CPS/MPS and regulatory requirements still apply.
