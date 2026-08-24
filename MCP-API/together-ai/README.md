# Together AI MCP/API Connector

Reusable Model Context Protocol connector for Together AI. The connector exposes a stable MCP tool surface while calling Together AI's official REST API at `https://api.together.ai/v1`.

## Purpose

The connector supports common agent workflows around model discovery, inference, embeddings, reranking, image generation, and fine-tuning job management. It keeps the Together API key inside the connector process and never requires callers to place raw credentials in prompts or MCP arguments.

## Upstream transport

- **REST API:** used for all implemented tools.
- **Official SDKs:** Together AI publishes Python and TypeScript SDKs, but this connector uses direct REST to keep transport explicit, lightweight, and easy to mock.
- **MCP:** Together AI has publicly documented MCP support for its Code Interpreter distribution, but there is no official general-purpose Together MCP server covering the platform capabilities exposed here. This connector therefore does not depend on an unofficial upstream MCP server.

Official sources researched:

- Quickstart and authentication: https://docs.together.ai/docs/quickstart
- REST reference: https://docs.together.ai/reference
- Chat completions: https://docs.together.ai/reference/chat-completions
- Model listing: https://docs.together.ai/reference/models
- Embeddings: https://docs.together.ai/reference/embeddings
- Rerank: https://docs.together.ai/reference/rerank
- Image generation: https://docs.together.ai/reference/post-images-generations
- Fine-tuning create/list/retrieve/cancel: https://docs.together.ai/reference/post-fine-tunes, https://docs.together.ai/reference/get-fine-tunes, https://docs.together.ai/reference/get-fine-tunes-id, https://docs.together.ai/reference/post-fine-tunes-id-cancel
- Serverless rate limits: https://docs.together.ai/docs/serverless/rate-limits

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- `zod`

Install and build:

```bash
npm install
npm run build
```

Run the stdio MCP server:

```bash
npm start
```

## Authentication

Together AI uses bearer authentication with an API key. Create a project API key in Together AI and provide it only through the connector environment:

```bash
TOGETHER_API_KEY=...
```

The connector sends `Authorization: Bearer <key>` to Together AI. The key is never accepted as a tool parameter and is not returned in outputs.

Together AI documents project-scoped API keys and an account/IAM model. Use the least-privileged project/key arrangement available for the workloads this connector needs. Fine-tuning and inference can incur charges, so production deployments should additionally restrict which models and tools an agent may call.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `TOGETHER_API_KEY` | yes | none | Together AI bearer credential |
| `TOGETHER_APPROVAL_SECRET` | for approved tools | none | Secret used to validate explicit approval HMACs |
| `TOGETHER_ALLOWED_MODELS` | no | unrestricted | Comma-separated model allowlist |
| `TOGETHER_TIMEOUT_MS` | no | `30000` | Per-request timeout, 1000-120000 ms |
| `TOGETHER_MAX_RETRIES` | no | `3` | Bounded GET retry count, 0-5 |
| `TOGETHER_ENABLE_COSTING_WRITES` | no | `false` | Enables approved inference/embedding/rerank/image calls |
| `TOGETHER_ENABLE_FINE_TUNING` | no | `false` | Enables approved fine-tuning mutations |

See `.env.example` for a safe template with no credentials.

## Supported MCP tools

| Tool | Upstream | Risk | Approval | Purpose |
| --- | --- | --- | --- | --- |
| `together.model.list` | REST `GET /models` | READ | no | Discover models, types, context lengths, and pricing metadata |
| `together.chat.complete` | REST `POST /chat/completions` | WRITE | yes | Non-streaming chat completion |
| `together.embedding.create` | REST `POST /embeddings` | WRITE | yes | Create text embeddings |
| `together.rerank.create` | REST `POST /rerank` | WRITE | yes | Rank documents by query relevance |
| `together.image.generate` | REST `POST /images/generations` | WRITE | yes | Generate images |
| `together.fine_tuning.list` | REST `GET /fine-tunes` | READ | no | List fine-tuning jobs |
| `together.fine_tuning.get` | REST `GET /fine-tunes/{id}` | READ | no | Inspect a fine-tuning job |
| `together.fine_tuning.create` | REST `POST /fine-tunes` | HIGH_RISK | yes | Start a fine-tuning job from an existing file ID |
| `together.fine_tuning.cancel` | REST `POST /fine-tunes/{id}/cancel` | HIGH_RISK | yes | Cancel a running fine-tuning job |

The connector intentionally does not expose an arbitrary HTTP-request tool.

## Permission and approval model

READ tools may execute automatically. Cost-incurring inference operations are classified as WRITE because they consume account resources even though they do not mutate a persistent Together resource. They are disabled by default and require both:

