# Mailchimp MCP/API Connector

Reusable MCP server that exposes a scoped set of Mailchimp Marketing API operations for AI agents and MCP clients while keeping Mailchimp credentials inside the connector boundary.

## Upstream transport

This implementation uses the official Mailchimp Marketing API v3.0 over HTTPS. During implementation, no official Mailchimp MCP server was identified in Mailchimp's official developer documentation, so there is no upstream MCP dependency and no unofficial MCP server is trusted implicitly.

Official sources used for the implementation:

- Marketing API overview: https://mailchimp.com/developer/marketing/
- Marketing API documentation: https://mailchimp.com/developer/marketing/docs/
- Marketing API reference: https://mailchimp.com/developer/marketing/api/
- Quick start and API-key authentication: https://mailchimp.com/developer/marketing/guides/quick-start/
- OAuth 2 authorization-code flow: https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/
- Audiences and contacts: https://mailchimp.com/developer/marketing/guides/create-your-first-audience/
- Contact tags: https://mailchimp.com/developer/marketing/guides/organize-contacts-with-tags/
- Errors and throttling: https://mailchimp.com/developer/marketing/docs/errors/
- Batch and concurrency guidance: https://mailchimp.com/developer/marketing/guides/run-async-requests-batch-endpoint/

The API reference observed during this implementation reports Marketing API `3.0.91`; the REST base path remains `/3.0`.

## Capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---:|---:|
| `mailchimp.account.get` | `GET /` | READ | No |
| `mailchimp.audience.list` | `GET /lists` | READ | No |
| `mailchimp.audience.get` | `GET /lists/{list_id}` | READ | No |
| `mailchimp.member.list` | `GET /lists/{list_id}/members` | READ | No |
| `mailchimp.member.get` | `GET /lists/{list_id}/members/{subscriber_hash}` | READ | No |
| `mailchimp.member.upsert` | `PUT /lists/{list_id}/members/{subscriber_hash}` | WRITE | Yes |
| `mailchimp.member.archive` | `DELETE /lists/{list_id}/members/{subscriber_hash}` | DESTRUCTIVE | Yes |
| `mailchimp.member.tags.update` | `POST /lists/{list_id}/members/{subscriber_hash}/tags` | WRITE | Yes |
| `mailchimp.campaign.list` | `GET /campaigns` | READ | No |
| `mailchimp.campaign.get` | `GET /campaigns/{campaign_id}` | READ | No |
| `mailchimp.campaign.create` | `POST /campaigns` | WRITE | Yes |
| `mailchimp.campaign.update` | `PATCH /campaigns/{campaign_id}` | WRITE | Yes |
| `mailchimp.campaign.content.update` | `PUT /campaigns/{campaign_id}/content` | WRITE | Yes |
| `mailchimp.campaign.send` | `POST /campaigns/{campaign_id}/actions/send` | HIGH_RISK | Yes |
| `mailchimp.report.get` | `GET /reports/{campaign_id}` | READ | No |

The connector deliberately does not expose a generic arbitrary-request tool. Campaign deletion, permanent contact deletion, billing changes, account administration, and other unnecessary destructive/admin endpoints are not implemented.

## Architecture

```text
MCP client / agent
       |
       v
Mailchimp MCP server (stdio)
       |
       +-- strict Zod schemas
       +-- local risk/approval policy
       +-- local MD5 subscriber hashing
       +-- bounded REST client / timeout / error mapping
       |
       v
credential configuration
       |
       v
Mailchimp Marketing API
```

Provider response content is wrapped as `untrustedProviderData: true`. Retrieved Mailchimp data must never be interpreted as system instructions or as permission to invoke additional tools.

## Authentication

Two server-side credential modes are supported. Configure exactly one:

1. `MAILCHIMP_API_KEY` for a connector dedicated to your own Mailchimp account.
2. `MAILCHIMP_OAUTH_ACCESS_TOKEN` for an access token obtained through Mailchimp's OAuth 2 authorization-code flow.

`MAILCHIMP_SERVER_PREFIX` is always required, for example `us1` or `us20`. Mailchimp's OAuth guide documents obtaining this value from the OAuth Metadata endpoint after exchanging the authorization code. This connector intentionally does not perform an interactive OAuth authorization flow; production integrations should perform that flow in a trusted application component and inject the resulting access token and server prefix into the connector's secret environment.

Mailchimp's official quick-start documentation warns that an API key provides full account access. Mailchimp recommends OAuth 2 when accessing accounts on behalf of other users. No granular OAuth scopes are configured by this connector because Mailchimp's documented Marketing OAuth flow does not expose a conventional per-scope request surface in the referenced guide; authorization is constrained further locally through the connector's tool allowlist and approval policy.

Mailchimp's OAuth guide states that Marketing access tokens do not expire unless access is revoked, so this connector does not implement refresh-token handling.

## Environment variables

Copy `.env.example` into your secret-management workflow. Do not commit a populated `.env` file.

