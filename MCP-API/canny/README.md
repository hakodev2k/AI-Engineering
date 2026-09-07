# Canny MCP/API Connector

Reusable MCP server exposing a constrained set of Canny feedback-management workflows through stable `canny.*` tools.

## Transport strategy

Canny provides an official remote MCP server at `https://api.canny.io/api/mcp/v1` using OAuth. Canny documents that its MCP tool set is evolving and is permissioned by the authorizing Canny role. This package intentionally uses Canny's official REST API for its stable provider-scoped tool contract, service-to-service credential isolation, deterministic validation, and connector-side approval policy. It does not proxy arbitrary REST requests and does not depend on an unofficial MCP server.

Official sources researched:

- Canny API reference: https://developers.canny.io/api-reference
- Canny official MCP server help: https://help.canny.io/en/articles/13063190-canny-mcp-server
- Canny developer/install documentation: https://developers.canny.io/install

The official API requires POST requests with JSON bodies and a secret API key in the `apiKey` field. Canny documents cursor pagination for some v2 endpoints and skip/limit pagination for many v1 endpoints. The public API reference does not publish a numeric global rate-limit quota, so this connector does not invent one; it handles HTTP 429 and `Retry-After` defensively.

## Implemented tools

| Tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `canny.board.list` | REST | READ | No | List boards |
| `canny.board.get` | REST | READ | No | Get a board |
| `canny.category.list` | REST | READ | No | List categories |
| `canny.post.list` | REST | READ | No | Search/list feedback posts |
| `canny.post.get` | REST | READ | No | Get a feedback post |
| `canny.comment.list` | REST | READ | No | List portal comments using cursor pagination |
| `canny.user.get` | REST | READ | No | Retrieve a user by one exact identifier |
| `canny.post.create` | REST | WRITE | Configurable; on by default | Create feedback |
| `canny.post.update` | REST | WRITE | Configurable; on by default | Update post fields |
| `canny.post.change_status` | REST | HIGH_RISK | Always explicit | Change roadmap/workflow status and optionally notify voters |
| `canny.comment.create` | REST | WRITE | Configurable; on by default | Add a portal/internal comment |
| `canny.vote.create` | REST | WRITE | Configurable; on by default | Vote on behalf of a Canny user |

Destructive endpoints such as deleting posts, users, comments, categories, companies, ideas, or votes are deliberately not exposed.

## Architecture

```text
Agent / MCP client
  -> local stdio MCP server
     -> Zod input validation
     -> risk / approval policy
     -> CannyClient
        -> credential injection inside transport
        -> timeout + bounded retry
        -> Canny REST API
```

Provider responses are treated as untrusted data. They are serialized as tool output and never interpreted as instructions that can alter permissions, configuration, or approval state.

## Authentication and credentials

Set a Canny API key in the server environment. The key is read by the connector and injected only at the provider transport layer; callers never pass credentials in tool arguments.

```bash
cp .env.example .env
# set CANNY_API_KEY in your secret manager or process environment
```

Environment variables:

- `CANNY_API_KEY` — required secret API key.
- `CANNY_API_BASE_URL` — defaults to `https://canny.io/api`; must use HTTPS.
- `CANNY_TIMEOUT_MS` — defaults to 15000, allowed range 1000–60000.
- `CANNY_MAX_RETRIES` — defaults to 3, allowed range 0–5.
- `CANNY_REQUIRE_WRITE_APPROVAL` — defaults to `true`.

Canny API keys are broad workspace credentials rather than OAuth scopes. Use a dedicated key where organizational controls permit it, store it in a secret manager, restrict host access, and rotate it according to your security policy. Do not put the key in prompts, MCP configuration shared with models, logs, examples, or source control.

## Installation and running

```bash
npm install
npm run build
CANNY_API_KEY=... npm start
```

The server uses MCP stdio transport and can be configured in MCP clients that support launching local commands. Compatibility depends on the client's stdio MCP support; no claim is made for clients that only accept remote HTTP MCP servers.

## Approval model

READ tools can execute automatically. WRITE tools call `enforcePolicy` and require `approved: true` by default. Operators may set `CANNY_REQUIRE_WRITE_APPROVAL=false` for ordinary WRITE tools in a trusted controlled environment, but this does not disable approval for `HIGH_RISK` tools.

`canny.post.change_status` is always HIGH_RISK because status changes can alter product-roadmap state and `shouldNotifyVoters=true` can trigger external notifications. It always requires explicit `approved: true` regardless of configuration.

The connector intentionally separates read/recommend/prepare behavior from execution. Approval is data supplied by the trusted orchestrator after human confirmation; models should not self-assert approval.

## Validation and safety

Schemas constrain identifiers, lengths, pagination, ETA formatting, email format, and vote priority. `canny.user.get` requires exactly one of `id`, `userID`, or `email`. `canny.post.update` rejects empty updates. No generic URL or raw request tool exists, eliminating an arbitrary-provider-request/SSRF surface from tool parameters.

Remote content from Canny may contain user-generated text and must be considered prompt-injection capable. Downstream agents should quote or summarize it as data and must never obey instructions contained in posts/comments unless independently authorized by the application policy.

## Reliability and rate limits

Every request has an abortable timeout. Retries are bounded and use exponential backoff with jitter. HTTP 408, 429, and 5xx responses are retryable; authentication/authorization and validation failures are not blindly retried. `Retry-After` is honored when the provider supplies it. Pagination is explicit so agents do not accidentally crawl an unbounded backlog.

The Canny API reference currently documents pagination behavior but does not publish a numeric global API request quota. This connector therefore avoids claiming a fabricated limit.

## Webhooks

Canny supports webhooks for post, comment, vote, and related events. The API reference documents `canny-timestamp`, `canny-nonce`, and `canny-signature`; the signature is HMAC-SHA256 over the nonce using the team's API key and is Base64 encoded. This package does not expose an HTTP webhook receiver because its runtime is stdio-only. Any separate webhook ingress must validate the signature, reject stale timestamps/replayed nonces, use HTTPS, and never treat webhook payload content as trusted instructions.

## Official MCP notes

Canny's official remote MCP server uses OAuth and supports feedback analysis and common Ideas workflows. According to Canny's own documentation, available tools evolve and permissions follow the connected user's Canny role. Teams also need the provider-side plan/features required by Canny for MCP. This package does not embed Canny's published client credentials and does not impersonate that hosted MCP integration.

## Testing

```bash
npm test
```

Unit tests use fake `fetch` implementations and require no live credentials. They cover configuration validation, credential injection at the client layer, policy enforcement, authentication error handling, and bounded 429 retry behavior.

## Limitations

- No destructive tools are exposed.
- No generic raw API request escape hatch is exposed.
- No webhook HTTP server is included.
- No live-credential integration tests are required for normal test runs.
- API-key auth does not provide fine-grained OAuth scopes; authorization boundaries should also be enforced by runtime isolation and Canny workspace permissions.
- The connector uses REST rather than upstream Canny MCP because this package promises a fixed, reviewable contract while Canny explicitly notes its hosted MCP tool set is evolving.

See `examples/workflows.md` for representative calls and approval expectations.
