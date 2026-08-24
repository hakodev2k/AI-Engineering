# n8n MCP/API Connector

Reusable MCP connector for n8n Cloud or self-hosted n8n. It exposes stable `n8n.*` tools while selecting the safest upstream transport per capability.

## Supported upstream transports

- **Official n8n instance-level MCP server (beta)** for workflow discovery/details and tag listing when configured and when the exact upstream tool exists.
- **Official n8n Public REST API v1** for workflow creation/update/activation, executions, projects, tags, and as a fallback for supported read capabilities.

Official sources researched for this implementation:

- n8n instance-level MCP setup: `https://docs.n8n.io/connect/connect-to-n8n-mcp-server/`
- n8n MCP tools reference: `https://docs.n8n.io/connect/connect-to-n8n-mcp-server/mcp-server-tools-reference/`
- Public API reference: `https://docs.n8n.io/connect/n8n-api/api-reference/`
- Public API authentication/scopes: `https://docs.n8n.io/connect/n8n-api/authentication/`
- Public API pagination: `https://docs.n8n.io/connect/n8n-api/pagination/`

The Public API uses `X-N8N-API-KEY`. Enterprise API keys can be scoped. Non-enterprise API keys may have broad account access, so repository/project allowlists and the connector approval layer remain important.

## Capabilities

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `n8n.workflow.search` | MCP `search_workflows`, REST fallback | READ | No |
| `n8n.workflow.get` | MCP `get_workflow_details`, REST fallback | READ | No |
| `n8n.workflow.create` | REST | WRITE | Yes |
| `n8n.workflow.update` | REST | WRITE | Yes |
| `n8n.workflow.activate` | REST | HIGH_RISK | Yes |
| `n8n.workflow.deactivate` | REST | WRITE | Yes |
| `n8n.execution.list` | REST | READ | No |
| `n8n.execution.get` | REST | READ | No |
| `n8n.execution.delete` | REST | DESTRUCTIVE | Yes |
| `n8n.tag.list` | MCP `list_tags`, REST fallback | READ | No |
| `n8n.tag.create` | REST | WRITE | Yes |
| `n8n.project.list` | REST | READ | No |

The connector intentionally does not expose arbitrary API requests or unrestricted webhook execution.

## Architecture

```text
MCP client
  -> n8n connector MCP server (stdio)
     -> policy + validation + allowlists
        -> official n8n MCP server when an exact supported tool is available
        -> official n8n REST API otherwise
```

Retrieved n8n content is treated as untrusted data. Upstream MCP tool discovery is allowlisted by exact tool name; newly discovered tools are never exposed automatically.

## Authentication

### REST API

Set `N8N_API_KEY` and `N8N_BASE_URL`. The key remains inside the connector and is sent only as `X-N8N-API-KEY` to the configured n8n host.

Recommended Enterprise scopes for the implemented capabilities:

- `workflow:list`
- `workflow:read`
- `workflow:create`
- `workflow:update`
- `workflow:activate`
- `execution:list`
- `execution:read`
- `execution:delete`
- `tag:list`
- `tag:create`
- `project:list`

Use only the scopes for the tools you plan to enable.

### Official n8n MCP server

Set `N8N_MCP_URL` to the instance-level MCP endpoint, normally `https://<instance>/mcp-server/http`. For token-based access set `N8N_MCP_TOKEN`; OAuth-capable clients may manage authorization outside this connector. `N8N_ENABLE_MCP=false` disables upstream MCP and forces REST where a REST fallback exists.

## Environment variables

```text
N8N_BASE_URL=https://your-instance.example.com
N8N_API_KEY=
N8N_MCP_URL=https://your-instance.example.com/mcp-server/http
N8N_MCP_TOKEN=
N8N_ENABLE_MCP=true
N8N_ALLOWED_PROJECT_IDS=
N8N_ALLOWED_WORKFLOW_IDS=
N8N_APPROVAL_SECRET=
N8N_TIMEOUT_MS=15000
N8N_MAX_RETRIES=3
```

