# HubSpot MCP/API Connector

Reusable MCP server exposing a narrow HubSpot CRM surface for contacts, companies, deals, and owners. Credentials stay inside the connector process and are never accepted as tool arguments or returned to the agent.

## Upstream strategy

HubSpot currently provides two official MCP offerings:

- **HubSpot MCP Server (remote)** at `https://mcp.hubspot.com`, providing CRM context and read/write access through MCP Auth Apps on the new Developer Platform.
- **Developer MCP Server (local)**, intended for building HubSpot apps and CMS assets through the HubSpot CLI.

This connector uses HubSpot's official CRM REST APIs rather than proxying the remote MCP server. The REST transport gives this reusable package a fixed allowlisted tool surface, supports both single-account static auth and OAuth refresh credentials, and keeps every write under local approval policy. The official remote MCP server was researched but is not dynamically trusted or proxied.

Official sources researched:

- MCP overview: https://developers.hubspot.com/ai-tools/mcp
- AI tooling: https://developers.hubspot.com/ai-tools
- Authentication overview: https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/overview
- OAuth quickstart: https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/oauth/oauth-quickstart-guide
- OAuth scopes: https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/scopes
- CRM Search: https://developers.hubspot.com/docs/api-reference/latest/crm/search-the-crm
- Owners API: https://developers.hubspot.com/docs/api-reference/latest/crm/owners/guide
- API limits: https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines

## Implemented tools

| Tool | Transport | Risk | Approval |
| --- | --- | --- | --- |
| `hubspot.owner.list` | REST | READ | No |
| `hubspot.contact.search` | REST | READ | No |
| `hubspot.contact.get` | REST | READ | No |
| `hubspot.contact.create` | REST | WRITE | Yes by default |
| `hubspot.contact.update` | REST | WRITE | Yes by default |
| `hubspot.company.search` | REST | READ | No |
| `hubspot.company.get` | REST | READ | No |
| `hubspot.company.create` | REST | WRITE | Yes by default |
| `hubspot.company.update` | REST | WRITE | Yes by default |
| `hubspot.deal.search` | REST | READ | No |
| `hubspot.deal.get` | REST | READ | No |
| `hubspot.deal.create` | REST | WRITE | Yes by default |
| `hubspot.deal.update` | REST | WRITE | Yes by default |

Deletion/archive, association mutation, email sending, workflow execution, billing, user provisioning, imports/exports, and arbitrary HTTP passthrough are intentionally unsupported.

## Architecture

```text
MCP client
  ↓ stdio MCP
src/server.ts
  ↓ validation + approval checks
src/client.ts
  ↓ credential provider
src/auth.ts
  ↓ HTTPS
HubSpot REST API
```

Provider-returned CRM data is untrusted content, not instructions. It cannot alter tool permissions or connector configuration.

## Authentication

Choose one mode.

### Static access token

For a single-account deployment, configure:

```text
HUBSPOT_ACCESS_TOKEN=
```

This may be a static/private app token or an externally managed OAuth access token. Store it in the process environment or a secret manager, never in prompts.

### OAuth refresh credentials

For OAuth-backed deployments, configure:

```text
HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
HUBSPOT_REFRESH_TOKEN=
```

The connector refreshes through HubSpot's current OAuth v3 token endpoint and caches the access token based on the returned `expires_in` value. Initial browser authorization and authorization-code exchange are intentionally outside this stdio server. HubSpot requires OAuth for apps distributed to multiple accounts.

## Required scopes

Grant only scopes required by enabled tools:

```text
crm.objects.contacts.read
crm.objects.contacts.write
crm.objects.companies.read
crm.objects.companies.write
crm.objects.deals.read
crm.objects.deals.write
crm.objects.owners.read
```

For read-only deployments, omit all `.write` scopes. Account permissions and product tier can still affect endpoint access.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `HUBSPOT_ACCESS_TOKEN` | — | Static token auth |
| `HUBSPOT_CLIENT_ID` | — | OAuth client ID |
| `HUBSPOT_CLIENT_SECRET` | — | OAuth client secret |
| `HUBSPOT_REFRESH_TOKEN` | — | OAuth refresh token |
| `HUBSPOT_ALLOW_WRITES` | `false` | Enables write handlers |
| `HUBSPOT_REQUIRE_APPROVAL` | `true` | Requires `approval: "APPROVE"` per write |
| `HUBSPOT_REQUEST_TIMEOUT_MS` | `15000` | Request timeout, 1–60 seconds |
| `HUBSPOT_MAX_RETRIES` | `3` | Bounded retry count, 0–5 |

