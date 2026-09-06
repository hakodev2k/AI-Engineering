export type Config = {
  site: string; apiKey: string; timeoutMs: number; maxRetries: number;
  allowWrites: boolean; approvalToken?: string; mcpUrl: string;
};
const integer = (name: string, fallback: number) => {
  const value = process.env[name];
  if (!value) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${name} must be a non-negative integer.`);
  return n;
};
export function loadConfig(env = process.env): Config {
  const site = env.CHARGEBEE_SITE?.trim();
  const apiKey = env.CHARGEBEE_API_KEY?.trim();
  if (!site || !/^[a-zA-Z0-9-]+$/.test(site)) throw new Error("CHARGEBEE_SITE is required and must be a Chargebee site identifier.");
  if (!apiKey) throw new Error("CHARGEBEE_API_KEY is required.");
  return {
    site, apiKey,
    timeoutMs: integer("CHARGEBEE_TIMEOUT_MS", 15000),
    maxRetries: Math.min(integer("CHARGEBEE_MAX_RETRIES", 3), 5),
    allowWrites: env.CHARGEBEE_ALLOW_WRITES === "true",
    approvalToken: env.CHARGEBEE_APPROVAL_TOKEN,
    mcpUrl: env.CHARGEBEE_MCP_URL || "https://mcp.chargebee.com/data-lookup"
  };
}
