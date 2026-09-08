# Hashnode MCP/API Connector

Reusable MCP server exposing curated Hashnode workflows over Hashnode's official GraphQL API.

## Transport decision
Hashnode does **not** publish an official MCP server. In 2026 Hashnode published the official `Hashnode/gql-skill` agent skill and explicitly documents direct GraphQL calls for coding agents. This connector therefore uses the official GraphQL API rather than an unofficial MCP proxy.

Official sources:
- https://github.com/Hashnode/gql-skill
- https://hashnode.com/blog/hashnode-gql-agent-skill
- https://hashnode.com/changelog/2026-05-13-graphql-api-paid-access
- https://hashnode.com/changelog/2026-06-18-graphql-agent-skill

The official skill currently documents `https://gql-beta.hashnode.com` as the production endpoint, PAT authentication via `HASHNODE_PAT`, cursor pagination, query depth <= 10, connection page caps of 100 (drafts 50), and GraphQL error codes. Hashnode changed API commercial access in May 2026: publication API access is Pro-gated. Treat a `FORBIDDEN` Pro-plan error as non-retryable.

## Architecture
`MCP client -> this stdio server -> strict tool schemas/policy -> GraphQL client -> Hashnode`.
Credentials remain in the connector process and are never passed to model prompts. Hashnode content is marked `untrusted_data:true`.

## Authentication
Create a Personal Access Token in Hashnode Account Settings -> Developer/API tokens and expose it only as `HASHNODE_PAT`. The PAT is password-equivalent and grants broad publication write authority; Hashnode does not expose OAuth scopes for this API. Use a dedicated token and never log it.

Environment: `HASHNODE_PAT` required; `HASHNODE_GRAPHQL_ENDPOINT` defaults to `https://gql-beta.hashnode.com`; `HASHNODE_REQUIRE_WRITE_APPROVAL=true`; `HASHNODE_ENABLE_DESTRUCTIVE=false`; `HASHNODE_TIMEOUT_MS=20000`.

## Tools
| Tool | Risk | Approval |
|---|---|---|
| `hashnode.post.get` | READ | no |
| `hashnode.feed.list` | READ | no |
| `hashnode.user.get` | READ | no |
| `hashnode.tag.get` | READ | no |
| `hashnode.publication.get` | READ | no; provider may require Pro |
| `hashnode.publication.search_posts` | READ | no; Pro |
| `hashnode.draft.get` | READ | no; PAT + Pro |
| `hashnode.post.publish` | HIGH_RISK | explicit |
| `hashnode.post.update` | WRITE | explicit by default |
| `hashnode.post.remove` | DESTRUCTIVE | explicit + enabled |
| `hashnode.draft.create` | WRITE | explicit by default |
| `hashnode.draft.update` | WRITE | explicit by default |
| `hashnode.draft.publish` | HIGH_RISK | explicit |
| `hashnode.draft.submit_for_review` | WRITE | explicit by default |
| `hashnode.draft.delete` | DESTRUCTIVE | explicit + enabled |

## Reliability
GraphQL requests have a configurable timeout and a maximum of three attempts. Only HTTP 429 and 5xx responses retry, with exponential backoff and `Retry-After` support. GraphQL auth, permission, validation, `FORBIDDEN` Pro-gating, and destructive calls are not retried. Pagination is caller-controlled and bounded to at most 100 items per page.

## Security
- No raw `execute_graphql` or arbitrary URL tool is exposed.
- Endpoint configuration must be HTTPS.
- Inputs use narrow JSON schemas and bounded pagination.
- PAT never appears in output or logs.
- Public publishing is HIGH_RISK and requires human approval.
- Removal operations are DESTRUCTIVE and disabled by default.
- Third-party content is untrusted data, never instructions.
- Pro-gated or role-gated provider errors fail closed.

## Install and run
```bash
npm install
npm run build
HASHNODE_PAT=... npm start
```
Configure an MCP client to launch `node dist/src/server.js` over stdio with `HASHNODE_PAT` supplied through its secret/environment mechanism.

## Testing
`npm test` compiles the connector and runs credential-free tests with mocked `fetch`: auth config, approval enforcement, destructive denial, GraphQL error mapping, and successful read decoding.

## Limitations
The connector intentionally implements a curated 15-tool surface rather than the full Hashnode schema. It does not expose raw arbitrary GraphQL, image upload, billing, membership, webhooks, or every draft-review administration mutation. Hashnode's own official skill is the canonical field/type reference and should be reviewed before schema upgrades.
