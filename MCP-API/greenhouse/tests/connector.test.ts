import test from "node:test";
import assert from "node:assert/strict";
import { GreenhouseTokenProvider } from "../src/auth.js";
import { GreenhouseClient } from "../src/client.js";
import { loadConfig } from "../src/config.js";
import { assertAllowed, fingerprint } from "../src/policy.js";
import { TOOLS } from "../src/tools.js";

const env = {
  GREENHOUSE_CLIENT_ID: "client",
  GREENHOUSE_CLIENT_SECRET: "secret",
  GREENHOUSE_API_BASE_URL: "https://harvest.greenhouse.io",
  GREENHOUSE_AUTH_BASE_URL: "https://auth.greenhouse.io",
  GREENHOUSE_MAX_RETRIES: "1"
} as NodeJS.ProcessEnv;

test("secure config defaults", () => {
  const c = loadConfig(env);
  assert.equal(c.requireWriteApproval, true);
  assert.equal(c.apiBaseUrl, "https://harvest.greenhouse.io");
});

test("rejects non-official hosts", () => {
  assert.throws(() => loadConfig({ ...env, GREENHOUSE_API_BASE_URL: "https://evil.example" }), /harvest\.greenhouse\.io/);
});

test("high-risk application creation needs exact human approval", () => {
  const args = { candidateId: 42, jobId: 77 };
  const fp = fingerprint("greenhouse.application.create", args);
  assert.throws(() => assertAllowed("HIGH_RISK", "greenhouse.application.create", args, { requireWriteApproval: true, approvedActions: new Set() }), /Human approval required/);
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "greenhouse.application.create", args, { requireWriteApproval: true, approvedActions: new Set([fp]) }));
});

test("client credentials remain in token transport", async () => {
  const c = loadConfig(env);
  let auth = ""; let body = "";
  const f = async (_url: URL | RequestInfo, init?: RequestInit) => {
    auth = String((init?.headers as Record<string,string>).Authorization ?? "");
    body = String(init?.body ?? "");
    return new Response(JSON.stringify({ access_token: "token", expires_in: 300 }), { status: 200 });
  };
  const p = new GreenhouseTokenProvider(c, f as typeof fetch);
  assert.equal(await p.getToken(), "token");
  assert.match(auth, /^Basic /);
  assert.match(body, /grant_type=client_credentials/);
});

test("GET retries 429 and preserves next cursor/rate headers", async () => {
  const c = loadConfig(env); let calls = 0;
  const tokens = { getToken: async () => "t", invalidate: () => {} } as GreenhouseTokenProvider;
  const f = async () => {
    calls++;
    if (calls === 1) return new Response("busy", { status: 429, headers: { "retry-after": "0" } });
    return new Response("[]", { status: 200, headers: { link: '<https://harvest.greenhouse.io/v3/jobs?cursor=abc>; rel="next"', "x-ratelimit-remaining": "7" } });
  };
  const out = await new GreenhouseClient(c, tokens, f as typeof fetch).request("GET", "/v3/jobs");
  assert.equal(calls, 2);
  assert.equal(out.meta.nextCursor, "abc");
  assert.equal(out.meta.rateLimitRemaining, "7");
});

test("writes are never blindly retried", async () => {
  const c = loadConfig(env); let calls = 0;
  const tokens = { getToken: async () => "t", invalidate: () => {} } as GreenhouseTokenProvider;
  const f = async () => { calls++; return new Response("failure", { status: 500 }); };
  await assert.rejects(() => new GreenhouseClient(c, tokens, f as typeof fetch).request("POST", "/v3/candidates", {}));
  assert.equal(calls, 1);
});

test("bounded provider-scoped tool surface", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  TOOLS.forEach(tool => assert.match(tool.name, /^greenhouse\./));
  assert.equal(TOOLS.some(tool => /reject|hire|score|rank/.test(tool.name)), false);
});
