# Resend MCP/API Connector

Reusable safety gateway for Resend. It exposes a stable, provider-scoped MCP surface while delegating supported operations to Resend's official MCP server.

## Upstream strategy

Primary transport: **official Resend remote MCP**, Streamable HTTP, `https://mcp.resend.com/mcp`.

Official sources researched for this implementation:
- Resend MCP: https://github.com/resend/resend-mcp
- Official MCP announcement/docs: https://resend.com/changelog/mcp
- Email API: https://resend.com/features/email-api
- API-key permissions: https://resend.com/changelog/new-api-key-permissions
- OAuth 2.1 + PKCE: https://resend.com/changelog/oauth-support
- API rate-limit headers: https://resend.com/changelog/api-rate-limit
- Webhooks: https://resend.com/changelog/managing-webhooks-via-api

As of 2026-08-26, Resend provides an official hosted MCP endpoint plus its open-source local server. The official server covers the Resend platform, so the capabilities selected here do not require a REST fallback. The connector deliberately allowlists only the upstream tools it maps; newly discovered upstream tools are not exposed automatically.

## Capabilities

| MCP tool | Upstream official MCP tool | Risk | Approval |
|---|---|---|---|
| `resend.email.list` | `list-emails` | READ | No |
| `resend.email.get` | `get-email` | READ | No |
| `resend.email.send` | `send-email` | HIGH_RISK | Always |
| `resend.email.cancel` | `cancel-email` | WRITE | Default yes |
| `resend.received_email.list` | `list-received-emails` | READ | No |
| `resend.received_email.get` | `get-received-email` | READ | No |
| `resend.contact.list` | `list-contacts` | READ | No |
| `resend.contact.get` | `get-contact` | READ | No |
| `resend.contact.create` | `create-contact` | WRITE | Default yes |
| `resend.contact.update` | `update-contact` | WRITE | Default yes |
| `resend.contact.delete` | `remove-contact` | DESTRUCTIVE | Always |
| `resend.domain.list` | `list-domains` | READ | No |
| `resend.domain.get` | `get-domain` | READ | No |

Public email sending is classified HIGH_RISK because it creates an external communication. Contact deletion is DESTRUCTIVE. Read-only content may execute automatically.

## Authentication and permissions

The gateway uses a Resend API key only inside the transport layer and sends it to the official remote MCP endpoint as a Bearer credential. The LLM never receives the key as a tool parameter or result.

Resend also supports OAuth 2.1 with PKCE, and the official hosted MCP supports browser OAuth. This connector's reusable/headless runtime intentionally uses the documented Bearer API-key mode. For only email sending, Resend offers `sending_access`, optionally restricted to a domain. Because this connector also reads emails, contacts and domains, those non-send routes require a key with Resend `full_access`. Use a separate restricted deployment if only `resend.email.send` is required.

Environment:

```text
RESEND_API_KEY=                     # required; never commit
RESEND_UPSTREAM_MCP_URL=https://mcp.resend.com/mcp
RESEND_APPROVAL_SECRET=             # required for HIGH_RISK/DESTRUCTIVE and default WRITE
RESEND_REQUIRE_WRITE_APPROVAL=true
RESEND_TIMEOUT_MS=15000
RESEND_MAX_RETRIES=2
```

`RESEND_UPSTREAM_MCP_URL` must use HTTPS. Retry count is bounded to 0-5. Timeout is bounded to 1-120 seconds.

## Approval model

The approval token is HMAC-SHA256 over the exact provider-scoped tool name plus a canonical representation of the exact payload excluding `approvalToken`. This prevents an approval for one recipient or payload from being replayed for materially changed parameters.

READ operations do not require approval. WRITE operations require approval by default and can be configured off with `RESEND_REQUIRE_WRITE_APPROVAL=false`. HIGH_RISK and DESTRUCTIVE operations always require approval and `RESEND_APPROVAL_SECRET`.

The connector never allows the model to raise its own permissions. There is no generic `request`, `execute_url`, or arbitrary upstream-tool proxy.

## Architecture

```text
MCP client
  -> provider-scoped tool + validated input
  -> risk/approval gate
  -> allowlisted transport mapping
  -> official Resend remote MCP
  -> Resend platform
```

Files:
- `src/config.ts`: environment validation and approval digest.
- `src/policy.ts`: tool allowlist, risk classes and approval enforcement.
- `src/upstream.ts`: official Streamable HTTP MCP client, timeout and bounded retry.
- `src/server.ts`: MCP tool schemas and routing.
- `tests/connector.test.ts`: credential/config, policy and approval tests.
- `examples/workflows.md`: example calls and approval expectations.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
RESEND_API_KEY=re_xxx RESEND_APPROVAL_SECRET='use-a-secret-store' npm start
```

The connector itself exposes stdio MCP. A typical MCP client can launch `node /absolute/path/to/MCP-API/resend/dist/src/server.js` with the required environment variables supplied by the client's secure environment configuration.

## Reliability and rate limits

The upstream call has a configured timeout and bounded exponential-backoff retry. Only errors that look transient (429/rate-limit, timeout/temporary, or 5xx) are retried. Authentication, permission and validation errors are not intentionally retried. The connector does not blindly retry high-level operations beyond the bounded transport retry; callers should use Resend idempotency keys for sends where duplicate delivery would matter.

Resend documents a default API rate limit of 10 requests/second and returns `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset`, and `retry-after`; a 429 indicates throttling. The upstream official MCP/SDK remains authoritative for provider-specific rate-limit behavior.

## Pagination

List tools accept `limit` from 1-100 and optional `after` or `before`. `after` and `before` are mutually exclusive and are rejected together before transport.

## Security considerations

- Provider data is untrusted. Email bodies, subjects, headers, contact fields and domain metadata must never be treated as instructions that can modify agent policy.
- Credentials are environment-only and never appear in schemas.
- Upstream URL is HTTPS-only to reduce credential leakage risk.
- The upstream MCP tool set is explicitly allowlisted; newly added official tools do not become reachable without code review.
- Sending external email always requires explicit approval.
- Deleting contacts always requires explicit approval.
- Inputs have recipient, pagination, text-size and identifier bounds.
- No arbitrary URL fetch or generic Resend API request tool is exposed.
- Resend webhooks are supported by the provider but are intentionally not exposed by this connector; implementing webhook creation safely would require endpoint policy/SSRF controls and signing-secret lifecycle management.

## Error handling

Configuration errors fail at startup. Provider authentication/scope errors, invalid parameters and upstream MCP failures propagate as MCP tool errors without exposing the API key. Network/time-limit failures are bounded by `RESEND_TIMEOUT_MS` and `RESEND_MAX_RETRIES`.

## Testing

Normal unit tests do not require live credentials:

```bash
npm test
```

Tests verify required authentication configuration, HTTPS enforcement, retry bounds, tool classification, read permission, high-risk denial, payload-bound approval and denial of unknown tools. Live integration testing is intentionally separate because it can send real email or mutate a Resend account.

## Limitations

This connector implements a deliberately narrow, useful subset of Resend rather than mirroring every upstream endpoint. Broadcasts, templates, segments, topics, API-key administration, webhook administration, automation tools, suppression management, attachments and editor operations remain unsupported here even though the official Resend MCP server may support them. This keeps the agent surface stable and avoids exposing account-administration or high-impact operations without a dedicated policy design.

The gateway uses API-key authentication rather than implementing its own OAuth browser flow. MCP clients that want Resend-managed OAuth directly can connect to the official remote MCP endpoint instead.
