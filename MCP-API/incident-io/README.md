# incident.io MCP Connector

Reusable safety wrapper around incident.io's official hosted MCP server. It exposes a stable provider-scoped allowlist instead of blindly forwarding every upstream tool.

## Official sources and transport

Upstream transport is the official remote MCP endpoint `https://mcp.incident.io/mcp`. Official documentation: `https://docs.incident.io/ai/remote-mcp`. incident.io documents OAuth+PKCE for interactive clients and scoped API keys (Bearer authentication) for automated systems. This package uses the latter so credentials remain inside the connector. incident.io's hosted MCP is generally available and its documented tools cover incidents, alerts, on-call/escalations, actions/follow-ups, status-page drafts, analysis, investigations, documents and more. This connector intentionally exposes only a conservative subset.

No REST fallback is needed for the implemented capabilities because the official MCP currently supports them. The connector does not depend on the retired prototype/community server.

## Capabilities

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| incident-io.incident.list | incident_list | READ | no |
| incident-io.incident.show | incident_show | READ | no |
| incident-io.incident.stats | incident_stats | READ | no |
| incident-io.alert.list | alert_list | READ | no |
| incident-io.alert.show | alert_show | READ | no |
| incident-io.alert.stats | alert_stats | READ | no |
| incident-io.on_call.query | ask | READ | no; mutation language blocked |
| incident-io.action.list | action_list | READ | no |
| incident-io.incident.create | incident_create | WRITE | yes |
| incident-io.incident.update | incident_update | WRITE | yes |
| incident-io.action.create | action_create | WRITE | yes |
| incident-io.status_page.update.draft | status_page_update | READ | no; draft only |

Deletion, alert resolution, incident merging, escalation mutation, schedule overrides, investigation steering, and public status-page publishing are deliberately not exposed. The official MCP supports more operations; absence here is a safety boundary, not a claim that incident.io lacks them.

## Architecture

MCP client → local stdio server → strict schema + allowlist + approval policy → official incident.io Streamable HTTP MCP → incident.io. The API key is read from process environment and only attached by the upstream transport. Tool callers never supply credentials.

## Authentication and permissions

Create an incident.io API key under Settings → API keys and grant only scopes needed by the upstream tools you intend to use. Start read-only; add incident/action write permissions only if write tools are enabled. incident.io attributes API-key activity to a service actor. Interactive clients connecting directly to incident.io should instead use the provider's OAuth PKCE flow; the official MCP OAuth client has no client secret.

Environment:

- `INCIDENT_IO_API_KEY` required.
- `INCIDENT_IO_MCP_URL` optional; defaults to and is restricted to `https://mcp.incident.io/mcp` to prevent credential SSRF.
- `INCIDENT_IO_ALLOW_WRITES` defaults false.
- `INCIDENT_IO_TIMEOUT_MS` defaults 20000, bounded to 1–120 seconds.

## Install and run

Requires Node.js 20+.

```bash
npm install
npm run build
INCIDENT_IO_API_KEY=... npm start
```

Configure any MCP client that supports a local stdio command to run `node dist/src/server.js`. Compatibility depends only on standard MCP stdio support; no client-specific behavior is required.

## Approval model

READ tools execute automatically. WRITE tools require both administrator configuration (`INCIDENT_IO_ALLOW_WRITES=true`) and an explicit per-call `approved: true` supplied only after human review. The approval marker is removed before the upstream call. Destructive operations are absent rather than merely hidden behind a flag. `on_call.query` is constrained to read questions and rejects common mutation verbs because the upstream `ask` tool itself can manage schedules/escalations.

Status-page updates are draft-only. incident.io explicitly documents that its MCP `status_page_update` drafts and does not publish; publishing remains a human action.

## Reliability and rate limits

Calls have bounded timeouts/cancellation. The official MCP transport owns protocol/session behavior and incident.io handles pagination for its higher-level tools. This wrapper does not blindly retry writes or authentication/permission failures, avoiding duplicate mutations. Provider throttling/errors are returned as MCP errors; callers should honor any retry guidance returned by incident.io. Alert-source ingestion limits are separate from these MCP calls and are not treated as an MCP request quota.

## Error handling

Local schema/policy failures return MCP tool errors before network access. Upstream authentication, entitlement, scope, rate-limit and provider errors remain tool errors. Error text is scrubbed for the configured API key before it is returned.

## Security

- Credentials are isolated in the upstream client and never accepted as tool parameters.
- Upstream URL is pinned to HTTPS and `mcp.incident.io` with `/mcp`, mitigating credential-forwarding SSRF.
- Upstream tools are statically allowlisted; newly discovered provider tools are not automatically trusted.
- Provider content is untrusted data and cannot alter permissions or tool registration.
- Strict Zod schemas reject unknown top-level parameters.
- Writes are disabled by default and require two independent gates.
- Destructive/high-impact tools are not registered.
- Logs do not intentionally contain credentials; returned errors redact the configured key.

## Testing

`npm test` uses no live credentials. Tests cover registration uniqueness, strict validation, write denial, explicit approval, read-only protection around the powerful upstream `ask` tool, and endpoint/SSRF validation. `npm run build` type-checks the executable connector.

## Examples

See `examples/workflows.md` for read, analytics, approved-write and status-page-draft workflows.

## Limitations

This package wraps the official hosted MCP and therefore requires an incident.io plan/account with MCP access and the associated product for product-specific tools. It does not implement OAuth token storage/refresh because automation uses non-expiring-until-deleted scoped API keys. It does not expose arbitrary upstream tool invocation, REST endpoints, public status publishing, destructive operations, or webhook receiving. OAuth connections used directly with incident.io have provider-defined lifetimes and should follow current official documentation.
