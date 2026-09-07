export type Config = {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  approvalToken?: string;
  mcpUrl?: string;
};

function intEnv(env: NodeJS.ProcessEnv, name: string, fallback: number, max: number) {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer.`);
  return Math.min(value, max);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const baseUrl = env.WOOCOMMERCE_BASE_URL?.trim().replace(/\/$/, "");
  const consumerKey = env.WOOCOMMERCE_CONSUMER_KEY?.trim();
  const consumerSecret = env.WOOCOMMERCE_CONSUMER_SECRET?.trim();
  if (!baseUrl) throw new Error("WOOCOMMERCE_BASE_URL is required.");
  const url = new URL(baseUrl);
  if (url.protocol !== "https:") throw new Error("WOOCOMMERCE_BASE_URL must use HTTPS.");
  if (!consumerKey || !consumerSecret) throw new Error("WooCommerce consumer key and secret are required.");
  return {
    baseUrl,
    consumerKey,
    consumerSecret,
    timeoutMs: intEnv(env, "WOOCOMMERCE_TIMEOUT_MS", 15000, 120000),
    maxRetries: intEnv(env, "WOOCOMMERCE_MAX_RETRIES", 3, 5),
    allowWrites: env.WOOCOMMERCE_ALLOW_WRITES === "true",
    approvalToken: env.WOOCOMMERCE_APPROVAL_TOKEN,
    mcpUrl: env.WOOCOMMERCE_MCP_URL?.trim() || undefined
  };
}
