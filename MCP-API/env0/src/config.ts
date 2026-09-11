export interface Config {
  apiKey: string;
  apiSecret: string;
  organizationId?: string;
  image: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
}

const bool = (v: string | undefined, fallback: boolean) => v == null ? fallback : /^(1|true|yes)$/i.test(v);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.ENV0_API_KEY?.trim();
  const apiSecret = env.ENV0_API_SECRET?.trim();
  if (!apiKey || !apiSecret) throw new Error('ENV0_API_KEY and ENV0_API_SECRET are required');
  const timeoutMs = Number(env.ENV0_TIMEOUT_MS ?? '30000');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('ENV0_TIMEOUT_MS must be 1000..120000');
  return {
    apiKey,
    apiSecret,
    organizationId: env.ENV0_ORGANIZATION_ID?.trim() || undefined,
    image: env.ENV0_MCP_IMAGE?.trim() || 'env0/mcp-server',
    timeoutMs,
    requireWriteApproval: bool(env.ENV0_REQUIRE_WRITE_APPROVAL, true),
    enableDestructive: bool(env.ENV0_ENABLE_DESTRUCTIVE, false)
  };
}
