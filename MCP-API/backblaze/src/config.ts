import { z } from "zod";

const bool = z.enum(["true", "false"]).default("false").transform(v => v === "true");

export const envSchema = z.object({
  BACKBLAZE_KEY_ID: z.string().min(1),
  BACKBLAZE_APPLICATION_KEY: z.string().min(1),
  BACKBLAZE_REGION: z.string().regex(/^[a-z0-9-]{3,32}$/),
  BACKBLAZE_ALLOW_WRITE: bool,
  BACKBLAZE_ALLOW_DESTRUCTIVE: bool,
  BACKBLAZE_WRITE_APPROVAL_REQUIRED: z.enum(["true", "false"]).default("true").transform(v => v === "true"),
  BACKBLAZE_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(20000),
  BACKBLAZE_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(5).default(3)
});

export type BackblazeConfig = {
  keyId: string;
  applicationKey: string;
  region: string;
  endpoint: string;
  allowWrite: boolean;
  allowDestructive: boolean;
  writeApprovalRequired: boolean;
  requestTimeoutMs: number;
  maxAttempts: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BackblazeConfig {
  const parsed = envSchema.parse(env);
  return {
    keyId: parsed.BACKBLAZE_KEY_ID,
    applicationKey: parsed.BACKBLAZE_APPLICATION_KEY,
    region: parsed.BACKBLAZE_REGION,
    endpoint: `https://s3.${parsed.BACKBLAZE_REGION}.backblazeb2.com`,
    allowWrite: parsed.BACKBLAZE_ALLOW_WRITE,
    allowDestructive: parsed.BACKBLAZE_ALLOW_DESTRUCTIVE,
    writeApprovalRequired: parsed.BACKBLAZE_WRITE_APPROVAL_REQUIRED,
    requestTimeoutMs: parsed.BACKBLAZE_REQUEST_TIMEOUT_MS,
    maxAttempts: parsed.BACKBLAZE_MAX_ATTEMPTS
  };
}
