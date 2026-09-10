export interface Config {
  apiToken: string;
  apiBaseUrl: string;
  timeoutMs: number;
  maxReadRetries: number;
  approvalSecret: string;
  enableDestructive: boolean;
}

function integer(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer from ${min} to ${max}`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiToken = env.PINGDOM_API_TOKEN?.trim();
  if (!apiToken) throw new Error('PINGDOM_API_TOKEN is required');
  const approvalSecret = env.PINGDOM_APPROVAL_SECRET?.trim();
  if (!approvalSecret || approvalSecret.length < 32) throw new Error('PINGDOM_APPROVAL_SECRET must contain at least 32 characters');
  const apiBaseUrl = (env.PINGDOM_API_BASE_URL || 'https://api.pingdom.com/api/3.1').replace(/\/$/, '');
  const url = new URL(apiBaseUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'api.pingdom.com') throw new Error('PINGDOM_API_BASE_URL must use https://api.pingdom.com');
  return {
    apiToken,
    apiBaseUrl,
    timeoutMs: integer('PINGDOM_TIMEOUT_MS', 10000, 1000, 120000),
    maxReadRetries: integer('PINGDOM_MAX_READ_RETRIES', 2, 0, 5),
    approvalSecret,
    enableDestructive: env.PINGDOM_ENABLE_DESTRUCTIVE === 'true'
  };
}
