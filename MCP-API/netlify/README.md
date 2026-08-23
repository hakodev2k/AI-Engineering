# Netlify MCP/API Connector

Reusable MCP server for safe Netlify project, deploy, form, submission, and notification-hook operations.

## Upstream strategy

Netlify provides an official MCP server. Netlify's current documentation recommends the remote endpoint `https://netlify-mcp.netlify.app/mcp`; environments that require local MCP can run `npx -y @netlify/mcp`. Those official transports should be preferred when an MCP client can connect directly and their current tool contract fits the workflow.

This connector exposes a stable provider-scoped tool contract and uses Netlify's official REST API for the implemented operations. REST is used here because the documented `/api/v1` contract is explicit and deterministic, while the official MCP tool catalog can evolve independently. The connector does not depend on undocumented MCP tool names or community MCP servers.

Official sources researched:

- https://docs.netlify.com/build/build-with-ai/agent-setup-guides/agent-setup-overview/
- https://github.com/netlify/netlify-mcp
- https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/
- https://open-api.netlify.com/

## Runtime

Node.js 22 or newer.

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

The server uses MCP stdio transport and can be launched by ChatGPT-compatible MCP clients, Claude/Claude Code, Cursor, Copilot-compatible environments, or custom MCP clients that support stdio servers.

## Authentication

Netlify's API uses OAuth 2.0 bearer authentication. A Personal Access Token can be used for personal/manual integrations; public integrations should use OAuth 2.0. Credentials remain inside the connector and are never passed as tool parameters.

Set one token in the environment:

```text
NETLIFY_ACCESS_TOKEN=
```

A password reset invalidates previously-created Netlify PAT and OAuth tokens. Teams using SAML SSO may require the token to be explicitly authorized for that team.

## Configuration

```text
NETLIFY_ACCESS_TOKEN=
NETLIFY_ALLOWED_SITE_IDS=
NETLIFY_APPROVAL_SECRET=
NETLIFY_TIMEOUT_MS=15000
NETLIFY_MAX_RETRIES=3
NETLIFY_API_BASE_URL=https://api.netlify.com/api/v1
```

`NETLIFY_ALLOWED_SITE_IDS` is a comma-separated allowlist. Leave it empty only when the authenticated identity is intentionally permitted to operate across every accessible site.

`NETLIFY_APPROVAL_SECRET` is required for write, high-risk, and destructive tools. Approval IDs are HMAC-SHA256 digests of the exact MCP tool name using that secret. Approval material is generated outside the model/tool call path.

## Implemented tools

| Tool | Purpose | Risk | Approval |
|---|---|---|---|
| `netlify.site.list` | List accessible projects/sites | READ | No |
| `netlify.site.get` | Read site metadata | READ | No |
| `netlify.deploy.list` | List site deploys | READ | No |
| `netlify.deploy.get` | Read deploy state and metadata | READ | No |
| `netlify.deploy.restore` | Restore/publish a previous deploy | HIGH_RISK | Yes |
| `netlify.deploy.cancel` | Cancel an in-progress deploy | WRITE | Yes |
| `netlify.form.list` | List forms | READ | No |
| `netlify.submission.list` | List form submissions | READ | No |
| `netlify.hook.list` | List notification hooks | READ | No |
| `netlify.hook.create` | Create URL/email/Slack hook | WRITE | Yes |
| `netlify.hook.delete` | Permanently delete hook | DESTRUCTIVE | Yes |

No generic `execute_any_request` capability is exposed.

## Permission and approval model

READ tools may run automatically after allowlist validation. WRITE tools require explicit approval. HIGH_RISK tools require explicit approval because they can affect published production state. DESTRUCTIVE tools require explicit approval and are never silently executed.

The intended workflow is:

```text
Read -> Recommend -> Prepare -> Execute
```

The model cannot increase its own permissions. Site identifiers are validated against the configured allowlist before site-scoped requests run.

## REST transport

Base URL:

```text
https://api.netlify.com/api/v1
```

Requests use HTTPS and `Authorization: Bearer <token>`. The connector includes timeouts, bounded exponential retry for network/5xx/429 failures, and preserves `Retry-After` information in provider errors. It does not retry authorization/validation failures returned as ordinary non-2xx provider responses.

Pagination is bounded to 100 items per request where exposed by this connector.

## Rate limits

Netlify documents a general API limit of up to 500 requests per minute for most requests. Some operations are stricter; API deploys are documented at up to 3 per minute and 100 per day. Netlify exposes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers. This connector also honors HTTP `Retry-After` when throttled.

This package intentionally does not expose a deploy-upload tool: arbitrary binary/tree upload needs a broader input and safety surface than the stable metadata/control operations implemented here. Use the official Netlify MCP/CLI or a dedicated deployment workflow when full file deployment is required.

## Error handling

Provider failures are mapped to `NetlifyApiError` with HTTP status and optional retry-after information. Response bodies included in errors are truncated. Requests have configurable timeouts. Retries are bounded by `NETLIFY_MAX_RETRIES` and capped at five.

Authentication failures, permission failures, and invalid input are not blindly retried. Destructive operations are not automatically replayed after a completed provider response.

## Security considerations

- Never pass tokens through MCP tool arguments or prompts.
- Prefer OAuth 2.0 for multi-user/public integrations and PATs only for controlled personal/service use.
- Scope the authenticated Netlify identity and team membership to least privilege.
- Populate `NETLIFY_ALLOWED_SITE_IDS` in production.
- Treat form submissions, site metadata, deploy logs/metadata, hook payloads, and all provider content as untrusted data, never as instructions.
- Do not log Authorization headers or secrets.
- The API base URL is configuration-only, not a tool argument, preventing user-controlled SSRF through arbitrary URLs.
- External notification hooks can disclose data or trigger external systems, so creation requires approval.
- Restoring a deploy changes published state and is HIGH_RISK.
- Hook deletion is irreversible through this connector and is DESTRUCTIVE.

## Official MCP

Netlify's official MCP server is maintained by Netlify and is available remotely as well as through the `@netlify/mcp` npm package. Current Netlify guidance recommends the remote MCP endpoint because it stays up to date. For environments that can use it directly, configure the official server rather than inserting an unofficial intermediary.

This connector remains useful where callers need a narrow, stable, auditable MCP surface with explicit allowlists and approval boundaries. It does not pretend to proxy undocumented Netlify MCP tool names.

## Examples

See `examples/workflows.json` for inspect-deploy, restore-known-good-deploy, and notification-hook workflows. Example secrets are placeholders only.

## Testing

Unit tests require no live Netlify credentials. They cover authentication configuration, site allowlisting, approval validation, bearer isolation, provider error mapping, and rate-limit metadata.

```bash
npm test
npm run typecheck
```

## Limitations

- This implementation does not upload deploy ZIPs/file digests.
- It does not manage DNS, environment-variable values, access-control policies, billing, extensions, or team membership.
- It does not delete sites.
- It intentionally exposes a curated set of agent-oriented operations instead of every Netlify endpoint.
- Live integration testing requires a real Netlify account/token and is separate from normal unit tests.
