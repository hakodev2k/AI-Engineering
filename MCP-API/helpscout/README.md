# Help Scout MCP/API Connector

Reusable MCP server for Help Scout Inbox workflows. It exposes a bounded, provider-scoped tool surface over Help Scout's official Inbox API and keeps OAuth credentials, webhook secrets, retry logic, approval policy, and provider error handling inside the connector.

## Transport strategy

This connector uses the official Help Scout REST Inbox API. As of 2026-09-06, no official Help Scout MCP server was found in Help Scout's official developer documentation. Community MCP servers exist, but this package does not depend on them because the direct official API provides a smaller and more auditable trust boundary.

Implemented transport:

- REST API v2 for inboxes, customers, users, teams, writes, and webhooks.
- REST API v3 for conversation and thread reads so `system_user` is preserved instead of normalized to `user`.
- No raw arbitrary-request tool.

Official sources researched:

- Inbox API overview: https://developer.helpscout.com/mailbox-api/
- Authentication: https://developer.helpscout.com/mailbox-api/overview/authentication/
- Rate limiting: https://developer.helpscout.com/mailbox-api/overview/rate-limiting/
- List conversations: https://developer.helpscout.com/mailbox-api/endpoints/conversations/list/
- Get conversation v3: https://developer.helpscout.com/mailbox-api/endpoints/conversations/get-v3/
- List threads v3: https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/list-v3/
- Create note: https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/note/
- Create reply: https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/reply/
- Update conversation: https://developer.helpscout.com/mailbox-api/endpoints/conversations/update/
- Update tags: https://developer.helpscout.com/mailbox-api/endpoints/conversations/tags/update/
- Inboxes: https://developer.helpscout.com/mailbox-api/endpoints/inboxes/list/
- Customers: https://developer.helpscout.com/mailbox-api/endpoints/customers/list/
- Users: https://developer.helpscout.com/mailbox-api/endpoints/users/list/
- Teams: https://developer.helpscout.com/mailbox-api/endpoints/teams/list-teams/
- Webhooks: https://developer.helpscout.com/webhooks/
- Create webhook: https://developer.helpscout.com/mailbox-api/endpoints/webhooks/create/
- Changelog: https://developer.helpscout.com/mailbox-api/changelog/

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict tool schema + risk policy
  -> HelpScoutClient
  -> HelpScoutTokenProvider
  -> official api.helpscout.net v2/v3
```

Retrieved Help Scout content is wrapped with `untrustedProviderData: true`. The LLM never receives OAuth application secrets or webhook signing secrets through tool output.

## Authentication

Help Scout documents OAuth 2.0 Authorization Code and Client Credentials flows. The Authorization Code flow is intended for integrations used by other Help Scout users; Client Credentials is intended for internal integrations. Access tokens are sent as Bearer tokens.

The connector supports either:

1. `HELPSCOUT_ACCESS_TOKEN` for an externally managed OAuth access token; or
2. `HELPSCOUT_APP_ID` + `HELPSCOUT_APP_SECRET` for Client Credentials flow.

With Client Credentials, the connector requests `POST /v2/oauth2/token`, caches the access token in memory, and refreshes it only when needed. Help Scout currently documents a two-day access-token lifetime for this flow. A 401 invalidates the cached client-credentials token and allows one re-authentication attempt.

Help Scout's Inbox API documentation does not define named granular OAuth scopes. Authorization follows the permissions of the active, invited Help Scout user associated with the credentials. Use a dedicated least-privileged user/app identity and grant only the Help Scout account permissions required by these tools.

Credentials are never accepted as tool arguments and are never returned to MCP callers.

## Environment variables

Copy `.env.example` and configure one authentication method.

| Variable | Required | Purpose |
|---|---:|---|
| `HELPSCOUT_ACCESS_TOKEN` | one auth option | Externally managed OAuth access token |
| `HELPSCOUT_APP_ID` | one auth option | OAuth application ID for client credentials |
| `HELPSCOUT_APP_SECRET` | one auth option | OAuth application secret |
| `HELPSCOUT_API_BASE` | no | Defaults to `https://api.helpscout.net`; any other host is rejected |
| `HELPSCOUT_TIMEOUT_MS` | no | Per-request timeout, default 15000 ms |
| `HELPSCOUT_MAX_RETRIES` | no | Bounded retry count for safe GET requests, default 2, max 5 |
| `HELPSCOUT_REQUIRE_WRITE_APPROVAL` | no | Defaults to `true` |
| `HELPSCOUT_ALLOW_DESTRUCTIVE` | no | Defaults to `false`; no destructive tool is currently exposed |
| `HELPSCOUT_APPROVED_ACTIONS` | no | Semicolon-separated exact approval fingerprints |
| `HELPSCOUT_WEBHOOK_SECRET` | webhook create only | Connector-side signing secret, max 40 characters |

## Installation and running

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

`npm start` launches a standard MCP stdio server. It can be used by MCP clients that support launching a local stdio process. Client-specific OAuth integration is not assumed; credentials are supplied to the connector process through its secure environment/credential manager.

