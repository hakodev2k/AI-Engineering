import test from "node:test";
import assert from "node:assert/strict";
import { PandaDocClient, PandaDocError } from "../src/client.js";
import { requireApproval } from "../src/policy.js";
import type { Config } from "../src/config.js";
import { TOOL_SPECS } from "../src/tools.js";

const config: Config = {
  apiKey: "test-key",
  baseUrl: "https://api.pandadoc.com/public/v1",
  timeoutMs: 1000,
  maxRetries: 1,
  allowWrites: true,
  allowHighRisk: true
};

test("registers meaningful scoped tools without destructive operations", () => {
  assert.equal(TOOL_SPECS.length, 11);
  assert.ok(TOOL_SPECS.every(t => t.name.startsWith("pandadoc.")));
  assert.ok(!TOOL_SPECS.some(t => t.risk === "DESTRUCTIVE"));
});

test("WRITE and HIGH_RISK operations require the correct approval", () => {
  assert.throws(() => requireApproval("WRITE", undefined, config));
  assert.doesNotThrow(() => requireApproval("WRITE", "approved", config));
  assert.throws(() => requireApproval("HIGH_RISK", "approved", config));
  assert.doesNotThrow(() => requireApproval("HIGH_RISK", "approved-high-risk", config));
});

test("credentials remain in connector auth header and are not placed in URL", async () => {
  let observedUrl = "";
  let observedAuthorization = "";
  const fakeFetch: typeof fetch = async (input, init) => {
    observedUrl = String(input);
    observedAuthorization = new Headers(init?.headers).get("Authorization") ?? "";
    return new Response(JSON.stringify({ results: [] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new PandaDocClient(config, fakeFetch);
  await client.request("/documents", { query: { count: 10, page: 1 } });
  assert.equal(observedAuthorization, "API-Key test-key");
  assert.equal(observedUrl.includes("test-key"), false);
});

test("429 preserves error information when retry budget is exhausted", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({ detail: "Too many requests" }), { status: 429, headers: { "retry-after": "0" } });
  };
  const client = new PandaDocClient(config, fakeFetch);
  await assert.rejects(() => client.request("/documents"), (error: unknown) => {
    assert.ok(error instanceof PandaDocError);
    assert.equal(error.status, 429);
    return true;
  });
  assert.equal(calls, 2);
});

test("non-idempotent POST requests are not retried", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({ detail: "temporary" }), { status: 503 });
  };
  const client = new PandaDocClient(config, fakeFetch);
  await assert.rejects(() => client.request("/documents", { method: "POST", body: {}, retryable: false }));
  assert.equal(calls, 1);
});
