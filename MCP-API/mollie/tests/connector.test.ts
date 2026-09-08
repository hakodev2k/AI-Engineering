import test from "node:test";
import assert from "node:assert/strict";
import { EnvCredentialProvider } from "../src/auth.js";
import { MollieClient, MollieError } from "../src/client.js";
import { requireApproval } from "../src/policy.js";
import { buildTools } from "../src/tools.js";

test("credential provider requires a token and rejects header injection", async () => {
  await assert.rejects(() => new EnvCredentialProvider({}).getAccessToken(), /required/);
  await assert.rejects(() => new EnvCredentialProvider({ MOLLIE_ACCESS_TOKEN: "abc\nInjected: yes" }).getAccessToken(), /invalid/);
  assert.equal(await new EnvCredentialProvider({ MOLLIE_ACCESS_TOKEN: "test_example" }).getAccessToken(), "test_example");
});

test("approval policy denies unapproved high risk writes", () => {
  assert.throws(() => requireApproval("HIGH_RISK", false, {}), /requires explicit approval/);
  assert.doesNotThrow(() => requireApproval("HIGH_RISK", true, {}));
  assert.throws(() => requireApproval("DESTRUCTIVE", true, {}), /disabled by policy/);
});

test("client sends bearer credential internally and maps provider errors", async () => {
  let authorization = "";
  const fakeFetch: typeof fetch = async (_input, init) => {
    authorization = new Headers(init?.headers).get("authorization") ?? "";
    return new Response(JSON.stringify({ detail: "forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
  };
  const client = new MollieClient(new EnvCredentialProvider({ MOLLIE_ACCESS_TOKEN: "secret" }), "https://api.mollie.com/v2", 1000, 0, fakeFetch);
  await assert.rejects(() => client.request("GET", "/payments"), (e: unknown) => e instanceof MollieError && e.status === 403);
  assert.equal(authorization, "Bearer secret");
});

test("client retries a throttled read and preserves Retry-After semantics", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ detail: "slow down" }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ _embedded: { payments: [] } }), { status: 200 });
  };
  const client = new MollieClient(new EnvCredentialProvider({ MOLLIE_ACCESS_TOKEN: "secret" }), "https://api.mollie.com/v2", 1000, 1, fakeFetch);
  const value = await client.request("GET", "/payments");
  assert.equal(calls, 2);
  assert.deepEqual(value._embedded.payments, []);
});

test("write operations are never retried blindly", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ detail: "server error" }), { status: 503 });
  };
  const client = new MollieClient(new EnvCredentialProvider({ MOLLIE_ACCESS_TOKEN: "secret" }), "https://api.mollie.com/v2", 1000, 5, fakeFetch);
  await assert.rejects(() => client.request("POST", "/payments", { description: "x" }), MollieError);
  assert.equal(calls, 1);
});

test("tool registry contains only explicit scoped operations", () => {
  const fakeClient = { request: async () => ({ ok: true }) } as unknown as MollieClient;
  const tools = buildTools(fakeClient);
  assert.equal(tools.length, 12);
  assert.ok(tools.every(t => t.name.startsWith("mollie.")));
  assert.ok(!tools.some(t => /raw|request|execute_any/.test(t.name)));
});

test("payment validation rejects malformed amounts and IDs", () => {
  const fakeClient = { request: async () => ({ ok: true }) } as unknown as MollieClient;
  const tools = buildTools(fakeClient);
  const paymentGet = tools.find(t => t.name === "mollie.payment.get")!;
  const paymentCreate = tools.find(t => t.name === "mollie.payment.create")!;
  assert.throws(() => paymentGet.schema.parse({ paymentId: "bad" }));
  assert.throws(() => paymentCreate.schema.parse({ amount: { currency: "eur", value: "1" }, description: "x", redirectUrl: "https://example.com", approval: true }));
});

test("high-risk tool requires approval", async () => {
  const fakeClient = { request: async () => ({ ok: true }) } as unknown as MollieClient;
  const tool = buildTools(fakeClient).find(t => t.name === "mollie.refund.create")!;
  assert.throws(() => tool.schema.parse({ paymentId: "tr_123", approval: false }));
  assert.deepEqual(await tool.run({ paymentId: "tr_123", approval: true }), { ok: true });
});
