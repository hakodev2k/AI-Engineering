import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { assertApproval, assertChatAllowed, PolicyError } from "../src/policy.js";
import { TelegramApiError, TelegramClient } from "../src/client.js";

const config = loadConfig({
  TELEGRAM_BOT_TOKEN: "test-token",
  TELEGRAM_ALLOWED_CHAT_IDS: "123,@team",
  TELEGRAM_APPROVAL_IDS: "approve-1",
  TELEGRAM_TIMEOUT_MS: "1000",
  TELEGRAM_MAX_READ_RETRIES: "1"
});

describe("configuration and policy", () => {
  it("requires a bot token", () => expect(() => loadConfig({})).toThrow("TELEGRAM_BOT_TOKEN"));
  it("allows configured chats", () => expect(() => assertChatAllowed(config, "123")).not.toThrow());
  it("rejects unlisted chats", () => expect(() => assertChatAllowed(config, "999")).toThrow(PolicyError));
  it("requires approval for write risk", () => expect(() => assertApproval(config, "WRITE")).toThrow(PolicyError));
  it("accepts configured approval IDs", () => expect(() => assertApproval(config, "DESTRUCTIVE", "approve-1")).not.toThrow());
});

describe("TelegramClient", () => {
  it("maps successful Bot API responses", async () => {
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ ok: true, result: { id: 7, is_bot: true } }), { status: 200, headers: { "content-type": "application/json" } }));
    const client = new TelegramClient(config, fakeFetch as typeof fetch);
    await expect(client.getMe()).resolves.toMatchObject({ id: 7 });
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it("does not retry non-idempotent writes", async () => {
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ ok: false, description: "Too Many Requests", parameters: { retry_after: 1 } }), { status: 429, headers: { "content-type": "application/json" } }));
    const client = new TelegramClient(config, fakeFetch as typeof fetch);
    await expect(client.sendMessage("123", "hello")).rejects.toBeInstanceOf(TelegramApiError);
    expect(fakeFetch).toHaveBeenCalledTimes(1);
  });

  it("surfaces API errors without exposing the token", async () => {
    const fakeFetch = vi.fn(async () => new Response(JSON.stringify({ ok: false, description: "Bad Request: chat not found" }), { status: 400, headers: { "content-type": "application/json" } }));
    const client = new TelegramClient(config, fakeFetch as typeof fetch);
    await expect(client.getChat("123")).rejects.toThrow("chat not found");
    try { await client.getChat("123"); } catch (e) { expect(String(e)).not.toContain("test-token"); }
  });
});
