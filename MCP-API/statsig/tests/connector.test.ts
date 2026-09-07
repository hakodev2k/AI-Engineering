import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { assertAllowed } from "../src/policy.js";
import { StatsigApiError, StatsigClient } from "../src/client.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";

const baseConfig = { apiKey:"console-test", apiVersion:"20240601", timeoutMs:50, maxRetries:1, allowWrites:false, approvalToken:undefined, mcpUrl:"https://api.statsig.com/v1/mcp" };

test("requires Console API key", () => {
  assert.throws(() => loadConfig({} as NodeJS.ProcessEnv), /STATSIG_CONSOLE_API_KEY/);
});

test("registers expected tool surface", () => {
  assert.equal(TOOLS.length, 12);
  assert.ok(TOOL_MAP.has("statsig.gate.list"));
  assert.ok(TOOL_MAP.has("statsig.dynamic_config.update"));
});

test("strict validation rejects unknown properties", () => {
  assert.throws(() => TOOL_MAP.get("statsig.gate.get")!.schema.parse({ gateId:"g1", arbitrary:true }));
});

test("write is denied by default and approval is enforced", () => {
  assert.throws(() => assertAllowed("WRITE", "statsig.gate.create", { approvalToken:"abcdefgh" }, baseConfig), /disabled/);
  const cfg = { ...baseConfig, allowWrites:true, approvalToken:"approved-123" };
  assert.throws(() => assertAllowed("WRITE", "statsig.gate.create", { approvalToken:"wrong-token" }, cfg), /approval/);
  assert.doesNotThrow(() => assertAllowed("WRITE", "statsig.gate.create", { approvalToken:"approved-123" }, cfg));
});

test("client sends key/version and pagination", async () => {
  let seenUrl = "";
  let seenHeaders: HeadersInit | undefined;
  const fakeFetch: typeof fetch = async (input, init) => {
    seenUrl = String(input); seenHeaders = init?.headers;
    return new Response(JSON.stringify({ data:[] }), { status:200, headers:{"content-type":"application/json"} });
  };
  const client = new StatsigClient(baseConfig, fakeFetch);
  await client.request("GET", "/console/v1/gates", undefined, { limit:10, page:2 });
  assert.match(seenUrl, /limit=10/); assert.match(seenUrl, /page=2/);
  assert.equal((seenHeaders as Record<string,string>)["STATSIG-API-KEY"], "console-test");
  assert.equal((seenHeaders as Record<string,string>)["STATSIG-API-VERSION"], "20240601");
});

test("client maps API failures", async () => {
  const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ message:"bad key" }), { status:401 });
  const client = new StatsigClient(baseConfig, fakeFetch);
  await assert.rejects(() => client.request("GET", "/console/v1/gates"), (error: unknown) => error instanceof StatsigApiError && error.status === 401);
});

test("GET retries throttling with retry-after", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ message:"slow" }), { status:429, headers:{"retry-after":"0"} });
    return new Response(JSON.stringify({ data:[] }), { status:200 });
  };
  const client = new StatsigClient(baseConfig, fakeFetch);
  await client.request("GET", "/console/v1/gates");
  assert.equal(calls, 2);
});

test("mutations are not blindly retried", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response(JSON.stringify({ message:"busy" }), { status:500 }); };
  const client = new StatsigClient(baseConfig, fakeFetch);
  await assert.rejects(() => client.request("POST", "/console/v1/gates", { name:"abc" }));
  assert.equal(calls, 1);
});
