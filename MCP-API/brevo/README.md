# Brevo MCP/API Connector

Reusable MCP server exposing a curated Brevo integration for contacts, email campaigns, transactional email, and webhooks.

## Transport strategy

Brevo provides an official remote MCP service at `https://mcp.brevo.com/v1/brevo/mcp` and documents focused servers for contacts, campaign management/analytics, templates, CRM, webhooks, and other modules. The official documentation describes module endpoints, but does not publish a stable per-tool contract suitable for safely re-exporting fixed names from this package. This connector therefore uses Brevo's official REST API v3 for its implemented tools: REST provides explicit endpoint schemas, deterministic validation, bounded retries, and connector-side human-approval enforcement. The official MCP endpoint and optional `BREVO_MCP_TOKEN` are recorded for direct use by clients, but raw upstream MCP tools are not automatically discovered or forwarded.

No unofficial MCP server is used.

## Official sources researched

- Brevo MCP Server: https://developers.brevo.com/docs/mcp-protocol
- API authentication: https://developers.brevo.com/docs/api-key-authentication
- API concepts/base URL: https://developers.brevo.com/docs/how-it-works
- Rate limits: https://developers.brevo.com/docs/api-limits
- OpenAPI catalog: https://developers.brevo.com/openapi.json
- Contacts: https://developers.brevo.com/reference/get-contacts
- Create contact: https://developers.brevo.com/reference/create-contact
- Delete contact: https://developers.brevo.com/reference/delete-contact
- Email campaigns: https://developers.brevo.com/reference/create-email-campaign
- Transactional email: https://developers.brevo.com/reference/send-transac-email
- Webhooks: https://developers.brevo.com/reference/create-webhook

## Runtime and installation

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# Populate environment variables securely; do not commit .env.
npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support local stdio servers. Client-specific configuration varies by product.

## Authentication and credential isolation

REST requests use `BREVO_API_KEY` in Brevo's `api-key` HTTP header. The key is read inside the connector only and is never returned in MCP tool outputs. The optional official MCP token is likewise environment-only.

Brevo API keys are account credentials rather than granular OAuth scopes. Least privilege must therefore be enforced operationally: dedicate credentials to the connector, rotate them, restrict network/IP access where available, and use this connector's capability and approval gates.

Environment variables:

- `BREVO_API_KEY` — required.
- `BREVO_API_BASE_URL` — defaults to `https://api.brevo.com/v3`; HTTPS required.
- `BREVO_REQUEST_TIMEOUT_MS` — 1,000–120,000; default 15,000.
- `BREVO_MAX_RETRIES` — 0–5; default 3.
- `BREVO_ALLOW_WRITE` — defaults false.
- `BREVO_ALLOW_DESTRUCTIVE` — defaults false.
- `BREVO_APPROVAL_SECRET` — HMAC secret held outside the model/agent.
- `BREVO_MCP_TOKEN` — optional for direct official-MCP use; this package does not forward it.

## MCP tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `brevo.account.get` | REST | READ | No | Account metadata |
| `brevo.contact.list` | REST | READ | No | Paginated contacts |
| `brevo.contact.get` | REST | READ | No | Contact details |
| `brevo.contact.create` | REST | WRITE | Yes | Create contact |
| `brevo.contact.update` | REST | WRITE | Yes | Update contact |
| `brevo.contact.delete` | REST | DESTRUCTIVE | Yes | Delete contact |
| `brevo.campaign.list` | REST | READ | No | List email campaigns |
| `brevo.campaign.get` | REST | READ | No | Campaign metadata |
| `brevo.campaign.create` | REST | WRITE | Yes | Create draft campaign only |
| `brevo.email.send` | REST | HIGH_RISK | Yes | Send transactional email |
| `brevo.webhook.list` | REST | READ | No | List webhooks |
| `brevo.webhook.create` | REST | HIGH_RISK | Yes | Create webhook |
| `brevo.webhook.delete` | REST | DESTRUCTIVE | Yes | Delete webhook |

The connector deliberately does not expose a generic `request(url, body)` tool, campaign-send operation, bulk import, user/permission administration, billing, or account administration.

## Approval model

READ tools may execute automatically. WRITE and HIGH_RISK tools require `BREVO_ALLOW_WRITE=true` plus an explicit `approvalToken`. DESTRUCTIVE tools additionally require `BREVO_ALLOW_DESTRUCTIVE=true`.

Approval tokens are HMAC-SHA256 values over the tool name plus canonicalized arguments, excluding the token itself. This binds approval to exact parameters; changing recipient, content, record ID, or webhook URL invalidates approval. Generate approval outside the agent using `BREVO_APPROVAL_SECRET`; never provide that secret to prompts or model context.

## Reliability and rate limits

The HTTP client applies timeouts and cancellation. Safe GET operations use bounded exponential backoff for transient network failures, 408, 429, and 5xx responses. Write/destructive operations are never blindly retried to avoid duplicate side effects. `Retry-After` and rate-limit metadata are preserved where available.

Brevo documents tier- and endpoint-specific limits. As of the researched documentation, contacts endpoints have their own RPS/RPH limits, transactional email has a high dedicated limit, and many other endpoints use lower general limits. Consumers must honor live response headers because plan limits can differ and change.

## Pagination

`brevo.contact.list` supports `limit` 1–1000 and bounded offset. `brevo.campaign.list` supports a bounded limit and offset. The connector returns a page per tool call rather than automatically walking every page, preventing accidental high-volume scans.

## Security

- Provider-returned content is untrusted data and is never treated as instructions.
- Credentials remain in the connector layer.
- Tool names and endpoints are fixed and allowlisted; arbitrary URLs cannot be requested.
- The API base URL must be HTTPS and cannot embed credentials.
- Webhook URLs must be HTTPS and are rejected for obvious localhost/private-address literals. Operators should additionally use egress/DNS controls to defend against DNS rebinding.
- Sending external email is HIGH_RISK and always approval-gated.
- Deletions are disabled by default.
- Provider authentication/permission errors are not retried.
- Error output excludes request credentials.

## Webhooks

Brevo supports webhook event notifications for transactional and marketing activity and contact changes. The connector can list, create, and delete webhooks. Webhook receivers remain the responsibility of the integrating application; validate sender authenticity using Brevo's current webhook security guidance and apply network controls as appropriate.

## Testing

```bash
npm test
npm run check
```

Tests use mocked `fetch` and do not require live Brevo credentials. Coverage includes config validation, read/write permission boundaries, argument-bound approval, API-key injection, provider error mapping, rate-limit handling, non-retry of unsafe writes, and destructive-action gating.

## Limitations

- No live credential integration test is run by default.
- Official Brevo MCP is documented but not proxied because automatic discovery/forwarding would weaken the stable external contract and approval policy.
- Campaign creation is draft-only; campaign sending is intentionally omitted because publishing marketing content requires a stronger review workflow.
- Webhook SSRF validation blocks obvious private/loopback literals but should be complemented by network-level egress controls.
