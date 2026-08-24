# Cohere MCP/API Connector

Reusable MCP server exposing a safety-scoped subset of Cohere's official APIs for model discovery, generation, embeddings, reranking, tokenization, and dataset discovery.

Documentation was verified against official Cohere sources on **2026-08-24**.

## Transport strategy

No official Cohere MCP server was identified in Cohere's official documentation during this run. The connector therefore uses Cohere's official HTTPS API directly and exposes its own stable MCP tool contract over stdio.

- Chat: official REST `POST /v2/chat`
- Embed: official REST `POST /v2/embed`
- Rerank: official REST `POST /v2/rerank`
- Models: official REST `GET /v1/models` and `GET /v1/models/{model}`
- Tokenize / detokenize: official REST `POST /v1/tokenize` and `POST /v1/detokenize`
- Datasets: official REST `GET /v1/datasets` and `GET /v1/datasets/{id}`

Official references:

- https://docs.cohere.com/reference/chat
- https://docs.cohere.com/reference/embed
- https://docs.cohere.com/reference/rerank
- https://docs.cohere.com/v2/reference/list-models
- https://docs.cohere.com/v2/reference/get-model
- https://docs.cohere.com/reference/tokenize
- https://docs.cohere.com/reference/detokenize
- https://docs.cohere.com/v2/reference/list-datasets
- https://docs.cohere.com/docs/rate-limits

## Architecture

```text
MCP client
  -> stdio MCP server
     -> Zod validation
     -> model allowlist / approval policy
     -> credential-isolated Cohere HTTP client
     -> https://api.cohere.com
```

The API key is read only inside the connector process. It is never included in tool output or intentionally forwarded to the LLM context.

## Authentication

Cohere API requests use bearer authentication:

```text
Authorization: Bearer <COHERE_API_KEY>
```

Create a Cohere trial or production API key in the Cohere dashboard and provide it through `COHERE_API_KEY`. This connector does not hard-code, persist, print, or return the key.

Cohere API keys do not use OAuth scopes. Least privilege is enforced at the connector layer with a model allowlist, a narrow tool surface, and approval controls for billable inference operations.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `COHERE_API_KEY` | Yes | none | Cohere bearer API key |
| `COHERE_BASE_URL` | No | `https://api.cohere.com` | API origin; HTTPS is mandatory |
| `COHERE_CLIENT_NAME` | No | `ai-engineering-mcp` | Value for `X-Client-Name` |
| `COHERE_ALLOWED_MODELS` | No | all visible models | Comma-separated model allowlist |
| `COHERE_APPROVAL_SECRET` | For write approval | none | HMAC secret used to validate approvals |
| `COHERE_REQUIRE_WRITE_APPROVAL` | No | `true` | Require approval for Chat, Embed, and Rerank |
| `COHERE_TIMEOUT_MS` | No | `30000` | Request timeout, 1,000-120,000 ms |
| `COHERE_MAX_RETRIES` | No | `2` | GET retry count, 0-5 |

Use `.env.example` as a template. Never commit real credentials.

## Installation

Requirements: Node.js 20 or newer.

```bash
cd MCP-API/cohere
npm install
npm run build
```

## Running

```bash
export COHERE_API_KEY='...'
export COHERE_APPROVAL_SECRET='...'
npm start
```

The server uses MCP stdio transport. It can be configured in MCP clients that support launching local stdio MCP servers. Compatibility depends on the client's MCP stdio support; the connector does not claim support for client-specific extensions.

## Tools

| Tool | Upstream | Risk | Approval | Purpose |
| --- | --- | --- | --- | --- |
| `cohere.model.list` | REST | READ | No | List models |
| `cohere.model.get` | REST | READ | No | Get one model's metadata |
| `cohere.chat.create` | REST v2 | WRITE | Default yes | Generate a non-streaming chat response |
| `cohere.embedding.create` | REST v2 | WRITE | Default yes | Create text embeddings |
| `cohere.rerank.create` | REST v2 | WRITE | Default yes | Rerank documents against a query |
| `cohere.tokenize.create` | REST v1 | READ | No | Convert text to model token IDs |
| `cohere.detokenize.create` | REST v1 | READ | No | Convert token IDs to text |
| `cohere.dataset.list` | REST | READ | No | List datasets |
| `cohere.dataset.get` | REST | READ | No | Read dataset metadata |

There are no arbitrary HTTP proxy tools, destructive tools, billing-management tools, model-training mutation tools, or dataset delete/create tools in this connector.

## Approval model

Chat, Embed, and Rerank consume provider compute and may incur cost. They are therefore classified as `WRITE` for policy purposes even though they do not mutate Cohere account data.

