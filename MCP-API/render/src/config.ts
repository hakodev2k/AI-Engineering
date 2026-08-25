import crypto from 'node:crypto';

export type RenderConfig = {
  apiKey: string;
  apiBaseUrl: string;
  mcpUrl: string;
  timeoutMs: number;
  maxRetries: number;
  enableApiFallback: boolean;
  requireWriteApproval: boolean;
  approvalSecret?: string;
};

const bool = (value: string | undefined, fallback: boolean) => value == null ? fallback : value.toLowerCase() === 'true';
const int = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): RenderConfig {
  const apiKey = env.RENDER_API_KEY?.trim();
  if (!apiKey) throw new Error('RENDER_API_KEY is required');
  const apiBaseUrl = env.RENDER_API_BASE_URL?.trim() || 'https://api.render.com/v1';
  const mcpUrl = env.RENDER_MCP_URL?.trim() || 'https://mcp.render.com/mcp';
  for (const raw of [apiBaseUrl, mcpUrl]) {
    const u = new URL(raw);
    if (u.protocol !== 'https:') throw new Error('Render upstream URLs must use HTTPS');
  }
  return {
    apiKey,
    apiBaseUrl: apiBaseUrl.replace(/\/$/, ''),
    mcpUrl,
    timeoutMs: int(env.RENDER_REQUEST_TIMEOUT_MS, 20_000),
    maxRetries: Math.min(int(env.RENDER_MAX_RETRIES, 3), 5),
    enableApiFallback: bool(env.RENDER_ENABLE_API_FALLBACK, true),
    requireWriteApproval: bool(env.RENDER_REQUIRE_WRITE_APPROVAL, true),
    approvalSecret: env.RENDER_APPROVAL_SECRET?.trim() || undefined
  };
}

export function approvalDigest(secret: string, tool: string, subject: string): string {
  return crypto.createHmac('sha256', secret).update(`${tool}:${subject}`).digest('hex');
}
