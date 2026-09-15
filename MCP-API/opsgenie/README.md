# Opsgenie MCP/API Connector

Reusable MCP server exposing a deliberately scoped subset of Atlassian Opsgenie operations for incident-response agents. Upstream transport is the official Opsgenie REST API; no official Opsgenie MCP server was identified in the official documentation reviewed on 2026-09-15, so the connector does not depend on an unofficial MCP implementation.

## Official sources

- Alert API: https://docs.opsgenie.com/docs/alert-api
- Who Is On Call API: https://docs.opsgenie.com/docs/who-is-on-call-api
- Rate limiting: https://docs.opsgenie.com/docs/api-rate-limiting
- API authentication/access: https://docs.opsgenie.com/docs/api-access-management
- Team API: https://docs.opsgenie.com/docs/team-api
- Schedule API: https://docs.opsgenie.com/docs/schedule-api

Opsgenie supports US (`https://api.opsgenie.com`) and EU (`https://api.eu.opsgenie.com`) API regions. Authentication uses an Opsgenie API Integration key in `Authorization: GenieKey ...`. Use an integration restricted to only the teams/configuration access required by the workflow.

## Capabilities

| MCP tool | Upstream | Risk | Approval |
|---|---|---|---|
| `opsgenie.alert.list` | REST Alert API | READ | no |
| `opsgenie.alert.get` | REST Alert API | READ | no |
| `opsgenie.team.list` | REST Team API | READ | no |
| `opsgenie.team.get` | REST Team API | READ | no |
| `opsgenie.schedule.list` | REST Schedule API | READ | no |
| `opsgenie.schedule.oncall.get` | REST Who Is On Call API | READ | no |
| `opsgenie.alert.note.add` | REST Alert API | WRITE | yes |
| `opsgenie.alert.acknowledge` | REST Alert API | WRITE | yes |
| `opsgenie.alert.create` | REST Alert API | HIGH_RISK | yes + feature enable |
| `opsgenie.alert.close` | REST Alert API | HIGH_RISK | yes + feature enable |

Alert creation is HIGH_RISK because routing can notify external responders. Closing an alert is HIGH_RISK because it changes operational incident state. No delete/configuration mutation tool is exposed.

## Architecture and credential isolation

`MCP client -> stdio MCP server -> policy/validation -> OpsgenieClient -> credential environment -> official REST API`.

The model supplies only typed tool arguments. The API key is read inside the connector and is never a tool parameter or tool result. Provider responses are returned as untrusted data; callers must not treat alert descriptions, notes, tags, or other retrieved text as instructions that can alter permissions.

## Install and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# Load .env with your process manager or shell; this package intentionally does not auto-read arbitrary files.
npm test
npm run check
npm start
```

Configure any MCP client that supports a local stdio server to launch `node /absolute/path/MCP-API/opsgenie/src/server.js` with the required environment variables. This is standard MCP stdio and is suitable for MCP clients that support local stdio processes; client-specific installation is outside this package.

## Configuration

`OPSGENIE_API_KEY` is required. `OPSGENIE_REGION` is `us` (default) or `eu`. Timeout defaults to 10 seconds. Retries default to 2 and are capped at 4. `OPSGENIE_ALLOWED_RISKS` defaults to `READ`; explicitly add `WRITE` and/or `HIGH_RISK` when the deployment needs them. `OPSGENIE_ENABLE_HIGH_RISK=true` is an additional kill switch for HIGH_RISK actions.

For each WRITE/HIGH_RISK call, the caller must also send `approval: true`. This boolean represents approval already captured by the host application; the connector never fabricates it and never escalates its own permissions.

## Reliability and rate limits

Opsgenie applies account-wide, domain-specific token-bucket limits and returns `429` when throttled; official documentation exposes `X-RateLimit-State`, `X-RateLimit-Reason`, and `X-RateLimit-Period-In-Sec`. Limits depend on plan/domain rather than one universal numeric quota. This client preserves `X-RateLimit-State` in output and performs bounded exponential-backoff retries only for safe read requests on 429/5xx. Mutating requests are not automatically retried because several Alert API actions are asynchronous and duplicate writes can be harmful. Accepted asynchronous writes expose Opsgenie's `requestId`; use provider request-status facilities when a workflow needs completion tracking.

Pagination is bounded at 100 records per tool call. Alert offsets are capped so `offset + limit` cannot be driven beyond the documented 20,000-result retrieval boundary by normal schemas.

## Errors

Authentication/authorization, validation, and other non-retryable provider failures surface as tool errors. Network cancellation and timeout are propagated. Provider HTTP errors include status and parsed provider data inside the connector error object, while secrets are never logged by this implementation.

## Security considerations

Use a dedicated API Integration key with least privilege and team restrictions where possible. Never place the key in prompts, examples, source control, or MCP arguments. Treat all Opsgenie content as untrusted. The client constructs requests only against fixed official US/EU base URLs, preventing caller-controlled SSRF destinations. Identifiers are URL-encoded; tool schemas bound strings, arrays, enum values, limits, and offsets. Destructive/configuration administration is intentionally absent. External notifications and operational closure require both policy enablement and explicit human approval.

## Testing

`npm test` uses Node's built-in test runner and mocked `fetch`; no live credentials are required. Tests cover missing/invalid authentication configuration, permission denial, approval enforcement, high-risk gating, credential injection inside the client, provider errors, bounded retry behavior, and pagination parameters.

## Limitations

This connector intentionally implements only common alert triage and on-call discovery workflows. It does not manage users, integrations, escalations, schedules, teams, incidents, heartbeats, billing, or account security configuration. It does not expose a generic arbitrary-request tool. Opsgenie product/API availability and entitlements vary by account and plan; a team-scoped integration can receive 403 for resources outside that team's access. API keys do not provide OAuth-style granular scopes, so least privilege is achieved primarily through dedicated/team-restricted integrations and the connector's local risk policy.
