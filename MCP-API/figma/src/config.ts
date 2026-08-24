import crypto from 'node:crypto';

export type AuthMode = 'oauth' | 'token';

export interface FigmaConfig {
  authMode: AuthMode;
  accessToken?: string;
  token?: string;
  allowedFileKeys: Set<string>;
  allowedTeamIds: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  baseUrl: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): FigmaConfig {
  const authMode = (env.FIGMA_AUTH_MODE ?? 'oauth') as AuthMode;
  if (!['oauth', 'token'].includes(authMode)) throw new Error('FIGMA_AUTH_MODE must be oauth or token');
  if (authMode === 'oauth' && !env.FIGMA_ACCESS_TOKEN) throw new Error('FIGMA_ACCESS_TOKEN is required for oauth mode');
  if (authMode === 'token' && !env.FIGMA_TOKEN) throw new Error('FIGMA_TOKEN is required for token mode');
  const timeoutMs = Number(env.FIGMA_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.FIGMA_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('FIGMA_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('FIGMA_MAX_RETRIES must be 0..5');
  return {
    authMode,
    accessToken: env.FIGMA_ACCESS_TOKEN,
    token: env.FIGMA_TOKEN,
    allowedFileKeys: csvSet(env.FIGMA_ALLOWED_FILE_KEYS),
    allowedTeamIds: csvSet(env.FIGMA_ALLOWED_TEAM_IDS),
    approvalSecret: env.FIGMA_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    baseUrl: 'https://api.figma.com'
  };
}

export function assertFileAllowed(config: FigmaConfig, fileKey: string) {
  if (config.allowedFileKeys.size && !config.allowedFileKeys.has(fileKey)) throw new Error(`File key not allowed: ${fileKey}`);
}

export function assertTeamAllowed(config: FigmaConfig, teamId: string) {
  if (config.allowedTeamIds.size && !config.allowedTeamIds.has(teamId)) throw new Error(`Team id not allowed: ${teamId}`);
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