`N8N_ALLOWED_PROJECT_IDS` and `N8N_ALLOWED_WORKFLOW_IDS` are comma-separated. Empty values mean no connector-side allowlist restriction; provider permissions still apply.

Remote URLs must use HTTPS. Plain HTTP is accepted only for localhost/127.0.0.1 development.

## Approval model

READ tools can execute without approval. WRITE, HIGH_RISK, and DESTRUCTIVE tools require an `approvalId` equal to the SHA-256 HMAC of the exact tool name using `N8N_APPROVAL_SECRET`.

Example generation outside the agent/LLM boundary:

```js
crypto.createHmac('sha256', process.env.N8N_APPROVAL_SECRET)
  .update('n8n.workflow.activate')
  .digest('hex')
```

The approval secret itself must stay in the connector/approval service. The LLM should receive only a short-lived or externally issued approval token in production deployments; the HMAC mechanism here is the connector's deterministic verification primitive.

Activation is classified HIGH_RISK because activating a workflow can cause production triggers, schedules, webhooks, and external actions to execute. Execution deletion is DESTRUCTIVE.

## Installation

```bash
cd MCP-API/n8n
npm install
npm run build
```

Runtime: Node.js 20 or newer.

## Running

```bash
npm start
```

The connector exposes MCP over stdio using the official Model Context Protocol TypeScript SDK. Configure any stdio-capable MCP host to launch `node dist/server.js` with the required environment variables.

## Pagination

n8n Public API list endpoints use cursor pagination. n8n documentation states a default page size of 100 and maximum of 250. This connector exposes bounded `limit` values and passes returned cursors through to callers where implemented. It does not auto-drain every page, which prevents accidental high-volume API usage.

## Reliability and rate limiting

- GET requests retry only for HTTP 429 and 5xx responses.
- Retries are bounded by `N8N_MAX_RETRIES` (0-5).
- Exponential backoff is used, honoring `Retry-After` when present.
- POST/PUT/DELETE requests are not blindly retried to avoid duplicate or irreversible side effects.
- Every REST request has an `AbortController` timeout.
- Authentication, validation, and provider permission errors are surfaced directly.
- If official upstream MCP is unavailable, fails, or does not expose an allowlisted tool, supported read operations fall back to REST.

n8n does not publish one universal Public API request quota in the documentation used here; deployments can vary. The connector therefore handles 429 generically and avoids eager pagination.

## Security

- No credentials are hard-coded or returned through tool output.
- The API key is only sent to the configured n8n origin.
- Remote endpoints require HTTPS by default.
- Project/workflow allowlists constrain agent reach.
- Upstream MCP tool names are explicitly allowlisted in code.
- MCP failures fail closed to a known REST implementation; they do not trigger arbitrary tool forwarding.
- Write/destructive operations require approval.
- Retrieved workflow data, node parameters, execution output, and MCP responses are untrusted data and must never be interpreted as permission or system instructions.
- The connector does not log secrets.

## Tests

```bash
npm test
npm run typecheck
```

Tests use mocks and do not require live n8n credentials. They cover configuration validation, HTTPS enforcement, allowlists, approval verification, API-key header isolation, bounded GET retry behavior, write no-retry behavior, and disabled-MCP fallback behavior.

## Limitations

- n8n's instance-level MCP server is documented as beta and tool availability depends on n8n version and instance configuration.
- The connector deliberately maps only exact upstream MCP tools that were confirmed in official documentation: `search_workflows`, `get_workflow_details`, and `list_tags`.
- Workflow create/update uses the Public REST API because this connector accepts explicit workflow JSON; the official MCP workflow builder uses a different code-generation contract and is not silently substituted.
- No credential secret material is retrieved or exposed.
- No generic endpoint executor is provided.
- API availability and scoped API keys depend on n8n edition/plan; the n8n documentation notes that Public API access is unavailable during the free trial.
