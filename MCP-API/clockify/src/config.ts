export type Config = {
  apiKey: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowDestructive: boolean;
  approvalToken?: string;
};

function intEnv(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer.`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.CLOCKIFY_API_KEY?.trim();
  if (!apiKey) throw new Error("CLOCKIFY_API_KEY is required.");
  return {
    apiKey,
    timeoutMs: Math.max(1000, intEnv(env, "CLOCKIFY_TIMEOUT_MS", 15000)),
    maxRetries: Math.min(intEnv(env, "CLOCKIFY_MAX_RETRIES", 3), 5),
    allowWrites: env.CLOCKIFY_ALLOW_WRITES === "true",
    allowDestructive: env.CLOCKIFY_ALLOW_DESTRUCTIVE === "true",
    approvalToken: env.CLOCKIFY_APPROVAL_TOKEN?.trim() || undefined
  };
}