```text
MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_OAUTH_ACCESS_TOKEN=
MAILCHIMP_APPROVAL_SECRET=
MAILCHIMP_TIMEOUT_MS=20000
MAILCHIMP_MAX_RETRIES=2
```

`MAILCHIMP_APPROVAL_SECRET` must be at least 24 characters and must remain outside the model context. It is needed only for tools requiring approval.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

## Run the MCP server

```bash
npm start
```

The server uses MCP stdio transport, so MCP clients that support launching local stdio servers can invoke it as a subprocess. A typical client configuration should point its command at `node` and argument at the built `dist/src/server.js`, while supplying credentials through the client's secure environment configuration.

## Permission and approval model

`READ` operations may run without approval. `WRITE` operations require an approval token. `HIGH_RISK` operations require explicit approval; currently this includes sending a campaign because it sends external email. `DESTRUCTIVE` operations require explicit approval; currently this includes archiving a member.

Approval tokens are HMAC-SHA256 values bound to the exact tool name and canonicalized arguments. A token for one action cannot be reused after changing the audience, recipient, campaign, content, or other arguments. A trusted human-approval layer should generate the token by calling `createApprovalToken()` from `src/security.ts` only after the final arguments have been reviewed.

The model must never receive `MAILCHIMP_APPROVAL_SECRET`. Possession of an old approval token does not grant permission for modified arguments.

## Contact privacy

Mailchimp identifies existing audience contacts using the MD5 hash of the lowercase email address. `member.get`, `member.archive`, and tag operations calculate that subscriber hash locally before building the request URL. Upsert still includes the email address in the request body because the Mailchimp PUT member endpoint needs it for creation/update semantics.

## Reliability and rate limiting

Mailchimp's official error documentation describes a limit of 10 simultaneously processing Marketing API requests per user. The batch guide also notes that Marketing API requests can time out at 120 seconds. This connector therefore:

- applies a configurable client-side timeout with a maximum of 120 seconds;
- parses integer `Retry-After` values when Mailchimp returns them;
- retries only `GET` requests on HTTP `429` and `5xx` responses;
- uses bounded exponential backoff when no `Retry-After` is present;
- never blindly retries POST/PATCH/PUT/DELETE writes, preventing accidental duplicate or destructive mutations;
- exposes `count` and `offset` on list operations and caps `count` at 1000 to avoid uncontrolled result expansion.

For very high-volume sync operations, use Mailchimp's official Batch endpoint outside this connector or add a separately reviewed batch capability rather than increasing connector concurrency.

## Error handling

Provider errors are mapped into structured MCP error output containing HTTP status, message, optional `retryAfterSeconds`, and the provider error body. Authentication and authorization errors are returned directly and are not retried. Validation failures and approval failures occur before the provider call.

## Security considerations

- Credentials are read only by the connector process and are never accepted as MCP tool arguments.
- `MAILCHIMP_SERVER_PREFIX` must match `us` plus digits; callers cannot supply arbitrary hosts, preventing URL-based SSRF through the provider base URL.
- Resource identifiers are URI encoded.
- Tool schemas constrain email addresses, IDs, content size, pagination size, member status, campaign type, and tag operations.
- Provider content is returned as untrusted data.
- There is no generic `request(url, body)` capability.
- Sending email requires explicit, argument-bound approval.
- Archiving a contact requires explicit, argument-bound destructive approval.
- Permanent contact deletion is intentionally not implemented.
- Logs should not include environment variables, authorization headers, or approval secrets. The connector itself does not log these values.
- Mailchimp data can contain attacker-controlled text. MCP clients must not allow that text to alter tool policy, reveal secrets, or trigger unapproved actions.

## Testing

Unit tests require no Mailchimp credentials and use mocked `fetch` responses.

```bash
npm test
```

Coverage includes configuration validation, API-key and OAuth configuration, subscriber hashing, argument-bound approvals, risk classification, auth-header isolation, read retries for throttling, non-retry of writes, and authentication-error behavior.

## Example workflows

### CRM sync

1. `mailchimp.audience.list`
2. `mailchimp.member.get`
3. Human/review layer approves final mutation.
4. `mailchimp.member.upsert`
5. `mailchimp.member.tags.update`

### Campaign preparation and send

1. `mailchimp.campaign.create`
2. `mailchimp.campaign.content.update`
3. `mailchimp.campaign.get`
4. Human reviews final campaign/audience/content in Mailchimp or trusted UI.
5. `mailchimp.campaign.send`
6. `mailchimp.report.get`

See `examples/usage.md` for concrete MCP inputs.

## Limitations

- The connector implements a focused Marketing API surface, not every Mailchimp endpoint.
- It does not expose Mailchimp Transactional, SMS, Open Commerce, Customer Journey administration, batch jobs, webhooks, account administration, or billing operations.
- It does not host an OAuth redirect callback or store OAuth tokens; a trusted external credential component must do that for multi-user deployments.
- It does not schedule campaigns. Immediate send is supported only with explicit approval.
- It does not permanently delete contacts.
- Mailchimp plan/role restrictions can cause otherwise valid API operations to return authorization errors.
