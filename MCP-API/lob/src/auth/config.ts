export type LobConfig = {
  apiKey: string;
  baseUrl: string;
  apiVersion: string;
  timeoutMs: number;
  maxRetries: number;
  approvalToken?: string;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
};

function bool(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function int(value: string | undefined, fallback: number, min: number, max: number): number {
  if (value == null || value === "") return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`Invalid integer configuration value: ${value}`);
  }
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): LobConfig {
  const apiKey = env.LOB_API_KEY?.trim();
  if (!apiKey) throw new Error("LOB_API_KEY is required");
  if (!/^(test|live)_[A-Za-z0-9]+$/.test(apiKey)) {
    throw new Error("LOB_API_KEY must be a Lob test_* or live_* secret key");
  }

  const baseUrl = (env.LOB_API_BASE_URL ?? "https://api.lob.com/v1").replace(/\/+$/, "");
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:") throw new Error("LOB_API_BASE_URL must use HTTPS");

  return {
    apiKey,
    baseUrl,
    apiVersion: env.LOB_API_VERSION?.trim() || "2024-01-01",
    timeoutMs: int(env.LOB_TIMEOUT_MS, 15000, 1000, 120000),
    maxRetries: int(env.LOB_MAX_RETRIES, 2, 0, 5),
    approvalToken: env.LOB_APPROVAL_TOKEN?.trim() || undefined,
    requireWriteApproval: bool(env.LOB_REQUIRE_WRITE_APPROVAL, false),
    enableDestructive: bool(env.LOB_ENABLE_DESTRUCTIVE, false),
  };
}
