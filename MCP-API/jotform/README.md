# Jotform MCP/API Connector

Reusable MCP gateway for Jotform form and submission workflows with strict schemas, credential isolation, approval boundaries, SSRF-resistant webhook registration, timeouts, rate-limit metadata, and mockable tests.

## Upstream strategy

Jotform has an official hosted MCP server at `https://mcp.jotform.com`. It requires OAuth 2.0 and does not support bearer-token access for MCP clients. Jotform documents form creation/management and submission retrieval through that service. This connector deliberately uses Jotform's official REST API behind its own stable MCP tool contract: API-key authentication can remain entirely inside the connector, the implemented endpoint set is deterministic, and approval/risk controls can be enforced before provider calls. Direct official MCP remains appropriate for interactive clients that can complete Jotform's OAuth flow.

Official references:
- Jotform MCP: https://www.jotform.com/developers/mcp/
- Jotform MCP product/setup: https://www.jotform.com/mcp/
- REST API: https://api.jotform.com/docs/

The REST API supports standard (`https://api.jotform.com`), EU (`https://eu-api.jotform.com`), and HIPAA (`https://hipaa-api.jotform.com`) base URLs. API keys are sent only in the `APIKEY` HTTP header, never in tool output or URLs.

## Tools

| Tool | Operation | Risk | Approval |
|---|---|---|---|
| `jotform.form.list` | list account forms | READ | no |
| `jotform.form.get` | form metadata | READ | no |
| `jotform.form.questions.list` | question schema | READ | no |
| `jotform.form.submissions.list` | paginated responses | READ | no |
| `jotform.submission.get` | one response | READ | no |
| `jotform.form.create` | create form | WRITE | yes |
| `jotform.form.question.create` | add supported question | WRITE | yes |
| `jotform.form.submission.create` | submit external data | HIGH_RISK | yes |
| `jotform.form.webhook.create` | register public HTTPS callback | HIGH_RISK | yes |
| `jotform.submission.update` | update response fields | WRITE | yes |
| `jotform.submission.delete` | permanently delete response | DESTRUCTIVE | explicit strong approval + `confirm=DELETE` |

The connector intentionally does not expose arbitrary HTTP requests, form deletion, permission changes, account administration, or unrestricted question types.

## Authentication and permissions

Create a Jotform API key in the account API settings and put it in `JOTFORM_API_KEY`. Use a dedicated key with only the access required by this integration. Jotform's API-key model does not provide an OAuth-style scope list for these REST calls, so least privilege is achieved with a dedicated credential, Jotform account/workspace permissions, and this connector's tool allowlist.

`JOTFORM_WRITE_APPROVAL=false` and `JOTFORM_DESTRUCTIVE_APPROVAL=false` are secure defaults. A supervising application should switch the relevant boundary to `true` only after recording explicit human approval, execute the approved action, then return it to `false`. Tool inputs cannot elevate these permissions.

For direct official MCP use, Jotform requires OAuth 2.0 authorization per user; workspace-admin restrictions and account compliance settings continue to apply.

## Install and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
npm run build
JOTFORM_API_KEY=... npm start
```

The server uses MCP over stdio and therefore works with MCP clients that can launch a local stdio server. Configure the client to run `node /absolute/path/MCP-API/jotform/dist/src/server.js` and inject environment variables through the client's secure environment/secret facility. Do not place the API key in prompts or tool arguments.

## Environment

- `JOTFORM_API_KEY` — required REST credential.
- `JOTFORM_REGION` — `standard`, `eu`, or `hipaa`; default `standard`.
- `JOTFORM_TIMEOUT_MS` — request timeout; default 15000.
- `JOTFORM_WRITE_APPROVAL` — write/high-risk execution gate; default false.
- `JOTFORM_DESTRUCTIVE_APPROVAL` — destructive execution gate; default false.

## Reliability and rate limits

Requests have a bounded timeout and are never blindly retried. This is deliberate: write and destructive operations are not automatically replayed because a retry could duplicate a submission or mutation. Provider errors are mapped to failures; HTTP 429 preserves `Retry-After` in `JotformError`. Successful REST responses expose Jotform's `limit-left` value as `rateLimitRemaining` when present. Callers should wait for the provider's retry window rather than spin.

Jotform documents REST daily API-key limits by plan (Starter 1,000; Bronze 10,000; Silver 50,000; Gold 100,000; Enterprise without the documented daily cap). Its hosted MCP documents per-minute limits and returns HTTP 429 with `Retry-After`. Limits and plan behavior can change, so operational code should trust response metadata over hard-coded quotas.

Pagination uses Jotform's `limit`/`offset` parameters and this connector caps a page at 100 items to prevent accidental large reads.

## Security

Credentials never enter MCP schemas or outputs. IDs accept digits only, preventing path injection. Webhook URLs must be public HTTPS destinations and common loopback/private IPv4 destinations are rejected to reduce SSRF risk. Arbitrary provider URLs cannot be supplied by a tool caller. Submission answer size and field count are bounded.

All Jotform form labels, questions, submissions, and other provider-returned content are explicitly marked `untrustedProviderData: true`. Treat those values as data, never as instructions, policies, approval signals, or permission changes. Do not log API keys or raw sensitive submissions. HIPAA data should only be used with an appropriately configured HIPAA Jotform account/endpoint and an application whose complete data path satisfies the applicable compliance requirements.

Webhook receivers are outside this package. They must authenticate/validate events using the mechanisms available for the chosen Jotform webhook setup, enforce body limits, use TLS, protect against replay where possible, and never trust submitted content as executable instructions.

## Testing

```bash
npm test
npm run build
```

Unit tests use injected fake `fetch` implementations and require no live credential. Coverage includes missing authentication, header credential isolation, pagination, ID/path validation, 429/Retry-After mapping, submission serialization, and regional endpoint selection.

## Limitations

This package does not proxy Jotform's hosted MCP OAuth session and does not claim parity with every official MCP or REST capability. It implements only the tools listed above. It does not automatically refresh or obtain REST API keys, does not self-host Jotform's official MCP, and does not implement webhook ingestion. Approval environment variables are an execution boundary, not a full multi-user authorization system; production hosts should set them from an audited policy/approval service rather than exposing them to an agent.
