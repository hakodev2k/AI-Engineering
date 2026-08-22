import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { enforceApproval } from "../src/policy.js";
import { YouTubeClient } from "../src/client.js";

const baseConfig = { apiKey: "key", requireWriteApproval: true, timeoutMs: 5000 };

describe("configuration", () => {
  it("requires at least one credential", () => {
    expect(() => loadConfig({ YOUTUBE_TIMEOUT_MS: "15000" })).toThrow(/Configure YOUTUBE_API_KEY/);
  });

  it("requires OAuth client credentials when refresh token is configured", () => {
    expect(() => loadConfig({ YOUTUBE_REFRESH_TOKEN: "refresh" })).toThrow(/requires YOUTUBE_CLIENT_ID/);
  });
});

describe("approval policy", () => {
  it("denies write without approval by default", () => {
    expect(() => enforceApproval(baseConfig, "WRITE", false)).toThrow(/approval/i);
    expect(() => enforceApproval(baseConfig, "WRITE", true)).not.toThrow();
  });

  it("always disables destructive operations", () => {
    expect(() => enforceApproval(baseConfig, "DESTRUCTIVE", true)).toThrow(/disabled/i);
  });
});

describe("HTTP reliability", () => {
  it("retries transient GET failures and preserves API key auth", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: "busy" } }), { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [{ id: "v1" }] }), { status: 200 }));
    const client = new YouTubeClient(baseConfig, fetchMock as unknown as typeof fetch);
    const result = await client.data<{ items: unknown[] }>("videos", { query: { part: "snippet", id: "v1" } });
    expect(result.items).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const firstUrl = String(fetchMock.mock.calls[0][0]);
    expect(firstUrl).toContain("key=key");
  });

  it("does not retry write POST failures", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message: "busy" } }), { status: 503 }));
    const client = new YouTubeClient({ ...baseConfig, accessToken: "token" }, fetchMock as unknown as typeof fetch);
    await expect(client.data("comments", { method: "POST", auth: "oauth", body: {}, query: { part: "snippet" } })).rejects.toThrow(/busy/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("refreshes OAuth once after 401 when refresh credentials exist", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: "expired" } }), { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "new-token", expires_in: 3600 }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ items: [] }), { status: 200 }));
    const client = new YouTubeClient({
      ...baseConfig,
      accessToken: "old-token",
      refreshToken: "refresh",
      clientId: "client",
      clientSecret: "secret",
    }, fetchMock as unknown as typeof fetch);
    await expect(client.data("subscriptions", { auth: "oauth", query: { part: "snippet", mine: true } })).resolves.toEqual({ items: [] });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1][0])).toBe("https://oauth2.googleapis.com/token");
  });
});
