# Hugging Face MCP/API Connector

Reusable MCP server for Hugging Face Hub and Inference Providers workflows. It exposes a stable provider-scoped tool contract for model, dataset and Space discovery, repository inspection, identity checks, bounded inference, repository creation, and protected deletion while keeping `HF_TOKEN` inside the connector process.

## Transport strategy

Hugging Face provides an official remote MCP server at `https://huggingface.co/mcp`. Official documentation says it can search and explore Hub resources, search documentation, schedule/run Jobs and sandboxes, and invoke MCP-compatible Gradio applications hosted on Spaces. It supports interactive login/OAuth-style setup and bearer-token configuration, and tool selection can be configured in Hugging Face MCP settings.

This connector deliberately does not blindly proxy every upstream MCP tool. It uses the official Hub REST API and Inference Providers API for a reviewed subset with deterministic schemas and explicit approval boundaries. The official MCP server remains the preferred transport for broad interactive exploration and community Space tooling; direct API calls are used here where a stable reusable agent contract and stronger mutation controls are more important.

Official sources researched on 2026-08-22:

- Hugging Face MCP Server docs: https://huggingface.co/docs/hub/agents-mcp
- Official MCP implementation: https://github.com/huggingface/hf-mcp-server
- Hub API endpoints: https://huggingface.co/docs/hub/en/api
- Hub OpenAPI: https://huggingface.co/.well-known/openapi.json
- Hub rate limits: https://huggingface.co/docs/hub/rate-limits
- Inference Providers API: https://huggingface.co/docs/inference-providers/en/tasks/index
- Chat Completion: https://huggingface.co/docs/inference-providers/tasks/chat-completion
- Responses API: https://huggingface.co/docs/inference-providers/guides/responses-api

## Runtime

- Node.js 20+
- TypeScript
- `@modelcontextprotocol/sdk`
- Native `fetch`
- stdio MCP transport for this connector

Install and verify:

```bash
npm install
npm run typecheck
npm test
npm run build
npm start
```

## Authentication and least privilege

Set `HF_TOKEN` to a fine-grained Hugging Face user access token. Prefer separate tokens per environment or agent. Grant only repository read access for discovery/read-only tools. Add `Make calls to Inference Providers` only when `huggingface.inference.chat` is enabled. Grant repository mutation permissions only when create/delete tools are required.

The official remote MCP server may also be configured directly with login flow or an `Authorization: Bearer <token>` header. This connector never puts the token in tool schemas, prompts, outputs, or example files.

## Environment variables

See `.env.example`.

- `HF_TOKEN`: required secret.
- `HF_API_BASE_URL`: defaults to `https://huggingface.co`.
- `HF_INFERENCE_BASE_URL`: defaults to `https://router.huggingface.co/v1`.
- `HF_TIMEOUT_MS`: request timeout, 1-60 seconds, default 15 seconds.
- `HF_APPROVAL_MODE`: `required` by default.
- `HF_APPROVED_ACTIONS`: comma-separated operator-approved write actions.
- `HF_ALLOW_DESTRUCTIVE`: `false` by default; additionally required for deletion.

Approval is external connector configuration, never a model-controlled tool parameter.

## Implemented tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `huggingface.model.search` | Hub REST | READ | No |
| `huggingface.model.get` | Hub REST | READ | No |
| `huggingface.dataset.search` | Hub REST | READ | No |
| `huggingface.dataset.get` | Hub REST | READ | No |
| `huggingface.space.search` | Hub REST | READ | No |
| `huggingface.space.get` | Hub REST | READ | No |
| `huggingface.repo.file.list` | Hub REST | READ | No |
| `huggingface.user.whoami` | Hub REST | READ | No |
| `huggingface.inference.chat` | Inference Providers OpenAI-compatible API | HIGH_RISK / external compute spend | Required by default |
| `huggingface.repo.create` | Hub REST | WRITE | Required by default |
| `huggingface.repo.delete` | Hub REST | DESTRUCTIVE | Required + disabled by default |

The connector intentionally excludes arbitrary repository commits/uploads, organization administration, token management, billing, moderation, endpoint administration, and generic raw-HTTP passthroughs.

## Real-world workflows

Typical agent flow:

