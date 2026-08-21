# Confluence MCP/API Connector

Reusable MCP server for Atlassian Confluence Cloud. It exposes stable `confluence.*` tools to MCP clients while preferring Atlassian's official Rovo MCP server when configured and falling back to the official Confluence Cloud REST API v2 for supported operations.

## Official upstreams

- Atlassian Rovo MCP: `https://mcp.atlassian.com/v1/mcp/authv2`
- Confluence Cloud REST API v2: `${ATLASSIAN_SITE_URL}/wiki/api/v2`
- Rovo MCP is cloud-hosted and supports Confluence with OAuth 2.1 and API-token authentication.

Official references researched for this connector:

- https://developer.atlassian.com/cloud/rovo-mcp/
- https://support.atlassian.com/atlassian-rovo-mcp-server/docs/supported-tools/
- https://developer.atlassian.com/cloud/confluence/rest/v2/intro/
- https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/
- https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-comment/
- https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-space/

## Runtime

Node.js 20+ with `@modelcontextprotocol/sdk`.

```bash
npm install
npm run build
npm start
```

The local connector uses MCP stdio transport so it can be launched by Claude/Claude Code, Cursor, custom MCP clients, and other clients that support stdio MCP servers. Compatibility still depends on the host client's MCP implementation and authentication environment.

## Authentication

Preferred interactive upstream auth is OAuth 2.1 to Atlassian Rovo MCP. The connector accepts the resulting bearer token only through `ATLASSIAN_ROVO_MCP_TOKEN`; it is never exposed as an MCP tool parameter or returned to the agent.

For REST fallback, configure a Confluence Cloud site URL, Atlassian account email, and API token. These credentials remain inside the connector process.

```text
ATLASSIAN_CLOUD_ID=
ATLASSIAN_ROVO_MCP_TOKEN=
ATLASSIAN_SITE_URL=https://your-domain.atlassian.net
ATLASSIAN_EMAIL=
ATLASSIAN_API_TOKEN=
```

At least one transport credential set is required. If both are configured, supported Rovo MCP tools are preferred.

## Required Confluence scopes

Implemented capabilities map to these official scopes when OAuth/scoped-token authorization is used:

- `read:page:confluence`
- `read:hierarchical-content:confluence`
- `read:comment:confluence`
- `read:space:confluence`
- `search:confluence`
- `write:page:confluence`
- `write:comment:confluence`

Always grant only the groups/scopes needed by the workflows you actually enable.

## Tools

| Tool | Purpose | Transport | Risk | Approval |
|---|---|---|---|---|
| `confluence.space.list` | List visible spaces | MCP, REST fallback | READ | No |
| `confluence.page.list` | List pages in a space | MCP, REST fallback | READ | No |
| `confluence.page.get` | Read one page | MCP, REST fallback | READ | No |
| `confluence.page.search` | CQL search | MCP | READ | No |
| `confluence.page.descendants` | List descendant pages | MCP | READ | No |
| `confluence.comment.footer.list` | List footer comments | MCP, REST fallback | READ | No |
| `confluence.comment.inline.list` | List inline comments | MCP, REST fallback | READ | No |
| `confluence.page.create` | Create page | MCP, REST fallback | WRITE | Yes by default |
| `confluence.page.update` | Update page | MCP, REST fallback | WRITE | Yes by default |
| `confluence.comment.footer.create` | Add footer comment/reply | MCP, REST fallback | WRITE | Yes by default |
| `confluence.comment.inline.create` | Add inline comment | MCP, REST fallback | WRITE | Yes by default |

No delete, permission-management, admin, or arbitrary raw-request tool is exposed.

## MCP routing

The connector uses an explicit upstream tool allowlist and does not trust newly discovered MCP tools. Implemented Rovo MCP tools are:

- `getConfluenceSpaces`
- `getPagesInConfluenceSpace`
- `getConfluencePage`
- `searchConfluenceUsingCql`
- `getConfluencePageDescendants`
- `getConfluencePageFooterComments`
- `getConfluencePageInlineComments`
- `createConfluencePage`
- `updateConfluencePage`
- `createConfluenceFooterComment`
- `createConfluenceInlineComment`

If MCP is not configured, the connector falls back to REST only where an equivalent REST v2 implementation is present. CQL search and descendants intentionally fail with a clear `MCP_REQUIRED_*` error rather than guessing an unsupported fallback contract.

## Approval model

`CONFLUENCE_REQUIRE_WRITE_APPROVAL=true` is the default. Every create/update/comment tool requires `approved: true` when this setting is enabled. Read tools never require approval.

This is a connector-level boundary, not a substitute for Atlassian authorization. Atlassian still enforces the authenticated user's existing site and space permissions.

## Reliability and rate limits

REST reads use a 15-second default timeout and up to three attempts. Retries occur only for safe read requests when Atlassian returns `429` or `5xx`, using `Retry-After` when present and otherwise bounded exponential backoff. POST/PUT writes are not retried blindly, preventing duplicate pages/comments or repeated updates.

Confluence REST v2 uses cursor-based pagination. List tools expose a bounded `limit` (maximum 100); provider `_links.next` data remains available to callers without the connector issuing unbounded follow-up requests.

## Security

- Credentials are environment-only and never part of tool schemas.
- The Rovo endpoint is configured, not derived from provider content.
- MCP calls are restricted by a fixed allowlist.
- No arbitrary URL/API request tool exists, reducing SSRF and privilege-escalation risk.
- Write tools require approval by default.
- Page/comment content is returned inside `untrustedProviderData`; clients must treat it as data, never instructions.
- Provider content cannot alter the tool allowlist, scopes, approval policy, or connector configuration.
- REST error text is truncated before being surfaced.
- Authentication/permission failures are not retried.

## Error behavior

Configuration errors fail at startup. Validation is enforced with Zod before provider calls. Common connector errors include `APPROVAL_REQUIRED`, `MCP_NOT_CONFIGURED`, `REST_NOT_CONFIGURED`, `MCP_REQUIRED_FOR_CQL_SEARCH`, `MCP_REQUIRED_FOR_DESCENDANTS`, and `ATLASSIAN_<status>`.

## Testing

```bash
npm test
npm run typecheck
```

Unit tests do not require live credentials and cover startup authentication configuration, REST fallback configuration, tool policy registration, approval denial/allowance, and fail-closed unknown-tool behavior.

## Limitations

- Confluence Cloud only; Data Center is not implemented.
- OAuth browser/PKCE orchestration is delegated to the MCP host/client; the connector consumes an already-issued Rovo bearer token.
- REST fallback uses basic authentication with Atlassian email + API token and should be stored in a secret manager in production.
- The connector deliberately omits delete, permission, billing, and administrative operations.
- Search and descendant-page operations require official Rovo MCP in this implementation.
