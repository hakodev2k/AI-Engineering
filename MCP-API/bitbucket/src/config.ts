import crypto from 'node:crypto';

export type AuthMode = 'oauth' | 'api-token';

export interface BitbucketConfig {
  authMode: AuthMode;
  accessToken?: string;
  email?: string;
  apiToken?: string;
  allowedWorkspaces: Set<string>;
  allowedRepositories: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  baseUrl: string;
  preferMcp: boolean;
  rovoMcpUrl: string;
  rovoEmail?: string;
  rovoApiToken?: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BitbucketConfig {
  const authMode = (env.BITBUCKET_AUTH_MODE ?? 'oauth') as AuthMode;
  if (!['oauth', 'api-token'].includes(authMode)) throw new Error('BITBUCKET_AUTH_MODE must be oauth or api-token');
  if (authMode === 'oauth' && !env.BITBUCKET_ACCESS_TOKEN) throw new Error('BITBUCKET_ACCESS_TOKEN is required for oauth mode');
  if (authMode === 'api-token' && (!env.BITBUCKET_EMAIL || !env.BITBUCKET_API_TOKEN)) throw new Error('BITBUCKET_EMAIL and BITBUCKET_API_TOKEN are required for api-token mode');
  const timeoutMs = Number(env.BITBUCKET_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.BITBUCKET_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('BITBUCKET_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('BITBUCKET_MAX_RETRIES must be 0..5');
  const preferMcp = (env.BITBUCKET_PREFER_MCP ?? 'true').toLowerCase() !== 'false';
  return {
    authMode,
    accessToken: env.BITBUCKET_ACCESS_TOKEN,
    email: env.BITBUCKET_EMAIL,
    apiToken: env.BITBUCKET_API_TOKEN,
    allowedWorkspaces: csvSet(env.BITBUCKET_ALLOWED_WORKSPACES),
    allowedRepositories: csvSet(env.BITBUCKET_ALLOWED_REPOSITORIES),
    approvalSecret: env.BITBUCKET_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    baseUrl: 'https://api.bitbucket.org/2.0',
    preferMcp,
    rovoMcpUrl: env.ATLASSIAN_ROVO_MCP_URL ?? 'https://mcp.atlassian.com/v1/native/mcp',
    rovoEmail: env.ATLASSIAN_MCP_EMAIL,
    rovoApiToken: env.ATLASSIAN_MCP_API_TOKEN
  };
}

export function assertTargetAllowed(config: BitbucketConfig, workspace: string, repo?: string) {
  const ws = workspace.toLowerCase();
  if (config.allowedWorkspaces.size && !config.allowedWorkspaces.has(ws)) throw new Error(`Workspace not allowed: ${workspace}`);
  if (repo && config.allowedRepositories.size) {
    const keys = [repo.toLowerCase(), `${ws}/${repo.toLowerCase()}`];
    if (!keys.some(k => config.allowedRepositories.has(k))) throw new Error(`Repository not allowed: ${workspace}/${repo}`);
  }
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
