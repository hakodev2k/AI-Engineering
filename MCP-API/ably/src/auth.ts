export interface AblyAuthConfig { apiKey: string }

export function loadAuth(env: NodeJS.ProcessEnv = process.env): AblyAuthConfig {
  const apiKey = env.ABLY_API_KEY?.trim();
  if (!apiKey || !apiKey.includes(":")) throw new Error("ABLY_API_KEY is required and must be an Ably app key");
  return { apiKey };
}

export function basicAuthHeader(config: AblyAuthConfig): string {
  return `Basic ${Buffer.from(config.apiKey, "utf8").toString("base64")}`;
}
