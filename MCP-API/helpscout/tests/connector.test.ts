import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { HelpScoutTokenProvider } from "../src/auth.js";
import { HelpScoutClient } from "../src/client.js";
import { approvalFingerprint, assertAllowed } from "../src/policy.js";
import { TOOL_MAP, TOOLS } from "../src/tools.js";

const staticEnv = {
  HELPSCOUT_ACCESS_TOKEN: "test-token",
  HELPSCOUT_API_BASE: "https://api.helpscout.net",
  HELPSCOUT_MAX_RETRIES: "1"
} as NodeJS.ProcessEnv;

test("configuration accepts static access token with safe defaults", () => {
  const config = loadConfig(staticEnv);
  assert.equal(config.requireWriteApproval, true);
  assert.equal(config.allowDestructive, false);
  assert.equal(config.apiBase, "https://api.helpscout.net");
});

test("configuration rejects non-Help Scout API hosts", () => {
  assert.throws(() => loadConfig({ ...staticEnv, HELPSCOUT_API_BASE: "https://example.com" }), /api\.helpscout\.net/);
});

test("configuration requires complete client credentials", () => {
  assert.throws(() => loadConfig({ HELPSCOUT_APP_ID: "id" }), /configured together/);
});

test("client-credentials token is cached", async () => {
  const config = loadConfig({ HELPSCOUT_APP_ID: "app", HELPSCOUT_APP_SECRET: "secret" });
  let calls = 0;
  const fakeFetch: typeof fetch = async (_input, init) => {
    calls += 1;
    assert.equal(init?.method, "POST");
    assert.match(String(init?.body), /grant_type=client_credentials/);
    return new Response(JSON.stringify({ token_type: "bearer", access_token: "oauth-token", expires_in: 172800 }), { status: 200 });
  };
  const provider = new HelpScoutTokenProvider(config, fakeFetch);
  assert.equal(await provider.getToken(), "oauth-token");
  assert.equal(await provider.getToken(), "oauth-token");
  assert.equal(calls, 1);
});

test("GET retries 429 and preserves rate-limit metadata", async () => {
  const config = loadConfig(staticEnv);
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    if (calls === 1) return new Response("rate limited", { status: 429, headers: { "x-ratelimit-retry-after": "0" } });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "x-ratelimit-limit-minute": "200", "x-ratelimit-remaining-minute": "199" } });
  };
  const client = new HelpScoutClient(config, new HelpScoutTokenProvider(config, fakeFetch), fakeFetch);
  const response = await client.request("GET", "/v2/mailboxes");
  assert.equal(calls, 2);
  assert.deepEqual(response.data, { ok: true });
  assert.equal(response.meta.rateLimit, "200");
  assert.equal(response.meta.rateRemaining, "199");
});

test("write operations are not blindly retried", async () => {
  const config = loadConfig(staticEnv);
  let calls = 0;
  const fakeFetch: typeof fetch = async () => {
    calls += 1;
    return new Response("failure", { status: 500 });
  };
  const client = new HelpScoutClient(config, new HelpScoutTokenProvider(config, fakeFetch), fakeFetch);
  await assert.rejects(() => client.request("POST", "/v2/conversations/1/notes", { text: "note" }));
  assert.equal(calls, 1);
});

test("high-risk send requires exact approval fingerprint", () => {
  const args = { conversationId: 42, customerId: 7, text: "reply" };
  const fingerprint = approvalFingerprint("helpscout.conversation.reply.send", args);
  assert.equal(fingerprint, "helpscout.conversation.reply.send:42");
  assert.throws(() => assertAllowed("HIGH_RISK", "helpscout.conversation.reply.send", args, { requireWriteApproval: true, allowDestructive: false, approvedActions: new Set() }), /Human approval required/);
  assert.doesNotThrow(() => assertAllowed("HIGH_RISK", "helpscout.conversation.reply.send", args, { requireWriteApproval: true, allowDestructive: false, approvedActions: new Set([fingerprint]) }));
});

test("write approval can be disabled without affecting high-risk approval", () => {
  assert.doesNotThrow(() => assertAllowed("WRITE", "helpscout.conversation.note.create", { conversationId: 1 }, { requireWriteApproval: false, allowDestructive: false, approvedActions: new Set() }));
  assert.throws(() => assertAllowed("HIGH_RISK", "helpscout.webhook.create", { url: "https://hooks.example.com/help" }, { requireWriteApproval: false, allowDestructive: false, approvedActions: new Set() }));
});

test("webhook URL validation rejects local/private targets", () => {
  const tool = TOOL_MAP.get("helpscout.webhook.create");
  assert.ok(tool);
  assert.throws(() => tool.schema.parse({ url: "http://localhost/hook", events: ["convo.created"] }));
  assert.throws(() => tool.schema.parse({ url: "https://192.168.1.5/hook", events: ["convo.created"] }));
  assert.doesNotThrow(() => tool.schema.parse({ url: "https://hooks.example.com/help", events: ["convo.created"] }));
});

test("tool surface is bounded, provider scoped, and has risk/output/error metadata", () => {
  assert.ok(TOOLS.length >= 8 && TOOLS.length <= 20);
  for (const tool of TOOLS) {
    assert.match(tool.name, /^helpscout\./);
    assert.ok(tool.output.length > 0);
    assert.ok(tool.errors.length > 0);
  }
});
