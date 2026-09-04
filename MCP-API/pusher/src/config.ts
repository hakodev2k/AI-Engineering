import { z } from "zod";

const EnvSchema = z.object({
  PUSHER_APP_ID: z.string().min(1),
  PUSHER_KEY: z.string().min(1),
  PUSHER_SECRET: z.string().min(1),
  PUSHER_CLUSTER: z.string().min(1),
  PUSHER_USE_TLS: z.enum(["true", "false"]).default("true"),
  PUSHER_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
  PUSHER_READ_ONLY: z.enum(["true", "false"]).default("true"),
  PUSHER_ALLOW_WRITE: z.enum(["true", "false"]).default("false"),
  PUSHER_APPROVAL_MODE: z.enum(["required", "disabled"]).default("required")
});

export type Config = {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
  useTLS: boolean;
  timeoutMs: number;
  readOnly: boolean;
  allowWrite: boolean;
  approvalMode: "required" | "disabled";
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const x = EnvSchema.parse(env);
  return {
    appId: x.PUSHER_APP_ID,
    key: x.PUSHER_KEY,
    secret: x.PUSHER_SECRET,
    cluster: x.PUSHER_CLUSTER,
    useTLS: x.PUSHER_USE_TLS === "true",
    timeoutMs: x.PUSHER_TIMEOUT_MS,
    readOnly: x.PUSHER_READ_ONLY === "true",
    allowWrite: x.PUSHER_ALLOW_WRITE === "true",
    approvalMode: x.PUSHER_APPROVAL_MODE
  };
}
