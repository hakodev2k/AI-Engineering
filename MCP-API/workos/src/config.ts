export type Config = {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  writeApproved: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.WORKOS_API_KEY?.trim();
  if (!apiKey) throw new Error('WORKOS_API_KEY is required');
  const baseUrl = (env.WORKOS_API_BASE_URL || 'https://api.workos.com').replace(/\/$/, '');
  if (!/^https:\/\//.test(baseUrl)) throw new Error('WORKOS_API_BASE_URL must use https');
  const timeoutMs = Number(env.WORKOS_TIMEOUT_MS || 15000);
  const maxRetries = Number(env.WORKOS_MAX_RETRIES || 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('Invalid WORKOS_TIMEOUT_MS');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('Invalid WORKOS_MAX_RETRIES');
  return { apiKey, baseUrl, timeoutMs, maxRetries, writeApproved: env.WORKOS_WRITE_APPROVED === 'true' };
}
