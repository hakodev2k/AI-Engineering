import { describe, expect, it, vi } from "vitest";
import { StatusCakeClient, StatusCakeError } from "../src/client.js";
import type { StatusCakeConfig } from "../src/config.js";

const config: StatusCakeConfig = {
  apiToken: "test-token",
  apiBaseUrl: "https://api.statuscake.com/v1",
  timeoutMs: 1000,
  maxRetries: 1,
  requireWriteApproval: true,
  enableDestructive: false
};

describe("StatusCakeClient", () => {
  it("adds bearer auth and parses JSON", async () => {
    const fake = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string,string>).Authorization).toBe("Bearer test-token");
      return new Response(JSON.stringify({ data: [{ id: "1" }] }), { status: 200, headers: { "content-type": "application/json" } });
    }) as unknown as typeof fetch;
    const client = new StatusCakeClient(config, fake);
    await expect(client.request("/uptime")).resolves.toEqual({ data: [{ id: "1" }] });
  });

  it("retries GET after 429 using rate-limit reset", async () => {
    let calls = 0;
    const fake = vi.fn(async () => {
      calls++;
      if (calls === 1) return new Response(JSON.stringify({ message: "limited" }), { status: 429, headers: { "x-ratelimit-reset": "0" } });
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }) as unknown as typeof fetch;
    const client = new StatusCakeClient(config, fake);
    await expect(client.request("/uptime")).resolves.toEqual({ data: [] });
    expect(calls).toBe(2);
  });

  it("does not retry write failures", async () => {
    const fake = vi.fn(async () => new Response(JSON.stringify({ message: "error" }), { status: 500 })) as unknown as typeof fetch;
    const client = new StatusCakeClient(config, fake);
    await expect(client.request("/uptime", { method: "POST", form: { name: "x" } })).rejects.toBeInstanceOf(StatusCakeError);
    expect(fake).toHaveBeenCalledTimes(1);
  });

  it("maps authentication errors without retrying", async () => {
    const fake = vi.fn(async () => new Response(JSON.stringify({ message: "unauthorised" }), { status: 401 })) as unknown as typeof fetch;
    const client = new StatusCakeClient(config, fake);
    await expect(client.request("/uptime")).rejects.toMatchObject({ status: 401 });
    expect(fake).toHaveBeenCalledTimes(1);
  });
});
