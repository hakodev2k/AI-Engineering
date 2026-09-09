# fal.ai MCP/API Connector

Reusable, provider-scoped MCP connector for fal.ai. It wraps fal's official hosted MCP server behind stable tool names, strict validation, credential isolation, approval boundaries, and a fixed upstream-tool allowlist.

## Provider and purpose

fal.ai provides a large catalog of generative media and multimodal models, queue-based inference, pricing discovery, model schemas, file upload, and job lifecycle operations. This connector is designed for AI agents that need to discover suitable models, inspect schemas and pricing, submit inference safely, monitor jobs, retrieve results, cancel work, and upload remote assets without exposing raw fal credentials to the model prompt.

## Official sources researched

- Run MCP: https://fal.ai/docs/documentation/setting-up/mcp
- Model APIs overview: https://fal.ai/docs/documentation/model-apis/overview
- Queue / asynchronous inference: https://fal.ai/docs/documentation/model-apis/inference/queue
- Platform API authentication: https://fal.ai/docs/api-reference/platform-apis/authentication
- Platform APIs for models: https://fal.ai/docs/api-reference/platform-apis/for-models
- Pricing: https://fal.ai/docs/documentation/model-apis/pricing
- Webhook verification: https://fal.ai/docs/documentation/model-apis/inference/webhooks

At the time this connector was implemented, fal documents an official hosted MCP endpoint at `https://mcp.fal.ai/mcp` using Streamable HTTP and bearer-token authentication. The official Run MCP surface exposes 11 tools: `search_models`, `get_model_schema`, `get_pricing`, `search_docs`, `run_model`, `submit_job`, `check_job`, `get_job_result`, `cancel_job`, `upload_file`, and `recommend_model`.

## Transport strategy

All implemented capabilities are supported by fal's official hosted MCP server, so the connector uses that MCP transport rather than bypassing it with a custom REST implementation. The official REST/Platform APIs were checked as the fallback path: they provide model metadata, pricing, usage, analytics, queue inference, and account/platform operations, with `Authorization: Key ...` authentication. They are intentionally not used for the current tool surface because the official MCP already provides the required operations with a narrower and more maintainable contract.

The connector validates the upstream tool inventory at startup. If a required official tool disappears or the server unexpectedly changes its capabilities, startup fails safely instead of silently routing to a different or newly discovered tool.

## Architecture

```text
AI / MCP client
    |
    v
fal.ai connector (stdio)
    |
    +-- strict Zod input validation
    +-- permission / human-approval policy
    +-- fixed upstream MCP allowlist
    +-- credential isolation
    |
    v
fal official MCP (Streamable HTTP)
https://mcp.fal.ai/mcp
    |
    v
fal Model APIs / Platform
```

Provider output is wrapped with `untrusted_data: true`. Retrieved text, metadata, model descriptions, logs, or generated content must be treated as untrusted data rather than agent instructions.

## Authentication

Set `FAL_KEY` in the connector process environment. The connector forwards it only in the upstream MCP `Authorization: Bearer <key>` header. It is never registered as a tool argument, embedded in tool descriptions, or returned to the caller.

fal Platform APIs use a different documented header form (`Authorization: Key <key>`), but this connector does not currently call those APIs directly.

### Least privilege

For the implemented MCP tool set, use the minimum fal API key capability that permits model discovery and inference. fal documents API-scope and Admin-scope keys for Platform APIs; Admin scope is not required by this connector. Do not provide an Admin key unless a future connector version explicitly implements an operation that requires it.

## Environment variables

```text
FAL_KEY=
FAL_MCP_URL=https://mcp.fal.ai/mcp
FAL_REQUIRE_WRITE_APPROVAL=true
FAL_ENABLE_HIGH_RISK=false
FAL_TOOL_TIMEOUT_MS=120000
```

