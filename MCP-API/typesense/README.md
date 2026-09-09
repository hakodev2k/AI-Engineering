# Typesense MCP/API Connector

Reusable local MCP server that exposes a constrained set of Typesense search/index operations through the official Typesense REST API.

## Upstream strategy

No official Typesense MCP server was identified in the Typesense documentation reviewed for this connector. The connector therefore uses the official REST API and presents stable provider-scoped MCP tools over stdio. Typesense documents every indexed record as a Document inside a Collection and exposes collection, document, search, export and API-key endpoints over HTTP.

Official references reviewed (Typesense 30.2/current documentation as of 2026-09-09):

- Collections: https://typesense.org/docs/30.2/api/collections.html
- Documents: https://typesense.org/docs/30.2/api/documents.html
- Search: https://typesense.org/docs/30.2/api/search.html
- API keys/access control: https://typesense.org/docs/30.2/api/api-keys.html
- Data access control: https://typesense.org/docs/guide/data-access-control.html

The documented API uses `X-TYPESENSE-API-KEY`. Typesense supports fine-grained keys restricted by actions and collections. Do not use the bootstrap/admin key in production; create the smallest key needed by the enabled workflows.

## Capabilities

| Tool | Transport | Risk | Typesense action | Approval |
|---|---|---|---|---|
| `typesense.health.get` | REST | READ | `health:get` | No |
| `typesense.collection.list` | REST | READ | `collections:get` | No |
| `typesense.collection.get` | REST | READ | `collections:get` | No |
| `typesense.collection.create` | REST | WRITE | `collections:create` | Configurable, default yes |
| `typesense.document.search` | REST | READ | `documents:search` | No |
| `typesense.document.get` | REST | READ | `documents:get` | No |
| `typesense.document.export` | REST | READ | `documents:export` | No |
| `typesense.document.create` | REST | WRITE | `documents:create` | Configurable, default yes |
| `typesense.document.update` | REST | WRITE | `documents:update` | Configurable, default yes |
| `typesense.document.delete` | REST | DESTRUCTIVE | `documents:delete` | Explicit; disabled by default |

The connector deliberately does not expose arbitrary REST requests, API-key creation/deletion, collection deletion/truncation, bulk delete-by-query, or unrestricted schema alteration. Those surfaces either expand authority or can cause broad irreversible effects.

## Architecture

`src/config.ts` validates configuration and an outbound host allowlist. `src/client.ts` owns credentials, HTTP transport, timeout/error handling and bounded read retries. `src/policy.ts` enforces risk approvals. `src/tools.ts` defines strict MCP-facing operations and schemas. `src/server.ts` registers them on a stdio MCP server. Provider responses are wrapped with `untrusted_data: true` so retrieved content is never treated as instructions or authority.

Credentials remain inside the connector:

```text
Agent -> MCP tool -> connector -> X-TYPESENSE-API-KEY -> Typesense
```

Raw API keys are never returned to the MCP caller or included in tool output.

## Authentication and least privilege

Set `TYPESENSE_API_KEY` to a Typesense key scoped to only the actions and collections required. For a read-only search agent, a key such as `documents:search` on selected collections is preferable to a broad key. If collection inspection, document reads/exports, or writes are required, add only those documented actions.

Typesense supports collection regex restrictions and scoped search keys. A scoped search key can enforce embedded filters for multi-tenant search. Never expose a parent search key or bootstrap key to a client/LLM.

## Environment

Copy `.env.example` into your secret-management workflow; do not commit populated values.

- `TYPESENSE_HOST`: Typesense node/load-balancer base URL, without an API path.
- `TYPESENSE_API_KEY`: fine-grained provider API key.
- `TYPESENSE_ALLOWED_HOSTS`: comma-separated exact hostnames allowed for outbound requests. Required for non-local hosts.
- `TYPESENSE_REQUEST_TIMEOUT_MS`: 1,000–120,000 ms; default 15,000.
- `TYPESENSE_MAX_READ_RETRIES`: 0–5; default 3.
- `TYPESENSE_REQUIRE_WRITE_APPROVAL`: default `true`.
- `TYPESENSE_DESTRUCTIVE_ENABLED`: default `false`.

