# Split.io MCP/API Connector

Reusable MCP server for Split.io feature-management workflows. The connector exposes a narrow, predictable MCP surface while calling Split's official REST API. It deliberately does not expose arbitrary HTTP execution or destructive delete/archive operations.

## Transport strategy

- External interface: MCP over stdio using `@modelcontextprotocol/sdk`.
- Upstream: official Split REST API at `https://api.split.io`.
- Official MCP status: no official Split MCP server was identified during implementation, so the connector uses the official REST API directly.

Official sources used for implementation:

- Authentication: `https://docs.split.io/reference/authentication`
- API key roles/scopes: `https://docs.split.io/reference/api-keys-overview`
- Rate limiting: `https://docs.split.io/reference/rate-limiting`
- Feature flag model: `https://docs.split.io/reference/feature-flag`
- List flags: `https://docs.split.io/reference/list-feature-flags`
- Get flag: `https://docs.split.io/reference/get-feature-flag`
- Create flag: `https://docs.split.io/reference/create-feature-flag`
- Update description: `https://docs.split.io/reference/update-feature-flag-description`
- List definitions: `https://docs.split.io/reference/list-feature-flag-definitions-in-environment`
- Get definition: `https://docs.split.io/reference/get-feature-flag-definition-in-environment`
- Create definition: `https://docs.split.io/reference/create-feature-flag-definition-in-environment`
- Partial update definition: `https://docs.split.io/reference/partial-update-feature-flag-definition-in-environment`

Split is now part of Harness. The connector supports both Split Admin API keys and Harness PAT/SAT authentication modes documented by Split.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `split.feature_flag.list` | REST | READ | none |
| `split.feature_flag.get` | REST | READ | none |
| `split.feature_flag.create` | REST | WRITE | `approved` |
| `split.feature_flag.description.update` | REST | WRITE | `approved` |
| `split.feature_flag_definition.list` | REST | READ | none |
| `split.feature_flag_definition.get` | REST | READ | none |
| `split.feature_flag_definition.create` | REST | HIGH_RISK | `approved-high-risk` |
| `split.feature_flag_definition.patch` | REST | HIGH_RISK | `approved-high-risk` |

The connector intentionally omits delete/archive and API-key-management endpoints. Destructive actions are disabled rather than being available to an agent by default.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict Zod tool schemas
  -> approval policy
  -> SplitClient
  -> credential isolation
  -> official Split REST API
```

Provider responses are marked `untrusted_provider_content: true`; returned descriptions, names, rules, comments, and metadata must never be treated as instructions that can alter connector policy.

## Authentication

Set `SPLIT_API_KEY` to one credential managed outside the model context.

`SPLIT_AUTH_MODE=bearer` sends:

```text
Authorization: Bearer <credential>
```

Use this for Split Admin API keys, as documented by Split.

`SPLIT_AUTH_MODE=x-api-key` sends:

```text
x-api-key: <credential>
```

Use this for supported Harness PAT/SAT credentials. The connector never includes both authentication headers in one request and never returns credentials to the MCP caller.

### Least privilege

Read tools require a key/token allowed to view the relevant resources. Split documents `API_ALL_GRANTED`, `API_FEATURE_FLAG_VIEWER`, and `API_FEATURE_FLAG_EDITOR` as accepted roles for the implemented read endpoints. Write operations require `API_ALL_GRANTED` or `API_FEATURE_FLAG_EDITOR` where documented. Scope can be `GLOBAL`, `WORKSPACE`, and for environment definition endpoints `ENVIRONMENT`, subject to endpoint rules and project view restrictions.

Prefer the narrowest role and scope that satisfies the tool set you actually enable.

## Environment variables

```text
SPLIT_API_KEY=
SPLIT_AUTH_MODE=bearer
SPLIT_BASE_URL=https://api.split.io
SPLIT_TIMEOUT_MS=15000
SPLIT_MAX_RETRIES=3
SPLIT_ALLOW_WRITES=false
SPLIT_ALLOW_HIGH_RISK=false
```

`SPLIT_BASE_URL` must be HTTPS, preventing accidental plaintext credential transmission. Do not place credentials in prompts, example payloads, source control, logs, or MCP tool arguments.

## Installation

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm test
```

