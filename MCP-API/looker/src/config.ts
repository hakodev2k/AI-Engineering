import crypto from 'node:crypto';

export type Config = {
  baseUrl: string;
  clientId?: string;
  clientSecret?: string;
  mcpAccessToken?: string;
  useMcp: boolean;
  timeoutMs: number;
  maxRetries: number;
  approvalSecret?: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const baseUrl = env.LOOKER_BASE_URL?.replace(/\/$/, '');
  if (!baseUrl || !/^https:\/\//i.test(baseUrl)) throw new Error('LOOKER_BASE_URL must be an https URL');
  const timeoutMs = Number(env.LOOKER_TIMEOUT_MS ?? 20000);
  const maxRetries = Number(env.LOOKER_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid LOOKER_TIMEOUT_MS');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('Invalid LOOKER_MAX_RETRIES');
  return {
    baseUrl,
    clientId: env.LOOKER_CLIENT_ID,
    clientSecret: env.LOOKER_CLIENT_SECRET,
    mcpAccessToken: env.LOOKER_MCP_ACCESS_TOKEN,
    useMcp: (env.LOOKER_USE_MCP ?? 'true').toLowerCase() === 'true',
    timeoutMs,
    maxRetries,
    approvalSecret: env.LOOKER_APPROVAL_SECRET
  };
}

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}
