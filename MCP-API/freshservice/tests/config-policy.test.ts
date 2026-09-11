import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { assertAllowed } from "../src/policy.js";

describe("Freshservice connector configuration", () => {
  it("loads a valid least-privilege default configuration", () => {
    const c = loadConfig({ FRESHSERVICE_DOMAIN: "acme.freshservice.com", FRESHSERVICE_API_KEY: "secret" });
    expect(c.allowWrite).toBe(false);
    expect(c.timeoutMs).toBe(20000);
  });

  it("rejects missing credentials and non-Freshservice hosts", () => {
    expect(() => loadConfig({ FRESHSERVICE_DOMAIN: "acme.freshservice.com" })).toThrow(/API_KEY/);
    expect(() => loadConfig({ FRESHSERVICE_DOMAIN: "evil.example.com", FRESHSERVICE_API_KEY: "x" })).toThrow(/Freshservice hostname/);
  });
});

describe("write approval policy", () => {
  const base = { domain: "acme.freshservice.com", apiKey: "x", timeoutMs: 20000 };

  it("allows reads without approval", () => expect(() => assertAllowed({ ...base, allowWrite: false }, "READ")).not.toThrow());
  it("denies writes while write mode is disabled", () => expect(() => assertAllowed({ ...base, allowWrite: false }, "WRITE", true)).toThrow(/WRITE_DISABLED/));
  it("requires explicit approval even when writes are enabled", () => expect(() => assertAllowed({ ...base, allowWrite: true }, "WRITE", false)).toThrow(/APPROVAL_REQUIRED/));
  it("allows explicitly approved writes when enabled", () => expect(() => assertAllowed({ ...base, allowWrite: true }, "WRITE", true)).not.toThrow());
});
