import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { TelegramClient } from "./client.js";
import { assertApproval, assertChatAllowed } from "./policy.js";

const config = loadConfig();
const client = new TelegramClient(config);
const server = new McpServer({ name: "telegram-mcp-api", version: "1.0.0" });

const chatId = z.string().min(1).max(128);
const messageId = z.number().int().positive();
const approvalId = z.string().min(1).max(256).optional();
const parseMode = z.enum(["HTML", "MarkdownV2"]).optional();
const asText = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value) }] });
const safe = async <T>(fn: () => Promise<T>) => {
  try { return asText(await fn()); }
  catch (e) { return { isError: true, content: [{ type: "text" as const, text: e instanceof Error ? e.message : "Unknown error" }] }; }
};

server.tool("telegram.bot.get", "Get the authenticated bot identity. READ.", {}, async () => safe(() => client.getMe()));
server.tool("telegram.update.list", "Read pending Bot API updates using long polling. READ. Not usable while a webhook is active.", {
  offset: z.number().int().optional(), limit: z.number().int().min(1).max(100).default(50), timeout: z.number().int().min(0).max(50).default(0)
}, async ({ offset, limit, timeout }) => safe(() => client.getUpdates(offset, limit, timeout)));
server.tool("telegram.chat.get", "Get current chat information. READ.", { chat_id: chatId }, async ({ chat_id }) => safe(async () => { assertChatAllowed(config, chat_id); return client.getChat(chat_id); }));
server.tool("telegram.chat.administrator.list", "List chat administrators. READ.", { chat_id: chatId }, async ({ chat_id }) => safe(async () => { assertChatAllowed(config, chat_id); return client.getChatAdministrators(chat_id); }));
server.tool("telegram.chat.member_count.get", "Get chat member count. READ.", { chat_id: chatId }, async ({ chat_id }) => safe(async () => { assertChatAllowed(config, chat_id); return client.getChatMemberCount(chat_id); }));
server.tool("telegram.message.send", "Send a text message. WRITE; requires approval_id.", { chat_id: chatId, text: z.string().min(1).max(4096), parse_mode: parseMode, approval_id: approvalId }, async ({ chat_id, text, parse_mode, approval_id }) => safe(async () => { assertChatAllowed(config, chat_id); assertApproval(config, "WRITE", approval_id); return client.sendMessage(chat_id, text, parse_mode); }));
server.tool("telegram.message.edit", "Edit an existing text message. WRITE; requires approval_id.", { chat_id: chatId, message_id: messageId, text: z.string().min(1).max(4096), parse_mode: parseMode, approval_id: approvalId }, async ({ chat_id, message_id, text, parse_mode, approval_id }) => safe(async () => { assertChatAllowed(config, chat_id); assertApproval(config, "WRITE", approval_id); return client.editMessageText(chat_id, message_id, text, parse_mode); }));
server.tool("telegram.message.delete", "Delete a message subject to Telegram deletion limits. DESTRUCTIVE; requires approval_id.", { chat_id: chatId, message_id: messageId, approval_id: approvalId }, async ({ chat_id, message_id, approval_id }) => safe(async () => { assertChatAllowed(config, chat_id); assertApproval(config, "DESTRUCTIVE", approval_id); return client.deleteMessage(chat_id, message_id); }));
server.tool("telegram.message.action.send", "Send a transient chat action such as typing. WRITE; requires approval_id.", { chat_id: chatId, action: z.enum(["typing","upload_photo","record_video","upload_video","record_voice","upload_voice","upload_document","choose_sticker","find_location","record_video_note","upload_video_note"]), approval_id: approvalId }, async ({ chat_id, action, approval_id }) => safe(async () => { assertChatAllowed(config, chat_id); assertApproval(config, "WRITE", approval_id); return client.sendChatAction(chat_id, action); }));
server.tool("telegram.message.pin", "Pin a message. HIGH_RISK because it changes shared chat state; requires approval_id.", { chat_id: chatId, message_id: messageId, disable_notification: z.boolean().default(false), approval_id: approvalId }, async ({ chat_id, message_id, disable_notification, approval_id }) => safe(async () => { assertChatAllowed(config, chat_id); assertApproval(config, "HIGH_RISK", approval_id); return client.pinChatMessage(chat_id, message_id, disable_notification); }));
server.tool("telegram.message.unpin", "Unpin one message, or the current pinned message when message_id is omitted. HIGH_RISK; requires approval_id.", { chat_id: chatId, message_id: messageId.optional(), approval_id: approvalId }, async ({ chat_id, message_id, approval_id }) => safe(async () => { assertChatAllowed(config, chat_id); assertApproval(config, "HIGH_RISK", approval_id); return client.unpinChatMessage(chat_id, message_id); }));

await server.connect(new StdioServerTransport());
