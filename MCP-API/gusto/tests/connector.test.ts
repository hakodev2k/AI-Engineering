import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { EnvCredentialProvider, type CredentialProvider } from "../src/auth.js";
import { GustoApiError, GustoClient } from "../src/client.js";
import { approvalFingerprint, assertAllowed } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";

const env = {
  GUSTO_ACCESS_TOKEN: "access-token",
  GUSTO_BASE_URL: "https://api.gusto-demo.com",
  GUSTO_API_VERSION: "2026-06-15",
  GUSTO_MAX_RETRIES: "1"
} as NodeJS.ProcessEnv;

class FakeCredentials implements CredentialProvider {
  refreshes = 0;
  async getAccessToken() { return this.refreshes ? "fresh" : "stale"; }
  async refresh() { this.refreshes += 1; return "fresh"; }
}

test("configuration uses safe defaults", () => {
  const config = loadConfig(env);
  assert.equal(config.apiVersion, "2026-06-15");
  assert.equal(config.requireWriteApproval, true);
});

test("configuration rejects non-Gusto API hosts", () => {
  assert.throws(() => loadConfig({ ...env, GUSTO_BASE_URL: "https://evil.example" }), /official Gusto API host/);
});

test("partial refresh configuration is rejected", () => {
  assert.throws(() => loadConfig({ ...env, GUSTO_REFRESH_TOKEN: "r" }), /requires GUSTO_REFRESH_TOKEN/);
});

test("tool registry is provider scoped and meaningful", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  for (const tool of TOOLS) assert.match(tool.name, /^gusto\./);
  assert.equal(TOOL_MAP.get("gusto.payroll.prepare")?.risk, "HIGH_RISK");
});

test("schemas reject malformed UUIDs and unknown fields", () => {
  assert.throws(() => TOOL_MAP.get("gusto.employee.get")!.schema.parse({ employeeId: "bad" }));
  assert.throws(() => TOOL_MAP.get("gusto.company.get")!.schema.parse({ companyId: "2d931510-d99f-494a-8c67-87feb05e1594", extra: true }));
});

test("high risk actions require exact human approval fingerprint", () => {
  const args = { employeeId: "2d931510-d99f-494a-8c67-87feb05e1594", version: "v1", firstName: "Ada" };
  const fingerprint = approvalFingerprint("gusto.employee.update", args);
  assert.throws(() => assertAllowed("HIGH_RISK", "gusto.employee.update", args, { requireWriteApproval: true, approvedActions: new Set() }), /Human approval required/);
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "gusto.employee.update", args, { requireWriteApproval: true, approvedActions: new Set([fingerprint]) }));
});

test("GET retries a 429 and preserves rate metadata", async () => {
  const config = loadConfig(env);
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls === 1) return new Response("busy", { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "x-ratelimit-remaining": "199" } });
  };
  const client = new GustoClient(config, new FakeCredentials(), fetchImpl as typeof fetch);
  const response = await client.request("GET", "/v1/companies/x") as { meta: { rateLimitRemaining: string | null } };
  assert.equal(calls, 2);
  assert.equal(response.meta.rateLimitRemaining, "199");
});

test("write requests are not retried after a 5xx", async () => {
  const config = loadConfig(env);
  let calls = 0;
  const fetchImpl = async () => { calls += 1; return new Response("failure", { status: 500 }); };
  const client = new GustoClient(config, new FakeCredentials(), fetchImpl as typeof fetch);
  await assert.rejects(() => client.request("POST", "/v1/companies/x/employees", { body: {} }), GustoApiError);
  assert.equal(calls, 1);
});

test("401 performs one credential refresh then retries", async () => {
  const config = loadConfig(env);
  const credentials = new FakeCredentials();
  let calls = 0;
  const fetchImpl = async (_url: URL | RequestInfo, init?: RequestInit) => {
    calls += 1;
    const authorization = (init?.headers as Record<string, string>).Authorization;
    if (authorization === "Bearer stale") return new Response("unauthorized", { status: 401 });
    return new Response("{}", { status: 200 });
  };
  const client = new GustoClient(config, credentials, fetchImpl as typeof fetch);
  await client.request("GET", "/v1/companies/x");
  assert.equal(credentials.refreshes, 1);
  assert.equal(calls, 2);
});

test("refresh provider rotates tokens in memory without exposing secrets", async () => {
  const config = loadConfig({ ...env, GUSTO_REFRESH_TOKEN: "refresh-1", GUSTO_CLIENT_ID: "client", GUSTO_CLIENT_SECRET: "secret" });
  const fetchImpl = async () => new Response(JSON.stringify({ access_token: "access-2", refresh_token: "refresh-2" }), { status: 200, headers: { "content-type": "application/json" } });
  const provider = new EnvCredentialProvider(config, fetchImpl as typeof fetch);
  assert.equal(await provider.refresh(), "access-2");
  assert.equal(await provider.getAccessToken(), "access-2");
});
