export type Region = 'us' | 'eu';

export interface ConnectorConfig {
  region: Region;
  refreshToken: string;
  approvalToken?: string;
  timeoutMs: number;
  maxRetries: number;
  apiBaseUrl: string;
  authUrl: string;
}

const intEnv = (name: string, fallback: number, min: number, max: number): number => {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const region = (env.SOLARWINDS_IR_REGION ?? 'us').toLowerCase();
  if (region !== 'us' && region !== 'eu') throw new Error('SOLARWINDS_IR_REGION must be us or eu');

  const refreshToken = env.SOLARWINDS_IR_REFRESH_TOKEN?.trim();
  if (!refreshToken) throw new Error('SOLARWINDS_IR_REFRESH_TOKEN is required');

  const isEu = region === 'eu';
  return {
    region,
    refreshToken,
    approvalToken: env.SOLARWINDS_IR_APPROVAL_TOKEN?.trim() || undefined,
    timeoutMs: intEnv('SOLARWINDS_IR_TIMEOUT_MS', 15000, 1000, 120000),
    maxRetries: intEnv('SOLARWINDS_IR_MAX_RETRIES', 2, 0, 5),
    apiBaseUrl: isEu ? 'https://api.eu.squadcast.com' : 'https://api.squadcast.com',
    authUrl: isEu ? 'https://auth.eu.squadcast.com/oauth/access-token' : 'https://auth.squadcast.com/oauth/access-token'
  };
}
