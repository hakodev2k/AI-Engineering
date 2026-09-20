# Fullstory MCP/API Connector

Reusable MCP server for Fullstory behavioral analytics and narrowly scoped Server API v2 operations. It prefers Fullstory's official remote MCP for analytics and uses the official REST API where MCP is intentionally read-only or deterministic session/user access is useful.

## Official sources
- MCP: https://developer.fullstory.com/mcp/introduction/ — official remote endpoint `https://api.fullstory.com/mcp/fullstory`, currently beta.
- MCP limits: https://developer.fullstory.com/mcp/limits/ — no MCP writes; session and dimensionality limits.
- MCP FAQ: https://developer.fullstory.com/mcp/faq/ — 3 requests/sec, burst 20 per org/endpoint.
- Server API v2: https://developer.fullstory.com/server/getting-started/
- Sessions API: https://developer.fullstory.com/server/sessions/introduction/

## Architecture
`MCP client -> this stdio server -> allowlisted official Fullstory MCP tools OR scoped Fullstory REST v2 -> Fullstory`. Credentials remain in the connector process and are never included in tool output. Provider responses are labeled as untrusted data.

## Authentication
For MCP analytics set `FULLSTORY_MCP_BEARER_TOKEN`. Fullstory also supports browser OAuth for interactive clients; this headless wrapper uses the documented Bearer-token alternative. For REST set `FULLSTORY_API_KEY`; requests use `Authorization: Basic <API_KEY>`. Fullstory documents Admin/Architect requirements for retrieval endpoints. Use least-privileged credentials.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `fullstory.segment.build` | MCP `build_segment` | READ | no |
| `fullstory.metric.build` | MCP `build_metric` | READ | no |
| `fullstory.metric.compute` | MCP `compute_metric` | READ | no |
| `fullstory.metric.update` | MCP `update_metric` | READ | no |
| `fullstory.session.find` | MCP `get_sessions` | READ | no |
| `fullstory.user.list` | REST `GET /v2/users` | READ | no |
| `fullstory.session.list` | REST `GET /v2/sessions` | READ | no |
| `fullstory.session.events.read` | REST session events | READ | no |
| `fullstory.user.upsert` | REST `POST /v2/users` | WRITE | yes by default |
| `fullstory.event.create` | REST `POST /v2/events` | WRITE | yes by default |

The upstream MCP wrapper allowlists five documented analytics/session tools. Newly discovered upstream tools fail closed. MCP wrappers accept an `arguments` object because Fullstory owns and may evolve those schemas while this connector fixes the capability boundary.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run build
node dist/src/index.js
```
Configure any stdio-compatible MCP client to launch that command with environment variables from `.env.example`.

## Permissions and approvals
Reads execute automatically. REST writes are disabled unless `FULLSTORY_ALLOW_WRITES=true`. When enabled, `FULLSTORY_REQUIRE_WRITE_APPROVAL=true` requires `approved: true` on every write. No delete, privacy-rule, account-admin, billing, permission, or arbitrary-request tool is exposed.

## Reliability and rate limits
REST calls use bounded timeouts and surface provider status plus `Retry-After`; writes are never blindly retried. Fullstory MCP enforces 3 requests/sec with burst 20. Official MCP session tools cap results at 50. Server-event quota exhaustion can return HTTP 429. Callers should back off rather than fan out requests.

## Security
Endpoints must be HTTPS. Email and identifier lengths are constrained. `session_uid` is mutually exclusive with `uid`/`email`. Writes are double-gated by configuration and explicit approval. Secrets are environment-only. There is no arbitrary URL or REST proxy, reducing SSRF and permission-escalation risk. Fullstory content may contain user-controlled text and is treated as untrusted data, never instructions.

## Testing
`npm test` uses mocks only; live credentials are not required. Tests cover configuration, HTTPS enforcement, validation, write denial, approval gating, authentication isolation, and rate-limit error mapping.

## Limitations
Fullstory MCP is beta, single-org scoped, and read-only. It does not support dashboards, heatmaps, account administration, privacy-rule changes, or bulk export. This connector does not emulate unsupported MCP writes. Interactive OAuth token acquisition is delegated to Fullstory/client software; this package accepts a pre-provisioned Bearer token for headless operation.
