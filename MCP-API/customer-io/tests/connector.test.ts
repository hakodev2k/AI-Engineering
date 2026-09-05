import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { CustomerIoClient } from "../src/client.js";
import { assertAllowed, fingerprint } from "../src/policy.js";
import { TOOLS } from "../src/tools.js";

const env = { CUSTOMERIO_APP_API_KEY: "secret", CUSTOMERIO_REGION: "eu", CUSTOMERIO_MAX_RETRIES: "1" } as NodeJS.ProcessEnv;

test("region selects official EU API and MCP endpoints", () => {
  const c = loadConfig(env);
  assert.equal(c.baseUrl, "https://api-eu.customer.io");
  assert.equal(c.officialMcpUrl, "https://mcp-eu.customer.io/mcp");
  assert.equal(c.requireWriteApproval, true);
});

test("write approval is connector-side and exact", () => {
  const args = { name: "VIP" };
  const key = fingerprint("customerio.segment.create_manual", args);
  assert.throws(() => assertAllowed("WRITE", "customerio.segment.create_manual", args, { requireWriteApproval: true, allowDestructive: false, approvedActions: new Set() }), /approval/);
  assert.doesNotThrow(() => assertAllowed("WRITE", "customerio.segment.create_manual", args, { requireWriteApproval: true, allowDestructive: false, approvedActions: new Set([key]) }));
});

test("external email is high risk", () => {
  const args = { to: "a@example.com", transactionalMessageId: 44 };
  assert.throws(() => assertAllowed("HIGH_RISK", "customerio.transactional.email.send", args, { requireWriteApproval: false, allowDestructive: false, approvedActions: new Set() }), /approval/);
});

test("destructive operation disabled even if fingerprint is approved", () => {
  const args = { webhookId: 7 };
  assert.throws(() => assertAllowed("DESTRUCTIVE", "customerio.reporting_webhook.delete", args, { requireWriteApproval: true, allowDestructive: false, approvedActions: new Set(["customerio.reporting_webhook.delete:7"]) }), /disabled/);
});

test("GET retries 429 and does not leak key into URL", async () => {
  const c = loadConfig(env);
  let calls = 0;
  let seenUrl = "";
  let auth = "";
  const fake = async (url: any, init: any) => {
    calls++;
    seenUrl = String(url);
    auth = init.headers.Authorization;
    return calls === 1 ? new Response("busy", { status: 429, headers: { "retry-after": "0" } }) : new Response("{}", { status: 200 });
  };
  await new CustomerIoClient(c, fake as any).request("GET", "/v1/segments");
  assert.equal(calls, 2);
  assert.equal(auth, "Bearer secret");
  assert.equal(seenUrl.includes("secret"), false);
});

test("write requests are not blindly retried", async () => {
  const c = loadConfig(env);
  let calls = 0;
  const fake = async () => { calls++; return new Response("failure", { status: 500 }); };
  await assert.rejects(() => new CustomerIoClient(c, fake as any).request("POST", "/v1/segments", {}));
  assert.equal(calls, 1);
});

test("strict schemas reject unsafe webhook URL and unknown keys", () => {
  const webhook = TOOLS.find(t => t.name === "customerio.reporting_webhook.create")!;
  assert.throws(() => webhook.schema.parse({ name: "x", endpoint: "http://example.com", events: ["email_sent"] }));
  const segment = TOOLS.find(t => t.name === "customerio.segment.get")!;
  assert.throws(() => segment.schema.parse({ segmentId: 1, surprise: true }));
});

test("tool surface is provider scoped and bounded", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  for (const tool of TOOLS) assert.match(tool.name, /^customerio\./);
});
