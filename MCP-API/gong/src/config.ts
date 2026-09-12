export interface GongConfig {
  apiBaseUrl: string;
  accessKey?: string;
  accessKeySecret?: string;
  oauthAccessToken?: string;
  timeoutMs: number;
  maxRetries: number;
  highRiskApproved: boolean;
}

const integer = (name: string, fallback: number, min: number, max: number): number => {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer from ${min} to ${max}`);
  return value;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GongConfig {
  const oauthAccessToken = env.GONG_OAUTH_ACCESS_TOKEN?.trim() || undefined;
  const accessKey = env.GONG_ACCESS_KEY?.trim() || undefined;
  const accessKeySecret = env.GONG_ACCESS_KEY_SECRET?.trim() || undefined;
  if (!oauthAccessToken && !(accessKey && accessKeySecret)) {
    throw new Error('Configure GONG_OAUTH_ACCESS_TOKEN or both GONG_ACCESS_KEY and GONG_ACCESS_KEY_SECRET');
  }
  const apiBaseUrl = env.GONG_API_BASE_URL?.trim() || 'https://api.gong.io';
  const url = new URL(apiBaseUrl);
  if (url.protocol !== 'https:' || !(url.hostname === 'gong.io' || url.hostname.endsWith('.gong.io'))) {
    throw new Error('GONG_API_BASE_URL must be an HTTPS gong.io host');
  }
  return {
    apiBaseUrl: url.origin,
    accessKey,
    accessKeySecret,
    oauthAccessToken,
    timeoutMs: integer('GONG_TIMEOUT_MS', 15000, 1000, 60000),
    maxRetries: integer('GONG_MAX_RETRIES', 2, 0, 5),
    highRiskApproved: env.GONG_HIGH_RISK_APPROVED === 'true'
  };
}
