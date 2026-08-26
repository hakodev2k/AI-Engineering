import crypto from 'node:crypto';

export type Config = {
  apiKey: string;
  upstreamUrl: string;
  approvalSecret?: string;
  requireWriteApproval: boolean;
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error('RESEND_API_KEY is required');
  const upstreamUrl = (env.RESEND_UPSTREAM_MCP_URL || 'https://mcp.resend.com/mcp').trim();
  const parsed = new URL(upstreamUrl);
  if (parsed.protocol !== 'https:') throw new Error('RESEND_UPSTREAM_MCP_URL must use HTTPS');
  const timeoutMs = Number(env.RESEND_TIMEOUT_MS || 15000);
  const maxRetries = Number(env.RESEND_MAX_RETRIES || 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid RESEND_TIMEOUT_MS');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('Invalid RESEND_MAX_RETRIES');
  return {
    apiKey,
    upstreamUrl,
    approvalSecret: env.RESEND_APPROVAL_SECRET?.trim() || undefined,
    requireWriteApproval: (env.RESEND_REQUIRE_WRITE_APPROVAL || 'true').toLowerCase() !== 'false',
    timeoutMs,
    maxRetries
  };
}

export function approvalToken(secret: string, tool: string, payload: unknown): string {
  return crypto.createHmac('sha256', secret).update(`${tool}\n${stable(payload)}`).digest('hex');
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${stable(obj[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
