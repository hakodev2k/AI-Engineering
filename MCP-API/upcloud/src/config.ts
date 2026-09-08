export const config = {
  token: process.env.UPCLOUD_TOKEN ?? '',
  baseUrl: process.env.UPCLOUD_API_BASE_URL ?? 'https://api.upcloud.com/1.3',
  timeoutMs: Math.max(1000, Number(process.env.UPCLOUD_TIMEOUT_MS ?? 15000)),
  maxRetries: Math.min(5, Math.max(0, Number(process.env.UPCLOUD_MAX_RETRIES ?? 2))),
  allowWrite: process.env.UPCLOUD_ALLOW_WRITE === 'true',
  allowHighRisk: process.env.UPCLOUD_ALLOW_HIGH_RISK === 'true',
  allowDestructive: process.env.UPCLOUD_ALLOW_DESTRUCTIVE === 'true',
};

export function assertConfig() {
  if (!config.token) throw new Error('UPCLOUD_TOKEN is required');
  const u = new URL(config.baseUrl);
  if (u.protocol !== 'https:') throw new Error('UPCLOUD_API_BASE_URL must use HTTPS');
}
