import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { BasecampClient } from "../src/client.js";
import { assertAllowed, fingerprint } from "../src/policy.js";
import { TOOLS } from "../src/tools.js";

const env = {
  BASECAMP_ACCESS_TOKEN: "token",
  BASECAMP_ACCOUNT_ID: "123",
  BASECAMP_USER_AGENT: "TestConnector (test@example.com)",
  BASECAMP_MAX_RETRIES: "1"
} as NodeJS.ProcessEnv;

test("config enforces numeric account id", () => assert.throws(() => loadConfig({ ...env, BASECAMP_ACCOUNT_ID: "abc" })));
test("config requires user agent", () => assert.throws(() => loadConfig({ ...env, BASECAMP_USER_AGENT: "" })));
test("read allowed without approval", () => assert.doesNotThrow(() => assertAllowed("READ", "basecamp.project.list", {}, { requireWriteApproval: true, approvedActions: new Set() })));
test("write requires exact approval by default", () => {
  const a = { todolistId: "1", content: "Ship" };
  const fp = fingerprint("basecamp.todo.create", a);
  assert.throws(() => assertAllowed("WRITE", "basecamp.todo.create", a, { requireWriteApproval: true, approvedActions: new Set() }));
  assert.doesNotThrow(() => assertAllowed("WRITE", "basecamp.todo.create", a, { requireWriteApproval: true, approvedActions: new Set([fp]) }));
});
test("high risk requires approval even when writes auto-approved", () => assert.throws(() => assertAllowed("HIGH_RISK", "basecamp.message.publish", { messageId: "7" }, { requireWriteApproval: false, approvedActions: new Set() })));
test("GET retries 429 and preserves Basecamp headers", async () => {
  const c = loadConfig(env); let calls = 0; let auth = ""; let ua = "";
  const f = async (_url: any, init: any) => { calls++; auth = init.headers.Authorization; ua = init.headers["User-Agent"]; return calls === 1 ? new Response("busy", { status: 429, headers: { "retry-after": "0" } }) : new Response("[]", { status: 200, headers: { "x-total-count": "0" } }); };
  const res = await new BasecampClient(c, f as any).request("GET", "/projects.json");
  assert.equal(calls, 2); assert.equal(auth, "Bearer token"); assert.match(ua, /TestConnector/); assert.equal(res.meta.totalCount, 0);
});
test("write does not retry", async () => {
  const c = loadConfig(env); let calls = 0;
  const f = async () => { calls++; return new Response("fail", { status: 500 }); };
  await assert.rejects(() => new BasecampClient(c, f as any).request("POST", "/todolists/1/todos.json", { content: "x" }));
  assert.equal(calls, 1);
});
test("rejects off-origin absolute URL", async () => {
  const c = loadConfig(env);
  await assert.rejects(() => new BasecampClient(c, (async () => new Response("{}")) as any).request("GET", "https://evil.example/x"), /Refusing/);
});
test("tool surface is provider-scoped and bounded", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  for (const t of TOOLS) assert.match(t.name, /^basecamp\./);
});
