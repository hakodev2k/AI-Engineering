import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { PushoverClient } from "../src/client.js";
import { executeTool, TOOL_SPECS } from "../src/tools.js";

test("config requires a valid app token and keeps risky operations disabled by default", () => {
  assert.throws(() => loadConfig({}));
  const config = loadConfig({ PUSHOVER_APP_TOKEN: "A".repeat(30) });
  assert.equal(config.allowWrites, false);
  assert.equal(config.allowHighRisk, false);
  assert.equal(config.allowDestructive, false);
});

test("registers meaningful scoped tools", () => {
  assert.equal(TOOL_SPECS.length, 16);
  assert.ok(TOOL_SPECS.some((x) => x.name === "pushover.message.send" && x.risk === "HIGH_RISK"));
  assert.ok(TOOL_SPECS.some((x) => x.name === "pushover.group.user.remove" && x.risk === "DESTRUCTIVE"));
});

test("client isolates credentials and sends validation request", async () => {
  let seenUrl = ""; let seenBody = "";
  const fakeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    seenUrl = String(input); seenBody = String(init?.body ?? "");
    return new Response(JSON.stringify({ status: 1, devices: ["phone"] }), { status: 200 });
  };
  const client = new PushoverClient(loadConfig({ PUSHOVER_APP_TOKEN: "A".repeat(30) }), fakeFetch as typeof fetch);
  await client.validate("B".repeat(30));
  assert.equal(seenUrl, "https://api.pushover.net/1/users/validate.json");
  assert.match(seenBody, /token=A{30}/);
  assert.match(seenBody, /user=B{30}/);
});

test("does not retry a failed write", async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return new Response(JSON.stringify({ status: 0, errors: ["bad request"] }), { status: 500 }); };
  const client = new PushoverClient(loadConfig({ PUSHOVER_APP_TOKEN: "A".repeat(30), PUSHOVER_MAX_RETRIES: "3" }), fakeFetch as typeof fetch);
  await assert.rejects(() => client.send({ user: "B".repeat(30), message: "x" }));
  assert.equal(calls, 1);
});

test("high-risk and destructive tools enforce approval boundaries", async () => {
  const fake: any = { send: async () => ({ status: 1 }), groupAction: async () => ({ status: 1 }) };
  const base = { PUSHOVER_APP_TOKEN: "A".repeat(30), PUSHOVER_ALLOW_WRITES: "true" };
  await assert.rejects(() => executeTool("pushover.message.send", { user: "B".repeat(30), message: "hello", priority: 0, approval: "approved-high-risk" }, fake, loadConfig(base)), /HIGH_RISK/);
  const high = loadConfig({ ...base, PUSHOVER_ALLOW_HIGH_RISK: "true" });
  await executeTool("pushover.message.send", { user: "B".repeat(30), message: "hello", priority: 0, approval: "approved-high-risk" }, fake, high);
  await assert.rejects(() => executeTool("pushover.group.user.remove", { group: "C".repeat(30), user: "B".repeat(30), approval: "approved-destructive" }, fake, high), /DESTRUCTIVE/);
});

test("strict message validation rejects invalid emergency parameters", async () => {
  const fake: any = { send: async () => ({ status: 1 }) };
  const config = loadConfig({ PUSHOVER_APP_TOKEN: "A".repeat(30), PUSHOVER_ALLOW_HIGH_RISK: "true" });
  await assert.rejects(() => executeTool("pushover.message.send", { user: "B".repeat(30), message: "alarm", priority: 2, approval: "approved-high-risk" }, fake, config));
});
