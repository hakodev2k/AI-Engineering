export type Config = {
  account: string;
  token: string;
  baseUrl: string;
  timeoutMs: number;
  approvalSecret?: string;
  allowWrites: boolean;
  allowDestructive: boolean;
};

function bool(env: NodeJS.ProcessEnv, name: string, fallback = false) {
  const v = env[name];
  if (v == null || v === '') return fallback;
  if (v === 'true') return true;
  if (v === 'false') return false;
  throw new Error(`${name} must be true or false`);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const account = env.KEYGEN_ACCOUNT?.trim();
  const token = env.KEYGEN_TOKEN?.trim();
  if (!account) throw new Error('KEYGEN_ACCOUNT is required');
  if (!token) throw new Error('KEYGEN_TOKEN is required');
  const timeoutMs = Number(env.KEYGEN_TIMEOUT_MS ?? '15000');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 60000) throw new Error('KEYGEN_TIMEOUT_MS must be 1000..60000');
  const baseUrl = (env.KEYGEN_API_BASE_URL ?? 'https://api.keygen.sh').replace(/\/$/, '');
  if (!/^https:\/\//.test(baseUrl) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(baseUrl)) throw new Error('KEYGEN_API_BASE_URL must use HTTPS except loopback tests');
  return {
    account,
    token,
    baseUrl,
    timeoutMs,
    approvalSecret: env.KEYGEN_APPROVAL_SECRET,
    allowWrites: bool(env, 'KEYGEN_ALLOW_WRITES'),
    allowDestructive: bool(env, 'KEYGEN_ALLOW_DESTRUCTIVE')
  };
}