`FAL_MCP_URL` is intentionally restricted to HTTPS on host `mcp.fal.ai` to prevent credential-forwarding SSRF or endpoint substitution. `FAL_TOOL_TIMEOUT_MS` must be between 1 second and 15 minutes.

## Installation

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run build
```

Run the connector as an MCP stdio server:

```bash
FAL_KEY='your-key' node dist/src/server.js
```

Normal unit tests do not require live credentials:

```bash
npm test
```

## MCP client configuration

Any MCP client that can launch a local stdio server can use the built connector. Example shape:

```json
{
  "mcpServers": {
    "fal-ai-connector": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/fal-ai/dist/src/server.js"],
      "env": {
        "FAL_KEY": "${FAL_KEY}"
      }
    }
  }
}
```

Exact configuration syntax varies by MCP client. Compatibility depends on the client supporting standard local stdio MCP servers; no client-specific extension is required by this package.

## Tool list

| Tool | Purpose | Upstream | Risk | Approval |
|---|---|---|---|---|
| `fal.model.search` | Search model catalog with pagination | `search_models` | READ | No |
| `fal.model.schema.get` | Read model input/output schema | `get_model_schema` | READ | No |
| `fal.model.pricing.get` | Read current model pricing | `get_pricing` | READ | No |
| `fal.model.recommend` | Recommend models for a task | `recommend_model` | READ | No |
| `fal.docs.search` | Search fal documentation | `search_docs` | READ | No |
| `fal.model.run` | Run inference and wait for result | `run_model` | HIGH_RISK | Yes + feature enabled |
| `fal.job.submit` | Submit long-running inference | `submit_job` | HIGH_RISK | Yes + feature enabled |
| `fal.job.status.get` | Read queue/job status | `check_job` | READ | No |
| `fal.job.result.get` | Fetch completed job result | `get_job_result` | READ | No |
| `fal.job.cancel` | Request cancellation | `cancel_job` | WRITE | Yes by default |
| `fal.file.upload` | Copy a remote public HTTP(S) asset into fal CDN | `upload_file` | WRITE | Yes by default |

No arbitrary `execute_request`, raw HTTP proxy, generic API passthrough, billing mutation, API-key management, or account-permission tool is exposed.

## Permission model

### READ

Discovery, schema inspection, pricing, documentation search, status polling, and result retrieval may execute automatically.

### WRITE

Cancellation and CDN upload require `approved=true` when `FAL_REQUIRE_WRITE_APPROVAL=true` (the default). The caller must obtain real human approval before supplying this flag; the flag represents an enforcement boundary, not a user-interface confirmation mechanism.

### HIGH_RISK

Inference consumes credits and can create externally usable generated media. `fal.model.run` and `fal.job.submit` are therefore disabled by default. To execute them, both conditions are required:

1. `FAL_ENABLE_HIGH_RISK=true`
2. Tool input contains `approved=true` after explicit human approval

There are no DESTRUCTIVE tools in this version.

## Input validation and safety

- Model endpoint IDs are bounded and limited to expected identifier characters.
- Request IDs are bounded and constrained to safe identifier characters.
- Search limits are capped at 100.
- Queue convenience URLs, when supplied, must use `https://queue.fal.run` rather than arbitrary hosts.
- Remote upload URLs must use HTTP(S) and are rejected for localhost, `.local`, loopback, link-local, and common private IPv4 ranges.
- Uploaded filenames are limited to a safe filename character set.
- The upstream MCP URL cannot be redirected by configuration to a non-fal host.
- Only the 11 reviewed official fal MCP tools are callable upstream.
- Newly discovered upstream MCP tools are not automatically trusted or forwarded.

Model inputs are inherently endpoint-specific. The connector intentionally exposes a JSON object only on inference tools and directs callers to invoke `fal.model.schema.get` first. It does not pretend a single static schema can accurately validate all 1,000+ fal endpoints.

## Reliability

The connector performs an upstream capability check during startup and fails closed when required tools are absent. Every upstream tool call has a bounded local timeout configured by `FAL_TOOL_TIMEOUT_MS`.

