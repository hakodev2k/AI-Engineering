# GitGuardian MCP/API Connector

Reusable MCP server exposing selected GitGuardian security operations to AI agents through stable, provider-scoped tools.

## Transport strategy

GitGuardian has an official Developer MCP server for AI-assisted security workflows. This connector acknowledges that upstream capability but deliberately uses GitGuardian's official v1 REST API for its implemented incident, source, team, scanning, assignment, and note operations. That keeps the external MCP tool contract deterministic and avoids trusting dynamically discovered upstream tools. No unofficial MCP server is used.

Official sources researched for this implementation:

- GitGuardian API: https://api.gitguardian.com/docs
- GitGuardian documentation: https://docs.gitguardian.com/
- GitGuardian official MCP/agent material: https://blog.gitguardian.com/introducing-gitguardian-agent-skills/

The API base URL is `https://api.gitguardian.com/v1` in the US and `https://api.eu1.gitguardian.com/v1` in Europe.

## Capabilities

| Tool | Transport | Scope | Risk | Approval |
|---|---|---|---|---|
| `gitguardian.incident.list` | REST | `incidents:read` | READ | No |
| `gitguardian.incident.get` | REST | `incidents:read` | READ | No |
| `gitguardian.incident.locations.list` | REST | `incidents:read` | READ | No |
| `gitguardian.incident.notes.list` | REST | `incidents:read` | READ | No |
| `gitguardian.source.list` | REST | `sources:read` | READ | No |
| `gitguardian.source.get` | REST | `sources:read` | READ | No |
| `gitguardian.team.list` | REST | `teams:read` | READ | No |
| `gitguardian.content.scan` | REST | `scan` | READ | No |
| `gitguardian.incident.note.create` | REST | `incidents:write` | WRITE | Yes |
| `gitguardian.incident.assign` | REST | `incidents:write` | WRITE | Yes |

No endpoint that returns clear-text secret values is exposed. The connector intentionally does not implement token creation, permission changes, incident sharing, deletion, or other high-risk administrative operations.

## Authentication

Set `GITGUARDIAN_API_KEY` to a GitGuardian API token with only the scopes needed for the tools you enable. GitGuardian documents scopes including `scan`, `incidents:read`, `incidents:write`, `sources:read`, and `teams:read`. `incidents:write` also grants read access according to the official API documentation.

Credentials remain inside the connector. They are injected only into the `Authorization: Token ...` request header and are never returned through MCP tool output or written to logs.

Copy `.env.example` and configure:

```bash
GITGUARDIAN_API_KEY=...
GITGUARDIAN_BASE_URL=https://api.gitguardian.com/v1
GITGUARDIAN_TIMEOUT_MS=15000
GITGUARDIAN_MAX_RETRIES=3
GITGUARDIAN_APPROVAL_SECRET=...
```

The base URL validator only permits GitGuardian's official US or EU v1 API endpoints, reducing SSRF risk.

## Approval model

READ tools execute automatically. WRITE tools require a human-generated `approval_id`. The connector validates it as an HMAC-SHA256 digest of `tool-name:resource-id` using `GITGUARDIAN_APPROVAL_SECRET`. The approval secret remains connector-side. An LLM cannot elevate its own permissions by changing tool input.

For example, approval for adding a note to incident `42` is computed outside the agent from:

```text
HMAC_SHA256(GITGUARDIAN_APPROVAL_SECRET, "gitguardian.incident.note.create:42")
```

## Reliability and rate limits

Requests use bounded timeouts. GET operations retry only on HTTP `429`, `502`, `503`, and `504`, with exponential backoff and `Retry-After` support. Writes and scans are not automatically retried, preventing accidental duplicate effects. Authentication, authorization, and validation failures are never retried.

GitGuardian's published API quota is request-based and plan-dependent; the pricing documentation currently describes 10,000 calls per rolling month for free plans and 1M calls per rolling month for business plans, subject to plan/customization. The connector uses pagination (`cursor`, `per_page`) and caps pages at 100 items to avoid unnecessary request amplification.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio transport and can therefore be launched by MCP clients that support local stdio servers. Client-specific configuration varies; point the client command to `node` and arguments to the built `dist/src/server.js` entry point.

## Security considerations

- Provider content is treated as untrusted data and serialized as tool output, never interpreted as connector instructions.
- No arbitrary URL/request tool exists.
- No raw secret retrieval endpoint is exposed.
- Scan content is sent only to the configured official GitGuardian API endpoint and is not logged by this connector.
- Tool schemas constrain IDs, enum values, text lengths, page sizes, and assignee selection.
- Sensitive mutations require external human approval.
- API errors are normalized and do not echo credentials.
- Upstream MCP tool discovery is not trusted or dynamically proxied.

## Testing

```bash
npm test
```

Unit tests require no live credentials and cover authentication configuration, host validation, policy registration, approval denial/acceptance, credential isolation, API error mapping, and no-retry behavior for writes.

## Limitations

This connector implements a focused subset of GitGuardian's API rather than every endpoint. It does not expose clear-text secret retrieval, honeytoken management, API-token administration, members/permissions management, incident sharing, or destructive operations. GitGuardian's official MCP server may provide additional developer-oriented capabilities, but those are not dynamically proxied here. API availability and plan entitlements still depend on the connected GitGuardian workspace.
