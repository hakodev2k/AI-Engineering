import { z } from "zod";

const EnvSchema = z.object({
  MODAL_TOKEN_ID: z.string().min(1),
  MODAL_TOKEN_SECRET: z.string().min(1),
  MODAL_ENVIRONMENT: z.string().min(1).optional(),
  MODAL_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  MODAL_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3),
  MODAL_MAX_THROTTLE_WAIT_SECS: z.coerce.number().int().min(0).max(120).default(30),
  MODAL_REQUIRE_WRITE_APPROVAL: z.enum(["true", "false"]).default("true"),
  MODAL_ALLOW_DESTRUCTIVE: z.enum(["true", "false"]).default("false")
});

export type Config = {
  tokenId: string;
  tokenSecret: string;
  environment?: string;
  timeoutMs: number;
  maxRetries: number;
  maxThrottleWaitSecs: number;
  requireWriteApproval: boolean;
  allowDestructive: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const v = EnvSchema.parse(env);
  return {
    tokenId: v.MODAL_TOKEN_ID,
    tokenSecret: v.MODAL_TOKEN_SECRET,
    environment: v.MODAL_ENVIRONMENT,
    timeoutMs: v.MODAL_TIMEOUT_MS,
    maxRetries: v.MODAL_MAX_RETRIES,
    maxThrottleWaitSecs: v.MODAL_MAX_THROTTLE_WAIT_SECS,
    requireWriteApproval: v.MODAL_REQUIRE_WRITE_APPROVAL === "true",
    allowDestructive: v.MODAL_ALLOW_DESTRUCTIVE === "true"
  };
}