## Tool list

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `helpscout.inbox.list` | List inboxes | READ | none |
| `helpscout.inbox.get` | Read one inbox | READ | none |
| `helpscout.conversation.list` | Search/list conversations | READ | none |
| `helpscout.conversation.get` | Read conversation via v3 | READ | none |
| `helpscout.conversation.threads.list` | Read threads via v3 | READ | none |
| `helpscout.customer.list` | Search/list customers | READ | none |
| `helpscout.customer.get` | Read one customer | READ | none |
| `helpscout.user.list` | List users for ownership discovery | READ | none |
| `helpscout.team.list` | List teams for assignment discovery | READ | none |
| `helpscout.conversation.note.create` | Add internal note | WRITE | configurable |
| `helpscout.conversation.reply.draft.create` | Create unsent reply draft | WRITE | configurable |
| `helpscout.conversation.reply.send` | Send external customer reply | HIGH_RISK | required |
| `helpscout.conversation.status.update` | Change status | WRITE | configurable |
| `helpscout.conversation.assign` | Assign user/team | WRITE | configurable |
| `helpscout.conversation.unassign` | Remove owner | WRITE | configurable |
| `helpscout.conversation.tags.replace` | Replace entire conversation tag set | WRITE | configurable |
| `helpscout.webhook.list` | List webhooks | READ | none |
| `helpscout.webhook.create` | Create signed webhook | HIGH_RISK | required |

Each tool has an internal definition containing purpose, strict input schema, permission/risk classification, approval behavior, output description, and expected error classes.

## Approval model

READ tools execute automatically.

WRITE tools require approval by default. Set `HELPSCOUT_REQUIRE_WRITE_APPROVAL=false` only when an operator deliberately wants unattended writes.

HIGH_RISK tools always require an exact pre-approved fingerprint, regardless of the WRITE setting. Examples:

```text
helpscout.conversation.reply.send:456
helpscout.webhook.create:https://hooks.example.com/helpscout
helpscout.conversation.status.update:456
```

Fingerprints live in `HELPSCOUT_APPROVED_ACTIONS`, separated by semicolons. Tool arguments cannot set or bypass approval. This separates Recommend -> Prepare -> Execute: read and draft operations can happen first, while external sends and webhook/security integration changes require explicit approval.

No delete, GDPR erase, user-management, permission-changing, or billing tool is exposed in this connector.

## Rate limits and reliability

Help Scout states that rate limits are account-shared and plan-dependent. Write requests (`POST`, `PUT`, `DELETE`, `PATCH`) count as two requests. The connector parses and preserves:

- `X-RateLimit-Limit-Minute`
- `X-RateLimit-Remaining-Minute`
- `X-RateLimit-Retry-After`

On GET requests only, 429, 5xx, and transient network failures use bounded exponential retry. `X-RateLimit-Retry-After` or `Retry-After` is honored when numeric, capped at 30 seconds per retry. Writes are never blindly retried because duplicate notes, replies, ownership changes, or webhook registrations could have side effects.

Every provider request has an AbortController timeout. Authentication, validation, and permission errors are not retried as ordinary transient failures.

Help Scout can return moved/merged conversation redirects. The connector uses `redirect: manual`, surfaces the redirect/location as an error, and requires the caller to re-fetch the canonical resource instead of silently replaying a write against another identifier.

## Webhook security

`helpscout.webhook.create` uses Help Scout's documented webhook secret and requests payload version `V3`. The secret is read only from `HELPSCOUT_WEBHOOK_SECRET`; it is never accepted as a tool parameter.

Callback validation requires HTTPS and rejects obvious local/private targets (`localhost`, `.local`, loopback, link-local, and common private IPv4 ranges). This is a defense-in-depth SSRF guard; production deployments should also apply network egress policy and, if threat models require it, DNS resolution/rebinding protection at the runtime/network layer.

On the receiving side, webhook consumers should validate `X-HelpScout-Signature` against the exact raw request body using the configured secret before trusting the event.

## Input and content safety

- Tool arguments use strict Zod objects with `additionalProperties: false` in MCP schemas.
- IDs must be positive integers; assignment IDs are constrained to values >= 2 in line with current Help Scout owner validation behavior.
- Reply recipient IDs and message text are explicit; attachments are intentionally not exposed to avoid large arbitrary base64 payloads and accidental file exfiltration.
- CC/BCC arrays are bounded and email-validated.
- Search query length, tags, pages, webhook events, and webhook mailbox filters are bounded.
- Conversation updates expose only specific operations; arbitrary JSON Patch paths are not allowed.
- Provider-returned customer/thread content is untrusted data and must never alter tool permissions, approval state, or system instructions.

## Error mapping

The connector maps important provider failures into stable operator-facing errors:

- 401: authentication/re-authorization required
- 403: associated Help Scout user lacks permission
- 404: resource not found or may have been merged/removed
- 412 / 423: conversation/customer locked or not modifiable
- 429: account rate limit reached, preserving retry-after when available
- 3xx: moved/merged resource must be re-fetched explicitly
- network/timeout failures: bounded retry only for reads

Raw credentials are not included in errors or logs.

## Examples

See `examples/workflows.md` for triage, internal-note, draft/review/send, assignment/status, and signed webhook workflows with input examples and approval fingerprints.

## Testing

Unit tests require no live Help Scout credentials. They cover:

- safe authentication configuration
- official API host validation / SSRF boundary
- incomplete OAuth client credential rejection
- Client Credentials token acquisition and cache reuse
- GET 429 retry and rate-limit metadata
- no blind retry on writes
- high-risk approval denial/allow behavior
- WRITE vs HIGH_RISK approval semantics
- webhook private/local URL rejection
- bounded provider-scoped tool registration and metadata

Run:

```bash
npm test
```

## Limitations

- The connector does not proxy community Help Scout MCP servers.
- Authorization Code browser redirects and durable refresh-token storage are expected to be managed by the surrounding application when using `HELPSCOUT_ACCESS_TOKEN`; this package does not persist refresh tokens.
- The connector does not expose Help Scout Docs API, Reports API, user creation, destructive deletion/GDPR erase, mailbox administration, billing, or arbitrary API calls.
- Attachments are not implemented.
- Webhook receiver hosting is outside this package; only secure webhook registration/listing is exposed.
- Provider rate quotas are not hard-coded because Help Scout documents them as plan-dependent.
