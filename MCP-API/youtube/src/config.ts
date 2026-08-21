export type YouTubeConfig = {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  requireWriteApproval: boolean;
  timeoutMs: number;
};

function optional(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): YouTubeConfig {
  const timeoutMs = Number(env.YOUTUBE_TIMEOUT_MS ?? "15000");
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error("YOUTUBE_TIMEOUT_MS must be between 1000 and 120000");
  }

  const config: YouTubeConfig = {
    apiKey: optional(env.YOUTUBE_API_KEY),
    accessToken: optional(env.YOUTUBE_ACCESS_TOKEN),
    refreshToken: optional(env.YOUTUBE_REFRESH_TOKEN),
    clientId: optional(env.YOUTUBE_CLIENT_ID),
    clientSecret: optional(env.YOUTUBE_CLIENT_SECRET),
    requireWriteApproval: (env.YOUTUBE_REQUIRE_WRITE_APPROVAL ?? "true").toLowerCase() !== "false",
    timeoutMs,
  };

  if (!config.apiKey && !config.accessToken && !config.refreshToken) {
    throw new Error("Configure YOUTUBE_API_KEY or OAuth credentials");
  }
  if (config.refreshToken && (!config.clientId || !config.clientSecret)) {
    throw new Error("YOUTUBE_REFRESH_TOKEN requires YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET");
  }
  return config;
}