HTTPS is required except for explicit localhost development. The host allowlist reduces SSRF risk when configuration is influenced by deployment tooling.

## Install and run

```bash
npm install
npm run build
npm start
```

For local development:

```bash
npm run dev
npm test
```

The process speaks MCP over stdio and can be launched by clients that support standard local stdio MCP servers. Configure environment variables in the MCP client's process configuration rather than prompts.

## Tool validation

Collection identifiers are limited to letters, digits, underscore, period and hyphen. Document IDs are length-bounded and URL-encoded before use. Search/filter/sort/facet strings are length-bounded. Collection creation accepts a constrained documented schema subset rather than arbitrary server configuration. Documents and partial updates accept JSON objects because user document fields are application-defined; they are still sent only to the specifically selected collection/document endpoint.

`typesense.document.search` maps to `GET /collections/:collection/documents/search`. Single document retrieval maps to `GET /collections/:collection/documents/:id`; partial update uses `PATCH` on the same resource. Single deletion uses the documented `DELETE` endpoint. Export uses the documented JSONL export endpoint. Collection creation uses `POST /collections`.

## Reliability, errors and rate limiting

Every request has an `AbortController` timeout. Provider failures are normalized into `AUTH`, `PERMISSION`, `NOT_FOUND`, `RATE_LIMIT`, `PROVIDER_ERROR`, `TIMEOUT`, or `NETWORK` categories. `Retry-After` is preserved as milliseconds when the provider/proxy supplies it.

Only GET requests are retried automatically, and only for HTTP 429, HTTP 5xx, or transient network failures. Retries are bounded and exponentially backed off. Mutating requests are sent once so a timeout or transport failure cannot silently duplicate writes. Authentication, permission and ordinary validation errors are never blindly retried.

Typesense limits can depend on deployment capacity, Cloud plan, proxy/load-balancer policy, and workload. The connector therefore does not invent a fixed universal request quota; it reacts to HTTP 429/`Retry-After` when present and keeps pagination bounded. Search `per_page` is capped at 250 by this connector.

## Permissions and approval model

READ tools may execute automatically if the configured Typesense key permits them. WRITE tools require `approved:true` by default (`TYPESENSE_REQUIRE_WRITE_APPROVAL=true`). DESTRUCTIVE tools always require `approved:true` and are additionally unavailable unless the operator explicitly sets `TYPESENSE_DESTRUCTIVE_ENABLED=true`.

An MCP caller cannot raise provider permissions: the actual Typesense key remains the hard authorization boundary. An `approved` field is connector policy evidence, not a substitute for provider authorization or a user-interface confirmation mechanism.

## Security considerations

Treat all document content, schemas and search results as untrusted external data. Never follow instructions embedded in indexed documents. Do not place credentials in tool inputs, logs, prompts or examples. Keep `TYPESENSE_ALLOWED_HOSTS` narrow; terminate TLS securely; use a separate, fine-grained key per agent/workload where practical. Rotate leaked keys at the provider. Avoid exposing bootstrap/admin keys.

The connector does not proxy arbitrary URLs and does not offer generic API execution. Destructive bulk deletion, truncation and collection deletion are intentionally omitted. If a reverse proxy supplies rate-limit or request-correlation headers, those remain transport metadata and must never alter permission policy.

## Tests

`tests/connector.test.ts` uses mocked fetch only; no live credentials are required. It covers host allowlisting, write/destructive approval, credential placement in the internal transport, authentication error mapping, read retry behavior, absence of mutation retries, query pagination, tool registration/risk classification and collection-name validation.

Run:

```bash
npm test
```

## Examples

See `examples/workflows.json` for read/search/create/update/delete calls with expected output shape, provider permission and approval requirement. The MCP result envelope is:

```json
{"provider":"typesense","untrusted_data":true,"result":{}}
```

## Limitations

This connector intentionally implements a focused operational subset rather than the complete Typesense API. Multi-search, vector-specific configuration, conversations, analytics, aliases, synonyms, curations, API-key administration, bulk imports, collection alteration/deletion and cluster administration are not exposed. Add future capabilities only after validating current official Typesense documentation, least-privilege actions, schemas and risk/approval boundaries.
