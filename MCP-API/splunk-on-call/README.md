# Splunk On-Call MCP Connector

Reusable stdio MCP server for Splunk On-Call (formerly VictorOps) incident-response workflows. It exposes a fixed provider-scoped tool contract over Splunk's official public REST API and keeps API credentials inside the connector process.

## Transport research

No official Splunk On-Call MCP server was identified in Splunk's current product documentation reviewed for this implementation. The connector therefore uses the official public REST API at `https://api.victorops.com`. Splunk documents API ID/API key authentication, read-only API keys, current incidents, users/teams, current on-call data, routing keys, and manual incident creation. Splunk's documentation states that API calls are unlimited at the package level, while individual public endpoints may document per-endpoint limits (for example, current incidents is documented at 60 calls/minute). The client still handles HTTP 429 and `Retry-After` defensively.

Official sources:
- Splunk On-Call API: https://help.splunk.com/en/splunk-cloud-platform/alert-and-respond/splunk-on-call/introduction-to-splunk-on-call/splunk-on-call-api
- Incidents/product behavior: https://help.splunk.com/en/splunk-cloud-platform/alert-and-respond/splunk-on-call/incidents
- Routing keys: https://help.splunk.com/en/splunk-cloud-platform/alert-and-respond/splunk-on-call/alerts/routing-keys
- Public API interactive documentation is linked from Splunk On-Call under Integrations > API.

## Architecture

`MCP client -> stdio MCP server -> strict Zod schemas + policy gate -> SplunkOnCallClient -> api.victorops.com`

Credentials are environment-only and never accepted as tool parameters. Provider content is wrapped with `untrustedProviderData: true`; callers must treat it as data, not instructions.

## Authentication

Create an API ID/key in Splunk On-Call under Integrations > API. Splunk allows read-only keys; use one for deployments that need only READ tools. Only admin users can create API keys. For `incident.create`, use a key allowed to POST and enable writes locally.

Environment:
- `SPLUNK_ON_CALL_API_ID` — required.
- `SPLUNK_ON_CALL_API_KEY` — required.
- `SPLUNK_ON_CALL_API_BASE_URL` — optional; only `https://api.victorops.com` is accepted.
- `SPLUNK_ON_CALL_TIMEOUT_MS` — 1000..120000, default 15000.
- `SPLUNK_ON_CALL_MAX_RETRIES` — 0..5, default 2; safe GETs only.
- `SPLUNK_ON_CALL_ALLOW_WRITES` — default false.
- `SPLUNK_ON_CALL_APPROVAL_SECRET` — host-only secret (minimum 16 characters) used to bind approval to the exact write intent.

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `splunk_on_call.incident.list` | `GET /api-public/v1/incidents` | READ | no |
| `splunk_on_call.incident.get` | `GET /api-public/v1/incidents/{incidentNumber}` | READ | no |
| `splunk_on_call.incident.create` | `POST /api-public/v1/incidents` | HIGH_RISK | yes |
| `splunk_on_call.alert.get` | `GET /api-public/v1/alerts/{uuid}` | READ | no |
| `splunk_on_call.user.list` | `GET /api-public/v1/user` | READ | no |
| `splunk_on_call.user.get` | `GET /api-public/v1/user/{user}` | READ | no |
| `splunk_on_call.team.list` | `GET /api-public/v1/team` | READ | no |
| `splunk_on_call.team.get` | `GET /api-public/v1/team/{team}` | READ | no |
| `splunk_on_call.team.members.list` | `GET /api-public/v1/team/{team}/members` | READ | no |
| `splunk_on_call.oncall.current` | `GET /api-public/v1/oncall/current` | READ | no |
| `splunk_on_call.routing_key.list` | `GET /api-public/v1/org/routing-keys` | READ | no |
| `splunk_on_call.maintenance.get` | `GET /api-public/v1/maintenancemode` | READ | no |

Manual incident creation mirrors Splunk On-Call's manual incident workflow. Monitoring systems should generally use the provider's REST Endpoint integrations instead, as Splunk recommends.

## Approval model

READ executes automatically. `incident.create` is HIGH_RISK because it can page external responders. It is disabled unless `SPLUNK_ON_CALL_ALLOW_WRITES=true`, and additionally requires a 64-character HMAC-SHA256 approval token produced by a trusted host using `SPLUNK_ON_CALL_APPROVAL_SECRET`. The token is bound to the exact tool name and mutation intent. Do not expose the approval secret to an LLM.

No destructive tools, arbitrary URL tools, user-management writes, routing changes, or permission changes are exposed.

## Install and run

```bash
npm install
npm run build
SPLUNK_ON_CALL_API_ID=... SPLUNK_ON_CALL_API_KEY=... npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support stdio child processes. Compatibility depends on the client's MCP stdio support; no client-specific behavior is assumed.

## Reliability and errors

GET requests use bounded exponential backoff for network failures, HTTP 429, and 5xx responses. `Retry-After` is preserved when supplied. Mutations are never retried blindly. Requests have an AbortController timeout. Authentication, permission, and validation failures are not retried. Provider HTTP errors are surfaced without logging credentials.

## Security

- Credentials stay in the authentication/client layer.
- API host is pinned to `api.victorops.com`, preventing configurable-host SSRF.
- Tool schemas restrict identifiers, sizes, target types, and target counts.
- Retrieved incident/alert text is untrusted provider content and cannot change connector policy.
- The tool surface is static; no dynamically discovered upstream capabilities are trusted.
- Prefer a read-only Splunk On-Call API key for read-only deployments.
- Store secrets in a secret manager or protected process environment and redact them from logs.

## Testing

`npm test` uses mocks only; live credentials are not required. Tests cover host validation, credential isolation, arbitrary-path rejection, approval binding, writes-disabled behavior, throttling metadata, and mutation retry safety.

## Limitations

This connector intentionally omits destructive administration, user/team mutation, escalation-policy mutation, maintenance-mode changes, webhooks, and generic REST execution. It does not implement OAuth because Splunk On-Call's documented public API uses API ID/API key headers. It does not proxy an unofficial MCP server. Endpoint availability can vary by Splunk On-Call plan and account permissions.
