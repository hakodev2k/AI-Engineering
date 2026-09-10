# Contentstack MCP/API Connector

Reusable MCP stdio connector for Contentstack CMS workflows. It exposes a stable provider-scoped tool surface for content-model discovery, entries, assets, environments, workflows, publishing, and controlled deletion while keeping Contentstack credentials inside the connector process.

## Transport strategy

Contentstack provides two official MCP options in 2026:

- the Contentstack MCP Server, which can expose product groups such as CMA, CDA, Launch, Analytics, Brand Kit, Personalize, Developer Hub, and Audience Intelligence;
- MCP Profile Hub, a hosted Streamable HTTP MCP service at `https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=<profile_id>&org_uid=<org_uid>` that uses OAuth 2.1 with PKCE and derives scopes from the profile's selected tools.

Profile Hub is the preferred option for interactive clients that can complete browser OAuth and want centrally managed, narrowly curated profiles. This reusable headless connector instead uses the official Content Management REST API v3 because Management Tokens provide a deterministic service-side authentication model and allow this connector to enforce fixed schemas, local approval, bounded retry, and a deliberately small capability surface. No unofficial MCP implementation is used.

Official sources researched for this implementation:

- Contentstack MCP: https://developers.contentstack.com/contentstack-mcp
- MCP Profile Hub: https://www.contentstack.com/docs/developers/mcp-profile-hub
- Content Management API: https://www.contentstack.com/docs/developers/apis/content-management-api
- Content types: https://www.contentstack.com/docs/developers/apis/content-management-api/content-types
- Entries: https://www.contentstack.com/docs/developers/apis/content-management-api/entries
- Assets: https://www.contentstack.com/docs/developers/apis/content-management-api/assets
- Environments: https://www.contentstack.com/docs/developers/apis/content-management-api/environment
- Workflows: https://www.contentstack.com/docs/developers/apis/content-management-api/workflows
- Tokens: https://www.contentstack.com/docs/developers/apis/content-management-api/tokens

## Architecture

```text
MCP client / agent
  -> local stdio MCP server
     -> strict Zod schemas
        -> risk / approval policy
           -> credential-isolated Contentstack client
              -> official Content Management API v3
```

The model never receives the stack API key, Management Token, or approval secret. Provider responses are wrapped as `untrustedProviderData: true`; entry fields, asset metadata, workflow names, and other provider text are data, not agent instructions.

## Authentication

The Content Management API requires the stack API key plus an authorization credential. This connector supports a Contentstack **Management Token**:

```text
CONTENTSTACK_API_KEY=
CONTENTSTACK_MANAGEMENT_TOKEN=
```

Requests send the API key in the `api_key` header and the Management Token in the `authorization` header. Management Tokens provide read-write access to the stack content they are configured for. Create a dedicated token with only the environments/branches and operational permissions needed by this connector.

Contentstack also supports OAuth for CMA operations and OAuth 2.1 with PKCE in MCP Profile Hub. Interactive OAuth acquisition/refresh is intentionally delegated to OAuth-capable MCP clients rather than implemented in this headless stdio wrapper.

Relevant OAuth scopes for the implemented capability set include:

- `cm.content-types.management:read`
- `cm.entries.management:read`
- `cm.entries.management:write`
- `cm.entry:publish`
- `cm.entry:unpublish`
- `cm.assets.management:read`
- `cm.environments.management:read`
- `cm.workflows.management:read`

When using OAuth outside this wrapper, request only the scopes corresponding to enabled operations.

## Regional endpoints

Set `CONTENTSTACK_REGION` to one of:

- `aws-na` -> `https://api.contentstack.io/v3`
- `aws-eu` -> `https://eu-api.contentstack.com/v3`
- `aws-au` -> `https://au-api.contentstack.com/v3`
- `azure-na` -> `https://azure-na-api.contentstack.com/v3`
- `azure-eu` -> `https://azure-eu-api.contentstack.com/v3`
- `gcp-na` -> `https://gcp-na-api.contentstack.com/v3`
- `gcp-eu` -> `https://gcp-eu-api.contentstack.com/v3`

