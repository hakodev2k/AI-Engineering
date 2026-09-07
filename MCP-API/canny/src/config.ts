export type Config = {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.CANNY_API_KEY?.trim();
  if (!apiKey) throw new Error('CANNY_API_KEY is required');
  const baseUrl = (env.CANNY_API_BASE_URL || 'https://canny.io/api').replace(/\/$/, '');
  if (!baseUrl.startsWith('https://')) throw new Error('CANNY_API_BASE_URL must use https');
  const timeoutMs = Number(env.CANNY_TIMEOUT_MS || 15000);
  const maxRetries = Number(env.CANNY_MAX_RETRIES || 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 60000) throw new Error('CANNY_TIMEOUT_MS must be 1000..60000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('CANNY_MAX_RETRIES must be 0..5');
  return { apiKey, baseUrl, timeoutMs, maxRetries, requireWriteApproval: (env.CANNY_REQUIRE_WRITE_APPROVAL || 'true').toLowerCase() !== 'false' };
}
