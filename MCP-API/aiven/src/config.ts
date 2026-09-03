import { z } from "zod";

const EnvSchema = z.object({
  AIVEN_TOKEN: z.string().min(1, "AIVEN_TOKEN is required"),
  AIVEN_READ_ONLY: z.enum(["true", "false"]).default("true"),
  AIVEN_ALLOW_WRITE: z.enum(["true", "false"]).default("false"),
  AIVEN_APPROVAL_MODE: z.enum(["required", "disabled"]).default("required"),
  AIVEN_TOOL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
});

export type Config = {
  token: string;
  readOnly: boolean;
  allowWrite: boolean;
  approvalMode: "required" | "disabled";
  timeoutMs: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = EnvSchema.parse(env);
  return {
    token: parsed.AIVEN_TOKEN,
    readOnly: parsed.AIVEN_READ_ONLY === "true",
    allowWrite: parsed.AIVEN_ALLOW_WRITE === "true",
    approvalMode: parsed.AIVEN_APPROVAL_MODE,
    timeoutMs: parsed.AIVEN_TOOL_TIMEOUT_MS,
  };
}
