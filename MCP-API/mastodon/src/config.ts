import { z } from "zod";

const bool = (v: string | undefined) => v === "true";

export interface Config {
  baseUrl: string;
  token: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  allowHighRisk: boolean;
  allowDestructive: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const baseUrl = z.string().url().parse(env.MASTODON_BASE_URL);
  const parsed = new URL(baseUrl);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== "/") {
    throw new Error("MASTODON_BASE_URL must be an HTTPS origin with no path, credentials, query, or fragment");
  }
  const token = z.string().min(1).parse(env.MASTODON_ACCESS_TOKEN);
  const timeoutMs = z.coerce.number().int().min(1000).max(120000).parse(env.MASTODON_TIMEOUT_MS ?? "15000");
  const maxRetries = z.coerce.number().int().min(0).max(5).parse(env.MASTODON_MAX_RETRIES ?? "3");
  return {
    baseUrl: parsed.origin,
    token,
    timeoutMs,
    maxRetries,
    allowWrites: bool(env.MASTODON_ALLOW_WRITES),
    allowHighRisk: bool(env.MASTODON_ALLOW_HIGH_RISK),
    allowDestructive: bool(env.MASTODON_ALLOW_DESTRUCTIVE)
  };
}