Arbitrary API base URLs are not accepted, reducing SSRF and credential-forwarding risk.

## Environment variables

Copy `.env.example` and supply values through a secret manager or MCP host process environment.

- `CONTENTSTACK_API_KEY` — required stack API key.
- `CONTENTSTACK_MANAGEMENT_TOKEN` — required Management Token.
- `CONTENTSTACK_REGION` — default `aws-na`.
- `CONTENTSTACK_BRANCH` — default `main`; sent through Contentstack's `branch` header.
- `CONTENTSTACK_TIMEOUT_MS` — default 15000; range 1000-120000.
- `CONTENTSTACK_MAX_RETRIES` — default 2; range 0-5; applies only to retry-safe reads.
- `CONTENTSTACK_REQUIRE_WRITE_APPROVAL` — default `true`.
- `CONTENTSTACK_ENABLE_DESTRUCTIVE` — default `false`.
- `CONTENTSTACK_APPROVAL_SECRET` — required for approval-gated operations.

## Installation

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm test
```

## Running

```bash
npm start
```

The connector exposes standard MCP over stdio. Any MCP client that can launch a local stdio server can use it. Configure credentials in the host environment rather than in prompts or tool arguments.

## Tool catalog

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `contentstack.content_type.list` | CMA REST | READ | No | List content models |
| `contentstack.content_type.get` | CMA REST | READ | No | Read one content model schema |
| `contentstack.entry.list` | CMA REST | READ | No | List entries for a content type |
| `contentstack.entry.get` | CMA REST | READ | No | Read one entry and optional publish details |
| `contentstack.entry.create` | CMA REST | WRITE | Required by default | Create a draft entry |
| `contentstack.entry.update` | CMA REST | WRITE | Required by default | Update a draft entry |
| `contentstack.entry.publish` | CMA REST | HIGH_RISK | Always | Publish to explicit environments/locales |
| `contentstack.entry.unpublish` | CMA REST | HIGH_RISK | Always | Remove published content from explicit environments/locales |
| `contentstack.entry.delete` | CMA REST | DESTRUCTIVE | Always + disabled by default | Delete one entry |
| `contentstack.asset.list` | CMA REST | READ | No | List assets |
| `contentstack.asset.get` | CMA REST | READ | No | Read asset metadata |
| `contentstack.environment.list` | CMA REST | READ | No | List publishing environments |
| `contentstack.workflow.list` | CMA REST | READ | No | Inspect stack workflows |

The connector intentionally does not expose arbitrary HTTP requests, raw API paths, token administration, organization membership changes, role mutation, stack deletion, content-type deletion, bulk destructive operations, or arbitrary upstream MCP tool discovery.

## Approval model

READ tools may execute automatically.

WRITE tools require approval by default. HIGH_RISK and DESTRUCTIVE tools always require approval. An external trusted approval component computes:

```text
HMAC-SHA256(
  CONTENTSTACK_APPROVAL_SECRET,
  "<tool-name>\n<canonical-json-payload-without-approvalToken>"
)
```

The resulting 64-character hex digest is supplied as `approvalToken`. Approval is bound to the exact tool and payload. Changing an entry UID, environment, locale, title, or any other field invalidates the approval.

`contentstack.entry.delete` additionally requires `CONTENTSTACK_ENABLE_DESTRUCTIVE=true` and `confirmEntryUid` must exactly equal `entryUid`. The agent cannot change these process-level controls through MCP.

This preserves the workflow `Read -> Recommend -> Prepare -> Human approval -> Execute`.

## Publishing safety

Publishing and unpublishing are HIGH_RISK because they alter externally served content. The connector requires explicit target environment and locale arrays and caps them at 10 environments and 50 locales per invocation, matching Contentstack's documented bulk-publishing bounds for those dimensions.

Create/update operations do not publish automatically. Agents can therefore prepare draft content, allow a reviewer to inspect it, and only then request a separate approved publish action.

## Reliability and rate limits

Contentstack currently documents default Content Management API limits of:

- 10 GET requests/second per organization;
- 10 POST/PUT/DELETE requests/second per organization;
- 1 bulk action request/second.

Limits can vary by plan. Contentstack returns HTTP 429 when throttled and exposes `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers.

