# HCP Terraform / Terraform Cloud MCP Connector

Reusable MCP connector for HCP Terraform and Terraform Enterprise workspace/run workflows.

## Transport strategy

The connector prefers HashiCorp's official `terraform-mcp-server` over stdio when the requested upstream tool exists and succeeds. If the official MCP binary is unavailable, the tool is absent, or the MCP call fails, the connector falls back to the official HCP Terraform JSON:API for the same external tool contract.

Official sources:

- Terraform MCP Server: https://developer.hashicorp.com/terraform/mcp-server
- MCP reference: https://developer.hashicorp.com/terraform/mcp-server/reference
- HCP Terraform API: https://developer.hashicorp.com/terraform/cloud-docs/api-docs
- Workspace API: https://developer.hashicorp.com/terraform/cloud-docs/api-docs/workspaces
- Runs API: https://developer.hashicorp.com/terraform/cloud-docs/api-docs/run
- API tokens: https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/api-tokens

HashiCorp documents `list_terraform_orgs`, `list_terraform_projects`, `list_workspaces`, `get_workspace_details`, `create_workspace`, `delete_workspace_safely`, `list_runs`, `get_run_details`, `create_run`, `action_run`, and workspace variable tools in the official MCP server. Destructive Terraform operations are disabled in that server unless `ENABLE_TF_OPERATIONS=true`.

## Architecture

`MCP client -> this server -> policy/allowlist -> official Terraform MCP -> official HCP Terraform REST fallback`

Credentials remain in the connector process and are only injected into the upstream MCP process or Authorization header. Retrieved provider content is treated as untrusted data.

## Authentication

Set `TFE_TOKEN` to a user/team/organization token appropriate for the operations you need. HCP Terraform API authentication uses `Authorization: Bearer <token>`. Prefer team/user tokens for routine workspace/run operations; organization tokens are intentionally limited and cannot start runs.

`TFE_ADDRESS` defaults to `https://app.terraform.io` and can point at Terraform Enterprise.

## Environment

Copy `.env.example` and configure:

- `TFE_ADDRESS`
- `TFE_TOKEN`
- `TERRAFORM_MCP_COMMAND` (default `terraform-mcp-server`)
- `TERRAFORM_MCP_ARGS` (default `--toolsets=terraform`)
- `TERRAFORM_CLOUD_ALLOWED_ORGS` comma-separated organization allowlist
- `TERRAFORM_CLOUD_ALLOWED_WORKSPACES` comma-separated workspace-name/ID allowlist
- `TERRAFORM_CLOUD_APPROVAL_SECRET`
- `TERRAFORM_CLOUD_TIMEOUT_MS`
- `TERRAFORM_CLOUD_MAX_RETRIES`
- `TERRAFORM_CLOUD_ENABLE_WRITE=false` by default
- `TERRAFORM_CLOUD_ENABLE_DESTRUCTIVE=false` by default

## Installation and run

Requires Node.js 20+ and the official HashiCorp `terraform-mcp-server` binary on PATH if MCP-first routing is desired.

```bash
npm install
npm run build
npm start
```

The public connector itself uses MCP stdio and can be configured in MCP clients that support launching local stdio servers.

## Tools

| Tool | Risk | Approval | Preferred upstream |
|---|---|---:|---|
| `terraform_cloud.organization.list` | READ | No | MCP `list_terraform_orgs`, REST fallback |
| `terraform_cloud.project.list` | READ | No | MCP `list_terraform_projects`, REST fallback |
| `terraform_cloud.workspace.list` | READ | No | MCP `list_workspaces`, REST fallback |
| `terraform_cloud.workspace.get` | READ | No | MCP `get_workspace_details`, REST fallback |
| `terraform_cloud.run.list` | READ | No | MCP `list_runs`, REST fallback |
| `terraform_cloud.run.get` | READ | No | MCP `get_run_details`, REST fallback |
| `terraform_cloud.variable.list` | READ | No | MCP `list_workspace_variables`, REST fallback |
| `terraform_cloud.workspace.create` | WRITE | Yes | MCP `create_workspace`, REST fallback |
| `terraform_cloud.run.create_plan` | WRITE | Yes | MCP `create_run` with `plan_only`, REST fallback |
| `terraform_cloud.run.apply` | HIGH_RISK | Yes | MCP `action_run`, REST fallback |
| `terraform_cloud.run.cancel` | HIGH_RISK | Yes | MCP `action_run`, REST fallback |
| `terraform_cloud.workspace.safe_delete` | DESTRUCTIVE | Yes | MCP `delete_workspace_safely`, REST fallback |

The connector intentionally exposes only a speculative `plan_only` run creator. It does not expose auto-approve or destroy-run creation.

## Approval model

READ tools execute automatically after allowlist checks. WRITE tools require `TERRAFORM_CLOUD_ENABLE_WRITE=true` and a 64-character HMAC-SHA256 approval token computed from the tool name using `TERRAFORM_CLOUD_APPROVAL_SECRET`. HIGH_RISK/DESTRUCTIVE tools additionally require `TERRAFORM_CLOUD_ENABLE_DESTRUCTIVE=true`.

This keeps apply/cancel/delete behind an explicit human-controlled boundary and prevents an agent from raising its own permissions.

## Reliability and rate limits

REST calls use bounded timeout and retries. Retries are limited to GET requests on 429/5xx responses, honoring `Retry-After` when provided. Mutating requests are never blindly retried. HCP Terraform documents a general limit of up to 30 requests/second for most endpoints; the workspace runs list endpoint has a lower documented limit of 30 requests/minute.

Pagination parameters are exposed on workspace/run list operations. The connector does not fan out into unnecessary per-item requests.

## Error handling

Authentication/authorization, validation, allowlist denial, provider errors and rate limiting are surfaced as connector errors. HCP Terraform commonly returns 401 for invalid tokens and may use 404 for forbidden resources with an otherwise valid token. MCP failures fail safely into the official REST fallback rather than trusting newly discovered or renamed tools.

## Security considerations

- Tokens never enter tool arguments or agent-visible prompts.
- Organization/workspace allowlists restrict blast radius.
- Write/destructive operations are disabled by default.
- Human approval uses constant-time HMAC comparison.
- The connector only calls fixed HCP Terraform API paths; there is no arbitrary URL/request tool.
- The official upstream MCP server is launched with the configured token and restricted `terraform` toolset.
- Upstream content and logs must be treated as untrusted data, not instructions.
- Sensitive state download URLs returned by HCP Terraform must be treated as secrets; this connector does not expose a state-download tool.

## Testing

```bash
npm test
npm run typecheck
```

Unit tests require no live HCP Terraform credentials and cover configuration, allowlists, write/destructive policy, approval, bearer authentication, API errors, and the no-retry rule for writes.

## Limitations

The optional MCP-first path requires HashiCorp's official binary to be installed. Exact capabilities available through MCP can vary by binary version and token permissions; the connector verifies tool presence and falls back to documented REST endpoints when MCP is unavailable or rejects a call. This connector does not expose state downloads, arbitrary API requests, auto-apply run creation, destroy runs, force-unlock, billing, team/permission administration, or secret-variable values.
