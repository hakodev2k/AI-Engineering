import { z } from "zod";

const EnvSchema = z.object({
  SLACK_BOT_TOKEN: z.string().min(1).optional(),
  SLACK_USER_TOKEN: z.string().min(1).optional(),
  SLACK_APPROVAL_MODE: z.enum(["required", "disabled"]).default("required"),
  SLACK_ALLOWED_CHANNEL_IDS: z.string().optional(),
  SLACK_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().max(120000).default(15000),
  SLACK_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(3)
});

export type ConnectorConfig = {
  botToken?: string;
  userToken?: string;
  approvalRequired: boolean;
  allowedChannelIds: Set<string>;
  requestTimeoutMs: number;
  maxRetries: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ConnectorConfig {
  const parsed = EnvSchema.parse(env);
  if (!parsed.SLACK_BOT_TOKEN && !parsed.SLACK_USER_TOKEN) {
    throw new Error("At least one of SLACK_BOT_TOKEN or SLACK_USER_TOKEN is required.");
  }

  return {
    botToken: parsed.SLACK_BOT_TOKEN,
    userToken: parsed.SLACK_USER_TOKEN,
    approvalRequired: parsed.SLACK_APPROVAL_MODE === "required",
    allowedChannelIds: new Set(
      (parsed.SLACK_ALLOWED_CHANNEL_IDS ?? "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    ),
    requestTimeoutMs: parsed.SLACK_REQUEST_TIMEOUT_MS,
    maxRetries: parsed.SLACK_MAX_RETRIES
  };
}
