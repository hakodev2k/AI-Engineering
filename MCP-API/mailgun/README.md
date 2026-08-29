# Mailgun MCP/API Connector

Reusable, provider-scoped MCP server for Mailgun Email API workflows. It exposes operationally useful reads plus carefully gated template creation and email sending.

## Official sources researched
Checked against current Mailgun/Sinch documentation on 2026-08-30:
- API overview/authentication/regions/rate-limit headers: https://documentation.mailgun.com/docs/mailgun/api-reference/api-overview
- OpenAPI reference and endpoint catalog: https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/limits
- HTTP message sending: https://documentation.mailgun.com/docs/mailgun/user-manual/sending-messages/send-http
- Templates: https://documentation.mailgun.com/docs/mailgun/user-manual/sending-messages/send-templates
- Webhooks: https://documentation.mailgun.com/docs/mailgun/user-manual/webhooks/configuring-webhooks
- API key/RBAC guidance: https://documentation.mailgun.com/docs/mailgun/user-manual/api-key-mgmt/rbac-mgmt

No official Mailgun MCP server was found in Mailgun's official documentation during this research pass. The connector therefore uses Mailgun's official REST API directly rather than an unofficial MCP implementation.

## Transport and architecture
```text
MCP client -> stdio MCP server -> strict tool schema -> risk/approval policy
           -> credential-isolated Mailgun REST client -> Mailgun API (US or EU)
```
Node.js 20+ is required. The outward protocol is MCP over stdio; upstream transport is HTTPS REST.

## Authentication and least privilege
Mailgun's API uses HTTP Basic authentication with username `api` and the API key as password. Set `MAILGUN_API_KEY`; credentials never appear in tool inputs or outputs. Use a scoped/custom Mailgun API key or RBAC role with only the permissions required for the domains and resources this connector must access.

`MAILGUN_REGION=us` uses `https://api.mailgun.net`; `eu` uses `https://api.eu.mailgun.net`. Mailgun documents that message data, event logs, suppressions, mailing lists, tags, statistics and routes are region-bound.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `mailgun.domain.list` | REST | READ | no |
| `mailgun.domain.get` | REST | READ | no |
| `mailgun.logs.query` | REST | READ | no |
| `mailgun.metrics.query` | REST | READ | no |
| `mailgun.template.list` | REST | READ | no |
| `mailgun.template.get` | REST | READ | no |
| `mailgun.template.create` | REST | WRITE | yes |
| `mailgun.mailing_list.list` | REST | READ | no |
| `mailgun.mailing_list.member.list` | REST | READ | no |
| `mailgun.route.list` | REST | READ | no |
| `mailgun.route.get` | REST | READ | no |
| `mailgun.suppression.bounce.list` | REST | READ | no |
| `mailgun.suppression.complaint.list` | REST | READ | no |
| `mailgun.message.send` | REST | HIGH_RISK | yes |

The connector intentionally omits deletion, API-key management, billing, account/RBAC changes, route mutation, suppression deletion, mailing-list mutation, and domain deletion.

## Environment
```text
MAILGUN_API_KEY=             # required
MAILGUN_REGION=us            # us | eu
MAILGUN_TIMEOUT_MS=15000
MAILGUN_MAX_RETRIES=3        # 0..5
MAILGUN_APPROVAL_SECRET=     # required for WRITE/HIGH_RISK tools
MAILGUN_ENABLE_HIGH_RISK=true
```

## Install and run
```bash
npm install
npm run check
npm test
npm start
```
Configure the command as a stdio MCP server in clients that support stdio MCP processes.

## Approval model
READ tools can execute automatically. `mailgun.template.create` and `mailgun.message.send` require an HMAC-SHA256 approval token bound to the exact tool name and canonicalized payload excluding `approval_token`. Changing recipients, subject, content, sending domain, template body, or any other approved parameter invalidates the token. Set `MAILGUN_ENABLE_HIGH_RISK=false` to disable email sending entirely outside the agent/tool plane.

## Rate limits and reliability
Mailgun exposes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`; time windows may vary by API. The client captures these on errors, handles HTTP 429, honors integer `Retry-After`, and uses bounded exponential backoff for safe reads on 429/502/503/504. Authentication/permission/validation failures are not retried. Mutating operations and email sends are never blindly retried, avoiding duplicate messages or duplicate templates. All requests have a bounded timeout and honor MCP cancellation signals when available.

## Security
- Credentials are loaded only by the auth/client layer.
- Only fixed Mailgun hosts are selected through the `us|eu` region enum, preventing arbitrary upstream SSRF configuration.
- Tool schemas constrain domains, counts, recipient arrays, content sizes, and accepted enums.
- No generic `execute_request` escape hatch exists.
- Sending external email requires explicit approval.
- Provider responses are marked `untrusted_provider_data`; retrieved email/log/template content must never be interpreted as instructions.
- Secret-like response keys are recursively redacted before returning data to the MCP caller.
- Prefer verified/consented recipients; Mailgun explicitly recommends confirmed opt-in and warns against purchased/scraped lists.

## Webhooks and events
Mailgun supports domain- and account-level webhooks, and official docs currently allow up to three URLs per event type. This connector does not mutate webhook configuration because changing callback destinations is security-sensitive and not required for the selected agent workflows. Logs/metrics expose the operational event/analytics use cases safely through read tools.

## Testing
Unit tests require no live credentials and cover registry consistency, configuration validation, US/EU routing, Basic Auth, approval binding, high-risk denial, sanitization, non-retry of authentication failures, rate-limit retry, and duplicate-send prevention.

## Limitations
- Multipart attachments and inline images are intentionally not exposed in v1 to keep schemas bounded and avoid arbitrary local-file handling.
- `mailgun.logs.query` and `mailgun.metrics.query` preserve some flexible provider-defined query fields because Mailgun's analytics filters/dimensions evolve; they remain fixed to those two official endpoints and cannot change method/URL.
- Mailgun plans and RBAC assignments determine which endpoints a particular API key may use; a correctly configured connector can still receive 401/403 responses when the key lacks permission.
