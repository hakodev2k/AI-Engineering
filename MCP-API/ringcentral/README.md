# RingCentral MCP Connector

Reusable stdio MCP server for scoped RingCentral RingEX workflows using the official RingCentral REST API.

## Official sources and transport
The connector uses RingCentral's official REST API at `https://platform.ringcentral.com/restapi/v1.0`. It does not rely on an upstream MCP server. Research for this implementation used RingCentral Developers documentation: authentication (`https://developers.ringcentral.com/guide/authentication`), rate limits (`https://developers.ringcentral.com/guide/basics/rate-limits`), API reference/response behavior, and webhook subscriptions (`https://developers.ringcentral.com/guide/notifications/webhooks/creating-webhooks`). No official RingCentral MCP server was identified for the implemented RingEX capabilities, so REST is the explicit fallback/primary transport.

## Capabilities
Implemented MCP tools: `ringcentral.account.get`, `ringcentral.extension.list`, `ringcentral.extension.get`, `ringcentral.phone_number.list`, `ringcentral.call_log.list`, `ringcentral.message.list`, `ringcentral.message.get`, `ringcentral.presence.get`, `ringcentral.subscription.list`, and `ringcentral.sms.send`.

The connector intentionally excludes deleting messages, changing users/permissions, billing, call control, production administration, arbitrary REST execution, webhook creation, and RingCX administration.

## Architecture
MCP client -> local stdio server -> strict Zod validation/approval boundary -> RingCentral client -> OAuth JWT token exchange -> official REST API. Client credentials and JWT remain inside the connector process and are never returned to the model. Provider payloads are wrapped as untrusted data and must never be interpreted as instructions.

## Authentication and scopes
RingCentral documents Authorization Code (preferably PKCE) for interactive multi-user apps and JWT for server apps acting as a predetermined user. This connector implements the server-side JWT flow using `RC_CLIENT_ID`, `RC_CLIENT_SECRET`, and `RC_JWT`. Tokens are cached until near expiry. Configure only the application permissions needed by enabled tools: Read Accounts for account/extension/number metadata, Read Call Log, Read Messages, Read Presence, and SMS for sending SMS. Exact availability is also constrained by the authenticated user's RingCentral permissions and account edition. Do not broaden app permissions silently.

## Environment
Copy `.env.example` values into the process environment or a secret manager. `RC_SERVER_URL` defaults to the official production platform URL and must be HTTPS. `RC_TIMEOUT_MS` is constrained to 1–60 seconds. Secrets must never be inserted into prompts or logs.

## Install and run
Requires Node.js 20+.

```sh
npm install
npm run build
RC_CLIENT_ID=... RC_CLIENT_SECRET=... RC_JWT=... npm start
```

Configure an MCP client that supports local stdio servers to launch `node dist/server.js` with credentials supplied through its secure environment/secret mechanism.

## Permission and approval model
All account, extension, phone-number, call-log, message-store, presence, and subscription reads are `READ` and may execute automatically. `ringcentral.sms.send` is `HIGH_RISK` because it sends an external communication and always requires the schema value `approved: true`, representing explicit human approval immediately before execution. SMS requests are never automatically retried. No destructive tools are exposed.

## Validation and safety
Identifiers accept only bounded alphanumeric/`~`/underscore/hyphen forms. Phone numbers require E.164 format. Message text is bounded to 1,000 characters. Dates must be ISO-8601 datetimes. Page sizes are bounded. No user-supplied URLs are fetched, preventing connector-level SSRF. Retrieved RingCentral content is untrusted and cannot change tool permissions, configuration, approval policy, credentials, or system instructions.

## Reliability and rate limits
Calls use AbortController timeouts. Safe reads use at most three attempts with bounded exponential backoff for 429/5xx responses; `Retry-After` is honored. Authentication, validation, permission failures, and writes are not blindly retried. RingCentral assigns endpoints to usage-plan groups and documents default examples of Light 50, Medium 40, Heavy 10, and Auth 5 requests/user/minute, while actual app limits can be customized. Runtime `X-Rate-Limit-Group`, `X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, `X-Rate-Limit-Window`, and `Retry-After` headers are authoritative. A 429 penalty interval must be allowed to elapse before retrying.

## Pagination
List tools expose bounded `perPage` values and return RingCentral's paging/navigation metadata. The connector deliberately does not auto-crawl unbounded result sets; callers can follow provider paging metadata explicitly to control quota and data volume.

## Webhooks/events
RingCentral supports outbound webhooks through its Subscription API and requires endpoint validation including TLS, timely 200 responses, and validation-token handling. This connector exposes subscription listing only. Creating/renewing webhooks is omitted because accepting callback URLs introduces an SSRF/ownership-validation trust boundary that should be implemented with a controlled callback allowlist and deployment-specific receiver.

## Errors
RingCentral HTTP failures are mapped to `RCError` with status and retry-after metadata. 401/403 errors are surfaced for user/app remediation rather than retried. Token acquisition failures never expose credentials. Network aborts/timeouts propagate as failures.

## Tests
`npm test` uses mocked fetch and no live credentials. Tests cover required auth configuration, HTTPS validation, OAuth token isolation, read behavior, permission-error mapping, and non-retry of writes. Tool schemas enforce approval and input validation at registration/runtime.

## Limitations
This package implements RingEX REST capabilities, not RingCX, RingSense, Video, Events, or Team Messaging APIs. It does not implement interactive Authorization Code + PKCE, refresh-token persistence, webhook receivers, media downloads, or destructive/admin operations. It is compatible with MCP clients capable of launching local stdio servers; no compatibility claim is made for clients that only support remote HTTP MCP servers.