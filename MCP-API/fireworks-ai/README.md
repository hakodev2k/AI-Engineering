# Fireworks AI MCP/API Connector

Reusable Model Context Protocol (MCP) server for selected Fireworks AI inference and account-management workflows. The connector exposes stable `fireworks.*` MCP tools while keeping the Fireworks API key inside the connector process.

## Supported upstream transport

The implemented operational upstream transport is the official Fireworks REST API.

Fireworks also publishes an official **Fireworks Docs MCP** endpoint at `https://docs.fireworks.ai/mcp`. That MCP server is designed for documentation search in coding agents; it does not expose the operational inference, account-model, response, embedding, rerank, or deployment capabilities implemented here. Under the connector transport rule, those required capabilities therefore fall back to Fireworks' official REST APIs rather than an unofficial MCP server.

Fireworks additionally documents that its Responses API can invoke external MCP/SSE tools. This connector intentionally does not expose arbitrary external MCP server forwarding because doing so would weaken SSRF and permission boundaries.

Official sources used during implementation:

- Fireworks Docs MCP: `https://docs.fireworks.ai/ecosystem/integrations/development-setup`
- API introduction/authentication: `https://docs.fireworks.ai/api-reference/introduction`
- Chat Completions: `https://docs.fireworks.ai/api-reference/post-chatcompletions`
- Completions: `https://docs.fireworks.ai/api-reference/post-completions`
- Responses API: `https://docs.fireworks.ai/guides/response-api`
- Embeddings and reranking: `https://docs.fireworks.ai/guides/querying-embeddings-models`
- List/Get Models: `https://docs.fireworks.ai/api-reference/list-models` and `https://docs.fireworks.ai/api-reference/get-model`
- List/Get/Create Deployments: `https://docs.fireworks.ai/api-reference/list-deployments`, `https://docs.fireworks.ai/api-reference/get-deployment`, `https://docs.fireworks.ai/api-reference/create-deployment`
- Serverless rate limits: `https://docs.fireworks.ai/serverless/rate-limits`
- Account quotas: `https://docs.fireworks.ai/guides/quotas_usage/account-quotas`

## Architecture

```text
MCP client / agent
        |
        v
Fireworks MCP server (stdio)
        |
        +-- validation + model allowlist
        +-- permission/risk policy
        +-- human approval gate
        +-- credential isolation
        +-- bounded timeout/retry handling
        |
        v
Official Fireworks REST API
```

The official Fireworks Docs MCP remains a separate documentation-only upstream and is not used to execute account or inference operations.

No tool accepts an arbitrary URL, arbitrary REST method, or arbitrary external MCP server. This prevents the connector from becoming a generic credential-bearing HTTP proxy or an SSRF primitive.

## Authentication

Fireworks requires an API key sent as:

```text
Authorization: Bearer <FIREWORKS_API_KEY>
```

Set the key only in the connector environment. It is never included in tool schemas or tool outputs.

Fireworks' documented API-key authentication does not use OAuth scopes for these endpoints. Provider-side access follows the permissions attached to the Fireworks credential/account. Use a dedicated key with the least account access practical for the deployment. The connector adds its own tool-level permission model and optional model allowlist.

Account-scoped tools also require `FIREWORKS_ACCOUNT_ID`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `FIREWORKS_API_KEY` | Yes | Fireworks Bearer API key. |
| `FIREWORKS_ACCOUNT_ID` | For model/deployment account tools | Account identifier used in `/v1/accounts/{account_id}/...`. |
| `FIREWORKS_ALLOWED_MODELS` | No | Comma-separated exact model identifiers allowed for inference/deployment creation. Empty means no connector-side model restriction. |
| `FIREWORKS_APPROVAL_SECRET` | For all write/high-risk tools | Secret used to verify explicit approval IDs. |
| `FIREWORKS_TIMEOUT_MS` | No | Per-request timeout, default `30000`, range 1000–120000. |
| `FIREWORKS_MAX_RETRIES` | No | Maximum GET retries, default `3`, range 0–5. POSTs are never retried automatically. |
| `FIREWORKS_MAX_INPUT_CHARS` | No | Aggregate input guard, default `200000`. |
| `FIREWORKS_MAX_DOCUMENTS` | No | Maximum embedding/rerank array size, default `100`. |

See `.env.example` for a credential-free template.

## Installation

Requirements: Node.js 20 or newer.

```bash
npm install
npm run build
```

## Running

```bash
FIREWORKS_API_KEY=... npm start
```

The server uses MCP stdio transport and can be launched by MCP clients that support spawning stdio servers. Client-specific configuration syntax varies; point the client command at `node` and the argument at this connector's compiled `dist/src/server.js`.

## Tools

| MCP tool | Upstream | Permission | Risk | Approval |
| --- | --- | --- | --- | --- |
| `fireworks.model.list` | REST | `models.read` | READ | No |
| `fireworks.model.get` | REST | `models.read` | READ | No |
| `fireworks.deployment.list` | REST | `deployments.read` | READ | No |
| `fireworks.deployment.get` | REST | `deployments.read` | READ | No |
| `fireworks.chat.create` | REST | `inference.execute` | WRITE | Yes |
| `fireworks.completion.create` | REST | `inference.execute` | WRITE | Yes |
| `fireworks.response.create` | REST | `responses.write` | WRITE | Yes |
| `fireworks.response.list` | REST | `responses.read` | READ | No |
| `fireworks.embedding.create` | REST | `inference.execute` | WRITE | Yes |
| `fireworks.rerank.create` | REST | `inference.execute` | WRITE | Yes |
| `fireworks.deployment.create` | REST | `deployments.write` | HIGH_RISK | Yes |

