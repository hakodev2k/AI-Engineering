export interface CodecovConfig {
  apiToken: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
}

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer between ${min} and ${max}`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): CodecovConfig {
  const apiToken = env.CODECOV_API_TOKEN?.trim();
  if (!apiToken) throw new Error('CODECOV_API_TOKEN is required');
  const rawBase = (env.CODECOV_API_BASE_URL || 'https://api.codecov.io/api/v2').replace(/\/$/, '');
  const url = new URL(rawBase);
  if (url.protocol !== 'https:') throw new Error('CODECOV_API_BASE_URL must use HTTPS');
  return {
    apiToken,
    baseUrl: url.toString().replace(/\/$/, ''),
    timeoutMs: Number(env.CODECOV_TIMEOUT_MS || 15000),
    maxRetries: Number(env.CODECOV_MAX_RETRIES || 2)
  };
}
