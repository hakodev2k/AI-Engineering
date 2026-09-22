# Resend MCP/API Connector

Reusable MCP server for Resend email workflows. The connector uses Resend's official HTTPS API directly; no official Resend MCP server was relied on. Credentials remain in the connector process and are never tool inputs.

## Official sources

- API: https://resend.com/docs/api-reference/introduction
- API keys/authentication: https://resend.com/docs/dashboard/api-keys/introduction
- Emails: https://resend.com/docs/api-reference/emails/send-email
- Domains: https://resend.com/docs/api-reference/domains/list-domains
- Contacts: https://resend.com/docs/api-reference/contacts/list-contacts
- Webhooks: https://resend.com/docs/dashboard/webhooks/introduction

## Transport and architecture

MCP clients communicate over stdio. `src/server.ts` registers strict provider-scoped tools; `src/client.ts` performs authenticated HTTPS calls to `https://api.resend.com`; `src/security.ts` isolates credentials and enforces approvals. Provider responses are treated as untrusted data.

## Authentication

Create a Resend API key with the minimum permission needed in the Resend dashboard and set `RESEND_API_KEY`. Resend API keys are bearer credentials; never place them in prompts or tool arguments. Use a Sending Access key where only sending is required and Full Access only when management endpoints used by this connector are required.

## Install and run

Requires Node.js 22+.

```bash
npm install
npm run build
RESEND_API_KEY=re_xxx npm start
```

Copy `.env.example` into your secret-management workflow; this package does not load dotenv automatically.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `resend.email.send` | HIGH_RISK | required |
| `resend.email.get` | READ | no |
| `resend.email.list` | READ | no |
| `resend.email.cancel` | HIGH_RISK | required |
| `resend.email.update` | WRITE | required |
| `resend.domain.list` | READ | no |
| `resend.domain.get` | READ | no |
| `resend.contact.list` | READ | no |
| `resend.contact.get` | READ | no |
| `resend.contact.create` | WRITE | required |
| `resend.contact.update` | WRITE | required |
| `resend.contact.delete` | DESTRUCTIVE | explicit `approved: true` |

Approval defaults on via `RESEND_REQUIRE_WRITE_APPROVAL=true`. Sending email is HIGH_RISK because it sends an external message. Deletion is destructive.

## Reliability and rate limits

The client uses configurable request timeouts, bounded exponential backoff, and honors `Retry-After` for HTTP 429. It retries throttling, transient server/network failures only; normal 4xx validation/authorization failures are not retried. Resend publishes account/API-specific rate-limit behavior via its API responses; callers should avoid high fan-out and paginate list operations where the endpoint supports cursors.

## Errors and security

Provider HTTP errors are normalized to MCP errors without exposing the API key. Inputs are constrained with Zod. No arbitrary URL/request tool exists, preventing SSRF through tool parameters. Retrieved email/contact/domain content is data, not instructions. The connector does not accept dynamic MCP tool discovery or forward credentials upstream beyond `api.resend.com`.

## Testing

```bash
npm test
```

Unit tests require no live credentials and verify registration, validation, and approval boundaries. Integration testing with a real Resend account is intentionally separate.

## Example workflow

```json
{"tool":"resend.email.send","input":{"from":"Product <noreply@example.com>","to":["user@example.net"],"subject":"Welcome","text":"Welcome!","approved":true}}
```

Expected output is the provider response (normally containing the created email identifier). Sending requires explicit approval.

```json
{"tool":"resend.email.get","input":{"id":"email-id"}}
```

This is READ and requires no approval.

## Limitations

This connector intentionally does not expose broadcasts, audience deletion, domain mutation, webhook mutation, arbitrary API calls, or inbound-email automation. OAuth is not used by these API-key endpoints. Provider features and limits can change; verify the linked official documentation before expanding scopes or adding tools.
