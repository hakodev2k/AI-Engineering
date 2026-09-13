# Copper CRM MCP/API Connector

Reusable MCP server for Copper CRM. It exposes a curated set of CRM operations through stable MCP tool names while keeping Copper credentials inside the connector process.

## Upstream transport

Copper does not publish an official MCP server in its developer documentation as of September 2026. This connector therefore uses Copper's official REST Developer API at `https://api.copper.com/developer_api/v1` and exposes those capabilities through a local MCP stdio server.

Official sources used for implementation:

- Developer API: https://developer.copper.com/
- Authentication: https://developer.copper.com/introduction/authentication.html
- OAuth 2.0: https://developer.copper.com/introduction/oauth/index.html
- OpenAPI schema: https://developer.copper.com/v1/openapi.json
- Webhooks: https://developer.copper.com/webhooks/overview.html
- Changelog: https://developer.copper.com/introduction/changelog.html

Copper supports API-key authentication and OAuth 2.0. This reusable server implements API-key authentication because it can run non-interactively for a single Copper account. OAuth 2.0 is documented but intentionally not embedded because a reusable OAuth deployment requires an application-specific HTTPS callback, client registration, and token store. Copper currently documents a single OAuth scope, `developer/v1/all`, which grants read and modify access.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `copper.person.search` | `POST /people/search` | READ | no |
| `copper.person.get` | `GET /people/{id}` | READ | no |
| `copper.person.create` | `POST /people` | WRITE | yes |
| `copper.person.update` | `PUT /people/{id}` | WRITE | yes |
| `copper.company.search` | `POST /companies/search` | READ | no |
| `copper.company.get` | `GET /companies/{id}` | READ | no |
| `copper.company.create` | `POST /companies` | WRITE | yes |
| `copper.company.update` | `PUT /companies/{id}` | WRITE | yes |
| `copper.opportunity.search` | `POST /opportunities/search` | READ | no |
| `copper.opportunity.get` | `GET /opportunities/{id}` | READ | no |
| `copper.opportunity.create` | `POST /opportunities` | WRITE | yes |
| `copper.opportunity.update` | `PUT /opportunities/{id}` | WRITE | yes |
| `copper.project.search` | `POST /projects/search` | READ | no |
| `copper.project.get` | `GET /projects/{id}` | READ | no |
| `copper.activity.search` | `POST /activities/search` | READ | no |
| `copper.activity.create` | `POST /activities` | WRITE | yes |
| `copper.custom_field.list` | `GET /custom_field_definitions` | READ | no |
| `copper.pipeline.list` | `GET /pipelines` | READ | no |

Deletion, relationship deletion, webhook mutation, user/permission administration, and arbitrary raw API request tools are intentionally not exposed.

## Architecture

```text
MCP client
  -> MCP stdio server
    -> strict Zod tool schema
      -> permission/approval policy
        -> CopperClient
          -> credential headers
            -> api.copper.com
```

Returned Copper data is marked `untrusted_provider_content: true`. Retrieved CRM text is data, never instructions, and cannot modify the permission policy.

## Authentication

For API-key authentication Copper requires the generated API token plus the email address of the Copper user that generated it. The connector sends:

- `X-PW-AccessToken: <COPPER_API_KEY>`
- `X-PW-UserEmail: <COPPER_USER_EMAIL>`
- `X-PW-Application: developer_api`

Credentials never appear in MCP arguments or responses.

Create a local `.env` or configure the process environment from `.env.example`:

```text
COPPER_API_KEY=
COPPER_USER_EMAIL=
COPPER_BASE_URL=https://api.copper.com/developer_api/v1
COPPER_TIMEOUT_MS=15000
COPPER_MAX_RETRIES=3
COPPER_ALLOW_WRITES=false
COPPER_ALLOW_HIGH_RISK=false
```

`COPPER_BASE_URL` is host-locked to HTTPS `api.copper.com`; changing it to another host fails during startup, preventing accidental credential forwarding or SSRF-style exfiltration.

## Permission and approval model

