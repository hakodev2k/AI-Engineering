export type HarvestConfig = {
  accessToken: string;
  accountId: string;
  userAgent: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  approvalToken?: string;
};

function readInteger(env: NodeJS.ProcessEnv, name: string, fallback: number, min: number, max: number): number {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): HarvestConfig {
  const accessToken = env.HARVEST_ACCESS_TOKEN?.trim();
  const accountId = env.HARVEST_ACCOUNT_ID?.trim();
  const userAgent = env.HARVEST_USER_AGENT?.trim();

  if (!accessToken) throw new Error("HARVEST_ACCESS_TOKEN is required.");
  if (!accountId || !/^\d+$/.test(accountId)) throw new Error("HARVEST_ACCOUNT_ID is required and must be numeric.");
  if (!userAgent || userAgent.length < 3 || userAgent.length > 300) throw new Error("HARVEST_USER_AGENT is required and must identify the integration.");

  return {
    accessToken,
    accountId,
    userAgent,
    timeoutMs: readInteger(env, "HARVEST_TIMEOUT_MS", 15000, 1000, 120000),
    maxRetries: readInteger(env, "HARVEST_MAX_RETRIES", 3, 0, 5),
    allowWrites: env.HARVEST_ALLOW_WRITES === "true",
    approvalToken: env.HARVEST_APPROVAL_TOKEN?.trim() || undefined
  };
}
