# Better Stack Uptime MCP/API Connector

Reusable MCP stdio connector for selected Better Stack Uptime monitoring and incident-response workflows. Requires Node.js 20+.

## Upstream transport and official sources

The connector uses Better Stack's official Uptime REST API (`https://uptime.betterstack.com/api/v3`) directly. Official documentation researched for this implementation includes the Uptime API reference, Monitor API, Incidents API, Metadata API, and outgoing/incident log-drain webhook documentation at `https://betterstack.com/docs/uptime/`. Better Stack documents Bearer-token authentication, paginated monitor/incident resources, manual incident creation, incident escalation, metadata mutation, and outgoing webhook/event mechanisms. No official Better Stack Uptime MCP server was identified in the official documentation used for this package, so direct official REST is the trusted upstream transport rather than an unofficial MCP proxy.

## Capabilities

Implemented tools: `betterstack.monitor.list`, `betterstack.monitor.get`, `betterstack.monitor.create`, `betterstack.monitor.update`, `betterstack.monitor.delete`, `betterstack.incident.list`, `betterstack.incident.get`, `betterstack.incident.create`, `betterstack.incident.acknowledge`, `betterstack.incident.resolve`, `betterstack.incident.escalate`, `betterstack.metadata.list`, and `betterstack.metadata.update`. The package does not expose arbitrary HTTP requests.

## Architecture

MCP client -> strict Zod schema -> permission/approval gate -> BetterStackClient -> official REST API. The credential provider in `src/auth.ts` reads the token from process environment; the LLM never receives the raw token. Provider responses are marked `untrustedData` before being returned through MCP.

## Authentication

Set `BETTERSTACK_API_TOKEN` to a Better Stack Uptime API token with only access required for the implemented resources. Better Stack uses `Authorization: Bearer $TOKEN`. Tokens can be team-scoped or global depending on account configuration; prefer the narrowest token appropriate to the deployment. Never place tokens in prompts, tool arguments, source control, examples, or logs.

Environment variables are documented in `.env.example`. `BETTERSTACK_API_BASE_URL` is administrator configuration and defaults to the official Uptime API. `BETTERSTACK_ALLOW_WRITES=true` enables the write gate; destructive monitor deletion additionally requires `BETTERSTACK_ALLOW_DESTRUCTIVE=true`.

## Install and run

```bash
npm install
npm run build
BETTERSTACK_API_TOKEN=... npm start
```

Configure an MCP client that supports local stdio servers to execute `node dist/src/server.js`. The connector uses standard MCP stdio transport; compatibility depends on that client capability.

## Permissions and approvals

READ operations may run automatically. WRITE operations require process-level write enablement and per-call `approved:true`. Incident creation, acknowledgement, resolution and escalation are HIGH_RISK because they can page responders or materially change operational state; they require the same explicit human approval. Monitor deletion is DESTRUCTIVE, disabled by default, and requires both destructive process opt-in and explicit approval. Agents cannot change these environment gates through MCP.

## Rate limits, pagination, and reliability

Better Stack list APIs are paginated; incidents document a default page size of 10 and maximum of 50. The tools expose bounded page numbers and preserve the provider's pagination metadata. Requests use AbortController timeouts. GET/HEAD requests use bounded exponential-backoff retry only for network failures, HTTP 429, and selected transient 5xx statuses; `Retry-After` is honored when present. Authentication/permission/validation failures and all writes are not blindly retried.

## Events and webhooks

Better Stack supports outgoing incident, monitor, and on-call-change webhooks as well as an incident log drain with monitor, heartbeat, and incident events. This package does not expose webhook configuration because it can create external data egress and requires additional receiver-validation design. A future receiver should validate source/authentication according to the current official webhook guidance and treat payloads as untrusted.

## Error handling

Provider failures are mapped to `BetterStackError` with HTTP status and response retained internally. MCP returns concise failures without credentials. Missing credentials fail before a network call. Zod rejects unknown fields and invalid IDs/URLs/e-mails. Timeouts surface after bounded read retries.

## Security

Use secret storage for API tokens and rotate them using Better Stack controls. Do not allow agents to override the API base URL. Treat incident descriptions, monitor names, metadata, and webhook content as untrusted text that may contain prompt injection. Tool output must never modify approval policy. Destructive actions are disabled by default. Avoid logging Authorization headers or complete sensitive incident payloads. The connector deliberately excludes team/security/billing/token administration.

## Testing

`npm test` uses mocked `fetch` and no live credentials. Tests cover tool registration, strict validation, credential isolation, write/destructive approval denial, read execution, pagination, authentication errors, rate-limit retry, and no-retry semantics for writes.

## Limitations

This is a focused Uptime connector, not the entire Better Stack platform. It does not implement Logs/Telemetry ingestion, status pages, schedules/on-call administration, integrations, webhook configuration, billing, or credential administration. Some monitor types require additional provider-specific fields; the create tool intentionally supports a conservative common subset and provider validation remains authoritative. No unofficial upstream MCP implementation is trusted or required.
