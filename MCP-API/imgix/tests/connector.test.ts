import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { ImgixClient, ImgixError, buildRenderUrl, signRenderUrl } from "../src/client.js";
import { requirePermission } from "../src/policy.js";
import { TOOL_NAMES, executeTool, tools } from "../src/tools.js";

const jsonResponse = (body: unknown, status = 200, headers: Record<string,string> = {}) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/vnd.api+json", ...headers } });

describe("Imgix connector", () => {
  const old = { ...process.env };
  beforeEach(() => { process.env = { ...old, IMGIX_API_TOKEN: "test-token", IMGIX_ALLOW_WRITE: "false", IMGIX_ALLOW_HIGH_RISK: "false" }; });
  afterEach(() => { process.env = { ...old }; vi.restoreAllMocks(); });

  it("registers exactly the documented scoped tools", () => {
    expect(Object.keys(tools)).toEqual([...TOOL_NAMES]);
    expect(TOOL_NAMES).toHaveLength(8);
  });

  it("rejects a non-imgix API base URL to prevent SSRF", () => {
    expect(() => new ImgixClient({ baseUrl: "https://evil.example" })).toThrow(/api.imgix.com/);
  });

  it("requires Management API credentials only when an API request is made", async () => {
    const client = new ImgixClient({ token: "", fetchImpl: vi.fn() as any });
    await expect(client.listSources()).rejects.toThrow(/IMGIX_API_TOKEN/);
  });

  it("performs a source read with bearer credentials and bounded pagination", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ data: [{ id: "src_1" }] }));
    const client = new ImgixClient({ token: "secret", fetchImpl: f as any, maxRetries: 0 });
    const result = await client.listSources(2, 10);
    expect(result).toEqual({ data: [{ id: "src_1" }] });
    const [url, init] = f.mock.calls[0];
    expect(url).toContain("page[number]=2");
    expect((init.headers as Record<string,string>).Authorization).toBe("Bearer secret");
  });

  it("does not retry authentication failures", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ errors: [{ detail: "bad token" }] }, 401));
    const client = new ImgixClient({ token: "bad", fetchImpl: f as any, maxRetries: 2 });
    await expect(client.listSources()).rejects.toBeInstanceOf(ImgixError);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("retries throttled reads but not purge writes", async () => {
    const readFetch = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ errors: [] }, 429, { "retry-after": "0" }))
      .mockResolvedValueOnce(jsonResponse({ data: [] }, 200));
    const readClient = new ImgixClient({ token: "x", fetchImpl: readFetch as any, maxRetries: 1 });
    await expect(readClient.listSources()).resolves.toEqual({ data: [] });
    expect(readFetch).toHaveBeenCalledTimes(2);

    const writeFetch = vi.fn().mockResolvedValue(jsonResponse({ errors: [] }, 503));
    const writeClient = new ImgixClient({ token: "x", fetchImpl: writeFetch as any, maxRetries: 2 });
    await expect(writeClient.purge("src", "https://demo.imgix.net/a.jpg")).rejects.toBeInstanceOf(ImgixError);
    expect(writeFetch).toHaveBeenCalledTimes(1);
  });

  it("requires explicit enablement and approval for a cache purge", () => {
    expect(() => requirePermission("HIGH_RISK", true)).toThrow(/disabled/);
    process.env.IMGIX_ALLOW_HIGH_RISK = "true";
    expect(() => requirePermission("HIGH_RISK", false)).toThrow(/approval/);
    expect(() => requirePermission("HIGH_RISK", true)).not.toThrow();
  });

  it("builds a validated rendering URL and rejects traversal", () => {
    const url = buildRenderUrl("demo.imgix.net", "images/hero.jpg", { w: 800, auto: "format,compress" });
    expect(url).toContain("w=800");
    expect(() => tools["imgix.render.url.build"].schema.parse({ domain: "demo.imgix.net", path: "../x", params: {} })).toThrow();
  });

  it("signs URLs without exposing the signing token", () => {
    const signed = signRenderUrl("https://demo.imgix.net/a.jpg?w=100", "private-token");
    expect(signed).toMatch(/[?&]s=[a-f0-9]{32}/);
    expect(signed).not.toContain("private-token");
  });

  it("validates tool inputs strictly", async () => {
    const client = new ImgixClient({ token: "x", fetchImpl: vi.fn() as any });
    await expect(executeTool("imgix.source.get", { sourceId: "ok", extra: true }, client)).rejects.toThrow();
  });
});
