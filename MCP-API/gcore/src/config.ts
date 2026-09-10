export type GcoreConfig = {
  apiKey: string;
  baseUrl: string;
  projectId?: string;
  regionId?: string;
  clientId?: string;
  approvalSecret?: string;
  allowWrite: boolean;
  allowHighRisk: boolean;
  allowDestructive: boolean;
  timeoutMs: number;
};

const bool = (name: string, fallback = false): boolean => {
  const value = process.env[name];
  if (value == null || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be true or false`);
};

const boundedInt = (name: string, fallback: number, min: number, max: number): number => {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
};

export function loadConfig(env = process.env): GcoreConfig {
  const apiKey = env.GCORE_API_KEY?.trim();
  if (!apiKey) throw new Error("GCORE_API_KEY is required");

  const baseUrl = (env.GCORE_BASE_URL ?? "https://api.gcore.com").trim();
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:" || parsed.hostname !== "api.gcore.com") {
    throw new Error("GCORE_BASE_URL must be https://api.gcore.com");
  }

  const previous = process.env;
  process.env = env;
  try {
    return {
      apiKey,
      baseUrl,
      projectId: env.GCORE_CLOUD_PROJECT_ID?.trim() || undefined,
      regionId: env.GCORE_CLOUD_REGION_ID?.trim() || undefined,
      clientId: env.GCORE_CLIENT_ID?.trim() || undefined,
      approvalSecret: env.GCORE_APPROVAL_SECRET?.trim() || undefined,
      allowWrite: bool("GCORE_ALLOW_WRITE"),
      allowHighRisk: bool("GCORE_ALLOW_HIGH_RISK"),
      allowDestructive: bool("GCORE_ALLOW_DESTRUCTIVE"),
      timeoutMs: boundedInt("GCORE_UPSTREAM_TIMEOUT_MS", 30000, 1000, 120000)
    };
  } finally {
    process.env = previous;
  }
}
