import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, approvalDigest } from "../src/config.js";
import { assertAuthorized, TOOL_POLICY } from "../src/policy.js";
import { MeilisearchClient, MeilisearchError } from "../src/client.js";
import { TOOL_DEFINITIONS } from "../src/tools.js";

function withEnv(values, fn) {
  const old = {};
  for (const [k, v] of Object.entries(values)) {
    old[k] = process.env[k];
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
  try { return fn(); }
  finally {
    for (const [k, v] of Object.entries(old)) {
      if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
  }
}

test("tool registry and policy are synchronized", () => {
  const names = TOOL_DEFINITIONS.map((t) => t.name);
  assert.equal(new Set(names).size, names.length);
  assert.deepEqual([...names].sort(), Object.keys(TOOL_POLICY).sort());
  assert.equal(names.length, 17);
});

test("configuration rejects insecure non-local HTTP", () => {
  withEnv({ MEILISEARCH_URL: "http://example.com", MEILISEARCH_API_KEY: "secret", MEILISEARCH_ALLOW_INSECURE_HTTP: "true" },
    () => assert.throws(loadConfig, /HTTPS/));
});

test("configuration allows explicitly opted-in localhost HTTP", () => {
  withEnv({ MEILISEARCH_URL: "http://localhost:7700", MEILISEARCH_API_KEY: "secret", MEILISEARCH_ALLOW_INSECURE_HTTP: "true" },
    () => assert.equal(loadConfig().baseUrl, "http://localhost:7700"));
});

test("write operation requires payload-bound approval", () => {
  const config = { approvalSecret: "approval-secret", enableDestructive: false };
  const tool = "meilisearch.index.create";
  const payload = { uid: "products", primaryKey: "id" };
  assert.throws(() => assertAuthorized(config, tool, payload), /explicit approval/);
  const token = approvalDigest(config.approvalSecret, tool, payload);
  assert.doesNotThrow(() => assertAuthorized(config, tool, payload, token));
  assert.throws(() => assertAuthorized(config, tool, { ...payload, uid: "other" }, token), /Invalid approval/);
});

test("destructive operation is disabled by default", () => {
  const config = { approvalSecret: "approval-secret", enableDestructive: false };
  assert.throws(() => assertAuthorized(config, "meilisearch.index.delete", { uid: "x" }, "x"), /disabled/);
});

test("client adds bearer auth and parses read response", async () => {
  let captured;
  const fakeFetch = async (url, init) => {
    captured = { url: String(url), init };
    return new Response(JSON.stringify({ status: "available" }), { status: 200 });
  };
  const client = new MeilisearchClient({ baseUrl: "https://search.example.com", apiKey: "abc", timeoutMs: 1000, maxRetries: 0 }, fakeFetch);
  const result = await client.health();
  assert.equal(result.status, "available");
  assert.equal(captured.init.headers.Authorization, "Bearer abc");
});

test("client emits provider error metadata and does not retry auth failures", async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls++;
    return new Response(JSON.stringify({ message: "Invalid API key", code: "invalid_api_key", type: "auth" }), { status: 401 });
  };
  const client = new MeilisearchClient({ baseUrl: "https://search.example.com", apiKey: "bad", timeoutMs: 1000, maxRetries: 3 }, fakeFetch);
  await assert.rejects(client.health(), (e) => e instanceof MeilisearchError && e.status === 401 && e.code === "invalid_api_key");
  assert.equal(calls, 1);
});

test("client retries a rate limit", async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ message: "slow down" }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ results: [] }), { status: 200 });
  };
  const client = new MeilisearchClient({ baseUrl: "https://search.example.com", apiKey: "abc", timeoutMs: 1000, maxRetries: 1 }, fakeFetch);
  const result = await client.listIndexes({ offset: 0, limit: 20 });
  assert.deepEqual(result, { results: [] });
  assert.equal(calls, 2);
});

test("write calls are not blindly retried", async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return new Response(JSON.stringify({ message: "temporary" }), { status: 503 }); };
  const client = new MeilisearchClient({ baseUrl: "https://search.example.com", apiKey: "abc", timeoutMs: 1000, maxRetries: 3 }, fakeFetch);
  await assert.rejects(client.createIndex({ uid: "products" }));
  assert.equal(calls, 1);
});
