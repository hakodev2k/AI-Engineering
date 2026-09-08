export type GristConfig = {
  mcpUrl: string;
  apiKey: string;
  allowWrite: boolean;
  allowHighRisk: boolean;
  allowDestructive: boolean;
  timeoutMs: number;
  maxRetries: number;
};

const asBool = (value: string | undefined) => value === 'true';
const asInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GristConfig {
  const apiKey = env.GRIST_API_KEY?.trim();
  if (!apiKey) throw new Error('GRIST_API_KEY is required');
  const rawUrl = env.GRIST_MCP_URL?.trim() || 'https://docs.getgrist.com/api/mcp';
  const url = new URL(rawUrl);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    throw new Error('GRIST_MCP_URL must use HTTPS except for localhost development');
  }
  return {
    mcpUrl: url.toString(),
    apiKey,
    allowWrite: asBool(env.GRIST_ALLOW_WRITE),
    allowHighRisk: asBool(env.GRIST_ALLOW_HIGH_RISK),
    allowDestructive: asBool(env.GRIST_ALLOW_DESTRUCTIVE),
    timeoutMs: Math.max(1000, Math.min(asInt(env.GRIST_TIMEOUT_MS, 15000), 120000)),
    maxRetries: Math.min(asInt(env.GRIST_MAX_RETRIES, 2), 5),
  };
}

export function authHeaders(config: GristConfig): Record<string, string> {
  return { Authorization: `Bearer ${config.apiKey}` };
}
