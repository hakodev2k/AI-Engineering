export type Config = {
  environment: "sandbox" | "production";
  merchantId: string;
  publicKey: string;
  privateKey: string;
  timeoutMs: number;
  maxRetries: number;
  allowWrites: boolean;
  approvalToken?: string;
};

function intEnv(env: NodeJS.ProcessEnv, name: string, fallback: number, max: number) {
  const raw = env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0 || value > max) throw new Error(`${name} must be an integer between 0 and ${max}.`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const environment = env.BRAINTREE_ENVIRONMENT === "production" ? "production" : "sandbox";
  const merchantId = env.BRAINTREE_MERCHANT_ID?.trim();
  const publicKey = env.BRAINTREE_PUBLIC_KEY?.trim();
  const privateKey = env.BRAINTREE_PRIVATE_KEY?.trim();
  if (!merchantId || !publicKey || !privateKey) throw new Error("BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, and BRAINTREE_PRIVATE_KEY are required.");
  return {
    environment,
    merchantId,
    publicKey,
    privateKey,
    timeoutMs: intEnv(env, "BRAINTREE_TIMEOUT_MS", 15000, 120000),
    maxRetries: intEnv(env, "BRAINTREE_MAX_RETRIES", 2, 5),
    allowWrites: env.BRAINTREE_ALLOW_WRITES === "true",
    approvalToken: env.BRAINTREE_APPROVAL_TOKEN
  };
}
