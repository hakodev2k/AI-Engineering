import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { authorize, expectedApproval, TOOLS } from "../src/policy.js";

const base = {
  GCORE_API_KEY: "test-key",
  GCORE_BASE_URL: "https://api.gcore.com",
  GCORE_ALLOW_WRITE: "false",
  GCORE_ALLOW_HIGH_RISK: "false",
  GCORE_ALLOW_DESTRUCTIVE: "false"
} as NodeJS.ProcessEnv;

describe("configuration", () => {
  it("requires an API key", () => {
    expect(() => loadConfig({})).toThrow(/GCORE_API_KEY/);
  });

  it("pins the provider origin", () => {
    expect(() => loadConfig({ ...base, GCORE_BASE_URL: "https://evil.example" })).toThrow(/api.gcore.com/);
  });

  it("uses safe mutation defaults", () => {
    const cfg = loadConfig(base);
    expect(cfg.allowWrite).toBe(false);
    expect(cfg.allowHighRisk).toBe(false);
    expect(cfg.allowDestructive).toBe(false);
  });
});

describe("tool policy", () => {
  it("has unique provider-scoped tools", () => {
    const names = Object.keys(TOOLS);
    expect(new Set(names).size).toBe(names.length);
    expect(names.every((name) => name.startsWith("gcore."))).toBe(true);
  });

  it("allows reads without approval", () => {
    const cfg = loadConfig(base);
    expect(() => authorize(cfg, "gcore.instance.list", {})).not.toThrow();
  });

  it("denies writes when the operator gate is off", () => {
    const cfg = loadConfig(base);
    expect(() => authorize(cfg, "gcore.instance.create", { approvalToken: "x" })).toThrow(/WRITE operations are disabled/);
  });

  it("binds write approval to exact arguments", () => {
    const env = { ...base, GCORE_ALLOW_WRITE: "true", GCORE_APPROVAL_SECRET: "approval-secret-at-least-16" };
    const cfg = loadConfig(env);
    const payload: Record<string, unknown> = { name: "agent-vm", flavor: "g1-standard-1-2" };
    payload.approvalToken = expectedApproval(cfg.approvalSecret!, "gcore.instance.create", payload);
    expect(() => authorize(cfg, "gcore.instance.create", payload)).not.toThrow();
    payload.name = "different-vm";
    expect(() => authorize(cfg, "gcore.instance.create", payload)).toThrow(/approval/);
  });

  it("keeps destructive actions disabled independently", () => {
    const cfg = loadConfig({ ...base, GCORE_ALLOW_WRITE: "true", GCORE_APPROVAL_SECRET: "approval-secret-at-least-16" });
    expect(() => authorize(cfg, "gcore.instance.delete", { approvalToken: "x" })).toThrow(/DESTRUCTIVE/);
  });
});
