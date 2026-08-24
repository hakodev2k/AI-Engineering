export type AuthMode = 'entra' | 'pat';

export interface AzureDevOpsConfig {
  organization: string;
  authMode: AuthMode;
  bearerToken?: string;
  pat?: string;
  patEmail: string;
  allowedProjects: Set<string>;
  allowedRepositories: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  mcpEnabled: boolean;
}

const slug = /^[A-Za-z0-9._-]+$/;

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean));
}

function bool(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('Boolean environment values must be true or false');
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AzureDevOpsConfig {
  const organization = env.AZURE_DEVOPS_ORGANIZATION?.trim() ?? '';
  if (!organization || !slug.test(organization)) throw new Error('AZURE_DEVOPS_ORGANIZATION is required and must be filesystem/URL safe');
  const authMode = (env.AZURE_DEVOPS_AUTH_MODE ?? 'entra') as AuthMode;
  if (!['entra', 'pat'].includes(authMode)) throw new Error('AZURE_DEVOPS_AUTH_MODE must be entra or pat');
  if (authMode === 'entra' && !env.AZURE_DEVOPS_BEARER_TOKEN) throw new Error('AZURE_DEVOPS_BEARER_TOKEN is required for entra mode');
  if (authMode === 'pat' && !env.AZURE_DEVOPS_PAT) throw new Error('AZURE_DEVOPS_PAT is required for pat mode');
  const timeoutMs = Number(env.AZURE_DEVOPS_TIMEOUT_MS ?? 20000);
  const maxRetries = Number(env.AZURE_DEVOPS_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('AZURE_DEVOPS_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('AZURE_DEVOPS_MAX_RETRIES must be 0..5');
  return {
    organization,
    authMode,
    bearerToken: env.AZURE_DEVOPS_BEARER_TOKEN,
    pat: env.AZURE_DEVOPS_PAT,
    patEmail: env.AZURE_DEVOPS_PAT_EMAIL?.trim() || 'connector@example.invalid',
    allowedProjects: csvSet(env.AZURE_DEVOPS_ALLOWED_PROJECTS),
    allowedRepositories: csvSet(env.AZURE_DEVOPS_ALLOWED_REPOSITORIES),
    approvalSecret: env.AZURE_DEVOPS_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    mcpEnabled: bool(env.AZURE_DEVOPS_MCP_ENABLED, true)
  };
}

export function assertProjectAllowed(config: AzureDevOpsConfig, project: string) {
  if (config.allowedProjects.size && !config.allowedProjects.has(project.toLowerCase())) throw new Error(`Project not allowed: ${project}`);
}

export function assertRepositoryAllowed(config: AzureDevOpsConfig, project: string, repository: string) {
  assertProjectAllowed(config, project);
  if (!config.allowedRepositories.size) return;
  const repo = repository.toLowerCase();
  const keys = [repo, `${project.toLowerCase()}/${repo}`];
  if (!keys.some(k => config.allowedRepositories.has(k))) throw new Error(`Repository not allowed: ${project}/${repository}`);
}
