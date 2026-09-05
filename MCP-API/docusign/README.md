# Docusign MCP/API Connector

Reusable MCP server for Docusign eSignature workflows using the official eSignature REST API v2.1 with strict schemas and connector-side approval gates.

## Official MCP and transport strategy

As of 2026-09-05, the official Docusign MCP Server is in Global Open Beta; Docusign announced general availability for 2026-09-30. It exposes IAM/eSignature agreement and workflow capabilities through user-scoped OAuth. This package deliberately uses REST v2.1 for deterministic eSignature operations where exact validation and approval boundaries are preferable. Use Docusign's official MCP directly for interactive Agreement Manager / Workflow Builder agent workflows when its OAuth connector flow fits the client.

Official research sources:
- https://www.docusign.com/blog/developers/momentum-26-agentic-agreement-workflows
- https://www.docusign.com/blog/developers/docusign-mcp-server-legal-ai-integration
- https://www.docusign.com/blog/developers/claude-docusign-mcp-connector-guide
- https://developers.docusign.com/docs/esign-rest-api/
- https://developers.docusign.com/platform/auth/
- https://developers.docusign.com/platform/webhooks/connect/

## Tools

| Tool | Risk |
|---|---|
| `docusign.user.info.get` | READ |
| `docusign.envelope.list` | READ |
| `docusign.envelope.get` | READ |
| `docusign.envelope.recipients.list` | READ |
| `docusign.envelope.documents.list` | READ |
| `docusign.template.list` | READ |
| `docusign.template.get` | READ |
| `docusign.template.recipients.list` | READ |
| `docusign.envelope.create_draft` | WRITE |
| `docusign.envelope.create_from_template_draft` | WRITE |
| `docusign.envelope.send` | HIGH_RISK |
| `docusign.envelope.void` | DESTRUCTIVE |

No arbitrary API request, permission, billing, or admin tool is exposed.

## Authentication

Provide a short-lived OAuth 2.0 access token. eSignature uses the `signature` scope; JWT grant also requires `impersonation` consent. Token acquisition/refresh is external so raw credentials remain outside the agent context. Use OAuth userinfo to discover the correct production account/base URI; do not assume one global production host.

## Configuration

Copy `.env.example`. Demo defaults are shown; production must set the account-specific REST base URI discovered from OAuth userinfo.

Only HTTPS Docusign-owned API/OAuth hosts are accepted, limiting SSRF.

## Approval and permissions

READ executes automatically. WRITE defaults to approval-required. HIGH_RISK and DESTRUCTIVE always require an exact fingerprint in semicolon-separated `DOCUSIGN_APPROVED_ACTIONS`:
- `docusign.envelope.create_draft:<emailSubject>`
- `docusign.envelope.send:<envelopeId>`
- `docusign.envelope.void:<envelopeId>`

Voiding additionally requires `DOCUSIGN_ALLOW_DESTRUCTIVE=true`. Agent-supplied approval booleans are not trusted.

## Reliability and rate limits

GET requests use bounded retries for network failures, 429 and 5xx responses, honoring numeric `Retry-After` when supplied and otherwise using exponential backoff. Writes are never blindly retried. Every call has an abort timeout. Docusign trace/rate headers (`x-docusign-tracetoken`, `x-ratelimit-remaining`, `x-ratelimit-reset`) are preserved when present. Quotas can vary by account/environment, so callers should follow provider headers rather than a hard-coded number. List calls expose bounded pagination inputs rather than draining collections.

## Security

Credentials stay in the HTTP transport layer. Agreement/envelope/template content is untrusted data, not instructions. Document bytes are intentionally not downloaded by this connector. Sending is HIGH_RISK; voiding is disabled by default. Never log tokens or documentBase64 content.

## Install / run / test

```bash
npm install
npm run build
npm test
npm start
```

Node.js 20+. The server uses MCP stdio and therefore works with MCP clients that can launch stdio servers. Client-specific OAuth behavior is not claimed.

Tests use mocks and cover auth configuration, SSRF host rejection, approval denial, destructive denial, bearer isolation, 429 retry, no write retry, and tool registration.

## Limitations

The current official Docusign MCP Open Beta is documented but not proxied because its client OAuth flow is interactive and environment-dependent. This connector focuses on eSignature REST v2.1; Agreement Manager APIs, Connect listener hosting, embedded signing URLs, binary document downloads, and administrative changes are outside its scope.
