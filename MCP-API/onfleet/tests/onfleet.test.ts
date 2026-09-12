import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { requireApproval } from "../src/policy.js";
import { OnfleetClient, OnfleetError } from "../src/client.js";
import { TOOL_NAMES } from "../src/tools.js";

const baseConfig = { apiKey: "test-key", baseUrl: "https://onfleet.com/api/v2", timeoutMs: 1000, maxRetries: 1, allowWrites: false, allowHighRisk: false };

test("requires API key", () => {
  const previous = process.env.ONFLEET_API_KEY;
  delete process.env.ONFLEET_API_KEY;
  assert.throws(() => loadConfig(), /ONFLEET_API_KEY/);
  if (previous !== undefined) process.env.ONFLEET_API_KEY = previous;
});

test("tool names are unique and provider scoped", () => {
  assert.equal(new Set(TOOL_NAMES).size, TOOL_NAMES.length);
  assert.ok(TOOL_NAMES.every((name) => name.startsWith("onfleet.")));
  assert.equal(TOOL_NAMES.length, 13);
});

test("write approval is denied by default", () => {
  assert.throws(() => requireApproval("WRITE", "approved", baseConfig), /disabled/);
});

test("write requires explicit approval when enabled", () => {
  const config = { ...baseConfig, allowWrites: true };
  assert.throws(() => requireApproval("WRITE", undefined, config), /approval/);
  assert.doesNotThrow(() => requireApproval("WRITE", "approved", config));
});

test("destructive requires high-risk switch and token", () => {
  const config = { ...baseConfig, allowWrites: true, allowHighRisk: true };
  assert.throws(() => requireApproval("DESTRUCTIVE", "approved", config), /approved-high-risk/);
  assert.doesNotThrow(() => requireApproval("DESTRUCTIVE", "approved-high-risk", config));
});

test("client uses Basic API-key auth and maps errors", async () => {
  let auth = "";
  const fakeFetch: typeof fetch = async (_input, init) => {
    auth = new Headers(init?.headers).get("authorization") ?? "";
    return new Response(JSON.stringify({ code: "InvalidContent" }), { status: 400, headers: { "content-type": "application/json" } });
  };
  const client = new OnfleetClient(baseConfig, fakeFetch);
  await assert.rejects(() => client.request("GET", "/tasks"), (error: unknown) => error instanceof OnfleetError && error.status === 400);
  assert.equal(auth, `Basic ${Buffer.from("test-key:").toString("base64")}`);
});

test("client retries a throttled GET once", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ error: "rate limited" }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ tasks: [] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new OnfleetClient({ ...baseConfig, maxRetries: 1 }, fakeFetch);
  const value = await client.request("GET", "/tasks");
  assert.deepEqual(value, { tasks: [] });
  assert.equal(calls, 2);
});

test("non-idempotent POST is not retried", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response("busy", { status: 503 }); };
  const client = new OnfleetClient({ ...baseConfig, maxRetries: 3 }, fakeFetch);
  await assert.rejects(() => client.request("POST", "/tasks", { body: {}, retryable: false }), OnfleetError);
  assert.equal(calls, 1);
});
