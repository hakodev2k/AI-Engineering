import { describe, expect, it } from "vitest";
import { DiscordClient, DiscordApiError } from "../src/discord-client.js";

const ok = (body: unknown, headers: Record<string,string> = {}) => new Response(JSON.stringify(body), { status: 200, headers });

describe("DiscordClient", () => {
  it("requires a token", () => {
    expect(() => new DiscordClient({ token: "" })).toThrow(/required/);
  });

  it("sends bot auth without exposing the token in payload", async () => {
    let auth = "";
    let body = "";
    const client = new DiscordClient({ token: "secret", fetchImpl: async (_url, init) => {
      auth = new Headers(init?.headers).get("authorization") ?? "";
      body = String(init?.body ?? "");
      return ok({ id: "1" });
    }});
    await client.sendMessage("12345", "hello");
    expect(auth).toBe("Bot secret");
    expect(body).not.toContain("secret");
  });

  it("maps Discord API errors", async () => {
    const client = new DiscordClient({ token: "x", maxRetries: 0, fetchImpl: async () => new Response(JSON.stringify({ message: "Missing Access", code: 50001 }), { status: 403 }) });
    await expect(client.getChannel("12345")).rejects.toMatchObject({ status: 403, code: 50001 });
  });

  it("retries one 429 using retry-after", async () => {
    let calls = 0;
    const client = new DiscordClient({ token: "x", maxRetries: 1, fetchImpl: async () => {
      calls++;
      if (calls === 1) return new Response(JSON.stringify({ message: "rate limited", retry_after: 0, global: false }), { status: 429, headers: { "retry-after": "0" } });
      return ok({ id: "2" });
    }});
    await client.getChannel("12345");
    expect(calls).toBe(2);
  });
});
