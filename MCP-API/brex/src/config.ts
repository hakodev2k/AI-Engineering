export interface BrexConfig {
  accessToken: string;
  apiBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  defaultPageSize: number;
}

function parseIntEnv(name: string, value: string | undefined, fallback: number, min: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BrexConfig {
  const accessToken = env.BREX_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error("BREX_ACCESS_TOKEN is required");

  const apiBaseUrl = (env.BREX_API_BASE_URL ?? "https://api.brex.com").trim().replace(/\/$/, "");
  const parsed = new URL(apiBaseUrl);
  if (parsed.protocol !== "https:") throw new Error("BREX_API_BASE_URL must use HTTPS");

  return {
    accessToken,
    apiBaseUrl,
    timeoutMs: parseIntEnv("BREX_TIMEOUT_MS", env.BREX_TIMEOUT_MS, 10_000, 100, 120_000),
    maxRetries: parseIntEnv("BREX_MAX_RETRIES", env.BREX_MAX_RETRIES, 2, 0, 5),
    defaultPageSize: parseIntEnv("BREX_DEFAULT_PAGE_SIZE", env.BREX_DEFAULT_PAGE_SIZE, 100, 1, 1000)
  };
}