### Tool behavior

`fireworks.model.list` and `fireworks.deployment.list` expose bounded provider pagination (`pageSize <= 200`) and pass Fireworks page tokens through without automatically walking every page.

`fireworks.chat.create` accepts string-only system/user/assistant messages and forces non-streaming mode. It deliberately avoids unrestricted provider-specific payload forwarding.

`fireworks.completion.create` exposes the official raw text completion endpoint with bounded sampling parameters.

`fireworks.response.create` supports text input, instructions, conversation continuation, output limit, and storage preference. It intentionally does **not** expose arbitrary `tools`/`server_url` input even though the Fireworks Responses API can call external MCP/SSE servers. That omission is a security boundary against SSRF, unexpected third-party permissions, and hidden side effects.

`fireworks.embedding.create` supports a single string or bounded string array and optional dimensions.

`fireworks.rerank.create` supports bounded documents, optional top-N, and optional task text. `topN` may not exceed the number of supplied documents.

`fireworks.deployment.create` exposes only a conservative subset of the official deployment creation body. It can allocate billable dedicated capacity, so it is classified HIGH_RISK and always requires explicit approval. Destructive deployment deletion is intentionally not exposed.

## Approval model

Read tools may run automatically. Write and high-risk tools require an `approvalId` calculated outside the model from the configured approval secret:

```text
HMAC-SHA256(FIREWORKS_APPROVAL_SECRET, tool-name)
```

The connector compares approval values using a timing-safe comparison. The LLM does not receive `FIREWORKS_APPROVAL_SECRET`; an orchestration/human-approval layer should derive and inject the approval ID only after the user has approved the exact action.

This is a connector-level control, not a substitute for Fireworks account IAM, budget controls, or API-key hygiene.

## Rate limits and retries

Fireworks Serverless uses adaptive rate limiting. Official documentation describes Total Prompt TPM, Uncached Prompt TPM, Generated TPM, account-wide request-rate limits, `429 Too Many Requests`, `503 Service Overloaded`, and rate-limit response headers such as `X-Ratelimit-Limit-Tokens-Prompt`.

The connector:

- preserves `Retry-After` and known Fireworks rate-limit headers in mapped errors;
- applies bounded exponential backoff only to GET requests for 429/503/5xx/network errors;
- never blindly retries inference POSTs or deployment creation because repeated POST execution can consume tokens, store duplicate responses, or allocate billable resources;
- applies a configurable AbortController timeout to every provider request.

## Error handling

Provider non-2xx responses become `FireworksApiError` with HTTP status, a bounded provider error excerpt, `retryAfterSeconds` when present, and captured rate-limit metadata. Authentication/authorization and validation failures are not retried automatically. Timeouts produce a deterministic connector timeout error.

## Security considerations

- Provider credentials remain in the connector environment and authentication layer.
- Exact model allowlisting can be enabled with `FIREWORKS_ALLOWED_MODELS`.
- Tool schemas cap strings, arrays, output-token settings, page size, and deployment replica values.
- No generic request proxy exists.
- No arbitrary upstream MCP/SSE server forwarding is exposed.
- Provider/model output is untrusted data. MCP clients must not interpret retrieved/generated text as system instructions or permission changes.
- Logging code should never log process environment values or Authorization headers.
- `response.create` defaults `store` to `false` in this connector to reduce unintended retained conversation data.
- Deployment creation is explicitly gated because it can create ongoing infrastructure cost.
- Delete, quota modification, billing modification, API-key management, secret management, and account-administration operations are intentionally omitted.

## Real-world workflows

See `examples/workflows.json` for machine-readable examples. Typical flows include:

```text
model.list -> chat.create
embedding.create -> rerank.create
deployment.list -> deployment.get
```

For deployment provisioning, use the safer sequence:

```text
model.get -> deployment.list -> recommend configuration -> human approval -> deployment.create
```

## Testing

Tests use mocks only and require no live Fireworks credential.

```bash
npm test
npm run typecheck
```

Coverage includes authentication configuration, model allowlisting, approval enforcement, risk classification, Bearer header construction, GET throttling/retry, non-retry of POST operations, provider error mapping/Retry-After, and MCP tool registration consistency.

## Limitations

- The official Fireworks Docs MCP is documentation-search-only and is not an operational Fireworks control plane. The implemented operational capabilities use official REST APIs.
- Streaming is intentionally not exposed; MCP tool results are returned after the upstream request completes.
- Arbitrary Responses API external MCP/SSE tools are intentionally not exposed.
- Fine-tuning, datasets, routers, quota changes, billing, secrets, API-key administration, deployment update/scale/delete, and model upload/delete are not implemented.
- The connector does not discover or silently expand permissions. Adding capabilities requires explicit code/schema/policy changes.
- Fireworks model availability and rate limits can change; use `model.list`, official model documentation, and provider rate-limit headers rather than hard-coding assumptions in agents.
