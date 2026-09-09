export type Config = {
  accessToken: string;
  apiBase: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  destructiveEnabled: boolean;
};

function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value == null || value === '') return fallback;
  return value.toLowerCase() === 'true';
}

export function loadConfig(): Config {
  const accessToken = process.env.FORMSTACK_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error('FORMSTACK_ACCESS_TOKEN is required');

  const apiBase = (process.env.FORMSTACK_API_BASE ?? 'https://www.formstack.com/api/v2025').replace(/\/+$/, '');
  const url = new URL(apiBase);
  if (url.protocol !== 'https:') throw new Error('FORMSTACK_API_BASE must use HTTPS');

  const timeoutMs = Number(process.env.FORMSTACK_REQUEST_TIMEOUT_MS ?? '15000');
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 60000) {
    throw new Error('FORMSTACK_REQUEST_TIMEOUT_MS must be between 1000 and 60000');
  }

  return {
    accessToken,
    apiBase,
    timeoutMs,
    requireWriteApproval: bool('FORMSTACK_REQUIRE_WRITE_APPROVAL', true),
    destructiveEnabled: bool('FORMSTACK_DESTRUCTIVE_ENABLED', false)
  };
}
