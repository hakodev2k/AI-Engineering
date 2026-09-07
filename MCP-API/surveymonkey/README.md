# SurveyMonkey MCP/API Connector

Reusable SurveyMonkey integration exposing a stable stdio MCP server for survey discovery, survey metadata, responses, collectors, analytics rollups, and webhook workflows.

## Upstream transport strategy

SurveyMonkey operates an official hosted MCP server at `https://mcp.surveymonkey.com/mcp` using OAuth 2.0. SurveyMonkey documents that the server can search, create, edit and publish surveys, inspect pages/questions, create shareable links, retrieve response data, and produce response summaries.

For this reusable connector, the official REST API v3 is the deterministic execution transport for the implemented tool contracts. SurveyMonkey's public MCP documentation describes the available capabilities but does not publish stable upstream tool identifiers or a versioned machine-readable tool contract suitable for safely pinning calls without authenticated discovery. This connector therefore does not guess tool names, silently discover new upstream tools, or proxy arbitrary MCP operations. The official MCP endpoint is recorded in `manifest.yaml` for clients that wish to connect to it directly.

Official sources researched:

- SurveyMonkey MCP Server listing: https://www.surveymonkey.com/apps/BKcduxPnkCN4NFCRokUYCw_3D_3D/details/
- SurveyMonkey LLM connector capabilities: https://help.surveymonkey.com/en/surveymonkey/integrations/llm-connectors/
- API v3 documentation: https://api.surveymonkey.com/v3/docs
- API overview and plan requirements: https://help.surveymonkey.com/en/surveymonkey/integrations/surveymonkey-api/

## Architecture

```text
MCP client
  -> strict provider-scoped tool schema
  -> risk/approval policy
  -> SurveyMonkey client
  -> OAuth bearer credential provider
  -> official SurveyMonkey REST API v3
```

Credentials remain in environment/secret storage and are inserted only into the HTTP Authorization header. Tool arguments never accept API credentials.

## Authentication

The runtime uses an OAuth 2.0 bearer access token through `SURVEYMONKEY_ACCESS_TOKEN`. For a private or draft app operating against a single account, SurveyMonkey provides an app access token. Multi-account applications should obtain tokens through SurveyMonkey's OAuth authorization flow outside this connector and inject the resulting token securely.

SurveyMonkey access is scope-based. Use the minimum set required for the enabled tools:

- `users_read`
- `surveys_read`
- `surveys_write`
- `collectors_read`
- `collectors_write`
- `responses_read_detail`
- `webhooks_read`
- `webhooks_write`

`surveys_write` and some other write scopes can require SurveyMonkey approval for public applications. Some capabilities also require a paid SurveyMonkey plan. In particular, full response-detail access and some collector operations are plan-gated.

## Environment variables

Required:

- `SURVEYMONKEY_ACCESS_TOKEN`

Optional:

- `SURVEYMONKEY_API_BASE_URL` — defaults to `https://api.surveymonkey.com/v3`; the connector also permits the official EU API hostname.
- `SURVEYMONKEY_MCP_URL` — metadata for the official hosted MCP server; defaults to `https://mcp.surveymonkey.com/mcp`.
- `SURVEYMONKEY_TIMEOUT_MS` — default `15000`.
- `SURVEYMONKEY_MAX_RETRIES` — default `3`, capped at `5`.
- `SURVEYMONKEY_ALLOW_WRITES` — default `false`.
- `SURVEYMONKEY_APPROVAL_TOKEN` — operator-controlled approval secret for WRITE/HIGH_RISK tools.

Never commit real tokens.

## Installation and running

Requires Node.js 20+.

```bash
npm install
npm run build
npm test
npm start
```

The server uses MCP stdio and can be launched by MCP clients that support local stdio servers, including compatible desktop IDE/agent hosts and custom MCP clients.

## Tool surface

| Tool | Transport | Permission | Risk | Approval |
|---|---|---|---|---|
| `surveymonkey.user.get` | REST | `users_read` | READ | no |
| `surveymonkey.survey.list` | REST | `surveys_read` | READ | no |
| `surveymonkey.survey.get` | REST | `surveys_read` | READ | no |
| `surveymonkey.survey.details.get` | REST | `surveys_read` | READ | no |
| `surveymonkey.survey.create` | REST | `surveys_write` | WRITE | yes |
| `surveymonkey.survey.update` | REST | `surveys_write` | WRITE | yes |
| `surveymonkey.page.list` | REST | `surveys_read` | READ | no |
| `surveymonkey.question.list` | REST | `surveys_read` | READ | no |
| `surveymonkey.collector.list` | REST | `collectors_read` | READ | no |
| `surveymonkey.collector.create_link` | REST | `collectors_write` | HIGH_RISK | yes |
| `surveymonkey.response.list` | REST | `responses_read_detail` | READ | no |
| `surveymonkey.response.get` | REST | `responses_read_detail` | READ | no |
| `surveymonkey.response.summary` | REST | `responses_read_detail` | READ | no |
| `surveymonkey.webhook.list` | REST | `webhooks_read` | READ | no |
| `surveymonkey.webhook.create` | REST | `webhooks_write` | HIGH_RISK | yes |

