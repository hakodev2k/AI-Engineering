export type TelegramConfig = {
  botToken: string;
  allowedChatIds: Set<string>;
  approvalIds: Set<string>;
  timeoutMs: number;
  maxReadRetries: number;
};

function csv(value?: string): Set<string> {
  return new Set((value ?? "").split(",").map(v => v.trim()).filter(Boolean));
}

function positiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`Invalid non-negative integer: ${value}`);
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): TelegramConfig {
  const botToken = env.TELEGRAM_BOT_TOKEN?.trim();
  if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is required");

  return {
    botToken,
    allowedChatIds: csv(env.TELEGRAM_ALLOWED_CHAT_IDS),
    approvalIds: csv(env.TELEGRAM_APPROVAL_IDS),
    timeoutMs: positiveInt(env.TELEGRAM_TIMEOUT_MS, 15000),
    maxReadRetries: positiveInt(env.TELEGRAM_MAX_READ_RETRIES, 2)
  };
}
