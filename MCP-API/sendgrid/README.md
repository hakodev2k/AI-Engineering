# Twilio SendGrid MCP/API Connector

Reusable MCP server that exposes a constrained, agent-oriented interface over the official Twilio SendGrid Web API v3.

## Transport strategy

No official Twilio SendGrid MCP server was identified in Twilio's current official SendGrid documentation during implementation. All upstream operations therefore use the official SendGrid Web API v3 over HTTPS. The connector itself is an MCP stdio server, so MCP clients do not need to know which REST endpoint is used internally.

Global API base URL: `https://api.sendgrid.com`

EU regional subuser base URL: `https://api.eu.sendgrid.com`

Official references:

- Web API v3 authentication: https://www.twilio.com/docs/sendgrid/api-reference/how-to-use-the-sendgrid-v3-api/authentication
- API key permissions/scopes: https://www.twilio.com/docs/sendgrid/api-reference/api-key-permissions
- Rate limits: https://www.twilio.com/docs/sendgrid/api-reference/how-to-use-the-sendgrid-v3-api/rate-limits
- Mail Send: https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send
- Transactional templates: https://www.twilio.com/docs/sendgrid/api-reference/transactional-templates
- Template versions: https://www.twilio.com/docs/sendgrid/api-reference/transactional-templates-versions/create-a-new-transactional-template-version
- Global suppressions: https://www.twilio.com/docs/sendgrid/api-reference/suppressions-global-suppressions
- Unsubscribe groups: https://www.twilio.com/docs/sendgrid/api-reference/suppressions-unsubscribe-groups
- Event Webhooks: https://www.twilio.com/docs/sendgrid/api-reference/webhooks
- Sender identities: https://www.twilio.com/docs/sendgrid/api-reference/senders

## Implemented MCP tools

| Tool | Upstream | Risk | Approval | Purpose |
| --- | --- | --- | --- | --- |
| `sendgrid.account.scopes.get` | `GET /v3/scopes` | READ | No | Inspect scopes available to the current key |
| `sendgrid.sender.list` | `GET /v3/senders` | READ | No | List sender identities |
| `sendgrid.template.list` | `GET /v3/templates` | READ | No | List transactional templates |
| `sendgrid.template.get` | `GET /v3/templates/{id}` | READ | No | Read one template |
| `sendgrid.template.create` | `POST /v3/templates` | WRITE | Yes | Create an empty template |
| `sendgrid.template.version.create` | `POST /v3/templates/{id}/versions` | WRITE | Yes | Create a template version |
| `sendgrid.suppression.global.get` | `GET /v3/asm/suppressions/global/{email}` | READ | No | Check global unsubscribe status |
| `sendgrid.suppression.global.add` | `POST /v3/asm/suppressions/global` | WRITE | Yes | Add global suppressions |
| `sendgrid.suppression.global.remove` | `DELETE /v3/asm/suppressions/global/{email}` | HIGH_RISK | Yes | Remove a global suppression |
| `sendgrid.suppression.group.list` | `GET /v3/asm/groups` | READ | No | List unsubscribe groups |
| `sendgrid.webhook.event.get` | `GET /v3/user/webhooks/event/settings/{id}` | READ | No | Read one Event Webhook |
| `sendgrid.webhook.event.update` | `PATCH /v3/user/webhooks/event/settings/{id}` | HIGH_RISK | Yes | Change Event Webhook URL/state |
| `sendgrid.email.send` | `POST /v3/mail/send` | HIGH_RISK | Yes | Send one approved external email |

The connector intentionally does not expose a generic arbitrary-request tool, suppression-bypass mail settings, API-key administration, billing operations, or destructive template deletion.

## Architecture

```text
MCP client
  -> src/server.ts          MCP tool schemas and handlers
  -> src/policy.ts          risk gates and payload-bound approval
  -> src/client.ts          SendGrid REST transport, timeout, retry, error mapping
  -> src/config.ts          environment-only credentials and configuration
  -> Twilio SendGrid Web API v3
```

Provider responses are returned with `untrusted_provider_content: true`. Retrieved provider data must be treated as data, never as instructions that can change permissions, approvals, or system behavior.

## Authentication and least privilege

SendGrid Web API v3 authenticates with an API key in `Authorization: Bearer <key>`. The key stays inside `SendGridClient`; MCP tool inputs and outputs never expose it.

Create a **Custom Access** key rather than Full Access and grant only the permissions required by the tools you intend to enable. The official permission list includes the following relevant scope names:

