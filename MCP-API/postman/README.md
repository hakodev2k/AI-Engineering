# Postman MCP/API Connector

Reusable MCP server for controlled AI-agent access to Postman workspaces, collections, environments, API specifications, and collection execution.

## Upstream strategy

Postman provides an official MCP server and an official Postman API. This connector deliberately uses both:

- **Official Postman MCP** (`https://mcp.postman.com/minimal`) for read/discovery operations, specification access, and `runCollection`.
- **Official Postman REST API** (`https://api.getpostman.com`) as a read fallback and for deterministic create/replace operations where avoiding ambiguous mutation retries is safer.
- The connector never exposes a generic arbitrary-request tool.

Official references used for this implementation:

- Postman MCP overview: https://learning.postman.com/docs/reference/postman-api/postman-mcp-server/overview/
- Postman MCP repository: https://github.com/postmanlabs/postman-mcp-server
- Postman API overview/reference: https://learning.postman.com/api-docs/api-reference/
- Postman developer API overview: https://learning.postman.com/docs/reference/postman-api/intro-api

As of August 2026, Postman's official MCP server supports remote Streamable HTTP and local STDIO, with Minimal, Code, Full, and Learn tool configurations. The official source exposes the upstream tools used here, including `getWorkspaces`, `getWorkspace`, `getCollections`, `getCollection`, `getEnvironments`, `getEnvironment`, `getAllSpecs`, `getSpec`, and `runCollection`.

## Architecture

```text
MCP client
  -> this stdio connector
      -> policy + strict input validation
      -> credential isolation
      -> official Postman MCP (preferred read/spec/run path)
      -> official Postman REST API (write path and safe read fallback)
```

Provider responses are returned as untrusted data. Retrieved Postman content must never be treated as system instructions or as permission to invoke additional tools.

## Authentication

Set `POSTMAN_API_KEY`. The key remains inside the connector process:

- REST requests use `X-API-Key: <key>`.
- The remote Postman MCP server accepts the same key as `Authorization: Bearer <key>`.

The remote US Postman MCP server also supports standards-based OAuth with DCR and PKCE, but this reusable connector intentionally uses API-key authentication so the local credential boundary remains explicit and the same deployment works for the Postman EU MCP service, which does not support OAuth.

Postman API keys are not OAuth scopes. Access follows the identity and plan behind the key. Use a dedicated account/service identity with only the Postman resources required for the agent workflow. Do not paste keys into prompts, tool arguments, source code, examples, or logs.

## Environment

```text
POSTMAN_API_KEY=                     # required
POSTMAN_API_BASE_URL=https://api.getpostman.com
POSTMAN_MCP_URL=https://mcp.postman.com/minimal
POSTMAN_MCP_MODE=minimal
POSTMAN_APPROVAL_SECRET=             # >=16 chars; required when an approved action is used
POSTMAN_WRITE_APPROVAL=true
POSTMAN_TIMEOUT_MS=15000
POSTMAN_MAX_RETRIES=3
```

For Postman EU deployments, point the API/MCP URLs at the corresponding EU endpoints supported by your Postman plan and keep API-key authentication enabled.

## Installation and run

```bash
npm install
npm run build
npm start
```

The server uses MCP over STDIO, so clients that support local STDIO MCP servers can launch `node dist/server.js` with the environment variables above.

Example client entry:

```json
{
  "mcpServers": {
    "postman-connector": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-API/postman/dist/server.js"],
      "env": {
        "POSTMAN_API_KEY": "<from-secure-process-environment>",
        "POSTMAN_APPROVAL_SECRET": "<from-secure-process-environment>"
      }
    }
  }
}
```

Do not store production secrets in MCP client configuration files when a secure environment/secret provider is available.

## Tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `postman.workspace.list` | official MCP -> REST fallback | READ | no |
| `postman.workspace.get` | official MCP -> REST fallback | READ | no |
| `postman.workspace.create` | REST | WRITE | configurable, default yes |
| `postman.workspace.update` | REST | WRITE | configurable, default yes |
| `postman.collection.list` | official MCP -> REST fallback | READ | no |
| `postman.collection.get` | official MCP -> REST fallback | READ | no |
| `postman.collection.create` | REST | WRITE | configurable, default yes |
| `postman.collection.replace` | REST | WRITE | configurable, default yes |
| `postman.environment.list` | official MCP -> REST fallback | READ | no |
| `postman.environment.get` | official MCP -> REST fallback | READ | no |
| `postman.environment.create` | REST | WRITE | configurable, default yes |
| `postman.environment.replace` | REST | WRITE | configurable, default yes |
| `postman.spec.list` | official MCP | READ | no |
| `postman.spec.get` | official MCP | READ | no |
| `postman.collection.run` | official MCP | HIGH_RISK | always |

