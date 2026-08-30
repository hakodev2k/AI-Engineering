# Brevo MCP/API Connector

Reusable, security-bounded MCP connector for Brevo contacts, email campaigns, transactional email, and webhooks.

## Upstream strategy
Brevo provides an official remote MCP server at `https://mcp.brevo.com/v1/brevo/mcp`. In March 2026 Brevo moved MCP authentication to `Authorization: Bearer <token>` and documented that its MCP tools are auto-generated from the OpenAPI specification. Brevo also publishes a v3 REST API at `https://api.brevo.com/v3/` with API-key and OAuth 2.0 authentication.

This connector deliberately uses the official REST API behind a smaller MCP facade. The reason is security and contract stability: only 14 reviewed operations are exposed, every mutation has a local approval boundary, destructive behavior is disabled by default, and the LLM never receives the Brevo API key. It does not dynamically trust or expose Brevo's much larger upstream MCP tool inventory.

Official sources researched on 2026-08-30:
- MCP: https://developers.brevo.com/docs/mcp-protocol
- MCP security update: https://developers.brevo.com/changelog/2026/3/2
- API overview: https://developers.brevo.com/docs/getting-started
- API key auth: https://developers.brevo.com/docs/api-key-authentication
- OAuth 2.0: https://developers.brevo.com/docs/oauth
- Rate limits: https://developers.brevo.com/docs/api-limits
- Contacts: https://developers.brevo.com/reference/get-contacts and https://developers.brevo.com/reference/create-contact
- Campaigns: https://developers.brevo.com/reference/get-email-campaigns and https://developers.brevo.com/reference/send-email-campaign-now
- Transactional email: https://developers.brevo.com/reference/send-transac-email
- Webhooks: https://developers.brevo.com/docs/how-to-use-webhooks

## Authentication and permissions
Set `BREVO_API_KEY`; it is sent only by the connector in Brevo's documented `api-key` header. API keys are appropriate for direct/server-to-server integrations. Brevo OAuth 2.0 is supported by Brevo for delegated user access, but is intentionally not implemented in this package because this reusable server is designed for non-interactive service credentials.

Brevo API keys identify the account rather than carrying fine-grained OAuth scopes. Apply least privilege operationally by using a dedicated Brevo account/integration identity where your Brevo plan supports it, protect the key in a secret manager, and optionally apply Brevo IP security controls. The key is never a tool argument.

## Tools
| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `brevo.account.get` | REST | READ | no |
| `brevo.contact.list` | REST | READ | no |
| `brevo.contact.get` | REST | READ | no |
| `brevo.contact.create` | REST | WRITE | yes |
| `brevo.contact.update` | REST | WRITE | yes |
| `brevo.contact_list.list` | REST | READ | no |
| `brevo.campaign.list` | REST | READ | no |
| `brevo.campaign.get` | REST | READ | no |
| `brevo.campaign.create` | REST | WRITE | yes |
| `brevo.campaign.send` | REST | HIGH_RISK | yes |
| `brevo.transactional_email.send` | REST | HIGH_RISK | yes |
| `brevo.webhook.list` | REST | READ | no |
| `brevo.webhook.create` | REST | HIGH_RISK | yes |
| `brevo.webhook.delete` | REST | DESTRUCTIVE | yes + disabled by default |

Not exposed: arbitrary API requests, contact deletion, contact force-merge, campaign deletion, SMS/WhatsApp sends, billing, account administration, or API-key management.

## Safety model
READ tools may execute automatically. WRITE/HIGH_RISK/DESTRUCTIVE tools require a payload-bound HMAC approval token generated outside the LLM using `BREVO_APPROVAL_SECRET`. Changing any approved payload field invalidates the token. `brevo.webhook.delete` additionally requires `BREVO_ENABLE_DESTRUCTIVE=true`, which cannot be toggled through MCP.

Campaign send and transactional email send are HIGH_RISK because they communicate externally. Webhook creation is HIGH_RISK because it causes Brevo to send data to an external endpoint. Webhook URLs must use HTTPS, may not contain embedded credentials, and reject obvious local hosts. Contact force-merge is not exposed because Brevo documents that it can merge identifiers and delete the losing contact. Updating the `EMAIL` attribute is also not exposed because Brevo documents that changing a blocklisted contact's email can remove blocklisting and resubscribe the contact.

Provider responses are returned with `untrusted_provider_data: true` and secret-shaped fields are redacted. Retrieved contact/campaign content must be treated as data, not instructions.

## Rate limits and reliability
Brevo documents tiered rate limits. General limits include up to 10 RPS / 36,000 RPH for contacts, 1,000 RPS / 3,600,000 RPH for transactional `POST /v3/smtp/email`, and lower general limits for many other endpoints. The connector does not assume a subscription tier. It reacts to HTTP 429, honors integer `Retry-After`, preserves known rate-limit headers, and uses bounded exponential backoff for safe reads only. Writes/sends/deletes are never blindly retried.

Requests have a configurable timeout and honor MCP cancellation when available. Pagination is bounded by the provider's documented endpoint maxima.

## Environment
```text
BREVO_API_KEY=
BREVO_API_URL=https://api.brevo.com
BREVO_TIMEOUT_MS=15000
BREVO_MAX_RETRIES=3
BREVO_APPROVAL_SECRET=
BREVO_ENABLE_DESTRUCTIVE=false
```
`BREVO_API_URL` must be HTTPS and may not contain credentials, query parameters, or fragments.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run check
npm test
npm start
```
The server uses MCP stdio transport and can be configured by MCP clients that support local stdio servers. Compatibility depends on the client's ability to launch a standard stdio MCP server; no client-specific proprietary protocol is required.

## Architecture
```text
MCP client
  -> stdio MCP server
     -> strict provider-scoped schemas
        -> risk/approval policy
           -> credential-isolated Brevo REST client
              -> https://api.brevo.com/v3/
```

## Webhooks
Brevo supports marketing and transactional webhook events and recommends webhooks instead of polling for statistics. Brevo documents an account limit of 40 marketing + transactional webhooks. This connector manages webhook registrations only; validating inbound webhook authenticity and operating the receiving HTTP service remain responsibilities of the consuming application.

## Testing
Unit tests require no live credentials. They cover configuration, registry/policy consistency, payload-bound approvals, destructive denial, response sanitization, authentication headers, 429 retry behavior, non-retry of auth failures, and non-retry of mutations.

## Limitations
- OAuth 2.0 user-consent flow is not implemented; use a service-side API key.
- The official Brevo MCP server is documented but not proxied, to avoid dynamic exposure of its broad auto-generated tool inventory.
- This connector does not ingest webhook events; it only lists/creates/deletes registrations.
- It intentionally omits destructive contact/campaign operations and force-merge behavior.