1. `TOGETHER_ENABLE_COSTING_WRITES=true`.
2. A valid per-tool `approvalId`.

Fine-tuning creation/cancellation is HIGH_RISK because it can incur materially larger charges or interrupt training. These operations additionally require `TOGETHER_ENABLE_FINE_TUNING=true`.

Approval IDs are HMAC-SHA256 values over the exact tool name using `TOGETHER_APPROVAL_SECRET`. Example generation outside the LLM boundary:

```bash
node -e "const c=require('node:crypto'); console.log(c.createHmac('sha256', process.env.TOGETHER_APPROVAL_SECRET).update('together.chat.complete').digest('hex'))"
```

Do not expose the approval secret to an agent. Generate approvals in a trusted control plane or human-approval service.

## Model allowlist

Set `TOGETHER_ALLOWED_MODELS` to prevent an agent from selecting arbitrary models:

```bash
TOGETHER_ALLOWED_MODELS=Qwen/Qwen3.5-9B,Salesforce/Llama-Rank-v1
```

When configured, every tool carrying a model name fails closed if the model is not present in the allowlist.

## Reliability and rate limits

Together AI documents dynamic serverless rate limits that vary per organization and model. Exceeding the current limit can return HTTP 429; capacity pressure can return 503. The connector:

- preserves `Retry-After` on mapped API errors;
- retries only safe GET operations;
- uses exponential backoff with a configured upper bound;
- treats 429, 503, and 504 as retryable for GET requests;
- does **not** blindly retry POST operations, preventing duplicate paid inference or duplicated mutations;
- enforces request timeouts through `AbortController`.

For high-throughput inference, callers should add their own queue/concurrency control rather than using retries as traffic shaping.

## Validation and security

Inputs are validated with strict Zod constraints for lengths, enums, numeric ranges, fine-tune IDs, image dimensions, and collection sizes. Important security properties:

- credentials stay in the connector environment;
- no arbitrary URL or arbitrary REST proxy tool exists;
- model allowlisting can constrain external compute use;
- paid operations are off by default;
- fine-tuning mutations are independently disabled by default;
- retrieved/model-generated content must be treated as untrusted data, not instructions;
- tool outputs should not be promoted into system policy or permission state;
- request failures truncate provider error bodies before surfacing them;
- POST requests are not automatically retried.

The connector accepts text and JSON inputs only. It does not read arbitrary local files, fetch user-supplied URLs itself, or expose filesystem primitives, reducing SSRF and local-file-exfiltration risk.

## Error handling

`TogetherApiError` preserves HTTP status and `Retry-After` when available. Authentication/permission failures, validation failures, paid mutations, and fine-tuning operations are never retried automatically. Timeouts surface as explicit connector errors.

Common provider statuses documented by Together AI include 400, 401, 404, 429, 503, and 504 depending on endpoint.

## Examples

`examples/workflows.json` contains reusable calls with permission and approval annotations. A typical read-then-act flow is:

1. `together.model.list` to discover an allowed model and inspect pricing metadata.
2. A trusted control plane approves a specific cost-incurring operation.
3. `together.chat.complete`, `together.embedding.create`, or `together.rerank.create` executes using that approval.
4. Fine-tuning jobs are inspected with READ tools before any create/cancel action is approved.

## MCP client configuration

Any MCP client that supports stdio servers can launch the built connector. Example shape:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/together-ai/dist/src/server.js"],
  "env": {
    "TOGETHER_API_KEY": "<secret-from-secure-store>",
    "TOGETHER_ALLOWED_MODELS": "Qwen/Qwen3.5-9B",
    "TOGETHER_ENABLE_COSTING_WRITES": "false",
    "TOGETHER_ENABLE_FINE_TUNING": "false"
  }
}
```

Compatibility depends only on standards-compliant stdio MCP support; no client-specific API is required.

## Testing

Unit tests use mocked `fetch` and do not require live Together credentials:

```bash
npm test
npm run typecheck
```

Tests cover authentication configuration, environment validation, model permission denial, approval verification, disabled cost/fine-tuning policy, bearer transport, API error mapping, `Retry-After`, bounded GET retry, and no blind POST retry.

## Limitations

- Streaming chat responses are intentionally not exposed in v1 of this connector; the MCP tool returns a complete non-streaming response.
- Fine-tuning creation requires a pre-existing Together Files API file ID. This connector intentionally does not expose arbitrary local file upload.
- Fine-tuning deletion is not implemented because deletion is destructive and not required for the core workflow.
- Video, audio, clusters, containers, endpoints, account administration, billing, and code execution are not exposed.
- Together AI model availability, pricing, and rate limits are dynamic; use `together.model.list` and current Together documentation rather than hard-coding catalog assumptions.
