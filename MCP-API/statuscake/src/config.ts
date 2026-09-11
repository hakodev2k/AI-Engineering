export interface StatusCakeConfig {
  apiToken: string;
  apiBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  requireWriteApproval: boolean;
  enableDestructive: boolean;
}

const bool = (value: string | undefined, fallback: boolean) =>
  value == null ? fallback : value.toLowerCase() === "true";

export function loadConfig(env: NodeJS.ProcessEnv = process.env): StatusCakeConfig {
  const apiToken = env.STATUSCAKE_API_TOKEN?.trim();
  if (!apiToken) throw new Error("STATUSCAKE_API_TOKEN is required");

  const apiBaseUrl = (env.STATUSCAKE_API_BASE_URL ?? "https://api.statuscake.com/v1").replace(/\/$/, "");
  if (!apiBaseUrl.startsWith("https://")) throw new Error("STATUSCAKE_API_BASE_URL must use HTTPS");

  const timeoutMs = Number(env.STATUSCAKE_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.STATUSCAKE_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error("Invalid STATUSCAKE_TIMEOUT_MS");
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error("Invalid STATUSCAKE_MAX_RETRIES");

  return {
    apiToken,
    apiBaseUrl,
    timeoutMs,
    maxRetries,
    requireWriteApproval: bool(env.STATUSCAKE_REQUIRE_WRITE_APPROVAL, true),
    enableDestructive: bool(env.STATUSCAKE_ENABLE_DESTRUCTIVE, false)
  };
}
