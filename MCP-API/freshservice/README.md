# Freshservice MCP/API Connector

Reusable MCP connector for Freshservice IT service-management workflows. The connector presents a stable, provider-scoped MCP interface and delegates supported operations to Freshworks' official Freshservice remote MCP server.

## Transport strategy

Freshservice now provides an official remote MCP endpoint at:

```text
https://<your-freshservice-domain>/mcp
```

This connector uses that official MCP transport for all implemented capabilities. It does not depend on an unofficial MCP server and does not expose arbitrary HTTP request tools.

Freshworks documentation states that the Freshservice MCP integration became generally available on September 10, 2026. The official server supports API-key and OAuth authentication and exposes ticket, asset, user, service-catalog, solution, workspace and other ITSM tools.

Official sources:

- MCP integration and official tool inventory: https://support.freshservice.com/support/solutions/articles/50000012678
- Freshservice API documentation: https://api.freshservice.com/v2/
- API rate-limit guidance: https://support.freshservice.com/support/solutions/articles/50000000293-what-is-the-rate-limit-for-apis-across-all-plans-

## Implemented tools

| Tool | Upstream MCP tool | Risk | Approval |
|---|---|---|---|
| `freshservice.ticket.list` | `fetchTickets` | READ | No |
| `freshservice.ticket.get` | `fetchTicket` | READ | No |
| `freshservice.ticket.search` | `fetchTicketFilter` | READ | No |
| `freshservice.ticket.create` | `createTicket` | WRITE | Required |
| `freshservice.ticket.update` | `updateTicket` | WRITE | Required |
| `freshservice.ticket.note.create` | `createTicketNote` | WRITE | Required |
| `freshservice.asset.list` | `fetchAssets` | READ | No |
| `freshservice.asset.get` | `fetchAsset` | READ | No |
| `freshservice.agent.list` | `fetchAgents` | READ | No |
| `freshservice.requester.list` | `fetchRequesters` | READ | No |
| `freshservice.service_catalog.search` | `fetchServiceCatalogItemSearch` | READ | No |
| `freshservice.solution_article.search` | `fetchSolutionArticleSearch` | READ | No |

No delete, permission-management, billing, account-administration, or unrestricted raw-request tool is exposed.

## Architecture

```text
MCP client / AI agent
        |
        v
Local Freshservice connector (stdio)
        |
        +-- strict input validation
        +-- READ/WRITE policy gate
        +-- explicit write approval
        +-- credential isolation
        |
        v
Official Freshservice MCP endpoint
        |
        v
Freshservice public APIs / service data
```

Provider content is treated as untrusted data. Remote content is returned as tool output only; it never changes connector policy, permissions, authentication settings, or tool registration.

## Authentication

The connector supports the official MCP API-key mode documented by Freshworks. The API key stays in the connector process and is sent only in the `Authorization` header to the configured `*.freshservice.com` MCP endpoint.

OAuth is supported by Freshservice's official MCP server, but this package intentionally does not implement an OAuth token broker. For centrally managed OAuth, connect the MCP client directly to the official endpoint or place an approved credential broker in front of this connector.

### Environment variables

Copy `.env.example` and provide:

```text
FRESHSERVICE_DOMAIN=your-domain.freshservice.com
FRESHSERVICE_API_KEY=your-api-key
FRESHSERVICE_ALLOW_WRITE=false
FRESHSERVICE_TIMEOUT_MS=20000
```

`FRESHSERVICE_DOMAIN` is validated and must end in `.freshservice.com`, preventing callers from redirecting credentials to arbitrary hosts.

## Permission and approval model

READ tools execute without an approval flag. WRITE tools have two independent gates:

1. The operator must explicitly enable writes with `FRESHSERVICE_ALLOW_WRITE=true`.
2. The individual tool call must include `"approved": true` after human review.

This prevents an agent from silently increasing its own permissions. This connector intentionally exposes no destructive tools.

## Installation

Requirements:

- Node.js 20 or later
- A Freshservice account on a plan that supports the official MCP integration
- Appropriate Freshservice permissions for the operations to be invoked

```bash
npm install
npm run build
```

## Running

```bash
FRESHSERVICE_DOMAIN=acme.freshservice.com \
FRESHSERVICE_API_KEY=... \
npm start
```

The local connector uses MCP over stdio so it can be launched by MCP clients that support local stdio servers.

## Example MCP client configuration

```json
{
  "mcpServers": {
    "freshservice-safe": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/freshservice/dist/src/server.js"],
      "env": {
        "FRESHSERVICE_DOMAIN": "acme.freshservice.com",
        "FRESHSERVICE_API_KEY": "${FRESHSERVICE_API_KEY}",
        "FRESHSERVICE_ALLOW_WRITE": "false"
      }
    }
  }
}
```

Do not place real API keys in committed configuration files. Use the client's secret/environment facility.

## Reliability

- Requests use a configurable timeout.
- The official upstream MCP server owns provider pagination; continuation cursors are passed through by list/search tools.
- Authentication, validation, and permission failures are not retried.
- This connector does not blindly retry write operations, avoiding duplicate ticket creation, updates, or notes.
- Freshservice's official MCP server applies plan-dependent action limits. As of September 10, 2026, Freshworks documents 25 actions/minute for Growth, 50 for Pro, and 100 for Enterprise, with plan-specific monthly included actions.
- Freshservice API v2 also uses account-wide minute-level rate limiting and endpoint sublimits. Provider throttling errors and retry information are preserved in upstream MCP results/errors.

## Error handling

Typical local errors:

- `FRESHSERVICE_DOMAIN is required`
- `FRESHSERVICE_API_KEY is required`
- `FRESHSERVICE_DOMAIN must be a Freshservice hostname`
- `WRITE_DISABLED`
- `APPROVAL_REQUIRED`

Provider authentication, authorization, rate-limit, validation, and service errors are propagated by the official MCP client/server path rather than being rewritten into misleading success results.

## Security considerations

- Credentials never appear in tool schemas or tool outputs.
- The domain allowlist prevents credential exfiltration through arbitrary MCP URLs.
- Write operations require both administrator opt-in and per-call human approval.
- No destructive operations are registered.
- No arbitrary URL, REST endpoint, HTTP method, or request-body execution primitive is exposed.
- Retrieved ticket descriptions, notes, knowledge-base articles, requester data, and asset metadata are untrusted content and must not be interpreted as instructions to modify connector policy.
- Apply Freshservice's own RBAC and least-privilege agent roles in addition to this local policy layer.

## Testing

Tests do not require live credentials.

```bash
npm test
```

Coverage includes configuration validation, host restriction, read permission behavior, write-disable behavior, approval enforcement, and approved-write policy behavior.

## Limitations

- This package wraps a deliberately selected subset of the official Freshservice MCP tools rather than every provider capability.
- OAuth browser flows are not implemented locally; API-key authentication is the executable connector mode.
- Attachments are not exposed because safe file ingestion, MIME validation, size enforcement, malware handling, and connector-file isolation require a separate hardened upload design.
- Delete operations are intentionally excluded.
- Freshservice plan availability, monthly MCP allowances, tool inventory, and provider-side schemas can change; consult the official MCP documentation before upgrading or expanding the wrapper.
