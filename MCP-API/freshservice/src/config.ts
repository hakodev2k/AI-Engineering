export type FreshserviceConfig = {
  domain: string;
  apiKey: string;
  allowWrite: boolean;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): FreshserviceConfig {
  const domain = env.FRESHSERVICE_DOMAIN?.trim();
  const apiKey = env.FRESHSERVICE_API_KEY?.trim();
  if (!domain) throw new Error("FRESHSERVICE_DOMAIN is required");
  if (!apiKey) throw new Error("FRESHSERVICE_API_KEY is required");
  if (!/^[a-z0-9.-]+\.freshservice\.com$/i.test(domain)) throw new Error("FRESHSERVICE_DOMAIN must be a Freshservice hostname");
  const timeoutMs = Number(env.FRESHSERVICE_TIMEOUT_MS ?? "20000");
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error("FRESHSERVICE_TIMEOUT_MS must be between 1000 and 120000");
  return { domain, apiKey, allowWrite: env.FRESHSERVICE_ALLOW_WRITE === "true", timeoutMs };
}
