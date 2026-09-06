import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { StoryblokClient } from "../src/client.js";
import { assertAllowed, fingerprint } from "../src/policy.js";
import { TOOLS } from "../src/tools.js";

const env = { STORYBLOK_TOKEN:"secret", STORYBLOK_SPACE_ID:"123", STORYBLOK_REGION:"eu", STORYBLOK_MAX_RETRIES:"1" } as NodeJS.ProcessEnv;

test("config selects official regional endpoint", () => {
  const c = loadConfig(env);
  assert.equal(c.baseUrl, "https://mapi.storyblok.com/v1");
  assert.equal(c.requireWriteApproval, true);
});

test("invalid space id is rejected", () => assert.throws(() => loadConfig({ ...env, STORYBLOK_SPACE_ID:"x" }), /Invalid/));

test("write and publish require exact approval", () => {
  const args = { storyId:"42" };
  const fp = fingerprint("storyblok.story.publish", args);
  assert.throws(() => assertAllowed("HIGH_RISK", "storyblok.story.publish", args, { requireWriteApproval:true, allowDestructive:false, approvedActions:new Set() }), /Human approval/);
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "storyblok.story.publish", args, { requireWriteApproval:true, allowDestructive:false, approvedActions:new Set([fp]) }));
});

test("delete is disabled by default", () => assert.throws(() => assertAllowed("DESTRUCTIVE", "storyblok.story.delete", {storyId:"42"}, { requireWriteApproval:true, allowDestructive:false, approvedActions:new Set(["storyblok.story.delete:42"]) }), /disabled/));

test("GET retries 429 and preserves pagination metadata", async () => {
  const c = loadConfig(env); let calls = 0; let auth = "";
  const fake = async (_url:any, init:any) => { calls++; auth = init.headers.Authorization; return calls === 1 ? new Response("busy", {status:429,headers:{"retry-after":"0"}}) : new Response('{"stories":[]}', {status:200,headers:{total:"0","per-page":"25"}}); };
  const r = await new StoryblokClient(c, fake as any).request("GET", "/spaces/123/stories");
  assert.equal(calls, 2); assert.equal(auth, "secret"); assert.equal(r.meta.perPage, "25");
});

test("writes are not automatically retried", async () => {
  const c = loadConfig(env); let calls = 0;
  const fake = async () => { calls++; return new Response("failed", {status:500}); };
  await assert.rejects(() => new StoryblokClient(c, fake as any).request("POST", "/spaces/123/stories", {}));
  assert.equal(calls, 1);
});

test("tool surface is bounded and provider scoped", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  TOOLS.forEach(t => assert.match(t.name, /^storyblok\./));
});
