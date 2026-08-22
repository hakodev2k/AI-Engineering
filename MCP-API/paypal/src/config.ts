import { z } from "zod";

const bool = z.string().optional().transform((value) => value?.toLowerCase() === "true");

const schema = z.object({
  PAYPAL_CLIENT_ID: z.string().min(10),
  PAYPAL_CLIENT_SECRET: z.string().min(10),
  PAYPAL_ENVIRONMENT: z.enum(["SANDBOX", "PRODUCTION"]).default("SANDBOX"),
  PAYPAL_LIVE_MODE_ALLOWED: bool,
  PAYPAL_REQUIRE_WRITE_APPROVAL: z.string().optional().default("true").transform((value) => value.toLowerCase() !== "false"),
  PAYPAL_APPROVAL_SECRET: z.string().min(32).optional(),
  PAYPAL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(60000).default(20000)
});

export type PayPalConfig = {
  clientId: string;
  clientSecret: string;
  environment: "SANDBOX" | "PRODUCTION";
  mcpEndpoint: string;
  oauthEndpoint: string;
  liveModeAllowed: boolean;
  requireWriteApproval: boolean;
  approvalSecret?: string;
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): PayPalConfig {
  const parsed = schema.parse(env);
  if (parsed.PAYPAL_ENVIRONMENT === "PRODUCTION" && !parsed.PAYPAL_LIVE_MODE_ALLOWED) {
    throw new Error("Production PayPal access is disabled. Set PAYPAL_LIVE_MODE_ALLOWED=true explicitly.");
  }

  const sandbox = parsed.PAYPAL_ENVIRONMENT === "SANDBOX";
  return {
    clientId: parsed.PAYPAL_CLIENT_ID,
    clientSecret: parsed.PAYPAL_CLIENT_SECRET,
    environment: parsed.PAYPAL_ENVIRONMENT,
    mcpEndpoint: sandbox ? "https://mcp.sandbox.paypal.com/http" : "https://mcp.paypal.com/http",
    oauthEndpoint: sandbox ? "https://api-m.sandbox.paypal.com/v1/oauth2/token" : "https://api-m.paypal.com/v1/oauth2/token",
    liveModeAllowed: parsed.PAYPAL_LIVE_MODE_ALLOWED,
    requireWriteApproval: parsed.PAYPAL_REQUIRE_WRITE_APPROVAL,
    approvalSecret: parsed.PAYPAL_APPROVAL_SECRET,
    timeoutMs: parsed.PAYPAL_TIMEOUT_MS
  };
}
