# Kit (formerly ConvertKit) MCP/API Connector

Reusable stdio MCP connector for Kit creator/email workflows. The filesystem ID remains `convertkit` to make the provider identity explicit and avoid confusion with generic software named “kit”.

## Official research and transport

Kit now provides an official hosted account MCP at `https://app.kit.com/mcp` using OAuth, plus API v4 at `https://api.kit.com/v4`. Kit documents 65+ MCP tools for subscribers, tags, segments, sequences, broadcasts, forms, landing pages, purchases, analytics, webhooks, templates and related creator workflows. Sensitive/open-world MCP actions can return a Kit deep link and execute only after in-app confirmation.

Official sources researched on 2026-09-15:

- Developer platform: https://developers.kit.com/
- MCP overview: https://developers.kit.com/mcp/overview
- Official MCP setup: https://help.kit.com/en/articles/14827557-how-to-connect-the-kit-mcp-to-your-ai-tools
- MCP tool catalogue: https://help.kit.com/en/articles/15072804-kit-mcp-tools
- API v4 authentication: https://developers.kit.com/api-reference/authentication
- API v4 reference: https://developers.kit.com/api-reference

For an interactive user session, **use Kit's official MCP directly**: it is the preferred transport and provides Kit's own OAuth and confirmation UX. This package is the reusable/headless fallback: it exposes a deliberately smaller, deterministic MCP surface backed by official API v4, suitable when an embedding agent needs process-local credentials, stable schemas and connector-side approval policy. It does not proxy the 65+ upstream MCP tools because doing so would broaden permissions and make a non-interactive service depend on user-browser OAuth.

## Authentication

Kit API v4 supports API keys for personal account automation and OAuth 2.0 Authorization Code for apps. OAuth supports refresh-token server flows and PKCE for SPA/mobile clients. Public/App Store integrations should use OAuth; API keys are intended for automation of your own account.

Set exactly the credential available to the deployment:

- `KIT_API_KEY` -> sent only as `X-Kit-Api-Key`.
- `KIT_OAUTH_ACCESS_TOKEN` -> sent only as `Authorization: Bearer` and takes precedence when both are present.

The model never receives credentials as tool parameters or output. OAuth authorization, refresh-token storage and rotation belong in the host credential service; inject only the current access token.

Kit documents a rolling limit of 120 requests/60 seconds for API keys and 600 requests/60 seconds for OAuth. Some endpoints, including bulk operations, require OAuth; this connector intentionally avoids those endpoints.

## Tools

| Tool | Risk | Approval |
|---|---|---|
| `convertkit.subscriber.list` | READ | no |
| `convertkit.subscriber.get` | READ | no |
| `convertkit.subscriber.stats` | READ | no |
| `convertkit.subscriber.create` | WRITE | yes by default |
| `convertkit.subscriber.update` | WRITE | yes by default |
| `convertkit.subscriber.unsubscribe` | DESTRUCTIVE | always + disabled by default |
| `convertkit.tag.list` | READ | no |
| `convertkit.tag.subscriber` | WRITE | yes by default |
| `convertkit.broadcast.list` | READ | no |
| `convertkit.broadcast.get` | READ | no |
| `convertkit.broadcast.stats` | READ | no |
| `convertkit.broadcast.clicks` | READ | no |
| `convertkit.sequence.list` | READ | no |

No send/schedule-broadcast tool is exposed in this headless connector. Kit's official MCP is the safer preferred path for sending because Kit can apply its own sensitive-action confirmation. No generic API request, webhook mutation, credential management, billing, account administration or bulk mutation tool is exposed.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
KIT_API_KEY=... npm start
```

The connector exposes standard MCP over stdio and works with MCP clients that can launch a local stdio server. For clients supporting remote OAuth MCP, prefer connecting them directly to `https://app.kit.com/mcp` instead of this wrapper when interactive Kit access is desired.

## Permission and approval model

READ may execute automatically. WRITE requires human approval by default. DESTRUCTIVE is disabled unless `KIT_ENABLE_DESTRUCTIVE=true` and still requires approval.

Set `KIT_APPROVAL_SECRET` only in a trusted approval service/connector environment. Approval is HMAC-SHA256 over `toolName + "\n" + canonicalJson(argumentsWithoutApprovalToken)`. This binds approval to the exact subscriber, email, fields or tag. The agent cannot change connector policy through a tool call.

`KIT_REQUIRE_WRITE_APPROVAL=false` may be used only when the embedding host already provides an equivalent trusted approval boundary. It never bypasses DESTRUCTIVE approval.

## Reliability, pagination and rate limiting

Collection tools expose Kit's cursor pagination (`after`, `before`, `per_page`) and cap pages at 500. The connector never drains an account automatically.

Safe GET operations use bounded retries for HTTP 429/5xx and transient network failures, honoring integer `Retry-After` when supplied and otherwise applying exponential backoff. Mutations are single-attempt to avoid duplicate side effects. Authentication, permission and validation failures are not intentionally retried. Every request has an abort-backed timeout.

## Security

- API origin is pinned to `https://api.kit.com`; tool arguments cannot select arbitrary hosts, methods or paths.
- Credentials stay inside transport configuration.
- Tool inputs are typed and bounded; email addresses and IDs are validated.
- Provider-returned subscriber names, fields, broadcast content and other text are wrapped as `untrusted_provider_data`; they are data, not instructions.
- No discovered MCP tool is auto-trusted because this connector does not proxy the broad upstream MCP catalogue.
- Write approval is payload-bound.
- Unsubscribe is disabled by default and never retried.
- Public email sending is intentionally omitted from the API fallback surface.

## Error handling

Provider failures become `KitError` with HTTP status and `Retry-After` when available. 401/403 require credential/permission action and are not treated as transient. Validation and approval failures occur before provider execution. Tool outputs never include the configured credential.

## Testing

`npm test` requires no live Kit account. Tests cover missing credentials, official-host pinning, read/write policy, payload-bound approval, destructive default denial, credential isolation and no blind mutation retry.

## Limitations

This is intentionally not a complete wrapper for Kit API v4 or the 65+ official MCP tools. It omits broadcast sending/scheduling, landing-page publishing, webhooks, purchases, bulk operations, forms/sequences mutation, custom-field mutation, account settings and deletes other than the explicitly gated unsubscribe action. Interactive OAuth acquisition is not implemented. Kit plan restrictions remain authoritative; Kit documents that executing official account MCP tools requires a paid Creator/Creator Pro plan even though clients may connect and inspect the surface on Free.

See `examples/workflows.md` and `manifest.yaml` for usage and machine-readable capability metadata.