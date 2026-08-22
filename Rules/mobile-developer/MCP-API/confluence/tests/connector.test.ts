import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { enforcePolicy, TOOL_POLICIES } from "../src/policy.js";

describe("Confluence connector policy/config", () => {
  it("requires credentials", () => {
    expect(() => loadConfig({ ATLASSIAN_CLOUD_ID: "c1" } as NodeJS.ProcessEnv)).toThrow(/Configure/);
  });

  it("accepts MCP-only configuration", () => {
    const cfg = loadConfig({ ATLASSIAN_CLOUD_ID: "cloud-1", ATLASSIAN_ROVO_MCP_TOKEN: "secret" } as NodeJS.ProcessEnv);
    expect(cfg.cloudId).toBe("cloud-1");
    expect(cfg.requireWriteApproval).toBe(true);
  });

  it("accepts REST fallback configuration", () => {
    const cfg = loadConfig({
      ATLASSIAN_CLOUD_ID: "cloud-1",
      ATLASSIAN_SITE_URL: "https://example.atlassian.net/",
      ATLASSIAN_EMAIL: "user@example.com",
      ATLASSIAN_API_TOKEN: "secret"
    } as NodeJS.ProcessEnv);
    expect(cfg.siteUrl).toBe("https://example.atlassian.net");
  });

  it("registers eleven scoped policies", () => {
    expect(Object.keys(TOOL_POLICIES)).toHaveLength(11);
    expect(TOOL_POLICIES["confluence.page.get"].risk).toBe("READ");
    expect(TOOL_POLICIES["confluence.page.update"].risk).toBe("WRITE");
  });

  it("denies write without approval", () => {
    expect(() => enforcePolicy("confluence.page.create", false, true)).toThrow(/APPROVAL_REQUIRED/);
  });

  it("allows approved write and read", () => {
    expect(() => enforcePolicy("confluence.page.create", true, true)).not.toThrow();
    expect(() => enforcePolicy("confluence.page.get", undefined, true)).not.toThrow();
  });

  it("fails closed for unknown tool", () => {
    expect(() => enforcePolicy("confluence.raw.request", true, true)).toThrow(/Unknown tool/);
  });
});
