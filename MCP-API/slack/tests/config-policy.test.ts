import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { ApprovalRequiredError, PolicyError, assertChannelAllowed, requireApproval, safeText } from "../src/policy.js";

describe("configuration", () => {
  it("requires at least one Slack token", () => {
    expect(() => loadConfig({})).toThrow(/At least one/);
  });

  it("parses channel allowlist and bounded retry settings", () => {
    const config = loadConfig({
      SLACK_BOT_TOKEN: "xoxb-test",
      SLACK_ALLOWED_CHANNEL_IDS: "C1,C2",
      SLACK_MAX_RETRIES: "2",
      SLACK_REQUEST_TIMEOUT_MS: "5000"
    });
    expect(config.allowedChannelIds.has("C1")).toBe(true);
    expect(config.maxRetries).toBe(2);
    expect(config.requestTimeoutMs).toBe(5000);
  });
});

describe("policy", () => {
  const config = loadConfig({ SLACK_BOT_TOKEN: "xoxb-test", SLACK_ALLOWED_CHANNEL_IDS: "C1" });

  it("blocks writes without approval", () => {
    expect(() => requireApproval(config, "slack.message.send", false)).toThrow(ApprovalRequiredError);
  });

  it("allows approved writes", () => {
    expect(() => requireApproval(config, "slack.message.send", true)).not.toThrow();
  });

  it("enforces channel allowlist", () => {
    expect(() => assertChannelAllowed(config, "C2")).toThrow(PolicyError);
  });

  it("rejects empty or oversized text", () => {
    expect(() => safeText("   ", "text")).toThrow(PolicyError);
    expect(() => safeText("x".repeat(11), "text", 10)).toThrow(PolicyError);
  });
});