Run the MCP server:

```bash
npm start
```

Any MCP client able to launch a stdio server can use the compiled server executable. Compatibility depends on the client supporting standard MCP stdio transport.

## Permission and approval model

READ tools execute without approval.

WRITE tools are disabled unless `SPLIT_ALLOW_WRITES=true`. Each call must also include `approval: "approved"` (or the stronger `approved-high-risk`). This prevents an agent from enabling writes merely through call arguments.

HIGH_RISK tools are disabled unless `SPLIT_ALLOW_HIGH_RISK=true`, and every invocation must carry `approval: "approved-high-risk"`. Environment definitions control live flag behavior, so creation and patching are treated as high risk even when targeting non-production environments.

DESTRUCTIVE operations are not implemented.

## Validation and safety

Tool inputs use bounded Zod schemas. Workspace IDs, flag names, environment identifiers, descriptions, pagination limits, owners, and rollout payload sizes are constrained. The JSON Patch tool accepts only `add`, `replace`, and `remove`, caps a call at 20 operations, and restricts paths to feature-definition fields such as `/killed`, `/defaultTreatment`, `/defaultRule`, `/rules`, `/treatments`, and `/trafficAllocation`. It cannot patch arbitrary provider objects or URLs.

The connector constructs URLs from a fixed configured HTTPS base and encoded path components, reducing SSRF and path-injection risk. No generic request tool is exposed.

## Pagination

List endpoints expose `offset` and `limit`; limit is capped at Split's documented maximum of 50. The connector returns a single provider page so agents can explicitly decide whether another page is necessary instead of silently causing high request volume.

## Rate limits and retries

Split documents `429` responses and these headers for `api.split.io` endpoints:

- `X-RateLimit-Remaining-Org`
- `X-RateLimit-Remaining-IP`
- `X-RateLimit-Reset-Seconds-Org`
- `X-RateLimit-Reset-Seconds-IP`

The client honors the maximum reset delay (and `Retry-After` when present). Retries are bounded by `SPLIT_MAX_RETRIES` with exponential backoff when explicit timing is unavailable.

Only GET requests are automatically retried. Writes and high-risk mutations are never blindly replayed, avoiding duplicate or unintended state changes.

## Timeout and cancellation

Every request has a configurable timeout. An external AbortSignal is propagated to the HTTP request. Timeouts and caller cancellation are reported separately. Authentication/permission failures are not retried.

## Error handling

Non-success HTTP responses become `SplitApiError` with the provider status and response body. 401/403/validation failures fail immediately. 429 and 5xx responses may be retried only for safe GET operations. Rate-limit delay metadata is preserved on `SplitApiError`.

## Real-world workflows

Common workflows supported by the connector include:

```text
List flags -> inspect flag -> inspect environment definition
```

```text
Create flag metadata -> human reviews -> configure staging definition
```

```text
Inspect production definition -> recommend rollout change -> explicit human approval -> constrained JSON Patch
```

See `examples/workflows.md` for request shapes and approval requirements.

## Testing

Unit tests require no live credentials and use mocked `fetch`. They cover tool registration, default permission denial, high-risk approval, credential isolation for both authentication modes, authentication error behavior, bounded 429 retry handling, and prevention of automatic write retries.

```bash
npm test
```

## Limitations

This connector intentionally covers a focused subset of feature-management operations rather than Split's entire API. It does not manage users, API keys, billing, permissions, segments, metrics, experiments, webhooks, or archived flags. Some Split administrative endpoints are moving into Harness; this implementation avoids deprecated API-key-management endpoints and documents the current authentication transition.

Feature-definition payloads can contain advanced Split rule structures. The connector validates the dangerous outer contract and limits mutation size, while Split remains the authoritative validator of detailed rule semantics. Provider data is always untrusted data and cannot change tool permissions, approval requirements, or connector configuration.
