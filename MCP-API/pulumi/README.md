# Pulumi MCP/API Connector

Reusable MCP connector for Pulumi Cloud focused on inspection and controlled Pulumi Deployments operations.

## Transport strategy
Pulumi has an official hosted MCP server at `https://mcp.ai.pulumi.com/mcp`. It uses OAuth and is excellent for interactive MCP clients. This connector uses the official Pulumi Cloud REST API instead because the REST API explicitly supports automation with Pulumi Cloud access tokens, including personal, organization, and team tokens. That makes credential isolation and non-interactive service operation predictable while preserving a stable MCP tool contract.

Official sources researched (2026-08-28):
- Official MCP server: https://www.pulumi.com/docs/ai/mcp-server/
- Cloud REST API: https://www.pulumi.com/docs/reference/cloud-rest-api/
- API basics/authentication: https://www.pulumi.com/docs/reference/cloud-rest-api/api-basics/
- Access tokens: https://www.pulumi.com/docs/administration/access-identity/access-tokens/
- Stacks API: https://www.pulumi.com/docs/reference/cloud-rest-api/stacks/
- Deployments API: https://www.pulumi.com/docs/reference/cloud-rest-api/deployments/

## Authentication
Set `PULUMI_ACCESS_TOKEN`. Requests use Pulumi's documented `Authorization: token <token>` header. Prefer a team or organization token scoped through Pulumi Cloud RBAC to only the organizations/stacks the connector needs. Personal tokens inherit the creator's permissions and are broader by default.

Credentials stay in the connector process and are never accepted as MCP tool parameters or returned in tool output.

## Supported tools
| Tool | Upstream | Risk | Approval |
|---|---|---|---|
| `pulumi.stack.get` | REST | READ | no |
| `pulumi.stack.activity.list` | REST | READ | no |
| `pulumi.stack.resource_count.get` | REST | READ | no |
| `pulumi.stack.resources.list` | REST | READ | no |
| `pulumi.stack.resource.get` | REST | READ | no |
| `pulumi.deployment.list` | REST | READ | no |
| `pulumi.deployment.get` | REST | READ | no |
| `pulumi.deployment.logs.get` | REST | READ | no |
| `pulumi.deployment.preview` | REST | WRITE | yes |
| `pulumi.deployment.update` | REST | HIGH_RISK | yes |
| `pulumi.deployment.refresh` | REST | HIGH_RISK | yes |
| `pulumi.deployment.destroy` | REST | DESTRUCTIVE | yes + disabled by default |
| `pulumi.deployment.cancel` | REST | HIGH_RISK | yes |

The deployment create endpoint officially accepts `preview`, `update`, `refresh`, and `destroy`. Cancel is treated as HIGH_RISK because Pulumi explicitly warns that canceling an in-progress deployment may leave a stack inconsistent.

## Architecture
```text
MCP client
  -> stdio MCP server
     -> strict provider-scoped tools
        -> approval/risk policy
           -> credential-isolated REST client
              -> Pulumi Cloud REST API
```

## Environment
- `PULUMI_API_URL`: defaults to `https://api.pulumi.com`; useful for self-hosted Pulumi Cloud.
- `PULUMI_ACCESS_TOKEN`: required.
- `PULUMI_TIMEOUT_MS`: default 15000.
- `PULUMI_MAX_RETRIES`: default 3, max 5.
- `PULUMI_APPROVAL_SECRET`: required for WRITE/HIGH_RISK/DESTRUCTIVE execution.
- `PULUMI_ENABLE_DESTRUCTIVE`: defaults to false.

## Install and run
Requires Node.js 20+.
```bash
npm install
npm run check
npm test
npm start
```
The server uses standard MCP stdio transport and can be configured in MCP clients that support stdio servers.

## Approval model
READ tools may execute automatically. All mutations require an approval token calculated as HMAC-SHA256 over the exact tool name plus canonical JSON payload (excluding `approval_token`). A token cannot be reused after changing organization, project, stack, source settings, or operation context. Destruction additionally requires `PULUMI_ENABLE_DESTRUCTIVE=true`, which cannot be changed through MCP.

## Reliability
Safe GET requests use bounded retries for 429/502/503/504 and honor integer `Retry-After` headers. Mutation requests are not blindly retried. Requests have a local timeout and honor MCP cancellation when available. Pagination parameters are bounded. Deployment log retrieval caps `count` at Pulumi's documented maximum of 499.

## Security
- HTTPS-only API base URL.
- No arbitrary REST request tool.
- No stack deletion, stack import, state export/import, token management, RBAC changes, billing changes, or policy changes.
- Retrieved infrastructure state is treated as untrusted provider data, not agent instructions.
- Provider response keys containing token/secret/password/credential/private-key/access-key patterns are redacted.
- Destructive execution is disabled by default.
- High-risk deployment actions require explicit payload-bound approval.
- Access tokens remain inside the auth/client layer.

## Rate limits
Pulumi's public REST documentation does not publish one universal request-per-second quota for all account types/endpoints. The client therefore does not invent a fixed quota; it reacts to HTTP 429 with bounded backoff and `Retry-After` handling.

## Testing
Unit tests use mocked fetch and require no live Pulumi credentials. Coverage includes configuration, tool registration, approval binding, destructive denial, response sanitization, auth header/path encoding, error handling, rate-limit retry, and no blind mutation retry.

## Limitations
- The official remote MCP server is not proxied because its documented OAuth flow is interactive; this connector is intended for reusable non-interactive service deployment with Pulumi access tokens.
- Stack resource responses may contain provider outputs; sanitization removes common secret/token-shaped response fields but cannot guarantee that every provider stores sensitive values under recognizable key names. Use Pulumi secrets and restrict access accordingly.
- Deployment settings are passed only through Pulumi's documented deployment create shape; unsupported provider capabilities are not exposed.
