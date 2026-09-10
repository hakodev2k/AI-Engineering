import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("config", () => {
  it("loads credentials and defaults", () => {
    const cfg = loadConfig({ MODAL_TOKEN_ID: "id", MODAL_TOKEN_SECRET: "secret" });
    expect(cfg.timeoutMs).toBe(30000);
    expect(cfg.maxRetries).toBe(3);
    expect(cfg.requireWriteApproval).toBe(true);
    expect(cfg.allowDestructive).toBe(false);
  });

  it("rejects missing credentials", () => {
    expect(() => loadConfig({})).toThrow();
  });

  it("bounds retry configuration", () => {
    expect(() => loadConfig({ MODAL_TOKEN_ID: "id", MODAL_TOKEN_SECRET: "secret", MODAL_MAX_RETRIES: "9" })).toThrow();
  });
});
