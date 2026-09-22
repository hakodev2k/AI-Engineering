# Fastmail MCP/API Connector

Reusable MCP stdio server for high-value Fastmail mail workflows using Fastmail's official JMAP service.

## Official transport and sources

Fastmail's official developer documentation is https://www.fastmail.com/dev/. Fastmail documents JMAP as its modern HTTP/JSON API for mail, with the session resource at `https://api.fastmail.com/jmap/session`. Mail uses RFC 8621 methods; authentication is Bearer token for personal/test integrations or OAuth 2.0 Authorization Code for distributed applications. The connector does not depend on an unofficial MCP server: its external interface is MCP while its provider transport is direct official JMAP.

Fastmail documents OAuth scopes `urn:ietf:params:jmap:core` (required for JMAP), `urn:ietf:params:jmap:mail` (Mailbox, Thread, Email and SearchSnippet), and `urn:ietf:params:jmap:submission` (Identity and EmailSubmission). This connector needs core+mail for read/manage mail; sending additionally needs submission. OAuth client registration with Fastmail is manual, so this package accepts a pre-provisioned bearer token and keeps OAuth acquisition outside the LLM/tool boundary.

## Capabilities

Implemented tools: `fastmail.session.get`, `fastmail.mailbox.list`, `fastmail.email.search`, `fastmail.email.get`, `fastmail.email.create_draft`, `fastmail.email.mark_read`, `fastmail.email.move`, `fastmail.email.send`, and `fastmail.email.delete`. These map to JMAP Session, Mailbox/get, Email/query, Email/get, Email/set and EmailSubmission/set. Calendar is not claimed: Fastmail documents CalDAV today and says JMAP calendar access will follow specification finalization. Contacts, Masked Email, vacation response, files and arbitrary JMAP calls are intentionally not exposed.

## Architecture

MCP client -> strict Zod schema -> approval policy -> FastmailClient -> official JMAP. `src/auth.ts` alone reads the bearer token. The token is never accepted as a tool argument or returned to the agent. Provider responses are marked `untrustedData`.

## Configuration

Node.js 20+. Copy `.env.example` into your secret-management configuration. `FASTMAIL_API_TOKEN` is required. `FASTMAIL_SESSION_URL` defaults to the official HTTPS session endpoint. `FASTMAIL_ALLOW_WRITES=true` is an administrator opt-in for mutations. Sending also needs `FASTMAIL_ALLOW_EXTERNAL_SEND=true`; permanent deletion additionally needs `FASTMAIL_ALLOW_DESTRUCTIVE=true`. These process-level controls cannot be changed by tool calls.

## Install and run

```bash
npm install
npm run build
FASTMAIL_API_TOKEN=... npm start
```

Any MCP client supporting standard local stdio transport can launch `node dist/server.js`. Client-specific configuration is outside this provider connector.

## Permissions and approval

Session, mailbox listing, search and get are READ. Draft creation, read/unread changes and moves are WRITE and require both administrator write enablement and per-call `approved:true`. Sending mail is HIGH_RISK because it communicates externally and requires the dedicated send opt-in plus explicit approval. Permanent Email/set destruction is DESTRUCTIVE, disabled by default, and requires destructive opt-in plus explicit approval. The design supports read -> recommend -> prepare draft -> review -> execute rather than silent external action.

## Reliability, pagination, limits, and errors

Requests use AbortController timeouts. Session/read requests retry bounded transient network errors, HTTP 429 and selected 5xx responses with exponential backoff and `Retry-After`; mutation/submission requests are never blindly retried. Email search exposes bounded JMAP `position`/`limit` pagination. JMAP session metadata advertises server limits such as request size, calls per request and objects per get/set; callers should treat those advertised values as authoritative. Provider errors are mapped to concise MCP failures without credentials.

## Security

Credentials remain in the connector authentication layer. Do not put API tokens in prompts, logs, examples, or tool inputs. Keep the session endpoint administrator-controlled to prevent SSRF. Treat email subjects, bodies, addresses and all JMAP responses as untrusted content; retrieved mail cannot alter permissions or approval state. Strict schemas reject unexpected parameters. Least-privilege tokens/scopes should be used. OAuth deployments should implement state and PKCE in their credential broker and pass only the resulting token to this connector. Do not auto-enable newly discovered JMAP capabilities.

## Testing

`npm test` uses mocked fetch and no live account. Tests cover tool registration, schema validation, credential isolation, write/send/delete approval, authentication failures, rate-limit retry, and non-retry of mutations.

## Limitations

This package implements a deliberately narrow mail subset. It does not implement OAuth browser callbacks/token refresh, because Fastmail application registration is external and tokens must remain outside the agent surface. It does not expose arbitrary JMAP calls, IMAP/SMTP, CalDAV, CardDAV, WebDAV, contacts, Masked Email, vacation response, webhook/event processing, or account administration. JMAP event-source support is not needed for the implemented request/response tools.