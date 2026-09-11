export type Config = {
  apiToken: string;
  baseUrl: string;
  timeoutMs: number;
  requireWriteApproval: boolean;
  approvalTokens: Set<string>;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiToken = env.SVIX_API_TOKEN?.trim();
  if (!apiToken) throw new Error("SVIX_API_TOKEN is required");

  const baseUrl = (env.SVIX_API_BASE_URL ?? "https://api.svix.com").replace(/\/$/, "");
  if (!/^https:\/\//i.test(baseUrl) && !/^http:\/\/localhost(?::\d+)?$/i.test(baseUrl)) {
    throw new Error("SVIX_API_BASE_URL must be HTTPS or localhost HTTP");
  }

  const timeoutMs = Number(env.SVIX_REQUEST_TIMEOUT_MS ?? "15000");
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error("SVIX_REQUEST_TIMEOUT_MS must be between 1000 and 120000");
  }

  const requireWriteApproval = (env.SVIX_REQUIRE_WRITE_APPROVAL ?? "true").toLowerCase() !== "false";
  const approvalTokens = new Set((env.SVIX_APPROVAL_TOKENS ?? "").split(",").map(v => v.trim()).filter(Boolean));
  return { apiToken, baseUrl, timeoutMs, requireWriteApproval, approvalTokens };
}