READ tools execute automatically once authentication is configured.

WRITE tools require both:

1. operator configuration `COPPER_ALLOW_WRITES=true`; and
2. tool input `approval: "approved"` (or `approved-high-risk`).

Destructive actions are not implemented. `COPPER_ALLOW_HIGH_RISK` is reserved for future explicitly classified operations and does not enable any hidden or arbitrary endpoint.

An MCP caller cannot elevate permissions by returning content, editing records, or passing extra fields because tool schemas are provider-scoped and bounded.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
npm test
```

## Running

```bash
COPPER_API_KEY=... \
COPPER_USER_EMAIL=you@example.com \
node dist/src/server.js
```

The process uses MCP stdio transport and is suitable for MCP clients that can launch a local stdio server. Client-specific configuration syntax varies; this repository does not claim support for clients that cannot use stdio MCP servers.

## Validation

Inputs use Zod schemas with bounded string lengths, bounded arrays, positive numeric identifiers, constrained enums, and pagination limits. The connector does not accept caller-supplied URLs, HTTP methods, headers, or arbitrary endpoint paths.

Search tools expose common Copper filters rather than a generic request body. Create/update tools expose a curated subset of common mutable fields. Account-specific custom-field values can be discovered with `copper.custom_field.list`, but arbitrary custom-field mutation is intentionally not exposed in this version.

## Reliability

`CopperClient` implements:

- request timeout via `AbortController`;
- bounded retries, maximum configurable value 5;
- exponential backoff for retryable network/server failures;
- `Retry-After` preservation for HTTP 429;
- retries only for 429/500/502/503/504 and network failures;
- no blind retry for create/update requests;
- provider error mapping through `CopperError`.

The official Copper bulk APIs document an additional limit of 3 requests per second. This connector does not use the beta bulk APIs, avoiding that additional burst behavior. Copper webhook delivery has separate documented limits of 600 notifications/minute/account and 1,800 per 10 minutes/account; webhook subscription tools are not exposed here.

## Pagination

Copper search endpoints accept pagination. Tool schemas bound `page_size` to 1–200 and require `page_number >= 1`. Callers should page deliberately rather than issue wide fan-out searches.

## Security considerations

- API credentials remain inside the process.
- API destination is fixed to Copper's official HTTPS host.
- Logs do not print token values.
- No arbitrary HTTP request tool exists.
- No destructive endpoint is exposed.
- Writes require explicit operator enablement plus per-call approval.
- Provider responses are labelled untrusted content.
- Retry behavior avoids duplicating writes.
- User-controlled callback URLs/webhooks are excluded, reducing SSRF and outbound-notification risk.
- Public/external-message actions are not implemented.

Copper API keys inherit the permissions of the associated Copper user. Use a dedicated least-privilege user where practical. OAuth partner applications should request only the documented scope required by Copper; at present Copper exposes `developer/v1/all`, so application-level tool gating remains important.

## Webhooks

Copper officially supports create/update/delete webhook events for Leads, People, Companies, Opportunities, Projects, Tasks, and Activities, with up to 100 active subscriptions per account. They are documented here but deliberately omitted from this connector because creating a subscription sends data to an external callback and therefore needs deployment-specific destination allowlisting and webhook signature/verification policy.

## Tests

Normal tests require no live Copper account or credentials. They cover:

- tool registry uniqueness and risk classification;
- write approval denial/allow behavior;
- writes-disabled behavior;
- destructive-operation denial;
- authentication headers through a mocked fetch implementation;
- provider authentication/error mapping;
- rate-limit `Retry-After` preservation.

Run:

```bash
npm test
```

## Limitations

- API-key auth is implemented; OAuth authorization-code orchestration is not.
- No delete operations.
- No webhook management tools.
- No beta bulk endpoints.
- No arbitrary custom-field mutation.
- No generic raw REST passthrough.
- The server cannot bypass Copper account/user permissions; HTTP 401/403 must be resolved by the account owner.

See `examples/workflows.md` for reusable workflow examples.
