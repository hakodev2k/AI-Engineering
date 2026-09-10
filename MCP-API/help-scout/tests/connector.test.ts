import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { HelpScoutTokenProvider } from "../src/auth.js";
import { HelpScoutClient } from "../src/client.js";
import { buildTools } from "../src/tools.js";
import { PolicyError, assertSafeWebhookUrl } from "../src/policy.js";

const baseEnv = {
  HELPSCOUT_ACCESS_TOKEN: "test-token",
  HELPSCOUT_API_BASE: "https://api.helpscout.net",
  HELPSCOUT_ALLOW_WRITE: "false",
  HELPSCOUT_REQUIRE_WRITE_APPROVAL: "true",
  HELPSCOUT_ALLOW_HIGH_RISK: "false"
};

function fixture(fetchFn: typeof fetch, overrides: Record<string, string> = {}) {
  const config = loadConfig({ ...baseEnv, ...overrides });
  const tokens = new HelpScoutTokenProvider(config, fetchFn);
  const client = new HelpScoutClient(config, tokens, fetchFn);
  return { config, client, tools: buildTools(client, config) };
}

describe("Help Scout connector", () => {
  it("rejects missing credentials", () => {
    expect(() => loadConfig({})).toThrow(/ACCESS_TOKEN/);
  });

  it("registers the expected scoped tool set", () => {
    const fetchFn = vi.fn() as unknown as typeof fetch;
    const { tools } = fixture(fetchFn);
    expect(tools).toHaveLength(17);
    expect(tools.every(t => t.name.startsWith("helpscout."))).toBe(true);
    expect(new Set(tools.map(t => t.name)).size).toBe(tools.length);
  });

  it("performs a read operation with bearer auth", async () => {
    const fetchMock = vi.fn(async (_url: any, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-token");
      return new Response(JSON.stringify({ _embedded: { mailboxes: [] } }), { status: 200 });
    });
    const { tools } = fixture(fetchMock as unknown as typeof fetch);
    const tool = tools.find(t => t.name === "helpscout.mailbox.list")!;
    const result = await tool.run({ page: 1 }) as any;
    expect(result._embedded.mailboxes).toEqual([]);
  });

  it("blocks write operations by default", async () => {
    const fetchFn = vi.fn() as unknown as typeof fetch;
    const { tools } = fixture(fetchFn);
    const tool = tools.find(t => t.name === "helpscout.conversation.status.update")!;
    await expect(tool.run({ conversationId: 1, status: "closed", confirmation: "APPROVE_WRITE" })).rejects.toBeInstanceOf(PolicyError);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("requires explicit approval when writes are enabled", async () => {
    const fetchFn = vi.fn() as unknown as typeof fetch;
    const { tools } = fixture(fetchFn, { HELPSCOUT_ALLOW_WRITE: "true" });
    const tool = tools.find(t => t.name === "helpscout.conversation.note.add")!;
    await expect(tool.run({ conversationId: 1, text: "internal note" })).rejects.toThrow(/approval/i);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("requires a separate high-risk gate for external replies", async () => {
    const fetchFn = vi.fn() as unknown as typeof fetch;
    const { tools } = fixture(fetchFn, { HELPSCOUT_ALLOW_WRITE: "true", HELPSCOUT_ALLOW_HIGH_RISK: "false" });
    const tool = tools.find(t => t.name === "helpscout.conversation.reply.create")!;
    await expect(tool.run({
      conversationId: 1,
      customerId: 2,
      text: "draft",
      draft: true,
      confirmation: "APPROVE_HIGH_RISK"
    })).rejects.toThrow(/High-risk operations are disabled/);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("retries a throttled GET using bounded retry logic", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response("throttled", { status: 429, headers: { "X-RateLimit-Retry-After": "0" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const { client } = fixture(fetchMock as unknown as typeof fetch, { HELPSCOUT_MAX_RETRIES: "1" });
    await expect(client.request("/v2/users/me")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not blindly retry non-idempotent writes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("server error", { status: 500 }));
    const { client } = fixture(fetchMock as unknown as typeof fetch, { HELPSCOUT_MAX_RETRIES: "3" });
    await expect(client.request("/v2/conversations/1/notes", { method: "POST", body: { text: "x" } })).rejects.toThrow(/500/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("blocks unsafe webhook destinations", () => {
    expect(() => assertSafeWebhookUrl("http://example.com/hook")).toThrow(/HTTPS/);
    expect(() => assertSafeWebhookUrl("https://127.0.0.1/hook")).toThrow(/private/i);
    expect(() => assertSafeWebhookUrl("https://10.1.2.3/hook")).toThrow(/private/i);
    expect(() => assertSafeWebhookUrl("https://hooks.example.com/helpscout")).not.toThrow();
  });
});
