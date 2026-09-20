# Mailgun MCP/API Connector

Reusable MCP stdio server for constrained Mailgun workflows.

## Official transports and sources
Mailgun provides an official, local open-source MCP server. In August 2026 Mailgun also announced its MCP server in Cursor with 15 Skills covering Send, Validate, Optimize and Inspect. This connector intentionally uses Mailgun's official REST API as its upstream transport so its exposed tools, schemas, permissions and approval boundary remain fixed and auditable instead of dynamically trusting upstream-discovered tools.

Official references: https://documentation.mailgun.com/docs/mailgun/api-reference/api-overview ; https://www.mailgun.com/integrations/mcp-server/ ; https://www.mailgun.com/releases/mailgun-now-in-cursor-and-claude/

## Capabilities
Ten implemented MCP tools: `mailgun.domain.list`, `mailgun.domain.get`, `mailgun.event.list`, `mailgun.stats.get`, `mailgun.suppression.bounce.list`, `mailgun.suppression.complaint.list`, `mailgun.mailing_list.list`, `mailgun.template.list`, `mailgun.template.get`, and `mailgun.email.send`. No delete, domain mutation, API-key administration, route mutation, mailing-list mutation, or arbitrary HTTP tool is exposed.

## Architecture
MCP client -> stdio server -> strict Zod input -> permission/approval policy -> REST client -> Mailgun. Provider content is returned as `untrustedProviderData`; it is data, never instructions. API credentials remain in the auth layer and are never MCP parameters.

## Authentication and scopes
Set `MAILGUN_API_KEY`. Mailgun API authentication uses HTTP Basic authentication with username `api` and the API key as password. Mailgun API keys are not OAuth scopes; use a domain sending key where it satisfies the intended operation, otherwise a primary/account key may be required by the specific endpoint. Never broaden key privileges silently. Rotate/revoke keys through Mailgun rather than through this connector.

## Regions
`MAILGUN_REGION=us` uses `https://api.mailgun.net`; `eu` uses `https://api.eu.mailgun.net`. Only those two origins are allowed, preventing arbitrary-host SSRF. Mailgun documents message/event/suppression data as region-bound.

## Installation and running
Requires Node.js 20+.

    npm install
    npm run build
    npm start

The MCP transport is stdio. It can be launched by MCP clients supporting stdio child-process servers; no unsupported client-specific compatibility is claimed.

## Permissions and approval
All domain, event, statistics, suppression, list and template operations are READ and may execute automatically. `mailgun.email.send` is WRITE because it sends an external message; it requires `approved:true` and `MAILGUN_WRITE_APPROVAL=required` by default. The send request is never automatically retried, avoiding duplicate email. DESTRUCTIVE actions are disabled/not exposed.

## Rate limits, retries, pagination and timeout
Mailgun documents `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`; API windows vary by API. Current Mailgun Metrics documentation states 500 requests per 10 seconds for that API family. The client recognizes 429 and transient 5xx for bounded read retries (configuration capped at five), uses the reset header for backoff when available, and uses exponential backoff otherwise. Authentication/validation errors and email sends are not blindly retried. List/event limits are schema-bounded to 300. Requests use AbortController timeouts.

## Error handling
HTTP provider errors map to `MailgunError` with status/message and optional reset timestamp internally. Invalid region, path, authentication configuration, schema, or approval fails before mutation. Secrets are not included in output.

## Security
Credentials are isolated from the LLM. Origins and API path prefix are constrained. Tool inputs reject unknown fields and bound identifiers/body sizes. Retrieved email/event/template content is untrusted and cannot change permissions. There is no unrestricted request tool, permission-management tool, destructive action, dynamic upstream-tool trust, or secret logging. Sending external email requires human approval.

## Testing
Run `npm test`. Unit tests require no live credentials and cover auth configuration, registration, strict validation, approval denial, region/origin policy, provider errors, rate-limit retry behavior, and prevention of blind write retries.

## Limitations
The official Mailgun MCP server is researched but not proxied by this package. This connector omits validation, account administration, batch sending, routes, IP management, webhook mutation, suppressions mutation and destructive operations. Webhook receiving/signature validation is not part of this outbound stdio process. Mailgun endpoint entitlements and key privileges vary by plan/key type; provider authorization remains authoritative.
