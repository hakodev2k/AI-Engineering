export type Config = {
  accountDomain: string;
  accessToken: string;
  timeoutMs: number;
  maxRetries: number;
  writeApproved: boolean;
  userAgent: string;
};

const intEnv = (name: string, fallback: number) => {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const accountDomain = env.AHA_ACCOUNT_DOMAIN?.trim();
  const accessToken = env.AHA_ACCESS_TOKEN?.trim();
  if (!accountDomain) throw new Error('AHA_ACCOUNT_DOMAIN is required');
  if (!/^[a-z0-9][a-z0-9.-]*\.aha\.io$/i.test(accountDomain)) throw new Error('AHA_ACCOUNT_DOMAIN must be an *.aha.io hostname');
  if (!accessToken) throw new Error('AHA_ACCESS_TOKEN is required');
  return {
    accountDomain,
    accessToken,
    timeoutMs: intEnv('AHA_TIMEOUT_MS', 15000),
    maxRetries: Math.min(intEnv('AHA_MAX_RETRIES', 2), 5),
    writeApproved: env.AHA_WRITE_APPROVED === 'true',
    userAgent: env.AHA_USER_AGENT?.trim() || 'daily-mcp-aha/1.0.0 (contact: admin@example.invalid)'
  };
}
