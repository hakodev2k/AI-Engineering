# Checkly MCP/API Connector

Reusable MCP server for safe Checkly reliability workflows. It exposes stable `checkly.*` tools while keeping Checkly credentials inside the connector.

## Provider and purpose

Checkly is a synthetic monitoring and reliability platform for deployed checks, check results, check sessions, alerting, status pages, private locations, and monitoring-as-code workflows. This connector focuses on live operational inspection plus a guarded, targeted check-session trigger.

## Official sources researched

- Checkly MCP Server: https://www.checklyhq.com/docs/ai/mcp-server/
- MCP setup/authentication: https://www.checklyhq.com/docs/ai/mcp-server/setup/
- MCP tool reference: https://www.checklyhq.com/docs/ai/mcp-server/tools/
- MCP security and permissions: https://www.checklyhq.com/docs/ai/mcp-server/security-and-permissions/
- Public API reference: https://www.checklyhq.com/docs/api-reference/
- List checks: https://www.checklyhq.com/docs/api-reference/checks/list-all-checks/
- Check results: https://www.checklyhq.com/docs/api-reference/check-results/lists-all-check-results/
- Check status: https://www.checklyhq.com/docs/api-reference/check-status/list-all-check-statuses/
- Error groups: https://www.checklyhq.com/docs/api-reference/error-groups/list-all-error-groups-for-a-specific-check/
- Check-session trigger v2: https://www.checklyhq.com/docs/api-reference/check-sessions/trigger-a-new-check-session-v2/
- Status pages: https://www.checklyhq.com/docs/api-reference/status-pages/retrieve-all-status-pages/
- Private locations: https://www.checklyhq.com/docs/api-reference/private-locations/list-all-private-locations/

The official remote MCP server was released in June 2026 and is available at `https://api.checklyhq.com/mcp` over Streamable HTTP. Checkly recommends OAuth for approved interactive clients; the MCP endpoint also accepts current user API keys (`cu_...`) and service API keys (`sv_...`) as bearer tokens. API-key sessions cannot use the MCP account-invite tool.

## Transport strategy

This package exposes its own MCP server over stdio.

For read workflows where the official Checkly MCP v1 has an appropriate stable tool, the connector attempts the official remote MCP first:

- `list-check-stats`
- `list-check-results`
- `get-check-result`

If one of these read-only MCP calls fails, the connector safely falls back to the corresponding official REST API operation. This fallback is intentionally limited to reads.

Other implemented read operations use the official REST API where its documented endpoint gives this connector a deterministic scoped contract. The targeted check-session trigger uses the current REST v2 endpoint. Writes are never automatically retried or automatically replayed through another transport, avoiding duplicate side effects.

Checkly's official MCP supports additional live-account functionality, including RCA, status-page incidents, account environment variables, assets, and test sessions. Those operations are not claimed or exposed here unless implemented below. For creating/editing/testing/deploying Monitoring as Code projects, Checkly explicitly recommends Checkly Skills and the Checkly CLI because the remote MCP server cannot access local project files.

## Architecture

```text
MCP client
  -> local Checkly MCP server (stdio)
     -> policy + strict Zod validation
     -> credential-isolated transports
        -> official Checkly remote MCP (selected reads)
        -> official Checkly REST API (reads + guarded trigger)
```

Files:

```text
src/config.ts        environment validation and HTTPS host allowlisting
src/policy.ts        risk/approval and identifier validation
src/client.ts        REST transport, timeout, retries, rate-limit handling
src/upstream-mcp.ts  official Checkly Streamable HTTP MCP client
src/index.ts         provider-scoped MCP tool registrations and redaction
```

## Authentication

Required environment variables:

```text
CHECKLY_API_KEY=
CHECKLY_ACCOUNT_ID=
```

The Public API authenticates with:

```text
Authorization: Bearer <api-key>
X-Checkly-Account: <account-id>
```

Current Checkly MCP documentation recognizes user API keys beginning with `cu_...` and service API keys beginning with `sv_...`. Service API keys are account-scoped and are available only on eligible plans. OAuth is preferred when connecting a supported interactive client directly to Checkly's remote MCP endpoint; this reusable non-interactive connector uses an API key supplied by its secret environment.

Do not place credentials in MCP prompts, examples, source files, or logs. The connector never includes its configured API key in tool output.

## Environment variables

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `CHECKLY_API_KEY` | yes | none | Checkly user/service API key |
| `CHECKLY_ACCOUNT_ID` | yes | none | Account context |
| `CHECKLY_API_BASE` | no | `https://api.checklyhq.com` | REST origin |
| `CHECKLY_MCP_URL` | no | `https://api.checklyhq.com/mcp` | Official remote MCP endpoint |
| `CHECKLY_MCP_ENABLED` | no | `true` | Enable MCP-first selected reads |
| `CHECKLY_REQUEST_TIMEOUT_MS` | no | `15000` | REST request timeout |
| `CHECKLY_MAX_READ_RETRIES` | no | `3` | Additional retries for safe reads, maximum 5 |
| `CHECKLY_REQUIRE_WRITE_APPROVAL` | no | `true` | Retained policy setting; high-risk operations always require approval |
| `CHECKLY_ALLOWED_API_HOSTS` | no | `api.checklyhq.com` | HTTPS host allowlist for configured upstream URLs |

## Installation and running

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

For development tests:

```bash
npm test
```

