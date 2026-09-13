export interface OpenMeteoConfig {
  timeoutMs: number;
  maxRetries: number;
  apiKey?: string;
}

const int = (name: string, raw: string | undefined, fallback: number) => {
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
  return value;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): OpenMeteoConfig {
  return {
    timeoutMs: int("OPEN_METEO_TIMEOUT_MS", env.OPEN_METEO_TIMEOUT_MS, 10000),
    maxRetries: Math.min(5, int("OPEN_METEO_MAX_RETRIES", env.OPEN_METEO_MAX_RETRIES, 2)),
    apiKey: env.OPEN_METEO_API_KEY?.trim() || undefined
  };
}
