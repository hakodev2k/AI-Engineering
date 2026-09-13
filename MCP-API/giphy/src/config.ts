export type Rating = "g" | "pg" | "pg-13" | "r";

export interface GiphyConfig {
  apiKey: string;
  timeoutMs: number;
  maxRetries: number;
  defaultRating: Rating;
  baseUrl: string;
}

function intEnv(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer`);
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GiphyConfig {
  const apiKey = env.GIPHY_API_KEY?.trim();
  if (!apiKey) throw new Error("GIPHY_API_KEY is required");
  const rating = (env.GIPHY_DEFAULT_RATING ?? "g") as Rating;
  if (!["g", "pg", "pg-13", "r"].includes(rating)) throw new Error("GIPHY_DEFAULT_RATING must be g, pg, pg-13, or r");
  return {
    apiKey,
    timeoutMs: intEnv("GIPHY_TIMEOUT_MS", env.GIPHY_TIMEOUT_MS, 10_000),
    maxRetries: Math.min(5, intEnv("GIPHY_MAX_RETRIES", env.GIPHY_MAX_RETRIES, 2)),
    defaultRating: rating,
    baseUrl: "https://api.giphy.com"
  };
}
