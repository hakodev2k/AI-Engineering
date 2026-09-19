# Plain MCP/API Connector

Reusable local MCP server for the Plain customer-support platform.

## Official transport research
Plain exposes an official GraphQL API and an open-source typed TypeScript SDK (`@team-plain/typescript-sdk`). Plain also documents a native MCP server in its 2026 platform material. This connector uses the official SDK over GraphQL for its stable local tool contract, allowing local schema validation and approval controls instead of dynamically trusting a broad upstream tool inventory.

Official references: `https://www.plain.com/docs/graphql`, `https://www.plain.com/docs/webhooks`, `https://help.plain.com/article/rate-limits`, and the Plain TypeScript SDK examples in the GraphQL docs. The GraphQL endpoint documented by Plain is `https://core-api.uk.plain.com/graphql/v1`.

## Capabilities
Eight agent-oriented tools are exposed: `plain.customer.upsert`, `plain.thread.create`, `plain.thread.reply`, `plain.thread.assign`, `plain.thread.unassign`, `plain.thread.event.create`, `plain.thread.priority.update`, and `plain.customer.delete`.

The implementation delegates to official SDK operations: `upsertCustomer`, `createThread`, `replyToThread`, `assignThread`, `unassignThread`, `createThreadEvent`, `updateThreadPriority`, and `deleteCustomer`. It does not expose arbitrary GraphQL.

## Authentication and permissions
Set `PLAIN_API_KEY` to a Plain machine-user API key. Plain keys can be permission-scoped; request only permissions required by enabled workflows. Examples from official docs include `thread:read`, `thread:assign`, `thread:unassign`, `threadEvent:create`, `threadEvent:read`, `customer:read`, and `customer:delete`. Grant create/reply/update permissions only when those corresponding tools are intended for use. The key stays inside the connector and is never accepted as a tool parameter.

## Approval model
Writes are denied unless `PLAIN_APPROVE_WRITES=true`. Replies are HIGH_RISK because they send external communication and additionally require `approved:true` per call. Customer deletion is DESTRUCTIVE: the schema requires both `approved:true` and the exact confirmation string `DELETE CUSTOMER`. Plain documents that customer deletion asynchronously removes associated customer data including threads.

## Install and run
Requires Node.js 20+.
```bash
npm install
cp .env.example .env
npm run build
npm start
```
Point a standards-compliant stdio MCP client at `node dist/src/server.js`. Compatibility depends on the client supporting MCP stdio; no client-specific behavior is assumed.

## Rate limits and reliability
Plain's current help documentation states API-key activity defaults to 450 requests/minute on Launch/Foundation, 600 on Grow/Horizon, and 1000 on Scale/Frontier. Responses include `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset`; 429 indicates throttling. The official SDK owns HTTP transport behavior. Agent workflows should avoid polling and use Plain webhooks for event-driven automation where appropriate.

## Webhooks
Plain supports HTTPS webhooks with at-least-once delivery, retries for roughly five days, event IDs suitable for idempotency, optional request signing and mTLS, and up to 25 webhook targets per workspace. This connector does not create webhook targets because callback URL trust, signing keys, and receiver policy are deployment-specific security boundaries.

## Security
All tool inputs use bounded strict Zod schemas. No caller-supplied URLs, GraphQL documents, API keys, or permission escalation primitives are accepted. Retrieved customer/thread content is wrapped as untrusted provider data and must not be interpreted as system instructions. Credentials are not logged or returned. Assignment requires exactly one assignee. External replies and destructive deletion require explicit per-call approval.

## Errors
SDK typed errors are converted to connector errors without exposing credentials. Missing SDK methods fail closed, which protects against incompatible SDK versions. Validation and approval failures occur before provider execution.

## Tests
`npm test` uses no live credentials and checks registration, auth configuration, strict validation, write denial, high-risk approval, destructive confirmation, and ambiguous assignment rejection.

## Limitations
This package intentionally covers a focused support workflow rather than the complete Plain schema. It does not expose arbitrary GraphQL, billing, workspace administration, webhook-target creation, or bulk deletion. OAuth refresh is not applicable to Plain machine-user API-key authentication. Provider API keys and permissions must be provisioned in Plain by an administrator using least privilege.
