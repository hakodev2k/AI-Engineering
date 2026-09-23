import { describe, expect, it } from "vitest";
import { ApprovalError, requireApproval, validateRemoteUrl } from "../src/security.js";

describe("PDF.co connector security", () => {
  it("allows READ without approval", () => expect(() => requireApproval("READ", undefined)).not.toThrow());
  it("requires WRITE approval by default", () => expect(() => requireApproval("WRITE", false, {})).toThrow(ApprovalError));
  it("allows configurable WRITE execution", () => expect(() => requireApproval("WRITE", false, { PDFCO_REQUIRE_WRITE_APPROVAL: "false" })).not.toThrow());
  it("always requires HIGH_RISK approval", () => expect(() => requireApproval("HIGH_RISK", false, { PDFCO_REQUIRE_WRITE_APPROVAL: "false" })).toThrow(ApprovalError));
  it("disables destructive actions", () => expect(() => requireApproval("DESTRUCTIVE", true)).toThrow(ApprovalError));
  it("rejects HTTP and private URLs", () => {
    expect(() => validateRemoteUrl("http://example.com/a.pdf")).toThrow();
    expect(() => validateRemoteUrl("https://127.0.0.1/a.pdf")).toThrow();
    expect(() => validateRemoteUrl("https://192.168.1.2/a.pdf")).toThrow();
  });
  it("accepts public HTTPS URLs", () => expect(validateRemoteUrl("https://example.com/a.pdf")).toBe("https://example.com/a.pdf"));
});
