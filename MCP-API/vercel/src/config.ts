import crypto from 'node:crypto';

export interface VercelConfig {
  accessToken: string;
  teamId?: string;
  teamSlug?: string;
  allowedProjects: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  apiBaseUrl: string;
  mcpEnabled: boolean;
  mcpUrl: string;
  mcpAccessToken?: string;
}

const csv = (v?: string) => new Set((v ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean));

export function loadConfig(env: NodeJS.ProcessEnv = process.env): VercelConfig {
  if (!env.VERCEL_ACCESS_TOKEN) throw new Error('VERCEL_ACCESS_TOKEN is required');
  const timeoutMs = Number(env.VERCEL_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.VERCEL_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('VERCEL_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('VERCEL_MAX_RETRIES must be 0..5');
  return {
    accessToken: env.VERCEL_ACCESS_TOKEN,
    teamId: env.VERCEL_TEAM_ID,
    teamSlug: env.VERCEL_TEAM_SLUG,
    allowedProjects: csv(env.VERCEL_ALLOWED_PROJECTS),
    approvalSecret: env.VERCEL_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    apiBaseUrl: 'https://api.vercel.com',
    mcpEnabled: (env.VERCEL_MCP_ENABLED ?? 'true').toLowerCase() === 'true',
    mcpUrl: env.VERCEL_MCP_URL ?? 'https://mcp.vercel.com',
    mcpAccessToken: env.VERCEL_MCP_ACCESS_TOKEN
  };
}

export function assertProjectAllowed(config: VercelConfig, project?: string) {
  if (!project || config.allowedProjects.size === 0) return;
  if (!config.allowedProjects.has(project.toLowerCase())) throw new Error(`Project not allowed: ${project}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
