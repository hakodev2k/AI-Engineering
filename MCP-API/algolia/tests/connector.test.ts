import { afterEach, describe, expect, it, vi } from "vitest";
import { AlgoliaRestClient } from "../src/rest.js";
import { ApprovalError, requireWriteApproval, safeIndexName } from "../src/security.js";

afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("security", () => {
  it("rejects unsafe index names", () => expect(() => safeIndexName("x/../y")).toThrow());
  it("denies writes by default", () => expect(() => requireWriteApproval(true)).toThrow(ApprovalError));
  it("requires per-call approval", () => { vi.stubEnv("ALGOLIA_WRITE_ENABLED", "true"); expect(() => requireWriteApproval(false)).toThrow(ApprovalError); });
  it("permits enabled approved writes", () => { vi.stubEnv("ALGOLIA_WRITE_ENABLED", "true"); expect(() => requireWriteApproval(true)).not.toThrow(); });
});

describe("REST reliability", () => {
  it("does not retry auth failures", async () => {
    vi.stubEnv("ALGOLIA_APP_ID", "APP123"); vi.stubEnv("ALGOLIA_API_KEY", "secret");
    const f = vi.fn().mockResolvedValue(new Response("denied", { status: 403 }));
    await expect(new AlgoliaRestClient(f as typeof fetch).create("products", { name: "x" })).rejects.toThrow("403");
    expect(f).toHaveBeenCalledTimes(1);
  });
  it("retries throttling and succeeds", async () => {
    vi.stubEnv("ALGOLIA_APP_ID", "APP123"); vi.stubEnv("ALGOLIA_API_KEY", "secret");
    const f = vi.fn().mockResolvedValueOnce(new Response("slow", { status: 429 })).mockResolvedValueOnce(new Response(JSON.stringify({ taskID: 1 }), { status: 200, headers: { "content-type": "application/json" } }));
    await expect(new AlgoliaRestClient(f as typeof fetch).create("products", { name: "x" })).resolves.toEqual({ taskID: 1 });
    expect(f).toHaveBeenCalledTimes(2);
  });
  it("keeps credentials in headers, never body", async () => {
    vi.stubEnv("ALGOLIA_APP_ID", "APP123"); vi.stubEnv("ALGOLIA_API_KEY", "top-secret");
    const f = vi.fn().mockResolvedValue(new Response(JSON.stringify({ taskID: 1 }), { status: 200, headers: { "content-type": "application/json" } }));
    await new AlgoliaRestClient(f as typeof fetch).create("products", { name: "x" });
    const init = f.mock.calls[0][1] as RequestInit;
    expect(String(init.body)).not.toContain("top-secret");
  });
});