By default these tools require an approval token. The expected token is:

```text
HMAC-SHA256(COHERE_APPROVAL_SECRET, exact_tool_name)
```

For example, the approval for `cohere.rerank.create` is bound specifically to that tool name and cannot be reused as an approval for `cohere.chat.create`.

Set `COHERE_REQUIRE_WRITE_APPROVAL=false` only when the surrounding agent runtime already provides an equivalent human-approval and spending-control boundary.

## Model allowlist

Set `COHERE_ALLOWED_MODELS` to restrict agents to explicitly approved model IDs:

```text
COHERE_ALLOWED_MODELS=command-a-03-2025,embed-v4.0,rerank-v4.0-pro
```

When configured, all tools that accept a model reject model IDs outside the allowlist. This prevents an agent from silently switching to a newly discovered or more expensive model.

## Validation and safety

Inputs use strict bounds intended to prevent ambiguous or unexpectedly large calls:

- Chat accepts only `system`, `user`, and `assistant` messages; arbitrary provider tool calls are not exposed.
- Embed accepts 1-96 text inputs, matching Cohere's documented text-input limit.
- Rerank accepts at most 1,000 documents, matching Cohere's documented recommendation boundary, and validates `topN` against document count.
- Dataset IDs are restricted to a conservative identifier character set.
- The configured API base URL must use HTTPS.
- Provider responses and documents are treated as untrusted data; they are returned as content, not interpreted as connector policy or instructions.

## Reliability and errors

The client enforces request timeouts and maps non-2xx responses to `CohereError`, retaining HTTP status, `Retry-After` when supplied, and `x-request-id` when supplied.

Automatic retry is intentionally asymmetric:

- `GET` operations may retry 429 and 5xx responses with bounded exponential backoff or `Retry-After`.
- Billable `POST` inference/utility calls are **not automatically retried**. This avoids duplicate inference charges or duplicate work when the provider has processed a request but the response is lost.
- Authentication, authorization, validation, and other provider errors are not blindly retried.

## Rate limits

Cohere documents different limits for trial and production keys and some limits vary by model. As verified on 2026-08-24, examples include:

- Chat: commonly 20 requests/minute for trial keys; many established production Chat models are documented at 500 requests/minute, while newer models may require contacting Cohere for production limits.
- Embed: 2,000 text inputs/minute for trial and production keys.
- Rerank: 10 requests/minute for trial keys and 1,000 requests/minute for production keys.
- Tokenize: 100 requests/minute for trial keys and 2,000 requests/minute for production keys.
- Trial keys and production keys on certain newer models may also have monthly call limits.

Treat Cohere's current rate-limit page as authoritative because provider limits can change.

## Usage examples

See `examples/workflows.json` for machine-readable examples containing the tool name, input, expected output shape, permission class, and approval requirement.

Typical RAG workflow:

```text
cohere.embedding.create
  -> store/search vectors in your vector database
  -> cohere.rerank.create
  -> cohere.chat.create with selected documents
```

The connector intentionally does not couple Cohere to a particular vector database, project, tenant, repository, or application.

## Testing

Unit tests do not require live Cohere credentials.

```bash
npm test
npm run typecheck
```

Tests cover authentication configuration, HTTPS enforcement, model permission denial, approval enforcement, credential isolation in HTTP headers, provider error mapping, `Retry-After`, prevention of automatic retries for billable POST calls, scoped MCP tool registration, and absence of an arbitrary raw-request tool.

## Security considerations

- Keep `COHERE_API_KEY` and `COHERE_APPROVAL_SECRET` in an OS secret store, deployment secret manager, or protected environment configuration.
- Do not put credentials in prompts, tool arguments, examples, source control, telemetry, or logs.
- Restrict `COHERE_ALLOWED_MODELS` in production to control cost and capability expansion.
- Treat retrieved/provider-supplied content as untrusted data and defend the calling agent against prompt injection.
- Review Cohere account usage and rate limits independently of agent approval controls.
- This connector exposes no endpoint for changing account roles, API keys, billing, or permissions.

## Limitations

- No official Cohere MCP upstream was identified, so upstream transport is REST only.
- Chat streaming is not exposed; the stable MCP tool returns a complete non-streaming response.
- Image/multimodal Embed inputs are intentionally omitted to keep payload size and validation bounded; text embeddings are supported.
- Cohere fine-tuning mutation operations and deprecated Classify APIs are not exposed.
- Dataset mutation and deletion are not exposed.
- The connector does not refresh credentials because Cohere API keys are static bearer credentials rather than OAuth refresh-token credentials.
