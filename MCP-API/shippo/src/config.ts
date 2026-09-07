export type ApprovalMode = "none" | "writes" | "all";

export interface Config {
  token: string;
  baseUrl: string;
  apiVersion: string;
  timeoutMs: number;
  maxRetries: number;
  approvalMode: ApprovalMode;
  allowDestructive: boolean;
}

const integer = (value: string | undefined, fallback: number, min: number, max: number) => {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new Error(`Invalid integer configuration: ${value}`);
  return parsed;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const token = env.SHIPPO_API_TOKEN?.trim();
  if (!token) throw new Error("SHIPPO_API_TOKEN is required");
  const baseUrl = env.SHIPPO_API_BASE_URL ?? "https://api.goshippo.com";
  const url = new URL(baseUrl);
  if (url.protocol !== "https:") throw new Error("SHIPPO_API_BASE_URL must use HTTPS");
  const approvalMode = (env.SHIPPO_APPROVAL_MODE ?? "writes") as ApprovalMode;
  if (!["none", "writes", "all"].includes(approvalMode)) throw new Error("SHIPPO_APPROVAL_MODE must be none, writes, or all");
  return {
    token,
    baseUrl: url.origin,
    apiVersion: env.SHIPPO_API_VERSION ?? "2018-02-08",
    timeoutMs: integer(env.SHIPPO_TIMEOUT_MS, 15000, 1000, 120000),
    maxRetries: integer(env.SHIPPO_MAX_RETRIES, 2, 0, 5),
    approvalMode,
    allowDestructive: env.SHIPPO_ALLOW_DESTRUCTIVE === "true"
  };
}
