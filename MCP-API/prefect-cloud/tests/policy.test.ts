import { describe, expect, it } from "vitest";
import { requireApproval, requireExecutionEnabled } from "../src/models/policy.js";
import type { ConnectorConfig } from "../src/config.js";

function config(overrides: Partial<ConnectorConfig> = {}): ConnectorConfig {
  return {
    mcpTransport: "http",
    mcpUrl: "https://prefect.fastmcp.app/mcp",
    mcpCommand: "uvx",
    mcpArgs: [],
    requestTimeoutMs: 15000,
    maxRetries: 3,
    maxResponseBytes: 2097152,
    enableExecution: false,
    ...overrides,
  };
}

describe("approval policy", () => {
  it("allows reads without approval", () => {
    expect(() => requireApproval(config(), "READ")).not.toThrow();
  });

  it("rejects destructive operations unconditionally", () => {
    expect(() => requireApproval(config({ approvalToken: "1234567890123456" }), "DESTRUCTIVE", "1234567890123456"))
      .toThrow(/disabled/);
  });

  it("requires a matching server-side token for high-risk operations", () => {
    const cfg = config({ approvalToken: "1234567890123456" });
    expect(() => requireApproval(cfg, "HIGH_RISK")).toThrow(/required/);
    expect(() => requireApproval(cfg, "HIGH_RISK", "wrong-token-value"))
      .toThrow(/invalid/);
    expect(() => requireApproval(cfg, "HIGH_RISK", "1234567890123456")).not.toThrow();
  });

  it("requires execution to be enabled on the host", () => {
    expect(() => requireExecutionEnabled(config())).toThrow(/disabled/);
    expect(() => requireExecutionEnabled(config({ enableExecution: true }))).not.toThrow();
  });
});
