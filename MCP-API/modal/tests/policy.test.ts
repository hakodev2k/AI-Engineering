import { describe, expect, it } from "vitest";
import { enforcePolicy, ApprovalRequiredError, DestructiveDisabledError } from "../src/policy.js";
import type { Config } from "../src/config.js";

const base: Config = {
  tokenId: "test-id", tokenSecret: "test-secret", timeoutMs: 30000, maxRetries: 3,
  maxThrottleWaitSecs: 30, requireWriteApproval: true, allowDestructive: false
};

describe("policy", () => {
  it("allows reads without approval", () => expect(() => enforcePolicy(base, "READ")).not.toThrow());
  it("denies high-risk operations without approval", () => expect(() => enforcePolicy(base, "HIGH_RISK", false)).toThrow(ApprovalRequiredError));
  it("allows high-risk operations with approval", () => expect(() => enforcePolicy(base, "HIGH_RISK", true)).not.toThrow());
  it("keeps destructive operations disabled even with approval", () => expect(() => enforcePolicy(base, "DESTRUCTIVE", true)).toThrow(DestructiveDisabledError));
  it("allows destructive operations only when enabled and approved", () => expect(() => enforcePolicy({ ...base, allowDestructive: true }, "DESTRUCTIVE", true)).not.toThrow());
});
