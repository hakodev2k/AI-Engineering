# Honeycomb MCP/API Connector

Reusable MCP server for Honeycomb observability configuration workflows. It exposes a deliberately scoped tool surface over Honeycomb's official REST API; no arbitrary-request tool is provided.

## Upstream strategy and official sources

No official Honeycomb MCP server was identified in Honeycomb's official documentation during implementation, so all implemented capabilities use the official REST API directly. Honeycomb publishes an OpenAPI specification and documents US/EU API origins.

Official documentation:
- API introduction and OpenAPI: https://docs.honeycomb.io/api/introduction
- Authentication: https://docs.honeycomb.io/api/authentication
- Permissions: https://docs.honeycomb.io/api/permissions
- Rate limits: https://docs.honeycomb.io/api/rate-limit
- SLO API: https://docs.honeycomb.io/api/slos/get-all-slos
- Boards API: https://docs.honeycomb.io/api/boards/create-a-board

Transport: REST only. SDK transport is not used. Upstream MCP transport is not used.

## Capabilities

| Tool | Operation | Risk | Approval |
|---|---|---|---|
| `honeycomb.dataset.list` | List datasets | READ | No |
| `honeycomb.dataset.get` | Read dataset | READ | No |
| `honeycomb.dataset.create` | Create dataset | WRITE | Yes by default |
| `honeycomb.board.list` | List boards | READ | No |
| `honeycomb.board.get` | Read board | READ | No |
| `honeycomb.board.create` | Create flexible board | WRITE | Yes by default |
| `honeycomb.slo.list` | List dataset SLOs | READ | No |
| `honeycomb.slo.get` | Read SLO | READ | No |
| `honeycomb.trigger.list` | List dataset triggers | READ | No |
| `honeycomb.trigger.get` | Read trigger | READ | No |
| `honeycomb.marker.list` | List dataset markers | READ | No |
| `honeycomb.marker.create` | Create change/deployment marker | WRITE | Yes by default |

Deletion, key management, event ingestion, trigger mutation, SLO mutation, and unrestricted HTTP execution are intentionally not exposed.

## Architecture

MCP client -> strict Zod tool schema -> permission/approval policy -> Honeycomb client -> credential header -> official Honeycomb REST API. Provider responses are tagged as untrusted data so retrieved text cannot silently change permissions or connector behavior.

`src/auth.ts` validates configuration and allowlists official US/EU origins. `src/client.ts` owns credentials, timeout, retry, throttling and error mapping. `src/policy.ts` enforces approval boundaries. `src/tools.ts` defines the scoped capability surface. `src/server.ts` exposes it over MCP stdio.

## Authentication and least privilege

Set `HONEYCOMB_API_KEY` to an environment-level **Configuration Key** token. The connector sends it as `X-Honeycomb-Team`; the token is never accepted as a tool argument and is never returned to the model.

Grant only permissions required by the tools you intend to use. Honeycomb documents these relevant Configuration Key permissions: `Create Datasets`, `Manage Public Boards`, `Manage SLOs`, `Manage Triggers`, and `Manage Markers`. A read-only deployment should omit write-oriented permissions that are not needed. This connector does not require a team-level Management Key.

Environment variables:
- `HONEYCOMB_API_KEY` (required)
- `HONEYCOMB_API_BASE_URL` (`https://api.honeycomb.io` by default; EU accounts use `https://api.eu1.honeycomb.io`)
- `HONEYCOMB_TIMEOUT_MS` (default 10000, range 1000-60000)
- `HONEYCOMB_MAX_RETRIES` (default 2, range 0-4)
- `HONEYCOMB_REQUIRE_WRITE_APPROVAL` (default true)

## Install and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# export the values with your normal secret manager / process supervisor
npm run build
npm start
```

Configure any MCP client that supports a local stdio MCP server to launch `node /absolute/path/dist/server.js` with the environment variables supplied by its secret/environment mechanism. Compatibility depends on the client supporting standard MCP stdio; credentials remain in the connector process.

## Permissions and approval

READ tools may execute automatically. WRITE tools require `approved: true` when `HONEYCOMB_REQUIRE_WRITE_APPROVAL=true`. The flag can be disabled only by operator configuration outside model-controlled tool arguments. No HIGH_RISK or DESTRUCTIVE tool is exposed. The policy layer refuses DESTRUCTIVE execution if such a risk is introduced without a corresponding redesign.

## Reliability and rate limits

Every request has an AbortController timeout. GET requests retry only transient network failures, HTTP 429, and HTTP 5xx, with bounded exponential backoff. Writes are not automatically retried, avoiding duplicate mutations. Authentication, validation and permission failures are not retried. `Retry-After` is preserved in `HoneycombError` for callers. Honeycomb documents `RateLimit`/`RateLimit-Policy` headers on many endpoints and returns 429 on throttling; endpoint limits can differ. Query-result endpoints have stricter documented limits, but this connector does not expose them.

The selected list endpoints return bounded provider responses; the connector does not fan out into N+1 follow-up calls. If Honeycomb adds pagination to an exposed endpoint, callers receive the provider pagination metadata unchanged rather than the connector silently fetching an unbounded result set.

## Validation and security

Tool schemas are strict and reject unknown/unsafe identifier forms. API origin is allowlisted to Honeycomb's official US/EU hosts, preventing model-controlled SSRF. Secrets are isolated in `auth.ts`/`client.ts`, never passed in prompts or tool arguments. Provider content is untrusted and must not be interpreted as policy or instructions. Writes are approval-gated. Logs should not include environment variables or request headers. This connector does not accept webhook callbacks, so webhook-signature validation is out of scope.

## Error behavior

Provider non-2xx responses become `HoneycombError` with status and sanitized response body; 429 errors also retain `Retry-After`. Timeout becomes status 408. Invalid local configuration fails at startup. Missing/insufficient Honeycomb permissions remain provider 401/403 failures and are not retried automatically.

## Testing

```bash
npm test
```

Tests use mocked `fetch`; no live credentials are required. Coverage includes auth configuration, official-origin validation, tool registration, strict input validation, credential isolation on reads, write denial/approval, authentication errors, rate-limit metadata, and timeout handling.

## Limitations

The connector intentionally exposes only a focused subset of Honeycomb's API. It does not implement upstream MCP because no official Honeycomb MCP server was identified. It does not manage API keys, environments, billing, recipients, destructive deletion, raw events, or arbitrary REST calls. Board creation creates an empty flexible board shell; populate complex panels through separately reviewed tooling rather than accepting unrestricted nested payloads from an agent. Authentication uses Configuration Keys; Management-Key-only V2 operations are outside this connector.
