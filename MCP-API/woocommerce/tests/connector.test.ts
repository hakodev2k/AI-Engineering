import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { WooCommerceApiError, WooCommerceClient } from "../src/client.js";
import { assertAllowed } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";

const env = {
  WOOCOMMERCE_BASE_URL:"https://shop.example.com",
  WOOCOMMERCE_CONSUMER_KEY:"ck_test",
  WOOCOMMERCE_CONSUMER_SECRET:"cs_test"
} as NodeJS.ProcessEnv;

test("config requires HTTPS and credentials", () => {
  assert.equal(loadConfig(env).baseUrl, "https://shop.example.com");
  assert.throws(() => loadConfig({ ...env, WOOCOMMERCE_BASE_URL:"http://shop.example.com" }), /HTTPS/);
});

test("registers expected stable tools", () => {
  assert.equal(TOOLS.length, 12);
  assert.ok(TOOL_MAP.has("woocommerce.product.list"));
  assert.ok(TOOL_MAP.has("woocommerce.order.status.update"));
});

test("schemas reject unknown fields and invalid ids", () => {
  assert.throws(() => TOOL_MAP.get("woocommerce.product.get")!.schema.parse({ productId:0 }));
  assert.throws(() => TOOL_MAP.get("woocommerce.product.get")!.schema.parse({ productId:1, url:"https://evil.example" }));
});

test("writes are denied by default and approval is required", () => {
  const cfg = loadConfig(env);
  assert.throws(() => assertAllowed("WRITE", "woocommerce.product.create", { approvalToken:"12345678" }, cfg), /ALLOW_WRITES/);
  const enabled = { ...cfg, allowWrites:true, approvalToken:"approved-token" };
  assert.throws(() => assertAllowed("HIGH_RISK", "woocommerce.order.status.update", { approvalToken:"wrong-token" }, enabled), /approval/);
  assert.doesNotThrow(() => assertAllowed("WRITE", "woocommerce.product.create", { approvalToken:"approved-token" }, enabled));
});

test("client sends basic auth, pagination and returns untrusted marker", async () => {
  let seen = "";
  const fakeFetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    seen = String(input);
    assert.match(String((init?.headers as Record<string,string>).Authorization), /^Basic /);
    return new Response(JSON.stringify([{ id:1 }]), { status:200, headers:{ "content-type":"application/json" } });
  }) as typeof fetch;
  const client = new WooCommerceClient(loadConfig(env), fakeFetch);
  const response = await client.request("GET", "/products", undefined, { page:2, per_page:10 });
  assert.match(seen, /page=2/);
  assert.match(seen, /per_page=10/);
  assert.equal(response.source, "untrusted_provider_data");
});

test("client maps provider errors without retrying non-GET writes", async () => {
  let calls = 0;
  const fakeFetch = (async () => { calls++; return new Response(JSON.stringify({ message:"forbidden" }), { status:403 }); }) as typeof fetch;
  const client = new WooCommerceClient({ ...loadConfig(env), maxRetries:3 }, fakeFetch);
  await assert.rejects(() => client.request("POST", "/products", { name:"x" }), (e:any) => e instanceof WooCommerceApiError && e.status === 403);
  assert.equal(calls, 1);
});

test("GET retries throttling with Retry-After", async () => {
  let calls = 0;
  const fakeFetch = (async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ message:"slow down" }), { status:429, headers:{ "retry-after":"0" } });
    return new Response(JSON.stringify([]), { status:200 });
  }) as typeof fetch;
  const client = new WooCommerceClient({ ...loadConfig(env), maxRetries:1 }, fakeFetch);
  await client.request("GET", "/orders");
  assert.equal(calls, 2);
});
