import { describe, expect, it, vi } from "vitest";
import { loadAuth } from "../src/auth.js";
import { AblyClient, AblyApiError } from "../src/client.js";
import { createTools } from "../src/tools.js";
import { requireApproval, validateChannel } from "../src/policy.js";

describe("Ably connector", () => {
  it("rejects missing credentials", () => expect(() => loadAuth({})).toThrow(/ABLY_API_KEY/));
  it("validates channels", () => { expect(validateChannel("room:1")).toBe("room:1"); expect(() => validateChannel("\n")).toThrow(); });
  it("requires explicit approval for publishing", () => expect(() => requireApproval("HIGH_RISK", {}, {})).toThrow(/approval/i));
  it("registers the intended stable tool set", () => {
    const fake = { request: vi.fn() } as unknown as AblyClient;
    expect(createTools(fake).map(t => t.name)).toEqual([
      "ably.message.publish", "ably.message.publish_batch", "ably.message.history", "ably.presence.get", "ably.presence.history",
      "ably.presence.batch_get", "ably.channel.get", "ably.channel.list", "ably.stats.get", "ably.service.time"
    ]);
  });
  it("encodes channel names and maps successful reads", async () => {
    const fetcher = vi.fn(async (url: URL | RequestInfo) => {
      expect(String(url)).toContain("/channels/team%2Fops/messages");
      return new Response(JSON.stringify([{ name: "event", data: "ok" }]), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof fetch;
    const client = new AblyClient({ apiKey: "app.key:secret", maxRetries: 0 }, fetcher);
    const tool = createTools(client).find(t => t.name === "ably.message.history")!;
    const result = await tool.execute({ channel: "team/ops", limit: 10 });
    expect((result as any).data).toHaveLength(1);
  });
  it("does not retry authorization failures", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ code: 40140, message: "unauthorized" }), { status: 401 })) as typeof fetch;
    const client = new AblyClient({ apiKey: "app.key:secret", maxRetries: 3 }, fetcher);
    await expect(client.request("GET", "/stats")).rejects.toBeInstanceOf(AblyApiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("retries bounded GET throttling and honors a later success", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "rate limited" }), { status: 429, headers: { "retry-after": "0" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 })) as typeof fetch;
    const client = new AblyClient({ apiKey: "app.key:secret", maxRetries: 1 }, fetcher);
    await expect(client.request("GET", "/stats")).resolves.toMatchObject({ data: [] });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("never retries publish POST requests", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ message: "server error" }), { status: 503 })) as typeof fetch;
    const client = new AblyClient({ apiKey: "app.key:secret", maxRetries: 3 }, fetcher);
    await expect(client.request("POST", "/channels/a/messages", undefined, { data: 1 })).rejects.toBeInstanceOf(AblyApiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
