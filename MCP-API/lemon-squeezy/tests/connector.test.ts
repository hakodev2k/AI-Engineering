import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { assertApproved } from "../src/policy.js";
import { LemonSqueezyClient, LemonSqueezyError } from "../src/client.js";
import { CustomerCreate, SubscriptionUpdate } from "../src/schemas.js";

const base = loadConfig({ LEMONSQUEEZY_API_KEY: "test-key" });

test("configuration requires an API key", () => {
  assert.throws(() => loadConfig({}), /LEMONSQUEEZY_API_KEY/);
  assert.equal(base.baseUrl, "https://api.lemonsqueezy.com/v1");
  assert.equal(base.allowWrite, false);
});

test("permission gates deny writes and high-risk operations by default", () => {
  assert.throws(() => assertApproved(base, "WRITE", true), /WRITE tools are disabled/);
  assert.throws(() => assertApproved(base, "HIGH_RISK", true), /HIGH_RISK tools are disabled/);
  assert.doesNotThrow(() => assertApproved(base, "READ", undefined));
});

test("write approval must be explicit", () => {
  const cfg = { ...base, allowWrite: true, allowHighRisk: true };
  assert.throws(() => assertApproved(cfg, "WRITE", false), /approved=true/);
  assert.throws(() => assertApproved(cfg, "HIGH_RISK", undefined), /approved=true/);
});

test("schemas validate customer and subscription mutations", () => {
  assert.equal(CustomerCreate.parse({ storeId: "12", name: "Ada", email: "ada@example.com", approved: true }).storeId, "12");
  assert.throws(() => CustomerCreate.parse({ storeId: "x", name: "Ada", email: "bad", approved: true }));
  assert.throws(() => SubscriptionUpdate.parse({ id: "1", approved: true }));
  assert.equal(SubscriptionUpdate.parse({ id: "1", cancelled: true, approved: true }).cancelled, true);
});

test("client sends fixed-host authenticated JSON:API reads", async () => {
  let seenUrl = "";
  let seenAuth = "";
  const fakeFetch: typeof fetch = async (input, init) => {
    seenUrl = String(input);
    seenAuth = new Headers(init?.headers).get("authorization") ?? "";
    return new Response(JSON.stringify({ data: [] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new LemonSqueezyClient(base, fakeFetch);
  const result = await client.get("/stores", { "page[number]": 2 });
  assert.deepEqual(result, { data: [] });
  assert.equal(seenUrl, "https://api.lemonsqueezy.com/v1/stores?page%5Bnumber%5D=2");
  assert.equal(seenAuth, "Bearer test-key");
});

test("client maps provider errors without leaking credentials", async () => {
  const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ errors: [{ title: "Unauthorized" }] }), { status: 401 });
  const client = new LemonSqueezyClient(base, fakeFetch);
  await assert.rejects(() => client.get("/stores"), (error: unknown) => {
    assert.ok(error instanceof LemonSqueezyError);
    assert.equal(error.status, 401);
    assert.equal(error.message.includes("test-key"), false);
    return true;
  });
});

test("GET retries are bounded on throttling", async () => {
  let calls = 0;
  const cfg = { ...base, maxRetries: 1 };
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    return calls === 1
      ? new Response(JSON.stringify({ errors: [] }), { status: 429, headers: { "retry-after": "0" } })
      : new Response(JSON.stringify({ data: [{ id: "1" }] }), { status: 200 });
  };
  const client = new LemonSqueezyClient(cfg, fakeFetch);
  await client.get("/stores");
  assert.equal(calls, 2);
});
