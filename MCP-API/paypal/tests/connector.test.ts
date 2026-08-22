import { afterEach, describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { PayPalTokenProvider } from "../src/auth.js";
import { ALLOWED_UPSTREAM_TOOLS } from "../src/upstream.js";
import { assertApproved, createApprovalToken, operationTarget } from "../src/policy.js";

const sandboxEnv = {
  PAYPAL_CLIENT_ID: "client-id-123456",
  PAYPAL_CLIENT_SECRET: "client-secret-1234567890",
  PAYPAL_ENVIRONMENT: "SANDBOX",
  PAYPAL_APPROVAL_SECRET: "01234567890123456789012345678901"
};

afterEach(() => vi.unstubAllGlobals());

describe("configuration", () => {
  it("defaults to the official sandbox endpoints", () => {
    const cfg = loadConfig(sandboxEnv);
    expect(cfg.mcpEndpoint).toBe("https://mcp.sandbox.paypal.com/http");
    expect(cfg.oauthEndpoint).toBe("https://api-m.sandbox.paypal.com/v1/oauth2/token");
    expect(cfg.requireWriteApproval).toBe(true);
  });

  it("rejects production unless explicitly enabled", () => {
    expect(() => loadConfig({ ...sandboxEnv, PAYPAL_ENVIRONMENT: "PRODUCTION" })).toThrow(/disabled/i);
  });
});

describe("OAuth token provider", () => {
  it("caches short-lived bearer tokens instead of minting one per tool call", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      access_token: "token-value",
      expires_in: 3600,
      scope: "payments invoicing"
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const provider = new PayPalTokenProvider(loadConfig(sandboxEnv));
    expect(await provider.getToken()).toBe("token-value");
    expect(await provider.getToken()).toBe("token-value");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(provider.getCachedScopes()).toEqual(["payments", "invoicing"]);
  });
});

describe("approval policy", () => {
  it("allows reads without approval", () => {
    const cfg = loadConfig(sandboxEnv);
    expect(() => assertApproved(cfg, "paypal.order.get", operationTarget({ order_id: "O-1" }))).not.toThrow();
  });

  it("requires approval for writes by default", () => {
    const cfg = loadConfig(sandboxEnv);
    expect(() => assertApproved(cfg, "paypal.order.create", operationTarget({ currency: "USD" }))).toThrow(/Approval required/i);
  });

  it("canonicalizes object key order for stable operation binding", () => {
    expect(operationTarget({ currency: "USD", amount: 25 })).toBe(operationTarget({ amount: 25, currency: "USD" }));
  });

  it("accepts a resource-bound unexpired approval token", () => {
    const cfg = loadConfig(sandboxEnv);
    const target = operationTarget({ order_id: "ORDER123" });
    const expiresAt = Date.now() + 60_000;
    const token = createApprovalToken(cfg.approvalSecret!, "paypal.order.capture", target, expiresAt);
    expect(() => assertApproved(cfg, "paypal.order.capture", target, token, expiresAt)).not.toThrow();
  });

  it("rejects a token reused for another operation target", () => {
    const cfg = loadConfig(sandboxEnv);
    const expiresAt = Date.now() + 60_000;
    const token = createApprovalToken(cfg.approvalSecret!, "paypal.refund.create", operationTarget({ capture_id: "A" }), expiresAt);
    expect(() => assertApproved(cfg, "paypal.refund.create", operationTarget({ capture_id: "B" }), token, expiresAt)).toThrow(/Invalid approval/i);
  });

  it("rejects expired approvals", () => {
    const cfg = loadConfig(sandboxEnv);
    const target = operationTarget({ dispute_id: "PP-R-1" });
    const expiresAt = Date.now() - 1;
    const token = createApprovalToken(cfg.approvalSecret!, "paypal.dispute.accept", target, expiresAt);
    expect(() => assertApproved(cfg, "paypal.dispute.accept", target, token, expiresAt)).toThrow(/expired/i);
  });
});

describe("upstream MCP security", () => {
  it("uses a fixed official-tool allowlist", () => {
    expect(ALLOWED_UPSTREAM_TOOLS.has("get_order")).toBe(true);
    expect(ALLOWED_UPSTREAM_TOOLS.has("execute_any_api_request")).toBe(false);
    expect(ALLOWED_UPSTREAM_TOOLS.size).toBe(14);
  });
});
