# Sentry MCP/API Connector

Reusable MCP server for Sentry operational workflows. It exposes a stable, provider-scoped tool contract and routes every implemented capability through Sentry's official Web API.

## Transport strategy

No official Sentry MCP server was found in Sentry's official API documentation during this run, so this connector does not depend on a community MCP implementation. All provider operations use Sentry's official REST/Web API under `/api/0/`.

The connector itself is an MCP server over stdio, so MCP clients call stable tools such as `sentry.issue.search` while the connector privately handles Sentry authentication, validation, rate limits, retries, and approval policy.

Official references researched:

- API reference: https://docs.sentry.io/api/
- Authentication and OAuth2/PKCE/device flow: https://docs.sentry.io/api/auth/
- Permissions/scopes: https://docs.sentry.io/api/permissions/
- Rate limits: https://docs.sentry.io/api/ratelimits/
- Organization issues: https://docs.sentry.io/api/events/list-an-organizations-issues/
- Issue retrieval/update/events: https://docs.sentry.io/api/events/
- Organization projects: https://docs.sentry.io/api/organizations/list-an-organizations-projects/
- Teams: https://docs.sentry.io/api/teams/list-an-organizations-teams/
- Replays: https://docs.sentry.io/api/replays/list-an-organizations-replays/
- Monitors/detectors: https://docs.sentry.io/api/monitors/fetch-an-organizations-monitors/
- Releases and deploys: https://docs.sentry.io/api/releases/

## Runtime

- Node.js 20+
- TypeScript
- MCP stdio transport

## Architecture

```text
MCP client
  -> Sentry connector MCP server
     -> schema validation
     -> approval / project allowlist policy
     -> credential-isolated Sentry REST client
        -> https://sentry.io/api/0/... or configured self-hosted/region endpoint
```

Sentry tokens are read only by the connector process. They are never returned from tools or inserted into model prompts.

## Authentication

Set `SENTRY_AUTH_TOKEN` to a Sentry bearer token. For reusable organization automation, Sentry recommends organization authentication tokens created through an internal integration when possible. Third-party applications may instead obtain an access token via Sentry OAuth2 authorization-code flow; Sentry documents PKCE and device authorization as well.

Use least privilege. Typical scope requirements for the implemented capabilities are:

- `org:read` for organization projects, teams, replays, and monitors where supported.
- `event:read` for issue search, issue details, and issue events.
- `event:write` for issue mutations.
- `project:read` or `project:releases` for release reads depending on endpoint.
- `project:releases`, `project:write`, `project:admin`, or `org:ci` as documented by Sentry for release/deploy writes.

Do not grant admin scopes merely to simplify setup.

## Environment variables

```text
SENTRY_AUTH_TOKEN=                 # required
SENTRY_ORG=                        # required organization slug or ID
SENTRY_BASE_URL=https://sentry.io  # optional; region/self-hosted base URL
SENTRY_ALLOWED_PROJECTS=           # optional comma-separated project slug/ID allowlist
SENTRY_REQUIRE_WRITE_APPROVAL=true
SENTRY_TIMEOUT_MS=15000
SENTRY_MAX_RETRIES=2
```

For Sentry SaaS, region-specific domains such as `https://us.sentry.io` or `https://de.sentry.io` can reduce latency when appropriate. HTTPS is required except for localhost self-hosted development.

## Installation and running

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

The server communicates over stdio and can be configured in MCP clients that support stdio MCP servers. Compatibility depends on the client's support for standard MCP stdio transport; this package does not claim provider-specific integrations beyond that protocol.

