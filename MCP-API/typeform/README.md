# Typeform MCP/API Connector

Reusable Typeform connector exposing a stable stdio MCP server for AI agents while routing each capability to Typeform's official MCP or REST APIs.

## Official sources researched

- Typeform MCP server: https://www.typeform.com/developers/mcp/
- Supported MCP tools: https://www.typeform.com/developers/mcp/tools/
- MCP core concepts / OAuth: https://developer.typeform.com/developers/mcp/core-concepts/
- Connector registration: https://www.typeform.com/developers/mcp/build-a-connector/
- REST get started / rate limits: https://www.typeform.com/developers/get-started/
- OAuth application flow: https://www.typeform.com/developers/get-started/applications/
- OAuth scopes: https://www.typeform.com/developers/get-started/scopes/
- Responses API: https://www.typeform.com/developers/responses/
- Webhooks API: https://www.typeform.com/developers/webhooks/

## Transport strategy

Typeform has an official remote MCP server at `https://api.typeform.com/mcp` using Streamable HTTP and OAuth 2.0. This connector prefers it for account/workspace discovery, form reads and edits, publishing, and response analytics. Typeform explicitly documents several MCP gaps. Full response rows therefore use the official Responses API, and legacy form-level webhook management uses the official Webhooks API.

The upstream MCP client is allowlisted to the exact official tools required by this package. It verifies those tools are advertised before first use and never invokes newly discovered tools automatically.

## Authentication

`TYPEFORM_MCP_ACCESS_TOKEN` must be an OAuth 2.0 bearer token authorized for the official MCP server. Typeform MCP does **not** support personal access tokens. Hosted third-party connectors may require their redirect domain to be allowlisted by Typeform; localhost, ChatGPT, Claude, Cursor and several other domains are already documented by Typeform as accepted as of 25 August 2026.

`TYPEFORM_API_TOKEN` is used only for REST fallback operations. It may be a Typeform OAuth token or a least-privilege personal access token. Never expose either token to an LLM. The connector supplies credentials only in transport headers.

Recommended scopes for implemented MCP tools: `accounts:read workspaces:read forms:read forms:write insights:read`. REST fallback requires scopes sufficient to read responses and manage webhooks; grant only the scopes needed by your deployment. Request `offline_access`/offline refresh capability only when your host has a secure refresh-token store.

## Environment

Copy `.env.example` and inject secrets through your runtime secret manager. EU-resident Typeform accounts must override API/MCP base URLs with Typeform's documented EU endpoints.

## Installation and run

```bash
npm install
npm run build
npm test
npm start
```

Requires Node.js 20+. The exposed connector uses MCP stdio, suitable for clients that can launch local stdio MCP servers.

## Tools

| Tool | Upstream | Risk | Approval |
|---|---|---:|---|
| `typeform.account.list` | official MCP | READ | none |
| `typeform.workspace.list` | official MCP | READ | none |
| `typeform.form.capabilities.get` | official MCP | READ | none |
| `typeform.form.get` | official MCP | READ | none |
| `typeform.form.list` | official MCP | READ | none |
| `typeform.form.create` | official MCP | WRITE | configurable, required by default |
| `typeform.form.validate_patch` | official MCP | READ | none; validates only |
| `typeform.form.patch` | official MCP | WRITE | configurable, required by default |
| `typeform.form.publish` | official MCP | HIGH_RISK | explicit human approval |
| `typeform.insight.discover` | official MCP | READ | none |
| `typeform.insight.aggregate` | official MCP | READ | none |
| `typeform.response.list` | Responses REST API | READ | none |
| `typeform.webhook.list` | Webhooks REST API | READ | none |
| `typeform.webhook.upsert` | Webhooks REST API | WRITE | configurable, required by default |

No delete tool is exposed. Typeform's destructive form, response, contact, list, property, and webhook deletion operations are intentionally omitted.

## Approval model

Write approvals are connector-controlled, not agent-controlled. `TYPEFORM_REQUIRE_WRITE_APPROVAL=true` by default. An operator approves an exact action fingerprint in `TYPEFORM_APPROVED_ACTIONS`, for example:

```text
TYPEFORM_APPROVED_ACTIONS=typeform.form.patch:FORM_ID,typeform.form.publish:FORM_ID,typeform.webhook.upsert:FORM_ID:crm
```

Publishing is always HIGH_RISK and remains gated even if normal write approval is disabled.

## Reliability and rate limits

Typeform documents a Create/Responses API rate limit of two requests per second per account. The REST client therefore avoids amplification, makes single-page response calls, honors `Retry-After`, uses bounded exponential backoff for retryable GET failures, and never blindly retries mutations. Requests use abort-backed timeouts. MCP failures are surfaced rather than silently switching a write operation to another transport.

Responses API data may lag very recent submissions; Typeform advises webhooks for near-real-time delivery. Webhooks must use HTTPS. Typeform itself retries failed webhook deliveries according to documented status-specific rules.

## Security

- Credentials are isolated in configuration/transport and never accepted as tool parameters.
- Retrieved form content and responses are untrusted data, not instructions.
- Upstream MCP calls are limited to an explicit allowlist.
- Tool IDs, patch sizes, response page sizes, webhook schemes and input lengths are validated.
- No arbitrary REST request or arbitrary upstream MCP invocation is exposed.
- Form publishing requires explicit human approval.
- Destructive operations are not registered.
- Webhook URLs require HTTPS; applications should also verify Typeform webhook HMAC signatures at their receiver.
- Secrets must not be logged or committed. Typeform participates in GitHub secret scanning for leaked tokens.

## Testing

Unit tests require no live Typeform account. They cover credential configuration, write/high-risk policy, secret placement in transport headers, rate-limit retry, and non-retry of writes. Live MCP testing can be done with the official MCP Inspector after obtaining OAuth consent.

## Limitations

The connector intentionally implements a focused 14-tool surface rather than all Typeform features. Themes/images/brand kits, workspace mutation, embed code retrieval and full response deletion/export are not exposed. Automation and Contacts MCP domains are also omitted from this first reusable surface to keep permissions narrow. The upstream MCP schema is authoritative; plan-gated capabilities can still fail at call time even with valid scopes.
