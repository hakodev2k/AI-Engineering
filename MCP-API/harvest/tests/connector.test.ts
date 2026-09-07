import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { HarvestApiError, HarvestClient } from "../src/client.js";
import { assertAllowed } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";

const baseConfig = {
  accessToken:"secret-token",
  accountId:"12345",
  userAgent:"Harvest Connector (ops@example.com)",
  timeoutMs:1000,
  maxRetries:0,
  allowWrites:false,
  approvalToken:undefined as string | undefined
};

test("loads safe authentication configuration", () => {
  const config = loadConfig({
    HARVEST_ACCESS_TOKEN:"token",
    HARVEST_ACCOUNT_ID:"123",
    HARVEST_USER_AGENT:"Test App (test@example.com)"
  });
  assert.equal(config.accountId, "123");
  assert.equal(config.allowWrites, false);
  assert.equal(config.maxRetries, 3);
});

test("rejects invalid account id", () => {
  assert.throws(() => loadConfig({ HARVEST_ACCESS_TOKEN:"x", HARVEST_ACCOUNT_ID:"abc", HARVEST_USER_AGENT:"Test (a@b.com)" }), /numeric/);
});

test("registers only provider-scoped allow-listed tools", () => {
  assert.equal(TOOLS.length, 16);
  assert.ok(TOOLS.every(tool => tool.name.startsWith("harvest.")));
  assert.equal(TOOL_MAP.has("harvest.execute_any_api_request"), false);
});

test("strict schemas reject ambiguous or unknown parameters", () => {
  assert.throws(() => TOOL_MAP.get("harvest.client.get")!.schema.parse({ clientId:1, url:"https://evil.test" }));
  assert.throws(() => TOOL_MAP.get("harvest.user.list")!.schema.parse({ page:1, cursor:"abc" }));
  assert.throws(() => TOOL_MAP.get("harvest.report.project_time")!.schema.parse({ from:"2025-01-01", to:"2026-02-01" }));
});

test("writes are denied by default and require explicit approval", () => {
  assert.throws(() => assertAllowed("WRITE", "harvest.time_entry.create", { approvalToken:"approved-token" }, baseConfig), /disabled/);
  const enabled = { ...baseConfig, allowWrites:true, approvalToken:"approved-token" };
  assert.throws(() => assertAllowed("WRITE", "harvest.time_entry.create", { approvalToken:"wrong-token" }, enabled), /approval/);
  assert.doesNotThrow(() => assertAllowed("WRITE", "harvest.time_entry.create", { approvalToken:"approved-token" }, enabled));
});

test("client isolates credentials in headers and maps pagination", async () => {
  let seen: Request | undefined;
  const fakeFetch: typeof fetch = async (input, init) => {
    seen = new Request(input, init);
    return new Response(JSON.stringify({ clients:[], next_page:null }), { status:200, headers:{"content-type":"application/json"} });
  };
  const client = new HarvestClient(baseConfig, fakeFetch);
  await client.request("GET", "/clients", undefined, { per_page:20, page:2 });
  assert.equal(seen!.headers.get("authorization"), "Bearer secret-token");
  assert.equal(seen!.headers.get("harvest-account-id"), "12345");
  assert.match(seen!.url, /per_page=20/);
  assert.match(seen!.url, /page=2/);
});

test("client surfaces provider permission errors without retrying", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ error:"forbidden" }), { status:403 });
  };
  const client = new HarvestClient({ ...baseConfig, maxRetries:3 }, fakeFetch);
  await assert.rejects(() => client.request("GET", "/invoices"), (error: unknown) => error instanceof HarvestApiError && error.status === 403);
  assert.equal(calls, 1);
});

test("client preserves Retry-After on throttling", async () => {
  const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ error:"throttled" }), { status:429, headers:{"Retry-After":"7"} });
  const client = new HarvestClient(baseConfig, fakeFetch);
  await assert.rejects(() => client.request("GET", "/users"), (error: unknown) => error instanceof HarvestApiError && error.status === 429 && error.retryAfter === "7");
});

test("write operations are never blindly retried", async () => {
  let calls = 0;
  const fakeFetch: typeof fetch = async () => { calls++; return new Response("temporary", { status:503 }); };
  const client = new HarvestClient({ ...baseConfig, maxRetries:5 }, fakeFetch);
  await assert.rejects(() => client.request("POST", "/time_entries", { project_id:1 }));
  assert.equal(calls, 1);
});

test("request timeout aborts a stalled provider call", async () => {
  const fakeFetch: typeof fetch = async (_input, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once:true });
  });
  const client = new HarvestClient({ ...baseConfig, timeoutMs:10 }, fakeFetch);
  await assert.rejects(() => client.request("GET", "/users/me"), /timed out/);
});
