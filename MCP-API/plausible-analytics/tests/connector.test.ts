import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { PlausibleClient, PlausibleError } from "../src/client.js";
import { requireApproval, policies } from "../src/policy.js";

test("auth config requires key and https", () => {
  assert.throws(() => loadConfig({}), /API_KEY/);
  assert.throws(() => loadConfig({ PLAUSIBLE_STATS_API_KEY:"x", PLAUSIBLE_BASE_URL:"http://example.com" }), /https/);
  assert.equal(loadConfig({ PLAUSIBLE_STATS_API_KEY:"x" }).baseUrl, "https://plausible.io");
});

test("policies classify reads and guarded writes", () => {
  assert.equal(policies["plausible.stats.overview"].risk, "READ");
  assert.equal(policies["plausible.event.custom"].risk, "WRITE");
  assert.throws(() => requireApproval("plausible.event.custom", true, false), /disabled/);
  assert.throws(() => requireApproval("plausible.event.custom", false, true), /approval/);
  assert.doesNotThrow(() => requireApproval("plausible.event.custom", true, true));
});

test("stats query adds bearer auth and parses response", async () => {
  let seen = "";
  const fake = async (_url: any, init: any) => { seen = init.headers.Authorization; return new Response(JSON.stringify({results:[{metrics:[1]}]}), {status:200}); };
  const client = new PlausibleClient({statsApiKey:"test-key",baseUrl:"https://plausible.io",timeoutMs:1000,maxRetries:0,allowEventWrites:false}, fake as typeof fetch);
  const result: any = await client.query({site_id:"example.com",metrics:["visitors"],date_range:"7d"});
  assert.equal(seen, "Bearer test-key");
  assert.equal(result.status, 200);
});

test("event request does not send stats API key", async () => {
  let headers: any;
  const fake = async (_url: any, init: any) => { headers = init.headers; return new Response("{}", {status:202, headers:{"x-plausible-dropped":"1"}}); };
  const client = new PlausibleClient({statsApiKey:"test-key",baseUrl:"https://plausible.io",timeoutMs:1000,maxRetries:0,allowEventWrites:true}, fake as typeof fetch);
  const result: any = await client.sendEvent({domain:"example.com",name:"pageview",url:"https://example.com"}, "test-agent", "127.0.0.1");
  assert.equal(headers.Authorization, undefined);
  assert.equal(headers["User-Agent"], "test-agent");
  assert.equal(result.dropped, true);
});

test("429 uses bounded retry", async () => {
  let calls = 0;
  const fake = async () => { calls++; return new Response("{}", {status:429, headers:{"retry-after":"0"}}); };
  const client = new PlausibleClient({statsApiKey:"x",baseUrl:"https://plausible.io",timeoutMs:1000,maxRetries:1,allowEventWrites:false}, fake as typeof fetch);
  await assert.rejects(() => client.query({}), (e:any) => e instanceof PlausibleError && e.status === 429);
  assert.equal(calls, 2);
});
