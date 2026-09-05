import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { PlausibleClient } from "../src/client.js";
import { approvalFingerprint, assertAllowed } from "../src/policy.js";
import { TOOLS } from "../src/tools.js";

const env = {
  PLAUSIBLE_STATS_API_KEY:"stats",
  PLAUSIBLE_SITES_API_KEY:"sites",
  PLAUSIBLE_BASE_URL:"https://plausible.io",
  PLAUSIBLE_ALLOWED_SITES:"example.com",
  PLAUSIBLE_MAX_RETRIES:"1"
} as NodeJS.ProcessEnv;

test("configuration defaults to safe approvals", () => {
  const c = loadConfig(env);
  assert.equal(c.requireWriteApproval, true);
  assert.equal(c.allowDestructive, false);
  assert.ok(c.allowedSites.has("example.com"));
});

test("custom host requires explicit opt-in", () => {
  assert.throws(() => loadConfig({ ...env, PLAUSIBLE_BASE_URL:"https://analytics.internal.example" }), /Custom Plausible hosts/);
  assert.doesNotThrow(() => loadConfig({ ...env, PLAUSIBLE_BASE_URL:"https://analytics.internal.example", PLAUSIBLE_ALLOW_CUSTOM_BASE_URL:"true" }));
});

test("high risk requires exact approval", () => {
  const args = { domain:"example.com", name:"Signup" };
  const fp = approvalFingerprint("plausible.event.track", args);
  assert.throws(() => assertAllowed("HIGH_RISK", "plausible.event.track", args, { requireWriteApproval:true, allowDestructive:false, approvedActions:new Set() }));
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "plausible.event.track", args, { requireWriteApproval:true, allowDestructive:false, approvedActions:new Set([fp]) }));
});

test("destructive operations are disabled by default", () => {
  assert.throws(() => assertAllowed("DESTRUCTIVE", "plausible.site.delete", { siteId:"example.com" }, { requireWriteApproval:true, allowDestructive:false, approvedActions:new Set(["plausible.site.delete:example.com"]) }), /disabled/);
});

test("stats query retries 429 and isolates stats key", async () => {
  const c = loadConfig(env); let calls = 0; let auth = "";
  const fake = async (_u: any, init: any) => { calls++; auth = init.headers.Authorization; return calls === 1 ? new Response("busy", { status:429, headers:{"retry-after":"0"} }) : new Response("{}", { status:200 }); };
  await new PlausibleClient(c, fake as any).request("POST", "/api/v2/query", "stats", { site_id:"example.com", metrics:["visitors"], date_range:"7d" });
  assert.equal(calls, 2); assert.equal(auth, "Bearer stats");
});

test("writes are not blindly retried", async () => {
  const c = loadConfig(env); let calls = 0;
  const fake = async () => { calls++; return new Response("fail", { status:500 }); };
  await assert.rejects(() => new PlausibleClient(c, fake as any).request("POST", "/api/v1/sites", "sites", { domain:"x", timezone:"UTC" }));
  assert.equal(calls, 1);
});

test("tool surface is provider-scoped and meaningful", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  for (const t of TOOLS) assert.match(t.name, /^plausible\./);
});
