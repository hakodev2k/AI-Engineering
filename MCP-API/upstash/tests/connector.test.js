import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, approvalDigest } from "../src/auth/config.js";
import { authorize, TOOL_POLICY } from "../src/tools/policy.js";
import { TOOL_DEFINITIONS } from "../src/tools/definitions.js";
import { UpstashRedisClient, UpstashRedisError } from "../src/client/redis-rest.js";

test("tool registry and policy are synchronized", () => {
  const names = TOOL_DEFINITIONS.map((tool) => tool.name);
  assert.equal(names.length, 15);
  assert.equal(new Set(names).size, names.length);
  assert.deepEqual([...names].sort(), Object.keys(TOOL_POLICY).sort());
});

test("configuration rejects non-Upstash hosts by default", () => {
  assert.throws(() => loadConfig({ UPSTASH_REDIS_REST_URL: "https://example.com", UPSTASH_REDIS_REST_TOKEN: "secret" }), /upstash\.io/);
});

test("configuration accepts Upstash HTTPS origin", () => {
  const config = loadConfig({ UPSTASH_REDIS_REST_URL: "https://kind-fox-12345.upstash.io", UPSTASH_REDIS_REST_TOKEN: "secret" });
  assert.equal(config.baseUrl, "https://kind-fox-12345.upstash.io");
});

test("read tool requires no approval", () => {
  assert.doesNotThrow(() => authorize({ approvalSecret: "", destructiveEnabled: false }, "upstash.key.get", { key: "a" }));
});

test("write approval is bound to exact payload", () => {
  const config = { approvalSecret: "human-secret", destructiveEnabled: false };
  const tool = "upstash.key.set";
  const payload = { key: "a", value: "b", ttlSeconds: 60 };
  const token = approvalDigest(config.approvalSecret, tool, payload);
  assert.doesNotThrow(() => authorize(config, tool, payload, token));
  assert.throws(() => authorize(config, tool, { ...payload, value: "c" }, token), /Invalid approval/);
});

test("destructive delete is disabled by default", () => {
  const config = { approvalSecret: "human-secret", destructiveEnabled: false };
  assert.throws(() => authorize(config, "upstash.key.delete", { keys: ["a"] }, "0".repeat(64)), /disabled/);
});

test("read command uses bearer auth and JSON command body", async () => {
  let observed;
  const fakeFetch = async (url, init) => {
    observed = { url, init };
    return new Response(JSON.stringify({ result: "value" }), { status: 200 });
  };
  const client = new UpstashRedisClient({ baseUrl: "https://test.upstash.io", token: "token", timeoutMs: 1000, maxRetries: 1 }, fakeFetch);
  assert.equal(await client.get("key"), "value");
  assert.equal(observed.init.headers.Authorization, "Bearer token");
  assert.deepEqual(JSON.parse(observed.init.body), ["GET", "key"]);
});

test("safe read retries throttling once", async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ error: "rate limited" }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ result: "PONG" }), { status: 200 });
  };
  const client = new UpstashRedisClient({ baseUrl: "https://test.upstash.io", token: "token", timeoutMs: 1000, maxRetries: 1 }, fakeFetch);
  assert.equal(await client.ping(), "PONG");
  assert.equal(calls, 2);
});

test("write is not blindly retried", async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return new Response(JSON.stringify({ error: "temporary" }), { status: 503 }); };
  const client = new UpstashRedisClient({ baseUrl: "https://test.upstash.io", token: "token", timeoutMs: 1000, maxRetries: 3 }, fakeFetch);
  await assert.rejects(client.set({ key: "a", value: "b" }), UpstashRedisError);
  assert.equal(calls, 1);
});

test("authorization failures are not retried", async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return new Response(JSON.stringify({ error: "WRONGPASS" }), { status: 401 }); };
  const client = new UpstashRedisClient({ baseUrl: "https://test.upstash.io", token: "bad", timeoutMs: 1000, maxRetries: 3 }, fakeFetch);
  await assert.rejects(client.get("a"), (error) => error instanceof UpstashRedisError && error.status === 401);
  assert.equal(calls, 1);
});
