export type Config = {
  apiKey: string;
  apiBase: string;
  apiVersion: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

function bool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return raw.toLowerCase() === 'true';
}

export function loadConfig(): Config {
  const apiKey = process.env.NGROK_API_KEY?.trim();
  if (!apiKey) throw new Error('NGROK_API_KEY is required');

  const apiBase = (process.env.NGROK_API_BASE ?? 'https://api.ngrok.com').replace(/\/$/, '');
  const parsed = new URL(apiBase);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'api.ngrok.com') {
    throw new Error('NGROK_API_BASE must be https://api.ngrok.com');
  }

  const timeoutMs = Number(process.env.NGROK_REQUEST_TIMEOUT_MS ?? '15000');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('NGROK_REQUEST_TIMEOUT_MS must be an integer between 1000 and 120000');
  }

  return {
    apiKey,
    apiBase,
    apiVersion: process.env.NGROK_API_VERSION ?? '2',
    timeoutMs,
    requireWriteApproval: bool('NGROK_REQUIRE_WRITE_APPROVAL', true),
    destructiveEnabled: bool('NGROK_DESTRUCTIVE_ENABLED', false)
  };
}
