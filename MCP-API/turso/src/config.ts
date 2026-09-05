import { z } from "zod";

const Env = z.object({
  TURSO_PLATFORM_TOKEN: z.string().min(1, "TURSO_PLATFORM_TOKEN is required"),
  TURSO_ORG: z.string().min(1, "TURSO_ORG is required").regex(/^[a-zA-Z0-9_-]+$/),
  TURSO_API_BASE_URL: z.string().url().default("https://api.turso.tech"),
  TURSO_ALLOW_WRITE: z.enum(["true", "false"]).default("false"),
  TURSO_APPROVAL_MODE: z.enum(["required", "disabled"]).default("required"),
  TURSO_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000)
});

export type Config = {
  token: string;
  org: string;
  baseUrl: string;
  allowWrite: boolean;
  approvalMode: "required" | "disabled";
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const v = Env.parse(env);
  return {
    token: v.TURSO_PLATFORM_TOKEN,
    org: v.TURSO_ORG,
    baseUrl: v.TURSO_API_BASE_URL.replace(/\/$/, ""),
    allowWrite: v.TURSO_ALLOW_WRITE === "true",
    approvalMode: v.TURSO_APPROVAL_MODE,
    timeoutMs: v.TURSO_TIMEOUT_MS
  };
}
