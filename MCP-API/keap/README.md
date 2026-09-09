# Keap MCP/API Connector

Reusable MCP server for selected Keap CRM workflows. The connector presents a stable MCP tool surface while calling Keap's official REST API directly. No official Keap MCP server was identified during implementation, so the transport is REST rather than an unofficial MCP dependency.

## Upstream and official sources

- Keap Developer Portal: https://developer.keap.com/
- REST API overview/authentication: https://developer.keap.com/docs/rest/1000/
- OAuth 2.0 authentication: https://developer.keap.com/authentication/
- Personal Access Tokens / Service Account Keys: https://developer.keap.com/pat-and-sak/
- API quota and throttle guidance: https://developer.keap.com/api-token-quota-and-usage-measurements/
- REST Hooks: https://developer.keap.com/rest-hook-documentation/
- REST v1 base URL: `https://api.infusionsoft.com/crm/rest/v1`
- OAuth token endpoint: `https://api.infusionsoft.com/token`

Keap also publishes REST v2 endpoints, but this connector intentionally uses the documented v1 resources needed for the implemented contact, tag, email-history, and REST Hook workflows. It does not expose arbitrary endpoint execution.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `keap.contact.list` | REST `GET /contacts` | READ | No |
| `keap.contact.get` | REST `GET /contacts/{id}` | READ | No |
| `keap.contact.create` | REST `POST /contacts` | WRITE | Configurable; required by default |
| `keap.contact.update` | REST `PATCH /contacts/{id}` | WRITE | Configurable; required by default |
| `keap.tag.list` | REST `GET /tags` | READ | No |
| `keap.tag.contacts.list` | REST `GET /tags/{tagId}/contacts` | READ | No |
| `keap.contact.tag.apply` | REST `POST /contacts/{id}/tags` | WRITE | Configurable; required by default |
| `keap.contact.tag.remove` | REST `DELETE /contacts/{id}/tags` | WRITE | Configurable; required by default |
| `keap.contact.email.list` | REST `GET /contacts/{id}/emails` | READ | No |
| `keap.webhook.list` | REST `GET /hooks` | READ | No |
| `keap.webhook.create` | REST `POST /hooks` | HIGH_RISK | Always |
| `keap.webhook.delete` | REST `DELETE /hooks/{id}` | DESTRUCTIVE | Always; disabled by default |

The connector deliberately excludes refunds because Keap's current FAQ states refunds cannot be issued through the API. It also does not expose XML-RPC or raw Data Service calls.

## Real-world workflows

Typical agent flows include: search a contact by email, inspect the contact, inspect existing tags, update the contact, apply tags that drive Keap automation, and review email history. Operations that mutate CRM state are separated from reads and pass through the permission gate.

REST Hooks support event-driven workflows without polling. Hook creation is HIGH_RISK because it causes customer data change events to be sent to an external URL. Hook deletion is DESTRUCTIVE and is disabled by default.

## Architecture

```text
MCP client
  -> stdio MCP transport
  -> src/server.ts
  -> schema validation + permission/approval policy
  -> src/client.ts
  -> credential isolation + bounded read retry / OAuth refresh
  -> Keap REST API
```

Provider responses are wrapped as `untrusted_data: true`. They must be treated as data, never as instructions capable of changing permissions, policy, or tool configuration.

## Authentication

Keap supports OAuth 2.0 bearer tokens for integrations and also Personal Access Tokens / Service Account Keys for single-application use. All are kept inside the connector process and are never tool parameters.

For OAuth, Keap currently documents the authorization-code flow and a single `full` scope. This means Keap does not offer fine-grained OAuth scopes for these REST resources; least privilege therefore depends on the Keap user/application context and choosing a PAT versus Service Account Key appropriately. A Service Account Key grants broad administrative access and should only be used when required.

Access tokens can be refreshed automatically if these variables are configured:

```text
KEAP_CLIENT_ID=
KEAP_CLIENT_SECRET=
KEAP_REFRESH_TOKEN=
```

Keap rotates refresh tokens when they are used. This connector updates the in-memory refresh token for the running process. Production deployments should supply a secure credential provider capable of persisting the newly rotated refresh token outside the LLM context.

For a PAT or Service Account Key, only `KEAP_ACCESS_TOKEN` is necessary.

## Environment variables

Copy `.env.example` and provide secrets through your runtime's secret manager.

```text
KEAP_ACCESS_TOKEN=
KEAP_CLIENT_ID=
KEAP_CLIENT_SECRET=
KEAP_REFRESH_TOKEN=
KEAP_API_BASE=https://api.infusionsoft.com/crm/rest/v1
KEAP_TOKEN_URL=https://api.infusionsoft.com/token
KEAP_REQUEST_TIMEOUT_MS=15000
KEAP_MAX_RETRIES=3
KEAP_REQUIRE_WRITE_APPROVAL=true
KEAP_DESTRUCTIVE_ENABLED=false
```

