export interface TwilioConfig {
  accountSid: string;
  apiKey: string;
  apiSecret: string;
  allowedFromNumbers: Set<string>;
  approvalSecret: string;
  timeoutMs: number;
  maxReadRetries: number;
}

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function integer(env: NodeJS.ProcessEnv, name: string, fallback: number, min: number, max: number): number {
  const raw = env[name];
  const value = raw == null || raw === '' ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be an integer from ${min} to ${max}`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): TwilioConfig {
  const accountSid = required(env, 'TWILIO_ACCOUNT_SID');
  const apiKey = required(env, 'TWILIO_API_KEY');
  const apiSecret = required(env, 'TWILIO_API_SECRET');
  const approvalSecret = required(env, 'TWILIO_APPROVAL_SECRET');
  if (!/^AC[0-9a-fA-F]{32}$/.test(accountSid)) throw new Error('TWILIO_ACCOUNT_SID must be a valid AC SID');
  if (!/^SK[0-9a-fA-F]{32}$/.test(apiKey)) throw new Error('TWILIO_API_KEY must be a valid SK SID');
  if (apiSecret.length < 16) throw new Error('TWILIO_API_SECRET is too short');
  if (approvalSecret.length < 32) throw new Error('TWILIO_APPROVAL_SECRET must be at least 32 characters');
  const allowedFromNumbers = new Set((env.TWILIO_ALLOWED_FROM_NUMBERS ?? '').split(',').map(v => v.trim()).filter(Boolean));
  return {
    accountSid,
    apiKey,
    apiSecret,
    allowedFromNumbers,
    approvalSecret,
    timeoutMs: integer(env, 'TWILIO_TIMEOUT_MS', 15000, 1000, 60000),
    maxReadRetries: integer(env, 'TWILIO_MAX_READ_RETRIES', 2, 0, 5)
  };
}