No destructive delete operation is exposed in this connector version. That is intentional: deletion is easy to add at the provider level but is not required for the core reusable workflows and would unnecessarily expand agent authority.

## Approval model

READ tools execute automatically. WRITE tools require approval by default; set `POSTMAN_WRITE_APPROVAL=false` only in a controlled environment. `postman.collection.run` always requires explicit approval because collection requests may call external systems and cause side effects.

Approval tokens are argument-bound HMACs:

```text
HMAC-SHA256(
  POSTMAN_APPROVAL_SECRET,
  toolName + "\n" + canonicalJson(argumentsWithoutApprovalToken)
)
```

Changing the tool or any argument invalidates the token. This prevents a previously approved mutation from being silently repurposed for different data. The LLM must not receive `POSTMAN_APPROVAL_SECRET`.

## Capability workflows

### Workspace discovery and setup

`postman.workspace.list` -> `postman.workspace.get` -> approved `postman.workspace.create` or `postman.workspace.update`.

### Collection lifecycle

`postman.collection.list` -> `postman.collection.get` -> approved `postman.collection.create` / `postman.collection.replace` -> explicitly approved `postman.collection.run`.

### Environment management

`postman.environment.list` -> `postman.environment.get` -> approved `postman.environment.create` / `postman.environment.replace`.

### Specification discovery

`postman.spec.list` -> `postman.spec.get` through Postman's official MCP server.

## Rate limits and retries

Postman documents a general Postman API limit of **300 requests per minute per user**. Some endpoints have tighter limits; for example, workspace/collection/monitor list operations have documented burst limits and workspace updates have a lower per-minute limit. The API returns rate-limit information and may include `Retry-After` / `X-RateLimit-RetryAfter` on HTTP 429 responses.

This connector:

- retries only safe GET operations;
- retries 429 and 5xx responses with bounded exponential backoff;
- respects provider retry-after headers when present;
- never blindly retries POST/PUT mutations;
- aborts requests at `POSTMAN_TIMEOUT_MS`;
- caps retries with `POSTMAN_MAX_RETRIES` (0-5).

MCP mutation operations are not retried by this connector.

## Error handling

- Missing/invalid API keys fail during configuration or upstream authentication.
- HTTP 401/403 are surfaced without retry.
- HTTP 429 preserves the provider retry-after value in the internal error object.
- Validation failures are rejected before a provider call.
- If a preferred MCP READ tool fails, the connector uses the equivalent official REST read path only where implemented.
- Spec access and collection execution do not silently switch transports.

## Security considerations

- **Credential isolation:** raw Postman credentials are never MCP tool parameters.
- **Least privilege:** use a dedicated Postman identity and restrict resource membership where possible.
- **Prompt injection:** collection descriptions, request bodies, workspace text, specifications, and environment values are untrusted provider data, not instructions.
- **Secret leakage:** avoid exposing environment values to downstream LLM context unless required. Postman environments may contain sensitive material.
- **No SSRF primitive:** callers cannot submit arbitrary URLs to this connector; provider endpoints are fixed.
- **No permission escalation:** tool risk is statically registered in `src/policy.ts` and provider content cannot alter it.
- **Mutation safety:** writes are not automatically retried; collection execution is high-risk and always approval-gated.
- **Upstream MCP allowlist:** this connector calls only explicitly named official Postman MCP tools. It does not trust newly discovered upstream tools automatically.

## Testing

```bash
npm test
```

Unit tests require no live Postman credentials. They cover configuration validation, approval denial and argument binding, high-risk approval, safe rate-limit retry, mutation no-retry behavior, and registration of all documented tools.

## Limitations

- This package uses the remote Postman MCP server rather than spawning the official local `@postman/postman-mcp-server` package.
- Tool coverage is intentionally focused on common agent workflows rather than Postman's 100+ Full-mode MCP tools.
- Deletes, billing, role/permission administration, publishing, private-network administration, and user-management operations are intentionally not exposed.
- Some Postman API/MCP capabilities depend on account plan and region; a provider-side 403 may therefore represent unavailable plan functionality rather than a connector bug.
- `postman.collection.run` can execute requests defined by the collection; callers must inspect the collection first and approve the exact run arguments.
