export interface Config {
  address: string;
  token: string;
  command: string;
  args: string[];
  allowedOrgs: Set<string>;
  allowedWorkspaces: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  enableWrite: boolean;
  enableDestructive: boolean;
}

const csv = (v?: string) => new Set((v ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean));
const bool = (v?: string) => (v ?? 'false').toLowerCase() === 'true';

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  if (!env.TFE_TOKEN) throw new Error('TFE_TOKEN is required');
  const timeoutMs = Number(env.TERRAFORM_CLOUD_TIMEOUT_MS ?? 20000);
  const maxRetries = Number(env.TERRAFORM_CLOUD_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('TERRAFORM_CLOUD_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('TERRAFORM_CLOUD_MAX_RETRIES must be 0..5');
  return {
    address: (env.TFE_ADDRESS ?? 'https://app.terraform.io').replace(/\/$/, ''),
    token: env.TFE_TOKEN,
    command: env.TERRAFORM_MCP_COMMAND ?? 'terraform-mcp-server',
    args: (env.TERRAFORM_MCP_ARGS ?? '--toolsets=terraform').split(/\s+/).filter(Boolean),
    allowedOrgs: csv(env.TERRAFORM_CLOUD_ALLOWED_ORGS),
    allowedWorkspaces: csv(env.TERRAFORM_CLOUD_ALLOWED_WORKSPACES),
    approvalSecret: env.TERRAFORM_CLOUD_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    enableWrite: bool(env.TERRAFORM_CLOUD_ENABLE_WRITE),
    enableDestructive: bool(env.TERRAFORM_CLOUD_ENABLE_DESTRUCTIVE)
  };
}

export function assertOrgAllowed(config: Config, org: string) {
  if (config.allowedOrgs.size && !config.allowedOrgs.has(org.toLowerCase())) throw new Error(`Organization not allowed: ${org}`);
}

export function assertWorkspaceAllowed(config: Config, workspace: string) {
  if (config.allowedWorkspaces.size && !config.allowedWorkspaces.has(workspace.toLowerCase())) throw new Error(`Workspace not allowed: ${workspace}`);
}
