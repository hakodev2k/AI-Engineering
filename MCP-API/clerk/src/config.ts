import { z } from "zod";

const EnvSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_API_BASE_URL: z.string().url().default("https://api.clerk.com/v1"),
  CLERK_API_VERSION: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default("2025-04-10"),
  CLERK_READ_ONLY: z.enum(["true", "false"]).default("true"),
  CLERK_ALLOW_WRITE: z.enum(["true", "false"]).default("false"),
  CLERK_APPROVAL_MODE: z.enum(["required", "disabled"]).default("required"),
  CLERK_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(15000),
  CLERK_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2)
});

export type Config = {
  secretKey: string;
  apiBaseUrl: string;
  apiVersion: string;
  readOnly: boolean;
  allowWrite: boolean;
  approvalMode: "required" | "disabled";
  timeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const v = EnvSchema.parse(env);
  const url = new URL(v.CLERK_API_BASE_URL);
  if (url.protocol !== "https:") throw new Error("CLERK_API_BASE_URL must use HTTPS.");
  return {
    secretKey: v.CLERK_SECRET_KEY,
    apiBaseUrl: url.toString().replace(/\/$/, ""),
    apiVersion: v.CLERK_API_VERSION,
    readOnly: v.CLERK_READ_ONLY === "true",
    allowWrite: v.CLERK_ALLOW_WRITE === "true",
    approvalMode: v.CLERK_APPROVAL_MODE,
    timeoutMs: v.CLERK_TIMEOUT_MS,
    maxRetries: v.CLERK_MAX_RETRIES
  };
}