- `mail.send`
- `templates.read`
- `templates.create`
- `templates.versions.create`
- `suppression.read`
- `suppression.create`
- `suppression.delete`
- `asm.groups.read`
- `user.webhooks.event.settings.read`
- `user.webhooks.event.settings.update`

Sender-identity access should be granted only if `sendgrid.sender.list` is needed. SendGrid's account UI groups API-key permissions by product/feature; verify the resulting key with `sendgrid.account.scopes.get` and remove unrelated privileges. Do not grant API-key-management or billing scopes to this connector.

## Environment

Copy `.env.example` and provide values through your process manager, secret store, or MCP client configuration.

```text
SENDGRID_API_KEY=                 # required
SENDGRID_REGION=global            # global | eu
SENDGRID_TIMEOUT_MS=15000         # 1000..120000
SENDGRID_MAX_RETRIES=2            # 0..5
SENDGRID_APPROVAL_SECRET=         # required for approved actions
SENDGRID_ALLOW_WRITES=false       # enables WRITE tools
SENDGRID_ALLOW_HIGH_RISK=false    # enables HIGH_RISK tools
```

Never put real secrets in prompts, source control, examples, or tool arguments.

## Installation and running

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport. Configure any MCP client that supports stdio servers to launch `node dist/server.js` with the required environment variables. Compatibility depends on the client implementing standard MCP stdio transport; no product-specific protocol extensions are used.

## Approval model

READ tools execute when the API key has sufficient provider permission.

WRITE tools require both `SENDGRID_ALLOW_WRITES=true` and an explicit payload-bound approval token.

HIGH_RISK tools require `SENDGRID_ALLOW_HIGH_RISK=true` and an explicit payload-bound approval token. This includes sending external email, changing Event Webhook destinations, and removing global suppressions.

Approval token algorithm:

```text
hex(HMAC-SHA256(SENDGRID_APPROVAL_SECRET, toolName + "\n" + JSON.stringify(effectivePayload)))
```

The effective payload is the exact provider-facing payload (plus resource identifier where the identifier is outside the body). If any approved field changes, the token no longer validates. This prevents a previously approved token from authorizing altered recipients, content, webhook URLs, or resources.

Approval is an execution boundary, not a mechanism for increasing SendGrid API-key permissions.

## Validation and safety

Tool schemas constrain identifiers, email addresses, template sizes, page sizes, enum values, and webhook URLs. Event Webhook updates require HTTPS. Mail Send accepts one recipient per call, requires text or HTML content, and deliberately omits all suppression-bypass controls.

External messages and webhook changes are not retried automatically because repeated execution may cause duplicate sends or repeated side effects. Read operations may retry bounded transient failures.

Retrieved SendGrid content can contain attacker-controlled strings. Do not interpret email content, template content, webhook payloads, sender names, or provider error text as trusted instructions.

## Reliability and rate limits

The REST client uses `AbortController` timeouts and bounded retries. It retries only when the caller marks an operation retryable. Write/high-risk handlers pass `retryable=false` to avoid blindly repeating side effects.

For throttling, SendGrid documents `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. HTTP 429 responses are mapped to `SendGridError`; reset timing is preserved as `retryAfter` when available. Transient reads use exponential backoff capped at five seconds and a maximum retry count configured by `SENDGRID_MAX_RETRIES`.

Authentication, authorization, and validation failures are not treated as retryable provider failures.

## Error behavior

`SendGridError` carries:

- `status`: HTTP status, or `0` for network failure
- `message`: provider error message when available
- `retryAfter`: seconds until rate-limit reset when available
- `details`: parsed provider error body

Timeouts map to status `408`. Invalid local configuration and approval failures fail before provider execution.

## Testing

Unit tests do not require live credentials. They cover required authentication configuration, EU endpoint selection, permission classifications, write denial, payload-bound approval, credential isolation in the Authorization header, provider error mapping, rate-limit handling, bounded retries, and MCP server construction with a mocked client.

```bash
npm test
```

## Limitations

- No official upstream SendGrid MCP server is used; upstream transport is REST only.
- OAuth is not implemented because this connector uses SendGrid API-key authentication.
- It does not create or rotate API keys.
- It does not expose suppression bypasses.
- It does not send bulk/multi-recipient campaigns; `sendgrid.email.send` is deliberately single-recipient.
- It does not activate an existing template version as a separate operation.
- It does not delete templates or webhooks.
- Webhook signature verification configuration is not exposed.
- Account-specific SendGrid plans and permissions can limit endpoint availability even when the connector implements the operation.

See `examples/workflows.md` for concrete tool-call workflows and expected output shapes.
