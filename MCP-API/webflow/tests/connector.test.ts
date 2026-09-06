import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { assertAllowed } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";
import { WebflowClient } from "../src/client.js";

const cfg = loadConfig({
  WEBFLOW_ACCESS_TOKEN: "test-token",
  WEBFLOW_PERMISSIONS: "write",
  WEBFLOW_REQUIRE_WRITE_APPROVAL: "true",
  WEBFLOW_ALLOW_DESTRUCTIVE: "false",
  WEBFLOW_TIMEOUT_MS: "1000",
  WEBFLOW_MAX_RETRIES: "1"
});

test("registers the intended provider-scoped tools", () => {
  assert.equal(TOOLS.length, 14);
  assert.ok(TOOL_MAP.has("webflow.collection.list"));
  assert.ok(TOOL_MAP.has("webflow.site.publish"));
  assert.equal(new Set(TOOLS.map(t => t.name)).size, TOOLS.length);
});

test("rejects missing authentication configuration", () => {
  assert.throws(() => loadConfig({}), /WEBFLOW_ACCESS_TOKEN/);
});

test("validates Webflow object IDs strictly", () => {
  const schema = TOOL_MAP.get("webflow.site.get")!.schema;
  assert.throws(() => schema.parse({ siteId: "not-an-object-id" }));
  assert.equal(schema.parse({ siteId: "0123456789abcdef01234567" }).siteId, "0123456789abcdef01234567");
});

test("write operations require configured approval", () => {
  assert.throws(() => assertAllowed("WRITE", "webflow.item.update", {}, cfg), /approval=true/);
  assert.doesNotThrow(() => assertAllowed("WRITE", "webflow.item.update", { approval: true }, cfg));
});

test("publish always requires explicit approval", () => {
  assert.throws(() => assertAllowed("HIGH_RISK", "webflow.site.publish", {}, cfg), /explicit human approval/);
});

test("destructive operations are disabled by default", () => {
  assert.throws(() => assertAllowed("DESTRUCTIVE", "webflow.item.delete", { approval: true }, cfg), /disabled/);
});

test("read client request sends bearer token and parses JSON", async () => {
  const calls: any[] = [];
  const fakeFetch: typeof fetch = async (input, init) => {
    calls.push({ input: String(input), init });
    return new Response(JSON.stringify({ sites: [{ id: "0123456789abcdef01234567" }] }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new WebflowClient(cfg, fakeFetch);
  const out: any = await client.request("GET", "/sites", undefined, { limit: 10, offset: 0 });
  assert.equal(out.sites.length, 1);
  assert.match(calls[0].input, /limit=10/);
  assert.equal((calls[0].init.headers as Record<string, string>).Authorization, "Bearer test-token");
});

test("GET retries once after 429 and honors retry-after", async () => {
  let count = 0;
  const retryCfg = { ...cfg, maxRetries: 1 };
  const fakeFetch: typeof fetch = async () => {
    count += 1;
    if (count === 1) return new Response(JSON.stringify({ message: "Too Many Requests" }), { status: 429, headers: { "retry-after": "0" } });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const client = new WebflowClient(retryCfg, fakeFetch);
  const out: any = await client.request("GET", "/sites");
  assert.equal(out.ok, true);
  assert.equal(count, 2);
});

test("POST is not retried after provider failure", async () => {
  let count = 0;
  const fakeFetch: typeof fetch = async () => {
    count += 1;
    return new Response(JSON.stringify({ message: "temporary" }), { status: 500, headers: { "content-type": "application/json" } });
  };
  const client = new WebflowClient(cfg, fakeFetch);
  await assert.rejects(() => client.request("POST", "/sites/0123456789abcdef01234567/publish", { publishToWebflowSubdomain: true }));
  assert.equal(count, 1);
});