No delete operation and no unrestricted arbitrary API request are exposed.

## Permission and approval model

READ tools may execute automatically. WRITE and HIGH_RISK tools are disabled unless `SURVEYMONKEY_ALLOW_WRITES=true`, and they require the exact connector-side approval token supplied by an operator. Creating a shareable collector is HIGH_RISK because it publishes an externally usable survey URL. Creating a webhook is HIGH_RISK because it causes SurveyMonkey to transmit events to an external endpoint.

Destructive API capabilities such as deleting surveys, questions, responses, collectors, or webhooks are intentionally not registered.

## Reliability

The client uses abort-backed request timeouts and bounded exponential backoff. Only idempotent `GET`/`HEAD` operations are retried automatically. HTTP 429 and 5xx failures are retryable for reads; writes are never blindly retried. `Retry-After` is honored when supplied and capped to avoid unbounded sleep.

Pagination is surfaced explicitly. General list endpoints allow up to the provider's documented 1000-resource page size, while response-detail listing is capped by this connector at 100 records per call to reduce accidental large data exposure and token amplification.

SurveyMonkey documents draft/private app limits beginning at 120 calls per minute and a daily allocation beginning at 500 requests, while public apps can have substantially higher quotas. Exact entitlements can vary by app and plan. The connector surfaces available rate-limit headers when returned by the API.

## Error handling

The MCP server maps common provider failures into concise errors:

- 401: invalid or inactive authentication.
- 402: plan/entitlement restriction.
- 403: missing scopes, permissions, or survey access.
- 404: resource not found.
- 413: oversized survey/request.
- 429: rate limit exceeded, including Retry-After when available.
- timeout: request aborted by the connector timeout.

Provider payloads are returned as `untrusted_provider_data`. Survey titles, questions, answers, metadata, and webhook-provided content must be treated as data rather than instructions.

## Webhooks and events

SurveyMonkey's Webhooks API supports events including response creation/completion/update/deletion/disqualification/overquota, survey creation/update/deletion, collector creation/update/deletion, and app installation lifecycle events. The connector implements webhook listing and creation only.

Webhook creation requires HTTPS. SurveyMonkey requires the subscription URL to accept its validation request. Production receivers should authenticate the callback channel, enforce TLS, validate expected event shape, implement idempotency/replay defenses, and avoid treating event data as executable instructions.

## Security considerations

- Provider credentials are isolated from the model and are never tool parameters.
- The API hostname is restricted to official SurveyMonkey API hosts, reducing SSRF risk.
- Resource IDs reject path/query delimiters.
- All schemas reject unknown fields.
- Write capability is off by default.
- External publication and event delivery require explicit human approval.
- Mutations are not retried automatically.
- No generic HTTP passthrough exists.
- Retrieved provider content is untrusted.
- Do not log access tokens, approval tokens, raw authorization headers, or sensitive response content.
- OAuth `state` validation and secure token storage belong in the host authorization component when implementing a multi-account OAuth flow.

## Tests

`npm test` compiles TypeScript and executes credential-free unit tests with mocked `fetch`. Tests cover authentication configuration, official-host validation, strict tool validation, tool registration, write denial, approval enforcement, bearer-header isolation, rate-limit retry, non-retry of writes, pagination mapping, webhook validation, and request timeout behavior.

## Limitations

This connector intentionally exposes a focused 15-tool surface rather than the entire SurveyMonkey API. It does not manage contacts, email invitations, SMS collectors, workgroups, roles, team administration, survey/question deletion, response mutation, or webhook deletion. It also does not automatically proxy SurveyMonkey's hosted MCP server because stable upstream MCP tool identifiers are not published in the public capability documentation; direct clients can connect to the official endpoint separately using its OAuth flow.

Basic accounts may retrieve response details only within SurveyMonkey's documented plan limits. API access, private-app deployment, collector types, and detailed response availability can vary by plan and data residency.
