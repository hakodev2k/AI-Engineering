# updown.io MCP connector

Reusable MCP server for updown.io uptime monitoring. It exposes scoped agent tools over the official REST API; updown.io does not document an official MCP server, so this connector does not depend on an upstream MCP implementation.

## Official sources
- API, authentication, endpoints, parameters, Push API/webhook events, DNS API: https://updown.io/api
- Provider: https://updown.io/

## Transport and architecture
MCP client -> local stdio MCP server -> permission/validation layer -> credential-isolated REST client -> `https://updown.io/api`. Provider payloads are returned with `untrusted_provider_content: true` and must never be interpreted as agent instructions. The API key is injected only by the client layer as `X-API-KEY`; it is never part of a tool schema or output.

## Authentication and least privilege
Set `UPDOWN_API_KEY`. updown.io supports an API key in `X-API-KEY` and offers a read-only key. Use the read-only key when only READ tools are needed. A read/write key is required for create/update/delete operations. The provider uses API keys rather than OAuth scopes, so there are no OAuth scopes to request. Never expose keys to prompts, logs, examples, or tool arguments.

## Configuration
Copy `.env.example` into your secret-managed runtime configuration. `UPDOWN_API_BASE_URL` defaults to the fixed official HTTPS API. `UPDOWN_TIMEOUT_MS` defaults to 10000. `UPDOWN_WRITE_APPROVAL=true` makes WRITE tools require explicit approval (default behavior). `UPDOWN_DESTRUCTIVE_ENABLED=false` disables destructive execution by default.

## Install and run
Requires Node.js 20+.

```sh
npm install
npm run build
UPDOWN_API_KEY=... npm start
```

The server uses MCP stdio and can be launched by MCP clients that support stdio child-process servers.

## Tools
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `updown.check.list` | REST | READ | no |
| `updown.check.get` | REST | READ | no |
| `updown.check.downtimes` | REST | READ | no |
| `updown.check.metrics` | REST | READ | no |
| `updown.check.create` | REST | WRITE | configurable, on by default |
| `updown.check.update` | REST | WRITE | configurable, on by default |
| `updown.check.delete` | REST | DESTRUCTIVE | explicit + feature enable |
| `updown.node.list` | REST | READ | no |
| `updown.recipient.list` | REST | READ | no |
| `updown.recipient.create` | REST | HIGH_RISK | explicit |
| `updown.recipient.delete` | REST | DESTRUCTIVE | explicit + feature enable |
| `updown.status_page.list` | REST | READ | no |
| `updown.status_page.create` | REST | HIGH_RISK | explicit |
| `updown.status_page.update` | REST | HIGH_RISK | explicit |
| `updown.status_page.delete` | REST | DESTRUCTIVE | explicit + feature enable |

The connector intentionally omits arbitrary raw HTTP/API execution. The official API also exposes node IP variants and webhook event delivery; these are documented upstream but are not exposed as separate tools because `node.list` covers discovery and inbound webhook hosting/verification belongs to the consuming application.

## Validation and safety
Schemas constrain enums, lengths, periods, page numbers, check/status-page collections and supported recipient types. Loopback monitoring URLs are rejected as a defense-in-depth SSRF control. Custom provider content is treated as data. Public status-page creation/update and creation of external notification recipients are HIGH_RISK because they can publish information or send alerts externally. Deletion is disabled unless the operator explicitly enables it and the individual call carries human approval. Retrieved content cannot change permissions.

## Reliability and rate limits
Requests have bounded timeouts. GET/network failures and provider 429/5xx responses receive at most three retries after the initial attempt with exponential backoff; `Retry-After` is honored when supplied. Authentication, authorization, validation, and destructive failures are not blindly retried. Downtime history is provider-paginated at 100 entries per page; the tool exposes a bounded page parameter. Metrics use provider-side aggregation and optional `from`, `to`, and `group` parameters to avoid unnecessary request fan-out. The official documentation does not publish a fixed numeric REST request quota; the connector therefore relies on HTTP throttling signals rather than inventing a limit.

## Errors
Non-success provider responses become `UpdownError` with HTTP status and `Retry-After` when available. Missing credentials fail during connector startup. Approval failures are local and occur before a provider mutation. Timeout/network errors propagate after bounded retry rules are exhausted.

## Testing
`npm test` uses mocks and no live credentials. Tests cover credential configuration, credential isolation, validation/SSRF protection, approval policy, destructive default-deny, provider authentication errors, and rate-limit retry behavior.

## Examples
See `examples/workflows.md` for read-only incident diagnosis, monitor creation, public status-page publishing, and destructive deletion boundaries.

## Limitations
No official upstream MCP server is documented, so all implemented capabilities use the official REST API. This package does not host inbound Push API webhooks, does not expose the DNS API, and does not provide UI-only recipient integrations. It cannot infer account permissions beyond provider responses. API keys are provider-level credentials; use updown.io's read-only key wherever possible.
