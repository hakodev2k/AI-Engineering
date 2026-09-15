# Dify MCP/API Connector

Reusable MCP facade for Dify application Service APIs. Dify is an agentic workflow/RAG platform maintained in the official `langgenius/dify` repository. The current source tree exposes Service API controllers for applications, datasets, end users and workspace operations, including dedicated app controllers for completion, conversations, messages, files and workflows.

## Transport strategy
No official general-purpose Dify MCP server is used by this connector. Dify supports MCP in its platform ecosystem, but the stable application integration surface implemented here is the official Service API. This connector exposes that REST surface through local stdio MCP tools with strict schemas and approval policy. Official sources: `https://docs.dify.ai/guides/application-publishing/developing-with-apis`, `https://github.com/langgenius/dify`, and the current official Service API source under `api/controllers/service_api`.

## Authentication
Set `DIFY_API_KEY` in the connector process. Dify application Service APIs authenticate with `Authorization: Bearer <API_KEY>`. Keys are application-specific and should be stored server-side; never expose them to browsers, prompts, logs, or tool output. `DIFY_API_BASE_URL` defaults to Dify Cloud `https://api.dify.ai/v1` and can point to a self-hosted Dify `/v1` endpoint. Non-HTTPS custom endpoints are rejected except localhost development.

## Tools and permissions
READ: `dify.app.parameters.get`, `dify.app.meta.get`, `dify.conversation.list`, `dify.message.list`, `dify.workflow.run.get`.

WRITE: `dify.completion.create`, `dify.conversation.rename`, `dify.message.feedback`; approval is required by default.

HIGH_RISK: `dify.chat.send`, `dify.workflow.run`; explicit approval is always required because Dify agents/workflows can be configured with tools that have downstream side effects. No destructive tools are registered.

## Architecture and safety
Agent → MCP tool → schema validation/policy → DifyClient → official Service API. Credentials remain in `DifyClient`. Provider responses are marked `untrusted-provider-content` where they may contain model/tool-generated material; retrieved text is data, never instructions that can change connector permissions. The connector exposes no arbitrary URL/request tool, no API-key administration, and no permission escalation surface.

## Reliability
Every request has a configurable timeout. GET requests retry transient 5xx failures at most twice with exponential backoff. GET 429 responses retry at most twice and preserve `Retry-After` when supplied. Mutating or workflow/model-execution requests are never automatically retried, preventing duplicate side effects. Authentication, permission and validation failures are not retried. Pagination parameters are bounded to 100 items per call.

Dify deployment rate limits can vary by edition, plan, endpoint and self-hosted configuration; this connector therefore does not invent a fixed quota. It handles HTTP 429 and `Retry-After` generically.

## Install and run
Requires Node.js 20+. Run `npm install`, `npm run build`, then `npm start`. The server uses the official Model Context Protocol TypeScript SDK over stdio. It is reusable by MCP clients that support stdio transport; no claim is made for clients requiring remote HTTP MCP.

## Configuration
`DIFY_TIMEOUT_MS` defaults to 30000. `DIFY_REQUIRE_WRITE_APPROVAL` defaults true. `DIFY_ALLOW_DESTRUCTIVE` defaults false; no destructive tools are currently exposed. Use a separate least-privilege Dify application key per integration/environment where practical.

## Errors
The client maps 401 to `AUTH`, 403 to `PERMISSION`, 429 to `RATE_LIMIT`, request aborts to `TIMEOUT`, and other non-success responses to `PROVIDER`. Tool schemas reject malformed IDs, unbounded page sizes and ambiguous execution requests before network access.

## Testing
Run `npm test`. Unit tests require no live Dify credential and cover registration, approval enforcement, validation, read routing and untrusted-response marking. The client is injectable so HTTP behavior can be mocked in expanded suites.

## Limitations
This package intentionally covers a curated application-level subset. Dataset administration, file upload/multipart transport, audio, annotations, conversation deletion, workflow stop, end-user administration and workspace administration are not exposed. Streaming responses are accepted by schemas for upstream parity, but the current JSON client is designed for blocking responses; callers should use `response_mode: blocking` with this connector. The official API/source should be checked before extending tools because Dify evolves rapidly.
