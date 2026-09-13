export interface Config {
  token: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
  allowDestructive: boolean;
}

function bool(value: string | undefined, fallback = false): boolean {
  return value === undefined ? fallback : value.toLowerCase() === "true";
}
function int(name: string, value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 0) throw new Error(`${name} must be a non-negative integer`);
  return n;
}
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.PUSHOVER_APP_TOKEN?.trim();
  if (!token || !/^[A-Za-z0-9]{30}$/.test(token)) throw new Error("PUSHOVER_APP_TOKEN must be a 30-character Pushover application token");
  return {
    token,
    timeoutMs: int("PUSHOVER_TIMEOUT_MS", env.PUSHOVER_TIMEOUT_MS, 10000),
    maxRetries: Math.min(5, int("PUSHOVER_MAX_RETRIES", env.PUSHOVER_MAX_RETRIES, 2)),
    allowWrites: bool(env.PUSHOVER_ALLOW_WRITES),
    allowHighRisk: bool(env.PUSHOVER_ALLOW_HIGH_RISK),
    allowDestructive: bool(env.PUSHOVER_ALLOW_DESTRUCTIVE)
  };
}