## Install and run

Node.js 20+ is required.

```bash
npm install
npm run typecheck
npm run build
npm test
npm start
```

For development:

```bash
npm run dev
```

The MCP transport is stdio. Configure clients to launch the built entrypoint:

```text
node /absolute/path/to/MCP-API/hubspot/dist/src/server.js
```

Pass secrets only through the process environment.

## Search behavior

Search tools support free-text `query` and one optional bounded property filter. Supported operators are `EQ`, `NEQ`, and `CONTAINS_TOKEN`. A call returns at most 100 records, with HubSpot's `after` cursor exposed for pagination.

HubSpot's current CRM Search documentation states that search endpoints are limited to five requests per second per account, up to 200 records per page, and 10,000 total results per query. Archived objects do not appear in search results and new/updated records may take a short time to become searchable. The connector uses the smaller 100-record page limit to bound output.

## Rate limits and reliability

General HubSpot limits vary by app distribution, subscription, and add-ons. Publicly distributed OAuth apps are generally limited to 110 requests per 10 seconds per installed account, excluding CRM Search. HubSpot returns `429` when throttled; search responses do not include the normal `X-HubSpot-RateLimit-*` headers.

The client:

- retries only retryable reads and read-only search requests;
- uses bounded exponential backoff;
- honors `Retry-After` up to 10 seconds;
- retries transient 5xx responses only for retryable operations;
- never blindly retries create/update calls;
- enforces request timeouts;
- refreshes OAuth proactively from `expires_in` when using refresh credentials;
- maps auth, permission, throttling, timeout, network, provider, and upstream errors to stable prefixes.

## Permission and approval model

READ tools execute when the configured token has the required scope.

WRITE tools require both:

1. `HUBSPOT_ALLOW_WRITES=true`
2. when `HUBSPOT_REQUIRE_APPROVAL=true` (default), `approval: "APPROVE"` on that tool call

An agent cannot enable writes through tool parameters because write enablement is process configuration. Production hosts should wrap the simple approval string with their authenticated human-approval workflow if stronger proof is required.

No destructive tools are exposed.

## Validation and security

- Provider-scoped, action-oriented tool names only.
- IDs, property names, property counts, value sizes, search limits, and returned property lists are bounded.
- HTTP calls use a fixed `https://api.hubapi.com` origin; absolute URL passthrough is rejected.
- Credentials remain inside the auth layer and are never returned.
- Provider error text is bounded before surfacing.
- CRM text is treated as untrusted data to reduce prompt-injection risk.
- Writes are disabled by default.
- Newly discovered upstream MCP tools are never auto-enabled.

Stable error prefixes:

```text
CONFIG_ERROR
AUTH_ERROR
PERMISSION_DENIED
APPROVAL_REQUIRED
VALIDATION_ERROR
RATE_LIMITED
TIMEOUT
NETWORK_ERROR
PROVIDER_ERROR
UPSTREAM_ERROR
```

HubSpot correlation IDs are preserved when present for troubleshooting.

## Tests

Tests use mocked `fetch` and require no live HubSpot credentials. Coverage includes:

- missing authentication configuration;
- OAuth v3 refresh;
- write disablement and approval enforcement;
- authenticated reads;
- throttling/retry behavior;
- no blind retry for non-idempotent writes;
- provider permission errors;
- absolute-URL/SSRF rejection;
- registration of all documented MCP tool names.

Run:

```bash
npm test
npm run typecheck
npm run build
```

## Example workflows

```text
hubspot.contact.search
→ hubspot.contact.get
→ recommend changes
→ human approval
→ hubspot.contact.update
```

```text
hubspot.company.search
→ hubspot.deal.search
→ hubspot.owner.list
→ prepare deal properties
→ human approval
→ hubspot.deal.create
```

See `examples/tool-calls.md` for concrete inputs and expected response shapes.

## Limitations

- The official remote HubSpot MCP server is documented but not proxied.
- Initial OAuth authorization/code exchange is not hosted here.
- Custom object schema discovery is not implemented.
- Account-specific custom properties are accepted through validated property maps, but their names and values must already be valid in the target account.
- Pipeline/stage identifiers must already be valid for that account.
- Webhooks are not implemented because a stdio MCP server does not provide the externally reachable HTTP receiver/signature-validation lifecycle they require.
- Delete/archive operations are intentionally unavailable.
