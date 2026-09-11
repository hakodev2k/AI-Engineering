export type Config = {
  mcpUrl: string;
  signozUrl: string;
  apiKey: string;
  timeoutMs: number;
  allowWrite: boolean;
  allowDestructive: boolean;
};

const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const asBool = (name: string, fallback = false): boolean => {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be true or false`);
};

export const loadConfig = (): Config => {
  const mcpUrl = required('SIGNOZ_MCP_URL');
  const signozUrl = required('SIGNOZ_URL').replace(/\/$/, '');
  const apiKey = required('SIGNOZ_API_KEY');
  const timeoutMs = Number(process.env.SIGNOZ_TIMEOUT_MS ?? '15000');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('SIGNOZ_TIMEOUT_MS must be between 1000 and 120000');
  }
  for (const value of [mcpUrl, signozUrl]) {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('SigNoz URLs must use http or https');
  }
  return {
    mcpUrl,
    signozUrl,
    apiKey,
    timeoutMs,
    allowWrite: asBool('SIGNOZ_ALLOW_WRITE'),
    allowDestructive: asBool('SIGNOZ_ALLOW_DESTRUCTIVE')
  };
};
