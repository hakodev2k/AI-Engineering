import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { CockroachCloudClient, CockroachCloudError } from "../src/client.js";
import { createApproval, enforcePolicy, TOOL_RISK } from "../src/policy.js";
import { buildServer } from "../src/server.js";

const baseEnv = {
  COCKROACH_CLOUD_API_KEY: "test-secret-key",
  COCKROACH_CLOUD_API_BASE_URL: "https://cockroachlabs.cloud/api/v1",
  COCKROACH_CLOUD_TIMEOUT_MS: "1000",
  COCKROACH_CLOUD_MAX_RETRIES: "1",
  COCKROACH_CLOUD_ALLOW_DESTRUCTIVE: "false"
};

describe("configuration", () => {
  it("requires credentials", () => {
    expect(() => loadConfig({})).toThrow();
  });

  it("rejects credential-forwarding to arbitrary hosts", () => {
    expect(() => loadConfig({ ...baseEnv, COCKROACH_CLOUD_API_BASE_URL: "https://evil.example/api/v1" })).toThrow(/official/);
  });

  it("bounds retries", () => {
    expect(() => loadConfig({ ...baseEnv, COCKROACH_CLOUD_MAX_RETRIES: "99" })).toThrow(/range/);
  });
});

describe("permission policy", () => {
  it("classifies all exposed operations", () => {
    expect(Object.keys(TOOL_RISK)).toHaveLength(9);
    expect(TOOL_RISK["cockroachdb_cloud.cluster.delete"]).toBe("DESTRUCTIVE");
  });

  it("allows reads without approval", () => {
    const config = loadConfig(baseEnv);
    expect(() => enforcePolicy("cockroachdb_cloud.cluster.list", {}, config)).not.toThrow();
  });

  it("denies destructive operations by default", () => {
    const config = loadConfig(baseEnv);
    expect(() => enforcePolicy("cockroachdb_cloud.cluster.delete", { clusterId: "x", confirmClusterId: "x", approvalId: "0".repeat(64) }, config)).toThrow(/disabled/);
  });

  it("binds approval to the exact destructive payload", () => {
    const config = loadConfig({ ...baseEnv, COCKROACH_CLOUD_ALLOW_DESTRUCTIVE: "true", COCKROACH_CLOUD_APPROVAL_SECRET: "0123456789abcdef0123456789abcdef" });
    const original = { clusterId: "11111111-1111-4111-8111-111111111111", confirmClusterId: "11111111-1111-4111-8111-111111111111" };
    const approvalId = createApproval(config.approvalSecret!, "cockroachdb_cloud.cluster.delete", original);
    expect(() => enforcePolicy("cockroachdb_cloud.cluster.delete", { ...original, approvalId }, config)).not.toThrow();
    expect(() => enforcePolicy("cockroachdb_cloud.cluster.delete", { ...original, clusterId: "22222222-2222-4222-8222-222222222222", approvalId }, config)).toThrow(/Approval/);
  });
});

describe("REST client", () => {
  it("keeps the API key in the Authorization header and returns provider data", async () => {
    const fetchMock = vi.fn(async (_url: URL | RequestInfo, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer test-secret-key");
      return new Response(JSON.stringify({ clusters: [] }), { status: 200, headers: { "content-type": "application/json" } });
    });
    const client = new CockroachCloudClient(loadConfig(baseEnv), fetchMock as typeof fetch, async () => {});
    await expect(client.request("GET", "/clusters")).resolves.toEqual({ clusters: [] });
  });

  it("retries one throttled read and honors retryability", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "rate limited" }), { status: 429, headers: { "retry-after": "0" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ clusters: [] }), { status: 200 }));
    const client = new CockroachCloudClient(loadConfig(baseEnv), fetchMock as typeof fetch, async () => {});
    await client.request("GET", "/clusters");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("never retries destructive DELETE", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ message: "temporary" }), { status: 503 }));
    const client = new CockroachCloudClient(loadConfig(baseEnv), fetchMock as typeof fetch, async () => {});
    await expect(client.request("DELETE", "/clusters/11111111-1111-4111-8111-111111111111", { retryable: false })).rejects.toBeInstanceOf(CockroachCloudError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("MCP server", () => {
  it("constructs without live credentials or provider calls", () => {
    const config = loadConfig(baseEnv);
    expect(buildServer(config, {} as CockroachCloudClient)).toBeDefined();
  });
});