## Implemented tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `sentry.project.list` | REST | READ | No | List/search organization projects |
| `sentry.team.list` | REST | READ | No | List/search organization teams |
| `sentry.issue.search` | REST | READ | No | Search issues with Sentry query syntax |
| `sentry.issue.get` | REST | READ | No | Retrieve issue details |
| `sentry.issue.events.list` | REST | READ | No | List events for an issue |
| `sentry.issue.event.get` | REST | READ | No | Retrieve a specific/latest/oldest/recommended issue event |
| `sentry.issue.update` | REST | WRITE | Default yes | Resolve/unresolve/ignore, assign, set priority/subscription/bookmark/seen/inbox state |
| `sentry.replay.list` | REST | READ | No | List organization session replays |
| `sentry.monitor.list` | REST | READ | No | List/search monitors/detectors |
| `sentry.release.list` | REST | READ | No | List/search releases |
| `sentry.release.get` | REST | READ | No | Retrieve one release |
| `sentry.release.create` | REST | WRITE | Default yes | Create a release |
| `sentry.release.deploy.create` | REST | HIGH_RISK | Always | Record deployment metadata for a release |

Destructive issue mutations such as merge, discard, and public-share fields are intentionally not exposed. Delete endpoints are intentionally omitted.

## Approval model

READ operations can execute automatically once the caller has configured credentials and any project allowlist.

WRITE operations require `approved: true` by default. Operators can set `SENTRY_REQUIRE_WRITE_APPROVAL=false` to allow ordinary WRITE operations without the connector-level approval flag, but this does not affect HIGH_RISK operations.

`release.deploy.create` is HIGH_RISK and always requires explicit approval because it records deployment state that may be consumed by operational workflows and release analysis.

The connector does not allow tool calls or retrieved provider content to change its approval policy, credentials, base URL, or project allowlist at runtime.

## Validation and security

- Provider content is treated as untrusted data, including issue titles, stack traces, event payloads, replay metadata, and formatted event output.
- Input schemas restrict lengths, enums, list sizes, and pagination limits.
- Organization and project identifiers are validated before insertion into request paths.
- `SENTRY_ALLOWED_PROJECTS` can confine project-aware tools to an explicit set.
- The API base URL is parsed at startup and remote HTTP is rejected; only HTTPS is allowed outside localhost development.
- No generic `execute_any_request` tool is exposed.
- No delete, issue-discard, issue-merge, or issue-publication mutation is exposed.
- Tokens are never included in tool output or application-level errors.
- Non-idempotent writes are not automatically retried.

## Reliability and rate limits

Every request has a configurable timeout. GET requests may use bounded exponential-backoff retries for transient failures (`408`, `429`, `500`, `502`, `503`, `504`). Permission, validation, and ordinary authentication failures are not retried. POST/PUT writes are marked non-retryable by tool handlers to avoid duplicate or ambiguous mutations.

Sentry applies per-caller/per-endpoint request and concurrency limits. The connector exposes these response headers in output metadata when present:

- `X-Sentry-Rate-Limit-Limit`
- `X-Sentry-Rate-Limit-Remaining`
- `X-Sentry-Rate-Limit-Reset`
- `X-Sentry-Rate-Limit-ConcurrentLimit`
- `X-Sentry-Rate-Limit-ConcurrentRemaining`

Pagination is not hidden behind unbounded loops. Tools return Sentry's `Link` header so callers can explicitly request subsequent pages using a cursor, preventing accidental high-volume API scans.

## Error handling

The client surfaces sanitized HTTP status errors and Sentry `detail` messages. It distinguishes retriable transient failures from validation/auth/permission failures. Request bodies and credentials are never logged by the connector.

## Testing

Unit tests require no live Sentry account. They cover:

- missing authentication configuration
- unsafe base URLs
- write/high-risk approval denial
- tool registration
- bearer authentication behavior
- rate-limit/pagination response metadata
- non-idempotent write retry prevention
- bounded retry for throttled reads

Run:

```bash
npm test
npm run typecheck
```

## Limitations

- There is no upstream official Sentry MCP dependency in this connector; provider transport is REST only.
- OAuth browser/device token acquisition is documented by Sentry but intentionally not embedded in this stdio server; supply the resulting bearer access token through a secure environment/credential provider.
- The connector does not expose all Sentry API endpoints.
- Destructive deletion and public-sharing operations are intentionally unsupported.
- Session replay tools return replay metadata from the documented list endpoint; downloading or rendering replay payloads is outside this connector's scope.
- Sentry's Web API is currently documented as API v0; public endpoints are generally stable while beta endpoints may change.

See `examples/tool-calls.md` for complete call examples and expected permissions.
