import { z } from "zod";

const schema = z.object({
  LOOPS_API_KEY: z.string().min(1),
  LOOPS_API_BASE_URL: z.string().url().default("https://app.loops.so/api"),
  LOOPS_ALLOW_WRITE: z.enum(["true", "false"]).default("false"),
  LOOPS_ALLOW_DESTRUCTIVE: z.enum(["true", "false"]).default("false"),
  LOOPS_APPROVAL_MODE: z.enum(["required", "disabled"]).default("required"),
  LOOPS_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  LOOPS_MAX_READ_RETRIES: z.coerce.number().int().min(0).max(5).default(2)
});

export type Config = {
  apiKey: string;
  baseUrl: string;
  allowWrite: boolean;
  allowDestructive: boolean;
  approvalMode: "required" | "disabled";
  timeoutMs: number;
  maxReadRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const v = schema.parse(env);
  return {
    apiKey: v.LOOPS_API_KEY,
    baseUrl: v.LOOPS_API_BASE_URL.replace(/\/$/, ""),
    allowWrite: v.LOOPS_ALLOW_WRITE === "true",
    allowDestructive: v.LOOPS_ALLOW_DESTRUCTIVE === "true",
    approvalMode: v.LOOPS_APPROVAL_MODE,
    timeoutMs: v.LOOPS_TIMEOUT_MS,
    maxReadRetries: v.LOOPS_MAX_READ_RETRIES
  };
}
