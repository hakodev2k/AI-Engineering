# Apollo.io MCP/API Connector

Reusable, safety-oriented connector for Apollo.io GTM workflows.

## Transport strategy
Apollo provides an official remote MCP server at `https://mcp.apollo.io/mcp` using Streamable HTTP and OAuth 2.0. Interactive MCP clients should prefer that first-party server. This package also supplies a local MCP facade backed by Apollo's official REST API for controlled/headless workflows and stable tool contracts. Apollo documents that headless MCP authentication with an API credential requires a master credential; prefer OAuth whenever a browser flow is possible because master credentials are workspace-level and powerful.

Official sources researched: Apollo MCP (`https://docs.apollo.io/docs/apollo-mcp`), API reference (`https://docs.apollo.io/reference`), authentication documentation, and rate limits (`https://docs.apollo.io/reference/rate-limits`). Apollo states limits are per team, per endpoint, and can apply simultaneously per minute/hour/day; exact limits depend on plan. The usage endpoint can report workspace limits.

## Capabilities
Implemented REST-backed MCP tools: `apollo.people.search`, `apollo.people.enrich`, `apollo.organization.search`, `apollo.contact.create`, `apollo.contact.update`, `apollo.sequence.list`, `apollo.sequence.enroll`, `apollo.task.list`, and `apollo.usage.read`. Apollo's official remote MCP additionally supports prospect/company search, enrichment, record creation/update, sequence management, tasks and performance analysis; clients needing the broadest first-party surface should connect directly to it.

## Architecture and security
The agent calls narrow MCP tools; credentials stay in the connector process. Provider output is explicitly marked `untrustedProviderData` and must never be interpreted as instructions. There is no arbitrary URL/request tool, limiting SSRF and permission-expansion paths. Inputs are schema validated. Network requests have cancellation timeouts. Retries are bounded and restricted to throttling/server failures; authentication, authorization and validation failures are not retried. `Retry-After` is honored with a bounded wait.

Risk model: READ operations may run automatically. WRITE operations require deployment approval. Sequence enrollment is HIGH_RISK because it can initiate external outreach and additionally requires `approved: true`. No delete, billing, permission-management, or other destructive tools are exposed.

## Authentication
For official remote MCP, use OAuth 2.0 and the user's Apollo permissions. For this local REST facade set `APOLLO_API_KEY` through a secret manager/environment; never put it in prompts, source control, logs, or examples. Configure the narrowest Apollo API access that supports the endpoints you use. Apollo's remote MCP API-key mode is different: Apollo documents that it requires a master key, which should be treated like a password and avoided when OAuth is possible.

Environment: `APOLLO_API_KEY`, `APOLLO_APPROVE_WRITES=false`, `APOLLO_TIMEOUT_MS=15000`, `APOLLO_MAX_RETRIES=2`.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm test
npm start
```

The local server uses MCP stdio, making it suitable for MCP clients that can launch a local command. Clients supporting remote Streamable HTTP and OAuth should generally configure Apollo's official MCP endpoint directly instead.

## Permissions and approval
`people.search`, `people.enrich`, `organization.search`, `sequence.list`, `task.list`, `usage.read`: READ. `contact.create`, `contact.update`: WRITE and approval-gated. `sequence.enroll`: HIGH_RISK and always requires explicit `approved: true`. `APOLLO_APPROVE_WRITES=true` is a deployment policy switch for ordinary WRITE tools; it does not bypass the explicit sequence-enrollment approval field.

## Reliability and rate limits
The REST client parses Apollo rate-limit response headers when present and surfaces them to callers. HTTP 429 and 5xx responses receive bounded exponential/backoff-style retries; `Retry-After` takes precedence. Calls time out using `AbortController`. Pagination inputs are bounded to prevent accidental high-volume scans. Credit-consuming actions remain subject to the Apollo account's credits and plan.

## Testing
`npm test` uses mocked HTTP only; live Apollo credentials are not required. Tests cover registration, validation, approval denial, successful reads, provider errors, and bounded throttling retry.

## Limitations
The package intentionally exposes a curated surface rather than every Apollo endpoint. It does not implement OAuth itself; OAuth is delegated to Apollo's official remote MCP server. REST endpoint availability, credits, scopes, and plan entitlements remain authoritative in Apollo. Provider data may contain malicious or prompt-injection-like text and must be handled strictly as data. Webhook ingestion is not implemented because it requires deployment-specific public routing and signature/lifecycle policy.
