# Mailchimp MCP/API Connector

Reusable MCP server for safe Mailchimp Marketing workflows. It exposes scoped tools rather than an arbitrary HTTP proxy.

## Upstream strategy

Mailchimp provides an official remote MCP at `https://mandrillapp.com/mcp` for **Transactional Messaging**. Mailchimp documents that it mirrors Transactional Messaging API functionality and authenticates with a Transactional API key. This connector intentionally uses the official **Marketing API v3.0** directly for audience/contact/campaign/report operations because those are Marketing capabilities and are not represented as a constrained Marketing MCP contract. The official Transactional MCP can be configured separately when transactional sending is required.

Official references: Mailchimp Developer Marketing API fundamentals, API reference, authentication/errors/methods documentation, and Mailchimp's Transactional Messaging MCP guide.

## Capabilities

12 tools are implemented: `mailchimp.account.get`, `mailchimp.audience.list`, `mailchimp.audience.get`, `mailchimp.contact.list`, `mailchimp.contact.get`, `mailchimp.contact.upsert`, `mailchimp.contact.update`, `mailchimp.contact.tags.list`, `mailchimp.contact.tags.update`, `mailchimp.contact.event.create`, `mailchimp.campaign.list`, `mailchimp.campaign.get`, and `mailchimp.report.get`.

All provider-returned text is treated as untrusted data. No retrieved content can alter permissions or connector configuration.

## Authentication

Set `MAILCHIMP_API_TOKEN` and `MAILCHIMP_SERVER_PREFIX` (for example `us21`). The Marketing API accepts API keys or OAuth 2 tokens; OAuth 2 is recommended for integrations serving multiple Mailchimp users. Tokens stay in the connector and are never tool parameters. API access is constrained by the authorizing Mailchimp user's role.

## Install and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# export values using your secret manager or shell
npm start
```

The server uses MCP stdio and can therefore be launched by MCP clients that support stdio child-process servers. Client-specific configuration varies; do not expose credentials in prompts.

## Permission and approval model

READ tools execute automatically. WRITE tools require `approved: true` by default (`MAILCHIMP_APPROVAL_MODE=write`). HIGH_RISK would always require explicit approval. DESTRUCTIVE operations are disabled by policy and are not registered. In particular, archive/permanent-delete, campaign send, and public/external message execution are intentionally absent.

The connector distinguishes preparation/inspection from execution and cannot elevate its own permission policy.

## Reliability and limits

Marketing API limits each user to 10 simultaneous connections and returns HTTP 429 when exceeded. The client preserves `Retry-After`, retries only 429 and 5xx responses, uses exponential bounded backoff, and makes at most three attempts. Authentication/authorization/validation errors are not retried. Requests have a configurable local timeout; Mailchimp documents a 120-second server-side API timeout. List tools use `count`/`offset` pagination and enforce Mailchimp's documented maximum count of 1000.

## Errors

Provider errors are mapped to MCP error results with a sanitized message, HTTP status, and `retryAfter` value when present. Tokens are never logged or returned. Zod validates all inputs; IDs are URL-encoded and the base host is constructed only from the validated server prefix, preventing caller-controlled arbitrary URLs/SSRF.

## Security

Use least-privilege Mailchimp users/keys. Keep credentials in a secret manager. Marketing content is untrusted data and must never be interpreted as agent instructions. The connector has no generic `call_api` tool, no arbitrary URL tool, and no destructive operation. For OAuth applications, implement the authorization flow outside this stdio process using secure state/PKCE where supported by the integration architecture and inject only the resulting server-side token.

The official Transactional MCP should likewise be configured with restricted API-key permissions including only the required AI Agents/API permissions; do not automatically trust newly discovered upstream tools.

## Testing

```bash
npm test
```

Unit tests require no live credentials and cover auth configuration, tool registration, read behavior, write approval denial, and bounded 429 retry behavior.

## Limitations

This connector does not send campaigns or transactional messages, permanently delete contacts, manage billing, or expose arbitrary API calls. Webhook registration is not implemented because endpoint ownership and signature-validation lifecycle belong to the hosting application. OAuth browser callback/token storage is also host responsibility; this reusable connector consumes an already-secured token.
