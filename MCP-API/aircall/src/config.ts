import { z } from "zod";

const EnvSchema = z.object({
  AIRCALL_API_ID: z.string().optional(),
  AIRCALL_API_TOKEN: z.string().optional(),
  AIRCALL_ACCESS_TOKEN: z.string().optional(),
  AIRCALL_BASE_URL: z.string().url().default("https://api.aircall.io/v1"),
  AIRCALL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  AIRCALL_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  AIRCALL_READ_ONLY: z.enum(["true", "false"]).default("true"),
  AIRCALL_ALLOW_WRITE: z.enum(["true", "false"]).default("false"),
  AIRCALL_ALLOW_DESTRUCTIVE: z.enum(["true", "false"]).default("false"),
  AIRCALL_APPROVAL_MODE: z.enum(["required", "disabled"]).default("required")
}).superRefine((v, ctx) => {
  const basic = Boolean(v.AIRCALL_API_ID && v.AIRCALL_API_TOKEN);
  const oauth = Boolean(v.AIRCALL_ACCESS_TOKEN);
  if (basic === oauth) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Configure exactly one auth mode: AIRCALL_API_ID + AIRCALL_API_TOKEN, or AIRCALL_ACCESS_TOKEN." });
});

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const v = EnvSchema.parse(env);
  return {
    baseUrl: v.AIRCALL_BASE_URL.replace(/\/$/, ""),
    timeoutMs: v.AIRCALL_TIMEOUT_MS,
    maxRetries: v.AIRCALL_MAX_RETRIES,
    readOnly: v.AIRCALL_READ_ONLY === "true",
    allowWrite: v.AIRCALL_ALLOW_WRITE === "true",
    allowDestructive: v.AIRCALL_ALLOW_DESTRUCTIVE === "true",
    approvalMode: v.AIRCALL_APPROVAL_MODE,
    auth: v.AIRCALL_ACCESS_TOKEN
      ? { type: "bearer" as const, accessToken: v.AIRCALL_ACCESS_TOKEN }
      : { type: "basic" as const, apiId: v.AIRCALL_API_ID!, apiToken: v.AIRCALL_API_TOKEN! }
  };
}
