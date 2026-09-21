import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { handlers, schemas } from "../src/tools.js";
import type { Upstream } from "../src/upstream.js";

function fake(): Upstream & { call: ReturnType<typeof vi.fn> } {
  return { call: vi.fn(async (tool, args) => ({ tool, args })), close: vi.fn(async () => {}) };
}

describe("Exa connector", () => {
  it("uses safe defaults and keeps API key optional", () => {
    expect(loadConfig({})).toEqual({ apiKey: undefined, timeoutMs: 30000, maxRetries: 2, requireApproval: true });
  });
  it("rejects invalid configuration", () => expect(() => loadConfig({ EXA_MAX_RETRIES: "99" })).toThrow());
  it("validates search input", () => expect(() => schemas.search.parse({ query: "", numResults: 1 })).toThrow());
  it("caps URL fetch batches", () => expect(() => schemas.fetch.parse({ urls: Array(11).fill("https://example.com") })).toThrow());
  it("routes search only to the allowlisted official upstream tool", async () => {
    const u = fake(); const h = handlers(u, loadConfig({}));
    await h.search({ query: "MCP security", numResults: 3 });
    expect(u.call).toHaveBeenCalledWith("web_search_exa", { query: "MCP security", numResults: 3 });
  });
  it("requires approval for agent research by default", async () => {
    const u = fake(); const h = handlers(u, loadConfig({}));
    await expect(h.research({ prompt: "Research MCP security" })).rejects.toThrow("Human approval required");
    expect(u.call).not.toHaveBeenCalled();
  });
  it("executes approved research without forwarding approval marker", async () => {
    const u = fake(); const h = handlers(u, loadConfig({}));
    await h.research({ prompt: "Research MCP security", approval: "APPROVE_EXA_RESEARCH" });
    expect(u.call).toHaveBeenCalledWith("agent_run", { prompt: "Research MCP security" });
  });
});