fal's official queue is the preferred path for long-running jobs. fal documents persistent queued requests, queue status, result retrieval, cancellation, automatic infrastructure retries for qualifying failures, and webhook support. This connector delegates those provider-specific lifecycle semantics to fal's official MCP implementation instead of duplicating them incorrectly.

A local connector timeout does not guarantee cancellation of an already-submitted upstream operation. Use `fal.job.cancel` when a queued/running job must be explicitly cancelled.

## Rate limits and concurrency

fal documents that the hosted MCP server adds no separate rate limit and respects the same fal concurrency limits as direct model calls. This connector does not create polling loops internally; callers explicitly invoke `fal.job.status.get`, which avoids uncontrolled request amplification. Model-search page size is bounded.

For direct Platform API fallback in future versions, callers should preserve provider rate-limit and retry metadata rather than blindly retrying permission, validation, or authentication failures.

## Error handling

The connector returns validation and policy failures without calling fal. Typical local errors include:

- `FAL_KEY is required`
- `APPROVAL_REQUIRED`
- `HIGH_RISK_DISABLED`
- `UPSTREAM_TOOL_NOT_ALLOWED`
- `UPSTREAM_TOOL_MISSING:<name>`
- `UPSTREAM_TIMEOUT`

Authentication, provider, concurrency, model-validation, and queue errors returned by the official MCP server are passed back as provider output. Credentials are not included in connector-generated error messages.

## Security considerations

### Credential isolation

The API key remains inside the connector/upstream transport layer. Do not place `FAL_KEY` in prompts, tool arguments, examples committed to source control, or application logs.

### Prompt injection

Model metadata, documentation search results, queue logs, and generated outputs can contain untrusted strings. The connector marks all provider results as untrusted. Agent runtimes must not interpret returned provider content as policy changes, permission grants, system instructions, or authorization to invoke additional tools.

### SSRF and remote file ingestion

`fal.file.upload` is intentionally limited to public HTTP(S) source URLs and performs basic local/private-network rejection. DNS can change between validation and provider fetch, so applications with stronger network-boundary requirements should additionally enforce outbound allowlists or approved asset hosts before calling this tool.

### MCP trust boundary

The connector connects only to fal's documented official hosted MCP domain. It enumerates upstream tools and requires the exact reviewed set before serving requests. Unknown tools are never callable through this connector.

### Generated/public content

Running a model can create content that users may later publish externally. This connector treats inference as HIGH_RISK and requires explicit approval rather than assuming generation is harmless because publication is separate.

## Webhooks and events

fal supports queue-result webhooks and documents ED25519 signature verification using the JWKS endpoint at `https://rest.fal.ai/.well-known/jwks.json`, including timestamp checks to reduce replay risk. This connector does not expose a webhook receiver because receiving HTTP events requires a host application lifecycle outside a stdio MCP server. Applications that add webhook handling must verify the raw request signature before trusting payloads.

## Testing

Credential-free unit tests cover:

- missing authentication configuration
- rejection of unsafe MCP endpoint configuration
- READ permission behavior
- WRITE approval enforcement
- HIGH_RISK disable/approval behavior
- timeout-bound validation

Live integration tests are intentionally excluded from the normal test suite so CI does not require real credentials or spend fal credits.

## Limitations

- The connector does not expose every fal Platform API or Serverless/Compute account-management API.
- Usage analytics and account billing are not implemented because they are outside the selected agent workflow and may require different Platform API scopes.
- Inference input schemas are model-specific and therefore cannot be fully statically validated by this reusable wrapper; callers should fetch the official model schema first.
- The local timeout cannot abort work that the provider has already accepted; explicit job cancellation remains a separate action.
- Webhook receiving is not implemented in the stdio process.

## Example workflows

See `examples/workflows.md` for discovery, pricing, inference, queue lifecycle, cancellation, and upload examples with permission classifications.
