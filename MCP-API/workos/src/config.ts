export type Config = {
  apiKey: string;
  apiBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  approvedActions: Set<string>;
};

const asBool = (value: string | undefined, fallback: boolean) => value == null ? fallback : /^(1|true|yes)$/i.test(value);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.WORKOS_API_KEY?.trim();
  if (!apiKey) throw new Error('WORKOS_API_KEY is required');
  const timeoutMs = Number(env.WORKOS_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.WORKOS_MAX_RETRIES ?? 2);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('WORKOS_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('WORKOS_MAX_RETRIES must be 0..5');
  const url = new URL(env.WORKOS_API_BASE_URL ?? 'https://api.workos.com');
  if (url.protocol !== 'https:') throw new Error('WORKOS_API_BASE_URL must use HTTPS');
  return {
    apiKey,
    apiBaseUrl: url.toString().replace(/\/$/, ''),
    timeoutMs,
    maxRetries,
    requireWriteApproval: asBool(env.WORKOS_REQUIRE_WRITE_APPROVAL, true),
    approvedActions: new Set((env.WORKOS_APPROVED_ACTIONS ?? '').split(',').map(x => x.trim()).filter(Boolean))
  };
}
