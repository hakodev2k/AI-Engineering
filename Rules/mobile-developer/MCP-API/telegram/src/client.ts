import type { TelegramConfig } from "./config.js";

export type TelegramEnvelope<T> = { ok: boolean; result?: T; description?: string; error_code?: number; parameters?: { retry_after?: number } };

export class TelegramApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) {
    super(message);
    this.name = "TelegramApiError";
  }
}

export class TelegramClient {
  constructor(private readonly config: TelegramConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async call<T>(method: string, body: Record<string, unknown> = {}, retryable = false): Promise<T> {
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(`https://api.telegram.org/bot${this.config.botToken}/${method}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        const payload = await response.json() as TelegramEnvelope<T>;
        if (response.ok && payload.ok && payload.result !== undefined) return payload.result;

        const retryAfter = payload.parameters?.retry_after;
        if (response.status === 429 && retryable && attempt < this.config.maxReadRetries && retryAfter !== undefined) {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, Math.min(retryAfter * 1000, 30000)));
          continue;
        }
        throw new TelegramApiError(response.status, payload.description ?? `Telegram API ${method} failed`, retryAfter);
      } catch (error) {
        if (error instanceof TelegramApiError) throw error;
        if (retryable && attempt < this.config.maxReadRetries) {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** attempt, 2000)));
          continue;
        }
        if (error instanceof Error && error.name === "AbortError") throw new TelegramApiError(408, `Telegram API ${method} timed out`);
        throw new TelegramApiError(0, `Telegram API ${method} network failure`);
      } finally {
        clearTimeout(timer);
      }
    }
  }

  getMe() { return this.call<Record<string, unknown>>("getMe", {}, true); }
  getUpdates(offset?: number, limit = 50, timeout = 0) { return this.call<Record<string, unknown>[]>("getUpdates", { offset, limit, timeout }, true); }
  getChat(chatId: string) { return this.call<Record<string, unknown>>("getChat", { chat_id: chatId }, true); }
  getChatAdministrators(chatId: string) { return this.call<Record<string, unknown>[]>("getChatAdministrators", { chat_id: chatId }, true); }
  getChatMemberCount(chatId: string) { return this.call<number>("getChatMemberCount", { chat_id: chatId }, true); }
  sendMessage(chatId: string, text: string, parseMode?: "HTML" | "MarkdownV2") { return this.call<Record<string, unknown>>("sendMessage", { chat_id: chatId, text, parse_mode: parseMode }); }
  editMessageText(chatId: string, messageId: number, text: string, parseMode?: "HTML" | "MarkdownV2") { return this.call<Record<string, unknown> | true>("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: parseMode }); }
  deleteMessage(chatId: string, messageId: number) { return this.call<boolean>("deleteMessage", { chat_id: chatId, message_id: messageId }); }
  sendChatAction(chatId: string, action: "typing" | "upload_photo" | "record_video" | "upload_video" | "record_voice" | "upload_voice" | "upload_document" | "choose_sticker" | "find_location" | "record_video_note" | "upload_video_note") { return this.call<boolean>("sendChatAction", { chat_id: chatId, action }); }
  pinChatMessage(chatId: string, messageId: number, disableNotification = false) { return this.call<boolean>("pinChatMessage", { chat_id: chatId, message_id: messageId, disable_notification: disableNotification }); }
  unpinChatMessage(chatId: string, messageId?: number) { return this.call<boolean>("unpinChatMessage", { chat_id: chatId, message_id: messageId }); }
}
