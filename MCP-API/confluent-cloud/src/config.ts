export type Config = {
  apiKey: string;
  apiSecret: string;
  globalUrl: string;
  regionalUrl?: string;
  enableWrites: boolean;
  approvalSecret?: string;
  timeoutMs: number;
  maxReadRetries: number;
};

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  const value = raw ? Number(raw) : fallback;
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(env = process.env): Config {
  const apiKey = env.CONFLUENT_API_KEY?.trim();
  const apiSecret = env.CONFLUENT_API_SECRET?.trim();
  if (!apiKey || !apiSecret) throw new Error('CONFLUENT_API_KEY and CONFLUENT_API_SECRET are required');

  const provider = env.CONFLUENT_CLOUD_PROVIDER?.trim().toLowerCase();
  const region = env.CONFLUENT_CLOUD_REGION?.trim().toLowerCase();
  const org = env.CONFLUENT_ORGANIZATION_ID?.trim();
  const anyRegional = Boolean(provider || region || org);
  if (anyRegional && !(provider && region && org)) throw new Error('Regional MCP requires CONFLUENT_CLOUD_PROVIDER, CONFLUENT_CLOUD_REGION, and CONFLUENT_ORGANIZATION_ID together');
  if (provider && !['aws','gcp','azure'].includes(provider)) throw new Error('CONFLUENT_CLOUD_PROVIDER must be aws, gcp, or azure');
  if (org && !/^[A-Za-z0-9-]{3,128}$/.test(org)) throw new Error('Invalid CONFLUENT_ORGANIZATION_ID');
  if (region && !/^[a-z0-9-]{2,64}$/.test(region)) throw new Error('Invalid CONFLUENT_CLOUD_REGION');

  return {
    apiKey,
    apiSecret,
    globalUrl: 'https://api.confluent.cloud/mcp/v1',
    regionalUrl: anyRegional ? `https://mcp.${region}.${provider}.confluent.cloud/mcp/v1/organizations/${encodeURIComponent(org!)}` : undefined,
    enableWrites: env.CONFLUENT_ENABLE_WRITES === 'true',
    approvalSecret: env.CONFLUENT_APPROVAL_SECRET?.trim() || undefined,
    timeoutMs: intEnvFrom(env, 'CONFLUENT_TIMEOUT_MS', 20000, 1000, 120000),
    maxReadRetries: intEnvFrom(env, 'CONFLUENT_MAX_READ_RETRIES', 2, 0, 5)
  };
}

function intEnvFrom(env: NodeJS.ProcessEnv, name: string, fallback: number, min: number, max: number): number {
  const raw = env[name];
  const value = raw ? Number(raw) : fallback;
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function basicAuth(config: Config): string {
  return `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`, 'utf8').toString('base64')}`;
}
