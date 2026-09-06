import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { AppwriteRestClient } from "../src/rest.js";
import { assertAllowed, fingerprint } from "../src/policy.js";
import { TOOLS } from "../src/tools.js";

const env = {
  APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1",
  APPWRITE_PROJECT_ID: "project-1",
  APPWRITE_API_KEY: "secret",
  APPWRITE_MAX_RETRIES: "1"
} as NodeJS.ProcessEnv;

test("REST fallback config is accepted and approvals default safe", () => {
  const c = loadConfig(env); assert.equal(c.requireWriteApproval, true); assert.equal(c.allowDestructive, false);
});

test("MCP host is pinned to official Appwrite server", () => {
  assert.throws(() => loadConfig({ ...env, APPWRITE_MCP_URL: "https://evil.example/mcp" }), /mcp.appwrite.io/);
});

test("write and high-risk operations require exact approval", () => {
  const args = { functionId: "fn1" };
  const fp = fingerprint("appwrite.function.execution.create", args);
  const base = { requireWriteApproval: true, allowDestructive: false, approvedActions: new Set<string>() };
  assert.throws(() => assertAllowed("HIGH_RISK", "appwrite.function.execution.create", args, base), /Human approval/);
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "appwrite.function.execution.create", args, { ...base, approvedActions: new Set([fp]) }));
});

test("destructive operations are disabled independently of approval", () => {
  const args = { userId: "u1" };
  assert.throws(() => assertAllowed("DESTRUCTIVE", "appwrite.user.delete", args, { requireWriteApproval: true, allowDestructive: false, approvedActions: new Set(["appwrite.user.delete:u1"]) }), /disabled/);
});

test("read retry handles 429 and preserves credentials inside transport", async () => {
  const c = loadConfig(env); let calls = 0; let key = "";
  const fake = async (_url: any, init: any) => { calls++; key = init.headers["X-Appwrite-Key"]; return calls === 1 ? new Response("busy", { status: 429, headers: { "retry-after": "0" } }) : new Response("{}", { status: 200 }); };
  await new AppwriteRestClient(c, fake as any).request("GET", "/users");
  assert.equal(calls, 2); assert.equal(key, "secret");
});

test("writes are never automatically retried", async () => {
  const c = loadConfig(env); let calls = 0;
  const fake = async () => { calls++; return new Response("fail", { status: 500 }); };
  await assert.rejects(() => new AppwriteRestClient(c, fake as any).request("POST", "/users", {}));
  assert.equal(calls, 1);
});

test("tool surface is bounded and provider-scoped", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  for (const tool of TOOLS) assert.match(tool.name, /^appwrite\./);
});

test("strict schemas reject ambiguous IDs", () => {
  const t = TOOLS.find(x => x.name === "appwrite.user.get")!;
  assert.throws(() => t.schema.parse({ userId: "../bad" }));
});
