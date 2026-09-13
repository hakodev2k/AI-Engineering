export interface OpenWeatherConfig {
  apiKey: string;
  timeoutMs: number;
  maxRetries: number;
  baseUrl: string;
  geoBaseUrl: string;
}

function positiveInt(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer`);
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): OpenWeatherConfig {
  const apiKey = env.OPENWEATHER_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY is required");
  return {
    apiKey,
    timeoutMs: positiveInt("OPENWEATHER_TIMEOUT_MS", env.OPENWEATHER_TIMEOUT_MS, 10_000),
    maxRetries: Math.min(5, positiveInt("OPENWEATHER_MAX_RETRIES", env.OPENWEATHER_MAX_RETRIES, 2)),
    baseUrl: "https://api.openweathermap.org",
    geoBaseUrl: "https://api.openweathermap.org/geo/1.0"
  };
}
