# GitBook MCP/API Connector

Reusable MCP server for GitBook documentation operations. It exposes stable provider-scoped tools while keeping GitBook credentials inside the connector.

## Transport strategy

GitBook operates two official MCP surfaces: every published docs site exposes a read-only endpoint at `{published-docs-url}/~gitbook/mcp`, and GitBook's authenticated read/write MCP server is hosted at `https://mcp.gitbook.com/mcp`. This connector uses those trusted MCP endpoints only for constrained capability discovery and uses the official REST API for stable, narrowly scoped management contracts. Newly discovered MCP tools are never invoked automatically.

Official sources researched:
- https://www.gitbook.com/blog/create-documentation-with-ai-and-mcp
- https://gitbook.com/docs/developers/gitbook-api
- https://gitbook.com/docs/developers/gitbook-api/authentication
- https://gitbook.com/docs/developers/gitbook-api/rate-limiting
- https://gitbook.com/docs/developers/gitbook-api/api-reference/change-requests
- https://gitbook.com/docs/developers/gitbook-api/api-reference/docs-sites/site-ai-ask

## Runtime and installation

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
GITBOOK_TOKEN=... npm start
```

The exposed MCP server uses stdio. It can be launched by MCP clients that support stdio child-process servers. The connector itself acts as an HTTP MCP client only when inspecting GitBook's official remote MCP servers.

## Authentication and least privilege

Set `GITBOOK_TOKEN` to a GitBook personal access token. REST requests use `Authorization: Bearer <token>`. GitBook documents personal access tokens as carrying the privileges of the associated user; no independent PAT scope list is documented. Use a dedicated GitBook user with only the organization/space permissions required by these tools.

Credentials are never returned through tool results or accepted as tool parameters. They remain in the connector configuration and transport layer.

## Environment variables

- `GITBOOK_TOKEN` — required.
- `GITBOOK_API_BASE_URL` — defaults to `https://api.gitbook.com/v1`.
- `GITBOOK_MCP_URL` — defaults to `https://mcp.gitbook.com/mcp`.
- `GITBOOK_PUBLISHED_MCP_URL` — optional published-docs MCP URL, normally ending in `/~gitbook/mcp`.
- `GITBOOK_TIMEOUT_MS` — 1,000–120,000; default 15,000.
- `GITBOOK_MAX_RETRIES` — 0–5; default 2.
- `GITBOOK_REQUIRE_WRITE_APPROVAL` — defaults true.
- `GITBOOK_APPROVED_ACTIONS` — comma-separated connector-controlled action fingerprints approved outside the agent prompt.

## Tools and permissions

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `gitbook.mcp.management_tools.list` | official MCP | READ | none |
| `gitbook.mcp.published_tools.list` | official published-docs MCP | READ | none |
| `gitbook.space.get` | REST | READ | none |
| `gitbook.space.list` | REST | READ | none |
| `gitbook.space.links.list` | REST | READ | none |
| `gitbook.space.git.get` | REST | READ | none |
| `gitbook.change_request.list` | REST | READ | none |
| `gitbook.change_request.get` | REST | READ | none |
| `gitbook.change_request.pdf.get` | REST | READ | none |
| `gitbook.site.ask` | REST | READ | none |
| `gitbook.change_request.create` | REST | WRITE | configurable; required by default |
| `gitbook.change_request.update` | REST | WRITE | configurable; required by default |
| `gitbook.change_request.sync` | REST | WRITE | configurable; required by default |
| `gitbook.change_request.merge` | REST | HIGH_RISK | explicit human approval always |

No delete/destructive GitBook tool is exposed.

## Approval behavior

Approval is not a boolean supplied by an agent. It is external connector configuration. For example:

```text
GITBOOK_APPROVED_ACTIONS=gitbook.change_request.create:SPACE_ID,gitbook.change_request.merge:SPACE_ID:CR_ID
```

A merge remains gated even when normal write approval is disabled. This separates recommend/prepare from execute and prevents an agent from silently self-approving a publish-affecting action.

## Reliability and rate limits

Requests use cancellation-backed timeouts. Safe GET reads use bounded exponential backoff for network failures, HTTP 429 and 5xx responses. Mutating operations are not blindly retried. The client honors `Retry-After` and GitBook's `X-RateLimit-Reset` header when present and does not hard-code a quota. Pagination is capped at ten pages per call to prevent uncontrolled request amplification.

Provider HTTP errors preserve status. Authentication, permission and validation failures are not retried. Site AI Ask is semantically read-only but uses a non-retried POST because the official API endpoint is POST.

## Security considerations

- Credentials are isolated from LLM inputs and outputs.
- IDs use strict GitBook entity identifier validation.
- No arbitrary URL or arbitrary API-request tool is exposed.
- Retrieved GitBook content is treated as untrusted data, not instructions.
- Newly discovered upstream MCP tools are listed only, not automatically invoked.
- Published-docs MCP is opt-in through a validated URL.
- Write/high-risk operations use connector-controlled approval fingerprints.
- Secrets should be supplied through process environment or a platform secret manager and excluded from logs.

## Examples

See `examples/workflows.md`.

## Testing

`npm test` runs unit tests with mocked HTTP responses and no live GitBook credentials. Tests cover configuration, credential placement, 429 retry behavior, non-retry of writes, configurable write approval, and mandatory high-risk approval.

## Limitations

The connector intentionally does not expose arbitrary upstream MCP invocation, destructive deletions, permission changes, site configuration mutations, billing, or unrestricted REST passthrough. GitBook's remote management MCP supports broader editing capabilities, but this package exposes only the scoped contracts documented here. `gitbook.mcp.published_tools.list` requires `GITBOOK_PUBLISHED_MCP_URL` because each published site has its own MCP endpoint.
