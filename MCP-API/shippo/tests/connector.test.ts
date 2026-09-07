import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { ShippoClient } from "../src/client.js";
import { buildTools } from "../src/tools.js";
import { ApprovalRequiredError } from "../src/security.js";

const env = { SHIPPO_API_TOKEN: "test-token", SHIPPO_APPROVAL_MODE: "writes" } as NodeJS.ProcessEnv;
const config = loadConfig(env);

test("auth configuration requires a token and HTTPS", () => {
  assert.throws(() => loadConfig({}), /SHIPPO_API_TOKEN/);
  assert.throws(() => loadConfig({ SHIPPO_API_TOKEN: "x", SHIPPO_API_BASE_URL: "http://example.com" }), /HTTPS/);
});

test("registers meaningful scoped tools", () => {
  const client = new ShippoClient(config, async () => new Response("{}") as any);
  const names = buildTools(client, config).map(t => t.name);
  assert.equal(names.length, 16);
  assert.ok(names.includes("shippo.shipment.create"));
  assert.ok(names.includes("shippo.label.purchase"));
  assert.ok(names.includes("shippo.refund.request"));
});

test("read operation authenticates without exposing token in result", async () => {
  let auth = "";
  const fetcher: typeof fetch = async (_input, init) => {
    auth = new Headers(init?.headers).get("authorization") ?? "";
    return new Response(JSON.stringify({ object_id: "shp_1" }), { status: 200 });
  };
  const tools = buildTools(new ShippoClient(config, fetcher), config);
  const result = await tools.find(t => t.name === "shippo.shipment.get")!.handler({ shipmentId: "shp_1" });
  assert.equal(auth, "ShippoToken test-token");
  assert.deepEqual(result, { object_id: "shp_1" });
});

test("write requires approval in default policy", async () => {
  const tools = buildTools(new ShippoClient(config, async () => new Response("{}") as any), config);
  await assert.rejects(() => tools.find(t => t.name === "shippo.parcel.create")!.handler({ parcel: { length: "1", width: "1", height: "1", distance_unit: "in", weight: "1", mass_unit: "lb" } }), ApprovalRequiredError);
});

test("label purchase always requires explicit approval", async () => {
  const permissive = loadConfig({ SHIPPO_API_TOKEN: "x", SHIPPO_APPROVAL_MODE: "none" });
  const tools = buildTools(new ShippoClient(permissive, async () => new Response("{}") as any), permissive);
  await assert.rejects(() => tools.find(t => t.name === "shippo.label.purchase")!.handler({ rateId: "rate_1" }), ApprovalRequiredError);
});

test("refund is disabled unless destructive actions are enabled", async () => {
  const tools = buildTools(new ShippoClient(config, async () => new Response("{}") as any), config);
  await assert.rejects(() => tools.find(t => t.name === "shippo.refund.request")!.handler({ transactionId: "txn_1", approved: true }), /disabled/);
});

test("GET retries a 429 and honors eventual success", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async () => {
    calls++;
    return calls === 1 ? new Response(JSON.stringify({ detail: "rate limited" }), { status: 429, headers: { "retry-after": "0" } }) : new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const result = await new ShippoClient(config, fetcher).request<{ok:boolean}>("GET", "/shipments/shp_1/");
  assert.equal(calls, 2);
  assert.equal(result.ok, true);
});

test("validation rejects unsafe object ids", async () => {
  const tools = buildTools(new ShippoClient(config, async () => new Response("{}") as any), config);
  await assert.rejects(() => tools.find(t => t.name === "shippo.shipment.get")!.handler({ shipmentId: "../secret" }), /invalid characters/);
});