`KEAP_API_BASE` and `KEAP_TOKEN_URL` are validated to HTTPS on `api.infusionsoft.com`. This prevents a misconfigured or prompt-injected URL from forwarding credentials to an arbitrary host.

## Installation and running

Requirements: Node.js 20 or later.

```bash
npm install
npm run build
npm start
```

The server communicates over MCP stdio and can therefore be launched by MCP clients that support local stdio servers. Client-specific registration syntax varies; configure the command to execute this package's built `dist/src/server.js` output from the connector directory.

## Permission and approval model

`READ` tools can run automatically. `WRITE` tools require `approved=true` when `KEAP_REQUIRE_WRITE_APPROVAL=true`, which is the default. `HIGH_RISK` always requires explicit human approval. `DESTRUCTIVE` additionally requires `KEAP_DESTRUCTIVE_ENABLED=true` and explicit human approval.

The `approved` input is a policy assertion expected to be set only by the surrounding trusted approval layer after a human approves the exact operation. An LLM must not self-approve or silently change environment configuration to bypass policy.

## Validation and safety

The server uses strict Zod schemas for IDs, email addresses, pagination, tag arrays, webhook URLs, and write payloads. Webhook destinations must use HTTPS. There is no generic `request`, `fetch_url`, or raw endpoint tool. Provider content is labeled untrusted. Credentials are read from environment/credential-layer configuration and never returned in MCP responses.

The connector also protects against SSRF/token exfiltration by restricting configured API and token hosts to the official Keap API host.

## Reliability and error handling

All requests have bounded timeouts. Automatic retries are limited to idempotent reads (`GET`/`HEAD`) and use bounded exponential backoff for transient network failures, HTTP 429, and HTTP 5xx. `Retry-After` is honored when present, capped to avoid unbounded waiting. Permission and validation errors are not retried.

Writes (`POST`, `PATCH`, `DELETE`) are never automatically replayed after timeout, network failure, 429, or 5xx because the connector cannot safely infer whether Keap already applied the mutation. If a write encounters an expired OAuth token, the token may be refreshed, but the write is not replayed automatically; callers must verify provider state before retrying.

A read that receives one HTTP 401 can trigger OAuth refresh when client ID, client secret, and refresh token are configured. Authentication failures that still remain after refresh surface as errors rather than retry loops.

Pagination is explicit through bounded `limit` and `offset` inputs so callers control request volume.

## Current Keap rate limits

Keap's official quota page, current as researched for this connector, documents:

- OAuth2 key/secret pair: 1,500 queries/minute and 150,000/day.
- Personal Access Token or Service Account Key: 10 queries/second, 240/minute, and 30,000/day.
- Per application instance, effective June 8, 2026: 10,000 requests/minute and 250,000/day.

Keap returns quota/throttle information in response headers and may return HTTP 429 with `Retry-After`. The connector retries throttled reads conservatively and surfaces throttled writes without replaying them.

## REST Hook behavior

Keap REST Hooks are subscription resources. Event delivery occurs only after the subscription is verified. Keap documents batched delivery and retry behavior for events. The connector only manages subscriptions; it does not run an inbound webhook HTTP server and therefore does not itself implement Keap's verification callback. Your HTTPS webhook service must implement the documented verification and validate incoming requests before using event content.

## Testing

Unit tests use mocked `fetch` and do not require live Keap credentials.

```bash
npm test
```

Coverage includes authentication header isolation, official-host validation, read/write/destructive policy, throttling retry, non-retryable permission errors, and OAuth access-token refresh.

## Examples

See `examples/tool-calls.md` for MCP tool names, inputs, expected response envelope, permissions, and approval requirements.

## Limitations

- No official Keap MCP transport is used because an official Keap MCP server was not found in the official developer materials researched for this implementation.
- OAuth exposes only Keap's documented `full` scope, so the API itself cannot provide fine-grained per-tool OAuth scopes.
- Rotated refresh tokens are retained only in memory by this standalone package; production use should persist them through a secure credential service.
- This connector does not implement all Keap endpoints. In particular it excludes orders, invoices, payments, opportunities, campaigns, products, bulk messaging, XML-RPC, and arbitrary Data Service operations.
- REST Hook receiving/verification is outside the MCP server because it requires an externally reachable HTTPS application endpoint.
- Normal tests are mocked; an optional integration test should be performed against a Keap sandbox before production deployment.
