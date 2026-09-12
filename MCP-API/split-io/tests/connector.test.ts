import test from "node:test";
import assert from "node:assert/strict";
import { SplitClient, SplitApiError } from "../src/client.js";
import { requireApproval } from "../src/policy.js";
import type { Config } from "../src/config.js";
import { TOOL_SPECS } from "../src/tools.js";

const config: Config = {
  apiKey: "test-secret",
  authMode: "bearer",
  baseUrl: "https://api.split.io",
  timeoutMs: 50,
  maxRetries: 1,
  allowWrites: false,
  allowHighRisk: false
};

test("registers exactly eight scoped tools", () => {
  assert.equal(TOOL_SPECS.length, 8);
  assert.ok(TOOL_SPECS.every(t => t.name.startsWith("split.")));
});

test("write approval is denied by default", () => {
  assert.throws(() => requireApproval("WRITE", "approved", config), /disabled/);
});

test("high-risk approval requires both configuration and token", () => {
  const enabled = { ...config, allowHighRisk: true };
  assert.throws(() => requireApproval("HIGH_RISK", "approved", enabled), /high-risk approval/);
  assert.doesNotThrow(() => requireApproval("HIGH_RISK", "approved-high-risk", enabled));
});

test("client isolates bearer credential and parses successful response", async () => {
  let seenAuth = "";
  const fakeFetch: typeof fetch = async (_input, init) => {
    seenAuth = new Headers(init?.headers).get("Authorization") ?? "";
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  const client = new SplitClient(config, fakeFetch);
  const result = await client.request<{ ok: boolean }>("GET", "/internal/api/v2/splits/ws/a/");
  assert.deepEqual(result, { ok: true });
  assert.equal(seenAuth, "Bearer test-secret");
});

test("client supports Harness x-api-key without forwarding bearer auth", async () => {
  let headers = new Headers();
  const fakeFetch: typeof fetch = async (_input, init) => {
    headers = new Headers(init?.headers);
    return new Response("{}", { status: 200 });
  };
  const client = new SplitClient({ ...config, authMode: "x-api-key" }, fakeFetch);
  await client.request("GET", "/x");
  assert.equal(headers.get("x-api-key"), "test-secret");
  assert.equal(headers.get("Authorization"), null);
});

test("non-retryable authentication failure maps to SplitApiError", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response("unauthorized", { status: 401 });
  };
  const client = new SplitClient(config, fakeFetch);
  await assert.rejects(() => client.request("GET", "/x"), (error: unknown) => error instanceof SplitApiError && error.status === 401);
  assert.equal(calls, 1);
});

test("rate limited GET retries with bounded count", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response("limited", { status: 429, headers: { "X-RateLimit-Reset-Seconds-Org": "0" } });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const client = new SplitClient({ ...config, maxRetries: 1 }, fakeFetch);
  const result = await client.request<{ ok: boolean }>("GET", "/x");
  assert.equal(result.ok, true);
  assert.equal(calls, 2);
});

test("write requests are never blindly retried", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response("server error", { status: 500 });
  };
  const client = new SplitClient({ ...config, maxRetries: 3 }, fakeFetch);
  await assert.rejects(() => client.request("POST", "/x", { a: 1 }), SplitApiError);
  assert.equal(calls, 1);
});
