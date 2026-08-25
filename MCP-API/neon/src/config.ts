import { createHmac } from 'node:crypto';

export type Config = {
  apiKey?: string;
  mcpUrl: string;
  projectId?: string;
  readonly: boolean;
  approvalSecret?: string;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const timeout = Number(env.NEON_TIMEOUT_MS ?? '20000');
  if (!Number.isFinite(timeout) || timeout < 1000 || timeout > 120000) throw new Error('NEON_TIMEOUT_MS must be 1000..120000');
  const base = env.NEON_MCP_URL ?? 'https://mcp.neon.tech/mcp';
  const url = new URL(base);
  if (url.protocol !== 'https:' || url.hostname !== 'mcp.neon.tech') throw new Error('NEON_MCP_URL must use https://mcp.neon.tech');
  const readonly = (env.NEON_READONLY ?? 'true').toLowerCase() !== 'false';
  if (readonly) url.searchParams.set('readonly', 'true');
  if (env.NEON_PROJECT_ID) url.searchParams.set('projectId', env.NEON_PROJECT_ID);
  return { apiKey: env.NEON_API_KEY, mcpUrl: url.toString(), projectId: env.NEON_PROJECT_ID, readonly, approvalSecret: env.NEON_APPROVAL_SECRET, timeoutMs: timeout };
}

export function approvalDigest(secret: string, tool: string): string {
  return createHmac('sha256', secret).update(tool).digest('hex');
}
