export function loadConfig(env = process.env) {
  const token = env.SIGNNOW_ACCESS_TOKEN?.trim();
  if (!token) throw new Error('SIGNNOW_ACCESS_TOKEN is required');
  const baseUrl = (env.SIGNNOW_API_BASE_URL || 'https://api.signnow.com').replace(/\/$/, '');
  if (!['https://api.signnow.com','https://api-eval.signnow.com'].includes(baseUrl)) throw new Error('SIGNNOW_API_BASE_URL must be an official SignNow API host');
  return { token, baseUrl, timeoutMs: Number(env.SIGNNOW_TIMEOUT_MS || 15000), maxRetries: Math.min(Number(env.SIGNNOW_MAX_RETRIES || 2), 4), allowWrites: env.SIGNNOW_ALLOW_WRITES === 'true' };
}

export function authHeaders(config) {
  return { Authorization: `Bearer ${config.token}`, Accept: 'application/json' };
}
