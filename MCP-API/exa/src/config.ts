export type Config = {
  apiKey?: string;
  timeoutMs: number;
  maxRetries: number;
  requireApproval: boolean;
};

function boundedInt(value: string | undefined, fallback: number, min: number, max: number): number {
  if (!value) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`Invalid numeric configuration: ${value}`);
  return n;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    apiKey: env.EXA_API_KEY?.trim() || undefined,
    timeoutMs: boundedInt(env.EXA_TIMEOUT_MS, 30000, 1000, 120000),
    maxRetries: boundedInt(env.EXA_MAX_RETRIES, 2, 0, 4),
    requireApproval: (env.EXA_REQUIRE_APPROVAL ?? "true").toLowerCase() !== "false"
  };
}
