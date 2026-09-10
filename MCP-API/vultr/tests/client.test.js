import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { VultrClient, VultrApiError, redactProviderData } from "../src/client.js";

function makeResponse(status, body, headers = {}) {
  return new Response(body == null ? null : JSON.stringify(body), { status, headers });
}

const config = loadConfig({ VULTR_API_KEY: "unit-test-placeholder", VULTR_MAX_RETRIES: "2", VULTR_TIMEOUT_MS: "5000" });

test("client authenticates only at the provider transport", async () => {
  let seen;
  const client = new VultrClient(config, async (url, init) => {
    seen = { url: String(url), init };
    return makeResponse(200, { instances: [] });
  });
  const out = await client.get("/instances", { query: { per_page: 10 } });
  assert.equal(seen.url, "https://api.vultr.com/v2/instances?per_page=10");
  assert.match(seen.init.headers.Authorization, /^Bearer /);
  assert.deepEqual(out.data, { instances: [] });
  assert.equal(out.untrustedProviderContent, true);
});

test("read retry is bounded for throttling", async () => {
  let calls = 0;
  const client = new VultrClient(config, async () => {
    calls++;
    if (calls < 3) return makeResponse(429, { error: "slow down" }, { "retry-after": "0" });
    return makeResponse(200, { regions: [] }, { "x-ratelimit-limit": "30", "x-ratelimit-remaining": "29" });
  });
  const out = await client.get("/regions");
  assert.equal(calls, 3);
  assert.equal(out.rateLimit.limit, "30");
});

test("mutations are never automatically retried", async () => {
  let calls = 0;
  const client = new VultrClient(config, async () => {
    calls++;
    return makeResponse(503, { error: "temporary" });
  });
  await assert.rejects(() => client.post("/instances/reboot", { instance_ids: ["x"] }), VultrApiError);
  assert.equal(calls, 1);
});

test("authentication errors are not retried", async () => {
  let calls = 0;
  const client = new VultrClient(config, async () => {
    calls++;
    return makeResponse(401, { error: "invalid credential" });
  });
  await assert.rejects(() => client.get("/instances"), /invalid credential/);
  assert.equal(calls, 1);
});

test("unsafe provider paths are rejected before network access", async () => {
  let calls = 0;
  const client = new VultrClient(config, async () => { calls++; return makeResponse(200, {}); });
  await assert.rejects(() => client.get("/../account"), /Unsafe/);
  assert.equal(calls, 0);
});

test("sensitive provider fields are redacted recursively", () => {
  const result = redactProviderData({ id: "1", token: "value", child: { secret: "value", public_key: "ssh-rsa abc" } });
  assert.equal(result.token, "[REDACTED]");
  assert.equal(result.child.secret, "[REDACTED]");
  assert.equal(result.child.public_key, "ssh-rsa abc");
});