The client uses a bounded timeout and retries only GET operations. HTTP 429, 502, 503, 504, and transient network failures may be retried up to `CONTENTSTACK_MAX_RETRIES` with exponential backoff; numeric `Retry-After` is honored with a bounded delay. Authentication, permission, validation, ordinary 4xx, write, publish, unpublish, and delete operations are not blindly retried.

Pagination is explicit and bounded. List tools use `skip` and `limit`, with connector-side `limit <= 100`, avoiding hidden unbounded traversal.

## Error handling

Provider errors are mapped to `ContentstackError` with HTTP status and optional retry timing. Contentstack documents common errors including 400, 401, 403, 404, 412, 422, 429, 500, 502, and 504. Credentials are never included in error output.

Validation and approval failures stop before a provider mutation is attempted. If a write fails after reaching Contentstack, the connector returns the failure rather than replaying it automatically; callers should inspect the resource state before retrying manually.

## Security considerations

- Credentials remain in the connector process and never appear in tool schemas or outputs.
- The API host is selected from an allowlisted set of official Contentstack regional hosts.
- No arbitrary request/URL tool exists.
- Tool schemas reject unknown fields and bound IDs, pagination, environments, and locales.
- Provider content is explicitly marked untrusted.
- Publish/unpublish require human approval.
- Delete is disabled by default and requires exact-ID confirmation.
- Mutations are never blindly retried.
- Retrieved content can contain prompt-injection text; it must never change connector policy, tool registration, credentials, or approval state.
- Management Tokens should be stored in a secret manager and scoped operationally to the smallest stack surface possible.

## Official MCP comparison

Contentstack's official MCP ecosystem is broad and should be preferred for interactive user workflows when the client supports its authentication model. MCP Profile Hub is especially useful because profiles expose only selected tools, derive OAuth scopes from those tools, use existing Contentstack roles, and provide hosted Streamable HTTP connectivity.

This connector does not proxy Profile Hub because Profile Hub uses interactive OAuth and profile-specific hosted endpoints. It also does not dynamically forward the full local Contentstack MCP catalog, which can include dozens of tools. For non-interactive service deployments, the fixed CMA REST allowlist gives a predictable agent contract and keeps risky operations behind local approval.

## Testing

Normal tests require no live Contentstack credentials:

```bash
npm test
```

The suite covers:

- required authentication configuration;
- safe defaults;
- regional endpoint selection;
- provider-scoped risk registration;
- exact-payload approval binding;
- destructive default denial;
- credential placement in provider headers;
- bounded retry for throttled reads;
- no blind retry for writes;
- strict tool input validation.

## Examples

See `examples/workflows.md` for discovery, draft creation, publishing, and destructive deletion examples, including approval expectations and result shapes.

## Limitations

- This package targets CMA v3 and does not expose Content Delivery API, Launch, Analytics, Brand Kit, Personalize, Developer Hub, Automations, or Audience Intelligence operations.
- Asset upload/update/delete are intentionally omitted to keep this version focused on content workflows and avoid file-ingestion/remote-URL policy complexity.
- Workflow mutation, release management, stack administration, token lifecycle, role management, billing, and organization administration are not exposed.
- Interactive OAuth token acquisition/refresh is not implemented in this stdio wrapper.
- The connector supports Management Token authentication for automation; Contentstack roles and token permissions remain authoritative.
- Contentstack can evolve endpoint behavior and plan limits; current official documentation remains the source of truth.
