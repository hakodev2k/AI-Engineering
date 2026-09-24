# Split MCP/API Connector

Reusable MCP stdio server for Split (Harness Feature Management & Experimentation) using the official Split Admin REST API. No official Split MCP server is used; the REST API is the authoritative upstream transport.

## Official sources
Split API reference: https://docs.split.io/reference/introduction
Feature flags: https://docs.split.io/reference/feature-flag-overview
List flags: https://docs.split.io/reference/list-feature-flags
Get flag: https://docs.split.io/reference/get-feature-flag
Definitions: https://docs.split.io/reference/get-feature-flag-definition-in-environment
Create: https://docs.split.io/reference/create-feature-flag
Update definition: https://docs.split.io/reference/partial-update-feature-flag-definition-in-environment

## Capabilities
Ten MCP tools cover projects, environments, traffic types, flag listing/metadata, environment definitions, creation, definition creation/update, and tag association. All are backed by official REST endpoints.

## Authentication and least privilege
Set `SPLIT_ADMIN_API_KEY`. The connector injects it as a Bearer token inside the client; it is never accepted as a tool argument. Read tools should use an Admin API key with `API_FEATURE_FLAG_VIEWER` where sufficient. Mutation tools require `API_FEATURE_FLAG_EDITOR`; scope the key to the smallest project/environment needed. Split project/workspace view restrictions still apply.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
SPLIT_ADMIN_API_KEY=... npm start
```

Configure an MCP client to launch `node dist/server.js` with credentials supplied through its secret environment facility.

## Tools and risk
READ: `split.project.list`, `split.environment.list`, `split.traffic_type.list`, `split.feature_flag.list`, `split.feature_flag.get`, `split.feature_flag.definition.get`.
WRITE: `split.feature_flag.create`, `split.feature_flag.tags.set`; disabled unless `SPLIT_ALLOW_WRITES=true`.
HIGH_RISK: `split.feature_flag.definition.create`, `split.feature_flag.definition.update`; writes must be enabled and each call must include `approved:true`. The patch tool allowlists rollout-related paths and excludes `/killed`; destructive deletion and direct kill/restore are intentionally not exposed.

## Reliability and rate limits
Requests have a configurable timeout. GET requests retry at most twice for HTTP 429 and 5xx with bounded exponential delay and honor `Retry-After`. Mutations are never automatically retried. List flags uses Split's offset/limit pagination and enforces the documented maximum page size of 50. Provider errors retain HTTP status and Retry-After metadata.

## Security
Credentials remain in the auth/client layer. Tool schemas reject unknown fields. Arbitrary URLs/endpoints are not exposed, reducing SSRF risk. Provider payloads are returned as untrusted data and must never be treated as agent instructions. Mutation gates cannot be elevated by provider content. Do not log API keys or raw Authorization headers.

## Environment
`SPLIT_ADMIN_API_KEY` required; `SPLIT_API_BASE_URL` defaults to the official API host; `SPLIT_TIMEOUT_MS` defaults to 10000; `SPLIT_ALLOW_WRITES` defaults to false.

## Testing
`npm test` uses fakes and requires no live credential. Tests cover auth configuration, registration, validation, reads, write denial and explicit high-risk approval. The client implements timeout, throttling metadata, bounded read retries and provider error mapping.

## Limitations
This package does not expose deletion, kill/restore, billing, permissions, arbitrary JSON Patch paths, webhooks, or change-request approval actions. Split's API surface and Harness migration can evolve; validate scopes and endpoints against the official reference before production rollout. Stdio is the implemented MCP transport.
