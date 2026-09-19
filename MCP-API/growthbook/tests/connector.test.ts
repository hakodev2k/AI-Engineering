import { describe, expect, it, vi } from "vitest";
import { GrowthBookClient, GrowthBookError } from "../src/client.js";
import { authorize } from "../src/policy.js";
import { pathFor, tools } from "../src/tools.js";
import type { Config } from "../src/config.js";

const config: Config = {
  apiKey: "test-key",
  apiUrl: "https://api.growthbook.io",
  timeoutMs: 1000,
  maxRetries: 1,
  requireWriteApproval: true,
  approvalSecret: "approve-me",
  enableHighRisk: false
};

describe("tool contract", () => {
  it("registers exactly ten scoped tools", () => expect(Object.keys(tools)).toHaveLength(10));
  it("encodes identifiers and never accepts arbitrary paths", () => {
    expect(pathFor("growthbook.feature.get", { featureId: "checkout:v2" }).path).toBe("/api/v2/features/checkout%3Av2");
  });
  it("builds bounded experiment search", () => {
    const r = pathFor("growthbook.experiment.list", { limit: 10, query: "checkout", status: "running" });
    expect(r.path).toContain("limit=10");
    expect(r.path).toContain("q=checkout");
    expect(r.path).toContain("status=running");
  });
});

describe("approval policy", () => {
  it("allows reads without approval", () => expect(() => authorize(config, "READ")).not.toThrow());
  it("denies writes without approval", () => expect(() => authorize(config, "WRITE")).toThrow(/approval/i));
  it("allows approved writes", () => expect(() => authorize(config, "WRITE", "approve-me")).not.toThrow());
  it("keeps high-risk disabled even with approval", () => expect(() => authorize(config, "HIGH_RISK", "approve-me")).toThrow(/disabled/i));
});

describe("client reliability", () => {
  it("maps API errors", async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ message: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } })) as unknown as typeof fetch;
    const client = new GrowthBookClient(config, fetchFn);
    await expect(client.request("GET", "/api/v1/projects")).rejects.toMatchObject({ status: 403, message: "forbidden" });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("retries throttled reads but not writes", async () => {
    const readFetch = vi.fn()
      .mockResolvedValueOnce(new Response("{}", { status: 429, headers: { "retry-after": "0" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ projects: [] }), { status: 200 }));
    const client = new GrowthBookClient(config, readFetch as typeof fetch);
    await expect(client.request("GET", "/api/v1/projects")).resolves.toEqual({ projects: [] });
    expect(readFetch).toHaveBeenCalledTimes(2);

    const writeFetch = vi.fn(async () => new Response("{}", { status: 429 })) as unknown as typeof fetch;
    const writeClient = new GrowthBookClient(config, writeFetch);
    await expect(writeClient.request("POST", "/api/v2/features", {})).rejects.toBeInstanceOf(GrowthBookError);
    expect(writeFetch).toHaveBeenCalledTimes(1);
  });

  it("rejects non-api paths", async () => {
    const client = new GrowthBookClient(config, vi.fn() as unknown as typeof fetch);
    await expect(client.request("GET", "https://evil.example/x")).rejects.toThrow(/\/api\//);
  });
});