```text
search models/datasets/Spaces
  -> inspect metadata
  -> inspect repository files
  -> optionally run approved inference
  -> optionally create a private repository
```

Repository deletion is a separate destructive capability and should not be enabled during normal discovery or inference workflows.

## Permission and approval model

```text
READ         -> automatic
WRITE        -> operator approval by default
HIGH_RISK    -> explicit operator approval
DESTRUCTIVE  -> explicit approval + HF_ALLOW_DESTRUCTIVE=true
```

Examples:

```text
HF_APPROVED_ACTIONS=huggingface.inference.chat,huggingface.repo.create
```

For deletion:

```text
HF_APPROVED_ACTIONS=huggingface.repo.delete
HF_ALLOW_DESTRUCTIVE=true
```

Remove temporary approvals after the intended operation window.

## Reliability and rate limits

Hugging Face documents separate rate-limit buckets for Hub APIs, resolver downloads, and pages, generally measured over five-minute windows. Rate-limit values depend on account tier and may change. The platform returns HTTP 429 and standardized `RateLimit` / `RateLimit-Policy` headers; some endpoints also provide `Retry-After`.

This connector:

- retries read-only GET requests at most three total attempts;
- honors `Retry-After` for throttled reads, capped to 10 seconds per wait;
- uses bounded exponential backoff for transient read network failures;
- never automatically retries POST/DELETE requests;
- applies a timeout to every request;
- bounds search result counts and inference output tokens.

Not retrying writes prevents duplicated repositories or ambiguous destructive outcomes.

## Security considerations

- `HF_TOKEN` stays in the connector process and is only attached to Hugging Face outbound requests.
- No tool can select an arbitrary origin or raw endpoint.
- There is no `execute_any_api_request` escape hatch.
- Hub metadata, model cards, dataset descriptions, Space content, generated model output, and API errors are untrusted data, not instructions.
- Retrieved content cannot modify approval state, enabled tools, scopes, or environment configuration.
- Inference is approval-gated because it can consume credits and send prompt data to the selected inference provider.
- Repository deletion is disabled by default.
- Inputs use bounded strings, arrays, result counts, token counts, and validated repository identifiers.
- For production, use fine-grained tokens and repository/org access limited to the smallest practical scope.

## Official MCP security notes

If using `https://huggingface.co/mcp` directly, prefer the official server and review the enabled tools in Hugging Face MCP settings. Community Gradio Spaces expand the effective execution surface; do not automatically trust newly enabled Space tools or treat their returned content as policy. Keep bearer credentials scoped and never forward them to unrelated MCP servers.

## Error handling

Expected error categories include:

- configuration validation errors for missing/invalid environment values;
- `APPROVAL_REQUIRED` for non-read actions without operator approval;
- `DESTRUCTIVE_DISABLED` for deletion without the separate destructive switch;
- `NETWORK_OR_TIMEOUT` after bounded transient read retries;
- `HuggingFaceApiError` carrying provider HTTP status and response details;
- MCP SDK validation errors for malformed tool inputs.

Provider errors are surfaced without intentionally including the configured token.

## Tests

Unit tests require no live Hugging Face account. They cover missing credentials, approved/denied writes, destructive-action denial, secret placement in Authorization headers, write no-retry behavior, bounded read throttling retry, authorization failures, intended tool registration, and absence of a generic raw-request tool.

Run:

```bash
npm test
```

## MCP client configuration

Any MCP client capable of launching a local stdio server can run the built connector:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/hugging-face/dist/src/server.js"],
  "env": {
    "HF_TOKEN": "provided-by-secret-manager"
  }
}
```

Clients supporting remote HTTP MCP may alternatively connect directly to Hugging Face's official `https://huggingface.co/mcp` endpoint for its broader tool catalog.

## Limitations

- This is not a complete Hugging Face API wrapper.
- The official remote MCP server is documented and preferred for broad Hub exploration, but is not transparently chained behind this connector.
- The connector exposes only one bounded chat-completion inference tool; image, audio, embedding, and other tasks are intentionally omitted until separately reviewed.
- Repository file listing is read-only; uploads/commits are intentionally omitted.
- Repository create/delete schemas expose only the fields needed by the implemented workflow.
- Provider/model availability, inference routing, pricing, and account rate limits can change independently of this connector.
