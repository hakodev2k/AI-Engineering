import type { TelegramConfig } from "./config.js";

export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class PolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyError";
  }
}

export function assertChatAllowed(config: TelegramConfig, chatId: string): void {
  if (config.allowedChatIds.size > 0 && !config.allowedChatIds.has(chatId)) {
    throw new PolicyError(`Chat ${chatId} is not in TELEGRAM_ALLOWED_CHAT_IDS`);
  }
}

export function assertApproval(config: TelegramConfig, risk: Risk, approvalId?: string): void {
  if (risk === "READ") return;
  if (!approvalId || !config.approvalIds.has(approvalId)) {
    throw new PolicyError(`${risk} operation requires a valid out-of-band approval_id`);
  }
}