Configure any MCP client that supports a local stdio server to execute `node dist/index.js` with the required environment variables. Compatibility depends on the client supporting standard MCP stdio transport; the package does not claim product-specific features beyond that protocol contract.

## Tools

| Tool | Upstream | Risk | Approval | Purpose |
|---|---|---|---|---|
| `checkly.check.list` | MCP first, REST read fallback | READ | no | List checks with bounded filters |
| `checkly.check.get` | REST | READ | no | Retrieve one deployed check |
| `checkly.check_status.list` | REST | READ | no | Read current check status records |
| `checkly.check_result.list` | MCP first, REST read fallback | READ | no | List recent results for one check |
| `checkly.check_result.get` | MCP first, REST read fallback | READ | no | Read one result |
| `checkly.error_group.list` | REST | READ | no | List error groups for one check |
| `checkly.alert_notification.list` | REST | READ | no | List alert notification records |
| `checkly.status_page.list` | REST | READ | no | List status pages and services |
| `checkly.private_location.list` | REST | READ | no | List private locations with response redaction |
| `checkly.private_location.metrics` | REST | READ | no | Read private-location health metrics |
| `checkly.check_session.trigger` | REST v2 | HIGH_RISK | explicit human | Trigger selected deployed checks |
| `checkly.check_session.get` | REST v2 | READ | no | Read a check session |
| `checkly.check_session.completion` | REST v2 | READ | no | Read check-session completion state |

No delete, incident publishing, environment-secret write, account invite, permission change, billing, or arbitrary raw HTTP tool is exposed.

## Permission and approval model

`READ` tools may run automatically after the connector has been provisioned with valid Checkly access.

`HIGH_RISK` always requires `approved: true` from an explicit human approval step. `checkly.check_session.trigger` is high-risk because executions consume run quota and Checkly documents that standard alerting rules apply to completed runs; a failing triggered run can therefore cause external notifications.

The trigger also requires at least one `check_ids` or `match_tags` selector. Account-wide triggering through an empty selector is deliberately blocked.

The connector does not provide a mechanism for an MCP caller to increase Checkly account roles, session permissions, scopes, or upstream credentials.

## Rate limits and reliability

Checkly APIs can return `429 Too Many Requests`. The REST transport:

- reads `Retry-After` when available;
- uses bounded exponential backoff for GET requests only;
- retries only network failures, `429`, and server errors on safe reads;
- does not retry authentication, authorization, validation, or other non-retryable API failures;
- never retries POST operations automatically;
- enforces a configurable request timeout;
- limits exposed page sizes to at most 100.

Some Checkly endpoints publish their own tighter limits. For example, current documentation states private-location health metrics are limited to 300 requests per day, while some analytics endpoints have separate rolling limits. The connector does not invent a single global quota; provider `429` responses remain authoritative.

## Error handling

Provider errors are returned as MCP tool errors without credentials. The REST client maps non-success responses to a typed `ChecklyApiError` carrying the HTTP status and parsed `Retry-After` delay. Timeouts return a dedicated timeout error. Unexpected cross-origin URLs and path traversal patterns are rejected before network access.

Read-only MCP calls may fall back to REST. Write calls are not replayed through fallback transports, preventing duplicate execution if the upstream response is ambiguous.

## Security considerations

- Credentials are injected only into connector-side transport headers.
- Both configurable upstream URLs must use HTTPS and an allowlisted hostname, reducing SSRF risk.
- Tool handlers construct paths from validated identifiers; no arbitrary provider URL or generic request tool exists.
- All provider content is labeled `untrusted_data`. Retrieved Checkly data, logs, error text, status content, and remote MCP responses are data, never instructions that can change connector policy.
- Response fields with credential-like names such as `rawKey`, `token`, `apiKey`, `secret`, `password`, and `authorization` are redacted. Credentials embedded in a returned private-location proxy URL are removed.
- Checkly's remote MCP itself filters tools by session permissions and combines those permissions with account role/feature checks. This connector does not bypass those controls.
- Secret values should never be logged. Normal tests use fakes and contain no live credentials.

## MCP security notes

The connector uses only the official Checkly MCP endpoint and only a fixed allowlist of upstream MCP tool names. It does not discover and automatically expose newly added upstream tools. If Checkly adds capabilities later, this connector remains unchanged until its local contract is deliberately reviewed.

Official MCP writes are intentionally not proxied automatically here. That prevents accidental exposure of newly available writes and avoids automatic side-effect replay across transports.

## Testing

`tests/config-policy.test.ts` covers required auth configuration, official-host validation, high-risk approval, and identifier validation.

`tests/client.test.ts` uses mocked `fetch` and covers credential injection, successful reads, `429`/`Retry-After` handling, bounded read retry behavior, no retry on invalid credentials, no retry for writes, and unsafe-path rejection. No live Checkly account or credentials are required.

## Limitations

- This connector does not implement OAuth authorization-code handling; for supported interactive clients, connect directly to Checkly's official remote MCP server to use Checkly OAuth.
- Checkly's remote MCP is intentionally used only for selected documented read tools; remaining implemented operations use the Public API.
- Monitoring-as-code authoring/deployment is out of scope; use Checkly Skills and CLI for local project workflows.
- Status-page incident publishing, RCA invocation, account member invites, account environment variable writes, check creation/update/deletion, and destructive operations are deliberately not exposed.
- Provider plans, entitlements, per-endpoint quotas, and MCP permissions can restrict otherwise valid operations.

See `examples/workflows.md` for safe call examples and expected output envelopes.
